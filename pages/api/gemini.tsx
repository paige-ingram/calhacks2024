import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const readChatHistory = () => {
  const filePath = path.join(process.cwd(), 'public/chat_history/2024-10-19T15:05:56.520Z.json'); 
  const jsonData = fs.readFileSync(filePath, 'utf-8');
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
