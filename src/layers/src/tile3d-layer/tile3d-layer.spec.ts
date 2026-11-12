// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import Tile3DLayer from './tile3d-layer';
import {UniformStore} from '@luma.gl/core';
import type {Device} from '@luma.gl/core/dist/adapter/device';

const URL = 'https://assets.ion.cesium.com/57588/tileset.json';

function render(layer: Tile3DLayer, token = 'token-A', options = {}) {
  return layer.renderLayer({
    data: {tile3dUrl: URL, tile3dAccessToken: token},
    mapState: {},
    visible: true,
    idx: 0,
    ...options
  })[0];
}

describe('3D tile token reset', () => {
  test('changes the deck identity when a token changes without exposing the token', () => {
    const layer = new Tile3DLayer({id: 'tiles', dataId: 'tiles'});
    const previous = render(layer);
    const next = render(layer, 'token-B');

    expect(next.props.data).toBe(previous.props.data);
    expect(next.id).not.toBe(previous.id);
    expect([previous.id, next.id].join()).not.toMatch(/token-A|token-B/);
    expect(layer.id).toBe('tiles');
    expect(next.props.loadOptions?.['cesium-ion']).toEqual({accessToken: 'token-B'});
  });

  test('uses a fresh identity when changing a token back to its earlier value', () => {
    const layer = new Tile3DLayer({id: 'tiles', dataId: 'tiles'});
    const ids = [render(layer).id, render(layer, 'token-B').id, render(layer).id];

    expect(new Set(ids).size).toBe(3);
  });

  test('preserves the deck identity and loader options for style and camera changes', () => {
    const layer = new Tile3DLayer({id: 'tiles', dataId: 'tiles'});
    const previous = render(layer);
    layer.updateLayerVisConfig({opacity: 0.5});
    const next = render(layer, 'token-A', {mapState: {latitude: 20, longitude: 30, zoom: 10}});

    expect(next.id).toBe(previous.id);
    expect(next.props.loadOptions).toBe(previous.props.loadOptions);
    expect(next.props.opacity).toBe(0.5);
  });

  test('leaves URL-only changes to the existing loader behavior', () => {
    const layer = new Tile3DLayer({id: 'tiles', dataId: 'tiles'});
    const previous = render(layer);
    const next = render(layer, 'token-A', {
      data: {tile3dUrl: 'https://example.com/tileset.json', tile3dAccessToken: 'token-A'}
    });

    expect(next.id).toBe(previous.id);
    expect(next.props.data).not.toBe(previous.props.data);
  });

  test('uses fresh state while deck finalization destroys the old installed tileset', () => {
    const layer = new Tile3DLayer({id: 'tiles', dataId: 'tiles'});
    const previous: any = render(layer);
    previous.initializeState();
    const destroy = jest.fn();
    previous.state.tileset3d = {destroy};
    previous.internalState = {
      uniformTransitions: {clear: jest.fn()},
      finalize: jest.fn()
    };
    previous.context = {resourceManager: {unsubscribe: jest.fn()}};

    const next: any = render(layer, 'token-B');
    expect(next.id).not.toBe(previous.id);
    // Deck initializes unmatched IDs and finalizes the old layer.
    next.initializeState();
    previous.finalizeState(previous.context);

    expect(next.state).not.toBe(previous.state);
    expect(next.state.tileset3d).toBeNull();
    expect(destroy).toHaveBeenCalledTimes(1);
    expect(previous.state.tileset3d).toBeNull();
  });
});

describe('3D tile camera updates', () => {
  function diff(previous: any, next: any) {
    const setChangeFlags = jest.spyOn(next, 'setChangeFlags').mockImplementation(() => undefined);
    next._diffProps(next.props, previous.props);
    return setChangeFlags.mock.calls[0][0] as any;
  }

  test('keeps cached tile sublayers valid during camera and hover renders', () => {
    const layer = new Tile3DLayer({id: 'tiles', dataId: 'tiles'});
    const previous: any = render(layer);
    const next: any = render(layer, 'token-A', {
      mapState: {latitude: 20, longitude: 30, zoom: 10},
      objectHovered: {index: 1}
    });
    const flags = diff(previous, next);
    expect(flags.propsChanged).toBe(false);
    expect(flags.dataChanged).toBe(false);
    expect(flags.extensionsChanged).toBe(false);

    next.initializeState();
    next.context = {};
    const cached = {layer: {}, needsUpdate: false};
    next.state.layerMap = {tile: cached};
    next.updateState({props: next.props, oldProps: previous.props, changeFlags: flags});
    expect(cached.needsUpdate).toBe(false);
  });

  test('uses the latest callbacks while keeping the error handler stable', () => {
    const layer = new Tile3DLayer({id: 'tiles', dataId: 'tiles'});
    const oldCallback = jest.fn();
    const newCallback = jest.fn();
    const previous: any = render(layer, 'token-A', {
      layerCallbacks: {onTilesetLoadError: oldCallback}
    });
    const next: any = render(layer, 'token-A', {
      layerCallbacks: {onTilesetLoadError: newCallback}
    });
    expect(next.props.onTilesetError).toBe(previous.props.onTilesetError);
    next.props.onTilesetError('token');
    expect(newCallback).toHaveBeenCalledWith('token');
    expect(oldCallback).not.toHaveBeenCalled();
    next.props.onTilesetError(null);
    expect(newCallback).toHaveBeenLastCalledWith(null);
  });

  test('still invalidates cached tiles for style changes', () => {
    const layer = new Tile3DLayer({id: 'tiles', dataId: 'tiles'});
    const previous: any = render(layer);
    layer.updateLayerVisConfig({opacity: 0.5});
    const next: any = render(layer);
    const flags = diff(previous, next);
    expect(flags.propsChanged).toBeTruthy();
    next.initializeState();
    next.context = {};
    const cached = {layer: {}, needsUpdate: false};
    next.state.layerMap = {tile: cached};
    next.updateState({props: next.props, oldProps: previous.props, changeFlags: flags});
    expect(cached.needsUpdate).toBe(true);
  });
});

// Model.draw submits every uniform block on every frame. The luma.gl patch
// must keep static tile materials on the GPU while camera uniforms change.
describe('3D tile uniform uploads', () => {
  function createUniformStore() {
    const materialBuffer = {write: jest.fn(), destroy: jest.fn()};
    const cameraBuffer = {write: jest.fn(), destroy: jest.fn()};
    const device = {
      type: 'webgl',
      createBuffer: jest.fn().mockReturnValueOnce(materialBuffer).mockReturnValueOnce(cameraBuffer)
    } as unknown as Device;
    const store = new UniformStore(device, {
      material: {uniformTypes: {opacity: 'f32', color: 'vec4<f32>'}},
      camera: {uniformTypes: {position: 'vec3<f32>'}}
    });
    store.getManagedUniformBuffer('material');
    store.getManagedUniformBuffer('camera');
    store.setUniforms({
      material: {opacity: 1, color: [1, 1, 1, 1]},
      camera: {position: [0, 0, 0]}
    });
    expect(materialBuffer.write).toHaveBeenCalledTimes(1);
    expect(cameraBuffer.write).toHaveBeenCalledTimes(1);
    materialBuffer.write.mockClear();
    cameraBuffer.write.mockClear();
    return {store, materialBuffer, cameraBuffer};
  }

  test('does not upload unchanged scalar or array uniforms, including empty updates', () => {
    const {store, materialBuffer, cameraBuffer} = createUniformStore();
    store.setUniforms({
      material: {opacity: 1, color: new Float32Array([1, 1, 1, 1])},
      camera: {position: [0, 0, 0]}
    });
    store.setUniforms({});
    store.setUniforms({material: {}});

    expect(materialBuffer.write).not.toHaveBeenCalled();
    expect(cameraBuffer.write).not.toHaveBeenCalled();
    store.destroy();
  });

  test('uploads camera changes without reuploading static material blocks', () => {
    const {store, materialBuffer, cameraBuffer} = createUniformStore();
    for (const longitude of [1, 2, 3]) {
      store.setUniforms({
        material: {opacity: 1, color: [1, 1, 1, 1]},
        camera: {position: [longitude, 0, 0]}
      });
    }

    expect(cameraBuffer.write).toHaveBeenCalledTimes(3);
    expect(materialBuffer.write).not.toHaveBeenCalled();
    store.destroy();
  });

  test('still uploads material edits and in-place array changes', () => {
    const {store, materialBuffer, cameraBuffer} = createUniformStore();
    const color = new Float32Array([1, 0, 0, 1]);
    store.setUniforms({material: {opacity: 0.5, color}});
    expect(materialBuffer.write).toHaveBeenCalledTimes(1);

    color[1] = 0.5;
    store.setUniforms({material: {color}});
    expect(materialBuffer.write).toHaveBeenCalledTimes(2);
    expect(cameraBuffer.write).not.toHaveBeenCalled();
    store.destroy();
  });
});
