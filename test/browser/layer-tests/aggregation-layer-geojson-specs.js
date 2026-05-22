// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';

import {
  testFormatLayerDataCases,
  prepareGeojsonDataset,
  dataId
} from 'test/helpers/layer-utils';

import {KeplerGlLayers} from '@kepler.gl/layers';
const {GridLayer, HexagonLayer, ClusterLayer} = KeplerGlLayers;

const geojsonColumns = {
  geojson: '_geojson'
};

// The geojson fixture has 5 polygon features; TRIPS filter [4, 12] passes features with TRIPS 11, 4, 20
// filteredIndex depends on the filter state in prepareGeojsonDataset
const filteredIndex = prepareGeojsonDataset.filteredIndex;

// Expected centroids for the 5 polygon features (average of all boundary vertices)
function computeCentroid(coordinates) {
  const positions = coordinates.flat();
  let sumLng = 0;
  let sumLat = 0;
  let count = 0;
  for (const pos of positions) {
    if (Number.isFinite(pos[0]) && Number.isFinite(pos[1])) {
      sumLng += pos[0];
      sumLat += pos[1];
      count++;
    }
  }
  return count > 0 ? [sumLng / count, sumLat / count] : null;
}

// feature0 polygon centroid
const feature0Centroid = computeCentroid([
  [
    [-122.401159718585049, 37.782024266952142],
    [-122.400374366843309, 37.782644515545172],
    [-122.400019020063766, 37.782925153640136],
    [-122.399891477967842, 37.783025880124256],
    [-122.398930331092998, 37.783784933304034]
  ]
]);

// feature1 polygon centroid
const feature1Centroid = computeCentroid([
  [
    [-122.39249932896719, 37.793768814133983],
    [-122.391890260341384, 37.794278544568918],
    [-122.391666728649753, 37.794132425256194],
    [-122.391723034266192, 37.79410061945832],
    [-122.39249932896719, 37.793768814133983]
  ]
]);

test('#AggregationLayer (Grid) -> constructor with geojson column mode', t => {
  const layer = new GridLayer({
    dataId: 'test',
    label: 'test grid geojson',
    columns: {geojson: {value: '_geojson', fieldIdx: 0}},
    columnMode: 'geojson'
  });

  t.ok(layer.config.columnMode === 'geojson', 'should have geojson columnMode');
  t.ok(layer.type === 'grid', 'type should be grid');
  t.ok(layer.isAggregated === true, 'should be aggregated');
  t.ok(layer.supportedColumnModes.length === 2, 'should have 2 supported column modes');
  t.ok(
    layer.supportedColumnModes.find(m => m.key === 'geojson'),
    'should support geojson column mode'
  );
  t.ok(
    layer.supportedColumnModes.find(m => m.key === 'points'),
    'should support points column mode'
  );
  t.end();
});

test('#AggregationLayer (Hexagon) -> constructor with geojson column mode', t => {
  const layer = new HexagonLayer({
    dataId: 'test',
    label: 'test hexagon geojson',
    columns: {geojson: {value: '_geojson', fieldIdx: 0}},
    columnMode: 'geojson'
  });

  t.ok(layer.config.columnMode === 'geojson', 'should have geojson columnMode');
  t.ok(layer.type === 'hexagon', 'type should be hexagon');
  t.ok(layer.isAggregated === true, 'should be aggregated');
  t.ok(
    layer.supportedColumnModes.find(m => m.key === 'geojson'),
    'should support geojson column mode'
  );
  t.end();
});

test('#AggregationLayer (Cluster) -> constructor with geojson column mode', t => {
  const layer = new ClusterLayer({
    dataId: 'test',
    label: 'test cluster geojson',
    columns: {geojson: {value: '_geojson', fieldIdx: 0}},
    columnMode: 'geojson'
  });

  t.ok(layer.config.columnMode === 'geojson', 'should have geojson columnMode');
  t.ok(layer.type === 'cluster', 'type should be cluster');
  t.ok(layer.isAggregated === true, 'should be aggregated');
  t.ok(
    layer.supportedColumnModes.find(m => m.key === 'geojson'),
    'should support geojson column mode'
  );
  t.end();
});

test('#AggregationLayer (Grid) -> findDefaultLayerProps with geojson field', t => {
  const result = GridLayer.findDefaultLayerProps(prepareGeojsonDataset);

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

test('#AggregationLayer (Hexagon) -> findDefaultLayerProps with geojson field', t => {
  const result = HexagonLayer.findDefaultLayerProps(prepareGeojsonDataset);

  t.ok(result, 'should return result');
  t.ok(result.altProps, 'should have altProps');

  const geojsonAltProp = result.altProps.find(p => p.columnMode === 'geojson');
  t.ok(geojsonAltProp, 'should find a geojson alt prop');
  t.equal(
    geojsonAltProp.columns.geojson.value,
    '_geojson',
    'geojson column value should be _geojson'
  );
  t.end();
});

test('#AggregationLayer (Cluster) -> findDefaultLayerProps with geojson field', t => {
  const result = ClusterLayer.findDefaultLayerProps(prepareGeojsonDataset);

  t.ok(result, 'should return result');
  t.ok(result.altProps, 'should have altProps');

  const geojsonAltProp = result.altProps.find(p => p.columnMode === 'geojson');
  t.ok(geojsonAltProp, 'should find a geojson alt prop');
  t.equal(
    geojsonAltProp.columns.geojson.value,
    '_geojson',
    'geojson column value should be _geojson'
  );
  t.end();
});

test('#AggregationLayer (Grid) -> formatLayerData with geojson column mode', t => {
  const TEST_CASES = [
    {
      name: 'Grid geojson column mode',
      layer: {
        type: 'grid',
        id: 'test_grid_geojson_1',
        config: {
          dataId,
          label: 'grid geojson',
          columns: geojsonColumns,
          columnMode: 'geojson',
          color: [1, 2, 3]
        }
      },
      datasets: {
        [dataId]: {
          ...prepareGeojsonDataset,
          filteredIndex
        }
      },
      assert: result => {
        const {layerData, layer} = result;

        t.ok(layerData, 'should have layer data');
        t.ok(layerData.data, 'should have data array');
        t.ok(layerData.data.length > 0, 'should have data entries');
        t.ok(layerData.getPosition, 'should have getPosition accessor');

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

        // verify centroids are correct for polygon features (centroid = average of vertices)
        const firstCentroid = layer.centroids[0];
        t.ok(firstCentroid, 'first centroid should exist');
        t.ok(
          Math.abs(firstCentroid[0] - feature0Centroid[0]) < 1e-10,
          'centroid lng should match computed value'
        );
        t.ok(
          Math.abs(firstCentroid[1] - feature0Centroid[1]) < 1e-10,
          'centroid lat should match computed value'
        );
      }
    }
  ];

  testFormatLayerDataCases(t, GridLayer, TEST_CASES);
  t.end();
});

test('#AggregationLayer (Hexagon) -> formatLayerData with geojson column mode', t => {
  const TEST_CASES = [
    {
      name: 'Hexagon geojson column mode',
      layer: {
        type: 'hexagon',
        id: 'test_hexagon_geojson_1',
        config: {
          dataId,
          label: 'hexagon geojson',
          columns: geojsonColumns,
          columnMode: 'geojson',
          color: [1, 2, 3]
        }
      },
      datasets: {
        [dataId]: {
          ...prepareGeojsonDataset,
          filteredIndex
        }
      },
      assert: result => {
        const {layerData, layer} = result;

        t.ok(layerData, 'should have layer data');
        t.ok(layerData.data, 'should have data array');
        t.ok(layerData.data.length > 0, 'should have data entries');
        t.ok(layerData.getPosition, 'should have getPosition accessor');

        // In geojson mode, data points have centroid positions
        const firstPoint = layerData.data[0];
        t.ok(Array.isArray(firstPoint.position), 'data entry should have position array');
        t.deepEqual(
          layerData.getPosition(firstPoint),
          firstPoint.position,
          'getPosition should return entry position'
        );

        // layer meta and centroids
        t.ok(layer.meta.bounds, 'layer should have bounds');
        t.ok(layer.centroids.length > 0, 'layer should have centroids');
        t.ok(layer.dataToFeature.length > 0, 'layer should have dataToFeature');
      }
    }
  ];

  testFormatLayerDataCases(t, HexagonLayer, TEST_CASES);
  t.end();
});

test('#AggregationLayer (Cluster) -> formatLayerData with geojson column mode', t => {
  const TEST_CASES = [
    {
      name: 'Cluster geojson column mode',
      layer: {
        type: 'cluster',
        id: 'test_cluster_geojson_1',
        config: {
          dataId,
          label: 'cluster geojson',
          columns: geojsonColumns,
          columnMode: 'geojson',
          color: [1, 2, 3]
        }
      },
      datasets: {
        [dataId]: {
          ...prepareGeojsonDataset,
          filteredIndex
        }
      },
      assert: result => {
        const {layerData, layer} = result;

        t.ok(layerData, 'should have layer data');
        t.ok(layerData.data, 'should have data array');
        t.ok(layerData.data.length > 0, 'should have data entries');
        t.ok(layerData.getPosition, 'should have getPosition accessor');

        // In geojson mode, data points have centroid positions
        const firstPoint = layerData.data[0];
        t.ok(Array.isArray(firstPoint.position), 'data entry should have position array');
        t.deepEqual(
          layerData.getPosition(firstPoint),
          firstPoint.position,
          'getPosition should return entry position'
        );

        // layer meta and centroids
        t.ok(layer.meta.bounds, 'layer should have bounds');
        t.ok(layer.centroids.length > 0, 'layer should have centroids');
        t.ok(layer.dataToFeature.length > 0, 'layer should have dataToFeature');
      }
    }
  ];

  testFormatLayerDataCases(t, ClusterLayer, TEST_CASES);
  t.end();
});

test('#AggregationLayer -> geojson mode handles Point, LineString, Polygon geometries', t => {
  // Test that getCentroidFromGeometry handles different geometry types correctly
  // by creating a layer with mixed geometry data

  const layer = new GridLayer({
    dataId: 'test',
    label: 'test',
    columns: {geojson: {value: '_geojson', fieldIdx: 0}},
    columnMode: 'geojson'
  });

  // Simulate dataContainer with different geometry types
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

  // Manually invoke _buildGeojsonDataToFeature through the public API
  layer.config.columns = {
    lat: {value: null, fieldIdx: -1},
    lng: {value: null, fieldIdx: -1},
    geojson: {value: '_geojson', fieldIdx: 0}
  };
  layer.config.columnMode = 'geojson';

  // Use updateLayerMeta with a mock dataset
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

  // Verify bounds encompass all geometries
  t.ok(layer.meta.bounds, 'should have computed bounds');
  const [minLng, minLat, maxLng, maxLat] = layer.meta.bounds;
  t.ok(minLng <= -122.5, 'minLng should include westernmost point');
  t.ok(maxLng >= -122.4, 'maxLng should include easternmost point');
  t.ok(minLat <= 37.8, 'minLat should include southernmost point');
  t.ok(maxLat >= 37.9, 'maxLat should include northernmost point');

  t.end();
});

test('#AggregationLayer -> isInPolygon with geojson mode', t => {
  const layer = new GridLayer({
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

  // Create a polygon that contains the first centroid but not the second
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
