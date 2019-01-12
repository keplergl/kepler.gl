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

import {MAP_URI} from '../constants/default-settings';

export function parseQueryString(query) {
  const searchParams = new URLSearchParams(query);
  const params = {};
  for (const p of searchParams) {
    if (p && p.length === 2 && p[0])
    params[p[0]] = p[1]
  }

  return params;
}

/**
 * Returns a permalink with the given map url: kepler.gl/[]
 * @param mapLink the cloud-providers url used to store the map
 * @returns {string}
 */
export function getMapPermalink(mapLink) {
  return `${window.location.protocol}//${window.location.host}/${MAP_URI}${mapLink}`
}
