import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function useNamespaces(userEmail: string | undefined) {
  const [namespaces, setNamespaces] = useState<string[]>([]);
  const [selectedNamespace, setSelectedNamespace] = useState<string>('');

  const router = useRouter();

  useEffect(() => {
    if (userEmail) {
      const fetchNamespaces = async () => {
        try {
          const response = await fetch(
            `/api/getNamespaces?userEmail=${userEmail}`,
          );
          const data = await response.json();

          if (response.ok) {
            setNamespaces(data);
          } else {
            console.error(data.error);
          }
        } catch (error: any) {
          console.error(error.message);
        }
      };

      fetchNamespaces();
    }
  }, [userEmail]);

  useEffect(() => {
    const namespaceFromUrl = router.query.namespace;
    if (typeof namespaceFromUrl === 'string') {
      setSelectedNamespace(namespaceFromUrl);
    }
  }, [router.query.namespace]);

  return { namespaces, selectedNamespace, setSelectedNamespace };
}
