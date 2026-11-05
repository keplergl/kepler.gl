// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape-catch';
import sinon from 'sinon';
import {MVTSource} from '@loaders.gl/mvt';
import {PMTilesSource, PMTilesTileSource} from '@loaders.gl/pmtiles';
import {LayerManager, MapView, WebMercatorViewport, _GlobeView} from '@deck.gl/core';
import {device} from '@deck.gl/test-utils';
import {
  INITIAL_MAP_STATE,
  INITIAL_VIS_STATE,
  setLayerAnimationTimeUpdater
} from '@kepler.gl/reducers';
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
