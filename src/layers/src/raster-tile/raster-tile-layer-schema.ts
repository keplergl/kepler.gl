// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import keyMirror from 'keymirror';

export const RasterTileLayerColorMaps = keyMirror({
  cfastie: null,
  rplumbo: null,
  schwarzwald: null,
  viridis: null,
  plasma: null,
  inferno: null,
  magma: null,
  cividis: null,
  greys: null,
  purples: null,
  blues: null,
  greens: null,
  oranges: null,
  reds: null,
  ylorbr: null,
  ylorrd: null,
  orrd: null,
  purd: null,
  rdpu: null,
  bupu: null,
  gnbu: null,
  pubu: null,
  ylgnbu: null,
  pubugn: null,
  bugn: null,
  ylgn: null,
  binary: null,
  gray: null,
  bone: null,
  pink: null,
  spring: null,
  summer: null,
  autumn: null,
  winter: null,
  cool: null,
  wistia: null,
  hot: null,
  afmhot: null,
  gist_heat: null,
  copper: null,
  piyg: null,
  prgn: null,
  brbg: null,
  puor: null,
  rdgy: null,
  rdbu: null,
  rdylbu: null,
  rdylgn: null,
  spectral: null,
  coolwarm: null,
  bwr: null,
  seismic: null,
  twilight: null,
  twilight_shifted: null,
  hsv: null,
  flag: null,
  prism: null,
  ocean: null,
  gist_earth: null,
  terrain: null,
  gist_stern: null,
  gnuplot: null,
  gnuplot2: null,
  cmrmap: null,
  cubehelix: null,
  brg: null,
  gist_rainbow: null,
  rainbow: null,
  jet: null,
  nipy_spectral: null,
  gist_ncar: null
});

export const RasterTileLayerPresets = keyMirror({
  trueColor: null,
  infrared: null,
  agriculture: null,
  forestBurn: null,
  ndvi: null,
  savi: null,
  msavi: null,
  ndmi: null,
  nbr: null,
  nbr2: null,
  singleBand: null
});

export type RasterTileLayerSchema = {
  type: 'rasterTile';
  config: {
    dataId: string | null;
    visConfig: {
      preset: string;
      mosaidId: string | null;
      useSTACSearching: boolean;
      stacSearchProvider?: 'earth-search' | 'microsoft';
      startDate?: string;
      endData?: string;
      dynamicColor?: boolean;
      colormapId?: string;
      colorRange?: any;
      linearRescalingFactor: number;
      nonLinearRescaling: boolean;
      gammaContrastFactor: number;
      sigmoidalContrastFactor: number;
      sigmoidalBiasFactor: number;
      saturationValue: number;
      filterEnabled: boolean;
      filterRange: [number, number];
      opacity: number;
      _stacQuery?: string | null;
      singleBandName?: string | null;
      enableTerrain?: boolean;
    };
  };
};
