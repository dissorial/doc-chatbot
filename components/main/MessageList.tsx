import React from 'react';
import ReactMarkdown from 'react-markdown';
import { LoadingDots } from '@/components/other';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/other/accordion/Accordion';
import remarkGfm from 'remark-gfm';
import { Message } from '@/types';

interface MessageListProps {
  messages: Message[];
  loading: boolean;
  messageListRef: React.RefObject<HTMLDivElement>;
}

function MessageList({ messages, loading, messageListRef }: MessageListProps) {
  return (
    <>
      <div className="overflow-y-auto">
        <div ref={messageListRef}>
          {messages.map((message, index) => {
            const isApiMessage = message.type === 'apiMessage';
            const messageClasses = ` ${
              isApiMessage ? 'bg-gray-700/50' : 'bg-gray-800'
            }`;

            return (
              <div key={`chatMessage-${index}`} className={messageClasses}>
                <div className="flex items-center justify-start max-w-full sm:max-w-4xl  mx-auto overflow-hidden px-2 sm:px-4">
                  <div className="flex flex-col w-full">
                    <div className="w-full text-gray-300 p-2 sm:p-4 overflow-wrap break-words">
                      <span
                        className={`mt-2 inline-flex items-center rounded-md px-2 py-1 text-xs sm:text-sm font-medium ring-1 ring-inset ${
                          isApiMessage
                            ? 'bg-indigo-400/10 text-indigo-400 ring-indigo-400/30'
                            : 'bg-purple-400/10 text-purple-400 ring-purple-400/30'
                        }`}
                      >
                        {isApiMessage ? 'AI' : 'YOU'}
                      </span>
                      <div className="mx-auto max-w-full">
                        <ReactMarkdown
                          linkTarget="_blank"
                          className="markdown text-xs sm:text-sm md:text-base leading-relaxed"
                          remarkPlugins={[remarkGfm]}
                        >
                          {message.message}
                        </ReactMarkdown>
                      </div>
                    </div>
                    {message.sourceDocs && (
                      <div
                        className="mt-4 mx-2 sm:mx-4"
                        key={`sourceDocsAccordion-${index}`}
                      >
                        <Accordion
                          type="single"
                          collapsible
                          className="flex flex-col"
                        >
                          {message.sourceDocs.map((doc, docIndex) => (
                            <div
                              key={`messageSourceDocs-${docIndex}`}
                              className="mb-6 px-4 py-0 sm:py-1 bg-gray-700 rounded-lg shadow-md"
                            >
                              <AccordionItem value={`item-${docIndex}`}>
                                <AccordionTrigger>
                                  <h3 className="text-xs sm:text-sm md:text-base text-white">
                                    Source {docIndex + 1}
                                  </h3>
                                </AccordionTrigger>
                                <AccordionContent className="mt-2 overflow-wrap break-words">
                                  <ReactMarkdown
                                    linkTarget="_blank"
                                    className="markdown text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed"
                                    remarkPlugins={[remarkGfm]}
                                  >
                                    {doc.pageContent.replace(
                                      /(?<=\S)\n/g,
                                      '  \n',
                                    )}
                                  </ReactMarkdown>
                                </AccordionContent>
                              </AccordionItem>
                            </div>
                          ))}
                        </Accordion>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {loading && (
        <div className="flex items-center justify-center h-32 w-full bg-gray-700/50">
          <div className="flex-shrink-0 p-1">
            <LoadingDots color="#04d9ff" />
          </div>
        </div>
      )}
    </>
  );
}

export default MessageList;
