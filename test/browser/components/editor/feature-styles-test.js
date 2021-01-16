// Copyright (c) 2021 Uber Technologies, Inc.
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
import {RenderStates, RenderTypes} from 'react-map-gl-draw';
import {getStyle} from 'components/editor/feature-styles';

test('FeatureStyles - getStyles point', t => {
  const feature = {
    properties: {
      isVisible: true,
      renderType: RenderTypes.POINT
    }
  };

  t.deepEqual(
    getStyle({feature, state: RenderStates.INACTIVE}),
    {
      stroke: '#26B5F2',
      strokeWidth: 2,
      fill: '#333333',
      fillOpacity: 0.1,
      strokeDasharray: '4,2',
      r: 5
    },
    'Should display point feature correctly'
  );

  t.deepEqual(
    getStyle({
      feature: {
        ...feature,
        properties: {
          ...feature.properties,
          isVisible: false
        }
      },
      state: RenderStates.INACTIVE
    }),
    {
      stroke: '#26B5F2',
      strokeWidth: 0,
      fill: '#333333',
      fillOpacity: 0.1,
      strokeDasharray: '4,2',
      r: 5
    },
    'Should display point feature correctly with strokeWidth = 0'
  );
  t.end();
});

test('FeatureStyles - getStyles line-string', t => {
  const feature = {
    properties: {
      isVisible: true,
      renderType: RenderTypes.LINE_STRING
    }
  };

  t.deepEqual(
    getStyle({feature, state: RenderStates.INACTIVE}),
    {
      stroke: '#26B5F2',
      strokeWidth: 2,
      fill: 'none',
      fillOpacity: 0.1,
      strokeDasharray: '4,2'
    },
    'Should display point feature correctly'
  );

  t.deepEqual(
    getStyle({
      feature: {
        ...feature,
        properties: {
          ...feature.properties,
          isVisible: false
        }
      },
      state: RenderStates.INACTIVE
    }),
    {
      stroke: '#26B5F2',
      strokeWidth: 0,
      fill: 'none',
      fillOpacity: 0.1,
      strokeDasharray: '4,2'
    },
    'Should display point feature correctly with strokeWidth = 0'
  );
  t.end();
});
