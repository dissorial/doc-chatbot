import { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export function useChats(namespace: string, userEmail: string | undefined) {
  const [chatList, setChatList] = useState<string[]>([]);
  const [chatNames, setChatNames] = useState<{ [key: string]: string }>({});

  const [selectedChatId, setSelectedChatId] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const chatListJSON = localStorage.getItem(`chatList-${namespace}`);
      if (chatListJSON) {
        setChatList(JSON.parse(chatListJSON));
      } else {
        setChatList([]);
      }
    }
  }, [namespace]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const chatNamesJSON = localStorage.getItem(`chatNames-${namespace}`);
      if (chatNamesJSON) {
        setChatNames(JSON.parse(chatNamesJSON));
      } else {
        setChatNames({});
      }
    }
  }, [namespace]);

  function updateChatName(chatId: string, newChatName: string) {
    const updatedChatNames = { ...chatNames, [chatId]: newChatName };
    setChatNames(updatedChatNames);
    localStorage.setItem(
      `chatNames-${namespace}`,
      JSON.stringify(updatedChatNames),
    );
  }

  async function createChat() {
    const newChatId = uuidv4();
    const updatedChatList = [...chatList, newChatId];
    setChatList(updatedChatList);

    localStorage.setItem(
      `chatList-${namespace}`,
      JSON.stringify(updatedChatList),
    );

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
    localStorage.setItem(
      `chatList-${namespace}`,
      JSON.stringify(updatedChatList),
    );

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
