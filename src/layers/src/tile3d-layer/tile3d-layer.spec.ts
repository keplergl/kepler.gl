// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {load} from '@loaders.gl/core';
import {Tileset3D} from '@loaders.gl/tiles';
import Tile3DLayer from './tile3d-layer';

jest.mock('@loaders.gl/core', () => ({
  ...jest.requireActual('@loaders.gl/core'),
  load: jest.fn()
}));

jest.mock('@loaders.gl/tiles', () => ({
  ...jest.requireActual('@loaders.gl/tiles'),
  Tileset3D: jest.fn()
}));

function deferred() {
  let resolve!: (value?: unknown) => void;
  let reject!: (error: Error) => void;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return {promise, resolve, reject};
}

const URL = 'https://example.com/tileset.json';

function render(layer: Tile3DLayer, token = 'A', overrides = {}): any {
  return layer.renderLayer({
    data: {tile3dUrl: URL, tile3dAccessToken: token},
    mapState: {},
    visible: true,
    idx: 0,
    ...overrides
  })[0];
}

function mount(next: any, previous?: any) {
  next.context = {
    resourceManager: {unsubscribe: jest.fn()},
    layerManager: {setNeedsUpdate: jest.fn()}
  };
  const rematched = previous?.id === next.id;
  if (rematched) {
    next._diffProps = jest.fn();
    next._transferState(previous);
  } else {
    next.initializeState();
    // Non-rendering parts of deck's lifecycle; use its real state transfer and finalizer.
    next.internalState = {
      changeFlags: {},
      setAsyncProps: jest.fn(),
      getOldProps: () => next.props,
      uniformTransitions: {clear: jest.fn()},
      finalize: jest.fn()
    };
  }
  const loading = jest.spyOn(next, '_loadTileset');
  next.updateState({
    props: next.props,
    oldProps: rematched ? previous.props : {},
    changeFlags: {propsChanged: true}
  });
  if (previous && !rematched) previous.finalizeState(previous.context);
  const rootLoaded = loading.mock.results[0]?.value;
  return {
    rootLoaded,
    async settled() {
      await rootLoaded;
      await Promise.resolve(); // Destruction follows asynchronous initialization.
    }
  };
}

function createLayer() {
  const layer = new Tile3DLayer({id: 'tiles', dataId: 'tiles'});
  const callbacks = {onFitBounds: jest.fn(), onTilesetLoadError: jest.fn()};
  const renderToken = (token = 'A', overrides = {}) =>
    render(layer, token, {layerCallbacks: callbacks, ...overrides});
  return {layer, callbacks, renderToken};
}

describe('3D tileset reset on token change', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (Tileset3D as jest.Mock).mockImplementation((data, options) => ({
      ...data,
      options,
      tilesetInitializationPromise: Promise.resolve(),
      destroy: jest.fn()
    }));
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test.each(['success', 'failure'])(
    'ignores retired %s after the new token succeeds',
    async outcome => {
      const oldRequest = deferred();
      const newRequest = deferred();
      (load as jest.Mock)
        .mockReturnValueOnce(oldRequest.promise)
        .mockReturnValueOnce(newRequest.promise);
      const {layer, callbacks, renderToken} = createLayer();
      const old = renderToken();
      const oldLoad = mount(old);
      const current = renderToken('B');
      const currentLoad = mount(current, old);
      expect(current.id).not.toBe(old.id);
      expect(current.state).not.toBe(old.state);

      newRequest.resolve({id: 'current', cartographicCenter: [10, 20]});
      await currentLoad.settled();
      const accepted = current.state.tileset3d;
      const cachedLayers = {current: {layer: {id: 'current-mesh'}}};
      current.state.layerMap = cachedLayers;
      const bounds = layer.meta.bounds;
      callbacks.onTilesetLoadError.mockClear();
      if (outcome === 'success') {
        oldRequest.resolve({id: 'obsolete', cartographicCenter: [30, 40]});
      } else {
        oldRequest.reject(new Error('401 old token'));
      }
      await oldLoad.settled();

      expect(current.state.tileset3d).toBe(accepted);
      expect(current.state.layerMap).toBe(cachedLayers);
      expect(accepted.destroy).not.toHaveBeenCalled();
      expect(layer.meta.bounds).toBe(bounds);
      expect(callbacks.onFitBounds).toHaveBeenCalledTimes(1);
      expect(callbacks.onTilesetLoadError).not.toHaveBeenCalled();
      expect(console.error).not.toHaveBeenCalled();
      expect(old.state.tileset3d).toBeNull();
      if (outcome === 'success') {
        expect((Tileset3D as jest.Mock).mock.results[1].value.destroy).toHaveBeenCalledTimes(1);
      }
    }
  );

  test.each(['pending', 'failed'])(
    'does not replace the current %s selection with a late success',
    async status => {
      const oldRequest = deferred();
      const newRequest = deferred();
      (load as jest.Mock)
        .mockReturnValueOnce(oldRequest.promise)
        .mockReturnValueOnce(newRequest.promise);
      const {layer, callbacks, renderToken} = createLayer();
      const old = renderToken();
      const oldLoad = mount(old);
      const current = renderToken('B');
      const currentLoad = mount(current, old);
      if (status === 'failed') {
        newRequest.reject(new Error('401 current token'));
        await currentLoad.settled();
      }
      oldRequest.resolve({cartographicCenter: [10, 20]});
      await oldLoad.settled();
      expect(current.state.tileset3d).toBeNull();
      expect(callbacks.onFitBounds).not.toHaveBeenCalled();
      expect(layer.tilesetLoadError).toBe(status === 'failed' ? 'token' : null);
      if (status === 'pending') {
        newRequest.resolve({id: 'current'});
        await currentLoad.settled();
        expect(current.state.tileset3d.id).toBe('current');
      }
    }
  );

  test('uses fresh opaque identities for A-B-A without resetting logical settings or camera', async () => {
    const oldRequest = deferred();
    (load as jest.Mock)
      .mockReturnValueOnce(oldRequest.promise)
      .mockResolvedValueOnce({id: 'B', cartographicCenter: [10, 20]})
      .mockResolvedValueOnce({id: 'A-again', cartographicCenter: [30, 40]});
    const {layer, callbacks, renderToken} = createLayer();
    const config = layer.config;
    const old = renderToken('secret-A');
    const oldLoad = mount(old);
    const middle = renderToken('secret-B');
    await mount(middle, old).settled();
    const middleTileset = middle.state.tileset3d;
    const current = renderToken('secret-A');
    await mount(current, middle).settled();
    oldRequest.resolve({id: 'old-A', cartographicCenter: [50, 60]});
    await oldLoad.settled();

    expect(new Set([old.id, middle.id, current.id]).size).toBe(3);
    expect([old.id, middle.id, current.id].join()).not.toContain('secret-');
    expect(layer.id).toBe('tiles');
    expect(layer.config).toBe(config);
    expect(callbacks.onFitBounds).toHaveBeenCalledTimes(1);
    expect(middleTileset.destroy).toHaveBeenCalledTimes(1);
    expect(current.state.tileset3d.id).toBe('A-again');
  });

  test('retains state, cached tiles and pending loading across style and camera updates', async () => {
    const request = deferred();
    (load as jest.Mock).mockReturnValueOnce(request.promise);
    const {layer, renderToken} = createLayer();
    const old = renderToken();
    const loading = mount(old);
    layer.updateLayerVisConfig({opacity: 0.5});
    const current = renderToken('A', {mapState: {latitude: 20, longitude: 30, zoom: 10}});
    await mount(current, old).settled();
    expect(current.id).toBe(old.id);
    expect(current.state).toBe(old.state);
    request.resolve({id: 'current'});
    await loading.settled();
    const tileset = current.state.tileset3d;
    current.state.layerMap = {mesh: {needsUpdate: false}};
    const styled = renderToken();
    await mount(styled, current).settled();
    expect(load).toHaveBeenCalledTimes(1);
    expect(styled.state.tileset3d).toBe(tileset);
    expect(styled.state.layerMap.mesh).toBeDefined();
    expect(styled.props.opacity).toBe(0.5);
    expect(tileset.destroy).not.toHaveBeenCalled();
  });

  test('accepts tilesets on a clone created before deck initializes it', async () => {
    (load as jest.Mock).mockResolvedValueOnce({cartographicCenter: [10, 20]});
    const {callbacks, renderToken} = createLayer();
    // Kepler's zoom-opacity wrapper clones rendered layers before mounting them.
    const original = renderToken();
    const faded = original.clone({opacity: 0.4});
    await mount(faded).settled();
    expect(original.state).toBeUndefined();
    expect(faded.state.tileset3d).not.toBeNull();
    expect(callbacks.onFitBounds).toHaveBeenCalledTimes(1);
    const tile = {content: {material: {pbrMetallicRoughness: {}}}};
    faded.props.onTileLoad(tile);
    expect(tile.content.material.pbrMetallicRoughness).toEqual({
      metallicFactor: 0,
      roughnessFactor: 1
    });
    expect(console.error).not.toHaveBeenCalled();
  });

  test('resets when a logical layer is reconstructed with the same saved ID and URL', async () => {
    const request = deferred();
    (load as jest.Mock)
      .mockReturnValueOnce(request.promise)
      .mockResolvedValueOnce({id: 'replacement'});
    const previous = createLayer();
    const old = previous.renderToken();
    const oldLoad = mount(old);
    const replacement = createLayer();
    const current = replacement.renderToken('B');
    await mount(current, old).settled();
    request.resolve({id: 'old', cartographicCenter: [10, 20]});
    await oldLoad.settled();
    expect(current.id).not.toBe(old.id);
    expect(current.state).not.toBe(old.state);
    expect(current.state.tileset3d.id).toBe('replacement');
    expect(old.state.tileset3d).toBeNull();
    expect(previous.callbacks.onFitBounds).not.toHaveBeenCalled();
  });

  test.each([
    ['401 Unauthorized', 'token'],
    ['invalid bounding volume', 'generic']
  ])('reports %s and clears it on token retry', async (message, kind) => {
    (load as jest.Mock)
      .mockRejectedValueOnce(new Error(message))
      .mockResolvedValueOnce({id: 'retry'});
    const {layer, callbacks, renderToken} = createLayer();
    const old = renderToken();
    await mount(old).settled();
    expect(layer.tilesetLoadError).toBe(kind);
    expect(callbacks.onTilesetLoadError).toHaveBeenLastCalledWith(kind);
    const current = renderToken('B');
    await mount(current, old).settled();
    expect(layer.tilesetLoadError).toBeNull();
    expect(callbacks.onTilesetLoadError).toHaveBeenLastCalledWith(null);
    expect(current.state.tileset3d.id).toBe('retry');
  });

  test.each(['success', 'failure'])(
    'ignores pending %s after deletion of a rematched instance',
    async outcome => {
      const request = deferred();
      (load as jest.Mock).mockReturnValueOnce(request.promise);
      const {callbacks, renderToken} = createLayer();
      const old = renderToken();
      const loading = mount(old);
      const current = renderToken();
      mount(current, old);
      current.finalizeState(current.context);
      if (outcome === 'success') request.resolve({cartographicCenter: [10, 20]});
      else request.reject(new Error('401 deleted token'));
      await loading.settled();
      expect(current.state.tileset3d).toBeNull();
      expect(callbacks.onFitBounds).not.toHaveBeenCalled();
      expect(callbacks.onTilesetLoadError).not.toHaveBeenCalled();
      expect(console.error).not.toHaveBeenCalled();
    }
  );

  test('retiring one split panel does not retire the other panel', async () => {
    const leftRequest = deferred();
    const rightRequest = deferred();
    (load as jest.Mock)
      .mockReturnValueOnce(leftRequest.promise)
      .mockReturnValueOnce(rightRequest.promise);
    const {callbacks, renderToken} = createLayer();
    const left = renderToken();
    const leftLoad = mount(left);
    const right = renderToken('A', {idx: 1});
    const rightLoad = mount(right);
    expect(left.id).toBe(right.id); // Separate deck instances, independent state.
    expect(left.state).not.toBe(right.state);
    left.finalizeState(left.context);
    leftRequest.resolve({cartographicCenter: [30, 40]});
    rightRequest.resolve({id: 'right', cartographicCenter: [10, 20]});
    await Promise.all([leftLoad.settled(), rightLoad.settled()]);
    expect(left.state.tileset3d).toBeNull();
    expect(right.state.tileset3d.id).toBe('right');
    expect(right.state.tileset3d.destroy).not.toHaveBeenCalled();
    expect(callbacks.onFitBounds).toHaveBeenCalledTimes(1);
  });

  test('delegates preload URLs, authorization headers and tileset options to deck', async () => {
    (load as jest.Mock).mockResolvedValueOnce({id: 'current'});
    const {layer, renderToken} = createLayer();
    const preload = jest.fn().mockResolvedValue({
      url: 'https://example.com/resolved.json',
      headers: {Authorization: 'Bearer resolved-token'}
    });
    const loader = {id: 'preload-test', preload};
    const options = layer._getDataAndLoaderOptions(URL, 'A');
    options.loader = loader;
    options.loadOptions = {
      core: {fetch: {credentials: 'include'}},
      tileset: {maximumScreenSpaceError: 16}
    };
    const current = renderToken();
    await mount(current).settled();
    expect(preload).toHaveBeenCalledWith(URL, options.loadOptions);
    expect(load).toHaveBeenCalledWith('https://example.com/resolved.json', loader, {
      core: {fetch: {credentials: 'include', headers: {Authorization: 'Bearer resolved-token'}}}
    });
    expect(current.state.tileset3d.options.maximumScreenSpaceError).toBe(16);
  });

  test('cleans up a retired preload even when deck continues its old fetch', async () => {
    const oldPreload = deferred();
    const {layer, renderToken} = createLayer();
    layer._getDataAndLoaderOptions(URL, 'A').loader = {
      id: 'preload-test',
      preload: () => oldPreload.promise
    };
    (load as jest.Mock).mockResolvedValueOnce({id: 'current'}).mockResolvedValueOnce({id: 'old'});
    const old = renderToken();
    const oldLoad = mount(old);
    const current = renderToken('B');
    await mount(current, old).settled();
    oldPreload.resolve({url: 'https://example.com/old.json'});
    await oldLoad.settled();
    expect(current.state.tileset3d.id).toBe('current');
    expect(old.state.tileset3d).toBeNull();
    expect((Tileset3D as jest.Mock).mock.results[1].value.destroy).toHaveBeenCalledTimes(1);
  });

  test('prevents retired Google traversal callbacks from changing attribution', async () => {
    const googleUrl = 'https://tile.googleapis.com/v1/3dtiles/root.json';
    (load as jest.Mock).mockResolvedValueOnce({url: googleUrl});
    const {layer, renderToken} = createLayer();
    const old = renderToken('A', {data: {tile3dUrl: googleUrl, tile3dAccessToken: 'A'}});
    await mount(old).settled();
    const tileset = old.state.tileset3d;
    const tile = {content: {gltf: {asset: {copyright: 'Accepted'}}}};
    tileset.options.onTraversalComplete([tile]);
    expect(layer.meta.attribution.title).toBe('Accepted');
    // A new generation retires callbacks even before deck finalizes the old layer.
    renderToken('B', {data: {tile3dUrl: googleUrl, tile3dAccessToken: 'B'}});
    tile.content.gltf.asset.copyright = 'Retired';
    expect(tileset.options.onTraversalComplete([tile])).toEqual([tile]);
    expect(layer.meta.attribution.title).toBe('Accepted');
  });

  test.each(['success', 'failure'])(
    'handles asynchronous I3S initialization %s after removal',
    async outcome => {
      const root = deferred();
      const RealTileset3D = jest.requireActual('@loaders.gl/tiles').Tileset3D;
      (Tileset3D as jest.Mock).mockImplementationOnce(
        (data, options) => new RealTileset3D(data, options)
      );
      (load as jest.Mock).mockResolvedValueOnce({
        type: 'I3S',
        url: URL,
        root: root.promise,
        fullExtent: {xmin: 0, ymin: 0, xmax: 1, ymax: 1, zmin: 0, zmax: 1},
        lodMetricType: 'maxScreenThreshold'
      });
      const {callbacks, renderToken} = createLayer();
      const old = renderToken();
      const loading = mount(old);
      await Promise.resolve(); // Deck consumes the mocked root response.
      const tileset = old.state.tileset3d;
      expect(tileset).toBeInstanceOf(RealTileset3D);
      const destroy = jest.spyOn(tileset, 'destroy');
      const initializeRoot = jest.spyOn(tileset, '_initializeTileHeaders');
      old.finalizeState(old.context);
      if (outcome === 'success') {
        root.resolve({
          id: 'root',
          boundingVolume: {sphere: [6378137, 0, 0, 1]},
          lodMetricType: 'maxScreenThreshold',
          lodMetricValue: 1,
          children: []
        });
      } else {
        root.reject(new Error('bad I3S root'));
      }
      await loading.settled();
      expect(tileset.root).toBeNull();
      expect(destroy).toHaveBeenCalledTimes(1);
      if (outcome === 'success') {
        await expect(tileset.tilesetInitializationPromise).resolves.toBeUndefined();
        expect(initializeRoot).toHaveBeenCalledTimes(1);
        expect(initializeRoot.mock.results[0].value.isDestroyed()).toBe(true);
      }
      expect(old.state.tileset3d).toBeNull();
      expect(callbacks.onFitBounds).not.toHaveBeenCalled();
      expect(callbacks.onTilesetLoadError).not.toHaveBeenCalled();
      expect(console.error).not.toHaveBeenCalled();
    }
  );

  test('fits a current I3S tileset only after its asynchronous root is ready', async () => {
    const root = deferred();
    const RealTileset3D = jest.requireActual('@loaders.gl/tiles').Tileset3D;
    (Tileset3D as jest.Mock).mockImplementationOnce(
      (data, options) => new RealTileset3D(data, options)
    );
    (load as jest.Mock).mockResolvedValueOnce({
      type: 'I3S',
      url: URL,
      root: root.promise,
      fullExtent: {xmin: 0, ymin: 0, xmax: 1, ymax: 1, zmin: 0, zmax: 1}
    });
    const {callbacks, renderToken} = createLayer();
    const current = renderToken();
    const loading = mount(current);
    await Promise.resolve();
    expect(callbacks.onFitBounds).not.toHaveBeenCalled();
    root.resolve({
      id: 'root',
      boundingVolume: {sphere: [6378137, 0, 0, 1]},
      lodMetricType: 'maxScreenThreshold',
      lodMetricValue: 1,
      children: []
    });
    await loading.settled();
    expect(current.state.tileset3d.root.isDestroyed()).toBe(false);
    expect(callbacks.onFitBounds).toHaveBeenCalledTimes(1);
    expect(console.error).not.toHaveBeenCalled();
    current.finalizeState(current.context);
    await Promise.resolve();
  });

  test('reports current initialization failure and releases its tileset', async () => {
    const initialization = deferred();
    (Tileset3D as jest.Mock).mockImplementationOnce(() => ({
      tilesetInitializationPromise: initialization.promise,
      destroy: jest.fn()
    }));
    (load as jest.Mock).mockResolvedValueOnce({});
    const {layer, callbacks, renderToken} = createLayer();
    const current = renderToken();
    const loading = mount(current);
    await Promise.resolve(); // Deck consumes the mocked root response.
    const tileset = current.state.tileset3d;
    initialization.reject(new Error('invalid bounding volume'));
    await loading.settled();
    expect(current.state.tileset3d).toBeNull();
    expect(tileset.destroy).toHaveBeenCalledTimes(1);
    expect(layer.tilesetLoadError).toBe('generic');
    expect(callbacks.onFitBounds).not.toHaveBeenCalled();
  });
});
