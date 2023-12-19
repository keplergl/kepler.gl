// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import {GEOCODER_DATASET_NAME} from '@kepler.gl/constants';
import {getVisibleDatasets} from '@kepler.gl/components';

test('kepler-gl utils -> getVisibleDatasets', t => {
  // Geocoder dataset mock can be an empty object since the filter function only cares about the key
  // in the 'datasets' object and filters by it
  const datasets = {
    first: {},
    second: {},
    geocoder_dataset: {}
  };

  t.true(
    datasets[GEOCODER_DATASET_NAME],
    `${GEOCODER_DATASET_NAME} key should exist before being filtered`
  );

  const filteredResults = getVisibleDatasets(datasets);

  t.isEqual(
    filteredResults[GEOCODER_DATASET_NAME],
    undefined,
    `Should not exist after filtering out ${GEOCODER_DATASET_NAME} key`
  );

  t.end();
});
