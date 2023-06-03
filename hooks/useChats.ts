import { useState, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';

function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window !== 'undefined') {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    }
    return initialValue;
  });

  const setValue = (value: T) => {
    setStoredValue(value);
    localStorage.setItem(key, JSON.stringify(value));
  };

  return [storedValue, setValue] as const;
}

export function useChats(namespace: string, userEmail: string | undefined) {
  const [allChats, setAllChats] = useLocalStorage<
    { namespace: string; chatId: string }[]
  >('allChats', []);
  const chatList = useMemo(
    () => allChats.filter((chat) => chat.namespace === namespace),
    [allChats, namespace],
  );

  const [chatNames, setChatNames] = useLocalStorage<{ [key: string]: string }>(
    `chatNames-${namespace}`,
    {},
  );

  console.log(chatList, 'chatList');

  const [selectedChatId, setSelectedChatId] = useState<string>('');

  function updateChatName(chatId: string, newChatName: string) {
    const updatedChatNames = { ...chatNames, [chatId]: newChatName };
    setChatNames(updatedChatNames);
  }

  function createChat() {
    const newChatId = uuidv4();
    const updatedChatList = [...chatList, { namespace, chatId: newChatId }];
    setAllChats(updatedChatList);

    return newChatId;
  }

  async function deleteChat(chatIdToDelete: string) {
    const updatedChatList = chatList.filter(
      (chat) => chat.chatId !== chatIdToDelete,
    );
    setAllChats(updatedChatList);

    if (chatIdToDelete === selectedChatId) {
      const newSelectedChatId =
        updatedChatList.length > 0 ? updatedChatList[0].chatId : '';
      setSelectedChatId(newSelectedChatId);
    }
  }

  const filteredChatList = chatList.filter(
    (chat) => chat.namespace === namespace,
  );

  console.log(filteredChatList, 'filteredChatList');

  useEffect(() => {
    console.log('selectedChatId changed:', selectedChatId);
  }, [selectedChatId]);

  return {
    chatList,
    selectedChatId,
    setSelectedChatId,
    createChat,
    deleteChat,
    chatNames,
    updateChatName,
    userEmail,
    filteredChatList,
  };
}
