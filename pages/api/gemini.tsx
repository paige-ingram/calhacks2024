// BACKEND
import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MongoClient } from 'mongodb';
import { trace, Span } from "@opentelemetry/api";
import { SpanKind } from "@opentelemetry/api";
import { SemanticConventions, OpenInferenceSpanKind } from "@arizeai/openinference-semantic-conventions";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const uri = process.env.MONGODB_URI as string;
const db = new MongoClient(uri);
const tracer = trace.getTracer('chat-tracer');

const readChatHistory = async () => {
  await db.connect();
  const database = db.db('calhacksdb');
  const collection = database.collection('chatHistories');

  const allDocs = await collection.find({}).toArray();
  
  const mostRecentChat = await collection
      .find({})
      .sort({ timestamp: -1 })
      .limit(1)
      .toArray(); 

  if (mostRecentChat.length === 0) {
      console.log("No chat histories found.");
      return [];
  }

  const parseChatLog = (mostRecentChat: any): string[] => {
    const chatHistory = mostRecentChat.chatHistory;
    const simplifiedLog: string[] = chatHistory
      .filter((item: any) => item.type === "assistant_message" || item.type === "user_message")
      .map((item: any) => `${item.type}: ${item.message.content}`);
  
    return simplifiedLog;
  };

  return parseChatLog(mostRecentChat[0]);
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const textData = await readChatHistory();
  console.log("Text data sent to gemini: " + textData);

  // Wrap the API call within a span
  return tracer.startActiveSpan(
    "gemini-chat",
    { kind: SpanKind.CLIENT },
    async (span: Span) => {
      try {
        const prompt = `Generate a summary of this data of my conversations with you yesterday. Pay specific attention to my emotions. Max 5 sentences. Here is the data: ${textData}`;

        // Set attributes for tracing
        span.setAttributes({
          [SemanticConventions.OPENINFERENCE_SPAN_KIND]: OpenInferenceSpanKind.CHAIN,
          [SemanticConventions.INPUT_VALUE]: prompt,  // Ensure this is a string or array of strings
        });

        
        const result = await model.generateContent({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: prompt,
                }
              ],
            }
          ]
        });

        if (result?.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
          const text = result.response.candidates[0].content.parts[0].text;
          console.log("Gemini API result text:", text);

          span.setAttributes({
            attributes: {
                [SemanticConventions.OUTPUT_VALUE]: text.choices[0].message,
            },
        });
        // Be sure to end the span!
        span.end();
        return result;

        } else {
          console.log("Text not found in the API response.");
        }
        

        // Assuming result contains complex data, extract only necessary attributes
        // const outputValue = result?.content?.choices?.[0]?.message?.content || "No output";  // Make sure it's a string
        // const outputValue = "test output";

        // Set output value in the span for tracing
        // span.setAttributes({
        //   [SemanticConventions.INPUT_VALUE]: textData,  // Must be a string, number, or array of these
        // });

        // Close the span
        span.end();

        // Send the result back in the response
        res.status(200).json({ summary: result });
      } catch (error) {
        console.error('Error reading chat history or generating content:', error);
        res.status(500).json({ error: `Failed to generate content. Text data: ${JSON.stringify(textData)}. Model: ${model}` });
        span.end(); // Ensure the span ends even if there is an error
      }
    }
  );
}
