import {
  PencilIcon,
  TrashIcon,
  PlusCircleIcon,
} from '@heroicons/react/20/solid';

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
      <button
        type="button"
        className="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 w-full mb-8"
        onClick={async () => {
          const newChatId = await createChat();
          setChatId(newChatId);
          setSelectedChatId(newChatId);
        }}
      >
        <PlusCircleIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
        New chat
      </button>

      <ul role="list" className="space-y-1">
        <p className="text-md font-semibold text-gray-200 leading-6">
          Your chats
        </p>
        {chatList.map((chatId, index) => (
          <li
            key={chatId}
            className={`my-2 p-2 rounded-lg cursor-pointer pl-4 flex flex-grow text-left transition-colors ${
              chatId === selectedChatId
                ? 'bg-gray-700 text-white text-sm'
                : 'bg-none text-gray-200 hover:bg-gray-700 text-sm'
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
