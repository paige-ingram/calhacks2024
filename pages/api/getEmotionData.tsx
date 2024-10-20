import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI as string; // Make sure you have the MONGODB_URI in your .env.local file

// Configure the MongoDB client with SSL options
const db = new MongoClient(uri, {
  ssl: true // Ensures SSL is used
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await db.connect();
    const database = db.db('calhacksdb'); // Replace with your database name
    const collection = database.collection('chatHistories'); // Replace with your collection name

    // Fetch all documents or filter as needed
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
      console.log("Here is the emotion data from getEmotionData: " + JSON.stringify(mostRecentChat));
    
    res.status(200).json(mostRecentChat);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: 'Error fetching emotion data.' });
  } finally {
    await db.close(); // Always close the connection
  }
}

export default handler;
