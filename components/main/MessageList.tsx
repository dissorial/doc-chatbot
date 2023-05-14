import React from 'react';
import ReactMarkdown from 'react-markdown';
import LoadingDots from '@/components/other/LoadingDots';
import { CodeBracketSquareIcon } from '@heroicons/react/24/solid';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/other/Accordion';
import Image from 'next/image';
import remarkGfm from 'remark-gfm';
import { Message } from '@/types';

interface MessageListProps {
  messages: Message[];
  loading: boolean;
  messageListRef: React.RefObject<HTMLDivElement>;
  userImage?: string | null;
  userName?: string | null;
}

function MessageList({
  messages,
  loading,
  messageListRef,
  userImage,
  userName,
}: MessageListProps) {
  console.log(messages);
  return (
    <>
      <div className="overflow-y-auto">
        <div ref={messageListRef}>
          {messages.map((message, index) => {
            return (
              <div
                key={`chatMessage-${index}`}
                className={` ${
                  message.type === 'apiMessage'
                    ? 'bg-gray-700/50'
                    : 'bg-gray-800/90'
                }`}
              >
                <div className="flex items-center justify-start max-w-full sm:max-w-4xl  mx-auto overflow-hidden px-2 sm:px-4">
                  {/* user and bot image */}
                  {/* {message.type === 'apiMessage' ? (
                    <div className="flex-shrink-0 p-1">
                      <CodeBracketSquareIcon className="h-8 sm:h-10 w-8 sm:w-10 text-white rounded-full object-cover mr-2 sm:mr-3" />
                    </div>
                  ) : (
                    <div className="flex-shrink-0 p-1">
                      <Image
                        src={userImage || '/images/user.png'}
                        alt=""
                        width={30}
                        height={30}
                        className="h-8 sm:h-10 w-8 sm:w-10 rounded-full object-cover mr-2 sm:mr-3"
                      />
                    </div>
                  )} */}
                  {/* user and bot image */}
                  <div className="flex flex-col w-full ">
                    <div className="w-full text-gray-300 p-2 sm:p-4 overflow-wrap break-words">
                      <span
                        className={`mt-2 inline-flex items-center rounded-md px-2 py-1 text-xs sm:text-sm font-medium ring-1 ring-inset ${
                          message.type === 'apiMessage'
                            ? 'bg-indigo-400/10 text-indigo-400 ring-indigo-400/30'
                            : 'bg-purple-400/10 text-purple-400 ring-purple-400/30'
                        }`}
                      >
                        {message.type === 'apiMessage'
                          ? 'pdf-chatbot'
                          : userName}
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
                        className="mt-4 mx-2 sm:mx-4 "
                        key={`sourceDocsAccordion-${index}`}
                      >
                        <Accordion
                          type="single"
                          collapsible
                          className="flex flex-col"
                        >
                          {message.sourceDocs.map((doc, index) => (
                            <div
                              key={`messageSourceDocs-${index}`}
                              className="mb-6 px-4 py-0 sm:py-1 bg-gray-700 rounded-lg shadow-md"
                            >
                              <AccordionItem value={`item-${index}`}>
                                <AccordionTrigger>
                                  <h3 className="text-xs sm:text-sm md:text-base text-white">
                                    Source {index + 1}
                                  </h3>
                                </AccordionTrigger>
                                <AccordionContent className="mt-2 overflow-wrap break-words">
                                  <ReactMarkdown
                                    linkTarget="_blank"
                                    className="markdown text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed"
                                    remarkPlugins={[remarkGfm]}
                                  >
                                    {/* {doc.pageContent} */}
                                    {doc.pageContent.replace(
                                      /(?<=\S)\n/g,
                                      '  \n',
                                    )}
                                  </ReactMarkdown>
                                  {/* <p className="mt-2">
                                    <b>Source:</b>{' '}
                                    {doc.metadata.source.match(
                                      /[^\\]*$/,
                                    )?.[0] ?? doc.metadata.source}
                                  </p> */}
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
        <div className="flex items-center justify-center h-32 w-full bg-gradient-to-b from-gray-900 via-gray-900/70 to-gray-800/30">
          <div className="flex-shrink-0 p-1">
            <LoadingDots color="#04d9ff" />
          </div>
        </div>
      )}
    </>
  );
}

export default MessageList;
