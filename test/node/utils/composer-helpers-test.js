// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

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
