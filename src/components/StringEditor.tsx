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
      style={{
        background: 'transparent',
        padding: '4px',
        border: '1px solid rgba(0,0,0,0.7)',
        borderRadius: 4,
      }}
      defaultValue={children as string}
      data-resonance-content-name={contentName}
      data-resonance-content-attribute={attribute}
    />
  );
};
