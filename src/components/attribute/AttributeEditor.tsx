import { Children, cloneElement, isValidElement, ReactElement, ReactNode, useState } from 'react';
import { Button } from '../common/Button.js';
import { v4 } from 'uuid';
import { AttributeDetails, AttributeType } from './Attribute.js';
import { ImageInput } from './ImageInput.js';

interface AttributeEditorProps {
  attributes: Record<string, AttributeDetails>;
  children: ReactNode;
  path: string;
  setAttribute: (key: string, value: string) => void;
}
export const AttributeEditor = ({ attributes, path, children, setAttribute }: AttributeEditorProps) => {
  const saveAttr = (key, val) => {
    setAttribute(key, val);
  };

  const images = Object.entries(attributes)
    .filter(([_, details]) => details.type === 'Image')
    .reduce((res: Record<string, string>, [attrKey, details]) => {
      res[attrKey] = details.value;
      return res;
    }, {});
  const attributeKeysToRemove = [];

  const traverse = child => {
    if (isValidElement(child) && 'props' in child) {
      child as ReactElement<HTMLElement>;
      if (child.type === 'img') {
        const image = child as ReactElement<HTMLImageElement>;
        if (Object.values(images).includes(image.props.src)) {
          const attrKey = Object.entries(images).find(([_, src]) => src === image.props.src)?.[0];
          attributeKeysToRemove.push(attrKey);
          return (
            <ImageInput key={attrKey} path={path} attrKey={attrKey!} value={image.props.src || ''} saveAttr={saveAttr}>
              {image}
            </ImageInput>
          );
        }
        return image;
      }
      if (typeof child.props === 'object' && 'children' in child.props) {
        return cloneElement(child, {}, Children.map(child.props.children, traverse));
      }
    }
    return child;
  };

  const enhancedChildren = Children.map(children, traverse);

  const remainingAttributes = Object.fromEntries(
    Object.entries(attributes).filter(([key, _]) => !attributeKeysToRemove.includes(key))
  );
  return (
    <div>
      {enhancedChildren}
      {Object.entries(remainingAttributes).map(([attrKey, { value, type }]) => (
        <AttributeInput path={path} key={attrKey} attrKey={attrKey} type={type} value={value} saveAttr={saveAttr} />
      ))}
    </div>
  );
};

const AttributeInput = ({
  attrKey,
  value,
  type,
  path,
  saveAttr,
}: {
  attrKey: string;
  value: string;
  type: AttributeType;
  path: string;
  saveAttr: (key: string, value: string) => void;
}) => {
  const [controlledValue, setControlledValue] = useState<string>(value);

  const fullAttribute = path ? `${path}.${attrKey}` : attrKey;
  return (
    <label className="restw:flex! restw:flex-col!">
      <span>{attrKey}</span>
      <div className="restw:flex! restw:gap-2! restw:mt-1!">
        <input
          type="text"
          name={`${fullAttribute}.value`}
          value={controlledValue}
          onChange={e => setControlledValue(e.target.value)}
          className="restw:border! restw:rounded-sm! restw:border-gray-300!"
        />
        <input type="hidden" name={`${fullAttribute}.name`} value={attrKey} />
        <input type="hidden" name={`${fullAttribute}.id`} value={v4()} />
        <input type="hidden" name={`${fullAttribute}.type`} value={type} />
        <Button type="button" onClick={() => saveAttr(attrKey, controlledValue)}>
          Save
        </Button>
      </div>
    </label>
  );
};

export default AttributeEditor;
