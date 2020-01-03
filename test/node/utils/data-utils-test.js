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

import {
  getRoundingDecimalFromStep,
  preciseRound,
  roundValToStep
} from 'utils/data-utils';

test('dataUtils -> preciseRound', t => {

  t.equal(preciseRound(1.234, 2), '1.23', 'should round 1.234 correctly');
  t.equal(preciseRound(13.234, 0), '13', 'should round 13.234 correctly');
  t.equal(preciseRound(13, 2), '13.00', 'should round 13 correctly');
  t.equal(preciseRound(1.437, 2), '1.44', 'should round 1.437 correctly');
  t.equal(preciseRound(0.09999999999999987, 8), '0.10000000',
    'should round 0.10000000 correctly');
  t.end();
});

test('dataUtils -> getRoundingDecimalFromStep', t => {

  t.equal(getRoundingDecimalFromStep(1), 0, 'decimal of step=int should be 0');
  t.equal(getRoundingDecimalFromStep(0.1), 1,
    'decimal of step=0.1 should be 1');
  t.equal(getRoundingDecimalFromStep(0.01), 2,
    'decimal of step=0.01 should be 2');
  t.equal(getRoundingDecimalFromStep(0.2), 1,
    'decimal of step=0.2 should be 1');
  t.equal(getRoundingDecimalFromStep(0.001), 3,
    'decimal of step=0.001 should be 3');
  t.equal(getRoundingDecimalFromStep(10), 0,
    'decimal of step=10 should be 0');
  t.equal(getRoundingDecimalFromStep(0.5), 1,
    'decimal of step=0.5 should be 0');
  t.equal(getRoundingDecimalFromStep(1.5), 1,
    'decimal of step=1.5 should be 1');
  t.end();

});

test('dataUtils -> getRoundingDecimalFromStep', t => {

  t.equal(roundValToStep(0, 0.1, 0.11), 0.1, 'should round 0.11 to 0.1');
  t.equal(roundValToStep(0, 0.1, 0.1), 0.1, 'should round 0.1 to 0.1');
  t.equal(roundValToStep(1, 0.1, 1.16), 1.2, 'should round 1.16 to 1.2');
  t.equal(roundValToStep(1, 1, 1.6), 2, 'should round 1.6 to 2');
  t.equal(roundValToStep(1, 1, 1.32), 1, 'should round 1.32 to 1');
  t.equal(roundValToStep(1, 0.01, 1.435), 1.44, 'should round 1.435 to 1.44');
  t.equal(roundValToStep(1, 0.001, 1.4357), 1.436,
    'should round 1.4357 to 1.436');
  t.equal(roundValToStep(0, 0.2, 1.5), 1.6, 'should round 1.5 to 1.6');
  t.equal(roundValToStep(0, 0.5, 20.25), 20.5, 'should round 20.25 to 20.5');
  t.equal(roundValToStep(0.3, 0.3, 12.77), 12.9, 'should round 12.77 to 12.9');
  t.equal(roundValToStep(-13, 0.1, -10.77), -10.8,
    'should round -10.77 to -10.8');
  t.equal(roundValToStep(-30, 1, -14.5), -14,
    'should round -14.5 to -14');
  t.end();

});
