// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape-catch';
import cloneDeep from 'es-toolkit/compat/cloneDeep';
import {Layer, AggregationLayer, KeplerGlLayers} from '@kepler.gl/layers';
import {_compareProps} from '@deck.gl/core';
import {MAX_LATITUDE} from '@math.gl/web-mercator';
import {tableFromArrays} from 'apache-arrow';
import {getTextOffsetByRadius} from '../../../src/layers/src/layer-text-label';
import {getGpuFilterProps, KeplerTable} from '@kepler.gl/table';
import {INITIAL_MAP_STATE, INITIAL_VIS_STATE} from '@kepler.gl/reducers';
import {
  getLayerAnimatedConfig,
  getLayerAnimationDuration,
  getLayerAnimationOpacityFactor,
  getLayerAnimationTracks
} from '@kepler.gl/utils';

test('#BaseLayer -> updateLayerDomain', t => {
  const rows = [
    ['a', 3],
    ['b', 4],
    ['c', 1],
    ['d', null],
    ['e', 5],
    ['f', 0]
  ];
  const fields = [
    {
      name: 'f1'
    },
    {
      name: 'f2'
    }
  ];
  const dataset = new KeplerTable({
    info: {
      id: 'test'
    }
  });
  dataset.importData({
    data: {
      rows,
      fields
    }
  });

  dataset.filteredIndex = [0, 1, 2, 3];
  dataset.filteredIndexForDomain = [0, 1, 2, 3, 4];

  const mockLayer = new Layer({dataId: 'test'});

  mockLayer.updateLayerConfig({
    colorField: dataset.fields[1],
    colorDomain: [0, 1],
    colorScale: 'quantile',
    sizeField: null,
    sizeDomain: [0, 1]
  });

  const expectedDomain = [1, 3, 4, 5];
  let updatedLayer = mockLayer.updateLayerDomain({
    test: dataset
  });

  t.deepEqual(
    updatedLayer.config.colorDomain,
    expectedDomain,
    'should calculate layer color domain'
  );

  t.deepEqual(updatedLayer.config.sizeDomain, [0, 1], 'should not calculate layer size domain');

  mockLayer.updateLayerConfig({
    colorField: dataset.fields[0],
    colorDomain: [0, 1],
    colorScale: 'ordinal',
    sizeField: null,
    sizeDomain: [0, 1]
  });

  updatedLayer = mockLayer.updateLayerDomain({
    test: dataset
  });

  const expectedOrdinalDomain = ['a', 'b', 'c', 'd', 'e', 'f'];

  t.deepEqual(
    updatedLayer.config.colorDomain,
    expectedOrdinalDomain,
    'should calculate layer color domain based on ordinal domain'
  );

  const dataset2 = new KeplerTable({
    info: {
      id: 'test'
    }
  });
  dataset2.importData({
    data: {
      rows: [
        ['a', 3],
        ['b', 4],
        ['c', 1],
        ['d', null],
        ['e', 5],
        ['f', 0],
        ['g', 6]
      ],
      fields
    }
  });

  dataset2.filteredIndex = [0, 1, 2, 3];
  dataset2.filteredIndexForDomain = [0, 1, 2, 3, 4];
  updatedLayer = mockLayer.updateLayerDomain({test: dataset2}, {id: 'newFilter'});

  t.deepEqual(
    updatedLayer.config.colorDomain,
    expectedOrdinalDomain,
    'should skip domain calculation if field is ordinal'
  );

  t.end();
});

test('#BaseLayer -> getVisChannelScale, by zoom', t => {
  const scale = 'quantize';
  const domain = {
    z: [2, 3, 4, 5],
    stops: [
      [0, 20],
      [0, 30],
      [0, 40],
      [0, 50]
    ]
  };
  const range = ['#010101', '#020202', '#030303'];

  const mockLayer = new Layer({dataId: 'test'});

  const scaleFunc = mockLayer.getVisChannelScale(scale, domain, range);

  t.ok(scaleFunc.byZoom, true, 'should set by zoom to be truthy');
  const scale1 = scaleFunc(1);
  const scale2 = scaleFunc(3.2);
  const scale3 = scaleFunc(9);

  t.deepEqual(scale1.domain(), [0, 20], 'should set domain by zoom');
  t.deepEqual(scale1.range(), range, 'should set range');
  t.deepEqual(scale2.domain(), [0, 30], 'should set domain by zoom');
  t.deepEqual(scale3.domain(), [0, 50], 'should set domain by zoom');

  t.end();
});

test('#AggregationLayer -> updateLayerDomain', t => {
  const rows = [
    ['a', 3],
    ['b', 4],
    ['c', 1],
    ['d', null]
  ];

  const fields = [
    {
      name: 'f1'
    },
    {
      name: 'f2'
    }
  ];
  const dataset = new KeplerTable({
    info: {
      id: 'test'
    }
  });
  dataset.importData({
    data: {
      rows,
      fields
    }
  });

  const mockLayer = new AggregationLayer({dataId: 'test'});

  mockLayer.updateLayerConfig({
    colorField: dataset.fields[1],
    colorDomain: [0, 1],
    colorScale: 'quantile',
    sizeField: null,
    sizeDomain: [0, 1]
  });

  const updatedLayer = mockLayer.updateLayerDomain({test: dataset});
  t.deepEqual(
    updatedLayer.config.colorDomain,
    [0, 1],
    'should not calculate aggregation layer domain'
  );

  t.end();
});

test('#BaseLayer -> getAllPossibleColumnPairs', t => {
  const columnes1 = {
    a: [1, 2],
    b: [3, 4]
  };
  const columnes2 = {
    a: [1],
    b: [3, 4]
  };

  const columnes3 = {
    a: [1]
  };
  t.equal(Layer.getAllPossibleColumnPairs(columnes1).length, 4, 'should find 4 pairs');
  t.equal(Layer.getAllPossibleColumnPairs(columnes2).length, 2, 'should find 4 pairs');
  t.equal(Layer.getAllPossibleColumnPairs(columnes3).length, 1, 'should find 4 pairs');
  t.end();
});

test('#BaseLayer -> text offsets invalidate only for their inputs', t => {
  for (const LayerClass of [
    KeplerGlLayers.PointLayer,
    KeplerGlLayers.IconLayer,
    KeplerGlLayers.GeojsonLayer,
    KeplerGlLayers.TripLayer,
    KeplerGlLayers.H3Layer,
    AggregationLayer
  ]) {
    for (const arrow of [false, true]) {
      const layer = new LayerClass({id: 'text-offset', dataId: 'points'});
      layer.config.textLabel[0] = {
        ...layer.config.textLabel[0],
        field: {name: 'label'},
        anchor: 'start',
        alignment: 'bottom',
        size: 18,
        collisionEnabled: false
      };
      let camera = {latitude: 30, longitude: 0, zoom: 10, zoomOffset: 0};
      const data = {
        data: arrow ? tableFromArrays({label: ['x']}) : [{radius: 2}],
        textLabels: [{getText: () => 'x'}]
      };
      let triggers = {
        getRadius: {sizeField: 'radius'},
        getPointRadius: {radiusField: 'point-radius'}
      };
      const render = () =>
        layer.renderTextLabelLayer(
          {
            getPosition: () => [0, 0],
            getPixelOffset: getTextOffsetByRadius(
              layer.getRadiusScaleByZoom(camera),
              d => d.radius,
              camera
            ),
            updateTriggers: triggers,
            sharedProps: {}
          },
          {data, mapState: camera, visible: true}
        )[0];
      const first = render();
      const differs = next =>
        _compareProps({
          oldProps: first.props.updateTriggers.getPixelOffset,
          newProps: next.props.updateTriggers.getPixelOffset
        });
      let invalidations = 0;
      const start = performance.now();
      for (let i = 0; i < 100; i++) {
        camera = {
          ...camera,
          longitude: i,
          bearing: i,
          pitch: i / 2,
          width: 800 + i,
          isDragging: Boolean(i % 2),
          layerParameters: {blend: true}
        };
        if (differs(render())) invalidations++;
      }
      t.comment(
        `${
          layer.type
        }, Arrow=${arrow}: ${invalidations}/100 unrelated renders invalidate offsets (${(
          performance.now() - start
        ).toFixed(2)} ms)`
      );
      t.equal(invalidations, 0, 'unrelated map state does not rebuild label offsets');
      t.deepEqual(
        render().props.getPixelOffset({radius: 2}),
        first.props.getPixelOffset({radius: 2}),
        'offset values stay unchanged'
      );
      for (const [key, value] of [
        ['latitude', 45],
        ['zoom', 11],
        ['scale', 2000],
        ['zoomOffset', 2],
        ['globe', {enabled: true}]
      ]) {
        const previous = camera;
        camera = {...camera, [key]: value};
        t.ok(differs(render()), `${key} invalidates offsets`);
        camera = previous;
      }
      for (const [key, value] of [
        ['size', 30],
        ['anchor', 'end'],
        ['alignment', 'top'],
        ['offset', [4, 5]]
      ]) {
        const previous = layer.config.textLabel[0];
        layer.config.textLabel[0] = {...previous, [key]: value};
        t.ok(differs(render()), `label ${key} invalidates offsets`);
        layer.config.textLabel[0] = previous;
      }
      for (const key of ['getRadius', 'getPointRadius']) {
        const previous = triggers;
        triggers = {
          ...triggers,
          [key]: {[key === 'getRadius' ? 'sizeField' : 'radiusField']: 'replacement'}
        };
        t.ok(differs(render()), `${key} invalidates offsets`);
        triggers = previous;
      }
      layer.config.visConfig.radius = 42;
      t.ok(differs(render()), 'radius scale invalidates offsets');
    }
  }
  t.end();
});

test('#BaseLayer -> globe rotation preserves rendered layer sizes without changing map zoom', t => {
  const {
    PointLayer,
    IconLayer,
    GeojsonLayer,
    TripLayer,
    S2GeometryLayer,
    GeohashGeometryLayer,
    A5GeometryLayer,
    GridLayer,
    HexagonLayer,
    H3Layer,
    VectorTileLayer
  } = KeplerGlLayers;
  const outline = {
    cellOutline: [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 0]
    ]
  };
  const cases = [
    [PointLayer, ['radiusScale']],
    [IconLayer, ['radiusScale']],
    [GeojsonLayer, ['pointRadiusScale', 'lineWidthScale', 'elevationScale']],
    [TripLayer, ['widthScale']],
    [S2GeometryLayer, ['lineWidthScale', 'elevationScale']],
    [GeohashGeometryLayer, ['lineWidthScale', 'elevationScale']],
    [A5GeometryLayer, ['lineWidthScale', 'elevationScale']],
    [GridLayer, ['elevationScale'], outline],
    [HexagonLayer, ['elevationScale'], outline],
    [H3Layer, ['elevationScale'], {id: '8928308280fffff'}],
    [VectorTileLayer, ['elevationScale']]
  ];
  const camera = (latitude, visualZoom = 3, globe = true, zoomOffset = 0) => {
    // GlobeController preserves camera distance with this stored-zoom adjustment.
    const clampedLatitude = Math.max(-MAX_LATITUDE, Math.min(MAX_LATITUDE, latitude || 0));
    return Object.freeze({
      ...INITIAL_MAP_STATE,
      latitude,
      zoom: visualZoom + (globe ? Math.log2(Math.cos((clampedLatitude * Math.PI) / 180)) : 0),
      zoomOffset,
      globe: Object.freeze({enabled: globe})
    });
  };
  for (const [LayerClass, properties, hovered] of cases) {
    const layer = new LayerClass({id: `globe-sizing-${LayerClass.name}`, dataId: 'globe-sizing'});
    Object.assign(layer.config.visConfig, {
      fixedRadius: false,
      fixedHeight: false,
      enableElevationZoomFactor: true,
      enable3d: false
    });
    const data = {
      data: [],
      getPosition: () => [0, 0],
      getRadius: () => 2,
      getFilterValue: () => [0, 0, 0, 0],
      textLabels: [],
      textLabelData: [],
      ...(LayerClass === VectorTileLayer
        ? {tileSource: {getTileData: () => []}, tilesetDataUrl: 'https://example.com/{z}/{x}/{y}'}
        : {})
    };
    const render = mapState =>
      layer.renderLayer({
        data,
        mapState,
        idx: 0,
        visible: true,
        gpuFilter: getGpuFilterProps([], 'globe-sizing', []),
        interactionConfig: INITIAL_VIS_STATE.interactionConfig,
        animationConfig: {domain: [0, 1000], currentTime: 1},
        layerCallbacks: {},
        objectHovered: hovered
          ? {picked: true, layer: {props: {id: layer.id}}, object: hovered}
          : null
      });
    const equator = render(camera(0));
    const propertyPaths = properties.map(property => [0, property]);
    if (hovered) propertyPaths.push([1, 'lineWidthScale']);
    for (const [index, property] of propertyPaths) {
      t.ok(equator[index].props[property] > 0, `${layer.type} renders ${property}`);
    }
    for (const latitude of [-90, -75, -60, 60, 75, 90, undefined]) {
      const mapState = camera(latitude);
      const storedZoom = mapState.zoom;
      const rotated = render(mapState);
      for (const [index, property] of propertyPaths) {
        t.ok(
          Math.abs(rotated[index].props[property] / equator[index].props[property] - 1) < 1e-9,
          `${layer.type} ${property} stays stable at latitude ${latitude}`
        );
      }
      t.equal(mapState.zoom, storedZoom, `${layer.type} preserves stored map zoom`);
      t.equal(rotated[0].props.data, equator[0].props.data, `${layer.type} reuses rendered data`);
    }
    const flatEquator = render(camera(0, 3, false));
    const flatNorth = render(camera(60, 3, false));
    const zoomed = render(camera(60, 4));
    const exported = render(camera(60, 4, true, 1));
    for (const [index, property] of propertyPaths) {
      t.equal(
        flatNorth[index].props[property],
        flatEquator[index].props[property],
        `${layer.type} ${property} retains 2D sizing`
      );
      t.ok(
        Math.abs(zoomed[index].props[property] / equator[index].props[property] - 0.5) < 1e-9,
        `${layer.type} ${property} responds to actual zoom`
      );
      t.ok(
        Math.abs(exported[index].props[property] / equator[index].props[property] - 1) < 1e-9,
        `${layer.type} ${property} applies export zoom offset once`
      );
    }
  }
  t.end();
});

test('#BaseLayer -> globe sizing preserves fixed modes and high-zoom limits', t => {
  const mapState = {zoom: 2, latitude: 60, globe: {enabled: true}};
  for (const LayerClass of [
    KeplerGlLayers.PointLayer,
    KeplerGlLayers.IconLayer,
    KeplerGlLayers.GeojsonLayer
  ]) {
    const layer = new LayerClass({id: 'fixed-radius'});
    t.equal(
      layer.getRadiusScaleByZoom(mapState, true),
      1,
      `${layer.type} retains fixed-meter radii`
    );
  }
  for (const LayerClass of [
    AggregationLayer,
    KeplerGlLayers.H3Layer,
    KeplerGlLayers.S2GeometryLayer,
    KeplerGlLayers.GeohashGeometryLayer,
    KeplerGlLayers.A5GeometryLayer,
    KeplerGlLayers.VectorTileLayer,
    KeplerGlLayers.GeojsonLayer
  ]) {
    const layer = new LayerClass({id: 'fixed-height'});
    layer.config.visConfig.fixedHeight = true;
    t.equal(layer.getElevationZoomFactor(mapState), 1, `${layer.type} retains fixed heights`);
    layer.config.visConfig.fixedHeight = false;
    layer.config.visConfig.enableElevationZoomFactor = false;
    t.equal(
      layer.getElevationZoomFactor(mapState),
      LayerClass === KeplerGlLayers.GeojsonLayer ? 32 : 1,
      `${layer.type} preserves legacy elevation-zoom behavior`
    );
    layer.config.visConfig.enableElevationZoomFactor = true;
    t.equal(
      layer.getElevationZoomFactor({...mapState, zoom: 12}),
      1,
      `${layer.type} retains its high-zoom height floor`
    );
  }
  const base = new Layer({id: 'zoom-floor'});
  const icon = new KeplerGlLayers.IconLayer({id: 'icon-zoom-floor'});
  t.equal(
    base.getZoomFactor({...mapState, zoom: 15}),
    1,
    'shared sizes stop shrinking at high zoom'
  );
  t.equal(
    icon.getZoomFactor({...mapState, zoom: 15}),
    0.25,
    'icons retain their uncapped zoom scaling'
  );
  t.end();
});

test('#BaseLayer -> changing layer type preserves independent animation tracks', t => {
  const transition = {
    id: 'transition',
    startTimeMs: 1000,
    endTimeMs: 3000,
    startValue: 0.2,
    endValue: 0.8,
    easing: 'linear'
  };
  const color = {...transition, startValue: [0, 20, 40], endValue: [100, 120, 200]};
  const source = new KeplerGlLayers.PointLayer({id: 'animated-point'});
  source.updateLayerVisConfig({outline: true, fixedRadius: false});
  source.updateLayerConfig({
    propertyTransitions: {
      opacity: [transition],
      color: [color],
      radius: [{...transition, startValue: 10, endValue: 20}],
      strokeColor: [color],
      futureProperty: [{...transition, endTimeMs: 50000}]
    },
    opacityTransitions: [{...transition, startValue: 0, endValue: 0}],
    visibilityTiming: {startTimeMs: 5000, fadeInMs: 1000, fadeOutMs: 0}
  });
  const original = cloneDeep(source.config);
  const destination = new KeplerGlLayers.IconLayer({id: 'animated-icon'});
  destination.assignConfigToLayer(source.config, source.visConfigSettings);
  for (const key of ['propertyTransitions', 'opacityTransitions', 'visibilityTiming']) {
    t.deepEqual(destination.config[key], source.config[key], `${key} survives type changes`);
    t.notEqual(destination.config[key], source.config[key], `${key} is independently cloned`);
  }
  t.notEqual(
    destination.config.propertyTransitions.color[0].startValue,
    source.config.propertyTransitions.color[0].startValue,
    'color endpoints are independently cloned'
  );
  t.notEqual(
    destination.config.opacityTransitions[0],
    source.config.opacityTransitions[0],
    'legacy opacity blocks are independently cloned'
  );
  t.deepEqual(
    getLayerAnimationTracks(destination)
      .map(({property}) => property.name)
      .sort(),
    ['color', 'opacity', 'radius'],
    'unsupported tracks remain saved but inactive'
  );
  t.deepEqual(
    getLayerAnimatedConfig(destination, 2000),
    {color: [50, 70, 120], visConfig: {radius: 15}},
    'supported color and numeric values still animate after type change'
  );
  t.equal(
    getLayerAnimationOpacityFactor(destination, 2000),
    0.5,
    'explicit opacity still overrides legacy timing'
  );
  t.equal(
    getLayerAnimationDuration([destination]),
    3000,
    'unsupported tracks do not extend playback'
  );
  const restored = new KeplerGlLayers.PointLayer({id: 'restored-point'});
  restored.assignConfigToLayer(destination.config, destination.visConfigSettings);
  restored.updateLayerVisConfig({outline: true});
  t.deepEqual(
    restored.config.propertyTransitions.strokeColor,
    source.config.propertyTransitions.strokeColor,
    'switching back recovers an unsupported track'
  );
  t.deepEqual(
    getLayerAnimatedConfig(restored, 2000).visConfig.strokeColor,
    [50, 70, 120],
    'recovered stroke color animates once supported'
  );
  destination.config.propertyTransitions.color[0].startValue[0] = 99;
  t.deepEqual(
    source.config,
    original,
    'editing destination transitions does not mutate source config'
  );
  t.end();
});

test('#BaseLayer -> changing layer type preserves empty tracks and legacy precedence', t => {
  const timing = {startTimeMs: 1000, endTimeMs: 4000, fadeInMs: 1000, fadeOutMs: 1000};
  const transition = {
    id: 'legacy',
    startTimeMs: 1000,
    endTimeMs: 3000,
    startValue: 0,
    endValue: 0,
    easing: 'linear'
  };
  const cases = [
    {
      config: {
        propertyTransitions: {opacity: []},
        opacityTransitions: [transition],
        visibilityTiming: timing
      },
      factor: 1
    },
    {
      config: {propertyTransitions: {}, opacityTransitions: [], visibilityTiming: timing},
      factor: 1
    },
    {config: {opacityTransitions: [transition], visibilityTiming: timing}, factor: 0},
    {config: {visibilityTiming: timing}, factor: 0.5},
    {config: {}, factor: 1}
  ];
  for (const {config, factor} of cases) {
    const source = new KeplerGlLayers.PointLayer({id: 'source', ...config});
    const destination = new KeplerGlLayers.IconLayer({id: 'destination'});
    destination.assignConfigToLayer(source.config, source.visConfigSettings);
    for (const key of ['propertyTransitions', 'opacityTransitions', 'visibilityTiming']) {
      t.equal(
        Object.prototype.hasOwnProperty.call(destination.config, key),
        Object.prototype.hasOwnProperty.call(config, key),
        `${key} retains its optional shape`
      );
      t.deepEqual(destination.config[key], config[key], `${key} retains its contents`);
    }
    t.equal(
      getLayerAnimationOpacityFactor(destination, 1500),
      factor,
      'empty or legacy timing retains its precedence'
    );
  }
  t.end();
});

test('#BaseLayer -> changing layer type normalizes malformed animation input', t => {
  const source = new KeplerGlLayers.PointLayer({id: 'source'});
  const destination = new KeplerGlLayers.IconLayer({id: 'destination'});
  const config = {
    ...source.config,
    propertyTransitions: {
      color: [
        {
          id: 'bad-color',
          startTimeMs: 0,
          endTimeMs: 1000,
          startValue: [0, 0, 0],
          endValue: [256, 0, 0],
          easing: 'linear'
        }
      ]
    },
    opacityTransitions: [
      {
        id: 'bad-opacity',
        startTimeMs: 0,
        endTimeMs: 1000,
        startValue: 0,
        endValue: 2,
        easing: 'linear'
      }
    ],
    visibilityTiming: {startTimeMs: 2000, endTimeMs: 1000, fadeInMs: 0, fadeOutMs: 0}
  };
  destination.assignConfigToLayer(config, source.visConfigSettings);
  for (const key of ['propertyTransitions', 'opacityTransitions', 'visibilityTiming']) {
    t.notOk(
      Object.prototype.hasOwnProperty.call(destination.config, key),
      `malformed ${key} is removed through normalization`
    );
    t.ok(Object.prototype.hasOwnProperty.call(config, key), `source ${key} is left untouched`);
  }
  t.equal(
    getLayerAnimationOpacityFactor(destination, 500),
    1,
    'invalid timing cannot hide the destination'
  );
  t.deepEqual(
    getLayerAnimatedConfig(destination, 500),
    {},
    'invalid color cannot override the destination'
  );
  t.end();
});

test('#BaseLayer -> render helpers follow config replacement without mutating prior values', t => {
  const layer = new KeplerGlLayers.PointLayer({id: 'frame-point'});
  layer.updateLayerVisConfig({radius: 10, fixedRadius: false, outline: true});
  const authored = cloneDeep(layer.config);
  const originalConfig = layer.config;
  layer.config = {
    ...layer.config,
    color: [10, 30, 50],
    visConfig: {...layer.config.visConfig, radius: 25, strokeColor: [100, 120, 140], opacity: 0.4}
  };
  const mapState = {...INITIAL_MAP_STATE, zoom: 14};
  t.equal(layer.getRadiusScaleByZoom(mapState), 25, 'radius helper reads the frame value');
  t.equal(
    layer.getRadiusScaleByZoom(mapState, true),
    1,
    'explicit fixed radius keeps its existing behavior'
  );
  const frameTriggers = layer.getVisualChannelUpdateTriggers();
  t.deepEqual(
    frameTriggers.getFillColor.defaultValue,
    [10, 30, 50],
    'fill color trigger uses frame color'
  );
  t.deepEqual(
    frameTriggers.getLineColor.defaultValue,
    [100, 120, 140],
    'stroke color trigger uses frame stroke color'
  );
  const opts = {idx: 0, gpuFilter: null, mapState, layerCallbacks: {}, visible: true};
  t.equal(
    layer.getDefaultDeckLayerProps(opts).opacity,
    0.4,
    'default deck props use frame opacity'
  );
  layer.config = originalConfig;
  t.equal(
    layer.getDefaultDeckLayerProps(opts).opacity,
    authored.visConfig.opacity,
    'restoring config recovers static props'
  );
  t.equal(layer.getRadiusScaleByZoom(mapState), 10, 'static radius remains authored');
  t.deepEqual(
    layer.getVisualChannelUpdateTriggers().getFillColor.defaultValue,
    authored.color,
    'static triggers remain authored'
  );
  t.deepEqual(layer.config, authored, 'render helpers never write frame values to saved config');
  t.end();
});
