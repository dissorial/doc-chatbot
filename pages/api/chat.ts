import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { SourceDoc } from '@/types';
import connectDB from '@/utils/mongoConnection';
import { makeChain } from '@/utils/makechain';
import { pinecone } from '@/utils/pinecone-client';
import Message from '@/models/Message';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const {
    question,
    history,
    chatId,
    selectedNamespace,
    userEmail,
    returnSourceDocuments,
    modelTemperature,
  } = req.body;
  const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME ?? '';

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (!question) {
    return res.status(400).json({ message: 'No question in the request' });
  }

  await connectDB();

  const sanitizedQuestion = question.trim().replaceAll('\n', ' ');

  try {
    const index = pinecone.Index(PINECONE_INDEX_NAME);

    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({}),
      {
        pineconeIndex: index,
        textKey: 'text',
        namespace: selectedNamespace,
      },
    );

    const userMessage = new Message({
      sender: 'user',
      content: sanitizedQuestion,
      chatId: chatId,
      namespace: selectedNamespace,
      userEmail: userEmail,
    });

    await userMessage.save();

    const chain = makeChain(
      vectorStore,
      returnSourceDocuments,
      modelTemperature,
    );
    const response = await chain.call({
      question: sanitizedQuestion,
      chat_history: history || [],
    });

    const botMessage = new Message({
      sender: 'bot',
      content: response.text.toString(),
      chatId: chatId,
      namespace: selectedNamespace,
      userEmail: userEmail,
      sourceDocs: response.sourceDocuments
        ? response.sourceDocuments.map((doc: SourceDoc) => ({
            pageContent: doc.pageContent,
            metadata: { source: doc.metadata.source },
          }))
        : [],
    });

    await botMessage.save();

    res
      .status(200)
      .json({ text: response.text, sourceDocuments: response.sourceDocuments });
  } catch (error: any) {
    console.log('error', error);
    res.status(500).json({ error: error.message || 'Something went wrong' });
  }
}
