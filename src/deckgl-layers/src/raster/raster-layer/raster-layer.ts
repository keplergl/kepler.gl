// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// @ts-nocheck - Raster layer uses luma.gl internal APIs that changed significantly in 9.x
// The ProgramManager and shader hook system is removed in luma.gl 9.x.
// TODO: Refactor to use luma.gl 9.x shader module system when raster layer is actively maintained.

import {project32, UpdateParameters} from '@deck.gl/core';
import {BitmapLayer} from '@deck.gl/layers';

import fsWebGL2 from './raster-layer-webgl2.fs';
import vsWebGL2 from './raster-layer-webgl2.vs';
import {loadImages} from '../images';
import type {RasterLayerAddedProps, ImageState} from '../types';
import {modulesEqual} from '../util';

const defaultProps = {
  ...BitmapLayer.defaultProps,
  modules: {type: 'array', value: [], compare: true},
  images: {type: 'object', value: {}, compare: true},
  moduleProps: {type: 'object', value: {}, compare: true}
};

export default class RasterLayer extends BitmapLayer<RasterLayerAddedProps> {
  declare state: BitmapLayer<RasterLayerAddedProps>['state'] & {
    images: ImageState;
  };

  initializeState(): void {
    // images is a mapping from keys to Texture objects. The keys should match
    // names of uniforms in shader modules
    this.setState({images: {}});

    super.initializeState();
  }

  draw({uniforms}: {uniforms: {[key: string]: any}}): void {
    const {model, images, coordinateConversion, bounds} = this.state;
    const {desaturate, transparentColor, tintColor, moduleProps} = this.props;

    // Render the image
    if (
      !model ||
      !images ||
      Object.keys(images).length === 0 ||
      !Object.values(images).every(item => item)
    ) {
      return;
    }

    model
      .setUniforms({
        ...uniforms,
        desaturate,
        transparentColor: transparentColor?.map(x => (x ? x / 255 : 0)),
        tintColor: tintColor?.slice(0, 3).map(x => x / 255),
        coordinateConversion,
        bounds
      })
      .updateModuleSettings({
        ...moduleProps,
        ...images
      })
      .draw();
  }

  getShaders(): any {
    const {modules = []} = this.props;

    // deck.gl 9.x requires WebGL2 - always use WebGL2 shaders
    for (const module of modules) {
      module.fs = module.fs2 || module.fs;
    }

    return {
      ...super.getShaders(),
      vs: vsWebGL2,
      fs: fsWebGL2,
      modules: [project32, ...modules]
    };
  }

  // eslint-disable-next-line complexity
  updateState(params: UpdateParameters<BitmapLayer<RasterLayerAddedProps>>): void {
    const {props, oldProps, changeFlags} = params;
    const modules = props && props.modules;
    const oldModules = oldProps && oldProps.modules;

    // setup model first
    // If the list of modules changed, need to recompile the shaders
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
    const gl = this.context.device?.gl || this.context.gl;

    const newImages = loadImages({
      gl,
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
