import { ReactNode, useContext, useEffect, useState } from 'react';
import sanitizeHtml from 'sanitize-html';

import { ContentContext } from '../Content.js';
import { MarkupEditor } from './MarkupEditor.js';

export const Markup = ({ attribute, children }: { attribute: string; children: ReactNode }): React.ReactNode => {
  const { content, isEditorMode, contentName, path, isPreviewMode } = useContext(ContentContext);
  const [waited, setWaited] = useState<boolean>(false);
  const [markup, setMarkup] = useState(content[attribute] ?? undefined);
  const [inner, setInner] = useState(typeof children === 'string' ? '' : children);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWaited(true);
    }, 500); // Wait for 500 second before rendering
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (typeof markup === 'string') {
      const sanitized = sanitizeHtml(markup);
      setInner(<div dangerouslySetInnerHTML={{ __html: sanitized }} />);
    }
  }, [markup]);

  const fullAttribute = path ? `${path}.${attribute}` : attribute;
  return isEditorMode && waited ? (
    <MarkupEditor
      attribute={fullAttribute}
      contentName={contentName}
      updateMarkup={setMarkup}
      isPreviewMode={isPreviewMode}
    >
      {inner}
    </MarkupEditor>
  ) : (
    inner
  );
};
