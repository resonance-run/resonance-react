import { Dispatch, SetStateAction, useState } from 'react';
import { AttributeType, type AttributeDetails } from './Content.js';
import { Button } from './common/Button.js';
import { v4 } from 'uuid';

interface AttributeEditorProps {
  attributes: Record<string, AttributeDetails>;
  setRenderValue: (key: string, value: string) => void;
}
export const AttributeEditor = ({ attributes, setRenderValue }: AttributeEditorProps) => {
  const saveAttr = (key, val) => {
    setRenderValue(key, val);
  };
  return (
    <>
      {Object.entries(attributes).map(([attrKey, { value, type }]) =>
        type === 'Image' ? (
          <ImageInput key={attrKey} attrKey={attrKey} value={value} saveAttr={saveAttr} />
        ) : (
          <AttributeInput key={attrKey} attrKey={attrKey} type={type} value={value} saveAttr={saveAttr} />
        )
      )}
    </>
  );
};

const ImageInput = ({
  attrKey,
  value,
  saveAttr,
}: {
  attrKey: string;
  value: string;
  saveAttr: (key: string, value: string) => void;
}) => {
  const [controlledValue, setControlledValue] = useState<string>(value);
  return (
    <label className="restw:flex! restw:flex-col!">
      <span>Use a new image</span>
      <div className="restw:flex! restw:gap-2! restw:mt-1!">
        <input
          type="file"
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
          className="restw:border! restw:rounded-sm! restw:border-gray-300!"
        />
        {controlledValue && (
          <img src={controlledValue} alt={attrKey} className="restw:max-h-20! restw:object-contain!" />
        )}
        <input type="hidden" name={`${attrKey}.name`} value={attrKey} />
        <input type="hidden" name={`${attrKey}.id`} value={v4()} />
        <input type="hidden" name={`${attrKey}.type`} value="Image" />
        <Button type="button" onClick={() => saveAttr(attrKey, controlledValue)}>
          Save
        </Button>
      </div>
    </label>
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
