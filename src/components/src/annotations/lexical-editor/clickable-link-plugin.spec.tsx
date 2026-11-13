// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {act, fireEvent, render} from '@testing-library/react';
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {$createLinkNode, LinkNode} from '@lexical/link';
import {$createParagraphNode, $createTextNode, $getRoot, LexicalEditor} from 'lexical';
import ClickableLinkPlugin from './clickable-link-plugin';

function setup() {
  let editor: LexicalEditor;
  function CaptureEditor() {
    [editor] = useLexicalComposerContext();
    return null;
  }
  function Harness({enabled = true, newTab = true}) {
    return (
      <LexicalComposer
        initialConfig={{
          namespace: 'clickable-link-test',
          editable: false,
          nodes: [LinkNode],
          onError: error => {
            throw error;
          },
          editorState: () => {
            $getRoot().append(
              $createParagraphNode().append(
                $createLinkNode('https://kepler.gl/').append($createTextNode('Documentation'))
              )
            );
          }
        }}
      >
        <CaptureEditor />
        <ContentEditable />
        <>{enabled && <ClickableLinkPlugin newTab={newTab} />}</>
      </LexicalComposer>
    );
  }
  const view = render(<Harness />);
  const link = () => editor.getRootElement()!.querySelector('a')!;
  return {...view, editor: editor!, link, Harness};
}

describe('ClickableLinkPlugin', () => {
  let open: jest.SpyInstance;
  beforeEach(() => {
    open = jest.spyOn(window, 'open').mockImplementation(() => null);
  });
  afterEach(() => jest.restoreAllMocks());

  it.each(['anchor', 'text child'])('opens a read-only %s in an isolated new tab', target => {
    const {link} = setup();
    fireEvent.click(target === 'anchor' ? link() : link().firstElementChild!);
    expect(open).toHaveBeenCalledTimes(1);
    expect(open).toHaveBeenCalledWith('https://kepler.gl/', '_blank', 'noopener,noreferrer');
  });

  it('does not navigate while editing and resumes after returning to read-only', () => {
    const {editor, link} = setup();
    act(() => editor.setEditable(true));
    fireEvent.click(link());
    expect(open).not.toHaveBeenCalled();
    act(() => editor.setEditable(false));
    fireEvent.click(link());
    expect(open).toHaveBeenCalledTimes(1);
  });

  it.each(['missing href', 'empty href', 'noneditable link', 'non-link'])('ignores %s', kind => {
    const {link, editor} = setup();
    if (kind === 'missing href') link().removeAttribute('href');
    if (kind === 'empty href') link().setAttribute('href', '');
    if (kind === 'noneditable link') link().setAttribute('contenteditable', 'false');
    fireEvent.click(kind === 'non-link' ? editor.getRootElement()! : link());
    expect(open).not.toHaveBeenCalled();
  });

  it('allows a caret but not a selected text range to open the link', () => {
    const {editor, link} = setup();
    act(() => {
      editor.update(
        () => {
          $getRoot().getAllTextNodes()[0].select(0, 4);
        },
        {discrete: true}
      );
    });
    fireEvent.click(link());
    expect(open).not.toHaveBeenCalled();
    act(() => {
      editor.update(
        () => {
          $getRoot().getAllTextNodes()[0].select(2, 2);
        },
        {discrete: true}
      );
    });
    fireEvent.click(link());
    expect(open).toHaveBeenCalledTimes(1);
  });

  it('uses the current tab when requested and updates the listener when the option changes', () => {
    const {link, rerender, Harness} = setup();
    // Hash navigation is supported by jsdom without replacing window.location.
    const oldHash = window.location.hash;
    try {
      rerender(<Harness newTab={false} />);
      link().setAttribute('href', '#annotation-link');
      fireEvent.click(link());
      expect(window.location.hash).toBe('#annotation-link');
      expect(open).not.toHaveBeenCalled();
      rerender(<Harness />);
      fireEvent.click(link());
      expect(open).toHaveBeenCalledTimes(1);
      expect(open).toHaveBeenCalledWith('#annotation-link', '_blank', 'noopener,noreferrer');
    } finally {
      window.location.hash = oldHash;
    }
  });

  it('moves navigation to a replacement root and removes it when the plugin unmounts', () => {
    const {editor, link, rerender, Harness} = setup();
    const oldRoot = editor.getRootElement()!;
    const oldLink = link();
    const replacement = document.createElement('div');
    act(() => editor.setRootElement(replacement));
    fireEvent.click(oldLink);
    expect(open).not.toHaveBeenCalled();
    fireEvent.click(link());
    expect(open).toHaveBeenCalledTimes(1);
    rerender(<Harness enabled={false} />);
    fireEvent.click(link());
    expect(open).toHaveBeenCalledTimes(1);
    // Restore the React-owned root before ContentEditable unmounts.
    act(() => editor.setRootElement(oldRoot));
  });
});
