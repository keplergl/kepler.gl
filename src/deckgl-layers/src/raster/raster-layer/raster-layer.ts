// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// @ts-nocheck

import {UpdateParameters} from '@deck.gl/core';
import {BitmapLayer} from '@deck.gl/layers';

import {
  buildRasterFragmentShader,
  buildRasterVertexShader,
  rasterUniforms,
  ensureRasterHooksRegistered,
  prepareLumaModules
} from './raster-layer-shaders';
import {loadImages} from '../images';
import type {RasterLayerAddedProps, ImageState} from '../types';
import {modulesEqual} from '../util';

const defaultProps = {
  ...BitmapLayer.defaultProps,
  modules: {type: 'array', value: [], compare: true},
  images: {type: 'object', value: {}, compare: true},
  moduleProps: {type: 'object', value: {}, compare: true},
  onRedrawNeeded: {type: 'function', value: null, compare: false}
};

export default class RasterLayer extends BitmapLayer<RasterLayerAddedProps> {
  declare state: BitmapLayer<RasterLayerAddedProps>['state'] & {
    images: ImageState;
  };

  initializeState(): void {
    ensureRasterHooksRegistered();
    this.setState({images: {}});
    this._patchValidateProgram();
    super.initializeState();
  }

  /**
   * Skip gl.validateProgram for this WebGL context.
   * WebGL2 validateProgram fails with "Two textures of different types use the
   * same sampler location" when sampler2D and usampler2D uniforms both default
   * to texture unit 0 before any bindings are set. This is a false positive —
   * proper texture units are assigned at draw time. Link errors and shader
   * compilation errors are still caught without validateProgram.
   */
  _patchValidateProgram(): void {
    const gl = this.context.device?.gl;
    if (gl && !gl.__validateProgramPatched) {
      gl.__validateProgramPatched = true;
      const origGetProgramParameter = gl.getProgramParameter.bind(gl);
      gl.validateProgram = function () {};
      gl.getProgramParameter = function (program: WebGLProgram, pname: number) {
        if (pname === 0x8b83) {
          // GL_VALIDATE_STATUS — always return true since we skip validation
          return true;
        }
        return origGetProgramParameter(program, pname);
      };
    }
  }

  draw(opts: {shaderModuleProps: any}): void {
    const {model, images, coordinateConversion, bounds} = this.state;
    const {desaturate, transparentColor, tintColor, moduleProps} = this.props;

    if (
      !model ||
      !images ||
      Object.keys(images).length === 0 ||
      !Object.values(images).every(item => item)
    ) {
      return;
    }

    // Set UBO uniforms for the raster module
    model.shaderInputs.setProps({
      raster: {
        desaturate: desaturate || 0,
        transparentColor: (transparentColor || [0, 0, 0, 0]).map(x => (x ? x / 255 : 0)),
        tintColor: (tintColor || [255, 255, 255]).slice(0, 3).map(x => x / 255),
        coordinateConversion: coordinateConversion || 0,
        bounds: bounds || [0, 0, 0, 0],
        opacity: this.props.opacity ?? 1
      }
    });

    // Set props for each custom module through shaderInputs.
    // This routes textures to bindings and scalar values to module uniforms.
    const allModuleProps = {...moduleProps, ...images};
    const modules = this.props.modules || [];
    for (const mod of modules) {
      if (mod.getUniforms) {
        const uniforms = mod.getUniforms(allModuleProps);
        if (uniforms) {
          // Route texture bindings through shaderInputs
          const textureBindings: Record<string, any> = {};
          const scalarUniforms: Record<string, any> = {};
          for (const [key, value] of Object.entries(uniforms)) {
            if (value && typeof value === 'object' && !Array.isArray(value)) {
              textureBindings[key] = value;
            } else {
              scalarUniforms[key] = value;
            }
          }

          // Set texture bindings through model.setBindings so they go through the pipeline
          if (Object.keys(textureBindings).length > 0) {
            model.setBindings(textureBindings);
          }

          // Set standalone scalar uniforms via raw WebGL
          // (luma.gl 9 doesn't support standalone uniforms outside of UBOs)
          if (Object.keys(scalarUniforms).length > 0) {
            const gl = model.device?.gl;
            const program = model.pipeline?.handle;
            if (gl && program) {
              gl.useProgram(program);
              for (const [name, value] of Object.entries(scalarUniforms)) {
                const loc = gl.getUniformLocation(program, name);
                if (loc !== null) {
                  if (typeof value === 'number') {
                    if (Number.isInteger(value) && this._isIntUniform(mod, name)) {
                      gl.uniform1i(loc, value);
                    } else {
                      gl.uniform1f(loc, value);
                    }
                  } else if (Array.isArray(value)) {
                    if (value.length === 2) gl.uniform2fv(loc, value);
                    else if (value.length === 3) gl.uniform3fv(loc, value);
                    else if (value.length === 4) gl.uniform4fv(loc, value);
                    else if (value.length === 16) gl.uniformMatrix4fv(loc, false, value);
                  }
                }
              }
            }
          }
        }
      }
    }

    const drawSuccess = model.draw(this.context.renderPass);
    if (!drawSuccess) {
      this._scheduleRedraw();
    }
  }

  _scheduleRedraw(): void {
    if (this._redrawScheduled) return;
    this._redrawScheduled = true;
    requestAnimationFrame(() => {
      this._redrawScheduled = false;
      // Try deck-level redraw first (works with @deck.gl/react's _customRender)
      if (this.context.deck) {
        this.context.deck._needsRedraw = 'RasterLayer pipeline pending';
      }
      this.context.layerManager?.setNeedsRedraw('RasterLayer pipeline pending');
      if (typeof this.props.onRedrawNeeded === 'function') {
        this.props.onRedrawNeeded();
      }
    });
  }

  /**
   * Check if a uniform is declared as int in the module's shader source.
   */
  _isIntUniform(mod: any, name: string): boolean {
    const fs = mod.fs2 || mod.fs || '';
    const regex = new RegExp(`uniform\\s+int\\s+${name}\\b`);
    return regex.test(fs);
  }

  getShaders(): any {
    const {modules = []} = this.props;

    const lumaModules = prepareLumaModules(modules);
    const parentShaders = super.getShaders();

    return {
      ...parentShaders,
      vs: buildRasterVertexShader(),
      fs: buildRasterFragmentShader(),
      modules: [...(parentShaders.modules || []), rasterUniforms, ...lumaModules]
    };
  }

  // eslint-disable-next-line complexity
  updateState(params: UpdateParameters<BitmapLayer<RasterLayerAddedProps>>): void {
    const {props, oldProps, changeFlags} = params;
    const modules = props && props.modules;
    const oldModules = oldProps && oldProps.modules;

    if (changeFlags.extensionsChanged || !modulesEqual(modules, oldModules)) {
      this.state.model?.delete?.() || this.state.model?.destroy?.();
      this.state.model = this._getModel(this.context.device || this.context.gl);
      this.getAttributeManager()?.invalidateAll();
    }

    if (props && props.images) {
      this.updateImages({props, oldProps});
    }

    const attributeManager = this.getAttributeManager();

    if (props.bounds !== oldProps.bounds) {
      const oldMesh = this.state.mesh;
      const mesh = this._createMesh();
      this.state.model?.setVertexCount(mesh.vertexCount);
      for (const key in mesh) {
        if (oldMesh && oldMesh[key] !== mesh[key]) {
          attributeManager?.invalidate(key);
        }
      }
      this.setState({mesh, ...this._getCoordinateUniforms()});
    } else if (props._imageCoordinateSystem !== oldProps._imageCoordinateSystem) {
      this.setState(this._getCoordinateUniforms());
    }
  }

  updateImages({
    props,
    oldProps
  }: {
    props: RasterLayerAddedProps;
    oldProps: RasterLayerAddedProps;
  }): void {
    const {images} = this.state;
    const device = this.context.device;
    const gl = device?.gl || this.context.gl;

    const newImages = loadImages({
      gl,
      device,
      images,
      imagesData: props.images,
      oldImagesData: oldProps.images
    });
    if (newImages) {
      this.setState({images: newImages});
    }
  }

  finalizeState(): void {
    super.finalizeState(this.context);

    if (this.state.images) {
      for (const image of Object.values(this.state.images)) {
        if (Array.isArray(image)) {
          image.map(x => x && (x.destroy ? x.destroy() : x.delete?.()));
        } else if (image) {
          image.destroy ? image.destroy() : image.delete?.();
        }
      }
    }
  }
}

RasterLayer.defaultProps = defaultProps;
RasterLayer.layerName = 'RasterLayer';
