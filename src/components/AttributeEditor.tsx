import { Dispatch, SetStateAction, useState } from 'react';
import { type AttributeDetails } from './Content.js';
import { Button } from './common/Button.js';

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
        <AttributeInput key={attrKey} attrKey={attrKey} value={value} saveAttr={saveAttr} />
      ))}
    </>
  );
};

const AttributeInput = ({
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
      <span>{attrKey}</span>
      <div className="restw:flex! restw:gap-2! restw:mt-1!">
        <input
          type="text"
          name={attrKey}
          value={controlledValue}
          onChange={e => setControlledValue(e.target.value)}
          className="restw:border! restw:rounded-sm! restw:border-gray-300!"
        />
        <Button type="button" onClick={() => saveAttr(attrKey, controlledValue)}>
          Save
        </Button>
      </div>
    </label>
  );
};
