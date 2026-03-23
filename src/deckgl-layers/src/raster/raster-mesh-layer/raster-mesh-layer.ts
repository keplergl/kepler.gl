// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// @ts-nocheck - Raster mesh layer uses luma.gl internal APIs that changed significantly in 9.x
// TODO: Refactor to use luma.gl 9.x shader module system when raster layer is actively maintained.

import {project32, phongMaterial, log, UpdateParameters} from '@deck.gl/core';
import {SimpleMeshLayer, SimpleMeshLayerProps} from '@deck.gl/mesh-layers';
import {Geometry} from '@luma.gl/engine';
import {Model} from '@luma.gl/engine';

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
    // images is a mapping from keys to Texture objects. The keys should match
    // names of uniforms in shader modules
    this.setState({images: {}});

    super.initializeState();
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
      modules: [project32, phongMaterial, ...modules]
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

  draw({uniforms}): void {
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
