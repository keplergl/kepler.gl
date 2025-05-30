// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * Utility functions to create objects to pass to deck.gl-raster
 */

import {load, FetchError} from '@loaders.gl/core';
import {QuantizedMeshLoader} from '@loaders.gl/terrain';
import memoize from 'lodash/memoize';

import {sleep} from '@kepler.gl/common-utils';
import {getLoaderOptions} from '@kepler.gl/constants';
import {getApplicationConfig} from '@kepler.gl/utils';

import {CATEGORICAL_COLORMAP_ID} from './config';
import {
  loadNpyArray,
  generateCategoricalColormapTexture,
  loadImage,
  COLORMAP_TEXTURE_PARAMETERS
} from './gpu-utils';
import {CATEGORICAL_TEXTURE_WIDTH, generateCategoricalBitmapArray} from './raster-tile-utils';
import {
  GetTileDataProps,
  ImageData,
  TerrainData,
  AssetRequestData,
  CategoricalColormapOptions,
  ColormapImageData
} from './types';
import {
  getTitilerUrl,
  getTerrainUrl,
  getSingleCOGUrlParams,
  getStacApiUrlParams,
  getMeshMaxError,
  RasterLayerResources
} from './url';
import {getRequestThrottle} from './request-throttle';

/**
 * Create dataUrl image from bitmap array
 * @param bitmap - RGBA byte bitmap array
 * @param width - width of the image
 * @param height - height of the image
 * @returns base64 data url of the image
 */
export function getImageDataURL(bitmap: Uint8Array, width: number, height: number): string | null {
  const canvas = document.createElement('canvas');
  if (!canvas.getContext) {
    return null;
  }
  canvas.setAttribute('width', `${width}`);
  canvas.setAttribute('height', `${height}`);
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return null;
  }
  for (let i = 0; i < width; i++) {
    const [r, g, b, a] = bitmap.subarray(i * 4, i * 4 + 4);
    if (a !== 0) {
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(i, 0, 1, 1);
    }
  }
  return canvas.toDataURL('image/png');
}

// Global multiplier to be applied to terrain mesh resolution
// A smaller number towards 0 will cause generation of mesh data with a smaller max error and thus a
// higher resolution mesh
const MESH_MULTIPLIER = 0.8;

/**
 * Multiplier used to calculate the height of terrain mesh skirts.
 * The skirt is an extension of the terrain mesh that helps prevent gaps between terrain tiles
 * by extending the mesh edges downward. This multiplier is applied to the mesh's maximum error
 * to determine the skirt height, ensuring no gaps are visible.
 */
const SKIRT_HEIGHT_MULTIPLIER = 3;

/**
 * Load images required for raster tile
 * @param assetRequests - STAC asset requests
 * @param colormapId - colormap id
 * @param categoricalOptions - categorical options requred for making of categorical colormap
 * @returns images map
 */
export async function loadImages(
  assetRequests: AssetRequestData[],
  colormapId: string,
  categoricalOptions: CategoricalColormapOptions
): Promise<ImageData> {
  // We load image data (single or multi asset based on number of requests) and colormap in parallel
  const [stacImages, colormap] = await Promise.all([
    loadSTACImageData(assetRequests),
    (colormapId !== CATEGORICAL_COLORMAP_ID && memoizedLoadColormap(colormapId)) || null
  ]);
  let imageColormap = colormap;
  if (colormapId === CATEGORICAL_COLORMAP_ID) {
    imageColormap = generateCategoricalColormapTexture(categoricalOptions);
  }
  return {
    ...stacImages,
    imageColormap
  };
}

/**
 * Cache loading of colormap. Each colormap file is very small, on the order of a few hundred bytes,
 * so a global cache like this is not expected to eat up too much memory.
 * Most colormaps are loaded from CDN. In case colormapId is categorical, the image is created from
 * categorical colormap options.
 * NOTE: this implementation will cache promise rejections as well, but since these are small files
 * on the CDN, that's an acceptable risk for the time being.
 */
const memoizedLoadColormap: (colormapId: string) => Promise<ColormapImageData | null> | null =
  memoize((colormapId: string) => {
    if (colormapId === CATEGORICAL_COLORMAP_ID) {
      return null;
    } else {
      return loadColormap(colormapId);
    }
  });

/**
 * Load PNG colormap.
 * Since the colormap files are so small (couple hundred bytes), we load them always, even for an
 * RGB composite where the colormap won't be used. After the first load, the colormap should be
 * loaded from the disk cache. By loading always, we can prevent unnecessarily triggering
 * getTileData, which reduces flashing from reloading the images on the GPU.
 *
 * @param colormapId      ID of colormap PNG
 *
 * @returns image object to pass to Texture2D constructor
 */
async function loadColormap(colormapId: string): Promise<ColormapImageData | null> {
  if (!colormapId) {
    return null;
  }

  const request = await getAssetRequest({
    url: RasterLayerResources.rasterColorMap(colormapId),
    rasterServerUrl: '',
    options: {}
  });
  return loadImage(request.url, COLORMAP_TEXTURE_PARAMETERS, request.options);
}

/**
 * Get the request data for loading a single or multi asset STAC metadata object.
 * @param options STAC metadata object and user-defined parameters.
 * @returns Image data, or null if the STAC metadata object is not supported.
 */
export async function getSTACImageRequests(
  options: GetTileDataProps
): Promise<AssetRequestData[] | null> {
  const {loadAssetIds} = options;

  if (loadAssetIds.length === 1) {
    const request = await getSingleAssetSTACRequest(options);
    return request ? [request] : null;
  }

  return await getMultiAssetSTACRequest(options);
}

// TODO: image loading should really be _driven by the modules_
// E.g. the user chooses what kind of pipeline they want on the GPU, then from those modules we can
// see whether the user wants the pansharpened band, colormap, etc
/**
 * Load images defined by a STAC metadata object plus user-defined parameters
 */
export async function loadSTACImageData(requests: AssetRequestData[]): Promise<ImageData> {
  return requests.length === 1 ? loadSingleAssetSTAC(requests[0]) : loadMultiAssetSTAC(requests);
}

/**
 * Utility function that forms an asset request based on given parameters.
 */
export async function getAssetRequest({
  url,
  rasterServerUrl,
  params,
  options,
  useMask = true,
  responseRequiredBandIndices
}: {
  url: string;
  rasterServerUrl: string;
  params?: URLSearchParams | null;
  options: RequestInit;
  useMask?: boolean;
  responseRequiredBandIndices?: number[] | null;
}): Promise<AssetRequestData> {
  const requestUrl = url;
  const requestParams = params ?? new URLSearchParams();
  const requestOptions = options;

  const assetUrl = requestParams ? `${requestUrl}?${requestParams.toString()}` : requestUrl;
  return {
    url: assetUrl,
    rasterServerUrl,
    options: requestOptions,
    useMask,
    responseRequiredBandIndices
  };
}

/**
 * Utility function for forming a request for a single asset STAC metadata object.
 */
// eslint-disable-next-line complexity, max-statements
async function getSingleAssetSTACRequest(
  options: GetTileDataProps
): Promise<AssetRequestData | null> {
  const {
    stac,
    loadAssetIds,
    loadBandIndexes,
    signal,
    useSTACSearching,
    index: {x, y, z},
    stacSearchProvider,
    startDate,
    endDate,
    _stacQuery
  } = options;

  const useMask = true;

  // Only a single URL because only a single asset
  let urlInfo: {url: string; rasterServerUrl: string} | null = null;
  let urlParams: URLSearchParams | null = new URLSearchParams();
  let responseRequiredBandIndices: number[] | null = loadBandIndexes;
  if (useSTACSearching && stac.type !== 'Feature') {
    urlParams = getStacApiUrlParams({
      stac,
      stacSearchProvider,
      startDate,
      endDate,
      mask: useMask,
      loadAssetIds,
      _stacQuery
    });
    urlInfo = getTitilerUrl({stac, useSTACSearching, x, y, z});
  } else if (stac.type === 'Feature') {
    // stac is an Item
    urlParams = getSingleCOGUrlParams({
      stac,
      loadAssetId: loadAssetIds[0],
      loadBandIndexes,
      mask: useMask
    });
    urlInfo = getTitilerUrl({stac, useSTACSearching, x, y, z});
    responseRequiredBandIndices = null;
  } else {
    return null;
  }

  if (!urlInfo.url) {
    return null;
  }

  return await getAssetRequest({
    ...urlInfo,
    params: urlParams,
    options: {signal},
    useMask,
    responseRequiredBandIndices
  });
}

/**
 * Utility function for forming requests for a multi asset STAC metadata object.
 */
async function getMultiAssetSTACRequest(
  options: GetTileDataProps
): Promise<AssetRequestData[] | null> {
  const {
    stac,
    loadAssetIds,
    loadBandIndexes,
    signal,
    useSTACSearching,
    stacSearchProvider,
    startDate,
    endDate,
    index: {x, y, z},
    _stacQuery
  } = options;

  // Multiple urls, one for each asset
  let requestData: {
    url: string;
    rasterServerUrl: string;
    params: URLSearchParams | null;
    options?: RequestInit;
  }[] = [];

  // We assume that there's only one validity mask for the entire asset, and therefore any of the
  // requests would return the same validity bitmap. Therefore we only request a mask for the first
  // asset
  const requestMask: boolean[] = new Array(loadAssetIds.length).fill(false);
  requestMask[0] = true;

  if (useSTACSearching && stac.type !== 'Feature') {
    requestData = zip(loadAssetIds, requestMask).map(([assetId, mask]) => {
      const params = getStacApiUrlParams({
        stac,
        stacSearchProvider,
        startDate,
        endDate,
        mask,
        loadAssetIds: [assetId],
        _stacQuery
      });
      const urlInfo = getTitilerUrl({stac, useSTACSearching, x, y, z});
      return {...urlInfo, params};
    });
  } else if (stac.type === 'Feature') {
    requestData = zip3(loadAssetIds, loadBandIndexes, requestMask).map(
      ([assetId, bandIndex, mask]) => {
        const params = getSingleCOGUrlParams({
          stac,
          loadAssetId: assetId,
          loadBandIndexes: [bandIndex],
          mask
        });
        const urlInfo = getTitilerUrl({stac, useSTACSearching, x, y, z});
        return {...urlInfo, params};
      }
    );
  }

  if (isValidRequestData(requestData)) {
    return await Promise.all(
      requestData.map(request =>
        getAssetRequest({...request, options: request.options ?? {signal}})
      )
    );
  }

  return null;
}

/**
 * Load image data when consolidated in bands within a single STAC Asset
 */
async function loadSingleAssetSTAC(request: AssetRequestData): Promise<ImageData> {
  const imageBands = await loadNpyArray(request, true);

  if (!imageBands) {
    return {
      imageBands
    };
  }

  const imageMask = (request.useMask && imageBands.pop()) || null;
  let mappedImageBands = imageBands;
  if (request.responseRequiredBandIndices) {
    mappedImageBands = request.responseRequiredBandIndices.map(i => imageBands[i]);
  }
  return {imageBands: mappedImageBands, imageMask};
}

/**
 * Load image data when split among multiple STAC Assets
 */
async function loadMultiAssetSTAC(requests: AssetRequestData[]): Promise<ImageData> {
  const results = await Promise.all(requests.map(request => loadNpyArray(request, true)));
  // The first request includes a mask
  const imageMask = results[0]?.pop() || null;
  const imageBands = results.flat().filter(band => band !== null) as ImageData['imageBands'];
  return {imageBands, imageMask};
}

/**
 * Iterate over two arrays simultaneously, similar to Python's zip builtin
 */
function zip<T1, T2>(a: T1[], b: T2[]): [T1, T2][] {
  return a.map((k, i) => [k, b[i]]);
}

/**
 * Iterate over three arrays simultaneously, similar to Python's zip builtin
 */
function zip3<T1, T2, T3>(a: T1[], b: T2[], c: T3[]): [T1, T2, T3][] {
  return a.map((k, i) => [k, b[i], c[i]]);
}

/**
 * Type guard to check if all array elements are strings
 */
function isValidRequestData(
  arr: {url: unknown; params: unknown; options?: unknown}[]
): arr is {url: string; params: URLSearchParams; options: unknown}[] {
  return arr.every(x => typeof x?.url === 'string' && x?.params !== null);
}

/**
 * Create base64 image data url for categorical colormap
 * @param categoricalOptions - color map configuration and min-max values of categorical band
 * @returns base64 image data url
 */
export function getCategoricalColormapDataUrl(
  categoricalOptions: CategoricalColormapOptions
): string | null {
  const bitmap = generateCategoricalBitmapArray(categoricalOptions);
  if (!bitmap) {
    return null;
  }
  return getImageDataURL(bitmap, CATEGORICAL_TEXTURE_WIDTH, 1);
}

/**
 * Load terrain mesh from raster tile server
 * @param props - properties to load terrain data
 * @returns terrain mesh data
 */
export async function loadTerrain(props: {
  index: {x: number; y: number; z: number};
  signal: AbortSignal;
  rasterTileServerUrls: string[];
  boundsForGeometry?: [number, number, number, number];
}): Promise<TerrainData | null> {
  const {
    index: {x, y, z},
    boundsForGeometry,
    signal,
    rasterTileServerUrls
  } = props;

  const meshMaxError = getMeshMaxError(z, MESH_MULTIPLIER);
  const terrainUrlInfo = getTerrainUrl(rasterTileServerUrls, x, y, z, meshMaxError);
  const loaderOptions = getLoaderOptions();
  const numAttempts = 1 + getApplicationConfig().rasterServerMaxRetries;

  const mesh = await getRequestThrottle().throttleRequest(
    terrainUrlInfo.rasterServerUrl,
    async () => {
      for (let attempt = 0; attempt < numAttempts; attempt++) {
        try {
          return (await load(terrainUrlInfo.url, QuantizedMeshLoader, {
            fetch: {signal},
            'quantized-mesh': {
              ...loaderOptions['quantized-mesh'],
              bounds: boundsForGeometry,
              skirtHeight: meshMaxError * SKIRT_HEIGHT_MULTIPLIER
            }
          })) as Promise<TerrainData>;
        } catch (error) {
          // Retry if Service Temporarily Unavailable 503 error etc.
          if (
            attempt < numAttempts &&
            error instanceof FetchError &&
            getApplicationConfig().rasterServerServerErrorsToRetry?.includes(
              error.response?.status as number
            )
          ) {
            await sleep(getApplicationConfig().rasterServerRetryDelay);
            continue;
          }
        }
      }
      return null;
    }
  );

  return mesh;
}
