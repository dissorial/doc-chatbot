import { useState } from 'react';
import { getItem, setItem } from '@/libs/localStorageKeys';

interface Keys {
  openAIapiKey: string;
  setOpenAIapiKey: (key: string) => void;
  pineconeApiKey: string;
  setPineconeApiKey: (key: string) => void;
  pineconeEnvironment: string;
  setPineconeEnvironment: (key: string) => void;
  pineconeIndexName: string;
  setPineconeIndexName: (key: string) => void;
  handleKeyChange: (storageKey: string, keyValue: string) => void;
  handleSubmitKeys: () => void;
}

const useKeys = (): Keys => {
  const [keys, setKeys] = useState({
    openAIapiKey: getItem('openAIapiKey') || '',
    pineconeApiKey: getItem('pineconeApiKey') || '',
    pineconeEnvironment: getItem('pineconeEnvironment') || '',
    pineconeIndexName: getItem('pineconeIndexName') || '',
  });

  const setKey = (keyName: string, keyValue: string) => {
    setKeys((prev) => ({ ...prev, [keyName]: keyValue }));
  };

  const setOpenAIapiKey = (value: string) => setKey('openAIapiKey', value);
  const setPineconeApiKey = (value: string) => setKey('pineconeApiKey', value);
  const setPineconeEnvironment = (value: string) =>
    setKey('pineconeEnvironment', value);
  const setPineconeIndexName = (value: string) =>
    setKey('pineconeIndexName', value);

  const handleKeyChange = (storageKey: string, keyValue: string) => {
    setItem(storageKey, keyValue);
    setKey(storageKey, keyValue);
  };

  const handleSubmitKeys = () => {
    for (const [storageKey, keyValue] of Object.entries(keys)) {
      handleKeyChange(storageKey, keyValue);
    }
  };

  return {
    ...keys,
    setOpenAIapiKey,
    setPineconeApiKey,
    setPineconeEnvironment,
    setPineconeIndexName,
    handleKeyChange,
    handleSubmitKeys,
  };
};

export default useKeys;
