// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Tile3DLayer as DeckTile3DLayer} from '@deck.gl/geo-layers';
import {Tiles3DLoader, CesiumIonLoader} from '@loaders.gl/3d-tiles';
import {I3SLoader} from '@loaders.gl/i3s';
import {Tileset3D, Tile3D} from '@loaders.gl/tiles';

import Layer from '../base-layer';
import Tile3DLayerIcon from './tile3d-layer-icon';
import {FindDefaultLayerPropsReturnValue} from '../layer-utils';
import {
  LAYER_VIS_CONFIGS,
  LAYER_TYPES,
  DatasetType,
  TILE3D_PROVIDERS,
  Tile3DDatasetMetadata
} from '@kepler.gl/constants';
import {KeplerTable as KeplerDataset, Datasets as KeplerDatasets} from '@kepler.gl/table';
import {VisConfigNumber, BindedLayerCallbacks} from '@kepler.gl/types';

// Lazily created patched sublayer classes (see getSubLayerClass below).
let _PatchedMeshLayer: any = null;
let _PatchedScenegraphLayer: any = null;

/**
 * Custom DeckTile3DLayer that catches exceptions in _loadTileset and
 * _updateTileset (which calls selectTiles – an unhandled-promise path
 * where errors like "boundingVolume must contain …" escape).
 * See: https://github.com/visgl/deck.gl/issues/8755
 */
// @ts-expect-error Types have separate declarations of a private property '_loadTileset'.
class KeplerTile3DLayer extends DeckTile3DLayer {
  // @ts-ignore override of private method called by deck.gl internals
  private async _loadTileset(tilesetUrl: string) {
    try {
      // @ts-expect-error _loadTileset is private in DeckTile3DLayer
      await super._loadTileset(tilesetUrl);
    } catch (error: any) {
      if (error?.message?.includes("reading 'refine'")) {
        this.raiseError(new Error('Bad tileset format or invalid API key'), '_loadTileset');
      } else {
        console.error('Tile3DLayer: tileset load error', error);
      }
    }
  }

  /**
   * Override _updateTileset to catch errors from selectTiles(),
   * which deck.gl calls with .then() but no .catch().
   * Errors from tilesetInitializationPromise (e.g. invalid boundingVolume
   * in child tiles) surface here as unhandled promise rejections.
   */
  // @ts-ignore override of private method
  private _updateTileset(viewports: Record<string, any> | null): void {
    if (!viewports) return;
    const {tileset3d} = this.state as any;
    const {timeline} = this.context;
    const viewportsNumber = Object.keys(viewports).length;
    if (!timeline || !viewportsNumber || !tileset3d) return;

    tileset3d
      .selectTiles(Object.values(viewports))
      .then((frameNumber: number) => {
        const tilesetChanged = (this.state as any).frameNumber !== frameNumber;
        if (tilesetChanged) {
          this.setState({frameNumber});
        }
      })
      .catch((error: any) => {
        console.error('Tile3DLayer: selectTiles error', error);
      });
  }

  // deck.gl's ScenegraphLayer and MeshLayer do not correctly handle
  // defaultShaderModule changes (extensionsChanged flag):
  //
  // ScenegraphLayer (Google/Cesium 3D tiles): models are created by
  // luma.gl's GLTF pipeline with shader modules baked in.
  // updateState only recreates models when the scenegraph *prop*
  // changes, completely ignoring extensionsChanged. When the shadow
  // module is added/removed, existing models keep their old shaders.
  //
  // MeshLayer (ArcGIS/I3S): getModel() creates the GPU model with PBR
  // shader defines (HAS_BASECOLORMAP etc.) but does not set the
  // corresponding texture bindings (pbr_baseColorSampler etc.).
  // updateState only calls updatePbrMaterialUniforms when pbrMaterial
  // *prop* changes, not when the model is recreated via
  // extensionsChanged. luma.gl skips rendering ("Binding … not found").
  //
  // Fix: override getSubLayerClass to return patched sublayer classes.
  // @ts-ignore protected override
  protected getSubLayerClass(id: string, DefaultClass: any): any {
    if (id === 'mesh') {
      if (!_PatchedMeshLayer) {
        _PatchedMeshLayer = class extends DefaultClass {
          updateState(params) {
            super.updateState(params);
            if (params.changeFlags.extensionsChanged && this.state?.model) {
              this.updatePbrMaterialUniforms(this.props.pbrMaterial);
            }
          }
        };
        (_PatchedMeshLayer as any).layerName = DefaultClass.layerName || 'MeshLayer';
        (_PatchedMeshLayer as any).defaultProps = DefaultClass.defaultProps;
      }
      return _PatchedMeshLayer;
    }
    if (id === 'scenegraph') {
      if (!_PatchedScenegraphLayer) {
        _PatchedScenegraphLayer = class extends DefaultClass {
          updateState(params) {
            super.updateState(params);
            if (params.changeFlags.extensionsChanged && this.state?.scenegraph) {
              this._updateScenegraph();
            }
          }
        };
        (_PatchedScenegraphLayer as any).layerName = DefaultClass.layerName || 'ScenegraphLayer';
        (_PatchedScenegraphLayer as any).defaultProps = DefaultClass.defaultProps;
      }
      return _PatchedScenegraphLayer;
    }
    return super.getSubLayerClass(id, DefaultClass);
  }

  /**
   * During video export (preserveDrawingBuffer), report the layer as not loaded
   * until every selected tile has a renderable sublayer.  Hubble.gl's
   * DeckAdapter.onAfterRender checks layer.isLoaded on every top-level layer
   * before capturing a frame, so returning false here makes it wait until the
   * LOD transition is complete — no frame is captured with missing tiles.
   */
  get isLoaded(): boolean {
    const baseLoaded = super.isLoaded;
    if (!baseLoaded) {
      return false;
    }

    const gl = this.context?.gl;
    const isExporting = gl?.getContextAttributes?.()?.preserveDrawingBuffer;
    if (!isExporting) {
      return true;
    }

    const {tileset3d, layerMap} = this.state as any;
    if (!tileset3d) {
      return true;
    }

    for (const tile of tileset3d.tiles as Tile3D[]) {
      if (!tile.selected) {
        continue;
      }
      const cache = layerMap[tile.id];
      if (!cache?.layer) {
        return false;
      }
    }

    return true;
  }
}
(KeplerTile3DLayer as any).layerName = 'KeplerTile3DLayer';

export const TILE3D_LAYER_TYPE = LAYER_TYPES.tile3d;

export type Tile3DLayerVisConfigSettings = {
  opacity: VisConfigNumber;
  pointSize: VisConfigNumber;
};

export type Tile3DLayerVisConfig = {
  opacity: number;
  pointSize: number;
};

export const tile3DVisConfigs = {
  opacity: {
    ...LAYER_VIS_CONFIGS.opacity,
    defaultValue: 1,
    property: 'opacity'
  } as VisConfigNumber,
  pointSize: {
    type: 'number' as const,
    defaultValue: 2,
    label: 'layerVisConfigs.pointSize',
    isRanged: false,
    range: [0.5, 20],
    step: 0.5,
    group: 'display' as const,
    property: 'pointSize',
    allowCustomValue: false
  } as VisConfigNumber
};

const EMPTY_EXTENSIONS: any[] = [];
const DEPTH_TEST_PARAMS = {depthTest: true};

function getTile3DProviderFromUrl(url = ''): (typeof TILE3D_PROVIDERS)[string] | null {
  for (const key of Object.keys(TILE3D_PROVIDERS)) {
    if (url.includes(TILE3D_PROVIDERS[key].urlKey)) {
      return TILE3D_PROVIDERS[key];
    }
  }
  return null;
}

export default class Tile3DLayer extends Layer {
  declare visConfigSettings: Tile3DLayerVisConfigSettings;

  private _cachedDataAndLoader: {
    data: string;
    loadOptions?: Record<string, unknown>;
    loader?: any;
    _cacheKey?: string;
  } | null = null;

  private _layerCallbacks: BindedLayerCallbacks | null = null;
  private _hasFittedBounds = false;

  constructor(props: {dataId: string} & Record<string, any>) {
    super(props);
    this.registerVisConfig(tile3DVisConfigs);
    this.meta = {};
  }

  static findDefaultLayerProps(dataset: KeplerDataset): FindDefaultLayerPropsReturnValue {
    if (dataset.type !== DatasetType.TILE_3D) {
      return {props: []};
    }

    return {
      props: [
        {
          label: dataset.label,
          isVisible: true,
          color: [255, 255, 255] as [number, number, number]
        }
      ]
    };
  }

  get type(): string {
    return TILE3D_LAYER_TYPE;
  }

  get name(): string {
    return '3D Tile';
  }

  get requireData(): boolean {
    return false;
  }

  get requiredLayerColumns(): string[] {
    return [];
  }

  get layerIcon(): typeof Tile3DLayerIcon {
    return Tile3DLayerIcon;
  }

  get supportedDatasetTypes(): DatasetType[] {
    return [DatasetType.TILE_3D];
  }

  get visualChannels() {
    return {};
  }

  shouldRenderLayer(): boolean {
    return Boolean(this.type && this.config.isVisible);
  }

  getHoverData(): any {
    return null;
  }

  formatLayerData(datasets: KeplerDatasets): Record<string, any> {
    const {dataId} = this.config;
    if (!dataId || !datasets[dataId]) {
      return {};
    }

    const dataset = datasets[dataId];
    this.updateLayerMeta(dataset);
    const metadata = (dataset.metadata || {}) as Tile3DDatasetMetadata;

    return {
      tile3dUrl: metadata.tile3dUrl,
      tile3dAccessToken: metadata.tile3dAccessToken
    };
  }

  updateLayerMeta(dataset: KeplerDataset): void {
    if (dataset.type !== DatasetType.TILE_3D) {
      return;
    }
    const metadata = (dataset.metadata || {}) as Tile3DDatasetMetadata;
    const provider = getTile3DProviderFromUrl(metadata.tile3dUrl);
    this.updateMeta({
      provider,
      attribution: provider?.attribution ?? null
    });
  }

  _getDataAndLoaderOptions(
    tileUrl: string,
    accessToken?: string
  ): {data: string; loadOptions?: Record<string, unknown>; loader?: any} {
    const cacheKey = `${tileUrl}::${accessToken || ''}`;
    if (this._cachedDataAndLoader && this._cachedDataAndLoader._cacheKey === cacheKey) {
      return this._cachedDataAndLoader;
    }

    const provider = getTile3DProviderFromUrl(tileUrl);
    let result: {data: string; loadOptions?: Record<string, unknown>; loader?: any};

    if (provider === TILE3D_PROVIDERS.google) {
      const separator = tileUrl.includes('?') ? '&' : '?';
      result = {
        data: `${tileUrl}${separator}key=${accessToken || ''}`,
        loader: Tiles3DLoader,
        loadOptions: {
          fetch: {headers: {'X-GOOG-API-KEY': accessToken || ''}}
        }
      };
    } else if (provider === TILE3D_PROVIDERS.cesium) {
      result = {
        data: tileUrl,
        loader: CesiumIonLoader,
        loadOptions: {
          'cesium-ion': {accessToken}
        }
      };
    } else if (provider === TILE3D_PROVIDERS.arcgis) {
      result = {
        data: tileUrl,
        loader: I3SLoader,
        loadOptions: {
          i3s: {useCompressedTextures: false}
        }
      };
    } else {
      result = {
        data: tileUrl,
        loader: Tiles3DLoader
      };
    }

    this._cachedDataAndLoader = {...result, _cacheKey: cacheKey};
    return this._cachedDataAndLoader;
  }

  _onTilesetLoad = (tileset3d: Tileset3D): void => {
    this._extractBoundsFromTileset(tileset3d);

    const tileUrl = tileset3d.url || '';
    const provider = getTile3DProviderFromUrl(tileUrl);
    const isGoogle = provider === TILE3D_PROVIDERS.google;

    if (!this._hasFittedBounds && this.meta?.bounds && !isGoogle) {
      this._hasFittedBounds = true;
      this._layerCallbacks?.onFitBounds?.(this.meta.bounds);
    }

    if (isGoogle) {
      tileset3d.options.onTraversalComplete = selectedTiles => {
        const credits = new Set<string>();
        selectedTiles.forEach((tile: Tile3D) => {
          const {copyright} = (tile as any).content?.gltf?.asset || {};
          if (copyright) copyright.split(';').forEach(c => credits.add(c));
        });
        const title = Array.from(credits).join('; ');
        if (this.meta?.attribution?.title !== title) {
          this.updateMeta({
            attribution: {
              ...TILE3D_PROVIDERS.google.attribution,
              title
            }
          });
        }
        return selectedTiles;
      };
    }
  };

  _extractBoundsFromTileset(tileset3d: Tileset3D): void {
    try {
      const root = tileset3d.root;
      if (root) {
        const bbox = (root as any).boundingBox;
        if (bbox && bbox.length === 2) {
          const [min, max] = bbox;
          // bbox = [[westDeg, southDeg, minHeight], [eastDeg, northDeg, maxHeight]]
          this.updateMeta({
            bounds: [min[0], min[1], max[0], max[1]]
          });
          return;
        }
      }
    } catch {
      // boundingBox getter may throw for malformed volumes
    }

    // Fallback: approximate bounds from cartographicCenter and zoom
    const center = tileset3d.cartographicCenter;
    if (center) {
      const lng = center[0];
      const lat = center[1];
      const zoom = tileset3d.zoom || 14;
      // Approximate half-span in degrees based on zoom level
      const span = 180 / Math.pow(2, zoom);
      this.updateMeta({
        bounds: [lng - span, lat - span, lng + span, lat + span]
      });
    }
  }

  _onTileLoad = (tile: Tile3D): void => {
    // I3S materials often lack metallicFactor/roughnessFactor.
    // PBR spec defaults metallicFactor to 1 (fully metallic),
    // causing black surfaces when lighting/shadow effects are active.
    const pbr = tile.content?.material?.pbrMetallicRoughness;
    if (pbr) {
      if (pbr.metallicFactor === undefined) {
        pbr.metallicFactor = 0;
      }
      if (pbr.roughnessFactor === undefined) {
        pbr.roughnessFactor = 1;
      }
    }
  };

  _onTileUnload = (_tile: Tile3D): void => {
    /* noop */
  };

  renderLayer(opts: any): KeplerTile3DLayer[] {
    const {data, layerCallbacks} = opts;
    const {tile3dUrl, tile3dAccessToken} = data || {};
    if (!tile3dUrl) {
      return [];
    }

    this._layerCallbacks = layerCallbacks || null;

    const {visConfig} = this.config;
    const defaultLayerProps = this.getDefaultDeckLayerProps(opts);
    const {
      data: tileData,
      loadOptions,
      loader
    } = this._getDataAndLoaderOptions(tile3dUrl, tile3dAccessToken);

    const {color} = this.config;
    const pointColor: [number, number, number, number] = color
      ? [color[0], color[1], color[2], 255]
      : [255, 255, 255, 255];

    return [
      new KeplerTile3DLayer({
        id: defaultLayerProps.id,
        coordinateSystem: defaultLayerProps.coordinateSystem,
        wrapLongitude: defaultLayerProps.wrapLongitude,
        visible: defaultLayerProps.visible,
        data: tileData,
        loader,
        loadOptions,
        onTilesetLoad: this._onTilesetLoad,
        onTileLoad: this._onTileLoad,
        onTileUnload: this._onTileUnload,
        getPointColor: pointColor,
        pointSize: visConfig.pointSize ?? 2,
        pickable: false,
        opacity: visConfig.opacity ?? 1,
        extensions: EMPTY_EXTENSIONS,
        parameters: DEPTH_TEST_PARAMS
      })
    ];
  }
}
