import { LinkNode } from '@lexical/link';
import { type InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { EditorState, LexicalEditor, type EditorThemeClasses, type SerializedEditorState } from 'lexical';
import { ReactNode, useRef, useState } from 'react';

import FloatingLinkEditorPlugin from './plugins/FloatingLinkEditorPlugin.js';
import { InitialStatePlugin } from './plugins/InitialStatePlugin.js';
import { ToolbarPlugin } from './plugins/ToolbarPlugin.js';
import { $generateHtmlFromNodes } from '@lexical/html';

interface RichTextEditorProps {
  name: string;
  defaultValue?: string;
  errorMessage?: string;
  children?: ReactNode;
  onChange?: ({ value, html }: { value: SerializedEditorState; html: string }) => void;
}

const theme: EditorThemeClasses = {
  paragraph: 'restw:mb-2!',
  text: {
    strikethrough: 'restw:line-through!',
    bold: 'restw:font-semibold!',
    underline: 'restw:underline!',
    italic: 'restw:italic!',
    underlineStrikethrough: 'restw:line-through!',
    code: 'restw:bg-gray-100! restw:px-1! restw:rounded-sm! restw:font-mono!',
  },
  link: 'restw:text-blue-500!',
  quote: 'restw:border-l-4! restw:border-gray-300! restw:pl-4! restw:text-black/70! restw:my-2!',
  heading: {
    h1: 'restw:font-semibold! restw:text-3xl! restw:mb-2!',
    h2: 'restw:font-semibold! restw:text-2xl! restw:mb-2!',
    h3: 'restw:font-semibold! restw:text-xl! restw:mb-2!',
    h4: 'restw:font-semibold! restw:text-lg! restw:mb-1!',
    h5: 'restw:font-semibold! restw:text-md! restw:mb-1!',
    h6: 'restw:font-semibold! restw:text-gray-600! restw:text-sm! restw:mb-1!',
  },
};

const onError = (error: Error) => {
  console.error('Lexical error:', error);
};

export const RichTextEditor = ({ defaultValue = '', name, children, onChange }: RichTextEditorProps) => {
  const contentEditableRef = useRef<HTMLDivElement>(null);
  const [editorValue, setEditorValue] = useState<string>(defaultValue.trimEnd());
  const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null);
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);
  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  const initialConfig: InitialConfigType = {
    namespace: 'MyEditor',
    theme,
    onError,
    nodes: [LinkNode, HeadingNode, QuoteNode],
  };
  const save = (editorState: EditorState, editor: LexicalEditor) => {
    const html = $generateHtmlFromNodes(editor);
    onChange?.({ html, value: editorState.toJSON() });
  };

  return (
    <div className="lexical-editor restw:relative! restw:rounded-lg! restw:border! restw:border-gray-300">
      <LexicalComposer
        initialConfig={{
          ...initialConfig,
        }}
      >
        <InitialStatePlugin defaultValue={defaultValue} onSetInitialSate={save}>
          {children}
        </InitialStatePlugin>
        <ToolbarPlugin setIsLinkEditMode={setIsLinkEditMode} />
        <div ref={onRef} className="restw:relative!">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="restw:p-4! restw:text-black/90!"
                aria-placeholder={'Enter some text...'}
                data-testid={`${name}-editor`}
                ref={contentEditableRef}
                placeholder={
                  <div
                    className="restw:absolute! restw:top-4! restw:left-4! restw:text-black/30!"
                    onClick={() => contentEditableRef?.current.focus()}
                  >
                    Add content...
                  </div>
                }
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
        <HistoryPlugin />
        <LinkPlugin />
        <OnChangePlugin
          onChange={(editorState, editor) => {
            editor.update(() => save(editorState, editor), { discrete: true });
            setEditorValue(JSON.stringify(editorState.toJSON()));
          }}
        />
        {floatingAnchorElem ? (
          <FloatingLinkEditorPlugin isLinkEditMode={isLinkEditMode} setIsLinkEditMode={setIsLinkEditMode} />
        ) : null}
      </LexicalComposer>
    </div>
  );
};

export default RichTextEditor;
