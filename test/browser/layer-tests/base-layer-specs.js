// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape-catch';
import {Layer, AggregationLayer} from '@kepler.gl/layers';
import {KeplerTable} from '@kepler.gl/table';

test('#BaseLayer -> updateLayerDomain', t => {
  const rows = [
    ['a', 3],
    ['b', 4],
    ['c', 1],
    ['d', null],
    ['e', 5],
    ['f', 0]
  ];
  const fields = [
    {
      name: 'f1'
    },
    {
      name: 'f2'
    }
  ];
  const dataset = new KeplerTable({
    info: {
      id: 'test'
    }
  });
  dataset.importData({
    data: {
      rows,
      fields
    }
  });

  dataset.filteredIndex = [0, 1, 2, 3];
  dataset.filteredIndexForDomain = [0, 1, 2, 3, 4];

  const mockLayer = new Layer({dataId: 'test'});

  mockLayer.updateLayerConfig({
    colorField: dataset.fields[1],
    colorDomain: [0, 1],
    colorScale: 'quantile',
    sizeField: null,
    sizeDomain: [0, 1]
  });

  const expectedDomain = [1, 3, 4, 5];
  let updatedLayer = mockLayer.updateLayerDomain({
    test: dataset
  });

  t.deepEqual(
    updatedLayer.config.colorDomain,
    expectedDomain,
    'should calculate layer color domain'
  );

  t.deepEqual(updatedLayer.config.sizeDomain, [0, 1], 'should not calculate layer size domain');

  mockLayer.updateLayerConfig({
    colorField: dataset.fields[0],
    colorDomain: [0, 1],
    colorScale: 'ordinal',
    sizeField: null,
    sizeDomain: [0, 1]
  });

  updatedLayer = mockLayer.updateLayerDomain({
    test: dataset
  });

  const expectedOrdinalDomain = ['a', 'b', 'c', 'd', 'e', 'f'];

  t.deepEqual(
    updatedLayer.config.colorDomain,
    expectedOrdinalDomain,
    'should calculate layer color domain based on ordinal domain'
  );

  const dataset2 = new KeplerTable({
    info: {
      id: 'test'
    }
  });
  dataset2.importData({
    data: {
      rows: [
        ['a', 3],
        ['b', 4],
        ['c', 1],
        ['d', null],
        ['e', 5],
        ['f', 0],
        ['g', 6]
      ],
      fields
    }
  });

  dataset2.filteredIndex = [0, 1, 2, 3];
  dataset2.filteredIndexForDomain = [0, 1, 2, 3, 4];
  updatedLayer = mockLayer.updateLayerDomain({test: dataset2}, {id: 'newFilter'});

  t.deepEqual(
    updatedLayer.config.colorDomain,
    expectedOrdinalDomain,
    'should skip domain calculation if field is ordinal'
  );

  t.end();
});

test('#BaseLayer -> getVisChannelScale, by zoom', t => {
  const scale = 'quantize';
  const domain = {
    z: [2, 3, 4, 5],
    stops: [
      [0, 20],
      [0, 30],
      [0, 40],
      [0, 50]
    ]
  };
  const range = ['#010101', '#020202', '#030303'];

  const mockLayer = new Layer({dataId: 'test'});

  const scaleFunc = mockLayer.getVisChannelScale(scale, domain, range);

  t.ok(scaleFunc.byZoom, true, 'should set by zoom to be truthy');
  const scale1 = scaleFunc(1);
  const scale2 = scaleFunc(3.2);
  const scale3 = scaleFunc(9);

  t.deepEqual(scale1.domain(), [0, 20], 'should set domain by zoom');
  t.deepEqual(scale1.range(), range, 'should set range');
  t.deepEqual(scale2.domain(), [0, 30], 'should set domain by zoom');
  t.deepEqual(scale3.domain(), [0, 50], 'should set domain by zoom');

  t.end();
});

test('#AggregationLayer -> updateLayerDomain', t => {
  const rows = [
    ['a', 3],
    ['b', 4],
    ['c', 1],
    ['d', null]
  ];

  const fields = [
    {
      name: 'f1'
    },
    {
      name: 'f2'
    }
  ];
  const dataset = new KeplerTable({
    info: {
      id: 'test'
    }
  });
  dataset.importData({
    data: {
      rows,
      fields
    }
  });

  const mockLayer = new AggregationLayer({dataId: 'test'});

  mockLayer.updateLayerConfig({
    colorField: dataset.fields[1],
    colorDomain: [0, 1],
    colorScale: 'quantile',
    sizeField: null,
    sizeDomain: [0, 1]
  });

  const updatedLayer = mockLayer.updateLayerDomain({test: dataset});
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
