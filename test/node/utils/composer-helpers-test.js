// Copyright (c) 2023 Uber Technologies, Inc.
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
import {filterOutById, removeElementAtIndex} from '@kepler.gl/reducers';

test('#composeHelpers -> RemoveElementAtIndex', t => {
  const list = [1, 2, 3, 4, 5];
  t.deepEqual(removeElementAtIndex(1)(list), [1, 3, 4, 5], 'Should remove element at index');
  t.end();
});

test('#composeHelpers -> filterOutById', t => {
  const list = [{id: 1}, {id: 2}, {id: 3}];
  t.deepEqual(filterOutById(1)(list), [{id: 2}, {id: 3}], 'Should remove element with specific id');
  t.end();
});
