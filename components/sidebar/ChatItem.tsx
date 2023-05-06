import React from 'react';
import { TrashIcon } from '@heroicons/react/24/solid';

interface ChatItemProps {
  name: string;
  onRemove: () => void;
}

export default function ChatItem({ name, onRemove }: ChatItemProps) {
  return (
    <div className="flex items-center justify-between py-4 px-6 cursor-pointer rounded-md hover:bg-gray-800">
      <span className="font-medium text-gray-100">{name}</span>
      <button onClick={onRemove}>
        <TrashIcon className="w-5 h-5 text-gray-100 hover:text-red-500 cursor-pointer" />
      </button>
    </div>
  );
}
