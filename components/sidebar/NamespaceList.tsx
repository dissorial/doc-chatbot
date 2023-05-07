import React from 'react';
import Link from 'next/link';

import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

interface NamespaceListProps {
  namespaces: string[];
  selectedNamespace: string;
  setSelectedNamespace: (namespace: string) => void;
}

export const NamespaceList: React.FC<NamespaceListProps> = ({
  namespaces,
  selectedNamespace,
  setSelectedNamespace,
}) => {
  return (
    <>
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <h2 className="text-gray-100 mb-4">Your namespaces</h2>
          <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-700">
            {selectedNamespace}
            <ChevronDownIcon
              className="-mr-1 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-2 w-full origin-top-right rounded-md bg-gray-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              {namespaces.map((namespace) => (
                <Menu.Item key={namespace}>
                  <Link href={`/namespace/${namespace}`} key={namespace}>
                    <button
                      className={`block px-4 py-2 text-sm w-full ${
                        namespace === selectedNamespace
                          ? 'bg-gray-800 border-x border-gray-900 text-gray-100'
                          : 'text-gray-300 hover:text-gray-100'
                      }`}
                      onClick={() => setSelectedNamespace(namespace)}
                    >
                      {namespace}
                    </button>
                  </Link>
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
};
