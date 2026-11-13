// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {AttributeManager, Layer, MapView} from '@deck.gl/core';
import {worldToPixels} from '@math.gl/web-mercator';

import {KeplerGlobeView} from '@kepler.gl/deckgl-layers';

import {createTargetArrowLayer, targetArrowAngle} from './target-arrow';

function mercatorViewport(overrides = {}) {
  const viewport = new MapView({farZMultiplier: 1.2}).makeViewport({
    width: 800,
    height: 800,
    viewState: {
      latitude: 37.8,
      longitude: -122.4,
      zoom: 10,
      pitch: 0,
      bearing: 0,
      ...overrides
    }
  });
  if (!viewport) {
    throw new Error('expected a viewport');
  }
  return viewport;
}

const mapState = {
  width: 800,
  height: 800,
  latitude: 37.8,
  longitude: -122.4,
  zoom: 10,
  pitch: 0,
  bearing: 0,
  globe: {enabled: false}
};

function makeArrowHost(overrides = {}): any {
  return {
    id: 'test-layer',
    config: {
      visConfig: {
        targetArrowEnabled: true,
        targetArrowShape: 'triangle',
        targetArrowSize: 16,
        opacity: 0.8
      }
    },
    ...overrides
  };
}

function createArrowLayer(layer: any, overrides = {}) {
  return createTargetArrowLayer({
    layer,
    formattedData: {data: {}},
    defaultLayerProps: {visible: true},
    mapState,
    interactionConfig: {brush: {enabled: true, config: {size: 2}}},
    greatCircle: false,
    height: 0,
    elevationScale: 1,
    getColor: [10, 20, 30],
    ...overrides
  });
}

describe('targetArrowAngle', () => {
  const source = [-122.45, 37.75, 0];
  const straight = {greatCircle: false, height: 0};

  test('points along the screen axes on a north-up map', () => {
    const viewport = mercatorViewport();
    expect(targetArrowAngle(viewport, source, [-122.45, 37.85, 0], straight)).toBeCloseTo(0, 0);
    expect(targetArrowAngle(viewport, source, [-122.35, 37.75, 0], straight)).toBeCloseTo(90, 0);
    expect(targetArrowAngle(viewport, source, [-122.55, 37.75, 0], straight)).toBeCloseTo(-90, 0);
    const south = targetArrowAngle(viewport, source, [-122.45, 37.65, 0], straight);
    expect(Math.abs(Math.abs(south) - 180)).toBeLessThan(1);
  });

  test('rotates with map bearing', () => {
    const flat = targetArrowAngle(mercatorViewport(), source, [-122.35, 37.75, 0], straight);
    const turned = targetArrowAngle(
      mercatorViewport({bearing: 90}),
      source,
      [-122.35, 37.75, 0],
      straight
    );
    const delta = Math.abs(turned - flat);
    expect(Math.min(delta, 360 - delta)).toBeCloseTo(90, 0);
  });

  test('uses the short crossing at the antimeridian', () => {
    const viewport = mercatorViewport({longitude: 180, latitude: 0, zoom: 3});
    expect(targetArrowAngle(viewport, [170, 0, 0], [-170, 0, 0], straight)).toBeCloseTo(90, 0);
  });

  test('a raised arc meets its target at a different angle than the chord when pitched', () => {
    const viewport = mercatorViewport({pitch: 50, zoom: 8});
    const from = [-122.5, 37.7, 0];
    const to = [-122.3, 37.9, 0];
    const chord = targetArrowAngle(viewport, from, to, straight);
    const arc = targetArrowAngle(viewport, from, to, {greatCircle: false, height: 1});
    expect(Math.abs(arc - chord)).toBeGreaterThan(15);
  });

  test('returns 0 when the segment has no direction', () => {
    const viewport = mercatorViewport();
    expect(targetArrowAngle(viewport, source, source, straight)).toBe(0);
    expect(targetArrowAngle(viewport, [Number.NaN, 0, 0], source, straight)).toBe(0);
  });

  test('common-space projection uses the same pixel axes as viewport.project', () => {
    const viewport = mercatorViewport();
    const projected = viewport.project([-122.4, 37.8, 0]);
    const common = worldToPixels(
      viewport.projectPosition([-122.4, 37.8, 0]),
      viewport.pixelProjectionMatrix
    );
    expect(common[0]).toBeCloseTo(projected[0], 3);
    expect(common[1]).toBeCloseTo(projected[1], 3);
  });

  test('a northbound globe segment at the view center points up', () => {
    const viewport = new KeplerGlobeView({resolution: 5}).makeViewport({
      width: 800,
      height: 800,
      viewState: {latitude: 20, longitude: 0, zoom: 2, pitch: 0, bearing: 0}
    });
    if (!viewport) {
      throw new Error('expected a globe viewport');
    }
    const angle = targetArrowAngle(viewport, [0, 20, 0], [0, 22, 0], {
      greatCircle: true,
      height: 0
    });
    expect(Math.abs(angle)).toBeLessThan(10);
  });
});

describe('createTargetArrowLayer', () => {
  test('invalidates GeoArrow records when the target vector changes', () => {
    const source = {length: 1, get: () => [-122.45, 37.75, 0]};
    const firstTarget = {length: 1, get: () => [-122.35, 37.85, 0]};
    const secondTarget = {length: 1, get: () => [-122.25, 37.95, 0]};
    const host = makeArrowHost({geoArrowVector0: source, geoArrowVector1: firstTarget});

    const firstLayer = createArrowLayer(host);
    host.geoArrowVector1 = secondTarget;
    const secondLayer = createArrowLayer(host);
    const firstData = firstLayer?.props.data as any[];
    const secondData = secondLayer?.props.data as any[];

    expect(firstData[0].targetPosition).toEqual([-122.35, 37.85, 0]);
    expect(secondData[0].targetPosition).toEqual([-122.25, 37.95, 0]);
  });

  test('uses depth testing by default and lets map parameters override defaults', () => {
    const host = makeArrowHost({
      geoArrowVector0: {length: 1, get: () => [-122.45, 37.75, 0]},
      geoArrowVector1: {length: 1, get: () => [-122.35, 37.85, 0]}
    });
    const defaultLayer = createArrowLayer(host);
    const overriddenLayer = createArrowLayer(host, {
      mapState: {
        ...mapState,
        layerParameters: {depthCompare: 'always', depthWriteEnabled: true, cullMode: 'back'}
      }
    });

    expect(defaultLayer?.props.parameters).toEqual({
      depthCompare: 'less-equal',
      depthWriteEnabled: false,
      cullMode: 'none'
    });
    expect(overriddenLayer?.props.parameters).toEqual({
      depthCompare: 'always',
      depthWriteEnabled: true,
      cullMode: 'back'
    });
  });

  test('brushes arrowheads against both stroke endpoints', () => {
    const sourcePosition = [-122.45, 37.75, 0];
    const targetPosition = [-122.35, 37.85, 0];
    const host = makeArrowHost({
      geoArrowVector0: {length: 1, get: () => sourcePosition},
      geoArrowVector1: {length: 1, get: () => targetPosition}
    });
    const layer = createArrowLayer(host);
    const props = layer?.props as any;
    const record = props.data[0];

    expect(props.brushingTarget).toBe('source_target');
    expect(props.getSourcePosition(record)).toEqual(sourcePosition);
    expect(props.getTargetPosition(record)).toEqual(targetPosition);
  });
});

// Exercise deck.gl's real prop diff, accessor iteration, typed angle attribute,
// and buffer-write requests. Only the GPU device is replaced for Jest.
function angleAttributeUpdates() {
  const write = jest.fn();
  const device: any = {
    type: 'webgl',
    createBuffer: ({byteLength, ...props}) => ({
      byteLength,
      props,
      write,
      delete: jest.fn(),
      destroy: jest.fn()
    })
  };
  const manager = new AttributeManager(device);
  manager.addInstanced({instanceAngles: {size: 1, accessor: 'getAngle', defaultValue: 0}});
  let previous: any;
  return (arrow: any) => {
    write.mockClear();
    const context: any = {
      props: arrow.props,
      internalState: {},
      invalidateAttribute: (trigger: string) => manager.invalidate(trigger),
      setChangeFlags(flags) {
        this.internalState.changeFlags = flags;
      }
    };
    (Layer.prototype as any)._diffProps.call(context, arrow.props, previous?.props || {});
    if (context.internalState.changeFlags.dataChanged) {
      manager.invalidateAll();
    }
    const getAngle = jest.fn(arrow.props.getAngle);
    const data = arrow.props.data;
    manager.update({
      data,
      numInstances: data.length,
      props: {getAngle},
      transitions: {},
      buffers: {},
      context: {}
    });
    const angles = Array.from(manager.getAttributes().instanceAngles.value || []).slice(
      0,
      data.length
    );
    // Buffer values must agree with a fresh computation for the current view,
    // whether or not this update rebuilt them.
    expect(angles).toEqual(data.map(record => Math.fround(arrow.props.getAngle(record))));
    previous = arrow;
    return {calls: getAngle.mock.calls.length, writes: write.mock.calls.length, angles};
  };
}

describe('target arrow angle attribute updates', () => {
  const data = [
    {index: 0, sourcePosition: [-122.5, 37.7, 0], targetPosition: [-122.3, 37.9, 0]},
    {index: 1, sourcePosition: [170, 10, 0], targetPosition: [-170, 15, 0]},
    {index: 2, sourcePosition: [-170, 15, 0], targetPosition: [170, 10, 0]},
    {index: 3, sourcePosition: [0, 0, 0], targetPosition: [0, 0, 0]}
  ];

  test('keeps ground line angles on pan, zoom and resize, including antimeridian crossings', () => {
    const host = makeArrowHost();
    const update = angleAttributeUpdates();
    const render = (view = {}) =>
      update(createArrowLayer(host, {formattedData: {data}, mapState: {...mapState, ...view}}));

    expect(render()).toMatchObject({calls: data.length, writes: 1});
    expect(render({longitude: 179, latitude: -20})).toMatchObject({calls: 0, writes: 0});
    expect(render({longitude: -179, latitude: 50, zoom: 12})).toMatchObject({calls: 0, writes: 0});
    expect(render({width: 1600, height: 600})).toMatchObject({calls: 0, writes: 0});
    expect(render({bearing: 45})).toMatchObject({calls: data.length, writes: 1});
    expect(render({bearing: 45, zoom: 8})).toMatchObject({calls: 0, writes: 0});
  });

  test.each([
    ['pitched ground lines', {pitch: 40}, 0, data],
    ['raised arcs', {}, 1, data],
    ['unequal elevations', {}, 0, [{...data[0], targetPosition: [-122.3, 37.9, 1000]}]],
    [
      'equal elevations at different latitudes',
      {},
      0,
      [{...data[0], sourcePosition: [-122.5, 37.7, 1000], targetPosition: [-122.3, 37.9, 1000]}]
    ],
    ['globe lines', {globe: {enabled: true}}, 0, data],
    ['globe arcs', {globe: {enabled: true}}, 1, data]
  ])('keeps viewport updates for %s', (_name, view, height, records) => {
    const host = makeArrowHost();
    const update = angleAttributeUpdates();
    for (const overrides of [{}, {longitude: -122.3}, {zoom: 11}, {width: 1000, height: 700}]) {
      const result = update(
        createArrowLayer(host, {
          formattedData: {data: records},
          mapState: {...mapState, ...view, ...overrides},
          greatCircle: Boolean((view as any).globe?.enabled),
          height
        })
      );
      expect(result).toMatchObject({calls: records.length, writes: 1});
    }
  });

  test('refreshes on pitch, projection, height and elevation-scale transitions', () => {
    const host = makeArrowHost();
    const update = angleAttributeUpdates();
    for (const overrides of [
      {},
      {mapState: {...mapState, pitch: 30}},
      {},
      {mapState: {...mapState, globe: {enabled: true}}},
      {},
      {greatCircle: true},
      {height: 1},
      {elevationScale: 2},
      {}
    ]) {
      expect(update(createArrowLayer(host, {formattedData: {data}, ...overrides}))).toMatchObject({
        calls: data.length,
        writes: 1
      });
    }
  });

  test('preserves the tiny-segment fallback when zooming in and out of the fast path', () => {
    const host = makeArrowHost();
    const records = [{...data[0], sourcePosition: [0, 0, 0], targetPosition: [0.0000005, 0, 0]}];
    const update = angleAttributeUpdates();
    const render = (zoom: number) =>
      update(
        createArrowLayer(host, {
          formattedData: {data: records},
          mapState: {...mapState, longitude: 0, latitude: 0, zoom}
        })
      );
    expect(render(10)).toMatchObject({calls: 1, writes: 1, angles: [0]});
    expect(render(11)).toMatchObject({calls: 1, writes: 1, angles: [90]});
    expect(render(22)).toMatchObject({calls: 1, writes: 1, angles: [90]});
    expect(render(23)).toMatchObject({calls: 0, writes: 0, angles: [90]});
    expect(render(10)).toMatchObject({calls: 1, writes: 1, angles: [0]});
  });

  test.each([
    ['mixed tiny and regular segments', [0, 0, 0], [0.0000005, 0, 0]],
    ['clamped polar coordinates', [0, 89.95, 0], [0.0000005, 89.96, 0]]
  ])('keeps zoom updates for %s', (_name, sourcePosition, targetPosition) => {
    const host = makeArrowHost();
    const records = [data[0], {index: 4, sourcePosition, targetPosition}];
    const update = angleAttributeUpdates();
    for (const zoom of [10, 11, 10]) {
      expect(
        update(
          createArrowLayer(host, {
            formattedData: {data: records},
            mapState: {...mapState, longitude: 0, latitude: 0, zoom}
          })
        )
      ).toMatchObject({calls: records.length, writes: 1});
    }
  });

  test('refreshes replaced row data and changed GeoArrow endpoints and filtered records', () => {
    const host = makeArrowHost({
      geoArrowVector0: {length: 2, get: index => data[index].sourcePosition},
      geoArrowVector1: {length: 2, get: index => data[index].targetPosition}
    });
    const update = angleAttributeUpdates();
    expect(update(createArrowLayer(host))).toMatchObject({calls: 2, writes: 1});
    expect(update(createArrowLayer(host, {mapState: {...mapState, zoom: 11}}))).toMatchObject({
      calls: 0,
      writes: 0
    });
    host.geoArrowVector1 = {length: 2, get: () => [-122.1, 37.5, 0]};
    expect(update(createArrowLayer(host))).toMatchObject({calls: 2, writes: 1});
    host.geoArrowVector0 = {length: 2, get: () => [-123, 37, 100]};
    expect(update(createArrowLayer(host))).toMatchObject({calls: 2, writes: 1});
    host.filteredIndex = [0, 1];
    host.filteredIndexTrigger = {};
    expect(update(createArrowLayer(host))).toMatchObject({calls: 1, writes: 1});
    expect(update(createArrowLayer(host, {formattedData: {data}}))).toMatchObject({
      calls: data.length,
      writes: 1
    });
    expect(update(createArrowLayer(host, {formattedData: {data: [...data]}}))).toMatchObject({
      calls: data.length,
      writes: 1
    });
  });
});
