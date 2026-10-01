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
import {DEFAULT_SCENEGRAPH_MODEL, CUSTOM_SCENEGRAPH_MODEL_ID} from '@kepler.gl/constants';
import {KeplerGlLayers, toCorsSafeGcsUrl} from '@kepler.gl/layers';
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
              index: 0,
              position: [testRows[0][2], testRows[0][1], 0]
            },
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
          [
            [testRows[0][2], testRows[0][1], 0],
            [testRows[4][2], testRows[4][1], 0]
          ],
          'getPosition should return correct lat lng'
        );
        // getFilterValue
        t.deepEqual(
          layerData.data.map(layerData.getFilterValue),
          [
            [Number.MIN_SAFE_INTEGER, 0, 0, 0],
            [moment.utc(testRows[4][0]).valueOf() - preparedFilterDomain0, 0, 0, 0]
          ],
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

test('#ScenegraphLayer -> GCS model URL', t => {
  t.equal(
    toCorsSafeGcsUrl('https://storage.googleapis.com/kepler-examples/duck.glb'),
    'https://storage.googleapis.com/storage/v1/b/kepler-examples/o/duck.glb?alt=media',
    'rewrites public GCS object URLs to the CORS-enabled download API'
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
