// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape-catch';
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
