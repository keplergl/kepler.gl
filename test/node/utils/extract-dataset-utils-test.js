// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape-catch';

import {DatasetType, LAYER_TYPES} from '@kepler.gl/constants';
import {
  createDataContainer,
  extractRowsInsideFeature,
  isExtractableDataset,
  isExtractableLayer
} from '@kepler.gl/utils';
import {mockPolygonFeature} from 'test/fixtures/polygon';

test('extract-dataset-utils -> isExtractableDataset', t => {
  t.notOk(isExtractableDataset(null), 'null is not extractable');
  t.notOk(
    isExtractableDataset({
      type: DatasetType.VECTOR_TILE,
      fields: [],
      dataContainer: createDataContainer([[1]])
    }),
    'vector tiles are not extractable'
  );
  t.ok(
    isExtractableDataset({
      fields: [{name: 'lat', type: 'real'}],
      dataContainer: createDataContainer([[1]])
    }),
    'local tables with rows are extractable'
  );
  t.end();
});

test('extract-dataset-utils -> isExtractableLayer', t => {
  const datasets = {
    local: {
      fields: [{name: 'lat', type: 'real'}],
      dataContainer: createDataContainer([[1]])
    }
  };
  t.ok(
    isExtractableLayer({type: LAYER_TYPES.point, config: {dataId: 'local'}}, datasets),
    'layers on local datasets are extractable'
  );
  t.notOk(
    isExtractableLayer({config: {dataId: 'missing'}}, datasets),
    'layers without a dataset are not extractable'
  );
  t.notOk(
    isExtractableLayer({type: LAYER_TYPES.trip, config: {dataId: 'local'}}, datasets),
    'trip layers have no polygon clip and should not be extractable'
  );
  t.notOk(
    isExtractableLayer({type: LAYER_TYPES.geohash, config: {dataId: 'local'}}, datasets),
    'geohash layers have no polygon clip and should not be extractable'
  );
  t.notOk(
    isExtractableLayer({type: LAYER_TYPES.s2, config: {dataId: 'local'}}, datasets),
    's2 layers have no polygon clip and should not be extractable'
  );
  t.ok(
    isExtractableLayer(
      {
        type: LAYER_TYPES.vectorTile,
        config: {dataId: 'tiles'}
      },
      {
        tiles: {
          type: DatasetType.VECTOR_TILE,
          disableDataOperation: true,
          fields: [],
          dataContainer: createDataContainer([])
        }
      }
    ),
    'vector tile layers are extractable from the loaded tile cache'
  );
  t.end();
});

test('extract-dataset-utils -> extractRowsInsideFeature vector tiles', t => {
  const layer = {
    type: LAYER_TYPES.vectorTile,
    config: {dataId: 'tiles', uniqueIdField: 'id'},
    tileDataset: {
      getTiles: () => [
        {
          content: [
            {
              type: 'Feature',
              properties: {id: 1, name: 'inside'},
              geometry: {type: 'Point', coordinates: [30.5, 12.25]}
            },
            {
              type: 'Feature',
              properties: {id: 1, name: 'duplicate-tile'},
              geometry: {type: 'Point', coordinates: [30.5, 12.25]}
            },
            {
              type: 'Feature',
              properties: {id: 2, name: 'outside'},
              geometry: {type: 'Point', coordinates: [35.5, 12.25]}
            }
          ]
        }
      ]
    }
  };

  const extracted = extractRowsInsideFeature({
    layer,
    dataset: {
      type: DatasetType.VECTOR_TILE,
      disableDataOperation: true,
      fields: [],
      dataContainer: createDataContainer([])
    },
    feature: mockPolygonFeature
  });

  t.equal(extracted.kind, 'geojson', 'Vector tile extract should return GeoJSON features');
  t.equal(
    extracted.rowCount,
    1,
    'Should keep the point inside the polygon and drop tile duplicates'
  );
  t.equal(extracted.features[0].properties.name, 'inside');
  t.end();
});

test('extract-dataset-utils -> extractRowsInsideFeature vector tiles intersection', t => {
  const layer = {
    type: LAYER_TYPES.vectorTile,
    config: {dataId: 'tiles', uniqueIdField: 'id'},
    tileDataset: {
      getTiles: () => [
        {
          content: [
            {
              type: 'Feature',
              properties: {id: 1, name: 'crossing-line'},
              geometry: {
                type: 'LineString',
                coordinates: [
                  [27, 13],
                  [34, 13]
                ]
              }
            },
            {
              type: 'Feature',
              properties: {id: 2, name: 'containing-polygon'},
              geometry: {
                type: 'Polygon',
                coordinates: [
                  [
                    [20, 5],
                    [40, 5],
                    [40, 20],
                    [20, 20],
                    [20, 5]
                  ]
                ]
              }
            },
            {
              type: 'Feature',
              properties: {id: 3, name: 'disjoint-line'},
              geometry: {
                type: 'LineString',
                coordinates: [
                  [40, 20],
                  [41, 21]
                ]
              }
            }
          ]
        }
      ]
    }
  };

  const extracted = extractRowsInsideFeature({
    layer,
    dataset: {
      type: DatasetType.VECTOR_TILE,
      disableDataOperation: true,
      fields: [],
      dataContainer: createDataContainer([])
    },
    feature: mockPolygonFeature
  });

  t.equal(extracted.kind, 'geojson', 'Vector tile extract should return GeoJSON features');
  t.deepEqual(
    extracted.features.map(feature => feature.properties.name).sort(),
    ['containing-polygon', 'crossing-line'],
    'Should keep a crossing line and a polygon that contains the drawing'
  );
  t.end();
});

test('extract-dataset-utils -> extractRowsInsideFeature unsupported layer', t => {
  const extracted = extractRowsInsideFeature({
    layer: {type: LAYER_TYPES.trip, config: {dataId: 'local'}},
    dataset: {
      fields: [{name: 'lat', type: 'real'}],
      dataContainer: createDataContainer([[12.25, 30.5]]),
      allIndexes: [0],
      filteredIndex: [0]
    },
    feature: mockPolygonFeature
  });
  t.equal(extracted, null, 'Unsupported layers should not copy every filtered row');
  t.end();
});
