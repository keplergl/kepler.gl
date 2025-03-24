// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {COORDINATE_SYSTEM, Layer as DeckLayer} from '@deck.gl/core/typed';
import {TileLayer, GeoBoundingBox} from '@deck.gl/geo-layers/typed';
import {Texture2DProps} from '@luma.gl/webgl';
import memoize from 'lodash.memoize';
import {Matrix4} from 'math.gl';

import {DatasetType, RuntimeConfig, LAYER_TYPES} from '@kepler.gl/constants';
import {RasterLayer, RasterMeshLayer} from '@kepler.gl/deckgl-layers';
import {Layer, VisualChannel} from '@kepler.gl/layers';
import {
  LayerBaseConfig,
  LayerColorConfig,
  LayerHeightConfig,
  VisConfigColorRange,
  VisConfigSelection,
  VisConfigBoolean,
  VisConfigInput,
  VisConfigRange,
  VisConfigNumber
} from '@kepler.gl/types';

import {KeplerTable as KeplerDataset} from '@kepler.gl/table';

import {
  rasterVisConfigs,
  PRESET_OPTIONS,
  DATA_SOURCE_COLOR_DEFAULTS,
  DATA_SOURCE_IDS
} from './config';
import {getModules} from './gpu-utils';
import {getSTACImageRequests, loadImages, loadTerrain} from './image';
import RasterIcon from './raster-tile-icon';
import {
  getDataSourceParams,
  getAvailableMosaics,
  isCustomUnfoldedStac,
  getMaxRequests,
  bboxIntersects,
  computeZRange,
  getSTACBounds,
  getEOBands,
  filterAvailablePresets,
  getSingleBandPresetOptions,
  getImageMinMax,
  getMinMaxFromTile2DHeaders
} from './raster-tile-utils';
import {
  GetTileDataCustomProps,
  GetTileDataProps,
  RenderSubLayersProps,
  GetTileDataOutput,
  DataSourceParams,
  KeplerRasterDataset,
  Tile2DHeader,
  PresetOption,
  CompleteSTACObject
} from './types';

import {FindDefaultLayerPropsReturnValue} from '../layer-utils';
import {default as KeplerLayer, LayerBaseConfigPartial} from '../base-layer';

type RasterTileLoadBaseEvent = {
  /* URLs that the tile assets are being requested from. */
  assetUrls: string[];
  /* Tile coordinates [x, y, z]. */
  tileIndex: [number, number, number];
  /* Total number of tiles that are being loaded. */
  remainingTiles: number;
};
type RasterTileLoadProgressEvent = RasterTileLoadBaseEvent & {
  /* Current loading status. */
  status: 'loading' | 'loaded' | 'canceled';
};
type RasterTileLoadErrorEvent = RasterTileLoadBaseEvent & {
  /* Current loading status. */
  status: 'failed';
  /* Error that occurred during loading. */
  error: Error;
};
export type RasterTileLoadEvent = RasterTileLoadProgressEvent | RasterTileLoadErrorEvent;

// Adjust tileSize to devicePixelRatio, but not higher than 2 to reduce requests to server
const devicePixelRatio: number = Math.min(
  2,
  (typeof window !== 'undefined' && window.devicePixelRatio) || 1
);

// Global counter that represents the number of tiles currently being loaded across all the raster tile layers
let tilesBeingLoaded = 0;

export type RasterTileLayerVisConfigSettings = {
  preset: VisConfigSelection;
  mosaicId: VisConfigSelection;
  useSTACSearching: VisConfigBoolean;
  stacSearchProvider: VisConfigSelection;
  startDate: VisConfigInput;
  endDate: VisConfigInput;
  dynamicColor: VisConfigBoolean;
  colormapId: VisConfigSelection;
  colorRange: VisConfigColorRange;
  linearRescalingFactor: VisConfigRange;
  nonLinearRescaling: VisConfigBoolean;
  gammaContrastFactor: VisConfigNumber;
  sigmoidalContrastFactor: VisConfigNumber;
  sigmoidalBiasFactor: VisConfigNumber;
  saturationValue: VisConfigNumber;
  filterEnabled: VisConfigBoolean;
  filterRange: VisConfigRange;
  opacity: VisConfigNumber;
  _stacQuery: VisConfigInput;
  singleBandName: VisConfigSelection;
  enableTerrain: VisConfigBoolean;
};

export default class RasterTileLayer extends Layer {
  declare visConfigSettings: RasterTileLayerVisConfigSettings;

  /** Min bands image data value, based on the current viewport */
  minViewportPixelValue = Infinity;
  /** Max bands image data value, based on the current viewport */
  maxViewportPixelValue = -Infinity;
  /** Memoized method that calculates data source params */

  /** Disable editing of the legends */
  disableLegends = true;

  getDataSourceParams: (
    stac: CompleteSTACObject,
    preset: string,
    presetOptions: PresetOption
  ) => DataSourceParams | null;

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  constructor(props) {
    super(props);
    this.registerVisConfig(rasterVisConfigs);

    // No two STAC ids may be the same within a single collection, though it's conceivably possible
    // across multiple STAC collections there could be an id collision. Note: STAC Collection
    // objects don't have a `collection` key; STAC Item objects have a `collection` key (which
    // matches the collection's `id`).
    const resolver = (stac: CompleteSTACObject, preset: string, presetOptions: PresetOption) =>
      `${stac.id}-${stac.collection}-${preset}-${presetOptions.singleBand?.assetId}-${presetOptions.singleBand?.bandIndex}`;
    this.getDataSourceParams = memoize(
      (stac, preset, presetOptions) => getDataSourceParams(stac, preset, presetOptions),
      resolver
    );

    this.meta = {zRange: null};
  }

  static findDefaultLayerProps(dataset: KeplerDataset): FindDefaultLayerPropsReturnValue {
    if (dataset.type !== DatasetType.RASTER_TILE) {
      return {props: []};
    }

    const newLayerProp = {
      dataId: dataset.id,
      label: dataset.label,
      isVisible: true
    };

    return {props: [newLayerProp]};
  }

  get type(): string {
    return LAYER_TYPES.rasterTile;
  }

  get name(): string {
    return 'Raster Tile';
  }

  get layerIcon(): KeplerLayer['layerIcon'] {
    return RasterIcon;
  }

  get supportedDatasetTypes(): DatasetType[] {
    return [DatasetType.RASTER_TILE];
  }

  get visualChannels(): Record<string, VisualChannel> {
    const {
      visConfig: {
        colorRange: {colorLegends: categoricalColorLegends}
      }
    } = this.config;
    if (categoricalColorLegends) {
      return {
        color: super.visualChannels.color
      };
    } else {
      return {};
    }
  }

  get requireData(): boolean {
    return true;
  }

  getDefaultLayerConfig(
    props: LayerBaseConfigPartial
  ): LayerBaseConfig & Partial<LayerColorConfig & LayerHeightConfig> {
    return {
      ...super.getDefaultLayerConfig(props),
      colorField: {
        analyzerType: '',
        name: 'Category',
        format: '',
        type: 'string',
        fieldIdx: -1,
        valueAccessor: () => '',
        displayName: 'Category'
      }
    };
  }

  getHoverData() {
    return null;
  }

  // We can render without columns, so we redefine this method
  shouldRenderLayer(): boolean {
    return Boolean(this.type && this.config.isVisible);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,  @typescript-eslint/no-unused-vars
  formatLayerData(datasets, oldLayerData) {
    const dataset = datasets[this.config.dataId || ''];

    if (!dataset) {
      return null;
    }

    // call updateData to updateLayerMeta
    const dataUpdateTriggers = this.getDataUpdateTriggers(dataset);
    const triggerChanged = this.getChangedTriggers(dataUpdateTriggers);

    if (triggerChanged && triggerChanged.getMeta) {
      this.updateLayerMeta(dataset);
    }

    return dataset;
  }

  updateLayerMeta(dataset: KeplerRasterDataset): void {
    if (dataset.type !== DatasetType.RASTER_TILE) {
      return;
    }
    const stac = dataset?.metadata;
    const bounds = getSTACBounds(stac);

    if (bounds) {
      // If either a STAC Item (i.e. stac.type === 'Feature') or Planet NICFI, then set map bounds.
      // But we don't want to set bounds for Landsat or Sentinel because it would zoom out to zoom
      // 0, and we don't have low-zoom tiles.
      if (
        stac.type === 'Feature' ||
        (isCustomUnfoldedStac(stac) && stac.id === DATA_SOURCE_IDS.PLANET_NICFI)
      ) {
        this.updateMeta({bounds});
      }
    }
  }

  /**
   * Run when adding a new dataset from the data catalog
   */
  setInitialLayerConfig(dataset: KeplerDataset): RasterTileLayer {
    const stac = dataset?.metadata;

    if (!stac) {
      return this;
    }

    // Set singleBandName if there is only one band
    const availableBands = getEOBands(stac) || [];
    if (availableBands?.length === 1) {
      this.updateLayerVisConfig({singleBandName: availableBands[0].name});
    }

    // Change the preset if the default one is not allowed
    const availablePresets = filterAvailablePresets(stac, PRESET_OPTIONS);
    if (
      availablePresets?.length &&
      !availablePresets?.includes(this.visConfigSettings.preset.defaultValue as string)
    ) {
      this.updateLayerVisConfig({preset: availablePresets[0]});
    }

    if (!isCustomUnfoldedStac(stac)) {
      return this;
    }

    // Set default mosaic
    const availableMosaics = getAvailableMosaics(stac);
    if (Array.isArray(availableMosaics) && availableMosaics.length > 0) {
      this.updateLayerVisConfig({mosaicId: availableMosaics[availableMosaics.length - 1].id});
    }

    // Set default color rescaling
    const colorDefaults = DATA_SOURCE_COLOR_DEFAULTS[stac.id];
    if (colorDefaults) {
      this.updateLayerVisConfig(colorDefaults);
    }

    return this;
  }

  validateVisConfig(dataset: KeplerDataset, visConfig) {
    const stac = dataset?.metadata;

    if (!stac || !isCustomUnfoldedStac(stac)) {
      return {
        ...visConfig,
        // set mosaicId to null
        mosaicId: null
      };
    }

    // Set default mosaic
    let mosaicId;
    const availableMosaics = getAvailableMosaics(stac);

    if (Array.isArray(availableMosaics) && availableMosaics.length > 0) {
      mosaicId = !availableMosaics.some(({id}) => id === visConfig.mosaicId)
        ? availableMosaics[availableMosaics.length - 1].id
        : visConfig.mosaicId;
    } else {
      // no availableMosaics
      mosaicId = null;
    }
    return {
      ...visConfig,
      mosaicId
    };
  }

  /**
   * Update zRange of viewport. This is necessary so that tiles in extruded mode are shown properly
   * at high elevations: https://github.com/foursquare/studio-monorepo/pull/1892/files
   * Derived from https://github.com/visgl/deck.gl/blob/8d824a4b836fee3bfebe6fc962e0f03d8c1dbd0d/modules/geo-layers/src/terrain-layer/terrain-layer.js#L173-L196
   *
   * @param tiles Array of tiles in current viewport
   */
  onViewportLoad(tiles: (Tile2DHeader | null)[]): void {
    this.updateMinMaxPixelValue(tiles);
    const newZRange = computeZRange(tiles);
    if (!newZRange) {
      return;
    }

    const {zRange} = this.meta;
    if (!zRange || newZRange[0] < zRange[0] || newZRange[1] > zRange[1]) {
      this.meta.zRange = newZRange;
    }
  }

  /**
   * Update viewport-related minPxelValue and maxPixelValue
   * @param tiles - deck.gl tiles
   */
  updateMinMaxPixelValue(tiles: (Tile2DHeader | null)[]): void {
    const [min, max] = getMinMaxFromTile2DHeaders(tiles);
    this.minViewportPixelValue = min;
    this.maxViewportPixelValue = max;
  }

  /**
   * Calculate min and max values of input raster band image properties
   * and update `minBandsValue` and `maxBandsValue`
   * @param images - raster band image properties
   * @return [min, max] pixel values for the tile
   */
  getMinMaxPixelValues(images: Texture2DProps[] | null): [number, number] {
    let minPixelValue = Infinity;
    let maxPixelValue = -Infinity;
    if (images) {
      for (const image of images) {
        const [min, max] = getImageMinMax(image.data);
        if (typeof min === 'number') {
          minPixelValue = Math.min(min, minPixelValue);
        }
        if (typeof max === 'number') {
          maxPixelValue = Math.max(max, maxPixelValue);
        }
      }
    }
    return [minPixelValue, maxPixelValue];
  }

  // generate a deck layer
  renderLayer(opts): TileLayer<any>[] {
    const {data, mapState} = opts;
    const stac = data?.metadata;

    // If a tabular dataset is loaded, and then the layer type is switched from Point to Raster Tile
    // layer, this `stac` object will exist but will not be raster metadata
    if (!stac || !stac.stac_version) {
      return [];
    }

    const {visConfig} = this.config;
    const {id, opacity, visible} = this.getDefaultDeckLayerProps(opts);
    const {dragRotate, globe} = mapState;

    const {
      preset,
      colormapId,
      linearRescaling,
      linearRescalingFactor,
      nonLinearRescaling,
      gammaContrastFactor,
      sigmoidalContrastFactor,
      sigmoidalBiasFactor,
      saturationValue,
      filterEnabled,
      filterRange,
      useSTACSearching,
      stacSearchProvider,
      startDate,
      endDate,
      _stacQuery,
      singleBandName,
      colorRange: {colorMap: categoricalColorMap},
      dynamicColor,
      enableTerrain
    } = visConfig;

    const shouldLoadTerrain = Boolean(enableTerrain && dragRotate);

    // This is a hack to support the existing Microsoft Map SDK Demo, where we select between
    // different mosaics through the Map SDK. The choice was previously made to leave the mosaic
    // selection (mosaicId) as part of the visConfig instead of the dataset metadata, so that it's
    // easier to switch between different time periods in the same dataset. However at the moment
    // the Map SDK _addTileset can only modify opts.data, not the visConfig itself.
    //
    // Most of the time this block will never be triggered, because other than temporarily from the
    // Map SDK, landsatMosaic should never exist in a STAC object
    let {mosaicId} = visConfig;
    if (stac.id === DATA_SOURCE_IDS.LANDSAT && stac.landsatMosaic) {
      mosaicId = stac.landsatMosaic;
    }

    if (new Date(endDate) < new Date(startDate)) {
      return [];
    }

    const {bandCombination} = PRESET_OPTIONS[preset];

    const singleBand = getSingleBandPresetOptions(stac, singleBandName);
    const dataSourceParams: DataSourceParams | null = this.getDataSourceParams(stac, preset, {
      singleBand
    });

    if (!dataSourceParams) {
      return [];
    }

    const {
      minZoom,
      maxZoom,
      globalBounds,
      loadAssetIds,
      loadBandIndexes,
      renderBandIndexes,
      dataType,
      minPixelValue: dsMinPixelValue,
      maxPixelValue: dsMaxPixelValue,
      minCategoricalBandValue,
      maxCategoricalBandValue
    } = dataSourceParams;

    const minPixelValue =
      !dynamicColor && Number.isFinite(dsMinPixelValue)
        ? dsMinPixelValue
        : this.minViewportPixelValue;
    const maxPixelValue =
      !dynamicColor && Number.isFinite(dsMaxPixelValue)
        ? dsMaxPixelValue
        : this.maxViewportPixelValue;

    const getTileDataCustomProps: GetTileDataCustomProps = {
      stac,
      loadAssetIds,
      loadBandIndexes,
      mosaicId,
      colormapId,
      shouldLoadTerrain,
      globalBounds,
      useSTACSearching,
      stacSearchProvider,
      startDate,
      endDate,
      _stacQuery,
      categoricalColorMap,
      minCategoricalBandValue,
      maxCategoricalBandValue
    };

    const tileLayer = new TileLayer<any, RenderSubLayersProps>({
      id,
      minZoom,
      maxZoom,
      tileSize: 512 / devicePixelRatio,
      getTileData: (args: any) => this.getTileData({...args, ...getTileDataCustomProps}),
      onViewportLoad: this.onViewportLoad.bind(this),
      // TS doesn't know we'll pass appropriate props here, and
      // in fact there's no guarantee that we will - may be able to fix with Deck 8.9
      renderSubLayers,
      maxRequests: getMaxRequests(stac),
      // Passing visible on to TileLayer is necessary for split view to work
      visible,
      updateTriggers: {
        getTileData: [
          shouldLoadTerrain,
          mosaicId,
          // Colormap has changed
          colormapId,
          // assets to be loaded has changed
          ...loadAssetIds,
          // band indexes to be loaded has changed
          ...loadBandIndexes,
          useSTACSearching,
          stacSearchProvider,
          startDate,
          endDate,
          _stacQuery,
          categoricalColorMap,
          minCategoricalBandValue,
          maxCategoricalBandValue
        ]
      },
      // Props for 3D mode
      ...(shouldLoadTerrain
        ? {
            zRange: this.meta.zRange || null,
            refinementStrategy: 'no-overlap'
          }
        : {}),
      renderBandIndexes,
      opacity,
      linearRescaling,
      linearRescalingFactor,
      nonLinearRescaling,
      minPixelValue,
      maxPixelValue,
      gammaContrastFactor,
      sigmoidalContrastFactor,
      sigmoidalBiasFactor,
      saturationValue,
      bandCombination,
      filterEnabled,
      filterRange,
      dataType,
      minCategoricalBandValue,
      maxCategoricalBandValue,
      hasCategoricalColorMap: Boolean(categoricalColorMap)
    });

    return [tileLayer];
  }

  async getTileData(props: GetTileDataProps): Promise<GetTileDataOutput> {
    const {
      shouldLoadTerrain,
      globalBounds,
      bbox: {west, south, east, north},
      index
    } = props;
    const onTileUpdate = RuntimeConfig.onRasterTileLoadUpdate as any;

    if (globalBounds && !bboxIntersects(globalBounds, [west, south, east, north])) {
      // tile is outside of STAC object's bounding box; don't fetch tile
      return null;
    }

    const assetRequests = await getSTACImageRequests(props);
    // No assets to load, most likely due to props being invalid/unsupported
    if (!assetRequests) {
      // We still issue the loadTerrain request if applicable
      const terrain = shouldLoadTerrain && (await loadTerrain(props));
      return {images: null, ...(terrain ? {terrain} : {})};
    }

    const tileInfo: Pick<RasterTileLoadEvent, 'assetUrls' | 'tileIndex'> = {
      assetUrls: assetRequests.map(req => req.url),
      tileIndex: [index.x, index.y, index.z]
    };
    onTileUpdate?.({status: 'loading', ...tileInfo, remainingTiles: ++tilesBeingLoaded});

    // Wrap loading images into a try/catch because tiles that are only briefly in view will be
    // aborted. The `AbortController.abort()` creates a DOMException error, and the Sentry popup will
    // show on any unhandled exception.
    // Note that since loading is async, try/catch will only work when awaited inside the try block
    try {
      const [images, terrain] = await Promise.all([
        loadImages(assetRequests, props.colormapId, {
          colorMap: props.categoricalColorMap,
          minValue: props.minCategoricalBandValue,
          maxValue: props.maxCategoricalBandValue
        }),
        shouldLoadTerrain ? loadTerrain(props) : null
      ]);

      const [min, max] = this.getMinMaxPixelValues(images.imageBands);
      onTileUpdate?.({status: 'loaded', ...tileInfo, remainingTiles: --tilesBeingLoaded});

      // Add terrain data only if we requested it above
      return {
        images,
        ...(terrain ? {terrain} : {}),
        minPixelValue: min,
        maxPixelValue: max
      };
    } catch (error) {
      if ((error as any).name === 'AbortError') {
        // tile was aborted
        onTileUpdate?.({status: 'canceled', ...tileInfo, remainingTiles: --tilesBeingLoaded});
        return null;
      }

      // Some other unhandled error
      onTileUpdate?.({status: 'failed', error, ...tileInfo, remainingTiles: --tilesBeingLoaded});
      throw error;
    }
  }
}

function renderSubLayers(props: RenderSubLayersProps): DeckLayer<any> | DeckLayer<any>[] {
  const {
    tile,
    data,
    minPixelValue: globalMinPixelValue,
    maxPixelValue: globalMaxPixelValue
  } = props;
  const bbox = tile.bbox as GeoBoundingBox;
  const {west, south, east, north} = bbox;

  if (!data) {
    return [];
  }

  const {
    images,
    terrain,
    minPixelValue: tileMinPixelValue,
    maxPixelValue: tileMaxPixelValue
  } = data;
  if (!images || (Array.isArray(images) && images.length === 0)) {
    return [];
  }

  const minPixelValue = Number.isFinite(globalMinPixelValue)
    ? globalMinPixelValue
    : tileMinPixelValue;
  const maxPixelValue = Number.isFinite(globalMaxPixelValue)
    ? globalMaxPixelValue
    : tileMaxPixelValue;
  if (typeof minPixelValue !== 'number' || typeof maxPixelValue !== 'number') {
    return [];
  }

  const {modules, moduleProps} = getModules({
    images,
    props: {...props, minPixelValue, maxPixelValue}
  });

  return terrain
    ? new RasterMeshLayer(props, {
        id: `raster-3d-layer-${props.id}`,
        // Dummy data
        data: [1],
        mesh: terrain,
        images,
        modules,
        moduleProps,

        getPolygonOffset: null,
        coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
        modelMatrix: getMercatorModelMatrix(tile.index),
        getPosition: () => [0, 0, 0],
        // Color to use if surfaceImage is unavailable
        getColor: [255, 255, 255]
        // material: false
      })
    : new RasterLayer(props, {
        id: `raster-2d-layer-${props.id}`,
        images,
        modules,
        moduleProps,
        bounds: [west, south, east, north],
        // Used for GlobeView
        _imageCoordinateSystem: COORDINATE_SYSTEM.CARTESIAN
      });
}

// From https://github.com/uber/deck.gl/blob/b1901b11cbdcb82b317e1579ff236d1ca1d03ea7/modules/geo-layers/src/mvt-tile-layer/mvt-tile-layer.js#L41-L52
export function getMercatorModelMatrix(tile: {x: number; y: number; z: number}): Matrix4 {
  const WORLD_SIZE = 512;
  const worldScale = Math.pow(2, tile.z);

  const xScale = WORLD_SIZE / worldScale;
  const yScale = -xScale;

  const xOffset = (WORLD_SIZE * tile.x) / worldScale;
  const yOffset = WORLD_SIZE * (1 - tile.y / worldScale);

  return new Matrix4().translate([xOffset, yOffset, 0]).scale([xScale, yScale, 1]);
}
