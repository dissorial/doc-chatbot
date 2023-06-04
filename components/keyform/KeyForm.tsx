import { useState } from 'react';

interface KeyFormProps {
  keyName: string;
  keyValue: string;
  setKeyValue: (key: string) => void;
}

import { CheckIcon } from '@heroicons/react/20/solid';

const KeyForm: React.FC<KeyFormProps> = ({
  keyName,
  keyValue,
  setKeyValue,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setKeyValue(keyValue);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeyValue(event.target.value);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="relative">
        <p className="text-white text-sm font-medium mb-2">
          {keyName.charAt(0).toUpperCase() + keyName.slice(1)}
        </p>
        <div className="relative">
          <input
            type="password"
            value={keyValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={`Enter ${keyName}`}
            className="w-full pr-10 py-3 text-sm text-gray-300 placeholder-gray-500 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {isFocused && (
            <button
              type="submit"
              className="absolute inset-y-0 right-0 flex items-center mr-2 focus:outline-none"
            >
              <CheckIcon className="h-5 w-5 text-green-500 hover:text-green-600 transition-colors duration-200" />
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default KeyForm;
