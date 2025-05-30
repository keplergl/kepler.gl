// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {COORDINATE_SYSTEM, Layer as DeckLayer} from '@deck.gl/core/typed';
import {TileLayer, GeoBoundingBox} from '@deck.gl/geo-layers/typed';
import {PMTilesSource, PMTilesTileSource} from '@loaders.gl/pmtiles';
import {Texture2DProps} from '@luma.gl/webgl';
import memoize from 'lodash/memoize';

import {PathLayer} from '@deck.gl/layers/typed';
import {DatasetType, PMTilesType, LAYER_TYPES} from '@kepler.gl/constants';
import {RasterLayer, RasterMeshLayer} from '@kepler.gl/deckgl-layers';
import {
  LayerBaseConfig,
  LayerColorConfig,
  LayerHeightConfig,
  VisualChannel,
  VisConfigColorRange,
  VisConfigSelection,
  VisConfigBoolean,
  VisConfigInput,
  VisConfigRange,
  VisConfigNumber
} from '@kepler.gl/types';

import {notNullorUndefined} from '@kepler.gl/common-utils';
import {Datasets, KeplerTable as KeplerDataset, VectorTileMetadata} from '@kepler.gl/table';
import {getApplicationConfig} from '@kepler.gl/utils';

import {rasterVisConfigs, PRESET_OPTIONS, DATA_SOURCE_COLOR_DEFAULTS} from './config';
import {getModules} from './gpu-utils';
import {getSTACImageRequests, loadImages, loadTerrain} from './image';
import RasterIcon from './raster-tile-icon';
import {
  getDataSourceParams,
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
  GetTileDataDefaultProps,
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

// Adjust tileSize to devicePixelRatio, but not higher than 2 to reduce requests to server
const devicePixelRatio: number = Math.min(
  2,
  (typeof window !== 'undefined' && window.devicePixelRatio) || 1
);

// Global counter that represents the number of tiles currently being loaded across all the raster tile layers
let tilesBeingLoaded = 0;

// This is a temp solution to track loading
export const getNumRasterTilesBeingLoaded = () => {
  return tilesBeingLoaded;
};

export const LOAD_ELEVATION_AFTER_ZOOM = 8.9;

const getShouldLoadTerrain = (stac, mapState, visConfig) => {
  return Boolean(
    // we need a raster tile server for elevations even when we user PMTiles
    stac.rasterTileServerUrls?.length > 0 &&
      // check the switch from the layer configurator
      visConfig.enableTerrain &&
      // disabled in Top view by default
      (mapState.dragRotate || visConfig.enableTerrainTopView) &&
      getApplicationConfig().rasterServerSupportsElevation
  );
};

export type RasterTileLayerVisConfigCommonSettings = {
  opacity: VisConfigNumber;
  enableTerrain: VisConfigBoolean;
  enableTerrainTopView: VisConfigBoolean;
};

export type RasterTileLayerVisConfigSettings = RasterTileLayerVisConfigCommonSettings & {
  preset: VisConfigSelection;
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
  _stacQuery: VisConfigInput;
  singleBandName: VisConfigSelection;
};

type RasterTileLayerMeta = {
  zRange: number[] | null;
};

export default class RasterTileLayer extends KeplerLayer {
  declare visConfigSettings: RasterTileLayerVisConfigSettings;
  declare meta: RasterTileLayerMeta;

  /** Min bands image data value, based on the current viewport */
  minViewportPixelValue = Infinity;
  /** Max bands image data value, based on the current viewport */
  maxViewportPixelValue = -Infinity;
  /** Memoized method that calculates data source params */

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

  formatLayerData(datasets: Datasets, oldLayerData?: any) {
    const {dataId} = this.config;
    if (!notNullorUndefined(dataId)) {
      return {};
    }
    const dataset = datasets[dataId];

    // call updateData to updateLayerMeta
    const dataUpdateTriggers = this.getDataUpdateTriggers(dataset);
    const triggerChanged = this.getChangedTriggers(dataUpdateTriggers);

    if (triggerChanged && triggerChanged.getMeta) {
      this.updateLayerMeta(dataset as KeplerRasterDataset);
    }

    let tileSource: PMTilesTileSource | null = null;
    if (dataset.metadata?.pmtilesType === PMTilesType.RASTER) {
      const metadataUrl = dataset.metadata.metadataUrl;
      // use the old tile source if it exists and matches the new metadataUrl
      const {dataset: oldDataset, tileSource: oldTileSource} = oldLayerData || {};
      if (oldDataset === dataset && oldTileSource?.data === metadataUrl) {
        tileSource = oldLayerData.tileSource;
      } else {
        tileSource = metadataUrl ? PMTilesSource.createDataSource(metadataUrl, {}) : null;
      }
    }

    return {dataset, tileSource};
  }

  updateLayerMeta(dataset: KeplerRasterDataset): void {
    if (dataset.type !== DatasetType.RASTER_TILE) {
      return;
    }

    const stac = dataset.metadata;
    if (stac.pmtilesType === PMTilesType.RASTER) {
      return this.updateMeta({
        bounds: stac.bounds
      });
    }

    const bounds = getSTACBounds(stac);
    if (bounds) {
      // If a STAC Item (i.e. stac.type === 'Feature'), then set map bounds.
      // But we don't want to set bounds for Landsat or Sentinel because it would zoom out to zoom
      // 0, and we don't have low-zoom tiles.
      if (stac.type === 'Feature') {
        this.updateMeta({bounds});
      }
    }
  }

  /**
   * Run when adding a new dataset
   */
  setInitialLayerConfig(dataset: KeplerDataset): RasterTileLayer {
    const stac = dataset?.metadata as GetTileDataCustomProps['stac'];

    if (!stac) {
      return this;
    }

    if (stac.pmtilesType === PMTilesType.RASTER) {
      return this;
    }

    // When a STAC Collection is added, useStacSearching should be true to prevent a black screen
    this.updateLayerVisConfig({
      useSTACSearching: stac.type === 'Collection'
    });

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

    // Apply improved image processing props only for non single band modes
    const preset = this.config.visConfig.preset;
    const colorDefaults = DATA_SOURCE_COLOR_DEFAULTS[stac.id];
    if (colorDefaults && preset !== 'singleBand') {
      this.updateLayerVisConfig(colorDefaults);
    }

    /*
    LandSat specifies temporal bounds but the valid data is after end date
    const updatedDates = timeRangeToStacTemporalInterval(
      stac as StacTypes.STACCollection,
      this.config.visConfig.startDate,
      this.config.visConfig.endDate
    );
    this.updateLayerVisConfig(updatedDates);
    */

    return this;
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
    const {data} = opts;

    if (data?.dataset?.metadata?.pmtilesType === PMTilesType.RASTER) {
      return this.renderPMTilesLayer(opts);
    }
    return this.renderStacLayer(opts);
  }

  private renderStacLayer(opts): TileLayer<any>[] {
    const {data, mapState, experimentalContext} = opts;
    const stac = data?.dataset?.metadata as GetTileDataCustomProps['stac'];

    // If a tabular dataset is loaded, and then the layer type is switched from Point to Raster Tile
    // layer, this `stac` object will exist but will not be raster metadata
    if (!stac || !stac.stac_version) {
      return [];
    }

    const {visConfig} = this.config;
    const {id, opacity, visible} = this.getDefaultDeckLayerProps(opts);

    const hasShadowEffect = experimentalContext?.hasShadowEffect;

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
      dynamicColor
    } = visConfig;

    const shouldLoadTerrain = getShouldLoadTerrain(stac, mapState, visConfig);

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
      // @ts-expect-error - TS doesn't know we'll pass appropriate props here
      renderSubLayers: renderSubLayersStac,
      maxRequests: getMaxRequests(stac.rasterTileServerUrls || []),
      // Passing visible on to TileLayer is necessary for split view to work
      visible,
      updateTriggers: {
        getTileData: [
          shouldLoadTerrain,
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
      hasCategoricalColorMap: Boolean(categoricalColorMap),
      hasShadowEffect
    });

    return [tileLayer];
  }

  private renderPMTilesLayer(opts): TileLayer<any>[] {
    const {id, opacity, visible} = this.getDefaultDeckLayerProps(opts);

    const {data, mapState} = opts;
    const metadata = data?.dataset?.metadata as VectorTileMetadata;
    const {visConfig} = this.config;

    const tileSource = data.tileSource;
    const showTileBorders = false;
    const minZoom = metadata.minZoom || 0;
    const maxZoom = metadata.maxZoom || 30;

    const shouldLoadTerrain = getShouldLoadTerrain(metadata, mapState, visConfig);

    return [
      new TileLayer<any, RasterTileLayerVisConfigCommonSettings>({
        id,
        getTileData: (args: any) =>
          this.getTileDataPMTiles({...args, shouldLoadTerrain, metadata}, tileSource),

        // Assume the pmtiles file support HTTP/2, so we aren't limited by the browser to a certain number per domain.
        maxRequests: 20,

        pickable: true,
        autoHighlight: showTileBorders,

        onViewportLoad: this.onViewportLoad.bind(this),

        minZoom,
        maxZoom,
        tileSize: 512 / devicePixelRatio,
        zoomOffset: devicePixelRatio === 1 ? -1 : 0,
        // @ts-expect-error - TS doesn't know we'll pass appropriate props here
        renderSubLayers: renderSubLayersPMTiles,

        tileSource,
        showTileBorders,

        visible,
        opacity,

        updateTriggers: {
          getTileData: [shouldLoadTerrain]
        },
        // Props for 3D mode
        ...(shouldLoadTerrain
          ? {
              zRange: this.meta.zRange || null,
              refinementStrategy: 'no-overlap'
            }
          : {})
      })
    ];
  }

  async getTileData(props: GetTileDataProps): Promise<GetTileDataOutput> {
    const {
      shouldLoadTerrain,
      globalBounds,
      bbox: {west, south, east, north},
      index: {z: zoom}
    } = props;

    if (globalBounds && !bboxIntersects(globalBounds, [west, south, east, north])) {
      // tile is outside of STAC object's bounding box; don't fetch tile
      return null;
    }

    const assetRequests = await getSTACImageRequests(props);
    // No assets to load, most likely due to props being invalid/unsupported
    if (!assetRequests) {
      // We still issue the loadTerrain request if applicable
      const terrain =
        shouldLoadTerrain &&
        LOAD_ELEVATION_AFTER_ZOOM < zoom &&
        (await loadTerrain({
          boundsForGeometry: [west, north, east, south],
          index: props.index,
          signal: props.signal,
          rasterTileServerUrls: props.stac.rasterTileServerUrls || []
        }));
      return {images: null, ...(terrain ? {terrain} : {})};
    }

    tilesBeingLoaded++;

    // Wrap loading images into a try/catch because tiles that are only briefly in view will be
    // aborted. The `AbortController.abort()` creates a DOMException error.
    // Note that since loading is async, try/catch will only work when awaited inside the try block
    try {
      const [images, terrain] = await Promise.all([
        loadImages(assetRequests, props.colormapId, {
          colorMap: props.categoricalColorMap,
          minValue: props.minCategoricalBandValue,
          maxValue: props.maxCategoricalBandValue
        }),
        shouldLoadTerrain && LOAD_ELEVATION_AFTER_ZOOM < zoom
          ? loadTerrain({
              boundsForGeometry: [west, north, east, south],
              index: props.index,
              signal: props.signal,
              rasterTileServerUrls: props.stac.rasterTileServerUrls || []
            })
          : null
      ]);

      const [min, max] = this.getMinMaxPixelValues(images.imageBands);
      tilesBeingLoaded--;

      // Add terrain data only if we requested it above
      return {
        images,
        ...(terrain ? {terrain} : {}),
        minPixelValue: min,
        maxPixelValue: max
      };
    } catch (error) {
      tilesBeingLoaded--;
      if ((error as any).name === 'AbortError') {
        // tile was aborted
        return null;
      }

      // Some other unhandled error
      throw error;
    }
  }

  async getTileDataPMTiles(
    props: GetTileDataDefaultProps & {
      shouldLoadTerrain: boolean;
      metadata: {rasterTileServerUrls: string[]};
      globalBounds: DataSourceParams['globalBounds'];
    },
    tileSource
  ): Promise<any> {
    const {
      shouldLoadTerrain,
      globalBounds,
      bbox: {west, south, east, north},
      index: {z: zoom},
      metadata
    } = props;

    if (globalBounds && !bboxIntersects(globalBounds, [west, south, east, north])) {
      // tile is outside of STAC object's bounding box; don't fetch tile
      return null;
    }

    tilesBeingLoaded++;

    try {
      const [image] = await Promise.all([tileSource.getTileData(props)]);
      // For nwo check if the base tile exists, as this can cause loading to get stuck with "sparse" PMTiles.
      const terrain =
        image && shouldLoadTerrain && LOAD_ELEVATION_AFTER_ZOOM < zoom
          ? await loadTerrain({
              boundsForGeometry: [west, north, east, south],
              index: props.index,
              signal: props.signal,
              rasterTileServerUrls: metadata.rasterTileServerUrls
            })
          : null;

      let minPixelValue: number | null = null;
      let maxPixelValue: number | null = null;
      if (image) {
        const [min, max] = this.getMinMaxPixelValues([{data: image}]);
        minPixelValue = min;
        maxPixelValue = max;
      }
      tilesBeingLoaded--;

      // Add terrain data only if we requested it above
      return {image, minPixelValue, maxPixelValue, ...(terrain ? {terrain} : {})};
    } catch (error) {
      tilesBeingLoaded--;

      if ((error as Error).name === 'AbortError') {
        // tile was aborted
        return null;
      }

      // Some other unhandled error
      throw error;
    }
  }
}

function renderSubLayersStac(props: RenderSubLayersProps): DeckLayer<any> | DeckLayer<any>[] {
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

  const idSuffix = props.hasShadowEffect ? 'shadow' : '';

  return terrain
    ? new RasterMeshLayer(props, {
        id: `raster-3d-layer-${props.id}-${idSuffix}`,
        // Dummy data
        data: [1],
        mesh: terrain,
        images,
        modules,
        moduleProps,

        getPolygonOffset: null,
        coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
        // Color to use if surfaceImage is unavailable
        getColor: [255, 255, 255]
        // material: false
      })
    : new RasterLayer(props, {
        id: `raster-2d-layer-${props.id}-${idSuffix}`,
        images,
        modules,
        moduleProps,
        bounds: [west, south, east, north],
        _imageCoordinateSystem: COORDINATE_SYSTEM.CARTESIAN
      });
}

function renderSubLayersPMTiles(props: {
  id: string;
  data: any;
  tileSource: any;
  showTileBorders: any;
  minZoom: any;
  maxZoom: any;
  tile: any;
}) {
  const {
    tileSource,
    showTileBorders,
    minZoom,
    maxZoom,
    tile: {
      index: {z: zoom},
      bbox: {west, south, east, north}
    }
  } = props;

  const layers: any[] = [];

  if (props.data?.image) {
    switch (tileSource.mimeType) {
      case 'image/png':
      case 'image/jpeg':
      case 'image/webp':
      case 'image/avif':
        layers.push(getRasterLayerPMTiles(props));
        break;

      default:
        break;
    }
  }

  // Debug tile borders
  const borderColor = zoom <= minZoom || zoom >= maxZoom ? [255, 0, 0, 255] : [0, 0, 255, 255];
  if (showTileBorders) {
    layers.push(
      new PathLayer({
        id: `${props.id}-border`,
        data: [
          [
            [west, north],
            [west, south],
            [east, south],
            [east, north],
            [west, north]
          ]
        ],
        getPath: d => d,
        getColor: borderColor as any,
        widthMinPixels: 4
      })
    );
  }

  return layers;
}

function getRasterLayerPMTiles(props: {id: string; data: any; tile: any}) {
  const {tile, data} = props;
  const bbox = tile.bbox as GeoBoundingBox;
  const {west, south, east, north} = bbox;

  if (!data?.image) {
    return [];
  }

  const images = {imageRgba: {data: data.image}};
  const {terrain} = data;

  const {modules, moduleProps} = getModules({
    images
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
        coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
        // Color to use if surfaceImage is unavailable
        getColor: [255, 255, 255]
        // material: false
      })
    : new RasterLayer(props, {
        id: `raster-2d-layer-${props.id}`,
        data: null as never,
        images,
        modules,
        moduleProps,
        bounds: [west, south, east, north],
        _imageCoordinateSystem: COORDINATE_SYSTEM.CARTESIAN
      });
}
