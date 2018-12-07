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

import {
  ALL_FIELD_TYPES
} from "constants";
import {
  unique,
  notNullorUndefined
} from "utils/data-utils";

export function mergeDomain(oldDomain, newDomain, fieldType) {
  switch (fieldType) {
    case ALL_FIELD_TYPES.real:
    case ALL_FIELD_TYPES.integer:
    case ALL_FIELD_TYPES.timestamp:
      return mergeNumericFieldDomain(oldDomain, newDomain);
    case ALL_FIELD_TYPES.boolean:
      return oldDomain;
    case ALL_FIELD_TYPES.string:
    case ALL_FIELD_TYPES.date:
    default:
      return mergeOrdinalFieldDomain(oldDomain, newDomain);
  }
}

function mergeNumericFieldDomain(oldDomain, newDomain) {
  // Only return new object if domain needs to be changed, so we don't 
  // unnecessarily rerender layers. 
  const [oldMin, oldMax] = oldDomain;
  const [newMin, newMax] = newDomain;
  if (newMin >= oldMin && newMax <= oldMax) {
    return oldDomain;
  }
  return [Math.min(oldMin, newMin), Math.max(oldMax, newMax)];
}

function mergeOrdinalFieldDomain(oldDomain, newDomain) {
  const mergedDomain = unique(oldDomain.concat(newDomain)).filter(notNullorUndefined);
  if (mergedDomain.length === oldDomain.length) {
    return oldDomain;
  }
  return mergedDomain.sort();
}
