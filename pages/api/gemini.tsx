import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from "@google/generative-ai";
// import fs from 'fs';
// import path from 'path';
import { MongoClient } from 'mongodb';


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const uri = process.env.MONGODB_URI as string;
const db = new MongoClient(uri);

const readChatHistory = async () => {
  await db.connect();
  const database = db.db('calhacksdb');
  const collection = database.collection('chatHistories');

  const allDocs = await collection.find({}).toArray();
  // console.log("Here are all the docs: " + JSON.stringify(allDocs));
  
  // get most recent timestamp
  const mostRecentChat = await collection
      .find({})
      .sort({ timestamp: -1 })  // Sort by timestamp in descending order
      .limit(1)                 // Limit the result to 1 document
      .toArray(); 

  if (mostRecentChat.length === 0) {
      console.log("No chat histories found.");
      return [];
  }

  // console.log("Here are the most recent chats: " + JSON.stringify(mostRecentChat));
  
  // close db when complete
  // await db.close();

  const parseChatLog = (mostRecentChat: any): string[] => {
    // Parse the JSON string to an object

    // maybe should do this instead 
    // const parsedData = JSON.parse(mostRecentChat);
    // const chatHistory = parsedData[0].chatHistory;

    const chatHistory = mostRecentChat.chatHistory;

    // Filter and map to get the type and content of the relevant messages
    const simplifiedLog: string[] = chatHistory
      .filter((item: any) => item.type === "assistant_message" || item.type === "user_message")
      .map((item: any) => `${item.type}: ${item.message.content}`);
  
    console.log("here is the simplified log: " + simplifiedLog);
    return simplifiedLog;

  };

  return parseChatLog(mostRecentChat[0]);
};


// Handler to fetch chat history and generate content
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const textData = await readChatHistory();
  console.log("YAY here is the text data sent to gemini: " + textData);
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
    // console.log(JSON.stringify(result));
    
    // Send the result back in the response
    res.status(200).json({ summary: JSON.stringify(result) });
  } catch (error) {
    console.error('Error reading chat history or generating content:', error);
    res.status(500).json({ error: `Failed to generate content. Text data: ${JSON.stringify(textData)}. Model: ${model}` });
  }
}
