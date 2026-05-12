// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {$isAtNodeEnd} from '@lexical/selection';
import {ElementNode, LexicalEditor, RangeSelection, SerializedEditorState, TextNode} from 'lexical';

export function getSelectedNode(selection: RangeSelection): TextNode | ElementNode {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
  }
}

export function updateEditorState(
  editor: LexicalEditor,
  editorState: SerializedEditorState | undefined
): void {
  try {
    if (editorState) {
      editor.setEditorState(editor.parseEditorState(editorState));
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
}

export function sanitizeUrl(url: string): string {
  const SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp|tel|file|sms):|[^&:/?#]*(?:[/?#]|$))/gi;
  const DATA_URL_PATTERN =
    /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+/]+=*$/i;

  url = String(url).trim();
  if (url.match(SAFE_URL_PATTERN) || url.match(DATA_URL_PATTERN)) return url;
  return 'https://';
}
