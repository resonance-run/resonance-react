import { useContext } from 'react';
import { ContentContext } from './Content.js';

interface NestedContentProps {
  content: any;
  path: string;
  children: React.ReactNode;
}
export const NestedContent = ({ content, path, children }: NestedContentProps) => {
  const parentContentContext = useContext(ContentContext);

  return (
    <ContentContext.Provider value={{ ...parentContentContext, content, path: `${parentContentContext.path}.${path}` }}>
      {children}
    </ContentContext.Provider>
  );
};
