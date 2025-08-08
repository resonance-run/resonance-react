import { ReactNode } from 'react';

export const StringEditor = ({
  children,
  attribute,
  contentName,
  isPreviewMode,
}: {
  attribute: string;
  contentName: string;
  children: ReactNode;
  isPreviewMode: boolean;
}) => {
  return isPreviewMode ? (
    children
  ) : (
    <input
      type="text"
      name={attribute}
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
