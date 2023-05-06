import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/utils/mongoConnection';
import Message from '@/models/Message';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Only accept GET requests
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Connect to the database
    await connectDB();

    const chatId = req.query.chatId as string;

    // Retrieve messages from the database
    const messages = await Message.find({ chatId }).sort({ createdAt: 1 });

    // Send the messages as a response
    res.status(200).json(messages);
  } catch (error: any) {
    console.log('error', error);
    res.status(500).json({ error: error.message || 'Something went wrong' });
  }
}
