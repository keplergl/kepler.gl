// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {createEditor, $getRoot, ElementNode} from 'lexical';
import {LinkNode} from '@lexical/link';
import {buildAnnotationEditorState, describeAnnotationText} from './annotation-text';

const textNode = (text: string, style: string, format = 0) => ({
  type: 'text',
  version: 1,
  text,
  style,
  format,
  mode: 'normal',
  detail: 0
});
const paragraph = (children: any[], format = 'center') => ({
  type: 'paragraph',
  version: 1,
  children,
  direction: null,
  format,
  indent: 0
});
const editorState = (children: any[]) => ({
  root: {type: 'root', version: 1, children, direction: null, format: '', indent: 0}
});

function read(state: Record<string, any>) {
  const editor = createEditor({
    nodes: [LinkNode],
    onError: error => {
      throw error;
    }
  });
  const parsed = editor.parseEditorState(state as any);
  return parsed.read(() => ({
    text: $getRoot().getTextContent(),
    runs: $getRoot()
      .getAllTextNodes()
      .map(node => ({
        text: node.getTextContent(),
        style: node.getStyle(),
        format: node.getFormat()
      }))
  }));
}

test('builds native multiline rich text and describes its effective settings', () => {
  const annotation = {label: 'Hawaiʻi\nBig Island'};
  const state = buildAnnotationEditorState(annotation, {
    fontSize: 48,
    textColor: '#80CAFF',
    textAlign: 'right'
  });
  expect(read(state).text).toBe(annotation.label);
  expect(describeAnnotationText({...annotation, editorState: state})).toEqual({
    fontSize: 48,
    textColor: '#80CAFF',
    textAlign: 'right'
  });
  expect(describeAnnotationText(annotation)).toEqual({
    fontSize: 14,
    textColor: '#FFFFFF',
    textAlign: 'left'
  });
});

test('style edits preserve rich text, links and unrelated CSS without mutating the saved state', () => {
  const link = {
    type: 'link',
    version: 1,
    url: 'https://example.com/island',
    target: '_blank',
    rel: 'noopener',
    direction: null,
    format: '',
    indent: 0,
    children: [textNode('Island', 'font-size: 20px; color: #FFCC00; font-family: "Some; Font";', 2)]
  };
  const saved = editorState([
    paragraph([
      textNode('Hawaiʻi ', 'font-size: 32px; color: #FFFFFF; background-color: #123456;', 1),
      link
    ])
  ]);
  const original = JSON.stringify(saved);
  const updated = buildAnnotationEditorState(
    {label: 'Hawaiʻi Island', editorState: saved},
    {fontSize: 48}
  );
  const nodes = updated.root.children[0].children;
  expect(nodes[0]).toMatchObject({text: 'Hawaiʻi ', format: 1});
  expect(nodes[0].style).toContain('background-color: #123456');
  expect(nodes[1]).toMatchObject({...link, children: [expect.objectContaining({format: 2})]});
  expect(nodes[1].children[0].style).toContain('font-family: "Some; Font"');
  expect(read(updated).runs.map(run => run.style)).toEqual([
    expect.stringContaining('font-size: 48px'),
    expect.stringContaining('font-size: 48px')
  ]);
  expect(describeAnnotationText({label: '', editorState: updated})).toEqual({
    fontSize: 48,
    textColor: null,
    textAlign: 'center'
  });
  expect(JSON.stringify(saved)).toBe(original);
});

test('label edits retain unchanged formatting and inherit the replaced run style', () => {
  const saved = editorState([
    paragraph([
      textNode('Hawaiʻi ', 'color: #FFFFFF;', 1),
      textNode('Big', 'color: #FFCC00; font-size: 32px;', 2),
      textNode(' Island', 'color: #AAFFAA;', 4)
    ])
  ]);
  const updated = buildAnnotationEditorState(
    {label: 'Hawaiʻi Big Island', editorState: saved},
    {
      label: 'Hawaiʻi Beautiful\nGreen Island'
    }
  );
  expect(read(updated)).toEqual({
    text: 'Hawaiʻi Beautiful\nGreen Island',
    runs: [
      {text: 'Hawaiʻi ', style: 'color: #FFFFFF;', format: 1},
      {text: 'B', style: 'color: #FFCC00; font-size: 32px;', format: 2},
      {text: 'eautiful\nGreen', style: 'color: #FFCC00; font-size: 32px;', format: 2},
      {text: ' Island', style: 'color: #AAFFAA;', format: 4}
    ]
  });
  expect(updated.root.children[0].format).toBe('center');
  expect(read(saved).text).toBe('Hawaiʻi Big Island');
});

test.each(['First\n\nChanged', 'One paragraph', 'First\nSecond', '\nFirst\n\nSecond\n', ''])(
  'replaces multi-paragraph text without stale content: %j',
  label => {
    const saved = editorState([
      paragraph([textNode('First', 'font-size: 24px;')], 'left'),
      paragraph([textNode('Second', 'font-size: 36px;')], 'right')
    ]);
    const updated = buildAnnotationEditorState(
      {label: 'First\n\nSecond', editorState: saved},
      {label}
    );
    expect(read(updated).text).toBe(label);
  }
);

test('reports mixed sizes and alignment without claiming one effective value', () => {
  const saved = editorState([
    paragraph([textNode('First', 'font-size: 24px;')], 'left'),
    paragraph([textNode('Second', 'font-size: 36px;')], 'right')
  ]);
  expect(describeAnnotationText({label: '', editorState: saved})).toEqual({
    fontSize: null,
    textColor: '#FFFFFF',
    textAlign: null
  });
});

test('styles empty paragraphs using native text nodes and reports their saved settings', () => {
  const saved = editorState([paragraph([])]);
  const updated = buildAnnotationEditorState(
    {label: '', editorState: saved},
    {
      fontSize: 36,
      textColor: '#80CAFF'
    }
  );
  const editor = createEditor({
    onError: error => {
      throw error;
    }
  });
  const restored = editor.parseEditorState(updated as any).toJSON();
  expect(read(restored).text).toBe('');
  expect(describeAnnotationText({label: '', editorState: restored})).toEqual({
    fontSize: 36,
    textColor: '#80CAFF',
    textAlign: 'center'
  });
  expect(updated.root.children[0]).not.toHaveProperty('textStyle');
  expect(saved.root.children[0].children).toEqual([]);

  const mixed = editorState([
    ...updated.root.children,
    paragraph([textNode('Hawaiʻi', 'font-size: 48px; color: #FFFFFF;')])
  ]);
  expect(describeAnnotationText({label: '', editorState: mixed})).toEqual({
    fontSize: null,
    textColor: null,
    textAlign: 'center'
  });
});

test('reads saved empty paragraph styling and includes it when detecting mixed values', () => {
  const saved = editorState([
    {...paragraph([]), textStyle: 'font-size: 36px; color: #80CAFF;'},
    paragraph([textNode('Hawaiʻi', 'font-size: 48px; color: #FFFFFF;')])
  ]);
  expect(describeAnnotationText({label: '', editorState: saved})).toEqual({
    fontSize: null,
    textColor: null,
    textAlign: 'center'
  });
  const updated = buildAnnotationEditorState({label: '', editorState: saved}, {fontSize: 48});
  expect(updated.root.children[0].textStyle).toBe(saved.root.children[0].textStyle);
  expect(describeAnnotationText({label: '', editorState: updated})).toEqual({
    fontSize: 48,
    textColor: null,
    textAlign: 'center'
  });
});

test.each([
  ['', 'rtl', 'right'],
  ['', 'ltr', 'left'],
  ['start', 'rtl', 'right'],
  ['start', 'ltr', 'left'],
  ['end', 'rtl', 'left'],
  ['end', 'ltr', 'right'],
  ['left', 'rtl', 'left'],
  ['right', 'ltr', 'right'],
  ['center', 'rtl', 'center']
])('resolves native paragraph alignment %j in direction %j', (format, direction, expected) => {
  const saved = editorState([{...paragraph([textNode('جزيرة', '')], format), direction}]);
  const editor = createEditor({
    onError: error => {
      throw error;
    }
  });
  const restored = editor.parseEditorState(saved as any);
  restored.read(() => {
    const block = $getRoot().getFirstChild<ElementNode>();
    expect(block?.getDirection()).toBe(direction);
    expect(block?.getFormatType()).toBe(format);
  });
  expect(describeAnnotationText({label: '', editorState: restored.toJSON()}).textAlign).toBe(
    expected
  );
});

test.each([
  ['🌋 Hawaiʻi', '🌴 Hawaiʻi'],
  ['Island \uD83D\uDE00', 'Island \uD840\uDE00']
])('keeps Unicode characters intact in every text run: %j -> %j', (previous, label) => {
  const saved = editorState([paragraph([textNode(previous, 'font-size: 32px;', 1)])]);
  const updated = buildAnnotationEditorState({label: previous, editorState: saved}, {label});
  const native = read(updated);
  expect(native.text).toBe(label);
  for (const run of native.runs) {
    expect(run.text).not.toMatch(
      /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:^|[^\uD800-\uDBFF])[\uDC00-\uDFFF]/
    );
    expect(run.format).toBe(1);
  }
});
