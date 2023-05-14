import mongoose, { Document } from 'mongoose';

export interface IDocument {
  pageContent: string;
  metadata: {
    source: string;
  };
}

export interface IMessage extends Document {
  sender: string;
  content: string;
  chatId: string;
  namespace: string;
  sourceDocs?: IDocument[];
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
    sourceDocs: [
      {
        pageContent: String,
        metadata: {
          source: String,
        },
      },
    ],
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
