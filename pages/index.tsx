import React, {
  Fragment,
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ConversationMessage } from '@/types/ConversationMessage';
import { Document } from 'langchain/document';
import { Message } from '@/types';
import useNamespaces from '@/hooks/useNamespaces';
import { useChats } from '@/hooks/useChats';
import LoadingState from '@/components/other/LoadingState';
import MessageList from '@/components/main/MessageList';
import ChatForm from '@/components/main/ChatForm';
import SidebarList from '@/components/sidebar/SidebarList';
import EmptyState from '@/components/main/EmptyState';
import Header from '@/components/header/Header';

const status = '';
export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const [query, setQuery] = useState<string>('');

  const [returnSourceDocuments, setReturnSourceDocuments] =
    useState<boolean>(false);
  const [modelTemperature, setModelTemperature] = useState<number>(0.5);

  const { namespaces, selectedNamespace, setSelectedNamespace } =
    useNamespaces();

  const {
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
  } = useChats(selectedNamespace);

  const nameSpaceHasChats = chatList.length > 0;

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [conversation, setConversation] = useState<{
    messages: ConversationMessage[];
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

  function mapConversationMessageToMessage(
    ConversationMessage: ConversationMessage,
  ): Message {
    return {
      ...ConversationMessage,
      sourceDocs: ConversationMessage.sourceDocs?.map((doc) => ({
        pageContent: doc.pageContent,
        metadata: { source: doc.metadata.source },
      })),
    };
  }

  const { messages, history } = conversation;

  const messageListRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const fetchChatHistory = useCallback(() => {
    setLoading(true);

    try {
      const conversations = getConversation(selectedChatId);

      if (!conversations || !conversations.messages) {
        console.error('Failed to fetch chat history: No conversations found.');
        return;
      }

      const pairedMessages: [any, any][] = [];
      const data = conversations.messages;

      for (let i = 0; i < data.length; i += 2) {
        pairedMessages.push([data[i], data[i + 1]]);
      }

      setConversation((conversation) => ({
        ...conversation,
        messages: data.map((message: any) => ({
          type: message.type === 'userMessage' ? 'userMessage' : 'apiMessage',
          message: message.message,
          sourceDocs: message.sourceDocs?.map((doc: any) => ({
            pageContent: doc.pageContent,
            metadata: { source: doc.metadata.source },
          })),
        })),
        history: pairedMessages.map(([userMessage, botMessage]: any) => [
          userMessage.message,
          botMessage?.message || '',
        ]),
      }));
    } catch (error) {
      console.error('Failed to fetch chat history:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedChatId, getConversation]);

  useEffect(() => {
    if (selectedNamespace && chatList.length > 0 && !selectedChatId) {
      setSelectedChatId(chatList[0].chatId);
    }
  }, [selectedNamespace, chatList, selectedChatId, setSelectedChatId]);

  useEffect(() => {
    if (chatList.length > 0) {
      setSelectedChatId(chatList[chatList.length - 1].chatId);
    }
  }, [selectedNamespace, setSelectedChatId, chatList]);

  useEffect(() => {
    if (selectedChatId) {
      fetchChatHistory();
    }
  }, [selectedChatId, fetchChatHistory]);

  useEffect(() => {
    textAreaRef.current?.focus();
  }, []);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setError(null);

    if (!query) {
      alert('Please input a question');
      return;
    }

    const question = query.trim();
    setConversation((conversation) => ({
      ...conversation,
      messages: [
        ...conversation.messages,
        {
          type: 'userMessage',
          message: question,
        } as ConversationMessage,
      ],
    }));

    setLoading(true);
    setQuery('');

    const conversation = getConversation(selectedChatId);

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
        history: conversation.history,
        selectedChatId,
        selectedNamespace,
        returnSourceDocuments,
        modelTemperature,
      }),
    });
    const data = await response.json();

    if (data.error) {
      setError(data.error);
    } else {
      setConversation((prevConversation) => {
        const updatedConversation = {
          ...prevConversation,
          messages: [
            ...prevConversation.messages,
            {
              type: 'apiMessage',
              message: data.text,
              sourceDocs: data.sourceDocuments
                ? data.sourceDocuments.map(
                    (doc: any) =>
                      new Document({
                        pageContent: doc.pageContent,
                        metadata: { source: doc.metadata.source },
                      }),
                  )
                : undefined,
            } as ConversationMessage,
          ],
          history: [
            ...prevConversation.history,
            [question, data.text] as [string, string],
          ],
        };

        updateConversation(selectedChatId, updatedConversation);
        return updatedConversation;
      });
    }

    setLoading(false);
    messageListRef.current?.scrollTo(0, messageListRef.current.scrollHeight);
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
      {loading ? (
        <LoadingState />
      ) : (
        <div className="h-full">
          <Transition.Root show={sidebarOpen} as={Fragment}>
            <Dialog as="div" onClose={setSidebarOpen}>
              <Transition.Child
                as={Fragment}
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-gray-900/80" />
              </Transition.Child>

              <div className="fixed inset-0 flex">
                <Transition.Child
                  as={Fragment}
                  enter="transition ease-in-out duration-300 transform"
                  enterFrom="-translate-x-full"
                  enterTo="translate-x-0"
                  leave="transition ease-in-out duration-300 transform"
                  leaveFrom="translate-x-0"
                  leaveTo="-translate-x-full"
                >
                  <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-in-out duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in-out duration-300"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                        <button
                          type="button"
                          className="-m-2.5 p-2.5"
                          onClick={() => setSidebarOpen(false)}
                        >
                          <span className="sr-only">Close sidebar</span>
                          <XMarkIcon
                            className="h-6 w-6 text-white"
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                    </Transition.Child>
                    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4 ring-1 ring-white/10">
                      <div className="flex h-16 shrink-0 items-center"></div>
                      <SidebarList
                        createChat={createChat}
                        selectedNamespace={selectedNamespace}
                        setSelectedNamespace={setSelectedNamespace}
                        namespaces={namespaces}
                        filteredChatList={filteredChatList.map(
                          (chat) => chat.chatId,
                        )}
                        selectedChatId={selectedChatId}
                        setSelectedChatId={setSelectedChatId}
                        chatNames={chatNames}
                        updateChatName={updateChatName}
                        deleteChat={deleteChat}
                        returnSourceDocuments={returnSourceDocuments}
                        setReturnSourceDocuments={setReturnSourceDocuments}
                        modelTemperature={modelTemperature}
                        setModelTemperature={setModelTemperature}
                        nameSpaceHasChats={nameSpaceHasChats}
                      />
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition.Root>

          <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col h-screen overflow-y-hidden">
            <div className="flex grow flex-col bg-gray-900 pb-4 border-r border-gray-800 h-full">
              <div className="flex h-8 shrink-0 items-center"></div>
              <SidebarList
                createChat={createChat}
                selectedNamespace={selectedNamespace}
                setSelectedNamespace={setSelectedNamespace}
                namespaces={namespaces}
                filteredChatList={filteredChatList.map((chat) => chat.chatId)}
                selectedChatId={selectedChatId}
                setSelectedChatId={setSelectedChatId}
                chatNames={chatNames}
                updateChatName={updateChatName}
                deleteChat={deleteChat}
                returnSourceDocuments={returnSourceDocuments}
                setReturnSourceDocuments={setReturnSourceDocuments}
                modelTemperature={modelTemperature}
                setModelTemperature={setModelTemperature}
                nameSpaceHasChats={nameSpaceHasChats}
              />
            </div>
          </div>

          <div className="lg:pl-72 h-screen">
            <Header setSidebarOpen={setSidebarOpen} />

            <main className="flex flex-col">
              {nameSpaceHasChats && selectedNamespace ? (
                <>
                  <div className="overflow-y-auto flex-grow pb-36">
                    <MessageList
                      messages={messages.map(mapConversationMessageToMessage)}
                      loading={loading}
                      messageListRef={messageListRef}
                    />
                  </div>
                </>
              ) : (
                <>
                  <EmptyState
                    nameSpaceHasChats={nameSpaceHasChats}
                    selectedNamespace={selectedNamespace}
                  />
                </>
              )}
              {nameSpaceHasChats && selectedNamespace && (
                <div className="fixed w-full bottom-0 flex bg-gradient-to-t from-gray-800 to-gray-800/0 justify-center lg:pr-72">
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
              )}
            </main>
          </div>
        </div>
      )}
    </>
  );
}
