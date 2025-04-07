// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/* Utilities for creating request urls */
/* global URLSearchParams */

// import {DataConnectionType, dataProxyAPI, PlanetDataConnection} from '@fsq/api';
export enum DataConnectionType {
  PLANET = 'planet'
}
const dataProxyAPI = null;
type PlanetDataConnection = any;

import {StacTypes} from '@kepler.gl/types';
type Item = StacTypes.STACItem;
type Collection = StacTypes.STACCollection;

import {getApplicationConfig} from '@kepler.gl/utils';

import {DATA_SOURCE_IDS} from './config';
import {
  CompleteSTACObject,
  GetTileDataProps,
  AssetIds,
  BandIndexes,
  CompleteSTACItem,
  CompleteSTACCollection
} from './types';

// Four subdomains numbered tiles0 to tiles3
export const PLANET_DOMAINS: string[] = Array(4)
  .fill(0)
  .map((_, i) => `https://tiles${i}.planet.com`);

const TILE_SIZE: 256 | 512 = 256;

// For now, it's still required to use these endpoints since the MosaicJSON documents store the
// *sceneids* and not the full S3 path, so `sceneid_parser` must be called on the scene to find its
// S3 path
const TITILER_PATH_MAPPING: Record<DATA_SOURCE_IDS, string | null> = {
  [DATA_SOURCE_IDS.LANDSAT]: 'landsat_c2/mosaicjson',
  [DATA_SOURCE_IDS.SENTINEL]: 'sentinel2/mosaicjson',
  [DATA_SOURCE_IDS.NAIP]: 'mosaicjson',
  // For planet data, we fetch from Planet's servers directly
  [DATA_SOURCE_IDS.PLANET_NICFI]: null
};

interface StacSearchInfo {
  sentinelCollectionName: string[];
  stacSearchUrl: string;
}

/**
 * This is a quick implementation to support searching Sentinel-2 STAC using two providers. It only works for Sentinel-2 at this point.
 */
const STAC_SEARCH_DATA: Record<string, StacSearchInfo> = {
  // Commenting out Microsoft for now
  // microsoft: {
  //   sentinelCollectionName: ['sentinel-2-l2a'],
  //   stacSearchUrl: 'https://planetarycomputer.microsoft.com/api/stac/v1/search'
  // },
  'earth-search': {
    sentinelCollectionName: ['sentinel-s2-l2a-cogs'],
    stacSearchUrl: 'https://earth-search.aws.element84.com/v0/search'
  }
};

/**
 * Construct query parameters to be sent to STAC API instance
 */
function constructStacApiQuery(options: {
  stac: Item | Collection;
  startDate: string;
  endDate: string;
  stacSearchProvider: string;
}): {collections: string[]; datetime: string} {
  const {stac, startDate, endDate, stacSearchProvider} = options;

  // This is a quick hack to support the same Sentinel 2 STAC object for searching both microsoft
  // and AWS
  const collections = STAC_SEARCH_DATA[stacSearchProvider]?.sentinelCollectionName || [stac.id];

  return {
    collections,
    datetime: `${startDate}T00:00:00Z/${endDate}T23:59:59Z`
  };
}

/**
 * Perform lookup to find url of desired STAC search provider
 */
function getStacApiUrl(stacSearchProvider: string): string {
  return STAC_SEARCH_DATA[stacSearchProvider].stacSearchUrl;
}

export function getStacApiUrlParams(options: {
  stac: CompleteSTACCollection;
  stacSearchProvider: string;
  startDate: string;
  endDate: string;
  mask?: boolean;
  loadAssetIds: AssetIds;
  _stacQuery?: string;
}): URLSearchParams | null {
  const {loadAssetIds, stacSearchProvider, mask = false} = options;
  const query = options._stacQuery || JSON.stringify(constructStacApiQuery(options));
  const searchUrl = getApplicationConfig().rasterStacSearchUrl || getStacApiUrl(stacSearchProvider);

  if (!searchUrl) {
    return null;
  }

  return new URLSearchParams({
    assets: loadAssetIds.join(','),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    return_mask: String(mask),
    url: searchUrl,
    query
  });
}

export function bandIndexesToURLParams(
  urlParams: URLSearchParams,
  bandIndexes: BandIndexes
): URLSearchParams {
  if (getApplicationConfig().rasterServerTitilerIsCustom) {
    // for newer titiler versions
    bandIndexes.forEach(bandIndex => {
      urlParams.append('bidx', String(bandIndex + 1));
    });
  } else {
    // The parameter in titiler is `bands` for landsat/sentinel and `bidx` for COG
    // GDAL/Rasterio/rio-tiler start band indexing at one
    // older titiler versions
    urlParams.append('bidx', bandIndexes.map(val => val + 1).join(','));
  }

  return urlParams;
}

export function getSingleCOGUrlParams(options: {
  stac: CompleteSTACItem;
  loadAssetId: string;
  loadBandIndexes: BandIndexes;
  mask?: boolean;
}): URLSearchParams | null {
  const {stac, loadAssetId, loadBandIndexes, mask = false} = options;
  const url = stac.assets[loadAssetId].href;

  if (!url) {
    return null;
  }

  const urlParams = new URLSearchParams({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    return_mask: String(mask),
    url
  });
  return bandIndexesToURLParams(urlParams, loadBandIndexes);
}

/**
 * Construct full URL to load tile from a Titiler-based backend
 */
export function getTitilerUrl(options: {
  stac: CompleteSTACObject;
  useSTACSearching: boolean;
  x: number;
  y: number;
  z: number;
}): string {
  // mask Set to false for mosaics because entire image is assumed to be valid
  const {stac, useSTACSearching, x, y, z} = options;

  const pathStem = getTitilerPathMapping(stac, useSTACSearching);
  const scale = TILE_SIZE === 512 ? '@2x' : '';
  const domain = chooseDomain(getApplicationConfig().rasterServerUrls, x, y);
  return `${domain}/${pathStem}/tiles/WebMercatorQuad/${z}/${x}/${y}${scale}.npy`;
}

export function getTitilerPathMapping(stac: CompleteSTACObject, useSTACSearching = false): string {
  if (useSTACSearching) {
    return 'stac/mosaic';
  }

  const customMosaics = Boolean(stac?.unfolded?.mosaics);

  if (!customMosaics) {
    return 'cog';
  }

  return TITILER_PATH_MAPPING[stac.id];
}

// TODO: update this with new backend api to construct stac from image
export function getMetaUrl(imageUrl: string): string {
  const params = new URLSearchParams({
    url: imageUrl
  });

  const domain = getApplicationConfig().rasterServerUrls[0];
  const baseUrl = `${domain}/cog/info?`;
  return baseUrl + params.toString();
}

/**
 * Choose from available domains to load images from
 *
 * @param x  x tile index
 * @param y  y tile index
 *
 * @return domain
 */
function chooseDomain(domains: string[], x: number, y: number): string {
  const index = Math.abs(x + y) % domains.length;
  return domains[index];
}

export function getTerrainUrl(x: number, y: number, z: number, meshMaxError: number): string {
  const scale = TILE_SIZE === 512 ? '@2x' : '';

  const params = new URLSearchParams({
    url: 'terrarium',
    mesh_max_error: meshMaxError.toFixed(2)
  });
  const domain = chooseDomain(getApplicationConfig().rasterServerUrls, x, y);
  const baseUrl = `${domain}/mesh/tiles/${z}/${x}/${y}${scale}.terrain?`;
  return baseUrl + params.toString();
}

/**
 * get mesh max error for z value
 * @param z mercator tile z coord
 * @param multiplier multipler applied to default error
 *
 * Uses suggestion from here
 * https://www.linkedin.com/pulse/fast-cesium-terrain-rendering-new-quantized-mesh-output-alvaro-huarte/
 */
export function getMeshMaxError(z: number, multiplier: number): number {
  return (77067.34 / (1 << z)) * multiplier;
}
