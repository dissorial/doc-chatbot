import { ChatMessage } from '@/types/chat';
import { useState, useMemo, useCallback } from 'react';
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

export function useChats(namespace: string) {
  const [allConversations, setAllConversations] = useLocalStorage<{
    [key: string]: { messages: ChatMessage[]; history: [string, string][] };
  }>('allConversations', {});

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

  const [selectedChatId, setSelectedChatId] = useState<string>('');

  const getConversation = useCallback(
    (chatId: string) => {
      return allConversations[chatId] || { messages: [], history: [] };
    },
    [allConversations],
  );

  function updateConversation(
    chatId: string,
    conversation: { messages: ChatMessage[]; history: [string, string][] },
  ) {
    const updatedConversations = {
      ...allConversations,
      [chatId]: conversation,
    };
    setAllConversations(updatedConversations);
  }

  function updateChatName(chatId: string, newChatName: string) {
    const updatedChatNames = { ...chatNames, [chatId]: newChatName };
    setChatNames(updatedChatNames);
  }

  function createChat() {
    const newChatId = uuidv4();
    const updatedAllChats = [...allChats, { namespace, chatId: newChatId }];
    setAllChats(updatedAllChats);

    return newChatId;
  }

  function deleteChat(chatIdToDelete: string) {
    const updatedAllChats = allChats.filter(
      (chat) => chat.chatId !== chatIdToDelete,
    );
    setAllChats(updatedAllChats);

    if (chatIdToDelete === selectedChatId) {
      const newSelectedChatId =
        updatedAllChats.length > 0 ? updatedAllChats[0].chatId : '';
      setSelectedChatId(newSelectedChatId);
    }
  }

  const filteredChatList = chatList.filter(
    (chat) => chat.namespace === namespace,
  );

  return {
    chatList,
    selectedChatId,
    setSelectedChatId,
    createChat,
    deleteChat,
    chatNames,
    updateChatName,
    filteredChatList,
    getConversation,
    updateConversation,
  };
}
