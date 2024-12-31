// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import cloneDeep from 'lodash.clonedeep';
import {
  getOrdinalDomain,
  getQuantileDomain,
  getLinearDomain,
  getLogDomain,
  createDataContainer,
  getThresholdsFromQuantiles,
  getDomainStepsbyZoom,
  getQuantLabelFormat,
  getHistogramDomain
} from '@kepler.gl/utils';
import {StateWFilesFiltersLayerColor} from 'test/helpers/mock-state';

function numberSort(a, b) {
  return a - b;
}

test('DataScaleUtils -> getOrdinalDomain', t => {
  const data = [['a'], ['a'], ['b'], [undefined], [null], [0], null];

  function valueAccessor(d, dc) {
    return dc.valueAt(d.index, 0);
  }

  t.deepEqual(
    getOrdinalDomain(createDataContainer(data), valueAccessor),
    [0, 'a', 'b'],
    'should get correct ordinal domain'
  );

  t.end();
});

test('DataScaleUtils -> getQuantileDomain', t => {
  const data = ['a', 'b', 'c', 'b', undefined, null];
  const quanData = [1, 4, 2, 3, 1, undefined, null, 0];
  function valueAccessor(d) {
    return d.value;
  }

  const values = [{value: 'a'}, {value: 'b'}, {value: 'b'}];

  t.deepEqual(
    getQuantileDomain(data, undefined, undefined),
    ['a', 'b', 'b', 'c'],
    'should get correct quantile domain'
  );

  t.deepEqual(
    getQuantileDomain(quanData, undefined, numberSort),
    [0, 1, 1, 2, 3, 4],
    'should get correct quantile domain'
  );

  t.deepEqual(
    getQuantileDomain(values, valueAccessor),
    ['a', 'b', 'b'],
    'should get correct quantile domain'
  );

  t.end();
});

test('DataScaleUtils -> getLinearDomain', t => {
  const quanData = [1, 4, 2, 3, 1, undefined, null, 0];
  function valueAccessor(d) {
    return d.value;
  }

  const values = [{value: 1}, {value: 0}, {value: -3}];

  t.deepEqual(getLinearDomain(quanData, undefined), [0, 4], 'should get correct Linear domain');

  t.deepEqual(getLinearDomain([10, 10]), [10, 10], 'should get correct Linear domain');

  t.deepEqual(getLinearDomain([10, undefined]), [10, 10], 'should get correct Linear domain');

  t.deepEqual(
    getLinearDomain([undefined, undefined, null]),
    [0, 1],
    'should get correct Linear domain'
  );

  t.deepEqual(getLinearDomain(values, valueAccessor), [-3, 1], 'should get correct Linear domain');

  t.end();
});

test('DataScaleUtils -> getLogDomain', t => {
  function valueAccessor(d) {
    return d.value;
  }

  t.deepEqual(
    getLogDomain([{value: 1}, {value: 0}, {value: -3}], valueAccessor),
    [-3, 1],
    'should get correct Log domain with negative numbers'
  );

  t.deepEqual(
    getLogDomain([{value: 1}, {value: 0}, {value: 3}], valueAccessor),
    [0.00001, 3],
    'should not contain a 0 in domain'
  );

  t.deepEqual(
    getLogDomain([], valueAccessor),
    [0.00001, 1],
    'should have undefined domain for empty set'
  );

  t.end();
});

test('DataScaleUtils -> getThresholdsFromQuantiles', t => {
  t.deepEqual(
    getThresholdsFromQuantiles([0, 1, 2, 3, 4, 5], 3),
    [1.6666666666666665, 3.333333333333333],
    'should get correct thresholds from quantiles'
  );

  t.deepEqual(
    getThresholdsFromQuantiles([0, 1, 2, 3, 4, 5], 1),
    [],
    'should get correct thresholds from quantiles'
  );

  t.deepEqual(
    getThresholdsFromQuantiles([0, 1, 2, 3, 4, 5], undefined),
    [0, 5],
    'should get correct thresholds from quantiles'
  );
  t.end();
});

test('DataScaleUtils -> getDomainStepsbyZoom', t => {
  const domain = [
    [0, 1],
    [0, 2],
    [0, 3]
  ];
  const steps = [0, 2, 4];
  [
    {z: 0, expected: [0, 1]},
    {z: 0.5, expected: [0, 1]},
    {z: 1, expected: [0, 1]},
    {z: 1.2, expected: [0, 1]},
    {z: 2, expected: [0, 2]},
    {z: 3.5, expected: [0, 2]},
    {z: 4, expected: [0, 3]},
    {z: 4.5, expected: [0, 3]},
    {z: 10, expected: [0, 3]}
  ].forEach(({z, expected}) => {
    t.deepEqual(
      getDomainStepsbyZoom(domain, steps, z),
      expected,
      `should get correct domain from zoom ${z}`
    );
  });

  t.end();
});

test('DataScaleUtils -> getQuantLabelFormat', t => {
  const fieldType = 'real';
  const domain = [1, 2];

  const format = getQuantLabelFormat(domain, fieldType);

  t.deepEqual(format(0), '0', 'should get correct quant label format for 0');
  t.deepEqual(format(null), 'no value', 'should get correct quant label format for null');
  t.deepEqual(format(undefined), 'no value', 'should get correct quant label format for undefined');
  t.deepEqual(format(1.0), '1', 'should get correct quant label format for number');

  t.end();
});

test('DataScaleUtils -> getHistogramDomain', t => {
  let aggregatedBins = [
    {i: 0, value: 1, count: 1},
    {i: 1, value: 2, count: 1},
    {i: 2, value: 3, count: 1},
    {i: 3, value: 4, count: 1}
  ];
  let histogramDomain = getHistogramDomain({aggregatedBins});

  t.deepEqual(histogramDomain, [1, 4, 2.5]);

  aggregatedBins = null;
  histogramDomain = getHistogramDomain({aggregatedBins});

  t.deepEqual(histogramDomain, [0, 0, 0]);

  // test dataset
  const InitialState = cloneDeep(StateWFilesFiltersLayerColor);
  const {layers, datasets} = InitialState.visState;
  const pointLayer = layers[0];
  const dataset = datasets[pointLayer.config.dataId];
  const field = dataset.fields[6];
  const fieldValueAccessor = idx => dataset.getValue(field.name, idx);

  histogramDomain = getHistogramDomain({dataset, fieldValueAccessor});
  t.deepEqual(histogramDomain, [1, 12124, 912.2857142857143]);

  t.end();
});
