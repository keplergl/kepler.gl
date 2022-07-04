// Copyright (c) 2022 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import keyMirror from 'keymirror';

import {ColorRange, DEFAULT_COLOR_RANGE} from './color-ranges';
import {AGGREGATION_TYPES} from './default-settings';

import {RGBColor, RGBAColor} from '@kepler.gl/types';

export type Field = {
  analyzerType: string;
  id?: string;
  name: string;
  displayName: string;
  format: string;
  type: string;
  fieldIdx: number;
  valueAccessor(v: {index: number}): any;
  filterProps?: any;
  metadata?: any;
};
import {
  LayerBaseConfig,
  LayerColorConfig,
  LayerHeightConfig,
  LayerSizeConfig,
  LayerWeightConfig
} from '@kepler.gl/types';

export type LayerTextLabel = {
  field: Field | null;
  color: RGBColor;
  size: number;
  offset: [number, number];
  anchor: string;
  alignment: string;
};

export type AggregationTypes = keyof typeof AGGREGATION_TYPES;

export type ColorUI = {
  // customPalette in edit
  customPalette: ColorRange;
  // show color sketcher modal
  showSketcher: boolean | number;
  // show color range selection panel
  showDropdown: boolean | number;
  // color range selector config
  colorRangeConfig: {
    type: string;
    steps: number;
    reversed: boolean;
    custom: boolean;
  };
};

export type VisConfig = {
  label:
    | string
    | ((
        config: LayerBaseConfig &
          Partial<LayerColorConfig> &
          Partial<LayerHeightConfig> &
          Partial<LayerSizeConfig> &
          Partial<LayerWeightConfig>
      ) => string);
  group: keyof typeof PROPERTY_GROUPS;
  property: string;
  description?: string;
  condition?: (
    config: LayerBaseConfig &
      Partial<LayerColorConfig> &
      Partial<LayerHeightConfig> &
      Partial<LayerSizeConfig> &
      Partial<LayerWeightConfig>
  ) => boolean;

  allowCustomValue?: boolean;
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

export type LayerVisConfigSettings = {
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
  colorAggregation: VisConfigSelection;
  sizeAggregation: VisConfigSelection;
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

// TODO: Move this to individual layers
export type LayerVisConfig = {
  [key: string]: any;
  // possible visConfigs

  // thickness: number;
  // sizeRange: number;
  // trailLength: number;
  // radius: number;
  // fixedRadius: boolean;
  // radiusRange: [number, number];
  // clusterRadius: number;
  // opacity: number;
  // coverage: number;
  // outline: boolean;
  // colorRange: ColorRange;
  // strokeColorRange: ColorRange;
  // targetColor: any;
  // strokeColor: any;
  // colorAggregation: keyof typeof AGGREGATION_TYPES;
  // sizeAggregation: keyof typeof AGGREGATION_TYPES;
  // percentile: [number, number];
  // elevationPercentile: [number, number];
  // resolution: number;
  // sizeScale: number;
  // angle: number;
  // worldUnitSize: number;
  // elevationScale: number;
  // enableElevationZoomFactor: boolean;
  // heightRange: [number, number];
  // coverageRange: [number, number];
  // 'hi-precision': boolean;
  // enable3d: boolean;
  // stroked: boolean;
  // filled: boolean;
  // extruded: boolean;
  // wireframe: boolean;
  // weight: number;
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

export const PROPERTY_GROUPS = keyMirror({
  color: null,
  stroke: null,
  radius: null,
  height: null,
  angle: null,
  // for heatmap aggregation
  cell: null,
  precision: null,
  display: null
});

export const DEFAULT_LAYER_OPACITY = 0.8;
export const DEFAULT_HIGHLIGHT_COLOR: RGBAColor = [252, 242, 26, 255];
export const DEFAULT_LAYER_LABEL = 'new layer';
export {DEFAULT_COLOR_RANGE};

export const DEFAULT_TEXT_LABEL: LayerTextLabel = {
  field: null,
  color: [255, 255, 255],
  size: 18,
  offset: [0, 0],
  anchor: 'start',
  alignment: 'center'
};

export const DEFAULT_CUSTOM_PALETTE: ColorRange = {
  name: 'color.customPalette',
  type: 'custom',
  category: 'Custom',
  colors: []
};

export const UNKNOWN_COLOR_KEY = '__unknownColor__';

export const DEFAULT_COLOR_UI: ColorUI = {
  // customPalette in edit
  customPalette: DEFAULT_CUSTOM_PALETTE,
  // show color sketcher modal
  showSketcher: false,
  // show color range selection panel
  showDropdown: false,
  // color range selector config
  colorRangeConfig: {
    type: 'all',
    steps: 6,
    reversed: false,
    custom: false
  }
};

export const LAYER_VIS_CONFIGS: LayerVisConfigSettings = {
  thickness: {
    type: 'number',
    defaultValue: 2,
    label: 'layerVisConfigs.strokeWidth',
    isRanged: false,
    range: [0, 100],
    step: 0.1,
    group: PROPERTY_GROUPS.stroke,
    property: 'thickness',
    allowCustomValue: true
  },
  strokeWidthRange: {
    type: 'number',
    defaultValue: [0, 10],
    label: 'layerVisConfigs.strokeWidthRange',
    isRanged: true,
    range: [0, 200],
    step: 0.1,
    group: PROPERTY_GROUPS.stroke,
    property: 'sizeRange',
    allowCustomValue: true
  },
  trailLength: {
    type: 'number',
    defaultValue: 180,
    label: 'layerVisConfigs.strokeWidth',
    isRanged: false,
    range: [1, 1000],
    step: 1,
    group: PROPERTY_GROUPS.stroke,
    property: 'trailLength',
    allowCustomValue: true
  },
  // radius is actually radiusScale in deck.gl
  radius: {
    type: 'number',
    defaultValue: 10,
    label: 'layerVisConfigs.radius',
    isRanged: false,
    range: [0, 100],
    step: 0.1,
    group: PROPERTY_GROUPS.radius,
    property: 'radius',
    allowCustomValue: true
  },
  fixedRadius: {
    defaultValue: false,
    type: 'boolean',
    label: 'layerVisConfigs.fixedRadius',
    description: 'layerVisConfigs.fixedRadiusDescription',
    group: PROPERTY_GROUPS.radius,
    property: 'fixedRadius'
  },
  radiusRange: {
    type: 'number',
    defaultValue: [0, 50],
    isRanged: true,
    range: [0, 500],
    step: 0.1,
    label: 'layerVisConfigs.radiusRange',
    group: PROPERTY_GROUPS.radius,
    property: 'radiusRange',
    allowCustomValue: true
  },
  clusterRadius: {
    type: 'number',
    label: 'layerVisConfigs.clusterRadius',
    defaultValue: 40,
    isRanged: false,
    range: [1, 500],
    step: 0.1,
    group: PROPERTY_GROUPS.radius,
    property: 'clusterRadius',
    allowCustomValue: true
  },
  clusterRadiusRange: {
    type: 'number',
    label: 'layerVisConfigs.radiusRangePixels',
    defaultValue: [1, 40],
    isRanged: true,
    range: [1, 150],
    step: 0.1,
    group: PROPERTY_GROUPS.radius,
    property: 'radiusRange',
    allowCustomValue: true
  },
  opacity: {
    type: 'number',
    defaultValue: DEFAULT_LAYER_OPACITY,
    label: 'layerVisConfigs.opacity',
    isRanged: false,
    range: [0, 1],
    step: 0.01,
    group: PROPERTY_GROUPS.color,
    property: 'opacity',
    allowCustomValue: false
  },
  coverage: {
    type: 'number',
    defaultValue: 1,
    label: 'layerVisConfigs.coverage',
    isRanged: false,
    range: [0, 1],
    step: 0.01,
    group: PROPERTY_GROUPS.cell,
    property: 'coverage',
    allowCustomValue: false
  },
  // used in point layer
  outline: {
    type: 'boolean',
    defaultValue: false,
    label: 'layer.outline',
    group: PROPERTY_GROUPS.display,
    property: 'outline'
  },
  colorRange: {
    type: 'color-range-select',
    defaultValue: DEFAULT_COLOR_RANGE,
    label: 'layerVisConfigs.colorRange',
    group: PROPERTY_GROUPS.color,
    property: 'colorRange'
  },
  strokeColorRange: {
    type: 'color-range-select',
    defaultValue: DEFAULT_COLOR_RANGE,
    label: 'layerVisConfigs.strokeColorRange',
    group: PROPERTY_GROUPS.color,
    property: 'strokeColorRange'
  },
  targetColor: {
    type: 'color-select',
    label: 'layerVisConfigs.targetColor',
    defaultValue: null,
    group: PROPERTY_GROUPS.color,
    property: 'targetColor'
  },
  strokeColor: {
    type: 'color-select',
    label: 'layerVisConfigs.strokeColor',
    defaultValue: null,
    group: PROPERTY_GROUPS.color,
    property: 'strokeColor'
  },
  colorAggregation: {
    type: 'select',
    defaultValue: AGGREGATION_TYPES.average,
    label: 'layerVisConfigs.colorAggregation',
    // aggregation options are based on color field types
    options: Object.keys(AGGREGATION_TYPES) as AggregationTypes[],
    group: PROPERTY_GROUPS.color,
    property: 'colorAggregation',
    condition: config => Boolean(config.colorField)
  },
  sizeAggregation: {
    type: 'select',
    defaultValue: AGGREGATION_TYPES.average,
    label: 'layerVisConfigs.heightAggregation',
    // aggregation options are based on color field types
    options: Object.keys(AGGREGATION_TYPES) as AggregationTypes[],
    group: PROPERTY_GROUPS.height,
    property: 'sizeAggregation',
    condition: config => Boolean(config.sizeField)
  },
  percentile: {
    type: 'number',
    defaultValue: [0, 100],
    label: config =>
      `Filter by ${
        config.colorField
          ? `${config.visConfig.colorAggregation} ${config.colorField.name}`
          : 'count'
      } percentile`,
    isRanged: true,
    range: [0, 100],
    step: 0.01,
    group: PROPERTY_GROUPS.color,
    property: 'percentile',

    // percentile filter only makes sense with linear aggregation
    condition: config => config.colorScale !== 'ordinal',
    allowCustomValue: false
  },
  elevationPercentile: {
    type: 'number',
    defaultValue: [0, 100],
    label: config =>
      `Filter by ${
        config.sizeField ? `${config.visConfig.sizeAggregation} ${config.sizeField.name}` : 'count'
      } percentile`,
    isRanged: true,
    range: [0, 100],
    step: 0.01,
    group: PROPERTY_GROUPS.height,
    property: 'elevationPercentile',
    // percentile filter only makes sense with linear aggregation
    condition: config =>
      Boolean(config.visConfig.enable3d && (config.colorField || config.sizeField)),
    allowCustomValue: false
  },
  resolution: {
    type: 'number',
    defaultValue: 8,
    label: 'layerVisConfigs.resolution',
    isRanged: false,
    range: [0, 13],
    step: 1,
    group: PROPERTY_GROUPS.cell,
    property: 'resolution',
    allowCustomValue: true
  },
  sizeScale: {
    type: 'number',
    defaultValue: 10,
    label: 'layerVisConfigs.sizeScale',
    isRanged: false,
    range: [1, 1000],
    step: 1,
    group: PROPERTY_GROUPS.stroke,
    property: 'sizeScale',
    allowCustomValue: true
  },
  angle: {
    type: 'number',
    label: 'layerVisConfigs.angle',
    defaultValue: 0,
    isRanged: false,
    range: [0, 360],
    group: PROPERTY_GROUPS.angle,
    step: 1,
    property: 'angle',
    allowCustomValue: true
  },
  worldUnitSize: {
    type: 'number',
    defaultValue: 1,
    label: 'layerVisConfigs.worldUnitSize',
    isRanged: false,
    range: [0, 500],
    step: 0.0001,
    group: PROPERTY_GROUPS.cell,
    property: 'worldUnitSize',
    allowCustomValue: true
  },
  elevationScale: {
    type: 'number',
    defaultValue: 5,
    label: 'layerVisConfigs.elevationScale',
    isRanged: false,
    range: [0, 100],
    step: 0.1,
    group: PROPERTY_GROUPS.height,
    property: 'elevationScale',
    allowCustomValue: true
  },
  enableElevationZoomFactor: {
    type: 'boolean',
    defaultValue: true,
    label: 'layerVisConfigs.enableElevationZoomFactor',
    group: PROPERTY_GROUPS.height,
    property: 'enableElevationZoomFactor',
    description: 'layerVisConfigs.enableElevationZoomFactorDescription'
  },
  elevationRange: {
    type: 'number',
    defaultValue: [0, 500],
    label: 'layerVisConfigs.heightScale',
    isRanged: true,
    range: [0, 1000],
    step: 0.01,
    group: PROPERTY_GROUPS.height,
    property: 'sizeRange',
    allowCustomValue: true
  },
  heightRange: {
    type: 'number',
    defaultValue: [0, 500],
    label: 'Height Scale',
    isRanged: true,
    range: [0, 1000],
    step: 0.01,
    group: PROPERTY_GROUPS.height,
    property: 'heightRange',
    allowCustomValue: true
  },
  coverageRange: {
    type: 'number',
    defaultValue: [0, 1],
    label: 'layerVisConfigs.coverageRange',
    isRanged: true,
    range: [0, 1],
    step: 0.01,
    group: PROPERTY_GROUPS.radius,
    property: 'coverageRange',
    allowCustomValue: false
  },
  // hi precision is deprecated by deck.gl
  'hi-precision': {
    type: 'boolean',
    defaultValue: false,
    label: 'layerVisConfigs.highPrecisionRendering',
    group: PROPERTY_GROUPS.precision,
    property: 'hi-precision',
    description: 'layerVisConfigs.highPrecisionRenderingDescription'
  },
  enable3d: {
    type: 'boolean',
    defaultValue: false,
    label: 'layerVisConfigs.height',
    group: PROPERTY_GROUPS.height,
    property: 'enable3d',
    description: 'layerVisConfigs.heightDescription'
  },
  stroked: {
    type: 'boolean',
    label: 'layerVisConfigs.stroke',
    defaultValue: true,
    group: PROPERTY_GROUPS.display,
    property: 'stroked'
  },
  filled: {
    type: 'boolean',
    label: 'layerVisConfigs.fill',
    defaultValue: false,
    group: PROPERTY_GROUPS.display,
    property: 'filled'
  },
  extruded: {
    type: 'boolean',
    defaultValue: false,
    label: 'layerVisConfigs.enablePolygonHeight',
    group: PROPERTY_GROUPS.display,
    property: 'extruded'
  },
  wireframe: {
    type: 'boolean',
    defaultValue: false,
    label: 'layerVisConfigs.showWireframe',
    group: PROPERTY_GROUPS.display,
    property: 'wireframe'
  },
  // used for heatmap
  weight: {
    type: 'number',
    defaultValue: 1,
    label: 'layerVisConfigs.weightIntensity',
    isRanged: false,
    range: [0.01, 500],
    step: 0.01,
    group: PROPERTY_GROUPS.cell,
    property: 'weight',
    condition: config => Boolean(config.weightField),
    allowCustomValue: true
  },
  heatmapRadius: {
    type: 'number',
    defaultValue: 20,
    label: 'layerVisConfigs.radius',
    isRanged: false,
    range: [0, 100],
    step: 0.1,
    group: PROPERTY_GROUPS.cell,
    property: 'radius',
    allowCustomValue: true
  }
};

export const LAYER_TEXT_CONFIGS: LayerTextConfig = {
  fontSize: {
    type: 'number',
    range: [1, 100],
    value0: 1,
    step: 1,
    isRanged: false,
    label: 'Font size',
    showInput: true
  },
  textAnchor: {
    type: 'select',
    options: ['start', 'middle', 'end'],
    multiSelect: false,
    searchable: false
  },
  textAlignment: {
    type: 'select',
    options: ['top', 'center', 'bottom'],
    multiSelect: false,
    searchable: false
  }
};
