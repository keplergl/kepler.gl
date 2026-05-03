// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * Patch luma.gl 9's pipeline validation to tolerate mixed-sampler-type
 * validation errors in _getLinkStatus().
 *
 * WebGL2's validateProgram checks that sampler uniforms of different types
 * (sampler2D, usampler2D, isampler2D) are not assigned to the same texture
 * unit. Programs that mix sampler types (e.g. raster band data as usampler2D +
 * shadow maps as sampler2D) may fail validation even though they linked
 * successfully and work correctly once texture units are assigned at draw time.
 *
 * In luma.gl ≥9.3 the _getLinkStatus method moved from WEBGLRenderPipeline to
 * WEBGLSharedRenderPipeline and now calls _initializeSamplerUniforms() before
 * validateProgram, which fixes most false positives. However, some WebGL
 * drivers still report errors even with unique units, so we keep suppressing
 * the known false-positive about mixed sampler types. We patch _getLinkStatus
 * on whichever pipeline class owns it.
 */

// @ts-ignore resolution depends on moduleResolution setting
import {WEBGLRenderPipeline, WebGLDevice} from '@luma.gl/webgl';

const MIXED_SAMPLER_RE = /different type[s]? use the same sampler location/i;

let _patched = false;

function createPatchedLinkStatus(_original: (...args: unknown[]) => unknown) {
  return function _patchedGetLinkStatus(this: any) {
    const {gl} = this.device;
    const linked = gl.getProgramParameter(this.handle, 0x8b82 /* LINK_STATUS */);
    if (!linked) {
      this.linkStatus = 'error';
      return 'link-error';
    }

    // luma.gl ≥9.3 assigns unique texture units to samplers before
    // validation via _initializeSamplerUniforms. Call it here so that
    // the sampler-to-unit mapping is populated through our patched path.
    if (typeof this._initializeSamplerUniforms === 'function') {
      this._initializeSamplerUniforms();
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

export function patchPipelineValidation(): void {
  if (_patched) return;
  _patched = true;

  // Strategy 1: luma.gl <9.3 — _getLinkStatus on WEBGLRenderPipeline
  if (
    WEBGLRenderPipeline?.prototype &&
    typeof (WEBGLRenderPipeline.prototype as any)._getLinkStatus === 'function'
  ) {
    const original = (WEBGLRenderPipeline.prototype as any)._getLinkStatus;
    (WEBGLRenderPipeline.prototype as any)._getLinkStatus = createPatchedLinkStatus(original);
    return;
  }

  // Strategy 2: luma.gl ≥9.3 — _getLinkStatus moved to WEBGLSharedRenderPipeline.
  // That class is not publicly exported, so we hook the factory on WebGLDevice
  // that creates shared pipelines. The first invocation discovers the class,
  // patches its prototype, then re-validates the instance.
  const deviceProto = WebGLDevice?.prototype as any;
  const origFactory = deviceProto?._createSharedRenderPipelineWebGL;
  if (typeof origFactory !== 'function') return;

  let sharedClassPatched = false;

  deviceProto._createSharedRenderPipelineWebGL = function (this: any, ...args: any[]) {
    if (!sharedClassPatched) {
      sharedClassPatched = true;

      const instance = origFactory.apply(this, args);
      const SharedCtor = Object.getPrototypeOf(instance).constructor;

      if (
        SharedCtor &&
        SharedCtor !== WEBGLRenderPipeline &&
        typeof SharedCtor.prototype._getLinkStatus === 'function'
      ) {
        const original = SharedCtor.prototype._getLinkStatus;
        SharedCtor.prototype._getLinkStatus = createPatchedLinkStatus(original);

        // Re-validate this first instance since its _getLinkStatus already ran
        // with the unpatched version during construction.
        if (instance.linkStatus === 'error') {
          instance._getLinkStatus();
        }
      }

      // Restore original factory — future instances will use the patched prototype
      deviceProto._createSharedRenderPipelineWebGL = origFactory;
      return instance;
    }
    return origFactory.apply(this, args);
  };
}
