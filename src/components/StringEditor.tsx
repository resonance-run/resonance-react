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
      className="resonance-tw-border resonance-tw-border-gray-100 hover:resonance-tw-border-gray-400 focus:resonance-tw-border-gray-600"
      style={{ background: 'transparent', paddingRight: 4, paddingLeft: 4 }}
      defaultValue={children as string}
      data-resonance-content-name={contentName}
      data-resonance-content-attribute={attribute}
    />
  );
};
