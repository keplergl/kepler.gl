// Copyright (c) 2018 Uber Technologies, Inc.
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
  mergeDomain
} from 'utils/domain-utils';
import {
  ALL_FIELD_TYPES
} from 'index';

test('DomainUtils -> mergeDomain', t => {
  const numericFieldTypes = [ALL_FIELD_TYPES.real, ALL_FIELD_TYPES.integer, ALL_FIELD_TYPES.timestamp];
  const numericDomainLarge = [1, 20];
  const numericDomainSmall = [3, 5];
  for (let i = 0; i < numericFieldTypes.length; i++) {
    t.is(
      mergeDomain(numericDomainLarge, numericDomainSmall, numericFieldTypes[i]),
      numericDomainLarge,
      `should return old domain if old domain includes new domain with field type ${numericFieldTypes[i]}`
    );

    t.deepEqual(
      mergeDomain(numericDomainSmall, numericDomainLarge, numericFieldTypes[i]),
      numericDomainLarge,
      `should return new domain if new domain includes old domain with field type ${numericFieldTypes[i]}`
    );

    t.deepEqual(
      mergeDomain([3, 30], [0, 20], numericFieldTypes[i]),
      [0, 30],
      `should return expand domain if new domain and old domain are overlapped with field type ${numericFieldTypes[i]}`
    );
  }

  const ordinalDomainTypes = [ALL_FIELD_TYPES.string, ALL_FIELD_TYPES.date];
  const ordinalDomainLarge = ['a', 'b'];
  const ordinalDomainSmall = ['b'];
  for (let i = 0; i < ordinalDomainTypes.length; i++) {
    t.is(
      mergeDomain(ordinalDomainLarge, ordinalDomainSmall, ordinalDomainTypes[i]),
      ordinalDomainLarge,
      `should return old domain if old domain includes new domain with field type ${ordinalDomainTypes[i]}`
    );

    t.deepEqual(
      mergeDomain(ordinalDomainSmall, ordinalDomainLarge, ordinalDomainTypes[i]),
      ordinalDomainLarge,
      `should return new domain if new domain includes old domain with field type ${ordinalDomainTypes[i]}`
    );

    t.deepEqual(
      mergeDomain(['a', 'b'], ['c', 'd'], ordinalDomainTypes[i]),
      ['a', 'b', 'c', 'd'],
      `should return expand domain if new domain and old domain are overlapped with field type ${ordinalDomainTypes[i]}`
    );
  }
  t.end();
});
