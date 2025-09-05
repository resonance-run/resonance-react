import { useContext, useEffect, useState } from 'react';

import { ContentContext } from '../Content.js';
import { StringEditor } from './StringEditor.js';

export const String = ({ attribute, children }: { attribute: string; children: React.ReactNode }): React.ReactNode => {
  const { content, contentName, path, isEditorMode, isPreviewMode } = useContext(ContentContext);
  const [waited, setWaited] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWaited(true);
    }, 500); // Wait for 500 second before rendering
    return () => clearTimeout(timer);
  }, []);
  const inner = content[attribute] ? content[attribute] : children;
  return isEditorMode && waited ? (
    <StringEditor attribute={attribute} path={path} contentName={contentName} isPreviewMode={isPreviewMode}>
      {inner}
    </StringEditor>
  ) : (
    inner
  );
};
