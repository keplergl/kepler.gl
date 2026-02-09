// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {LAYER_BLENDINGS, GL} from '@kepler.gl/constants';

const getGlConst = d => GL[d];

export function setLayerBlending(gl, layerBlending) {
  const blending = LAYER_BLENDINGS[layerBlending];
  const {blendFunc, blendEquation} = blending;

  // In luma.gl 9.x, setParameters is no longer available
  // Use native WebGL calls instead
  if (gl) {
    gl.enable(GL.BLEND);
    if (blendFunc) {
      const srcRGB = getGlConst(blendFunc[0]);
      const dstRGB = getGlConst(blendFunc[1]);
      const srcAlpha = blendFunc.length > 2 ? getGlConst(blendFunc[2]) : srcRGB;
      const dstAlpha = blendFunc.length > 3 ? getGlConst(blendFunc[3]) : dstRGB;
      gl.blendFuncSeparate(srcRGB, dstRGB, srcAlpha, dstAlpha);

      if (blendEquation) {
        if (Array.isArray(blendEquation)) {
          gl.blendEquationSeparate(getGlConst(blendEquation[0]), getGlConst(blendEquation[1]));
        } else {
          gl.blendEquation(getGlConst(blendEquation));
        }
      }
    }
  }
}
