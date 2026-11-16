// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import sinon from 'sinon';
import {LayerManager, WebMercatorViewport} from '@deck.gl/core';
import {PathLayer} from '@deck.gl/layers';
import {ScenegraphLayer} from '@deck.gl/mesh-layers';
import {TRIP_LAYER_SCENEGRAPH_MODELS} from '@kepler.gl/constants';
import {device} from '@deck.gl/test-utils';
import React from 'react';
import {render} from '@testing-library/react';
import {ThemeProvider} from 'styled-components';
import {theme} from '@kepler.gl/styles';
import {LayerLegendContentFactory, appInjector} from '@kepler.gl/components';
import {IntlWrapper} from 'test/helpers/component-utils';

import {
  testCreateCases,
  testFormatLayerDataCases,
  testRenderLayerCases
} from 'test/helpers/layer-utils';
import {KeplerGlLayers, LayerClasses} from '@kepler.gl/layers';
import {VisStateActions} from '@kepler.gl/actions';
import {
  INITIAL_VIS_STATE,
  computeDeckLayers,
  validateLayerWithData,
  visStateReducer
} from '@kepler.gl/reducers';
import {getGpuFilterProps, KeplerTable} from '@kepler.gl/table';
import {processCsvData, processGeojson} from '@kepler.gl/processors';
import {findPointFieldPairs} from '@kepler.gl/table';

const {FlowFieldLayer} = KeplerGlLayers;

const dataId = 'flow-field-test-data';
const flowCsv = `latitude,longitude,u,v
37.0,-122.0,1.0,0.5
37.5,-122.0,1.1,0.4
38.0,-122.0,0.9,0.6
37.0,-121.5,1.2,0.3
37.5,-121.5,1.0,0.5
38.0,-121.5,0.8,0.7
37.0,-121.0,1.3,0.2
37.5,-121.0,0.95,0.55
38.0,-121.0,0.85,0.65
`;

const elevCsv = `latitude,longitude,elevation
37.0,-122.0,10
37.5,-122.0,20
38.0,-122.0,15
37.0,-121.5,25
37.5,-121.5,30
38.0,-121.5,18
37.0,-121.0,12
37.5,-121.0,22
38.0,-121.0,16
`;

const speedDirCsv = `latitude,longitude,speed,direction
37.0,-122.0,10,0
37.5,-122.0,10,90
38.0,-122.0,10,180
37.0,-121.5,10,270
37.5,-121.5,8,45
38.0,-121.5,8,135
37.0,-121.0,12,225
37.5,-121.0,12,315
38.0,-121.0,5,0
`;

const {rows, fields} = processCsvData(flowCsv);

function createDatasetFromCsv(csv, id = dataId) {
  const parsed = processCsvData(csv);
  const dataset = new KeplerTable({
    info: {id, label: id},
    color: [255, 255, 255]
  });
  dataset.importData({
    data: {fields: parsed.fields, rows: parsed.rows}
  });
  dataset.fieldPairs = findPointFieldPairs(dataset.fields);
  dataset.gpuFilter = getGpuFilterProps([], id, dataset.fields);
  return dataset;
}

function createFlowFieldDataset() {
  return createDatasetFromCsv(flowCsv, dataId);
}

test('#FlowFieldLayer -> constructor', t => {
  const TEST_CASES = [
    {
      props: {
        dataId: 'smoothie',
        isVisible: true,
        label: 'test flow field layer'
      },
      test: layer => {
        t.ok(layer.config, 'should create a layer config');
        t.equal(layer.type, 'flowField', 'should have type flowField');
        t.equal(layer.name, 'Flow Field', 'should have name Flow Field');
        t.equal(layer.config.visConfig.linesPerScreen, 7500, 'default linesPerScreen');
        t.equal(layer.config.visConfig.cycleSeconds, 20, 'default cycleSeconds');
        t.equal(layer.config.visConfig.smoothing, 4, 'default smoothing');
        t.deepEqual(layer.config.color, [255, 255, 255], 'default color white');
        t.equal(layer.supportedColumnModes.length, 3, 'should have 3 column modes');
        t.ok(
          layer.supportedColumnModes.every(
            m =>
              Array.isArray(m.columnGroups) &&
              m.columnGroups.some(g => g.key === 'latlng') &&
              m.columnGroups.some(g => g.key === 'geojson')
          ),
          'each mode should expose Lat/Lng and GeoJSON position tabs'
        );
      }
    }
  ];

  testCreateCases(t, FlowFieldLayer, TEST_CASES);
  t.end();
});

test('#FlowFieldLayer -> findDefaultLayerProps', t => {
  const dataset = createFlowFieldDataset();
  const {props} = FlowFieldLayer.findDefaultLayerProps(dataset);
  t.equal(props.length, 1, 'should find one default flow field layer');
  t.equal(props[0].columnMode, 'UV', 'should use UV mode');
  t.ok(props[0].columns.lat, 'should set lat');
  t.ok(props[0].columns.lng, 'should set lng');
  t.ok(props[0].columns.u, 'should set u');
  t.ok(props[0].columns.v, 'should set v');
  t.end();
});

test('#FlowFieldLayer -> formatLayerData', t => {
  const dataset = createFlowFieldDataset();
  const TEST_CASES = [
    {
      name: 'flow field uv',
      layer: {
        type: 'flowField',
        id: 'flow_field_uv',
        config: {
          dataId,
          label: 'flow field',
          columnMode: 'UV',
          columns: {
            lat: 'latitude',
            lng: 'longitude',
            u: 'u',
            v: 'v'
          },
          isVisible: true
        }
      },
      datasets: {
        [dataId]: dataset
      },
      assert: result => {
        const {layerData, layer} = result;
        t.deepEqual(layer.meta.bounds, [-122, 37, -121, 38], 'zoom bounds follow selected lat/lng');
        t.ok(layerData.grid, 'should build a grid');
        t.ok(layerData.data?.length >= 4, 'should keep sample points');
        t.ok(Number.isFinite(layerData.grid.maxSpeed), 'grid has maxSpeed');
        t.equal(layerData.grid.alt, null, 'should not invent a zero altitude grid');
      }
    }
  ];

  testFormatLayerDataCases(t, FlowFieldLayer, TEST_CASES);
  t.end();
});

test('#FlowFieldLayer -> zoom bounds update with positions and clear when unavailable', t => {
  const dataset = createFlowFieldDataset();
  const layer = validateLayerWithData(
    dataset,
    {
      type: 'flowField',
      config: {
        dataId,
        columns: {lat: 'latitude', lng: 'longitude', u: 'u', v: 'v'}
      }
    },
    LayerClasses
  );
  const columns = layer.config.columns;
  const withRows = inputRows => {
    const replacement = new KeplerTable({info: {id: dataId}, color: [255, 255, 255]});
    replacement.importData({data: {fields: dataset.fields, rows: inputRows}});
    return replacement;
  };
  const format = input => layer.formatLayerData({[dataId]: input});

  format(dataset);
  const point = validateLayerWithData(
    dataset,
    {type: 'point', config: {dataId, columns: {lat: 'latitude', lng: 'longitude'}}},
    LayerClasses
  );
  point.formatLayerData({[dataId]: dataset});
  t.deepEqual(
    layer.meta.bounds,
    point.meta.bounds,
    'flow and point layers have the same zoom bounds'
  );

  layer.updateLayerConfig({columns: {...columns, lat: columns.v, lng: columns.u}});
  format(dataset);
  t.deepEqual(
    layer.meta.bounds,
    [0.8, 0.2, 1.3, 0.7],
    'changing position columns updates zoom bounds'
  );
  layer.updateLayerConfig({columns});

  const mixed = withRows([
    [0, 0, null, null],
    [10, 20, null, null],
    [null, -150, 1, 1],
    [80, undefined, 1, 1],
    [NaN, 100, 1, 1],
    [90, Infinity, 1, 1]
  ]);
  mixed.filteredIndex = [];
  format(mixed);
  t.deepEqual(
    layer.meta.bounds,
    [0, 0, 20, 10],
    'bounds include valid positions regardless of flow values or filters and exclude invalid pairs'
  );

  for (const [label, input] of [
    ['empty data', withRows([])],
    [
      'invalid positions',
      withRows([
        [null, null, 1, 1],
        [NaN, Infinity, 1, 1]
      ])
    ],
    ['missing dataset', undefined]
  ]) {
    format(dataset);
    format(input);
    t.equal(layer.meta.bounds, null, `${label} clears previous zoom bounds`);
  }

  format(dataset);
  layer.updateLayerConfig({columns: {...columns, lat: {value: null, fieldIdx: -1}}});
  format(dataset);
  t.equal(layer.meta.bounds, null, 'clearing a position column clears previous zoom bounds');
  t.end();
});

test('#FlowFieldLayer -> reducer clears stale zoom bounds when position columns change', t => {
  const dataset = new KeplerTable({info: {id: dataId}, color: [255, 255, 255]});
  const positions = [
    [-122, 37],
    [-121, 37],
    [-122, 38],
    [-121, 38]
  ];
  dataset.importData({
    data: processGeojson({
      type: 'FeatureCollection',
      features: positions.map(([longitude, latitude], index) => ({
        type: 'Feature',
        geometry: {type: 'Point', coordinates: [longitude, latitude]},
        properties: {latitude, longitude, u: 1 + (index % 2), v: index < 2 ? 10 : 20}
      }))
    })
  });
  const datasets = {[dataId]: dataset};
  const bounds = [-122, 37, -121, 38];
  const empty = {value: null, fieldIdx: -1};

  for (const positionKey of ['lat', 'lng', 'geojson']) {
    const layer = validateLayerWithData(
      dataset,
      {
        type: 'flowField',
        config: {
          dataId,
          columns: {
            ...(positionKey === 'geojson'
              ? {geojson: '_geojson'}
              : {lat: 'latitude', lng: 'longitude'}),
            u: 'u',
            v: 'v'
          }
        }
      },
      LayerClasses
    );
    const columns = layer.config.columns;
    let state = {
      ...INITIAL_VIS_STATE,
      datasets,
      layers: [layer],
      layerData: [layer.formatLayerData(datasets)]
    };
    const changeColumns = nextColumns => {
      state = visStateReducer(
        state,
        VisStateActions.layerConfigChange(state.layers[0], {columns: nextColumns})
      );
    };

    t.deepEqual(state.layers[0].meta.bounds, bounds, `${positionKey}: initial zoom bounds`);
    changeColumns({...columns, [positionKey]: empty});
    t.deepEqual(state.layerData[0], {}, `${positionKey}: incomplete columns clear layer data`);
    t.equal(
      state.layers[0].meta.bounds,
      null,
      `${positionKey}: clearing a position clears bounds even when formatting is skipped`
    );
    changeColumns(columns);
    t.deepEqual(
      state.layers[0].meta.bounds,
      bounds,
      `${positionKey}: restoring positions restores zoom bounds`
    );

    if (positionKey === 'lat') {
      changeColumns({...columns, u: empty});
      t.deepEqual(
        state.layers[0].meta.bounds,
        bounds,
        'missing flow values retain position bounds'
      );
      changeColumns({...columns, u: empty, lat: columns.v, lng: columns.u});
      t.equal(
        state.layers[0].meta.bounds,
        null,
        'changing positions with an incomplete flow configuration clears the previous extent'
      );
      changeColumns({...columns, lat: columns.v, lng: columns.u});
      t.deepEqual(
        state.layers[0].meta.bounds,
        [1, 10, 2, 20],
        'restoring the flow configuration calculates bounds from the new position columns'
      );
      state = visStateReducer(
        state,
        VisStateActions.layerConfigChange(state.layers[0], {dataId: null})
      );
      t.equal(state.layers[0].meta.bounds, null, 'clearing the dataset clears zoom bounds');
      t.deepEqual(state.layerData[0], {}, 'clearing the dataset clears layer data');
    }
  }
  t.end();
});

test('#FlowFieldLayer -> findDefaultLayerProps altitude', t => {
  const dataset = createDatasetFromCsv(elevCsv, 'elev-data');
  const {props} = FlowFieldLayer.findDefaultLayerProps(dataset);
  t.equal(props.length, 0, 'should not auto-create from altitude alone');
  t.end();
});

test('#FlowFieldLayer -> formatLayerData from altitude', t => {
  const dataset = createDatasetFromCsv(elevCsv, dataId);
  const TEST_CASES = [
    {
      name: 'flow field altitude',
      layer: {
        type: 'flowField',
        id: 'flow_field_alt',
        config: {
          dataId,
          label: 'flow field altitude',
          columnMode: 'ELEVATION',
          columns: {
            lat: 'latitude',
            lng: 'longitude',
            altitude: 'elevation'
          },
          isVisible: true
        }
      },
      datasets: {
        [dataId]: dataset
      },
      assert: result => {
        const {layerData, layer} = result;
        t.deepEqual(layer.meta.bounds, [-122, 37, -121, 38], 'altitude mode exposes zoom bounds');
        t.ok(layerData.grid, 'should build a grid from altitude');
        t.ok(layerData.grid.alt, 'grid should keep altitude for path Z');
        t.ok(Number.isFinite(layerData.grid.maxSpeed), 'grid has maxSpeed from slope');
        t.ok(layerData.grid.maxSpeed > 0, 'downhill gradient should be non-zero');
      }
    }
  ];

  testFormatLayerDataCases(t, FlowFieldLayer, TEST_CASES);
  t.end();
});

test('#FlowFieldLayer -> findDefaultLayerProps speed/direction', t => {
  const dataset = createDatasetFromCsv(speedDirCsv, 'speed-dir-data');
  const {props} = FlowFieldLayer.findDefaultLayerProps(dataset);
  t.equal(props.length, 0, 'should not auto-create from speed/direction alone');
  t.end();
});

test('#FlowFieldLayer -> formatLayerData from speed/direction', t => {
  const dataset = createDatasetFromCsv(speedDirCsv, dataId);
  const TEST_CASES = [
    {
      name: 'flow field speed dir',
      layer: {
        type: 'flowField',
        id: 'flow_field_speed',
        config: {
          dataId,
          label: 'flow field speed',
          columnMode: 'SPEED_DIR',
          columns: {
            lat: 'latitude',
            lng: 'longitude',
            speed: 'speed',
            direction: 'direction'
          },
          isVisible: true
        }
      },
      datasets: {
        [dataId]: dataset
      },
      assert: result => {
        const {layerData, layer} = result;
        t.deepEqual(
          layer.meta.bounds,
          [-122, 37, -121, 38],
          'speed/direction mode exposes zoom bounds'
        );
        t.ok(layerData.grid, 'should build a grid from speed/direction');
        t.ok(layerData.data?.length >= 4, 'should keep sample points');
        // Meteorological from-direction 0° (from N) → u=0, v=-speed
        const north = layerData.data.find(d => d.lat === 37 && d.lng === -122);
        t.ok(north, 'should include first point');
        t.ok(Math.abs(north.u) < 1e-6, 'from-north wind has ~0 eastward u');
        t.ok(north.v < 0, 'from-north wind has negative northward v');
      }
    }
  ];

  testFormatLayerDataCases(t, FlowFieldLayer, TEST_CASES);
  t.end();
});

test('#FlowFieldLayer -> excludes missing wind values before building the grid', t => {
  const validRows = [
    [37, -122, 0, 0],
    [37.5, -122, 10, 0],
    [37, -121.5, 20, 90],
    [37.5, -121.5, 30, 180]
  ];
  const invalidRows = [
    [38, -121, null, 90],
    [38.5, -120.5, 10, null],
    [39, -120, null, null],
    [39.5, -119.5, undefined, 90],
    [40, -119, 10, undefined],
    [40.5, -118.5, NaN, 90],
    [41, -118, 10, Infinity]
  ];

  for (const columnMode of ['SPEED_DIR', 'UV']) {
    const speedMode = columnMode === 'SPEED_DIR';
    const parsed = processCsvData(speedMode ? speedDirCsv : flowCsv);
    const format = inputRows => {
      const dataset = new KeplerTable({info: {id: dataId}, color: [255, 255, 255]});
      dataset.importData({data: {fields: parsed.fields, rows: inputRows}});
      const layer = validateLayerWithData(
        dataset,
        {
          type: 'flowField',
          config: {
            dataId,
            columnMode,
            columns: {
              lat: 'latitude',
              lng: 'longitude',
              ...(speedMode ? {speed: 'speed', direction: 'direction'} : {u: 'u', v: 'v'})
            },
            visConfig: {smoothing: 0}
          }
        },
        LayerClasses
      );
      return layer.formatLayerData({[dataId]: dataset});
    };

    const clean = format(validRows);
    const mixed = format([...validRows, ...invalidRows]);
    t.equal(clean.data.length, 4, `${columnMode}: keeps zero and nonzero wind values`);
    t.equal(Math.hypot(clean.data[0].u, clean.data[0].v), 0, `${columnMode}: keeps calm wind`);
    if (speedMode) {
      t.equal(clean.data[1].v, -10, 'zero direction retains wind blowing from north');
    }
    t.ok(clean.grid, `${columnMode}: valid values build a grid`);
    t.deepEqual(mixed.data, clean.data, `${columnMode}: excludes null and nonfinite wind samples`);
    t.deepEqual(mixed.grid, clean.grid, `${columnMode}: missing values cannot affect the grid`);

    const missing = format(invalidRows);
    t.deepEqual(missing.data, [], `${columnMode}: all missing values leave no samples`);
    t.equal(missing.grid, null, `${columnMode}: all missing values leave no grid`);
  }
  t.end();
});

test('#FlowFieldLayer -> renderLayer', t => {
  const dataset = createFlowFieldDataset();
  const TEST_CASES = [
    {
      name: 'flow field render uv',
      layer: {
        type: 'flowField',
        id: 'flow_field_render',
        config: {
          dataId,
          label: 'flow field',
          columnMode: 'UV',
          columns: {
            lat: 'latitude',
            lng: 'longitude',
            u: 'u',
            v: 'v'
          },
          isVisible: true,
          visConfig: {
            linesPerScreen: 200,
            smoothing: 0
          }
        }
      },
      datasets: {
        [dataId]: dataset
      },
      assert: (deckLayers, layer) => {
        t.equal(layer.type, 'flowField', 'should be flowField layer');
        t.ok(Array.isArray(deckLayers), 'should return deck layers array');
        t.ok(deckLayers.length >= 1, 'should create at least one deck.gl layer');
        t.equal(deckLayers[0].id, 'flow_field_render', 'deck layer id matches');
      }
    }
  ];

  testRenderLayerCases(t, FlowFieldLayer, TEST_CASES);
  t.end();
});

test('#FlowFieldLayer -> cached trails avoid buffer updates and retain invalidation', t => {
  const clock = sinon.useFakeTimers();
  const dataset = createFlowFieldDataset();
  const layer = validateLayerWithData(
    dataset,
    {
      id: 'cached-trails',
      type: 'flowField',
      config: {
        dataId,
        columnMode: 'UV',
        columns: {lat: 'latitude', lng: 'longitude', u: 'u', v: 'v'},
        visConfig: {linesPerScreen: 100, smoothing: 0, colorBySpeed: true}
      }
    },
    LayerClasses
  );
  let data = layer.formatLayerData({[dataId]: dataset});
  let mapState = {longitude: -121.8, latitude: 37.25, zoom: 11, width: 800, height: 600};
  const manager = new LayerManager(device, {viewport: new WebMercatorViewport(mapState)});
  manager.setProps({
    onError: error => {
      throw error;
    }
  });
  const render = (extra = {}) => layer.renderLayer({data, mapState, ...extra})[0];
  const update = deckLayer => {
    manager.setProps({viewport: new WebMercatorViewport(mapState)});
    manager.setLayers([deckLayer]);
    return manager.getLayers()[0];
  };
  const spies = [];
  try {
    const first = update(render());
    const trips = first.props.data;
    t.ok(trips.length > 0, 'fixture generates trails');
    const attributes = first.getAttributeManager().getAttributes();
    const names = ['vertexPositions', 'timestamps', 'instanceColors'];
    names.forEach(name => spies.push(sinon.spy(attributes[name], 'updateBuffer')));
    const counts = () => spies.map(spy => spy.callCount);
    const reset = () => spies.forEach(spy => spy.reset());

    for (let i = 0; i < 20; i++) {
      if (i % 2) mapState = {...mapState, longitude: mapState.longitude + 0.001};
      const next = render({objectHovered: {index: i}});
      t.ok(next.props.data === trips, 'hover and moving-camera renders retain the trail array');
      update(next);
    }
    t.deepEqual(
      counts(),
      [0, 0, 0],
      '20 hover/pan updates do not rebuild paths, timestamps or colors'
    );

    layer.updateLayerVisConfig({opacity: 0.4, colorRange: {colors: ['#ff0000', '#0000ff']}});
    const colored = update(render());
    t.equal(colored.props.data, trips, 'color changes keep cached geometry');
    t.deepEqual(counts(), [0, 0, 1], 'color changes update only the color buffer');
    t.equal(attributes.instanceColors.value[3], 102, 'updated opacity reaches the color buffer');
    reset();

    layer.updateLayerVisConfig({cycleSeconds: 7, trailLength: 30, strokeWidth: 2});
    const styled = update(render());
    t.equal(styled.props.cycleSeconds, 7, 'animation cycle changes reach the renderer');
    t.equal(styled.props.trailLength, 0.3, 'trail length changes reach the renderer');
    t.equal(styled.props.getWidth, 2, 'stroke width changes reach the renderer');
    t.deepEqual(counts(), [0, 0, 0], 'uniform and width changes do not rebuild trail buffers');

    layer.updateLayerVisConfig({elevationMultiplier: 2});
    update(render());
    t.ok(spies[0].calledOnce, 'elevation changes still refresh the path buffer');
    reset();

    clock.tick(1000);
    const settled = update(render());
    t.notEqual(settled.props.data, trips, 'settling a pan collects the new seed window');
    t.deepEqual(counts(), [1, 1, 1], 'new seed window rebuilds trail buffers');
    reset();

    let previousTrips = settled.props.data;
    for (const change of [{seamlessLoop: false}, {lineLifetime: 0.5}, {linesPerScreen: 150}]) {
      layer.updateLayerVisConfig(change);
      const regenerated = update(render());
      t.notEqual(regenerated.props.data, previousTrips, 'path-generation settings rebuild trails');
      previousTrips = regenerated.props.data;
    }
    t.deepEqual(counts(), [3, 3, 3], 'path-generation changes rebuild all trail buffers');
    reset();

    dataset.filteredIndex = [0, 1, 3, 4];
    data = layer.formatLayerData({[dataId]: dataset});
    const filtered = update(render());
    t.notEqual(filtered.props.data, previousTrips, 'filtered grids replace cached trails');
    t.ok(filtered.props.data.length > 0, 'filtered fixture retains trails');
    t.deepEqual(counts(), [1, 1, 1], 'filtered grids rebuild trail buffers');
    reset();

    const replacement = createDatasetFromCsv(flowCsv.replace(/,1.0,0.5/g, ',2.0,1.0'));
    data = layer.formatLayerData({[dataId]: replacement});
    const replaced = update(render());
    t.notEqual(replaced.props.data, filtered.props.data, 'replacement data rebuilds trails');
    t.deepEqual(counts(), [1, 1, 1], 'replacement data rebuilds trail buffers');

    dataset.filteredIndex = [];
    data = layer.formatLayerData({[dataId]: dataset});
    t.deepEqual(
      layer.renderLayer({data, mapState}),
      [],
      'empty filtered grids render no stale trails'
    );
    t.deepEqual(
      layer.renderLayer({data: {}, mapState}),
      [],
      'missing grids render no stale trails'
    );
  } finally {
    spies.forEach(spy => spy.restore());
    manager.finalize();
    clock.restore();
  }
  t.end();
});

test('#FlowFieldLayer -> animation updates time without replacing trail data', t => {
  const dataset = createFlowFieldDataset();
  const layer = validateLayerWithData(
    dataset,
    {
      id: 'animated-trails',
      type: 'flowField',
      config: {
        dataId,
        columns: {lat: 'latitude', lng: 'longitude', u: 'u', v: 'v'},
        visConfig: {linesPerScreen: 100, smoothing: 0, seamlessLoop: true, cycleSeconds: 20}
      }
    },
    LayerClasses
  );
  const mapState = {longitude: -121.8, latitude: 37.25, zoom: 11, width: 800, height: 600};
  const data = layer.formatLayerData({[dataId]: dataset});
  const [trails] = layer.renderLayer({data, mapState});
  const trips = trails.props.data;
  const setProps = sinon.spy();
  const redraw = sinon.stub(trails, 'setNeedsRedraw');
  const draw = sinon.stub(PathLayer.prototype, 'draw');
  const now = sinon.stub(performance, 'now');
  try {
    trails.state = {model: {shaderInputs: {setProps}}};
    now.returns(5000);
    trails.draw({});
    now.returns(6000);
    trails.draw({});
    t.deepEqual(
      setProps.args.map(([props]) => props.trips.currentTime),
      [1.25, 1.3],
      'time uniform advances'
    );
    t.equal(trails.props.data, trips, 'animation retains the validated trail data');
    t.equal(draw.callCount, 2, 'each frame draws the existing paths');
    t.equal(redraw.callCount, 2, 'each frame requests another deck redraw');
  } finally {
    redraw.restore();
    draw.restore();
    now.restore();
  }
  t.end();
});

test('#FlowFieldLayer -> optional models follow animated heads', t => {
  const dataset = createFlowFieldDataset();
  const layer = validateLayerWithData(
    dataset,
    {
      id: 'flow-models',
      type: 'flowField',
      config: {
        dataId,
        columns: {lat: 'latitude', lng: 'longitude', u: 'u', v: 'v'},
        visConfig: {linesPerScreen: 100, smoothing: 0, seamlessLoop: true, cycleSeconds: 20}
      }
    },
    LayerClasses
  );
  const mapState = {longitude: -121.8, latitude: 37.25, zoom: 11, width: 800, height: 600};
  const data = layer.formatLayerData({[dataId]: dataset});
  const onRedrawNeeded = sinon.spy();
  const render = () => layer.renderLayer({data, mapState, layerCallbacks: {onRedrawNeeded}});
  const original = render()[0];
  t.equal(layer.config.visConfig.scenegraphEnabled, false, 'meshes default to disabled');
  t.equal(layer.config.visConfig.showTrails, true, 'trails remain enabled for existing configs');
  t.equal(render().length, 1, 'default renders only trails');
  layer.updateLayerVisConfig({scenegraphEnabled: true});
  t.equal(render().length, 1, 'no model selected retains trails');
  layer.updateLayerVisConfig({scenegraph: 'unknown'});
  t.equal(render().length, 1, 'unknown model retains trails');
  layer.updateLayerVisConfig({scenegraph: 'custom', scenegraphCustomModelUrl: ''});
  t.equal(render().length, 1, 'empty custom URL retains trails');
  const preset = TRIP_LAYER_SCENEGRAPH_MODELS.find(d => d.id !== 'custom');
  layer.updateLayerVisConfig({scenegraph: preset.id});
  const manager = new LayerManager(device, {viewport: new WebMercatorViewport(mapState)});
  const fetchModel = sinon.stub().returns(new Promise(() => {}));
  manager.setLayers([render()[1].clone({fetch: fetchModel})]);
  t.equal(fetchModel.lastCall.args[0], preset.url, 'gallery selection loads the shared model');
  layer.updateLayerVisConfig({
    scenegraph: 'custom',
    scenegraphCustomModelUrl: 'https://example.com/flow.glb',
    elevationMultiplier: 3,
    sizeScale: 0
  });
  const [trails] = render();
  layer.updateLayerVisConfig({showTrails: false});
  const modelOnly = render();
  t.deepEqual(
    modelOnly.map(d => d.id),
    ['flow-models-scenegraph'],
    'hiding trails renders only the model'
  );
  const [model] = modelOnly;
  try {
    manager.setLayers([model.clone({fetch: fetchModel})]);
    t.equal(fetchModel.lastCall.args[0], 'https://example.com/flow.glb', 'custom URL is loaded');
  } finally {
    manager.finalize();
  }
  t.equal(trails.props.data, original.props.data, 'mesh controls preserve cached streamlines');
  t.equal(model.props.data, trails.props.data, 'meshes follow the rendered streamline data');
  t.deepEqual(
    model.props.clipBounds,
    trails.props.clipBounds,
    'meshes use the same viewport clipping'
  );

  const trip = {
    path: [
      [0, 0, 10],
      [2, 0, 20],
      [2, 2, 30]
    ],
    timestamps: [1, 1.5, 2],
    speed: 1
  };
  const looped = {...trip, timestamps: [2, 2.5, 3]};
  const now = sinon.stub(performance, 'now');
  const draw = sinon.stub(ScenegraphLayer.prototype, 'draw');
  const updateAttributes = sinon.stub(model, '_updateAttributes');
  const invalidate = sinon.spy();
  const getAttributes = sinon.stub(model, 'getAttributeManager').returns({invalidate});
  const redraw = sinon.stub(model, 'setNeedsRedraw');
  try {
    model.state = {};
    model.draw({});
    t.equal(updateAttributes.callCount, 0, 'unloaded models do not update attributes');
    model.state = {scenegraph: {}};
    now.returns(5000);
    model.draw({});
    t.deepEqual(
      model.props.getPosition(trip),
      [1, 0, 45],
      'head interpolates position and elevation'
    );
    const east = model.props.getTransformMatrix(trip);
    t.ok(Math.abs(east[0] - 1) < 1e-6, 'custom mesh points east along the first segment');
    t.ok(
      model.props
        .getTransformMatrix(looped)
        .slice(0, 12)
        .every(v => v === 0),
      'future copy is hidden'
    );
    now.returns(15000);
    model.draw({});
    t.deepEqual(
      model.props.getPosition(trip),
      [2, 1, 75],
      'head advances with the automatic clock'
    );
    const north = model.props.getTransformMatrix(trip);
    t.ok(
      Math.abs(north[0]) < 1e-6 && Math.abs(north[1] - 1) < 1e-6,
      'mesh turns along the next segment'
    );
    now.returns(20000);
    model.draw({});
    t.deepEqual(model.props.getPosition(trip), [0, 0, 30], 'cycle wraps to the beginning');
    const completed = {...trip, timestamps: [0, 0.5, 1]};
    t.ok(
      model.props
        .getTransformMatrix(completed)
        .slice(0, 12)
        .every(v => v === 0),
      'completed copy is hidden at the loop boundary'
    );
    t.deepEqual(
      invalidate.args,
      [
        ['getPosition'],
        ['getTransformMatrix'],
        ['getPosition'],
        ['getTransformMatrix'],
        ['getPosition'],
        ['getTransformMatrix']
      ],
      'animation refreshes only model positions and transforms'
    );
    t.equal(updateAttributes.callCount, 3, 'each loaded frame uploads model attributes');
    t.equal(draw.callCount, 3, 'each loaded frame draws meshes');
    t.equal(redraw.callCount, 3, 'each loaded frame schedules deck redraw');
    t.equal(onRedrawNeeded.callCount, 0, 'mesh animation does not dispatch map updates');
    t.equal(model.props.data, original.props.data, 'animation retains cached paths');
  } finally {
    now.restore();
    draw.restore();
    updateAttributes.restore();
    getAttributes.restore();
    redraw.restore();
  }

  layer.updateLayerVisConfig({showTrails: true});
  const restored = render();
  t.deepEqual(
    restored.map(d => d.id),
    ['flow-models', 'flow-models-scenegraph'],
    'showing trails restores both layers'
  );
  t.equal(
    restored[0].props.data,
    original.props.data,
    'toggling trails retains the generated paths'
  );
  layer.updateLayerVisConfig({scenegraphColorEnabled: true, scenegraphColor: [10, 20, 30]});
  t.deepEqual(render()[1].props.getColor, [10, 20, 30], 'model supports custom tint');
  layer.updateLayerVisConfig({scenegraphUseTrailColor: true, colorBySpeed: true});
  const [coloredTrails, coloredModel] = render();
  const first = coloredTrails.props.data[0];
  t.deepEqual(
    coloredModel.props.getColor(first),
    coloredTrails.props.getColor(first),
    'model can inherit speed-based trail colors'
  );
  layer.updateLayerVisConfig({scenegraphColorEnabled: false});
  t.deepEqual(
    render()[1].props.getColor,
    [255, 255, 255],
    'disabling tint restores original model colors'
  );
  layer.updateLayerVisConfig({sizeScale: 2, adjustYaw: 90, seamlessLoop: false});
  const adjusted = render()[1];
  adjusted.props.animationTime.currentTime = 0.25;
  const shortTrip = {...trip, timestamps: [0, 0.5, 1]};
  const adjustedMatrix = adjusted.props.getTransformMatrix(shortTrip);
  t.ok(
    Math.abs(adjustedMatrix[0]) < 1e-6 && Math.abs(adjustedMatrix[1] + 4) < 1e-6,
    'model size and orientation adjustments follow the Trips convention'
  );
  t.deepEqual(
    adjusted.props.getPosition(shortTrip),
    [1, 0, 45],
    'non-seamless heads follow the same path'
  );
  adjusted.props.animationTime.currentTime = 1;
  t.ok(
    adjusted.props
      .getTransformMatrix(shortTrip)
      .slice(0, 12)
      .every(v => v === 0),
    'non-seamless models disappear after their path ends'
  );
  t.deepEqual(layer.renderLayer({data: {}, mapState}), [], 'missing grid produces no models');
  t.deepEqual(
    layer.renderLayer({data, mapState, visible: false}),
    [],
    'hidden map produces no models'
  );
  layer.updateLayerVisConfig({scenegraphEnabled: false});
  t.equal(render().length, 1, 'disabling mesh retains the trails');
  layer.updateLayerVisConfig({showTrails: false});
  t.deepEqual(render(), [], 'disabling both models and trails renders neither');
  layer.updateLayerVisConfig({scenegraphEnabled: true, scenegraphCustomModelUrl: ''});
  t.deepEqual(render(), [], 'missing model URL does not restore hidden trails');
  t.end();
});

test('#FlowFieldLayer -> independent split cameras retain their own settled paths', t => {
  const clock = sinon.useFakeTimers();
  try {
    const dataset = createFlowFieldDataset();
    const createLayer = () =>
      validateLayerWithData(
        dataset,
        {
          id: 'split-flow',
          type: 'flowField',
          config: {
            dataId,
            columnMode: 'UV',
            columns: {lat: 'latitude', lng: 'longitude', u: 'u', v: 'v'},
            visConfig: {linesPerScreen: 100, smoothing: 0}
          }
        },
        LayerClasses
      );
    const cameras = [
      {longitude: -121.8, latitude: 37.25, zoom: 11, width: 800, height: 600},
      {longitude: -121.2, latitude: 37.75, zoom: 11, width: 800, height: 600}
    ];
    const layer = createLayer();
    let data = layer.formatLayerData({[dataId]: dataset});
    const expected = cameras.map(mapState => {
      const single = createLayer();
      return single.renderLayer({
        data: single.formatLayerData({[dataId]: dataset}),
        mapState
      })[0];
    });
    t.ok(
      expected.every(deckLayer => deckLayer?.props.data.length),
      'both single maps have paths'
    );
    const redraws = [0, 0];
    const renderMap = (mapIndex, mapState = cameras[mapIndex], grouped = false) =>
      computeDeckLayers(
        {
          visState: {
            datasets: {[dataId]: dataset},
            effects: [],
            layers: [layer],
            layerOrder: grouped
              ? [{id: 'group', isVisible: true, layerOrder: [layer.id]}]
              : [layer.id],
            layerData: [data],
            interactionConfig: {},
            animationConfig: {},
            splitMaps: []
          },
          mapState
        },
        {mapIndex},
        {onRedrawNeeded: () => redraws[mapIndex]++}
      )[0];
    for (let pass = 0; pass < 3; pass++) {
      for (let mapIndex = 0; mapIndex < 2; mapIndex++) {
        const rendered = renderMap(mapIndex, cameras[mapIndex], pass === 1);
        t.deepEqual(
          rendered?.props.clipBounds,
          expected[mapIndex].props.clipBounds,
          `pass ${pass}, map ${mapIndex}: clipping follows its own camera`
        );
        t.ok(
          JSON.stringify(rendered?.props.data) === JSON.stringify(expected[mapIndex].props.data),
          `pass ${pass}, map ${mapIndex}: paths match the same camera rendered alone`
        );
      }
      clock.tick(1000);
    }
    t.deepEqual(redraws, [0, 0], 'unchanged cameras do not keep restarting settling');

    const panned = {...cameras[0], longitude: -121.65};
    renderMap(0, panned);
    const stationary = renderMap(1);
    clock.tick(1000);
    t.deepEqual(redraws, [1, 0], 'panning requests a redraw only for the moving map');
    t.deepEqual(
      stationary.props.clipBounds,
      expected[1].props.clipBounds,
      'the other map keeps its clipping bounds while panning'
    );
    const settled = renderMap(0, panned);
    t.notDeepEqual(settled.props.clipBounds, expected[0].props.clipBounds, 'the pan settles');
    t.equal(
      renderMap(0, panned).props.data[0],
      settled.props.data[0],
      'settled redraws reuse the generated paths'
    );

    const single = createLayer();
    const singleData = single.formatLayerData({[dataId]: dataset});
    single.renderLayer({data: singleData, mapState: cameras[0]});
    single.renderLayer({data: singleData, mapState: panned});
    clock.tick(1000);
    t.ok(
      JSON.stringify(single.renderLayer({data: singleData, mapState: panned})[0].props.data) ===
        JSON.stringify(settled.props.data),
      'panning without a map index settles to the same paths'
    );

    // Closing the split leaves map 0; reopening reuses map 1's index.
    renderMap(0, panned);
    const reopened = renderMap(1, {...cameras[1], longitude: -121.35});
    clock.tick(1000);
    t.notDeepEqual(
      renderMap(1, {...cameras[1], longitude: -121.35}).props.clipBounds,
      reopened.props.clipBounds,
      'a reopened split settles to its new camera'
    );

    const beforeReset = [...redraws];
    renderMap(0, {...panned, latitude: 37.3});
    data = layer.formatLayerData({[dataId]: dataset});
    clock.tick(1000);
    t.deepEqual(redraws, beforeReset, 'replacing the grid cancels obsolete settling callbacks');
    t.notEqual(renderMap(0).props.data[0], settled.props.data[0], 'new grid rebuilds map 0 paths');
    t.deepEqual(
      renderMap(1).props.clipBounds,
      expected[1].props.clipBounds,
      'new grid also resets map 1 to its current camera'
    );
  } finally {
    clock.restore();
  }
  t.end();
});

const flowGeojsonFc = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {u: 1.0, v: 0.5},
      geometry: {type: 'Point', coordinates: [-122.0, 37.0]}
    },
    {
      type: 'Feature',
      properties: {u: 1.1, v: 0.4},
      geometry: {
        type: 'LineString',
        coordinates: [
          [-122.0, 37.5],
          [-121.9, 37.6]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {u: 0.9, v: 0.6},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-122.0, 38.0],
            [-121.9, 38.0],
            [-121.9, 38.1],
            [-122.0, 38.1],
            [-122.0, 38.0]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {u: 1.2, v: 0.3},
      geometry: {type: 'Point', coordinates: [-121.5, 37.0]}
    }
  ]
};

function createFlowFieldGeojsonDataset(id = 'flow-geojson-data') {
  const parsed = processGeojson(flowGeojsonFc);
  const dataset = new KeplerTable({
    info: {id, label: id},
    color: [255, 255, 255]
  });
  dataset.importData({
    data: {fields: parsed.fields, rows: parsed.rows}
  });
  dataset.fieldPairs = findPointFieldPairs(dataset.fields);
  dataset.gpuFilter = getGpuFilterProps([], id, dataset.fields);
  return dataset;
}

test('#FlowFieldLayer -> findDefaultLayerProps geojson', t => {
  const dataset = createFlowFieldGeojsonDataset();
  const {props, altProps} = FlowFieldLayer.findDefaultLayerProps(dataset);
  t.equal(props.length, 1, 'geojson-only dataset should create a Flow Field prop');
  t.equal(altProps?.length || 0, 0, 'should not need altProps when geojson is primary');
  t.equal(props[0].columnMode, 'UV', 'should use UV mode with geojson position');
  t.ok(props[0].columns.geojson, 'should set geojson column');
  t.ok(props[0].columns.u, 'should set u');
  t.ok(props[0].columns.v, 'should set v');
  t.end();
});

test('#FlowFieldLayer -> formatLayerData from geojson centroids', t => {
  const dataset = createFlowFieldGeojsonDataset(dataId);
  const TEST_CASES = [
    {
      name: 'flow field geojson uv',
      layer: {
        type: 'flowField',
        id: 'flow_field_geojson_uv',
        config: {
          dataId,
          label: 'flow field geojson',
          columnMode: 'UV',
          columns: {
            geojson: '_geojson',
            u: 'u',
            v: 'v'
          },
          isVisible: true
        }
      },
      datasets: {
        [dataId]: dataset
      },
      assert: result => {
        const {layerData, layer} = result;
        t.ok(layerData.grid, 'should build a grid from geojson centroids');
        t.equal(layerData.data?.length, 4, 'should keep one sample per feature');
        const point = layerData.data.find(d => d.lng === -122 && d.lat === 37);
        t.ok(point, 'Point geometry should use its coordinates as position');
        t.equal(point.u, 1.0, 'should keep u from properties');
        t.equal(point.v, 0.5, 'should keep v from properties');

        const line = layerData.data.find(
          d => Math.abs(d.lng - -121.95) < 1e-9 && Math.abs(d.lat - 37.55) < 1e-9
        );
        t.ok(line, 'LineString should use vertex-average centroid');

        // Polygon centroid averages all ring vertices including the closing duplicate
        const polyCoords = [
          [-122.0, 38.0],
          [-121.9, 38.0],
          [-121.9, 38.1],
          [-122.0, 38.1],
          [-122.0, 38.0]
        ];
        const expectedPolyLng = polyCoords.reduce((s, c) => s + c[0], 0) / polyCoords.length;
        const expectedPolyLat = polyCoords.reduce((s, c) => s + c[1], 0) / polyCoords.length;
        t.deepEqual(
          layer.meta.bounds,
          [-122, 37, -121.5, expectedPolyLat],
          'GeoJSON zoom bounds use the same centroids as the flow field'
        );
        const poly = layerData.data.find(
          d => Math.abs(d.lng - expectedPolyLng) < 1e-9 && Math.abs(d.lat - expectedPolyLat) < 1e-9
        );
        t.ok(poly, 'Polygon should use boundary-vertex-average centroid');
      }
    }
  ];

  testFormatLayerDataCases(t, FlowFieldLayer, TEST_CASES);
  t.end();
});

test('#FlowFieldLayer -> reducer numeric filters reach every grid mode', t => {
  const features = Array.from({length: 12}, (_, index) => {
    const group = Math.floor(index / 4);
    const latitude = 37 + (index % 2) * 0.5;
    const longitude = -122 + group * 2 + Math.floor((index % 4) / 2) * 0.5;
    return {
      type: 'Feature',
      geometry: {type: 'Point', coordinates: [longitude, latitude]},
      properties: {
        latitude,
        longitude,
        u: index + 1,
        v: 0.5,
        speed: index + 10,
        direction: 90,
        elevation: index + 20,
        value: 100 + group * 10,
        other: group,
        category: index % 2 ? 'drop' : 'keep'
      }
    };
  });
  const source = JSON.stringify(features);
  for (const columnMode of ['UV', 'SPEED_DIR', 'ELEVATION']) {
    for (const geojson of [false, true]) {
      const dataset = new KeplerTable({info: {id: dataId}, color: [1, 2, 3]});
      dataset.importData({data: processGeojson({type: 'FeatureCollection', features})});
      const datasets = {[dataId]: dataset};
      const layer = validateLayerWithData(
        dataset,
        {
          type: 'flowField',
          config: {
            dataId,
            columnMode,
            columns: {
              ...(geojson ? {geojson: '_geojson'} : {lat: 'latitude', lng: 'longitude'}),
              u: 'u',
              v: 'v',
              speed: 'speed',
              direction: 'direction',
              altitude: 'elevation'
            },
            visConfig: {smoothing: 0}
          }
        },
        LayerClasses
      );
      const initial = layer.formatLayerData(datasets);
      let state = {...INITIAL_VIS_STATE, datasets, layers: [layer], layerData: [initial]};
      const apply = action => {
        state = visStateReducer(state, action);
      };
      const check = (label, indexes) => {
        const {data, grid} = state.layerData[0];
        const message = `${columnMode}/${geojson ? 'GeoJSON' : 'LatLng'} ${label}`;
        t.deepEqual(
          data,
          indexes.map(index => initial.data[index]),
          `${message}: samples and order`
        );
        t.equal(Boolean(grid), indexes.length >= 4, `${message}: grid uses selected samples`);
        t.deepEqual(
          state.layers[0].config.colorDomain,
          grid ? [grid.minSpeed, grid.maxSpeed] : [0, 1],
          `${message}: legend speed range follows the filtered grid`
        );
        if (grid) {
          t.deepEqual(
            [grid.lngs[0], grid.lngs[grid.lngs.length - 1]],
            [Math.min(...data.map(point => point.lng)), Math.max(...data.map(point => point.lng))],
            `${message}: excluded positions do not extend the grid`
          );
        }
      };
      check(
        'no filter',
        Array.from({length: 12}, (_, index) => index)
      );
      apply(VisStateActions.addFilter(dataId));
      apply(VisStateActions.setFilter(0, 'name', 'value'));
      apply(VisStateActions.setFilter(0, 'value', [100, 100]));
      const cpuIndex = state.datasets[dataId].filteredIndex;
      t.equal(cpuIndex.length, 12, 'numeric GPU filter retains the complete CPU index');
      t.deepEqual(
        state.datasets[dataId].gpuFilter.filterRange[0],
        [0, 0],
        'minimum normalizes to zero'
      );
      check('minimum-only filter', [0, 1, 2, 3]);
      apply(VisStateActions.setFilter(0, 'value', [110, 120]));
      t.equal(state.datasets[dataId].filteredIndex, cpuIndex, 'range changes keep the CPU index');
      check('changed numeric range', [4, 5, 6, 7, 8, 9, 10, 11]);
      apply(VisStateActions.addFilter(dataId));
      apply(VisStateActions.setFilter(1, 'name', 'other'));
      apply(VisStateActions.setFilter(1, 'value', [0, 0]));
      check('multiple channels intersect to empty', []);
      apply(VisStateActions.setFilter(0, 'value', [100, 100]));
      check('multiple zero ranges', [0, 1, 2, 3]);
      apply(VisStateActions.removeFilter(1));
      apply(VisStateActions.setFilter(0, 'value', [110, 120]));
      apply(VisStateActions.addFilter(dataId));
      apply(VisStateActions.setFilter(1, 'name', 'category'));
      apply(VisStateActions.setFilter(1, 'value', ['keep']));
      t.deepEqual(
        state.datasets[dataId].filteredIndex,
        [0, 2, 4, 6, 8, 10],
        'CPU filter removes rows'
      );
      check('CPU and GPU filters intersect', [4, 6, 8, 10]);
      const filteredDataset = state.datasets[dataId];
      const reorderedIndex = [10, 4, 8, 6];
      filteredDataset.filteredIndex = reorderedIndex;
      const reordered = state.layers[0].formatLayerData(state.datasets);
      t.deepEqual(
        reordered.data,
        [10, 4, 8, 6].map(index => initial.data[index]),
        'original row indexes and order feed accessors'
      );
      t.equal(filteredDataset.filteredIndex, reorderedIndex, 'formatting preserves the CPU index');
      t.deepEqual(reorderedIndex, [10, 4, 8, 6], 'formatting does not mutate the CPU index');
      apply(VisStateActions.removeFilter(1));
      apply(VisStateActions.removeFilter(0));
      check(
        'cleared filters',
        Array.from({length: 12}, (_, index) => index)
      );
      t.equal(
        JSON.stringify(features),
        source,
        'filtering does not mutate source geometry or properties'
      );
      const empty = new KeplerTable({info: {id: dataId}, color: [1, 2, 3]});
      empty.importData({data: {fields: dataset.fields, rows: []}});
      const emptyData = layer.formatLayerData({[dataId]: empty});
      t.deepEqual(emptyData.data, [], 'empty dataset has no samples');
      t.equal(emptyData.grid, null, 'empty dataset has no grid');
    }
  }
  t.end();
});

test('#FlowFieldLayer -> speed legend follows rendered colors, toggles and grid changes', t => {
  const dataset = createDatasetFromCsv(`latitude,longitude,u,v
37.0,-122.0,2.0,0.0
37.5,-122.0,4.0,0.0
38.0,-122.0,6.0,0.0
37.0,-121.5,8.0,0.0
37.5,-121.5,10.0,0.0
38.0,-121.5,12.0,0.0
37.0,-121.0,14.0,0.0
37.5,-121.0,16.0,0.0
38.0,-121.0,18.0,0.0
`);
  const layer = validateLayerWithData(
    dataset,
    {
      type: 'flowField',
      config: {
        dataId,
        columnMode: 'UV',
        columns: {lat: 'latitude', lng: 'longitude', u: 'u', v: 'v'},
        color: [12, 34, 56],
        visConfig: {
          smoothing: 0,
          linesPerScreen: 100,
          colorBySpeed: true,
          colorRange: {name: 'test', colors: ['#ff0000', '#0000ff']}
        }
      }
    },
    LayerClasses
  );
  const datasets = {[dataId]: dataset};
  layer.updateLayerConfig({colorField: {name: 'unrelated', type: 'string'}, colorScale: 'ordinal'});
  const layerData = layer.formatLayerData(datasets);
  let state = {...INITIAL_VIS_STATE, datasets, layers: [layer], layerData: [layerData]};
  const LayerLegendContent = appInjector.get(LayerLegendContentFactory);
  const mapState = {longitude: -121.75, latitude: 37.25, zoom: 8, width: 800, height: 600};
  const readLegend = currentLayer => {
    const wrapper = render(
      <ThemeProvider theme={theme}>
        <IntlWrapper>
          <LayerLegendContent layer={currentLayer} containerW={300} isExport />
        </IntlWrapper>
      </ThemeProvider>
    );
    const result = {
      measure: wrapper.container.querySelector('.legend--layer_color_field')?.textContent,
      colors: Array.from(wrapper.container.querySelectorAll('.legend-row-color')).map(
        element => element.style.backgroundColor
      ),
      labels: Array.from(
        wrapper.container.querySelectorAll('.styled-color-legend .legend-row-color')
      ).map(element => element.parentElement.textContent)
    };
    wrapper.unmount();
    return result;
  };
  const renderLayer = () =>
    state.layers[0].renderLayer({data: state.layerData[0], mapState, visible: true})[0];
  const changeStyle = newVisConfig => {
    state = visStateReducer(
      state,
      VisStateActions.layerVisConfigChange(state.layers[0], newVisConfig)
    );
  };

  t.deepEqual([layerData.grid.minSpeed, layerData.grid.maxSpeed], [2, 18], 'fixture speed extent');
  t.deepEqual(
    readLegend(layer),
    {
      measure: 'Speed',
      colors: ['rgb(255, 0, 0)', 'rgb(0, 0, 255)'],
      labels: ['2 to 10', '10 to 18']
    },
    'speed legend uses the palette and actual grid range'
  );
  const colored = renderLayer();
  t.deepEqual(
    colored.props.getColor({speed: 2}).slice(0, 3),
    [255, 0, 0],
    'minimum renders first band'
  );
  t.deepEqual(
    colored.props.getColor({speed: 18}).slice(0, 3),
    [0, 0, 255],
    'maximum renders last band'
  );

  changeStyle({colorBySpeed: false});
  t.deepEqual(
    readLegend(state.layers[0]),
    {
      measure: undefined,
      colors: ['rgb(12, 34, 56)'],
      labels: []
    },
    'turning off speed coloring restores the single-color legend'
  );
  t.deepEqual(
    renderLayer().props.getColor.slice(0, 3),
    [12, 34, 56],
    'single-color renderer agrees'
  );

  changeStyle({colorBySpeed: true, colorRange: {name: 'other', colors: ['#00ff00', '#ffff00']}});
  t.equal(state.layerData[0], layerData, 'style toggles reuse the existing grid');
  t.deepEqual(
    readLegend(state.layers[0]).colors,
    ['rgb(0, 255, 0)', 'rgb(255, 255, 0)'],
    'palette change reaches legend'
  );
  t.deepEqual(
    renderLayer().props.getColor({speed: 18}).slice(0, 3),
    [255, 255, 0],
    'palette change reaches renderer'
  );

  const replacement = createDatasetFromCsv(`latitude,longitude,u,v
37.0,-122.0,10.0,0.0
37.5,-122.0,12.0,0.0
38.0,-122.0,14.0,0.0
37.0,-121.5,16.0,0.0
37.5,-121.5,18.0,0.0
38.0,-121.5,20.0,0.0
37.0,-121.0,22.0,0.0
37.5,-121.0,24.0,0.0
38.0,-121.0,26.0,0.0
`);
  state.layerData = [state.layers[0].formatLayerData({[dataId]: replacement})];
  t.deepEqual(
    readLegend(state.layers[0]).labels,
    ['10 to 18', '18 to 26'],
    'new grid updates legend limits'
  );
  t.deepEqual(
    renderLayer().props.getColor({speed: 10}).slice(0, 3),
    [0, 255, 0],
    'new minimum still uses the first band'
  );
  const empty = new KeplerTable({info: {id: dataId}, color: [1, 2, 3]});
  empty.importData({data: {fields: replacement.fields, rows: []}});
  const emptyData = state.layers[0].formatLayerData({[dataId]: empty});
  t.equal(emptyData.grid, null, 'empty input clears the grid');
  t.deepEqual(
    state.layers[0].config.colorDomain,
    [0, 1],
    'empty input does not retain the previous speed range'
  );
  t.end();
});
