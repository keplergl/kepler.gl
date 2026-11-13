// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {BitmapLayer} from '@deck.gl/layers';
import {SimpleMeshLayer} from '@deck.gl/mesh-layers';
import RasterLayer from './raster-layer/raster-layer';
import RasterMeshLayer from './raster-mesh-layer/raster-mesh-layer';
import {loadImages} from './images';

// GPU upload is covered separately by the image-loader tests. Keep the actual layer
// lifecycle and module-uniform conversion, replacing only GPU/Deck boundaries.
jest.mock('./images', () => ({loadImages: jest.fn()}));

function makeLayer(Layer, props = {}) {
  const layer = new Layer({id: 'raster-test', modules: [], images: {}, moduleProps: {}, ...props});
  const model = {
    draw: jest.fn(() => true),
    destroy: jest.fn(),
    setVertexCount: jest.fn(),
    setTopology: jest.fn(),
    shaderInputs: {setProps: jest.fn(), moduleUniforms: {}, moduleBindings: {}}
  };
  layer.state = {model, images: {band: {texture: true}}};
  layer.context = {
    device: {gl: {}},
    renderPass: {},
    viewport: {resolution: 1},
    deck: {},
    layerManager: {setNeedsRedraw: jest.fn()}
  };
  jest.spyOn(layer, 'setState').mockImplementation(update => Object.assign(layer.state, update));
  return {layer, model};
}

let frames;
beforeEach(() => {
  frames = [];
  jest.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => frames.push(callback));
  loadImages.mockReset();
});
afterEach(() => jest.restoreAllMocks());
function nextFrame() {
  const callbacks = frames.splice(0);
  callbacks.forEach(callback => callback(0));
}

for (const Layer of [RasterLayer, RasterMeshLayer]) {
  describe(`${Layer.layerName}`, () => {
    test.each([{}, {band: null}])('does not draw incomplete images %j', images => {
      const {layer, model} = makeLayer(Layer);
      layer.state.images = images;
      layer.draw({shaderModuleProps: {}});
      expect(model.draw).not.toHaveBeenCalled();
    });

    test('does not draw without a model', () => {
      const {layer} = makeLayer(Layer);
      layer.state.model = null;
      expect(() => layer.draw({shaderModuleProps: {}})).not.toThrow();
      expect(frames).toHaveLength(0);
    });

    test('applies custom uniforms once, with uploaded textures overriding input props', () => {
      const getUniforms = jest.fn(({band, gain}) => ({image: band, gain: gain * 2}));
      const {layer, model} = makeLayer(Layer, {
        modules: [{name: 'custom', getUniforms}],
        moduleProps: {band: 'not a texture', gain: 3},
        opacity: 0
      });
      layer.draw({shaderModuleProps: {}});
      expect(getUniforms).toHaveBeenCalledTimes(1);
      expect(model.shaderInputs.moduleUniforms.custom).toEqual({gain: 6});
      expect(model.shaderInputs.moduleBindings.custom.image).toBe(layer.state.images.band);
      expect(model.draw).toHaveBeenCalledWith(layer.context.renderPass);
      expect(frames).toHaveLength(0);
    });

    test('coalesces pending-pipeline redraws and can request another frame later', () => {
      const onRedrawNeeded = jest.fn();
      const {layer, model} = makeLayer(Layer, {onRedrawNeeded});
      model.draw.mockReturnValue(false);
      layer.draw({});
      layer.draw({});
      expect(frames).toHaveLength(1);
      nextFrame();
      expect(onRedrawNeeded).toHaveBeenCalledTimes(1);
      expect(layer.context.deck._needsRedraw).toBeTruthy();
      expect(layer.context.layerManager.setNeedsRedraw).toHaveBeenCalledTimes(1);
      layer.draw({});
      expect(frames).toHaveLength(1);
    });

    test('retries a failed upload next frame, bypassing old source equality', () => {
      const {layer, model} = makeLayer(Layer);
      const images = {band: {data: new Uint8Array([1])}};
      const uploaded = {band: {texture: true}};
      loadImages.mockReturnValueOnce({images: {band: null}, hasPendingUploads: true});
      layer.updateImages({props: {images}, oldProps: {images}});
      nextFrame();
      loadImages.mockReturnValueOnce({images: uploaded, hasPendingUploads: false});
      layer.draw({});
      expect(loadImages).toHaveBeenLastCalledWith(
        expect.objectContaining({
          imagesData: images,
          oldImagesData: {},
          device: layer.context.device
        })
      );
      expect(layer.state.images).toBe(uploaded);
      expect(model.draw).toHaveBeenCalledTimes(1);
      layer.draw({});
      expect(loadImages).toHaveBeenCalledTimes(2);
    });

    test('bounds failed upload retries instead of scheduling frames forever', () => {
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
      const {layer, model} = makeLayer(Layer);
      loadImages.mockReturnValue({images: {band: null}, hasPendingUploads: true});
      layer.updateImages({props: {images: {band: {data: []}}}, oldProps: {images: {}}});
      for (let attempt = 0; attempt < 3; attempt++) {
        nextFrame();
        layer.draw({});
      }
      expect(loadImages).toHaveBeenCalledTimes(4); // initial upload plus three retries
      expect(frames).toHaveLength(0);
      layer.draw({});
      expect(loadImages).toHaveBeenCalledTimes(4);
      expect(model.draw).not.toHaveBeenCalled();
      expect(warn).toHaveBeenCalledTimes(1);
    });

    test('destroys single and array textures, including legacy delete handles', () => {
      const Parent = Layer === RasterLayer ? BitmapLayer : SimpleMeshLayer;
      jest.spyOn(Parent.prototype, 'finalizeState').mockImplementation(() => undefined);
      const {layer} = makeLayer(Layer);
      const modern = {destroy: jest.fn(), delete: jest.fn()};
      const legacy = {delete: jest.fn()};
      const nested = {destroy: jest.fn()};
      layer.state.images = {modern, bands: [legacy, null, nested], missing: null};
      layer.finalizeState();
      expect(modern.destroy).toHaveBeenCalledTimes(1);
      expect(modern.delete).not.toHaveBeenCalled();
      expect(legacy.delete).toHaveBeenCalledTimes(1);
      expect(nested.destroy).toHaveBeenCalledTimes(1);
    });
  });
}

test('bitmap draw normalizes colors and retains zero opacity', () => {
  const {layer, model} = makeLayer(RasterLayer, {
    desaturate: 0.5,
    transparentColor: [0, 128, 255, 0],
    tintColor: [255, 128, 0],
    opacity: 0
  });
  layer.state.bounds = [1, 2, 3, 4];
  layer.state.coordinateConversion = -1;
  layer.draw({});
  expect(model.shaderInputs.setProps).toHaveBeenCalledWith({
    raster: {
      desaturate: 0.5,
      transparentColor: [0, 128 / 255, 1, 0],
      tintColor: [1, 128 / 255, 0],
      opacity: 0,
      bounds: [1, 2, 3, 4],
      coordinateConversion: -1
    }
  });
});

test.each([true, false])('mesh draw selects flat shading from normals: %s', hasNormals => {
  const {layer, model} = makeLayer(RasterMeshLayer, {opacity: 0});
  layer.state.hasNormals = hasNormals;
  layer.draw({});
  expect(model.shaderInputs.setProps).toHaveBeenCalledWith({
    rasterMesh: {
      meshOpacity: 0,
      meshFlatShading: hasNormals ? 0 : 1
    }
  });
});

function bitmapUpdateFixture() {
  const {layer, model} = makeLayer(RasterLayer);
  const attributes = {invalidate: jest.fn(), invalidateAll: jest.fn()};
  jest.spyOn(layer, 'getAttributeManager').mockReturnValue(attributes);
  const mesh = {vertexCount: 6, positions: [1], texCoords: [2]};
  layer.state.mesh = mesh;
  layer.state.meshResolution = 1;
  const createMesh = jest.spyOn(layer, '_createMesh').mockReturnValue(mesh);
  jest.spyOn(layer, '_getCoordinateUniforms').mockReturnValue({coordinateConversion: 1});
  loadImages.mockReturnValue({images: null, hasPendingUploads: false});
  const params = {props: layer.props, oldProps: layer.props, changeFlags: {}};
  return {layer, model, attributes, mesh, createMesh, params};
}

test('bitmap retains geometry on unchanged updates, rebuilds when viewport resolution changes', () => {
  const {layer, model, attributes, mesh, createMesh, params} = bitmapUpdateFixture();
  layer.updateState(params);
  expect(createMesh).not.toHaveBeenCalled();
  layer.context.viewport.resolution = 2;
  const nextMesh = {...mesh, vertexCount: 12, positions: [3]};
  createMesh.mockReturnValue(nextMesh);
  layer.updateState(params);
  expect(layer.state.mesh).toBe(nextMesh);
  expect(layer.state.meshResolution).toBe(2);
  expect(model.setVertexCount).toHaveBeenLastCalledWith(12);
  expect(attributes.invalidate).toHaveBeenCalledWith('positions');
  expect(attributes.invalidate).not.toHaveBeenCalledWith('texCoords');
});

test('bitmap refreshes coordinate uniforms without rebuilding geometry for coordinate-system edits', () => {
  const {layer, createMesh, params} = bitmapUpdateFixture();
  layer.updateState({
    ...params,
    oldProps: {...layer.props, bounds: layer.props.bounds, _imageCoordinateSystem: 999}
  });
  expect(layer.state.coordinateConversion).toBe(1);
  expect(createMesh).not.toHaveBeenCalled();
});

test('bitmap rebuilds its model on module changes and retains the mesh vertex count', () => {
  const {layer, model, attributes, params} = bitmapUpdateFixture();
  const replacement = {setVertexCount: jest.fn()};
  jest.spyOn(layer, '_getModel').mockReturnValue(replacement);
  layer.updateState({...params, oldProps: {...layer.props, modules: [{name: 'old'}]}});
  expect(model.destroy).toHaveBeenCalledTimes(1);
  expect(layer.state.model).toBe(replacement);
  expect(replacement.setVertexCount).toHaveBeenCalledWith(6);
  expect(attributes.invalidateAll).toHaveBeenCalledTimes(1);
});

test.each([true, false])('mesh rebuild updates normals and wireframe topology: %s', wireframe => {
  jest.spyOn(SimpleMeshLayer.prototype, 'updateState').mockImplementation(() => undefined);
  const {layer, model} = makeLayer(RasterMeshLayer, {wireframe});
  const replacement = {setTopology: jest.fn()};
  jest.spyOn(layer, 'getModel').mockReturnValue(replacement);
  const attributes = {invalidateAll: jest.fn()};
  jest.spyOn(layer, 'getAttributeManager').mockReturnValue(attributes);
  loadImages.mockReturnValue({images: null, hasPendingUploads: false});
  layer.updateState({
    props: {...layer.props, mesh: {attributes: {NORMAL: [0, 0, 1]}}},
    oldProps: layer.props,
    changeFlags: {},
    context: layer.context
  });
  expect(model.destroy).toHaveBeenCalledTimes(1);
  expect(layer.state.hasNormals).toBe(true);
  expect(attributes.invalidateAll).toHaveBeenCalledTimes(1);
  expect(replacement.setTopology).toHaveBeenCalledWith(wireframe ? 'line-strip' : 'triangle-list');
});
