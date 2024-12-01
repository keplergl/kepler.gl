// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape-catch';
import {Layer, AggregationLayer} from '@kepler.gl/layers';

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
  const data = [
    ['a', 3],
    ['b', 4],
    ['c', 1],
    ['d', null]
  ];
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
  t.deepEqual(
    updatedLayer.config.colorDomain,
    [0, 1],
    'should not calculate aggregation layer domain'
  );

  t.end();
});

test('#BaseLayer -> getAllPossibleColumnPairs', t => {
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
  t.equal(Layer.getAllPossibleColumnPairs(columnes1).length, 4, 'should find 4 pairs');
  t.equal(Layer.getAllPossibleColumnPairs(columnes2).length, 2, 'should find 4 pairs');
  t.equal(Layer.getAllPossibleColumnPairs(columnes3).length, 1, 'should find 4 pairs');
  t.end();
});
