import React, { useState, useEffect } from 'react';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import LoadingState from '@/components/other/LoadingState';

const Settings = () => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [namespaceName, setNamespaceName] = useState<string>('');
  const [deleteMessage, setDeleteMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [namespaces, setNamespaces] = useState<string[]>([]);
  const router = useRouter();

  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated: () => router.push('/login'),
  });
  const userEmail = session?.user?.email;

  useEffect(() => {
    const fetchNamespaces = async () => {
      if (!userEmail) return;

      try {
        const response = await fetch(
          `/api/getNamespaces?userEmail=${userEmail}`,
        );
        const data = await response.json();

        if (response.ok) {
          setNamespaces(data);
        } else {
          setError(data.error);
        }
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchNamespaces();
  }, [userEmail]);

  const handleDelete = async (namespace: string) => {
    try {
      const response = await fetch(
        `/api/deleteNamespace?namespace=${namespace}`,
        {
          method: 'DELETE',
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
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFiles(event.target.files);
    }
  };

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
        setMessage('Files uploaded successfully!');
      } else {
        const errorData = await response.json();
        setError(errorData.error);
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleIngest = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `/api/consume?namespaceName=${namespaceName}&userEmail=${userEmail}`,
        {
          method: 'POST',
        },
      );

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
      } else {
        const errorData = await response.json();
        setError(errorData.error);
      }
    } catch (error: any) {
      setError(error.message);
    }

    setLoading(false);
  };
  return (
    <>
      {status === 'loading' ? (
        <LoadingState />
      ) : (
        <div className="mx-auto min-h-screen px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700">
          <div className="flex flex-col w-full justify-center mb-14 align-center items-center">
            <span className="inline-flex items-center rounded-md bg-indigo-400/10 px-3 py-2 text-sm text-center mx-auto font-medium text-indigo-400 ring-1 ring-inset ring-indigo-400/30 mb-8">
              Signed in as {session?.user?.email}
            </span>
            <div className="flex items-center group">
              <button
                type="button"
                className="inline-flex rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                onClick={() => router.push('/')}
              >
                Chat
                <ArrowRightIcon className="w-5 h-5 ml-2 text-gray-900" />
              </button>
            </div>
          </div>

          <h2 className="text-center">
            <span className="text-5xl font-bold text-white">
              Create a namespace
            </span>
          </h2>
          <p className="text-center text-gray-300 mt-6 text-xl">
            Start by selecting a file or multiple files to upload.
          </p>
          <p className="text-gray-300  text-center font-medium mt-6">
            Demo built by{' '}
            <a
              href="https://github.com/dissorial"
              className="text-blue-400 hover:text-blue-500 transition-colors"
            >
              dissorial
            </a>
          </p>
          <div className="mt-8 flex justify-center ">
            <label className="w-1/3 flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue hover:bg-blue hover:text-blue-900 cursor-pointer">
              <svg
                className="w-8 h-8"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 6h-5v-5a1 1 0 00-2 0v5h-5a1 1 0 000 2h5v5a1 1 0 002 0v-5h5a1 1 0 000-2z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="mt-2 text-base leading-normal text-center text-gray-500">
                {selectedFiles
                  ? Array.from(selectedFiles)
                      .map((file) => file.name)
                      .join(', ')
                  : 'Select a file'}
              </span>
              <input
                type="file"
                name="myfile"
                onChange={handleFileChange}
                className="hidden"
                multiple
              />
            </label>
          </div>

          <div className="flex justify-center mt-6">
            {selectedFiles && selectedFiles.length > 0 && (
              <button
                onClick={handleUpload}
                className="bg-blue-500 w-1/3 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Confirm upload
              </button>
            )}
          </div>

          {message && (
            <div className="mt-4">
              <label className="text-center text-xl mt-10 block text-gray-300 font-bold mb-2">
                Topic name
              </label>
              <div className="flex flex-col w-[200px] mx-auto justify-center gap-4">
                <input
                  type="text"
                  value={namespaceName}
                  onChange={(e) => setNamespaceName(e.target.value)}
                  className="appearance-none block bg-gray-800 text-gray-200 mt-2 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-gray-700 focus:border-gray-700"
                />
                {namespaceName && (
                  <button
                    onClick={handleIngest}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4  rounded"
                  >
                    Ingest
                  </button>
                )}
              </div>
            </div>
          )}

          {loading && (
            <p className="mt-8 text-center text-gray-300">Loading...</p>
          )}
          {error && <p className="mt-8 text-center text-red-500">{error}</p>}
          {message && (
            <p className="mt-8 text-center text-xl text-bold text-green-500">
              {message}
            </p>
          )}

          <div className="mt-8 max-w-xl mx-auto">
            {namespaces.length > 0 && (
              <h2 className="mb-2 mt-12 text-center text-3xl font-bold text-white">
                Your namespaces
              </h2>
            )}

            <ul role="list" className="divide-y divide-gray-700">
              {namespaces.map((namespace) => (
                <li
                  key={namespace}
                  className="flex items-center justify-between gap-x-6 py-5"
                >
                  <div className="min-w-0">
                    <div className="flex items-start gap-x-3">
                      <p className="text-md font-semibold leading-6 text-gray-300">
                        {namespace}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-none items-center gap-x-4">
                    <button
                      className="hidden rounded-md bg-red-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm ring-inset ring-gray-300 hover:bg-red-700 sm:block"
                      onClick={() => handleDelete(namespace)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            {deleteMessage && (
              <p className="text-green-600 text-bold mt-8 text-center ">
                {deleteMessage}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Settings;
