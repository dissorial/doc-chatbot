import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

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
  const [chatList, setChatList] = useLocalStorage<string[]>(
    `chatList-${namespace}`,
    [],
  );
  const [chatNames, setChatNames] = useLocalStorage<{ [key: string]: string }>(
    `chatNames-${namespace}`,
    {},
  );

  const [selectedChatId, setSelectedChatId] = useState<string>('');

  function updateChatName(chatId: string, newChatName: string) {
    const updatedChatNames = { ...chatNames, [chatId]: newChatName };
    setChatNames(updatedChatNames);
  }

  async function createChat() {
    const newChatId = uuidv4();
    const updatedChatList = [...chatList, newChatId];
    setChatList(updatedChatList);

    try {
      await axios.post('/api/create-chat', {
        chatId: newChatId,
        namespace,
        userEmail,
      });
    } catch (error) {
      console.error('Failed to create new chat:', error);
    }
    return newChatId;
  }

  async function deleteChat(chatIdToDelete: string) {
    const updatedChatList = chatList.filter(
      (chatId) => chatId !== chatIdToDelete,
    );
    setChatList(updatedChatList);

    try {
      await axios.delete(`/api/delete-chat`, {
        data: {
          chatId: chatIdToDelete,
          namespace,
          userEmail,
        },
      });
    } catch (error) {
      console.error('Failed to delete chat:', error);
    }

    if (chatIdToDelete === selectedChatId) {
      const newSelectedChatId =
        updatedChatList.length > 0 ? updatedChatList[0] : '';
      setSelectedChatId(newSelectedChatId);
    }
  }

  return {
    chatList,
    selectedChatId,
    setSelectedChatId,
    createChat,
    deleteChat,
    chatNames,
    updateChatName,
    userEmail,
  };
}
