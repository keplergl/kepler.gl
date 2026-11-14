// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import Tile3DLayer, {tile3dLoadErrorKind} from './tile3d-layer';
import {LightingEffect, COORDINATE_SYSTEM} from '@deck.gl/core';
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

// Model.draw submits every uniform block on every frame. Keep static tile
// materials on the GPU while camera uniforms change.
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

// Tile headers and callbacks do not require a WebGL device. Keep the real layer
// metadata updates and mock only the external tileset payload/callback boundary.
describe('3D tile metadata and material lifecycle', () => {
  const tileset = (overrides: Record<string, unknown> = {}) =>
    ({url: URL, options: {}, ...overrides} as unknown as Parameters<
      Tile3DLayer['_onTilesetLoad']
    >[0]);
  const tile = (content: Record<string, unknown>) =>
    ({content} as unknown as Parameters<Tile3DLayer['_onTileLoad']>[0]);

  test('uses root bounds rather than center estimates and fits only once', () => {
    const layer = new Tile3DLayer({dataId: 'tiles'});
    const onFitBounds = jest.fn();
    render(layer, 'token-A', {layerCallbacks: {onFitBounds}});
    layer._onTilesetLoad(
      tileset({
        root: {
          boundingBox: [
            [-122, 37, -10],
            [-121, 38, 100]
          ]
        },
        cartographicCenter: [0, 0, 0],
        zoom: 2
      })
    );
    expect(layer.meta.bounds).toEqual([-122, 37, -121, 38]);
    expect(onFitBounds).toHaveBeenCalledWith([-122, 37, -121, 38]);
    layer._onTilesetLoad(
      tileset({
        root: {
          boundingBox: [
            [1, 2, 3],
            [4, 5, 6]
          ]
        }
      })
    );
    expect(layer.meta.bounds).toEqual([1, 2, 4, 5]);
    expect(onFitBounds).toHaveBeenCalledTimes(1);
  });

  test('falls back from a throwing bounding box to cartographic bounds', () => {
    const layer = new Tile3DLayer({dataId: 'tiles'});
    const root = {
      get boundingBox() {
        throw new Error('invalid volume');
      }
    };
    layer._extractBoundsFromTileset(tileset({root, cartographicCenter: [30, 40, 100], zoom: 2}));
    expect(layer.meta.bounds).toEqual([-15, -5, 75, 85]);
  });

  test('uses default zoom for center-only metadata and leaves missing bounds unset', () => {
    const layer = new Tile3DLayer({dataId: 'tiles'});
    layer._extractBoundsFromTileset(tileset());
    expect(layer.meta.bounds).toBeUndefined();
    layer._extractBoundsFromTileset(
      tileset({root: {boundingBox: []}, cartographicCenter: [10, 20]})
    );
    const span = 180 / 2 ** 14;
    expect(layer.meta.bounds).toEqual([10 - span, 20 - span, 10 + span, 20 + span]);
  });

  test('does not consume the first fit when a tileset has no bounds', () => {
    const layer = new Tile3DLayer({dataId: 'tiles'});
    const onFitBounds = jest.fn();
    render(layer, 'token-A', {layerCallbacks: {onFitBounds}});
    layer._onTilesetLoad(tileset());
    expect(onFitBounds).not.toHaveBeenCalled();
    layer._onTilesetLoad(tileset({cartographicCenter: [10, 20], zoom: 2}));
    expect(onFitBounds).toHaveBeenCalledTimes(1);
  });

  test('does not auto-fit Google global tiles and deduplicates selected tile credits', () => {
    const layer = new Tile3DLayer({dataId: 'tiles'});
    const onFitBounds = jest.fn();
    render(layer, 'token-A', {layerCallbacks: {onFitBounds}});
    const google = tileset({
      url: 'https://tile.googleapis.com/v1/3dtiles/root.json',
      cartographicCenter: [0, 0]
    });
    layer._onTilesetLoad(google);
    expect(onFitBounds).not.toHaveBeenCalled();
    const selected = [
      tile({gltf: {asset: {copyright: 'A;B'}}}),
      tile({gltf: {asset: {copyright: 'B;C'}}}),
      tile({})
    ];
    const traverse = google.options.onTraversalComplete;
    if (!traverse) throw new Error('Google traversal callback was not installed');
    expect(traverse(selected)).toBe(selected);
    expect(layer.meta.attribution.title).toBe('A; B; C');
    const update = jest.spyOn(layer, 'updateMeta');
    traverse(selected);
    expect(update).not.toHaveBeenCalled();
    traverse([tile({gltf: {asset: {copyright: 'C'}}})]);
    expect(layer.meta.attribution.title).toBe('C');
    traverse([]);
    expect(layer.meta.attribution.title).toBe('');
  });

  test('successful load clears a previous error and notifies recovery once', () => {
    const layer = new Tile3DLayer({dataId: 'tiles'});
    const onTilesetLoadError = jest.fn();
    render(layer, 'token-A', {layerCallbacks: {onTilesetLoadError}});
    layer._onTilesetError(null);
    expect(onTilesetLoadError).not.toHaveBeenCalled();
    layer._onTilesetError('token');
    expect(layer.tilesetLoadError).toBe('token');
    layer._onTilesetLoad(tileset());
    expect(layer.tilesetLoadError).toBeNull();
    expect(onTilesetLoadError.mock.calls).toEqual([['token'], [null]]);
    layer._onTilesetLoad(tileset());
    expect(onTilesetLoadError).toHaveBeenCalledTimes(2);
  });

  test('fills missing I3S factors without overwriting zero or configured material values', () => {
    const layer = new Tile3DLayer({dataId: 'tiles'});
    const missing = {baseColorFactor: [1, 0, 0, 1]};
    const configured = {metallicFactor: 0.7, roughnessFactor: 0};
    layer._onTileLoad(tile({material: {pbrMetallicRoughness: missing}}));
    layer._onTileLoad(tile({material: {pbrMetallicRoughness: configured}}));
    expect(missing).toEqual({baseColorFactor: [1, 0, 0, 1], metallicFactor: 0, roughnessFactor: 1});
    expect(configured).toEqual({metallicFactor: 0.7, roughnessFactor: 0});
    const withoutMaterial = tile({});
    expect(() => layer._onTileLoad(withoutMaterial)).not.toThrow();
    expect(withoutMaterial.content).toEqual({});
  });
});

describe('3D tile loading error classification', () => {
  test.each([400, 401, 403])('recognizes HTTP %s even without a message', status => {
    expect(tile3dLoadErrorKind({status})).toBe('token');
  });
  test.each(['HTTP 401', 'Invalid API key', 'Expired access token', 'Unauthorized', 'Forbidden'])(
    'recognizes credential error %s',
    message => {
      expect(tile3dLoadErrorKind(new Error(message))).toBe('token');
    }
  );
  test.each([
    null,
    undefined,
    {status: 500},
    new Error('network disconnected'),
    'tile 14003 missing'
  ])('keeps non-credential failures generic: %s', error => {
    expect(tile3dLoadErrorKind(error)).toBe('generic');
  });
});

// Exercise the custom deck lifecycle without network requests or a GPU. The
// superclass loader is the external boundary; Kepler's race/error guards run.
describe('3D tile asynchronous lifecycle', () => {
  function deckLayer() {
    const layer: any = render(new Tile3DLayer({dataId: 'tiles'}));
    layer.initializeState();
    layer.context = {timeline: {}};
    return layer;
  }

  function deferred() {
    let resolve!: () => void;
    let reject!: (error: Error) => void;
    const promise = new Promise<void>((yes, no) => {
      resolve = yes;
      reject = no;
    });
    return {promise, resolve, reject};
  }

  function mockLoad(layer: any, implementation: (this: any, url: string) => Promise<void>) {
    const parent = Object.getPrototypeOf(Object.getPrototypeOf(layer));
    return jest.spyOn(parent, '_loadTileset').mockImplementation(implementation as any);
  }

  afterEach(() => jest.restoreAllMocks());

  test('failed loads stop the spinner, report the error, and clear cached tiles', async () => {
    const owner = new Tile3DLayer({dataId: 'tiles'});
    const onTilesetLoadError = jest.fn();
    const layer: any = render(owner, 'token-A', {layerCallbacks: {onTilesetLoadError}});
    layer.initializeState();
    layer.state.layerMap = {old: {layer: {}}};
    const error = new Error('Unauthorized');
    mockLoad(layer, async () => {
      throw error;
    });
    const log = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    await layer._loadTileset(URL);
    await Promise.resolve();
    expect(layer.isLoaded).toBe(true);
    expect(layer.state.tileset3d).toBeNull();
    expect(layer.state.layerMap).toEqual({});
    expect(onTilesetLoadError).toHaveBeenLastCalledWith('token');
    expect(log).toHaveBeenCalledWith('Tile3DLayer: tileset load error', error);
  });

  test('retry disposes the old tileset and clears the failed state before loading', async () => {
    const layer = deckLayer();
    const old = {destroy: jest.fn()};
    layer.state.tileset3d = old;
    layer.state._tilesetLoadFailed = true;
    layer.state.layerMap = {old: {layer: {}}};
    const pending = deferred();
    mockLoad(layer, () => pending.promise);
    const request = layer._loadTileset(URL);
    expect(old.destroy).toHaveBeenCalledTimes(1);
    expect(layer.state.tileset3d).toBeNull();
    expect(layer.state.layerMap).toEqual({});
    expect(layer.state._tilesetLoadFailed).toBe(false);
    expect(layer.isLoaded).toBe(false);
    pending.resolve();
    await request;
  });

  test('a late successful old request cannot overwrite an accepted newer tileset', async () => {
    const layer = deckLayer();
    const oldRequest = deferred();
    const newRequest = deferred();
    const stale = {destroy: jest.fn()};
    const current = {destroy: jest.fn()};
    mockLoad(layer, async function (url) {
      await (url === 'old' ? oldRequest.promise : newRequest.promise);
      this.setState({tileset3d: url === 'old' ? stale : current});
    });
    const oldLoad = layer._loadTileset('old');
    const newLoad = layer._loadTileset('new');
    newRequest.resolve();
    await newLoad;
    oldRequest.resolve();
    await oldLoad;
    expect(layer.state.tileset3d).toBe(current);
    expect(stale.destroy).toHaveBeenCalledTimes(1);
    expect(current.destroy).not.toHaveBeenCalled();
  });

  test('an old success is discarded while the newer request is still pending', async () => {
    const layer = deckLayer();
    const oldRequest = deferred();
    const newRequest = deferred();
    const stale = {destroy: jest.fn()};
    const current = {destroy: jest.fn()};
    mockLoad(layer, async function (url) {
      await (url === 'old' ? oldRequest.promise : newRequest.promise);
      this.setState({tileset3d: url === 'old' ? stale : current});
    });
    const oldLoad = layer._loadTileset('old');
    const newLoad = layer._loadTileset('new');
    oldRequest.resolve();
    await oldLoad;
    expect(layer.state.tileset3d).toBeNull();
    expect(stale.destroy).toHaveBeenCalledTimes(1);
    newRequest.resolve();
    await newLoad;
    expect(layer.state.tileset3d).toBe(current);
  });

  test('a late failure from an old request does not mark a newer load as failed', async () => {
    const layer = deckLayer();
    const oldRequest = deferred();
    const current = {destroy: jest.fn()};
    mockLoad(layer, async function (url) {
      if (url === 'old') await oldRequest.promise;
      else this.setState({tileset3d: current});
    });
    const log = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    const oldLoad = layer._loadTileset('old');
    await layer._loadTileset('new');
    oldRequest.reject(new Error('old credentials rejected'));
    await oldLoad;
    expect(layer.state.tileset3d).toBe(current);
    expect(layer.state._tilesetLoadFailed).toBe(false);
    expect(log).not.toHaveBeenCalled();
  });

  test('tile selection records a new frame but does not repeat state writes for that frame', async () => {
    const layer = deckLayer();
    const viewport = {id: 'map'};
    const selectTiles = jest.fn().mockResolvedValue(5);
    layer.state.tileset3d = {selectTiles};
    const setState = jest.spyOn(layer, 'setState');
    layer._updateTileset({map: viewport});
    await Promise.resolve();
    expect(selectTiles).toHaveBeenCalledWith([viewport]);
    expect(layer.state.frameNumber).toBe(5);
    setState.mockClear();
    layer._updateTileset({map: viewport});
    await Promise.resolve();
    expect(setState).not.toHaveBeenCalled();
  });

  test('selection failures are caught without discarding the last renderable frame', async () => {
    const layer = deckLayer();
    const error = new Error('invalid bounding volume');
    layer.state.frameNumber = 4;
    layer.state.tileset3d = {selectTiles: jest.fn().mockRejectedValue(error)};
    const log = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    layer._updateTileset({map: {id: 'map'}});
    await Promise.resolve();
    await Promise.resolve();
    expect(log).toHaveBeenCalledWith('Tile3DLayer: selectTiles error', error);
    expect(layer.state.frameNumber).toBe(4);
  });

  test('selection waits for both an active viewport and a timeline', () => {
    const layer = deckLayer();
    const selectTiles = jest.fn();
    layer.state.tileset3d = {selectTiles};
    layer._updateTileset(null);
    layer._updateTileset({});
    layer.context = {};
    layer._updateTileset({map: {id: 'map'}});
    expect(selectTiles).not.toHaveBeenCalled();
  });

  test('exports request higher detail using configured screen-space error', async () => {
    const layer = deckLayer();
    layer.context.deck = {props: {_isExport: true}};
    layer.state.tileset3d = {
      options: {maximumScreenSpaceError: 12},
      selectTiles: jest.fn().mockResolvedValue(1)
    };
    layer._updateTileset({map: {id: 'map'}});
    await Promise.resolve();
    expect(layer.state.tileset3d.memoryAdjustedScreenSpaceError).toBe(6);
  });

  test('interactive selection preserves its adaptive screen-space error', async () => {
    const layer = deckLayer();
    layer.state.tileset3d = {
      memoryAdjustedScreenSpaceError: 20,
      selectTiles: jest.fn().mockResolvedValue(1)
    };
    layer._updateTileset({map: {id: 'map'}});
    await Promise.resolve();
    expect(layer.state.tileset3d.memoryAdjustedScreenSpaceError).toBe(20);
  });
});

// The superclass readiness/render boundary is isolated here so these assertions
// concern Kepler's export and compatibility policy rather than GPU availability.
describe('3D tile export and lighting transitions', () => {
  function initialized() {
    const layer: any = render(new Tile3DLayer({dataId: 'tiles'}));
    layer.initializeState();
    layer.context = {deck: {props: {}}};
    return layer;
  }
  afterEach(() => jest.restoreAllMocks());

  test('export waits for selected tiles only, then becomes ready when their sublayers exist', () => {
    const layer = initialized();
    const parent = Object.getPrototypeOf(Object.getPrototypeOf(layer));
    jest.spyOn(parent, 'isLoaded', 'get').mockReturnValue(true);
    layer.context.deck.props._isExport = true;
    layer.state.tileset3d = {
      tiles: [
        {id: 'visible', selected: true},
        {id: 'offscreen', selected: false}
      ]
    };
    expect(layer.isLoaded).toBe(false);
    layer.state.layerMap.visible = {layer: {}};
    expect(layer.isLoaded).toBe(true);
    layer.state.layerMap = {};
    layer.context.deck.props._isExport = false;
    expect(layer.isLoaded).toBe(true);
  });

  test('export cannot become ready before the superclass finishes loading', () => {
    const layer = initialized();
    const parent = Object.getPrototypeOf(Object.getPrototypeOf(layer));
    jest.spyOn(parent, 'isLoaded', 'get').mockReturnValue(false);
    layer.context.deck.props._isExport = true;
    layer.state.tileset3d = {tiles: []};
    expect(layer.isLoaded).toBe(false);
  });

  test('enabling and disabling shadow lighting invalidates cached tile materials once', () => {
    const layer = initialized();
    const effect = new LightingEffect();
    Object.assign(effect, {shadow: true});
    const tile = {layer: {}, needsUpdate: false};
    layer.state.layerMap = {tile};
    const params = {props: layer.props, oldProps: layer.props, changeFlags: {}};
    layer.context.deck.props.effects = [effect];
    expect(layer.shouldUpdateState(params)).toBe(true);
    layer.updateState(params);
    expect(tile.needsUpdate).toBe(true);
    expect(layer.shouldUpdateState(params)).toBe(false);
    tile.needsUpdate = false;
    Object.assign(effect, {shadow: false});
    expect(layer.shouldUpdateState(params)).toBe(true);
    layer.updateState(params);
    expect(tile.needsUpdate).toBe(true);
    expect(layer.state._lightingWasActive).toBe(false);
  });

  test('extension changes invalidate cached tiles even with unchanged props', () => {
    const layer = initialized();
    const first = {layer: {}, needsUpdate: false};
    const second = {layer: {}, needsUpdate: false};
    layer.state.layerMap = {first, second};
    layer.updateState({
      props: layer.props,
      oldProps: layer.props,
      changeFlags: {extensionsChanged: true}
    });
    expect(first.needsUpdate).toBe(true);
    expect(second.needsUpdate).toBe(true);
  });

  test('normalizes legacy I3S coordinate systems before rendering and preserves modern values', () => {
    const layer = initialized();
    const parent = Object.getPrototypeOf(Object.getPrototypeOf(layer));
    const systems = [-1, 0, 1, 2, 3, 999, COORDINATE_SYSTEM.LNGLAT];
    const tiles = systems.map(coordinateSystem => ({content: {coordinateSystem}}));
    layer.state.tileset3d = {tiles: [...tiles, {}]};
    const renderBase = jest.spyOn(parent, 'renderLayers').mockReturnValue([]);
    expect(layer.renderLayers()).toEqual([]);
    expect(tiles.map(tile => tile.content.coordinateSystem)).toEqual([
      COORDINATE_SYSTEM.DEFAULT,
      COORDINATE_SYSTEM.CARTESIAN,
      COORDINATE_SYSTEM.LNGLAT,
      COORDINATE_SYSTEM.METER_OFFSETS,
      COORDINATE_SYSTEM.LNGLAT_OFFSETS,
      COORDINATE_SYSTEM.METER_OFFSETS,
      COORDINATE_SYSTEM.LNGLAT
    ]);
    expect(renderBase).toHaveBeenCalledTimes(1);
  });
});
