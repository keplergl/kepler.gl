// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {RasterTileLayerColorMaps, RasterTileLayerPresets} from './raster-tile-layer-schema';
import {
  VisConfigBoolean,
  VisConfigNumber,
  VisConfigRange,
  VisConfigSelection,
  VisConfigInput
} from '@kepler.gl/types';

import {ColorRescaling, ConfigOption, PresetData, BandCombination} from './types';

/**
 * Data Source IDs
 * These must be kept in sync with the value of stac.id in our custom STAC files
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export enum DATA_SOURCE_IDS {
  LANDSAT = 'landsat-8-c1-l1',
  SENTINEL = 'sentinel-s2-l2a',
  NAIP = 'naip-analytic',
  PLANET_NICFI = 'planet-nicfi'
}

/**
 * Per-data source color rescaling defaults
 */
// TODO: put these in STAC item as a custom attribute?
export const DATA_SOURCE_COLOR_DEFAULTS: Record<DATA_SOURCE_IDS, ColorRescaling> = {
  [DATA_SOURCE_IDS.PLANET_NICFI]: {
    gammaContrastFactor: 1.3,
    sigmoidalContrastFactor: 7,
    sigmoidalBiasFactor: 0.16,
    saturationValue: 1
  },
  [DATA_SOURCE_IDS.LANDSAT]: {
    gammaContrastFactor: 1.2,
    sigmoidalContrastFactor: 30,
    sigmoidalBiasFactor: 0.18,
    saturationValue: 1
  },
  [DATA_SOURCE_IDS.SENTINEL]: {
    gammaContrastFactor: 1.2,
    sigmoidalContrastFactor: 7,
    sigmoidalBiasFactor: 0.19,
    saturationValue: 1
  },
  [DATA_SOURCE_IDS.NAIP]: {
    gammaContrastFactor: 1,
    sigmoidalContrastFactor: 6,
    sigmoidalBiasFactor: 0.3,
    saturationValue: 1.2
  }
};

/**
 * Available "presets"
 *
 * I define a "preset" as one specific manner of loading bands and combining them on the frontend.
 * In the future I expect we'll want a UI that gives the user full flexibility.
 */
export const PRESET_OPTIONS: Record<string, PresetData> = {
  trueColor: {
    label: 'True Color',
    id: RasterTileLayerPresets.trueColor,
    bandCombination: BandCombination.Rgb,
    commonNames: ['red', 'green', 'blue']
  },
  infrared: {
    label: 'Infrared',
    id: RasterTileLayerPresets.infrared,
    bandCombination: BandCombination.Rgb,
    commonNames: ['nir', 'red', 'green'],
    description: 'False-color infrared composite. Near-infrared, red, green mapped to RGB'
  },
  agriculture: {
    label: 'Agriculture',
    id: RasterTileLayerPresets.agriculture,
    bandCombination: BandCombination.Rgb,
    commonNames: ['swir16', 'nir', 'blue'],
    description:
      'False-color agriculture composite. Short-wave infrared 1, near-infrared, blue mapped to RGB.'
  },
  forestBurn: {
    label: 'Forest Burn',
    id: RasterTileLayerPresets.forestBurn,
    bandCombination: BandCombination.Rgb,
    commonNames: ['swir22', 'nir', 'blue'],
    description:
      'False-color forest burn composite. Short-wave infrared 2, near-infrared, blue mapped to RGB'
  },
  ndvi: {
    label: 'NDVI',
    id: RasterTileLayerPresets.ndvi,
    bandCombination: BandCombination.NormalizedDifference,
    commonNames: ['nir', 'red'],
    description: 'Normalized Difference Vegetation Index',
    infoUrl:
      'https://www.usgs.gov/core-science-systems/nli/landsat/landsat-normalized-difference-vegetation-index'
  },
  // Comment this out for now, because in testing it looks like there's an overflow of some sort;
  // index values should be between -1 and 1, but values look way out of bounds
  // evi: {
  //   label: 'EVI',
  //   id: RasterTileLayerPresets.evi,
  //   bandCombination: 'enhancedVegetationIndex',
  //   commonNames: ['nir', 'red', 'blue']
  // },
  savi: {
    label: 'SAVI',
    id: RasterTileLayerPresets.savi,
    bandCombination: BandCombination.SoilAdjustedVegetationIndex,
    commonNames: ['nir', 'red'],
    description: 'Soil Adjusted Vegetation Index',
    infoUrl:
      'https://www.usgs.gov/core-science-systems/nli/landsat/landsat-soil-adjusted-vegetation-index'
  },
  msavi: {
    label: 'MSAVI',
    id: RasterTileLayerPresets.msavi,
    bandCombination: BandCombination.ModifiedSoilAdjustedVegetationIndex,
    commonNames: ['nir', 'red'],
    description: 'Modified Soil Adjusted Vegetation Index',
    infoUrl:
      'https://www.usgs.gov/core-science-systems/nli/landsat/landsat-modified-soil-adjusted-vegetation-index'
  },
  ndmi: {
    label: 'NDMI',
    id: RasterTileLayerPresets.ndmi,
    bandCombination: BandCombination.NormalizedDifference,
    commonNames: ['nir', 'swir16'],
    description: 'Normalized Difference Moisture Index',
    infoUrl:
      'https://www.usgs.gov/core-science-systems/nli/landsat/normalized-difference-moisture-index'
  },
  nbr: {
    label: 'NBR',
    id: RasterTileLayerPresets.nbr,
    bandCombination: BandCombination.NormalizedDifference,
    commonNames: ['nir', 'swir22'],
    description: 'Normalized Burn Ratio',
    infoUrl: 'https://www.usgs.gov/core-science-systems/nli/landsat/landsat-normalized-burn-ratio'
  },
  nbr2: {
    label: 'NBR 2',
    id: RasterTileLayerPresets.nbr2,
    bandCombination: BandCombination.NormalizedDifference,
    commonNames: ['swir16', 'swir22'],
    description: 'Normalized Burn Ratio 2',
    infoUrl: 'https://www.usgs.gov/core-science-systems/nli/landsat/landsat-normalized-burn-ratio-2'
  },
  singleBand: {
    label: 'Single Band',
    id: RasterTileLayerPresets.singleBand,
    bandCombination: BandCombination.Single,
    description: 'Render a single band data'
  }
};

/**
 * Valid zoom ranges for each data source
 *
 * The maximum zoom is derived from the resolution of each data source.
 * The minimum zoom relates to the number of overviews in the COGs at the source. The more
 * overviews, the easier it is to create downsampled tiles. The minimum zooms can be reduced but it
 * takes longer to serve low-zoom tiles since the server must read from many image sources.
 */
// TODO: use render:max_overview_gsd from STAC
export const ZOOM_RANGES: Record<DATA_SOURCE_IDS, [number, number]> = {
  [DATA_SOURCE_IDS.LANDSAT]: [7, 12],
  [DATA_SOURCE_IDS.SENTINEL]: [8, 13],
  [DATA_SOURCE_IDS.NAIP]: [5, 17],
  [DATA_SOURCE_IDS.PLANET_NICFI]: [2, 18]
};

/**
 * Bit depth for each data source
 *
 * Landsat-8 is 16-bit; Sentinel-2 and Planet are 12-bit; NAIP is 8-bit
 */
// TODO: use range value and dtype in STAC collection instead of this
export const MAX_PIXEL_VALUES: Record<DATA_SOURCE_IDS, number> = {
  [DATA_SOURCE_IDS.LANDSAT]: Math.pow(2, 16) - 1,
  [DATA_SOURCE_IDS.SENTINEL]: Math.pow(2, 12) - 1,
  [DATA_SOURCE_IDS.NAIP]: Math.pow(2, 8) - 1,
  [DATA_SOURCE_IDS.PLANET_NICFI]: Math.pow(2, 12) - 1
};

/**
 * Id for categorical colormap. Unlike most colormaps. Categorical colormap image is created
 * from colormap set in visConfig
 */
export const CATEGORICAL_COLORMAP_ID = '_categorical';

/**
 * A list of available colormaps. Colormaps are originally derived from
 * matplotlib, then via rio-tiler. Colormaps are 10x256 PNG images that are
 * loaded as textures
 */

export const COLORMAP_OPTIONS: readonly ConfigOption[] = [
  {
    label: 'Cfastie',
    id: RasterTileLayerColorMaps.cfastie
  },
  {
    label: 'Rplumbo',
    id: RasterTileLayerColorMaps.rplumbo
  },
  {
    label: 'Schwarzwald',
    id: RasterTileLayerColorMaps.schwarzwald
  },
  {
    label: 'Viridis',
    id: RasterTileLayerColorMaps.viridis
  },
  {
    label: 'Plasma',
    id: RasterTileLayerColorMaps.plasma
  },
  {
    label: 'Inferno',
    id: RasterTileLayerColorMaps.inferno
  },
  {
    label: 'Magma',
    id: RasterTileLayerColorMaps.magma
  },
  {
    label: 'Cividis',
    id: RasterTileLayerColorMaps.cividis
  },
  {
    label: 'Greys',
    id: RasterTileLayerColorMaps.greys
  },
  {
    label: 'Purples',
    id: RasterTileLayerColorMaps.purples
  },
  {
    label: 'Blues',
    id: RasterTileLayerColorMaps.blues
  },
  {
    label: 'Greens',
    id: RasterTileLayerColorMaps.greens
  },
  {
    label: 'Oranges',
    id: RasterTileLayerColorMaps.oranges
  },
  {
    label: 'Reds',
    id: RasterTileLayerColorMaps.reds
  },
  {
    label: 'Yl-Or-Br',
    id: RasterTileLayerColorMaps.ylorbr
  },
  {
    label: 'Yl-Or-Rd',
    id: RasterTileLayerColorMaps.ylorrd
  },
  {
    label: 'Or-Rd',
    id: RasterTileLayerColorMaps.orrd
  },
  {
    label: 'Pu-Rd',
    id: RasterTileLayerColorMaps.purd
  },
  {
    label: 'Rd-Pu',
    id: RasterTileLayerColorMaps.rdpu
  },
  {
    label: 'Bu-Pu',
    id: RasterTileLayerColorMaps.bupu
  },
  {
    label: 'Gn-Bu',
    id: RasterTileLayerColorMaps.gnbu
  },
  {
    label: 'Pu-Bu',
    id: RasterTileLayerColorMaps.pubu
  },
  {
    label: 'Yl-Gn-Bu',
    id: RasterTileLayerColorMaps.ylgnbu
  },
  {
    label: 'Pu-Bu-Gn',
    id: RasterTileLayerColorMaps.pubugn
  },
  {
    label: 'Blue-Gn',
    id: RasterTileLayerColorMaps.bugn
  },
  {
    label: 'Yl-Gn',
    id: RasterTileLayerColorMaps.ylgn
  },
  {
    label: 'W-n-B',
    id: RasterTileLayerColorMaps.binary
  },
  {
    label: 'B-n-W',
    id: RasterTileLayerColorMaps.gray
  },
  {
    label: 'Bone',
    id: RasterTileLayerColorMaps.bone
  },
  {
    label: 'Pink',
    id: RasterTileLayerColorMaps.pink
  },
  {
    label: 'Spring',
    id: RasterTileLayerColorMaps.spring
  },
  {
    label: 'Summer',
    id: RasterTileLayerColorMaps.summer
  },
  {
    label: 'Autumn',
    id: RasterTileLayerColorMaps.autumn
  },
  {
    label: 'Winter',
    id: RasterTileLayerColorMaps.winter
  },
  {
    label: 'Cool',
    id: RasterTileLayerColorMaps.cool
  },
  {
    label: 'Wistia',
    id: RasterTileLayerColorMaps.wistia
  },
  {
    label: 'Hot',
    id: RasterTileLayerColorMaps.hot
  },
  {
    label: 'Afmhot',
    id: RasterTileLayerColorMaps.afmhot
  },
  {
    label: 'Heat',
    id: RasterTileLayerColorMaps.gist_heat
  },
  {
    label: 'Copper',
    id: RasterTileLayerColorMaps.copper
  },
  {
    label: 'Pi-Green',
    id: RasterTileLayerColorMaps.piyg
  },
  {
    label: 'Pr-Gn',
    id: RasterTileLayerColorMaps.prgn
  },
  {
    label: 'Br-Bg',
    id: RasterTileLayerColorMaps.brbg
  },
  {
    label: 'Pu-Or',
    id: RasterTileLayerColorMaps.puor
  },
  {
    label: 'Rd-Gy',
    id: RasterTileLayerColorMaps.rdgy
  },
  {
    label: 'Rd-Bu',
    id: RasterTileLayerColorMaps.rdbu
  },
  {
    label: 'Rd-Yl-Bu',
    id: RasterTileLayerColorMaps.rdylbu
  },
  {
    label: 'Rd-Yl-Gn',
    id: RasterTileLayerColorMaps.rdylgn
  },
  {
    label: 'Spectral',
    id: RasterTileLayerColorMaps.spectral
  },
  {
    label: 'Cool-Warm',
    id: RasterTileLayerColorMaps.coolwarm
  },
  {
    label: 'B-W-R',
    id: RasterTileLayerColorMaps.bwr
  },
  {
    label: 'Seismic',
    id: RasterTileLayerColorMaps.seismic
  },
  {
    label: 'Twilight',
    id: RasterTileLayerColorMaps.twilight
  },
  {
    label: 'Twilight Shifted',
    id: RasterTileLayerColorMaps.twilight_shifted
  },
  {
    label: 'HSV',
    id: RasterTileLayerColorMaps.hsv
  },
  {
    label: 'Flag',
    id: RasterTileLayerColorMaps.flag
  },
  {
    label: 'Prism',
    id: RasterTileLayerColorMaps.prism
  },
  {
    label: 'Ocean',
    id: RasterTileLayerColorMaps.ocean
  },
  {
    label: 'Gist Earth',
    id: RasterTileLayerColorMaps.gist_earth
  },
  {
    label: 'Terrain',
    id: RasterTileLayerColorMaps.terrain
  },
  {
    label: 'Gist Stern',
    id: RasterTileLayerColorMaps.gist_stern
  },
  {
    label: 'Gnuplot',
    id: RasterTileLayerColorMaps.gnuplot
  },
  {
    label: 'Gnuplot2',
    id: RasterTileLayerColorMaps.gnuplot2
  },
  {
    label: 'Cmrmap',
    id: RasterTileLayerColorMaps.cmrmap
  },
  {
    label: 'Cubehelix',
    id: RasterTileLayerColorMaps.cubehelix
  },
  {
    label: 'Brg',
    id: RasterTileLayerColorMaps.brg
  },
  {
    label: 'Gist Rainbow',
    id: RasterTileLayerColorMaps.gist_rainbow
  },
  {
    label: 'Rainbow',
    id: RasterTileLayerColorMaps.rainbow
  },
  {
    label: 'Jet',
    id: RasterTileLayerColorMaps.jet
  },
  {
    label: 'Nipy Spectral',
    id: RasterTileLayerColorMaps.nipy_spectral
  },
  {
    label: 'Gist NCAR',
    id: RasterTileLayerColorMaps.gist_ncar
  }
];

const STAC_SEARCH_PROVIDERS: ConfigOption[] = [
  // Commenting out Microsoft for now
  // {
  //   label: 'Microsoft Planetary Computer',
  //   id: 'microsoft'
  // },
  {
    label: 'Element 84 Earth Search (AWS)',
    id: 'earth-search'
  }
];

/**
 * Configuration settings to be exposed through the UI
 */
export const rasterVisConfigs = {
  preset: {
    type: 'select',
    defaultValue: 'trueColor',
    label: 'Preset',
    options: Object.values(PRESET_OPTIONS),
    property: 'preset',
    group: ''
  } as VisConfigSelection,
  mosaicId: {
    type: 'select',
    defaultValue: null,
    label: 'Mosaic',
    // defined dynamically from STAC item/collection
    options: [],
    property: 'mosaicId',
    group: ''
  } as VisConfigSelection,
  useSTACSearching: {
    type: 'boolean',
    property: 'useSTACSearching',
    defaultValue: false,
    label: 'Use STAC Searching'
  } as VisConfigBoolean,
  stacSearchProvider: {
    type: 'select',
    defaultValue: 'earth-search',
    label: 'STAC Search Provider',
    options: STAC_SEARCH_PROVIDERS,
    property: 'stacSearchProvider'
  } as VisConfigSelection,
  startDate: {
    type: 'input',
    defaultValue: '2019-02-02',
    label: 'Start Date',
    property: 'startDate'
  } as VisConfigInput,
  endDate: {
    type: 'input',
    defaultValue: '2019-03-02',
    label: 'End Date',
    property: 'endDate'
  } as VisConfigInput,
  dynamicColor: {
    type: 'boolean',
    defaultValue: false,
    label: 'Dynamic Color',
    group: '',
    property: 'dynamicColor',
    description: 'Use a dynamic color scale based on data visible in the viewport'
  } as VisConfigBoolean,
  colormapId: {
    type: 'select',
    defaultValue: 'cfastie',
    label: 'Colormap',
    options: COLORMAP_OPTIONS,
    property: 'colormapId',
    group: ''
  } as VisConfigSelection,
  // kepler's visConfig from kepler.gl https://github.com/foursquare/kepler.gl/blob/490a8938ffa1fac025e8d1997481acc1bffe4abd/src/layers/layer-factory.js#L228
  // key `colorRange` is required becuase it is hardcoded in kepler.gl
  // to make shallow copy of the visConfig item
  // https://github.com/foursquare/kepler.gl/blob/490a8938ffa1fac025e8d1997481acc1bffe4abd/src/reducers/vis-state-merger.js#L736
  colorRange: 'colorRange' as const,
  linearRescalingFactor: {
    defaultValue: [0, 1],
    // group: "color"
    isRanged: true,
    label: 'Linear Rescaling Factor',
    property: 'linearRescalingFactor',
    range: [0, 1],
    step: 0.01,
    type: 'number'
  } as VisConfigRange,
  // Non-linear rescaling for true-color images
  // If false, implies linear rescaling
  nonLinearRescaling: {
    type: 'boolean',
    property: 'nonLinearRescaling',
    defaultValue: true,
    // group: undefined
    label: 'Non-Linear Rescaling'
  } as VisConfigBoolean,
  gammaContrastFactor: {
    defaultValue: 1,
    // group: "color"
    isRanged: false,
    label: 'Gamma Contrast',
    property: 'gammaContrastFactor',
    range: [0, 3],
    step: 0.05,
    type: 'number'
  } as VisConfigNumber,
  sigmoidalContrastFactor: {
    defaultValue: 0,
    // group: "color"
    isRanged: false,
    label: 'Sigmoidal Contrast',
    property: 'sigmoidalContrastFactor',
    range: [0, 50],
    step: 1,
    type: 'number'
  } as VisConfigNumber,
  sigmoidalBiasFactor: {
    defaultValue: 0.5,
    // group: "color"
    isRanged: false,
    label: 'Sigmoidal Bias',
    property: 'sigmoidalBiasFactor',
    range: [0, 1],
    step: 0.01,
    type: 'number'
  } as VisConfigNumber,
  saturationValue: {
    defaultValue: 1,
    // group: "color"
    isRanged: false,
    label: 'Saturation',
    property: 'saturationValue',
    range: [0, 2],
    step: 0.05,
    type: 'number'
  } as VisConfigNumber,
  filterEnabled: {
    type: 'boolean',
    property: 'filterEnabled',
    defaultValue: false,
    // group: undefined
    label: 'Filter'
  } as VisConfigBoolean,
  filterRange: {
    defaultValue: [-1, 1],
    // group: "color"
    isRanged: true,
    label: 'Filter',
    property: 'filterRange',
    range: [-1, 1],
    step: 0.01,
    type: 'number'
  } as VisConfigRange,
  opacity: {
    defaultValue: 1,
    // group: "color"
    isRanged: false,
    label: 'Opacity',
    property: 'opacity',
    range: [0, 1],
    step: 0.05,
    type: 'number'
  } as VisConfigNumber,
  _stacQuery: {
    defaultValue: null,
    type: 'input'
  } as VisConfigInput,
  singleBandName: {
    type: 'select',
    defaultValue: null,
    label: 'Name of single band to render',
    // defined dynamically from STAC item/collection
    options: [],
    property: 'singleBandName',
    group: ''
  } as VisConfigSelection,
  enableTerrain: {
    type: 'boolean',
    defaultValue: true,
    label: 'Enable 3D terrain',
    group: '',
    property: 'enableTerrain',
    description: 'Use 3D terrain when available. Only affects Map View in 3D mode.'
  } as VisConfigBoolean
};
