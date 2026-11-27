// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import type {Annotation} from '@kepler.gl/types';

type TextAlignment = 'left' | 'center' | 'right' | 'justify';
type TextChanges = {
  label?: string;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold';
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
    return !(name in updates) && !(changes.fontWeight !== undefined && name === 'font-weight');
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

type TextMatch = {beforeStart: number; beforeEnd: number; afterStart: number; afterEnd: number};

// Hirschberg's longest-common-subsequence diff uses linear row storage rather
// than a quadratic matrix. Code points keep every edit boundary Unicode-safe.
function matchingText(before: string, after: string): TextMatch[] {
  const previous = Array.from(before);
  const next = Array.from(after);
  const offsets = (characters: string[]) => {
    const result = [0];
    for (const character of characters) result.push(result[result.length - 1] + character.length);
    return result;
  };
  const previousOffsets = offsets(previous);
  const nextOffsets = offsets(next);
  const matches: TextMatch[] = [];
  function retain(a: number, b: number) {
    const last = matches[matches.length - 1];
    if (last?.beforeEnd === previousOffsets[a] && last.afterEnd === nextOffsets[b]) {
      last.beforeEnd = previousOffsets[a + 1];
      last.afterEnd = nextOffsets[b + 1];
    } else {
      matches.push({
        beforeStart: previousOffsets[a],
        beforeEnd: previousOffsets[a + 1],
        afterStart: nextOffsets[b],
        afterEnd: nextOffsets[b + 1]
      });
    }
  }
  function row(aStart: number, aEnd: number, bStart: number, bEnd: number, reverse: boolean) {
    const result = new Uint32Array(bEnd - bStart + 1);
    for (let i = 0; i < aEnd - aStart; i++) {
      const character = previous[reverse ? aEnd - 1 - i : aStart + i];
      let diagonal = 0;
      for (let j = 1; j < result.length; j++) {
        const saved = result[j];
        result[j] =
          character === next[reverse ? bEnd - j : bStart + j - 1]
            ? diagonal + 1
            : Math.max(result[j], result[j - 1]);
        diagonal = saved;
      }
    }
    return result;
  }
  function split(aStart: number, middle: number, aEnd: number, bStart: number, bEnd: number) {
    const forward = row(aStart, middle, bStart, bEnd, false);
    const backward = row(middle, aEnd, bStart, bEnd, true);
    let best = 0;
    for (let i = 1; i < forward.length; i++) {
      if (forward[i] + backward[bEnd - bStart - i] > forward[best] + backward[bEnd - bStart - best])
        best = i;
    }
    return bStart + best;
  }
  function match(aStart: number, aEnd: number, bStart: number, bEnd: number) {
    while (aStart < aEnd && bStart < bEnd && previous[aStart] === next[bStart]) {
      retain(aStart++, bStart++);
    }
    let suffix = 0;
    while (aStart < aEnd && bStart < bEnd && previous[aEnd - 1] === next[bEnd - 1]) {
      aEnd--;
      bEnd--;
      suffix++;
    }
    if (aStart < aEnd && bStart < bEnd) {
      if (aEnd - aStart === 1) {
        const found = next.indexOf(previous[aStart], bStart);
        if (found >= 0 && found < bEnd) retain(aStart, found);
      } else {
        const middle = Math.floor((aStart + aEnd) / 2);
        const divide = split(aStart, middle, aEnd, bStart, bEnd);
        match(aStart, middle, bStart, divide);
        match(middle, aEnd, divide, bEnd);
      }
    }
    for (let i = 0; i < suffix; i++) retain(aEnd + i, bEnd + i);
  }
  match(0, previous.length, 0, next.length);
  return matches;
}

// Retain every unchanged range, including text between separate edits. New
// text inherits the formatting and link wrappers at the replaced range's start.
function replaceLabel(root: SerializedNode, label: string): SerializedNode {
  const runs = textRuns(root);
  const previous = runs.map(run => run.text).join('');
  if (previous === label) return root;
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
  const nextRuns: TextRun[] = [];
  const insert = (position: number, text: string) => {
    if (!text) return;
    let offset = 0;
    const inherited =
      runs.find(run => {
        offset += run.text.length;
        return offset > position && run.node.type === 'text' && !run.boundary;
      }) ?? [...runs].reverse().find(run => run.node.type === 'text' && !run.boundary);
    nextRuns.push({
      text,
      node: inherited?.node ?? plainText(text),
      wrappers: inherited?.wrappers ?? [],
      paragraph: inherited?.paragraph ?? root.children?.[0] ?? paragraph()
    });
  };
  let beforeOffset = 0;
  let afterOffset = 0;
  for (const match of matchingText(previous, label)) {
    insert(beforeOffset, label.slice(afterOffset, match.afterStart));
    nextRuns.push(...slice(match.beforeStart, match.beforeEnd));
    beforeOffset = match.beforeEnd;
    afterOffset = match.afterEnd;
  }
  insert(beforeOffset, label.slice(afterOffset));

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
  const hasStyle =
    changes.fontSize !== undefined ||
    changes.textColor !== undefined ||
    changes.fontWeight !== undefined;
  const containsText = (node: SerializedNode): boolean =>
    node.type === 'text' || Boolean(node.children?.some(containsText));
  function patch(node: SerializedNode): SerializedNode {
    const children = node.children?.map(patch) ?? (node.type === 'paragraph' ? [] : undefined);
    // The installed Lexical version stores styles on text nodes, including
    // empty ones, rather than importing paragraph.textStyle metadata.
    if (hasStyle && node.type === 'paragraph' && !containsText(node)) {
      children?.push({
        ...plainText(''),
        style: patchStyle(node.textStyle, changes),
        format: changes.fontWeight === 'bold' ? 1 : 0
      });
    }
    return {
      ...node,
      ...(children ? {children} : {}),
      ...(hasStyle && node.type === 'text' ? {style: patchStyle(node.style, changes)} : {}),
      ...(changes.fontWeight !== undefined && node.type === 'text'
        ? {
            format:
              changes.fontWeight === 'bold'
                ? Number(node.format || 0) | 1
                : Number(node.format || 0) & ~1
          }
        : {}),
      ...(changes.textAlign !== undefined && node.type === 'paragraph'
        ? {format: changes.textAlign}
        : {})
    };
  }
  return {...saved, root: patch(root)};
}

export function getAnnotationText(annotation: TextAnnotation): string {
  const root = annotation.editorState?.root;
  return root?.type === 'root' && Array.isArray(root.children)
    ? textRuns(root)
        .map(run => run.text)
        .join('')
    : annotation.label;
}

export function describeAnnotationText(annotation: TextAnnotation): {
  fontSize: number | null;
  fontWeight: 'normal' | 'bold' | null;
  textColor: string | null;
  textAlign: TextAlignment | null;
} {
  const state = buildAnnotationEditorState(annotation, {});
  const runs = textRuns(state.root).filter(run => run.node.type === 'text' && !run.boundary);
  const blocks: SerializedNode[] = state.root.children ?? [];
  const styles = blocks.flatMap(block => {
    const blockRuns = runs.filter(run => run.paragraph === block);
    return blockRuns.length
      ? blockRuns.map(run => ({
          style: run.node.style,
          color:
            cssValue(run.node.style, 'color') ??
            (run.wrappers.some(wrapper => wrapper.type === 'link' || wrapper.type === 'autolink')
              ? 'rgb(33, 111, 219)'
              : '#FFFFFF')
        }))
      : [{style: block.textStyle, color: cssValue(block.textStyle, 'color') ?? '#FFFFFF'}];
  });
  const uniform = <T>(values: T[], fallback: T): T | null =>
    values.length === 0 ? fallback : values.every(value => value === values[0]) ? values[0] : null;
  const sizes = styles.map(({style}) => {
    const value = cssValue(style, 'font-size') ?? '14px';
    return /^\d+(?:\.\d+)?px$/i.test(value) ? Number.parseFloat(value) : null;
  });
  return {
    fontSize: uniform(sizes, 14),
    fontWeight: uniform<'normal' | 'bold'>(
      runs.map(({node}) => {
        const weight = cssValue(node.style, 'font-weight');
        return weight
          ? weight === 'bold' || Number(weight) >= 600
            ? 'bold'
            : 'normal'
          : Number(node.format || 0) & 1
          ? 'bold'
          : 'normal';
      }),
      'normal'
    ),
    textColor: uniform(
      styles.map(({color}) => color),
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
