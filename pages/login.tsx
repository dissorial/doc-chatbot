import React from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { useRouter } from 'next/router';
import Image from 'next/image';

export default function Example() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <div className="bg-gray-900 ">
      <div className="relative isolate pt-14">
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        <div className="py-24 sm:py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex rounded-full bg-indigo-500/10 px-3 py-1 text-sm font-semibold leading-6 text-indigo-400 ring-1 ring-inset ring-indigo-500/20 mb-2">
                {session ? (
                  <p>Signed in as {session?.user?.name}</p>
                ) : (
                  <p>doc-chatbot</p>
                )}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight text-white">
                {' '}
                {/* Responsive font-size */}
                Have a conversation with your documents
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                Upload your files, ask questions, and get relevant answers.
                Maintain multiple chats, windows, and conversations in one
                place.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-x-6 gap-y-6 sm:gap-y-0">
                {session ? (
                  <div className="flex flex-col sm:flex-row sm:justify-center gap-4 sm:gap-8 w-2/3">
                    <button
                      type="button"
                      className="rounded-md bg-white/10 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-white/20"
                      onClick={() => signOut()}
                    >
                      Sign out
                    </button>
                    <button
                      type="button"
                      className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                      onClick={() => router.push('/settings')}
                    >
                      Settings
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-300"
                      onClick={() => router.push('/')}
                    >
                      Chat
                      <ArrowRightIcon className="w-5 h-5 ml-2 text-gray-900" />
                    </button>
                  </div>
                ) : (
                  <button
                    className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
                    onClick={() =>
                      signIn('google', { callbackUrl: '/settings' })
                    }
                  >
                    Sign in with Google
                  </button>
                )}
              </div>
            </div>
            <Image
              src="/images/main_desktop.png"
              alt="App screenshot"
              width={2432}
              height={1442}
              className="mt-16 rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10 sm:mt-24"
            />
          </div>
        </div>
        <div
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
