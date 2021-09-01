// Copyright (c) 2021 Uber Technologies, Inc.
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

import {AGGREGATION_TYPES} from 'constants/default-settings';
import {DEFAULT_COLOR_RANGE} from 'constants/color-ranges';

export const PROPERTY_GROUPS = keyMirror({
  color: null,
  stroke: null,
  radius: null,
  height: null,
  angle: null,
  // for heatmap aggregation
  cell: null,
  precision: null
});

export const DEFAULT_LAYER_OPACITY = 0.8;
export const DEFAULT_HIGHLIGHT_COLOR = [252, 242, 26, 255];
export const DEFAULT_LAYER_LABEL = 'new layer';
export {DEFAULT_COLOR_RANGE};

/** @type {import('./layer-factory').LayerTextLabel} */
export const DEFAULT_TEXT_LABEL = {
  field: null,
  color: [255, 255, 255],
  size: 18,
  offset: [0, 0],
  anchor: 'start',
  alignment: 'center'
};

/** @type {import('./layer-factory').ColorRange} */
export const DEFAULT_CUSTOM_PALETTE = {
  name: 'color.customPalette',
  type: 'custom',
  category: 'Custom',
  colors: []
};

export const UNKNOWN_COLOR_KEY = '__unknownColor__';

/** @type {import('./layer-factory').ColorUI} */
export const DEFAULT_COLOR_UI = {
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

/** @type {import('./layer-factory').LayerVisConfig} */
export const LAYER_VIS_CONFIGS = {
  thickness: {
    type: 'number',
    defaultValue: 2,
    label: 'layerVisConfigs.strokeWidth',
    isRanged: false,
    range: [0, 100],
    step: 0.1,
    group: PROPERTY_GROUPS.stroke,
    property: 'thickness'
  },
  strokeWidthRange: {
    type: 'number',
    defaultValue: [0, 10],
    label: 'layerVisConfigs.strokeWidthRange',
    isRanged: true,
    range: [0, 200],
    step: 0.1,
    group: PROPERTY_GROUPS.stroke,
    property: 'sizeRange'
  },
  trailLength: {
    type: 'number',
    defaultValue: 180,
    label: 'layerVisConfigs.strokeWidth',
    isRanged: false,
    range: [1, 1000],
    step: 1,
    group: PROPERTY_GROUPS.stroke,
    property: 'trailLength'
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
    property: 'radius'
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
    property: 'radiusRange'
  },
  clusterRadius: {
    type: 'number',
    label: 'layerVisConfigs.clusterRadius',
    defaultValue: 40,
    isRanged: false,
    range: [1, 500],
    step: 0.1,
    group: PROPERTY_GROUPS.radius,
    property: 'clusterRadius'
  },
  clusterRadiusRange: {
    type: 'number',
    label: 'layerVisConfigs.radiusRangePixels',
    defaultValue: [1, 40],
    isRanged: true,
    range: [1, 150],
    step: 0.1,
    group: PROPERTY_GROUPS.radius,
    property: 'radiusRange'
  },
  opacity: {
    type: 'number',
    defaultValue: DEFAULT_LAYER_OPACITY,
    label: 'layerVisConfigs.opacity',
    isRanged: false,
    range: [0, 1],
    step: 0.01,
    group: PROPERTY_GROUPS.color,
    property: 'opacity'
  },
  coverage: {
    type: 'number',
    defaultValue: 1,
    label: 'layerVisConfigs.coverage',
    isRanged: false,
    range: [0, 1],
    step: 0.01,
    group: PROPERTY_GROUPS.cell,
    property: 'coverage'
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
  aggregation: {
    type: 'select',
    defaultValue: AGGREGATION_TYPES.average,
    label: 'layerVisConfigs.colorAggregation',
    // aggregation options are based on color field types
    options: Object.keys(AGGREGATION_TYPES),
    group: PROPERTY_GROUPS.color,
    property: 'colorAggregation',
    condition: config => config.colorField
  },
  sizeAggregation: {
    type: 'select',
    defaultValue: AGGREGATION_TYPES.average,
    label: 'layerVisConfigs.heightAggregation',
    // aggregation options are based on color field types
    options: Object.keys(AGGREGATION_TYPES),
    group: PROPERTY_GROUPS.height,
    property: 'sizeAggregation',
    condition: config => config.sizeField
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
    condition: config => config.colorScale !== 'ordinal'
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
    condition: config => config.visConfig.enable3d && (config.colorField || config.sizeField)
  },
  resolution: {
    type: 'number',
    defaultValue: 8,
    label: 'layerVisConfigs.resolution',
    isRanged: false,
    range: [0, 13],
    step: 1,
    group: PROPERTY_GROUPS.cell,
    property: 'resolution'
  },
  sizeScale: {
    type: 'number',
    defaultValue: 10,
    label: 'layerVisConfigs.sizeScale',
    isRanged: false,
    range: [1, 1000],
    step: 1,
    group: PROPERTY_GROUPS.stroke,
    property: 'sizeScale'
  },
  angle: {
    type: 'number',
    label: 'layerVisConfigs.angle',
    defaultValue: 0,
    isRanged: false,
    range: [0, 360],
    group: PROPERTY_GROUPS.angle,
    step: 1,
    property: 'angle'
  },
  worldUnitSize: {
    type: 'number',
    defaultValue: 1,
    label: 'layerVisConfigs.worldUnitSize',
    isRanged: false,
    range: [0, 500],
    step: 0.0001,
    group: PROPERTY_GROUPS.cell,
    property: 'worldUnitSize'
  },
  elevationScale: {
    type: 'number',
    defaultValue: 5,
    label: 'layerVisConfigs.elevationScale',
    isRanged: false,
    range: [0, 100],
    step: 0.1,
    group: PROPERTY_GROUPS.height,
    property: 'elevationScale'
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
    property: 'sizeRange'
  },
  heightRange: {
    type: 'number',
    defaultValue: [0, 500],
    label: 'Height Scale',
    isRanged: true,
    range: [0, 1000],
    step: 0.01,
    group: PROPERTY_GROUPS.height,
    property: 'heightRange'
  },
  coverageRange: {
    type: 'number',
    defaultValue: [0, 1],
    label: 'layerVisConfigs.coverageRange',
    isRanged: true,
    range: [0, 1],
    step: 0.01,
    group: PROPERTY_GROUPS.radius,
    property: 'coverageRange'
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
    condition: config => config.weightField
  },
  heatmapRadius: {
    type: 'number',
    defaultValue: 20,
    label: 'layerVisConfigs.radius',
    isRanged: false,
    range: [0, 100],
    step: 0.1,
    group: PROPERTY_GROUPS.cell,
    property: 'radius'
  }
};

/** @type {import('./layer-factory').LayerTextConfig} */
export const LAYER_TEXT_CONFIGS = {
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
