import mongoose, { Document } from 'mongoose';

export interface IChat extends Document {
  chatId: string;
  namespace: string;
  userEmail: string;
}

const ChatSchema = new mongoose.Schema(
  {
    chatId: {
      type: String,
      required: true,
    },
    namespace: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const ChatModel = mongoose.models.Chat
  ? mongoose.model('Chat')
  : mongoose.model<IChat>('Chat', ChatSchema);
