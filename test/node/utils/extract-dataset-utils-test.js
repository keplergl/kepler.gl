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
  t.ok(
    isExtractableLayer(
      {
        type: LAYER_TYPES.rasterTile,
        config: {dataId: 'raster'}
      },
      {
        raster: {
          type: DatasetType.RASTER_TILE,
          fields: [],
          dataContainer: createDataContainer([])
        }
      }
    ),
    'raster tile layers are extractable from the loaded tile cache'
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

function localPointExtractionFixture(indexes = {}) {
  const rows = [
    [30.5, 12.25, 'first inside'],
    [35.5, 12.25, 'outside'],
    [30.5, 14.25, 'second inside']
  ];
  const fields = [
    {name: 'lng', type: 'real'},
    {name: 'lat', type: 'real'},
    {name: 'name', type: 'string', displayName: 'Place', format: '', analyzerType: 'STRING'}
  ];
  return {
    layer: {
      id: 'points',
      type: LAYER_TYPES.point,
      config: {dataId: 'local', label: 'Points'},
      getPositionAccessor:
        dataContainer =>
        ({index}) =>
          [dataContainer.valueAt(index, 0), dataContainer.valueAt(index, 1)]
    },
    dataset: {
      fields,
      dataContainer: createDataContainer(rows),
      allIndexes: [0, 1, 2],
      ...indexes
    },
    feature: mockPolygonFeature
  };
}

test('extract-dataset-utils -> local extraction combines polygon and CPU filters', t => {
  const input = localPointExtractionFixture({
    filteredIndex: [0, 1, 2],
    filteredIdxCPU: [2, 1]
  });
  const extracted = extractRowsInsideFeature(input);

  t.equal(extracted.kind, 'table', 'local datasets return a table');
  t.deepEqual(
    extracted.rows,
    [[30.5, 14.25, 'second inside']],
    'CPU-filtered rows take precedence and polygon clipping still excludes outside rows'
  );
  t.equal(extracted.rowCount, 1, 'count describes the final intersection');
  t.deepEqual(input.dataset.filteredIdxCPU, [2, 1], 'source index order is unchanged');
  t.end();
});

test('extract-dataset-utils -> local extraction index fallback and order', t => {
  const cases = [
    {indexes: {filteredIndex: [2, 1, 0]}, expected: ['second inside', 'first inside']},
    {indexes: {}, expected: ['first inside', 'second inside']},
    {indexes: {filteredIdxCPU: [], filteredIndex: [0, 2]}, expected: []},
    {indexes: {filteredIndex: []}, expected: []},
    {indexes: {allIndexes: undefined}, expected: []}
  ];
  cases.forEach(({indexes, expected}, i) => {
    const extracted = extractRowsInsideFeature(localPointExtractionFixture(indexes));
    t.deepEqual(
      extracted.rows.map(row => row[2]),
      expected,
      `case ${i}: preserves chosen index order and does not fall through an empty selection`
    );
    t.equal(extracted.rowCount, expected.length, `case ${i}: row count matches copied rows`);
  });
  t.end();
});

test('extract-dataset-utils -> local extraction copies rows and field descriptors', t => {
  const input = localPointExtractionFixture();
  const extracted = extractRowsInsideFeature(input);
  const expectedFields = input.dataset.fields.map(field => ({
    name: field.name,
    type: field.type,
    format: field.format,
    analyzerType: field.analyzerType,
    displayName: field.displayName
  }));

  t.deepEqual(extracted.fields, expectedFields, 'field order and import metadata are preserved');
  extracted.fields.forEach((field, i) => {
    t.notEqual(field, input.dataset.fields[i], 'field descriptors are independent');
  });
  extracted.rows[0][2] = 'edited copy';
  extracted.rows.push([31, 13, 'new row']);
  extracted.fields[2].displayName = 'Edited label';
  t.equal(
    input.dataset.dataContainer.valueAt(0, 2),
    'first inside',
    'row edits leave source intact'
  );
  t.equal(input.dataset.dataContainer.numRows(), 3, 'adding copied rows leaves source size intact');
  t.equal(input.dataset.fields[2].displayName, 'Place', 'field edits leave source intact');
  t.end();
});

test('extract-dataset-utils -> local extraction requires a usable polygon and dataset', t => {
  const input = localPointExtractionFixture();
  t.equal(extractRowsInsideFeature({...input, feature: null}), null, 'missing drawing is rejected');
  t.equal(
    extractRowsInsideFeature({
      ...input,
      feature: {type: 'Feature', geometry: {type: 'Point', coordinates: [30, 12]}, properties: {}}
    }),
    null,
    'non-polygon drawing is rejected'
  );
  t.equal(
    extractRowsInsideFeature({...input, dataset: {...input.dataset, disableDataOperation: true}}),
    null,
    'disabled data operations are respected'
  );
  t.equal(
    extractRowsInsideFeature({
      ...input,
      dataset: {...input.dataset, dataContainer: createDataContainer([])}
    }),
    null,
    'empty source dataset is not extractable'
  );
  t.end();
});
