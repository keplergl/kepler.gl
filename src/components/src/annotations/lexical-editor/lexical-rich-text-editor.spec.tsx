// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useEffect} from 'react';
import {act, fireEvent, render, waitFor} from '@testing-library/react';
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $setSelection,
  SELECTION_CHANGE_COMMAND,
  KEY_ESCAPE_COMMAND,
  LexicalEditor,
  SerializedEditorState
} from 'lexical';
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import {LinkPlugin} from '@lexical/react/LexicalLinkPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import {LinkNode, TOGGLE_LINK_COMMAND} from '@lexical/link';
import {LexicalToolbar} from './lexical-toolbar';
import FloatingLinkEditorPlugin from './floating-link-editor';
import {LexicalRichTextEditor} from './lexical-rich-text-editor';

function makeEditorState(text: string, color: string): SerializedEditorState {
  const style = `color: ${color};`;
  return {
    root: {
      children: [
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style,
              text,
              type: 'text',
              version: 1
            }
          ],
          direction: null,
          format: '',
          indent: 0,
          type: 'paragraph',
          version: 1,
          textFormat: 0,
          textStyle: style
        }
      ],
      direction: null,
      format: '',
      indent: 0,
      type: 'root',
      version: 1
    }
  } as unknown as SerializedEditorState;
}

function renderEditor({
  editorState,
  initialText = 'Label'
}: {
  editorState?: SerializedEditorState;
  initialText?: string;
}) {
  return (
    <LexicalRichTextEditor
      editorState={editorState}
      initialText={initialText}
      isEditable={false}
      onChange={() => undefined}
    />
  );
}

function textSpan(container: HTMLElement): HTMLElement | null {
  return container.querySelector('span[data-lexical-text="true"]');
}

describe('LexicalRichTextEditor external state sync', () => {
  it('applies a new editorState after mount', async () => {
    const {container, rerender} = render(
      renderEditor({editorState: makeEditorState('Top place', '#ffffff')})
    );

    expect(textSpan(container)?.style.color).toBe('rgb(255, 255, 255)');

    rerender(renderEditor({editorState: makeEditorState('Top place', '#ff0000')}));

    await waitFor(() => {
      expect(textSpan(container)?.style.color).toBe('rgb(255, 0, 0)');
    });
    expect(textSpan(container)?.textContent).toBe('Top place');
  });

  it('clears the content when the external state is cleared without initialText', async () => {
    const {container, rerender} = render(
      <LexicalRichTextEditor
        editorState={makeEditorState('Old label', '#00ff00')}
        isEditable={false}
        onChange={() => undefined}
      />
    );

    rerender(
      <LexicalRichTextEditor
        editorState={undefined}
        isEditable={false}
        onChange={() => undefined}
      />
    );

    await waitFor(() => {
      expect(container.textContent).toBe('');
    });
    expect(textSpan(container)).toBeNull();
  });

  it('keeps the current content when an invalid external state is rejected', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    const {container, rerender} = render(
      renderEditor({editorState: makeEditorState('Keep me', '#ffffff')})
    );

    rerender(
      renderEditor({
        editorState: {
          root: {children: [{type: 'unregistered-node', version: 1}]}
        } as unknown as SerializedEditorState
      })
    );

    await waitFor(() => {
      expect(textSpan(container)?.textContent).toBe('Keep me');
    });
    errorSpy.mockRestore();
  });

  it('falls back to initialText when the external state is cleared', async () => {
    const {container, rerender} = render(
      renderEditor({editorState: makeEditorState('Old label', '#00ff00')})
    );

    rerender(renderEditor({editorState: undefined, initialText: 'New label'}));

    await waitFor(() => {
      expect(textSpan(container)?.textContent).toBe('New label');
    });
    expect(textSpan(container)?.style.color).toBe('');
  });
});

function required<T>(value: T | null | undefined): T {
  if (value === null || value === undefined) throw new Error('Expected mounted editor element');
  return value;
}

// Exercise the toolbar with a real Lexical document, rather than mocking its hooks.
function CaptureEditor({onEditor}: {onEditor: (editor: LexicalEditor) => void}) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => onEditor(editor), [editor, onEditor]);
  return null;
}

function mountToolbar(editable = true) {
  let editor!: LexicalEditor;
  const view = render(
    <LexicalComposer
      initialConfig={{
        namespace: 'annotation-toolbar-test',
        nodes: [LinkNode],
        editable,
        onError: error => {
          throw error;
        }
      }}
    >
      <RichTextPlugin
        contentEditable={<ContentEditable />}
        placeholder={null}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <LinkPlugin />
      <CaptureEditor
        onEditor={value => {
          editor = value;
        }}
      />
      <LexicalToolbar isEditingText={editable} />
      <FloatingLinkEditorPlugin />
    </LexicalComposer>
  );
  act(() =>
    editor.update(
      () => {
        const paragraph = $createParagraphNode();
        const first = $createTextNode('First');
        const second = $createTextNode(' second').setStyle('color: blue');
        paragraph.append(first, second);
        $getRoot().clear().append(paragraph);
        first.select(0, 5);
      },
      {discrete: true}
    )
  );
  return {editor, ...view};
}

function readText(editor: LexicalEditor) {
  return editor.getEditorState().read(() =>
    $getRoot()
      .getAllTextNodes()
      .map(node => ({
        text: node.getTextContent(),
        style: node.getStyle(),
        bold: node.hasFormat('bold'),
        italic: node.hasFormat('italic'),
        underline: node.hasFormat('underline')
      }))
  );
}

async function selectLink(editor: LexicalEditor, url = 'https://example.com/old') {
  await act(async () => {
    editor.update(
      () => {
        const text = $getRoot().getAllTextNodes()[0];
        text.select(0, text.getTextContentSize());
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
      },
      {discrete: true}
    );
  });
  const element = required(required(editor.getRootElement()).querySelector('a'));
  const range = document.createRange();
  range.selectNodeContents(element);
  required(window.getSelection()).removeAllRanges();
  required(window.getSelection()).addRange(range);
  await act(async () => {
    editor.dispatchCommand(SELECTION_CHANGE_COMMAND, undefined);
  });
}

describe('annotation toolbar and link editing', () => {
  const originalBounds = Object.getOwnPropertyDescriptor(Range.prototype, 'getBoundingClientRect');
  const originalRects = Object.getOwnPropertyDescriptor(Range.prototype, 'getClientRects');
  afterAll(() => {
    for (const [name, descriptor] of [
      ['getBoundingClientRect', originalBounds],
      ['getClientRects', originalRects]
    ] as const) {
      if (descriptor) Object.defineProperty(Range.prototype, name, descriptor);
      else Reflect.deleteProperty(Range.prototype, name);
    }
  });
  beforeAll(() => {
    // jsdom has no layout; Lexical only needs these while reconciling selections.
    Object.defineProperty(Range.prototype, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0})
    });
    Object.defineProperty(Range.prototype, 'getClientRects', {configurable: true, value: () => []});
  });

  it('formats only the selected text and toggles the same format off', async () => {
    const {editor, getByTitle} = mountToolbar();
    for (const [title, format] of [
      ['Bold', 'bold'],
      ['Italic', 'italic'],
      ['Underline', 'underline']
    ] as const) {
      await act(async () => {
        fireEvent.click(getByTitle(title));
      });
      expect(readText(editor).map(node => node[format])).toEqual([true, false]);
      await act(async () => {
        fireEvent.click(getByTitle(title));
      });
      expect(readText(editor).map(node => node[format])).toEqual([false, false]);
    }
  });

  it('changes selected font styles and background presets without touching other text', async () => {
    const {editor, getAllByRole, getByTitle, getByText, queryByText} = mountToolbar();
    await act(async () => {
      fireEvent.change(getAllByRole('combobox')[0], {target: {value: 'Georgia'}});
    });
    await act(async () => {
      fireEvent.change(getAllByRole('combobox')[1], {target: {value: '24px'}});
    });
    fireEvent.click(getByTitle('Background Color'));
    await act(async () => {
      fireEvent.click(getByText('White'));
    });
    expect(readText(editor)[0].style).toContain('background-color: #FFFFFF');
    expect(readText(editor)[0].style).toContain('font-family: Georgia');
    expect(readText(editor)[0].style).toContain('font-size: 24px');
    expect(readText(editor)[1].style).toBe('color: blue');
    expect(queryByText('No fill')).toBeNull();
    fireEvent.click(getByTitle('Background Color'));
    await act(async () => {
      fireEvent.click(getByText('No fill'));
    });
    expect(readText(editor)[0].style).toContain('background-color: transparent');
  });

  it('applies whole-annotation styles when read-only without leaving editing enabled', async () => {
    const {editor, getByTitle, getByText} = mountToolbar(false);
    act(() => editor.update(() => $setSelection(null), {discrete: true}));
    fireEvent.click(getByTitle('Text Color'));
    await act(async () => {
      fireEvent.click(getByText('Black'));
    });
    expect(readText(editor).every(node => node.style.includes('color: #000000'))).toBe(true);
    expect(editor.isEditable()).toBe(false);
    expect((getByTitle('Insert Link') as HTMLButtonElement).disabled).toBe(true);
  });

  it('dismisses an unfinished color choice and reopens the preset chooser', () => {
    const {getByTitle, getByText, queryByText} = mountToolbar();
    fireEvent.click(getByTitle('Text Color'));
    expect(getByText('White')).toBeTruthy();
    fireEvent.mouseDown(document.body);
    expect(queryByText('White')).toBeNull();
    fireEvent.click(getByTitle('Text Color'));
    expect(getByText('White')).toBeTruthy();
  });

  it('adds and removes links through the toolbar', async () => {
    const {editor, getByTitle} = mountToolbar();
    fireEvent.click(getByTitle('Insert Link'));
    await waitFor(() =>
      expect(required(editor.getRootElement()).querySelector('a')).not.toBeNull()
    );
    fireEvent.click(getByTitle('Insert Link'));
    await waitFor(() => expect(required(editor.getRootElement()).querySelector('a')).toBeNull());
    expect(
      readText(editor)
        .map(node => node.text)
        .join('')
    ).toBe('First second');
  });

  it('edits an existing link and sanitizes the submitted URL', async () => {
    const {editor, getByRole, getByText, queryByRole, container} = mountToolbar();
    await selectLink(editor);
    expect(getByText('https://example.com/old').getAttribute('href')).toBe(
      'https://example.com/old'
    );
    fireEvent.click(getByRole('button', {name: '✎'}));
    const input = container.querySelector('input.link-input') as HTMLInputElement;
    expect(document.activeElement).toBe(input);
    fireEvent.change(input, {target: {value: 'javascript:alert(1)'}});
    await act(async () => {
      fireEvent.keyDown(input, {key: 'Enter'});
    });
    expect(
      required(required(editor.getRootElement()).querySelector('a')).getAttribute('href')
    ).toBe('https://');
    expect(queryByRole('button', {name: '✎'})).not.toBeNull();
  });

  it('dismisses the link editor with Escape without deleting the link', async () => {
    const {editor, queryByRole} = mountToolbar();
    await selectLink(editor);
    expect(queryByRole('button', {name: '✎'})).not.toBeNull();
    act(() => {
      editor.dispatchCommand(KEY_ESCAPE_COMMAND, new KeyboardEvent('keydown', {key: 'Escape'}));
    });
    expect(queryByRole('button', {name: '✎'})).toBeNull();
    expect(
      required(required(editor.getRootElement()).querySelector('a')).getAttribute('href')
    ).toBe('https://example.com/old');
  });

  it('hides the link editor when selection moves to unlinked text', async () => {
    const {editor, queryByRole} = mountToolbar();
    await selectLink(editor);
    await act(async () => {
      editor.update(
        () => {
          $getRoot().getAllTextNodes()[1].select(0, 3);
        },
        {discrete: true}
      );
      editor.dispatchCommand(SELECTION_CHANGE_COMMAND, undefined);
    });
    expect(queryByRole('button', {name: '✎'})).toBeNull();
    expect(required(editor.getRootElement()).querySelector('a')).not.toBeNull();
  });

  it('does not replace a link with an empty edit and hides when editing ends', async () => {
    const {editor, getByRole, queryByRole, container} = mountToolbar();
    await selectLink(editor);
    fireEvent.click(getByRole('button', {name: '✎'}));
    const input = container.querySelector('input.link-input') as HTMLInputElement;
    fireEvent.change(input, {target: {value: ''}});
    await act(async () => {
      fireEvent.keyDown(input, {key: 'Enter'});
    });
    expect(
      required(required(editor.getRootElement()).querySelector('a')).getAttribute('href')
    ).toBe('https://example.com/old');
    act(() => editor.setEditable(false));
    expect(queryByRole('button', {name: '✎'})).toBeNull();
  });
});
