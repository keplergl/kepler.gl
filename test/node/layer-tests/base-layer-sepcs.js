// Copyright (c) 2019 Uber Technologies, Inc.
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

import test from 'tape-catch';
import {Layer} from 'layers';
import AggregationLayer from 'layers/aggregation-layer';

/* Fixed in #618
test('#BaseLayer -> updateLayerDomain', t => {

  const allData = [['a', 3], ['b', 4], ['c', 1], ['d', null], ['e', 5], ['f', 0]];
  const data = [['a', 3], ['b', 4], ['c', 1], ['d', null]];
  const filteredIndex = [0, 1, 2, 3];
  const filteredIndexForDomain = [0, 1, 2, 3, 4];

  const mockLayer = new Layer({dataId: 'test'});

  mockLayer.updateLayerConfig({
    colorField: {
      tableFieldIndex: 2,
      type: 'real'
    },
    colorDomain: [0, 1],
    colorScale: 'quantile',
    sizeField: null,
    sizeDomain: [0, 1]
  });

  const expectedDomain = [1, 3, 4, 5];
  let updatedLayer = mockLayer.updateLayerDomain({
    test: {
      data,
      allData,
      filteredIndex,
      filteredIndexForDomain
    }
  });

  t.deepEqual(updatedLayer.config.colorDomain, expectedDomain,
    'should calculate layer color domain');

  t.deepEqual(updatedLayer.config.sizeDomain, [0, 1],
    'should not calculate layer size domain');

  mockLayer.updateLayerConfig({
    colorField: {
      tableFieldIndex: 1,
      type: 'string'
    },
    colorDomain: [0, 1],
    colorScale: 'ordinal',
    sizeField: null,
    sizeDomain: [0, 1]
  });

  updatedLayer = mockLayer.updateLayerDomain({
    test: {
      data,
      allData,
      filteredIndex,
      filteredIndexForDomain
    }
  });

  const expectedOrdinalDomain = ['a', 'b', 'c', 'd', 'e', 'f'];

  t.deepEqual(updatedLayer.config.colorDomain, expectedOrdinalDomain,
    'should calculate layer color domain based on ordinal domain');

  const newDataset = {
    allData: [['a', 3], ['b', 4], ['c', 1], ['d', null], ['e', 5], ['f', 0], ['g', 6]],
    data,
    filteredIndex,
    filteredIndexForDomain
  };

  updatedLayer = mockLayer.updateLayerDomain({test: newDataset}, {id: 'newFilter'});

  t.deepEqual(updatedLayer.config.colorDomain, expectedOrdinalDomain,
    'should skip domain calculation if field is oridinal');

  t.end();
});
*/
test('#AggregationLayer -> updateLayerDomain', t => {
  const data = [['a', 3], ['b', 4], ['c', 1], ['d', null]];
  const mockLayer = new AggregationLayer({dataId: 'test'});

  mockLayer.updateLayerConfig({
    colorField: {
      tableFieldIndex: 2,
      type: 'real'
    },
    colorDomain: [0, 1],
    colorScale: 'quantile',
    sizeField: null,
    sizeDomain: [0, 1]
  });

  const updatedLayer = mockLayer.updateLayerDomain({test: {data, allData: data}});
  t.deepEqual(updatedLayer.config.colorDomain, [0, 1],
    'should not calculate aggregation layer domain');

  t.end();
});

test('#BaseLayer -> getAllPossibleColumnParis', t => {
  const columnes1 = {
    a: [1, 2],
    b: [3, 4]
  };
  const columnes2 = {
    a: [1],
    b: [3, 4]
  };

  const columnes3 = {
    a: [1]
  };
  t.equal(Layer.getAllPossibleColumnParis(columnes1).length, 4, 'should find 4 pairs');
  t.equal(Layer.getAllPossibleColumnParis(columnes2).length, 2, 'should find 4 pairs');
  t.equal(Layer.getAllPossibleColumnParis(columnes3).length, 1, 'should find 4 pairs');
  t.end();
});
