import { useState, useEffect } from 'react';
import { getItem } from '@/libs/localStorageKeys';

interface Keys {
  openAIapiKey: string;
  setOpenAIapiKey: React.Dispatch<React.SetStateAction<string>>;
  pineconeApiKey: string;
  setPineconeApiKey: React.Dispatch<React.SetStateAction<string>>;
  pineconeEnvironment: string;
  setPineconeEnvironment: React.Dispatch<React.SetStateAction<string>>;
  pineconeIndexName: string;
  setPineconeIndexName: React.Dispatch<React.SetStateAction<string>>;
}

const useApiKeys = (): Keys => {
  const [openAIapiKey, setOpenAIapiKey] = useState<string>('');
  const [pineconeApiKey, setPineconeApiKey] = useState<string>('');
  const [pineconeEnvironment, setPineconeEnvironment] = useState<string>('');
  const [pineconeIndexName, setPineconeIndexName] = useState<string>('');

  useEffect(() => {
    const storedOpenAIKey = getItem('openAIapiKey');
    const storedPineconeKey = getItem('pineconeApiKey');
    const storedPineconeEnvironment = getItem('pineconeEnvironment');
    const storedPineconeIndexName = getItem('pineconeIndexName');

    if (storedOpenAIKey) {
      setOpenAIapiKey(storedOpenAIKey);
    }
    if (storedPineconeKey) {
      setPineconeApiKey(storedPineconeKey);
    }
    if (storedPineconeEnvironment) {
      setPineconeEnvironment(storedPineconeEnvironment);
    }
    if (storedPineconeIndexName) {
      setPineconeIndexName(storedPineconeIndexName);
    }
  }, []);

  return {
    openAIapiKey,
    setOpenAIapiKey,
    pineconeApiKey,
    setPineconeApiKey,
    pineconeEnvironment,
    setPineconeEnvironment,
    pineconeIndexName,
    setPineconeIndexName,
  };
};

export default useApiKeys;
