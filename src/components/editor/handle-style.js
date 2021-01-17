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
import {COLORS} from './constants';
import get from 'lodash.get';

const DEFAULT_EDIT_HANDLE_SHAPE = 'circle';

const rectStyle = {
  x: -6,
  y: -6,
  height: 12,
  width: 12
};

export const DEFAULT_STATE_STYLE_STROKE = COLORS.PRIMARY;

export const STATE_STYLES_STROKE = {
  [RenderStates.SELECTED]: COLORS.PRIMARY,
  [RenderStates.HOVERED]: COLORS.SECONDARY
};

export const DEFAULT_STATE_STYLE_FILL = '#ffffff';

export const STATE_STYLES_FILL = {
  [RenderStates.SELECTED]: COLORS.SECONDARY,
  [RenderStates.HOVERED]: COLORS.SECONDARY,
  [RenderStates.INACTIVE]: COLORS.PRIMARY,
  [RenderStates.UNCOMMITTED]: COLORS.PRIMARY
};

const STATE_STYLES_STROKE_WIDTH = 1;

export const RENDER_TYPE_STYLES = {
  [RenderTypes.POINT]: state => ({
    fill: STATE_STYLES_FILL[state],
    stroke: state === RenderStates.SELECTED ? COLORS.PRIMARY : DEFAULT_STATE_STYLE_STROKE
  }),
  [RenderTypes.LINE_STRING]: () => rectStyle,
  [RenderTypes.RECTANGLE]: () => rectStyle,
  [RenderTypes.POLYGON]: () => rectStyle
};

export const DEFAULT_STATE_STYLE_OPACITY = 0;

export const DEFAULT_RADIUS = 5;

function noOp() {}

export function getStyle({feature, state}) {
  const isVisible = get(feature, ['properties', 'isVisible'], true);

  const style = {
    stroke: STATE_STYLES_STROKE[state] || DEFAULT_STATE_STYLE_STROKE,
    strokeWidth: isVisible ? STATE_STYLES_STROKE_WIDTH : 0,
    fill: DEFAULT_STATE_STYLE_FILL,
    fillOpacity: DEFAULT_STATE_STYLE_OPACITY,
    r: DEFAULT_RADIUS
  };

  const renderType = feature.properties ? feature.properties.renderType : feature.renderType;

  return {
    ...style,
    ...(RENDER_TYPE_STYLES[renderType] || noOp)(state)
  };
}

export function getEditHandleShape() {
  return DEFAULT_EDIT_HANDLE_SHAPE;
}
