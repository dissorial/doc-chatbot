// pages/[namespace].tsx
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Home from '..';

const NamespacePage: NextPage = () => {
  const router = useRouter();
  const { namespace } = router.query;

  return <Home initialNamespace={namespace as string} />;
};

export default NamespacePage;
