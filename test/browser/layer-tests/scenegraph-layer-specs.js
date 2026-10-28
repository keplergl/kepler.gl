// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import moment from 'moment';
import global from 'global';
import sinon from 'sinon';
import sinonStubPromise from 'sinon-stub-promise';
sinonStubPromise(sinon);

import {
  testCreateCases,
  testFormatLayerDataCases,
  testRenderLayerCases,
  preparedDataset,
  dataId,
  testRows,
  pointLayerMeta,
  preparedFilterDomain0
} from 'test/helpers/layer-utils';
import {
  DEFAULT_SCENEGRAPH_MODEL,
  CUSTOM_SCENEGRAPH_MODEL_ID,
  LEGACY_DEFAULT_SCENEGRAPH_URL
} from '@kepler.gl/constants';
import {KeplerGlLayers, LayerClasses, toCorsSafeGcsUrl} from '@kepler.gl/layers';
import {KeplerTable, copyTableAndUpdate, getGpuFilterProps} from '@kepler.gl/table';
import {VisStateActions} from '@kepler.gl/actions';
import {
  INITIAL_VIS_STATE,
  INITIAL_MAP_STATE,
  visStateReducer,
  validateLayerWithData
} from '@kepler.gl/reducers';
import SchemaManager, {CURRENT_VERSION} from '@kepler.gl/schemas';
const {ScenegraphLayer} = KeplerGlLayers;
const columns = {lat: 'lat', lng: 'lng'};

test('#ScenegraphLayer -> constructor', t => {
  const TEST_CASES = {
    CREATE: [
      {
        props: {
          dataId: 'smoothie',
          isVisible: true,
          label: 'test 3d layer'
        },
        test: layer => {
          t.ok(layer.config.dataId === 'smoothie', 'ScenegraphLayer dataId should be correct');
          t.ok(layer.type === '3D', 'type should be 3D');
          t.ok(layer.isAggregated === false, 'ScenegraphLayer is not aggregated');
          t.ok(layer.config.label === 'test 3d layer', 'label should be correct');
          t.ok(Object.keys(layer.columnPairs).length, 'should have columnPairs');
          t.equal(
            layer.config.visConfig.scenegraph,
            DEFAULT_SCENEGRAPH_MODEL.id,
            'should default to the gallery duck'
          );
          t.equal(
            layer.config.visConfig.angleZ,
            0,
            'angle Z default lets the duck model supply yaw'
          );
          t.equal(layer.config.visConfig.scenegraphColorEnabled, false, 'tint starts off');
          t.deepEqual(
            layer.getLegendVisualChannels(),
            {},
            'should expose no legend channels (mesh has no fill color)'
          );
        }
      }
    ]
  };

  testCreateCases(t, ScenegraphLayer, TEST_CASES.CREATE);
  t.end();
});

test('#ScenegraphLayer -> formatLayerData', t => {
  const filteredIndex = [0, 2, 4];

  const TEST_CASES = [
    {
      name: 'Scenegraph gps point.1',
      layer: {
        type: '3D',
        id: 'test_layer_1',
        config: {
          dataId,
          label: 'gps 3d',
          columns
        }
      },
      datasets: {
        [dataId]: {
          ...preparedDataset,
          filteredIndex
        }
      },
      assert: result => {
        const {layerData, layer} = result;
        const expectedLayerData = {
          data: [
            {
              index: 4,
              position: [testRows[4][2], testRows[4][1], 0]
            }
          ],
          getFilterValue: () => {},
          getPosition: () => {}
        };

        t.deepEqual(
          Object.keys(layerData).sort(),
          Object.keys(expectedLayerData).sort(),
          'layerData should have 3 keys'
        );
        t.deepEqual(
          layerData.data,
          expectedLayerData.data,
          'should format correct point layerData data'
        );
        t.deepEqual(
          layerData.data.map(layerData.getPosition),
          [[testRows[4][2], testRows[4][1], 0]],
          'getPosition should return correct lat lng'
        );
        // getFilterValue
        t.deepEqual(
          layerData.data.map(layerData.getFilterValue),
          [[moment.utc(testRows[4][0]).valueOf() - preparedFilterDomain0, 0, 0, 0]],
          'getFilterValue should return [value, 0, 0, 0]'
        );
        // layerMeta
        t.deepEqual(layer.meta, pointLayerMeta, 'should format correct point layer meta');
      }
    }
  ];

  testFormatLayerDataCases(t, ScenegraphLayer, TEST_CASES);
  t.end();
});

test('#ScenegraphLayer -> renderLayer', t => {
  // TODO: mock actual gltf response
  const mockSuccessResponse = {};
  const mockJsonPromise = sinon.stub().returnsPromise();
  mockJsonPromise.resolves(mockSuccessResponse);
  const stubedFetch = sinon.stub(global, 'fetch').returnsPromise();

  stubedFetch.resolves({
    json: mockJsonPromise
  });

  const filteredIndex = [0, 2, 4];

  const TEST_CASES = [
    {
      name: 'Scenegraph gps point.1',
      layer: {
        type: '3D',
        id: 'test_layer_1',
        config: {
          dataId,
          label: 'gps 3d',
          columns
        }
      },
      datasets: {
        [dataId]: {
          ...preparedDataset,
          filteredIndex
        }
      },
      assert: (deckLayers, layer) => {
        t.equal(deckLayers.length, 1, 'Should create 1 deck.gl layer');
        const {props} = deckLayers[0];
        const {sizeScale, angleX, angleY, angleZ} = layer.config.visConfig;

        t.equal(
          layer.getScenegraph().url,
          DEFAULT_SCENEGRAPH_MODEL.url,
          'should load the duck model'
        );
        const expectedProps = {
          opacity: layer.config.visConfig.opacity,
          sizeScale: sizeScale * DEFAULT_SCENEGRAPH_MODEL.scale,
          filterRange: preparedDataset.gpuFilter.filterRange,
          getOrientation: [
            angleX + DEFAULT_SCENEGRAPH_MODEL.angles[0],
            angleY + DEFAULT_SCENEGRAPH_MODEL.angles[1],
            angleZ + DEFAULT_SCENEGRAPH_MODEL.angles[2]
          ],
          getColor: [255, 255, 255],
          _lighting: 'pbr'
        };
        Object.keys(expectedProps).forEach(key => {
          t.deepEqual(props[key], expectedProps[key], `should have correct props.${key}`);
        });
      }
    },
    {
      name: 'Scenegraph gallery model',
      layer: {
        type: '3D',
        id: 'test_layer_airplane',
        config: {
          dataId,
          label: 'gps 3d',
          columns,
          visConfig: {
            scenegraph: 'airplane'
          }
        }
      },
      datasets: {
        [dataId]: {
          ...preparedDataset,
          filteredIndex
        }
      },
      assert: (deckLayers, layer) => {
        const model = layer.getScenegraph();
        t.equal(deckLayers.length, 1, 'should render a gallery model');
        t.equal(model.id, 'airplane');
        t.ok(model.url.endsWith('/Plane.glb'), 'should load the airplane model');
        t.equal(
          deckLayers[0].props.sizeScale,
          layer.config.visConfig.sizeScale * model.scale,
          'gallery models use a scale of 1'
        );
      }
    },
    {
      name: 'Scenegraph custom url and tint',
      layer: {
        type: '3D',
        id: 'test_layer_custom',
        config: {
          dataId,
          label: 'gps 3d',
          columns,
          visConfig: {
            scenegraph: CUSTOM_SCENEGRAPH_MODEL_ID,
            scenegraphCustomModelUrl: 'https://example.com/model.glb',
            scenegraphColorEnabled: true,
            scenegraphColor: [10, 20, 30]
          }
        }
      },
      datasets: {
        [dataId]: {
          ...preparedDataset,
          filteredIndex
        }
      },
      assert: (deckLayers, layer) => {
        t.equal(layer.getScenegraph().url, 'https://example.com/model.glb');
        t.deepEqual(deckLayers[0].props.getColor, [10, 20, 30], 'should tint the model');
      }
    },
    {
      name: 'Scenegraph custom url missing',
      layer: {
        type: '3D',
        id: 'test_layer_custom_empty',
        config: {
          dataId,
          label: 'gps 3d',
          columns,
          visConfig: {
            scenegraph: CUSTOM_SCENEGRAPH_MODEL_ID,
            scenegraphCustomModelUrl: ''
          }
        }
      },
      datasets: {
        [dataId]: {
          ...preparedDataset,
          filteredIndex
        }
      },
      assert: deckLayers => {
        t.equal(deckLayers.length, 0, 'should not render until a custom URL is set');
      }
    },
    {
      name: 'Scenegraph legacy file url',
      layer: {
        type: '3D',
        id: 'test_layer_legacy',
        config: {
          dataId,
          label: 'gps 3d',
          columns,
          visConfig: {
            scenegraph: 'blob:http://localhost/model.glb',
            angleZ: 90,
            sizeScale: 10
          }
        }
      },
      datasets: {
        [dataId]: {
          ...preparedDataset,
          filteredIndex
        }
      },
      assert: (deckLayers, layer) => {
        const {props} = deckLayers[0];
        t.equal(layer.getScenegraph().url, 'blob:http://localhost/model.glb');
        t.equal(props.sizeScale, 10, 'legacy urls keep the saved size');
        t.deepEqual(props.getOrientation, [0, 0, 90], 'legacy urls do not add model angles');
      }
    },
    {
      name: 'Scenegraph legacy default duck',
      layer: {
        type: '3D',
        id: 'test_layer_legacy_default',
        config: {
          dataId,
          label: 'gps 3d',
          columns,
          visConfig: {
            scenegraph: null,
            angleZ: 90,
            sizeScale: 10
          }
        }
      },
      datasets: {
        [dataId]: {
          ...preparedDataset,
          filteredIndex
        }
      },
      assert: (deckLayers, layer) => {
        const {props} = deckLayers[0];
        t.equal(
          layer.config.visConfig.scenegraph,
          LEGACY_DEFAULT_SCENEGRAPH_URL,
          'null scenegraph keeps the pre-gallery duck'
        );
        t.equal(props.sizeScale, 10, 'legacy default duck keeps the saved size');
        t.deepEqual(
          props.getOrientation,
          [0, 0, 90],
          'legacy default duck does not add the gallery model yaw'
        );
      }
    }
  ];

  testRenderLayerCases(t, ScenegraphLayer, TEST_CASES);

  stubedFetch.restore();
  t.end();
});

test('#ScenegraphLayer -> geojson centroid', t => {
  const layer = new ScenegraphLayer({
    id: 'scenegraph-geojson',
    dataId: 'geo',
    columnMode: 'geojson',
    columns: {
      geojson: {value: 'geom', fieldIdx: 0}
    }
  });
  const rows = [
    [{type: 'Point', coordinates: [-122.4, 37.8]}],
    [
      {
        type: 'LineString',
        coordinates: [
          [0, 0],
          [2, 2]
        ]
      }
    ],
    [null]
  ];
  const dataset = {
    dataContainer: {
      numRows: () => rows.length,
      valueAt: (index, fieldIdx) => rows[index][fieldIdx]
    },
    fields: [{name: 'geom', fieldIdx: 0, type: 'geojson'}],
    gpuFilter: getGpuFilterProps([], 'geo', []),
    filteredIndex: [0, 1, 2]
  };

  layer.updateLayerMeta(dataset);
  const data = layer.calculateDataAttribute(dataset, () => null);

  t.equal(layer.config.columnMode, 'geojson', 'geojson column mode is selected');
  t.equal(data.length, 2, 'skips features without geometry');
  t.deepEqual(data[0].position, [-122.4, 37.8, 0], 'point features keep their coordinate');
  t.deepEqual(data[1].position, [1, 1, 0], 'lines and polygons use the vertex centroid');
  t.end();
});

test('#ScenegraphLayer -> reducer numeric filters without GPU extensions', t => {
  for (const columnMode of ['points', 'geojson']) {
    const table = new KeplerTable({info: {id: 'models'}, color: [1, 2, 3]});
    const rows = [0, 10, 20, 10].map((value, index) => [
      index === 3 ? null : 1 + index,
      30 + index,
      index === 3 ? null : {type: 'Point', coordinates: [30 + index, 1 + index]},
      value,
      [20, 0, 10, 10][index],
      index === 0 ? 'exclude' : 'keep'
    ]);
    const originalRows = JSON.stringify(rows);
    let expectedRows = rows;
    table.importData({
      data: {
        fields: ['lat', 'lng', 'geom', 'value', 'other', 'group'].map(name => ({
          name,
          type: name === 'geom' ? 'geojson' : name === 'group' ? 'string' : 'real'
        })),
        rows
      }
    });
    const layer = validateLayerWithData(
      table,
      {
        type: '3D',
        config: {
          dataId: 'models',
          columnMode,
          columns: columnMode === 'geojson' ? {geojson: 'geom'} : columns
        }
      },
      LayerClasses
    );
    let state = {
      ...INITIAL_VIS_STATE,
      datasets: {models: table},
      layers: [layer],
      layerData: [layer.formatLayerData({models: table})]
    };
    const apply = action => {
      state = visStateReducer(state, action);
    };
    const check = (label, expectedIndexes) => {
      const currentLayer = state.layers[0];
      const dataset = state.datasets.models;
      const [rendered] = currentLayer.renderLayer({
        data: state.layerData[0],
        gpuFilter: dataset.gpuFilter,
        mapState: INITIAL_MAP_STATE,
        idx: 0,
        visible: true,
        layerCallbacks: {},
        interactionConfig: INITIAL_VIS_STATE.interactionConfig
      });
      const {data, getPosition, getFilterValue, extensions} = rendered.props;
      t.deepEqual(extensions, [], `${columnMode}: GPU filtering remains disabled`);
      t.deepEqual(
        data.map(d => d.index),
        expectedIndexes,
        `${columnMode}: ${label}`
      );
      t.deepEqual(
        data.map(getPosition),
        expectedIndexes.map(index => [30 + index, 1 + index, 0]),
        `${columnMode}: positions remain aligned with source rows`
      );
      for (const d of data) {
        t.deepEqual(
          getFilterValue(d),
          dataset.gpuFilter.filterValueAccessor(dataset.dataContainer)()({index: d.index}),
          `${columnMode}: filter accessor uses the original row index`
        );
        t.deepEqual(
          currentLayer.getHoverData(d, dataset.dataContainer, dataset.fields).values(),
          expectedRows[d.index],
          `${columnMode}: picking resolves the original row`
        );
      }
    };
    check('no filter skips invalid positions', [0, 1, 2]);
    apply(VisStateActions.addFilter('models'));
    apply(VisStateActions.setFilter(0, 'name', 'value'));
    apply(VisStateActions.setFilter(0, 'value', [5, 15]));
    t.equal(state.filters[0].gpu, true, 'numeric filter uses GPU configuration');
    t.deepEqual(state.datasets.models.filteredIndex, [0, 1, 2, 3], 'CPU rows are unchanged');
    check('numeric range renders only the matching valid model', [1]);
    apply(VisStateActions.setFilter(0, 'name', 'other'));
    apply(VisStateActions.setFilter(0, 'value', [5, 15]));
    check('changing fields updates the original row lookup', [2]);
    apply(VisStateActions.setFilter(0, 'name', 'value'));
    apply(VisStateActions.setFilter(0, 'value', [0, 0]));
    check('domain minimum is active', [0]);
    apply(VisStateActions.addFilter('models'));
    apply(VisStateActions.setFilter(1, 'name', 'other'));
    apply(VisStateActions.setFilter(1, 'value', [0, 0]));
    check('multiple channels intersect to an empty result', []);
    apply(VisStateActions.setFilter(0, 'value', [0, 20]));
    check('expanding a range restores rows', [1]);
    apply(VisStateActions.removeFilter(1));
    check('removing a channel restores rows', [0, 1, 2]);
    apply(VisStateActions.addFilter('models'));
    apply(VisStateActions.setFilter(1, 'name', 'group'));
    apply(VisStateActions.setFilter(1, 'value', ['keep']));
    check('CPU category filtering is preserved', [1, 2]);
    apply(VisStateActions.setFilter(0, 'value', [5, 15]));
    check('CPU and GPU filters intersect', [1]);
    apply(VisStateActions.removeFilter(0));
    check('clearing GPU filters keeps CPU selection', [1, 2]);
    apply(VisStateActions.removeFilter(0));
    check('clearing all filters restores all valid models', [0, 1, 2]);
    t.equal(JSON.stringify(rows), originalRows, 'filtering does not mutate source rows');
    apply(VisStateActions.addFilter('models'));
    apply(VisStateActions.setFilter(0, 'name', 'value'));
    apply(VisStateActions.setFilter(0, 'value', [5, 15]));
    const oldContainer = state.datasets.models.dataContainer;
    const oldRevision = state.datasets.models.dataRevision;
    expectedRows = rows.map((row, index) => [
      ...row.slice(0, 3),
      [10, 20, 0, 10][index],
      ...row.slice(4)
    ]);
    apply(VisStateActions.addToDataset('models', expectedRows, {upsertBy: 'lng'}));
    t.equal(state.datasets.models.dataContainer, oldContainer, 'row edit keeps the container');
    t.equal(state.datasets.models.dataContainer.numRows(), 4, 'row count is unchanged');
    t.ok(state.datasets.models.dataRevision > oldRevision, 'row edit advances the data revision');
    check('same-size row edits refresh numeric filtering', [0]);
    apply(VisStateActions.removeFilter(0));
    state.datasets.models = copyTableAndUpdate(state.datasets.models, {
      filteredIndexByLayer: {[state.layers[0].id]: [2, 1]}
    });
    state.layerData[0] = state.layers[0].formatLayerData(state.datasets, state.layerData[0]);
    check('layer-specific CPU indexes retain their order', [2, 1]);
    const cachedData = state.layerData[0].data;
    t.equal(
      state.layers[0].formatLayerData(state.datasets, state.layerData[0]).data,
      cachedData,
      'unchanged inputs reuse formatted data'
    );
    state.datasets.models = copyTableAndUpdate(state.datasets.models, {
      filteredIndexByLayer: {[state.layers[0].id]: []}
    });
    state.layerData[0] = state.layers[0].formatLayerData(state.datasets, state.layerData[0]);
    check('empty CPU selection stays empty', []);
    apply(VisStateActions.removeFromDataset('models', [0, 1, 2, 3]));
    t.equal(state.datasets.models.dataContainer.numRows(), 0, 'dataset is empty');
    check('empty dataset stays empty', []);
  }
  t.end();
});

test('#ScenegraphLayer -> GCS model URL', t => {
  t.equal(
    toCorsSafeGcsUrl('https://storage.googleapis.com/kepler-examples/duck.glb'),
    'https://storage.googleapis.com/storage/v1/b/kepler-examples/o/duck.glb?alt=media',
    'rewrites public GCS object URLs to the CORS-enabled download API'
  );
  const signed =
    'https://storage.googleapis.com/kepler-examples/duck.glb?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Signature=abc';
  t.equal(toCorsSafeGcsUrl(signed), signed, 'leaves signed GCS URLs unchanged');
  const signedVirtualHost =
    'https://kepler-examples.storage.googleapis.com/duck.glb?GoogleAccessId=test&Expires=1&Signature=abc';
  t.equal(
    toCorsSafeGcsUrl(signedVirtualHost),
    signedVirtualHost,
    'leaves virtual-hosted signed GCS URLs unchanged'
  );
  t.equal(
    toCorsSafeGcsUrl('https://studio-public-data.foursquare.com/statics/keplergl/Duck.glb'),
    'https://studio-public-data.foursquare.com/statics/keplergl/Duck.glb',
    'leaves non-GCS URLs unchanged'
  );
  t.equal(
    toCorsSafeGcsUrl('blob:http://localhost/model.glb'),
    'blob:http://localhost/model.glb',
    'leaves local file URLs unchanged'
  );
  t.end();
});

test('#ScenegraphLayer -> saved map without a model', t => {
  const saved = {
    version: CURRENT_VERSION,
    config: {
      visState: {
        layers: [
          {
            id: 'legacy-3d',
            type: '3D',
            config: {
              dataId: 'd',
              label: 'old duck',
              visConfig: {scenegraph: null, angleZ: 90, sizeScale: 10}
            }
          },
          {
            id: 'trip-0',
            type: 'trip',
            config: {
              dataId: 'd',
              label: 'trip',
              visConfig: {scenegraph: null, scenegraphEnabled: false}
            }
          }
        ]
      }
    }
  };
  const layers = SchemaManager.parseSavedConfig(saved).visState.layers;
  const duck = layers.find(layer => layer.type === '3D');
  const trip = layers.find(layer => layer.type === 'trip');

  t.equal(
    duck.config.visConfig.scenegraph,
    LEGACY_DEFAULT_SCENEGRAPH_URL,
    'saved 3D layers with a null model keep the pre-gallery duck'
  );
  t.equal(duck.config.visConfig.angleZ, 90, 'saved angle Z is preserved');
  t.equal(trip.config.visConfig.scenegraph, null, 'trip layers keep an empty model');
  t.end();
});
