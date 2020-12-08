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

function isLat(num) {
  return Number.isFinite(num) && num <= 90 && num >= -90;
}
function isLng(num) {
  return Number.isFinite(num) && num <= 180 && num >= -180;
}

/**
 * bounds should be [minLng, minLat, maxLng, maxLat]
 * @param {*} bounds
 */
export function validateBounds(bounds) {
  // array: [ -180, -85.05112877980659, 180, 85.0511287798066 ]
  // validate bounds
  if (
    Array.isArray(bounds) &&
    bounds.length === 4 &&
    [bounds[0], bounds[2]].every(isLng) &&
    [bounds[1], bounds[3]].every(isLat)
  ) {
    return bounds;
  }
  return null;
}
