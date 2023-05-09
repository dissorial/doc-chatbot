import { useRef, useState, useEffect } from 'react';
import { ChatMessage } from '@/types/chat';
import { Document } from 'langchain/document';
import useNamespaces from '@/hooks/useNamespaces';
import { useChats } from '@/hooks/useChats';
import { NamespaceList } from '@/components/sidebar/NamespaceList';
import MessageList from '@/components/chatWindow/MessageList';
import ChatList from '@/components/sidebar/ChatList';
import ChatForm from '@/components/chatWindow/ChatForm';
import { useCallback } from 'react';
import { ArrowLongRightIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import LoadingState from '@/components/other/LoadingState';

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState<string>('');
  const [chatId, setChatId] = useState<string>('1');

  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated: () => router.push('/login'),
  });

  const [userEmail, setUserEmail] = useState<string>('');

  const { namespaces, selectedNamespace, setSelectedNamespace } =
    useNamespaces(userEmail);

  const {
    chatList,
    selectedChatId,
    setSelectedChatId,
    createChat,
    deleteChat,
    chatNames,
    updateChatName,
  } = useChats(selectedNamespace, userEmail);

  const nameSpaceHasChats = chatList.length > 0;

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [messageState, setMessageState] = useState<{
    messages: ChatMessage[];
    pending?: string;
    history: [string, string][];
    pendingSourceDocs?: Document[];
  }>({
    messages: [
      {
        message: 'Hi, what would you like to know about these documents?',
        type: 'apiMessage',
      },
    ],
    history: [],
  });

  const { messages, history } = messageState;

  const messageListRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const fetchChatHistory = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/history?chatId=${chatId}&userEmail=${userEmail}`,
      );
      const data = await response.json();
      setMessageState((state) => ({
        ...state,
        messages: data.map((message: any) => ({
          type: message.sender === 'user' ? 'userMessage' : 'apiMessage',
          message: message.content,
        })),
      }));
    } catch (error) {
      console.error('Failed to fetch chat history:', error);
    }
  }, [chatId, userEmail]);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      setUserEmail(session.user.email);
    }
  }, [status, session, setUserEmail]);

  useEffect(() => {
    if (!selectedNamespace && namespaces.length > 0) {
      setSelectedNamespace(namespaces[0]);
    }
  }, [namespaces, selectedNamespace, setSelectedNamespace]);

  useEffect(() => {
    if (selectedChatId) {
      fetchChatHistory();
    }
  }, [selectedChatId, fetchChatHistory]);

  useEffect(() => {
    textAreaRef.current?.focus();
  }, []);

  useEffect(() => {
    fetchChatHistory();
  }, [chatId, fetchChatHistory]);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setError(null);

    if (!query) {
      alert('Please input a question');
      return;
    }

    const question = query.trim();
    setMessageState((state) => ({
      ...state,
      messages: [
        ...state.messages,
        {
          type: 'userMessage',
          message: question,
        },
      ],
    }));

    setLoading(true);
    setQuery('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          history,
          chatId,
          selectedNamespace,
          userEmail,
        }),
      });
      const data = await response.json();
      console.log('data', data);

      if (data.error) {
        setError(data.error);
      } else {
        setMessageState((state) => ({
          ...state,
          messages: [
            ...state.messages,
            {
              type: 'apiMessage',
              message: data.text,
              sourceDocs: data.sourceDocuments,
            },
          ],
          history: [...state.history, [question, data.text]],
        }));
      }
      console.log('messageState', messageState);

      setLoading(false);

      messageListRef.current?.scrollTo(0, messageListRef.current.scrollHeight);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching data:', error);
      if (error) {
        console.error('Server responded with:', error);
      }
      setError('An error occurred while fetching the data. Please try again.');
    }
  }

  const handleEnter = (e: any) => {
    if (e.key === 'Enter' && query) {
      handleSubmit(e);
    } else if (e.key == 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <>
      {status === 'loading' ? (
        <LoadingState />
      ) : (
        <div
          className={`flex bg-gray-900 pb-40 ${
            !nameSpaceHasChats ? 'h-screen' : ''
          }`}
        >
          <div className="fixed top-0 left-0 w-1/6 h-screen flex flex-col gap-y-5 overflow-y-auto bg-gray-800 px-6">
            <div className="flex h-4 shrink-0 items-center"></div>

            <nav className="flex flex-1 flex-col mx-auto w-full">
              <ul role="list" className="flex flex-1 flex-col gap-y-12">
                <span className="w-full rounded-md bg-indigo-400/10 px-3 py-2 text-sm text-center mx-auto font-medium text-indigo-400 ring-1 ring-inset ring-indigo-400/30 mb-8">
                  pdf-chat
                </span>
                <ChatList
                  chatList={chatList}
                  chatNames={chatNames}
                  selectedChatId={selectedChatId}
                  setChatId={setChatId}
                  setSelectedChatId={setSelectedChatId}
                  createChat={createChat}
                  updateChatName={updateChatName}
                  deleteChat={deleteChat}
                />
                <NamespaceList
                  namespaces={namespaces}
                  selectedNamespace={selectedNamespace}
                  setSelectedNamespace={setSelectedNamespace}
                />
              </ul>
            </nav>

            <button
              type="button"
              className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              onClick={() => router.push('/settings')}
            >
              Settings
            </button>

            <button
              type="button"
              className="rounded-md bg-white/10 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-white/20 mb-12"
              onClick={() => signOut()}
            >
              Sign out
            </button>
          </div>
          <main className="py-10 w-full h-full pl-72">
            <div className="px-4 sm:px-6 lg:px-8 h-full flex flex-col">
              {nameSpaceHasChats ? (
                <>
                  {messages.length === 0 ? (
                    <h2 className="text-2xl mb-3 text-center text-gray-200 font-bold tracking-wide">
                      Nothing to show here yet
                    </h2>
                  ) : (
                    <h2 className="text-2xl mb-3 text-center text-gray-200 font-bold tracking-wide">
                      Chat topic{'  '}
                      <ArrowLongRightIcon className="inline-block h-6 w-6 mx-2 text-gray-200" />
                      {'  '}
                      {chatNames[selectedChatId] || 'Untitled Chat'}
                    </h2>
                  )}

                  <div
                    className={`flex flex-col px-32 items-stretch ${
                      messages.length > 0 ? 'flex-grow' : ''
                    }`}
                  >
                    <MessageList
                      messages={messages}
                      loading={loading}
                      messageListRef={messageListRef}
                    />

                    <div className="flex bg-red-400 items-center justify-center mx-auto">
                      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/3 w-full max-w-3xl pb-10">
                        <div className="bg-gray-800 opacity-90 border border-transparent rounded-xl">
                          <ChatForm
                            loading={loading}
                            error={error}
                            query={query}
                            textAreaRef={textAreaRef}
                            handleEnter={handleEnter}
                            handleSubmit={handleSubmit}
                            setQuery={setQuery}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-300  text-center font-medium mt-6">
                    Demo built by{' '}
                    <a
                      href="https://github.com/dissorial"
                      className="text-blue-400 hover:text-blue-500 transition-colors"
                    >
                      dissorial
                    </a>
                  </p>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-screen ">
                  <h1 className="text-5xl font-bold text-gray-100">Welcome</h1>
                  <p className="text-2xl text-gray-100 mt-4">
                    Get started by creating a chat for this topic in the
                    sidebar.
                  </p>
                  <p className="text-gray-300 font-medium mt-12">
                    Demo built by{' '}
                    <a
                      href="https://github.com/dissorial"
                      className="text-blue-400 hover:text-blue-500 transition-colors"
                    >
                      dissorial
                    </a>
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
      )}
    </>
  );
}
