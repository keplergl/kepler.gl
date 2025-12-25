// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// @ts-nocheck - This file uses luma.gl 8.x APIs that need significant refactoring for 9.x
// TODO: Refactor to use luma.gl 9.x APIs

import {project32} from '@deck.gl/core';
import type {UpdateParameters} from '@deck.gl/core';
import {BitmapLayer} from '@deck.gl/layers';

import fsWebGL1 from './raster-layer-webgl1.fs';
import vsWebGL1 from './raster-layer-webgl1.vs';
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

// Helper to check WebGL2 context
function isWebGL2(gl: WebGLRenderingContext | WebGL2RenderingContext): boolean {
  return typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext;
}

export default class RasterLayer extends BitmapLayer<RasterLayerAddedProps> {
  declare state: BitmapLayer<RasterLayerAddedProps>['state'] & {
    images: ImageState;
  };

  initializeState(): void {
    // In luma.gl 9.x, ProgramManager is no longer available
    // Shader hooks need to be handled differently
    // TODO: Refactor for luma.gl 9.x shader module system

    // images is a mapping from keys to Texture objects. The keys should match
    // names of uniforms in shader modules
    this.setState({images: {}});

    super.initializeState(this.context);
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
    const {gl} = this.context;
    const {modules = []} = this.props;
    const webgl2 = isWebGL2(gl);

    // Choose webgl version for module
    // If fs2 or fs1 keys exist, prefer them, but fall back to fs, so that
    // version-independent modules don't need to care
    for (const module of modules) {
      module.fs = webgl2 ? module.fs2 || module.fs : module.fs1 || module.fs;

      // Sampler type is always float for WebGL1
      if (!webgl2 && module.defines) {
        module.defines.SAMPLER_TYPE = 'sampler2D';
      }
    }

    return {
      ...super.getShaders(),
      vs: webgl2 ? vsWebGL2 : vsWebGL1,
      fs: webgl2 ? fsWebGL2 : fsWebGL1,
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
      const {gl} = this.context;
      this.state.model?.delete();
      this.state.model = this._getModel(gl);
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
    const {gl} = this.context;

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
          image.map(x => x && x.delete());
        } else if (image) {
          image.delete();
        }
      }
    }
  }
}

RasterLayer.defaultProps = defaultProps;
RasterLayer.layerName = 'RasterLayer';
