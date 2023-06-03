import React, { ReactElement } from 'react';

interface ButtonProps {
  buttonType?: 'primary' | 'secondary';
  onClick?: () => void;
  buttonText: string;
  icon?: any;
}

const Button = ({
  buttonType,
  onClick,
  buttonText,
  icon: Icon,
}: ButtonProps): ReactElement => {
  let buttonClassName =
    'inline-flex items-center gap-x-2 rounded-md px-3.5 py-2.5 text-sm font-semibold shadow-sm w-full';

  if (buttonType === 'primary') {
    buttonClassName +=
      ' bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600';
  } else if (buttonType === 'secondary') {
    buttonClassName +=
      ' bg-gray-800 text-gray-400 hover:bg-gray-800 hover:text-white';
  }

  return (
    <button type="button" className={buttonClassName} onClick={onClick}>
      {Icon && <Icon className="h-5 w-5" />}
      {buttonText}
    </button>
  );
};

export default Button;
