import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../utils/mongoConnection';
import { ChatModel, IChat } from '@/models/ChatModel';
import Message from '../../models/Message';
import mongoose from 'mongoose';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    res.status(405).send('Method not allowed');
    return;
  }
  const ChatModelTyped = ChatModel as mongoose.Model<IChat>;

  const chatId = req.body.chatId as string;
  const namespace = req.body.namespace as string;
  const userEmail = req.body.userEmail as string;

  if (!chatId || !namespace) {
    res.status(400).send('Bad request: chatId and namespace are required');
    return;
  }

  try {
    await connectDB();

    await Message.deleteMany({ chatId, namespace, userEmail });
    await ChatModelTyped.deleteOne({ chatId, namespace, userEmail });

    res.status(200).send('Chat and its messages deleted successfully');
  } catch (error) {
    console.error('Error deleting chat:', error);
    res.status(500).send('Internal server error');
  }
}

export default handler;
