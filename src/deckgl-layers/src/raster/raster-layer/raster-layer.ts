// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {project32, UpdateParameters} from '@deck.gl/core/typed';
import {BitmapLayer} from '@deck.gl/layers/typed';
import {isWebGL2} from '@luma.gl/core';
import {ProgramManager} from '@luma.gl/engine';

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

export default class RasterLayer extends BitmapLayer<RasterLayerAddedProps> {
  declare state: BitmapLayer<RasterLayerAddedProps>['state'] & {
    images: ImageState;
  };

  initializeState(): void {
    const {gl} = this.context;
    const programManager = ProgramManager.getDefaultProgramManager(gl);

    const fsStr1 = 'fs:DECKGL_MUTATE_COLOR(inout vec4 image, in vec2 coord)';
    const fsStr2 = 'fs:DECKGL_CREATE_COLOR(inout vec4 image, in vec2 coord)';

    // Only initialize shader hook functions _once globally_
    // Since the program manager is shared across all layers, but many layers
    // might be created, this solves the performance issue of always adding new
    // hook functions.
    if (!programManager._hookFunctions.includes(fsStr1)) {
      programManager.addShaderHook(fsStr1);
    }
    if (!programManager._hookFunctions.includes(fsStr2)) {
      programManager.addShaderHook(fsStr2);
    }

    // images is a mapping from keys to Texture2D objects. The keys should match
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
