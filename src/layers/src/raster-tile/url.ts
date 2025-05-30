// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/* Utilities for creating request urls */
/* global URLSearchParams */

import {StacTypes} from '@kepler.gl/types';
import {getApplicationConfig} from '@kepler.gl/utils';

import {DEFAULT_BAND_MAPPINGS} from './config';
import {
  AssetIds,
  BandIndexes,
  CompleteSTACItem,
  CompleteSTACCollection,
  GetTileDataProps
} from './types';

type Item = StacTypes.STACItem;
type Collection = StacTypes.STACCollection;

const TILE_SIZE: 256 | 512 = 256;

interface StacSearchInfo {
  sentinelCollectionName: string[];
  stacSearchUrl: string;
}

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
  const {stac, loadAssetIds, stacSearchProvider, mask = false} = options;
  const query = options._stacQuery || JSON.stringify(constructStacApiQuery(options));
  const searchUrl = getStacApiUrl(stacSearchProvider);

  if (!searchUrl) {
    return null;
  }

  const bandIndexAssets = loadAssetIds.map(assetId => {
    const mapping = DEFAULT_BAND_MAPPINGS[stac.id];
    if (!mapping) {
      // TODO provide a UI to setup custom band mapping
      return assetId;
    }

    const bandIndex = mapping[assetId];
    if (bandIndex) {
      return bandIndex;
    }

    // This is most likely incorrect as BXX is expected, not common name
    return assetId;
  });

  return new URLSearchParams({
    assets: bandIndexAssets.join(','),
    return_mask: String(mask),
    url: searchUrl,
    query
  });
}

export function bandIndexesToURLParams(
  urlParams: URLSearchParams,
  bandIndexes: BandIndexes
): URLSearchParams {
  if (getApplicationConfig().rasterServerUseLatestTitiler) {
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
    return_mask: String(mask),
    url
  });
  return bandIndexesToURLParams(urlParams, loadBandIndexes);
}

/**
 * Construct full URL to load tile from a Titiler-based backend
 */
export function getTitilerUrl(options: {
  stac: GetTileDataProps['stac'];
  useSTACSearching: boolean;
  x: number;
  y: number;
  z: number;
}): {url: string; rasterServerUrl: string} {
  // mask Set to false for mosaics because entire image is assumed to be valid
  const {stac, useSTACSearching, x, y, z} = options;

  if (!stac.rasterTileServerUrls?.length) {
    throw new Error('No raster tile servers');
  }

  const pathStem = getTitilerPathMapping(stac, useSTACSearching);
  const scale = TILE_SIZE === 512 ? '@2x' : '';
  const domain = chooseDomain(stac.rasterTileServerUrls, x, y);
  return {
    url: `${domain}/${pathStem}/tiles/WebMercatorQuad/${z}/${x}/${y}${scale}.npy`,
    rasterServerUrl: domain
  };
}

export function getTitilerPathMapping(
  stac: GetTileDataProps['stac'],
  useSTACSearching = false
): string {
  if (useSTACSearching) {
    return 'stac/mosaic';
  }

  return 'cog';
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

export function getTerrainUrl(
  rasterTileServerUrls: string[],
  x: number,
  y: number,
  z: number,
  meshMaxError: number
): {url: string; rasterServerUrl: string} {
  const scale = TILE_SIZE === 512 ? '@2x' : '';

  const params = new URLSearchParams({
    url: 'terrarium',
    mesh_max_error: meshMaxError.toFixed(2)
  });
  const domain = chooseDomain(rasterTileServerUrls, x, y);
  const baseUrl = `${domain}/mesh/tiles/${z}/${x}/${y}${scale}.terrain?`;
  return {url: baseUrl + params.toString(), rasterServerUrl: domain};
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

export const RasterLayerResources = {
  rasterColorMap: (colormapId: string) => {
    return `${getApplicationConfig().cdnUrl}/raster/colormaps/${colormapId}.png`;
  }
};
