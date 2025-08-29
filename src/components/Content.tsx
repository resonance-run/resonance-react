import { createContext, FormEvent, MouseEvent, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { useResonance } from '../context/ResonanceContext.js';
import sanitizeHtml from 'sanitize-html';
import { StringEditor } from './StringEditor.js';
import { MarkupEditor } from './MarkupEditor.js';
import { AttributeEditor } from './AttributeEditor.js';
import { Button } from './common/Button.js';

type ContentProps = {
  children: ReactNode;
  contentName: string;
};

const ContentContext = createContext<{
  content: Record<string, string | number | boolean>;
  isEditorMode: boolean;
  isPreviewMode: boolean;
  contentName: string;
}>({ content: {}, isEditorMode: false, isPreviewMode: false, contentName: '' });

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
    <ContentContext.Provider value={{ content, isEditorMode, isPreviewMode, contentName }}>
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

export const String = ({ attribute, children }: { attribute: string; children: React.ReactNode }): React.ReactNode => {
  const { content, contentName, isEditorMode, isPreviewMode } = useContext(ContentContext);
  const [waited, setWaited] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWaited(true);
    }, 500); // Wait for 500 second before rendering
    return () => clearTimeout(timer);
  }, []);
  const inner = content[attribute] ? content[attribute] : children;
  return isEditorMode && waited ? (
    <StringEditor attribute={attribute} contentName={contentName} isPreviewMode={isPreviewMode}>
      {inner}
    </StringEditor>
  ) : (
    inner
  );
};

export const Markup = ({ attribute, children }: { attribute: string; children: ReactNode }): React.ReactNode => {
  const { content, isEditorMode, contentName, isPreviewMode } = useContext(ContentContext);
  const [waited, setWaited] = useState<boolean>(false);
  const [markup, setMarkup] = useState(content[attribute] ?? undefined);
  const [inner, setInner] = useState(children);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWaited(true);
    }, 500); // Wait for 500 second before rendering
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (typeof markup === 'string') {
      const sanitized = sanitizeHtml(markup);
      setInner(<span dangerouslySetInnerHTML={{ __html: sanitized }} />);
    }
  }, [markup]);

  return isEditorMode && waited ? (
    <MarkupEditor
      attribute={attribute}
      contentName={contentName}
      updateMarkup={setMarkup}
      isPreviewMode={isPreviewMode}
    >
      {inner}
    </MarkupEditor>
  ) : (
    inner
  );
};

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
}) => {
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
    <AttributeEditor attributes={attributesWithOverrides} setAttribute={setAttributeValue}>
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
