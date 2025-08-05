import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useResonance } from '../context/ResonanceContext.js';
import sanitizeHtml from 'sanitize-html';
import { StringEditor } from './StringEditor.js';
import { MarkupEditor } from './MarkupEditor.js';

type ContentProps = {
  children: ReactNode;
  contentName: string;
};

const ContentContext = createContext<{
  content: Record<string, string | number | boolean>;
  isEditorMode: boolean;
  contentName: string;
}>({ content: {}, isEditorMode: false, contentName: '' });

export const Content = ({ children, contentName }: ContentProps): React.ReactNode => {
  const context = useResonance();
  const content = context.contentValues[contentName] ?? {};
  const isEditorMode = context.isEditorMode;
  return <ContentContext.Provider value={{ content, isEditorMode, contentName }}>{children}</ContentContext.Provider>;
};

export const String = ({ attribute, children }: { attribute: string; children: React.ReactNode }): React.ReactNode => {
  const { content, contentName, isEditorMode } = useContext(ContentContext);
  const [waited, setWaited] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWaited(true);
    }, 500); // Wait for 500 second before rendering
    return () => clearTimeout(timer);
  }, []);
  const inner = content[attribute] ? content[attribute] : children;
  return isEditorMode && waited ? (
    <StringEditor attribute={attribute} contentName={contentName}>
      {inner}
    </StringEditor>
  ) : (
    inner
  );
};

export const Markup = ({ attribute, children }: { attribute: string; children: ReactNode }): React.ReactNode => {
  const { content, isEditorMode, contentName } = useContext(ContentContext);
  const [waited, setWaited] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWaited(true);
    }, 500); // Wait for 500 second before rendering
    return () => clearTimeout(timer);
  }, []);
  const markup = content[attribute];
  let inner = children;
  if (typeof markup === 'string') {
    const sanitized = sanitizeHtml(markup);
    inner = <span dangerouslySetInnerHTML={{ __html: sanitized }} />;
  }
  return isEditorMode && waited ? (
    <MarkupEditor attribute={attribute} contentName={contentName}>
      {inner}
    </MarkupEditor>
  ) : (
    inner
  );
};

export const Attributes = ({
  attributes,
  children,
}: {
  attributes: Record<string, string>;
  children: (values: Record<string, string>) => ReactNode;
}) => {
  const context = useContext(ContentContext);
  const content = context.content as Record<string, string>;
  const values = Object.entries(attributes).reduce((acc, [key, value]) => {
    acc[key] = content[key] ? content[key] : value;
    return acc;
  }, {} as Record<string, string>);
  return <>{children(values)}</>;
};
