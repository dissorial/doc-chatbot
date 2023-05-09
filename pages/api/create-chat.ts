import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/utils/mongoConnection';
import mongoose from 'mongoose';

import { ChatModel, IChat } from '@/models/ChatModel';

const ChatModelTyped = ChatModel as mongoose.Model<IChat>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    await connectDB();

    try {
      const { chatId, namespace, userEmail } = req.body;

      const newChat = await ChatModelTyped.create({
        chatId,
        namespace,
        userEmail,
      });

      res.status(201).json(newChat);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create new chat' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
