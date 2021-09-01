import {RGBColor, RGBAColor, HexColor, Field} from 'reducers';

export type ColorRange = {
  name: string;
  type: string;
  category: string;
  colors: HexColor[];
  reversed?: boolean;
  colorMap?: Map | object;
};

export type LayerTextLabel = {
  field: Field | null;
  color: RGBColor;
  size: number;
  offset: [number, number];
  anchor: string;
  alignment: string;
};

export type ColorUI = {
  // customPalette in edit
  customPalette: ColorRange;
  // show color sketcher modal
  showSketcher: boolean;
  // show color range selection panel
  showDropdown: boolean;
  // color range selector config
  colorRangeConfig: {
    type: string;
    steps: number;
    reversed: boolean;
    custom: boolean;
  };
};

export type VisConfig = {
  label: string | ((config: LayerConfig) => string);
  group: string;
  property: string;
  description?: string;
  condition?: (config: LayerConfig) => boolean;
};

export type VisConfigNumber = VisConfig & {
  type: 'number';
  isRanged: false;
  defaultValue: number;
  range: [number, number];
  step: number;
};

export type VisConfigBoolean = VisConfig & {
  type: 'boolean';
  defaultValue: boolean;
};

export type VisConfigSelection = VisConfig & {
  type: 'select';
  defaultValue: string;
  options: string[];
};

export type VisConfigRange = VisConfig & {
  type: 'number';
  isRanged: boolean;
  range: [number, number];
  defaultValue: [number, number];
  step: number;
};

export type VisConfigColorSelect = VisConfig & {
  type: 'color-select';
  defaultValue: null;
};

export type VisConfigColorRange = VisConfig & {
  type: 'color-range-select';
  defaultValue: ColorRange;
};

export type LayerVisConfig = {
  thickness: VisConfigNumber;
  strokeWidthRange: VisConfigRange;
  trailLength: VisConfigNumber;
  radius: VisConfigNumber;
  fixedRadius: VisConfigBoolean;
  radiusRange: VisConfigRange;
  clusterRadius: VisConfigNumber;
  clusterRadiusRange: VisConfigRange;
  opacity: VisConfigNumber;
  coverage: VisConfigNumber;
  outline: VisConfigBoolean;
  colorRange: VisConfigColorRange;
  strokeColorRange: VisConfigColorRange;
  targetColor: VisConfigColorSelect;
  strokeColor: VisConfigColorSelect;
  aggregation: VisConfigSelect;
  sizeAggregation: VisConfigSelect;
  percentile: VisConfigRange;
  elevationPercentile: VisConfigRange;
  resolution: VisConfigNumber;
  sizeScale: VisConfigNumber;
  angle: VisConfigNumber;
  worldUnitSize: VisConfigNumber;
  elevationScale: VisConfigNumber;
  enableElevationZoomFactor: VisConfigBoolean;
  elevationRange: VisConfigRange;
  heightRange: VisConfigRange;
  coverageRange: VisConfigRange;
  'hi-precision': VisConfigBoolean;
  enable3d: VisConfigBoolean;
  stroked: VisConfigBoolean;
  filled: VisConfigBoolean;
  extruded: VisConfigBoolean;
  wireframe: VisConfigBoolean;
  weight: VisConfigNumber;
  heatmapRadius: VisConfigNumber;
};

export type TextConfigSelect = {
  type: 'select';
  options: string[];
  multiSelect: boolean;
  searchable: boolean;
};
export type TextConfigNumber = {
  type: 'number';
  range: number[];
  value0: number;
  step: number;
  isRanged: boolean;
  label: string;
  showInput: boolean;
};
export type LayerTextConfig = {
  fontSize: TextConfigNumber;
  textAnchor: TextConfigSelect;
  textAlignment: TextConfigSelect;
};

export const DEFAULT_TEXT_LABEL: LayerTextLabel;
export const DEFAULT_CUSTOM_PALETTE: ColorRange;
export const DEFAULT_COLOR_UI: ColorUI;
export const DEFAULT_HIGHLIGHT_COLOR: RGBAColor;
export const DEFAULT_LAYER_LABEL: string;
export const LAYER_VIS_CONFIGS: LayerVisConfig;
export const LAYER_TEXT_CONFIGS: LayerTextConfig;
export const UNKNOWN_COLOR_KEY: string;
