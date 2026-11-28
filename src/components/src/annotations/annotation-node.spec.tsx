// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {DndContext} from '@dnd-kit/core';
import {render} from '@testing-library/react';

import {AnnotationKind} from '@kepler.gl/constants';
import {DEFAULT_RULER_STYLE, DEFAULT_ANNOTATION_ELEVATION} from '@kepler.gl/utils';
import {WebMercatorViewport} from '@deck.gl/core';
import {Annotation} from '@kepler.gl/types';

import AnnotationNode, {RulerEndpointHandles} from './annotation-node';
import {
  MapViewport,
  makeMarker,
  getRulerDistanceLabel,
  RulerAnnotationMarker
} from './annotation-utils';
import {
  getElevationGuide,
  getVerticalScaleGeometry,
  isAnnotationVisibleOnGlobe,
  movePoint
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

  test.each([
    [
      [0, 89.9999999999],
      [45, 80],
      [45, 85]
    ],
    [
      [120, -89.9999999999],
      [-30, -80],
      [-30, -85]
    ],
    [
      [0, 90],
      [45, 80],
      [45, 85]
    ],
    [
      [45, 80],
      [0, 90],
      [45, 85]
    ],
    [
      [120, -90],
      [-30, -80],
      [-30, -85]
    ],
    [
      [-30, -80],
      [120, -90],
      [-30, -85]
    ]
  ])(
    'places the midpoint on the destination meridian for polar ruler %j to %j',
    (anchorPoint, endPoint, midpoint) => {
      const globe = new GlobeViewport({
        longitude: 0,
        latitude: 0,
        zoom: 0,
        width: 800,
        height: 600
      });
      const arc = makeMarker(
        {...rulerAnnotation, anchorPoint, endPoint} as typeof rulerAnnotation,
        globe,
        true
      ) as RulerAnnotationMarker;
      const projected = globe.project(midpoint);
      expect(arc.x + arc.mx).toBeCloseTo(projected[0]);
      expect(arc.y + arc.my).toBeCloseTo(projected[1]);
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

describe('styled ruler measurement', () => {
  const ruler = {
    ...rulerAnnotation,
    anchorPoint: [-101.869545, 33.553131],
    endPoint: [-101.742203, 33.412521],
    rulerStyle: {...DEFAULT_RULER_STYLE, unit: 'km' as const}
  } as typeof rulerAnnotation;
  test('formats the acceptance example and recomputes after either endpoint moves', () => {
    expect(getRulerDistanceLabel(ruler)).toBe('19.6 km');
    expect(getRulerDistanceLabel({...ruler, anchorPoint: [-101.8, 33.5]})).not.toBe('19.6 km');
    expect(getRulerDistanceLabel({...ruler, endPoint: [-101.7, 33.4]})).not.toBe('19.6 km');
    expect(
      getRulerDistanceLabel({
        ...ruler,
        rulerStyle: {...DEFAULT_RULER_STYLE, unit: 'km', prefix: 'Span ', suffix: ' wide'}
      })
    ).toBe('Span 19.6 km wide');
  });
  test.each([
    [500, 'auto', 0, '500 m'],
    [999, 'auto', 0, '999 m'],
    [1001, 'auto', 1, '1.0 km'],
    [500, 'km', 2, '0.50 km'],
    [1001, 'm', 0, '1001 m'],
    [0, 'auto', 0, '0 m']
  ] as const)('formats %s metres in %s with precision %s', (meters, unit, precision, expected) => {
    const longitude = ((meters / 6371008.8) * 180) / Math.PI;
    expect(
      getRulerDistanceLabel({
        ...ruler,
        anchorPoint: [0, 0],
        endPoint: [longitude, 0],
        rulerStyle: {...DEFAULT_RULER_STYLE, unit, precision}
      })
    ).toBe(expected);
  });
  test('keeps legacy formatting and safely handles invalid endpoints', () => {
    expect(getRulerDistanceLabel({...ruler, rulerStyle: undefined})).toBe('Length: 19.59 km');
    expect(getRulerDistanceLabel({...ruler, endPoint: [NaN, 0]})).toBe('');
    expect(getRulerDistanceLabel({...ruler, endPoint: undefined} as any)).toBe('');
  });
  test.each(['above', 'below'] as const)(
    'connects dimension lines to actual endpoints with %s placement',
    placement => {
      const projected: MapViewport = {...viewport, project: ([x, y]) => [x * 100, y * 100]};
      const distance = placement === 'above' ? -30 : 30;
      const {container, rerender} = render(
        <svg>
          <AnnotationNode
            annotation={{
              ...ruler,
              anchorPoint: [0, 0],
              endPoint: [1, 0],
              rulerStyle: {...DEFAULT_RULER_STYLE, placement, offset: 30, dimensionLine: true}
            }}
            viewport={projected}
            isEditing={false}
            isSelected={false}
          />
        </svg>
      );
      expect(
        container.querySelector('[data-annotation-part="dimension-extensions"]')
      ).toHaveAttribute('d', `M0,0 L0,${distance} M100,0 L100,${distance}`);
      expect(
        container.querySelector('[data-annotation-part="dimension-ticks"]')
      ).toBeInTheDocument();
      rerender(
        <svg>
          <AnnotationNode
            annotation={{
              ...ruler,
              anchorPoint: [0, 0],
              endPoint: [2, 0],
              rulerStyle: {...DEFAULT_RULER_STYLE, placement, offset: 30, dimensionLine: true}
            }}
            viewport={projected}
            isEditing={false}
            isSelected={false}
          />
        </svg>
      );
      expect(
        container.querySelector('[data-annotation-part="dimension-extensions"]')
      ).toHaveAttribute('d', `M0,0 L0,${distance} M200,0 L200,${distance}`);
    }
  );
});

test('globe dimension rulers retain clipped surface arcs and only decorate visible endpoints', () => {
  const globe = new GlobeViewport({longitude: 0, latitude: 0, zoom: 0, width: 800, height: 600});
  const ruler = {
    ...rulerAnnotation,
    anchorPoint: [0, 0],
    endPoint: [150, 0],
    rulerStyle: {...DEFAULT_RULER_STYLE, offset: 24, dimensionLine: true}
  } as typeof rulerAnnotation;
  const marker = makeMarker(ruler, globe, true) as RulerAnnotationMarker;
  const {container} = render(
    <svg>
      <AnnotationNode
        annotation={ruler}
        viewport={globe}
        isGlobeEnabled
        isEditing={false}
        isSelected={false}
      />
    </svg>
  );
  const extensions = container.querySelector('[data-annotation-part="dimension-extensions"]');
  const ticks = container.querySelector('[data-annotation-part="dimension-ticks"]');
  expect(extensions?.getAttribute('d')?.match(/M/g)).toHaveLength(1);
  expect(ticks?.getAttribute('d')?.match(/M/g)).toHaveLength(1);
  expect(
    Array.from(container.querySelectorAll('path')).some(
      path => path.getAttribute('d') === marker.path
    )
  ).toBe(true);
  expect(container.innerHTML).not.toMatch(/NaN|Infinity/);
});

test.each([
  [0, 0],
  [62, 0],
  [62, 90],
  [62, 180]
])(
  'keeps an elevation guide at its geographic footprint at pitch %s bearing %s',
  (pitch, bearing) => {
    const point = {
      ...annotation,
      kind: AnnotationKind.POINT as const,
      anchorPoint: [-101.830429, 33.518337, 7448.36] as [number, number, number],
      elevation: {
        ...DEFAULT_ANNOTATION_ELEVATION,
        value: 7448.36,
        datum: 'MSL',
        reference: {value: 990, unit: 'm' as const, datum: 'MSL'}
      }
    };
    const vp = new WebMercatorViewport({
      longitude: -101.830429,
      latitude: 33.518337,
      width: 800,
      height: 600,
      zoom: 8,
      pitch,
      bearing
    });
    const guide = getElevationGuide(point, vp as unknown as MapViewport)!;
    const top = vp.project(point.anchorPoint);
    const bottom = vp.project([-101.830429, 33.518337, 990]);
    expect(top[0] + guide.ex).toBeCloseTo(bottom[0]);
    expect(top[1] + guide.ey).toBeCloseTo(bottom[1]);
    const {container} = render(
      <svg>
        <AnnotationNode
          annotation={point}
          viewport={vp as unknown as MapViewport}
          isEditing={false}
          isSelected={false}
        />
      </svg>
    );
    expect(container.querySelector('[data-annotation-part="elevation-guide"]')).toHaveAttribute(
      'd',
      `M0,0 L${guide.ex},${guide.ey}`
    );
    expect(container.querySelector('[data-annotation-part="elevation-guide"]')).toHaveAttribute(
      'stroke-dasharray',
      '6 3'
    );
    expect(container.querySelector('circle')).toHaveAttribute('fill', 'none');
  }
);

test('uses explicit display height without changing measurements and hides unavailable or globe-occluded references', () => {
  const point = {
    ...annotation,
    kind: AnnotationKind.POINT as const,
    anchorPoint: [84.2, 0, 1000] as [number, number, number],
    elevation: {
      ...DEFAULT_ANNOTATION_ELEVATION,
      value: -1000,
      datum: 'MSL',
      reference: {value: 0, unit: 'm' as const, datum: 'MSL', displayZ: 6000}
    }
  };
  const vp = {...viewport, project: ([lng, lat, z = 0]: readonly number[]) => [lng, lat - z]};
  expect(getElevationGuide(point, vp)).toEqual({ex: 0, ey: -5000});
  const globe = new GlobeViewport({longitude: 0, latitude: 0, width: 800, height: 600, zoom: 4});
  expect(
    getElevationGuide(
      {
        ...point,
        elevation: {...point.elevation, reference: {...point.elevation.reference, displayZ: 0}}
      },
      globe,
      true
    )
  ).toBeNull();
  expect(
    getElevationGuide({...point, elevation: {...point.elevation, reference: null}}, vp)
  ).toBeNull();
  expect(
    getElevationGuide({...point, elevation: {...point.elevation, datum: 'ellipsoid'}}, vp)
  ).toBeNull();
  expect(
    getElevationGuide({...point, elevation: {...point.elevation, guide: 'none'}}, vp)
  ).toBeNull();
});

test('captures source altitude separately from picked Z and clears a missing field value on the next pick', () => {
  const point = {
    ...annotation,
    kind: AnnotationKind.POINT as const,
    elevation: {
      ...DEFAULT_ANNOTATION_ELEVATION,
      value: 7448.36,
      field: {dataId: 'detections', name: 'altitude'}
    }
  };
  const pick = jest.fn(() => ({coordinate: [1, 2, 9000], value: -1000}));
  expect(movePoint(point, {x: 2, y: 3}, viewport, undefined, pick)).toEqual({
    anchorPoint: [1, 2, 9000],
    elevation: {...point.elevation, value: -1000}
  });
  expect(pick).toHaveBeenCalledWith([102, 203], point.elevation.field);
  expect(
    movePoint(
      point,
      {x: 2, y: 3},
      viewport,
      () => [1, 2, 9000],
      () => null
    )
  ).toMatchObject({
    elevation: {value: null}
  });
});

test('map height uses a zero guide and follows picked Z without changing saved measurements', () => {
  const point = {
    ...annotation,
    kind: AnnotationKind.POINT as const,
    anchorPoint: [1, 2, 9000] as [number, number, number],
    elevation: {
      ...DEFAULT_ANNOTATION_ELEVATION,
      source: 'map' as const,
      value: 7448.36,
      field: {dataId: 'detections', name: 'altitude'},
      reference: {value: 990, unit: 'm' as const, datum: 'MSL', displayZ: 5000}
    }
  };
  const vp = {...viewport, project: ([lng, lat, z = 0]: readonly number[]) => [lng, lat - z]};
  expect(getElevationGuide(point, vp)).toEqual({ex: 0, ey: 9000});
  expect(
    getElevationGuide({...point, elevation: {...point.elevation, reference: null}}, vp)
  ).toEqual({ex: 0, ey: 9000});
  const pickElevation = jest.fn();
  expect(movePoint(point, {x: 2, y: 3}, vp, () => [2, 3, 500], pickElevation)).toEqual({
    anchorPoint: [2, 3, 500]
  });
  expect(pickElevation).not.toHaveBeenCalled();
  expect(point.elevation.value).toBe(7448.36);
});

test('terrain guides use captured display height and hide unavailable terrain', () => {
  const point = {
    ...annotation,
    kind: AnnotationKind.POINT as const,
    anchorPoint: [1, 2, 9000] as [number, number, number],
    elevation: {
      ...DEFAULT_ANNOTATION_ELEVATION,
      value: 7448.36,
      datum: 'MSL',
      reference: {
        source: 'terrain' as const,
        value: 990,
        unit: 'm' as const,
        datum: 'MSL',
        displayZ: 2970,
        coordinate: [1, 2] as [number, number]
      }
    }
  };
  const vp = {...viewport, project: ([lng, lat, z = 0]: readonly number[]) => [lng, lat - z]};
  expect(getElevationGuide(point, vp)).toEqual({ex: 0, ey: 6030});
  expect(
    getElevationGuide(
      {
        ...point,
        elevation: {
          ...point.elevation,
          reference: {...point.elevation.reference, value: null, displayZ: undefined}
        }
      },
      vp
    )
  ).toBeNull();
});

test.each([
  [0, 0],
  [62, 0],
  [62, 90],
  [62, 180]
])('vertical scale stays at its geographic footprint at pitch %s bearing %s', (pitch, bearing) => {
  const point = {
    ...annotation,
    kind: AnnotationKind.POINT as const,
    label: '',
    anchorPoint: [-101.8, 33.5, 100] as [number, number, number],
    verticalScale: {
      min: -1,
      max: 1,
      tickSpacing: 1,
      unit: 'km' as const,
      precision: 1,
      displayMin: 0,
      displayMax: 6000
    }
  };
  const vp = new WebMercatorViewport({
    longitude: -101.8,
    latitude: 33.5,
    width: 800,
    height: 600,
    zoom: 9,
    pitch,
    bearing
  });
  const geometry = getVerticalScaleGeometry(point, vp as unknown as MapViewport)!;
  const origin = vp.project(point.anchorPoint);
  expect(geometry.ticks).toHaveLength(3);
  geometry.ticks.forEach((tick, i) => {
    const expected = vp.project([-101.8, 33.5, i * 3000]);
    expect(origin[0] + tick.dx).toBeCloseTo(expected[0]);
    expect(origin[1] + tick.dy).toBeCloseTo(expected[1]);
  });
  const {container} = render(
    <svg>
      <AnnotationNode
        annotation={point}
        viewport={vp as unknown as MapViewport}
        isEditing={false}
        isSelected={false}
      />
    </svg>
  );
  expect(container.querySelector('[data-annotation-part="scale-axis"]')).toHaveAttribute(
    'd',
    geometry.path
  );
  expect(container.querySelectorAll('path')).toHaveLength(2);
  expect(container.querySelector('circle')).toBeNull();
});

test('vertical scale excludes nonfinite projections and globe-occluded ticks', () => {
  const point = {
    ...annotation,
    kind: AnnotationKind.POINT as const,
    anchorPoint: [180, 0] as [number, number],
    verticalScale: {min: 0, max: 1000, tickSpacing: 250, unit: 'm' as const, precision: 0}
  };
  const globe = new GlobeViewport({longitude: 0, latitude: 0, zoom: 0, width: 800, height: 600});
  expect(getVerticalScaleGeometry(point, globe, true)).toEqual({path: '', ticks: []});
  expect(getVerticalScaleGeometry(point, {...viewport, project: () => [NaN, NaN]})).toBeNull();
});

test('a scale above the globe horizon stays visible without exposing its hidden anchor', () => {
  const point = {
    ...annotation,
    kind: AnnotationKind.POINT as const,
    anchorPoint: [60, 0, 0] as [number, number, number],
    verticalScale: {min: 0, max: 100000, tickSpacing: 25000, unit: 'm' as const, precision: 0}
  };
  const globe = new GlobeViewport({longitude: 0, latitude: 0, width: 800, height: 600, zoom: 4});
  const geometry = getVerticalScaleGeometry(point, globe, true)!;
  expect(geometry.ticks.length).toBeGreaterThan(0);
  expect(geometry.ticks.map(t => t.value)).not.toContain(0);
  expect(isAnnotationVisibleOnGlobe(point, globe)).toBe(true);
  const {container} = render(
    <DndContext>
      <svg>
        <AnnotationNode annotation={point} viewport={globe} isGlobeEnabled isEditing isSelected />
      </svg>
    </DndContext>
  );
  expect(container.querySelector('[data-annotation-part="scale-axis"]')).toHaveAttribute(
    'd',
    geometry.path
  );
  expect(container.querySelector('circle')).toBeNull();
});
