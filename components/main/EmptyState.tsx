import React from 'react';
import { useRouter } from 'next/router';
interface EmptyStateProps {
  nameSpaceHasChats: boolean;
  selectedNamespace: string;
  userHasNamespaces: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  nameSpaceHasChats,
  selectedNamespace,
  userHasNamespaces,
}) => {
  const router = useRouter();

  const selectNamespaceMessage = 'Select a namespace to display chats';
  const noNamespacesMessage = 'You currently have no namespaces.';

  return (
    <div className="flex flex-col justify-center px-4 pt-24">
      <h1 className="text-xl md:text-3xl text-center font-semibold text-gray-100 mb-6">
        {!userHasNamespaces
          ? noNamespacesMessage
          : selectedNamespace && !nameSpaceHasChats
          ? 'Create a new chat to get started.'
          : selectNamespaceMessage}
      </h1>
      {!userHasNamespaces && (
        <div className="flex justify-center">
          <button
            type="button"
            className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            onClick={() => router.push('/settings')}
          >
            Create a namespace
          </button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
