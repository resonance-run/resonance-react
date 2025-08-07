import { SerializedEditorState } from 'lexical';
import { lazy, Suspense, useState } from 'react';

const RichTextEditor = lazy(() => import('./rte/RichTextEditor.js'));

export const MarkupEditor = ({
  children,
  attribute,
  contentName,
  updateMarkup,
}: {
  children: React.ReactNode;
  attribute: string;
  contentName: string;
  updateMarkup: (html: string) => void;
}) => {
  const [showMarkupEditor, setShowMarkupEditor] = useState(false);
  const [editorState, setEditorValue] = useState<{ html: string; value: SerializedEditorState }>();

  const save = () => {
    updateMarkup(editorState.html);
    setShowMarkupEditor(false);
  };
  return (
    <div>
      {!showMarkupEditor ? (
        <div
          onClick={() => setShowMarkupEditor(!showMarkupEditor)}
          data-resonance-markup-editor
          data-resonance-content-name={contentName}
          data-resonance-content-attribute={attribute}
          className="resonance-markup-editor-trigger"
          style={{
            background: 'transparent',
            border: '1px solid rgba(0,0,0,0.7)',
            padding: '2px 4px',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          {children}
        </div>
      ) : (
        <Suspense fallback={<div>Loading editor...</div>}>
          <div>
            <RichTextEditor name={contentName} onChange={setEditorValue}>
              {children}
            </RichTextEditor>
            <div className="restw:flex! restw:gap-2! restw:mt-2!">
              <button
                className="restw:px-3! restw:py-1! restw:bg-gray-200! restw:hover:bg-gray-300! restw:rounded-sm! restw:cursor-pointer!"
                onClick={() => save()}
              >
                Save
              </button>
              <button
                className="restw:px-3! restw:py-1! restw:bg-gray-200! restw:hover:bg-gray-300! restw:rounded-sm! restw:cursor-pointer!"
                onClick={() => setShowMarkupEditor(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </Suspense>
      )}
    </div>
  );
};
