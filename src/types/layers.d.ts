// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

export type LayerBaseConfig = {
  dataId: string | null;
  label: string;
  color: RGBColor;

  columns: LayerColumns;
  isVisible: boolean;
  isConfigActive: boolean;
  highlightColor: RGBColor | RGBAColor;
  hidden: boolean;

  visConfig: LayerVisConfig;
  textLabel: LayerTextLabel[];

  colorUI: {
    color: ColorUI;
    colorRange: ColorUI;
  };
  animation: {
    enabled: boolean;
    domain?: [number, number] | null;
  };

  columnMode?: string;
};

/**
 * Used to configure geospatial data source columns like Longitude, Latitude, Geojson.
 */
export type LayerColumn = {value: string | null; fieldIdx: number; optional?: boolean};
export type LayerConfigColumn = LayerColumn;

export type LayerColumns = {
  [key: string]: LayerConfigColumn;
};

export type ColumnPair = {
  pair: string | string[];
  fieldPairKey: string | string[];
};

export type ColumnPairs = {[key: string]: ColumnPair};

export type ColumnLabels = {
  [key: string]: string;
};

export type EnhancedFieldPair = {
  name: string;
  type: 'point';
  pair: FieldPair['pair'];
};

export type SupportedColumnMode = {
  key: string;
  label: string;
  requiredColumns: string[];
  optionalColumns?: string[];
  hasHelp?: boolean;
};

export type LayerColorConfig = {
  colorField: VisualChannelField;
  colorDomain: VisualChannelDomain;
  colorScale: VisualChannelScale;
};
export type LayerSizeConfig = {
  // color by size, domain is set by filters, field, scale type
  sizeDomain: VisualChannelDomain;
  sizeScale: VisualChannelScale;
  sizeField: VisualChannelField;
};
export type LayerHeightConfig = {
  heightField: VisualChannelField;
  heightDomain: VisualChannelDomain;
  heightScale: VisualChannelScale;
};
export type LayerStrokeColorConfig = {
  strokeColorField: VisualChannelField;
  strokeColorDomain: VisualChannelDomain;
  strokeColorScale: VisualChannelScale;
};
export type LayerCoverageConfig = {
  coverageField: VisualChannelField;
  coverageDomain: VisualChannelDomain;
  coverageScale: VisualChannelScale;
};
export type LayerRadiusConfig = {
  radiusField: VisualChannelField;
  radiusDomain: VisualChannelDomain;
  radiusScale: VisualChannelScale;
};
export type LayerWeightConfig = {
  weightField: VisualChannelField;
};

export type Field = {
  analyzerType: string;
  id?: string;
  name: string;
  displayName: string;
  format: string;
  type: string;
  fieldIdx: number;
  valueAccessor(v: {index: number}): any;
  filterProps?: FilterProps;
  metadata?: any;
  displayFormat?: string;
};

export type FieldPair = {
  defaultName: string;
  pair: {
    lat: {
      fieldIdx: number;
      value: string;
    };
    lng: {
      fieldIdx: number;
      value: string;
    };
    altitude?: {
      fieldIdx: number;
      value: string;
    };
  };
  suffix: string[];
};

export type SizeRange = [number, number];

export type LayerTextLabel = {
  field: Field | null;
  color: RGBColor;
  background: boolean;
  size: number;
  offset: [number, number];
  anchor: string;
  alignment: string;
  outlineWidth: number;
  outlineColor: RGBAColor;
  backgroundColor: RGBAColor;
};

export type ColorUI = {
  // customPalette in edit
  customPalette: ColorRange;
  // show color sketcher modal
  showSketcher: boolean | number;
  // show color range selection panel
  showDropdown: boolean | number;
  // show color scale chart
  showColorChart: boolean;
  // color range selector config
  colorRangeConfig: {
    type: string;
    steps: number;
    reversed: boolean;
    custom: boolean;
    customBreaks: boolean;
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
  range: SizeRange;
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
  range: SizeRange;
  defaultValue: SizeRange;
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
  fadeTrail: VisConfigBoolean;
  billboard: VisConfigBoolean;
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
  darkBaseMapEnabled: VisConfigBoolean;
  fixedHeight: VisConfigBoolean;
  allowHover: VisConfigBoolean;
  showNeighborOnHover: VisConfigBoolean;
  showHighlightColor: VisConfigBoolean;
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
  // scenegraph: VisConfig;
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
  outlineWidth: TextConfigNumber;
  textAnchor: TextConfigSelect;
  textAlignment: TextConfigSelect;
};
