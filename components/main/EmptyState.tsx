import React from 'react';
import Button from '../buttons/Button';
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
      <h1 className="text-xl md:text-3xl text-center font-semibold text-gray-100 mb-4">
        {!userHasNamespaces
          ? noNamespacesMessage
          : selectedNamespace && !nameSpaceHasChats
          ? 'Create a new chat to get started.'
          : selectNamespaceMessage}
      </h1>
      {!userHasNamespaces && (
        <div>
          <Button
            buttonType="primary"
            buttonText="Create a namespace"
            onClick={() => router.push('/settings')}
          />
        </div>
      )}
    </div>
  );
};

export default EmptyState;
