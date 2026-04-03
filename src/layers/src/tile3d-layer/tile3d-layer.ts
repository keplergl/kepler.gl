// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Tile3DLayer as DeckTile3DLayer} from '@deck.gl/geo-layers';
import {UpdateParameters} from '@deck.gl/core';
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

  // deck.gl's ScenegraphLayer does not recreate its models when
  // defaultShaderModules change (extensionsChanged flag).  This means
  // adding/removing the Light & Shadow effect after tiles are loaded
  // leaves ScenegraphLayer sublayers without the shadow shader module.
  // Work around this by clearing the sublayer cache when shader modules
  // change, forcing sublayers to be recreated with the correct modules.
  updateState(params: UpdateParameters<this>): void {
    super.updateState(params);
    if (params.changeFlags.extensionsChanged) {
      const {layerMap} = this.state as any;
      if (layerMap) {
        for (const key of Object.keys(layerMap)) {
          layerMap[key].layer = null;
          layerMap[key].needsUpdate = true;
        }
      }
    }
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
          isVisible: true
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
    this.updateMeta({provider});
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
    const isGoogle = getTile3DProviderFromUrl(tileUrl) === TILE3D_PROVIDERS.google;

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
        this.updateMeta({
          googleAttribution: title
        });
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
        pointSize: visConfig.pointSize ?? 2,
        pickable: false,
        opacity: visConfig.opacity ?? 1,
        extensions: EMPTY_EXTENSIONS,
        parameters: DEPTH_TEST_PARAMS
      })
    ];
  }
}
