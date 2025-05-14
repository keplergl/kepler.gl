// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {HexColor, RGBColor, RGBAColor} from './types';

export type LayerBaseConfig = {
  dataId: string;
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

  // for aggregate layer, aggregatedBins is returned for custom color scale
  aggregatedBins?: AggregatedBin[];

  columnMode?: string;
  heightField?: VisualChannelField;
  heightDomain?: VisualChannelDomain;
  heightScale?: string;
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
  verifyField?: (field: Field) => boolean;
};

export type VisualChannelField = Field | null;
export type VisualChannelScale = keyof typeof SCALE_TYPES;

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

export type IndexBy = {
  format: string;
  type: string;
  mappedValue: Record<number, string>;
  timeDomain: {
    domain: [number, number];
    timeSteps: number[];
    duration?: number;
  };
};

export type Field = {
  name: string;
  displayName: string;
  type: string;
  fieldIdx: number;
  valueAccessor(v: {index: number}): any;
  analyzerType?: string;
  id?: string;
  format: string;
  filterProps?: FilterProps;
  metadata?: Record<string, any>;
  displayFormat?: string;
  isLoadingStats?: boolean;
  indexBy?: IndexBy;
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

export type ColorRangeConfig = {
  type: string;
  steps: number;
  reversed: boolean;
  custom: boolean;
  customBreaks: boolean;
  colorBlindSafe: boolean;
};

export type ColorMap = [string[] | number[] | string | number | null, HexColor][];
// Key is HexColor but as key we can use only string
export type ColorLegends = {[key: HexColor]: string};

export type ColorRange = {
  name?: string;
  type?: string;
  category?: string;
  colors: HexColor[];
  reversed?: boolean;
  colorMap?: ColorMap | null;
  colorLegends?: ColorLegends;
};

export type MiniColorRange = {
  name: string;
  type: string;
  category: string;
  colors: HexColor[];
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
  colorRangeConfig: ColorRangeConfig;
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

export type VisConfigInput = VisConfig & {
  type: 'input';
  defaultValue: string | null;
};

export type VisConfigSelection = VisConfig & {
  type: 'select';
  defaultValue: string;
  options: string[];
};

export type VisConfigObjectSelection = VisConfig & {
  type: 'object-select';
  // the value is id of one of the options
  defaultValue: string | null;
  // an array of objects with ids
  options: object[];
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

export type LayerVisConfigTypes =
  | VisConfigBoolean
  | VisConfigNumber
  | VisConfigRange
  | VisConfigColorRange
  | VisConfigColorSelect
  | VisConfigInput
  | VisConfigSelect
  | VisConfigObjectSelection;

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
  [key: string]: LayerVisConfigTypes;
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

export type LayerCallbacks = {
  onLayerHover?: (idx: number, value: any) => void;
  onSetLayerDomain?: (idx: number, value: any) => void;
  onFilteredItemsChange?: (
    idx: number,
    event: {
      id: string;
      count: number;
    }
  ) => void;
};

export type BindedLayerCallbacks = {
  onLayerHover?: (value: any) => void;
  onSetLayerDomain?: (value: any) => void;
  onFilteredItemsChange?: (event: {id: string; count: number}) => void;
};

export type VisualChannelAggregation = 'colorAggregation' | 'sizeAggregation';

export type SupportedFieldTypes =
  | 'boolean'
  | 'date'
  | 'geojson'
  | 'integer'
  | 'real'
  | 'string'
  | 'timestamp'
  | 'point'
  | 'array'
  | 'object'
  | 'geoarrow'
  | 'h3';

export type VisualChannel = {
  property: string;
  field: string;
  scale: string;
  domain: string;
  range: string;
  key: string;
  channelScaleType: string;
  nullValue?: any;
  defaultMeasure?: any;
  accessor?: string;
  condition?: (config: any) => boolean;
  defaultValue?: ((config: any) => any) | any;
  getAttributeValue?: (config: any) => (d: any) => any;

  // TODO: define fixed
  fixed?: any;

  supportedFieldTypes?: Array<SupportedFieldTypes>;

  aggregation?: VisualChannelAggregation;
};

export type VisualChannels = {[key: string]: VisualChannel};

export interface KeplerLayer {
  id: string;
  meta: Record<string, any>;
  visConfigSettings: {
    [key: string]: ValueOf<LayerVisConfigSettings>;
  };
  config: LayerBaseConfig;

  get type(): string | null;
  get supportedDatasetTypes(): string[] | null;

  getColorScale(
    colorScale: string,
    colorDomain: VisualChannelDomain,
    colorRange: ColorRange
  ): GetVisChannelScaleReturnType;
}

export type VisualChannelDomain = number[] | string[];

export type GetVisChannelScaleReturnType = {
  (z: number): any;
  byZoom?: boolean;
} | null;

export type AggregatedBin = {
  i: number;
  value: number;
  counts: number;
};
