// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {
  $createParagraphNode,
  $createRangeSelection,
  $createTextNode,
  $getRoot,
  createEditor
} from 'lexical';
import {getSelectedNode, sanitizeUrl} from './lexical-utils';

describe('annotation link URLs', () => {
  it('preserves supported links and trims surrounding whitespace', () => {
    const urls = [
      'https://example.com/path?q=hello#section',
      'HTTP://example.com',
      'mailto:hello@example.com',
      'tel:+123456789',
      'sms:+123456789',
      'ftp://example.com/file',
      '/relative/path',
      '../relative/path',
      '#section'
    ];
    for (const url of urls) {
      expect(sanitizeUrl(`  ${url}\n`)).toBe(url);
    }
  });

  it('rejects executable schemes, including mixed case and embedded control characters', () => {
    const urls = [
      'javascript:alert(1)',
      '  JaVaScRiPt:alert(1)  ',
      'java\tscript:alert(1)',
      'java\nscript:alert(1)',
      'vbscript:msgbox(1)',
      'javascript&colon;alert(1)'
    ];
    for (const url of urls) {
      expect(sanitizeUrl(url)).toBe('https://');
    }
  });

  it('accepts base64 media URLs without treating other data payloads as safe', () => {
    for (const type of ['image/png', 'video/mp4', 'audio/ogg']) {
      const url = `data:${type};base64,SGVsbG8=`;
      expect(sanitizeUrl(url)).toBe(url);
    }
    for (const url of [
      'data:text/html;base64,PHNjcmlwdD4=',
      'data:image/svg+xml;base64,PHN2Zz4=',
      'data:image/png,not-base64',
      'data:image/png;base64,SGVsbG8=<script>',
      'data:image/png;base64,'
    ]) {
      expect(sanitizeUrl(url)).toBe('https://');
    }
  });
});

describe('annotation toolbar selected node', () => {
  it('returns the text node for collapsed and same-node ranges', () => {
    const editor = createEditor({
      onError: error => {
        throw error;
      }
    });
    editor.update(
      () => {
        const text = $createTextNode('hello');
        $getRoot().append($createParagraphNode().append(text));
        const selection = $createRangeSelection();
        for (const [anchor, focus] of [
          [2, 2],
          [0, 4],
          [4, 0]
        ]) {
          selection.anchor.set(text.getKey(), anchor, 'text');
          selection.focus.set(text.getKey(), focus, 'text');
          expect(getSelectedNode(selection)).toBe(text);
        }
      },
      {discrete: true}
    );
  });

  it('ignores an unselected boundary node in forward and backward ranges', () => {
    const editor = createEditor({
      onError: error => {
        throw error;
      }
    });
    editor.update(
      () => {
        const first = $createTextNode('first');
        const second = $createTextNode('second');
        // Different formats keep the adjacent text nodes separate.
        second.toggleFormat('bold');
        $getRoot().append($createParagraphNode().append(first, second));
        const selection = $createRangeSelection();
        selection.anchor.set(first.getKey(), 5, 'text');
        selection.focus.set(second.getKey(), 3, 'text');
        expect(getSelectedNode(selection)).toBe(second);
        selection.anchor.set(second.getKey(), 3, 'text');
        selection.focus.set(first.getKey(), 5, 'text');
        expect(getSelectedNode(selection)).toBe(second);
      },
      {discrete: true}
    );
  });

  it('uses the first selected node when a range starts within its text', () => {
    const editor = createEditor({
      onError: error => {
        throw error;
      }
    });
    editor.update(
      () => {
        const first = $createTextNode('first');
        const second = $createTextNode('second');
        $getRoot().append(
          $createParagraphNode().append(first),
          $createParagraphNode().append(second)
        );
        const selection = $createRangeSelection();
        selection.anchor.set(first.getKey(), 2, 'text');
        selection.focus.set(second.getKey(), 3, 'text');
        expect(getSelectedNode(selection)).toBe(first);
        selection.anchor.set(second.getKey(), 3, 'text');
        selection.focus.set(first.getKey(), 2, 'text');
        expect(getSelectedNode(selection)).toBe(first);
      },
      {discrete: true}
    );
  });
});
