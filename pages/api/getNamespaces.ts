// pages/api/namespaces.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { pinecone } from '@/utils/pinecone-client';

const getNamespaces = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME ?? '');
    const indexStats = await index.describeIndexStats({
      describeIndexStatsRequest: {
        filter: {},
      },
    });
    const namespaces = indexStats.namespaces
      ? Object.keys(indexStats.namespaces)
      : [];
    res.status(200).json(namespaces);
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ message: 'Failed to get namespaces' });
  }
};

export default getNamespaces;
