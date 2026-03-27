// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/* eslint-disable max-statements */
import test from 'tape';
import cloneDeep from 'lodash/cloneDeep';

import {
  tripDefaultLineWidth as defaultLineWidth,
  parseTripGeoJsonTimestamp,
  KeplerGlLayers
} from '@kepler.gl/layers';

import {copyTableAndUpdate} from '@kepler.gl/table';
const {TripLayer} = KeplerGlLayers;

import {
  dataId,
  testCreateCases,
  testFormatLayerDataCases,
  testRenderLayerCases,
  prepareTripGeoDataset,
  valueFilterDomain0,
  animationConfig
} from 'test/helpers/layer-utils';
import {TripLayerMeta, dataToFeature, dataToTimeStamp} from 'test/fixtures/trip-geojson';

test('#TripLayer -> constructor', t => {
  const TEST_CASES = {
    CREATE: [
      {
        props: {
          dataId: 'smoothie',
          isVisible: true,
          label: 'test trip layer'
        },
        test: layer => {
          t.ok(layer.config.dataId === 'smoothie', 'tripnLayer dataId should be correct');
          t.ok(layer.type === 'trip', 'type should be trip');
          t.ok(layer.isAggregated === false, 'tripLayer is not aggregated');
        }
      }
    ]
  };

  testCreateCases(t, TripLayer, TEST_CASES.CREATE);
  t.end();
});

test('#TripLayer -> formatLayerData', t => {
  const filteredIndex = [0, 2, 4];

  const TEST_CASES = [
    {
      name: 'Trip Geojson.1',
      layer: {
        type: 'trip',
        id: 'test_trip_layer_1',
        config: {
          color: [1, 2, 3],
          dataId,
          label: 'some trips',
          columns: {
            geojson: '_geojson'
          }
        }
      },
      datasets: {
        [dataId]: copyTableAndUpdate(prepareTripGeoDataset, {filteredIndex})
      },
      assert: result => {
        const {layerData, layer} = result;
        const expectedLayerData = {
          data: [dataToFeature[0], dataToFeature[2], dataToFeature[4]]
        };
        const expectedDataKeys = [
          'data',
          'getPath',
          'getTimestamps',
          'getFilterValue',
          'getColor',
          'getWidth'
        ];

        t.deepEqual(
          Object.keys(layerData).sort(),
          expectedDataKeys.sort(),
          'layerData should have 7 keys'
        );
        // data
        t.deepEqual(
          layerData.data,
          expectedLayerData.data,
          'should format correct geojson layerData'
        );
        t.deepEqual(
          layerData.data.map(layerData.getColor),
          [
            [1, 2, 3],
            [1, 2, 3],
            [1, 2, 3]
          ],
          'getColor should return correct value'
        );
        t.deepEqual(
          layerData.data.map(layerData.getFilterValue),
          [
            [Number.MIN_SAFE_INTEGER, 0, 0, 0],
            [7 - valueFilterDomain0, 0, 0, 0],
            [6 - valueFilterDomain0, 0, 0, 0]
          ],
          'getFilterValue should return correct value'
        );
        t.deepEqual(
          layerData.data.map(layerData.getWidth),
          [defaultLineWidth, defaultLineWidth, defaultLineWidth],
          'getWidth should return correct value'
        );
        t.deepEqual(
          layerData.getPath(layerData.data[0]),
          dataToFeature[0].geometry.coordinates,
          'getPath should return correct coordinates'
        );
        t.deepEqual(
          layerData.getTimestamps(layerData.data[0]),
          dataToTimeStamp[0],
          'getWidth should return getTimestamps'
        );
        // meta
        t.deepEqual(
          Object.keys(layer.meta).sort(),
          ['bounds', 'featureTypes', 'getFeature'],
          'should format correct geojson layer meta keys'
        );
        t.deepEqual(
          layer.meta.bounds,
          TripLayerMeta.bounds,
          'should format correct geojson layer meta bounds'
        );
        t.deepEqual(
          layer.meta.featureTypes,
          TripLayerMeta.featureTypes,
          'should format correct geojson layer meta featureTypes'
        );
        // dataToFeature
        t.deepEqual(
          layer.dataToTimeStamp,
          dataToTimeStamp,
          'should format correct geojson dataToFeature'
        );

        t.deepEqual(
          layer.dataToFeature,
          dataToFeature,
          'should format correct geojson dataToFeature'
        );
      }
    },
    {
      name: 'Trip Geojson.2',
      layer: {
        type: 'trip',
        id: 'test_trip_layer_2',
        config: {
          color: [1, 2, 3],
          dataId,
          label: 'some trips',
          columns: {
            geojson: '_geojson'
          },
          // color by types(string)
          colorField: {
            type: 'string',
            name: 'types'
          },
          // size by trip_distance(real)
          sizeField: {
            type: 'real',
            name: 'trip_distance'
          },
          visConfig: {
            colorRange: {
              colors: ['#010101', '#020202', '#030303']
            },
            sizeRange: [10, 20]
          }
        }
      },
      datasets: {
        [dataId]: copyTableAndUpdate(prepareTripGeoDataset, {filteredIndex})
      },
      assert: result => {
        const {layerData, layer} = result;

        const expectedLayerData = {
          data: [dataToFeature[0], dataToFeature[2], dataToFeature[4]]
        };
        // data
        t.deepEqual(
          layerData.data,
          expectedLayerData.data,
          'should format correct geojson layerData'
        );
        // getColor
        // domain: ['driver_analytics', 'driver_analytics_0', 'driver_gps']
        // range ['#010101', '#020202', '#030303']
        t.deepEqual(
          layerData.data.map(layerData.getColor),
          [
            [2, 2, 2],
            [1, 1, 1],
            [1, 1, 1]
          ],
          'getColor should return correct value'
        );
        // getWidth
        // domain: [2.37, 8.33]
        // range: [10, 20]
        // value [1.59, 2.83, 2.37]
        t.deepEqual(
          layerData.data.map(layerData.getWidth),
          [8.691275167785234, 10.771812080536913, 10],
          'getWidth should return correct value'
        );

        // dataToFeature
        t.deepEqual(
          layer.dataToTimeStamp,
          dataToTimeStamp,
          'should format correct geojson dataToFeature'
        );

        t.deepEqual(
          layer.dataToFeature,
          dataToFeature,
          'should format correct geojson dataToFeature'
        );
      }
    }
  ];

  testFormatLayerDataCases(t, TripLayer, TEST_CASES);
  t.end();
});

test('#TripLayer -> renderLayer', t => {
  const filteredIndex = [0, 2, 4];

  const TEST_CASES = [
    {
      name: 'Trip Geojson.1',
      layer: {
        type: 'trip',
        id: 'test_trip_layer_1',
        config: {
          color: [1, 2, 3],
          dataId,
          label: 'some trips',
          columns: {
            geojson: '_geojson'
          },
          visConfig: {
            colorRange: {
              colors: ['#080808', '#090909', '#070707']
            },
            trailLength: 2
          }
        }
      },
      datasets: {
        [dataId]: copyTableAndUpdate(prepareTripGeoDataset, {filteredIndex})
      },
      renderArgs: {
        animationConfig
      },
      assert: deckLayers => {
        const ids = ['test_trip_layer_1'];
        t.deepEqual(
          deckLayers.map(l => l.id),
          ids,
          'Should render 1 deck layers'
        );

        const deckTripLayer = deckLayers[0];
        const expectedProps = {
          trailLength: 2000,
          capRounded: true,
          jointRounded: true,
          widthScale: 128,
          currentTime: 0,
          parameters: {depthTest: false, depthMask: false},
          filterRange: [
            [3, 11],
            [0, 0],
            [0, 0],
            [0, 0]
          ],
          opacity: 0.8
        };

        Object.keys(expectedProps).forEach(key => {
          t.deepEqual(
            deckTripLayer.props[key],
            expectedProps[key],
            `should have correct props.${key}`
          );
        });

        t.deepEqual(
          deckTripLayer.props.extensions.map(cl => cl.constructor.name),
          ['DataFilterExtension'],
          'Should provide DataFilterExtension'
        );
        // test attributes
        const {attributes} = deckTripLayer.state.attributeManager;

        t.ok(attributes.filterValues, 'Should have filterValues attribute');
        t.ok(
          attributes.filterValues.value instanceof Float32Array,
          'filterValues should be Float32Array'
        );
        t.ok(attributes.filterValues.value.length > 0, 'filterValues should have data');

        t.ok(attributes.instanceColors, 'Should have instanceColors attribute');
        t.ok(attributes.instanceStrokeWidths, 'Should have instanceStrokeWidths attribute');

        // deck.gl 9's PathLayer pre-allocates attribute arrays beyond the actual data.
        // Use numInstances to know the real data extent.
        const numInstances = deckTripLayer.state.numInstances ?? 0;
        t.ok(numInstances > 0, `should have instances (got ${numInstances})`);

        // Verify instanceColors for all real instances: should be [1, 2, 3, 255]
        const colorsArr = attributes.instanceColors.value;
        for (let v = 0; v < numInstances; v++) {
          const base = v * 4;
          t.equal(colorsArr[base], 1, `instanceColors[${v}] R should be 1`);
          t.equal(colorsArr[base + 1], 2, `instanceColors[${v}] G should be 2`);
          t.equal(colorsArr[base + 2], 3, `instanceColors[${v}] B should be 3`);
          t.equal(colorsArr[base + 3], 255, `instanceColors[${v}] A should be 255`);
        }

        // Verify instanceStrokeWidths for all real instances: should be 1 (defaultLineWidth)
        const strokeArr = attributes.instanceStrokeWidths.value;
        for (let v = 0; v < numInstances; v++) {
          t.equal(strokeArr[v], 1, `instanceStrokeWidths[${v}] should be 1`);
        }

        // Verify filterValues: channels 1-3 should be 0 for all instances.
        // Channel 0 should contain the per-feature filter values.
        const expectedFV = [
          Number.MIN_SAFE_INTEGER,
          7 - valueFilterDomain0,
          6 - valueFilterDomain0
        ];
        const fv = attributes.filterValues.value;
        const seenFV = new Set();
        for (let v = 0; v < numInstances; v++) {
          const base = v * 4;
          seenFV.add(fv[base]);
          t.equal(fv[base + 1], 0, `filterValues[${v}][1] should be 0`);
          t.equal(fv[base + 2], 0, `filterValues[${v}][2] should be 0`);
          t.equal(fv[base + 3], 0, `filterValues[${v}][3] should be 0`);
        }
        expectedFV.forEach(val => {
          // Float32 precision may round MIN_SAFE_INTEGER, so check with tolerance
          const found = [...seenFV].some(v => Math.abs(v - val) < 2);
          t.ok(found, `filterValues should contain feature value ~${val}`);
        });
        // TODO: test UpdateTriggers
      }
    }
  ];

  testRenderLayerCases(t, TripLayer, TEST_CASES);
  t.end();
});

test('#TripLayer -> parseTripGeoJsonTimestamp', t => {
  // mix with illegal character
  const dataToFeature1 = cloneDeep(dataToFeature);
  dataToFeature1[0].geometry.coordinates[0][3] = 0;
  dataToFeature1[1].geometry.coordinates[0][3] = NaN;
  dataToFeature1[2].geometry.coordinates[0][3] = null;
  dataToFeature1[3].geometry.coordinates[0][3] = undefined;
  dataToFeature1[4].geometry.coordinates[0][3] = 'a';

  dataToFeature1[0].geometry.coordinates[dataToFeature1[0].geometry.coordinates.length - 1][3] =
    NaN;

  const result = parseTripGeoJsonTimestamp(dataToFeature1);

  t.deepEqual(result.animationDomain, [1565577261, 1565578836], 'should filter out illugal value');
  t.end();
});
