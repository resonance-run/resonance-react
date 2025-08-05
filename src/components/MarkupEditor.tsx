import { lazy, Suspense, useState } from 'react';

const RichTextEditor = lazy(() => import('./rte/RichTextEditor.js'));

export const MarkupEditor = ({
  children,
  attribute,
  contentName,
}: {
  children: React.ReactNode;
  attribute: string;
  contentName: string;
}) => {
  const [showMarkupEditor, setShowMarkupEditor] = useState(false);
  return (
    <div>
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
      {showMarkupEditor ? (
        <Suspense fallback={<div>Loading editor...</div>}>
          <RichTextEditor name={contentName}>{children}</RichTextEditor>
        </Suspense>
      ) : null}
    </div>
  );
};
