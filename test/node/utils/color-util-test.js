// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import {createLinearGradient} from '@kepler.gl/utils';

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
