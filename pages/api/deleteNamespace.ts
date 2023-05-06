import { pinecone } from '@/utils/pinecone-client';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { namespace } = req.query as { namespace: string };
  const targetIndex = process.env.PINECONE_INDEX_NAME ?? '';
  try {
    const index = pinecone.Index(targetIndex);
    await index._delete({
      deleteRequest: {
        namespace,
        deleteAll: true,
      },
    });
    res.status(200).json({ message: 'Namespace deleted successfully.' });
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ error: 'Failed to delete the namespace.' });
  }
}
