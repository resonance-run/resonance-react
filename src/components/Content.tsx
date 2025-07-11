import { createContext, ReactNode, useContext } from 'react';
import { useResonance } from '../context/ResonanceContext.js';
import DOMPurify from 'dompurify';

type ContentProps = {
  children: ReactNode;
  contentName: string;
};

const ContentContext = createContext({});

export const Content = ({ children, contentName }: ContentProps): React.ReactNode => {
  const context = useResonance();
  const content = context.contentValues[contentName] ?? {};
  return (
    <ContentContext.Provider value={content}>
      {context.isEditorMode ? <div className="resonance-content-editor">{children}</div> : children}
    </ContentContext.Provider>
  );
};

export const String = ({ attribute, children }: { attribute: string; children: ReactNode }) => {
  const content = useContext(ContentContext);
  return content[attribute] ? content[attribute] : children;
};

export const Markup = ({ attribute, children }: { attribute: string; children: ReactNode }): React.ReactNode => {
  const content = useContext(ContentContext);
  const markup = content[attribute];
  if (typeof markup === 'string') {
    const sanitized = DOMPurify.sanitize(markup);
    return <span dangerouslySetInnerHTML={{ __html: sanitized }} />;
  }
  return children;
};

export const Attributes = ({
  attributes,
  children,
}: {
  attributes: Record<string, string>;
  children: (values: Record<string, string>) => ReactNode;
}) => {
  const content = useContext(ContentContext);
  const values = Object.entries(attributes).reduce((acc, [key, value]) => {
    acc[key] = content[key] ? content[key] : value;
    return acc;
  }, {} as Record<string, string>);
  return <>{children(values)}</>;
};
