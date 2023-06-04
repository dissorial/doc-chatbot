import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useDropzone } from 'react-dropzone';
import ChunkSizeModal from '@/components/other/ChunkSizeModal';
import { setItem } from '@/libs/localStorageKeys';
import useApiKeys from '@/hooks/useKeys';
import OverlapSizeModal from '@/components/other/OverlapSizeModal';
import {
  ArrowRightIcon,
  CheckIcon,
  QuestionMarkCircleIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid';
import Pattern from './components/Pattern';
import KeyForm from '@/components/keyform/KeyForm';

export default function Settings() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const {
    openAIapiKey,
    setOpenAIapiKey,
    pineconeApiKey,
    setPineconeApiKey,
    pineconeEnvironment,
    setPineconeEnvironment,
    pineconeIndexName,
    setPineconeIndexName,
  } = useApiKeys();

  const [namespaceName, setNamespaceName] = useState<string>('');
  const [deleteMessage, setDeleteMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [uploadMessage, setUploadMessage] = useState<string>('');
  const [error, setError] = useState<{ message: string; customString: string }>(
    {
      message: '',
      customString: '',
    },
  );
  const [namespaces, setNamespaces] = useState<string[]>([]);
  const [chunkSize, setChunkSize] = useState<number>(1200);
  const [overlapSize, setOverlapSize] = useState<number>(20);
  const [selectedNamespace, setSelectedNamespace] = useState<string>('');
  const [showChunkSizeModal, setShowChunkSizeModal] = useState<boolean>(false);
  const [showOverlapSizeModal, setShowOverlapSizeModal] =
    useState<boolean>(false);
  const router = useRouter();

  const fetchNamespaces = useCallback(async () => {
    try {
      const response = await fetch(`/api/getNamespaces`, {
        headers: {
          'X-Api-Key': pineconeApiKey,
          'X-Index-Name': pineconeIndexName,
          'X-Environment': pineconeEnvironment,
        },
      });
      const data = await response.json();

      if (response.ok) {
        setNamespaces(data);
        setError({
          customString: '',
          message: '',
        });
      } else {
        setError(data.error);
      }
    } catch (error: any) {
      setError({
        message: error.message,
        customString: 'An error occured while fetching namespaces',
      });
    }
  }, [pineconeApiKey, pineconeIndexName, pineconeEnvironment]);

  useEffect(() => {
    if (pineconeApiKey) {
      fetchNamespaces();
    }
  }, [fetchNamespaces, pineconeApiKey]);

  const handleSubmit = (storageKey: string, key: string) => {
    setItem(storageKey, key);
    if (storageKey === 'openAIapiKey') {
      setOpenAIapiKey(key);
    } else if (storageKey === 'pineconeApiKey') {
      setPineconeApiKey(key);
    } else if (storageKey === 'pineconeEnvironment') {
      setPineconeEnvironment(key);
    } else if (storageKey === 'pineconeIndexName') {
      setPineconeIndexName(key);
    }
  };

  const handleDelete = async (namespace: string) => {
    try {
      const response = await fetch(
        `/api/deleteNamespace?namespace=${namespace}`,
        {
          method: 'DELETE',
          headers: {
            'X-Api-Key': pineconeApiKey,
            'X-Index-Name': pineconeIndexName,
            'X-Environment': pineconeEnvironment,
          },
        },
      );

      if (response.ok) {
        const updatedNamespaces = namespaces.filter(
          (item) => item !== namespace,
        );
        setNamespaces(updatedNamespaces);
        setDeleteMessage(`${namespace} has been successfully deleted.`);
      } else {
        const data = await response.json();
        console.log(data.error);
      }
    } catch (error: any) {
      console.log(error);
      setError({
        message: error.message,
        customString: 'An error occured trying to delete a namespace',
      });
    }
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    noClick: true,
    noKeyboard: true,
    onDrop: (acceptedFiles: File[]) => {
      setSelectedFiles(acceptedFiles);
    },
    multiple: true,
  });

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append(`myfile${i}`, selectedFiles[i]);
    }

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setUploadMessage('Files uploaded successfully!');
      } else {
        const errorData = await response.json();
        setError(errorData.error);
      }
    } catch (error: any) {
      setError({
        message: error.message,
        customString: 'An error occured trying to upload files',
      });
    }
  };

  const handleIngest = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `/api/consume?namespaceName=${namespaceName}&chunkSize=${chunkSize}&overlapSize=${overlapSize}`,
        {
          method: 'POST',
          headers: {
            'X-OpenAI-Key': openAIapiKey,
            'X-Pinecone-Key': pineconeApiKey,
            'X-Index-Name': pineconeIndexName,
            'X-Environment': pineconeEnvironment,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);

        setTimeout(() => {
          // setMessage('');
        }, 1000);
        fetchNamespaces();
      } else {
        const errorData = await response.json();
        setError(errorData.error);
      }
    } catch (error: any) {
      setError({
        message: error.message,
        customString: 'Error ingesting files',
      });
    }

    setLoading(false);
  };
  return (
    <div className="relative isolate min-h-screen bg-gray-900">
      <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2">
        <div className="relative px-6 pb-20 pt-24 sm:pt-32 lg:static lg:px-8 lg:py-48">
          <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
            <Pattern />
            {error && (
              <div className="mt-4 sm:mt-8 flex justify-center mb-4">
                <div className="text-red-500 text-sm sm:text-base font-semibold">
                  {error.customString}
                </div>
              </div>
            )}
            <div className="max-w-xl mx-auto">
              <div className="gap-4 grid grid-cols1 sm:grid-cols-2 mb-6">
                <KeyForm
                  keyName="OpenAI API Key"
                  keyValue={openAIapiKey}
                  setKeyValue={(key: string) =>
                    handleSubmit('openAIapiKey', key)
                  }
                />
                <KeyForm
                  keyName="Pinecone API Key"
                  keyValue={pineconeApiKey}
                  setKeyValue={(key: string) =>
                    handleSubmit('pineconeApiKey', key)
                  }
                />
                <KeyForm
                  keyName="Pinecone environment"
                  keyValue={pineconeEnvironment}
                  setKeyValue={(key: string) =>
                    handleSubmit('pineconeEnvironment', key)
                  }
                />
                <KeyForm
                  keyName="Pinecone index name"
                  keyValue={pineconeIndexName}
                  setKeyValue={(key: string) =>
                    handleSubmit('pineconeIndexName', key)
                  }
                />
              </div>

              <div className="flex justify-between items-center space-x-2 align-center mb-2">
                {namespaces.length > 0 ? (
                  <h2 className="mb-4 text-xl text-center sm:text-3xl sm:text-left font-bold text-white">
                    Your namespaces
                  </h2>
                ) : (
                  <span className="inline-flex items-center rounded-md bg-red-400/10 px-2 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-red-400 ring-1 ring-inset ring-red-400/20">
                    No namespaces found
                  </span>
                )}

                <button
                  type="button"
                  className="rounded-md items-center align-center justify-between flex bg-white px-4 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-200"
                  onClick={() => router.push('/')}
                >
                  Start chatting
                  <ArrowRightIcon
                    className="ml-2 -mr-0.5 h-4 w-4"
                    aria-hidden="true"
                  />
                </button>
              </div>

              <ul role="list" className="grid grid-cols-2 gap-4">
                {namespaces.map((namespace) => (
                  <li
                    key={namespace}
                    className="bg-gray-800/60 rounded-lg shadow px-5 py-4 flex items-center justify-between space-x-4"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {namespace}
                      </p>
                    </div>
                    <div className="flex-shrink-0 flex items-center space-x-2">
                      {selectedNamespace === namespace ? (
                        <div className="flex items-center space-x-2">
                          <CheckIcon
                            className="h-5 w-5 text-green-400 hover:text-green-500 cursor-pointer"
                            aria-hidden="true"
                            onClick={() => handleDelete(selectedNamespace)}
                          />
                          <XMarkIcon
                            className="h-5 w-5 text-gray-400 hover:text-gray-300 cursor-pointer"
                            aria-hidden="true"
                            onClick={() => setSelectedNamespace('')}
                          />
                        </div>
                      ) : (
                        <TrashIcon
                          className="h-5 w-5 text-red-400
                        hover:text-red-500 cursor-pointer
                        "
                          aria-hidden="true"
                          onClick={() => setSelectedNamespace(namespace)}
                        />
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              {deleteMessage && (
                <p className="mt-6 text-md font-medium text-green-400 text-center">
                  {deleteMessage}
                </p>
              )}
            </div>
          </div>
        </div>
        {/* ------------------------------- */}
        <div className="px-6 pb-24 pt-20 sm:pb-32 lg:px-8 lg:py-48">
          <div className="mx-auto max-w-xl lg:mr-0 lg:max-w-lg ">
            {/* upload area */}
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {' '}
              Creating namespaces
            </h2>
            <p className="mt-4 sm:mt-6 text-sm sm:text-lg leading-6 sm:leading-8 text-gray-300">
              {' '}
              Treat namespaces like topics of conversation. You can create as
              many as you like, and they can be used to organize your data.
            </p>

            <div
              className="mt-4 sm:mt-8 flex justify-center"
              {...getRootProps()}
            >
              {' '}
              <label className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-6 sm:p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer">
                {' '}
                <svg
                  className="mx-auto h-8 sm:h-12 w-8 sm:w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
                  />
                </svg>
                <input
                  {...getInputProps({
                    onClick: (event) => event.stopPropagation(),
                  })}
                />
                <span className="mt-2 sm:mt-2 block text-xs sm:text-sm font-semibold text-gray-100">
                  {selectedFiles.length > 0
                    ? selectedFiles.map((file) => file.name).join(', ')
                    : 'Drag and drop or click to select files to upload'}
                </span>
              </label>
            </div>
            {/* upload area */}
            <div className="mt-4 sm:mt-8 flex justify-end">
              <button
                className="rounded-md bg-indigo-500 px-2.5 sm:px-3.5 py-1.5 sm:py-2.5 text-center text-sm sm:text-base font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                onClick={handleUpload}
              >
                {uploadMessage ? uploadMessage : 'Upload files'}
              </button>
            </div>
            <div>
              <div className="flex items-center">
                <label
                  htmlFor="chunkSize"
                  className="block text-sm font-medium leading-6 text-gray-300"
                >
                  Chunk size
                </label>
                <QuestionMarkCircleIcon
                  className="ml-2 h-5 w-5 text-gray-300 hover:text-gray-400 cursor-pointer"
                  onClick={() => setShowChunkSizeModal(true)}
                />
              </div>

              <div className="w-full">
                <input
                  type="range"
                  min={100}
                  max={4000}
                  step={100}
                  value={chunkSize}
                  onChange={(e) => setChunkSize(Number(e.target.value))}
                  className="w-full"
                />

                <div className="text-center text-gray-100">{chunkSize}</div>
              </div>
            </div>

            <ChunkSizeModal
              open={showChunkSizeModal}
              setOpen={setShowChunkSizeModal}
            />
            <div>
              <div className="flex items-center">
                <label
                  htmlFor="overlapSize"
                  className="block text-sm font-medium leading-6 text-gray-300"
                >
                  Overlap size
                </label>
                <QuestionMarkCircleIcon
                  className="ml-2 h-5 w-5 text-gray-300 cursor-pointer hover:text-gray-400"
                  onClick={() => setShowOverlapSizeModal(true)}
                />
              </div>

              <div className="w-full">
                <input
                  type="range"
                  min={0}
                  max={50}
                  step={5}
                  value={overlapSize}
                  onChange={(e) => setOverlapSize(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-center text-gray-100">{overlapSize}%</div>
              </div>
            </div>
            <OverlapSizeModal
              open={showOverlapSizeModal}
              setOpen={setShowOverlapSizeModal}
            />

            {uploadMessage && (
              <div className="mt-4 sm:mt-8 grid grid-cols-1 gap-x-4 sm:gap-x-8 gap-y-4 sm:gap-y-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold leading-6 text-white"
                  >
                    Namespace name
                  </label>

                  <div className="mt-2.5">
                    <input
                      type="text"
                      className="block w-full rounded-md border-0 bg-white/5 px-2 sm:px-3.5 py-1.5 sm:py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-sm sm:text-base sm:leading-6 opacity-50"
                      value={namespaceName}
                      onChange={(e) => setNamespaceName(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
            {namespaceName && (
              <div className="mt-4 sm:mt-8 flex justify-end">
                <button
                  className="rounded-md bg-indigo-500 px-2.5 sm:px-3.5 py-1.5 sm:py-2.5 text-center text-sm sm:text-base font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  onClick={handleIngest}
                >
                  {loading ? 'Ingesting...' : message ? message : 'Ingest'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
