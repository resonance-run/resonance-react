import { Children, cloneElement, isValidElement, ReactElement, ReactNode, useState } from 'react';
import { AttributeType, type AttributeDetails } from './Content.js';
import { Button } from './common/Button.js';
import { v4 } from 'uuid';

interface AttributeEditorProps {
  attributes: Record<string, AttributeDetails>;
  children: ReactNode;
  setAttribute: (key: string, value: string) => void;
}
export const AttributeEditor = ({ attributes, children, setAttribute }: AttributeEditorProps) => {
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
            <ImageInput key={attrKey} attrKey={attrKey!} value={image.props.src || ''} saveAttr={saveAttr}>
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
        <AttributeInput key={attrKey} attrKey={attrKey} type={type} value={value} saveAttr={saveAttr} />
      ))}
    </div>
  );
};

const ImageInput = ({
  attrKey,
  value,
  children,
  saveAttr,
}: {
  attrKey: string;
  value: string;
  children: ReactNode;
  saveAttr: (key: string, value: string) => void;
}) => {
  const [controlledValue, setControlledValue] = useState<string>(value);
  const [showModal, setShowModal] = useState<boolean>(false);
  return (
    <div>
      <div
        onClick={() => setShowModal(true)}
        className="restw:cursor-pointer! restw:p-2! restw:rounded-md! restw:inset-ring-4 restw:inset-ring-cyan-500/60! restw:hover:inset-ring-cyan-500!"
      >
        {children}
      </div>
      {showModal ? (
        <section className="restw:flex! restw:flex-col! restw:gap-2! restw:fixed! restw:z-50! restw:bg-white! restw:p-4! restw:rounded-md! restw:shadow-md! restw:left-0!restw:h-80! restw:w-[550px]! restw:max-w-full! restw:top-1/3! restw:translate-y-[-50%]! restw:translate-x-1/2! restw:right-1/2!">
          <span>Use a new image</span>
          <div className="restw:flex! restw:flex-col! restw:gap-2! restw:mt-1!">
            <input
              type="file"
              name={`${attrKey}.imageFile`}
              accept="image/*"
              onChange={e => {
                const file = e.target.files ? e.target.files[0] : null;
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    const base64String = reader.result as string;
                    setControlledValue(base64String);
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="restw:file:px-3! restw:file:py-1! restw:file:bg-gray-200! restw:file:text-black/90! restw:file:hover:bg-gray-300! restw:file:rounded-sm! restw:file:cursor-pointer!"
            />
            {controlledValue && (
              <img src={controlledValue} alt={attrKey} className="restw:max-h-20! restw:object-contain!" />
            )}
            <input type="hidden" name={`${attrKey}.name`} value={attrKey} />
            <input type="hidden" name={`${attrKey}.id`} value={v4()} />
            <input type="hidden" name={`${attrKey}.type`} value="Image" />
            <Button
              type="button"
              onClick={() => {
                saveAttr(attrKey, controlledValue);
                setShowModal(false);
              }}
            >
              Save
            </Button>
            <Button type="button" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
          </div>
        </section>
      ) : null}
    </div>
  );
};

const AttributeInput = ({
  attrKey,
  value,
  type,
  saveAttr,
}: {
  attrKey: string;
  value: string;
  type: AttributeType;
  saveAttr: (key: string, value: string) => void;
}) => {
  const [controlledValue, setControlledValue] = useState<string>(value);
  return (
    <label className="restw:flex! restw:flex-col!">
      <span>{attrKey}</span>
      <div className="restw:flex! restw:gap-2! restw:mt-1!">
        <input
          type="text"
          name={`${attrKey}.value`}
          value={controlledValue}
          onChange={e => setControlledValue(e.target.value)}
          className="restw:border! restw:rounded-sm! restw:border-gray-300!"
        />
        <input type="hidden" name={`${attrKey}.name`} value={attrKey} />
        <input type="hidden" name={`${attrKey}.id`} value={v4()} />
        <input type="hidden" name={`${attrKey}.type`} value={type} />
        <Button type="button" onClick={() => saveAttr(attrKey, controlledValue)}>
          Save
        </Button>
      </div>
    </label>
  );
};
