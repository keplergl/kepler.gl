// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// @ts-nocheck

import {log, UpdateParameters} from '@deck.gl/core';
import {SimpleMeshLayer, SimpleMeshLayerProps} from '@deck.gl/mesh-layers';
import {Geometry} from '@luma.gl/engine';
import {Model} from '@luma.gl/engine';

import {
  buildRasterMeshFragmentShader,
  buildRasterMeshVertexShader
} from './raster-mesh-layer-shaders';
import {
  ensureRasterHooksRegistered,
  prepareLumaModules
} from '../raster-layer/raster-layer-shaders';
import {loadImages} from '../images';
import type {RasterLayerAddedProps, ImageState} from '../types';
import {modulesEqual} from '../util';

type Mesh = SimpleMeshLayerProps['mesh'];

function validateGeometryAttributes(attributes) {
  log.assert(
    attributes.positions || attributes.POSITION,
    'RasterMeshLayer requires "postions" or "POSITION" attribute in mesh property.'
  );
}

/*
 * Convert mesh data into geometry
 * @returns geometry
 */
function getGeometry(data): Geometry {
  if (data.attributes) {
    validateGeometryAttributes(data.attributes);
    if (data instanceof Geometry) {
      return data;
    }
    return new Geometry(data);
  } else if (data.positions || data.POSITION) {
    validateGeometryAttributes(data);
    return new Geometry({
      attributes: data
    });
  }
  throw Error('Invalid mesh');
}

const defaultProps = {
  ...SimpleMeshLayer.defaultProps,
  modules: {type: 'array', value: [], compare: true},
  images: {type: 'object', value: {}, compare: true},
  moduleProps: {type: 'object', value: {}, compare: true},
  onRedrawNeeded: {type: 'function', value: null, compare: false}
};

export default class RasterMeshLayer extends SimpleMeshLayer<any, RasterLayerAddedProps> {
  declare state: SimpleMeshLayer<RasterLayerAddedProps>['state'] & {
    images: ImageState;
  };

  initializeState(): void {
    ensureRasterHooksRegistered();
    this.setState({images: {}});
    this._patchValidateProgram();
    super.initializeState();
  }

  _patchValidateProgram(): void {
    const gl = this.context.device?.gl;
    if (gl && !gl.__validateProgramPatched) {
      gl.__validateProgramPatched = true;
      const origGetProgramParameter = gl.getProgramParameter.bind(gl);
      gl.validateProgram = function () {
        // no op
      };
      gl.getProgramParameter = function (program: WebGLProgram, pname: number) {
        if (pname === 0x8b83) {
          return true;
        }
        return origGetProgramParameter(program, pname);
      };
    }
  }

  getShaders(): any {
    const {modules = []} = this.props;

    const lumaModules = prepareLumaModules(modules);
    const parentShaders = super.getShaders();

    return {
      ...parentShaders,
      vs: buildRasterMeshVertexShader(),
      fs: buildRasterMeshFragmentShader(),
      modules: [...(parentShaders.modules || []), ...lumaModules]
    };
  }

  // eslint-disable-next-line complexity
  updateState(params: UpdateParameters<SimpleMeshLayer<any, RasterLayerAddedProps>>): void {
    const {props, oldProps, changeFlags, context} = params;
    super.updateState({props, oldProps, changeFlags, context});

    const modules = props && props.modules;
    const oldModules = oldProps && oldProps.modules;

    if (
      props.mesh !== oldProps.mesh ||
      changeFlags.extensionsChanged ||
      !modulesEqual(modules, oldModules)
    ) {
      if (this.state.model) {
        this.state.model.destroy?.() || this.state.model.delete?.();
      }
      if (props.mesh) {
        this.state.model = this.getModel(props.mesh as Mesh);

        const attributes = (props.mesh as any).attributes || props.mesh;
        this.setState({
          hasNormals: Boolean(attributes.NORMAL || attributes.normals)
        });
      }
      this.getAttributeManager()?.invalidateAll();
    }

    if (props && props.images) {
      this.updateImages({props, oldProps});
    }

    if (this.state.model) {
      this.state.model.setTopology?.(this.props.wireframe ? 'line-strip' : 'triangle-list');
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

  draw(_opts): void {
    const {model, images} = this.state;
    const {moduleProps} = this.props;

    if (
      !model ||
      !images ||
      Object.keys(images).length === 0 ||
      !Object.values(images).every(item => item)
    ) {
      return;
    }

    // Set props for each custom module
    const allModuleProps = {...moduleProps, ...images};
    const modules = this.props.modules || [];
    for (const mod of modules) {
      if (mod.getUniforms) {
        const uniforms = mod.getUniforms(allModuleProps);
        if (uniforms) {
          const textureBindings: Record<string, any> = {};
          const scalarUniforms: Record<string, any> = {};
          for (const [key, value] of Object.entries(uniforms)) {
            if (value && typeof value === 'object' && !Array.isArray(value)) {
              textureBindings[key] = value;
            } else {
              scalarUniforms[key] = value;
            }
          }

          if (Object.keys(textureBindings).length > 0) {
            model.setBindings(textureBindings);
          }

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

    // Set mesh-specific uniforms via raw WebGL
    const gl = model.device?.gl;
    const program = model.pipeline?.handle;
    if (gl && program) {
      gl.useProgram(program);
      const opacityLoc = gl.getUniformLocation(program, 'meshOpacity');
      if (opacityLoc !== null) {
        gl.uniform1f(opacityLoc, this.props.opacity ?? 1);
      }
      const flatLoc = gl.getUniformLocation(program, 'meshFlatShading');
      if (flatLoc !== null) {
        gl.uniform1i(flatLoc, !this.state.hasNormals ? 1 : 0);
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
      if (this.context.deck) {
        this.context.deck._needsRedraw = 'RasterMeshLayer pipeline pending';
      }
      this.context.layerManager?.setNeedsRedraw('RasterMeshLayer pipeline pending');
      if (typeof this.props.onRedrawNeeded === 'function') {
        this.props.onRedrawNeeded();
      }
    });
  }

  _isIntUniform(mod: any, name: string): boolean {
    const fs = mod.fs2 || mod.fs || '';
    const regex = new RegExp(`uniform\\s+int\\s+${name}\\b`);
    return regex.test(fs);
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

  protected getModel(mesh: Mesh): Model {
    const device = this.context.device || this.context.gl;

    const model = new Model(
      device,
      Object.assign({}, this.getShaders(), {
        id: this.props.id,
        geometry: getGeometry(mesh),
        isInstanced: false
      })
    );

    return model;
  }
}

RasterMeshLayer.layerName = 'RasterMeshLayer';
RasterMeshLayer.defaultProps = defaultProps;
