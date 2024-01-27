// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import {defaultElevation, defaultLineWidth, defaultRadius, KeplerGlLayers} from '@kepler.gl/layers';
import {copyTableAndUpdate, createNewDataEntry} from '@kepler.gl/table';

const {GeojsonLayer} = KeplerGlLayers;

import {updatedLayerV2} from 'test/fixtures/test-csv-data';
import {
  dataId,
  preparedGeoDataset,
  testCreateCases,
  testFormatLayerDataCases,
  testRenderLayerCases,
  prepareGeojsonDataset,
  geoFilterDomain0,
  geojsonFilterDomain0
} from 'test/helpers/layer-utils';
import {
  updatedGeoJsonLayer,
  geoJsonWithStyle,
  geoStyleDataToFeature,
  geoStyleMeta
} from 'test/fixtures/geojson';
import {processGeojson} from '@kepler.gl/processors';

test('#GeojsonLayer -> constructor', t => {
  const TEST_CASES = {
    CREATE: [
      {
        props: {
          dataId: 'smoothie',
          isVisible: true,
          label: 'test geojson layer'
        },
        test: layer => {
          t.ok(layer.config.dataId === 'smoothie', 'geojsonLayer dataId should be correct');
          t.ok(layer.type === 'geojson', 'type should be geojson');
          t.ok(layer.isAggregated === false, 'geojsonLayer is not aggregated');
        }
      }
    ]
  };

  testCreateCases(t, GeojsonLayer, TEST_CASES.CREATE);
  t.end();
});

test('#GeojsonLayer -> formatLayerData', t => {
  const filteredIndex = [0, 2, 4];

  const TEST_CASES = [
    {
      name: 'Geojson wkt polygon.1',
      layer: {
        type: 'geojson',
        id: 'test_geojson_layer_1',
        config: {
          color: [1, 2, 3],
          dataId,
          label: 'some geometry file',
          columns: {
            geojson: 'simplified_shape_v2'
          }
        }
      },
      datasets: {
        [dataId]: copyTableAndUpdate(preparedGeoDataset, {filteredIndex})
      },
      assert: result => {
        const {layerData, layer} = result;
        const expectedLayerData = {
          data: [updatedLayerV2.dataToFeature[2], updatedLayerV2.dataToFeature[4]]
        };
        const expectedDataKeys = [
          'data',
          'getElevation',
          'getFillColor',
          'getFilterValue',
          'getFiltered',
          'getLineColor',
          'getLineWidth',
          'getPointRadius'
        ];
        const expectedLayerMeta = updatedLayerV2.meta;
        const expectedDataToFeature = updatedLayerV2.dataToFeature;

        t.deepEqual(
          Object.keys(layerData).sort(),
          expectedDataKeys,
          'layerData should have 7 keys'
        );
        // data
        t.deepEqual(
          layerData.data,
          expectedLayerData.data,
          'should format correct geojson layerData'
        );
        t.deepEqual(
          layerData.data.map(layerData.getElevation),
          [defaultElevation, defaultElevation],
          'getElevation should return correct value'
        );
        t.deepEqual(
          layerData.data.map(layerData.getFillColor),
          [
            [1, 2, 3],
            [1, 2, 3]
          ],
          'getFillColor should return correct value'
        );
        t.deepEqual(
          layerData.data.map(layerData.getFilterValue),
          [
            [Number.MIN_SAFE_INTEGER, 0, 0, 0],
            [11.8 - geoFilterDomain0, 0, 0, 0]
          ],
          'getFilterValue should return correct value'
        );
        t.deepEqual(
          layerData.data.map(layerData.getLineColor),
          [
            [1, 2, 3],
            [1, 2, 3]
          ],
          'getLineColor should return correct value'
        );
        t.deepEqual(
          layerData.data.map(layerData.getLineWidth),
          [defaultLineWidth, defaultLineWidth],
          'getLineWidth should return correct value'
        );
        t.deepEqual(
          layerData.data.map(layerData.getPointRadius),
          [defaultRadius, defaultRadius],
          'getPointRadius should return correct value'
        );
        // meta
        t.deepEqual(layer.meta, expectedLayerMeta, 'should format correct geojson layer meta');
        // dataToFeature
        t.equal(
          layer.dataToFeature.length,
          expectedDataToFeature.length,
          'should format correct geojson dataToFeature length'
        );

        layer.dataToFeature.forEach((feature, i) => {
          t.deepEqual(
            feature,
            expectedDataToFeature[i],
            `should format correct geojson dataToFeature[${i}]`
          );
        });
      }
    },
    {
      name: 'Geojson wkt polygon.2',
      layer: {
        type: 'geojson',
        id: 'test_geojson_layer_2',
        config: {
          dataId,
          label: 'some geometry file',
          columns: {
            geojson: 'simplified_shape'
          },
          visConfig: {
            stroked: true,
            enable3d: true,
            colorRange: {
              colors: ['#010101', '#020202', '#030303']
            },
            strokeColorRange: {
              colors: ['#040404', '#050505', '#060606']
            }
          },
          // color by c_zip_type(string)
          colorField: preparedGeoDataset.fields.find(f => f.name === 'c_zip_type'),
          strokeColorField: preparedGeoDataset.fields.find(f => f.name === 'c_zip_type'),

          // stroke by c_number(real)
          sizeField: preparedGeoDataset.fields.find(f => f.name === 'c_number'),
          // stroke by a_zip(int)
          heightField: preparedGeoDataset.fields.find(f => f.name === 'a_zip')
        }
      },
      datasets: {
        [dataId]: copyTableAndUpdate(preparedGeoDataset, {filteredIndex})
      },
      assert: result => {
        const {layerData, layer} = result;
        const expectedLayerData = {
          data: [updatedLayerV2.dataToFeature[2], updatedLayerV2.dataToFeature[4]]
        };
        const expectedDataKeys = [
          'data',
          'getElevation',
          'getFillColor',
          'getFilterValue',
          'getFiltered',
          'getLineColor',
          'getLineWidth',
          'getPointRadius'
        ];
        const expectedLayerMeta = updatedLayerV2.meta;
        const expectedDataToFeature = updatedLayerV2.dataToFeature;

        t.deepEqual(
          Object.keys(layerData).sort(),
          expectedDataKeys,
          'layerData should have 7 keys'
        );
        // data
        t.deepEqual(
          layerData.data,
          expectedLayerData.data,
          'should format correct geojson layerData'
        );
        t.deepEqual(
          // by a_zip
          // domain [7014, 7416]
          // [7016, 7029] -> [0, 500]
          layerData.data.map(layerData.getElevation),
          [(2 / 402) * 500, (15 / 402) * 500],
          'getElevation should return correct value'
        );
        t.deepEqual(
          // by c_zip_type
          // 'C_Medium_High' null  'A_Low_Rural',
          layerData.data.map(layerData.getFillColor),
          [
            [2, 2, 2],
            [2, 2, 2]
          ],
          'getFillColor should return correct value'
        );

        t.deepEqual(
          // by m_rate
          // 7.5 null 10
          layerData.data.map(layerData.getFilterValue),
          [
            [Number.MIN_SAFE_INTEGER, 0, 0, 0],
            [11.8 - geoFilterDomain0, 0, 0, 0]
          ],
          'getFilterValue should return correct value'
        );
        t.deepEqual(
          // by c_zip_type
          // 'C_Medium_High' null  'A_Low_Rural',
          layerData.data.map(layerData.getLineColor),
          [
            [5, 5, 5],
            [5, 5, 5]
          ],
          'getLineColor should return correct value'
        );
        t.deepEqual(
          // c_number
          // domain [13.8, 29.2]
          // range [0, 10]
          // 27.6, 39.1 -> [0, 10]
          layerData.data.map(layerData.getLineWidth),
          [8.961038961038962, 16.42857142857143],
          'getLineWidth should return correct value'
        );
        t.deepEqual(
          layerData.data.map(layerData.getPointRadius),
          [1, 1],
          'getPointRadius should return correct value'
        );
        // meta
        t.deepEqual(layer.meta, expectedLayerMeta, 'should format correct geojson layerData');
        // dataToFeature
        t.deepEqual(
          layer.dataToFeature,
          expectedDataToFeature,
          'should format correct geojson layerData'
        );
      }
    },
    {
      name: 'Geojson wkt polygon.3',
      layer: {
        type: 'geojson',
        id: 'test_geojson_layer_3',
        config: {
          dataId,
          label: 'some geometry file',
          columns: {
            geojson: '_geojson'
          },
          color: [5, 5, 5]
        }
      },
      datasets: {
        [dataId]: copyTableAndUpdate(prepareGeojsonDataset, {filteredIndex})
      },
      assert: result => {
        const {layerData, layer} = result;

        const expectedLayerData = {
          data: [
            updatedGeoJsonLayer.dataToFeature[0],
            updatedGeoJsonLayer.dataToFeature[2],
            updatedGeoJsonLayer.dataToFeature[4]
          ]
        };
        const expectedDataKeys = [
          'data',
          'getElevation',
          'getFillColor',
          'getFilterValue',
          'getFiltered',
          'getLineColor',
          'getLineWidth',
          'getPointRadius'
        ];
        const expectedLayerMeta = updatedGeoJsonLayer.meta;
        const expectedDataToFeature = updatedGeoJsonLayer.dataToFeature;

        t.deepEqual(
          Object.keys(layerData).sort(),
          expectedDataKeys,
          'layerData should have 7 keys'
        );
        // // data
        t.deepEqual(
          layerData.data,
          expectedLayerData.data,
          'should format correct geojson layerData'
        );
        t.deepEqual(
          layerData.data.map(layerData.getElevation),
          [defaultElevation, defaultElevation, defaultElevation],
          'getElevation should return correct value'
        );
        t.deepEqual(
          layerData.data.map(layerData.getFillColor),
          [
            [5, 5, 5],
            [5, 5, 5],
            [5, 5, 5]
          ],
          'getFillColor should return correct value'
        );
        t.deepEqual(
          layerData.data.map(layerData.getFilterValue),
          [
            [11 - geojsonFilterDomain0, 0, 0, 0],
            [20 - geojsonFilterDomain0, 0, 0, 0],
            [Number.MIN_SAFE_INTEGER, 0, 0, 0]
          ],
          'getFilterValue should return correct value'
        );
        t.deepEqual(
          layerData.data.map(layerData.getLineColor),
          [
            [5, 5, 5],
            [5, 5, 5],
            [5, 5, 5]
          ],
          'getLineColor should return correct value'
        );
        t.deepEqual(
          layerData.data.map(layerData.getLineWidth),
          [1, 1, 1],
          'getLineWidth should return correct value'
        );
        t.deepEqual(
          layerData.data.map(layerData.getPointRadius),
          [defaultLineWidth, defaultLineWidth, defaultLineWidth],
          'getPointRadius should return correct value'
        );

        // meta
        t.deepEqual(layer.meta, expectedLayerMeta, 'should format correct geojson layer meta');
        // dataToFeature
        t.deepEqual(
          layer.dataToFeature,
          expectedDataToFeature,
          'should format correct geojson layer dataToFeature'
        );
      }
    },
    // test case 3
    {
      name: 'Geojson with style properties',
      layer: {
        type: 'geojson',
        id: 'test_geojson_layer_4',
        config: {
          dataId,
          label: 'some geometry file',
          columns: {
            geojson: '_geojson'
          },
          color: [5, 5, 5]
        }
      },
      datasets: createNewDataEntry({
        info: {id: dataId},
        data: processGeojson(geoJsonWithStyle)
      }),
      assert: result => {
        const {layerData, layer} = result;

        const expectedLayerData = {
          data: geoStyleDataToFeature
        };
        const expectedDataKeys = [
          'data',
          'getElevation',
          'getFillColor',
          'getFilterValue',
          'getFiltered',
          'getLineColor',
          'getLineWidth',
          'getPointRadius'
        ];
        const expectedLayerMeta = geoStyleMeta;

        const expectedDataToFeature = geoStyleDataToFeature;

        t.deepEqual(
          Object.keys(layerData).sort(),
          expectedDataKeys,
          'layerData should have 7 keys'
        );
        // // data
        t.deepEqual(
          layerData.data,
          expectedLayerData.data,
          'should format correct geojson layerData'
        );
        t.deepEqual(
          layerData.data.map(layerData.getElevation),
          [10, 10, 10],
          'getElevation should return correct value'
        );
        t.deepEqual(
          layerData.data.map(layerData.getFillColor),
          [
            [1, 2, 3],
            [7, 8, 9],
            [1, 2, 3]
          ],
          'getFillColor should return correct value'
        );
        t.deepEqual(
          layerData.data.map(layerData.getFilterValue),
          [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
          ],
          'getFilterValue should return correct value'
        );
        t.deepEqual(
          layerData.data.map(layerData.getLineColor),
          [
            [4, 5, 6],
            [4, 5, 6],
            [4, 5, 6]
          ],
          'getLineColor should return correct value'
        );
        t.deepEqual(
          layerData.data.map(layerData.getLineWidth),
          [1, 3, 4],
          'getLineWidth should return correct value'
        );
        t.deepEqual(
          layerData.data.map(layerData.getPointRadius),
          [5, 5, 5],
          'getPointRadius should return correct value'
        );

        // meta
        t.deepEqual(layer.meta, expectedLayerMeta, 'should format correct geojson layer meta');
        // dataToFeature
        t.deepEqual(
          layer.dataToFeature,
          expectedDataToFeature,
          'should format correct geojson layer dataToFeature'
        );
      }
    }
  ];

  testFormatLayerDataCases(t, GeojsonLayer, TEST_CASES);
  t.end();
});

test('#GeojsonLayer -> renderLayer', t => {
  const filteredIndex = [0, 2, 4];
  const TEST_CASES = [
    {
      name: 'Test render geojson.1',
      layer: {
        id: 'test_layer_1',
        type: 'geojson',
        config: {
          dataId,
          color: [1, 2, 3],
          label: 'gps point',
          columns: {
            geojson: '_geojson'
          },
          isVisible: true,
          visConfig: {
            strokeColor: [4, 5, 6],
            strokeOpacity: 0.1
          }
        }
      },
      datasets: {
        [dataId]: {
          ...prepareGeojsonDataset,
          filteredIndex
        }
      },
      assert: deckLayers => {
        const ids = ['test_layer_1', 'test_layer_1-polygons-fill', 'test_layer_1-polygons-stroke'];
        t.deepEqual(
          deckLayers.map(l => l.id),
          ids,
          'Should render 3 deck layers'
        );
        // polygon fill attributes;
        const {attributes} = deckLayers[1].state.attributeManager;
        const indices = attributes.indices.value;

        const {props: fillLayerProp} = deckLayers[1];
        const {props: strokeLayerProp} = deckLayers[2];

        const expectedFillLayerProp = {
          extruded: false,
          elevationScale: 5,
          filled: false,
          wireframe: false,
          opacity: 0.8,
          parameters: {depthTest: false},
          visible: true,
          autoHighlight: false,
          wrapLongitude: false,
          id: 'test_layer_1-polygons-fill',
          filterRange: [
            [0, 8],
            [0, 0],
            [0, 0],
            [0, 0]
          ]
        };

        const expectedStrokeLayerProp = {
          widthScale: 128,
          jointRounded: false,
          capRounded: false,
          miterLimit: 2,
          opacity: 0.1,
          visible: true,
          wrapLongitude: false,
          id: 'test_layer_1-polygons-stroke'
        };

        Object.keys(expectedFillLayerProp).forEach(key => {
          t.deepEqual(
            fillLayerProp[key],
            expectedFillLayerProp[key],
            `should have correct fillLayerProp.${key}`
          );
        });

        Object.keys(expectedStrokeLayerProp).forEach(key => {
          t.deepEqual(
            strokeLayerProp[key],
            expectedStrokeLayerProp[key],
            `should have correct strokeLayerProp.${key}`
          );
        });

        // test instanceFilterValues
        const expectedFilterValues = new Float32Array([
          11 - geojsonFilterDomain0,
          0,
          0,
          0, // 0
          11 - geojsonFilterDomain0,
          0,
          0,
          0, // 4
          11 - geojsonFilterDomain0,
          0,
          0,
          0, // 8
          11 - geojsonFilterDomain0,
          0,
          0,
          0, // 12
          11 - geojsonFilterDomain0,
          0,
          0,
          0, // 16
          11 - geojsonFilterDomain0,
          0,
          0,
          0, // 20
          20 - geojsonFilterDomain0,
          0,
          0,
          0, // 24
          20 - geojsonFilterDomain0,
          0,
          0,
          0, // 28
          20 - geojsonFilterDomain0,
          0,
          0,
          0, // 32
          20 - geojsonFilterDomain0,
          0,
          0,
          0, // 36
          Number.MIN_SAFE_INTEGER,
          0,
          0,
          0, // 40
          Number.MIN_SAFE_INTEGER,
          0,
          0,
          0, // 44
          Number.MIN_SAFE_INTEGER,
          0,
          0,
          0, // 48
          Number.MIN_SAFE_INTEGER,
          0,
          0,
          0 // 52
        ]);
        t.deepEqual(
          attributes.filterValues.value.slice(0, (indices.length - 1) * 4),
          expectedFilterValues,
          'Should have correct filterValues'
        );
      }
    }
  ];

  testRenderLayerCases(t, GeojsonLayer, TEST_CASES);
  t.end();
});
