// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

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
import {patchPipelineValidation} from '../pipeline-validation-patch';

patchPipelineValidation();

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

  _redrawScheduled = false;

  initializeState(): void {
    ensureRasterHooksRegistered();
    this.setState({images: {}});
    super.initializeState();
  }

  draw(_opts: {shaderModuleProps: Record<string, unknown>}): void {
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
    // We call getUniforms ourselves to skip modules that return null (inactive).
    // Passing allModuleProps directly to setProps would cause the null-fallback
    // in ShaderInputs to treat the entire props bag as uniforms/bindings,
    // triggering expensive texture rebinding every frame.
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
        this.context.deck._needsRedraw = 'RasterLayer pipeline pending';
      }
      this.context.layerManager?.setNeedsRedraw('RasterLayer pipeline pending');
      if (typeof this.props.onRedrawNeeded === 'function') {
        this.props.onRedrawNeeded();
      }
    });
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
      this.state.model?.destroy?.();
      // @ts-expect-error _getModel is internal to BitmapLayer
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
