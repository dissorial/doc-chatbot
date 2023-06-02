import React from 'react';

interface EmptyStateProps {
  nameSpaceHasChats: boolean;
  selectedNamespace: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  nameSpaceHasChats,
  selectedNamespace,
}) => {
  const noChatsMessage = !nameSpaceHasChats
    ? 'You have no chats in this namespace. Create a new chat to get started.'
    : 'You have no chats. Create a new chat to get started.';

  const selectNamespaceMessage = 'Select a namespace to display chats';

  return (
    <div className="flex flex-col items-center justify-center align-center h-screen px-4">
      <h1 className="text-xl md:text-3xl text-center font-semibold text-gray-100">
        Welcome to doc-chatbot
      </h1>
      <p className="text-md md:text-xl text-center text-gray-100 mt-4">
        {selectedNamespace ? noChatsMessage : selectNamespaceMessage}
      </p>
    </div>
  );
};

export default EmptyState;
