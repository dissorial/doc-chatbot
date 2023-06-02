import React, { useCallback, useEffect, useRef } from 'react';
import {
  ExclamationCircleIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/solid';

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
  handleEnter,
  handleSubmit,
  setQuery,
}: ChatFormProps) => {
  const otherRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = useCallback(() => {
    if (otherRef.current) {
      otherRef.current.style.height = 'auto';
      const computed = window.getComputedStyle(otherRef.current);
      const height =
        otherRef.current.scrollHeight +
        parseInt(computed.getPropertyValue('border-top-width'), 10) +
        parseInt(computed.getPropertyValue('padding-top'), 10) +
        parseInt(computed.getPropertyValue('padding-bottom'), 10) +
        parseInt(computed.getPropertyValue('border-bottom-width'), 10);

      otherRef.current.style.height = height > 250 ? '250px' : `${height}px`;
    }
  }, [otherRef]);

  useEffect(() => {
    adjustTextareaHeight();
  }, [query, adjustTextareaHeight]);

  return (
    <form
      onSubmit={handleSubmit}
      className="items-center w-screen justify-center flex p-4 sm:px-4 sm:py-10"
    >
      <label htmlFor="userInput" className="sr-only">
        Your message
      </label>
      <div className="flex w-full align-center justify-center max-w-3xl items-center rounded-lg bg-gray-170 shadow-2xl">
        <textarea
          disabled={loading}
          onKeyDown={handleEnter}
          ref={otherRef}
          className="flex items-center justify-center w-full text-xs sm:text-sm md:text-base rounded-lg border bg-gray-900 border-gray-700 placeholder-gray-400 text-white focus:outline-none resize-none whitespace-pre-wrap overflow-y-auto"
          autoFocus={false}
          rows={1}
          maxLength={2048}
          id="userInput"
          name="userInput"
          placeholder={
            loading
              ? 'Waiting for response...'
              : error
              ? 'Error occurred. Try again.'
              : 'Your message...'
          }
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="inline-flex justify-center p-2 rounded-full cursor-pointer text-blue-500 hover:text-blue-300"
      >
        {loading ? (
          <></>
        ) : error ? (
          <ExclamationCircleIcon className="h-6 w-6 text-red-500" />
        ) : (
          <PaperAirplaneIcon className="h-6 w-6" />
        )}
      </button>
    </form>
  );
};

export default ChatForm;
