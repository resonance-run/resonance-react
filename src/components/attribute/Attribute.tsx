import { lazy, ReactNode, useContext, useState } from 'react';
import { ContentContext } from '../Content.js';

const AttributeEditor = lazy(() => import('./AttributeEditor.js'));

export type AttributeType = 'RawString' | 'Number' | 'Image' | 'Url' | 'Color';
export type AttributeDetails = {
  type: AttributeType;
  value: string;
};
export const Attributes = ({
  attributes,
  children,
}: {
  attributes: Record<string, AttributeDetails>;
  children: (values: Record<string, string>) => ReactNode;
}): React.ReactNode => {
  const context = useContext(ContentContext);
  const content = context.content as Record<string, string>;
  const [attributesWithOverrides, setAttributes] = useState<Record<string, AttributeDetails>>(
    Object.entries(attributes).reduce((acc, [key, details]) => {
      acc[key] = {
        ...details,
        value: content[key] ? content[key] : details.value,
      };
      return acc;
    }, {} as Record<string, AttributeDetails>)
  );
  const isEditorMode = context.isEditorMode;
  const isPreviewMode = context.isPreviewMode;
  const setAttributeValue = (key: string, value: string) => {
    setAttributes(prev => ({
      ...prev,
      [key]: { ...prev[key], value },
    }));
  };

  return isEditorMode && !isPreviewMode ? (
    <AttributeEditor path={context.path} attributes={attributesWithOverrides} setAttribute={setAttributeValue}>
      {children(
        Object.entries(attributesWithOverrides).reduce((res, [key, details]) => {
          res[key] = details.value;
          return res;
        }, {} as Record<string, string>)
      )}
    </AttributeEditor>
  ) : (
    children(
      Object.entries(attributesWithOverrides).reduce((res, [key, details]) => {
        res[key] = details.value;
        return res;
      }, {} as Record<string, string>)
    )
  );
};
