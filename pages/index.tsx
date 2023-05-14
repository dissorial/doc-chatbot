import { Fragment, useState, useRef, useEffect, useCallback } from 'react';
import React from 'react';
import { ChatMessage } from '@/types/chat';
import { Document } from 'langchain/document';
import useNamespaces from '@/hooks/useNamespaces';
import { useChats } from '@/hooks/useChats';
import MessageList from '@/components/main/MessageList';
import ChatForm from '@/components/main/ChatForm';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import LoadingState from '@/components/other/LoadingState';
import { Dialog, Transition } from '@headlessui/react';
import { Switch } from '@headlessui/react';

import {
  Bars3Icon,
  Cog6ToothIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

import { PlusCircleIcon } from '@heroicons/react/20/solid';
import ListOfNamespaces from '@/components/sidebar/ListOfNamespaces';
import ListOfChats from '@/components/sidebar/ListOfChats';
import ProfileDropdown from '@/components/other/ProfileDropdown';
import { Message } from '@/types';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [enabled, setEnabled] = useState<boolean>(false);

  const router = useRouter();
  const [query, setQuery] = useState<string>('');
  const [chatId, setChatId] = useState<string>('1');

  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated: () => router.push('/login'),
  });
  const [returnSourceDocuments, setReturnSourceDocuments] =
    useState<boolean>(false);
  const [modelTemperature, setModelTemperature] = useState<number>(0.5);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [userImage, setUserImage] = useState<string>('');

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

  function mapChatMessageToMessage(chatMessage: ChatMessage): Message {
    return {
      ...chatMessage,
      sourceDocs: chatMessage.sourceDocs?.map((doc) => ({
        pageContent: doc.pageContent,
        metadata: { source: doc.metadata.source },
      })),
    };
  }

  const { messages, history } = messageState;

  const messageListRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleTemperatureChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setModelTemperature(parseFloat(event.target.value));
  };

  const fetchChatHistory = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/history?chatId=${selectedChatId}&userEmail=${userEmail}`,
      );
      const data = await response.json();

      const pairedMessages: [any, any][] = [];

      for (let i = 0; i < data.length; i += 2) {
        pairedMessages.push([data[i], data[i + 1]]);
      }

      setMessageState((state) => ({
        ...state,
        messages: data.map((message: any) => ({
          type: message.sender === 'user' ? 'userMessage' : 'apiMessage',
          message: message.content,
          sourceDocs: message.sourceDocs?.map((doc: any) => ({
            pageContent: doc.pageContent,
            metadata: { source: doc.metadata.source },
          })),
        })),
        history: pairedMessages.map(([userMessage, botMessage]: any) => [
          userMessage.content,
          botMessage?.content || '',
        ]),
      }));
    } catch (error) {
      console.error('Failed to fetch chat history:', error);
    }
  }, [selectedChatId, userEmail]);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      setUserEmail(session.user.email);
      if (session?.user?.name) {
        setUserName(session.user.name);
      }
      if (session?.user?.image) {
        setUserImage(session.user.image);
      }
    }
  }, [status, session]);

  useEffect(() => {
    if (selectedNamespace && chatList.length > 0) {
      setSelectedChatId(chatList[0]);
    }
  }, [selectedNamespace, chatList, setSelectedChatId]);

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
          returnSourceDocuments,
          modelTemperature,
        }),
      });
      const data = await response.json();

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
        <div>
          <Transition.Root show={sidebarOpen} as={Fragment}>
            <Dialog
              as="div"
              className="relative z-50 lg:hidden"
              onClose={setSidebarOpen}
            >
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
                    {/* Sidebar component */}
                    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4 ring-1 ring-white/10">
                      <div className="flex h-16 shrink-0 items-center"></div>
                      <nav className="flex flex-1 flex-col">
                        <ul
                          role="list"
                          className="flex flex-1 flex-col gap-y-7"
                        >
                          <li>
                            <ul role="list" className="-mx-2 space-y-1">
                              {/* mobile */}
                              {selectedNamespace && (
                                <div className="space-y-4 mb-4 px-2">
                                  <Switch.Group
                                    as="div"
                                    // className="flex items-center justify-between"
                                    className="flex flex-row items-center justify-between align-center"
                                  >
                                    <span className="flex flex-col">
                                      <Switch.Label
                                        as="span"
                                        className="text-xs sm:text-sm font-medium leading-6 text-blue-400"
                                        passive
                                      >
                                        Include source documents
                                      </Switch.Label>
                                    </span>
                                    <Switch
                                      checked={enabled}
                                      onChange={(checked) => {
                                        setEnabled(checked);
                                        setReturnSourceDocuments(checked);
                                      }}
                                      className={classNames(
                                        enabled
                                          ? 'bg-indigo-600'
                                          : 'bg-gray-200',
                                        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2',
                                      )}
                                    >
                                      <span
                                        aria-hidden="true"
                                        className={classNames(
                                          enabled
                                            ? 'translate-x-5'
                                            : 'translate-x-0',
                                          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                                        )}
                                      />
                                    </Switch>
                                  </Switch.Group>
                                  <div>
                                    <label className="block font-medium leading-6 text-xs sm:text-sm text-blue-400">
                                      Model Temperature
                                    </label>
                                    <div className="mt-2">
                                      <input
                                        type="number"
                                        min="0"
                                        max="1"
                                        value={modelTemperature}
                                        onChange={handleTemperatureChange}
                                        step="0.1"
                                        name="temperature"
                                        id="temperature"
                                        className="block w-full rounded-md bg-gray-800 text-gray-300 border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        placeholder="0.0 - 1.0"
                                      />
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    className="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 w-full mb-8"
                                    onClick={async () => {
                                      const newChatId = await createChat();
                                      setChatId(newChatId);
                                      setSelectedChatId(newChatId);
                                    }}
                                  >
                                    <PlusCircleIcon
                                      className="-ml-0.5 h-5 w-5"
                                      aria-hidden="true"
                                    />
                                    New chat
                                  </button>
                                </div>
                              )}

                              {/* new chat button */}
                            </ul>
                          </li>
                          {selectedNamespace ? (
                            <ListOfChats
                              chatList={chatList}
                              selectedChatId={selectedChatId}
                              setChatId={setChatId}
                              setSelectedChatId={setSelectedChatId}
                              chatNames={chatNames}
                              updateChatName={updateChatName}
                              deleteChat={deleteChat}
                            />
                          ) : (
                            <div className="text-xs font-semibold leading-6 text-red-400">
                              Select a namespace to display chats
                            </div>
                          )}
                          {/* mobile */}
                          <ListOfNamespaces
                            namespaces={namespaces}
                            selectedNamespace={selectedNamespace}
                            setSelectedNamespace={setSelectedNamespace}
                          />

                          {/* mobile */}
                          <li className="mt-auto">
                            <button
                              className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
                              onClick={() => router.push('/settings')}
                            >
                              <Cog6ToothIcon
                                className="h-6 w-6 shrink-0"
                                aria-hidden="true"
                              />
                              Settings
                            </button>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition.Root>

          {/* Static sidebar for desktop */}
          <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4 border-r border-gray-800">
              <div className="flex h-16 shrink-0 items-center"></div>
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    {selectedNamespace && (
                      <div className="space-y-4 mb-6">
                        <Switch.Group
                          as="div"
                          className="flex items-center justify-between"
                        >
                          <span className="flex flex-grow flex-col">
                            <Switch.Label
                              as="span"
                              className="text-sm font-medium leading-6 text-gray-100"
                              passive
                            >
                              Include source documents
                            </Switch.Label>
                          </span>
                          <Switch
                            checked={enabled}
                            onChange={(checked) => {
                              setEnabled(checked);
                              setReturnSourceDocuments(checked);
                            }}
                            className={classNames(
                              enabled ? 'bg-indigo-600' : 'bg-gray-200',
                              'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2',
                            )}
                          >
                            <span
                              aria-hidden="true"
                              className={classNames(
                                enabled ? 'translate-x-5' : 'translate-x-0',
                                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                              )}
                            />
                          </Switch>
                        </Switch.Group>
                        <div>
                          <label className="block text-xs sm:text-sm text-blue-400 font-medium leading-6">
                            Model Temperature
                          </label>
                          <div className="mt-2">
                            <input
                              type="number"
                              min="0"
                              max="1"
                              value={modelTemperature}
                              onChange={handleTemperatureChange}
                              step="0.1"
                              name="temperature"
                              id="temperature"
                              className="block w-full rounded-md bg-gray-800 text-gray-300 border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              placeholder="0.0 - 1.0"
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          className="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 w-full mb-8"
                          onClick={async () => {
                            const newChatId = await createChat();
                            setChatId(newChatId);
                            setSelectedChatId(newChatId);
                          }}
                        >
                          <PlusCircleIcon
                            className="-ml-0.5 h-5 w-5"
                            aria-hidden="true"
                          />
                          New chat
                        </button>
                      </div>
                    )}

                    {/* <div className="text-xs sm:text-sm font-semibold leading-6 text-blue-400">
                      Your chatsrrr
                    </div> */}
                    {/* desktop */}
                    {selectedNamespace && nameSpaceHasChats ? (
                      <ListOfChats
                        chatList={chatList}
                        selectedChatId={selectedChatId}
                        setChatId={setChatId}
                        setSelectedChatId={setSelectedChatId}
                        chatNames={chatNames}
                        updateChatName={updateChatName}
                        deleteChat={deleteChat}
                      />
                    ) : (
                      <div className="text-xs font-semibold leading-6 text-red-400">
                        {selectedNamespace
                          ? 'No chats in this namespace'
                          : 'Select a namespace to display chats'}
                      </div>
                    )}

                    {/* desktop */}
                  </li>
                  {/* desktop */}
                  <ListOfNamespaces
                    namespaces={namespaces}
                    selectedNamespace={selectedNamespace}
                    setSelectedNamespace={setSelectedNamespace}
                  />

                  {/* desktop */}
                  <li className="mt-auto">
                    <button
                      className="group w-full -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
                      onClick={() => router.push('/settings')}
                    >
                      <Cog6ToothIcon
                        className="h-6 w-6 shrink-0"
                        aria-hidden="true"
                      />
                      Settings
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          <div className="lg:pl-72">
            <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-800 bg-gray-900 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>

              {/* Separator */}
              <div
                className="h-6 w-px bg-gray-900/10 lg:hidden"
                aria-hidden="true"
              />

              <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 items-center">
                <span className="w-full text-center items-center rounded-md bg-blue-400/10 px-2 py-1 text-xs sm:text-sm md:text-md md:text-lg font-medium text-blue-400 ring-1 ring-inset ring-pink-blue/30">
                  DOC CHATBOT
                </span>

                <div className="flex items-center gap-x-4 lg:gap-x-6">
                  {/* Separator */}
                  <div
                    className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
                    aria-hidden="true"
                  />
                  <ProfileDropdown
                    userImage={userImage ? userImage : '/images/user.png'}
                    userName={userName ? userName : 'User'}
                    signOut={signOut}
                  />
                </div>
              </div>
            </div>

            <main className="flex flex-col h-full justify-between">
              {nameSpaceHasChats && selectedNamespace ? (
                <>
                  <div className="overflow-y-auto">
                    <MessageList
                      messages={messages.map(mapChatMessageToMessage)}
                      loading={loading}
                      messageListRef={messageListRef}
                      userImage={userImage}
                      userName={userName}
                    />
                  </div>

                  <div className="sticky bottom-0">
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
                </>
              ) : (
                <>
                  <div className="flex flex-col items-center justify-center align-center h-screen px-4">
                    <h1 className="text-xl md:text-3xl text-center font-semibold text-gray-100">
                      Welcome to doc-chatbot
                    </h1>
                    <p className="text-md md:text-xl text-center text-gray-100 mt-4">
                      {!nameSpaceHasChats && selectedNamespace
                        ? 'You have no chats in this namespace. Create a new chat to get started.'
                        : !selectedNamespace
                        ? 'Select a namespace to display chats'
                        : 'You have no chats. Create a new chat to get started.'}
                    </p>
                  </div>
                </>
              )}
            </main>
          </div>
        </div>
      )}
    </>
  );
}
