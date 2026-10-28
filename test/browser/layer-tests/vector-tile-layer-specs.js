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
