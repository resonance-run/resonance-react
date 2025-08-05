import { $createHeadingNode, $createQuoteNode, type HeadingTagType } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { $createParagraphNode, $getSelection, type LexicalEditor } from 'lexical';
import { Check, Heading1, Heading2, Heading3, Heading4, Heading5, Heading6, List, Quote, Text } from 'lucide-react';
import { useState } from 'react';

import { Popover, PopoverContent, PopoverTrigger } from '../common/Popover.js';

export const blockTypeToBlockName = {
  bullet: 'Bullet List',
  check: 'Check List',
  h1: 'Heading 1',
  h2: 'Heading 2',
  h3: 'Heading 3',
  h4: 'Heading 4',
  h5: 'Heading 5',
  h6: 'Heading 6',
  number: 'Numbered List',
  paragraph: 'Normal',
  quote: 'Quote',
};

export const blockTypeToIcon = {
  bullet: List,
  check: Check,
  h1: Heading1,
  h2: Heading2,
  h3: Heading3,
  h4: Heading4,
  h5: Heading5,
  h6: Heading6,
  number: List,
  paragraph: Text,
  quote: Quote,
};

const formatHeading = (editor: LexicalEditor, blockType: string, headingSize: HeadingTagType) => {
  if (blockType !== headingSize) {
    editor.update(() => {
      const selection = $getSelection();
      $setBlocksType(selection, () => $createHeadingNode(headingSize));
    });
  }
};

interface BlockSelectorPopoverProps {
  editor: LexicalEditor;
  blockType?: keyof typeof blockTypeToBlockName;
}
export const BlockSelectorPopover = ({ editor, blockType }: BlockSelectorPopoverProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const IconComponent = blockTypeToIcon[blockType] ?? Text;
  const blockTrigger = (
    <div className="flex items-center gap-2">
      <IconComponent />
      <span>{blockType ? blockTypeToBlockName[blockType] : 'Normal'}</span>
    </div>
  );

  return (
    <Popover placement="bottom-start" open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className="flex cursor-pointer items-center gap-2 rounded-sm p-1 hover:bg-gray-100"
        onClick={() => setOpen(!open)}
      >
        {blockTrigger}
      </PopoverTrigger>
      <PopoverContent>
        <ul className="flex flex-col gap-1 bg-white shadow-md">
          <li>
            <button
              className="items center flex w-full flex-row gap-2 p-2 text-left hover:bg-gray-100"
              onClick={() => {
                editor.update(() => {
                  const selection = $getSelection();
                  $setBlocksType(selection, () => $createParagraphNode());
                });
                setOpen(false);
              }}
            >
              <Text />
              <span>Normal</span>
            </button>
          </li>
          {['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map(level => (
            <HeadingOption key={level} editor={editor} setOpen={setOpen} level={level as HeadingTagType} />
          ))}
          <li>
            <button
              className="items center flex w-full flex-row gap-2 p-2 text-left hover:bg-gray-100"
              onClick={() => {
                editor.update(() => {
                  const selection = $getSelection();
                  $setBlocksType(selection, () => $createQuoteNode());
                });
                setOpen(false);
              }}
            >
              <Quote />
              <span>Quote</span>
            </button>
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  );
};

const HeadingOption = ({
  editor,
  setOpen,
  level,
}: {
  editor: LexicalEditor;
  setOpen: (isOpen: boolean) => void;
  level: HeadingTagType;
}) => {
  const HeadingIcon = blockTypeToIcon[level] ?? Heading1;
  return (
    <li>
      <button
        className="items center flex w-full flex-row gap-2 p-2 text-left hover:bg-gray-100"
        onClick={() => {
          formatHeading(editor, 'heading', level);
          setOpen(false);
        }}
      >
        <HeadingIcon />
        <span>{blockTypeToBlockName[level]}</span>
      </button>
    </li>
  );
};
