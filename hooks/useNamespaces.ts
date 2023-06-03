import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function useNamespaces() {
  const [namespaces, setNamespaces] = useState<string[]>([]);
  const [selectedNamespace, setSelectedNamespace] = useState<string>('');
  const [isLoadingNamespaces, setIsLoadingNamespaces] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchNamespaces = async () => {
      try {
        const response = await fetch(`/api/getNamespaces`);
        const data = await response.json();

        if (response.ok) {
          setNamespaces(data);
          setIsLoadingNamespaces(false);
          if (data.length > 0) {
            setSelectedNamespace(data[0]); // Set the first namespace from the list as the selected one
          }
        } else {
          console.error(data.error);
        }
      } catch (error: any) {
        console.error(error.message);
      }
    };

    fetchNamespaces();
  }, []);

  useEffect(() => {
    const namespaceFromUrl = router.query.namespace;
    if (typeof namespaceFromUrl === 'string') {
      setSelectedNamespace(namespaceFromUrl);
    }
  }, [router.query.namespace]);

  return {
    namespaces,
    selectedNamespace,
    setSelectedNamespace,
    isLoadingNamespaces,
  };
}
