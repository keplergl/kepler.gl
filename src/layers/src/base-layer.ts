// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {COORDINATE_SYSTEM} from '@deck.gl/core';
import {GeoArrowTextLayer} from '@kepler.gl/deckgl-arrow-layers';
import {DataFilterExtension} from '@deck.gl/extensions';
import {TextLayer} from '@deck.gl/layers';
import {console as Console} from 'global/window';
import keymirror from 'keymirror';
import React from 'react';
import * as arrow from 'apache-arrow';
import DefaultLayerIcon from './default-layer-icon';
import {diffUpdateTriggers} from './layer-update';

import {
  ALL_FIELD_TYPES,
  CHANNEL_SCALES,
  CHANNEL_SCALE_SUPPORTED_FIELDS,
  COLOR_RANGES,
  ColorRange,
  DEFAULT_COLOR_UI,
  DEFAULT_CUSTOM_PALETTE,
  DEFAULT_HIGHLIGHT_COLOR,
  DEFAULT_LAYER_LABEL,
  DEFAULT_TEXT_LABEL,
  DataVizColors,
  FIELD_OPTS,
  LAYER_VIS_CONFIGS,
  MAX_GPU_FILTERS,
  NO_VALUE_COLOR,
  PROJECTED_PIXEL_SIZE_MULTIPLIER,
  SCALE_FUNC,
  SCALE_TYPES,
  TEXT_OUTLINE_MULTIPLIER,
  UNKNOWN_COLOR_KEY
} from '@kepler.gl/constants';

import {
  DataContainerInterface,
  generateHashId,
  getColorGroupByName,
  getLatLngBounds,
  getSampleContainerData,
  hasColorMap,
  hexToRgb,
  isPlainObject,
  toArray,
  notNullorUndefined,
  reverseColorRange
} from '@kepler.gl/utils';

import {Datasets, GpuFilter, KeplerTable} from '@kepler.gl/table';
import {
  ColorUI,
  Field,
  Filter,
  LayerTextLabel,
  LayerVisConfig,
  LayerVisConfigSettings,
  MapState,
  AnimationConfig,
  LayerColumns,
  LayerColumn,
  ColumnPairs,
  ColumnLabels,
  SupportedColumnMode,
  FieldPair,
  NestedPartial,
  RGBAColor,
  RGBColor,
  ValueOf
} from '@kepler.gl/types';
import {getScaleFunction, initializeLayerColorMap} from '@kepler.gl/utils';

export type VisualChannelDomain = number[] | string[];
export type VisualChannelField = Field | null;
export type VisualChannelScale = keyof typeof SCALE_TYPES;

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
  columnMode?: string;
  heightField?: VisualChannelField;
  heightDomain?: VisualChannelDomain;
  heightScale?: string;
};

export type LayerBaseConfigPartial = {dataId: LayerBaseConfig['dataId']} & Partial<LayerBaseConfig>;

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

export type VisualChannels = {[key: string]: VisualChannel};

export type VisualChannelAggregation = 'colorAggregation' | 'sizeAggregation';

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

  supportedFieldTypes?: Array<keyof typeof ALL_FIELD_TYPES>;

  aggregation?: VisualChannelAggregation;
};

export type VisualChannelDescription = {
  label: string;
  measure: string | undefined;
};

type ColumnValidator = (column: LayerColumn, columns: LayerColumns, allFields: Field[]) => boolean;

export type UpdateTriggers = {
  [key: string]: UpdateTrigger;
};
export type UpdateTrigger = {
  [key: string]: any;
};
export type LayerBounds = [number, number, number, number];
export type FindDefaultLayerPropsReturnValue = {props: any[]; foundLayers?: any[]};
/**
 * Approx. number of points to sample in a large data set
 */
export const LAYER_ID_LENGTH = 6;

const MAX_SAMPLE_SIZE = 5000;
const defaultDomain: [number, number] = [0, 1];
const dataFilterExtension = new DataFilterExtension({
  filterSize: MAX_GPU_FILTERS,
  // @ts-expect-error not typed
  countItems: true
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const defaultDataAccessor = dc => d => d;
// Can't use fiedValueAccesor because need the raw data to render tooltip
// SHAN: Revisit here
export const defaultGetFieldValue = (field, d) => field.valueAccessor(d);

export const OVERLAY_TYPE_CONST = keymirror({
  deckgl: null,
  mapboxgl: null
});

export const layerColors = Object.values(DataVizColors).map(hexToRgb);
function* generateColor(): Generator<RGBColor> {
  let index = 0;
  while (index < layerColors.length + 1) {
    if (index === layerColors.length) {
      index = 0;
    }
    yield layerColors[index++];
  }
}

export type LayerInfoModal = {
  id: string;
  template: React.FC<void>;
  modalProps: {
    title: string;
  };
};

export const colorMaker = generateColor();

export type BaseLayerConstructorProps = {
  id?: string;
} & LayerBaseConfigPartial;

class Layer {
  id: string;
  meta: Record<string, any>;
  visConfigSettings: {
    [key: string]: ValueOf<LayerVisConfigSettings>;
  };
  config: LayerBaseConfig;
  // TODO: define _oldDataUpdateTriggers
  _oldDataUpdateTriggers: any;

  isValid: boolean;
  errorMessage: string | null;
  filteredItemCount: {
    [deckLayerId: string]: number;
  };

  constructor(props: BaseLayerConstructorProps) {
    this.id = props.id || generateHashId(LAYER_ID_LENGTH);
    // meta
    this.meta = {};

    // visConfigSettings
    this.visConfigSettings = {};

    this.config = this.getDefaultLayerConfig(props);

    // set columnMode from supported columns
    if (!this.config.columnMode) {
      const {supportedColumnModes} = this;
      if (supportedColumnModes?.length) {
        this.config.columnMode = supportedColumnModes[0]?.key;
      }
    }
    // then set column, columnMode should already been set
    this.config.columns = this.getLayerColumns(props.columns);

    // false indicates that the layer caused an error, and was disabled
    this.isValid = true;
    this.errorMessage = null;
    // item count
    this.filteredItemCount = {};
  }

  get layerIcon(): React.ElementType {
    return DefaultLayerIcon;
  }

  get overlayType(): keyof typeof OVERLAY_TYPE_CONST {
    return OVERLAY_TYPE_CONST.deckgl;
  }

  get type(): string | null {
    return null;
  }

  get name(): string | null {
    return this.type;
  }

  get isAggregated() {
    return false;
  }

  get requiredLayerColumns(): string[] {
    const {supportedColumnModes} = this;
    if (supportedColumnModes) {
      return supportedColumnModes.reduce<string[]>(
        (acc, obj) => (obj.requiredColumns ? acc.concat(obj.requiredColumns) : acc),
        []
      );
    }
    return [];
  }

  get optionalColumns(): string[] {
    const {supportedColumnModes} = this;
    if (supportedColumnModes) {
      return supportedColumnModes.reduce<string[]>(
        (acc, obj) => (obj.optionalColumns ? acc.concat(obj.optionalColumns) : acc),
        []
      );
    }
    return [];
  }

  get noneLayerDataAffectingProps() {
    return ['label', 'opacity', 'thickness', 'isVisible', 'hidden'];
  }

  get visualChannels(): VisualChannels {
    return {
      color: {
        property: 'color',
        field: 'colorField',
        scale: 'colorScale',
        domain: 'colorDomain',
        range: 'colorRange',
        key: 'color',
        channelScaleType: CHANNEL_SCALES.color,
        nullValue: NO_VALUE_COLOR,
        defaultValue: config => config.color
      },
      size: {
        property: 'size',
        field: 'sizeField',
        scale: 'sizeScale',
        domain: 'sizeDomain',
        range: 'sizeRange',
        key: 'size',
        channelScaleType: CHANNEL_SCALES.size,
        nullValue: 0,
        defaultValue: 1
      }
    };
  }

  get columnValidators(): {[key: string]: ColumnValidator} {
    return {};
  }
  /*
   * Column pairs maps layer column to a specific field pairs,
   * By default, it is set to null
   */
  get columnPairs(): ColumnPairs | null {
    return null;
  }

  /**
   * Column labels if its different than column key
   */
  get columnLabels(): ColumnLabels | null {
    return null;
  }

  /*
   * Default point column pairs, can be used for point based layers: point, icon etc.
   */
  get defaultPointColumnPairs(): ColumnPairs {
    return {
      lat: {pair: ['lng', 'altitude'], fieldPairKey: 'lat'},
      lng: {pair: ['lat', 'altitude'], fieldPairKey: 'lng'},
      altitude: {pair: ['lng', 'lat'], fieldPairKey: 'altitude'}
    };
  }

  /*
   * Default link column pairs, can be used for link based layers: arc, line etc
   */
  get defaultLinkColumnPairs(): ColumnPairs {
    return {
      lat: {pair: ['lng', 'alt'], fieldPairKey: 'lat'},
      lng: {pair: ['lat', 'alt'], fieldPairKey: 'lng'},
      alt: {pair: ['lng', 'lat'], fieldPairKey: 'altitude'},

      lat0: {pair: 'lng0', fieldPairKey: 'lat'},
      lng0: {pair: 'lat0', fieldPairKey: 'lng'},
      alt0: {pair: ['lng0', 'lat0'], fieldPairKey: 'altitude'},

      lat1: {pair: 'lng1', fieldPairKey: 'lat'},
      lng1: {pair: 'lat1', fieldPairKey: 'lng'},
      alt1: {pair: ['lng1', 'lat1'], fieldPairKey: 'altitude'}
    };
  }

  /**
   * Return a React component for to render layer instructions in a modal
   * @returns {object} - an object
   * @example
   *  return {
   *    id: 'iconInfo',
   *    template: IconInfoModal,
   *    modalProps: {
   *      title: 'How to draw icons'
   *   };
   * }
   */
  get layerInfoModal(): LayerInfoModal | Record<string, LayerInfoModal> | null {
    return null;
  }

  /**
   * Returns which column modes this layer supports
   */
  get supportedColumnModes(): SupportedColumnMode[] | null {
    return null;
  }

  get supportedDatasetTypes(): string[] | null {
    return null;
  }
  /*
   * Given a dataset, automatically find props to create layer based on it
   * and return the props and previous found layers.
   * By default, no layers will be found
   */
  static findDefaultLayerProps(
    dataset: KeplerTable,
    foundLayers?: any[]
  ): FindDefaultLayerPropsReturnValue {
    return {props: [], foundLayers};
  }

  /**
   * Given a array of preset required column names
   * found field that has the same name to set as layer column
   *
   * @param {object} defaultFields
   * @param {object[]} allFields
   * @returns {object[] | null} all possible required layer column pairs
   */
  static findDefaultColumnField(defaultFields, allFields) {
    // find all matched fields for each required col
    const requiredColumns = Object.keys(defaultFields).reduce((prev, key) => {
      const requiredFields = allFields.filter(
        f => f.name === defaultFields[key] || defaultFields[key].includes(f.name)
      );

      prev[key] = requiredFields.length
        ? requiredFields.map(f => ({
            value: f.name,
            fieldIdx: f.fieldIdx
          }))
        : null;
      return prev;
    }, {});

    if (!Object.values(requiredColumns).every(Boolean)) {
      // if any field missing, return null
      return null;
    }

    return this.getAllPossibleColumnPairs(requiredColumns);
  }

  static getAllPossibleColumnPairs(requiredColumns) {
    // for multiple matched field for one required column, return multiple
    // combinations, e. g. if column a has 2 matched, column b has 3 matched
    // 6 possible column pairs will be returned
    const allKeys = Object.keys(requiredColumns);
    const pointers = allKeys.map((k, i) => (i === allKeys.length - 1 ? -1 : 0));
    const countPerKey = allKeys.map(k => requiredColumns[k].length);
    // TODO: Better typings
    const pairs: any[] = [];

    /* eslint-disable no-loop-func */
    while (incrementPointers(pointers, countPerKey, pointers.length - 1)) {
      const newPair = pointers.reduce((prev, cuur, i) => {
        prev[allKeys[i]] = requiredColumns[allKeys[i]][cuur];
        return prev;
      }, {});

      pairs.push(newPair);
    }
    /* eslint-enable no-loop-func */

    // recursively increment pointers
    function incrementPointers(pts, counts, index) {
      if (index === 0 && pts[0] === counts[0] - 1) {
        // nothing to increment
        return false;
      }

      if (pts[index] + 1 < counts[index]) {
        pts[index] = pts[index] + 1;
        return true;
      }

      pts[index] = 0;
      return incrementPointers(pts, counts, index - 1);
    }

    return pairs;
  }

  static hexToRgb(c) {
    return hexToRgb(c);
  }

  getDefaultLayerConfig(
    props: LayerBaseConfigPartial
  ): LayerBaseConfig & Partial<LayerColorConfig & LayerSizeConfig> {
    return {
      dataId: props.dataId,
      label: props.label || DEFAULT_LAYER_LABEL,
      color: props.color || colorMaker.next().value,
      // set columns later
      columns: {},
      isVisible: props.isVisible ?? true,
      isConfigActive: props.isConfigActive ?? false,
      highlightColor: props.highlightColor || DEFAULT_HIGHLIGHT_COLOR,
      hidden: props.hidden ?? false,

      // TODO: refactor this into separate visual Channel config
      // color by field, domain is set by filters, field, scale type
      colorField: null,
      colorDomain: [0, 1],
      colorScale: SCALE_TYPES.quantile,

      // color by size, domain is set by filters, field, scale type
      sizeDomain: [0, 1],
      sizeScale: SCALE_TYPES.linear,
      sizeField: null,

      visConfig: {},

      textLabel: [DEFAULT_TEXT_LABEL],

      colorUI: {
        color: DEFAULT_COLOR_UI,
        colorRange: DEFAULT_COLOR_UI
      },
      animation: {enabled: false},
      ...(props.columnMode ? {columnMode: props.columnMode} : {})
    };
  }

  /**
   * Get the description of a visualChannel config
   * @param key
   * @returns
   */
  getVisualChannelDescription(key: string): VisualChannelDescription {
    // e.g. label: Color, measure: Vehicle Type
    const channel = this.visualChannels[key];
    if (!channel) return {label: '', measure: undefined};
    const rangeSettings = this.visConfigSettings[channel.range];
    const fieldSettings = this.config[channel.field];
    const label = rangeSettings?.label;
    return {
      label: typeof label === 'function' ? label(this.config) : label || '',
      measure: fieldSettings
        ? fieldSettings.displayName || fieldSettings.name
        : channel.defaultMeasure
    };
  }

  /**
   * Assign a field to layer column, return column config
   */
  assignColumn(key: string, field: {name: string; fieldIdx: number}): LayerColumns {
    // field value could be null for optional columns
    const update = field
      ? {
          value: field.name,
          fieldIdx: field.fieldIdx
        }
      : {value: null, fieldIdx: -1};

    return {
      ...this.config.columns,
      [key]: {
        ...this.config.columns?.[key],
        ...update
      }
    };
  }

  /**
   * Assign a field pair to column config, return column config
   */
  assignColumnPairs(key: string, fieldPairs: FieldPair): LayerColumns {
    if (!this.columnPairs || !this.columnPairs?.[key]) {
      // should not end in this state
      return this.config.columns;
    }
    // key = 'lat'
    const {pair, fieldPairKey} = this.columnPairs?.[key] || {};

    if (typeof fieldPairKey === 'string' && !pair[fieldPairKey]) {
      // do not allow `key: undefined` to creep into the `updatedColumn` object
      return this.config.columns;
    }

    // pair = ['lng', 'alt] | 'lng'
    const updatedColumn = {
      ...this.config.columns,
      // @ts-expect-error fieldPairKey can be string[] here?
      [key]: fieldPairs[fieldPairKey]
    };

    const partnerKeys = toArray(pair);
    for (const partnerKey of partnerKeys) {
      if (
        this.config.columns[partnerKey] &&
        this.columnPairs?.[partnerKey] &&
        // @ts-ignore
        fieldPairs[this.columnPairs?.[partnerKey].fieldPairKey]
      ) {
        // @ts-ignore
        updatedColumn[partnerKey] = fieldPairs[this.columnPairs?.[partnerKey].fieldPairKey];
      }
    }

    return updatedColumn;
  }

  /**
   * Calculate a radius zoom multiplier to render points, so they are visible in all zoom level
   * @param {object} mapState
   * @param {number} mapState.zoom - actual zoom
   * @param {number | void} mapState.zoomOffset - zoomOffset when render in the plot container for export image
   * @returns {number}
   */
  getZoomFactor({zoom, zoomOffset = 0}) {
    return Math.pow(2, Math.max(14 - zoom + zoomOffset, 0));
  }

  /**
   * Calculate a elevation zoom multiplier to render points, so they are visible in all zoom level
   * @param {object} mapState
   * @param {number} mapState.zoom - actual zoom
   * @param {number=} mapState.zoomOffset - zoomOffset when render in the plot container for export image
   * @returns {number}
   */
  getElevationZoomFactor({zoom, zoomOffset = 0}: {zoom: number; zoomOffset?: number}): number {
    return this.config.visConfig.enableElevationZoomFactor
      ? Math.pow(2, Math.max(8 - zoom + zoomOffset, 0))
      : 1;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  formatLayerData(datasets: Datasets, oldLayerData?: any) {
    return {};
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  renderLayer(...args: any[]): any[] {
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getHoverData(
    object: any,
    dataContainer: DataContainerInterface,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fields?: Field[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    animationConfig?: AnimationConfig,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    hoverInfo?: {index: number}
  ): any {
    if (!object) {
      return null;
    }

    // By default, each entry of layerData should have an index of a row in the original data container.
    // Each layer can implement its own getHoverData method
    return dataContainer.row(object.index);
  }

  getFilteredItemCount(): number | null {
    // use first layer
    if (Object.keys(this.filteredItemCount).length) {
      const firstLayer = Object.keys(this.filteredItemCount)[0];
      return this.filteredItemCount[firstLayer];
    }
    return null;
  }
  /**
   * When change layer type, try to copy over layer configs as much as possible
   * @param configToCopy - config to copy over
   * @param visConfigSettings - visConfig settings of config to copy
   */
  assignConfigToLayer(configToCopy, visConfigSettings) {
    // don't deep merge visualChannel field
    // don't deep merge color range, reversed: is not a key by default
    const shallowCopy = ['colorRange', 'strokeColorRange'].concat(
      Object.values(this.visualChannels).map(v => v.field)
    );

    // don't copy over domain and animation
    const notToCopy = ['animation'].concat(Object.values(this.visualChannels).map(v => v.domain));
    // if range is for the same property group copy it, otherwise, not to copy
    Object.values(this.visualChannels).forEach(v => {
      if (
        configToCopy.visConfig[v.range] &&
        this.visConfigSettings[v.range] &&
        visConfigSettings[v.range].group !== this.visConfigSettings[v.range].group
      ) {
        notToCopy.push(v.range);
      }
    });

    // don't copy over visualChannel range
    const currentConfig = this.config;
    const copied = this.copyLayerConfig(currentConfig, configToCopy, {
      shallowCopy,
      notToCopy
    });

    // update columNode based on new columns
    if (this.config.columnMode && this.supportedColumnModes) {
      // find a mode with all requied columns
      const satisfiedColumnMode = this.supportedColumnModes?.find(mode => {
        return mode.requiredColumns?.every(requriedCol => copied.columns?.[requriedCol]?.value);
      });
      copied.columnMode = satisfiedColumnMode?.key || copied.columnMode;
    }

    this.updateLayerConfig(copied);
    // validate visualChannel field type and scale types
    Object.keys(this.visualChannels).forEach(channel => {
      this.validateVisualChannel(channel);
    });
  }

  /*
   * Recursively copy config over to an empty layer
   * when received saved config, or copy config over from a different layer type
   * make sure to only copy over value to existing keys
   * @param {object} currentConfig - existing config to be override
   * @param {object} configToCopy - new Config to copy over
   * @param {string[]} shallowCopy - array of properties to not to be deep copied
   * @param {string[]} notToCopy - array of properties not to copy
   * @returns {object} - copied config
   */
  copyLayerConfig(
    currentConfig,
    configToCopy,
    {shallowCopy = [], notToCopy = []}: {shallowCopy?: string[]; notToCopy?: string[]} = {}
  ) {
    const copied: {columnMode?: string; columns?: LayerColumns} = {};
    Object.keys(currentConfig).forEach(key => {
      if (
        isPlainObject(currentConfig[key]) &&
        isPlainObject(configToCopy[key]) &&
        !shallowCopy.includes(key) &&
        !notToCopy.includes(key)
      ) {
        // recursively assign object value
        copied[key] = this.copyLayerConfig(currentConfig[key], configToCopy[key], {
          shallowCopy,
          notToCopy
        });
      } else if (notNullorUndefined(configToCopy[key]) && !notToCopy.includes(key)) {
        // copy
        copied[key] = configToCopy[key];
      } else {
        // keep existing
        copied[key] = currentConfig[key];
      }
    });

    return copied;
  }

  registerVisConfig(layerVisConfigs: {
    [key: string]: keyof LayerVisConfigSettings | ValueOf<LayerVisConfigSettings>;
  }) {
    Object.keys(layerVisConfigs).forEach(item => {
      const configItem = layerVisConfigs[item];
      if (typeof configItem === 'string' && LAYER_VIS_CONFIGS[configItem]) {
        // if assigned one of default LAYER_CONFIGS
        this.config.visConfig[item] = LAYER_VIS_CONFIGS[configItem].defaultValue;
        this.visConfigSettings[item] = LAYER_VIS_CONFIGS[configItem];
      } else if (
        typeof configItem === 'object' &&
        ['type', 'defaultValue'].every(p => Object.prototype.hasOwnProperty.call(configItem, p))
      ) {
        // if provided customized visConfig, and has type && defaultValue
        // TODO: further check if customized visConfig is valid
        this.config.visConfig[item] = configItem.defaultValue;
        this.visConfigSettings[item] = configItem;
      }
    });
  }

  getLayerColumns(propsColumns = {}) {
    const columnValidators = this.columnValidators || {};
    const required = this.requiredLayerColumns.reduce(
      (accu, key) => ({
        ...accu,
        [key]: columnValidators[key]
          ? {
              value: propsColumns[key]?.value ?? null,
              fieldIdx: propsColumns[key]?.fieldIdx ?? -1,
              validator: columnValidators[key]
            }
          : {value: propsColumns[key]?.value ?? null, fieldIdx: propsColumns[key]?.fieldIdx ?? -1}
      }),
      {}
    );
    const optional = this.optionalColumns.reduce(
      (accu, key) => ({
        ...accu,
        [key]: {
          value: propsColumns[key]?.value ?? null,
          fieldIdx: propsColumns[key]?.fieldIdx ?? -1,
          optional: true
        }
      }),
      {}
    );

    const columns = {...required, ...optional};

    return columns;
  }

  updateLayerConfig<LayerConfig extends LayerBaseConfig = LayerBaseConfig>(
    newConfig: Partial<LayerConfig>
  ): Layer {
    this.config = {...this.config, ...newConfig};
    return this;
  }

  updateLayerVisConfig(newVisConfig) {
    this.config.visConfig = {...this.config.visConfig, ...newVisConfig};
    return this;
  }

  updateLayerColorUI(prop: string, newConfig: NestedPartial<ColorUI>): Layer {
    const {colorUI: previous, visConfig} = this.config;

    if (!isPlainObject(newConfig) || typeof prop !== 'string') {
      return this;
    }

    const colorUIProp = Object.entries(newConfig).reduce((accu, [key, value]) => {
      return {
        ...accu,
        [key]: isPlainObject(accu[key]) && isPlainObject(value) ? {...accu[key], ...value} : value
      };
    }, previous[prop] || DEFAULT_COLOR_UI);

    const colorUI = {
      ...previous,
      [prop]: colorUIProp
    };

    this.updateLayerConfig({colorUI});
    // if colorUI[prop] is colorRange
    const isColorRange = visConfig[prop] && visConfig[prop].colors;

    if (isColorRange) {
      // if open dropdown and prop is color range
      // Automatically set colorRangeConfig's step and reversed
      this.updateColorUIByColorRange(newConfig, prop);

      // if changes in UI is made to 'reversed', 'steps' or steps
      // update current layer colorRange
      this.updateColorRangeByColorUI(newConfig, previous, prop);

      // if set colorRangeConfig to custom
      // initiate customPalette to be edited in the ui
      this.updateCustomPalette(newConfig, previous, prop);
    }

    return this;
  }

  // if set colorRangeConfig to custom palette or custom breaks
  // initiate customPalette to be edited in the ui
  updateCustomPalette(newConfig, previous, prop) {
    if (!newConfig.colorRangeConfig?.custom && !newConfig.colorRangeConfig?.customBreaks) {
      return;
    }

    const {colorUI, visConfig} = this.config;

    if (!visConfig[prop]) return;
    // make copy of current color range to customPalette
    const customPalette = {
      ...visConfig[prop]
    };

    if (newConfig.colorRangeConfig.customBreaks && !customPalette.colorMap) {
      // find visualChanel
      const visualChannels = this.visualChannels;
      const channelKey = Object.keys(visualChannels).find(
        key => visualChannels[key].range === prop
      );
      if (!channelKey) {
        // should never happn
        Console.warn(`updateColorUI: Can't find visual channel which range is ${prop}`);
        return;
      }
      // initiate colorMap from current scale
      customPalette.colorMap = initializeLayerColorMap(this, visualChannels[channelKey]);
    } else if (newConfig.colorRangeConfig.custom) {
      customPalette.name = DEFAULT_CUSTOM_PALETTE.name;
      customPalette.type = DEFAULT_CUSTOM_PALETTE.type;
      customPalette.category = DEFAULT_CUSTOM_PALETTE.category;
    }

    this.updateLayerConfig({
      colorUI: {
        ...colorUI,
        [prop]: {
          ...colorUI[prop],
          customPalette
        }
      }
    });
  }

  /**
   * if open dropdown and prop is color range
   * Automatically set colorRangeConfig's step and reversed
   * @param {*} newConfig
   * @param {*} prop
   */
  updateColorUIByColorRange(newConfig, prop) {
    if (typeof newConfig.showDropdown !== 'number') return;

    const {colorUI, visConfig} = this.config;
    this.updateLayerConfig({
      colorUI: {
        ...colorUI,
        [prop]: {
          ...colorUI[prop],
          colorRangeConfig: {
            ...colorUI[prop].colorRangeConfig,
            steps: visConfig[prop].colors.length,
            reversed: Boolean(visConfig[prop].reversed)
          }
        }
      }
    });
  }

  updateColorRangeByColorUI(newConfig, previous, prop) {
    // only update colorRange if changes in UI is made to 'reversed', 'steps' or steps
    const shouldUpdate =
      newConfig.colorRangeConfig &&
      ['reversed', 'steps'].some(
        key =>
          Object.prototype.hasOwnProperty.call(newConfig.colorRangeConfig, key) &&
          newConfig.colorRangeConfig[key] !==
            (previous[prop] || DEFAULT_COLOR_UI).colorRangeConfig[key]
      );
    if (!shouldUpdate) return;

    const {colorUI, visConfig} = this.config;
    const {steps, reversed} = colorUI[prop].colorRangeConfig;
    const colorRange = visConfig[prop];
    // find based on step or reversed
    let update;
    if (Object.prototype.hasOwnProperty.call(newConfig.colorRangeConfig, 'steps')) {
      const group = getColorGroupByName(colorRange);

      if (group) {
        const sameGroup = COLOR_RANGES.filter(cr => getColorGroupByName(cr) === group);

        update = sameGroup.find(cr => cr.colors.length === steps);

        if (update && colorRange.reversed) {
          update = reverseColorRange(true, update);
        }
      }
    }

    if (Object.prototype.hasOwnProperty.call(newConfig.colorRangeConfig, 'reversed')) {
      update = reverseColorRange(reversed, update || colorRange);
    }

    if (update) {
      this.updateLayerVisConfig({[prop]: update});
    }
  }
  hasColumnValue(column?: LayerColumn) {
    return Boolean(column && column.value && column.fieldIdx > -1);
  }
  hasRequiredColumn(column?: LayerColumn) {
    return Boolean(column && (column.optional || this.hasColumnValue(column)));
  }
  /**
   * Check whether layer has all columns
   * @returns yes or no
   */
  hasAllColumns(): boolean {
    const {columns, columnMode} = this.config;
    // if layer has different column mode, check if have all required columns of current column Mode
    if (columnMode) {
      const currentColumnModes = (this.supportedColumnModes || []).find(
        colMode => colMode.key === columnMode
      );
      return Boolean(
        currentColumnModes !== undefined &&
          currentColumnModes.requiredColumns?.every(colKey => this.hasColumnValue(columns[colKey]))
      );
    }
    return Boolean(
      columns &&
        Object.values(columns).every((column?: LayerColumn) => this.hasRequiredColumn(column))
    );
  }

  /**
   * Check whether layer has data
   *
   * @param {Array | Object} layerData
   * @returns {boolean} yes or no
   */
  hasLayerData(layerData: {data: unknown[] | arrow.Table}) {
    if (!layerData) {
      return false;
    }

    return Boolean(
      layerData.data &&
        ((layerData.data as unknown[]).length || (layerData.data as arrow.Table).numRows)
    );
  }

  isValidToSave(): boolean {
    return Boolean(this.type && this.hasAllColumns());
  }

  shouldRenderLayer(data): boolean {
    return (
      Boolean(this.type) &&
      this.hasAllColumns() &&
      this.hasLayerData(data) &&
      typeof this.renderLayer === 'function'
    );
  }

  getColorScale(colorScale: string, colorDomain: VisualChannelDomain, colorRange: ColorRange) {
    if (hasColorMap(colorRange) && colorScale === SCALE_TYPES.custom) {
      const cMap = new Map();
      colorRange.colorMap?.forEach(([k, v]) => {
        cMap.set(k, typeof v === 'string' ? hexToRgb(v) : v);
      });

      const scaleType = colorScale === SCALE_TYPES.custom ? colorScale : SCALE_TYPES.ordinal;

      const scale = getScaleFunction(scaleType, cMap.values(), cMap.keys(), false);
      scale.unknown(cMap.get(UNKNOWN_COLOR_KEY) || NO_VALUE_COLOR);

      return scale;
    }
    return this.getVisChannelScale(colorScale, colorDomain, colorRange.colors.map(hexToRgb));
  }

  /**
   * Mapping from visual channels to deck.gl accesors
   * @param {Object} param Parameters
   * @param {Function} param.dataAccessor Access kepler.gl layer data from deck.gl layer
   * @param {import('utils/table-utils/data-container-interface').DataContainerInterface} param.dataContainer DataContainer to use use with dataAccessor
   * @return {Object} attributeAccessors - deck.gl layer attribute accessors
   */
  getAttributeAccessors({
    dataAccessor = defaultDataAccessor,
    dataContainer
  }: {
    dataAccessor?: typeof defaultDataAccessor;
    dataContainer: DataContainerInterface;
  }) {
    const attributeAccessors: {[key: string]: any} = {};

    Object.keys(this.visualChannels).forEach(channel => {
      const {
        field,
        fixed,
        scale,
        domain,
        range,
        accessor,
        defaultValue,
        getAttributeValue,
        nullValue,
        channelScaleType
      } = this.visualChannels[channel];

      if (accessor) {
        const shouldGetScale = this.config[field];

        if (shouldGetScale) {
          const isFixed = fixed && this.config.visConfig[fixed];

          const scaleFunction =
            channelScaleType === CHANNEL_SCALES.color
              ? this.getColorScale(
                  this.config[scale],
                  this.config[domain],
                  this.config.visConfig[range]
                )
              : this.getVisChannelScale(
                  this.config[scale],
                  this.config[domain],
                  this.config.visConfig[range],
                  isFixed
                );

          attributeAccessors[accessor] = d =>
            this.getEncodedChannelValue(
              // @ts-ignore
              scaleFunction,
              dataAccessor(dataContainer)(d),
              this.config[field],
              nullValue
            );
        } else if (typeof getAttributeValue === 'function') {
          attributeAccessors[accessor] = getAttributeValue(this.config);
        } else {
          attributeAccessors[accessor] =
            typeof defaultValue === 'function' ? defaultValue(this.config) : defaultValue;
        }

        if (!attributeAccessors[accessor]) {
          Console.warn(`Failed to provide accessor function for ${accessor || channel}`);
        }
      }
    });

    return attributeAccessors;
  }

  getVisChannelScale(
    scale: string,
    domain: VisualChannelDomain,
    range: any,
    fixed?: boolean
  ): () => any | null {
    return SCALE_FUNC[fixed ? 'linear' : scale]()
      .domain(domain)
      .range(fixed ? domain : range);
  }

  /**
   * Get longitude and latitude bounds of the data.
   * @param {import('utils/table-utils/data-container-interface').DataContainerInterface} dataContainer DataContainer to calculate bounds for.
   * @param {(d: {index: number}, dc: import('utils/table-utils/data-container-interface').DataContainerInterface) => number[]} getPosition Access kepler.gl layer data from deck.gl layer
   * @return {number[]|null} bounds of the data.
   */
  getPointsBounds(
    dataContainer: DataContainerInterface,
    getPosition?: (x: any, dc: DataContainerInterface) => number[]
  ): number[] | null {
    // no need to loop through the entire dataset
    // get a sample of data to calculate bounds
    const sampleData =
      dataContainer.numRows() > MAX_SAMPLE_SIZE
        ? getSampleContainerData(dataContainer, MAX_SAMPLE_SIZE)
        : dataContainer;

    const points = getPosition ? sampleData.mapIndex(getPosition) : [];

    const latBounds = getLatLngBounds(points, 1, [-90, 90]);
    const lngBounds = getLatLngBounds(points, 0, [-180, 180]);

    if (!latBounds || !lngBounds) {
      return null;
    }

    return [lngBounds[0], latBounds[0], lngBounds[1], latBounds[1]];
  }

  getChangedTriggers(dataUpdateTriggers) {
    const triggerChanged = diffUpdateTriggers(dataUpdateTriggers, this._oldDataUpdateTriggers);
    this._oldDataUpdateTriggers = dataUpdateTriggers;

    return triggerChanged;
  }

  getEncodedChannelValue(
    scale: (value) => any,
    data: any[],
    field: VisualChannelField,
    nullValue = NO_VALUE_COLOR,
    getValue = defaultGetFieldValue
  ) {
    const value = getValue(field, data);

    if (!notNullorUndefined(value)) {
      return nullValue;
    }

    let attributeValue;
    if (Array.isArray(value)) {
      attributeValue = value.map(scale);
    } else {
      attributeValue = scale(value);
    }

    if (!notNullorUndefined(attributeValue)) {
      attributeValue = nullValue;
    }

    return attributeValue;
  }

  updateMeta(meta: Layer['meta']) {
    this.meta = {...this.meta, ...meta};
  }

  getDataUpdateTriggers({filteredIndex, id, dataContainer}: KeplerTable): any {
    const {columns} = this.config;

    return {
      getData: {datasetId: id, dataContainer, columns, filteredIndex},
      getMeta: {datasetId: id, dataContainer, columns},
      ...(this.config.textLabel || []).reduce(
        (accu, tl, i) => ({
          ...accu,
          [`getLabelCharacterSet-${i}`]: tl.field ? tl.field.name : null
        }),
        {}
      )
    };
  }

  updateData(datasets: Datasets, oldLayerData: any) {
    if (!this.config.dataId) {
      return {};
    }
    const layerDataset = datasets[this.config.dataId];
    const {dataContainer} = layerDataset;

    const getPosition = this.getPositionAccessor(dataContainer);
    const dataUpdateTriggers = this.getDataUpdateTriggers(layerDataset);
    const triggerChanged = this.getChangedTriggers(dataUpdateTriggers);

    if (triggerChanged && (triggerChanged.getMeta || triggerChanged.getData)) {
      this.updateLayerMeta(dataContainer, getPosition);

      // reset filteredItemCount
      this.filteredItemCount = {};
    }

    let data = [];

    if (!(triggerChanged && triggerChanged.getData) && oldLayerData && oldLayerData.data) {
      // same data
      data = oldLayerData.data;
    } else {
      data = this.calculateDataAttribute(layerDataset, getPosition);
    }

    return {data, triggerChanged};
  }

  /**
   * helper function to update one layer domain when state.data changed
   * if state.data change is due ot update filter, newFiler will be passed
   * called by updateAllLayerDomainData
   * @param datasets
   * @param newFilter
   * @returns layer
   */
  updateLayerDomain(datasets: Datasets, newFilter?: Filter): Layer {
    const table = this.getDataset(datasets);
    if (!table) {
      return this;
    }
    Object.values(this.visualChannels).forEach(channel => {
      const {scale} = channel;
      const scaleType = this.config[scale];
      // ordinal domain is based on dataContainer, if only filter changed
      // no need to update ordinal domain
      if (!newFilter || scaleType !== SCALE_TYPES.ordinal) {
        const {domain} = channel;
        const updatedDomain = this.calculateLayerDomain(table, channel);
        this.updateLayerConfig({[domain]: updatedDomain});
      }
    });

    return this;
  }

  getDataset(datasets) {
    return this.config.dataId ? datasets[this.config.dataId] : null;
  }

  /**
   * Validate visual channel field and scales based on supported field & scale type
   * @param channel
   */
  validateVisualChannel(channel: string) {
    this.validateFieldType(channel);
    this.validateScale(channel);
  }

  /**
   * Validate field type based on channelScaleType
   */
  validateFieldType(channel: string) {
    const visualChannel = this.visualChannels[channel];
    const {field, channelScaleType, supportedFieldTypes} = visualChannel;

    if (this.config[field]) {
      // if field is selected, check if field type is supported
      const channelSupportedFieldTypes =
        supportedFieldTypes || CHANNEL_SCALE_SUPPORTED_FIELDS[channelScaleType];

      if (!channelSupportedFieldTypes.includes(this.config[field].type)) {
        // field type is not supported, set it back to null
        // set scale back to default
        this.updateLayerConfig({[field]: null});
      }
    }
  }

  /**
   * Validate scale type based on aggregation
   */
  validateScale(channel) {
    const visualChannel = this.visualChannels[channel];
    const {scale} = visualChannel;
    if (!scale) {
      // visualChannel doesn't have scale
      return;
    }
    const scaleOptions = this.getScaleOptions(channel);
    // check if current selected scale is
    // supported, if not, change to default
    if (!scaleOptions.includes(this.config[scale])) {
      this.updateLayerConfig({[scale]: scaleOptions[0]});
    }
  }

  /**
   * Get scale options based on current field
   * @param {string} channel
   * @returns {string[]}
   */
  getScaleOptions(channel: string): string[] {
    const visualChannel = this.visualChannels[channel];
    const {field, scale, channelScaleType} = visualChannel;

    return this.config[field]
      ? FIELD_OPTS[this.config[field].type].scale[channelScaleType]
      : [this.getDefaultLayerConfig({dataId: ''})[scale]];
  }

  updateLayerVisualChannel(dataset: KeplerTable, channel: string) {
    const visualChannel = this.visualChannels[channel];
    this.validateVisualChannel(channel);
    // calculate layer channel domain
    const updatedDomain = this.calculateLayerDomain(dataset, visualChannel);
    this.updateLayerConfig({[visualChannel.domain]: updatedDomain});
  }

  getVisualChannelUpdateTriggers(): UpdateTriggers {
    const updateTriggers: UpdateTriggers = {};
    Object.values(this.visualChannels).forEach(visualChannel => {
      // field range scale domain
      const {accessor, field, scale, domain, range, defaultValue, fixed} = visualChannel;

      if (accessor) {
        updateTriggers[accessor] = {
          [field]: this.config[field],
          [scale]: this.config[scale],
          [domain]: this.config[domain],
          [range]: this.config.visConfig[range],
          defaultValue:
            typeof defaultValue === 'function' ? defaultValue(this.config) : defaultValue,
          ...(fixed ? {[fixed]: this.config.visConfig[fixed]} : {})
        };
      }
    });
    return updateTriggers;
  }

  calculateLayerDomain(dataset, visualChannel) {
    const {scale} = visualChannel;
    const scaleType = this.config[scale];

    const field = this.config[visualChannel.field];
    if (!field) {
      // if colorField or sizeField were set back to null
      return defaultDomain;
    }

    return dataset.getColumnLayerDomain(field, scaleType) || defaultDomain;
  }

  hasHoveredObject(objectInfo) {
    return this.isLayerHovered(objectInfo) && objectInfo.object ? objectInfo.object : null;
  }

  isLayerHovered(objectInfo): boolean {
    return objectInfo?.picked && objectInfo?.layer?.props?.id === this.id;
  }

  getRadiusScaleByZoom(mapState: MapState, fixedRadius?: boolean) {
    const radiusChannel = Object.values(this.visualChannels).find(vc => vc.property === 'radius');

    if (!radiusChannel) {
      return 1;
    }

    const field = radiusChannel.field;
    const fixed = fixedRadius === undefined ? this.config.visConfig.fixedRadius : fixedRadius;
    const {radius} = this.config.visConfig;

    return fixed ? 1 : (this.config[field] ? 1 : radius) * this.getZoomFactor(mapState);
  }

  shouldCalculateLayerData(props: string[]) {
    return props.some(p => !this.noneLayerDataAffectingProps.includes(p));
  }

  getBrushingExtensionProps(interactionConfig, brushingTarget?) {
    const {brush} = interactionConfig;

    return {
      // brushing
      autoHighlight: !brush.enabled,
      brushingRadius: brush.config.size * 1000,
      brushingTarget: brushingTarget || 'source',
      brushingEnabled: brush.enabled
    };
  }

  getDefaultDeckLayerProps({
    idx,
    gpuFilter,
    mapState,
    layerCallbacks,
    visible
  }: {
    idx: number;
    gpuFilter: GpuFilter;
    mapState: MapState;
    layerCallbacks: any;
    visible: boolean;
  }) {
    return {
      id: this.id,
      idx,
      coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
      pickable: true,
      wrapLongitude: true,
      parameters: {depthTest: Boolean(mapState.dragRotate || this.config.visConfig.enable3d)},
      hidden: this.config.hidden,
      // visconfig
      opacity: this.config.visConfig.opacity,
      highlightColor: this.config.highlightColor,
      // data filtering
      extensions: [dataFilterExtension],
      filterRange: gpuFilter ? gpuFilter.filterRange : undefined,
      onFilteredItemsChange: gpuFilter ? layerCallbacks?.onFilteredItemsChange : undefined,

      // layer should be visible and if splitMap, shown in to one of panel
      visible: this.config.isVisible && visible
    };
  }

  getDefaultHoverLayerProps() {
    return {
      id: `${this.id}-hovered`,
      pickable: false,
      wrapLongitude: true,
      coordinateSystem: COORDINATE_SYSTEM.LNGLAT
    };
  }

  renderTextLabelLayer(
    {
      getPosition,
      getFiltered,
      getPixelOffset,
      backgroundProps,
      updateTriggers,
      sharedProps
    }: {
      getPosition?: ((d: any) => number[]) | arrow.Vector;
      getFiltered?: (data: {index: number}, objectInfo: {index: number}) => number;
      getPixelOffset: (textLabel: any) => number[] | ((d: any) => number[]);
      backgroundProps?: {background: boolean};
      updateTriggers: {
        [key: string]: any;
      };
      sharedProps: any;
    },
    renderOpts
  ) {
    const {data, mapState} = renderOpts;
    const {textLabel} = this.config;

    const TextLayerClass = data.data instanceof arrow.Table ? GeoArrowTextLayer : TextLayer;

    return data.textLabels.reduce((accu, d, i) => {
      if (d.getText) {
        const background = textLabel[i].background || backgroundProps?.background;

        accu.push(
          // @ts-expect-error
          new TextLayerClass({
            ...sharedProps,
            id: `${this.id}-label-${textLabel[i].field?.name}`,
            data: data.data,
            visible: this.config.isVisible,
            getText: d.getText,
            getPosition,
            getFiltered,
            characterSet: d.characterSet,
            getPixelOffset: getPixelOffset(textLabel[i]),
            getSize: PROJECTED_PIXEL_SIZE_MULTIPLIER,
            sizeScale: textLabel[i].size,
            getTextAnchor: textLabel[i].anchor,
            getAlignmentBaseline: textLabel[i].alignment,
            getColor: textLabel[i].color,
            outlineWidth: textLabel[i].outlineWidth * TEXT_OUTLINE_MULTIPLIER,
            outlineColor: textLabel[i].outlineColor,
            background,
            getBackgroundColor: textLabel[i].backgroundColor,
            fontSettings: {
              sdf: textLabel[i].outlineWidth > 0
            },
            parameters: {
              // text will always show on top of all layers
              depthTest: false
            },

            getFilterValue: data.getFilterValue,
            updateTriggers: {
              ...updateTriggers,
              getText: textLabel[i].field?.name,
              getPixelOffset: {
                ...updateTriggers.getRadius,
                mapState,
                anchor: textLabel[i].anchor,
                alignment: textLabel[i].alignment
              },
              getTextAnchor: textLabel[i].anchor,
              getAlignmentBaseline: textLabel[i].alignment,
              getColor: textLabel[i].color
            },
            _subLayerProps: {
              ...(background
                ? {
                    background: {
                      parameters: {
                        cull: false
                      }
                    }
                  }
                : null)
            }
          })
        );
      }
      return accu;
    }, []);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  calculateDataAttribute(keplerTable: KeplerTable, getPosition): any {
    // implemented in subclasses
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateLayerMeta(dataContainer: DataContainerInterface, getPosition) {
    // implemented in subclasses
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getPositionAccessor(dataContainer?: DataContainerInterface): (...args: any[]) => any {
    // implemented in subclasses
    return () => null;
  }
}

export default Layer;
