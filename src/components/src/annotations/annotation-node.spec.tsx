// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {DndContext} from '@dnd-kit/core';
import {render} from '@testing-library/react';

import {AnnotationKind} from '@kepler.gl/constants';
import {Annotation} from '@kepler.gl/types';

import AnnotationNode, {RulerEndpointHandles} from './annotation-node';
import {
  MapViewport,
  makeMarker,
  getRulerDistanceLabel,
  RulerAnnotationMarker
} from './annotation-utils';
// @ts-ignore Experimental export is missing from the repository's deck.gl type augmentation.
import {_GlobeViewport as GlobeViewport} from '@deck.gl/core';

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

const rulerAnnotation: Annotation = {
  id: 'ruler-1',
  kind: AnnotationKind.RULER,
  isVisible: true,
  autoSize: true,
  autoSizeY: true,
  anchorPoint: [0, 0, 10],
  endPoint: [2, 0, 30],
  label: 'Measured span',
  lineColor: '#ffffff',
  lineWidth: 2,
  textWidth: 120,
  textHeight: 40,
  showCustomText: true,
  showDistance: true
};

describe('AnnotationNode', () => {
  test('projects a globe surface arc and geographic midpoint instead of a screen chord', () => {
    const globe = new GlobeViewport({longitude: 0, latitude: 20, zoom: 0, width: 800, height: 600});
    const ruler = {
      ...rulerAnnotation,
      anchorPoint: [-60, 30],
      endPoint: [60, 30]
    } as typeof rulerAnnotation;
    const arc = makeMarker(ruler, globe, true) as RulerAnnotationMarker;
    const chord = makeMarker(ruler, globe) as RulerAnnotationMarker;
    expect(arc.path?.split('L').length).toBeGreaterThan(2);
    expect(Math.abs(arc.my - chord.my)).toBeGreaterThan(5);
    // The spherical midpoint rises to latitude atan(tan(30) / cos(60)).
    const midpoint = globe.project([
      0,
      (Math.atan(Math.tan(Math.PI / 6) / Math.cos(Math.PI / 3)) * 180) / Math.PI
    ]);
    expect(arc.x + arc.mx).toBeCloseTo(midpoint[0]);
    expect(arc.y + arc.my).toBeCloseTo(midpoint[1]);
    expect(chord.path).toBeUndefined();
    const {container} = render(
      <svg>
        <DndContext>
          <AnnotationNode
            annotation={ruler}
            viewport={globe}
            isGlobeEnabled
            isEditing={false}
            isSelected={false}
          />
        </DndContext>
      </svg>
    );
    expect(container.querySelector('path')).toHaveAttribute('d', arc.path);
  });

  test.each([
    [
      [179, 0],
      [-179, 0]
    ],
    [
      [0, 80],
      [180, 80]
    ],
    [
      [0, 0],
      [0, 0]
    ]
  ])(
    'keeps globe ruler %j to %j finite across the dateline, pole and coincident endpoints',
    (anchorPoint, endPoint) => {
      const globe = new GlobeViewport({
        longitude: 180,
        latitude: 40,
        zoom: 0,
        width: 800,
        height: 600
      });
      const arc = makeMarker(
        {...rulerAnnotation, anchorPoint, endPoint} as typeof rulerAnnotation,
        globe,
        true
      ) as RulerAnnotationMarker;
      expect(arc.path).not.toMatch(/NaN|Infinity/);
      expect(arc.path?.split('L').length).toBeLessThanOrEqual(91);
    }
  );

  test('reports great-circle surface distance rather than the globe chord length', () => {
    expect(
      getRulerDistanceLabel({...rulerAnnotation, anchorPoint: [0, 0], endPoint: [90, 0]} as any)
    ).toBe('Length: 10007.56 km');
  });

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

  test('renders a ruler line and only exposes both endpoint handles while editing', () => {
    const projectingViewport: MapViewport = {
      ...viewport,
      project: ([lng, _lat, altitude = 0]) => [100 + lng * 10, 200 - altitude]
    };
    const {container, rerender} = render(
      <svg>
        <DndContext>
          <AnnotationNode
            annotation={rulerAnnotation}
            viewport={projectingViewport}
            isEditing={true}
            isSelected={true}
          />
          <RulerEndpointHandles
            annotation={rulerAnnotation}
            viewport={projectingViewport}
            isEditing={true}
            isSelected={true}
          />
        </DndContext>
      </svg>
    );

    expect(container.querySelector('path')).toHaveAttribute('d', 'M0,0 L20,-20');
    expect(container.querySelectorAll('circle')).toHaveLength(4);

    rerender(
      <svg>
        <DndContext>
          <AnnotationNode
            annotation={rulerAnnotation}
            viewport={projectingViewport}
            isEditing={false}
            isSelected={false}
          />
          <RulerEndpointHandles
            annotation={rulerAnnotation}
            viewport={projectingViewport}
            isEditing={false}
            isSelected={false}
          />
        </DndContext>
      </svg>
    );

    expect(container.querySelector('path')).toBeInTheDocument();
    expect(container.querySelectorAll('circle')).toHaveLength(0);
  });
});
