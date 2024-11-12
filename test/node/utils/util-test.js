// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {
  arrayInsert,
  arrayMove,
  camelToTitle,
  camelize,
  capitalizeFirstLetter,
  getError,
  set,
  toArray
} from '@kepler.gl/utils';
import test from 'tape';

test('Utils -> set', t => {
  const obj1 = {map: {map1: 'world'}};
  const obj2 = set(['map', 'map1'], 'hello', obj1);

  t.notLooseEqual(obj1, obj2, 'set should create a new object');
  t.equal(set(['map'], 'hello', null), null, 'set null should return null');
  t.equal(set(['map'], 'hello', undefined), undefined, 'set undefined should return undefined');
  t.deepEqual(
    set(['map', 'map1'], 'hello', {map: {map1: 'world'}}),
    {map: {map1: 'hello'}},
    'set should set value'
  );
  t.deepEqual(set(['map'], 'hello', {}), {map: 'hello'}, 'set should create leave node');
  t.deepEqual(
    set(['map', 1], 'hello', {map: ['hello', 'world']}),
    {map: ['hello', 'hello']},
    'set should work with array'
  );
  t.end();
});

test('Utils -> toArray', t => {
  t.deepEqual(toArray(), [], 'Should return an empty array for undefined value');

  t.deepEqual(toArray([1, 2]), [1, 2], 'Should not change an existing array');

  t.deepEqual(toArray(null), [], 'Should return an empty array for a null value');

  t.deepEqual(toArray('test'), ['test'], 'Should return an array with one element for a string');

  t.end();
});

test('Utils -> getError', t => {
  t.equal(getError(new Error('oops')), 'oops', 'should find error message from Error object');
  t.equal(getError('sorry'), 'sorry', 'should find error message from string');
  t.equal(getError(), 'Something went wrong', 'should find error message from empty');

  t.equal(
    getError({error: {message: 'not good'}}),
    'not good',
    'should find error message from object'
  );
  t.equal(
    getError({err: {error: 'not good'}}),
    'not good',
    'should find error message from object'
  );
  t.equal(getError({status: 400}), '{"status":400}', 'should find error message from object');

  t.end();
});

test('Utils -> camelToTitle', t => {
  t.equal(camelToTitle('camelToTitle'), 'Camel To Title', 'should return titled string');
  t.equal(camelToTitle('strokeColor'), 'Stroke Color', 'should return titled string');
  t.end();
});

test('Utils -> camelize', t => {
  t.equal(camelize('hello world test string'), 'helloWorldTestString', 'should camelize string');
  t.equal(camelize('Hello World test String'), 'helloWorldTestString', 'should camelize string');
  t.end();
});

test('Utils -> capitalizeFirstLetter', t => {
  t.equal(capitalizeFirstLetter('hello world'), 'Hello world', 'should capitalize string');
  t.equal(capitalizeFirstLetter(1), 1, 'should ignore other types than string');
  t.end();
});

test('Utils -> arrayInsert', t => {
  t.deepEqual(arrayInsert([], 1, 0), [0], 'should insert val at index');
  t.deepEqual(arrayInsert([1, 2, 3, 4], 1, 5), [1, 5, 2, 3, 4], 'should insert val at index');
  t.deepEqual(arrayInsert([1, 2, 3], 0, 6), [6, 1, 2, 3], 'should insert val at index');
  t.deepEqual(arrayInsert(null, 1, 0), null, 'should insert val at index');
  t.deepEqual(arrayInsert([1, 2, 3], 3, 4), [1, 2, 3, 4], 'should insert val at index');
  t.end();
});

test('Utils -> arrayMove', t => {
  const arr = [4, 1, 9, 3, 11];
  t.deepEqual(arrayMove(arr, 2, 1), [4, 9, 1, 3, 11], 'should move array');
  t.deepEqual(arrayMove(arr, 2, 5), [4, 1, 3, 11, 9], 'should move array');
  t.deepEqual(arrayMove(arr, 2, -1), [4, 1, 3, 11, 9], 'should move array');
  t.end();
});
