import { ReactNode } from 'react';
import { v4 as uuidV4 } from 'uuid';

export const StringEditor = ({
  children,
  attribute,
  path,
  contentName,
  isPreviewMode,
}: {
  children: ReactNode;
  attribute: string;
  path: string;
  contentName: string;
  isPreviewMode: boolean;
}) => {
  const fullAttribute = path ? `${path}.${attribute}` : attribute;
  return isPreviewMode ? (
    children
  ) : (
    <>
      <input
        type="text"
        name={`${fullAttribute}.value`}
        className="restw:p-2! restw:rounded-md! restw:w-full!"
        style={{
          background: 'transparent',
          border: '1px solid rgba(0,0,0,0.7)',
        }}
        defaultValue={children as string}
      />
      <input type="hidden" name={`${fullAttribute}.name`} value={attribute} />
      <input type="hidden" name={`${fullAttribute}.id`} value={uuidV4()} />
      <input type="hidden" name={`${fullAttribute}.type`} value="RawString" />
    </>
  );
};
