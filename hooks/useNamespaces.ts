import { useState, useEffect } from 'react';

export default function useNamespaces() {
  const [namespaces, setNamespaces] = useState<string[]>([]);
  const [selectedNamespace, setSelectedNamespace] = useState<string>('');

  useEffect(() => {
    fetchNamespaces();
  }, []);

  const fetchNamespaces = async () => {
    try {
      const response = await fetch('/api/getNamespaces');
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

  return { namespaces, selectedNamespace, setSelectedNamespace };
}
