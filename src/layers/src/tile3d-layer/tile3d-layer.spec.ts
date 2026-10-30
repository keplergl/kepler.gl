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
  Tileset3D: jest.fn().mockImplementation(data => ({...data, destroy: jest.fn()}))
}));

function deferred() {
  let resolve!: (value: unknown) => void;
  let reject!: (error: Error) => void;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return {promise, resolve, reject};
}

function createLayer() {
  const layer = new Tile3DLayer({id: 'tiles', dataId: 'tiles'});
  const rendered = layer.renderLayer({
    data: {tile3dUrl: 'https://example.com/tileset.json'},
    mapState: {},
    visible: true,
    idx: 0
  })[0];
  const deckLayer: any = rendered.clone({
    loader: {id: 'test-loader'},
    loadOptions: {token: 'old'},
    onTilesetLoad: jest.fn(),
    onTilesetError: jest.fn()
  } as any);
  deckLayer.initializeState();
  deckLayer.context = {
    resourceManager: {unsubscribe: jest.fn()},
    layerManager: {setNeedsUpdate: jest.fn()}
  };
  // Supply the non-rendering parts required by deck's real state-transfer lifecycle.
  deckLayer.internalState = {
    changeFlags: {},
    setAsyncProps: jest.fn(),
    getOldProps: () => deckLayer.props,
    uniformTransitions: {clear: jest.fn()},
    finalize: jest.fn()
  };
  return deckLayer;
}

function transferLayer(previous: any, overrides = {}) {
  const next = previous.clone(overrides);
  next.context = previous.context;
  next._diffProps = jest.fn();
  next._transferState(previous);
  return next;
}

function retryWithToken(previous: any) {
  const next = transferLayer(previous, {loadOptions: {token: 'new'}});
  const loading = jest.spyOn(next, '_loadTileset');
  next.updateState({
    props: next.props,
    oldProps: previous.props,
    changeFlags: {propsChanged: true}
  });
  return {layer: next, completion: loading.mock.results[0].value};
}

describe('3D tileset request ownership', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test.each(['success', 'failure'])(
    'ignores stale %s after a transferred token retry succeeds',
    async outcome => {
      const oldRequest = deferred();
      const newRequest = deferred();
      (load as jest.Mock)
        .mockReturnValueOnce(oldRequest.promise)
        .mockReturnValueOnce(newRequest.promise);
      const oldLayer = createLayer();
      const oldCompletion = oldLayer._loadTileset(oldLayer.props.data);
      const {layer: current, completion} = retryWithToken(oldLayer);

      newRequest.resolve({id: 'current'});
      await completion;
      const accepted = current.state.tileset3d;
      const cachedLayers = {current: {layer: {id: 'current-mesh'}}};
      current.state.layerMap = cachedLayers;
      expect(accepted.id).toBe('current');

      if (outcome === 'success') oldRequest.resolve({id: 'obsolete'});
      else oldRequest.reject(new Error('401 old token'));
      await oldCompletion;

      expect(current.state.tileset3d).toBe(accepted);
      expect(current.state.layerMap).toBe(cachedLayers);
      expect(accepted.destroy).not.toHaveBeenCalled();
      expect(current.state._tilesetLoadFailed).toBe(false);
      expect(current.props.onTilesetLoad).toHaveBeenCalledTimes(1);
      expect(current.props.onTilesetLoad).toHaveBeenCalledWith(accepted);
      expect(current.props.onTilesetError).not.toHaveBeenCalledWith('token');
      expect(console.error).not.toHaveBeenCalled();
      expect(Tileset3D).toHaveBeenCalledTimes(1);
    }
  );

  test.each(['success', 'failure'])(
    'ignores stale %s while the transferred retry is pending',
    async outcome => {
      const oldRequest = deferred();
      const newRequest = deferred();
      (load as jest.Mock)
        .mockReturnValueOnce(oldRequest.promise)
        .mockReturnValueOnce(newRequest.promise);
      const oldLayer = createLayer();
      const oldCompletion = oldLayer._loadTileset(oldLayer.props.data);
      const {layer: current, completion} = retryWithToken(oldLayer);

      if (outcome === 'success') oldRequest.resolve({id: 'obsolete'});
      else oldRequest.reject(new Error('401 old token'));
      await oldCompletion;
      expect(current.state.tileset3d).toBeNull();
      expect(current.state._tilesetLoadFailed).toBe(false);
      expect(current.props.onTilesetLoad).not.toHaveBeenCalled();
      expect(current.props.onTilesetError).not.toHaveBeenCalledWith('token');

      newRequest.resolve({id: 'current'});
      await completion;
      expect(current.state.tileset3d.id).toBe('current');
      expect(current.props.onTilesetLoad).toHaveBeenCalledTimes(1);
    }
  );

  test('keeps the original request current when deck rematches without a token change', async () => {
    const request = deferred();
    (load as jest.Mock).mockReturnValueOnce(request.promise);
    const oldLayer = createLayer();
    const completion = oldLayer._loadTileset(oldLayer.props.data);
    const current = transferLayer(oldLayer);
    current.updateState({
      props: current.props,
      oldProps: oldLayer.props,
      changeFlags: {propsChanged: true}
    });

    request.resolve({id: 'current'});
    await completion;
    expect(load).toHaveBeenCalledTimes(1);
    expect(current.state.tileset3d.id).toBe('current');
    expect(current.props.onTilesetLoad).toHaveBeenCalledWith(current.state.tileset3d);
  });

  test.each([
    ['401 Unauthorized', 'token'],
    ['invalid bounding volume', 'generic']
  ])(
    'reports the current error %s and clears it on successful token retry',
    async (message, kind) => {
      (load as jest.Mock).mockRejectedValueOnce(new Error(message));
      const oldLayer = createLayer();
      await oldLayer._loadTileset(oldLayer.props.data);
      expect(oldLayer.state.tileset3d).toBeNull();
      expect(oldLayer.state._tilesetLoadFailed).toBe(true);
      expect(oldLayer.props.onTilesetError).toHaveBeenLastCalledWith(kind);

      (load as jest.Mock).mockResolvedValueOnce({id: 'retry'});
      const {layer: current, completion} = retryWithToken(oldLayer);
      await completion;
      expect(current.state.tileset3d.id).toBe('retry');
      expect(current.state._tilesetLoadFailed).toBe(false);
      expect(current.props.onTilesetError).toHaveBeenLastCalledWith(null);
    }
  );

  test('does not hide the current token error when an old request succeeds later', async () => {
    const oldRequest = deferred();
    (load as jest.Mock)
      .mockReturnValueOnce(oldRequest.promise)
      .mockRejectedValueOnce(new Error('401 current token'));
    const oldLayer = createLayer();
    const oldCompletion = oldLayer._loadTileset(oldLayer.props.data);
    const {layer: current, completion} = retryWithToken(oldLayer);
    await completion;
    oldRequest.resolve({id: 'obsolete'});
    await oldCompletion;

    expect(current.state.tileset3d).toBeNull();
    expect(current.state._tilesetLoadFailed).toBe(true);
    expect(current.props.onTilesetError).toHaveBeenLastCalledWith('token');
    expect(current.props.onTilesetLoad).not.toHaveBeenCalled();
  });

  test('destroys an accepted tileset once when the token changes', async () => {
    (load as jest.Mock).mockResolvedValueOnce({id: 'old'}).mockResolvedValueOnce({id: 'new'});
    const oldLayer = createLayer();
    await oldLayer._loadTileset(oldLayer.props.data);
    const oldTileset = oldLayer.state.tileset3d;
    const {layer: current, completion} = retryWithToken(oldLayer);
    await completion;

    expect(oldTileset.destroy).toHaveBeenCalledTimes(1);
    expect(current.state.tileset3d.id).toBe('new');
    expect(current.state.tileset3d.destroy).not.toHaveBeenCalled();
  });

  test.each(['success', 'failure'])(
    'ignores pending %s after finalization of the replacement instance',
    async outcome => {
      const request = deferred();
      (load as jest.Mock).mockReturnValueOnce(request.promise);
      const oldLayer = createLayer();
      const completion = oldLayer._loadTileset(oldLayer.props.data);
      const current = transferLayer(oldLayer);
      current.finalizeState(current.context);
      if (outcome === 'success') request.resolve({id: 'obsolete'});
      else request.reject(new Error('401 old token'));
      await completion;

      expect(current.state.tileset3d).toBeNull();
      expect(current.props.onTilesetLoad).not.toHaveBeenCalled();
      expect(current.props.onTilesetError).not.toHaveBeenCalled();
      expect(console.error).not.toHaveBeenCalled();
      expect(Tileset3D).not.toHaveBeenCalled();
    }
  );

  test('preserves loader preload URLs, authorization headers, and tileset options', async () => {
    (load as jest.Mock).mockResolvedValueOnce({id: 'current'});
    const preload = jest.fn().mockResolvedValue({
      url: 'https://example.com/resolved-tileset.json',
      headers: {Authorization: 'Bearer resolved-token'}
    });
    const loader = {id: 'preload-test', preload};
    const current = transferLayer(createLayer(), {
      loaders: [loader],
      loadOptions: {
        token: 'configured-token',
        core: {fetch: {credentials: 'include'}},
        tileset: {maximumScreenSpaceError: 16}
      }
    });
    await current._loadTileset(current.props.data);

    expect(preload).toHaveBeenCalledWith(current.props.data, current.props.loadOptions);
    expect(load).toHaveBeenCalledWith('https://example.com/resolved-tileset.json', loader, {
      token: 'configured-token',
      core: {fetch: {credentials: 'include', headers: {Authorization: 'Bearer resolved-token'}}}
    });
    expect(Tileset3D).toHaveBeenCalledWith(
      {id: 'current'},
      expect.objectContaining({
        maximumScreenSpaceError: 16,
        onTileLoad: expect.any(Function),
        onTileUnload: expect.any(Function),
        onTileError: current.props.onTileError,
        onUpdate: expect.any(Function)
      })
    );
    expect(current.props.onTilesetLoad).toHaveBeenCalledWith(current.state.tileset3d);
  });

  test('does not fetch with stale credentials when an old preload finishes last', async () => {
    const oldPreload = deferred();
    const preload = jest.fn().mockReturnValueOnce(oldPreload.promise).mockResolvedValueOnce({});
    (load as jest.Mock).mockResolvedValueOnce({id: 'current'});
    const oldLayer = transferLayer(createLayer(), {loader: {id: 'preload-test', preload}});
    const oldCompletion = oldLayer._loadTileset(oldLayer.props.data);
    const {layer: current, completion} = retryWithToken(oldLayer);
    await completion;
    oldPreload.resolve({url: 'https://example.com/old-token-tileset.json'});
    await oldCompletion;

    expect(load).toHaveBeenCalledTimes(1);
    expect(current.state.tileset3d.id).toBe('current');
    expect(current.props.onTilesetLoad).toHaveBeenCalledTimes(1);
  });
});
