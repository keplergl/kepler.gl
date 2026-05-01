// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * Patch luma.gl 9's WEBGLRenderPipeline to tolerate mixed-sampler-type
 * validation errors in _getLinkStatus().
 *
 * WebGL2's validateProgram checks that sampler uniforms of different types
 * (sampler2D, usampler2D, isampler2D) are not assigned to the same texture
 * unit. Before any draw call the default texture unit for all samplers is 0,
 * so programs that mix sampler types (e.g. raster band data as usampler2D +
 * colormap as sampler2D) always fail validation even though the program linked
 * successfully and will work correctly once texture units are assigned at draw
 * time.
 *
 * luma.gl calls validateProgram inside _getLinkStatus() immediately after
 * linkProgram, before any texture units can be assigned. This patch keeps the
 * full validateProgram call but ignores only the known false-positive about
 * mixed sampler types. All other validation errors are still reported.
 */

// @ts-ignore WEBGLRenderPipeline resolution depends on moduleResolution setting
import {WEBGLRenderPipeline} from '@luma.gl/webgl';

const MIXED_SAMPLER_RE = /different type[s]? use the same sampler location/i;

let _patched = false;

export function patchPipelineValidation(): void {
  if (_patched) return;
  _patched = true;

  // @ts-ignore _getLinkStatus is an internal luma.gl API that may change between versions
  if (!WEBGLRenderPipeline?.prototype?._getLinkStatus) {
    return;
  }

  // @ts-ignore patching internal luma.gl method
  WEBGLRenderPipeline.prototype._getLinkStatus = function (
    this: WEBGLRenderPipeline & {linkStatus: string}
  ) {
    const {gl} = this.device;
    const linked = gl.getProgramParameter(this.handle, 0x8b82 /* LINK_STATUS */);
    if (!linked) {
      this.linkStatus = 'error';
      return 'link-error';
    }

    gl.validateProgram(this.handle);
    const validated = gl.getProgramParameter(this.handle, 0x8b83 /* VALIDATE_STATUS */);
    if (!validated) {
      const infoLog = gl.getProgramInfoLog(this.handle) || '';
      if (!MIXED_SAMPLER_RE.test(infoLog)) {
        this.linkStatus = 'error';
        return 'validation-error';
      }
    }

    this.linkStatus = 'success';
    return 'success';
  };
}
