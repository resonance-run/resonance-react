import { createContext, Fragment, useContext, useEffect, useState } from 'react';
import { ContentContext } from '../Content.js';
import { NestedContent } from '../NestedContent.js';
import { Button } from '../common/Button.js';
import { v4 } from 'uuid';

export const ListContext = createContext<{
  path: string;
}>({ path: '' });

interface ListProps<T> {
  attribute: string;
  items: T[];
  itemKey: string;
  children: (item: T, index: number) => React.ReactNode;
}
export const List = <T,>({ attribute, items, itemKey, children }: ListProps<T>) => {
  const { content, contentName, isEditorMode, isPreviewMode, path } = useContext(ContentContext);
  const [waited, setWaited] = useState<boolean>(false);
  const resolvedItems = content[attribute] ? content[attribute] : items;
  const [allItems, setAllItems] = useState<T[]>(resolvedItems as T[]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWaited(true);
    }, 500); // Wait for 500 second before rendering
    return () => clearTimeout(timer);
  }, []);

  const renderedList = Array.isArray(resolvedItems)
    ? [...allItems].map((item, index) => (
        <NestedContent content={item} key={item[itemKey]} path={`${attribute}.fields[${index}].data`}>
          {isEditorMode ? (
            <div>
              {children(item, index)}
              <input type="hidden" name={`${path}.${attribute}.fields[${index}].id`} value={v4()} />
              <Button
                type="button"
                onClick={() => {
                  const newItems = allItems.filter((_, i) => i !== index);
                  setAllItems(newItems);
                }}
              >
                Remove
              </Button>
            </div>
          ) : (
            children(item, index)
          )}
        </NestedContent>
      ))
    : null;
  return isEditorMode && waited ? (
    <>
      {renderedList}
      <input type="hidden" name={`${path}.${attribute}.name`} value={attribute} />
      <input type="hidden" name={`${path}.${attribute}.type`} value="Fields" />
      <input type="hidden" name={`${path}.${attribute}.id`} value={v4()} />
      {!isPreviewMode ? (
        <Button type="button" onClick={() => setAllItems([...allItems, {} as T])} disabled={isPreviewMode}>
          Add another "{attribute}" item
        </Button>
      ) : null}
    </>
  ) : (
    renderedList
  );
};
