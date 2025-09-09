import { useState } from 'react';
import { Button } from '../common/Button.js';
import { v4 } from 'uuid';

export const ImageInput = ({
  attrKey,
  value,
  children,
  path,
  saveAttr,
}: {
  attrKey: string;
  value: string;
  children: React.ReactNode;
  path: string;
  saveAttr: (key: string, value: string) => void;
}) => {
  const [controlledValue, setControlledValue] = useState<string>(value);
  const [showModal, setShowModal] = useState<boolean>(false);
  const fullAttribute = path ? `${path}.${attrKey}` : attrKey;
  return (
    <div>
      <div
        onClick={() => setShowModal(true)}
        className="restw:cursor-pointer! restw:p-2! restw:rounded-md! restw:inset-ring-4 restw:inset-ring-cyan-500/60! restw:hover:inset-ring-cyan-500!"
      >
        {children}
      </div>
      <section
        className={`restw:flex! restw:flex-col! restw:gap-2! restw:fixed! restw:z-50! restw:bg-white! restw:p-4! restw:rounded-md! restw:shadow-md! restw:left-0!restw:h-80! restw:w-[550px]! restw:max-w-full! restw:top-1/3! restw:translate-y-[-50%]! restw:translate-x-1/2! restw:right-1/2! ${
          showModal ? '' : 'restw:sr-only!'
        }`}
      >
        <span>Use a new image</span>
        <div className="restw:flex! restw:flex-col! restw:gap-2! restw:mt-1!">
          <input
            type="file"
            name={`${fullAttribute}.imageFile`}
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
          <input type="hidden" name={`${fullAttribute}.name`} value={attrKey} />
          <input type="hidden" name={`${fullAttribute}.id`} value={v4()} />
          <input type="hidden" name={`${fullAttribute}.type`} value="Image" />
          <input type="hidden" name={`${fullAttribute}.value`} value={controlledValue} />
          {controlledValue && (
            <img src={controlledValue} alt={attrKey} className="restw:max-h-20! restw:object-contain!" />
          )}
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
    </div>
  );
};
