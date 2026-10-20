// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent} from '@testing-library/react';

import {AnnotationKind} from '@kepler.gl/constants';
import {RulerAnnotation} from '@kepler.gl/types';
import {renderWithTheme} from 'test/helpers/component-jest-utils';

import AnnotationOverlay from './annotation-overlay';
import {MapViewport} from './annotation-utils';

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

describe('AnnotationOverlay ruler interactions', () => {
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
