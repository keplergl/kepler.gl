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

import {setParameters} from '@luma.gl/core';
import {LAYER_BLENDINGS} from 'constants/default-settings';
import GL from '@luma.gl/constants';

const getGlConst = d => GL[d];

export function setLayerBlending(gl, layerBlending) {
  const blending = LAYER_BLENDINGS[layerBlending];
  const {blendFunc, blendEquation} = blending;

  setParameters(gl, {
    [GL.BLEND]: true,
    ...(blendFunc
      ? {
          blendFunc: blendFunc.map(getGlConst),
          blendEquation: Array.isArray(blendEquation)
            ? blendEquation.map(getGlConst)
            : getGlConst(blendEquation)
        }
      : {})
  });
}
