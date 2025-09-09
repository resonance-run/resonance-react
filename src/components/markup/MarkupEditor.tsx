import { SerializedEditorState } from 'lexical';
import { lazy, Suspense, useRef, useState } from 'react';
import { v4 as uuidV4 } from 'uuid';

import { Button } from '../common/Button.js';

const RichTextEditor = lazy(() => import('./rte/RichTextEditor.js'));

export const MarkupEditor = ({
  children,
  attribute,
  contentName,
  isPreviewMode,
  path,
  updateMarkup,
}: {
  children: React.ReactNode;
  attribute: string;
  contentName: string;
  isPreviewMode: boolean;
  path: string;
  updateMarkup: (html: string) => void;
}) => {
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const [editorState, setEditorState] = useState<{ html: string; value: SerializedEditorState }>();

  const save = () => {
    updateMarkup(editorState.html);
    const event = new Event('change', { bubbles: true });
    hiddenInputRef?.current.dispatchEvent(event);
  };

  const fullAttribute = path ? `${path}.${attribute}` : attribute;
  return (
    <div>
      {isPreviewMode ? (
        children
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
            </div>
          </div>
        </Suspense>
      )}
      {editorState?.value ? (
        <>
          <input
            ref={hiddenInputRef}
            type="hidden"
            name={`${fullAttribute}.value`}
            value={JSON.stringify(editorState.value)}
          />
          <input type="hidden" name={`${fullAttribute}.name`} value={attribute} />
          <input type="hidden" name={`${fullAttribute}.id`} value={uuidV4()} />
          <input type="hidden" name={`${fullAttribute}.type`} value="Copy" />
        </>
      ) : null}
    </div>
  );
};
