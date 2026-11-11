// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape-catch';
import {tileLayerBoundsLayer} from '../../../src/layers/src/vector-tile/vector-tile-layer';
import sinon from 'sinon';
import {MVTSource} from '@loaders.gl/mvt';
import {PMTilesSource, PMTilesTileSource} from '@loaders.gl/pmtiles';
import {LayerManager, MapView, WebMercatorViewport, _GlobeView} from '@deck.gl/core';
import {device} from '@deck.gl/test-utils';
import {
  INITIAL_MAP_STATE,
  INITIAL_VIS_STATE,
  setLayerAnimationTimeUpdater,
  updateVisDataUpdater,
  createNewDatasetSuccessUpdater
} from '@kepler.gl/reducers';
import {drainTasksForTesting} from '@kepler.gl/tasks';
import {preparedDataset, dataId} from 'test/helpers/layer-utils';
import {KeplerGlLayers} from '@kepler.gl/layers';
import {MISSING_VALUE_COLOR, NO_VALUE_COLOR, RemoteTileFormat} from '@kepler.gl/constants';
import {KeplerTable, parseVectorMetadata} from '@kepler.gl/table';
import {getFilterProps, getLayerBlendingParameters} from '@kepler.gl/utils';

const {VectorTileLayer} = KeplerGlLayers;

test('#VectorTileLayer -> quantile options follow the selected channel', t => {
  const layer = new VectorTileLayer({id: 'quantile-options', dataId: 'tiles'});
  const field = {name: 'value', type: 'real', filterProps: {domain: [0, 10]}};
  const quantileField = {
    ...field,
    filterProps: {...field.filterProps, domainQuantiles: {quantiles: [[0, 2, 5, 8, 10]], z: [0]}}
  };
  layer.config.colorScale = 'quantize';
  layer.config.strokeColorScale = 'quantize';
  layer.config.visConfig.dynamicColor = false;

  for (const fill of [null, field, quantileField]) {
    for (const stroke of [null, field, quantileField]) {
      layer.config.colorField = fill;
      layer.config.strokeColorField = stroke;
      t.equal(
        layer.getScaleOptions('color').includes('quantile'),
        fill === quantileField,
        'fill quantiles depend only on fill metadata'
      );
      t.equal(
        layer.getScaleOptions('strokeColor').includes('quantile'),
        stroke === quantileField,
        'stroke quantiles depend only on stroke metadata'
      );
    }
  }

  layer.config.colorField = field;
  layer.config.strokeColorField = field;
  for (const channel of ['color', 'strokeColor']) {
    const other = channel === 'color' ? 'strokeColor' : 'color';
    layer.config[`${channel}Scale`] = 'quantile';
    t.ok(
      layer.getScaleOptions(channel).includes('quantile'),
      'retains the active scale while loading'
    );
    t.notOk(
      layer.getScaleOptions(other).includes('quantile'),
      'active scale does not affect the other channel'
    );
    layer.config[`${channel}Scale`] = 'quantize';
  }
  layer.config.visConfig.dynamicColor = true;
  for (const channel of ['color', 'strokeColor']) {
    t.ok(
      layer.getScaleOptions(channel).includes('quantile'),
      'dynamic color can calculate quantiles'
    );
    t.notOk(
      layer.getScaleOptions(channel).includes('jenks'),
      'Jenks remains unavailable for tiles'
    );
  }
  t.end();
});

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
  return {layer, table, features, filter, render};
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

test('#VectorTileLayer -> indexed categories refresh cached tiles and hover on timeline changes', t => {
  const {layer, table, features, filter} = categoricalFilterFixture();
  const dates = ['2020-01-01', '2021-01-01'];
  const times = dates.map(Date.parse);
  const metadata = parseVectorMetadata({
    tilejson: {
      layers: [
        {
          id: 'features',
          fields: dates.map((date, index) => ({
            name: `category|${date}`,
            type: 'utf8',
            values: index ? ['病院', '診療所', '歯科診療所'] : ['病院', '診療所']
          }))
        }
      ]
    }
  });
  table.updateSchema({fields: [...metadata.fields, ...table.fields.slice(1)], rows: []});
  t.deepEqual(
    table.fields[0].filterProps.domain,
    ['病院', '診療所', '歯科診療所'],
    'choices include categories from later timestamps'
  );
  features.forEach((feature, index) => {
    if (!feature.properties) return;
    const value = feature.properties.category;
    feature.properties[`category|${dates[0]}`] = value;
    feature.properties[`category|${dates[1]}`] =
      index === 2
        ? '歯科診療所'
        : value === '病院'
        ? '診療所'
        : value === '診療所'
        ? '病院'
        : value;
    delete feature.properties.category;
  });
  layer.updateLayerConfig({animation: {...layer.config.animation, enabled: true}});
  let state = {
    ...INITIAL_VIS_STATE,
    datasets: {[table.id]: table},
    layers: [layer],
    layerData: [{}]
  };
  const tile = {
    index: {z: 2},
    content: {type: 'FeatureCollection', shape: 'geojson-table', features}
  };
  const objectHovered = {
    picked: true,
    object: features[0],
    index: 0,
    tile,
    layer: {props: {id: layer.id}}
  };
  const manager = new LayerManager(device, {
    viewport: new WebMercatorViewport({width: 64, height: 64, zoom: 2})
  });
  const check = (time, filters, expected, message) => {
    table.filterTable(filters, state.layers);
    state = setLayerAnimationTimeUpdater(state, {value: time});
    const currentLayer = state.layers[0];
    const layers = currentLayer.renderLayer({
      data: {...state.layerData[0], tileSource: {getTileData: async () => features}},
      gpuFilter: table.gpuFilter,
      mapState: INITIAL_MAP_STATE,
      animationConfig: state.animationConfig,
      layerCallbacks: {},
      visible: true,
      objectHovered
    });
    const sublayer = currentLayer.renderSubLayers({
      ...layers[0].props,
      id: 'indexed-category-tile',
      data: features,
      tile
    });
    t.equal(sublayer.props.data, features, 'timeline updates keep cached features');
    manager.setLayers([sublayer]);
    const points = manager.getLayers().find(l => l.id.endsWith('-points-circle'));
    const attributes = points.getAttributeManager().getAttributes();
    const categories = attributes.filterCategoryValues;
    const accepted = points.state.categoryMap[0][1];
    const numericValues = attributes.filterValues.value;
    const visible = features.flatMap((_, index) =>
      categories.value[categories.isConstant ? 0 : index] === accepted &&
      layers[0].props.filterRange.every(
        ([min, max], channel) =>
          numericValues[index * 4 + channel] >= min && numericValues[index * 4 + channel] <= max
      )
        ? [index]
        : []
    );
    t.deepEqual(visible, expected, message);
    t.equal(layers.length > 1, expected.includes(0), 'hover agrees with the selected time');
  };
  const category = filter(0, ['病院']);
  const beds = filter(2, [1, 100]);
  try {
    check(times[0], [category], [0, 2], 'uses the first indexed property');
    check(times[1], [category], [1], 'advancing time updates cached category attributes');
    check(
      times[1],
      [filter(0, ['歯科診療所'])],
      [2],
      'a category introduced at a later timestamp is selectable'
    );
    check(times[0], [category], [0, 2], 'reversing time restores the matching categories');
    check(
      times[1],
      [category, filter(1, ['east']), beds],
      [1],
      'indexed, ordinary and numeric filters combine'
    );
    check(
      times[1],
      [{...category, inverted: true}],
      [0, 2, 3, 4, 5],
      'indexed inversion includes missing values'
    );
    check(
      times[1],
      [{...category, enabled: false}],
      [0, 1, 2, 3, 4, 5],
      'disabled indexed filter accepts all'
    );
    check(
      times[1],
      [{...category, value: [], inverted: true}],
      [0, 1, 2, 3, 4, 5],
      'cleared indexed filter accepts all'
    );
    check(
      times[0],
      [{...category, value: []}, beds],
      [0, 1, 3],
      'clearing preserves numeric filtering'
    );
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

test('#VectorTileLayer -> repeated hover and pan reuse outline geometry', t => {
  const layer = new VectorTileLayer({id: 'cached-hover', dataId: 'tiles'});
  const feature = {
    type: 'Feature',
    id: 'selected',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-1, -1],
          [1, -1],
          [1, 1],
          [-1, 1],
          [-1, -1]
        ]
      ]
    }
  };
  let unrelatedReads = 0;
  const features = [
    feature,
    ...Array.from({length: 1000}, () => ({
      ...feature,
      get id() {
        unrelatedReads++;
        return 'other';
      }
    }))
  ];
  const tile = {
    id: '0-0-0',
    content: features,
    boundingBox: [
      [-180, -85],
      [180, 85]
    ]
  };
  layer.tileDataset.getTiles = () => [tile];
  const pick = {picked: true, index: 0, object: feature, tile, layer: {props: {id: layer.id}}};
  const opts = {
    data: {tileSource: {}, tilesetDataUrl: 'test/{z}/{x}/{y}'},
    mapState: {zoom: 2, latitude: 0, longitude: 0},
    animationConfig: {},
    gpuFilter: {filterRange: [], filterValueAccessor: () => () => () => []},
    layerCallbacks: {},
    visible: true,
    objectHovered: pick
  };
  const manager = new LayerManager(device, {
    viewport: new WebMercatorViewport({width: 64, height: 64, zoom: 2})
  });
  try {
    const first = layer.renderLayer(opts)[1];
    manager.setLayers([first]);
    const stroke = manager.getLayers().find(l => l.id.endsWith('-polygons-stroke'));
    const tessellate = sinon.spy(stroke.state.pathTesselator, 'updateGeometry');
    unrelatedReads = 0;
    const start = performance.now();
    let current;
    for (let i = 0; i < 100; i++) {
      const longitude = i / 100;
      manager.activateViewport(
        new WebMercatorViewport({width: 64, height: 64, zoom: 2, longitude})
      );
      current = layer.renderLayer({
        ...opts,
        mapState: {...opts.mapState, longitude},
        objectHovered: {...pick, x: i}
      })[1];
      manager.setLayers([current]);
    }
    t.comment(
      `100 hover/pan renders: ${unrelatedReads} unrelated ID reads, ${
        tessellate.callCount
      } tessellations, ${(performance.now() - start).toFixed(2)} ms`
    );
    t.equal(current.props.data, first.props.data, 'same feature retains its outline data');
    t.equal(unrelatedReads, 0, 'unchanged content is not rescanned');
    t.equal(tessellate.callCount, 0, 'pan and repeated picks do not retessellate the outline');
    layer.updateLayerVisConfig({strokeWidth: 4});
    const styled = layer.renderLayer({...opts, visible: false})[1];
    t.equal(styled.props.data, first.props.data, 'style and visibility changes preserve geometry');
    t.equal(styled.props.getLineWidth, 5, 'stroke width still updates');
    t.equal(styled.props.visible, false, 'split-panel visibility still updates');
    const globe = layer.renderLayer({
      ...opts,
      mapState: {...opts.mapState, globe: {enabled: true}}
    })[1];
    t.equal(globe.props.data, first.props.data, 'projection styling does not rebuild matched data');
    t.equal(
      globe.props.extensions[0].constructor.extensionName,
      'GlobeClipExtension',
      'projection clip still updates'
    );
    t.equal(
      layer.renderLayer({...opts, objectHovered: null}).length,
      1,
      'clearing hover removes the outline'
    );
    t.equal(
      layer.renderLayer({...opts, objectHovered: {...pick, layer: {props: {id: 'another-layer'}}}})
        .length,
      1,
      'picking another layer removes the outline'
    );
  } finally {
    manager.finalize();
  }
  t.end();
});

test('#VectorTileLayer -> outline cache follows content, IDs and filters', t => {
  const layer = new VectorTileLayer({id: 'cached-fragments', dataId: 'tiles'});
  const feature = (id, group = 'shared') => ({
    type: 'Feature',
    id,
    properties: {group},
    geometry: {type: 'Point', coordinates: [0, 0]}
  });
  const selected = feature(0);
  const fragment = feature('0');
  const other = feature(1, 'other');
  const firstTile = {id: 'first', content: [selected, other]};
  const tiles = [firstTile];
  layer.tileDataset.getTiles = () => tiles;
  const options = {
    defaultLayerProps: {id: layer.id, visible: true},
    visConfig: {strokeWidth: 1},
    getFilterCategory: () => 1
  };
  const render = (hovered = selected, overrides = {}) =>
    layer._getPerTileOverlays(hovered, {...options, ...overrides});
  const first = render()[0].props.data;
  t.deepEqual(first, [selected], 'zero is a valid top-level feature ID');
  t.equal(render({...selected})[0].props.data, first, 'equivalent picks retain the data');
  tiles.push({id: 'second', content: {shape: 'geojson-table', features: [fragment]}});
  const loaded = render();
  t.equal(loaded.length, 2, 'newly loaded tile adds a matching fragment');
  t.equal(loaded[0].props.data, first, 'loading a tile retains unchanged tile data');
  t.deepEqual(
    loaded[1].props.data,
    [fragment],
    'string and numeric IDs retain existing matching semantics'
  );
  tiles.pop();
  t.equal(render().length, 1, 'evicting a tile removes its outline');
  const replacement = feature(0);
  firstTile.content = [replacement];
  const replaced = render()[0].props.data;
  t.deepEqual(replaced, [replacement], 'same tile header with new content refreshes geometry');
  t.notEqual(replaced, first, 'replacement content is not stale');
  tiles[0] = {id: 'first', content: {shape: 'geojson-table', features: [selected, other]}};
  t.deepEqual(
    render()[0].props.data,
    [selected],
    'same tile ID with a new header refreshes geometry'
  );
  t.deepEqual(render(other)[0].props.data, [other], 'changing picked ID changes the outline');
  t.deepEqual(
    render(selected, {uniqueIdProperty: 'group'})[0].props.data,
    [selected],
    'configured ID field is part of the cache key'
  );
  tiles[0].content.features = [selected, fragment];
  const grouped = render(selected, {uniqueIdProperty: 'group'})[0].props.data;
  t.deepEqual(grouped, [selected, fragment], 'replacing collection features refreshes matches');
  const filtered = render(selected, {
    uniqueIdProperty: 'group',
    getFilterCategory: f => (f === fragment ? 0 : 1)
  });
  t.deepEqual(
    filtered[0].props.data,
    [selected],
    'filter predicate changes remove excluded fragments'
  );
  t.equal(
    render(selected, {getFilterCategory: () => 0}).length,
    0,
    'filtering all fragments removes the outline'
  );
  t.deepEqual(render()[0].props.data, [selected, fragment], 'removing filters restores fragments');
  t.equal(render(feature(undefined)).length, 0, 'missing feature ID has no matching outline');
  t.equal(
    render(selected, {uniqueIdProperty: 'missing'}).length,
    0,
    'missing configured ID has no matching outline'
  );
  tiles[0].content = [];
  t.equal(render().length, 0, 'empty content removes old matches');
  tiles[0].content = undefined;
  t.equal(render().length, 0, 'loading content is skipped');
  tiles.length = 0;
  t.equal(render().length, 0, 'empty tile set removes old outlines');
  t.end();
});

test('#VectorTileLayer -> unchanged renders retain cached tile sublayers', async t => {
  const {layer, table, features} = categoricalFilterFixture();
  features.push({
    type: 'Feature',
    properties: {category: '病院', region: 'east', beds: 10},
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-1, -1],
          [1, -1],
          [1, 1],
          [-1, 1],
          [-1, -1]
        ]
      ]
    }
  });
  layer.updateLayerVisConfig({stroked: true});
  const source = {getTileData: async () => features};
  const data = {
    ...layer.formatLayerData({[table.id]: table}, undefined, {}),
    tileSource: source,
    tilesetDataUrl: 'https://example.com/{z}/{x}/{y}.pbf'
  };
  const manager = new LayerManager(device, {
    viewport: new WebMercatorViewport({width: 64, height: 64, zoom: 2})
  });
  const renderSubLayers = sinon.spy(props => layer.renderSubLayers(props));
  const render = async (mapState = INITIAL_MAP_STATE) => {
    const deckLayer = layer
      .renderLayer({
        data,
        gpuFilter: table.gpuFilter,
        mapState,
        animationConfig: {},
        layerCallbacks: {},
        visible: true
      })[0]
      .clone({renderSubLayers});
    manager.setLayers([deckLayer]);
    await Promise.all(deckLayer.state.tileset.selectedTiles.map(tile => tile.data));
    manager.updateLayers();
    return deckLayer;
  };
  try {
    const first = await render();
    const tileset = first.state.tileset;
    const reload = sinon.spy(tileset, 'reloadAll');
    renderSubLayers.reset();
    const start = performance.now();
    for (let i = 0; i < 100; i++) await render({...INITIAL_MAP_STATE});
    t.comment(
      `100 unchanged vector renders: ${renderSubLayers.callCount} sublayer builds, ${(
        performance.now() - start
      ).toFixed(2)} ms`
    );
    t.equal(renderSubLayers.callCount, 0, 'cached sublayers survive unrelated renders');
    t.equal(reload.callCount, 0, 'no tile reloads');
    layer.updateLayerVisConfig({strokeOpacity: 0.3});
    const styled = await render();
    t.ok(renderSubLayers.callCount > 0, 'stroke opacity rebuilds sublayers');
    t.equal(
      styled.props._subLayerProps['polygons-stroke'].opacity,
      0.3,
      'new stroke opacity reaches sublayers'
    );
    const stroke = manager.getLayers().find(subLayer => subLayer.id.endsWith('-polygons-stroke'));
    t.equal(stroke.props.opacity, 0.3, 'cached polygon strokes receive the new opacity');
    renderSubLayers.reset();
    const blended = await render({...INITIAL_MAP_STATE, layerParameters: {blend: false}});
    t.ok(renderSubLayers.callCount > 0, 'blending changes rebuild sublayers');
    t.equal(
      blended.props._subLayerProps['polygons-fill'].parameters.blend,
      false,
      'new blending parameters reach fills'
    );
    const fill = manager.getLayers().find(subLayer => subLayer.id.endsWith('-polygons-fill'));
    t.equal(fill.props.parameters.blend, false, 'cached polygon fills receive blending changes');
    const additiveState = () => ({
      ...INITIAL_MAP_STATE,
      layerParameters: getLayerBlendingParameters('additive')
    });
    await render(additiveState());
    renderSubLayers.reset();
    for (let i = 0; i < 5; i++) await render(additiveState());
    t.equal(renderSubLayers.callCount, 0, 'equivalent blending values retain cached sublayers');
    await render();
    t.ok(renderSubLayers.callCount > 0, 'removing blending overrides rebuilds sublayers');
    const unblended = manager.getLayers().find(subLayer => subLayer.id.endsWith('-polygons-fill'));
    t.equal(unblended.props.parameters.blend, undefined, 'removed blending does not remain cached');
    t.equal(reload.callCount, 0, 'style changes preserve loaded tile content');
  } finally {
    manager.finalize();
  }
  t.end();
});

test('#VectorTileLayer -> projection changes invalidate only their panel sublayers', async t => {
  const {layer, table, features} = categoricalFilterFixture();
  const data = {
    ...layer.formatLayerData({[table.id]: table}, undefined, {}),
    tileSource: {getTileData: async () => features},
    tilesetDataUrl: 'https://example.com/{z}/{x}/{y}.pbf'
  };
  const camera = {zoom: 2, latitude: 0, longitude: 0, pitch: 0, bearing: 0, dragRotate: true};
  const managers = [0, 1].map(
    () =>
      new LayerManager(device, {
        viewport: new WebMercatorViewport({...camera, width: 128, height: 128})
      })
  );
  const renderSubLayers = managers.map(() => sinon.spy(props => layer.renderSubLayers(props)));
  const render = async (panel, globe, longitude = 0) => {
    const mapState = {
      ...camera,
      longitude,
      globe: {enabled: globe},
      layerParameters: getLayerBlendingParameters(panel === 0 ? 'additive' : 'normal')
    };
    const viewport = new (globe ? _GlobeView : MapView)().makeViewport({
      width: 128,
      height: 128,
      viewState: mapState
    });
    const manager = managers[panel];
    manager.activateViewport(viewport);
    const deckLayer = layer
      .renderLayer({
        data,
        gpuFilter: table.gpuFilter,
        mapState,
        animationConfig: {},
        layerCallbacks: {},
        visible: true
      })[0]
      .clone({renderSubLayers: renderSubLayers[panel]});
    manager.setLayers([deckLayer]);
    // Match deck's draw lifecycle, including each layer's activated viewport.
    for (const current of manager.getLayers()) current.activateViewport(viewport);
    manager.updateLayers();
    await Promise.all(deckLayer.state.tileset.selectedTiles.map(tile => tile.data));
    manager.updateLayers();
    return deckLayer;
  };
  const checkClip = (deckLayer, expected) => {
    const tiles = deckLayer.state.tileset.selectedTiles;
    t.ok(tiles.length > 0, 'the panel has loaded visible tiles');
    t.ok(
      tiles.every(tile =>
        tile.layers?.[0]?.props.extensions.some(
          extension => extension.constructor.extensionName === expected
        )
      ),
      `all visible tiles use ${expected}`
    );
  };
  try {
    const flat = await render(0, false);
    const globe = await render(1, true);
    checkClip(flat, 'ClipExtension');
    checkClip(globe, 'GlobeClipExtension');
    const contents = new Map(flat.state.tileset.selectedTiles.map(tile => [tile.id, tile.content]));
    const reloads = [flat, globe].map(deckLayer => sinon.spy(deckLayer.state.tileset, 'reloadAll'));
    renderSubLayers.forEach(spy => spy.reset());
    for (let i = 0; i < 3; i++) {
      await render(0, false);
      await render(1, true);
    }
    t.equal(renderSubLayers[0].callCount, 0, 'flat panel retains equivalent blending overrides');
    t.equal(renderSubLayers[1].callCount, 0, 'globe panel retains its own blending overrides');

    const switched = await render(0, true);
    checkClip(switched, 'GlobeClipExtension');
    const retained = switched.state.tileset.selectedTiles.filter(tile => contents.has(tile.id));
    t.ok(retained.length > 0, 'projection switch keeps previously loaded tiles');
    t.ok(
      retained.every(tile => tile.content === contents.get(tile.id)),
      'tile content is retained'
    );
    await render(1, true);
    t.equal(renderSubLayers[1].callCount, 0, 'switching one panel leaves the other panel cached');

    const restored = await render(0, false);
    checkClip(restored, 'ClipExtension');
    const sublayers = new Map(
      restored.state.tileset.selectedTiles.map(tile => [tile.id, tile.layers[0]])
    );
    const panned = await render(0, false, 1);
    const overlapping = panned.state.tileset.selectedTiles.filter(tile => sublayers.has(tile.id));
    t.ok(overlapping.length > 0, 'pan retains visible tiles');
    t.ok(
      overlapping.every(tile => tile.layers[0] === sublayers.get(tile.id)),
      'pan preserves existing sublayers'
    );
    checkClip(await render(1, false), 'ClipExtension');
    t.ok(
      reloads.every(spy => spy.callCount === 0),
      'projection changes do not reload tile content'
    );
  } finally {
    managers.forEach(manager => manager.finalize());
  }
  t.end();
});

test('#VectorTileLayer -> indexed accessors read the epoch time step', t => {
  const layer = new VectorTileLayer({id: 'epoch', dataId: 'tiles'});
  const field = {
    name: 'value',
    fieldIdx: 0,
    indexBy: {mappedValue: {0: 'value|1970-01-01', 86400000: 'value|1970-01-02'}}
  };
  const properties = {value: 99, 'value|1970-01-01': 0, 'value|1970-01-02': 2};
  for (const [time, expected] of [
    [0, 0],
    [86400000, 2]
  ]) {
    const accessor = layer.accessRowValue(field, time);
    t.equal(accessor(field, {properties}), expected, 'reads the time-indexed feature attribute');
    t.equal(accessor(field, properties), expected, 'reads the flattened picking attribute');
  }
  for (const time of [null, undefined, -1]) {
    t.equal(layer.accessRowValue(field, time)(field, {properties}), 99, 'keeps fallback access');
  }
  t.equal(layer.accessRowValue(null, 0)(null, {}), null, 'handles a missing field');
  t.end();
});

test('#VectorTileLayer -> static category filters retain attributes during playback', t => {
  const {layer, table, filter, features} = categoricalFilterFixture();
  layer.updateLayerConfig({animation: {...layer.config.animation, enabled: true}});
  const selection = filter(0, ['病院']);
  table.filterTable([selection], [layer]);
  const datasets = {[table.id]: table};
  const manager = new LayerManager(device, {
    viewport: new WebMercatorViewport({width: 64, height: 64, zoom: 2})
  });
  const values = [];
  let evaluations = 0;
  let firstEvaluations = 0;
  const tracked = new WeakMap();
  const track = accessor => {
    if (!tracked.has(accessor))
      tracked.set(accessor, feature => {
        evaluations++;
        return accessor(feature);
      });
    return tracked.get(accessor);
  };
  let previous;
  const start = performance.now();
  try {
    for (let time = 1; time <= 100; time++) {
      table.filterTable([selection, filter(2, [0, time])], [layer]);
      const data = layer.formatLayerData(datasets, previous, {currentTime: time});
      const deck = layer.renderLayer({
        data: {...data, tileSource: {getTileData: async () => features}},
        gpuFilter: table.gpuFilter,
        mapState: INITIAL_MAP_STATE,
        animationConfig: {currentTime: time},
        layerCallbacks: {},
        visible: true
      })[0];
      const sublayer = layer.renderSubLayers({
        ...deck.props,
        getFilterCategory: track(data.getFilterCategory),
        updateTriggers: {
          ...deck.props.updateTriggers,
          getFilterCategory: track(data.getFilterCategory)
        },
        id: 'playback-category',
        data: features,
        tile: {index: {z: 2}}
      });
      manager.setLayers([sublayer]);
      if (time === 1) firstEvaluations = evaluations;
      values.push(data.getFilterCategory);
      previous = data;
    }
    t.comment(
      `100 playback ticks: ${
        new Set(values).size
      } category accessors, ${evaluations} category attribute evaluations, ${(
        performance.now() - start
      ).toFixed(2)} ms`
    );
    t.equal(new Set(values).size, 1, 'static filter predicate is reused');
    t.ok(firstEvaluations > 0, 'the first tick evaluates category attributes');
    t.equal(evaluations, firstEvaluations, 'later ticks reuse static category attributes');
    t.deepEqual(
      features.map(previous.getFilterCategory),
      [1, 0, 1, 0, 0, 0],
      'static selection remains correct'
    );
    table.filterTable([{...selection, inverted: true}], [layer]);
    const inverted = layer.formatLayerData(datasets, previous, {currentTime: 101});
    t.notEqual(
      inverted.getFilterCategory,
      previous.getFilterCategory,
      'inversion invalidates the predicate'
    );
    t.deepEqual(
      features.map(inverted.getFilterCategory),
      [0, 1, 0, 1, 1, 1],
      'inversion preserves missing values'
    );
    table.filterTable([], [layer]);
    const cleared = layer.formatLayerData(datasets, inverted, {currentTime: 102});
    t.deepEqual(
      features.map(cleared.getFilterCategory),
      [1, 1, 1, 1, 1, 1],
      'removing filters restores all features'
    );
  } finally {
    manager.finalize();
  }
  t.end();
});

test('#VectorTileLayer -> only active indexed category filters depend on time', t => {
  const {layer, table, filter} = categoricalFilterFixture();
  layer.updateLayerConfig({animation: {...layer.config.animation, enabled: true}});
  table.fields = [
    {...table.fields[0], indexBy: {mappedValue: {1000: 'early', 2000: 'late'}}},
    ...table.fields.slice(1)
  ];
  const selection = filter(0, ['yes']);
  const feature = {properties: {early: 'yes', late: 'no'}};
  const at = time =>
    layer.formatLayerData({[table.id]: table}, undefined, {currentTime: time}).getFilterCategory;
  table.filterTable([selection], [layer]);
  const early = at(1000);
  const late = at(2000);
  t.notEqual(early, late, 'active indexed selections invalidate on playback');
  t.equal(early(feature), 1, 'early category matches');
  t.equal(late(feature), 0, 'late category is rejected');
  for (const filters of [[{...selection, enabled: false}], [{...selection, value: []}], []]) {
    table.filterTable(filters, [layer]);
    t.equal(at(1000), at(2000), 'disabled, cleared and absent filters ignore playback');
    t.equal(at(2000)(feature), 1, 'inactive selection accepts the feature');
  }
  table.fields = [{...table.fields[0], type: 'boolean'}, ...table.fields.slice(1)];
  table.filterTable([{...selection, type: 'select', value: false}], [layer]);
  const booleanFeature = {properties: {early: false, late: true}};
  t.equal(at(1000)(booleanFeature), 1, 'false is an active boolean selection');
  t.equal(at(2000)(booleanFeature), 0, 'indexed boolean selection follows time');
  const old = at(2000);
  table.fields = table.fields.map(field => ({...field}));
  t.notEqual(at(2000), old, 'replacement field metadata invalidates accessors');
  t.end();
});

async function updateTileDataset(layer, table, layerData) {
  drainTasksForTesting();
  const state = updateVisDataUpdater(
    {
      ...INITIAL_VIS_STATE,
      datasets: {[table.id]: table},
      layers: [layer],
      layerData: [layerData],
      layerOrder: [layer.id]
    },
    {
      datasets: [{info: {id: table.id}, data: {fields: table.fields, rows: []}}],
      options: {autoCreateLayers: false, autoCreateTooltips: false}
    }
  );
  const [task] = drainTasksForTesting();
  const action = await new Promise((resolve, reject) => {
    task.run((effect, succeed, fail, ctx) => effect(succeed, fail, ctx), resolve, reject);
  });
  const updated = createNewDatasetSuccessUpdater(state, action);
  drainTasksForTesting();
  return updated;
}

function pmtilesPointArchive(tileId) {
  // One MVT point at (0, 0) in layer "a", stored in an uncompressed v3 archive.
  const feature = [8, 1, 24, 1, 34, 3, 9, 0, 0];
  const layer = [120, 2, 10, 1, 97, 18, feature.length, ...feature, 40, 128, 32];
  const tile = new Uint8Array([26, layer.length, ...layer]);
  const metadata = new TextEncoder().encode('{"tilejson":"3.0.0","tiles":[]}');
  const tileOffset = 132 + metadata.length;
  const archive = new Uint8Array(tileOffset + tile.length);
  const header = new DataView(archive.buffer);
  archive.set(new TextEncoder().encode('PMTiles'));
  header.setUint8(7, 3);
  header.setUint32(8, 127, true);
  header.setUint32(16, 5, true);
  header.setUint32(24, 132, true);
  header.setUint32(32, metadata.length, true);
  header.setUint32(56, tileOffset, true);
  header.setUint32(64, tile.length, true);
  for (const offset of [72, 80, 88]) header.setUint32(offset, 1, true);
  for (const offset of [97, 98, 99, 101]) header.setUint8(offset, 1);
  archive.set([1, tileId, 1, tile.length, 1], 127);
  archive.set(metadata, 132);
  archive.set(tile, tileOffset);
  return archive;
}

test('#VectorTileLayer -> same-ID updates discover new PMTiles tiles at the same URL', async t => {
  const {layer, table} = categoricalFilterFixture();
  table.metadata = {
    remoteTileFormat: RemoteTileFormat.PMTILES,
    tilesetDataUrl: 'https://example.com/current.pmtiles',
    minZoom: 0,
    maxZoom: 1
  };
  const archives = [pmtilesPointArchive(0), pmtilesPointArchive(1)];
  let revision = 0;
  const requests = [];
  const fetchStub = sinon.stub(globalThis, 'fetch').callsFake(async (_url, options) => {
    const range = options.headers.get('range');
    const [, start, end] = range.match(/bytes=(\d+)-(\d+)/);
    requests.push({revision, range});
    return {
      status: 206,
      headers: new Headers({ETag: `"v${revision}"`}),
      arrayBuffer: async () => archives[revision].slice(Number(start), Number(end) + 1).buffer
    };
  });
  const viewport = zoom =>
    new WebMercatorViewport({width: 64, height: 64, longitude: -90, latitude: 40, zoom});
  const manager = new LayerManager(device, {viewport: viewport(0)});
  const render = async (data, zoom) => {
    manager.activateViewport(viewport(zoom));
    const deck = layer
      .renderLayer({
        data,
        gpuFilter: table.gpuFilter,
        mapState: {...INITIAL_MAP_STATE, zoom},
        animationConfig: {},
        layerCallbacks: {},
        visible: true
      })[0]
      .clone({renderSubLayers: () => null});
    manager.setLayers([deck]);
    await Promise.all(deck.state.tileset.selectedTiles.map(tile => tile.data));
    manager.updateLayers();
    return deck;
  };
  try {
    const first = layer.formatLayerData({[table.id]: table}, undefined, {});
    const initialDeck = await render(first, 0);
    t.equal(
      initialDeck.state.tileset.selectedTiles.find(tile => tile.index.z === 0)?.content?.features
        ?.length,
      1,
      'the initial archive contains a visible feature'
    );
    revision = 1;
    const updated = await updateTileDataset(layer, table, first);
    t.equal(updated.layers[0], layer, 'the real update path preserves the layer');
    t.equal(updated.datasets[table.id].dataRevision, 1, 'the dataset revision advances');
    const second = updated.layerData[0];
    t.notEqual(second.tileSource, first.tileSource, 'the updated dataset gets a fresh source');
    const updatedDeck = await render(second, 1);
    const addedTile = updatedDeck.state.tileset.selectedTiles.find(
      tile => tile.index.z === 1 && tile.index.x === 0 && tile.index.y === 0
    );
    t.equal(addedTile?.content?.features?.length, 1, 'zooming loads the newly available feature');
    t.equal(
      requests.filter(request => request.revision === 1 && request.range === 'bytes=0-16383')
        .length,
      1,
      'the update reads the new archive directory'
    );
    t.equal(
      layer.formatLayerData(updated.datasets, second, {currentTime: 1}).tileSource,
      second.tileSource,
      'playback reuses the updated source'
    );
  } finally {
    manager.finalize();
    fetchStub.restore();
  }
  t.end();
});

function pmtilesRetryFixture() {
  const {layer, table} = categoricalFilterFixture();
  table.metadata = {
    remoteTileFormat: RemoteTileFormat.PMTILES,
    tilesetDataUrl: 'https://example.com/retry.pmtiles'
  };

  // An uncompressed v3 archive with a root pointing to one leaf directory.
  // The leaf has no tile at z=0, so successful reads return null without decoding MVT.
  const metadata = new TextEncoder().encode('{"tilejson":"3.0.0","tiles":[]}');
  const leafOffset = 132 + metadata.length;
  const archive = new Uint8Array(leafOffset + 5);
  const header = new DataView(archive.buffer);
  archive.set(new TextEncoder().encode('PMTiles'));
  header.setUint8(7, 3);
  header.setUint32(8, 127, true);
  header.setUint32(16, 5, true);
  header.setUint32(24, 132, true);
  header.setUint32(32, metadata.length, true);
  header.setUint32(40, leafOffset, true);
  header.setUint32(48, 5, true);
  header.setUint8(97, 1);
  header.setUint8(98, 1);
  header.setUint8(99, 1);
  archive.set([1, 0, 0, 5, 1], 127);
  archive.set(metadata, 132);
  archive.set([1, 1, 1, 1, 1], leafOffset);

  const readRange = sinon.stub().callsFake(async range => {
    const [, start, end] = range.match(/bytes=(\d+)-(\d+)/);
    return {
      status: 206,
      headers: new Headers(),
      arrayBuffer: async () => archive.slice(Number(start), Number(end) + 1).buffer
    };
  });
  const fetchStub = sinon
    .stub(globalThis, 'fetch')
    .callsFake((_url, options) => readRange(options.headers.get('range')));
  return {
    layer,
    table,
    readRange,
    fetchStub,
    getSource: () => layer.formatLayerData({[table.id]: table}, undefined, {}).tileSource,
    ranges: {header: 'bytes=0-16383', directory: `bytes=${leafOffset}-${leafOffset + 4}`}
  };
}

for (const path of ['header', 'directory']) {
  test(`#VectorTileLayer -> retries a failed PMTiles ${path} request`, async t => {
    const {getSource, readRange, fetchStub, ranges} = pmtilesRetryFixture();
    const error = new Error(`Temporary ${path} failure`);
    const requests = readRange.withArgs(ranges[path]);
    requests.onFirstCall().rejects(error);
    try {
      const failed = getSource();
      const result =
        path === 'header' ? failed.metadata : failed.getTileData({index: {z: 0, x: 0, y: 0}});
      t.equal(await result.catch(reason => reason), error, 'original error reaches the caller');
      const retried = getSource();
      t.notEqual(retried, failed, 'unchanged inputs replace the failed source');
      t.equal(
        await retried.getTileData({index: {z: 0, x: 0, y: 0}}),
        null,
        'retry completes the archive lookup'
      );
      t.equal(requests.callCount, 2, 'retry issues a fresh request for the failed range');
      t.equal(getSource(), retried, 'successful source remains cached');
    } finally {
      fetchStub.restore();
    }
    t.end();
  });

  test(`#VectorTileLayer -> a late PMTiles ${path} failure preserves the replacement`, async t => {
    const {getSource, table, readRange, fetchStub, ranges} = pmtilesRetryFixture();
    const error = new Error(`Late ${path} failure`);
    let reject;
    let started;
    const requestStarted = new Promise(resolve => {
      started = resolve;
    });
    readRange
      .withArgs(ranges[path])
      .onFirstCall()
      .callsFake(() => {
        started();
        return new Promise((_resolve, rejectRequest) => {
          reject = rejectRequest;
        });
      });
    try {
      const old = getSource();
      const result =
        path === 'header' ? old.metadata : old.getTileData({index: {z: 0, x: 0, y: 0}});
      const failure = result.catch(reason => reason);
      await requestStarted;
      const metadata = table.metadata;
      table.metadata = {...metadata, tilesetDataUrl: undefined};
      t.equal(getSource(), null, 'removing the URL clears the cached source');
      table.metadata = metadata;
      const replacement = getSource();
      t.notEqual(replacement, old, 'restoring the same inputs creates a replacement');
      t.equal(
        await replacement.getTileData({index: {z: 0, x: 0, y: 0}}),
        null,
        'replacement succeeds while the old request is pending'
      );
      reject(error);
      t.equal(await failure, error, 'old request still reports its failure');
      t.equal(getSource(), replacement, 'late failure does not evict the replacement');
    } finally {
      fetchStub.restore();
    }
    t.end();
  });

  test(`#VectorTileLayer -> a late PMTiles ${path} failure preserves the new revision`, async t => {
    const {layer, table, getSource, readRange, fetchStub, ranges} = pmtilesRetryFixture();
    const error = new Error(`Previous revision ${path} failure`);
    let reject;
    let started;
    const requestStarted = new Promise(resolve => {
      started = resolve;
    });
    readRange
      .withArgs(ranges[path])
      .onFirstCall()
      .callsFake(() => {
        started();
        return new Promise((_resolve, rejectRequest) => {
          reject = rejectRequest;
        });
      });
    try {
      const old = getSource();
      const result =
        path === 'header' ? old.metadata : old.getTileData({index: {z: 0, x: 0, y: 0}});
      const failure = result.catch(reason => reason);
      await requestStarted;
      const updated = await updateTileDataset(layer, table);
      const replacement = updated.layerData[0].tileSource;
      t.notEqual(replacement, old, 'the revision changes while the old request is pending');
      reject(error);
      t.equal(await failure, error, 'the previous revision still reports its error');
      t.equal(
        await replacement.getTileData({index: {z: 0, x: 0, y: 0}}),
        null,
        'the new revision completes its archive lookup'
      );
      t.equal(getSource(), replacement, 'the late error does not evict the new revision');
    } finally {
      fetchStub.restore();
    }
    t.end();
  });
}

test('#VectorTileLayer -> reuse sources and archive caches for unchanged inputs', async t => {
  const seed = MVTSource.createDataSource('https://example.com/seed', {
    core: {
      loadOptions: {
        core: {
          fetch: async () => ({
            ok: true,
            text: async () => JSON.stringify({tilejson: '3.0.0', tiles: []})
          })
        }
      }
    }
  });
  await seed.metadata;
  const mvtMetadata = sinon
    .stub(Object.getPrototypeOf(seed), 'getMetadata')
    .callsFake(async () => null);
  const pmMetadata = sinon
    .stub(PMTilesTileSource.prototype, 'getMetadata')
    .callsFake(async () => ({}));
  const mvtConstruct = sinon.spy(MVTSource, 'createDataSource');
  const pmConstruct = sinon.spy(PMTilesSource, 'createDataSource');
  try {
    for (const format of [RemoteTileFormat.MVT, RemoteTileFormat.PMTILES]) {
      const {layer, table} = categoricalFilterFixture();
      const sourceMetadata = {
        remoteTileFormat: format,
        tilesetDataUrl:
          format === RemoteTileFormat.MVT
            ? 'https://example.com/{z}/{x}/{y}.pbf'
            : 'https://example.com/a.pmtiles',
        tilesetMetadataUrl: 'https://example.com/tilejson.json'
      };
      const sources = new Set();
      const caches = new Set();
      const factory = format === RemoteTileFormat.MVT ? mvtConstruct : pmConstruct;
      factory.reset();
      const start = performance.now();
      let previous;
      for (let time = 0; time < 100; time++) {
        table.metadata = {...sourceMetadata};
        layer.updateLayerConfig({color: [time, 0, 0]});
        previous = layer.formatLayerData({[table.id]: table}, previous, {currentTime: time});
        sources.add(previous.tileSource);
        if (previous.tileSource.pmtiles) caches.add(previous.tileSource.pmtiles.cache);
      }
      t.comment(
        `${format}: 100 formats => ${factory.callCount} source constructions, ${
          caches.size
        } archive caches, ${(performance.now() - start).toFixed(2)} ms (metadata I/O stubbed)`
      );
      t.equal(factory.callCount, 1, 'unchanged source inputs construct once');
      t.equal(sources.size, 1, 'playback and equivalent metadata retain source identity');
      if (format === RemoteTileFormat.PMTILES)
        t.equal(caches.size, 1, 'PMTiles directory/header cache is retained');
      if (format === RemoteTileFormat.MVT) {
        const manager = new LayerManager(device, {
          viewport: new WebMercatorViewport({width: 64, height: 64, zoom: 2})
        });
        let requests = 0;
        const render = async data => {
          data.tileSource.getTileData = async () => {
            requests++;
            return [];
          };
          const deck = layer
            .renderLayer({
              data,
              gpuFilter: table.gpuFilter,
              mapState: INITIAL_MAP_STATE,
              animationConfig: {},
              layerCallbacks: {},
              visible: true
            })[0]
            .clone({renderSubLayers: () => null});
          manager.setLayers([deck]);
          await Promise.all(deck.state.tileset.selectedTiles.map(tile => tile.data));
          manager.updateLayers();
          return deck;
        };
        try {
          const first = await render(previous);
          const initialRequests = requests;
          t.ok(initialRequests > 0, 'visible tiles are initially requested');
          for (let i = 0; i < 10; i++) {
            const data = layer.formatLayerData({[table.id]: table}, previous, {currentTime: i});
            await render(data);
          }
          t.equal(requests, initialRequests, 'source reuse does not refetch loaded tiles');
          table.metadata = {
            ...sourceMetadata,
            tilesetDataUrl: 'https://example.com/replacement/{z}/{x}/{y}.pbf'
          };
          const changed = await render(layer.formatLayerData({[table.id]: table}, previous, {}));
          t.equal(
            changed.state.tileset,
            first.state.tileset,
            'source replacement retains the tileset'
          );
          t.ok(requests > initialRequests, 'changed source URL reloads visible tiles');
          t.comment(
            `MVT tile I/O stubs: ${initialRequests} initial calls, 0 additional calls across 10 equivalent formats`
          );
        } finally {
          manager.finalize();
        }
        table.metadata = sourceMetadata;
        previous = layer.formatLayerData({[table.id]: table}, previous, {});
      }
      const beforeUpdate = previous.tileSource;
      const revision = table.dataRevision;
      const updated = await updateTileDataset(layer, table, previous);
      previous = updated.layerData[0];
      t.equal(updated.layers[0], layer, 'same-ID dataset updates preserve the layer');
      t.equal(table.dataRevision, revision + 1, 'the update task advances the revision');
      t.notEqual(previous.tileSource, beforeUpdate, 'a new revision invalidates the source');
      t.equal(
        layer.formatLayerData(updated.datasets, previous, {currentTime: 200}).tileSource,
        previous.tileSource,
        'the new revision is cached across subsequent formats'
      );
      const oldSource = previous.tileSource;
      table.metadata = {
        ...sourceMetadata,
        tilesetMetadataUrl: 'https://example.com/new-metadata.json'
      };
      const metadataChanged = layer.formatLayerData({[table.id]: table}, previous, {});
      t.equal(
        metadataChanged.tileSource === oldSource,
        format !== RemoteTileFormat.MVT,
        'only MVT metadata URL defines a source'
      );
      table.metadata = {...sourceMetadata, tilesetDataUrl: 'https://example.com/replacement'};
      const changed = layer.formatLayerData({[table.id]: table}, metadataChanged, {});
      t.notEqual(changed.tileSource, metadataChanged.tileSource, 'source URL changes invalidate');
      table.metadata = {...sourceMetadata, tilesetDataUrl: undefined};
      t.equal(
        layer.formatLayerData({[table.id]: table}, changed, {}).tileSource,
        null,
        'missing URL clears the source'
      );
      table.metadata = sourceMetadata;
      t.notEqual(
        layer.formatLayerData({[table.id]: table}, {}, {}).tileSource,
        oldSource,
        'restored source gets fresh metadata after removal'
      );
      const restored = layer.formatLayerData({[table.id]: table}, {}, {});
      table.metadata = {
        ...sourceMetadata,
        remoteTileFormat:
          format === RemoteTileFormat.MVT ? RemoteTileFormat.PMTILES : RemoteTileFormat.MVT
      };
      t.notEqual(
        layer.formatLayerData({[table.id]: table}, restored, {}).tileSource,
        restored.tileSource,
        'format changes invalidate the source'
      );
      table.metadata = {};
      t.equal(
        layer.formatLayerData({[table.id]: table}, {}, {}).tileSource,
        null,
        'unsupported metadata clears the source'
      );
    }
  } finally {
    mvtMetadata.restore();
    pmMetadata.restore();
    mvtConstruct.restore();
    pmConstruct.restore();
  }
  t.end();
});

test('#VectorTileLayer -> optional metadata bounds without tile requests', t => {
  const layer = new VectorTileLayer({id: 'extent', dataId: 'tiles'});
  const getTileData = sinon.spy();
  const opts = {
    data: {
      tileSource: {getTileData},
      tilesetDataUrl: 'test/{z}/{x}/{y}',
      bounds: [170, -10, -170, 10],
      minZoom: 8,
      maxZoom: 14
    },
    mapState: {zoom: 1, latitude: 0, longitude: 0},
    animationConfig: {},
    gpuFilter: {filterRange: [], filterValueAccessor: () => () => () => []},
    layerCallbacks: {},
    visible: true,
    idx: 0,
    objectHovered: null
  };
  t.equal(layer.renderLayer(opts).length, 1, 'existing configs do not display a helper');
  layer.updateLayerVisConfig({showBounds: true});
  const outline = layer.renderLayer(opts)[1];
  t.ok(outline, 'helper appears even below archive minimum zoom');
  t.equal(outline.props.pickable, false, 'helper cannot interfere with feature picking');
  t.equal(outline.props.wrapLongitude, true, 'flat maps split dateline-crossing edges');
  t.deepEqual(
    outline.props.data[0].path,
    [
      [170, -10],
      [190, -10],
      [190, 10],
      [170, 10],
      [170, -10]
    ],
    'dateline bounds follow the short interval'
  );
  t.ok(
    outline.props.dataComparator(outline.props.data, layer.renderLayer(opts)[1].props.data),
    'pan/hover preserves path attributes'
  );
  t.equal(
    layer.renderLayer({...opts, visible: false})[1].props.visible,
    false,
    'split-panel visibility is preserved'
  );
  t.equal(
    layer.renderLayer({...opts, mapState: {...opts.mapState, zoom: 20}}).length,
    2,
    'helper remains available above maximum zoom'
  );
  t.equal(getTileData.callCount, 0, 'helper never probes tile contents');
  for (const bounds of [
    undefined,
    [],
    [NaN, 0, 10, 20],
    [0, 20, 10, 10],
    [0, -91, 10, 20],
    [181, 0, 10, 20],
    [10, 0, 10, 20]
  ]) {
    t.deepEqual(
      tileLayerBoundsLayer('invalid', {bounds}),
      [],
      'missing/invalid/degenerate extents have no outline'
    );
  }
  const world = tileLayerBoundsLayer('world', {bounds: [-180, -90, 180, 90]})[0].props.data[0].path;
  t.ok(
    world.some(([lng]) => lng === 0),
    'world extent includes intermediate longitudes instead of collapsing at the seam'
  );
  layer.updateLayerVisConfig({showBounds: false});
  t.equal(
    layer.renderLayer(opts).length,
    1,
    'helper can be disabled without altering tile rendering'
  );
  t.end();
});
