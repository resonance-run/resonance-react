import { createContext, FormEvent, MouseEvent, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { useResonance } from '../context/ResonanceContext.js';
import { Button } from './common/Button.js';

type ContentProps = {
  children: ReactNode;
  contentName: string;
};

export const ContentContext = createContext<{
  content: Record<string, string | number | boolean>;
  isEditorMode: boolean;
  isPreviewMode: boolean;
  contentName: string;
  path: string;
}>({ content: {}, isEditorMode: false, isPreviewMode: false, contentName: '', path: '' });

export const Content = ({ children, contentName }: ContentProps): React.ReactNode => {
  const context = useResonance();
  const [content, setContent] = useState<Record<string, string | number | boolean>>(
    context.contentValues[contentName] ?? {}
  );
  const [isEditorMode, setIsEditorMode] = useState<boolean>(context.isEditorMode);
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [hasChange, setHasChange] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const preview = (e: MouseEvent<HTMLButtonElement>) => {
    if (isPreviewMode) {
      setIsPreviewMode(false);
      return;
    }
    const button = e.target as HTMLButtonElement;
    const form = button.form;
    const formData = new FormData(form);
    const previewData = Array.from(formData.entries()).reduce((res: Record<string, string>, [name, val]) => {
      res[name] = val.toString();
      return res;
    }, {});
    const update = {
      ...content,
      ...previewData,
    };
    setContent(update);
    setIsPreviewMode(true);
  };

  const publish = (e: MouseEvent<HTMLButtonElement>) => {
    setIsPublishing(true);
    const button = e.target as HTMLButtonElement;
    const form = button.form;
    const formData = new FormData(form);
    const data = Array.from(formData.entries()).reduce((res: Record<string, string | File>, [name, val]) => {
      res[name] = val;
      return res;
    }, {});
    const publishEvent = {
      type: 'resonance-publish',
      customizationTypeId: contentName,
      formData: data,
    };
    window.postMessage(publishEvent);
  };

  useEffect(() => {
    window.addEventListener('message', (event: MessageEvent<{ type: string }>) => {
      if (event.origin !== window.location.origin) {
        return;
      }
      if (event.data.type === 'resonance-extension-publish-success') {
        setIsPublishing(false);
        setIsPreviewMode(false);
        setHasChange(false);
      }
    });
  }, []);

  const disabledButtons = isPublishing;
  return (
    <ContentContext.Provider
      value={{ content, isEditorMode, isPreviewMode, contentName, path: `content.${contentName}` }}
    >
      {isEditorMode ? (
        <form data-resonance-content-form={contentName} onChange={() => setHasChange(true)}>
          {children}
          {hasChange ? (
            <div className="restw:fixed! restw:flex! restw:items-center! restw:justify-center! restw:top-0! restw:z-50! restw:w-screen! restw:h-16! restw:bg-white! restw:shadow-md!">
              <div className="restw:flex! restw:gap-2!">
                <Button type="button" onClick={publish} disabled={disabledButtons}>
                  Publish
                </Button>
                <Button type="button" onClick={preview} disabled={disabledButtons}>
                  {isPreviewMode ? 'End preview' : 'Preview'}
                </Button>
              </div>
            </div>
          ) : null}
        </form>
      ) : (
        children
      )}
    </ContentContext.Provider>
  );
};
