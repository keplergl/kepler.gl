import test from 'tape';
import {
  testCreateCases,
  testFormatLayerDataCases
} from 'test/helpers/layer-utils';
import {H3HexagonLayer} from 'keplergl-layers';
import {
  getCentroid,
  getVertices
} from 'keplergl-layers/h3-hexagon-layer/h3-utils';

import {getLightSettingsFromBounds} from 'utils/layer-utils/layer-utils';

test('#H3HexagonLayer -> constructor', t => {
  const TEST_CASES = {
    CREATE: [
      {
        props: {
          dataId: 'smoothie',
          isVisible: true,
          label: 'test geojson layer'
        },
        test: layer => {
          t.ok(
            layer.config.dataId === 'smoothie',
            'H3HexagonLayer dataId should be correct'
          );
          t.ok(layer.type === 'hexagonId', 'type should be hexagonId');
          t.ok(
            layer.isAggregated === false,
            'H3HexagonLayer is not aggregated'
          );
        }
      }
    ]
  };

  testCreateCases(t, H3HexagonLayer, TEST_CASES.CREATE);
  t.end();
});

test('#H3HexagonLayer -> formatLayerData', async t => {
  const data = [
    ['', 5],
    [null, 3],
    ['50042a8003a81', 1],
    [0, 1],
    ['5004298803a7d', 2],
    ['5004296803a84', 2],
    ['5004296003a88', 2]
  ];

  const allData = [
    ['', 5],
    [null, 3],
    ['50042a8003a81', 1],
    ['50042b7003abe', 4],
    [0, 1],
    ['5004298803a7d', 2],
    ['5004296003a85', 10],
    ['5004296803a84', 2],
    ['5004296003a88', 2]
  ];
  const filteredIndex = [0, 1, 2, 4, 5, 7, 8];

  const [centroid2, centroid3, centroid5, centroid6, centroid7, centroid8] = [
    '50042a8003a81',
    '50042b7003abe',
    '5004298803a7d',
    '5004296003a85',
    '5004296803a84',
    '5004296003a88'
  ].map(id => getCentroid({id}));

  const bounds = [
    -122.45514368970282,
    37.36708911155212,
    -121.92297052823525,
    37.79218213227278
  ];
  const centroids = {
    2: centroid2,
    3: centroid3,
    6: centroid6,
    5: centroid5,
    7: centroid7,
    8: centroid8
  };
  const vertices = getVertices({id: '50042a8003a81'});

  const expectedLayerData = {
    data: [
      {
        index: 2,
        data: allData[2],
        id: '50042a8003a81',
        centroid: centroid2
      },
      {
        index: 4,
        data: allData[5],
        id: '5004298803a7d',
        centroid: centroid5
      },
      {
        index: 5,
        data: allData[7],
        id: '5004296803a84',
        centroid: centroid7
      },
      {
        index: 6,
        data: allData[8],
        id: '5004296003a88',
        centroid: centroid8
      }
    ],
    getElevation: () => {},
    getColor: () => {},
    getHexId: () => {},
    hexagonVertices: vertices
  };

  const expectedDTF = {centroids, vertices};
  const expectedMeta = {
    bounds,
    lightSettings: getLightSettingsFromBounds(bounds)
  };

  const TEST_CASES = [
    {
      props: {
        dataId: '22245',
        label: 'h3 hex',
        color: [1, 2, 3],
        columns: {
          hex_id: {
            fieldIdx: 0,
            value: 'hex_id'
          }
        }
      },
      data: [data, allData, filteredIndex, undefined],
      test: result => {
        t.deepEqual(
          Object.keys(result.layerData),
          ['data', 'getElevation', 'getColor', 'getHexId', 'hexagonVertices'],
          'should format hexagonid layerdata with same keys'
        );
        t.deepEqual(
          result.layerData.data,
          expectedLayerData.data,
          'should format layerData data correctly'
        );
        t.deepEqual(
          result.layerData.hexagonVertices,
          expectedLayerData.hexagonVertices,
          'should format layerData hexagonVertices'
        );
        t.deepEqual(
          result.layer.dataToFeature,
          expectedDTF,
          'should format hexagonid updatedLayer.dataToFeature.centroids'
        );
        t.deepEqual(
          result.layer.meta,
          expectedMeta,
          'should format hexagonid updatedLayer.metaData'
        );
      }
    }
  ];

  testFormatLayerDataCases(t, H3HexagonLayer, TEST_CASES);
  t.end();
});
