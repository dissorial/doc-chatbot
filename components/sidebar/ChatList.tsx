import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/solid';

interface ChatListProps {
  chatList: string[];
  chatNames: { [key: string]: string };
  selectedChatId: string;
  setChatId: (id: string) => void;
  setSelectedChatId: (id: string) => void;
  createChat: () => Promise<string>;
  updateChatName: (chatId: string, name: string) => void;
  deleteChat: (chatId: string) => void;
}

const ChatList: React.FC<ChatListProps> = (props) => {
  const {
    chatList,
    chatNames,
    selectedChatId,
    setChatId,
    setSelectedChatId,
    createChat,
    updateChatName,
    deleteChat,
  } = props;

  return (
    <li>
      <div className="border p-2 rounded-md flex gap-2 items-center mb-10 bg-gray-800 hover:bg-gray-700">
        <PlusIcon className="h-6 w-6 text-gray-200" aria-hidden="true" />
        <button
          className="w-full text-left transition-colors text-gray-200"
          onClick={async () => {
            const newChatId = await createChat();
            setChatId(newChatId);
            setSelectedChatId(newChatId);
          }}
        >
          New chat
        </button>
      </div>

      <ul role="list" className="space-y-1">
        <p className="text-md font-semibold text-gray-200 leading-6">
          Your chats
        </p>
        {chatList.map((chatId, index) => (
          <li
            key={chatId}
            className={`my-2 p-2 rounded-lg cursor-pointer pl-4 flex flex-grow text-left transition-colors ${
              chatId === selectedChatId
                ? 'bg-gray-700 text-white'
                : 'bg-none text-gray-200 hover:bg-gray-700'
            }`}
            onClick={() => {
              setChatId(chatId);
              setSelectedChatId(chatId);
            }}
          >
            <p>{chatNames[chatId] || `Chat ${index}`}</p>

            {chatId === selectedChatId && (
              <div className="ml-auto">
                <button
                  className="text-gray-300 hover:text-gray-400 ml-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    const newChatName = prompt(
                      'Enter a new name for this chat:',
                    );
                    if (newChatName) {
                      updateChatName(chatId, newChatName);
                    }
                  }}
                >
                  <PencilIcon className="h-4 w-4" />
                </button>

                <button
                  className="text-red-500 hover:text-red-600 ml-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(chatId);
                  }}
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </li>
  );
};

export default ChatList;
