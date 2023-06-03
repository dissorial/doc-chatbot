import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { makeChain } from '@/utils/makechain';
import { pinecone } from '@/utils/pinecone-client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const {
    question,
    history,
    chatId,
    selectedNamespace,
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

    const chain = makeChain(
      vectorStore,
      returnSourceDocuments,
      modelTemperature,
    );
    const response = await chain.call({
      question: sanitizedQuestion,
      chat_history: history || [],
    });

    res
      .status(200)
      .json({ text: response.text, sourceDocuments: response.sourceDocuments });
  } catch (error: any) {
    console.log('error', error);
    res.status(500).json({ error: error.message || 'Something went wrong' });
  }
}
