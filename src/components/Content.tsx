import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useResonance } from '../context/ResonanceContext.js';
import sanitizeHtml from 'sanitize-html';
import { StringEditor } from './StringEditor.js';
import { MarkupEditor } from './MarkupEditor.js';
import { AttributeEditor } from './AttributeEditor.js';

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
  const [markup, setMarkup] = useState(content[attribute] ?? undefined);
  const [inner, setInner] = useState(children);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWaited(true);
    }, 500); // Wait for 500 second before rendering
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (typeof markup === 'string') {
      const sanitized = sanitizeHtml(markup);
      setInner(<span dangerouslySetInnerHTML={{ __html: sanitized }} />);
    }
  }, [markup]);

  return isEditorMode && waited ? (
    <MarkupEditor attribute={attribute} contentName={contentName} updateMarkup={setMarkup}>
      {inner}
    </MarkupEditor>
  ) : (
    inner
  );
};

export type AttributeDetails = {
  type: 'RawString' | 'Number' | 'Image' | 'Url' | 'Color';
  value: string;
};
export const Attributes = ({
  attributes,
  children,
}: {
  attributes: Record<string, AttributeDetails>;
  children: (values: Record<string, string>) => ReactNode;
}) => {
  const context = useContext(ContentContext);
  const content = context.content as Record<string, string>;
  const values = Object.entries(attributes).reduce((acc, [key, details]) => {
    acc[key] = content[key] ? content[key] : details.value;
    return acc;
  }, {} as Record<string, string>);
  const [renderValues, setRenderValues] = useState<Record<string, string>>(values);
  const isEditorMode = context.isEditorMode;

  return (
    <>
      {children(renderValues)}
      {isEditorMode ? (
        <AttributeEditor renderValues={renderValues} setRenderValues={setRenderValues} attributes={attributes} />
      ) : null}
    </>
  );
};
