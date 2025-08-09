import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}
export const Button = ({ children, ...args }: ButtonProps) => {
  return (
    <button
      className="restw:px-3! restw:py-1! restw:bg-gray-200! restw:hover:bg-gray-300! restw:rounded-sm! restw:cursor-pointer!"
      {...args}
    >
      {children}
    </button>
  );
};
