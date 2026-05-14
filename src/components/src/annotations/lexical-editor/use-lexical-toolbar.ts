// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {$isLinkNode, TOGGLE_LINK_COMMAND} from '@lexical/link';
import {$getSelectionStyleValueForProperty, $patchStyleText} from '@lexical/selection';
import {mergeRegister} from '@lexical/utils';
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_ELEMENT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  TextFormatType,
  $createRangeSelection,
  $getRoot,
  $setSelection,
  LexicalEditor
} from 'lexical';
import {useCallback, useEffect, useMemo, useState} from 'react';

import {
  DEFAULT_BG_COLOR,
  DEFAULT_FONT_FAMILY,
  DEFAULT_FONT_SIZE,
  DEFAULT_FONT_COLOR,
  DEFAULT_LINK_NODE_PROPS,
  LOW_PRIORITY_COMMAND
} from './lexical-constants';
import {getSelectedNode} from './lexical-utils';

type UseLexicalToolbarProps = {
  isEditingText?: boolean;
  editor: LexicalEditor;
};

export type UseLexicalTextFormatReturn = {
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  handleToggleTextFormat: (format: string) => void;
};

export const useLexicalTextFormat = ({
  isEditingText,
  editor
}: UseLexicalToolbarProps): UseLexicalTextFormatReturn => {
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  const updateTextFormat = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({editorState}) => {
        editorState.read(() => {
          updateTextFormat();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateTextFormat();
          return false;
        },
        LOW_PRIORITY_COMMAND
      )
    );
  }, [editor, updateTextFormat]);

  const handleToggleTextFormat = useCallback(
    (format: string) => {
      const wasEditable = editor.isEditable();
      if (!wasEditable) {
        editor.setEditable(true);
      }
      editor.update(() => {
        let selection = $getSelection();
        if (!$isRangeSelection(selection) || selection.isCollapsed()) {
          const root = $getRoot();
          const newSelection = $createRangeSelection();
          newSelection.focus.set(root.getKey(), 0, 'element');
          newSelection.anchor.set(root.getKey(), root.getChildrenSize(), 'element');
          $setSelection(newSelection);
          selection = $getSelection();
        }
        if ($isRangeSelection(selection)) {
          selection.formatText(format as TextFormatType);
        }
      });
      if (!wasEditable) {
        setTimeout(() => editor.setEditable(false), 0);
      }
    },
    [editor]
  );
  return {isBold, isItalic, isUnderline, handleToggleTextFormat};
};

export type UseLexicalTextStyleReturn = {
  fontSize: string;
  fontColor: string;
  bgColor: string;
  fontFamily: string;
  handleChangeStyle: (style: string, value: string) => void;
  handleAlignHorizontal: (alignment: 'left' | 'right' | 'center' | 'justify') => void;
};

export const useLexicalTextStyle = ({
  editor,
  isEditingText,
  defaultSettings
}: {
  editor: LexicalEditor;
  isEditingText: boolean;
  defaultSettings?: Partial<{
    fontSize: string;
    fontColor: string;
    bgColor: string;
    fontFamily: string;
  }>;
}): UseLexicalTextStyleReturn => {
  const defaultValues = useMemo(
    () => ({
      fontSize: DEFAULT_FONT_SIZE,
      fontColor: DEFAULT_FONT_COLOR,
      bgColor: DEFAULT_BG_COLOR,
      fontFamily: DEFAULT_FONT_FAMILY,
      ...defaultSettings
    }),
    [defaultSettings]
  );

  const [fontSize, setFontSize] = useState<string>(defaultValues.fontSize);
  const [fontColor, setFontColor] = useState<string>(defaultValues.fontColor);
  const [bgColor, setBgColor] = useState<string>(defaultValues.bgColor);
  const [fontFamily, setFontFamily] = useState<string>(defaultValues.fontFamily);

  const updateTextStyle = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setFontSize(
        $getSelectionStyleValueForProperty(selection, 'font-size', defaultValues.fontSize)
      );
      setFontColor($getSelectionStyleValueForProperty(selection, 'color', defaultValues.fontColor));
      setBgColor($getSelectionStyleValueForProperty(selection, 'background-color', 'transparent'));
      setFontFamily(
        $getSelectionStyleValueForProperty(selection, 'font-family', defaultValues.fontFamily)
      );
    }
  }, [defaultValues.fontColor, defaultValues.fontFamily, defaultValues.fontSize]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({editorState}) => {
        editorState.read(() => {
          updateTextStyle();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateTextStyle();
          return false;
        },
        LOW_PRIORITY_COMMAND
      )
    );
  }, [editor, updateTextStyle]);

  const handleChangeStyle = useCallback(
    (style: string, option: string) => {
      const wasEditable = editor.isEditable();
      if (!wasEditable) {
        editor.setEditable(true);
      }
      editor.update(
        () => {
          let selection = $getSelection();
          if (!$isRangeSelection(selection) || selection.isCollapsed()) {
            const root = $getRoot();
            const newSelection = $createRangeSelection();
            newSelection.focus.set(root.getKey(), 0, 'element');
            newSelection.anchor.set(root.getKey(), root.getChildrenSize(), 'element');
            $setSelection(newSelection);
            selection = $getSelection();
          }
          if ($isRangeSelection(selection)) {
            $patchStyleText(selection, {[style]: option});
          }
        },
        {
          onUpdate: () => {
            if (!wasEditable) {
              editor.setEditable(false);
            }
          }
        }
      );
    },
    [editor]
  );

  const handleAlignHorizontal = useCallback(
    (alignment: 'left' | 'right' | 'center' | 'justify') => {
      const wasEditable = editor.isEditable();
      if (!wasEditable) {
        editor.setEditable(true);
      }
      editor.update(
        () => {
          let selection = $getSelection();
          if (!$isRangeSelection(selection) || selection.isCollapsed()) {
            const root = $getRoot();
            const newSelection = $createRangeSelection();
            newSelection.focus.set(root.getKey(), 0, 'element');
            newSelection.anchor.set(root.getKey(), root.getChildrenSize(), 'element');
            $setSelection(newSelection);
          }
        },
        {
          onUpdate: () => {
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, alignment);
            if (!wasEditable) {
              editor.setEditable(false);
            }
          }
        }
      );
    },
    [editor]
  );

  return {
    fontSize,
    fontColor,
    bgColor,
    fontFamily,
    handleChangeStyle,
    handleAlignHorizontal
  };
};

export type UseInsertLexicalLinkReturn = {
  isLink: boolean;
  insertLink: () => void;
};

export const useInsertLexicalLink = ({
  isEditingText,
  editor
}: UseLexicalToolbarProps): UseInsertLexicalLinkReturn => {
  const [isLink, setIsLink] = useState(false);

  const updateLink = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({editorState}) => {
        editorState.read(() => {
          updateLink();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateLink();
          return false;
        },
        LOW_PRIORITY_COMMAND
      )
    );
  }, [editor, updateLink]);

  const insertLink = useCallback(() => {
    const wasEditable = editor.isEditable();
    if (!wasEditable) {
      editor.setEditable(true);
    }
    editor.update(() => {
      let selection = $getSelection();
      if (!$isRangeSelection(selection) || selection.isCollapsed()) {
        const root = $getRoot();
        const newSelection = $createRangeSelection();
        newSelection.focus.set(root.getKey(), 0, 'element');
        newSelection.anchor.set(root.getKey(), root.getChildrenSize(), 'element');
        $setSelection(newSelection);
      }
    });
    setTimeout(() => {
      if (!isLink) {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, DEFAULT_LINK_NODE_PROPS);
      } else {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
      }
      if (!wasEditable) {
        editor.setEditable(false);
      }
    }, 0);
  }, [editor, isLink]);

  return {isLink, insertLink};
};
