// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {FC, ReactNode, useCallback, useEffect, useMemo} from 'react';
import styled from 'styled-components';
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {LinkPlugin} from '@lexical/react/LexicalLinkPlugin';
import {OnChangePlugin} from '@lexical/react/LexicalOnChangePlugin';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  EditorState,
  SerializedEditorState
} from 'lexical';

import LexicalNodes from './lexical-nodes';
import LEXICAL_THEME from './lexical-theme';
import {updateEditorState} from './lexical-utils';
import ClickableLinkPlugin from './clickable-link-plugin';
import FloatingLinkEditorPlugin from './floating-link-editor';

export type LexicalRichTextEditorProps = {
  width?: number;
  height?: number;
  editorState?: SerializedEditorState;
  initialText?: string;
  isEditable: boolean;
  children?: ReactNode;
  onChange: (config: {text: string; editorState: SerializedEditorState}) => void;
};

const LEXICAL_EDITOR_CONFIG = {
  namespace: 'annotation-editor',
  theme: LEXICAL_THEME,
  nodes: [...LexicalNodes],
  onError(error: Error) {
    throw error;
  }
};

type ContainerProps = {
  $width?: number;
  $height?: number;
};

const Container = styled.div<ContainerProps>`
  display: flex;
  flex-direction: column;

  .editor-inner {
    ${props => (props.$width ? `width: ${props.$width}px` : '')};
    ${props => (props.$height ? `height: ${props.$height}px` : '')};
    border: none;
    display: flex;
    flex-direction: column;
  }
  .editor-input {
    outline: none;
    min-height: 20px;
  }
  .editor-input:focus {
    outline: none;
  }
  .lexical-paragraph {
    margin: 0;
    line-height: 1.4;
  }
  .lexical-text-bold {
    font-weight: bold;
  }
  .lexical-text-italic {
    font-style: italic;
  }
  .lexical-text-underline {
    text-decoration: underline;
  }
  .lexical-text-strikethrough {
    text-decoration: line-through;
  }
  .lexical-text-underline-strikethrough {
    text-decoration: underline line-through;
  }
  .lexical-ltr {
    text-align: left;
  }
  .lexical-rtl {
    text-align: right;
  }
  .lexical-link {
    color: rgb(33, 111, 219);
  }
`;

const LexicalEditorInner: FC<LexicalRichTextEditorProps> = ({isEditable, onChange}) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.setEditable(isEditable);
    if (!isEditable) {
      const rootElement = editor.getRootElement();
      if (rootElement && rootElement.contains(document.activeElement)) {
        (document.activeElement as HTMLElement)?.blur();
      }
      const domSelection = window.getSelection();
      if (domSelection && rootElement && rootElement.contains(domSelection.anchorNode)) {
        domSelection.removeAllRanges();
      }
    }
  }, [editor, isEditable]);

  const handleChange = useCallback(
    (state: EditorState) => {
      state.read(() => {
        const root = $getRoot();
        onChange({text: root.getTextContent(), editorState: state.toJSON()});
      });
    },
    [onChange]
  );

  return (
    <div className="editor-inner">
      <RichTextPlugin
        contentEditable={<ContentEditable className="editor-input" />}
        placeholder={<></>}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <LinkPlugin />
      <ClickableLinkPlugin newTab={true} />
      <HistoryPlugin />
      <OnChangePlugin onChange={handleChange} ignoreSelectionChange={true} />
      <FloatingLinkEditorPlugin />
    </div>
  );
};

export const LexicalRichTextEditor: FC<LexicalRichTextEditorProps> = props => {
  const {width, height, isEditable, editorState, initialText, children} = props;

  const initialConfig = useMemo(
    () => ({
      ...LEXICAL_EDITOR_CONFIG,
      editable: isEditable,
      editorState: (editor: any) => {
        if (editorState) {
          updateEditorState(editor, editorState);
        } else if (initialText) {
          $getRoot().append($createParagraphNode().append($createTextNode(initialText)));
        }
      }
    }),
    // Only use initial values
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <Container className="editor-container" $width={width} $height={height}>
        {children}
        <LexicalEditorInner {...props} />
      </Container>
    </LexicalComposer>
  );
};
