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

import {
  getRoundingDecimalFromStep,
  preciseRound,
  roundValToStep
} from 'utils/data-utils';

it('dataUtils -> getRoundingDecimalFromStep', () => {
  expect(preciseRound(1.234, 2)).toEqual('1.23');
  expect(preciseRound(13.234, 0)).toEqual('13');
  expect(preciseRound(13, 2)).toEqual('13.00');
  expect(preciseRound(1.437, 2)).toEqual('1.44');
  expect(preciseRound(0.09999999999999987, 8)).toEqual('0.10000000');
});

it('dataUtils -> getRoundingDecimalFromStep', () => {
  expect(getRoundingDecimalFromStep(1)).toEqual(0);
  expect(getRoundingDecimalFromStep(0.01)).toEqual(2);
  expect(getRoundingDecimalFromStep(0.2)).toEqual(1);
  expect(getRoundingDecimalFromStep(0.001)).toEqual(3);
  expect(getRoundingDecimalFromStep(10)).toEqual(0);
  expect(getRoundingDecimalFromStep(0.5)).toEqual(1);
  expect(getRoundingDecimalFromStep(1.5)).toEqual(1);
});

it('dataUtils -> getRoundingDecimalFromStep', () => {
  expect(roundValToStep(0, 0.1, 0.11)).toEqual(0.1);
  expect(roundValToStep(0, 0.1, 0.1)).toEqual(0.1);
  expect(roundValToStep(1, 0.1, 1.16)).toEqual(1.2);
  expect(roundValToStep(1, 1, 1.6)).toEqual(2);
  expect(roundValToStep(1, 1, 1.32)).toEqual(1);
  expect(roundValToStep(1, 0.01, 1.435)).toEqual(1.44);
  expect(roundValToStep(1, 0.001, 1.4357)).toEqual(1.436);
  expect(roundValToStep(0, 0.2, 1.5)).toEqual(1.6);
  expect(roundValToStep(0, 0.5, 20.25)).toEqual(20.5);
  expect(roundValToStep(0.3, 0.3, 12.77)).toEqual(12.9);
  expect(roundValToStep(-13, 0.1, -10.77)).toEqual(-10.8);
  expect(roundValToStep(-30, 1, -14.5)).toEqual(-14);
});
