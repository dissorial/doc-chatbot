import React from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/20/solid';

import { classNames } from '@/utils/classNames';

interface Props {
  filteredChatList: string[];
  selectedChatId: string;
  setSelectedChatId: (chatId: string) => void;
  chatNames: { [chatId: string]: string };
  updateChatName: (chatId: string, newChatName: string) => void;
  deleteChat: (chatId: string) => void;
}

const ListOfChats: React.FC<Props> = ({
  filteredChatList,
  selectedChatId,
  setSelectedChatId,
  chatNames,
  updateChatName,
  deleteChat,
}) => {
  const handleChatClick = (chatId: string) => {
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
    <ul role="list" className="-mx-2 mt-2 px-2 pb-6 space-y-1">
      {[...filteredChatList].reverse().map((chatId, index) => (
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
          {chatNames[chatId] || `Chat ${filteredChatList.length - 1 - index}`}
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
