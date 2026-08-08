// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * Shared UBO for all raster processing module uniforms.
 *
 * WebGL2 guarantees only 12 fragment uniform blocks (GL_MAX_FRAGMENT_UNIFORM_BUFFERS).
 * Without consolidation, the base layer already uses 8–9 blocks (project, picking,
 * lighting, phongMaterial, floatColors, layer, shadow, simpleMesh/rasterMesh, raster),
 * leaving only 3–4 for raster processing modules. Since a typical pipeline can use
 * 5–9 raster modules (combineBands, mask, reorderBands, linearRescale, gammaContrast,
 * sigmoidalContrast, colormap, filter, saturation), each declaring its own UBO block
 * would exceed the limit.
 *
 * This module declares a single UBO that contains all possible raster processing
 * uniforms. Individual modules' GLSL code still references the uniforms through
 * the block instance name, and prepareLumaModules() rewires the declarations.
 */

const RASTER_PROCESSING_UNIFORM_BLOCK = `\
uniform rasterProcessingUniforms {
  // linear_rescale
  float linear_rescale_scaler;
  float linear_rescale_offset;

  // gamma_contrast
  float gamma_contrast_gamma1;
  float gamma_contrast_gamma2;
  float gamma_contrast_gamma3;
  float gamma_contrast_gamma4;

  // sigmoidalContrast
  float sigmoidalContrast_contrast;
  float sigmoidalContrast_bias;

  // colormap
  int colormap_hasCategoricalColors;
  int colormap_categoricalMinValue;
  int colormap_categoricalMaxValue;
  int colormap_maxPixelValue;

  // bandFilter
  float bandFilter_min1;
  float bandFilter_max1;
  float bandFilter_min2;
  float bandFilter_max2;
  float bandFilter_min3;
  float bandFilter_max3;
  float bandFilter_min4;
  float bandFilter_max4;

  // saturation
  float saturation_value;

  // reorder_bands
  mat4 reorder_bands_ordering;

  // mask (shared by mask_image_float, mask_image_uint, mask_image_int)
  float mask_keepMin;
  float mask_keepMax;

  // pansharpen_brovey
  float pansharpen_brovey_panWeight;
} rasterProcessing;
`;

/**
 * GLSL #define aliases that let per-module code continue referencing uniforms
 * through their original block instance names (e.g. `linear_rescale.scaler`).
 */
const ALIAS_DEFINES = `\
#define linear_rescale_scaler_ALIAS rasterProcessing.linear_rescale_scaler
#define linear_rescale_offset_ALIAS rasterProcessing.linear_rescale_offset
#define gamma_contrast_gamma1_ALIAS rasterProcessing.gamma_contrast_gamma1
#define gamma_contrast_gamma2_ALIAS rasterProcessing.gamma_contrast_gamma2
#define gamma_contrast_gamma3_ALIAS rasterProcessing.gamma_contrast_gamma3
#define gamma_contrast_gamma4_ALIAS rasterProcessing.gamma_contrast_gamma4
#define sigmoidalContrast_contrast_ALIAS rasterProcessing.sigmoidalContrast_contrast
#define sigmoidalContrast_bias_ALIAS rasterProcessing.sigmoidalContrast_bias
#define colormap_hasCategoricalColors_ALIAS rasterProcessing.colormap_hasCategoricalColors
#define colormap_categoricalMinValue_ALIAS rasterProcessing.colormap_categoricalMinValue
#define colormap_categoricalMaxValue_ALIAS rasterProcessing.colormap_categoricalMaxValue
#define colormap_maxPixelValue_ALIAS rasterProcessing.colormap_maxPixelValue
#define bandFilter_min1_ALIAS rasterProcessing.bandFilter_min1
#define bandFilter_max1_ALIAS rasterProcessing.bandFilter_max1
#define bandFilter_min2_ALIAS rasterProcessing.bandFilter_min2
#define bandFilter_max2_ALIAS rasterProcessing.bandFilter_max2
#define bandFilter_min3_ALIAS rasterProcessing.bandFilter_min3
#define bandFilter_max3_ALIAS rasterProcessing.bandFilter_max3
#define bandFilter_min4_ALIAS rasterProcessing.bandFilter_min4
#define bandFilter_max4_ALIAS rasterProcessing.bandFilter_max4
#define saturation_value_ALIAS rasterProcessing.saturation_value
#define reorder_bands_ordering_ALIAS rasterProcessing.reorder_bands_ordering
#define mask_keepMin_ALIAS rasterProcessing.mask_keepMin
#define mask_keepMax_ALIAS rasterProcessing.mask_keepMax
#define pansharpen_brovey_panWeight_ALIAS rasterProcessing.pansharpen_brovey_panWeight
`;

export const RASTER_PROCESSING_FS = RASTER_PROCESSING_UNIFORM_BLOCK + ALIAS_DEFINES;

export const rasterProcessingUniforms = {
  name: 'rasterProcessing',
  fs: RASTER_PROCESSING_FS,
  vs: '',
  uniformTypes: {
    linear_rescale_scaler: 'f32',
    linear_rescale_offset: 'f32',
    gamma_contrast_gamma1: 'f32',
    gamma_contrast_gamma2: 'f32',
    gamma_contrast_gamma3: 'f32',
    gamma_contrast_gamma4: 'f32',
    sigmoidalContrast_contrast: 'f32',
    sigmoidalContrast_bias: 'f32',
    colormap_hasCategoricalColors: 'i32',
    colormap_categoricalMinValue: 'i32',
    colormap_categoricalMaxValue: 'i32',
    colormap_maxPixelValue: 'i32',
    bandFilter_min1: 'f32',
    bandFilter_max1: 'f32',
    bandFilter_min2: 'f32',
    bandFilter_max2: 'f32',
    bandFilter_min3: 'f32',
    bandFilter_max3: 'f32',
    bandFilter_min4: 'f32',
    bandFilter_max4: 'f32',
    saturation_value: 'f32',
    reorder_bands_ordering: 'mat4x4<f32>',
    mask_keepMin: 'f32',
    mask_keepMax: 'f32',
    pansharpen_brovey_panWeight: 'f32'
  }
};

/**
 * Map from original module uniform names (as returned by getUniforms) to
 * the prefixed names used in the shared UBO.
 */
export const UNIFORM_NAME_MAP: Record<string, Record<string, string>> = {
  linear_rescale: {
    scaler: 'linear_rescale_scaler',
    offset: 'linear_rescale_offset'
  },
  gamma_contrast: {
    gamma1: 'gamma_contrast_gamma1',
    gamma2: 'gamma_contrast_gamma2',
    gamma3: 'gamma_contrast_gamma3',
    gamma4: 'gamma_contrast_gamma4'
  },
  sigmoidalContrast: {
    contrast: 'sigmoidalContrast_contrast',
    bias: 'sigmoidalContrast_bias'
  },
  colormap: {
    hasCategoricalColors: 'colormap_hasCategoricalColors',
    categoricalMinValue: 'colormap_categoricalMinValue',
    categoricalMaxValue: 'colormap_categoricalMaxValue',
    maxPixelValue: 'colormap_maxPixelValue'
  },
  bandFilter: {
    min1: 'bandFilter_min1',
    max1: 'bandFilter_max1',
    min2: 'bandFilter_min2',
    max2: 'bandFilter_max2',
    min3: 'bandFilter_min3',
    max3: 'bandFilter_max3',
    min4: 'bandFilter_min4',
    max4: 'bandFilter_max4'
  },
  saturation: {
    value: 'saturation_value'
  },
  reorder_bands: {
    ordering: 'reorder_bands_ordering'
  },
  mask_image_float: {
    keepMin: 'mask_keepMin',
    keepMax: 'mask_keepMax'
  },
  mask_image_uint: {
    keepMin: 'mask_keepMin',
    keepMax: 'mask_keepMax'
  },
  mask_image_int: {
    keepMin: 'mask_keepMin',
    keepMax: 'mask_keepMax'
  },
  pansharpen_brovey: {
    panWeight: 'pansharpen_brovey_panWeight'
  }
};
