// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';

import {createNewDataEntry} from '@kepler.gl/table';

test('Dataset Utils -> createNewDataEntry', t => {
  const task = createNewDataEntry({
    info: {id: 'test', color: [0, 92, 255]},
    data: {
      rows: [[10], [20]],
      fields: []
    }
  });

  t.equal(task.label, 'CREATE_TABLE_TASK', 'should create CREATE_TABLE_TASK task');
  t.equal(task.type, 'CREATE_TABLE_TASK', 'should create CREATE_TABLE_TASK task');
  t.deepEqual(
    task.payload,
    {
      info: {id: 'test', color: [0, 92, 255]},
      color: [0, 92, 255],
      opts: {},
      data: {rows: [[10], [20]], fields: [], cols: undefined}
    },
    'should create correct CREATE_TABLE_TASK task payload'
  );

  t.end();
});
