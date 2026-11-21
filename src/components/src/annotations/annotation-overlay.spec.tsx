// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {act, fireEvent} from '@testing-library/react';

import {AnnotationKind} from '@kepler.gl/constants';
import {Annotation, RulerAnnotation} from '@kepler.gl/types';
import {renderWithTheme} from 'test/helpers/component-jest-utils';

import AnnotationOverlay from './annotation-overlay';
import {MapViewport} from './annotation-utils';
// @ts-ignore Experimental export is missing from the repository's deck.gl type augmentation.
import {_GlobeViewport as GlobeViewport} from '@deck.gl/core';

const ruler: RulerAnnotation = {
  id: 'ruler-1',
  kind: AnnotationKind.RULER,
  isVisible: true,
  autoSize: true,
  autoSizeY: true,
  anchorPoint: [0, 0],
  endPoint: [0.01, 0],
  label: 'Short ruler',
  lineColor: '#FFFFFF',
  lineWidth: 2,
  textWidth: 100,
  textHeight: 30,
  showCustomText: true,
  showDistance: true
};

const viewport: MapViewport = {
  project: ([lng, lat]) => [500 + lng * 10, 300 - lat * 10],
  unproject: ([x, y]) => [(x - 500) / 10, (y - 300) / -10],
  longitude: 0,
  latitude: 0,
  width: 1000,
  height: 600,
  zoom: 10
};

// jsdom lacks PointerEvent; MouseEvent supplies the coordinates used by the sensor.
function dispatchPointer(target: Node, type: string, x: number, y: number) {
  const event = new MouseEvent(type, {bubbles: true, button: 0, clientX: x, clientY: y});
  Object.defineProperty(event, 'isPrimary', {value: true});
  fireEvent(target, event);
}

const makeLegacyAnnotation = (kind: AnnotationKind): Annotation =>
  ({...ruler, id: 'legacy-1', kind, armLength: 20, angle: 0, radiusInMeters: 1000} as Annotation);

describe('AnnotationOverlay opacity animation', () => {
  test.each([
    AnnotationKind.TEXT,
    AnnotationKind.POINT,
    AnnotationKind.ARROW,
    AnnotationKind.CIRCLE,
    AnnotationKind.RULER
  ])('combines zoom and elapsed opacity across %s shapes, text and handles', kind => {
    const annotation: Annotation = {
      ...makeLegacyAnnotation(kind),
      opacityTransitions: [
        {
          id: 'in',
          startTimeMs: 1000,
          endTimeMs: 3000,
          startValue: 0,
          endValue: 0.6,
          easing: 'linear'
        },
        {
          id: 'dim',
          startTimeMs: 5000,
          endTimeMs: 7000,
          startValue: 0.6,
          endValue: 0.2,
          easing: 'linear'
        }
      ]
    };
    const savedAnnotation = JSON.parse(JSON.stringify(annotation));
    let updatePreview!: React.Dispatch<
      React.SetStateAction<{time: number | null | undefined; visible: boolean}>
    >;
    function Preview() {
      const [preview, setPreview] = React.useState<{
        time: number | null | undefined;
        visible: boolean;
      }>({time: 0, visible: true});
      updatePreview = setPreview;
      return (
        <AnnotationOverlay
          annotations={[{...annotation, isVisible: preview.visible}]}
          animationTimeMs={preview.time}
          getAnnotationOpacity={() => 0.8}
          selectedAnnotationId={annotation.id}
          isEditingAnnotationText={false}
          isAnnotationMode={true}
          mapIndex={0}
          viewport={viewport}
          updateAnnotation={jest.fn()}
          setSelectedAnnotation={jest.fn()}
        />
      );
    }
    const {container} = renderWithTheme(<Preview />);
    expect(container.querySelector('[data-annotation-id]')).toBeNull();
    expect(container.querySelector('[role="button"]')).toBeNull();
    for (const [time, expected] of [
      [2000, 0.24],
      [4000, 0.48],
      [6000, 0.32],
      [8000, 0.16],
      [undefined, 0.8],
      [null, 0.8]
    ] as const) {
      act(() => updatePreview({time, visible: true}));
      const parts = container.querySelectorAll<HTMLElement>('[data-annotation-id]');
      expect(parts).toHaveLength(kind === AnnotationKind.RULER ? 3 : 2);
      parts.forEach(part => expect(Number(part.style.opacity)).toBeCloseTo(expected));
    }
    act(() => updatePreview({time: 4000, visible: false}));
    expect(container.querySelector('[data-annotation-id]')).toBeNull();
    expect(annotation).toEqual(savedAnnotation);
  });
});

describe('AnnotationOverlay ruler interactions', () => {
  test.each([
    AnnotationKind.TEXT,
    AnnotationKind.POINT,
    AnnotationKind.ARROW,
    AnnotationKind.CIRCLE
  ])('preserves anchor and label dragging for %s annotations', kind => {
    const updateAnnotation = jest.fn();
    const {container} = renderWithTheme(
      <AnnotationOverlay
        annotations={[makeLegacyAnnotation(kind)]}
        selectedAnnotationId="legacy-1"
        isEditingAnnotationText={false}
        isAnnotationMode={true}
        mapIndex={0}
        viewport={viewport}
        updateAnnotation={updateAnnotation}
        setSelectedAnnotation={jest.fn()}
      />
    );
    const anchor = container.querySelector('[data-annotation-part="shape"] [role="button"]')!;
    const text = container.querySelector('[data-annotation-part="text"]')!;

    for (const handle of [anchor, text]) {
      updateAnnotation.mockClear();
      dispatchPointer(handle, 'pointerdown', 500, 300);
      dispatchPointer(document, 'pointermove', 504, 300);
      dispatchPointer(document, 'pointermove', 520, 290);
      dispatchPointer(document, 'pointerup', 520, 290);

      expect(updateAnnotation).toHaveBeenCalled();
      const [id, changes] = updateAnnotation.mock.calls[updateAnnotation.mock.calls.length - 1];
      expect(id).toBe('legacy-1');
      if (handle === anchor || kind === AnnotationKind.TEXT) {
        expect(changes).toEqual({anchorPoint: [2, 1]});
      } else {
        expect(changes).not.toHaveProperty('anchorPoint');
        expect(changes.angle).toBeLessThan(0);
        expect(changes.armLength).toBeGreaterThan(20);
        expect(changes.textSide).toBe('right');
        expect(changes.textVerticalPosition).toBe('above');
      }
    }
  });

  test('renders legacy annotations and rulers without editing controls in view mode', () => {
    const updateAnnotation = jest.fn();
    const setSelectedAnnotation = jest.fn();
    const {container} = renderWithTheme(
      <AnnotationOverlay
        annotations={[makeLegacyAnnotation(AnnotationKind.POINT), ruler]}
        selectedAnnotationId={ruler.id}
        isEditingAnnotationText={true}
        isAnnotationMode={false}
        mapIndex={0}
        viewport={viewport}
        updateAnnotation={updateAnnotation}
        setSelectedAnnotation={setSelectedAnnotation}
      />
    );

    expect(container.querySelectorAll('[data-annotation-part="shape"]')).toHaveLength(2);
    expect(container.querySelectorAll('[data-annotation-part="text"]')).toHaveLength(2);
    expect(container.querySelector('[data-annotation-part="distance"]')).toHaveTextContent(
      'Length: 1.11 km'
    );
    expect(container.querySelector('[role="button"], [contenteditable="true"]')).toBeNull();
    for (const text of container.querySelectorAll('[data-annotation-part="text"]')) {
      fireEvent.click(text);
    }
    expect(updateAnnotation).not.toHaveBeenCalled();
    expect(setSelectedAnnotation).not.toHaveBeenCalled();
  });

  test.each([
    [[0, 0], [120, 0], true, true],
    [[120, 0], [0, 0], false, true],
    [[60, 0], [120, 0], true, false]
  ])(
    'keeps only the visible globe ruler portion from %j to %j',
    (anchorPoint, endPoint, startsVisible, labelVisible) => {
      const globe = new GlobeViewport({
        longitude: 0,
        latitude: 0,
        width: 800,
        height: 600,
        zoom: 0
      });
      const {container} = renderWithTheme(
        <AnnotationOverlay
          annotations={[{...ruler, anchorPoint, endPoint} as RulerAnnotation]}
          selectedAnnotationId={ruler.id}
          isEditingAnnotationText={false}
          isAnnotationMode
          mapIndex={0}
          viewport={globe}
          isGlobeEnabled
          updateAnnotation={jest.fn()}
          setSelectedAnnotation={jest.fn()}
        />
      );
      const path = container.querySelector('[data-annotation-part="shape"] path');
      expect(path).toBeInTheDocument();
      const coordinates =
        path
          ?.getAttribute('d')
          ?.split(/[ML]/)
          .filter(Boolean)
          .map(part => part.trim().split(',').map(Number)) || [];
      expect(coordinates.length).toBeGreaterThan(2);
      // A far-side equatorial arc doubles back on itself. Clipping must stop at
      // the horizon instead of drawing that folded-back, occluded section.
      for (let i = 1; i < coordinates.length; i++) {
        const delta = coordinates[i][0] - coordinates[i - 1][0];
        expect(startsVisible ? delta : -delta).toBeGreaterThanOrEqual(-0.01);
      }
      expect(
        container.querySelectorAll('[data-annotation-part="handles"] [role="button"]')
      ).toHaveLength(1);
      expect(container.querySelector('[data-annotation-part="text"]')).toHaveStyle({
        display: labelVisible ? 'block' : 'none'
      });
    }
  );

  test('renders endpoint handles above midpoint text so short rulers remain draggable', () => {
    const {container} = renderWithTheme(
      <AnnotationOverlay
        annotations={[ruler]}
        selectedAnnotationId={ruler.id}
        isEditingAnnotationText={false}
        isAnnotationMode={true}
        mapIndex={0}
        viewport={viewport}
        updateAnnotation={jest.fn()}
        setSelectedAnnotation={jest.fn()}
      />
    );

    const text = container.querySelector('[data-annotation-part="text"]');
    const handles = container.querySelector('[data-annotation-part="handles"]');

    expect(text).toBeInTheDocument();
    expect(handles).toBeInTheDocument();
    expect(text?.compareDocumentPosition(handles as Node) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    );
  });

  test.each<[string, [number, number]]>([
    ['short', [0.01, 0]],
    ['coincident', [0, 0]],
    ['vertical', [0, 0.01]],
    ['diagonal', [0.01, 0.01]]
  ])('independently drags both endpoints of a %s ruler', (_name, endPoint) => {
    const updateAnnotation = jest.fn();
    const setSelectedAnnotation = jest.fn();
    const {container} = renderWithTheme(
      <AnnotationOverlay
        annotations={[{...ruler, endPoint}]}
        selectedAnnotationId={ruler.id}
        isEditingAnnotationText={false}
        isAnnotationMode={true}
        mapIndex={0}
        viewport={viewport}
        updateAnnotation={updateAnnotation}
        setSelectedAnnotation={setSelectedAnnotation}
      />
    );
    const handles = Array.from<SVGCircleElement>(
      container.querySelectorAll('[data-annotation-part="handles"] [role="button"]')
    );
    expect(handles).toHaveLength(2);
    const centers = handles.map(handle => [
      Number(handle.getAttribute('cx')),
      Number(handle.getAttribute('cy'))
    ]);
    const radii = handles.map(handle => Number(handle.getAttribute('r')));
    // Unlike dispatching directly to overlapping nodes, this checks both pointer
    // targets are actually reachable without being covered by the other handle.
    expect(
      Math.hypot(centers[1][0] - centers[0][0], centers[1][1] - centers[0][1])
    ).toBeGreaterThan(radii[0] + radii[1]);

    handles.forEach((handle, index) => {
      updateAnnotation.mockClear();
      const [x, y] = [500 + centers[index][0], 300 + centers[index][1]];
      dispatchPointer(handle, 'pointerdown', x, y);
      dispatchPointer(document, 'pointermove', x + 4, y);
      dispatchPointer(document, 'pointermove', x + 20, y - 10);
      dispatchPointer(document, 'pointerup', x + 20, y - 10);

      expect(setSelectedAnnotation).toHaveBeenLastCalledWith(ruler.id, false);
      expect(updateAnnotation).toHaveBeenCalled();
      const [id, changes] = updateAnnotation.mock.calls[updateAnnotation.mock.calls.length - 1];
      const key = index === 0 ? 'anchorPoint' : 'endPoint';
      const original = index === 0 ? ruler.anchorPoint : endPoint;
      expect(id).toBe(ruler.id);
      expect(Object.keys(changes)).toEqual([key]);
      expect(changes[key][0]).toBeCloseTo(original[0] + 2);
      expect(changes[key][1]).toBeCloseTo(original[1] + 1);
    });
  });
});
