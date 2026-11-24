// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {DndContext} from '@dnd-kit/core';
import {act, fireEvent, screen, waitFor} from '@testing-library/react';
import {SerializedEditorState, SerializedElementNode, SerializedTextNode} from 'lexical';

import {AnnotationKind} from '@kepler.gl/constants';
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

const renderRulerText = (annotation: Annotation, isEditing = false, opacity = 1) =>
  renderWithTheme(
    <DndContext>
      <AnnotationText
        annotation={annotation}
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
