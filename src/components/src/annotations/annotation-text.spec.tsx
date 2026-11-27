// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {DndContext} from '@dnd-kit/core';
import {act, fireEvent, screen, waitFor} from '@testing-library/react';
import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  LexicalEditor,
  SerializedEditorState,
  SerializedElementNode,
  SerializedTextNode
} from 'lexical';

import {AnnotationKind} from '@kepler.gl/constants';
import {DEFAULT_RULER_STYLE} from '@kepler.gl/utils';
import {Annotation} from '@kepler.gl/types';
import {renderWithTheme} from 'test/helpers/component-jest-utils';

import AnnotationText from './annotation-text';
import {MapViewport} from './annotation-utils';

const viewport: MapViewport = {
  project: ([lng, lat]) => [500 + lng * 10, 300 - lat * 10],
  unproject: ([x, y]) => [(x - 500) / 10, (y - 300) / -10],
  longitude: 0,
  latitude: 0,
  width: 1000,
  height: 600,
  zoom: 10
};

const makeRuler = (overrides: Partial<Annotation> = {}): Annotation =>
  ({
    id: 'ruler-1',
    kind: AnnotationKind.RULER,
    isVisible: true,
    autoSize: true,
    autoSizeY: true,
    anchorPoint: [0, 0],
    endPoint: [1, 0],
    label: 'Measured span',
    lineColor: '#FFFFFF',
    lineWidth: 2,
    textWidth: 100,
    textHeight: 30,
    showCustomText: true,
    showDistance: true,
    ...overrides
  } as Annotation);

const renderRulerText = (
  annotation: Annotation,
  isEditing = false,
  opacity = 1,
  readoutValue?: string
) =>
  renderWithTheme(
    <DndContext>
      <AnnotationText
        annotation={annotation}
        readoutValue={readoutValue}
        opacity={opacity}
        viewport={viewport}
        isEditing={isEditing}
        isSelected={isEditing}
        isEditingText={isEditing}
        onSelect={jest.fn()}
        onChangeText={jest.fn()}
        onUpdateAnnotation={jest.fn()}
      />
    </DndContext>
  );

function captionEditorState(
  text: string,
  style: string
): SerializedEditorState<SerializedElementNode<SerializedTextNode>> {
  return {
    root: {
      type: 'root',
      version: 1,
      direction: null,
      format: '',
      indent: 0,
      children: [
        {
          type: 'paragraph',
          version: 1,
          direction: null,
          format: 'right',
          indent: 0,
          children: [{type: 'text', version: 1, text, style, format: 3, detail: 0, mode: 'normal'}]
        }
      ]
    }
  };
}

test.each([true, false])('shows the ruler readout only with custom text (%s)', showCustomText => {
  const annotation = makeRuler({showCustomText, readout: {type: 'time'}});
  const {container} = renderRulerText(annotation, false, 1, '2026-01-01');
  const readout = screen.queryByText('2026-01-01');
  expect(readout?.textContent ?? null).toBe(showCustomText ? '2026-01-01' : null);
  expect(container.querySelector('[data-annotation-part="distance"]')).toBeVisible();
});

describe('AnnotationText readout formatting', () => {
  test.each([
    {readout: {type: 'time'} as const, value: '2026-01-01', nextValue: '2026-01-02'},
    {readout: {type: 'count', dataId: 'points'} as const, value: '123', nextValue: '45'}
  ])(
    '$readout.type keeps annotation formatting as its value and saved styles change',
    async ({readout, value, nextValue}) => {
      const annotation = makeRuler({
        kind: AnnotationKind.TEXT,
        viewport: {anchor: 'top-left', margin: [24, 24]},
        readout,
        label: 'Caption',
        editorState: captionEditorState(
          'Caption',
          'font-size: 32px; color: #ff0000; font-family: Georgia;'
        )
      });
      const original = JSON.stringify(annotation);
      const onChangeText = jest.fn();
      const renderCaption = (current: Annotation, currentValue: string) => (
        <DndContext>
          <AnnotationText
            annotation={current}
            readoutValue={currentValue}
            viewport={viewport}
            isEditing={false}
            isSelected={false}
            isEditingText={false}
            onSelect={jest.fn()}
            onChangeText={onChangeText}
            onUpdateAnnotation={jest.fn()}
          />
        </DndContext>
      );
      const {container, rerender} = renderWithTheme(renderCaption(annotation, value));
      expect(screen.getByText(value)).toHaveStyle({
        fontSize: '32px',
        color: '#ff0000',
        fontFamily: 'Georgia'
      });
      expect(
        container.querySelector('[data-annotation-part="readout"] .lexical-paragraph')
      ).toHaveStyle({textAlign: 'right'});
      expect(
        container.querySelector('[data-annotation-part="readout"] .lexical-text-bold')
      ).toBeInTheDocument();
      expect(
        container.querySelector('[data-annotation-part="readout"] .lexical-text-italic')
      ).toBeInTheDocument();
      onChangeText.mockClear();
      rerender(renderCaption(annotation, nextValue));
      await waitFor(() =>
        expect(screen.getByText(nextValue)).toHaveStyle({fontSize: '32px', color: '#ff0000'})
      );
      expect(screen.queryByText(value)).not.toBeInTheDocument();
      expect(onChangeText).not.toHaveBeenCalled();
      expect(JSON.stringify(annotation)).toBe(original);
      rerender(
        renderCaption(
          {
            ...annotation,
            editorState: captionEditorState('Caption', 'font-size: 48px; color: #00ff00;')
          },
          nextValue
        )
      );
      await waitFor(() =>
        expect(screen.getByText(nextValue)).toHaveStyle({fontSize: '48px', color: '#00ff00'})
      );
      expect(screen.getByText('Caption')).toHaveStyle({fontSize: '48px', color: '#00ff00'});
      rerender(renderCaption({...annotation, editorState: undefined}, nextValue));
      await waitFor(() => expect(screen.getByText(nextValue).style.fontSize).toBe(''));
      expect(screen.getByText(nextValue).style.color).toBe('');

      // Preserve an intentional blank line when the multiline caption has text,
      // but remove the label's layout space when the caption is cleared.
      const multiline = captionEditorState('Caption', '');
      const paragraph = multiline.root.children[0];
      multiline.root.children.unshift({...paragraph, children: []});
      rerender(renderCaption({...annotation, editorState: multiline}, nextValue));
      expect(screen.getByText('Caption')).toBeVisible();
      expect(container.querySelector('.editor-inner')).toBeVisible();
      rerender(renderCaption({...annotation, label: '', editorState: undefined}, nextValue));
      expect(container.querySelector('.editor-inner')).not.toBeVisible();
      expect(screen.getByText(nextValue)).toBeVisible();
    }
  );

  test.each([{type: 'time'} as const, {type: 'count', dataId: 'points'} as const])(
    'collapses the empty $type caption in view mode and keeps it editable',
    readout => {
      const annotation = makeRuler({
        kind: AnnotationKind.TEXT,
        viewport: {anchor: 'top-left', margin: [24, 24]},
        readout,
        label: '',
        editorState: captionEditorState('', 'font-size: 36px;')
      });
      const view = renderRulerText(annotation);
      expect(view.container.querySelector('.editor-inner')).not.toBeVisible();
      expect(screen.getByText('—')).toBeVisible();
      view.unmount();

      const edit = renderRulerText(annotation, true);
      expect(edit.container.querySelector('.editor-input')).toBeVisible();
      expect(edit.container.querySelector('.editor-input')).toHaveAttribute(
        'contenteditable',
        'true'
      );
    }
  );

  test.each([{type: 'time'} as const, {type: 'count', dataId: 'points'} as const])(
    'removes the $type caption row immediately when deleting styled text',
    async readout => {
      function Caption() {
        const [editing, setEditing] = React.useState(true);
        const [annotation, setAnnotation] = React.useState(() =>
          makeRuler({
            kind: AnnotationKind.TEXT,
            viewport: {anchor: 'top-left', margin: [24, 24]},
            readout,
            label: 'Caption',
            editorState: captionEditorState('Caption', 'font-size: 36px;')
          })
        );
        return (
          <DndContext>
            <button onClick={() => setEditing(false)}>Done editing</button>
            <AnnotationText
              annotation={annotation}
              readoutValue="123"
              viewport={viewport}
              isEditing
              isSelected
              isEditingText={editing}
              onSelect={jest.fn()}
              onChangeText={(label, editorState) =>
                setAnnotation(previous => ({...previous, label, editorState}))
              }
              onUpdateAnnotation={jest.fn()}
            />
          </DndContext>
        );
      }

      const {container} = renderWithTheme(<Caption />);
      const input = container.querySelector<HTMLElement>('[contenteditable="true"]')!;
      const caption = input.parentElement!;
      const editor = (input as HTMLElement & {__lexicalEditor: LexicalEditor}).__lexicalEditor;
      expect(caption).not.toHaveStyle({height: '0px'});
      input.focus();
      const selectCaption = () => {
        const text = $getRoot().getFirstDescendant();
        if ($isTextNode(text)) text.select(0, 7);
        const selection = $getSelection();
        if ($isRangeSelection(selection)) selection.removeText();
      };
      await act(() => editor.update(selectCaption, {discrete: true, tag: 'skip-scroll-into-view'}));
      expect(caption).toHaveStyle({height: '0px'});
      expect(input).toHaveFocus();
      expect(input).toHaveAttribute('contenteditable', 'true');
      expect(screen.getByText('123')).toBeVisible();

      await act(() =>
        editor.update(
          () => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) selection.insertText('Caption');
          },
          {discrete: true, tag: 'skip-scroll-into-view'}
        )
      );
      expect(input).toHaveTextContent('Caption');
      expect(caption).not.toHaveStyle({height: '0px'});

      await act(() => editor.update(selectCaption, {discrete: true, tag: 'skip-scroll-into-view'}));
      fireEvent.click(screen.getByText('Done editing'));
      expect(caption).not.toBeVisible();
      expect(screen.getByText('123')).toBeVisible();
    }
  );

  test('uses saved formatting for an empty label and a missing readout value', () => {
    const annotation = makeRuler({
      kind: AnnotationKind.TEXT,
      viewport: {anchor: 'top-left', margin: [24, 24]},
      readout: {type: 'time'},
      label: '',
      editorState: captionEditorState('', 'font-size: 36px; color: #80caff;')
    });
    renderRulerText(annotation);
    expect(screen.getByText('—')).toHaveStyle({fontSize: '36px', color: '#80caff'});
  });

  test('applies toolbar styles to an empty-label readout and retains them as the value changes', async () => {
    const onChangeText = jest.fn();
    let updateValue!: React.Dispatch<React.SetStateAction<string>>;
    function Caption() {
      const [value, setValue] = React.useState('123');
      updateValue = setValue;
      const [annotation, setAnnotation] = React.useState(() =>
        makeRuler({
          kind: AnnotationKind.TEXT,
          viewport: {anchor: 'top-left', margin: [24, 24]},
          readout: {type: 'count', dataId: 'points'},
          label: ''
        })
      );
      return (
        <DndContext>
          <AnnotationText
            annotation={annotation}
            readoutValue={value}
            viewport={viewport}
            isEditing
            isSelected
            isEditingText={false}
            onSelect={jest.fn()}
            onChangeText={(label, editorState) => {
              onChangeText(label, editorState);
              setAnnotation(previous => ({...previous, label, editorState}));
            }}
            onUpdateAnnotation={jest.fn()}
          />
        </DndContext>
      );
    }
    const {container} = renderWithTheme(<Caption />);
    await act(async () => {
      fireEvent.change(screen.getAllByRole('combobox')[1], {target: {value: '24px'}});
    });
    fireEvent.click(screen.getByRole('button', {name: 'Text Color'}));
    await act(async () => {
      fireEvent.click(screen.getByText('Black'));
    });
    await waitFor(() =>
      expect(screen.getByText('123')).toHaveStyle({fontSize: '24px', color: '#000000'})
    );
    expect(
      container.querySelector('[data-annotation-part="readout"] .editor-input')
    ).toHaveAttribute('contenteditable', 'false');
    expect(container.querySelector('.editor-input')?.textContent).toBe('');
    expect(onChangeText).toHaveBeenCalled();
    expect(onChangeText.mock.calls.every(([label]) => label === '')).toBe(true);
    onChangeText.mockClear();
    act(() => updateValue('45'));
    expect(screen.getByText('45')).toHaveStyle({fontSize: '24px', color: '#000000'});
    expect(screen.queryByText('123')).not.toBeInTheDocument();
    expect(container.querySelector('.editor-input')?.textContent).toBe('');
    expect(onChangeText).not.toHaveBeenCalled();
  });

  test('uses the first text style when the label has mixed formatting', () => {
    const editorState = captionEditorState('First', 'font-size: 36px; color: #80caff;');
    const paragraph = editorState.root.children[0] as SerializedElementNode;
    paragraph.children.push({
      ...paragraph.children[0],
      text: ' second',
      style: 'font-size: 16px; color: #ff0000;'
    } as (typeof paragraph.children)[0]);
    renderRulerText(
      makeRuler({
        kind: AnnotationKind.TEXT,
        viewport: {anchor: 'top-left', margin: [24, 24]},
        readout: {type: 'count', dataId: 'points'},
        label: 'First second',
        editorState
      })
    );
    expect(screen.getByText('—')).toHaveStyle({fontSize: '36px', color: '#80caff'});
    expect(screen.getByText('second')).toHaveStyle({fontSize: '16px', color: '#ff0000'});
  });
});

describe('AnnotationText ruler labels', () => {
  test('keeps autosized labels intrinsic near the right edge but preserves fixed-width wrapping', () => {
    const annotation = makeRuler({anchorPoint: [49, 0], endPoint: [50, 0]} as Partial<Annotation>);
    const auto = renderRulerText(annotation);
    expect(auto.container.querySelector('[data-annotation-part="text"]')).toHaveStyle({
      width: 'max-content',
      left: '995px'
    });
    auto.unmount();
    const fixed = renderRulerText({...annotation, autoSize: false, textWidth: 160});
    expect(fixed.container.querySelector('[data-annotation-part="text"]')).toHaveStyle({
      width: '160px'
    });
  });

  test('renders custom text and live distance together at the ruler midpoint', async () => {
    const {container} = renderRulerText(makeRuler());

    expect(await screen.findByText('Measured span')).toBeInTheDocument();
    expect(screen.getByText('Length: 111.20 km')).toBeInTheDocument();
    expect(container.querySelector('[data-annotation-part="text"]')).toHaveStyle({
      left: '505px',
      top: '300px',
      transform: 'translate(-50%, -100%) rotate(0deg) translateY(-5px)',
      transformOrigin: '50% 100%'
    });
  });

  test.each([
    [[1, 1], -45],
    [[-1, -1], -45],
    [[1, -1], 45],
    [[-1, 1], 45],
    [[0, 1], -90],
    [[0, -1], -90],
    [[0, 0], 0]
  ])('keeps the label upright above projected ruler endpoint %j', (endPoint, angle) => {
    const {container} = renderRulerText(makeRuler({endPoint} as Partial<Annotation>));
    expect(container.querySelector('[data-annotation-part="text"]')).toHaveStyle({
      transformOrigin: '50% 100%',
      transform: `translate(-50%, -100%) rotate(${angle}deg) translateY(-5px)`
    });
  });

  test('can show only distance, or no midpoint text at all while leaving shape rendering separate', () => {
    const distanceOnly = renderRulerText(makeRuler({showCustomText: false}));
    expect(screen.getByText('Length: 111.20 km')).toBeInTheDocument();
    expect(screen.queryByText('Measured span')).not.toBeInTheDocument();
    distanceOnly.unmount();

    const hidden = renderRulerText(makeRuler({showCustomText: false, showDistance: false}), true);
    expect(hidden.container.querySelector('[data-annotation-part="text"]')).toBeNull();
  });

  test('applies annotation zoom fading to the combined ruler label', () => {
    const {container} = renderRulerText(makeRuler(), false, 0);
    expect(container.querySelector('[data-annotation-part="text"]')).toHaveStyle({
      opacity: '0',
      visibility: 'hidden',
      pointerEvents: 'none'
    });
  });
});

test('styled distance inherits rich text and shares a background while endpoints remain geographically attached', () => {
  const annotation = makeRuler({
    anchorPoint: [-101.869545, 33.553131],
    endPoint: [-101.742203, 33.412521],
    editorState: captionEditorState('Measured span', 'font-size: 32px; color: #ffd700;'),
    labelBackground: {color: '#123456', opacity: 0.7, padding: 8},
    rulerStyle: {
      ...DEFAULT_RULER_STYLE,
      unit: 'km',
      offset: 24,
      placement: 'below',
      startLabel: 'A',
      endLabel: 'B'
    }
  });
  const {container} = renderRulerText(annotation);
  expect(screen.getByText('19.6 km')).toHaveStyle({fontSize: '32px', color: '#ffd700'});
  expect(screen.getByText('19.6 km')).toHaveClass('lexical-text-bold');
  expect(screen.getByText('19.6 km').closest('p')).toHaveStyle({textAlign: 'right'});
  const label = container.querySelector('[data-annotation-part="text"]');
  expect(label).toHaveTextContent('Measured span');
  expect(label).toHaveTextContent('19.6 km');
  expect(label).toHaveStyle({backgroundColor: 'rgba(18, 52, 86, 0.7)', padding: '8px'});
  expect(label?.getAttribute('style')).toContain('translateY(29px)');
  expect(screen.getByText('A').closest('[data-annotation-part="endpoint-label"]')).toHaveStyle({
    left: `${500 - 101.869545 * 10}px`
  });
  expect(screen.getByText('B')).toHaveStyle({fontSize: '32px', color: '#ffd700'});
});

test.each(['', 'Hidden caption'])(
  'styles a distance-only ruler without replacing its %j caption or storing the computed number',
  async label => {
    const changes = jest.fn();
    let moveEndpoint!: () => void;
    function Ruler() {
      const [annotation, setAnnotation] = React.useState(() =>
        makeRuler({label, showCustomText: false, rulerStyle: {...DEFAULT_RULER_STYLE, unit: 'km'}})
      );
      moveEndpoint = () =>
        setAnnotation(previous => ({...previous, endPoint: [2, 0]} as Annotation));
      return (
        <DndContext>
          <AnnotationText
            annotation={annotation}
            viewport={viewport}
            isEditing
            isSelected
            isEditingText={false}
            onSelect={jest.fn()}
            onUpdateAnnotation={jest.fn()}
            onChangeText={(label, editorState) => {
              changes(label, editorState);
              setAnnotation(previous => ({...previous, label, editorState}));
            }}
          />
        </DndContext>
      );
    }
    renderWithTheme(<Ruler />);
    await act(async () => {
      fireEvent.change(screen.getAllByRole('combobox')[1], {target: {value: '24px'}});
    });
    await waitFor(() => expect(screen.getByText('111.2 km')).toHaveStyle({fontSize: '24px'}));
    await act(async () => {
      fireEvent.click(screen.getByRole('button', {name: 'Bold'}));
    });
    await waitFor(() => expect(screen.getByText('111.2 km')).toHaveClass('lexical-text-bold'));
    expect(changes).toHaveBeenCalled();
    expect(changes.mock.calls.every(([value]) => value === label)).toBe(true);
    expect(JSON.stringify(changes.mock.calls)).not.toContain('111.2 km');
    changes.mockClear();
    act(() => moveEndpoint());
    expect(screen.getByText('222.4 km')).toHaveStyle({fontSize: '24px'});
    expect(screen.getByText('222.4 km')).toHaveClass('lexical-text-bold');
    expect(changes).not.toHaveBeenCalled();
  }
);

test.each([
  {
    formatting: 'font size',
    applyFormatting: () =>
      fireEvent.change(screen.getAllByRole('combobox')[1], {target: {value: '24px'}}),
    assertFormatting: (element: Element) => expect(element).toHaveStyle({fontSize: '24px'})
  },
  {
    formatting: 'bold',
    applyFormatting: () => fireEvent.click(screen.getByRole('button', {name: 'Bold'})),
    assertFormatting: (element: Element) => expect(element).toHaveClass('lexical-text-bold')
  }
])(
  'applies $formatting to the distance after hiding a selected caption range',
  async ({applyFormatting, assertFormatting}) => {
    const changes = jest.fn();
    let setShowCustomText!: (show: boolean) => void;
    function Ruler() {
      const [showCustomText, setShow] = React.useState(true);
      setShowCustomText = setShow;
      const [annotation, setAnnotation] = React.useState(() => {
        const editorState = captionEditorState('First ', 'font-size: 32px;');
        const first = editorState.root.children[0].children[0];
        first.format = 0;
        editorState.root.children[0].children.push({
          ...first,
          text: 'Second',
          style: 'font-size: 12px;'
        });
        return makeRuler({
          label: 'First Second',
          editorState,
          rulerStyle: {...DEFAULT_RULER_STYLE, unit: 'km'}
        });
      });
      return (
        <DndContext>
          <AnnotationText
            annotation={{...annotation, showCustomText} as Annotation}
            viewport={viewport}
            isEditing
            isSelected
            isEditingText={showCustomText}
            onSelect={jest.fn()}
            onUpdateAnnotation={jest.fn()}
            onChangeText={(label, editorState) => {
              changes(label, editorState);
              setAnnotation(previous => ({...previous, label, editorState}));
            }}
          />
        </DndContext>
      );
    }
    const {container} = renderWithTheme(<Ruler />);
    const input = container.querySelector<HTMLElement>('[contenteditable="true"]');
    if (!input) throw new Error('Expected an editable ruler caption');
    const editor = (input as HTMLElement & {__lexicalEditor: LexicalEditor}).__lexicalEditor;
    input.focus();
    await act(() =>
      editor.update(() => $getRoot().getAllTextNodes()[1].select(0, 6), {
        discrete: true,
        tag: 'skip-scroll-into-view'
      })
    );
    act(() => setShowCustomText(false));
    await act(async () => {
      document.dispatchEvent(new Event('selectionchange'));
    });
    changes.mockClear();
    await act(async () => {
      applyFormatting();
    });
    await waitFor(() => assertFormatting(screen.getByText('111.2 km')));
    expect(changes).toHaveBeenCalled();
    expect(changes.mock.calls.every(([label]) => label === 'First Second')).toBe(true);
    expect(JSON.stringify(changes.mock.calls)).not.toContain('111.2 km');
    act(() => setShowCustomText(true));
    expect(input).toHaveTextContent('First Second');
    const captionSpans = input.querySelectorAll('[data-lexical-text="true"]');
    expect(captionSpans.length).toBeGreaterThan(0);
    for (const span of captionSpans) {
      assertFormatting(span);
    }
  }
);
