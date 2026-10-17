// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {DndContext} from '@dnd-kit/core';
import {render} from '@testing-library/react';

import {AnnotationKind} from '@kepler.gl/constants';
import {Annotation} from '@kepler.gl/types';

import AnnotationNode from './annotation-node';
import {MapViewport} from './annotation-utils';

const annotation: Annotation = {
  id: 'annotation-1',
  kind: AnnotationKind.POINT,
  isVisible: true,
  autoSize: false,
  autoSizeY: false,
  anchorPoint: [0, 0],
  label: 'Test annotation',
  lineColor: '#ffffff',
  lineWidth: 2,
  textWidth: 120,
  textHeight: 40,
  armLength: 20,
  angle: 0
};

const viewport: MapViewport = {
  project: () => [100, 200],
  unproject: () => [0, 0],
  longitude: 0,
  latitude: 0,
  width: 800,
  height: 600,
  zoom: 4
};

describe('AnnotationNode', () => {
  test('removes the entire annotation shape from hit testing at zero opacity', () => {
    const {container, rerender} = render(
      <svg>
        <DndContext>
          <AnnotationNode
            annotation={annotation}
            opacity={0}
            viewport={viewport}
            isEditing={true}
            isSelected={true}
          />
        </DndContext>
      </svg>
    );
    const shape = container.querySelector('[data-annotation-part="shape"]') as SVGGElement;

    expect(shape.style.display).toBe('none');

    rerender(
      <svg>
        <DndContext>
          <AnnotationNode
            annotation={annotation}
            opacity={0.5}
            viewport={viewport}
            isEditing={true}
            isSelected={true}
          />
        </DndContext>
      </svg>
    );

    expect(shape.style.display).toBe('');
  });
});
