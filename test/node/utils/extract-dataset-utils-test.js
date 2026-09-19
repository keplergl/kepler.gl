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
    isExtractableLayer({config: {dataId: 'local'}}, datasets),
    'layers on local datasets are extractable'
  );
  t.notOk(
    isExtractableLayer({config: {dataId: 'missing'}}, datasets),
    'layers without a dataset are not extractable'
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
