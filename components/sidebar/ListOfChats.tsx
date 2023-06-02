import { PencilIcon, TrashIcon } from '@heroicons/react/20/solid';
import React from 'react';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const ListOfChats = ({
  chatList,
  selectedChatId,
  setChatId,
  setSelectedChatId,
  chatNames,
  updateChatName,
  deleteChat,
}: {
  chatList: string[];
  selectedChatId: string;
  setChatId: (chatId: string) => void;
  setSelectedChatId: (chatId: string) => void;
  chatNames: { [chatId: string]: string };
  updateChatName: (chatId: string, newChatName: string) => void;
  deleteChat: (chatId: string) => void;
}) => {
  const handleChatClick = (chatId: string) => {
    setChatId(chatId);
    setSelectedChatId(chatId);
  };

  const handleEditChatName = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    const newChatName = prompt('Enter a new name for this chat:');
    if (newChatName) {
      updateChatName(chatId, newChatName);
    }
  };

  const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    deleteChat(chatId);
  };

  return (
    <ul role="list" className="-mx-2 space-y-1 mt-2 px-2">
      <div className="text-xs sm:text-sm font-semibold leading-6 text-blue-400">
        Your chats
      </div>
      {chatList.map((chatId, index) => (
        <li
          key={chatId}
          className={classNames(
            chatId === selectedChatId
              ? 'bg-gray-800 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-800',
            'group flex w-full gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold cursor-pointer',
          )}
          onClick={() => handleChatClick(chatId)}
        >
          {chatNames[chatId] || `Chat ${index}`}
          {chatId === selectedChatId && (
            <div className="ml-auto">
              <button
                className="text-gray-300 hover:text-gray-400 ml-2"
                onClick={(e) => handleEditChatName(e, chatId)}
              >
                <PencilIcon className="h-4 w-4" />
              </button>

              <button
                className="text-red-500 hover:text-red-600 ml-2"
                onClick={(e) => handleDeleteChat(e, chatId)}
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default ListOfChats;
