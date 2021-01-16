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

import {RenderStates, RenderTypes} from 'react-map-gl-draw';
import get from 'lodash.get';
import {COLORS} from './constants';

export const DEFAULT_RADIUS = 5;
export const DEFAULT_STATE_STYLE_STROKE = COLORS.PRIMARY;

export const STATE_STYLES_STROKE = {
  [RenderStates.INACTIVE]: '#26B5F2',
  [RenderStates.UNCOMMITTED]: '#a9a9a9',
  [RenderStates.CLOSING]: '#a9a9a9',
  [RenderStates.SELECTED]: '#26B5F2',
  [RenderStates.HOVERED]: '#26B5F2'
};

export const DEFAULT_STATE_STYLE_FILL = '#000';

export const STATE_STYLES_FILL = {
  [RenderStates.INACTIVE]: '#333333',
  [RenderStates.HOVERED]: '#7ac943',
  [RenderStates.SELECTED]: '#ffff00',
  [RenderStates.UNCOMMITTED]: '#a9a9a9',
  [RenderStates.CLOSING]: '#a9a9a9'
};

export const DEFAULT_STATE_STYLE_OPACITY = 0.1;

export const STATE_STYLES_STROKE_WIDTH = 2;

export const DEFAULT_STROKE_DASH_ARRAY = '4,2';

export const RENDER_TYPE_STYLES = {
  [RenderTypes.POINT]: () => ({r: DEFAULT_RADIUS}),
  [RenderTypes.LINE_STRING]: () => ({fill: 'none'})
};

export function noOp() {}

export function getStyle({feature, state}) {
  const isVisible = get(feature, ['properties', 'isVisible'], true);
  const style = {
    stroke: STATE_STYLES_STROKE[state] || DEFAULT_STATE_STYLE_STROKE,
    strokeWidth: isVisible ? STATE_STYLES_STROKE_WIDTH : 0,
    fill: STATE_STYLES_FILL[state] || DEFAULT_STATE_STYLE_FILL,
    fillOpacity: DEFAULT_STATE_STYLE_OPACITY,
    ...(state !== RenderStates.SELECTED ? {strokeDasharray: DEFAULT_STROKE_DASH_ARRAY} : null)
  };

  const renderType = feature.properties ? feature.properties.renderType : feature.renderType;

  return {
    ...style,
    ...(RENDER_TYPE_STYLES[renderType] || noOp)()
  };
}
