import { Dispatch, SetStateAction, useState } from 'react';
import { AttributeType, type AttributeDetails } from './Content.js';
import { Button } from './common/Button.js';
import { v4 } from 'uuid';

interface AttributeEditorProps {
  renderValues: Record<string, string>;
  setRenderValues: Dispatch<SetStateAction<Record<string, string>>>;
}
export const AttributeEditor = ({ renderValues, setRenderValues }: AttributeEditorProps) => {
  const saveAttr = (key, val) => {
    setRenderValues({
      ...renderValues,
      [key]: val,
    });
  };
  return (
    <>
      {Object.entries(renderValues).map(([attrKey, value]) => (
        <AttributeInput key={attrKey} attrKey={attrKey} type="Image" value={value} saveAttr={saveAttr} />
      ))}
    </>
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
