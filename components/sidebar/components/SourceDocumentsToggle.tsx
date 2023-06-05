import React from 'react';
import { Switch } from '@headlessui/react';
import { classNames } from '@/utils/classNames';

interface SourceDocumentsToggleProps {
  checked: boolean;
  setReturnSourceDocuments: React.Dispatch<React.SetStateAction<boolean>>;
}

const SourceDocumentsToggle: React.FC<SourceDocumentsToggleProps> = ({
  checked,
  setReturnSourceDocuments,
}) => {
  return (
    <Switch.Group
      as="div"
      className="flex flex-row items-center justify-between align-center"
    >
      <span className="flex flex-col">
        <Switch.Label
          as="span"
          className="text-xs sm:text-sm font-medium leading-6 text-blue-400"
          passive
        >
          Include source documents
        </Switch.Label>
      </span>

      <Switch
        checked={checked}
        onChange={(value) => {
          setReturnSourceDocuments(value);
        }}
        className={classNames(
          checked ? 'bg-indigo-600' : 'bg-gray-200',
          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2',
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            checked ? 'translate-x-5' : 'translate-x-0',
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
          )}
        />
      </Switch>
    </Switch.Group>
  );
};

export default SourceDocumentsToggle;
