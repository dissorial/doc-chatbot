import { NextApiRequest, NextApiResponse } from 'next';
import { initPinecone } from '@/utils/pinecone-client';

type NamespaceSummary = {
  vectorCount: number;
};

const getNamespaces = async (req: NextApiRequest, res: NextApiResponse) => {
  const pineconeApiKey = req.headers['x-api-key'];
  const targetIndex = req.headers['x-index-name'] as string;
  const pineconeEnvironment = req.headers['x-environment'];

  const pinecone = await initPinecone(
    pineconeApiKey as string,
    pineconeEnvironment as string,
  );

  try {
    const index = pinecone.Index(targetIndex);

    const describeIndexStatsQuery = {
      describeIndexStatsRequest: {
        filter: {},
      },
    };

    const indexStatsResponse = await index.describeIndexStats(
      describeIndexStatsQuery,
    );
    const namespaces = Object.keys(
      indexStatsResponse.namespaces as { [key: string]: NamespaceSummary },
    );

    res.status(200).json(namespaces);
  } catch (error) {
    console.log('Error fetching namespaces', error);
    res.status(500).json({ message: 'Error fetching namespaces' });
  }
};

export default getNamespaces;
