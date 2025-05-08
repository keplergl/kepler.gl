// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * Utility functions and constants for processing STAC metadata and other raster tile data
 */

import {TypedArray} from '@loaders.gl/loader-utils/src/types';
import {isArray} from '@math.gl/core';

import {StacTypes} from '@kepler.gl/types';
import {hexToRgb} from '@kepler.gl/utils';

import {PRESET_OPTIONS, ZOOM_RANGES} from './config';
import {
  DataSourceParams,
  PresetData,
  CompleteSTACObject,
  CompleteSTACAssetLinks,
  AssetIds,
  BandIndexes,
  RenderBandIndexes,
  Tile2DHeader,
  AssetRequestInfo,
  PresetOption,
  BandCombination,
  CategoricalColormapOptions
} from './types';

type Item = StacTypes.STACItem;
type Collection = StacTypes.STACCollection;
type EOBand = StacTypes.Band;
type DataTypeOfTheBand = StacTypes.DataTypeOfTheBand;

export const CATEGORICAL_TEXTURE_WIDTH = 256;

export function isColormapAllowed(bandCombination: BandCombination): boolean {
  return bandCombination !== BandCombination.Rgb;
}

export function isRescalingAllowed(bandCombination: BandCombination): boolean {
  return bandCombination === BandCombination.Rgb || bandCombination === BandCombination.Single;
}

export function isFilterAllowed(bandCombination: BandCombination): boolean {
  return bandCombination !== BandCombination.Rgb;
}

/**
 * Max value for data type
 *
 * Values of null might be calculated in runtime
 */
export const dtypeMaxValue: Record<DataTypeOfTheBand, number | null> = {
  uint8: Math.pow(2, 8) - 1,
  uint16: Math.pow(2, 16) - 1,
  uint32: Math.pow(2, 32) - 1,
  uint64: null,
  int8: Math.pow(2, 7) - 1,
  int16: Math.pow(2, 15) - 1,
  int32: Math.pow(2, 31) - 1,
  int64: null,
  float16: null,
  float32: null,
  float64: null,
  cint16: null,
  cint32: null,
  cfloat32: null,
  cfloat64: null,
  other: null
};

/**
 * Is this a STAC Collection that supports custom searching
 * TODO: currently this is a custom hack to support Sentinel. It will need to be generalized before being accessible
 * @param stac  STAC object
 * @return If True, supports searching
 */
export function isSearchableStac(stac: CompleteSTACObject): boolean {
  return stac.type === 'Collection';

  // return stac.type !== 'Feature' && stac?.providers.some(
  //   provider =>
  //     provider.name.toLowerCase() === 'microsoft' &&
  //     provider.url === 'https://planetarycomputer.microsoft.com'
  // );
}

function getZoomRange(stac: CompleteSTACObject): [number, number] {
  if (ZOOM_RANGES[stac.id]) {
    return ZOOM_RANGES[stac.id];
  }

  // For a single COG, having a full zoom range isn't really a problem.
  // the /cog/info endpoint doesn't describe zoom levels because it doesn't know the projection to serve the image in.
  // Default minzoom, maxzoom: [0, 20]
  return [0, 20];
}

/**
 * Infer data type from STAC item
 * This uses the `raster` extension, which is not yet very common
 * @param stac stac object
 * @return Data type of the band
 */
function getDataType(
  usableAssets: CompleteSTACAssetLinks,
  typesToCheck?: string[]
): DataTypeOfTheBand | null {
  const dataTypes = new Set<DataTypeOfTheBand>();
  for (const assetName in usableAssets) {
    const asset = usableAssets[assetName];
    if (!asset) {
      continue;
    }
    if (typesToCheck && !typesToCheck.includes(assetName)) {
      continue;
    }

    asset['raster:bands']?.forEach(band => band.data_type && dataTypes.add(band.data_type));
  }

  // TODO: support multiple data types across assets
  if (dataTypes.size !== 1) {
    return null;
  }

  return Array.from(dataTypes)[0];
}

/**
 * Get min and max values of the band from the band's data type values range
 * @param stac - stac metadata object
 * @param dtype - data type of the raster band
 * @returns min and max values for the band
 */
function getPixelRange(
  stac: CompleteSTACObject,
  dtype: DataTypeOfTheBand | null,
  [minRasterStatsValue, maxRasterStatsValue]: [number | undefined, number | undefined]
): [number, number] | null {
  if (!dtype) {
    return null;
  }

  // TODO: might not always be desired to leave min pixel value at 0
  const minPixelValue = 0;
  const maxPixelValue = dtypeMaxValue[dtype];

  // TODO check if this early return is expected
  if (!maxPixelValue) {
    return null;
  }

  if (
    !Number.isFinite(maxPixelValue) &&
    typeof minRasterStatsValue === 'number' &&
    typeof maxRasterStatsValue === 'number'
  ) {
    return [minRasterStatsValue, maxRasterStatsValue];
  }

  return [minPixelValue, maxPixelValue];
}

/**
 * Find min and max values throughout a raster band image
 * @param imageData raster band image data
 * @returns min and max values throughout the band
 */
export function getImageMinMax(imageData: TypedArray): [number | null, number | null] {
  // We cannot calculate min/max for Image/ImageBitmap
  if (!isArray(imageData)) {
    return [null, null];
  }
  let min = Infinity;
  let max = -Infinity;
  for (const value of imageData) {
    if (!isNaN(value)) {
      min = Math.min(min, value);
      max = Math.max(max, value);
    }
  }
  return [min, max];
}

/**
 * Find asset names and band indexes for given commonNames
 * Right now in Kepler, our available methods of rendering raster data are quite simple. We only allow a user to choose among `presets`, and under the hood we select which data files to load.
 * @param usableAssets [stac description]
 * @param commonNames  an array of eo:common_name to search within bands
 * @return Band information or null if not all bands exist
 */
export function getBandIdsForCommonNames(
  stac: CompleteSTACObject,
  usableAssets: CompleteSTACAssetLinks,
  commonNames: string[]
): AssetRequestInfo | null {
  // An array of strings describing asset identifiers, e.g. the "key" in the assets object
  const assetIds: AssetIds = [];
  // An array of integers giving the index of the band within that asset's data
  // In general, data sources either have a single band per asset or all assets in a single band
  const bandIndexes: BandIndexes = [];

  for (const commonName of commonNames) {
    // Find asset that includes a band with this common name
    const result = findAssetWithName(usableAssets, commonName, 'common_name');
    if (result) {
      const [assetName, bandIndex] = result;
      assetIds.push(assetName);
      bandIndexes.push(bandIndex);
    }
  }

  if (assetIds.length === 0) {
    return null;
  }

  const {loadAssetIds, loadBandIndexes, renderBandIndexes} = consolidateBandIndexes(
    stac,
    assetIds,
    bandIndexes
  );

  return {loadAssetIds, loadBandIndexes, renderBandIndexes};
}

/**
 * Consolidate asset/band info into load info and render info
 * @param stac STAC object
 * @param assetIds
 * @param bandIndexes
 * @return Asset information
 */
function consolidateBandIndexes(
  stac: CompleteSTACObject,
  assetIds: AssetIds,
  bandIndexes: BandIndexes
): AssetRequestInfo {
  let loadAssetIds: AssetIds;
  let loadBandIndexes: BandIndexes;
  let renderBandIndexes: RenderBandIndexes;

  // All bands we want to load are in a single asset
  if (assetIds.length === 1 || Array.from(new Set(assetIds)).length === 1) {
    loadAssetIds = [assetIds[0]];

    const asset = getAssets(stac)[loadAssetIds[0]];

    // Request all bands in order, then reorder with renderBandIndexes
    // NOTE: usually (e.g. with NAIP) if all bands are in a single asset, then there are only ~4
    // bands. This approach of requesting all bands may be less efficient with more than 4 bands
    // (because of larger download sizes). In the future may want separate loading paths if we
    // encounter single asset objects with > 4 bands.

    // TODO: eo:bands can be _either_ on each asset _or_ on the STAC's properties, which is not currently handled
    loadBandIndexes = (asset['eo:bands'] as EOBand[])?.map((_, idx) => idx);
    renderBandIndexes = bandIndexes;
  } else {
    loadAssetIds = assetIds;
    loadBandIndexes = bandIndexes;
    renderBandIndexes = null;
  }

  return {loadAssetIds, loadBandIndexes, renderBandIndexes};
}

/**
 * Find the Asset in the STAC object that containing an eo:band with the desired common_name or name
 * @param assets assets object. Keys should be asset name and values should be asset data
 * @param name  name or common_name in eo:bands
 * @param property 'name' or 'common_name'
 * @return name of asset containing desired band, index of band within asset
 */
export function findAssetWithName(
  assets: CompleteSTACAssetLinks,
  name: string,
  property: 'name' | 'common_name'
): [string, number] | null {
  for (const [assetName, assetData] of Object.entries(assets)) {
    const eoBands = assetData['eo:bands'] || [];

    // Search bands array of this asset
    for (let i = 0; i < eoBands.length; i++) {
      const eoBand = eoBands[i];
      if (name === eoBand[property]) {
        return [assetName, i];
      }
    }
  }

  return null;
}

function getSingleBandInfo(
  usableAssets: CompleteSTACAssetLinks,
  singleBandInfo: PresetOption['singleBand']
): AssetRequestInfo | null {
  if (!singleBandInfo?.assetId && Object.keys(usableAssets).length === 1) {
    singleBandInfo = {
      assetId: Object.keys(usableAssets)[0]
    };
  }

  if (!singleBandInfo) {
    return null;
  }

  const {assetId, bandIndex} = singleBandInfo;
  if (!Object.keys(usableAssets).includes(assetId)) {
    return null;
  }

  return {
    loadAssetIds: [assetId],
    loadBandIndexes: bandIndex ? [bandIndex] : [0],
    // No reordering of bands on the GPU
    renderBandIndexes: null
  };
}

export function getRasterStatisticsMinMax(
  stac: CompleteSTACObject,
  presetId: string,
  singleBandInfo: PresetOption['singleBand']
): [number | undefined, number | undefined] {
  if (presetId !== 'singleBand') {
    return [undefined, undefined];
  }
  let minCategoricalBandValue: number | undefined;
  let maxCategoricalBandValue: number | undefined;
  const usableAssets = getUsableAssets(stac);
  let bandMetadata = usableAssets[singleBandInfo?.assetId || ''];
  if (!bandMetadata) {
    const assetId = Object.keys(usableAssets)[0];
    bandMetadata = usableAssets[assetId];
  }

  if (bandMetadata) {
    minCategoricalBandValue = bandMetadata['raster:bands']?.[0].statistics?.minimum;
    maxCategoricalBandValue = bandMetadata['raster:bands']?.[0].statistics?.maximum;
  }

  return [minCategoricalBandValue, maxCategoricalBandValue];
}

export function getSingleBandPresetOptions(
  stac: CompleteSTACObject,
  singleBandName: string
): PresetOption['singleBand'] {
  const usableAssets = getUsableAssets(stac);
  let assetData = findAssetWithName(usableAssets, singleBandName, 'name');
  if (!assetData) {
    // some collections have common_name instead of name
    assetData = findAssetWithName(usableAssets, singleBandName, 'common_name');
  }
  let singleBand: PresetOption['singleBand'];
  if (assetData) {
    const [assetId, bandIndex] = assetData;
    singleBand = {assetId, bandIndex};
  }
  return singleBand;
}

/**
 * Calculate viewport-related min and max raster values from loaded tiles
 * @param tiles - deck.gl tiles
 * @returns [minPixelValue, maxPixelValue]
 */
export function getMinMaxFromTile2DHeaders(tiles: (Tile2DHeader | null)[]): [number, number] {
  const minValues: (number | null)[] = tiles
    .map((tile: Tile2DHeader | null) => {
      if (!tile || !tile.data) {
        return null;
      }
      const {minPixelValue} = tile.data;
      return minPixelValue;
    })
    .filter(value => value);
  const maxValues: (number | null)[] = tiles
    .map((tile: Tile2DHeader | null) => {
      if (!tile || !tile.data) {
        return null;
      }
      const {maxPixelValue} = tile.data;
      return maxPixelValue;
    })
    .filter(value => value);
  // We can cast to number[] because we have filtered null values
  return [Math.min(...(minValues as number[])), Math.max(...(maxValues as number[]))];
}

/**
 * Get loading params
 * @param stac STAC Object
 * @param preset Preset for display
 * @return Parameters for loading data
 */
export function getDataSourceParams(
  stac: CompleteSTACObject,
  presetId: string,
  presetOptions?: PresetOption
): DataSourceParams | null {
  const usableAssets = getUsableAssets(stac);
  const {commonNames, bandCombination} = PRESET_OPTIONS[presetId];
  const [minZoom, maxZoom] = getZoomRange(stac);

  let bandInfo: AssetRequestInfo | null = null;
  if (bandCombination === 'single') {
    bandInfo = getSingleBandInfo(usableAssets, presetOptions?.singleBand);
  } else if (commonNames) {
    bandInfo = getBandIdsForCommonNames(stac, usableAssets, commonNames);
  } else {
    return null;
  }

  if (!bandInfo) return null;

  const dtype = getDataType(usableAssets, bandInfo.loadAssetIds);
  const [minRasterStatsValue, maxRasterStatsValue] = getRasterStatisticsMinMax(
    stac,
    presetId,
    presetOptions?.singleBand
  );
  const pixelRange = getPixelRange(stac, dtype, [minRasterStatsValue, maxRasterStatsValue]);

  if (!pixelRange || !dtype) {
    return null;
  }

  const [minPixelValue, maxPixelValue] = pixelRange;
  const {loadAssetIds, loadBandIndexes, renderBandIndexes} = bandInfo;
  const globalBounds = getSTACBounds(stac);

  return {
    loadAssetIds,
    loadBandIndexes,
    renderBandIndexes,
    minZoom,
    maxZoom,
    minPixelValue,
    maxPixelValue,
    // use min and max statistics values for categorical re-scale
    minCategoricalBandValue: minRasterStatsValue,
    maxCategoricalBandValue: maxRasterStatsValue,
    globalBounds,
    dataType: dtype
  };
}

/**
 * Get Bounding Box of STAC object
 * @param stac
 * @return bounding box
 */
export function getSTACBounds(stac: Item | Collection): number[] | null {
  // Check if Item
  if (stac.type === 'Feature') {
    // bbox may be missing
    return stac.bbox || null;
  }

  // Then must be collection
  return stac.extent.spatial.bbox[0];
}

/**
 * Get all eo:band objects from STAC object
 * @param stac  STAC object
 * @return array of eo:band objects or null
 */
export function getEOBands(stac: CompleteSTACObject): EOBand[] | null {
  const assets = getAssets(stac);
  if (!assets) {
    return null;
  }

  const eoBands: EOBand[] = [];
  for (const data of Object.values(assets)) {
    const assetBands = data['eo:bands'];
    if (Array.isArray(assetBands) && assetBands.length > 0) {
      eoBands.push(...assetBands);
    }
  }

  return eoBands;
}

/**
 * Filter presets by those that can be used with the given stac item
 * Each preset has a commonNames key, which is a list of eo `common_name` values. Some STAC items
 * may not have assets that span all of these combinations of `common_name`, so this filters the
 * input array.
 * @param stac           STAC object
 * @param presetData  object with requirements for each preset
 * @return An array of preset option ids that can be used with the given STAC item
 */
export function filterAvailablePresets(
  stac: CompleteSTACObject,
  presetData: Record<string, PresetData>
): string[] | null {
  if (!stac) {
    return null;
  }

  const eoBands = getEOBands(stac);

  if (!eoBands) {
    return null;
  }

  const availablePresetIds: string[] = [];
  for (const preset of Object.values(presetData)) {
    const {commonNames, bandCombination} = preset;

    // True if all required common names of preset exist in STAC object
    const allBandsExist = commonNames?.every(commonName =>
      eoBands.some(eoBand => eoBand.common_name === commonName)
    );

    if (allBandsExist || bandCombination === 'single') {
      availablePresetIds.push(preset.id);
    }
  }

  return availablePresetIds;
}

// TODO: would be better to have a generic here to relax the requirement that all input STACs have all extensions we list.
export function getAssets(stac: CompleteSTACObject): CompleteSTACAssetLinks {
  // stac is an Item
  if (stac.type === 'Feature') {
    return stac.assets;
  }

  // stac is a Collection
  // A STAC Collection optionally contains (if it includes the Item Assets Extension) an item_assets
  // key that describes the assets included in every Item in the Collection.
  return stac.item_assets;
}

/**
 * Find usable assets in main assets object
 * The `assets` object can point to many different objects, including original XML or JSON metadata,
 * thumbnails, etc. These aren't usable as image data in Studio.
 * @param stac  STAC object
 * @return asset mapping including only assets usable in Studio
 */
export function getUsableAssets(stac: CompleteSTACObject): CompleteSTACAssetLinks {
  const allAssets = getAssets(stac);
  const usableAssets = {};
  for (const assetName in allAssets) {
    const assetData = allAssets[assetName];

    // We don't require data assets to have the "data" role, but if the asset has a non-data role,
    // we exclude it
    if (
      Array.isArray(assetData.roles) &&
      assetData.roles.some(role =>
        ['thumbnail', 'overview', 'metadata', 'visual'].includes(role)
      ) &&
      !assetData.roles.includes('data')
    ) {
      continue;
    }

    // raster:bands array exists
    if (assetData['raster:bands']) {
      usableAssets[assetName] = assetData;
    }

    // TODO: Could also mark the asset as unusable if the asset has a non-GeoTIFF or COG Media Type
  }

  return usableAssets;
}

/**
 * Get the max number of requests the TileLayer should be able to send at once
 * With HTTP 1 under Chrome, you can make a max of 6 concurrent requests per domain, so this number
 * should be 6 * number of domains tiles are loaded from.
 * @param stac STAC object
 * @return Number of permissible concurrent requests
 */
export function getMaxRequests(rasterTileServerUrls: []): number {
  return (rasterTileServerUrls.length || 1) * 6;
}

/**
 * Determine if two axis-aligned boxes intersect
 * @param bbox1  axis-aligned box
 * @param bbox2  axis-aligned box
 * @return true if boxes intersect
 */
export function bboxIntersects(bbox1: number[], bbox2: number[]): boolean {
  if (!Array.isArray(bbox1) || bbox1.length !== 4 || !Array.isArray(bbox2) || bbox2.length !== 4) {
    // Invalid input; can't make determination
    return true;
  }

  return !(
    bbox2[0] > bbox1[2] ||
    bbox2[2] < bbox1[0] ||
    bbox2[3] < bbox1[1] ||
    bbox2[1] > bbox1[3]
  );
}

/**
 * Compute zRange of tiles in viewport.
 * Derived from https://github.com/visgl/deck.gl/blob/8d824a4b836fee3bfebe6fc962e0f03d8c1dbd0d/modules/geo-layers/src/terrain-layer/terrain-layer.js#L173-L196
 * @param tiles Array of tiles in current viewport
 */
export function computeZRange(tiles: (Tile2DHeader | null)[] | null): [number, number] | null {
  // Abort if no tiles visible
  if (!tiles) {
    return null;
  }

  // Since getTileData returns an object with either {terrain, images} in 3d mode or {images} in
  // 2D mode, we can grab that object using tile.content.terrain, then grab the bounding box from
  // the header.
  const ranges: [number, number][] = tiles
    .map(tile => tile?.content?.terrain?.header?.boundingBox)
    .flatMap(bounds => (bounds ? [[bounds[0][2], bounds[1][2]]] : []));

  if (ranges.length === 0) {
    return null;
  }

  const minZ = Math.min(...ranges.map(x => x[0]));
  const maxZ = Math.max(...ranges.map(x => x[1]));

  return [minZ, maxZ];
}

/**
 * Create RGBA bitmap array for categorical color scale from categorical color map
 * @param categoricalOptions - color map configuration and min-max values of categorical band
 * @returns typed array with bitmap data
 */
export function generateCategoricalBitmapArray(
  categoricalOptions: CategoricalColormapOptions
): Uint8Array | null {
  const {colorMap, minValue = 0, maxValue = CATEGORICAL_TEXTURE_WIDTH - 1} = categoricalOptions;
  if (!colorMap) {
    return null;
  }
  const colorScaleMaxValue = maxValue - minValue;
  const step = CATEGORICAL_TEXTURE_WIDTH / (colorScaleMaxValue + 1);
  const data = new Uint8Array(CATEGORICAL_TEXTURE_WIDTH * 4);
  for (const [value, color] of colorMap) {
    if (typeof value !== 'number') {
      continue;
    }
    const rgb = hexToRgb(color);
    const minPixel = Math.floor(value * step);
    const maxPixel = Math.floor((value + 1) * step - 1);
    for (let i = minPixel; i <= maxPixel; i++) {
      data.set([...rgb, CATEGORICAL_TEXTURE_WIDTH - 1], i * 4);
    }
  }
  return data;
}

export function timeRangeToStacTemporalInterval(
  stac: StacTypes.STACCollection,
  startDate: string,
  endDate: string
): {startDate: string; endDate: string} {
  // TODO support multiple temporal intervals
  const interval = stac.extent?.temporal?.interval?.[0];
  if (!interval || !interval[0]) return {startDate, endDate};

  const collectionStart = interval[0] ? new Date(interval[0]) : new Date();
  const collectionEnd = interval[1] ? new Date(interval[1]) : new Date();

  const layerStart = new Date(startDate);
  const layerEnd = new Date(endDate);

  const clippedStart =
    layerStart < collectionStart || layerStart > collectionEnd ? collectionStart : layerStart;
  let clippedEnd = layerEnd > collectionEnd ? collectionEnd : layerEnd;
  if (clippedStart > clippedEnd) {
    clippedEnd = new Date(clippedStart);
    clippedEnd.setDate(clippedEnd.getDate() + 1);
  }

  return {
    startDate: clippedStart.toISOString().split('T')[0],
    endDate: clippedEnd.toISOString().split('T')[0]
  };
}
