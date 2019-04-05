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
import {resetFilterGpuMode, assignGpuChannel, assignGpuChannels} from 'utils/gpu-filter-utils';

test('gpuFilterUtils -> resetFilterGpuMode', t => {
  const testFilters = [
    {dataId: 'smoothie', gpu: true},
    {dataId: 'smoothie', gpu: true},
    {dataId: 'smoothie', gpu: false},
    {dataId: 'smoothie', gpu: true},
    {dataId: 'smoothie', gpu: true},
    {dataId: 'smoothie', gpu: true},
    {dataId: 'milkshake', gpu: true},
    {dataId: 'milkshake', gpu: false}
  ];

  const expectedFilters = [
    {dataId: 'smoothie', gpu: true},
    {dataId: 'smoothie', gpu: true},
    {dataId: 'smoothie', gpu: false},
    {dataId: 'smoothie', gpu: true},
    {dataId: 'smoothie', gpu: true},
    {dataId: 'smoothie', gpu: false},
    {dataId: 'milkshake', gpu: true},
    {dataId: 'milkshake', gpu: false}
  ];

  const result = resetFilterGpuMode(testFilters);
  t.deepEqual(result, expectedFilters, 'should reset gpu mode');

  t.end();
});

test('gpuFilterUtils -> assignGpuChannel', t => {
  const testCases = [{
    gpuFilter: {dataId: 'a', gpu: true},
    filters: [
      {dataId: 'b', gpu: true, gpuChannel: 0},
      {dataId: 'a', gpu: true, gpuChannel: 0}
    ],
    result: {dataId: 'a', gpu: true, gpuChannel: 1}
  }, {
    gpuFilter: {dataId: 'a', gpu: true},
    filters: [
      {dataId: 'b', gpu: true, gpuChannel: 0},
      {dataId: 'a', gpu: true, gpuChannel: 1}
    ],
    result: {dataId: 'a', gpu: true, gpuChannel: 0}
  }, {
    gpuFilter: {dataId: 'a', gpu: true},
    filters: [
      {dataId: 'b', gpu: true, gpuChannel: 0},
      {dataId: 'a', gpu: true, gpuChannel: 3},
      {dataId: 'a', gpu: true, gpuChannel: 0},
      {dataId: 'a', gpu: true, gpuChannel: 2}
    ],
    result: {dataId: 'a', gpu: true, gpuChannel: 1}
  }, {
    gpuFilter: {dataId: 'a', gpu: true},
    filters: [
      {dataId: 'b', gpu: true, gpuChannel: 0},
      {dataId: 'a', gpu: true, gpuChannel: 3},
      {dataId: 'a', gpu: true, gpuChannel: 2},
      {dataId: 'a', gpu: true, gpuChannel: 0},
      {dataId: 'a', gpu: true, gpuChannel: 1}
    ],
    result: {dataId: 'a', gpu: true}
  }];

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
  const testCases = [{
    filters: [
      {dataId: 'a', gpu: true, gpuChannel: 1},
      {dataId: 'a', gpu: true},
      {dataId: 'b', gpu: true},
      {dataId: 'b', gpu: false}
    ],
    result: [
      {dataId: 'a', gpu: true, gpuChannel: 1},
      {dataId: 'a', gpu: true, gpuChannel: 0},
      {dataId: 'b', gpu: true, gpuChannel: 0},
      {dataId: 'b', gpu: false}
    ]
  }, {
    filters: [
      {dataId: 'a', gpu: true, gpuChannel: 1},
      {dataId: 'b', gpu: true, gpuChannel: 1},
      {dataId: 'a', gpu: true, gpuChannel: 2},
      {dataId: 'b', gpu: false},
      {dataId: 'a', gpu: true},
      {dataId: 'b', gpu: true},
      {dataId: 'b', gpu: true, gpuChannel: 0}
    ],
    result: [
      {dataId: 'a', gpu: true, gpuChannel: 1},
      {dataId: 'b', gpu: true, gpuChannel: 1},
      {dataId: 'a', gpu: true, gpuChannel: 2},
      {dataId: 'b', gpu: false},
      {dataId: 'a', gpu: true, gpuChannel: 0},
      {dataId: 'b', gpu: true, gpuChannel: 2},
      {dataId: 'b', gpu: true, gpuChannel: 0}
    ]
  }];

  testCases.forEach(tc => {
    t.deepEqual(
      assignGpuChannels(tc.filters),
      tc.result,
      'should assign correct channel'
    );
  });
  t.end();
});
