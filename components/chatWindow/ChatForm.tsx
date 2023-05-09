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
        <form onSubmit={handleSubmit} className="flex ">
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
            className="flex-1 focus:outline-none bg-gray-800 shadow-xl  p-4 text-gray-100 rounded-xl resize-none h-[80px]"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-gray-800  text-white font-bold py-2 px-4 focus:outline-none rounded-r-xl rfocus:border-transparent hover:bg-indigo-800"
          >
            {loading ? (
              <LoadingDots color="#ffffff" />
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
