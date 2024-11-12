// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import keyMirror from 'keymirror';

import {ColorRange, DEFAULT_COLOR_RANGE} from './color-ranges';
import {AGGREGATION_TYPES} from './default-settings';

import {
  ColorUI,
  LayerTextConfig,
  LayerTextLabel,
  LayerVisConfigSettings,
  RGBAColor
} from '@kepler.gl/types';

export type AggregationTypes = keyof typeof AGGREGATION_TYPES;

export const PROPERTY_GROUPS = keyMirror({
  color: null,
  stroke: null,
  radius: null,
  height: null,
  angle: null,
  // for heatmap aggregation
  cell: null,
  precision: null,
  display: null,
  interaction: null
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
  alignment: 'center',
  outlineWidth: 0,
  outlineColor: [255, 0, 0, 255],
  background: false,
  backgroundColor: [0, 0, 200, 255]
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
  // show color chart
  showColorChart: false,
  // color range selector config
  colorRangeConfig: {
    type: 'all',
    steps: 6,
    reversed: false,
    custom: false,
    customBreaks: false
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
  fadeTrail: {
    defaultValue: true,
    type: 'boolean',
    label: 'layerVisConfigs.fadeTrail',
    group: PROPERTY_GROUPS.stroke,
    property: 'fadeTrail'
  },
  billboard: {
    defaultValue: false,
    type: 'boolean',
    label: 'layerVisConfigs.billboard',
    description: 'layerVisConfigs.billboardDescription',
    group: PROPERTY_GROUPS.display,
    property: 'billboard'
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
  fixedHeight: {
    defaultValue: false,
    type: 'boolean',
    label: 'layerVisConfigs.fixedHeight',
    description: 'layerVisConfigs.fixedHeightDescription',
    group: PROPERTY_GROUPS.height,
    property: 'fixedHeight'
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
  },
  darkBaseMapEnabled: {
    type: 'boolean',
    defaultValue: true,
    label: 'layerVisConfigs.darkModeEnabled',
    property: 'darkBaseMapEnabled',
    group: PROPERTY_GROUPS.display
  },
  allowHover: {
    type: 'boolean',
    defaultValue: true,
    label: 'layerVisConfigs.allowHover',
    group: PROPERTY_GROUPS.interaction,
    property: 'allowHover'
  },
  showNeighborOnHover: {
    type: 'boolean',
    defaultValue: false,
    label: 'layerVisConfigs.showNeighborOnHover',
    group: PROPERTY_GROUPS.interaction,
    property: 'showNeighborOnHover'
  },
  showHighlightColor: {
    type: 'boolean',
    defaultValue: true,
    label: 'layerVisConfigs.showHighlightColor',
    group: PROPERTY_GROUPS.interaction,
    property: 'showHighlightColor'
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
  outlineWidth: {
    type: 'number',
    range: [0, 1],
    value0: 0,
    step: 0.01,
    isRanged: false,
    label: 'Outline width',
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
export const LAYER_TYPES = keyMirror({
  point: null,
  arc: null,
  line: null,
  grid: null,
  hexagon: null,
  geojson: null,
  cluster: null,
  icon: null,
  heatmap: null,
  hexagonId: null,
  '3D': null,
  trip: null,
  s2: null
});

export const EDITOR_AVAILABLE_LAYERS: string[] = [
  LAYER_TYPES.point,
  LAYER_TYPES.hexagon,
  LAYER_TYPES.arc,
  LAYER_TYPES.line,
  LAYER_TYPES.hexagonId,
  LAYER_TYPES.geojson
];
