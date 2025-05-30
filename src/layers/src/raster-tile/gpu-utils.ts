// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * Functions and constants for handling webgl/luma.gl/deck.gl entities
 */

import {parse, fetchFile, load, FetchError} from '@loaders.gl/core';
import {ImageLoader} from '@loaders.gl/images';
import {NPYLoader} from '@loaders.gl/textures';
import GL from '@luma.gl/constants';
import {Texture2DProps} from '@luma.gl/webgl';

import {sleep} from '@kepler.gl/common-utils';
import {getLoaderOptions} from '@kepler.gl/constants';
import {RasterWebGL} from '@kepler.gl/deckgl-layers';
import {getApplicationConfig} from '@kepler.gl/utils';

type ShaderModule = RasterWebGL.ShaderModule;
const {
  combineBandsFloat,
  combineBandsInt,
  combineBandsUint,
  maskFloat,
  maskInt,
  maskUint,
  linearRescale,
  gammaContrast,
  sigmoidalContrast,
  normalizedDifference,
  enhancedVegetationIndex,
  soilAdjustedVegetationIndex,
  modifiedSoilAdjustedVegetationIndex,
  colormap: colormapModule,
  filter,
  saturation,
  reorderBands,
  rgbaImage
} = RasterWebGL;

import {
  CATEGORICAL_TEXTURE_WIDTH,
  dtypeMaxValue,
  generateCategoricalBitmapArray,
  isColormapAllowed,
  isFilterAllowed,
  isRescalingAllowed
} from './raster-tile-utils';
import {
  CategoricalColormapOptions,
  ImageData,
  NPYLoaderDataTypes,
  NPYLoaderResponse,
  RenderSubLayersProps
} from './types';
import {getRequestThrottle} from './request-throttle';

/**
 * Describe WebGL2 Texture parameters to use for given input data type
 */
interface WebGLTextureFormat {
  format: number;
  dataFormat: number;
  type: number;
}

/**
 * Convert TypedArray to WebGL2 Texture Parameters
 */
function getWebGL2TextureParameters(data: NPYLoaderDataTypes): WebGLTextureFormat | never {
  if (data instanceof Uint8Array || data instanceof Uint8ClampedArray) {
    return {
      // Note: texture data has no auto-rescaling; pixel values stay as 0-255
      format: GL.R8UI,
      dataFormat: GL.RED_INTEGER,
      type: GL.UNSIGNED_BYTE
    };
  }

  if (data instanceof Uint16Array) {
    return {
      format: GL.R16UI,
      dataFormat: GL.RED_INTEGER,
      type: GL.UNSIGNED_SHORT
    };
  }

  if (data instanceof Uint32Array) {
    return {
      format: GL.R32UI,
      dataFormat: GL.RED_INTEGER,
      type: GL.UNSIGNED_INT
    };
  }

  if (data instanceof Int8Array) {
    return {
      format: GL.R8I,
      dataFormat: GL.RED_INTEGER,
      type: GL.BYTE
    };
  }

  if (data instanceof Int16Array) {
    return {
      format: GL.R16I,
      dataFormat: GL.RED_INTEGER,
      type: GL.SHORT
    };
  }
  if (data instanceof Int32Array) {
    return {
      format: GL.R32I,
      dataFormat: GL.RED_INTEGER,
      type: GL.INT
    };
  }
  if (data instanceof Float32Array) {
    return {
      format: GL.R32F,
      dataFormat: GL.RED,
      type: GL.FLOAT
    };
  }

  if (data instanceof Float64Array) {
    return {
      format: GL.R32F,
      dataFormat: GL.RED,
      type: GL.FLOAT
    };
  }

  // For exhaustive check above; following should never occur
  // https://stackoverflow.com/a/58009992
  const unexpectedInput: never = data;
  throw new Error(unexpectedInput);
}

/**
 * Discrete-valued colormaps (e.g. from the output of
 * classification algorithms) in the raster layer. Previously, the values passed to
 * `TEXTURE_MIN_FILTER` and `TEXTURE_MAG_FILTER` were `GL.LINEAR`, which meant that the GPU would
 * linearly interpolate values between two neighboring colormap pixel values. Setting these values
 * to NEAREST means that the GPU will choose the nearest value on the texture2D lookup operation,
 * which fixes precision issues for discrete-valued colormaps. This should be ok for continuous
 * colormaps as long as the color difference between each pixel on the colormap is small.
 */
export const COLORMAP_TEXTURE_PARAMETERS = {
  [GL.TEXTURE_MIN_FILTER]: GL.NEAREST,
  [GL.TEXTURE_MAG_FILTER]: GL.NEAREST,
  [GL.TEXTURE_WRAP_S]: GL.CLAMP_TO_EDGE,
  [GL.TEXTURE_WRAP_T]: GL.CLAMP_TO_EDGE
};

const DEFAULT_8BIT_TEXTURE_PARAMETERS = {
  [GL.TEXTURE_MIN_FILTER]: GL.LINEAR_MIPMAP_LINEAR,
  [GL.TEXTURE_MAG_FILTER]: GL.LINEAR,
  [GL.TEXTURE_WRAP_S]: GL.CLAMP_TO_EDGE,
  [GL.TEXTURE_WRAP_T]: GL.CLAMP_TO_EDGE
};

const DEFAULT_HIGH_BIT_TEXTURE_PARAMETERS = {
  [GL.TEXTURE_MIN_FILTER]: GL.NEAREST,
  [GL.TEXTURE_MAG_FILTER]: GL.NEAREST,
  [GL.TEXTURE_WRAP_S]: GL.CLAMP_TO_EDGE,
  [GL.TEXTURE_WRAP_T]: GL.CLAMP_TO_EDGE
};

/**
 * Select correct module type for "combineBands"
 *
 * combineBands joins up to four 2D arrays (contained in imageBands) into a single "rgba" image
 * texture on the GPU. That shader code needs to have the same data type as the actual image data.
 * E.g. for float data the texture needs to be `sampler2D`, for uint data the texture needs to be
 * `usampler2D` and for int data the texture needs to be `isampler2D`.
 */
export function getCombineBandsModule(imageBands: Texture2DProps[]): ShaderModule {
  // Each image array is expected/required to be of the same data type
  switch (imageBands[0].format) {
    case GL.R8UI:
      return combineBandsUint;
    case GL.R16UI:
      return combineBandsUint;
    case GL.R32UI:
      return combineBandsUint;
    case GL.R8I:
      return combineBandsInt;
    case GL.R16I:
      return combineBandsInt;
    case GL.R32I:
      return combineBandsInt;
    case GL.R32F:
      return combineBandsFloat;
    default:
      throw new Error('bad format');
  }
}

/** Select correct image masking shader module for mask data type
 * The imageMask could (at least in the future, theoretically) be of a different data format than
 * the imageBands data itself.
 */
export function getImageMaskModule(imageMask: Texture2DProps): ShaderModule {
  switch (imageMask.format) {
    case GL.R8UI:
      return maskUint;
    case GL.R16UI:
      return maskUint;
    case GL.R32UI:
      return maskUint;
    case GL.R8I:
      return maskInt;
    case GL.R16I:
      return maskInt;
    case GL.R32I:
      return maskInt;
    case GL.R32F:
      return maskFloat;
    default:
      throw new Error('bad format');
  }
}

/**
 * Load image and wrap with default WebGL texture parameters
 *
 * @param url URL to load image
 * @param textureParams parameters to pass to Texture2D
 *
 * @return image object to pass to Texture2D constructor
 */
export async function loadImage(
  url: string,
  textureParams: Texture2DProps = {},
  requestOptions: RequestInit = {}
): Promise<Texture2DProps> {
  const response = await fetchFile(url, requestOptions);
  const image = await parse(response, ImageLoader);

  return {
    data: image,
    parameters: DEFAULT_8BIT_TEXTURE_PARAMETERS,
    format: GL.RGB,
    ...textureParams
  };
}

type FetchLike = (url: string, options?: RequestInit) => Promise<Response>;
type LoadingOptions = {
  fetch?: typeof fetch | FetchLike;
};

/**
 * Load NPY Array
 *
 * The NPY format is described here: https://numpy.org/doc/stable/reference/generated/numpy.lib.format.html.
 * It's designed to be a very simple file format to hold an N-dimensional block of data. The header describes the data type, shape, and order (either C or Fortran) of the array.
 *
 * @param url URL to load NPY Array
 * @param split Whether to split single typed array representing an N-dimensional array into an Array with each dimension as its own typed array
 *
 * @return image object to pass to Texture2D constructor
 */
export async function loadNpyArray(
  request: {url: string; rasterServerUrl: string; options: RequestInit},
  split: true,
  options?: LoadingOptions
): Promise<Texture2DProps[] | null>;
export async function loadNpyArray(
  request: {url: string; rasterServerUrl: string; options: RequestInit},
  split: false,
  options?: LoadingOptions
): Promise<Texture2DProps | null>;
export async function loadNpyArray(
  request: {url: string; rasterServerUrl: string; options: RequestInit},
  split: boolean,
  options?: LoadingOptions
): Promise<Texture2DProps | Texture2DProps[] | null> {
  const numAttempts = 1 + getApplicationConfig().rasterServerMaxRetries;

  const asset = await getRequestThrottle().throttleRequest(request.rasterServerUrl, async () => {
    for (let attempt = 0; attempt < numAttempts; attempt++) {
      try {
        const {npy: npyOptions} = getLoaderOptions();
        const response: NPYLoaderResponse = await load(request.url, NPYLoader, {
          npy: npyOptions,
          fetch: options?.fetch
        });

        if (!response || !response.data || request.options.signal?.aborted) {
          return null;
        }

        // Float64 data needs to be coerced to Float32 for the GPU
        if (response.data instanceof Float64Array) {
          response.data = Float32Array.from(response.data);
        }

        const {data, header} = response;
        const {shape} = header;
        const {format, dataFormat, type} = getWebGL2TextureParameters(data);

        // TODO: check height-width or width-height
        // Regardless, images usually square
        // TODO: handle cases of 256x256x1 instead of 1x256x256
        const [z, height, width] = shape;

        // Since we now use WebGL2 data types for 8-bit textures, we set the following for all textures
        const mipmaps = false;
        const parameters = DEFAULT_HIGH_BIT_TEXTURE_PARAMETERS;

        if (!split) {
          return {
            data,
            width,
            height,
            format,
            dataFormat,
            type,
            parameters,
            mipmaps
          };
        }

        // Split into individual arrays
        const channels: Texture2DProps[] = [];
        const channelSize = height * width;
        for (let i = 0; i < z; i++) {
          channels.push({
            data: data.subarray(i * channelSize, (i + 1) * channelSize),
            width,
            height,
            format,
            dataFormat,
            type,
            parameters,
            mipmaps
          });
        }
        return channels;
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
  });

  return asset;
}

/**
 * Create texture data for categorical colormap scale
 * @param categoricalOptions - color map configuration and min-max values of categorical band
 * @returns texture data
 */
export function generateCategoricalColormapTexture(
  categoricalOptions: CategoricalColormapOptions
): Texture2DProps {
  const data = generateCategoricalBitmapArray(categoricalOptions);
  return {
    data,
    width: CATEGORICAL_TEXTURE_WIDTH,
    height: 1,
    format: GL.RGBA,
    dataFormat: GL.RGBA,
    type: GL.UNSIGNED_BYTE,
    parameters: COLORMAP_TEXTURE_PARAMETERS,
    mipmaps: false
  };
}

// TODO: would probably be simpler to only pass in the props actually used by this function. That
// would mean a smaller object than RenderSubLayersProps
// eslint-disable-next-line max-statements, complexity
export function getModules({
  images,
  props
}: {
  images: Partial<ImageData>;
  props?: RenderSubLayersProps;
}): {
  modules: ShaderModule[];
  moduleProps: Record<string, any>;
} {
  const moduleProps: Record<string, any> = {};
  // Array of luma.gl WebGL modules to pass to the RasterLayer
  const modules: ShaderModule[] = [];

  // use rgba image directly. Used for raster .pmtiles rendering
  if (images.imageRgba) {
    modules.push(rgbaImage);

    // no support for other modules atm for direct rgba mode
    return {modules, moduleProps};
  }

  if (!props) {
    return {modules, moduleProps};
  }

  const {
    renderBandIndexes,
    nonLinearRescaling,
    linearRescalingFactor,
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
    hasCategoricalColorMap
  } = props;

  if (Array.isArray(images.imageBands) && images.imageBands.length > 0) {
    modules.push(getCombineBandsModule(images.imageBands));
  }

  if (images.imageMask) {
    modules.push(getImageMaskModule(images.imageMask));
    // In general, data masks are 0 for nodata and the maximum value for valid data, e.g. 255 or
    // 65535 for uint8 or uint16 data, respectively
    moduleProps.maskKeepMin = 1;
  }

  if (Array.isArray(renderBandIndexes)) {
    modules.push(reorderBands);
    moduleProps.ordering = renderBandIndexes;
  }

  const globalRange = maxPixelValue - minPixelValue;
  // Fix rescaling if we are sure that dataset is categorical
  if (hasCategoricalColorMap) {
    modules.push(linearRescale);
    moduleProps.linearRescaleScaler = 1 / maxPixelValue;
    moduleProps.linearRescaleOffset = 0;
  } else if (isRescalingAllowed(bandCombination)) {
    if (!nonLinearRescaling) {
      const [min, max] = linearRescalingFactor;
      const localRange = max - min;

      // Add linear rescaling module
      modules.push(linearRescale);

      // Divide by local range * global range
      moduleProps.linearRescaleScaler = 1 / (localRange * globalRange);

      // Subtract off the local min
      moduleProps.linearRescaleOffset = -min;

      // Clamp to [0, 1] done automatically?
    } else {
      modules.push(linearRescale);
      moduleProps.linearRescaleScaler = 1 / maxPixelValue;
      moduleProps.linearRescaleOffset = 0;

      modules.push(gammaContrast);
      moduleProps.gammaContrastValue = gammaContrastFactor;

      modules.push(sigmoidalContrast);
      moduleProps.sigmoidalContrast = sigmoidalContrastFactor;
      moduleProps.sigmoidalBias = sigmoidalBiasFactor;
    }

    if (Number.isFinite(saturationValue) && saturationValue !== 1) {
      modules.push(saturation);
      moduleProps.saturationValue = saturationValue;
    }
  }

  switch (bandCombination) {
    case 'normalizedDifference':
      modules.push(normalizedDifference);
      break;
    case 'enhancedVegetationIndex':
      modules.push(enhancedVegetationIndex);
      break;
    case 'soilAdjustedVegetationIndex':
      modules.push(soilAdjustedVegetationIndex);
      break;
    case 'modifiedSoilAdjustedVegetationIndex':
      modules.push(modifiedSoilAdjustedVegetationIndex);
      break;
    default:
      break;
  }

  if (isFilterAllowed(bandCombination) && filterEnabled) {
    modules.push(filter);
    moduleProps.filterMin1 = filterRange[0];
    moduleProps.filterMax1 = filterRange[1];
  }

  // Apply colormap
  if (isColormapAllowed(bandCombination) && images.imageColormap) {
    modules.push(colormapModule);
    moduleProps.minCategoricalBandValue = minCategoricalBandValue;
    moduleProps.maxCategoricalBandValue = maxCategoricalBandValue;
    moduleProps.dataTypeMaxValue = dtypeMaxValue[dataType];
    moduleProps.maxPixelValue = maxPixelValue;
  }

  return {modules, moduleProps};
}
