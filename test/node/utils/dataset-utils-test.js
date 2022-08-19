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
import {findDefaultColorField, createNewDataEntry} from '../../../src/utils';

import {processCsvData} from '@kepler.gl/processors';

import csvData from 'test/fixtures/test-layer-data';

const DEFAULT_FIELD_TEST_CASES = [
  {
    name: 'excluded lat',
    csv: csvData,
    expected: 'trip_distance'
  },
  {
    name: 'empty',
    csv: 'a\na',
    expected: null
  },
  {
    name: 'integer only',
    csv: 'a,b\na,0\na,1',
    expected: 'b'
  },
  {
    name: 'integer and real',
    csv: 'a,b,c\na,0,0.5\na,1,0.5',
    expected: 'c'
  },
  {
    name: 'excluded real',
    csv: 'zipcode,b,c\n0.5,0,0.5\n0.5,1,0.5',
    expected: 'c'
  },
  {
    name: 'included real',
    csv: 'zipcode mean,b,c\n0.5,0,0.5\n0.5,1,0.5',
    expected: 'zipcode mean'
  },
  {
    name: 'included real, with inclusion ordering',
    csv: 'zipcode mean,a metric,b,c\n0.5,0.1,0,0.5\n0.5,0.1,1,0.5',
    expected: 'a metric'
  }
];

test('datasetUtils.findDefaultColorField', t => {
  for (const tc of DEFAULT_FIELD_TEST_CASES) {
    const dataset = createNewDataEntry({
      info: {id: 'taro'},
      data: processCsvData(tc.csv)
    }).taro;

    const defaultField = findDefaultColorField(dataset);
    if (!tc.expected) {
      t.notOk(defaultField, `${tc.name}: default field is null`);
    } else {
      t.equals(defaultField.name, tc.expected, `${tc.name}: default field name is OK`);
    }
  }
  t.end();
});
