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

import test from 'tape';
import {set} from 'utils/utils';

test('Utils -> set', t => {
  const obj1 = {map: {map1: 'world'}};
  const obj2 = set(['map', 'map1'], 'hello', obj1);

  t.notLooseEqual(obj1, obj2, 'set should create a new object');
  t.equal(set(['map'], 'hello', null), null, 'set null should return null');
  t.equal(set(['map'], 'hello', undefined), undefined, 'set undefined should return undefined');
  t.deepEqual(set(['map', 'map1'], 'hello', {map: {map1: 'world'}}), {map: {map1: 'hello'}}, 'set should set value');
  t.deepEqual(set(['map'], 'hello', {}), {map: 'hello'}, 'set should create leave node');
  t.deepEqual(set(['map', 1], 'hello', {map: ['hello', 'world']}), {map: ['hello', 'hello']}, 'set should work with array');
  t.end();
});
