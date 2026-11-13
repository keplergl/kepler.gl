// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import Layer, {OVERLAY_TYPE_CONST} from './base-layer';
import {
  generateMapboxLayers,
  updateMapboxLayers,
  geoJsonFromData,
  gpuFilterToMapboxFilter
} from './mapbox-utils';

const makeLayer = (
  id: string,
  config = {},
  overlayType: Layer['overlayType'] = OVERLAY_TYPE_CONST.mapboxgl
) => ({id, overlayType, config: {isVisible: true, hidden: false, ...config}} as Layer);

const makeOverlay = (id = 'density', isVisible = true) => ({
  id,
  sourceId: `${id}-source`,
  data: {type: 'FeatureCollection', features: []},
  config: {id, source: `${id}-source`, type: 'heatmap'},
  isVisible
});

const makeMap = () => ({
  getSource: jest.fn(),
  addSource: jest.fn(),
  getLayer: jest.fn(),
  removeLayer: jest.fn(),
  addLayer: jest.fn(),
  setLayoutProperty: jest.fn()
});

// Fixtures model only the overlay properties consumed by the Mapbox bridge.
const update = (map: ReturnType<typeof makeMap>, next = {}, previous = null) =>
  updateMapboxLayers(map, next as Parameters<typeof updateMapboxLayers>[1], previous);

describe('generateMapboxLayers', () => {
  test('returns no overlays without layer data', () => {
    expect(generateMapboxLayers()).toEqual({});
  });

  test('keeps reverse draw order within nested visible groups and preserves source/data pairing', () => {
    const layers = ['top', 'nested', 'bottom'].map(id => makeLayer(id));
    const layerData = layers.map(({id}) => ({data: {id}, config: {source: `${id}-source`}}));
    const order = [
      'top',
      {
        id: 'group',
        label: 'Group',
        isIncludedInLegend: true,
        isVisible: true,
        layerOrder: ['nested', 'bottom']
      }
    ];
    const original = JSON.parse(JSON.stringify(order));
    const result = generateMapboxLayers(layers, layerData, order, {
      top: true,
      nested: true,
      bottom: true
    });
    expect(Object.keys(result)).toEqual(['bottom', 'nested', 'top']);
    expect(result.nested).toEqual({
      id: 'nested',
      data: layerData[1].data,
      config: layerData[1].config,
      sourceId: 'nested-source',
      isVisible: true,
      hidden: false
    });
    expect(order).toEqual(original);
  });

  test('excludes hidden groups, absent ids, deck layers and disabled overlays', () => {
    const layers = [
      makeLayer('hidden-group-child'),
      makeLayer('deck', {}, OVERLAY_TYPE_CONST.deckgl),
      makeLayer('disabled'),
      makeLayer('retained', {isVisible: false, hidden: true})
    ];
    const layerData = layers.map(({id}) => ({data: [], config: {source: id}}));
    const result = generateMapboxLayers(
      layers,
      layerData,
      [
        {
          id: 'hidden',
          label: 'Hidden',
          isIncludedInLegend: true,
          isVisible: false,
          layerOrder: ['hidden-group-child']
        },
        'missing',
        'deck',
        'disabled',
        'retained'
      ],
      {'hidden-group-child': true, deck: true, disabled: false, retained: true}
    );
    expect(Object.keys(result)).toEqual(['retained']);
    expect(result.retained).toMatchObject({isVisible: false, hidden: true});
  });
});

describe('updateMapboxLayers', () => {
  test('adds GeoJSON sources and configures visible and invisible overlays', () => {
    const map = makeMap();
    const visible = makeOverlay();
    const invisible = makeOverlay('other', false);
    update(map, {density: visible, other: invisible});
    expect(map.addSource).toHaveBeenCalledWith('density-source', {
      type: 'geojson',
      data: visible.data
    });
    expect(map.addSource).toHaveBeenCalledTimes(2);
    expect(map.addLayer).toHaveBeenCalledWith(visible.config);
    expect(map.setLayoutProperty.mock.calls).toEqual([
      ['density', 'visibility', 'visible'],
      ['other', 'visibility', 'none']
    ]);
  });

  test('does not upload data or rebuild layers when references are unchanged', () => {
    const map = makeMap();
    const overlay = makeOverlay();
    update(map, {density: {...overlay}}, {density: overlay} as any);
    for (const method of Object.values(map)) {
      expect(method).not.toHaveBeenCalled();
    }
  });

  test('updates an existing source without replacing unchanged layer config', () => {
    const map = makeMap();
    const setData = jest.fn();
    map.getSource.mockReturnValue({setData});
    const previous = makeOverlay();
    const next = {...previous, data: {...previous.data}};
    update(map, {density: next}, {density: previous} as any);
    expect(map.getSource).toHaveBeenCalledWith('density-source');
    expect(setData).toHaveBeenCalledWith(next.data);
    expect(map.addSource).not.toHaveBeenCalled();
    expect(map.addLayer).not.toHaveBeenCalled();
  });

  test('replaces changed config and applies visibility without uploading unchanged data', () => {
    const map = makeMap();
    map.getLayer.mockReturnValue({id: 'density'});
    const previous = makeOverlay();
    const next = {...previous, config: {...previous.config}, isVisible: false};
    update(map, {density: next}, {density: previous} as any);
    expect(map.removeLayer).toHaveBeenCalledWith('density');
    expect(map.addLayer).toHaveBeenCalledWith(next.config);
    expect(map.removeLayer.mock.invocationCallOrder[0]).toBeLessThan(
      map.addLayer.mock.invocationCallOrder[0]
    );
    expect(map.setLayoutProperty).toHaveBeenCalledWith('density', 'visibility', 'none');
    expect(map.getSource).not.toHaveBeenCalled();
  });

  test('removes only stale overlays and ignores entries with neither data nor config', () => {
    const map = makeMap();
    const retained = makeOverlay();
    update(map, {density: retained, empty: {id: 'empty'}}, {
      density: retained,
      stale: makeOverlay('stale')
    } as any);
    expect(map.removeLayer.mock.calls).toEqual([['stale']]);
    expect(map.addLayer).not.toHaveBeenCalled();
    expect(map.getSource).not.toHaveBeenCalled();
  });
});

describe('geoJsonFromData', () => {
  test('keeps original row indices and order while omitting missing geometries', () => {
    const geometry = {type: 'Point', coordinates: [0, 0]};
    const getGeometry = jest.fn(({index}) => (index === 2 ? null : geometry));
    const getProperties = jest.fn(({index}) => ({value: index * 10}));
    expect(geoJsonFromData([7, 2, 0], getGeometry, getProperties)).toEqual({
      type: 'FeatureCollection',
      features: [
        {type: 'Feature', geometry, properties: {index: 7, value: 70}},
        {type: 'Feature', geometry, properties: {index: 0, value: 0}}
      ]
    });
    expect(getGeometry.mock.calls).toEqual([[{index: 7}], [{index: 2}], [{index: 0}]]);
    expect(getProperties.mock.calls).toEqual([[{index: 7}], [{index: 0}]]);
  });

  test('returns an empty collection without calling accessors when no rows remain', () => {
    const geometry = jest.fn();
    const properties = jest.fn();
    expect(geoJsonFromData(undefined, geometry, properties)).toEqual({
      type: 'FeatureCollection',
      features: []
    });
    expect(geometry).not.toHaveBeenCalled();
    expect(properties).not.toHaveBeenCalled();
  });
});

describe('gpuFilterToMapboxFilter', () => {
  test.each([{}, {0: null, 1: null}])(
    'returns no filter when every slot is inactive: %p',
    triggers => {
      expect(
        gpuFilterToMapboxFilter({filterRange: [], filterValueUpdateTriggers: triggers})
      ).toBeNull();
    }
  );

  test('preserves slot/range correspondence and inclusive zero/negative bounds', () => {
    expect(
      gpuFilterToMapboxFilter({
        filterRange: [
          [99, 100],
          [-10, 0],
          [0, 0],
          [10, 20]
        ],
        filterValueUpdateTriggers: {
          0: null,
          1: {name: 'temperature'},
          2: {name: 'count'},
          3: null
        }
      })
    ).toEqual([
      'all',
      ['>=', 'gpu:temperature', -10],
      ['<=', 'gpu:temperature', 0],
      ['>=', 'gpu:count', 0],
      ['<=', 'gpu:count', 0]
    ]);
  });
});
