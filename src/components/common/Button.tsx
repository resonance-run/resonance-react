import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}
export const Button = ({ children, ...args }: ButtonProps) => {
  return (
    <button
      className="restw:px-3! restw:py-1! restw:bg-gray-200! restw:text-black/90! restw:hover:bg-gray-300! restw:rounded-sm! restw:cursor-pointer! restw:disabled:restw:bg-gray-400! restw:disabled:restw:cursor-not-allowed!"
      {...args}
    >
      {children}
    </button>
  );
};
