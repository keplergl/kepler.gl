// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {setParameters} from '@luma.gl/core';
import {LAYER_BLENDINGS} from '@kepler.gl/constants';
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
