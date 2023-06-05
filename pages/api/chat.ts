import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { makeChain } from '@/utils/makechain';
import { initPinecone } from '@/utils/pinecone-client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const {
    question,
    history,
    selectedNamespace,
    returnSourceDocuments,
    modelTemperature,
  } = req.body;

  const openAIapiKey = req.headers['x-openai-key'];
  const pineconeApiKey = req.headers['x-pinecone-key'];
  const pineconeEnvironment = req.headers['x-pinecone-environment'];
  const targetIndex = req.headers['x-pinecone-index-name'] as string;

  const pinecone = await initPinecone(
    pineconeApiKey as string,
    pineconeEnvironment as string,
  );

  if (!openAIapiKey) {
    return res.status(500).json({ error: 'OpenAI API key not set' });
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (!question) {
    return res.status(400).json({ message: 'No question in the request' });
  }

  const sanitizedQuestion = question.trim().replaceAll('\n', ' ');
  try {
    const index = pinecone.Index(targetIndex as string);

    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({
        openAIApiKey: openAIapiKey as string,
      }),
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
      openAIapiKey as string,
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
