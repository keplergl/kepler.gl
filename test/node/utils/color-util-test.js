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
import {createLinearGradient} from '../utils';

test('createLinearGradient', t => {
  let colors = [[100, 100, 100]];

  t.deepEqual(
    createLinearGradient('bottom', colors),
    'linear-gradient(to bottom, rgba(100,100,100, 1) 0%, rgba(100,100,100, 1) 100%)',
    'Should create a solid gradient with 1 color'
  );

  colors = [
    [100, 100, 100],
    [200, 200, 200],
    [300, 300, 300]
  ];

  t.deepEqual(
    createLinearGradient('bottom', colors),
    'linear-gradient(to bottom, rgba(100,100,100, 1) 0%, rgba(100,100,100, 1) 33.33%,rgba(200,200,200, 1) 33.33%, rgba(200,200,200, 1) 66.66%,rgba(300,300,300, 1) 66.66%, rgba(300,300,300, 1) 99.99%)',
    'Should create a linear gradient'
  );

  colors = [
    [10, 10, 10],
    [20, 20, 20],
    [30, 30, 30],
    [40, 40, 40]
  ];

  t.deepEqual(
    createLinearGradient('bottom', colors),
    'linear-gradient(to bottom, rgba(10,10,10, 1) 0%, rgba(10,10,10, 1) 25%,rgba(20,20,20, 1) 25%, rgba(20,20,20, 1) 50%,rgba(30,30,30, 1) 50%, rgba(30,30,30, 1) 75%,rgba(40,40,40, 1) 75%, rgba(40,40,40, 1) 100%)',
    'Should create a linear gradient'
  );

  t.end();
});
