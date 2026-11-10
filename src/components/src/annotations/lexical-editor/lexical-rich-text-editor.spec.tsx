// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {render, waitFor} from '@testing-library/react';
import type {SerializedEditorState} from 'lexical';
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
