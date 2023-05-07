import React from 'react';
import LoadingDots from '@/components/other/LoadingDots';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

type ChatFormProps = {
  loading: boolean;
  error: string | null;
  query: string;
  textAreaRef: React.RefObject<HTMLTextAreaElement>;
  handleEnter: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  setQuery: (query: string) => void;
};

const ChatForm = ({
  loading,
  error,
  query,
  textAreaRef,
  handleEnter,
  handleSubmit,
  setQuery,
}: ChatFormProps) => {
  return (
    <div>
      <div className="flex flex-col space-y-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <textarea
            disabled={loading}
            onKeyDown={handleEnter}
            ref={textAreaRef}
            autoFocus={false}
            rows={1}
            maxLength={512}
            id="userInput"
            name="userInput"
            placeholder={
              loading ? 'Waiting for response...' : 'Give me a summary'
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 border bg-gray-800 shadow-xl border-gray-500 rounded-md p-4 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent resize-none h-[80px]"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-teal-900 shadow-xl border hover:bg-teal-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-teal-900 focus:border-transparent"
          >
            {loading ? (
              <div>
                <LoadingDots color="#ffffff" />
              </div>
            ) : (
              <PaperAirplaneIcon className="h-6 w-6" />
            )}
          </button>
        </form>
        {error && (
          <div className="border border-red-400 rounded-md p-4">
            <p className="text-red-500">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatForm;
