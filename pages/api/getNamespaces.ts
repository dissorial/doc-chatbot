import { NextApiRequest, NextApiResponse } from 'next';
import { pinecone } from '@/utils/pinecone-client';

type NamespaceSummary = {
  vectorCount: number;
};

const getNamespaces = async (req: NextApiRequest, res: NextApiResponse) => {
  const targetIndex = process.env.PINECONE_INDEX_NAME ?? '';

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

    console.log('Namespaces:', namespaces);

    res.status(200).json(namespaces);
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ message: 'Failed to get namespaces' });
  }
};

export default getNamespaces;
