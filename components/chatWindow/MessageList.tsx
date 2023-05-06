import React from 'react';
import ReactMarkdown from 'react-markdown';

function MessageList({ messages, loading, messageListRef }) {
  return (
    <div className="flex-grow flex-shrink-0 overflow-y-auto">
      <div ref={messageListRef} className="flex flex-col gap-4 p-4">
        {messages.map((message, index) => {
          let className;
          if (message.type === 'apiMessage') {
            className = 'bg-blue-900 text-gray-200 self-end';
          } else {
            className =
              loading && index === messages.length - 1
                ? 'bg-gray-800 text-gray-400 self-start'
                : 'bg-gray-700 text-gray-200 self-start';
          }
          return (
            <div
              key={`chatMessage-${index}`}
              className={`rounded-md py-2 px-4 shadow-md max-w-2xl ${className}`}
            >
              <ReactMarkdown linkTarget="_blank">
                {message.message}
              </ReactMarkdown>
            </div>
          );
        })}
      </div>
      <style jsx>
        {`
          .overflow-y-auto {
            scrollbar-width: thin;
            scrollbar-color: rgba(107, 114, 128, 0.45) rgba(229, 231, 235, 0.1);
          }
          .overflow-y-auto::-webkit-scrollbar {
            width: 5px;
          }
          .overflow-y-auto::-webkit-scrollbar-track {
            background: rgba(229, 231, 235, 0.1);
          }
          .overflow-y-auto::-webkit-scrollbar-thumb {
            background-color: rgba(107, 114, 128, 0.45);
            border-radius: 9999px;
          }
        `}
      </style>
    </div>
  );
}

export default MessageList;
