// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape-catch';

import {DatasetType} from '@kepler.gl/constants';
import {createDataContainer, isExtractableDataset, isExtractableLayer} from '@kepler.gl/utils';

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
  t.end();
});
