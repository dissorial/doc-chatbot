import mongoose, { Document } from 'mongoose';

export interface IMessage extends Document {
  sender: string;
  content: string;
  chatId: string;
  namespace: string;
}

const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
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
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

const Message = mongoose.models.Message
  ? mongoose.model<IMessage>('Message')
  : mongoose.model<IMessage>('Message', MessageSchema);

export default Message;
