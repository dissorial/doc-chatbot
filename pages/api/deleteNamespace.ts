import { pinecone } from '@/utils/pinecone-client';
import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/utils/mongoConnection';
import Namespace from '@/models/Namespace';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { namespace, userEmail } = req.query as {
    namespace: string;
    userEmail: string;
  };

  const targetIndex = process.env.PINECONE_INDEX_NAME ?? '';

  try {
    const index = pinecone.Index(targetIndex);
    await index._delete({
      deleteRequest: {
        namespace,
        deleteAll: true,
      },
    });

    await connectDB();
    await Namespace.deleteOne({ name: namespace, userEmail });
    res.status(200).json({ message: 'Namespace deleted successfully.' });
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ error: 'Failed to delete the namespace.' });
  }
}
