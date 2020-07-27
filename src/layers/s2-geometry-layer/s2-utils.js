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

import Long from 'long';
import {S2} from 's2-geometry';

const MAXIMUM_TOKEN_LENGTH = 16;

/**
 * Retrieve S2 geometry center
 * @param s2Token string | number
 * @return {*[]}
 */
export function getS2Center(s2Token) {
  const paddedToken = s2Token.toString().padEnd(MAXIMUM_TOKEN_LENGTH, '0');
  const s2Id = Long.fromString(paddedToken, MAXIMUM_TOKEN_LENGTH);
  const {lat, lng} = S2.idToLatLng(s2Id.toString());
  return [lng, lat];
}
