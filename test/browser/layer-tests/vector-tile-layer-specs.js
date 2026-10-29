// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape-catch';
import {LayerManager, WebMercatorViewport} from '@deck.gl/core';
import {device} from '@deck.gl/test-utils';
import {INITIAL_MAP_STATE} from '@kepler.gl/reducers';
import {preparedDataset, dataId} from 'test/helpers/layer-utils';
import {KeplerGlLayers} from '@kepler.gl/layers';
import {MISSING_VALUE_COLOR, NO_VALUE_COLOR} from '@kepler.gl/constants';

const {VectorTileLayer} = KeplerGlLayers;

test('#VectorTileLayer -> hideNulls visConfig defaults', t => {
  const layer = new VectorTileLayer({dataId: 'test'});

  t.equal(layer.config.visConfig.hideNulls, false, 'hideNulls is off by default');
  t.ok(layer.visConfigSettings.hideNulls, 'hideNulls visConfig setting is registered');
  t.notOk(
    layer.shouldCalculateLayerData(['hideNulls']),
    'toggling hideNulls should not recreate tile data'
  );

  const nullValue = layer.visualChannels.color.nullValue;
  t.equal(typeof nullValue, 'function', 'fill color nullValue is resolved from visConfig');
  t.deepEqual(
    nullValue(layer.config),
    MISSING_VALUE_COLOR,
    'missing fill values render gray when hideNulls is off'
  );

  layer.updateLayerVisConfig({hideNulls: true});
  t.deepEqual(
    layer.visualChannels.color.nullValue(layer.config),
    NO_VALUE_COLOR,
    'missing fill values are transparent when hideNulls is on'
  );

  t.end();
});

test('#VectorTileLayer -> getEncodedChannelValue respects hideNulls', t => {
  const layer = new VectorTileLayer({dataId: 'test'});
  const scale = () => [255, 0, 0, 255];
  const getNull = () => null;

  t.deepEqual(
    layer.getEncodedChannelValue(
      scale,
      {},
      {name: 'metric'},
      layer.visualChannels.color.nullValue(layer.config),
      getNull
    ),
    MISSING_VALUE_COLOR,
    'null fill values use gray when hideNulls is off'
  );

  layer.updateLayerVisConfig({hideNulls: true});
  t.deepEqual(
    layer.getEncodedChannelValue(
      scale,
      {},
      {name: 'metric'},
      layer.visualChannels.color.nullValue(layer.config),
      getNull
    ),
    NO_VALUE_COLOR,
    'null fill values are transparent when hideNulls is on'
  );

  t.end();
});

test('#VectorTileLayer -> hover supports feature arrays and collections', t => {
  const layer = new VectorTileLayer({id: 'vector', dataId: 'test'});
  const feature = {
    type: 'Feature',
    properties: {name: 'Selected'},
    geometry: {type: 'Point', coordinates: [0, 0]}
  };
  const basePick = {
    picked: true,
    index: 0,
    object: feature,
    layer: {props: {id: layer.id}},
    sourceLayer: {props: {visible: true}}
  };
  for (const content of [
    [feature],
    {shape: 'geojson-table', type: 'FeatureCollection', features: [feature]},
    {type: 'FeatureCollection', features: [feature]}
  ]) {
    const tile = {index: {x: 0, y: 0, z: 0}, content};
    const pick = {...basePick, tile};
    const hovered = layer.hasHoveredObject(pick);
    t.equal(hovered, feature, 'hover resolves the same original feature');
    t.deepEqual(
      layer.getHoverData(hovered, null, [{name: 'name'}, {name: 'missing'}]),
      ['Selected', null],
      'tooltip reads selected properties'
    );
    const layers = layer.renderLayer({
      data: {tileSource: {}, tilesetDataUrl: 'test/{z}/{x}/{y}'},
      mapState: {zoom: 1, latitude: 0, longitude: 0},
      animationConfig: {},
      gpuFilter: {filterRange: [], filterValueAccessor: () => () => () => []},
      layerCallbacks: {},
      visible: true,
      idx: 0,
      objectHovered: pick
    });
    t.deepEqual(layers[1].props.data, [feature], 'render highlight uses resolved feature');
    if (Array.isArray(content) || content.shape === 'geojson-table') {
      t.deepEqual(
        layer.renderSubLayers({data: content, tile}).props.data,
        [feature],
        'the rendered tile and hover agree'
      );
    }
  }
  for (const pick of [
    null,
    {...basePick, picked: false},
    {...basePick, layer: {props: {id: 'other'}}},
    basePick,
    {...basePick, tile: {}},
    {...basePick, tile: {content: {}}},
    {...basePick, tile: {content: []}},
    {...basePick, tile: {content: {features: []}}},
    {...basePick, tile: {content: [feature]}, index: -1},
    {...basePick, tile: {content: [feature]}, index: 1},
    {...basePick, tile: {content: {features: [feature]}}, index: 1}
  ]) {
    t.notOk(layer.hasHoveredObject(pick), 'missing or unselected features are graceful');
  }
  t.end();
});

test('#VectorTileLayer -> radius range updates cached point attributes', t => {
  const layer = new VectorTileLayer({id: 'vector-radius', dataId});
  const radiusField = preparedDataset.fields.find(field => field.name === 'trip_distance');
  layer.updateLayerConfig({radiusField, radiusDomain: [0, 10], radiusScale: 'linear'});
  layer.updateLayerVisConfig({radiusRange: [2, 10]});
  const datasets = {
    [dataId]: {
      ...preparedDataset,
      type: 'vector-tile',
      metadata: {remoteTileFormat: 'mvt', tilesetDataUrl: 'https://example.com/{z}/{x}/{y}.pbf'}
    }
  };
  const points = [0, 10].map((value, index) => ({
    type: 'Feature',
    geometry: {type: 'Point', coordinates: [index, 0]},
    properties: {trip_distance: value}
  }));
  const manager = new LayerManager(device, {
    viewport: new WebMercatorViewport({width: 64, height: 64, longitude: 0, latitude: 0, zoom: 2})
  });
  const render = () => {
    const data = layer.formatLayerData(datasets, undefined, {});
    const [tileLayer] = layer.renderLayer({
      data,
      gpuFilter: preparedDataset.gpuFilter,
      mapState: INITIAL_MAP_STATE,
      animationConfig: {},
      layerCallbacks: {},
      visible: true
    });
    // Use the production tile sublayer path with an already decoded tile; no network or WebGL draw.
    manager.setLayers([
      layer.renderSubLayers({
        ...tileLayer.props,
        id: 'radius-tile',
        data: points,
        tile: {index: {z: 2}},
        extensions: []
      })
    ]);
    return tileLayer;
  };
  const attributes = () =>
    manager
      .getLayers()
      .find(deckLayer => deckLayer.id.endsWith('-points-circle'))
      .getAttributeManager()
      .getAttributes();
  const radii = () => {
    const attribute = attributes().instanceRadius;
    // deck.gl stores one shared value when the accessor is a constant.
    return attribute.isConstant
      ? points.map(() => attribute.value[0])
      : Array.from(attribute.value.slice(0, points.length));
  };

  try {
    render();
    t.deepEqual(radii(), [2, 10], 'initial tile point radii follow the configured range');
    const originalColors = Array.from(attributes().instanceFillColors.value);
    layer.updateLayerVisConfig({radiusRange: [20, 100]});
    const changed = render();
    t.deepEqual(
      points.map(changed.props.getPointRadius),
      [20, 100],
      'the radius accessor uses the new range'
    );
    t.deepEqual(radii(), [20, 100], 'cached point attributes refresh to the new range');
    t.deepEqual(
      Array.from(attributes().instanceFillColors.value),
      originalColors,
      'radius changes preserve point colors'
    );

    layer.updateLayerVisConfig({opacity: 0.5});
    render();
    t.deepEqual(radii(), [20, 100], 'unrelated style changes preserve point radii');

    layer.updateLayerConfig({radiusField: null});
    layer.updateLayerVisConfig({radius: 7});
    render();
    t.deepEqual(radii(), [7, 7], 'constant radius still works without a radius field');
    layer.updateLayerVisConfig({radiusRange: [1, 5]});
    render();
    t.deepEqual(radii(), [7, 7], 'range changes do not alter a constant radius');
  } finally {
    manager.finalize();
  }
  t.end();
});

test('#VectorTileLayer -> highlights respect current panel and layer visibility', t => {
  for (const identified of [false, true]) {
    const layer = new VectorTileLayer({id: 'vector', dataId: 'test'});
    const feature = {
      type: 'Feature',
      ...(identified ? {id: 'selected'} : {}),
      properties: {name: 'Selected'},
      geometry: {type: 'Point', coordinates: [0, 0]}
    };
    const tile = {
      id: '0-0-0',
      index: {x: 0, y: 0, z: 0},
      boundingBox: [
        [-180, -85],
        [180, 85]
      ],
      content: {shape: 'geojson-table', type: 'FeatureCollection', features: [feature]}
    };
    layer.tileDataset = {getTiles: () => [tile]};
    const objectHovered = {
      picked: true,
      index: 0,
      object: feature,
      tile,
      layer: {props: {id: layer.id}},
      // Selection originated in the other, visible split-map panel.
      sourceLayer: {props: {visible: true}}
    };
    for (const [visible, isVisible] of [
      [true, true],
      [false, true],
      [true, false]
    ]) {
      layer.updateLayerConfig({isVisible});
      const layers = layer.renderLayer({
        data: {tileSource: {}, tilesetDataUrl: 'test/{z}/{x}/{y}'},
        mapState: {zoom: 1, latitude: 0, longitude: 0},
        animationConfig: {},
        gpuFilter: {filterRange: [], filterValueAccessor: () => () => () => []},
        layerCallbacks: {},
        visible,
        idx: 0,
        objectHovered
      });
      const expected = visible && isVisible;
      t.equal(layers.length, 2, `${identified ? 'outline' : 'fallback'} highlight is constructed`);
      t.equal(layers[0].props.visible, expected, 'tile layer respects visibility');
      t.equal(layers[1].props.visible, expected, 'highlight respects the current panel visibility');
      t.deepEqual(layers[1].props.data, [feature], 'highlight keeps selected geometry');
    }
  }
  t.end();
});
