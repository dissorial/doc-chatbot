import React from 'react';
import { useRouter } from 'next/router';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import { PlusCircleIcon } from '@heroicons/react/20/solid';
import Button from '../buttons/Button';
import ListOfChats from './ListOfChats';
import ListOfNamespaces from './ListOfNamespaces';
import SourceDocumentsToggle from './SourceDocumentsToggle';
import ModelTemperature from './ModelTemperature';

interface SidebarListProps {
  selectedNamespace: string;
  returnSourceDocuments: boolean;
  setReturnSourceDocuments: React.Dispatch<React.SetStateAction<boolean>>;
  modelTemperature: number;
  setModelTemperature: React.Dispatch<React.SetStateAction<number>>;
  chatList: string[];
  selectedChatId: string;
  setChatId: (value: string) => void;
  createChat: () => Promise<string>;
  setSelectedChatId: React.Dispatch<React.SetStateAction<string>>;
  nameSpaceHasChats: boolean;
  chatNames: Record<string, string>;
  updateChatName: (chatId: string, newName: string) => void;
  deleteChat: (chatId: string) => void;
  namespaces: string[];
  setSelectedNamespace: React.Dispatch<React.SetStateAction<string>>;
}

const SidebarList: React.FC<SidebarListProps> = ({
  selectedNamespace,
  returnSourceDocuments,
  setReturnSourceDocuments,
  modelTemperature,
  setModelTemperature,
  chatList,
  selectedChatId,
  setChatId,
  createChat,
  setSelectedChatId,
  nameSpaceHasChats,
  chatNames,
  updateChatName,
  deleteChat,
  namespaces,
  setSelectedNamespace,
}) => {
  const router = useRouter();
  return (
    <nav className="flex flex-1 flex-col">
      <ul role="list" className="flex flex-1 flex-col gap-y-7">
        <li>
          {selectedNamespace && (
            <div className="space-y-4 mb-6">
              <SourceDocumentsToggle
                checked={returnSourceDocuments}
                setReturnSourceDocuments={setReturnSourceDocuments}
              />

              <ModelTemperature
                modelTemperature={modelTemperature}
                setModelTemperature={setModelTemperature}
              />

              <Button
                buttonType="primary"
                buttonText="New chat"
                onClick={async () => {
                  const newChatId = await createChat();
                  setChatId(newChatId);
                  setSelectedChatId(newChatId);
                }}
                icon={PlusCircleIcon}
              />
            </div>
          )}

          {/* desktop */}
          {selectedNamespace && nameSpaceHasChats ? (
            <ListOfChats
              chatList={chatList}
              selectedChatId={selectedChatId}
              setChatId={setChatId}
              setSelectedChatId={setSelectedChatId}
              chatNames={chatNames}
              updateChatName={updateChatName}
              deleteChat={deleteChat}
            />
          ) : (
            <div className="text-xs font-semibold leading-6 text-red-400">
              {selectedNamespace
                ? 'No chats in this namespace'
                : 'Select a namespace to display chats'}
            </div>
          )}

          {/* desktop */}
        </li>
        {/* desktop */}
        <ListOfNamespaces
          namespaces={namespaces}
          selectedNamespace={selectedNamespace}
          setSelectedNamespace={setSelectedNamespace}
        />
      </ul>

      {/* desktop */}
      <Button
        buttonType="secondary"
        buttonText="Settings"
        onClick={() => router.push('/settings')}
        icon={Cog6ToothIcon}
      />
    </nav>
  );
};

export default SidebarList;
