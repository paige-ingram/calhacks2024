import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

// API to save chat history as JSON
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { chatHistory, timestamp } = req.body;

  // Basic validation for required fields
  if (!chatHistory || !timestamp) {
    return res.status(400).json({ message: 'Missing chat history or timestamp' });
  }

  try {
    // Define the path where the file will be saved
    const filePath = path.join(process.cwd(), 'public', 'chat_history', `${timestamp}.json`);

    // Ensure the chat_history directory exists
    const directoryPath = path.join(process.cwd(), 'public', 'chat_history');
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true }); // Create the directory if it doesn't exist
    }

    // Save the chat history to a file
    fs.writeFileSync(filePath, JSON.stringify(chatHistory, null, 2), 'utf-8');

    // Return success response
    return res.status(200).json({ message: 'Chat history saved successfully!' });
  } catch (error) {
    console.error('Error saving chat history:', error);
    return res.status(500).json({ message: 'Error saving chat history', error });
  }
}
