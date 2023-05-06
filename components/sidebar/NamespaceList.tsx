import React from 'react';
import Link from 'next/link';

interface NamespaceListProps {
  namespaces: string[];
  selectedNamespace: string;
  setSelectedNamespace: (namespace: string) => void;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export const NamespaceList: React.FC<NamespaceListProps> = ({
  namespaces,
  selectedNamespace,
  setSelectedNamespace,
}) => {
  return (
    <li>
      <div className="text-md font-semibold text-gray-200 leading-6">
        Your namespaces
      </div>
      <ul role="list" className="mt-2 space-y-1">
        {namespaces.map((namespace) => (
          <Link href={`/namespace/${namespace}`} key={namespace}>
            <button
              className={classNames(
                namespace === selectedNamespace
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800',
                'group flex gap-x-3 rounded-md py-2 px-4 text-sm leading-6 font-semibold w-full',
              )}
              onClick={() => setSelectedNamespace(namespace)}
            >
              {namespace}
            </button>
          </Link>
        ))}
      </ul>
    </li>
  );
};
