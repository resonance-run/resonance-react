import { SerializedEditorState } from 'lexical';
import { lazy, Suspense, useRef, useState } from 'react';
import { Button } from './common/Button.js';

const RichTextEditor = lazy(() => import('./rte/RichTextEditor.js'));

export const MarkupEditor = ({
  children,
  attribute,
  contentName,
  isPreviewMode,
  updateMarkup,
}: {
  children: React.ReactNode;
  attribute: string;
  contentName: string;
  isPreviewMode: boolean;
  updateMarkup: (html: string) => void;
}) => {
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const [showMarkupEditor, setShowMarkupEditor] = useState(false);
  const [editorState, setEditorState] = useState<{ html: string; value: SerializedEditorState }>();

  const save = () => {
    updateMarkup(editorState.html);
    setShowMarkupEditor(false);
    const event = new Event('change', { bubbles: true });
    hiddenInputRef?.current.dispatchEvent(event);
  };
  return (
    <div>
      {isPreviewMode ? (
        children
      ) : !showMarkupEditor ? (
        <div
          onClick={() => setShowMarkupEditor(!showMarkupEditor)}
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
            <RichTextEditor name={contentName} onChange={setEditorState}>
              {children}
            </RichTextEditor>
            <div className="restw:flex! restw:gap-2! restw:mt-2!">
              <Button type="button" onClick={() => save()}>
                Save
              </Button>
              <Button type="button" onClick={() => setShowMarkupEditor(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Suspense>
      )}
      {editorState?.value ? (
        <input ref={hiddenInputRef} type="hidden" name={attribute} value={JSON.stringify(editorState.value)} />
      ) : null}
    </div>
  );
};
