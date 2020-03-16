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
import {getFileType, isKeplerGlMap} from 'processors/file-handler';

test('#file-handler -> getFileType', t => {
  t.equal(getFileType('filename.csv'), 'csv');

  t.equal(getFileType('filename.json'), 'json');

  t.equal(getFileType('filename.json.csv'), 'csv');

  t.equal(getFileType('filename.geojson'), 'json');

  t.equal(getFileType('filename.excel'), 'other');

  t.end();
});

test('#file-handler -> isKeplerGlMap', t => {
  t.equal(
    isKeplerGlMap('{datasets: [], info: {app: "kepler.gl"}, config: {}}'),
    false,
    'Should return false when passing a json string'
  );

  t.equal(
    isKeplerGlMap({datasets: [], info: {app: 'kepler.gl'}, config: {}}),
    true,
    'Should return true when object is a kepler map'
  );

  t.equal(
    isKeplerGlMap({datasets: [], info: {app: 'kepler.gl'}}),
    false,
    'Should return false when object is not a kepler map'
  );

  t.end();
});
