import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/utils/mongoConnection';
import { getSession } from 'next-auth/react';
import Namespace from '@/models/Namespace';

const getNamespaces = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getSession({ req });

    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userEmail = req.query.userEmail as string;

    await connectDB();
    const userNamespaces = await Namespace.find({ userEmail });
    const namespaceNames = userNamespaces.map((namespace) => namespace.name);

    res.status(200).json(namespaceNames);
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ message: 'Failed to get namespaces' });
  }
};

export default getNamespaces;
