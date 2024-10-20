import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { chatHistory, timestamp } = req.body;

  if (!chatHistory || !timestamp) {
    return res.status(400).json({ message: 'Missing chat history or timestamp' });
  }

  try {
    const db = await connectToDatabase();
    console.log("Connected to DB");  // Log connection success

    const result = await db.collection('chatHistories').insertOne({
      chatHistory,
      timestamp,
      createdAt: new Date(),
    });

    console.log("Insert result:", result);  // Log the result of the insertion

    return res.status(200).json({ message: 'Chat history saved successfully!', result });
  } catch (error) {
    console.error('Error saving chat history:', error.message);  // Log the actual error
    return res.status(500).json({ message: 'Error saving chat history', error: error.message });
  }
}
