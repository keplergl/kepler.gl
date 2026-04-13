// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import KeplerHeatmapLayer from './deck-heatmap-layer';
import {CHANNEL_SCALES, ALL_FIELD_TYPES} from '@kepler.gl/constants';
import Layer, {LayerBaseConfigPartial, LayerWeightConfig, VisualChannels} from '../base-layer';
import HeatmapLayerIcon from './heatmap-layer-icon';
import {
  ColorRange,
  VisConfigColorRange,
  VisConfigNumber,
  VisConfigSelection,
  HexColor,
  RGBColor,
  Merge,
  LayerColumn,
  LayerBaseConfig,
  MapState
} from '@kepler.gl/types';
import {hexToRgb, DataContainerInterface} from '@kepler.gl/utils';
import {notNullorUndefined} from '@kepler.gl/common-utils';
import {Datasets, KeplerTable} from '@kepler.gl/table';

import {getGeoArrowPointLayerProps, FindDefaultLayerPropsReturnValue} from '../layer-utils';
import {getFilterDataFunc} from '../aggregation-layer';

export type HeatmapLayerVisConfigSettings = {
  opacity: VisConfigNumber;
  colorRange: VisConfigColorRange;
  radius: VisConfigNumber;
  intensity: VisConfigNumber;
  threshold: VisConfigNumber;
  aggregation: VisConfigSelection;
};

export type HeatmapLayerColumnsConfig = {
  // COLUMN_MODE_POINTS
  lat: LayerColumn;
  lng: LayerColumn;

  // COLUMN_MODE_GEOARROW
  geoarrow: LayerColumn;
};

export type HeatmapLayerVisConfig = {
  opacity: number;
  colorRange: ColorRange;
  radius: number;
  intensity: number;
  threshold: number;
  aggregation: string;
};

export type HeatmapLayerVisualChannelConfig = LayerWeightConfig;
export type HeatmapLayerConfig = Merge<
  LayerBaseConfig,
  {columns: HeatmapLayerColumnsConfig; visConfig: HeatmapLayerVisConfig}
> &
  HeatmapLayerVisualChannelConfig;

export const MAX_ZOOM_LEVEL = 18;

export const pointPosAccessor =
  ({lat, lng}: HeatmapLayerColumnsConfig) =>
  (dc: DataContainerInterface) =>
  (d: {index: number}): number[] =>
    [dc.valueAt(d.index, lng.fieldIdx), dc.valueAt(d.index, lat.fieldIdx)];

export const geoarrowPosAccessor =
  ({geoarrow}: HeatmapLayerColumnsConfig) =>
  (dc: DataContainerInterface) =>
  (d: {index: number}): number[] => {
    const row = dc.valueAt(d.index, geoarrow.fieldIdx);
    return [row.get(0), row.get(1)];
  };

export const pointColResolver = ({lat, lng, geoarrow}: HeatmapLayerColumnsConfig, columnMode) => {
  if (columnMode === COLUMN_MODE_POINTS) {
    return `${lat.fieldIdx}-${lng.fieldIdx}`;
  }
  return `geoarrow-${geoarrow.fieldIdx}`;
};

export const HEATMAP_AGGREGATION_TYPES = {
  SUM: 'SUM',
  MEAN: 'MEAN'
} as const;

export const heatmapVisConfigs: {
  opacity: 'opacity';
  colorRange: 'colorRange';
  radius: 'heatmapRadius';
  intensity: VisConfigNumber;
  threshold: VisConfigNumber;
  aggregation: VisConfigSelection;
} = {
  opacity: 'opacity',
  colorRange: 'colorRange',
  radius: 'heatmapRadius',
  intensity: {
    type: 'number',
    label: 'layerVisConfigs.intensity',
    defaultValue: 1,
    isRanged: false,
    range: [0.001, 20],
    step: 0.001,
    property: 'intensity'
  } as VisConfigNumber,
  threshold: {
    type: 'number',
    label: 'layerVisConfigs.threshold',
    defaultValue: 0.18,
    isRanged: false,
    range: [0.01, 1],
    step: 0.001,
    property: 'threshold'
  } as VisConfigNumber,
  aggregation: {
    type: 'select',
    defaultValue: HEATMAP_AGGREGATION_TYPES.SUM,
    label: 'layerVisConfigs.weightAggregation',
    options: Object.keys(HEATMAP_AGGREGATION_TYPES),
    property: 'aggregation'
  } as VisConfigSelection
};

export const pointRequiredColumns = ['lat', 'lng'];
export const geoarrowRequiredColumns = ['geoarrow'];

export const COLUMN_MODE_POINTS = 'points';
export const COLUMN_MODE_GEOARROW = 'geoarrow';
const SUPPORTED_COLUMN_MODES = [
  {
    key: COLUMN_MODE_POINTS,
    label: 'Points',
    requiredColumns: pointRequiredColumns
  },
  {
    key: COLUMN_MODE_GEOARROW,
    label: 'Geoarrow Points',
    requiredColumns: geoarrowRequiredColumns
  }
];
const DEFAULT_COLUMN_MODE = COLUMN_MODE_POINTS;

function toColorRamp(colors: HexColor[]): RGBColor[] {
  if (!colors.length) return [];
  return [colors[0], ...colors, colors[colors.length - 1]].map(hexToRgb);
}

function interpolateByZoom(
  currentZoom: number,
  minZoom: number,
  valueAtMinZoom: number,
  maxZoom: number,
  valueAtMaxZoom: number
): number {
  const value =
    valueAtMinZoom +
    ((currentZoom - minZoom) / (maxZoom - minZoom)) * (valueAtMaxZoom - valueAtMinZoom);
  return Math.min(Math.max(value, valueAtMinZoom), valueAtMaxZoom);
}

class HeatmapLayer extends Layer {
  declare visConfigSettings: HeatmapLayerVisConfigSettings;
  declare config: HeatmapLayerConfig;

  constructor(props) {
    super(props);
    this.registerVisConfig(heatmapVisConfigs);

    this.getPositionAccessor = (dataContainer: DataContainerInterface) => {
      switch (this.config.columnMode) {
        case COLUMN_MODE_GEOARROW:
          return geoarrowPosAccessor(this.config.columns)(dataContainer);
        default:
          return pointPosAccessor(this.config.columns)(dataContainer);
      }
    };
  }

  get type(): 'heatmap' {
    return 'heatmap';
  }

  get isAggregated(): true {
    return true;
  }

  get supportedColumnModes() {
    return SUPPORTED_COLUMN_MODES;
  }

  get columnPairs() {
    return this.defaultPointColumnPairs;
  }

  get noneLayerDataAffectingProps() {
    return [...super.noneLayerDataAffectingProps, 'colorRange'];
  }

  hasAllColumns() {
    const {columns, columnMode} = this.config;
    if (columnMode === COLUMN_MODE_GEOARROW) {
      return this.hasColumnValue(columns.geoarrow);
    }
    return super.hasAllColumns();
  }

  static findDefaultLayerProps(dataset: KeplerTable): FindDefaultLayerPropsReturnValue {
    const altProps = getGeoArrowPointLayerProps(dataset);

    return {
      props: [],
      altProps
    };
  }

  get visualChannels(): VisualChannels {
    return {
      // @ts-expect-error
      weight: {
        property: 'weight',
        field: 'weightField',
        scale: 'weightScale',
        domain: 'weightDomain',
        key: 'weight',
        defaultMeasure: 'property.density',
        supportedFieldTypes: [ALL_FIELD_TYPES.real, ALL_FIELD_TYPES.integer],
        channelScaleType: CHANNEL_SCALES.size
      }
    };
  }

  get layerIcon() {
    return HeatmapLayerIcon;
  }

  getHoverData(): null {
    return null;
  }

  getVisualChannelDescription(channel) {
    return channel === 'color'
      ? {
          label: 'property.color',
          measure: 'property.density'
        }
      : {
          label: 'property.weight',
          measure: this.config.weightField ? this.config.weightField.name : 'property.density'
        };
  }

  getDefaultLayerConfig(props: LayerBaseConfigPartial): HeatmapLayerConfig {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {colorField, colorDomain, colorScale, ...layerConfig} = {
      ...super.getDefaultLayerConfig(props),
      columnMode: props?.columnMode ?? DEFAULT_COLUMN_MODE,

      weightField: null,
      weightDomain: [0, 1],
      weightScale: 'linear'
    };

    // @ts-expect-error
    return layerConfig;
  }

  updateLayerMeta(dataset: KeplerTable) {
    const {dataContainer} = dataset;
    const getPosition = this.getPositionAccessor(dataContainer);
    const bounds = this.getPointsBounds(dataContainer, getPosition);
    this.updateMeta({bounds});
  }

  calculateDataAttribute({filteredIndex}: KeplerTable, getPosition) {
    const data: {index: number}[] = [];

    for (let i = 0; i < filteredIndex.length; i++) {
      const index = filteredIndex[i];
      const pos = getPosition({index});

      if (pos.every(Number.isFinite)) {
        data.push({index});
      }
    }

    return data;
  }

  formatLayerData(datasets: Datasets, oldLayerData: unknown): Record<string, unknown> {
    const {dataId} = this.config;
    if (!notNullorUndefined(dataId)) {
      return {};
    }
    const dataset = datasets[dataId];
    const {weightField, weightScale, weightDomain} = this.config as HeatmapLayerConfig & {
      weightScale: string;
      weightDomain: number[];
    };
    const {gpuFilter, dataContainer} = dataset;

    // Pass oldLayerData with the unfiltered base data so updateData's caching works correctly.
    // formatLayerData returns GPU-filtered `data`, so oldLayerData.data would be the filtered
    // subset. We stash the unfiltered array in `_unfiltered` to feed back to updateData.
    const oldData = oldLayerData as any;
    const baseOldLayerData = oldData?._unfiltered
      ? {...oldData, data: oldData._unfiltered}
      : oldLayerData;

    const {data = []} = this.updateData(datasets, baseOldLayerData);
    const getPosition = this.getPositionAccessor(dataContainer);

    const hasFilter = Object.values(gpuFilter.filterRange).some((arr: any) =>
      arr.some(v => v !== 0)
    );

    let filteredData = data;
    if (hasFilter) {
      const getFilterValue = gpuFilter.filterValueAccessor(dataContainer)(
        (d: {index: number}) => d.index,
        (dc, d, fieldIndex) => dc.valueAt(d.index, fieldIndex)
      );
      const filterFunc = getFilterDataFunc(gpuFilter.filterRange, getFilterValue);
      filteredData = data.filter(filterFunc);
    }

    let getWeight: ((d: {index: number}) => number) | number = 1;
    if (weightField) {
      const weightRange = [0, 1];
      const scaleFunc = this.getVisChannelScale(weightScale, weightDomain, weightRange);
      getWeight = (d: {index: number}) =>
        this.getEncodedChannelValue(scaleFunc || (x => x), d as any, weightField, 0 as any);
    }

    return {
      _unfiltered: data,
      data: filteredData,
      getWeight,
      getPosition
    };
  }

  getDefaultDeckLayerProps(opts) {
    const baseProp = super.getDefaultDeckLayerProps(opts);
    return {
      ...baseProp,
      // gpu data filtering via DataFilterExtension is not supported in aggregation layers
      extensions: [],
      // heatmap is not pickable
      pickable: false
    };
  }

  renderLayer(opts: {
    data: any;
    gpuFilter: any;
    objectHovered: any;
    mapState: MapState;
    layerCallbacks: any;
    idx: number;
    visible: boolean;
  }): KeplerHeatmapLayer[] {
    const {data, mapState} = opts;

    const defaultLayerProps = this.getDefaultDeckLayerProps(opts);
    const {visConfig} = this.config;
    const colorRange = toColorRamp(visConfig.colorRange.colors);

    const intensity = interpolateByZoom(
      mapState.zoom,
      0,
      visConfig.intensity,
      MAX_ZOOM_LEVEL,
      3 * visConfig.intensity
    );
    const radiusPixels = interpolateByZoom(mapState.zoom, 0, 2, MAX_ZOOM_LEVEL, visConfig.radius);

    const updateTriggers = {
      getPosition: this.config.columns,
      getWeight: {
        weightField: this.config.weightField
      }
    };

    return [
      new KeplerHeatmapLayer({
        ...defaultLayerProps,
        ...data,
        aggregation: (visConfig.aggregation || 'SUM') as 'SUM' | 'MEAN',
        radiusPixels,
        intensity,
        threshold: visConfig.threshold,
        updateTriggers,
        colorRange,
        weightsTextureSize: 512,
        debounceTimeout: 0
      })
    ];
  }
}

export default HeatmapLayer;
