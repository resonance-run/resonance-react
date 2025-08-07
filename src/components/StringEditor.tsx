import { ReactNode } from 'react';

export const StringEditor = ({
  children,
  attribute,
  contentName,
}: {
  attribute: string;
  contentName: string;
  children: ReactNode;
}) => {
  return (
    <input
      type="text"
      name={`${contentName}.${attribute}`}
      className="restw:p-2! restw:rounded-md! restw:w-full!"
      style={{
        background: 'transparent',
        border: '1px solid rgba(0,0,0,0.7)',
      }}
      defaultValue={children as string}
      data-resonance-content-name={contentName}
      data-resonance-content-attribute={attribute}
    />
  );
};
