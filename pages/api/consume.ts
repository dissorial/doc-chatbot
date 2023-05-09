import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { pinecone } from '@/utils/pinecone-client';
import { CustomPDFLoader } from '@/utils/customPDFLoader';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import Namespace from '@/models/Namespace';
import connectDB from '@/utils/mongoConnection';

const filePath = 'docs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { namespaceName, userEmail } = req.query;

  const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME ?? '';

  try {
    await connectDB();

    const newNamespace = new Namespace({
      userEmail: userEmail as string,
      name: namespaceName as string,
    });
    await newNamespace.save();
    const directoryLoader = new DirectoryLoader(filePath, {
      '.pdf': (path) => new CustomPDFLoader(path),
    });

    const rawDocs = await directoryLoader.load();

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docs = await textSplitter.splitDocuments(rawDocs);

    const embeddings = new OpenAIEmbeddings();
    const index = pinecone.Index(PINECONE_INDEX_NAME);

    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: index,
      namespace: namespaceName as string,
      textKey: 'text',
    });

    const pdfFiles = fs
      .readdirSync(filePath)
      .filter((file) => file.endsWith('.pdf'));
    pdfFiles.forEach((file) => {
      fs.unlinkSync(`${filePath}/${file}`);
    });

    res.status(200).json({ message: 'Data ingestion complete' });
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ error: 'Failed to ingest your data' });
  }
}
