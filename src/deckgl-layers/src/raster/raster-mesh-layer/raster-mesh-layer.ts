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
import {modulesEqual, applyModuleUniforms} from '../util';
import {patchPipelineValidation} from '../pipeline-validation-patch';
import {rasterProcessingUniforms} from '../raster-processing-uniforms';
import {TOPOLOGY} from '@kepler.gl/constants';

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
  _pendingImageRetry: RasterLayerAddedProps['images'] | null = null;
  /** How many consecutive frames have retried a failed texture upload. */
  _imageRetryCount = 0;
  static readonly MAX_IMAGE_RETRY_ATTEMPTS = 3;

  initializeState(): void {
    patchPipelineValidation();
    ensureRasterHooksRegistered();
    this.setState({images: {}});
    super.initializeState();
  }

  getShaders(): any {
    const {modules = []} = this.props;

    const lumaModules = prepareLumaModules(modules);
    const parentShaders = super.getShaders();

    // Filter out simpleMeshUniforms from parent — RasterMeshLayer uses its own
    // shaders that don't reference SimpleMesh uniforms, and every UBO counts
    // against the WebGL2 GL_MAX_FRAGMENT_UNIFORM_BUFFERS limit (typically 12).
    const parentModules = (parentShaders.modules || []).filter(
      (m: {name?: string}) => m.name !== 'simpleMesh'
    );

    return {
      ...parentShaders,
      vs: buildRasterMeshVertexShader(),
      fs: buildRasterMeshFragmentShader(),
      modules: [...parentModules, rasterMeshUniforms, rasterProcessingUniforms, ...lumaModules]
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
      this.state.model.setTopology?.(
        this.props.wireframe ? TOPOLOGY.LINE_STRIP : TOPOLOGY.TRIANGLE_LIST
      );
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

    const {images: newImages, hasPendingUploads} = loadImages({
      gl,
      device,
      images,
      imagesData: props.images,
      oldImagesData: oldProps.images
    });

    if (newImages) {
      this.setState({images: newImages});
    }
    // If any texture upload failed, stash the imagesData and schedule a retry
    // next frame. The retry passes oldImagesData: {} so all keys bypass the
    // isEqual skip-check.
    if (hasPendingUploads) {
      this._pendingImageRetry = props.images;
      this._imageRetryCount = 0;
      this._scheduleRedraw();
    }
  }

  draw(_opts: Record<string, unknown>): void {
    // If a previous frame had failed texture uploads, retry them now before
    // checking whether the images state is complete. Pass oldImagesData: {} so
    // all keys are treated as new and bypass the isEqual skip-check.
    // Retries are bounded to MAX_IMAGE_RETRY_ATTEMPTS to avoid an infinite
    // redraw loop when image data is permanently invalid.
    if (this._pendingImageRetry) {
      const retry = this._pendingImageRetry;
      this._pendingImageRetry = null;
      const {images: newImages, hasPendingUploads} = loadImages({
        gl: this.context.device?.gl || this.context.gl,
        device: this.context.device,
        images: this.state.images,
        imagesData: retry,
        oldImagesData: {}
      });
      if (newImages) {
        this.setState({images: newImages});
      }
      if (hasPendingUploads) {
        this._imageRetryCount++;
        if (this._imageRetryCount < RasterMeshLayer.MAX_IMAGE_RETRY_ATTEMPTS) {
          this._pendingImageRetry = retry;
          this._scheduleRedraw();
        } else {
          console.warn(
            `RasterMeshLayer: texture upload failed after ${RasterMeshLayer.MAX_IMAGE_RETRY_ATTEMPTS} attempts, giving up.`
          );
          this._imageRetryCount = 0;
        }
      } else {
        this._imageRetryCount = 0;
      }
    }

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

    // Apply each custom module's uniforms/bindings to shaderInputs directly.
    // We call getUniforms once per module and write the results into
    // shaderInputs.moduleUniforms/moduleBindings, bypassing setProps() which
    // would call getUniforms a second time on already-transformed values.
    const allModuleProps = {...moduleProps, ...images};
    const modules = this.props.modules || [];
    applyModuleUniforms(model.shaderInputs, modules, allModuleProps);

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
