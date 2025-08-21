import { ReactNode } from 'react';
import { v4 as uuidV4 } from 'uuid';

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
    <>
      <input
        type="text"
        name={`${attribute}.value`}
        className="restw:p-2! restw:rounded-md! restw:w-full!"
        style={{
          background: 'transparent',
          border: '1px solid rgba(0,0,0,0.7)',
        }}
        defaultValue={children as string}
        data-resonance-content-name={contentName}
        data-resonance-content-attribute={attribute}
      />
      <input type="hidden" name={`${attribute}.name`} value={attribute} />
      <input type="hidden" name={`${attribute}.id`} value={uuidV4()} />
      <input type="hidden" name={`${attribute}.type`} value="RawString" />
    </>
  );
};
