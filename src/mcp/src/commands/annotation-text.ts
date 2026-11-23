// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import type {Annotation} from '@kepler.gl/types';

type TextAlignment = 'left' | 'center' | 'right' | 'justify';
type TextChanges = {
  label?: string;
  fontSize?: number;
  textColor?: string;
  textAlign?: TextAlignment;
};
type TextAnnotation = Pick<Annotation, 'label' | 'editorState'>;
type SerializedNode = {
  type: string;
  children?: SerializedNode[];
  text?: string;
  style?: string;
  textStyle?: string;
  format?: string | number;
  [key: string]: unknown;
};

const plainText = (text: string): SerializedNode => ({
  type: 'text',
  version: 1,
  text,
  detail: 0,
  format: 0,
  mode: 'normal',
  style: ''
});
const paragraph = (): SerializedNode => ({
  type: 'paragraph',
  version: 1,
  direction: null,
  format: '',
  indent: 0,
  children: []
});

// Split CSS declarations without changing quoted font names or data URLs.
function declarations(style = ''): string[] {
  const result: string[] = [];
  let start = 0;
  let quote = '';
  let depth = 0;
  for (let i = 0; i < style.length; i++) {
    const char = style[i];
    if (char === '\\') {
      i++;
      continue;
    }
    if (quote) {
      if (char === quote) quote = '';
      continue;
    }
    if (char === '"' || char === "'") quote = char;
    else if (char === '(') depth++;
    else if (char === ')') depth--;
    else if (char === ';' && depth === 0) {
      result.push(style.slice(start, i));
      start = i + 1;
    }
  }
  result.push(style.slice(start));
  return result;
}

function cssValue(style: string | undefined, property: string): string | undefined {
  let value: string | undefined;
  for (const entry of declarations(style)) {
    const colon = entry.indexOf(':');
    if (entry.slice(0, colon).trim().toLowerCase() === property)
      value = entry.slice(colon + 1).trim();
  }
  return value;
}

function patchStyle(style: string | undefined, changes: TextChanges): string {
  const updates: Record<string, string> = {};
  if (changes.fontSize !== undefined) updates['font-size'] = `${changes.fontSize}px`;
  if (changes.textColor !== undefined) updates.color = changes.textColor;
  const kept = declarations(style).filter(entry => {
    const name = entry.slice(0, entry.indexOf(':')).trim().toLowerCase();
    return !(name in updates);
  });
  return `${[
    ...kept.filter(entry => entry.trim()),
    ...Object.entries(updates).map(([name, value]) => `${name}: ${value}`)
  ].join('; ')};`;
}

type TextRun = {
  text: string;
  node: SerializedNode;
  wrappers: SerializedNode[];
  paragraph: SerializedNode;
  boundary?: boolean;
};

function textRuns(root: SerializedNode): TextRun[] {
  const runs: TextRun[] = [];
  (root.children ?? []).forEach((block, index) => {
    if (index)
      runs.push({
        text: '\n\n',
        node: plainText('\n\n'),
        wrappers: [],
        paragraph: block,
        boundary: true
      });
    function visit(node: SerializedNode, wrappers: SerializedNode[]) {
      if (typeof node.text === 'string' || node.type === 'linebreak') {
        runs.push({text: node.text ?? '\n', node, wrappers, paragraph: block});
      } else {
        node.children?.forEach(child => visit(child, [...wrappers, node]));
      }
    }
    block.children?.forEach(child => visit(child, []));
  });
  return runs;
}

function splitsSurrogatePair(text: string, index: number): boolean {
  const previous = text.charCodeAt(index - 1);
  const next = text.charCodeAt(index);
  return previous >= 0xd800 && previous <= 0xdbff && next >= 0xdc00 && next <= 0xdfff;
}

// Replace the changed range only. Unchanged text keeps its formats and links;
// newly inserted text inherits the format at the start of the replaced range.
function replaceLabel(root: SerializedNode, label: string): SerializedNode {
  const runs = textRuns(root);
  const previous = runs.map(run => run.text).join('');
  if (previous === label) return root;
  let prefix = 0;
  while (prefix < previous.length && prefix < label.length && previous[prefix] === label[prefix])
    prefix++;
  if (splitsSurrogatePair(previous, prefix) || splitsSurrogatePair(label, prefix)) prefix--;
  let suffix = 0;
  while (
    suffix < previous.length - prefix &&
    suffix < label.length - prefix &&
    previous[previous.length - 1 - suffix] === label[label.length - 1 - suffix]
  )
    suffix++;
  if (
    splitsSurrogatePair(previous, previous.length - suffix) ||
    splitsSurrogatePair(label, label.length - suffix)
  )
    suffix--;

  const slice = (start: number, end: number): TextRun[] => {
    let offset = 0;
    return runs.flatMap(run => {
      const from = Math.max(start - offset, 0);
      const to = Math.min(end - offset, run.text.length);
      offset += run.text.length;
      if (from >= to) return [];
      return [
        {
          ...run,
          text: run.text.slice(from, to),
          boundary: run.boundary && from === 0 && to === run.text.length
        }
      ];
    });
  };
  let offset = 0;
  const inherited =
    runs.find(run => {
      offset += run.text.length;
      return offset > prefix && run.node.type === 'text' && !run.boundary;
    }) ?? [...runs].reverse().find(run => run.node.type === 'text' && !run.boundary);
  const inserted = label.slice(prefix, label.length - suffix);
  const nextRuns = [
    ...slice(0, prefix),
    ...(inserted
      ? [
          {
            text: inserted,
            node: inherited?.node ?? plainText(inserted),
            wrappers: inherited?.wrappers ?? [],
            paragraph: inherited?.paragraph ?? root.children?.[0] ?? paragraph()
          }
        ]
      : []),
    ...slice(previous.length - suffix, previous.length)
  ];

  const blocks: SerializedNode[] = [];
  let block: SerializedNode = {
    ...((!nextRuns[0]?.boundary && nextRuns[0]?.paragraph) || root.children?.[0] || paragraph()),
    children: []
  };
  let previousWrappers: SerializedNode[] = [];
  let parents: SerializedNode[] = [block];
  for (const run of nextRuns) {
    if (run.boundary) {
      blocks.push(block);
      block = {...run.paragraph, children: []};
      previousWrappers = [];
      parents = [block];
      continue;
    }
    let shared = 0;
    while (shared < run.wrappers.length && run.wrappers[shared] === previousWrappers[shared])
      shared++;
    parents = parents.slice(0, shared + 1);
    for (const wrapper of run.wrappers.slice(shared)) {
      const next = {...wrapper, children: []};
      parents[parents.length - 1].children?.push(next);
      parents.push(next);
    }
    parents[parents.length - 1].children?.push(
      run.node.type === 'linebreak' ? {...run.node} : {...run.node, text: run.text}
    );
    previousWrappers = run.wrappers;
  }
  blocks.push(block);
  return {...root, children: blocks};
}

export function buildAnnotationEditorState(
  annotation: TextAnnotation,
  changes: TextChanges
): Record<string, any> {
  const saved = annotation.editorState;
  let root: SerializedNode =
    saved?.root && Array.isArray(saved.root.children)
      ? saved.root
      : {
          type: 'root',
          version: 1,
          direction: null,
          format: '',
          indent: 0,
          children: [{...paragraph(), children: [plainText(annotation.label)]}]
        };
  if (changes.label !== undefined) root = replaceLabel(root, changes.label);
  const hasStyle = changes.fontSize !== undefined || changes.textColor !== undefined;
  const containsText = (node: SerializedNode): boolean =>
    node.type === 'text' || Boolean(node.children?.some(containsText));
  function patch(node: SerializedNode): SerializedNode {
    const children = node.children?.map(patch) ?? (node.type === 'paragraph' ? [] : undefined);
    // The installed Lexical version stores styles on text nodes, including
    // empty ones, rather than importing paragraph.textStyle metadata.
    if (hasStyle && node.type === 'paragraph' && !containsText(node)) {
      children?.push({...plainText(''), style: patchStyle(node.textStyle, changes)});
    }
    return {
      ...node,
      ...(children ? {children} : {}),
      ...(hasStyle && node.type === 'text' ? {style: patchStyle(node.style, changes)} : {}),
      ...(changes.textAlign !== undefined && node.type === 'paragraph'
        ? {format: changes.textAlign}
        : {})
    };
  }
  return {...saved, root: patch(root)};
}

export function describeAnnotationText(annotation: TextAnnotation): {
  fontSize: number | null;
  textColor: string | null;
  textAlign: TextAlignment | null;
} {
  const state = buildAnnotationEditorState(annotation, {});
  const runs = textRuns(state.root).filter(run => run.node.type === 'text' && !run.boundary);
  const blocks: SerializedNode[] = state.root.children ?? [];
  const styles = blocks.flatMap(block => {
    const blockRuns = runs.filter(run => run.paragraph === block);
    return blockRuns.length ? blockRuns.map(run => run.node.style) : [block.textStyle];
  });
  const uniform = <T>(values: T[], fallback: T): T | null =>
    values.length === 0 ? fallback : values.every(value => value === values[0]) ? values[0] : null;
  const sizes = styles.map(style => {
    const value = cssValue(style, 'font-size') ?? '14px';
    return /^\d+(?:\.\d+)?px$/i.test(value) ? Number.parseFloat(value) : null;
  });
  return {
    fontSize: uniform(sizes, 14),
    textColor: uniform(
      styles.map(style => cssValue(style, 'color') ?? '#FFFFFF'),
      '#FFFFFF'
    ),
    textAlign: uniform<TextAlignment>(
      blocks.map(node => {
        if (['left', 'center', 'right', 'justify'].includes(String(node.format))) {
          return node.format as TextAlignment;
        }
        const isRtl = node.direction === 'rtl';
        return node.format === 'end' ? (isRtl ? 'left' : 'right') : isRtl ? 'right' : 'left';
      }),
      'left'
    )
  };
}
