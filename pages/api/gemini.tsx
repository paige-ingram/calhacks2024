import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const readChatHistory = () => {
  const directoryPath = path.join(process.cwd(), 'public/chat_history');
  const files = fs.readdirSync(directoryPath).filter(file => file.endsWith('.json'));
// Sort files by date in descending order to get the most recent file
  files.sort((a, b) => {
    const timeA = new Date(a.split('.json')[0]).getTime();
    const timeB = new Date(b.split('.json')[0]).getTime();
    return timeB - timeA;
  });

  // Path to the most recent file
  const mostRecentFile = path.join(directoryPath, files[0]);

  // Read and parse the most recent file
  const jsonData = fs.readFileSync(mostRecentFile, 'utf-8');
  const chatHistory = JSON.parse(jsonData);

  // Extract role and content from messages
  const messages = chatHistory
    .filter((item: { type: string; }) => item.type === "assistant_message" || item.type === "user_message") // Filter for relevant message types
    .map((item: { message: { role: any; content: any; }; }) => {
      const { role, content } = item.message;
      return `${role}: ${content}`; // Format as "role: content"
    })
    .join('\n'); // Join all messages into a single string with new lines

  return messages;
};


// Handler to fetch chat history and generate content
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const textData = readChatHistory();
  try {
    // Read chat history data
    // const textData = readChatHistory();

    const prompt = `Generate a summary of this data of my conversations with you yesterday. Pay specific attention to my emotions. Max 5 sentences. Here is the data: ${textData}`;
    
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
    console.log(JSON.stringify(result));
    
    // Send the result back in the response
    res.status(200).json({ summary: JSON.stringify(result) });
  } catch (error) {
    console.error('Error reading chat history or generating content:', error);
    res.status(500).json({ error: `Failed to generate content. Text data: ${JSON.stringify(textData)}. Model: ${model}` });
  }
}