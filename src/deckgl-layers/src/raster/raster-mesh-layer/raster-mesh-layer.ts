// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {UpdateParameters} from '@deck.gl/core';
import {SimpleMeshLayer, SimpleMeshLayerProps} from '@deck.gl/mesh-layers';
import {Geometry} from '@luma.gl/engine';
import {Model} from '@luma.gl/engine';

import {
  buildRasterMeshFragmentShader,
  buildRasterMeshVertexShader,
  rasterMeshUniforms
} from './raster-mesh-layer-shaders';
import {
  ensureRasterHooksRegistered,
  prepareLumaModules
} from '../raster-layer/raster-layer-shaders';
import {loadImages} from '../images';
import type {RasterLayerAddedProps, ImageState} from '../types';
import {modulesEqual} from '../util';
import {patchPipelineValidation} from '../pipeline-validation-patch';

patchPipelineValidation();

type Mesh = SimpleMeshLayerProps['mesh'];

interface MeshData {
  attributes?: Record<string, unknown>;
  positions?: unknown;
  POSITION?: unknown;
  NORMAL?: unknown;
  normals?: unknown;
  [key: string]: unknown;
}

function validateGeometryAttributes(attributes: Record<string, unknown>) {
  if (!(attributes.positions || attributes.POSITION)) {
    throw new Error(
      'RasterMeshLayer requires "positions" or "POSITION" attribute in mesh property.'
    );
  }
}

/*
 * Convert mesh data into geometry
 * @returns geometry
 */
function getGeometry(data: MeshData | Geometry): Geometry {
  if ('attributes' in data && data.attributes) {
    validateGeometryAttributes(data.attributes);
    if (data instanceof Geometry) {
      return data;
    }
    return new Geometry(data as ConstructorParameters<typeof Geometry>[0]);
  } else if ('positions' in data || 'POSITION' in data) {
    validateGeometryAttributes(data as Record<string, unknown>);
    return new Geometry({
      attributes: data as Record<string, unknown>
    } as ConstructorParameters<typeof Geometry>[0]);
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

  _redrawScheduled = false;

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
      modules: [...(parentShaders.modules || []), rasterMeshUniforms, ...lumaModules]
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
        this.state.model.destroy?.();
      }
      if (props.mesh) {
        this.state.model = this.getModel(props.mesh as Mesh);

        const attributes = ((props.mesh as MeshData).attributes || props.mesh) as MeshData;
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

  draw(_opts: Record<string, unknown>): void {
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

    // Set mesh-specific UBO uniforms
    model.shaderInputs.setProps({
      rasterMesh: {
        meshOpacity: this.props.opacity ?? 1,
        meshFlatShading: !this.state.hasNormals ? 1.0 : 0.0
      }
    });

    // Set props for each custom module through shaderInputs.
    // Call getUniforms ourselves to skip inactive modules (null return),
    // avoiding the ShaderInputs null-fallback that would dump all textures
    // into bindings every frame.
    const allModuleProps = {...moduleProps, ...images};
    const modules = this.props.modules || [];
    for (const mod of modules) {
      if (mod.getUniforms) {
        const result = mod.getUniforms(allModuleProps);
        if (result) {
          model.shaderInputs.setProps({[mod.name]: result});
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
      if (this.context.deck) {
        // @ts-expect-error accessing private deck.gl property
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
        geometry: getGeometry(mesh as MeshData | Geometry),
        isInstanced: false
      })
    );

    return model;
  }
}

RasterMeshLayer.layerName = 'RasterMeshLayer';
RasterMeshLayer.defaultProps = defaultProps;
