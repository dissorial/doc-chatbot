import { useState, useEffect } from 'react';

export default function useNamespaces(userEmail: string | undefined) {
  const [namespaces, setNamespaces] = useState<string[]>([]);
  const [selectedNamespace, setSelectedNamespace] = useState<string>('');

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

  return { namespaces, selectedNamespace, setSelectedNamespace };
}
