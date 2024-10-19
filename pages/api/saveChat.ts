import { NextApiRequest, NextApiResponse } from 'next';
import { HumeClient } from 'hume';
import fs from 'fs';
import path from 'path';

const apiKey = process.env.NEXT_PUBLIC_HUME_API_KEY as string; // Ensure the API key is of type string

// Handler to fetch chat history and save to a JSON file
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  if (!apiKey) {
    return res.status(500).json({ message: 'Hume API key is missing.' });
  }

  const client = new HumeClient({ apiKey });

  try {
    // Fetch the chat history from Hume API
    const chats = await client.empathicVoice.chats.listChats({
      pageNumber: 0,
      pageSize: 10,
      ascendingOrder: true,
    });

    // Define the path for saving the chat history file
    const filePath = path.join(process.cwd(), 'public', 'chat_history.json');

    // Write chat history to a file (synchronously, for simplicity)
    fs.writeFileSync(filePath, JSON.stringify(chats, null, 2), 'utf-8');

    // Send a success response
    res.status(200).json({ message: 'Chat history saved successfully', chats });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ message: 'Error fetching chat history' });
  }
}
