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
import {patchPipelineValidation} from '../pipeline-validation-patch';
import {setStandaloneUniforms, collectIntUniforms} from '../standalone-uniforms';

patchPipelineValidation();

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
    super.initializeState();
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
            setStandaloneUniforms(model, scalarUniforms, collectIntUniforms(mod));
          }
        }
      }
    }

    // Set mesh-specific standalone uniforms
    setStandaloneUniforms(
      model,
      {
        meshOpacity: this.props.opacity ?? 1,
        meshFlatShading: !this.state.hasNormals ? 1 : 0
      },
      new Set(['meshFlatShading'])
    );

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
