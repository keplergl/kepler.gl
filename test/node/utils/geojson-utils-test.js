// Copyright (c) 2023 Uber Technologies, Inc.
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

import {ListVector} from 'apache-arrow';
import {parseGeometryFromArrow} from '@kepler.gl/layesr';

test('geojsonUtils.parseGeometryFromArrow', t => {
  const testArrowGeometry = ListVector.new([
    [
      [
        [4.924520108835094, 45.80404000200565],
        [4.918578945137262, 45.80935260092964],
        [4.946835385014492, 45.80941095853843],
        [4.924520108835094, 45.80404000200565]
      ]
    ]
  ]);
  const testArrowGeometryObject = {
    encoding: 'geoarrow.multipolygon',
    data: testArrowGeometry
  }
  const testFeature = parseGeometryFromArrow(testArrowGeometryObject);

  t.equal(testFeature.geometry.type, 'MultiPolygon', 'geometry type is MultiPolygon');
  t.end();
});
