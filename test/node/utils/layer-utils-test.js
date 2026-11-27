// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import sinon from 'sinon';
import Console from 'global/console';
import cloneDeep from 'es-toolkit/compat/cloneDeep';
import {processCsvData, processGeojson} from '@kepler.gl/processors';
import {
  createGeoArrowPointVector,
  getNeighbors,
  getGeojsonLayerMetaFromArrow,
  Layer,
  LayerClasses,
  KeplerGlLayers
} from '@kepler.gl/layers';
import {GEOARROW_EXTENSIONS, GEOARROW_METADATA_KEY, GEOJSON_FIELDS} from '@kepler.gl/constants';
import {
  findDefaultLayer,
  getLayerHoverProp,
  getLayerOrderFromLayers,
  computeDeckLayers,
  renderDeckGlLayer,
  INITIAL_MAP_STATE,
  INITIAL_VIS_STATE
} from '@kepler.gl/reducers';
import {StateWTripGeojson, StateWFiles} from 'test/helpers/mock-state';

const {PointLayer, ArcLayer, GeojsonLayer, LineLayer} = KeplerGlLayers;

import {wktCsv} from 'test/fixtures/test-csv-data';
import {cmpLayers} from 'test/helpers/comparison-utils';
import {getNextColorMakerValue} from 'test/helpers/layer-utils';
import {createNewDataEntryMock} from 'test/helpers/table-utils';
import tripGeojson, {timeStampDomain, tripBounds} from 'test/fixtures/trip-geojson';
import {geoJsonWithStyle} from 'test/fixtures/geojson';
import {KeplerTable, findPointFieldPairs} from '@kepler.gl/table';
import {
  getLayerAnimatedConfig,
  ArrowDataContainer,
  createDataContainer,
  findDefaultColorField,
  findDefaultColorFieldWithValues
} from '@kepler.gl/utils';
import * as arrow from 'apache-arrow';
// The standalone bundle has distinct constructors, like DuckDB's bundled Arrow.
import * as foreignArrow from 'apache-arrow/Arrow.es2015.min';
import {convertStructToFixedSizeList} from '../../../src/deckgl-arrow-layers/src/utils/utils';
import {GeoArrowScatterplotLayer} from '@kepler.gl/deckgl-arrow-layers';

const defaultColorLayerTypes = ['a5', 's2', 'geohash', 'hexagonId', 'point', 'icon'];

const propertyTrack = (id, startValue, endValue) => [
  {id, startTimeMs: 1000, endTimeMs: 3000, startValue, endValue, easing: 'linear'}
];

test('layerUtils -> layer property declarations and normalized updates retain compatibility', t => {
  const transitions = {radius: propertyTrack('grow', 5, 25)};
  const layer = new PointLayer({dataId: 'survey', propertyTransitions: transitions});
  t.deepEqual(layer.config.propertyTransitions, transitions, 'accepts property tracks');
  t.notEqual(layer.config.propertyTransitions.radius, transitions.radius, 'clones incoming tracks');
  transitions.radius[0].endValue = 90;
  t.equal(layer.config.propertyTransitions.radius[0].endValue, 25, 'detaches transition values');
  t.deepEqual(
    new Layer({}).animatableProps.map(prop => prop.name),
    ['opacity'],
    'base layers offer opacity'
  );
  t.ok(
    layer.animatableProps.some(prop => prop.name === 'radius'),
    'point radius is renderable'
  );
  layer.updateLayerConfig({sizeField: {name: 'size', fieldIdx: 0}});
  t.notOk(
    layer.animatableProps.some(prop => prop.name === 'radius'),
    'data-driven point size omits a no-op radius control'
  );
  const icon = new KeplerGlLayers.IconLayer({dataId: 'survey'});
  icon.updateLayerVisConfig({fixedRadius: true});
  t.notOk(
    icon.animatableProps.some(prop => prop.name === 'radius'),
    'fixed icon radius omits a no-op control'
  );
  for (const LayerClass of [KeplerGlLayers.GridLayer, KeplerGlLayers.HexagonLayer]) {
    const aggregation = new LayerClass({dataId: 'survey'});
    t.ok(
      aggregation.animatableProps.some(prop => prop.name === 'coverage'),
      'aggregation coverage is declared'
    );
    aggregation.updateLayerVisConfig({enable3d: false});
    t.notOk(
      aggregation.animatableProps.some(prop => prop.name === 'elevationScale'),
      'flat aggregation omits elevation scale'
    );
    aggregation.updateLayerVisConfig({enable3d: true});
    t.ok(
      aggregation.animatableProps.some(prop => prop.name === 'elevationScale'),
      '3D aggregation declares elevation scale'
    );
  }
  layer.updateLayerConfig({propertyTransitions: {radius: []}});
  t.deepEqual(layer.config.propertyTransitions, {radius: []}, 'retains explicit cleared tracks');
  layer.updateLayerConfig({propertyTransitions: {radius: propertyTrack('invalid', 0, Infinity)}});
  t.notOk(layer.config.propertyTransitions?.radius, 'invalid values do not become live tracks');
  layer.updateLayerConfig({propertyTransitions: undefined});
  t.notOk(Object.hasOwn(layer.config, 'propertyTransitions'), 'supports removing the property map');
  t.end();
});

test('layerUtils -> built-in layers expose usable scalar and color transitions', t => {
  const enabled = {
    filled: true,
    stroked: true,
    outline: true,
    enable3d: true,
    glowEnabled: true,
    pulseEnabled: true,
    targetArrowEnabled: true,
    surfaceEnabled: true,
    surfaceContours: true,
    colorByLevel: false,
    scenegraphEnabled: true,
    scenegraphColorEnabled: true,
    scenegraphUseTrailColor: false,
    flowLinesRenderingMode: 'curved',
    flowFadeEnabled: true
  };
  const expected = {
    point: ['radius', 'thickness', 'glowExtent', 'glowStrength', 'pulseSpeed', 'pulseExpansion'],
    arc: ['thickness', 'targetArrowSize'],
    line: ['thickness', 'targetArrowSize', 'elevationScale'],
    grid: ['coverage', 'elevationScale'],
    hexagon: ['coverage', 'elevationScale'],
    geojson: ['radius', 'thickness', 'elevationScale', 'strokeOpacity', 'elevationOffset'],
    cluster: [],
    donut: ['radius'],
    icon: ['radius'],
    heatmap: ['radius', 'intensity', 'threshold', 'surfaceHeight', 'surfaceContourStep'],
    contour: ['fillOpacity', 'thickness', 'elevationScale', 'color', 'contourColor'],
    voronoi: ['color', 'strokeColor', 'thickness'],
    hexagonId: ['color', 'strokeColor', 'thickness', 'strokeOpacity', 'coverage', 'elevationScale'],
    '3D': ['sizeScale', 'angleX', 'angleY', 'angleZ', 'scenegraphColor'],
    trip: [
      'color',
      'thickness',
      'trailLength',
      'sizeScale',
      'adjustRoll',
      'adjustPitch',
      'adjustYaw',
      'scenegraphColor'
    ],
    s2: ['color', 'strokeColor', 'thickness', 'elevationScale'],
    a5: ['color', 'strokeColor', 'thickness', 'elevationScale'],
    geohash: ['color', 'strokeColor', 'thickness', 'elevationScale'],
    flow: ['flowLineThicknessScale', 'flowLineCurviness', 'flowFadeAmount'],
    flowField: [
      'color',
      'strokeWidth',
      'trailLength',
      'elevationMultiplier',
      'sizeScale',
      'adjustRoll',
      'adjustPitch',
      'adjustYaw',
      'scenegraphColor'
    ],
    vectorTile: [
      'color',
      'strokeColor',
      'radius',
      'strokeWidth',
      'strokeOpacity',
      'elevationScale'
    ],
    rasterTile: [
      'gammaContrastFactor',
      'sigmoidalContrastFactor',
      'sigmoidalBiasFactor',
      'saturationValue'
    ],
    wms: [],
    tile3d: ['pointSize', 'color'],
    bitmap: ['elevationOffset'],
    zarr: []
  };
  t.deepEqual(
    Object.keys(expected).sort(),
    Object.keys(LayerClasses).sort(),
    'audits every built-in layer'
  );
  for (const [type, names] of Object.entries(expected)) {
    const layer = new LayerClasses[type]({dataId: 'survey', svgIcons: []});
    layer.updateLayerVisConfig(enabled);
    const definitions = layer.animatableProps;
    t.equal(
      new Set(definitions.map(prop => prop.name)).size,
      definitions.length,
      `${type} has unique controls`
    );
    for (const name of ['opacity', ...names]) {
      const prop = definitions.find(definition => definition.name === name);
      t.ok(prop, `${type} offers ${name}`);
      if (!prop) continue;
      if (name === 'opacity') continue;
      const isColor = prop.type === 'color';
      if (!isColor) {
        t.deepEqual(
          prop.range,
          layer.visConfigSettings[name].range,
          `${type}.${name} uses native bounds`
        );
        t.equal(prop.step, layer.visConfigSettings[name].step, `${type}.${name} uses native units`);
      }
      const [start, end] = isColor
        ? [
            [0, 20, 40],
            [200, 120, 80]
          ]
        : prop.range;
      const middle = isColor ? [100, 70, 60] : (start + end) / 2;
      layer.updateLayerConfig({
        propertyTransitions: {[name]: propertyTrack('transition', start, end)}
      });
      const authored = cloneDeep(layer.config);
      const read = time => {
        const frame = getLayerAnimatedConfig(layer, time);
        return name === 'color' ? frame.color : frame.visConfig?.[name];
      };
      t.deepEqual(read(0), start, `${type}.${name} starts at its first endpoint`);
      t.deepEqual(read(2000), middle, `${type}.${name} interpolates`);
      t.deepEqual(read(5000), end, `${type}.${name} holds its final endpoint`);
      t.equal(read(null), undefined, `${type}.${name} stops overriding authored values`);
      t.deepEqual(layer.config, authored, `${type}.${name} preserves saved settings`);
      layer.config.propertyTransitions[name][0].endValue = isColor ? [256, 0, 0] : end + 1;
      t.equal(read(2000), undefined, `${type}.${name} ignores invalid endpoints`);
    }
  }
  t.end();
});

test('layerUtils -> new transitions exclude disabled and field-controlled channels', t => {
  const cases = [
    [
      'point',
      {glowEnabled: false, pulseEnabled: false},
      {},
      ['glowExtent', 'glowStrength', 'pulseSpeed', 'pulseExpansion']
    ],
    ['point', {pulseEnabled: true, pulseTrigger: 'event'}, {}, ['pulseSpeed']],
    ['arc', {targetArrowEnabled: false}, {}, ['targetArrowSize']],
    [
      'contour',
      {filled: false, stroked: false, enable3d: false},
      {},
      ['color', 'contourColor', 'fillOpacity', 'thickness', 'elevationScale']
    ],
    ['contour', {filled: true, colorByLevel: true}, {}, ['color']],
    [
      'heatmap',
      {surfaceEnabled: false, surfaceContours: true},
      {},
      ['surfaceHeight', 'surfaceContourStep']
    ],
    ['heatmap', {surfaceEnabled: true, surfaceContours: false}, {}, ['surfaceContourStep']],
    [
      'hexagonId',
      {outline: false, enable3d: false},
      {coverageField: {}},
      ['strokeColor', 'strokeOpacity', 'thickness', 'elevationScale', 'coverage']
    ],
    ...['s2', 'a5', 'geohash', 'voronoi'].map(type => [
      type,
      {filled: false, stroked: false, enable3d: false},
      {},
      ['color', 'strokeColor', 'thickness', 'elevationScale']
    ]),
    ...['s2', 'a5', 'geohash', 'hexagonId', 'vectorTile'].map(type => [
      type,
      {filled: true, stroked: true, outline: true},
      {colorField: {}, strokeColorField: {}},
      ['color', 'strokeColor']
    ]),
    ['geojson', {stroked: false}, {elevationOffsetField: {}}, ['strokeOpacity', 'elevationOffset']],
    [
      'flow',
      {flowLinesRenderingMode: 'straight', flowFadeEnabled: false},
      {},
      ['flowLineCurviness', 'flowFadeAmount']
    ],
    ['3D', {scenegraphColorEnabled: false}, {}, ['scenegraphColor']],
    ...['trip', 'flowField'].map(type => [
      type,
      {scenegraphEnabled: false},
      {},
      ['sizeScale', 'adjustRoll', 'adjustPitch', 'adjustYaw', 'scenegraphColor']
    ]),
    ...['trip', 'flowField'].map(type => [
      type,
      {scenegraphEnabled: true, scenegraphColorEnabled: true, scenegraphUseTrailColor: true},
      {},
      ['scenegraphColor']
    ]),
    ['trip', {}, {colorField: {}}, ['color']],
    [
      'flowField',
      {showTrails: false, scenegraphEnabled: false},
      {},
      ['color', 'strokeWidth', 'trailLength']
    ],
    ['flowField', {colorBySpeed: true}, {}, ['color']],
    ['vectorTile', {stroked: true}, {sizeField: {}}, ['strokeWidth']],
    [
      'rasterTile',
      {nonLinearRescaling: false},
      {},
      ['gammaContrastFactor', 'sigmoidalContrastFactor', 'sigmoidalBiasFactor']
    ]
  ];
  for (const [type, visConfig, config, excluded] of cases) {
    const layer = new LayerClasses[type]({dataId: 'survey'});
    layer.updateLayerVisConfig(visConfig);
    layer.updateLayerConfig(config);
    const names = layer.animatableProps.map(prop => prop.name);
    t.deepEqual(
      excluded.filter(name => names.includes(name)),
      [],
      `${type} excludes inactive ${excluded.join(', ')}`
    );
    layer.updateLayerConfig({
      propertyTransitions: {[excluded[0]]: propertyTrack('inactive', 0, 1)}
    });
    t.deepEqual(
      getLayerAnimatedConfig(layer, 2000),
      {},
      `${type} keeps unsupported saved tracks inactive`
    );
    t.ok(layer.config.propertyTransitions[excluded[0]], `${type} preserves inactive saved tracks`);
  }
  t.end();
});

test('layerUtils -> numeric frame accessors refresh without changing field or feature values', t => {
  for (const type of ['geojson', 'vectorTile']) {
    const layer = new LayerClasses[type]({id: type, dataId: 'survey'});
    const property = type === 'geojson' ? 'elevationOffset' : 'strokeWidth';
    const accessor = type === 'geojson' ? 'getElevationOffset' : 'getLineWidth';
    layer.updateLayerVisConfig({[property]: 3, stroked: true});
    layer.updateLayerConfig({propertyTransitions: {[property]: propertyTrack('numeric', 0, 10)}});
    const data = {data: [], ...layer.getAttributeAccessors({dataContainer: {}})};
    const fieldAccessor = () => 42;
    data.getFillColor = fieldAccessor;
    layer.config.colorField = {name: 'value', fieldIdx: 0};
    const savedConfig = layer.config;
    const savedAccessor = data[accessor];
    // Inspect the render boundary with real built-in visual channels and cached accessors.
    layer.renderLayer = options => options.data;
    const render = time =>
      renderDeckGlLayer({layer, datasets: {}, data, mapState: {}, animationTimeMs: time}, {});
    const read = (frame, feature = {properties: {}}) =>
      typeof frame[accessor] === 'function' ? frame[accessor](feature) : frame[accessor];
    const middle = render(2000);
    t.equal(read(render(1000)), 0, `${type} preserves a zero starting value`);
    t.equal(read(middle), 5, `${type} refreshes its cached numeric accessor`);
    t.equal(read(render(3000)), 10, `${type} reaches the endpoint`);
    t.equal(read(middle), 5, `${type} retains the frame value in deferred accessors`);
    t.equal(middle.getFillColor, fieldAccessor, `${type} preserves a data-driven accessor`);
    t.equal(middle.data, data.data, `${type} retains geometry identity`);
    t.equal(read(render(null)), 3, `${type} restores the authored value`);
    if (type === 'geojson') {
      t.equal(
        read(middle, {properties: {elevationOffset: 17}}),
        17,
        'embedded elevation offsets keep precedence'
      );
    }
    t.equal(layer.config, savedConfig, `${type} restores the config object`);
    t.equal(data[accessor], savedAccessor, `${type} leaves the cached accessor untouched`);
  }
  t.end();
});

test('layerUtils -> added scalar transitions reach built-in deck renderers', t => {
  const cases = [
    ['point', 'glowStrength', 0.2, 0.8, {glowEnabled: true}, deck => deck.props.glowStrength],
    ['heatmap', 'surfaceHeight', 0, 1000, {surfaceEnabled: true}, deck => deck.props.surfaceHeight],
    ['hexagonId', 'coverage', 0.2, 1, {}, deck => deck.props.coverage],
    ...['s2', 'a5', 'geohash'].map(type => [
      type,
      'elevationScale',
      1,
      3,
      {enable3d: true, enableElevationZoomFactor: false},
      deck => deck.props.elevationScale
    ]),
    ['voronoi', 'thickness', 1, 3, {stroked: true}, deck => deck.props.getLineWidth],
    ['3D', 'angleX', 0, 90, {}, deck => deck.props.getOrientation[0]],
    ['tile3d', 'pointSize', 1, 5, {}, deck => deck.props.pointSize],
    ['bitmap', 'elevationOffset', 0, 100, {showBounds: false}, deck => deck.props.modelMatrix[14]],
    [
      'vectorTile',
      'strokeWidth',
      0,
      10,
      {stroked: true, showBounds: false},
      deck => deck.props.getLineWidth
    ],
    ['flow', 'flowLineThicknessScale', 1, 3, {}, deck => deck.props.flowLineThicknessScale],
    ['trip', 'trailLength', 10, 30, {}, deck => deck.props.trailLength / 1000],
    ['donut', 'radius', 10, 30, {}, deck => deck.props.getRadius()]
  ];
  for (const [type, name, start, end, config, read] of cases) {
    const layer = new LayerClasses[type]({id: `render-${type}`, dataId: 'survey'});
    layer.updateLayerVisConfig({...config, [name]: start});
    layer.updateLayerConfig({propertyTransitions: {[name]: propertyTrack('render', start, end)}});
    const rows = [];
    const data = {
      data: rows,
      textLabels: [],
      textLabelData: [],
      getPosition: d => d.position,
      getFilterValue: () => [0, 0, 0, 0],
      ...layer.getAttributeAccessors({dataContainer: {}}),
      imageUrl: 'https://example.com/image.png',
      bounds: [0, 0, 1, 1],
      tile3dUrl: 'https://example.com/tileset.json',
      tileSource: {getTileData: () => null},
      layerData: {locations: [], flows: []}
    };
    const onLayerError = sinon.spy();
    const render = time =>
      renderDeckGlLayer(
        {
          layer,
          layerIndex: 0,
          data,
          datasets: {
            survey: {
              gpuFilter: {
                filterRange: [],
                filterValueUpdateTriggers: {},
                filterValueAccessor: () => () => () => [0, 0, 0, 0]
              }
            }
          },
          animationTimeMs: time,
          mapState: {...INITIAL_MAP_STATE, zoom: 10, width: 800, height: 600},
          animationConfig: {
            ...INITIAL_VIS_STATE.animationConfig,
            domain: [0, 1000],
            currentTime: 500
          },
          interactionConfig: INITIAL_VIS_STATE.interactionConfig
        },
        {onLayerError, onSetLayerDomain: () => {}, onLayerHover: () => {}}
      )[0];
    const authored = layer.config;
    const original = render(null);
    const middle = render(2000);
    const final = render(3000);
    const restored = render(null);
    t.notOk(onLayerError.called, `${type}.${name} renders without errors`);
    if (original && middle && final && restored) {
      t.notEqual(read(middle), read(original), `${type}.${name} changes the rendered frame`);
      t.ok(
        Math.abs(read(middle) - (read(original) + read(final)) / 2) < 1e-8,
        `${type}.${name} renders the midpoint`
      );
      t.equal(read(restored), read(original), `${type}.${name} restores the rendered setting`);
      t.equal(layer.config, authored, `${type}.${name} restores the config object`);
    } else {
      t.fail(`${type}.${name} should produce a deck layer`);
    }
  }
  t.end();
});

test('layerUtils -> raster transitions follow the source and rescaling mode', t => {
  const layer = new KeplerGlLayers.RasterTileLayer({dataId: 'raster'});
  const names = () => layer.animatableProps.map(prop => prop.name);
  t.ok(names().includes('gammaContrastFactor'), 'continuous RGB imagery supports gamma');
  layer.updateLayerMeta({
    type: 'raster-tile',
    metadata: {pmtilesType: 'raster', bounds: [0, 0, 1, 1]}
  });
  t.deepEqual(names(), ['opacity'], 'precolored PMTiles do not offer raster shader adjustments');
  layer.updateLayerMeta({
    type: 'raster-tile',
    metadata: {type: 'Feature', bbox: [0, 0, 1, 1], properties: {}, assets: {}}
  });
  t.ok(
    names().includes('gammaContrastFactor'),
    'switching back to STAC restores color adjustments'
  );
  layer.updateLayerVisConfig({colorRange: {...layer.config.visConfig.colorRange, colorMap: []}});
  t.deepEqual(names(), ['opacity'], 'categorical imagery does not offer inactive rescaling');
  t.end();
});

test('layerUtils -> point labels follow the rendered radius cap at high zoom', t => {
  const layer = new PointLayer({id: 'label-radius', dataId: 'survey', isVisible: true});
  layer.updateLayerConfig({
    textLabel: [{...layer.config.textLabel[0], anchor: 'start', alignment: 'center'}]
  });
  layer.updateLayerVisConfig({radius: 50});
  const rows = [
    {position: [0, 0], radius: 1},
    {position: [0, 0], radius: 50}
  ];
  const render = (zoom, getRadius) =>
    renderDeckGlLayer(
      {
        layer,
        data: {
          data: rows,
          textLabels: [{getText: () => 'Point'}],
          getPosition: d => d.position,
          getRadius
        },
        datasets: {survey: {gpuFilter: {filterRange: [], filterValueUpdateTriggers: {}}}},
        mapState: {...INITIAL_MAP_STATE, latitude: 0, longitude: 0, zoom},
        interactionConfig: INITIAL_VIS_STATE.interactionConfig
      },
      {}
    );

  const [marker, label] = render(22, 1);
  const cap = marker.props.radiusMaxPixels;
  t.equal(cap, 500, 'the marker uses the existing 500 px cap');
  t.deepEqual(
    label.props.getPixelOffset,
    [cap + 20, 0],
    'constant radius reaches the cap with padding'
  );

  layer.updateLayerConfig({sizeField: {name: 'radius', fieldIdx: 0}});
  const getRadius = row => row.radius;
  const [, sizedLabel] = render(22, getRadius);
  t.ok(
    sizedLabel.props.getPixelOffset(rows[0])[0] < cap + 20,
    'a small radius stays below the cap'
  );
  t.deepEqual(
    sizedLabel.props.getPixelOffset(rows[1]),
    [cap + 20, 0],
    'a large field radius is capped'
  );
  const [, lowZoomLabel] = render(14, getRadius);
  t.ok(
    lowZoomLabel.props.getPixelOffset(rows[1])[0] < cap + 20,
    'normal zoom does not reach the cap'
  );

  layer.updateLayerVisConfig({fixedRadius: true});
  const [, uncappedLabel] = render(22, getRadius);
  t.ok(
    uncappedLabel.props.getPixelOffset(rows[1])[0] > cap + 20,
    'fixed-radius markers and labels stay uncapped'
  );
  t.end();
});

test('layerUtils -> point and line frame properties leave saved settings and deck identity intact', t => {
  class PrivatePointLayer extends PointLayer {
    #renderCount = 0;

    renderLayer(opts) {
      this.#renderCount++;
      return super.renderLayer(opts);
    }

    get renderCount() {
      return this.#renderCount;
    }
  }
  const mapState = {...INITIAL_MAP_STATE, zoom: 10};
  const data = {
    data: [{position: [10, 20], sourcePosition: [10, 20, 0], targetPosition: [11, 21, 0]}],
    textLabels: [],
    getPosition: d => d.position,
    getSourcePosition: d => d.sourcePosition,
    getTargetPosition: d => d.targetPosition,
    getRadius: 1,
    getWidth: 1,
    getFillColor: [10, 20, 30],
    getLineColor: [10, 20, 30],
    getColor: [10, 20, 30],
    getTargetColor: [10, 20, 30]
  };
  for (const LayerClass of [PointLayer, LineLayer, PrivatePointLayer]) {
    const layer = new LayerClass({id: 'animated', dataId: 'survey'});
    layer.updateLayerVisConfig({
      radius: 10,
      thickness: 2,
      outline: true,
      filled: true,
      opacity: 0.8
    });
    layer.updateLayerConfig({
      propertyTransitions: {
        radius: propertyTrack('grow', 5, 25),
        thickness: propertyTrack('stroke', 2, 8),
        opacity: propertyTrack('fade', 0, 1),
        ...(layer.type === 'point'
          ? {filled: [{...propertyTrack('fill-off', 1, 0)[0], startTimeMs: 4000, endTimeMs: 4000}]}
          : {}),
        unsupported: propertyTrack('unknown', 100, 200)
      }
    });
    const savedConfig = layer.config;
    const savedVisConfig = cloneDeep(layer.config.visConfig);
    const props = {
      layer,
      layerIndex: 0,
      datasets: {survey: {gpuFilter: {filterRange: [], filterValueUpdateTriggers: {}}}},
      data,
      mapState,
      interactionConfig: {
        ...INITIAL_VIS_STATE.interactionConfig,
        zoomOpacity: {
          enabled: true,
          config: {
            controllers: [
              {id: 'fade', layerIds: [layer.id], stops: {appear: 9, full: 11, fade: 15, gone: 17}}
            ]
          }
        }
      },
      animationConfig: INITIAL_VIS_STATE.animationConfig
    };
    const onLayerError = sinon.spy();
    const render = time => renderDeckGlLayer({...props, animationTimeMs: time}, {onLayerError})[0];
    const original = render(undefined);
    const animated = render(2000);
    t.notOk(onLayerError.called, `${layer.type} renders the animation without errors`);
    t.equal(animated.id, original.id, `${layer.type} keeps the deck layer identity`);
    t.equal(
      animated.props.opacity,
      0.2,
      `${layer.type} combines saved opacity, property opacity and zoom once`
    );
    if (layer.type === 'point') {
      if (LayerClass === PointLayer) {
        t.equal(render(3999).props.filled, true, 'point fill stays on before the switch');
        const switched = render(4000);
        t.equal(switched.props.filled, false, 'point fill switches off at the exact time');
        t.equal(switched.props.stroked, true, 'point outline remains on');
        t.equal(original.props.filled, true, 'static rendering retains the authored fill');
      }
      t.equal(animated.props.lineWidthScale, 5, 'point stroke interpolates');
      t.equal(
        animated.props.radiusScale,
        original.props.radiusScale * 1.5,
        'point radius interpolates without rebuilding data'
      );
      t.equal(
        render(5000).props.radiusScale,
        original.props.radiusScale * 2.5,
        'point radius holds its final value'
      );
      const hovered = renderDeckGlLayer(
        {
          ...props,
          animationTimeMs: 2000,
          hoverInfo: {picked: true, layer: {props: {id: layer.id}}, object: data.data[0]}
        },
        {onLayerError}
      );
      t.equal(hovered.length, 2, 'preserves the point hover overlay');
      t.equal(
        hovered[1].props.radiusScale,
        animated.props.radiusScale,
        'hover radius follows the same frame'
      );
    } else {
      t.equal(
        animated.props.widthScale,
        original.props.widthScale * 2.5,
        'line stroke interpolates'
      );
      t.equal(
        render(5000).props.widthScale,
        original.props.widthScale * 4,
        'line stroke holds its final value'
      );
    }
    const restored = render(null);
    t.equal(
      restored.props.opacity,
      original.props.opacity,
      'stopping restores saved opacity with zoom'
    );
    t.equal(
      restored.props.radiusScale ?? restored.props.widthScale,
      original.props.radiusScale ?? original.props.widthScale,
      'stopping restores the saved numeric setting'
    );
    t.equal(layer.config, savedConfig, 'does not replace authored config');
    t.deepEqual(layer.config.visConfig, savedVisConfig, 'does not mutate authored visual settings');
    if (layer instanceof PrivatePointLayer) {
      t.equal(
        layer.renderCount,
        5,
        'custom subclasses retain private state while delegating rendering'
      );
    }
  }
  t.end();
});

test('layerUtils -> custom declarations preserve caches and callbacks without leaking frame config on errors', t => {
  class CustomLayer extends Layer {
    #renderCount = 0;

    get renderCount() {
      return this.#renderCount;
    }

    get animatableProps() {
      return [
        ...super.animatableProps,
        {name: 'amplitude', label: 'Amplitude', range: [0, 100], step: 1}
      ];
    }
    renderLayer({layerCallbacks}) {
      const config = this.config;
      this.#renderCount++;
      this.onRedrawNeeded = layerCallbacks.onRedrawNeeded;
      const amplitude = config.visConfig.amplitude;
      const unsupported = config.visConfig.unsupported;
      if (this.fail) {
        config.visConfig.amplitude = 999;
        config.label = 'temporary';
        this.config = {...config, label: 'replacement'};
        throw new Error('Custom renderer failure');
      }
      return {
        id: this.id,
        receiver: this,
        config,
        amplitude,
        unsupported,
        getAmplitude: () => {
          // Deferred closures retain both the real private-field receiver and frame snapshot.
          if (!this.#renderCount) throw new Error('Renderer has not run');
          return config.visConfig.amplitude;
        }
      };
    }
  }
  const layer = new CustomLayer({id: 'custom', dataId: 'survey'});
  layer.updateLayerVisConfig({amplitude: 4, unsupported: 7});
  layer.updateLayerConfig({
    propertyTransitions: {
      amplitude: propertyTrack('oscillate', 10, 30),
      unsupported: propertyTrack('ignored', 100, 200)
    }
  });
  const config = layer.config;
  const saved = cloneDeep(config);
  const onLayerError = sinon.spy(() => {
    t.equal(layer.config, config, 'authored config is restored before reporting errors');
  });
  const onRedrawNeeded = sinon.spy();
  const render = time =>
    renderDeckGlLayer(
      {layer, datasets: {}, mapState: {}, animationTimeMs: time},
      {onLayerError, onRedrawNeeded}
    );
  const midpoint = render(2000);
  t.notOk(onLayerError.called, 'private fields render without a proxy-brand error');
  t.equal(midpoint.receiver, layer, 'renderer keeps the original layer receiver');
  t.notEqual(midpoint.config, config, 'renderer reads a temporary config on the real instance');
  t.equal(layer.config, config, 'authored config is restored before returning the frame');
  t.deepEqual(layer.config, saved, 'successful rendering preserves authored settings');
  t.equal(midpoint.amplitude, 20, 'custom declaration enables its numeric property');
  t.equal(midpoint.unsupported, 7, 'undeclared numeric property is ignored');
  t.equal(render(3000).amplitude, 30, 'later frame uses the same custom property');
  t.equal(midpoint.getAmplitude(), 20, 'deferred accessors retain their own frame values');
  t.equal(layer.renderCount, 2, 'render cache writes persist on the original layer');
  layer.onRedrawNeeded();
  t.ok(onRedrawNeeded.calledOnce, 'redraw callback remains available on the original layer');
  const log = sinon.stub(Console, 'error');
  try {
    layer.fail = true;
    t.deepEqual(render(2000), [], 'contains a renderer exception');
    t.ok(onLayerError.calledOnce, 'reports the renderer exception');
    t.equal(layer.config, config, 'a throwing renderer cannot replace saved config');
    t.deepEqual(layer.config, saved, 'a throwing renderer cannot leak frame visual settings');
    layer.fail = false;
    t.equal(render(null).amplitude, 4, 'static rendering recovers authored settings');
    t.equal(midpoint.getAmplitude(), 20, 'earlier accessors survive failures and static rendering');
  } finally {
    log.restore();
  }
  t.end();
});

test('layerUtils -> nested renders restore the enclosing config before the authored config', t => {
  const layer = new Layer({id: 'nested', dataId: 'survey'});
  Object.defineProperty(layer, 'animatableProps', {
    value: [{name: 'radius', label: 'Radius', range: [0, 100], step: 1}]
  });
  layer.updateLayerVisConfig({radius: 4});
  layer.updateLayerConfig({propertyTransitions: {radius: propertyTrack('grow', 10, 30)}});
  layer.renderLayer = function ({layerCallbacks}) {
    const config = this.config;
    const nested = layerCallbacks.renderNested?.();
    return {config, nested, afterNested: this.config, getRadius: () => config.visConfig.radius};
  };
  const authored = layer.config;
  const render = (time, callbacks = {}) =>
    renderDeckGlLayer({layer, datasets: {}, mapState: {}, animationTimeMs: time}, callbacks);
  const outer = render(2000, {renderNested: () => render(3000)});
  t.equal(outer.getRadius(), 20, 'outer render captures its own value');
  t.equal(outer.nested.getRadius(), 30, 'nested render captures a different frame');
  t.equal(outer.afterNested, outer.config, 'nested render restores the enclosing config');
  t.equal(layer.config, authored, 'outer render restores the authored config');
  t.equal(render(null).config, authored, 'static rendering uses the original config object');
  t.equal(outer.getRadius(), 20, 'deferred outer accessor retains its value after restoration');
  t.equal(outer.nested.getRadius(), 30, 'deferred nested accessor retains its own value');
  t.end();
});

test('layerUtils -> opacity tracks respect a custom layer whitelist and declared range', t => {
  const deckLayer = props => ({props, clone: next => deckLayer({...props, ...next})});
  const layer = {
    id: 'custom-opacity',
    animatableProps: [],
    config: {
      visConfig: {opacity: 0.8},
      propertyTransitions: {opacity: propertyTrack('fade', 0, 1)}
    },
    renderLayer() {
      return deckLayer({opacity: this.config.visConfig.opacity});
    }
  };
  const render = () =>
    renderDeckGlLayer({layer, datasets: {}, mapState: {}, animationTimeMs: 2000}, {});
  t.equal(render().props.opacity, 0.8, 'an undeclared opacity track stays static');
  layer.animatableProps = [{name: 'opacity', label: 'Opacity', range: [0.25, 0.75], step: 0.01}];
  t.equal(render().props.opacity, 0.8, 'out-of-range opacity endpoints stay static');
  layer.config.propertyTransitions.opacity = propertyTrack('fade', 0.25, 0.75);
  t.equal(render().props.opacity, 0.4, 'a declared valid opacity track multiplies saved opacity');
  t.end();
});

test('layerUtils -> static layer colors refresh cached accessors and restore authored colors', t => {
  const start = [0, 20, 40];
  const end = [200, 120, 80];
  const middle = [100, 70, 60];
  const strokeStart = [40, 60, 80];
  const strokeEnd = [140, 160, 180];
  const strokeMiddle = [90, 110, 130];
  const cases = [
    {
      LayerClass: PointLayer,
      accessor: 'getFillColor',
      secondary: 'getLineColor',
      property: 'strokeColor'
    },
    {LayerClass: KeplerGlLayers.IconLayer, accessor: 'getFillColor'},
    {
      LayerClass: ArcLayer,
      accessor: 'getSourceColor',
      secondary: 'getTargetColor',
      property: 'targetColor'
    },
    {
      LayerClass: LineLayer,
      accessor: 'getColor',
      secondary: 'getTargetColor',
      property: 'targetColor'
    },
    {
      LayerClass: GeojsonLayer,
      accessor: 'getFillColor',
      secondary: 'getLineColor',
      property: 'strokeColor'
    }
  ];
  for (const {LayerClass, accessor, secondary, property} of cases) {
    const layer = new LayerClass({id: 'colors', dataId: 'survey', color: [10, 20, 30]});
    layer.updateLayerVisConfig({
      filled: true,
      outline: true,
      stroked: true,
      targetArrowEnabled: true,
      opacity: 0.8,
      glowEnabled: layer.type === 'point'
    });
    layer.updateLayerConfig({
      propertyTransitions: {
        color: propertyTrack('fill', start, end),
        ...(property ? {[property]: propertyTrack('edge', strokeStart, strokeEnd)} : {}),
        opacity: propertyTrack('opacity', 0, 1)
      }
    });
    const feature = {
      type: 'Feature',
      geometry: {type: 'Point', coordinates: [10, 20]},
      properties: {index: 0}
    };
    const row = {
      index: 0,
      position: [10, 20, 0, 11, 21, 0],
      sourcePosition: [10, 20, 0],
      targetPosition: [11, 21, 0]
    };
    const rows = layer.type === 'geojson' ? [feature] : [row];
    const data = {
      data: rows,
      textLabels: [],
      textLabelData: [],
      getPosition: d => d.position,
      getSourcePosition: d => d.sourcePosition,
      getTargetPosition: d => d.targetPosition,
      getFilterValue: () => [0, 0, 0, 0],
      ...layer.getAttributeAccessors({dataContainer: {}})
    };
    const authoredConfig = layer.config;
    const snapshot = cloneDeep(layer.config);
    const authoredAccessor = data[accessor];
    const onLayerError = sinon.spy();
    const render = (time, globe = false) =>
      renderDeckGlLayer(
        {
          layer,
          layerIndex: 0,
          datasets: {survey: {gpuFilter: {filterRange: [], filterValueUpdateTriggers: {}}}},
          data,
          animationTimeMs: time,
          mapState: {
            ...INITIAL_MAP_STATE,
            width: 800,
            height: 600,
            zoom: 2,
            globe: {enabled: globe}
          },
          interactionConfig: INITIAL_VIS_STATE.interactionConfig,
          animationConfig: INITIAL_VIS_STATE.animationConfig
        },
        {onLayerError}
      );
    const read = (deck, name, object = feature) =>
      typeof deck.props[name] === 'function' ? deck.props[name](object) : deck.props[name];
    const animatedLayers = render(2000);
    t.notOk(onLayerError.called, `${layer.type} colors render without errors`);
    const animated = animatedLayers.find(deck => deck.id === layer.id) || animatedLayers[0];
    t.deepEqual(read(animated, accessor), middle, `${layer.type} interpolates base color`);
    if (secondary)
      t.deepEqual(
        read(animated, secondary),
        strokeMiddle,
        `${layer.type} interpolates secondary color`
      );
    t.equal(animated.props.opacity, 0.4, `${layer.type} keeps color separate from opacity`);
    t.equal(animated.props.data, rows, `${layer.type} preserves geometry data identity`);
    t.deepEqual(read(render(5000)[0], accessor), end, `${layer.type} holds the final color`);
    t.deepEqual(
      read(render(null)[0], accessor),
      [10, 20, 30],
      `${layer.type} restores authored color`
    );
    if (layer.type === 'point') {
      t.deepEqual(
        read(animatedLayers[0], 'getFillColor'),
        middle,
        'point core and glow share the animated fill'
      );
    }
    if (layer.type === 'arc' || layer.type === 'line') {
      const arrowhead = animatedLayers.find(deck => deck.id.startsWith(`${layer.id}-arrow-head-`));
      t.ok(arrowhead, `${layer.type} retains target arrows`);
      t.deepEqual(
        read(arrowhead, 'getFillColor', row),
        strokeMiddle,
        `${layer.type} arrowhead shares target color`
      );
      const globeLayer = render(2000, true)[0];
      t.deepEqual(
        read(globeLayer, 'getSourceColor'),
        middle,
        `${layer.type} globe source color updates`
      );
      t.deepEqual(
        read(globeLayer, 'getTargetColor'),
        strokeMiddle,
        `${layer.type} globe target color updates`
      );
    }
    if (layer.type === 'geojson') {
      const embedded = {...feature, properties: {fillColor: [9, 8, 7], lineColor: [6, 5, 4]}};
      t.deepEqual(
        read(animated, accessor, embedded),
        [9, 8, 7],
        'GeoJSON embedded fill colors retain precedence'
      );
      t.deepEqual(
        read(animated, secondary, embedded),
        [6, 5, 4],
        'GeoJSON embedded stroke colors retain precedence'
      );
    }
    t.equal(data[accessor], authoredAccessor, `${layer.type} keeps the authored cached accessor`);
    t.equal(layer.config, authoredConfig, `${layer.type} never swaps the saved config`);
    t.deepEqual(
      layer.config,
      snapshot,
      `${layer.type} never writes animated colors into saved config`
    );
  }
  t.end();
});

test('layerUtils -> fixed color metadata omits data-driven and inactive channels', t => {
  for (const LayerClass of [
    PointLayer,
    KeplerGlLayers.IconLayer,
    ArcLayer,
    LineLayer,
    GeojsonLayer
  ]) {
    const layer = new LayerClass({dataId: 'survey'});
    layer.updateLayerVisConfig({
      filled: true,
      outline: true,
      stroked: true,
      targetArrowEnabled: true
    });
    t.ok(
      layer.animatableProps.some(prop => prop.name === 'color' && prop.type === 'color'),
      `${layer.type} exposes fixed color`
    );
    layer.updateLayerConfig({
      colorField: {name: 'value', fieldIdx: 0},
      strokeColorField: {name: 'value', fieldIdx: 0}
    });
    t.notOk(
      layer.animatableProps.some(prop => prop.type === 'color'),
      `${layer.type} omits field-based color channels`
    );
  }
  const line = new LineLayer({dataId: 'survey'});
  t.notOk(
    line.animatableProps.some(prop => prop.name === 'targetColor'),
    'line target color requires target arrows for consistent globe rendering'
  );
  const point = new PointLayer({dataId: 'survey'});
  point.updateLayerVisConfig({filled: false, outline: false});
  t.notOk(
    point.animatableProps.some(prop => prop.type === 'color'),
    'inactive point fill and stroke omit color controls'
  );
  const geojson = new GeojsonLayer({dataId: 'survey'});
  geojson.updateLayerVisConfig({filled: false, stroked: false});
  t.notOk(
    geojson.animatableProps.some(prop => prop.type === 'color'),
    'inactive GeoJSON fill and stroke omit color controls'
  );
  t.end();
});

test('layerUtils -> color frames preserve field accessors while animating a separate static channel', t => {
  const layer = new PointLayer({id: 'field-colors', dataId: 'survey'});
  layer.updateLayerVisConfig({outline: true});
  layer.updateLayerConfig({
    colorField: {name: 'value', fieldIdx: 0},
    propertyTransitions: {
      color: propertyTrack('ignored', [0, 0, 0], [255, 255, 255]),
      strokeColor: propertyTrack('stroke', [0, 20, 40], [100, 120, 140])
    }
  });
  const fieldColor = () => [7, 8, 9];
  const data = {data: [], textLabels: [], getFillColor: fieldColor, getLineColor: [1, 2, 3]};
  const [frame] = renderDeckGlLayer(
    {
      layer,
      data,
      datasets: {survey: {gpuFilter: {filterValueUpdateTriggers: {}}}},
      mapState: INITIAL_MAP_STATE,
      interactionConfig: INITIAL_VIS_STATE.interactionConfig,
      animationTimeMs: 2000
    },
    {}
  );
  t.equal(frame.props.getFillColor, fieldColor, 'keeps the original data-driven accessor');
  t.deepEqual(frame.props.getLineColor, [50, 70, 90], 'updates the independent fixed stroke');
  t.deepEqual(data.getLineColor, [1, 2, 3], 'keeps the authored cached stroke');
  t.end();
});

test('layerUtils -> custom declared colors render without visual channels or data mutation', t => {
  const data = {data: []};
  const layer = {
    id: 'custom-color',
    config: {
      color: [1, 2, 3],
      visConfig: {},
      propertyTransitions: {color: propertyTrack('color', [0, 10, 20], [100, 110, 120])}
    },
    animatableProps: [{name: 'color', label: 'Color', type: 'color'}],
    renderLayer({data: frameData}) {
      return {color: this.config.color, data: frameData};
    }
  };
  const frame = renderDeckGlLayer(
    {layer, data, datasets: {}, mapState: {}, animationTimeMs: 2000},
    {}
  );
  t.deepEqual(frame.color, [50, 60, 70], 'supports a custom base color declaration');
  t.equal(frame.data, data, 'does not replace custom data when no accessors need refresh');
  t.deepEqual(layer.config.color, [1, 2, 3], 'preserves custom authored color');
  t.end();
});

test('layerUtils -> Arrow colors remain constant accessors without replacing geometry buffers', t => {
  const vector = arrow.vectorFromArray(
    [[10, 20, 0]],
    new arrow.FixedSizeList(3, new arrow.Field('xyz', new arrow.Float64()))
  );
  const target = arrow.vectorFromArray([[11, 21, 0]], vector.type);
  const table = new arrow.Table({geometry: vector, target});
  const metadata = new Map([[GEOARROW_METADATA_KEY, GEOARROW_EXTENSIONS.POINT]]);
  const geoField = {name: 'geometry', type: 'geoarrow', fieldIdx: 0, metadata};
  const dataContainer = new ArrowDataContainer({cols: [vector], fields: [geoField]});
  const binary = getGeojsonLayerMetaFromArrow({
    dataContainer,
    geoColumn: vector,
    geoField,
    columnIndex: 0
  });
  for (const LayerClass of [PointLayer, ArcLayer, LineLayer, GeojsonLayer]) {
    const layer = new LayerClass({id: 'arrow-colors', dataId: 'survey', color: [10, 20, 30]});
    layer.updateLayerVisConfig({filled: true});
    layer.updateLayerConfig({
      propertyTransitions: {color: propertyTrack('color', [0, 20, 40], [200, 120, 80])}
    });
    if (layer.type === 'point') layer.geoArrowVector = vector;
    else if (layer.type === 'geojson') {
      layer.geoArrowMode = true;
      layer.meta = {...layer.meta, ...binary};
    } else {
      layer.geoArrowVector0 = vector;
      layer.geoArrowVector1 = target;
    }
    const data = {
      data: layer.type === 'geojson' ? binary.dataToFeature : [],
      textLabels: [],
      textLabelData: [],
      ...layer.getAttributeAccessors({dataContainer})
    };
    const geometry = vector.data[0].children[0].values;
    const snapshot = Array.from(geometry);
    const onLayerError = sinon.spy();
    const [frame] = renderDeckGlLayer(
      {
        layer,
        data,
        datasets: {
          survey: {
            dataContainer: {getTable: () => table},
            gpuFilter: {filterValueUpdateTriggers: {}}
          }
        },
        mapState: INITIAL_MAP_STATE,
        interactionConfig: INITIAL_VIS_STATE.interactionConfig,
        animationTimeMs: 2000
      },
      {onLayerError}
    );
    t.notOk(onLayerError.called, `${layer.type} Arrow color frame renders`);
    if (layer.type === 'geojson') {
      t.equal(
        frame.props.data,
        binary.dataToFeature[0],
        'GeoJSON retains its cached binary geometry'
      );
      t.deepEqual(
        frame.props.getFillColor({properties: {}}),
        [100, 70, 60],
        'GeoJSON binary fill accessor uses the frame color'
      );
    } else {
      t.equal(frame.props.data, table, `${layer.type} retains its Arrow table`);
      const [sublayer] = frame.renderLayers();
      const colorAccessor =
        layer.type === 'point'
          ? 'getFillColor'
          : layer.type === 'line'
          ? 'getColor'
          : 'getSourceColor';
      const positionAccessor = layer.type === 'point' ? 'getPosition' : 'getSourcePosition';
      t.deepEqual(
        sublayer.props[colorAccessor],
        [100, 70, 60],
        `${layer.type} binary sublayer receives a constant frame color`
      );
      t.equal(
        sublayer.props.data.attributes[positionAccessor].value.buffer,
        geometry.buffer,
        `${layer.type} retains its binary position buffer`
      );
      t.equal(
        sublayer.props.data.attributes[positionAccessor].value.byteOffset,
        geometry.byteOffset,
        `${layer.type} retains the position buffer offset`
      );
      t.deepEqual(
        Array.from(sublayer.props.data.attributes[positionAccessor].value).slice(0, 3),
        [10, 20, 0],
        `${layer.type} retains the position coordinates`
      );
      t.notOk(
        sublayer.props.data.attributes[colorAccessor],
        `${layer.type} has no stale binary color buffer`
      );
    }
    t.deepEqual(Array.from(geometry), snapshot, `${layer.type} leaves source positions unchanged`);
  }
  t.end();
});

test('layerUtils -> a render failure leaves other layers and datasets usable', t => {
  const error = new Error('Cannot render geometry');
  const log = sinon.stub(Console, 'error');
  const onLayerError = sinon.spy();
  const data = {data: [{position: [10, 20]}]};
  const dataset = {label: 'Survey', rows: [[10, 20]]};
  const healthy = {id: 'healthy-overlay'};
  let fail = true;
  const layers = [
    {
      id: 'broken',
      config: {dataId: 'survey'},
      renderLayer: () => {
        if (fail) throw error;
        return {id: 'recovered-overlay'};
      }
    },
    {id: 'healthy', config: {dataId: 'survey'}, renderLayer: () => healthy}
  ];
  const visState = {
    datasets: {survey: dataset},
    layers,
    layerData: [data, data],
    effects: [],
    splitMaps: [],
    interactionConfig: {},
    animationConfig: {}
  };
  const options = {primaryMap: false, layersForDeck: {broken: true, healthy: true}};
  try {
    for (const layerOrder of [
      ['healthy', 'broken'],
      [{id: 'group', isVisible: true, layerOrder: ['healthy', 'broken']}]
    ]) {
      let rendered;
      t.doesNotThrow(() => {
        rendered = computeDeckLayers(
          {visState: {...visState, layerOrder}, mapState: {zoom: 1}},
          options,
          {onLayerError}
        );
      }, 'contains a render exception for flat and grouped layers');
      t.deepEqual(rendered, [healthy], 'renders the healthy layer after the failing layer');
    }
    t.ok(log.calledWith(error), 'reports the rendering failure');
    t.deepEqual(
      onLayerError.args,
      [
        [0, error],
        [0, error]
      ],
      'forwards each failure and its layer index for notification'
    );
    t.equal(visState.datasets.survey, dataset, 'keeps the dataset available for inspection');
    t.equal(visState.layerData[0], data, 'does not discard imported layer data');
    fail = false;
    t.deepEqual(
      computeDeckLayers(
        {visState: {...visState, layerOrder: ['healthy', 'broken']}, mapState: {zoom: 1}},
        options,
        {onLayerError}
      ),
      [{id: 'recovered-overlay'}, healthy],
      'renders the layer again when its renderer recovers'
    );
    t.equal(onLayerError.callCount, 2, 'recovery does not report another error');
  } finally {
    log.restore();
  }
  t.end();
});

test('layerUtils -> timed visibility composes with zoom fades without changing saved opacity', t => {
  const deckLayer = props => ({props, clone: next => deckLayer({...props, ...next})});
  const original = deckLayer({
    opacity: 0.8,
    visible: true,
    pickable: true,
    _subLayerProps: {stroke: {opacity: 0.6}}
  });
  const propertyTransitions = {
    opacity: [
      {
        id: 'appear',
        startTimeMs: 1000,
        endTimeMs: 3000,
        startValue: 0,
        endValue: 1,
        easing: 'linear'
      },
      {id: 'fade', startTimeMs: 4000, endTimeMs: 5000, startValue: 1, endValue: 0, easing: 'linear'}
    ]
  };
  const layer = {
    id: 'timed',
    config: {dataId: 'survey', isVisible: true, propertyTransitions},
    renderLayer: () => original
  };
  const visState = {
    datasets: {survey: {}},
    layers: [layer],
    layerData: [{}],
    layerOrder: ['timed'],
    effects: [],
    splitMaps: [],
    animationConfig: {},
    interactionConfig: {
      zoomOpacity: {
        enabled: true,
        config: {
          controllers: [
            {id: 'fade', layerIds: ['timed'], stops: {appear: 0, full: 2, fade: 5, gone: 7}}
          ]
        }
      }
    }
  };
  const render = (animationTimeMs, layerOrder = ['timed']) =>
    computeDeckLayers(
      {visState: {...visState, layerOrder}, mapState: {zoom: 1}, animationTimeMs},
      {primaryMap: false, layersForDeck: {timed: true}}
    )[0];
  for (const order of [['timed'], [{id: 'group', isVisible: true, layerOrder: ['timed']}]]) {
    const rendered = render(2000, order);
    t.equal(
      rendered.props.opacity,
      0.2,
      'combines saved, time and zoom opacity in flat/grouped layers'
    );
    t.equal(rendered.props._subLayerProps.stroke.opacity, 0.15, 'fades stroke overrides too');
    t.equal(render(0, order).props.visible, false, 'hidden before the scheduled start');
    t.equal(render(0, order).props.pickable, false, 'hidden scheduled layers cannot be picked');
    t.equal(render(5000, order).props.visible, false, 'hidden at the scheduled end');
    t.equal(render(null, order).props.opacity, 0.4, 'leaving preview keeps only the zoom fade');
  }
  t.equal(original.props.opacity, 0.8, 'does not overwrite the authored opacity');
  t.equal(original.props._subLayerProps.stroke.opacity, 0.6, 'does not overwrite stroke opacity');
  t.deepEqual(
    layer.config.propertyTransitions,
    propertyTransitions,
    'does not modify the schedule'
  );
  original.props.visible = false;
  t.equal(render(3000).props.visible, false, 'a manually hidden layer stays hidden');
  t.deepEqual(
    computeDeckLayers(
      {
        visState: {...visState, layers: [], layerOrder: ['timed']},
        mapState: {},
        animationTimeMs: 3000
      },
      {primaryMap: false, layersForDeck: {timed: true}}
    ),
    [],
    'a deleted scheduled layer is ignored'
  );
  t.end();
});

test('layerUtils -> opacity transitions hold gaps and compose with zoom fades', t => {
  const deckLayer = props => ({props, clone: next => deckLayer({...props, ...next})});
  const original = deckLayer({opacity: 0.8, visible: true, pickable: true});
  const opacityTransitions = [
    {
      id: 'in',
      startTimeMs: 1000,
      endTimeMs: 3000,
      startValue: 0.25,
      endValue: 0.75,
      easing: 'linear'
    },
    {
      id: 'out',
      startTimeMs: 5000,
      endTimeMs: 6000,
      startValue: 0.75,
      endValue: 0,
      easing: 'linear'
    },
    {id: 'cut', startTimeMs: 8000, endTimeMs: 8000, startValue: 0, endValue: 1, easing: 'linear'}
  ];
  const layer = {
    id: 'opacity',
    config: {dataId: 'survey', isVisible: true, propertyTransitions: {opacity: opacityTransitions}},
    renderLayer: () => original
  };
  const visState = {
    datasets: {survey: {}},
    layers: [layer],
    layerData: [{}],
    layerOrder: ['opacity'],
    effects: [],
    splitMaps: [],
    animationConfig: {},
    interactionConfig: {
      zoomOpacity: {
        enabled: true,
        config: {
          controllers: [
            {id: 'fade', layerIds: ['opacity'], stops: {appear: 0, full: 2, fade: 5, gone: 7}}
          ]
        }
      }
    }
  };
  const render = (animationTimeMs, layerOrder) =>
    computeDeckLayers(
      {visState: {...visState, layerOrder}, mapState: {zoom: 1}, animationTimeMs},
      {primaryMap: false, layersForDeck: {opacity: true}}
    )[0];
  for (const order of [['opacity'], [{id: 'group', isVisible: true, layerOrder: ['opacity']}]]) {
    for (const [time, expected] of [
      [0, 0.1],
      [2000, 0.2],
      [4000, 0.3],
      [5500, 0.15],
      [7000, 0],
      [8000, 0.4],
      [9000, 0.4]
    ]) {
      t.ok(
        Math.abs(render(time, order).props.opacity - expected) < 1e-9,
        `evaluates opacity at ${time} ms`
      );
    }
    t.equal(render(7000, order).props.visible, false, 'holds zero opacity between transitions');
    t.equal(render(7000, order).props.pickable, false, 'a held zero opacity cannot be picked');
    t.equal(
      render(null, order).props.opacity,
      0.4,
      'leaving preview restores authored opacity with zoom fade'
    );
  }
  t.equal(original.props.opacity, 0.8, 'does not change the saved opacity');
  t.equal(opacityTransitions[0].startValue, 0.25, 'does not change authored transition values');
  layer.config.propertyTransitions = {opacity: []};
  t.equal(render(2000, ['opacity']).props.opacity, 0.4, 'an empty track restores authored opacity');

  t.end();
});

async function createDefaultColorDataset(columns, rowCount = 3) {
  const dataset = new KeplerTable({info: {id: 'default-color'}});
  await dataset.importData({
    data: {
      fields: [
        {name: 'lat', type: 'real'},
        {name: 'lng', type: 'real'},
        {name: 'a5', type: 'string'},
        {name: 's2', type: 'string'},
        {name: 'geohash', type: 'string'},
        {name: 'h3', type: 'h3'},
        {name: 'icon', type: 'string'},
        ...columns.map(({name, type}) => ({name, type}))
      ],
      rows: Array.from({length: rowCount}, (_, index) => [
        37.7 + index / 100,
        -122.4 + index / 100,
        '9ca4cf8000000000',
        '8085809',
        '9q8yyk',
        '8928308280fffff',
        'marker',
        ...columns.map(({values}) => values[index])
      ])
    }
  });
  return dataset;
}

test('layerUtils -> default fill fields prefer varying floats, then integers', async t => {
  const cases = [
    {
      name: 'float before a preferred integer',
      columns: [
        {name: 'score', type: 'integer', values: [1, 2, 3]},
        {name: 'metric', type: 'real', values: [0.5, 0.5, 0.5]},
        {name: 'depth', type: 'real', values: [1.25, 2.5, 3.75]}
      ],
      expected: 'depth',
      domain: [1.25, 2.5, 3.75]
    },
    {
      name: 'metric preference within floats',
      columns: [
        {name: 'depth', type: 'real', values: [1.25, 2.5, 3.75]},
        {name: 'score', type: 'real', values: [0.25, 0.5, 0.75]}
      ],
      expected: 'score',
      domain: [0.25, 0.5, 0.75]
    },
    {
      name: 'column order within equally ranked floats',
      columns: [
        {name: 'depth', type: 'real', values: [1.25, 2.5, 3.75]},
        {name: 'height', type: 'real', values: [0.25, 0.5, 0.75]}
      ],
      expected: 'depth',
      domain: [1.25, 2.5, 3.75]
    },
    {
      name: 'integer fallback after constant and missing values',
      columns: [
        {name: 'score', type: 'real', values: [0.5, null, 0.5]},
        {name: 'metric', type: 'integer', values: [1, 1, 1]},
        {name: 'value', type: 'real', values: [null, null, null]},
        {name: 'count', type: 'integer', values: [1, 2, 3]}
      ],
      expected: 'count',
      domain: [1, 2, 3]
    },
    {
      name: 'no varying eligible numbers',
      columns: [
        {name: 'score', type: 'real', values: [0.5, null, 0.5]},
        {name: 'count', type: 'integer', values: [1, 1, 1]},
        {name: 'record_id', type: 'integer', values: [1, 2, 3]},
        {name: 'category', type: 'string', values: ['a', 'b', 'c']}
      ],
      expected: null,
      domain: [0, 1]
    }
  ];

  for (const {name, columns, expected, domain} of cases) {
    const dataset = await createDefaultColorDataset(columns);
    for (const type of defaultColorLayerTypes) {
      const layers = findDefaultLayer(dataset, {[type]: LayerClasses[type]});
      t.equal(layers.length, 1, `${type}: discovers a layer`);
      const layer = layers[0];
      t.equal(layer.config.colorField?.name ?? null, expected, `${type}: ${name}`);
      t.deepEqual(layer.config.colorDomain, domain, `${type}: initializes the color domain`);
      t.notOk(layer.config.strokeColorField, `${type}: leaves stroke color alone`);
    }
  }
  t.end();
});

test('layerUtils -> empty and single-row layers keep uniform fill', async t => {
  for (const rowCount of [0, 1]) {
    const dataset = await createDefaultColorDataset(
      [{name: 'score', type: 'real', values: [0.5]}],
      rowCount
    );
    for (const type of defaultColorLayerTypes) {
      const layer = new LayerClasses[type]({dataId: dataset.id});
      layer.setInitialLayerConfig(dataset);
      t.equal(layer.config.colorField, null, `${type}: ${rowCount} rows keep uniform fill`);
    }
  }
  t.end();
});

test('layerUtils -> large datasets select numeric defaults without reading values', async t => {
  const cases = [
    {
      columns: [
        {name: 'score', type: 'integer', values: [1, 2, 3]},
        {name: 'depth', type: 'real', values: [1.25, 2.5, 3.75]},
        {name: 'metric', type: 'real', values: [0.5, 0.5, 0.5]}
      ],
      expected: 'metric'
    },
    {
      columns: [
        {name: 'record_id', type: 'integer', values: [1, 2, 3]},
        {name: 'count', type: 'integer', values: [1, 1, 1]}
      ],
      expected: 'count'
    },
    {
      columns: [{name: 'record_id', type: 'integer', values: [1, 2, 3]}],
      expected: null
    }
  ];

  for (const {columns, expected} of cases) {
    const dataset = await createDefaultColorDataset(columns);
    dataset.dataContainer.numRows = () => 1_000_001;
    dataset.fields.forEach(field => {
      field.valueAccessor = () => {
        throw new Error('Large-dataset color selection must not read row values');
      };
    });
    t.equal(findDefaultColorFieldWithValues(dataset)?.name ?? null, expected);
  }
  t.end();
});

test('layerUtils -> optional default coloring preserves explicit fields and rolls back failures', async t => {
  for (const failure of ['values', 'domain', 'explicit field']) {
    const dataset = await createDefaultColorDataset([
      {name: 'score', type: 'real', values: [0.25, 0.5, 0.75]},
      {name: 'count', type: 'integer', values: [1, 2, 3]}
    ]);
    if (failure === 'values') {
      dataset.fields.find(field => field.name === 'score').valueAccessor = () => {
        throw new Error('Cannot read field values');
      };
    } else if (failure === 'domain') {
      dataset.getColumnLayerDomain = () => {
        throw new Error('Cannot calculate color domain');
      };
    }
    for (const type of defaultColorLayerTypes) {
      const layer = new LayerClasses[type]({dataId: dataset.id});
      if (failure === 'explicit field') {
        layer.updateLayerConfig({colorField: dataset.fields.find(field => field.name === 'count')});
        layer.updateLayerVisualChannel(dataset, 'color');
      }
      const previousConfig = layer.config;
      t.doesNotThrow(() => layer.setInitialLayerConfig(dataset), `${type}: ${failure}`);
      t.equal(layer.config, previousConfig, `${type}: keeps previous color settings`);
    }
  }
  t.end();
});

test('layerUtils -> default color query checks domain rows and ignores invalid values', async t => {
  const dataset = await createDefaultColorDataset([
    {name: 'score', type: 'real', values: [0.5, 0.5, 1.5]},
    {name: 'value', type: 'integer', values: [1, 2, 3]}
  ]);
  dataset.filteredIndexForDomain = [0, 1];
  t.equal(findDefaultColorFieldWithValues(dataset)?.name, 'value', 'uses the domain row selection');

  const score = dataset.fields.find(field => field.name === 'score');
  score.valueAccessor = ({index}) => [NaN, Infinity, -Infinity][index];
  dataset.filteredIndexForDomain = [0, 1, 2];
  t.equal(findDefaultColorFieldWithValues(dataset)?.name, 'value', 'skips non-finite numbers');
  dataset.filteredIndexForDomain = [];
  t.equal(findDefaultColorFieldWithValues(dataset), null, 'no domain rows means no varying field');
  t.end();
});

test('layerUtils -> createGeoArrowPointVector handles empty and nonempty coordinates', t => {
  for (const coordinates of [
    [],
    [
      [-122.42, 37.77],
      [0, 0]
    ],
    [
      [-122.42, 37.77, 10],
      [0, 0, -5]
    ]
  ]) {
    const dataContainer = new ArrowDataContainer({
      cols: [
        arrow.vectorFromArray(
          coordinates.map((_, i) => i),
          new arrow.Float64()
        )
      ],
      fields: [{name: 'row', type: 'real', fieldIdx: 0}]
    });
    let accessorCalls = 0;
    let vector;
    t.doesNotThrow(() => {
      vector = createGeoArrowPointVector(dataContainer, ({index}) => {
        accessorCalls++;
        return coordinates[index];
      });
    }, 'should create a coordinate vector, including for zero rows');
    if (vector) {
      t.equal(vector.length, coordinates.length, 'preserves the row count');
      t.ok(arrow.DataType.isFixedSizeList(vector.type), 'coordinates have a fixed-size-list type');
      t.equal(vector.type.listSize, coordinates[0]?.length || 2, 'retains coordinate dimensions');
      t.equal(
        String(vector.type.children[0].type),
        'Float64',
        'coordinates retain Float64 precision'
      );
      t.deepEqual(
        Array.from({length: vector.length}, (_, i) => Array.from(vector.get(i))),
        coordinates,
        'preserves nonempty coordinate values and order'
      );
    }
    if (!coordinates.length) {
      t.equal(accessorCalls, 0, 'does not read a nonexistent row');
    }
  }
  t.end();
});

test('layerUtils -> coordinate vectors preserve sliced and empty record batches', t => {
  for (const dimensions of [2, 3]) {
    const table = new arrow.Table({
      row: arrow.vectorFromArray([99, 0, 1, 2, 3, 99], new arrow.Float64())
    });
    const empty = new arrow.Table(
      new arrow.RecordBatch({
        row: arrow.makeData({type: new arrow.Float64(), data: new Float64Array(0)})
      })
    );
    const batched = new arrow.Table(table.schema, [
      ...empty.batches,
      ...table.slice(1, 3).batches,
      ...empty.batches,
      ...table.slice(3, 5).batches,
      ...empty.batches
    ]);
    const container = new ArrowDataContainer({
      cols: [table.getChildAt(0)],
      fields: [{name: 'row', type: 'real', fieldIdx: 0}]
    });
    container.update(batched);
    const vector = createGeoArrowPointVector(container, ({index}) =>
      [container.valueAt(index, 0), -index, index + 10].slice(0, dimensions)
    );
    t.deepEqual(
      vector.data.map(chunk => chunk.length),
      [0, 2, 0, 2, 0],
      'keeps empty batches'
    );
    t.deepEqual(
      Array.from(vector, point => Array.from(point)),
      [0, 1, 2, 3].map(index => [index, -index, index + 10].slice(0, dimensions)),
      'uses global row indices and logical slice offsets for XY and XYZ'
    );
  }
  const empty = new ArrowDataContainer({cols: [], fields: []});
  const vector = createGeoArrowPointVector(empty, () => {
    t.fail('must not access a row in a table without batches');
  });
  t.equal(vector.length, 0, 'an empty table still produces a typed empty vector');
  t.ok(arrow.DataType.isFixedSizeList(vector.type), 'empty vector has point storage');
  t.end();
});

test('layerUtils -> separated point normalization preserves validity, slices and precision', t => {
  for (const FloatType of [arrow.Float32, arrow.Float64]) {
    for (const dimensions of [2, 3]) {
      const names = ['x', 'y', 'z'].slice(0, dimensions);
      const type = new arrow.Struct(names.map(name => new arrow.Field(name, new FloatType())));
      const vector = arrow
        .vectorFromArray(
          [
            {x: -100, y: -80, z: -1},
            null,
            {x: 10.123456789, y: 20.123456789, z: 5.123456789},
            {x: NaN, y: NaN, z: NaN},
            {x: Infinity, y: 40, z: 1},
            {x: 50, y: null, z: 1},
            {x: 30, y: 40, z: 15}
          ],
          type
        )
        .slice(1);
      const data = vector.data[0];
      const normalized = convertStructToFixedSizeList(data);
      const validPoint = names.map(name => vector.get(1)[name]);
      const expected = [
        ...Array(dimensions).fill(NaN),
        ...validPoint,
        ...Array(3 * dimensions).fill(NaN),
        ...names.map(name => vector.get(5)[name])
      ];
      t.deepEqual(
        Array.from(normalized.children[0].values),
        expected,
        'all axes retain source precision; missing and nonfinite rows are NaN'
      );
      t.equal(arrow.makeVector(normalized).get(0), null, 'slice retains parent null validity');
      t.deepEqual(
        Array.from(arrow.makeVector(normalized).get(1)),
        validPoint,
        'slice retains valid row values'
      );
      t.ok(
        normalized.children[0].values instanceof Float64Array,
        'does not narrow coordinate precision'
      );

      const metadata = new Map([[GEOARROW_METADATA_KEY, GEOARROW_EXTENSIONS.POINT]]);
      const geoField = {name: 'geometry', type: 'geoarrow', fieldIdx: 0, metadata};
      const dataContainer = new ArrowDataContainer({cols: [vector], fields: [geoField]});
      const meta = getGeojsonLayerMetaFromArrow({
        dataContainer,
        geoColumn: vector,
        geoField,
        columnIndex: 0
      });
      t.deepEqual(
        Array.from(meta.dataToFeature[0].points.positions.value),
        expected,
        'GeoJSON uses normalized rows'
      );
      t.deepEqual(
        meta.bounds,
        [validPoint[0], validPoint[1], 30, 40],
        'null and nonfinite rows do not distort bounds'
      );
      const table = new arrow.Table({geometry: vector});
      table.schema.fields[0].metadata.set(GEOARROW_METADATA_KEY, GEOARROW_EXTENSIONS.POINT);
      const [layer] = new GeoArrowScatterplotLayer({data: table}).renderLayers();
      t.deepEqual(
        Array.from(layer.props.data.attributes.getPosition.value),
        expected,
        'Point metadata inference uses normalized rows'
      );
      t.equal(layer.props.data.length, vector.length, 'invalid rows retain picking alignment');
    }
  }
  const type = new arrow.Struct(['x', 'y'].map(name => new arrow.Field(name, new arrow.Float64())));
  for (const rows of [[], [null, null]]) {
    const input = arrow.vectorFromArray(rows, type).data[0];
    const output = convertStructToFixedSizeList(input);
    t.equal(output.length, rows.length, 'empty/all-null input keeps its row count');
    t.equal(output.type.listSize, 2, 'empty/all-null coordinates still have two dimensions');
    t.ok(
      Array.from(output.children[0].values).every(Number.isNaN),
      'missing points never become the origin'
    );
  }
  for (const FloatType of [arrow.Float32, arrow.Float64]) {
    const type = new arrow.FixedSizeList(2, new arrow.Field('xy', new FloatType()));
    const input = arrow
      .vectorFromArray(
        [
          [0, 0],
          [10, 20],
          [30, 40]
        ],
        type
      )
      .slice(1).data[0];
    t.equal(
      convertStructToFixedSizeList(input),
      input,
      'interleaved slices retain the zero-copy fast path'
    );
  }
  t.end();
});

test('layerUtils -> incremental separated points retain unequal batch row offsets', t => {
  const type = new arrow.Struct(['x', 'y'].map(name => new arrow.Field(name, new arrow.Float64())));
  const chunks = [
    [
      {x: 10, y: 20},
      {x: 30, y: 40}
    ],
    [{x: 50, y: 60}],
    [{x: 70, y: 80}]
  ].map(rows => arrow.vectorFromArray(rows, type).data[0]);
  const geoColumn = arrow.makeVector(chunks);
  const metadata = new Map([[GEOARROW_METADATA_KEY, GEOARROW_EXTENSIONS.POINT]]);
  const geoField = {name: 'geometry', type: 'geoarrow', fieldIdx: 0, metadata};
  const dataContainer = new ArrowDataContainer({cols: [geoColumn], fields: [geoField]});
  const result = getGeojsonLayerMetaFromArrow({
    dataContainer,
    geoColumn,
    geoField,
    columnIndex: 0,
    chunkIndex: 2
  });
  t.equal(result.dataToFeature.length, 1, 'only converts the requested batch');
  t.deepEqual(
    Array.from(result.dataToFeature[0].points.positions.value),
    [70, 80],
    'retains the requested coordinates'
  );
  t.deepEqual(
    Array.from(result.dataToFeature[0].points.globalFeatureIds.value),
    [3],
    'sums preceding unequal batch lengths'
  );
  t.deepEqual(result.centroids, [[70, 80]], 'centroid uses both coordinate axes');
  t.end();
});

test('layerUtils -> native points from another Arrow runtime preserve slices and batch ids', t => {
  const type = new foreignArrow.FixedSizeList(
    3,
    new foreignArrow.Field('xyz', new foreignArrow.Float64())
  );
  const first = foreignArrow
    .vectorFromArray(
      [
        [-100, -80, -1],
        [10, 20, 5],
        [30, 40, 15]
      ],
      type
    )
    .slice(1);
  const last = foreignArrow.vectorFromArray([[50, 60, 25]], type);
  const geoColumn = foreignArrow.makeVector([...first.data, ...last.data]);
  const geoField = {
    name: 'geometry',
    type: 'geoarrow',
    fieldIdx: 0,
    metadata: new Map([[GEOARROW_METADATA_KEY, GEOARROW_EXTENSIONS.POINT]])
  };
  const table = new foreignArrow.Table({geometry: geoColumn});
  const originalBytes = foreignArrow.tableToIPC(table);
  const dataContainer = new ArrowDataContainer({
    cols: [geoColumn],
    fields: [geoField],
    arrowTable: table
  });
  t.notOk(geoColumn.data[0] instanceof arrow.Data, 'fixture uses a separate Arrow runtime');

  for (const chunkIndex of [undefined, 1]) {
    const result = getGeojsonLayerMetaFromArrow({
      dataContainer,
      geoColumn,
      geoField,
      columnIndex: 0,
      chunkIndex
    });
    const incremental = chunkIndex === 1;
    t.deepEqual(
      result.dataToFeature.flatMap(data => Array.from(data.points.positions.value)),
      incremental ? [50, 60, 25] : [10, 20, 5, 30, 40, 15, 50, 60, 25],
      'preserves XYZ coordinates and excludes padding and sliced-out rows'
    );
    t.deepEqual(
      result.dataToFeature.flatMap(data => Array.from(data.points.globalFeatureIds.value)),
      incremental ? [2] : [0, 1, 2],
      'retains row ids across unequal batches'
    );
    t.deepEqual(result.bounds, incremental ? [50, 60, 50, 60] : [10, 20, 50, 60], 'bounds');
    t.deepEqual(
      result.centroids,
      incremental
        ? [[50, 60]]
        : [
            [10, 20],
            [30, 40],
            [50, 60]
          ],
      'centroids remain aligned with rows'
    );
    result.dataToFeature.forEach((data, i) => {
      t.equal(
        data.points.positions.value.buffer,
        geoColumn.data[(chunkIndex || 0) + i].children[0].values.buffer,
        'interleaved coordinates still share their source buffer'
      );
    });
  }
  t.deepEqual(foreignArrow.tableToIPC(table), originalBytes, 'does not change the source table');
  t.end();
});

test('layerUtils -> getGeojsonLayerMetaFromArrow uses worker-prepared data', t => {
  const pointType = new arrow.FixedSizeList(2, new arrow.Field('xy', new arrow.Float64(), false));
  const geoColumn = arrow.vectorFromArray([[-122.4, 37.8]], pointType);
  const metadata = new Map([[GEOARROW_METADATA_KEY, GEOARROW_EXTENSIONS.POINT]]);
  const fields = [{name: 'geometry', type: 'geoarrow', fieldIdx: 0, metadata}];
  const cachedGeometry = {shape: 'worker-result'};
  const cached = {
    binaryGeometries: [cachedGeometry],
    bounds: [-122.4, 37.8, -122.4, 37.8],
    featureTypes: {point: true, line: false, polygon: false},
    meanCenters: [[-122.4, 37.8]]
  };
  const dataContainer = new ArrowDataContainer({
    cols: [geoColumn],
    fields,
    geoArrowBinaryData: {0: {0: cached}}
  });

  const result = getGeojsonLayerMetaFromArrow({
    dataContainer,
    geoColumn: dataContainer.getColumn(0),
    geoField: fields[0],
    columnIndex: 0
  });

  t.equal(result.dataToFeature[0], cachedGeometry, 'should reuse the worker binary geometry');
  t.deepEqual(result.bounds, cached.bounds, 'should reuse worker-computed bounds');
  t.deepEqual(result.centroids, cached.meanCenters, 'should reuse worker-computed centroids');
  t.end();
});

test('layerUtils -> findDefaultLayer.1', t => {
  const inputFields = [
    // layer 1
    {
      name: 'one_lat',
      fieldIdx: 0
    },
    {
      name: 'one_lng',
      fieldIdx: 1
    },
    // layer 2
    {
      name: 'two_two.lng',
      fieldIdx: 2
    },
    {
      name: 'two_two.lat',
      fieldIdx: 3
    },
    // layer 3
    {
      name: 'three longitude',
      fieldIdx: 4
    },
    {
      name: 'three latitude',
      fieldIdx: 5
    },
    // layer 4
    {
      name: 'four._.lon',
      fieldIdx: 6
    },
    {
      name: 'four._.lat',
      fieldIdx: 7
    },
    // layer 5
    {
      name: 'lat',
      fieldIdx: 8
    },
    {
      name: 'lon',
      fieldIdx: 9
    },
    // non layer
    //

    {
      name: 'non_layer_longitude.alt',
      fieldIdx: 10
    },
    {
      name: 'non_layer_latitude.alt',
      fieldIdx: 11
    },
    {
      name: 'non_layer_altitude.alt',
      fieldIdx: 12
    }
  ];

  const dataId = 'testtest';

  const outputLayers = [
    new PointLayer({
      label: 'one',
      dataId,
      columns: {
        lat: {
          value: 'one_lat',
          fieldIdx: 0
        },
        lng: {
          value: 'one_lng',
          fieldIdx: 1
        },
        altitude: {
          value: null,
          fieldIdx: -1,
          optional: true
        }
      }
    }),
    new PointLayer({
      label: 'two_two',
      dataId,
      columns: {
        lat: {
          value: 'two_two.lat',
          fieldIdx: 3
        },
        lng: {
          value: 'two_two.lng',
          fieldIdx: 2
        },
        altitude: {
          value: null,
          fieldIdx: -1,
          optional: true
        }
      }
    }),
    new PointLayer({
      label: 'three',
      dataId,
      columns: {
        lat: {
          value: 'three latitude',
          fieldIdx: 5
        },
        lng: {
          value: 'three longitude',
          fieldIdx: 4
        },
        altitude: {
          value: null,
          fieldIdx: -1,
          optional: true
        }
      }
    }),
    new PointLayer({
      label: 'four._',
      dataId,
      columns: {
        lat: {
          value: 'four._.lat',
          fieldIdx: 7
        },
        lng: {
          value: 'four._.lon',
          fieldIdx: 6
        },
        altitude: {
          value: null,
          fieldIdx: -1,
          optional: true
        }
      }
    }),
    new PointLayer({
      label: 'Point',
      dataId,
      columns: {
        lat: {
          value: 'lat',
          fieldIdx: 8
        },
        lng: {
          value: 'lon',
          fieldIdx: 9
        },
        altitude: {
          value: null,
          fieldIdx: -1,
          optional: true
        }
      }
    }),
    new PointLayer({
      label: 'non_layeralt',
      dataId,
      columns: {
        lat: {
          value: 'non_layer_latitude.alt',
          fieldIdx: 11
        },
        lng: {
          value: 'non_layer_longitude.alt',
          fieldIdx: 10
        },
        altitude: {
          value: 'non_layer_altitude.alt',
          fieldIdx: 12,
          optional: true
        }
      }
    }),
    new ArcLayer({
      label: 'one -> two_two arc',
      dataId,
      isVisible: false,
      columns: {
        lat0: {
          value: 'one_lat',
          fieldIdx: 0
        },
        lng0: {
          value: 'one_lng',
          fieldIdx: 1
        },
        lat1: {
          value: 'two_two.lat',
          fieldIdx: 3
        },
        lng1: {
          value: 'two_two.lng',
          fieldIdx: 2
        }
      }
    }),
    new LineLayer({
      label: 'one -> two_two line',
      dataId,
      isVisible: false,
      columns: {
        lat0: {
          value: 'one_lat',
          fieldIdx: 0
        },
        lng0: {
          value: 'one_lng',
          fieldIdx: 1
        },
        lat1: {
          value: 'two_two.lat',
          fieldIdx: 3
        },
        lng1: {
          value: 'two_two.lng',
          fieldIdx: 2
        },
        alt0: {
          value: null,
          fieldIdx: -1,
          optional: true
        },
        alt1: {
          value: null,
          fieldIdx: -1,
          optional: true
        }
      }
    })
  ];

  const fieldPairs = findPointFieldPairs(inputFields);
  const layers = findDefaultLayer({fields: inputFields, fieldPairs, id: dataId}, LayerClasses);

  t.equal(layers.length, outputLayers.length, 'number of layers found');

  layers.forEach((l, i) => cmpLayers(t, outputLayers[i], l));

  t.end();
});

test('layerUtils -> findDefaultLayer.2', t => {
  const inputFields = [
    // layer 1
    {
      name: 'all_points',
      fieldIdx: 0
    }
  ];
  const dataId = 'milkshake';

  const dataset = new KeplerTable({
    info: {
      id: dataId,
      label: 'sf_zip_geo'
    }
  });
  dataset.importData({
    data: {
      rows: [
        [
          {
            type: 'Feature',
            properties: {index: 0},
            geometry: {type: 'Point', coordinates: []}
          }
        ],
        [
          {
            type: 'Feature',
            properties: {index: 1},
            geometry: {type: 'Point', coordinates: []}
          }
        ]
      ],
      fields: inputFields
    }
  });

  const expected = new GeojsonLayer({
    label: 'sf_zip_geo',
    isVisible: true,
    dataId,
    columns: {
      geojson: {
        value: 'all_points',
        fieldIdx: 0
      }
    }
  });

  expected.updateLayerVisConfig({filled: true, stroked: false});

  const layers = findDefaultLayer(dataset, LayerClasses);

  t.equal(layers.length, 1, 'number of layers found');
  cmpLayers(t, expected, layers[0]);

  t.end();
});

test('layerUtils -> findDefaultLayer.3', t => {
  const dataId = 'cool';

  const inputFields = [
    // layer 1 & 2
    {
      name: 'begintrip_lat',
      fieldIdx: 0
    },
    {
      name: 'begintrip_lng',
      fieldIdx: 1
    }
  ];

  const outputLayers = [
    new PointLayer({
      label: 'begintrip',
      dataId,
      columns: {
        lat: {
          value: 'begintrip_lat',
          fieldIdx: 0
        },
        lng: {
          value: 'begintrip_lng',
          fieldIdx: 1
        },
        altitude: {
          value: null,
          fieldIdx: -1,
          optional: true
        }
      }
    })
  ];

  const fieldPairs = findPointFieldPairs(inputFields);
  const layers = findDefaultLayer({fields: inputFields, fieldPairs, id: dataId}, LayerClasses);

  t.equal(layers.length, 1, 'number of layers found');
  layers.forEach((l, i) => cmpLayers(t, outputLayers[i], l));

  t.end();
});

test('layerUtils -> findDefaultLayer.4', t => {
  // Since all defaults layers are scanned and they
  // share field names or patterns.  This set produces
  // multiple layers.
  // Order determined by the order
  // the defaults are scanned inside the function under test.
  const inputFields = [
    // layer 1 (grid), 2 (arc), 3 (point)
    {
      name: 'begintrip_lat',
      fieldIdx: 0
    },
    {
      name: 'begintrip_lng',
      fieldIdx: 1
    },
    // layer 2 (arc), 4 (point)
    {
      name: 'dropoff_lat',
      fieldIdx: 2
    },
    {
      name: 'dropoff_lng',
      fieldIdx: 3
    }
  ];

  const dataId = 'yololo';
  const outputLayers = [
    new PointLayer({
      label: 'begintrip',
      dataId,
      columns: {
        lat: {
          value: 'begintrip_lat',
          fieldIdx: 0
        },
        lng: {
          value: 'begintrip_lng',
          fieldIdx: 1
        },
        altitude: {
          value: null,
          fieldIdx: -1,
          optional: true
        }
      }
    }),
    new PointLayer({
      label: 'dropoff',
      dataId,
      columns: {
        lat: {
          value: 'dropoff_lat',
          fieldIdx: 2
        },
        lng: {
          value: 'dropoff_lng',
          fieldIdx: 3
        },
        altitude: {
          value: null,
          fieldIdx: -1,
          optional: true
        }
      }
    }),
    new ArcLayer({
      label: 'begintrip -> dropoff arc',
      dataId,
      isVisible: false,
      columns: {
        lat0: {
          value: 'begintrip_lat',
          fieldIdx: 0
        },
        lng0: {
          value: 'begintrip_lng',
          fieldIdx: 1
        },
        lat1: {
          value: 'dropoff_lat',
          fieldIdx: 2
        },
        lng1: {
          value: 'dropoff_lng',
          fieldIdx: 3
        }
      }
    }),
    new LineLayer({
      label: 'begintrip -> dropoff line',
      dataId,
      isVisible: false,
      columns: {
        lat0: {
          value: 'begintrip_lat',
          fieldIdx: 0
        },
        lng0: {
          value: 'begintrip_lng',
          fieldIdx: 1
        },
        lat1: {
          value: 'dropoff_lat',
          fieldIdx: 2
        },
        lng1: {
          value: 'dropoff_lng',
          fieldIdx: 3
        },
        alt0: {
          value: null,
          fieldIdx: -1,
          optional: true
        },
        alt1: {
          value: null,
          fieldIdx: -1,
          optional: true
        }
      }
    })
  ];

  const fieldPairs = findPointFieldPairs(inputFields);
  const layers = findDefaultLayer({fields: inputFields, fieldPairs, id: dataId}, LayerClasses);

  t.equal(layers.length, outputLayers.length, 'number of layers found');
  layers.forEach((l, i) => cmpLayers(t, outputLayers[i], l));

  t.end();
});

test('layerUtils -> findDefaultLayer.5', t => {
  const inputFields = [
    // layer 1
    {
      name: 'one_late',
      fieldIdx: 0
    },
    {
      name: 'one_lng',
      fieldIdx: 1
    }
  ];

  const fieldPairs = findPointFieldPairs(inputFields);
  const layers = findDefaultLayer({fields: inputFields, fieldPairs, id: 'yo'}, LayerClasses);

  t.equal(layers.length, 0, 'number of layers found');

  t.end();
});

test('layerUtils -> findDefaultLayer:GeojsonLayer', t => {
  const dataset = new KeplerTable({
    info: {
      label: 'sf_zip_geo'
    }
  });
  dataset.importData({
    data: {
      rows: [
        [
          {
            type: 'Feature',
            properties: {index: 0},
            geometry: {type: 'Point', coordinates: []}
          }
        ],
        [
          {
            type: 'Feature',
            properties: {index: 1},
            geometry: {type: 'Point', coordinates: []}
          }
        ]
      ],
      fields: [
        {
          name: 'random'
        },
        {
          name: 'begintrip_lng'
        },
        {
          name: 'cool'
        },
        {
          name: 'dropoff_lng'
        },
        {
          name: GEOJSON_FIELDS.geojson[0]
        },
        {
          name: GEOJSON_FIELDS.geojson[1]
        }
      ]
    }
  });

  const expected1 = new GeojsonLayer({
    label: 'what',
    dataId: 'smoothie',
    isVisible: true,
    columns: {
      geojson: {value: GEOJSON_FIELDS.geojson[0], fieldIdx: 4}
    }
  });

  const expected2 = new GeojsonLayer({
    label: 'what',
    dataId: 'smoothie',
    isVisible: true,
    columns: {
      geojson: {value: GEOJSON_FIELDS.geojson[1], fieldIdx: 5}
    }
  });

  // eslint-disable-next-line no-unused-vars
  const [_layer1Color, _layer2Color, layer2Stroke] = getNextColorMakerValue(3);
  expected1.updateLayerVisConfig({filled: true, stroked: false});
  expected2.updateLayerVisConfig({
    filled: true,
    stroked: true,
    strokeColor: layer2Stroke
  });

  const {fields} = dataset;

  const dataContainer = createDataContainer([
    [
      0,
      1,
      2,
      3,
      {
        type: 'Feature',
        properties: {index: 0},
        geometry: {type: 'Point', coordinates: []}
      },
      {
        type: 'Feature',
        properties: {index: 0},
        geometry: {type: 'Polygon', coordinates: []}
      }
    ],
    {fields}
  ]);

  const geojsonLayers = findDefaultLayer(
    {
      fields,
      label: 'what',
      id: 'smoothie',
      fieldPairs: [],
      dataContainer
    },
    LayerClasses
  );

  cmpLayers(t, [expected1, expected2], geojsonLayers);
  t.end();
});

test('layerUtils -> findDefaultLayer:GeojsonLayer.wkt', async t => {
  const {fields, rows} = processCsvData(wktCsv);

  const dataId = '0dj3h';
  const label = 'some geometry file';
  const dataset = new KeplerTable({info: {id: dataId, label}});
  await dataset.importData({data: {fields, rows}});

  const expected1 = new GeojsonLayer({
    dataId: '0dj3h',
    label: 'some geometry file',
    isVisible: true,
    columns: {
      geojson: {value: 'simplified_shape_v2', fieldIdx: 1}
    }
  });
  const expected2 = new GeojsonLayer({
    dataId: '0dj3h',
    label: 'some geometry file',
    isVisible: true,
    columns: {
      geojson: {value: 'simplified_shape', fieldIdx: 2}
    }
  });

  const [_layer1Color, strokeColor1, _layer2Color, strokeColor2] = getNextColorMakerValue(4);
  expected1.updateLayerVisConfig({
    filled: true,
    stroked: true,
    strokeColor: strokeColor1
  });
  expected2.updateLayerVisConfig({
    filled: true,
    stroked: true,
    strokeColor: strokeColor2
  });
  const defaultColorField = findDefaultColorField(dataset);
  expected1.updateLayerConfig({colorField: defaultColorField});
  expected1.updateLayerVisualChannel(dataset, 'color');
  expected2.updateLayerConfig({colorField: defaultColorField});
  expected2.updateLayerVisualChannel(dataset, 'color');

  const geojsonLayers = findDefaultLayer(dataset, LayerClasses);

  cmpLayers(t, [expected1, expected2], geojsonLayers);
  t.end();
});

test('layerUtils -> findDefaultLayer:GeojsonWithStyle', t => {
  const {fields, rows} = processGeojson(geoJsonWithStyle);

  const dataContainer = createDataContainer(rows, {fields});

  const geojsonLayers = findDefaultLayer(
    {
      fields,
      id: 'test',
      dataId: 'taro',
      label: 'chubby prince',
      fieldPairs: [],
      dataContainer
    },
    LayerClasses
  );

  t.equal(geojsonLayers.length, 1, 'should find 1 layer');
  t.end();
});

test('layerUtils -> findDefaultLayer:IconLayer', t => {
  const inputFields = [
    {
      name: 'begintrip_lat',
      fieldIdx: 0
    },
    {
      name: 'begintrip_lng',
      fieldIdx: 1
    },
    {
      name: 'dropoff_lat',
      fieldIdx: 2
    },
    {
      name: 'dropoff_lng',
      fieldIdx: 3
    }
  ];
  const fieldPairs = findPointFieldPairs(inputFields);

  const eventIcon = [{name: 'event_icon', fieldIdx: 4}];
  const nameIcon = [{name: 'name.icon', fieldIdx: 4}];

  t.equal(
    findDefaultLayer(
      {
        fields: inputFields,
        fieldPairs,
        id: 'meow',
        allData: []
      },
      LayerClasses
    ).filter(l => l.type === 'icon').length,
    0,
    'should find no icon layer'
  );

  const fieldsWithIcon = [...inputFields, ...eventIcon];
  const fieldPairsWIcon = findPointFieldPairs(fieldsWithIcon);

  let iconLayers = findDefaultLayer(
    {
      fields: fieldsWithIcon,
      fieldPairs: fieldPairsWIcon,
      id: 'meow'
    },
    LayerClasses
  ).filter(l => l.type === 'icon');

  t.equal(iconLayers.length, 1, 'should find 1 icon layer');
  t.equal(iconLayers[0].config.label, 'event icon', 'should find 1 icon layer');

  const fieldsWith2Icon = [...inputFields, ...nameIcon, ...eventIcon];
  const fieldPairsW2Icon = findPointFieldPairs(fieldsWith2Icon);

  iconLayers = findDefaultLayer(
    {
      fields: fieldsWith2Icon,
      fieldPairs: fieldPairsW2Icon,
      id: 'meow'
    },
    LayerClasses
  ).filter(l => l.type === 'icon');

  t.equal(iconLayers.length, 2, 'should find 2 icon layers');
  t.equal(iconLayers[0].config.label, 'name icon', 'should find 2 icon layer');

  t.end();
});

test('layerUtils -> findDefaultLayer: retains Point and Icon candidates', t => {
  const dataset = new KeplerTable({info: {id: 'icon-candidates'}}).updateSchema(
    processCsvData('lat,lon,icon\n37.77,-122.42,place')
  );
  t.deepEqual(
    findDefaultLayer(dataset, LayerClasses).map(layer => layer.type),
    ['point', 'icon'],
    'keeps both candidates available to callers requesting a specific layer type'
  );
  t.end();
});

test('layerUtils -> findDefaultLayer: TripLayer', t => {
  const stateWTrip = StateWTripGeojson;
  t.equal(stateWTrip.visState.layers.length, 1, 'should find one layer');
  const foundLayer = stateWTrip.visState.layers[0];
  t.equal(foundLayer.type, 'trip', 'should find a trip layer');

  const expectedConfig = {
    dataId: 'trip_data',
    label: 'Trip Data',
    columns: {
      geojson: {value: '_geojson', fieldIdx: 0},
      id: {value: null, fieldIdx: -1},
      lat: {value: null, fieldIdx: -1},
      lng: {value: null, fieldIdx: -1},
      timestamp: {value: null, fieldIdx: -1},
      altitude: {value: null, fieldIdx: -1, optional: true}
    },
    isVisible: true,
    columnMode: 'geojson',
    animation: {enabled: true, domain: timeStampDomain}
  };

  Object.keys(expectedConfig).forEach(key => {
    t.deepEqual(
      foundLayer.config[key],
      expectedConfig[key],
      `should set correct config.${key} domain`
    );
  });

  t.deepEqual(foundLayer.meta.bounds, tripBounds, 'should set correct bounds');
  t.deepEqual(foundLayer.meta.featureTypes, {line: true}, 'should set correct bounds');

  t.end();
});

test('layerUtils -> findDefaultLayer: TripLayer.1 -> no ts', async t => {
  // change 3rd coordinate to string
  const modified = tripGeojson.features.map(f => ({
    ...f,
    geometry: {
      ...f.geometry,
      coordinates: f.geometry.coordinates.map(coord => [...coord.slice(0, 3), 'hello'])
    }
  }));

  const noTripGeojson = {
    type: 'FeatureCollection',
    features: modified
  };

  const dataset = await createNewDataEntryMock({
    info: {id: 'taro'},
    data: processGeojson(noTripGeojson)
  });

  const layers = findDefaultLayer(dataset.taro, LayerClasses);

  t.equal(layers.length, 1, 'should find 1 layer');
  const foundLayer = layers[0];
  t.equal(foundLayer.type, 'geojson', 'should find a geojson layer');
  t.end();
});

test('layerUtils -> findDefaultLayer: TripLayer.1 -> ts as string', async t => {
  const tripData = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [-73.78966, 40.6429, 0, '2018-09-01 11:00'],
            [-73.7895, 40.64267, 0, '2018-09-01 11:01'],
            [-73.78923, 40.6424, 0, '2018-09-01 11:02'],
            [-73.78905, 40.64222, 0, '2018-09-01 11:03']
          ]
        }
      }
    ]
  };

  const dataset = await createNewDataEntryMock({
    info: {id: 'taro'},
    data: processGeojson(tripData)
  });

  const layers = findDefaultLayer(dataset.taro, LayerClasses);

  t.equal(layers.length, 1, 'should find 1 layer');
  const foundLayer = layers[0];
  t.equal(foundLayer.type, 'trip', 'should find a geojson layer');

  t.deepEqual(
    foundLayer.config.animation,
    {enabled: true, domain: [1535799600000, 1535799780000]},
    'should set correct animation domain'
  );
  t.end();
});

test('layerUtils -> getLayerHoverProp', t => {
  const initialVisState = cloneDeep(StateWFiles).visState;
  const tooltip = initialVisState.interactionConfig.tooltip;
  const visState = {
    ...initialVisState,
    interactionConfig: {
      ...initialVisState.interactionConfig,
      tooltip: {
        ...tooltip,
        config: {
          ...tooltip.config,
          timezone: 'America/Los_Angeles'
        }
      }
    }
  };
  const layer = visState.layers[0];
  const layerData = visState.layerData[0];
  const layersToRender = {
    [layer.id]: layer
  };

  const obj = layerData.data[0];

  const mockHoverInfo = {
    object: obj,
    picked: true,
    layer: {
      props: {
        idx: 0
      }
    }
  };
  const mockHoverInfoNotHovered = {
    picked: false,
    object: null
  };
  const args = {
    animationConfig: visState.animationConfig,
    interactionConfig: visState.interactionConfig,
    hoverInfo: mockHoverInfo,
    layers: visState.layers,
    layersToRender,
    datasets: visState.datasets
  };

  const expectedDataset = visState.datasets[layer.config.dataId];
  const expected = {
    data: expectedDataset.dataContainer.row(obj.index),
    fields: expectedDataset.fields,
    fieldsToShow: visState.interactionConfig.tooltip.config.fieldsToShow[layer.config.dataId],
    layer,
    currentTime: visState.animationConfig.currentTime,
    timezone: 'America/Los_Angeles'
  };

  t.deepEqual(getLayerHoverProp(args), expected, 'should get correct layerHoverProp');

  args.hoverInfo = mockHoverInfoNotHovered;
  t.deepEqual(getLayerHoverProp(args), null, 'should get correct layerHoverProp');

  visState.interactionConfig.tooltip.enabled = false;
  args.hoverInfo = mockHoverInfo;

  t.deepEqual(getLayerHoverProp(args), null, 'should get correct layerHoverProp');

  t.end();
});

test('layerUtils -> getLayerOrderFromLayers', t => {
  const visState = cloneDeep(StateWFiles).visState;
  const layerOrder = getLayerOrderFromLayers(visState.layers);

  t.deepEqual(layerOrder, ['point-0', 'geojson-1'], 'Should generate layerOrder correctly');
  t.end();
});

test('layerUtils -> aggregation tooltips evaluate only requested fields', t => {
  const layer = new KeplerGlLayers.HexagonLayer({id: 'tooltip', dataId: 'wide'});
  layer.updateLayerVisConfig({colorAggregation: 'sum'});
  let evaluations = 0;
  const fields = Array.from({length: 20}, (_, fieldIdx) => ({
    name: `field-${fieldIdx}`,
    type: 'real',
    fieldIdx,
    valueAccessor: d => {
      evaluations++;
      return d.index + fieldIdx;
    }
  }));
  const points = Array.from({length: 1000}, (_, index) => ({index}));
  const object = {points, colorValue: 3, elevationValue: 4};
  const requested = [{name: 'field-0'}, {name: 'field-19'}, {name: 'missing'}, {name: 'field-0'}];
  const args = {
    animationConfig: {currentTime: 5},
    interactionConfig: {
      tooltip: {enabled: true, config: {fieldsToShow: {wide: requested}, timezone: 'UTC'}}
    },
    hoverInfo: {picked: true, object, layer: {props: {idx: 0}}},
    layers: [layer],
    layersToRender: {[layer.id]: true},
    datasets: {wide: {fields, dataContainer: {}}}
  };
  const start = performance.now();
  const tooltip = getLayerHoverProp(args);
  t.comment(
    `1000 points x 20 fields, 2 requested: ${evaluations} accessor evaluations, ${(
      performance.now() - start
    ).toFixed(2)} ms`
  );
  t.equal(evaluations, 2000, 'only requested existing columns are evaluated once');
  t.deepEqual(
    Object.keys(tooltip.data.aggregatedData),
    ['field-0', 'field-19'],
    'tooltip contains requested aggregates'
  );
  t.equal(tooltip.data.aggregatedData['field-0'].value, 499500, 'first aggregate is unchanged');
  t.equal(tooltip.data.aggregatedData['field-19'].value, 518500, 'last aggregate is unchanged');
  t.equal(tooltip.data.points, points, 'bin points are preserved');
  t.equal(tooltip.fields, fields, 'full metadata remains available to the tooltip');
  t.equal(tooltip.fieldsToShow, requested, 'requested order and formatting remain unchanged');
  evaluations = 0;
  args.interactionConfig.tooltip.config.fieldsToShow.wide = [];
  t.deepEqual(
    getLayerHoverProp(args).data.aggregatedData,
    {},
    'empty selection computes no aggregates'
  );
  t.equal(evaluations, 0, 'point-count-only tooltip does no field work');
  delete args.interactionConfig.tooltip.config.fieldsToShow.wide;
  t.deepEqual(
    getLayerHoverProp(args).data.aggregatedData,
    {},
    'missing field selection computes no aggregates'
  );
  const full = layer.getHoverData(object, {}, fields);
  t.equal(
    Object.keys(full.aggregatedData).length,
    20,
    'direct callers retain full-field aggregation'
  );
  t.equal(evaluations, 20000, 'direct callers still evaluate all supplied fields');
  t.end();
});

test('layerUtils -> getNeighbors handles empty cells and preserves valid neighbors', t => {
  const neighborsField = {fieldIdx: 0};
  const cases = [
    {name: 'null cell', value: null, indices: []},
    {name: 'undefined cell', value: undefined, indices: []},
    {name: 'empty array', value: [], indices: []},
    {name: 'non-array cell', value: 'invalid', indices: []},
    {name: 'array cell', value: [2, 0], indices: [2, 0]},
    {name: 'Arrow vector', value: arrow.vectorFromArray([2, 0], new arrow.Int32()), indices: [2, 0]}
  ];

  for (const {name, value, indices} of cases) {
    const calls = [];
    const getPosition = ({index}) => {
      calls.push(index);
      return [index, index + 1];
    };
    const dataContainer = createDataContainer([[value]]);
    t.deepEqual(
      getNeighbors(neighborsField, dataContainer, 0, getPosition),
      indices.map(index => ({index, position: [index, index + 1]})),
      `${name} returns the expected neighbors`
    );
    t.deepEqual(calls, indices, `${name} only resolves valid neighbor positions`);
  }
  t.end();
});
