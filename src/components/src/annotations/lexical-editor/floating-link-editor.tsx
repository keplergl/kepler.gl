// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Dispatch, FC, useCallback, useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import {$isLinkNode, TOGGLE_LINK_COMMAND} from '@lexical/link';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {$findMatchingParent, mergeRegister} from '@lexical/utils';
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  KEY_ESCAPE_COMMAND,
  LexicalEditor,
  SELECTION_CHANGE_COMMAND
} from 'lexical';

import {DEFAULT_LINK_NODE_PROPS} from './lexical-constants';
import {getSelectedNode, sanitizeUrl} from './lexical-utils';

const StyledLinkEditor = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: max-content;
  max-width: 300px;
  min-width: 150px;
  padding: 6px 10px;
  background-color: rgba(30, 33, 40, 0.95);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  z-index: 20;

  .link-input {
    display: flex;
    align-items: center;
    gap: 5px;
    & > a {
      color: rgb(33, 111, 219);
      flex-grow: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 12px;
      white-space: nowrap;
    }
  }
  input {
    &:focus {
      outline: none;
    }
    width: 100%;
    font-size: 12px;
    background: rgba(0, 0, 0, 0.3);
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 4px 6px;
    border-radius: 4px;
  }
`;

const EditButton = styled.button`
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  font-size: 11px;
  padding: 2px 4px;
  border-radius: 3px;
  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const FloatingLinkEditor: FC<{
  editor: LexicalEditor;
  isLink: boolean;
  setIsLink: Dispatch<boolean>;
}> = ({editor, isLink, setIsLink}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [isShown, setShown] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const [lastSelection, setLastSelection] = useState<any>(null);

  const updateLinkEditor = useCallback(() => {
    function clear() {
      setShown(false);
      setLastSelection(null);
      setEditMode(false);
      setLinkUrl('');
    }

    if (!editor.isEditable()) {
      clear();
      return;
    }
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent)) {
        setLinkUrl(parent?.getURL());
      } else if ($isLinkNode(node)) {
        setLinkUrl(node.getURL());
      } else {
        clear();
        return;
      }
    }

    const nativeSelection = window.getSelection();
    const rootElement = editor.getRootElement();

    if (
      selection !== null &&
      nativeSelection !== null &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode) &&
      editor.isEditable()
    ) {
      setShown(true);
      setLastSelection(selection);
    } else {
      clear();
    }

    return true;
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerEditableListener(editable => {
        if (!editable) {
          updateLinkEditor();
        }
      }),
      editor.registerUpdateListener(({editorState}) => {
        editorState.read(() => {
          updateLinkEditor();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateLinkEditor();
          return true;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_ESCAPE_COMMAND,
        () => {
          if (isLink) {
            setIsLink(false);
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_HIGH
      )
    );
  }, [editor, updateLinkEditor, setIsLink, isLink]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      updateLinkEditor();
    });
  }, [editor, updateLinkEditor]);

  useEffect(() => {
    if (isEditMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditMode]);

  return isShown ? (
    <StyledLinkEditor className="link-editor">
      {isEditMode ? (
        <input
          ref={inputRef}
          className="link-input"
          value={linkUrl}
          onChange={event => {
            setLinkUrl(event.target.value);
          }}
          onKeyDown={event => {
            if (event.key === 'Enter' || event.key === 'Escape') {
              event.preventDefault();
              event.stopPropagation();
              if (lastSelection !== null) {
                if (linkUrl !== '') {
                  editor.dispatchCommand(TOGGLE_LINK_COMMAND, {
                    ...DEFAULT_LINK_NODE_PROPS,
                    url: sanitizeUrl(linkUrl)
                  });
                }
                setEditMode(false);
              }
            }
          }}
        />
      ) : (
        <div className="link-input">
          <a href={linkUrl} target="_blank" rel="noopener noreferrer">
            {linkUrl}
          </a>
          <EditButton
            tabIndex={0}
            onMouseDown={event => event.preventDefault()}
            onClick={() => setEditMode(true)}
          >
            ✎
          </EditButton>
        </div>
      )}
    </StyledLinkEditor>
  ) : null;
};

export default function FloatingLinkEditorPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [isLink, setIsLink] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection);
      const linkParent = $findMatchingParent(node, $isLinkNode);
      if (linkParent) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }
    }
  }, []);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        updateToolbar();
        setActiveEditor(newEditor);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor, updateToolbar]);

  return isLink ? (
    <FloatingLinkEditor editor={activeEditor} isLink={isLink} setIsLink={setIsLink} />
  ) : null;
}
