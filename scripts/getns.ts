import { pinecone } from '@/utils/pinecone-client';

type NamespaceSummary = {
  vectorCount: number;
};

export const run = async () => {
  const targetIndex = process.env.PINECONE_INDEX_NAME ?? '';

  try {
    const index = pinecone.Index(targetIndex);

    const describeIndexStatsQuery = {
      describeIndexStatsRequest: {
        filter: {},
      },
    };

    const res = await index.describeIndexStats(describeIndexStatsQuery);
    const namespaces = Object.keys(
      res.namespaces as { [key: string]: NamespaceSummary },
    );
    console.log('Namespaces:', namespaces);

    console.log('Namespaces:', namespaces);
  } catch (error) {
    console.log('error', error);
    throw new Error('Failed to delete your namespace');
  }
};

(async () => {
  await run();
})();
