// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {project32, phongLighting, log, UpdateParameters} from '@deck.gl/core/typed';
import {SimpleMeshLayer, SimpleMeshLayerProps} from '@deck.gl/mesh-layers/typed';
import GL from '@luma.gl/constants';
import {Model, Geometry, isWebGL2} from '@luma.gl/core';
import {ProgramManager} from '@luma.gl/engine';
import {UniformsOptions} from '@luma.gl/webgl/src/classes/uniforms';

import fsWebGL1 from './raster-mesh-layer-webgl1.fs';
import vsWebGL1 from './raster-mesh-layer-webgl1.vs';
import fsWebGL2 from './raster-mesh-layer-webgl2.fs';
import vsWebGL2 from './raster-mesh-layer-webgl2.vs';
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
  moduleProps: {type: 'object', value: {}, compare: true}
};

export default class RasterMeshLayer extends SimpleMeshLayer<any, RasterLayerAddedProps> {
  declare state: SimpleMeshLayer<RasterLayerAddedProps>['state'] & {
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
      modules: [project32, phongLighting, ...modules]
    };
  }

  // eslint-disable-next-line complexity
  updateState(params: UpdateParameters<SimpleMeshLayer<any, RasterLayerAddedProps>>): void {
    const {props, oldProps, changeFlags, context} = params;
    super.updateState({props, oldProps, changeFlags, context});

    const modules = props && props.modules;
    const oldModules = oldProps && oldProps.modules;

    // If the list of modules changed, need to recompile the shaders
    if (
      props.mesh !== oldProps.mesh ||
      changeFlags.extensionsChanged ||
      !modulesEqual(modules, oldModules)
    ) {
      if (this.state.model) {
        this.state.model.delete();
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
      this.state.model.setDrawMode(this.props.wireframe ? GL.LINE_STRIP : GL.TRIANGLES);
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

  draw({uniforms}: UniformsOptions): void {
    const {model, images} = this.state;
    const {moduleProps} = this.props;

    // Render the image
    if (
      !model ||
      !images ||
      Object.keys(images).length === 0 ||
      !Object.values(images).every(item => item)
    ) {
      return;
    }

    const {sizeScale} = this.props;

    model
      .setUniforms(
        Object.assign({}, uniforms, {
          sizeScale,
          flatShading: !this.state.hasNormals
        })
      )
      .updateModuleSettings({
        ...moduleProps,
        ...images
      })
      .draw();
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

  protected getModel(mesh: Mesh): Model {
    const {gl} = this.context;

    const model = new Model(
      gl,
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
