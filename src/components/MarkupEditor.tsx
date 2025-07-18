export const MarkupEditor = ({
  children,
  attribute,
  contentName,
}: {
  children: React.ReactNode;
  attribute: string;
  contentName: string;
}) => {
  // Since we don't want to require loading an entire editor library for
  // users that don't have the ability to actually edit, this editor is
  // actually just a button that the extension can use to open the actual
  // editor
  return (
    <div
      data-resonance-markup-editor
      data-resonance-content-name={contentName}
      data-resonance-content-attribute={attribute}
      className="resonance-markup-editor-trigger resonance-tw-border resonance-tw-border-gray-100 hover:resonance-tw-border-gray-400 focus:resonance-tw-border-gray-600"
      style={{ background: 'transparent', paddingRight: 4, paddingLeft: 4, cursor: 'pointer' }}
    >
      {children}
    </div>
  );
};
