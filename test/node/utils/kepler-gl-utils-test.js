// Copyright (c) 2022 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import test from 'tape';
import {GEOCODER_DATASET_NAME} from 'constants/default-settings';
import {getVisibleDatasets} from 'components/kepler-gl';

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
