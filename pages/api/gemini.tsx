import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { trace, Span } from "@opentelemetry/api";
import { SpanKind } from "@opentelemetry/api";
import { SemanticConventions, OpenInferenceSpanKind } from "@arizeai/openinference-semantic-conventions";
import { MongoClient } from 'mongodb';

// Initialize Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Initialize MongoDB connection
const uri = process.env.MONGODB_URI as string;
const db = new MongoClient(uri);

// Initialize OpenTelemetry tracer
const tracer = trace.getTracer('gemini-tracer');

// Function to read the chat history from the MongoDB database
const readChatHistory = async () => {
  const span = tracer.startSpan('readChatHistory', {
    kind: SpanKind.INTERNAL,
  });
  
  try {
    await db.connect(); // Connect to the database
    const database = db.db('calhacksdb');
    const collection = database.collection('chatHistories');

    // Fetch the most recent chat log based on timestamp
    const mostRecentChat = await collection
      .find({})
      .sort({ timestamp: -1 })  // Sort by the latest timestamp
      .limit(1)                 // Limit the result to 1 document
      .toArray();

    // Check if any chat history exists
    if (mostRecentChat.length === 0) {
      console.log("No chat histories found.");
      span.setAttribute("chatHistory", "No chat histories found.");
      return null;  // Return null when no history is found
    }

    // Parse the chat log
    const parseChatLog = (mostRecentChat: any): string[] => {
      const chatHistory = mostRecentChat.chatHistory;

      // Filter for relevant messages and map to extract the content
      const simplifiedLog: string[] = chatHistory
        .filter((item: any) => item.type === "assistant_message" || item.type === "user_message")
        .map((item: any) => `${item.type}: ${item.message.content}`);
    
      return simplifiedLog;
    };

    // Return parsed chat log
    const result = parseChatLog(mostRecentChat[0]);
    span.setAttribute("chatHistory", result.join(", ")); // Add the parsed log to the trace
    return result;
  } catch (error) {
    console.error('Error reading chat history:', error);
    span.setAttribute("error", error.message);
    throw new Error('Failed to read chat history.');
  } finally {
    span.end(); // End the span here
    await db.close();
  }
};

// API handler to fetch chat history, generate a summary, and generate insights using Gemini API
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const span = tracer.startSpan('gemini-handler', {
    kind: SpanKind.SERVER,
  });

  try {
    const textData = await readChatHistory();
    console.log("Fetched Chat History:", textData);  // Log the data for debugging

    // Fallback when no chat history is found
    if (!textData || textData.length === 0) {
      return res.status(200).json({
        summary: "No conversation data available. Please provide recent conversation history for analysis.",
        insights: "Unable to generate insights without prior conversation history."
      });
    }

    // Create a prompt for user summary generation (summarizing their chat)
    const summaryPrompt = `
      Please provide a concise summary of this conversation for the user. Highlight the main points they communicated, focusing on their emotions, concerns, or goals. Keep the summary informative but concise, and ensure it's easy for the user to understand how the conversation developed. Limit to a maximum of 5 sentences. Here is the conversation data: ${textData}.
    `;

    // Create a prompt for generating actionable insights based on the conversation
    const insightsPrompt = `
      Based on the conversation data provided, identify up to three actionable insights for the user. Focus on areas where the user can improve their emotional well-being, productivity, or address any specific concerns raised in the chat. Provide clear, practical steps that the user can take to improve or act on the insights identified. Here's the conversation data: ${textData}.
    `;

    // Use Promise.all to generate summary and insights in parallel
    const [summaryResult, insightsResult] = await Promise.all([
      model.generateContent({
        contents: [
          {
            role: 'user',
            parts: [
              { text: summaryPrompt }
            ],
          }
        ]
      }),
      model.generateContent({
        contents: [
          {
            role: 'user',
            parts: [
              { text: insightsPrompt }
            ],
          }
        ]
      })
    ]);

    // Safely extract the text content from the response
    const summaryText = summaryResult?.response?.candidates?.[0]?.content?.parts?.[0]?.text || 'Summary could not be generated';
    const insightsText = insightsResult?.response?.candidates?.[0]?.content?.parts?.[0]?.text || 'Insights could not be generated';

    // Trace the output data
    span.setAttributes({
      [SemanticConventions.OUTPUT_VALUE]: `Summary: ${summaryText}, Insights: ${insightsText}`,
    });

    // Format both the summary and insights with headings before sending the response
    const formattedSummary = `<h3>Summary:</h3><p>${summaryText}</p>`;
    const formattedInsights = `<h3>AI-Driven Insights:</h3><p>${insightsText}</p>`;

    // End span before sending the response
    span.end();
    
    // Send both formatted summary and insights in the response
    res.status(200).json({ 
      summary: formattedSummary, 
      insights: formattedInsights 
    });
  } catch (error) {
    span.setAttribute("error", error.message); // Trace the error
    span.end(); // Ensure span ends even on error
    console.error('Error generating content or insights:', error);
    res.status(500).json({ error: `Failed to generate content. Error details: ${error}` });
  }
}
