import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, EditorState, LexicalEditor } from 'lexical';
import { $generateNodesFromDOM } from '@lexical/html';
import { ReactNode, useEffect, useRef, useState } from 'react';

export const InitialStatePlugin = ({
  defaultValue,
  onSetInitialSate,
  children,
}: {
  defaultValue: string;
  onSetInitialSate: (editorState: EditorState, editor: LexicalEditor) => void;
  children: ReactNode;
}) => {
  const initialStateRef = useRef<HTMLDivElement>(null);
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (isFirstRender) {
      try {
        // If valid JSON, parse it to create the initial state
        const initialState = editor.parseEditorState(defaultValue);
        editor.setEditorState(initialState);
        setIsFirstRender(false);
        onSetInitialSate(editor.getEditorState(), editor);
      } catch {
        editor.update(() => {
          if (!initialStateRef.current) {
            return;
          }
          const parser = new DOMParser();
          const dom = parser.parseFromString(initialStateRef.current.innerHTML, 'text/html');
          const nodes = $generateNodesFromDOM(editor, dom);
          const root = $getRoot();
          root.clear();
          root.append(...nodes);
          setIsFirstRender(false);
        });
      }
    }
  }, [isFirstRender, initialStateRef.current]);
  return (
    <div ref={initialStateRef} style={{ display: 'none' }}>
      {children}
    </div>
  );
};
