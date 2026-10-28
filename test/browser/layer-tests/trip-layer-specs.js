// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/* eslint-disable max-statements */
import test from 'tape';
import cloneDeep from 'es-toolkit/compat/cloneDeep';

import {
  tripDefaultLineWidth as defaultLineWidth,
  parseTripGeoJsonTimestamp,
  getAnimationDomainFromTimestamps,
  KeplerGlLayers
} from '@kepler.gl/layers';

import {copyTableAndUpdate} from '@kepler.gl/table';
import {processCsvData} from '@kepler.gl/processors';
import {INITIAL_MAP_STATE, INITIAL_VIS_STATE, visStateReducer} from '@kepler.gl/reducers';
import {VisStateActions} from '@kepler.gl/actions';
import {applyActions} from 'test/helpers/mock-state';
const {TripLayer} = KeplerGlLayers;

import {
  dataId,
  testCreateCases,
  testFormatLayerDataCases,
  testRenderLayerCases,
  prepareTripGeoDataset,
  prepareTripTableDataset,
  speedFilterDomain0,
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
          'getWidth',
          'getAdjustRoll',
          'getAdjustPitch',
          'getAdjustYaw',
          'textLabels'
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

test('#TripLayer -> formatLayerData -> table column mode with gpu filter', t => {
  // The GPU filter reads a layer's values through the accessor the layer hands
  // it, called as getData(dataContainer, feature, fieldIndex). Table column mode
  // groups rows into trips, so the value of each channel is an array, one entry
  // per vertex of the trip.
  const TEST_CASES = [
    {
      name: 'Trip Table.1',
      layer: {
        type: 'trip',
        id: 'test_trip_table_layer',
        config: {
          dataId,
          label: 'gps trips',
          columnMode: 'table',
          columns: {
            id: 'name',
            lat: 'location-lat',
            lng: 'location-lng',
            timestamp: 'timestamp',
            altitude: 'location-alt'
          }
        }
      },
      datasets: {
        [dataId]: prepareTripTableDataset
      },
      assert: result => {
        const {layerData} = result;

        let filterValues;
        t.doesNotThrow(() => {
          filterValues = layerData.data.map(layerData.getFilterValue);
        }, 'getFilterValue should not throw in table column mode');

        // The first trip groups the 8 rows named Thuub that carry a coordinate
        // and a timestamp; the row with an empty location is dropped.
        const round = v => Math.round(v * 100) / 100;
        const groundSpeeds = [0.22, 0.27, 0.32, 0.46, 0.51, 0.3, 0.33, 0.43];

        t.deepEqual(
          (filterValues?.[0] ?? []).map(vertex => round(vertex[0])),
          groundSpeeds.map(speed => round(speed - speedFilterDomain0)),
          'getFilterValue should return one filter value per vertex of the trip'
        );
      }
    }
  ];

  testFormatLayerDataCases(t, TripLayer, TEST_CASES);
  t.end();
});

test('#TripLayer -> table vertex filters keep rendered and GPU timestamps aligned', t => {
  const start = Date.UTC(2024, 0, 1);
  const csv = `id,lat,lng,timestamp,status
dropped,9,19,2024-01-01 00:00:00,skip
retained,13,23,2024-01-01 00:00:30,last
retained,10,20,2024-01-01 00:00:00,skip
retained,11,21,2024-01-01 00:00:10,keep
retained,12,22,2024-01-01 00:00:20,skip
retained,,,2024-01-01 00:00:40,keep
retained,14,24,,keep`;
  let state = applyActions(visStateReducer, INITIAL_VIS_STATE, [
    {
      action: VisStateActions.updateVisData,
      payload: [{info: {id: dataId}, data: processCsvData(csv)}]
    },
    {action: VisStateActions.addFilter, payload: [dataId]},
    {action: VisStateActions.setFilter, payload: [0, 'name', 'timestamp']}
  ]);

  testFormatLayerDataCases(t, TripLayer, [
    {
      name: 'filtered trip timestamps',
      layer: {
        type: 'trip',
        config: {
          dataId,
          columnMode: 'table',
          columns: {id: 'id', lat: 'lat', lng: 'lng', timestamp: 'timestamp'}
        }
      },
      datasets: state.datasets,
      assert: ({layer, layerData}) => {
        t.deepEqual(
          layerData.getTimestamps(layerData.data[1]),
          [start, start + 10000, start + 20000, start + 30000],
          'unfiltered timestamps are sorted and omit rows missing coordinates or time'
        );
        state = visStateReducer(state, VisStateActions.addFilter(dataId));
        state = visStateReducer(state, VisStateActions.setFilter(1, 'name', 'status'));

        [
          {
            value: ['keep', 'last'],
            coordinates: [
              [21, 11],
              [23, 13]
            ],
            times: [10000, 30000]
          },
          {value: ['last'], coordinates: [[23, 13]], times: [30000]},
          {value: ['absent'], coordinates: [], times: []},
          {
            value: ['keep', 'last', 'skip'],
            coordinates: [
              [20, 10],
              [21, 11],
              [22, 12],
              [23, 13]
            ],
            times: [0, 10000, 20000, 30000]
          }
        ].forEach(({value, coordinates, times}) => {
          state = visStateReducer(state, VisStateActions.setFilter(1, 'value', value));
          layerData = layer.formatLayerData(state.datasets, layerData);
          const feature = layerData.data.find(d => d.properties.index === 1);
          t.deepEqual(
            feature ? layerData.getPath(feature).map(c => c.slice(0, 2)) : [],
            coordinates,
            `categorical filter ${value} retains the expected sorted coordinates`
          );
          if (!feature) {
            t.equal(layerData.data.length, 0, 'filtering every vertex leaves no trips');
            return;
          }
          t.deepEqual(
            layerData.getTimestamps(feature),
            times.map(time => start + time),
            `categorical filter ${value} retains the matching normalized timestamps`
          );
          t.deepEqual(
            layerData.getFilterValue(feature).map(vertex => vertex[0]),
            times,
            'GPU timestamp values stay aligned with retained vertices'
          );
          const [trails] = layer.renderLayer({
            data: layerData,
            gpuFilter: state.datasets[dataId].gpuFilter,
            mapState: INITIAL_MAP_STATE,
            animationConfig: {domain: [start, start + 40000], currentTime: start + 15000}
          });
          t.deepEqual(
            trails.props.getTimestamps(feature),
            times,
            'rendered timestamps retain the same coordinate order after domain subtraction'
          );
        });
      }
    }
  ]);
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
        t.ok(attributes.instanceColors, 'Should have instanceColors attribute');
        t.ok(attributes.instanceStrokeWidths, 'Should have instanceStrokeWidths attribute');

        // Trip features 0, 2, 4 have 10, 8, 7 coordinates respectively
        const expectedVerticesPerPath = [10, 8, 7];
        const expectedNumInstances = expectedVerticesPerPath.reduce((a, b) => a + b, 0); // 25
        const numInstances = deckTripLayer.state.numInstances ?? 0;
        t.equal(
          numInstances,
          expectedNumInstances,
          `should have exactly ${expectedNumInstances} instances`
        );

        // Verify startIndices from PathLayer tesselator
        const startIndices = deckTripLayer.state.startIndices;
        t.ok(startIndices, 'should have startIndices');
        const expectedStartIndices = [0, 10, 18, 25];
        t.deepEqual(
          Array.from(startIndices),
          expectedStartIndices,
          'startIndices should be [0, 10, 18, 25]'
        );

        // Build expected instanceColors: all vertices should be [1, 2, 3, 255]
        const expectedColors = new Uint8ClampedArray(numInstances * 4);
        for (let v = 0; v < numInstances; v++) {
          expectedColors[v * 4] = 1;
          expectedColors[v * 4 + 1] = 2;
          expectedColors[v * 4 + 2] = 3;
          expectedColors[v * 4 + 3] = 255;
        }
        t.deepEqual(
          attributes.instanceColors.value.slice(0, numInstances * 4),
          expectedColors,
          'Should have correct instanceColors for all instances'
        );

        // Build expected instanceStrokeWidths: all should be 1 (defaultLineWidth)
        const expectedStroke = new Float32Array(numInstances).fill(1);
        t.deepEqual(
          attributes.instanceStrokeWidths.value.slice(0, numInstances),
          expectedStroke,
          'Should have correct instanceStrokeWidths for all instances'
        );

        // Build expected filterValues using startIndices for per-path grouping
        // Feature 0: MIN_SAFE_INTEGER, Feature 2: 7 - valueFilterDomain0, Feature 4: 6 - valueFilterDomain0
        const perPathFilterValue = [
          Number.MIN_SAFE_INTEGER,
          7 - valueFilterDomain0,
          6 - valueFilterDomain0
        ];
        const expectedFilterValues = new Float32Array(numInstances * 4);
        for (let pathIdx = 0; pathIdx < expectedVerticesPerPath.length; pathIdx++) {
          const start = expectedStartIndices[pathIdx];
          const end = expectedStartIndices[pathIdx + 1];
          for (let v = start; v < end; v++) {
            expectedFilterValues[v * 4] = perPathFilterValue[pathIdx];
            expectedFilterValues[v * 4 + 1] = 0;
            expectedFilterValues[v * 4 + 2] = 0;
            expectedFilterValues[v * 4 + 3] = 0;
          }
        }

        // Verify per-path filter values using startIndices
        const fv = attributes.filterValues.value;
        for (let pathIdx = 0; pathIdx < expectedVerticesPerPath.length; pathIdx++) {
          const start = expectedStartIndices[pathIdx];
          const end = expectedStartIndices[pathIdx + 1];
          for (let v = start; v < end; v++) {
            const base = v * 4;
            t.ok(
              Math.abs(fv[base] - perPathFilterValue[pathIdx]) < 2,
              `filterValues[${v}][0] should be ~${perPathFilterValue[pathIdx]} for path ${pathIdx}`
            );
            t.equal(fv[base + 1], 0, `filterValues[${v}][1] should be 0`);
            t.equal(fv[base + 2], 0, `filterValues[${v}][2] should be 0`);
            t.equal(fv[base + 3], 0, `filterValues[${v}][3] should be 0`);
          }
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

test('#TripLayer -> getAnimationDomainFromTimestamps includes single-timestamp trips', t => {
  t.deepEqual(
    getAnimationDomainFromTimestamps([[1000], [2000, 3000]]),
    [1000, 3000],
    'a one-point trip should contribute both min and max to the animation domain'
  );
  t.deepEqual(
    getAnimationDomainFromTimestamps([[1000, 2000], null, [3000]]),
    [1000, 3000],
    'a trip without geometry should be skipped'
  );
  t.end();
});
