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
import {
  resetFilterGpuMode,
  assignGpuChannel,
  assignGpuChannels,
  getDatasetFieldIndexForFilter
} from '../../../src/utils';

test('gpuFilterUtils -> resetFilterGpuMode', t => {
  const testFilters = [
    {id: '1', dataId: ['smoothie'], gpu: true},
    {id: '2', dataId: ['smoothie'], gpu: true},
    {id: '3', dataId: ['smoothie'], gpu: false},
    {id: '4', dataId: ['smoothie'], gpu: true},
    {id: '5', dataId: ['smoothie'], gpu: true},
    {id: '6', dataId: ['smoothie'], gpu: true},
    {id: '7', dataId: ['milkshake'], gpu: true},
    {id: '8', dataId: ['milkshake'], gpu: false}
  ];

  const expectedFilters = [
    {id: '1', dataId: ['smoothie'], gpu: true},
    {id: '2', dataId: ['smoothie'], gpu: true},
    {id: '3', dataId: ['smoothie'], gpu: false},
    {id: '4', dataId: ['smoothie'], gpu: true},
    {id: '5', dataId: ['smoothie'], gpu: true},
    {id: '6', dataId: ['smoothie'], gpu: false},
    {id: '7', dataId: ['milkshake'], gpu: true},
    {id: '8', dataId: ['milkshake'], gpu: false}
  ];

  const result = resetFilterGpuMode(testFilters);
  t.deepEqual(result, expectedFilters, 'should reset gpu mode');

  t.end();
});

test('gpuFilterUtils -> assignGpuChannel', t => {
  const testCases = [
    {
      gpuFilter: {id: '3', dataId: ['a'], gpu: true},
      filters: [
        {id: '1', dataId: ['b'], gpu: true, gpuChannel: [0]},
        {id: '2', dataId: ['a'], gpu: true, gpuChannel: [0]}
      ],
      result: {
        id: '3',
        dataId: ['a'],
        gpu: true,
        gpuChannel: [1]
      }
    },
    {
      gpuFilter: {id: '3', dataId: ['a'], gpu: true, gpuChannel: [1]},
      filters: [
        {id: '3', dataId: ['a'], gpu: true, gpuChannel: [1]},
        {id: '1', dataId: ['b'], gpu: true, gpuChannel: [0]},
        {id: '2', dataId: ['a'], gpu: true, gpuChannel: [0]}
      ],
      result: {
        id: '3',
        dataId: ['a'],
        gpu: true,
        gpuChannel: [1]
      }
    },
    {
      gpuFilter: {id: '3', dataId: ['a'], gpu: true},
      filters: [
        {id: '1', dataId: ['b'], gpu: true, gpuChannel: [0]},
        {id: '2', dataId: ['a'], gpu: true, gpuChannel: [1]}
      ],
      result: {id: '3', dataId: ['a'], gpu: true, gpuChannel: [0]}
    },
    {
      gpuFilter: {id: '5', dataId: ['a', 'b'], gpu: true},
      filters: [
        {id: '1', dataId: ['b'], gpu: true, gpuChannel: [0]},
        {id: '2', dataId: ['a'], gpu: true, gpuChannel: [3]},
        {id: '3', dataId: ['a'], gpu: true, gpuChannel: [0]},
        {id: '4', dataId: ['a'], gpu: true, gpuChannel: [2]}
      ],
      result: {id: '5', dataId: ['a', 'b'], gpu: true, gpuChannel: [1, 1]}
    },
    {
      gpuFilter: {id: '5', dataId: ['a', 'b'], gpu: true, gpuChannel: [1]},
      filters: [
        {id: '1', dataId: ['b'], gpu: true, gpuChannel: [0]},
        {id: '2', dataId: ['a'], gpu: true, gpuChannel: [3]},
        {id: '3', dataId: ['a', 'b'], gpu: true, gpuChannel: [0, 2]},
        {id: '4', dataId: ['a'], gpu: true, gpuChannel: [2]}
      ],
      result: {id: '5', dataId: ['a', 'b'], gpu: true, gpuChannel: [1, 1]}
    },
    {
      gpuFilter: {id: '6', dataId: ['a'], gpu: true},
      filters: [
        {id: '1', dataId: ['b'], gpu: true, gpuChannel: [0]},
        {id: '2', dataId: ['a'], gpu: true, gpuChannel: [3]},
        {id: '3', dataId: ['a'], gpu: true, gpuChannel: [2]},
        {id: '4', dataId: ['a'], gpu: true, gpuChannel: [0]},
        {id: '5', dataId: ['a'], gpu: true, gpuChannel: [1]}
      ],
      result: {id: '6', dataId: ['a'], gpu: false}
    }
  ];

  testCases.forEach(tc => {
    t.deepEqual(
      assignGpuChannel(tc.gpuFilter, tc.filters),
      tc.result,
      'should assign correct channel'
    );
  });

  t.end();
});

test('gpuFilterUtils -> assignGpuChannels', t => {
  const testCases = [
    {
      filters: [
        {id: '1', dataId: ['a'], gpu: true, gpuChannel: [1]},
        {id: '2', dataId: ['a'], gpu: true},
        {id: '3', dataId: ['b'], gpu: true},
        {id: '4', dataId: ['b'], gpu: false}
      ],
      result: [
        {id: '1', dataId: ['a'], gpu: true, gpuChannel: [1]},
        {id: '2', dataId: ['a'], gpu: true, gpuChannel: [0]},
        {id: '3', dataId: ['b'], gpu: true, gpuChannel: [0]},
        {id: '4', dataId: ['b'], gpu: false}
      ]
    },
    {
      filters: [
        {id: '1', dataId: ['a'], gpu: true, gpuChannel: [1]},
        {id: '2', dataId: ['b'], gpu: true, gpuChannel: [1]},
        {id: '3', dataId: ['a'], gpu: true, gpuChannel: [2]},
        {id: '4', dataId: ['b'], gpu: false},
        {id: '5', dataId: ['a'], gpu: true},
        {id: '6', dataId: ['b'], gpu: true},
        {id: '7', dataId: ['b'], gpu: true, gpuChannel: [0]}
      ],
      result: [
        {id: '1', dataId: ['a'], gpu: true, gpuChannel: [1]},
        {id: '2', dataId: ['b'], gpu: true, gpuChannel: [1]},
        {id: '3', dataId: ['a'], gpu: true, gpuChannel: [2]},
        {id: '4', dataId: ['b'], gpu: false},
        {id: '5', dataId: ['a'], gpu: true, gpuChannel: [0]},
        {id: '6', dataId: ['b'], gpu: true, gpuChannel: [2]},
        {id: '7', dataId: ['b'], gpu: true, gpuChannel: [0]}
      ]
    },
    {
      filters: [
        {id: '1', dataId: ['a', 'b'], gpu: true, gpuChannel: [1, 0]},
        {id: '2', dataId: ['a'], gpu: true, gpuChannel: [1]},
        {id: '3', dataId: ['b', 'a'], gpu: true},
        {id: '4', dataId: ['b'], gpu: true}
      ],
      result: [
        {id: '1', dataId: ['a', 'b'], gpu: true, gpuChannel: [0, 0]},
        {id: '2', dataId: ['a'], gpu: true, gpuChannel: [1]},
        {id: '3', dataId: ['b', 'a'], gpu: true, gpuChannel: [1, 2]},
        {id: '4', dataId: ['b'], gpu: true, gpuChannel: [2]}
      ]
    }
  ];

  testCases.forEach(tc => {
    t.deepEqual(assignGpuChannels(tc.filters), tc.result, 'should assign correct channel');
  });
  t.end();
});

test('gpuFilterUtils -> getDatasetFieldIndexForFilter', t => {
  const dataId = 'test-this-id';

  let fieldIndex = getDatasetFieldIndexForFilter(dataId, {
    dataId: [dataId],
    fieldIdx: [3]
  });

  t.equal(fieldIndex, 3, 'FieldIndex should be 3');

  fieldIndex = getDatasetFieldIndexForFilter(dataId, {
    dataId: ['different-id', dataId],
    fieldIdx: [3, 5]
  });

  t.equal(fieldIndex, 5, 'FieldIndex should be 5');

  fieldIndex = getDatasetFieldIndexForFilter(dataId, {dataId: ['different-id']});
  t.equal(fieldIndex, -1, 'FieldIndex should be -1');

  t.end();
});
