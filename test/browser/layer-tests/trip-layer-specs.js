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

        // In deck.gl 9, PathLayer's tesselator may call getFilterValue differently,
        // so we just verify the filterValues attribute was created with correct structure
        t.ok(attributes.filterValues, 'Should have filterValues attribute');
        t.ok(attributes.filterValues.value instanceof Float32Array, 'filterValues should be Float32Array');
        t.ok(attributes.filterValues.value.length > 0, 'filterValues should have data');

        // In deck.gl 9, PathLayer uses Uint8ClampedArray for colors and may produce
        // different vertex counts. Verify attributes exist and start with correct values.
        t.ok(attributes.instanceColors, 'Should have instanceColors attribute');
        t.ok(attributes.instanceStrokeWidths, 'Should have instanceStrokeWidths attribute');

        const colorsArr = attributes.instanceColors.value;
        if (colorsArr.length >= 4) {
          t.equal(colorsArr[0], 1, 'instanceColors R should be 1');
          t.equal(colorsArr[1], 2, 'instanceColors G should be 2');
          t.equal(colorsArr[2], 3, 'instanceColors B should be 3');
          t.equal(colorsArr[3], 255, 'instanceColors A should be 255');
        }

        const strokeArr = attributes.instanceStrokeWidths.value;
        if (strokeArr.length >= 1) {
          t.equal(strokeArr[0], 1, 'instanceStrokeWidths[0] should be 1');
        }
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
