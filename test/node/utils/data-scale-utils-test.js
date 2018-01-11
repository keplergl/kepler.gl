import test from 'tape';
import {
  getOrdinalDomain,
  getQuantileDomain,
  getLinearDomain
} from '../../../src/utils/data-scale-utils';

function numberSort(a, b) {
  return a - b;
}

test('DataScaleUtils -> getOrdinalDomain', t => {
  t.plan(2);

  const data = ['a', 'a', 'b', undefined, null, 0];
  function valueAccessor(d) {
    return d.value;
  }

  const values = [{value: 'a'}, {value: 'b'}, {value: 'b'}];

  t.deepEqual(getOrdinalDomain(data), ['a', 'b', 0],
    'should get correct ordinal domain');

  t.deepEqual(getOrdinalDomain(values, valueAccessor), ['a', 'b'],
    'should get correct ordinal domain');
});

test('DataScaleUtils -> getQuantileDomain', t => {
  t.plan(3);

  const data = ['a', 'b', 'c', 'b', undefined, null];
  const quanData = [1, 4, 2, 3, 1, undefined, null, 0];
  function valueAccessor(d) {
    return d.value;
  }

  const values = [{value: 'a'}, {value: 'b'}, {value: 'b'}];

  t.deepEqual(getQuantileDomain(data, undefined, undefined),
    ['a', 'b', 'b', 'c'], 'should get correct quantile domain');

  t.deepEqual(getQuantileDomain(quanData, undefined, numberSort),
    [0, 1, 1, 2, 3, 4], 'should get correct quantile domain');

  t.deepEqual(getQuantileDomain(values, valueAccessor), ['a', 'b', 'b'],
    'should get correct quantile domain');
});

test('DataScaleUtils -> getLinearDomain', t => {
  t.plan(5);

  const quanData = [1, 4, 2, 3, 1, undefined, null, 0];
  function valueAccessor(d) {
    return d.value;
  }

  const values = [{value: 1}, {value: 0}, {value: -3}];

  t.deepEqual(getLinearDomain(quanData, undefined),
    [0, 4], 'should get correct Linear domain');

  t.deepEqual(getLinearDomain([10, 10]),
    [10, 10], 'should get correct Linear domain');

  t.deepEqual(getLinearDomain([10, undefined]),
    [10, 10], 'should get correct Linear domain');

  t.deepEqual(getLinearDomain([undefined, undefined, null]),
    [0, 1], 'should get correct Linear domain');

  t.deepEqual(getLinearDomain(values, valueAccessor), [-3, 1],
    'should get correct Linear domain');
});
