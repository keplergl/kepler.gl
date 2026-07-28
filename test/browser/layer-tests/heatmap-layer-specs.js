// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import {
  testCreateCases,
  testFormatLayerDataCases,
  preparedDataset,
  prepareGeojsonDataset,
  dataId,
  pointLayerMeta
} from 'test/helpers/layer-utils';
import {StateWFiles, testCsvDataId} from 'test/helpers/mock-state';
import {gpsPointBounds} from 'test/fixtures/test-csv-data';

import {KeplerGlLayers} from '@kepler.gl/layers';
import {copyTableAndUpdate} from '@kepler.gl/table';

const {HeatmapLayer} = KeplerGlLayers;

const columns = {
  lat: 'lat',
  lng: 'lng'
};

test('#HeatmapLayer -> contructor', t => {
  const TEST_CASES = {
    CREATE: [
      {
        props: {
          dataId: 'taro',
          isVisible: true,
          label: 'test heatmap layer'
        },
        test: layer => {
          t.equal(layer.config.visConfig.radius, 20, 'Heatmap default radius should be 20');
          t.ok(layer.config.dataId === 'taro', 'heatmaplayer dataId should be correct');
          t.ok(layer.type === 'heatmap', 'type should be heatmap');
          t.ok(layer.isAggregated === true, 'heatmaplayer is aggregated');
          t.ok(layer.config.label === 'test heatmap layer', 'label should be correct');
          t.ok(Object.keys(layer.columnPairs).length, 'should have columnPairs');
        }
      }
    ]
  };

  testCreateCases(t, HeatmapLayer, TEST_CASES.CREATE);
  t.end();
});

test('#Heatmaplayer -> formatLayerData -> w/ GpuFilter', t => {
  const filteredIndex = [0, 2, 4];

  const TEST_CASES = [
    {
      name: 'Heatmap gps point.1',
      layer: {
        type: 'heatmap',
        id: 'heatmap-test-1',
        config: {
          dataId,
          label: 'deck.gl heatmap',
          isVisible: true,
          columns,
          weightField: {
            type: 'integer',
            name: 'id'
          }
        }
      },
      datasets: {
        [dataId]: copyTableAndUpdate(preparedDataset, {filteredIndex})
      },
      assert: result => {
        const {layerData, layer} = result;

        t.ok(Array.isArray(layerData.data), 'layerData.data should be an array');
        t.ok(typeof layerData.getPosition === 'function', 'should have getPosition accessor');
        t.ok(typeof layerData.getWeight === 'function', 'should have getWeight accessor');

        // data items should have {index} shape for deck.gl aggregation
        t.ok(
          layerData.data.every(d => typeof d.index === 'number'),
          'data items should have numeric index'
        );

        // test layer.meta
        t.deepEqual(layer.meta, pointLayerMeta, 'should format correct heatmap layer.meta');
      }
    }
  ];

  testFormatLayerDataCases(t, HeatmapLayer, TEST_CASES);
  t.end();
});

test('#Heatmaplayer -> formatLayerData -> w/o GpuFilter', t => {
  const testData = StateWFiles.visState.datasets[testCsvDataId];
  const gpsColumns = {
    lat: 'gps_data.lat',
    lng: 'gps_data.lng'
  };

  const TEST_CASES = [
    {
      name: 'Heatmap gps point.1',
      layer: {
        type: 'heatmap',
        id: 'heatmap-test-1',
        config: {
          dataId: testCsvDataId,
          label: 'deck.gl heatmap',
          isVisible: true,
          columns: gpsColumns,
          visConfig: {
            colorRange: {
              colors: ['#010101', '#020202', '#030303']
            },
            radius: 100,
            opacity: 0.2
          }
        }
      },
      datasets: StateWFiles.visState.datasets,
      assert: result => {
        const {layerData, layer} = result;
        const expectedLayerMeta = {bounds: gpsPointBounds};

        t.ok(Array.isArray(layerData.data), 'layerData.data should be an array');
        t.equal(
          layerData.data.length,
          testData.dataContainer.numRows(),
          'should have same number of data points'
        );

        t.ok(typeof layerData.getPosition === 'function', 'should have getPosition accessor');
        t.equal(typeof layerData.getWeight, 'number', 'getWeight should be 1 when no weight field');
        t.equal(layerData.getWeight, 1, 'getWeight should default to 1');

        // data items should have {index} shape
        t.ok(
          layerData.data.every(d => typeof d.index === 'number'),
          'data items should have numeric index'
        );

        // test layer.meta
        t.deepEqual(layer.meta, expectedLayerMeta, 'should format correct heatmap layer.meta');
      }
    }
  ];

  testFormatLayerDataCases(t, HeatmapLayer, TEST_CASES);
  t.end();
});

const geojsonColumns = {
  geojson: '_geojson'
};

const geojsonFilteredIndex = prepareGeojsonDataset.filteredIndex;

test('#HeatmapLayer -> constructor with geojson column mode', t => {
  const layer = new HeatmapLayer({
    dataId: 'test',
    label: 'test heatmap geojson',
    columns: {geojson: {value: '_geojson', fieldIdx: 0}},
    columnMode: 'geojson'
  });

  t.equal(layer.config.columnMode, 'geojson', 'should have geojson columnMode');
  t.equal(layer.type, 'heatmap', 'type should be heatmap');
  t.ok(layer.isAggregated, 'should be aggregated');
  t.equal(layer.supportedColumnModes.length, 3, 'should have 3 supported column modes');
  t.ok(
    layer.supportedColumnModes.find(m => m.key === 'geojson'),
    'should support geojson column mode'
  );
  t.ok(
    layer.supportedColumnModes.find(m => m.key === 'points'),
    'should support points column mode'
  );
  t.ok(
    layer.supportedColumnModes.find(m => m.key === 'geoarrow'),
    'should support geoarrow column mode'
  );
  t.end();
});

test('#HeatmapLayer -> findDefaultLayerProps with geojson field', t => {
  const result = HeatmapLayer.findDefaultLayerProps(prepareGeojsonDataset);

  t.ok(result, 'should return result');
  t.ok(result.altProps, 'should have altProps');
  t.ok(result.altProps.length > 0, 'should have at least one alt prop');

  const geojsonAltProp = result.altProps.find(p => p.columnMode === 'geojson');
  t.ok(geojsonAltProp, 'should find a geojson alt prop');
  t.ok(geojsonAltProp.columns, 'geojson alt prop should have columns');
  t.ok(geojsonAltProp.columns.geojson, 'geojson alt prop should have geojson column');
  t.equal(
    geojsonAltProp.columns.geojson.value,
    '_geojson',
    'geojson column value should be _geojson'
  );
  t.end();
});

test('#HeatmapLayer -> formatLayerData with geojson column mode', t => {
  const TEST_CASES = [
    {
      name: 'Heatmap geojson column mode',
      layer: {
        type: 'heatmap',
        id: 'heatmap_geojson_test_1',
        config: {
          dataId,
          label: 'heatmap geojson',
          columns: geojsonColumns,
          columnMode: 'geojson',
          color: [1, 2, 3]
        }
      },
      datasets: {
        [dataId]: {
          ...prepareGeojsonDataset,
          filteredIndex: geojsonFilteredIndex
        }
      },
      assert: result => {
        const {layerData, layer} = result;

        t.ok(layerData, 'should have layer data');
        t.ok(Array.isArray(layerData.data), 'layerData.data should be an array');
        t.ok(layerData.data.length > 0, 'should have data entries');
        t.ok(typeof layerData.getPosition === 'function', 'should have getPosition accessor');

        // In geojson mode, each data point should have index and position (centroid)
        const firstPoint = layerData.data[0];
        t.ok(Number.isFinite(firstPoint.index), 'data entry should have numeric index');
        t.ok(Array.isArray(firstPoint.position), 'data entry should have position array');
        t.equal(firstPoint.position.length, 2, 'position should have 2 elements [lng, lat]');
        t.ok(Number.isFinite(firstPoint.position[0]), 'longitude should be finite');
        t.ok(Number.isFinite(firstPoint.position[1]), 'latitude should be finite');

        // getPosition should return the centroid from the data entry
        const pos = layerData.getPosition(firstPoint);
        t.deepEqual(pos, firstPoint.position, 'getPosition should return entry position');

        // layer meta should have bounds
        t.ok(layer.meta.bounds, 'layer should have bounds');
        t.equal(layer.meta.bounds.length, 4, 'bounds should have 4 elements');

        // centroids should be populated
        t.ok(layer.centroids.length > 0, 'layer should have centroids populated');

        // dataToFeature should be populated
        t.ok(layer.dataToFeature.length > 0, 'layer should have dataToFeature populated');
      }
    }
  ];

  testFormatLayerDataCases(t, HeatmapLayer, TEST_CASES);
  t.end();
});

test('#HeatmapLayer -> geojson mode handles Point, LineString, Polygon geometries', t => {
  const layer = new HeatmapLayer({
    dataId: 'test',
    label: 'test',
    columns: {geojson: {value: '_geojson', fieldIdx: 0}},
    columnMode: 'geojson'
  });

  const mockFeatures = [
    // Point - should return point directly
    {
      type: 'Feature',
      geometry: {type: 'Point', coordinates: [-122.4, 37.8]},
      properties: {}
    },
    // LineString - should return center (average of vertices)
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [-122.4, 37.8],
          [-122.5, 37.9]
        ]
      },
      properties: {}
    },
    // Polygon - should return centroid (average of boundary vertices)
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-122.4, 37.8],
            [-122.5, 37.8],
            [-122.5, 37.9],
            [-122.4, 37.9],
            [-122.4, 37.8]
          ]
        ]
      },
      properties: {}
    }
  ];

  const mockDataContainer = {
    numRows: () => mockFeatures.length,
    valueAt: (index, fieldIdx) => JSON.stringify(mockFeatures[index])
  };

  layer.config.columns = {
    lat: {value: null, fieldIdx: -1},
    lng: {value: null, fieldIdx: -1},
    geoarrow: {value: null, fieldIdx: -1},
    geojson: {value: '_geojson', fieldIdx: 0}
  };
  layer.config.columnMode = 'geojson';

  const mockDataset = {
    dataContainer: mockDataContainer,
    filteredIndex: [0, 1, 2],
    id: 'test'
  };
  layer.updateLayerMeta(mockDataset);

  // Verify centroids
  t.equal(layer.centroids.length, 3, 'should have 3 centroids');

  // Point: centroid should be the point itself
  t.deepEqual(layer.centroids[0], [-122.4, 37.8], 'Point centroid should be point coordinates');

  // LineString: centroid should be average of vertices
  const expectedLineCentroid = [(-122.4 + -122.5) / 2, (37.8 + 37.9) / 2];
  t.ok(
    Math.abs(layer.centroids[1][0] - expectedLineCentroid[0]) < 1e-10,
    'LineString centroid lng should be average of vertices'
  );
  t.ok(
    Math.abs(layer.centroids[1][1] - expectedLineCentroid[1]) < 1e-10,
    'LineString centroid lat should be average of vertices'
  );

  // Polygon: centroid should be average of all boundary vertices
  const polyCoords = [
    [-122.4, 37.8],
    [-122.5, 37.8],
    [-122.5, 37.9],
    [-122.4, 37.9],
    [-122.4, 37.8]
  ];
  const expectedPolyCentroid = [
    polyCoords.reduce((s, c) => s + c[0], 0) / polyCoords.length,
    polyCoords.reduce((s, c) => s + c[1], 0) / polyCoords.length
  ];
  t.ok(
    Math.abs(layer.centroids[2][0] - expectedPolyCentroid[0]) < 1e-10,
    'Polygon centroid lng should be average of boundary vertices'
  );
  t.ok(
    Math.abs(layer.centroids[2][1] - expectedPolyCentroid[1]) < 1e-10,
    'Polygon centroid lat should be average of boundary vertices'
  );

  // Verify bounds
  t.ok(layer.meta.bounds, 'should have computed bounds');
  const [minLng, minLat, maxLng, maxLat] = layer.meta.bounds;
  t.ok(minLng <= -122.5, 'minLng should include westernmost point');
  t.ok(maxLng >= -122.4, 'maxLng should include easternmost point');
  t.ok(minLat <= 37.8, 'minLat should include southernmost point');
  t.ok(maxLat >= 37.9, 'maxLat should include northernmost point');

  t.end();
});

test('#HeatmapLayer -> isInPolygon with geojson mode', t => {
  const layer = new HeatmapLayer({
    dataId: 'test',
    label: 'test',
    columns: {geojson: {value: '_geojson', fieldIdx: 0}},
    columnMode: 'geojson'
  });

  // Set up centroids manually
  layer.centroids = [
    [-122.4, 37.8],
    [-122.5, 37.9],
    null
  ];

  // Rectangle polygon that contains the first centroid but not the second
  const filterPolygon = {
    type: 'Feature',
    properties: {
      shape: 'Rectangle',
      bbox: [-122.45, 37.75, -122.35, 37.85]
    },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-122.45, 37.75],
          [-122.35, 37.75],
          [-122.35, 37.85],
          [-122.45, 37.85],
          [-122.45, 37.75]
        ]
      ]
    }
  };

  t.ok(
    layer.isInPolygon(null, 0, filterPolygon),
    'first point should be inside polygon'
  );
  t.notOk(
    layer.isInPolygon(null, 1, filterPolygon),
    'second point should be outside polygon'
  );
  t.notOk(
    layer.isInPolygon(null, 2, filterPolygon),
    'null centroid should return false'
  );
  t.notOk(
    layer.isInPolygon(null, 99, filterPolygon),
    'out-of-bounds index should return false'
  );

  t.end();
});