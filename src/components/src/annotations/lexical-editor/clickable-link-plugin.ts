// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {$getSelection, $isRangeSelection} from 'lexical';
import {useEffect} from 'react';

import type {LexicalEditor} from 'lexical';

export default function ClickableLinkPlugin({
  newTab = true
}: {
  newTab?: boolean;
}): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    function onClick(e: Event) {
      if (editor.isEditable()) {
        return;
      }

      const evt = e as MouseEvent;
      const linkDomNode = getLinkDomNode(evt, editor);
      if (!linkDomNode) {
        return;
      }
      const href = linkDomNode.getAttribute('href');
      if (linkDomNode.getAttribute('contenteditable') === 'false' || href == null) {
        return;
      }
      const selection = editor.getEditorState().read($getSelection);
      if ($isRangeSelection(selection) && !selection.isCollapsed()) {
        return;
      }

      if (href && newTab) {
        window.open(href, '_blank', 'noopener,noreferrer');
      } else if (href) {
        window.location.href = href;
      }
    }
    return editor.registerRootListener(
      (rootElement: null | HTMLElement, prevRootElement: null | HTMLElement) => {
        if (prevRootElement !== null) {
          prevRootElement.removeEventListener('click', onClick);
        }
        if (rootElement !== null) {
          rootElement.addEventListener('click', onClick);
        }
      }
    );
  }, [editor, newTab]);
  return null;
}

function isLinkDomNode(domNode: Node): boolean {
  return domNode.nodeName.toLowerCase() === 'a';
}

function getLinkDomNode(event: MouseEvent, editor: LexicalEditor): HTMLAnchorElement | null {
  return editor.getEditorState().read(() => {
    const domNode = event.target as Node;
    if (isLinkDomNode(domNode)) {
      return domNode as HTMLAnchorElement;
    }
    if (domNode.parentNode && isLinkDomNode(domNode.parentNode)) {
      return domNode.parentNode as HTMLAnchorElement;
    }
    return null;
  });
}
