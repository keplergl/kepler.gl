// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape-catch';
import {LayerManager, WebMercatorViewport} from '@deck.gl/core';
import {device} from '@deck.gl/test-utils';
import {INITIAL_MAP_STATE} from '@kepler.gl/reducers';
import {preparedDataset, dataId} from 'test/helpers/layer-utils';
import {KeplerGlLayers} from '@kepler.gl/layers';
import {MISSING_VALUE_COLOR, NO_VALUE_COLOR} from '@kepler.gl/constants';
import {KeplerTable} from '@kepler.gl/table';
import {getFilterProps} from '@kepler.gl/utils';

const {VectorTileLayer} = KeplerGlLayers;

function categoricalFilterFixture() {
  const id = 'vector-categories';
  const table = new KeplerTable({info: {id, type: 'vector-tile'}, color: [0, 0, 0]});
  table.updateSchema({
    fields: [
      {name: 'category', type: 'string'},
      {name: 'region', type: 'string'},
      {name: 'beds', type: 'integer'}
    ],
    rows: []
  });
  const layer = new VectorTileLayer({id, dataId: id});
  const filter = (index, value) => ({
    ...getFilterProps(table.fields[index], {domain: index === 2 ? [0, 100] : []}),
    id: `filter-${index}`,
    dataId: [id],
    name: [table.fields[index].name],
    fieldIdx: [index],
    ...(index === 2 ? {gpuChannel: [0]} : {}),
    value,
    enabled: true
  });
  const features = [
    {category: '病院', region: 'east', beds: 10},
    {category: '診療所', region: 'east', beds: 5},
    {category: '病院', region: 'west', beds: 0},
    {category: null, beds: 20},
    {},
    null
  ].map((properties, index) => ({
    type: 'Feature',
    geometry: {type: 'Point', coordinates: [index, 0]},
    properties
  }));
  const render = (filters, objectHovered) => {
    table.filterTable(filters, [layer]);
    const data = layer.formatLayerData({[id]: table}, undefined, {});
    return layer.renderLayer({
      data: {...data, tileSource: {getTileData: async () => features}},
      gpuFilter: table.gpuFilter,
      mapState: INITIAL_MAP_STATE,
      animationConfig: {},
      layerCallbacks: {},
      visible: true,
      objectHovered
    });
  };
  return {layer, features, filter, render};
}

test('#VectorTileLayer -> categorical filters refresh cached tile attributes', t => {
  const {layer, features, filter, render} = categoricalFilterFixture();
  const category = filter(0, ['病院']);
  const manager = new LayerManager(device, {
    viewport: new WebMercatorViewport({width: 64, height: 64, zoom: 2})
  });
  const check = (filters, expected, message, collection = false) => {
    const [tileLayer] = render(filters);
    const sublayer = layer.renderSubLayers({
      ...tileLayer.props,
      id: 'category-tile',
      data: collection ? {type: 'FeatureCollection', shape: 'geojson-table', features} : features,
      tile: {index: {z: 2}}
    });
    t.equal(sublayer.props.data, features, 'preserves cached feature order and picking indexes');
    manager.setLayers([sublayer]);
    const points = manager.getLayers().find(l => l.id.endsWith('-points-circle'));
    const attributes = points.getAttributeManager().getAttributes();
    const categories = attributes.filterCategoryValues;
    t.ok(categories, 'categorical predicate reaches deck.gl attributes');
    if (!categories) return;
    const accepted = points.state.categoryMap[0][1];
    const values = attributes.filterValues.value;
    const visible = features.flatMap((_, index) => {
      const categoryIndex = categories.isConstant ? 0 : index;
      const numericMatch = tileLayer.props.filterRange.every(
        ([min, max], channel) =>
          values[index * 4 + channel] >= min && values[index * 4 + channel] <= max
      );
      return categories.value[categoryIndex] === accepted && numericMatch ? [index] : [];
    });
    t.deepEqual(visible, expected, message);
  };
  try {
    check([], [0, 1, 2, 3, 4, 5], 'no filters accepts all features');
    check([category], [0, 2], 'selection filters strings and rejects missing properties', true);
    check([{...category, value: ['診療所']}], [1], 'selection changes refresh cached attributes');
    check([{...category, value: ['病院', '診療所']}], [0, 1, 2], 'multiple values use OR');
    check([category, filter(1, ['east'])], [0], 'multiple filters use AND');
    check([{...category, inverted: true}], [1, 3, 4, 5], 'inversion includes missing values');
    check([{...category, enabled: false}], [0, 1, 2, 3, 4, 5], 'disabled filter accepts all');
    check([{...category, value: []}], [0, 1, 2, 3, 4, 5], 'cleared filter accepts all');
    check(
      [{...category, value: [], inverted: true}],
      [0, 1, 2, 3, 4, 5],
      'cleared inverted filter accepts all'
    );
    check([category, filter(2, [1, 100])], [0], 'categorical and numeric filters combine');
    check(
      [{...category, value: []}, filter(2, [1, 100])],
      [0, 1, 3],
      'clearing categorical selection preserves numeric filtering on cached tiles'
    );
    check(
      [filter(2, [1, 100])],
      [0, 1, 3],
      'removing categorical filter preserves numeric filtering'
    );
    check([], [0, 1, 2, 3, 4, 5], 'removing all filters restores cached features');
  } finally {
    manager.finalize();
  }
  t.end();
});

test('#VectorTileLayer -> categorical filters suppress stale hover outlines', t => {
  const {layer, features, filter, render} = categoricalFilterFixture();
  const tile = {
    id: 'hover-tile',
    content: {type: 'FeatureCollection', shape: 'geojson-table', features}
  };
  const objectHovered = {
    picked: true,
    object: features[0],
    index: 0,
    tile,
    layer: {props: {id: layer.id}}
  };
  const category = filter(0, ['病院']);
  t.equal(
    render([category], objectHovered).length,
    2,
    'matching anonymous feature has hover overlay'
  );
  t.equal(
    render([{...category, value: ['診療所']}], objectHovered).length,
    1,
    'filtered anonymous hover is removed'
  );

  features[0].properties.id = 'shared';
  features[1].properties.id = 'shared';
  layer.tileDataset.getTiles = () => [tile];
  const layers = render([category], objectHovered);
  t.equal(layers[0].props.highlightedFeatureId, 'shared', 'matching feature remains highlighted');
  t.deepEqual(layers[1].props.data, [features[0]], 'outline excludes nonmatching tile fragments');
  const filtered = render([{...category, value: ['診療所']}], objectHovered);
  t.equal(filtered.length, 1, 'filtered identified hover has no outline');
  t.equal(filtered[0].props.highlightedFeatureId, undefined, 'filtered hover is not highlighted');
  t.end();
});

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
