import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { $isListNode, ListNode } from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $isHeadingNode } from '@lexical/rich-text';
import { $findMatchingParent, $getNearestNodeOfType, mergeRegister } from '@lexical/utils';
import {
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
  type LexicalNode,
} from 'lexical';
import { Bold, Italic, Link2, Redo, Strikethrough, Underline, Undo } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type Dispatch, type ReactNode } from 'react';

import { BlockSelectorPopover, blockTypeToBlockName } from '../BlockSelectorPopover.js';
import { getSelectedNode } from '../utils/getSelectedNode.js';
import { sanitizeUrl } from '../utils/url.js';

function $findTopLevelElement(node: LexicalNode) {
  let topLevelElement =
    node.getKey() === 'root'
      ? node
      : $findMatchingParent(node, e => {
          const parent = e.getParent();
          return parent !== null && $isRootOrShadowRoot(parent);
        });

  if (topLevelElement === null) {
    topLevelElement = node.getTopLevelElementOrThrow();
  }
  return topLevelElement;
}
export const ToolbarPlugin = ({ setIsLinkEditMode }: { setIsLinkEditMode: Dispatch<boolean> }) => {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef<HTMLDivElement>(null);

  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [canRedo, setCanRedo] = useState<boolean>(false);
  const [isBold, setIsBold] = useState<boolean>(false);
  const [isItalic, setIsItalic] = useState<boolean>(false);
  const [isUnderline, setIsUnderline] = useState<boolean>(false);
  const [isStrikethrough, setIsStrikethrough] = useState<boolean>(false);
  const [isLink, setIsLink] = useState<boolean>(false);
  const [blockType, setBlockType] = useState<keyof typeof blockTypeToBlockName>();

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));

      const node = getSelectedNode(selection);
      const parent = node.getParent();
      setIsLink($isLinkNode(node) || $isLinkNode(parent));

      const anchorNode = selection.anchor.getNode();
      const element = $findTopLevelElement(anchorNode);
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);
      if (elementDOM !== null) {
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(anchorNode, ListNode);
          const type = parentList ? parentList.getListType() : element.getListType();

          setBlockType(type);
        } else {
          $handleHeadingNode(element);
        }
      }
    }
  }, []);

  const $handleHeadingNode = useCallback(
    (selectedElement: LexicalNode) => {
      const type = $isHeadingNode(selectedElement) ? selectedElement.getTag() : selectedElement.getType();

      if (type in blockTypeToBlockName) {
        setBlockType(type as keyof typeof blockTypeToBlockName);
      }
    },
    [setBlockType]
  );

  const insertLink = useCallback(() => {
    if (!isLink) {
      setIsLinkEditMode(true);
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl('https://'));
    } else {
      setIsLinkEditMode(false);
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, setIsLinkEditMode, isLink]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        $updateToolbar();
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor, $updateToolbar]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          $updateToolbar();
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        payload => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        payload => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, $updateToolbar]);

  return (
    <div
      ref={toolbarRef}
      className="restw:flex! restw:h-12! restw:items-center! restw:gap-2! restw:border-b! restw:border-gray-300! restw:bg-white! restw:p-2!"
    >
      <BlockSelectorPopover editor={editor} blockType={blockType} />
      <ToolbarButton
        disabled={!canUndo}
        isActive={false}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        label="Undo"
      >
        <Undo />
      </ToolbarButton>
      <ToolbarButton
        disabled={!canRedo}
        isActive={false}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        label="Redo"
      >
        <Redo />
      </ToolbarButton>

      <div className="restw:h-full! restw:w-1! restw:border-l! restw:border-gray-300!" />

      <ToolbarButton
        isActive={isBold}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
        }}
        label="Format Bold"
      >
        <Bold />
      </ToolbarButton>
      <ToolbarButton
        isActive={isItalic}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
        }}
        label="Format Italics"
      >
        <Italic />
      </ToolbarButton>
      <ToolbarButton
        isActive={isUnderline}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
        }}
        label="Format Underline"
      >
        <Underline />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
        }}
        isActive={isStrikethrough}
        label="Format Strikethrough"
      >
        <Strikethrough />
      </ToolbarButton>

      <div className="restw:mx-1! restw:h-full! restw:w-1! restw:border-l! restw:border-gray-300!" />

      <ToolbarButton
        onClick={() => {
          insertLink();
        }}
        isActive={false}
        label="Insert Link"
      >
        <Link2 />
      </ToolbarButton>
    </div>
  );
};

const ToolbarButton = ({
  onClick,
  disabled = false,
  label,
  isActive,
  children,
}: {
  label: string;
  isActive: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`restw:cursor-pointer! restw:rounded-sm! restw:p-1! restw:hover:bg-gray-100! ${
        isActive ? 'restw:bg-gray-100!' : ''
      }`}
      aria-label={label}
    >
      {children}
    </button>
  );
};

export default ToolbarPlugin;
