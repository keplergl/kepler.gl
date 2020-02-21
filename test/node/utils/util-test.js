// Copyright (c) 2020 Uber Technologies, Inc.
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
import {set, toArray, getError} from 'utils/utils';

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
