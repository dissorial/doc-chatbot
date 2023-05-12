import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

export default function Settings() {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [namespaceName, setNamespaceName] = useState<string>('');
  const [deleteMessage, setDeleteMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [uploadMessage, setUploadMessage] = useState<string>('');
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
        `/api/deleteNamespace?namespace=${namespace}&userEmail=${userEmail}`,
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
  console.log('selecdtedfiles', selectedFiles);

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
    <div className="relative isolate min-h-screen bg-gray-900">
      <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2">
        <div className="relative px-6 pb-20 pt-24 sm:pt-32 lg:static lg:px-8 lg:py-48">
          <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
            <div className="absolute inset-y-0 left-0 -z-10 w-full h-full overflow-hidden ring-1 ring-white/5 lg:w-1/2">
              <svg
                className="absolute inset-0 h-full w-full stroke-gray-700 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
                aria-hidden="true"
              >
                <defs>
                  <pattern
                    id="54f88622-e7f8-4f1d-aaf9-c2f5e46dd1f2"
                    width={200}
                    height={200}
                    x="100%"
                    y={-1}
                    patternUnits="userSpaceOnUse"
                  >
                    <path d="M130 200V.5M.5 .5H200" fill="none" />
                  </pattern>
                </defs>
                <svg
                  x="100%"
                  y={-1}
                  className="overflow-visible fill-gray-800/20"
                >
                  <path d="M-470.5 0h201v201h-201Z" strokeWidth={0} />
                </svg>
                <rect
                  width="100%"
                  height="100%"
                  strokeWidth={0}
                  fill="url(#54f88622-e7f8-4f1d-aaf9-c2f5e46dd1f2)"
                />
              </svg>
              <div
                className="absolute -left-56 top-[calc(100%-13rem)] transform-gpu blur-3xl lg:left-[max(-14rem,calc(100%-59rem))] lg:top-[calc(50%-7rem)]"
                aria-hidden="true"
              >
                <div
                  className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-br from-[#80caff] to-[#4f46e5] opacity-20"
                  style={{
                    clipPath:
                      'polygon(74.1% 56.1%, 100% 38.6%, 97.5% 73.3%, 85.5% 100%, 80.7% 98.2%, 72.5% 67.7%, 60.2% 37.8%, 52.4% 32.2%, 47.5% 41.9%, 45.2% 65.8%, 27.5% 23.5%, 0.1% 35.4%, 17.9% 0.1%, 27.6% 23.5%, 76.1% 2.6%, 74.1% 56.1%)',
                  }}
                />
              </div>
            </div>

            <div className="max-w-xl mx-auto">
              <h2 className="mb-4 text-xl text-center sm:text-3xl sm:text-left font-bold text-white">
                Your Pinecone namespaces
              </h2>
              {namespaces.length > 0 ? (
                <>
                  <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
                    <span className="rounded-md bg-blue-400/10 px-3 py-2.5 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-400/30 mb-4 sm:mb-0">
                      Signed in as {userEmail}
                    </span>
                    <button
                      type="button"
                      className="rounded-md bg-white px-4 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-200"
                      onClick={() => router.push('/')}
                    >
                      Chat
                    </button>
                  </div>
                </>
              ) : (
                <span className="inline-flex items-center rounded-md bg-red-400/10 px-2 py-1 text-xs sm:text-sm font-medium text-red-400 ring-1 ring-inset ring-red-400/20">
                  You currently do not have any namespaces
                </span>
              )}

              <ul role="list" className="space-y-4">
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
                    <div className="flex-shrink-0">
                      <button
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={() => handleDelete(namespace)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              {deleteMessage && (
                <p className="mt-6 text-md font-medium text-green-400 text-center">
                  {deleteMessage}
                </p>
              )}

              {error && (
                <p className="mt-6 text-md font-medium text-red-400 text-center">
                  {error}
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
            <div className="mt-4 sm:mt-8 flex justify-center">
              {' '}
              <label className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-6 sm:p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mb-4 cursor-pointer">
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
                <span className="mt-2 sm:mt-2 block text-xs sm:text-sm font-semibold text-gray-100">
                  {selectedFiles
                    ? Array.from(selectedFiles)
                        .map((file) => file.name)
                        .join(', ')
                    : 'Select a single PDF file or multiple files'}
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
            {/* upload area */}
            <div className="mt-4 sm:mt-8 flex justify-end">
              <button
                className="rounded-md bg-indigo-500 px-2.5 sm:px-3.5 py-1.5 sm:py-2.5 text-center text-sm sm:text-base font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                onClick={handleUpload}
              >
                {uploadMessage ? uploadMessage : 'Upload files'}
              </button>
            </div>
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
