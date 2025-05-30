// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {_Tile2DHeader} from '@deck.gl/geo-layers/typed';
import {TypedArray} from '@loaders.gl/loader-utils/src/types';
import {Texture2DProps} from '@luma.gl/webgl';

import {KeplerTable as KeplerDataset} from '@kepler.gl/table';
import type {ColorMap, StacTypes} from '@kepler.gl/types';

export type STACObject = StacTypes.STACObject;
export type CompleteSTACItem = StacTypes.CompleteSTACItem;
export type CompleteSTACCollection = StacTypes.CompleteSTACCollection;
export type CompleteSTACObject = StacTypes.CompleteSTACObject;

type DataTypeOfTheBand = StacTypes.DataTypeOfTheBand;

export type CompleteSTACAssetLinks =
  | CompleteSTACItem['assets']
  | CompleteSTACCollection['item_assets'];

export enum BandCombination {
  /** Render a single raster band. */
  Single = 'single',

  /** Render three bands together on the GPU.
   * Note that this could be "true color" if the first band is red, the second is green, and the
   * third is blue. But it could also be "false color" if the three bands chosen are not RGB.
   */
  Rgb = 'rgb',

  /** Calculate the Normalized Difference Vegetation Index (NDVI) on two bands. */
  NormalizedDifference = 'normalizedDifference',

  /** Calculate the EVI on two bands. */
  EnhancedVegetationIndex = 'enhancedVegetationIndex',

  /** Calculate SAVI on two bands. */
  SoilAdjustedVegetationIndex = 'soilAdjustedVegetationIndex',

  /** Calculate MSAVI on two bands. */
  ModifiedSoilAdjustedVegetationIndex = 'modifiedSoilAdjustedVegetationIndex'
}

/**
 * Identifiers of STAC assets to load
 *
 * These identifiers should match the keys of the STAC assets object. Refer to
 * https://github.com/radiantearth/stac-spec/blob/master/item-spec/item-spec.md#assets
 */
export type AssetIds = string[];

/**
 * Indexes of bands within each asset that should be loaded.
 *
 * Each asset refers to a single Cloud-Optimized GeoTIFF file on disk. Each COG has a width, height,
 * and one or more bands.
 *
 * This array of indexes must be the same length as the list of AssetIds. The nth band index
 * describes the which index from the nth asset id to load.
 */
export type BandIndexes = number[];

/**
 * An array of integers representing how bands should be reordered on the GPU. This allows for
 * faster changing of bands for single-asset raster data, such as NAIP. Will be null for multi-asset
 * STAC items.
 */
export type RenderBandIndexes = BandIndexes | null;

export type AssetRequestInfo = {
  loadAssetIds: AssetIds;
  loadBandIndexes: BandIndexes;
  renderBandIndexes: RenderBandIndexes;
};

/** User-provided information for how to render a preset */
export type PresetOption = {
  singleBand?: {
    assetId: string;
    bandIndex?: number;
  };
};

export type DataSourceParams = AssetRequestInfo & {
  minZoom: number;
  maxZoom: number;
  minPixelValue: number;
  maxPixelValue: number;
  minCategoricalBandValue?: number;
  maxCategoricalBandValue?: number;
  globalBounds: number[] | null;
  dataType: DataTypeOfTheBand;
};

export type CategoricalColormapOptions = {
  colorMap?: ColorMap;
  minValue?: number;
  maxValue?: number;
};

export type ExtendedKeplerSTAC = {rasterTileServerUrls?: []};

/**
 * Custom fields we pass on to the getTileData callback
 * Anything required to know _what data to load_ should be passed in here.
 */
export type GetTileDataCustomProps = Pick<AssetRequestInfo, 'loadAssetIds' | 'loadBandIndexes'> & {
  stac: CompleteSTACObject & ExtendedKeplerSTAC;
  colormapId: string;
  categoricalColorMap: ColorMap;
  minCategoricalBandValue?: number;
  maxCategoricalBandValue?: number;

  /** If true, fetch terrain data as well as texture data. */
  shouldLoadTerrain: boolean;
  globalBounds: number[] | null;
  useSTACSearching: boolean;
  stacSearchProvider: string;
  startDate: string;
  endDate: string;

  /* Stringified JSON representing a STAC API Search Query the backend should request from a server. */
  _stacQuery?: string;
};

/** Properties provided to getTileData by the deck.gl TileLayer */
export interface GetTileDataDefaultProps {
  index: {x: number; y: number; z: number};
  url?: string;

  /** Bounding box of the current web mercator tile. */
  bbox: {west: number; north: number; east: number; south: number};

  /** AbortSignal used for cancelling requests */
  signal: AbortSignal;
}

/** Properties passed into the deck.gl TileLayer getTileData callback */
export type GetTileDataProps = GetTileDataCustomProps & GetTileDataDefaultProps;

export type GetTileDataOutput = any | null;

export type RenderSubLayersCustomProps = ColorRescaling &
  Pick<AssetRequestInfo, 'renderBandIndexes'> & {
    opacity: number;
    linearRescaling: boolean;
    linearRescalingFactor: [number, number];
    nonLinearRescaling: boolean;
    minPixelValue: number;
    maxPixelValue: number;
    bandCombination: BandCombination;
    filterEnabled: boolean;
    filterRange: [number, number];
    currentTime: number;
    dataType: DataTypeOfTheBand;
    minCategoricalBandValue?: number;
    maxCategoricalBandValue?: number;
    hasCategoricalColorMap: boolean;
    hasShadowEffect?: boolean;
  };

export interface RenderSubLayersDefaultProps {
  id: string;
  tile: _Tile2DHeader<GetTileDataOutput>;
  data: GetTileDataOutput;
}

export type RenderSubLayersProps = RenderSubLayersCustomProps & RenderSubLayersDefaultProps;

/** Required information on how to render each preset */
export interface PresetData {
  label: string;
  id: string;
  bandCombination: BandCombination;
  commonNames?: string[];
  description?: string;
  infoUrl?: string;
}

export interface ColorRescaling {
  gammaContrastFactor: number;
  sigmoidalContrastFactor: number;
  sigmoidalBiasFactor: number;
  saturationValue: number;
}

export interface ConfigOption {
  label: string;
  id: string;
}

export type ColormapImageData = Texture2DProps;

export interface ImageData {
  imageBands: Texture2DProps[] | null;
  imageColormap?: Texture2DProps | null;
  imageMask?: Texture2DProps | null;
  imagePan?: Texture2DProps | null;
  imageRgba?: Texture2DProps | null;
}

export type AssetRequestData = {
  url: string;
  rasterServerUrl: string;
  options: RequestInit;
  useMask: boolean;
  /** Pass this property through the request to pick specific bands from the response */
  responseRequiredBandIndices?: number[] | null;
};

export type NPYLoaderDataTypes =
  | Uint8Array
  | Uint8ClampedArray
  | Int8Array
  | Uint16Array
  | Int16Array
  | Uint32Array
  | Int32Array
  | Float32Array
  | Float64Array;

export interface NPYLoaderResponse {
  data: NPYLoaderDataTypes;
  header: {
    descr: string;
    shape: number[];
  };
}

export interface TerrainData {
  header: {
    vertexCount: number;
    boundingBox: [[number, number, number], [number, number, number]];
  };
  mode: 4;
  indices: {
    value: TypedArray;
    size: 1;
  };
  attributes: {
    POSITION: {
      value: TypedArray;
      size: 3;
    };
    TEXCOORD_0: {
      value: TypedArray;
      size: 2;
    };
  };
}

export type KeplerRasterDataset = KeplerDataset & {
  metadata: CompleteSTACObject;
};

export interface Tile2DHeader {
  content?: {
    terrain?: TerrainData;
    images: GetTileDataOutput;
  } | null;
  get data(): GetTileDataOutput;
}
