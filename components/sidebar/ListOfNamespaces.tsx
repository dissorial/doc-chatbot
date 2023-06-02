import React from 'react';
import Link from 'next/link';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const ListOfNamespaces = ({
  namespaces,
  selectedNamespace,
  setSelectedNamespace,
}: {
  namespaces: string[];
  selectedNamespace: string;
  setSelectedNamespace: (namespace: string) => void;
}) => {
  const handleNamespaceClick = (namespace: string) => {
    setSelectedNamespace(namespace);
  };

  return (
    <li>
      <div className="text-xs sm:text-sm text-blue-400 font-semibold leading-6 ">
        Your namespaces
      </div>
      <ul role="list" className="-mx-2 mt-2 space-y-1 px-2">
        {namespaces.map((namespace) => (
          <li key={namespace}>
            <Link
              href={`/namespace/${namespace}`}
              className={classNames(
                namespace === selectedNamespace
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800',
                'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
              )}
              onClick={() => handleNamespaceClick(namespace)}
            >
              <span className="truncate">{namespace}</span>
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
};

export default ListOfNamespaces;
