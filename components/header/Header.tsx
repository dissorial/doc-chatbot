import React from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import ProfileDropdown from '../other/ProfileDropdown';
import { signOut } from 'next-auth/react';

interface HeaderProps {
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userImage: string;
  userName: string;
}

const Header: React.FC<HeaderProps> = ({
  setSidebarOpen,
  userImage,
  userName,
}) => {
  const defaultUserImage = '/images/user.png';
  const defaultUserName = 'User';

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-800 bg-gray-900 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 items-center">
        <span className="w-full text-center items-center rounded-md bg-blue-400/10 px-2 py-1 text-xs sm:text-sm md:text-md md:text-lg font-medium text-blue-400 ring-1 ring-inset ring-pink-blue/30">
          DOC CHATBOT
        </span>

        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <div
            className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
            aria-hidden="true"
          />
          <ProfileDropdown
            userImage={userImage || defaultUserImage}
            userName={userName || defaultUserName}
            signOut={signOut}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
