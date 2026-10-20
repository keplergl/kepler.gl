// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {DndContext} from '@dnd-kit/core';
import {screen} from '@testing-library/react';

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

describe('AnnotationText ruler labels', () => {
  test('renders custom text and live distance together at the ruler midpoint', async () => {
    const {container} = renderRulerText(makeRuler());

    expect(await screen.findByText('Measured span')).toBeInTheDocument();
    expect(screen.getByText('Length: 111.20 km')).toBeInTheDocument();
    expect(container.querySelector('[data-annotation-part="text"]')).toHaveStyle({
      left: '505px',
      top: '300px',
      transform: 'translate(-50%, -50%)'
    });
  });

  test('can show only distance, or no midpoint text at all while leaving shape rendering separate', () => {
    const distanceOnly = renderRulerText(makeRuler({showCustomText: false}));
    expect(screen.getByText('Length: 111.20 km')).toBeInTheDocument();
    expect(screen.queryByText('Measured span')).not.toBeInTheDocument();
    distanceOnly.unmount();

    const hidden = renderRulerText(
      makeRuler({showCustomText: false, showDistance: false}),
      true
    );
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
