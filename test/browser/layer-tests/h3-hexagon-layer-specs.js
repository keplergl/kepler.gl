// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import moment from 'moment';

import {
  testCreateCases,
  testFormatLayerDataCases,
  testRenderLayerCases,
  preparedDataset,
  dataId,
  testRows,
  preparedFilterDomain0,
  hexagonIdLayerMeta
} from 'test/helpers/layer-utils';
import {KeplerGlLayers, h3DefaultElevation as defaultElevation} from '@kepler.gl/layers';
import {getCentroid, idToPolygonGeo} from '@kepler.gl/utils';

import {copyTableAndUpdate} from '@kepler.gl/table';

const {H3Layer} = KeplerGlLayers;
const columns = {
  lat: 'lat',
  lng: 'lng',
  hex_id: 'hex_id'
};

test('#H3Layer -> constructor', t => {
  const TEST_CASES = {
    CREATE: [
      {
        props: {
          dataId: 'smoothie',
          isVisible: true,
          label: 'test h3 layer'
        },
        test: layer => {
          t.ok(layer.config.dataId === 'smoothie', 'H3Layer dataId should be correct');
          t.ok(layer.type === 'hexagonId', 'type should be h3');
          t.ok(layer.isAggregated === false, 'H3Layer is not aggregated');
          t.ok(layer.config.label === 'test h3 layer', 'label should be correct');
        }
      }
    ]
  };

  testCreateCases(t, H3Layer, TEST_CASES.CREATE);
  t.end();
});

test('#H3Layer -> formatLayerData', t => {
  const filteredIndex = [0, 2, 4];

  const TEST_CASES = [
    {
      name: 'h3.1',
      layer: {
        config: {
          dataId,
          label: 'gps point h3',
          columns,
          color: [2, 3, 4]
        },
        type: 'hexagonId',
        id: 'test_layer_1'
      },
      datasets: {
        [dataId]: copyTableAndUpdate(preparedDataset, {filteredIndex})
      },
      assert: result => {
        const {layerData, layer} = result;
        const expectedLayerData = {
          data: [
            {
              index: 0,
              id: '89283082c2fffff',
              centroid: getCentroid({id: '89283082c2fffff'})
            },
            {
              index: 4,
              id: '89283082c3bffff',
              centroid: getCentroid({id: '89283082c3bffff'})
            }
          ],
          getElevation: () => {},
          getFilterValue: () => {},
          getFillColor: () => {},
          getLineColor: () => {},
          getHexId: () => {},
          getCoverage: () => {},
          getPosition: () => {},
          textLabels: () => {}
        };
        t.deepEqual(
          Object.keys(layerData).sort(),
          Object.keys(expectedLayerData).sort(),
          `layerData should have ${expectedLayerData.length} keys`
        );
        t.deepEqual(
          layerData.data,
          expectedLayerData.data,
          'should format correct point layerData data'
        );
        // getFillColor
        t.deepEqual(layerData.getFillColor, [2, 3, 4], 'getFillColor should be a constant');
        // getLineColor
        t.deepEqual(layerData.getLineColor, [2, 3, 4], 'getLineColor should be a constant');
        // getElevation
        t.deepEqual(layerData.getElevation, defaultElevation, 'getElevation should be a constant');
        // getHexId
        t.deepEqual(
          layerData.data.map(layerData.getHexId),
          ['89283082c2fffff', '89283082c3bffff'],
          'getHexId should return correct hex id'
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
        t.deepEqual(layer.meta, hexagonIdLayerMeta, 'should format correct point layer meta');
      }
    },
    {
      name: 'H3 layer format data. with colorField, strokeColorField, and sizeField',
      layer: {
        config: {
          dataId,
          label: 'h3.2',
          columns,
          color: [10, 10, 10],
          // fill color by types(string)
          colorField: {
            type: 'string',
            name: 'types'
          },
          // stroke color by types(string)
          strokeColorField: {
            type: 'string',
            name: 'types'
          },
          // size by id(integer)
          sizeField: {
            type: 'real',
            name: 'trip_distance'
          },
          visConfig: {
            colorRange: {
              colors: ['#010101', '#020202', '#030303']
            },
            strokeColorRange: {
              colors: ['#010101', '#020202', '#030303']
            },
            elevationRange: [10, 20],
            enable3d: true
          }
        },
        type: 'hexagonId',
        id: 'test_layer_2'
      },
      datasets: {
        [dataId]: copyTableAndUpdate(preparedDataset, {filteredIndex})
      },
      assert: result => {
        const {layerData} = result;

        // getSourceColor
        // domain: ['driver_analytics', 'driver_analytics_0', 'driver_gps']
        // range ['#010101', '#020202', '#030303']
        t.deepEqual(
          layerData.data.map(layerData.getFillColor),
          [
            [2, 2, 2],
            [1, 1, 1]
          ],
          'getFillColor should be correct'
        );

        t.deepEqual(
          layerData.data.map(layerData.getLineColor),
          [
            [2, 2, 2],
            [1, 1, 1]
          ],
          'getLineColor should be correct'
        );

        // getElevation
        // domain: [1.59, 11]
        // range: [0, 500]
        // value [1.59, 2.37]
        t.deepEqual(
          layerData.data.map(layerData.getElevation),
          [0, 41.445270988310305],
          'getElevation should correct'
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
      }
    }
  ];

  testFormatLayerDataCases(t, H3Layer, TEST_CASES);
  t.end();
});

test('#H3Layer -> renderLayer', t => {
  const filteredIndex = [0, 2, 4];

  const TEST_CASES = [
    {
      name: 'Test render h3.2',
      layer: {
        id: 'test_layer_1',
        type: 'hexagonId',
        config: {
          dataId,
          label: 'h3 hex',
          columns,
          color: [1, 2, 3],
          visConfig: {
            worldUnitSize: 0.5,
            elevationScale: 5
          }
        }
      },
      datasets: {
        [dataId]: copyTableAndUpdate(preparedDataset, {filteredIndex})
      },
      assert: (deckLayers, layer) => {
        t.equal(layer.type, 'hexagonId', 'should create 1 hexagonId layer');
        t.equal(deckLayers.length, 2, 'Should create 2 deck.gl layers');
        const expectedLayerIds = ['test_layer_1', 'test_layer_1-hexagon-cell'];

        t.deepEqual(
          deckLayers.map(l => l.id),
          expectedLayerIds,
          'should create 1 composite, 1 hexagon-cell layer'
        );

        const {props} = deckLayers[0];

        const expectedProps = {
          opacity: layer.config.visConfig.opacity,
          filterRange: preparedDataset.gpuFilter.filterRange,
          wrapLongitude: false,
          coverage: 1,
          autoHighlight: false,
          highlightColor: [255, 255, 255, 60],
          extruded: false,
          elevationScale: 5,
          filled: true,
          stroked: false
        };
        Object.keys(expectedProps).forEach(key => {
          t.deepEqual(props[key], expectedProps[key], `should have correct props.${key}`);
        });
      }
    },
    {
      name: 'Test render h3.2 with text label',
      layer: {
        id: 'test_layer_2',
        type: 'hexagonId',
        config: {
          dataId,
          label: 'h3 hex',
          columns,
          color: [1, 2, 3],
          visConfig: {
            worldUnitSize: 0.5,
            elevationScale: 5
          },
          textLabel: [
            {
              field: {
                name: 'types',
                format: ''
              },
              format: ''
            }
          ]
        }
      },
      datasets: {
        [dataId]: preparedDataset
      },
      assert: (deckLayers, layer) => {
        t.equal(layer.type, 'hexagonId', 'should create 1 hexagonId layer');

        const expectedTextLabels = [
          {
            field: {
              name: 'types',
              id: 'types',
              displayName: 'types',
              format: '',
              fieldIdx: 5,
              type: 'string',
              analyzerType: 'STRING',
              valueAccessor: preparedDataset.fields[5].valueAccessor
            },
            color: [255, 255, 255],
            size: 18,
            offset: [0, 0],
            anchor: 'middle',
            alignment: 'center',
            outlineWidth: 0,
            outlineColor: [255, 0, 0, 255],
            background: false,
            backgroundColor: [0, 0, 200, 255]
          }
        ];

        t.deepEqual(
          layer.config.textLabel,
          expectedTextLabels,
          'should create textLabel using field "types"'
        );

        t.equal(deckLayers.length, 4, 'Should create 4 deck.gl layers');
        const expectedLayerIds = [
          'test_layer_2',
          'test_layer_2-hexagon-cell',
          'test_layer_2-label-types',
          'test_layer_2-label-types-characters'
        ];

        t.deepEqual(
          deckLayers.map(l => l.id),
          expectedLayerIds,
          'should create 1 composite, 1 hexagon-cell layer, 1 text layer, 1 multi-icon layer'
        );
      }
    }
  ];

  testRenderLayerCases(t, H3Layer, TEST_CASES);
  t.end();
});

test('#H3Layer -> idToPolygonGeo', t => {
  const h3Object = {
    index: 411,
    id: '882a100d01fffff'
  };

  const hexagonOutline = idToPolygonGeo(h3Object);
  const expectedCoordinates = [
    [-73.9556604529423, 40.747207768842344],
    [-73.96203986286912, 40.746155567377926],
    [-73.96400718290255, 40.74169679631741],
    [-73.95959600220597, 40.73829055843986],
    [-73.95321761814058, 40.73934254051138],
    [-73.9512493890226, 40.74380097982341],
    [-73.9556604529423, 40.747207768842344]
  ];

  const expectedHexagonOutline = {
    type: 'Feature',
    geometry: {
      coordinates: expectedCoordinates,
      type: 'LineString'
    },
    properties: undefined
  };
  t.deepEqual(
    hexagonOutline,
    expectedHexagonOutline,
    'should generate geojson object of hexagon outline (LineString)'
  );

  const properties = {isClosed: true};
  const hexagonPolygon = idToPolygonGeo(h3Object, properties);

  const expectedHexagonPolygon = {
    type: 'Feature',
    geometry: {
      coordinates: [expectedCoordinates],
      type: 'Polygon'
    },
    properties: {isClosed: true}
  };
  t.deepEqual(
    hexagonPolygon,
    expectedHexagonPolygon,
    'should generate geojson object of hexagon outline (LineString)'
  );

  t.end();
});
