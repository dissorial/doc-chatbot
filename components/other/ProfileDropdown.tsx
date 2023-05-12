import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import Image from 'next/image';
import { ChevronDoubleDownIcon } from '@heroicons/react/20/solid';

const ProfileDropdown = ({
  userName,
  userImage,
  signOut,
}: {
  userName: string;
  userImage: string;
  signOut: () => void;
}) => {
  return (
    <Menu as="div" className="relative  px-2 py-1">
      <Menu.Button className="-m-1.5 flex items-center p-1.5">
        <span className="sr-only">Open user menu</span>
        <Image
          className="h-8 sm:h-10 w-8 sm:w-10 object-cover rounded-full bg-gray-50"
          src={userImage}
          alt=""
          width={30}
          height={30}
        />
        <span className="hidden lg:flex lg:items-center">
          <span
            className="ml-4 text-sm font-semibold leading-6 text-gray-100
                          whitespace-nowrap
                        "
            aria-hidden="true"
          >
            {userName}
          </span>
          <ChevronDoubleDownIcon
            className="mx-2 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </span>
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-gray-800 hover:bg-gray-800/90 py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
          <Menu.Item>
            <button
              onClick={signOut}
              className="block px-3 py-1 w-full text-sm leading-6 text-gray-100"
            >
              Sign out
            </button>
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default ProfileDropdown;
