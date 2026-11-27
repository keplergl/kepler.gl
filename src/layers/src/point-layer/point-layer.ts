// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import type {LayerAnimatableProp} from '@kepler.gl/types';

import * as arrow from 'apache-arrow';
import {scaleLinear} from 'd3-scale';

import {LayerExtension} from '@deck.gl/core';
import {BrushingExtension} from '@deck.gl/extensions';
import {ScatterplotLayer} from '@deck.gl/layers';

import {GeoArrowScatterplotLayer} from '@kepler.gl/deckgl-arrow-layers';
import {FilterArrowExtension} from '@kepler.gl/deckgl-layers';

import Layer, {
  LayerBaseConfig,
  LayerBaseConfigPartial,
  LayerColorConfig,
  LayerSizeConfig,
  LayerStrokeColorConfig
} from '../base-layer';
import {
  hexToRgb,
  DataContainerInterface,
  ArrowDataContainer,
  createDataContainer
} from '@kepler.gl/utils';
import {applyDefaultColorField} from '../layer-color-utils';
import {default as KeplerTable} from '@kepler.gl/table';
import PointLayerIcon from './point-layer-icon';
import PulseRippleExtension, {
  EventPulseRippleExtension,
  encodePulseTime,
  isPulseTimeActive
} from './pulse-ripple-extension';
import PointGlowExtension from './point-glow-extension';
import {getLayerDataTime} from '../layer-age-style';
import {
  DatasetType,
  LAYER_VIS_CONFIGS,
  DEFAULT_LAYER_COLOR,
  CHANNEL_SCALES,
  DEFAULT_COLOR_UI,
  ALL_FIELD_TYPES
} from '@kepler.gl/constants';
import {getTextOffsetByRadius, formatTextLabelData} from '../layer-text-label';
import {
  assignPointPairToLayerColumn,
  isLayerHoveredFromArrow,
  getBoundsFromArrowMetadata,
  getGeoArrowPointLayerProps,
  isGeoArrowPointField,
  createGeoArrowPointVector,
  getFilteredIndex,
  getNeighbors,
  FindDefaultLayerProps,
  getGeoArrowPointCoords
} from '../layer-utils';
import {getGeojsonPointDataMaps, GeojsonPointDataMaps} from '../geojson-layer/geojson-utils';
import {
  ColorRange,
  Merge,
  RGBColor,
  VisConfigBoolean,
  VisConfigColorRange,
  VisConfigColorSelect,
  VisConfigNumber,
  VisConfigSelection,
  VisConfigRange,
  LayerColumn,
  Field,
  Filter,
  AnimationConfig
} from '@kepler.gl/types';

export type PointLayerVisConfigSettings = {
  radius: VisConfigNumber;
  fixedRadius: VisConfigBoolean;
  opacity: VisConfigNumber;
  outline: VisConfigBoolean;
  thickness: VisConfigNumber;
  strokeColor: VisConfigColorSelect;
  colorRange: VisConfigColorRange;
  strokeColorRange: VisConfigColorRange;
  radiusRange: VisConfigRange;
  filled: VisConfigBoolean;
  glowEnabled: VisConfigBoolean;
  glowExtent: VisConfigNumber;
  glowStrength: VisConfigNumber;
  pulseEnabled: VisConfigBoolean;
  pulseMode: VisConfigSelection;
  pulseSpeed: VisConfigNumber;
  pulseExpansion: VisConfigNumber;
  pulseTrigger: VisConfigSelection;
  pulseTimeField: VisConfigSelection;
  pulseDurationMs: VisConfigNumber;
};

export type PointLayerColumnsConfig = {
  lat: LayerColumn;
  lng: LayerColumn;
  altitude?: LayerColumn;
  neighbors?: LayerColumn;
  geojson: LayerColumn;
  geoarrow: LayerColumn;
};

export type PointLayerVisConfig = {
  radius: number;
  fixedRadius: boolean;
  opacity: number;
  fillOpacityField?: string;
  fillOpacityScale?: 'linear' | 'identity';
  fillOpacityRange?: [number, number];
  outline: boolean;
  thickness: number;
  strokeColor: RGBColor;
  colorRange: ColorRange;
  strokeColorRange: ColorRange;
  radiusRange: [number, number];
  filled: boolean;
  glowEnabled: boolean;
  glowExtent: number;
  glowStrength: number;
  pulseEnabled: boolean;
  pulseMode: 'pulse' | 'ripple';
  pulseSpeed: number;
  pulseExpansion: number;
  pulseTrigger: 'continuous' | 'event';
  pulseTimeField: string;
  pulseDurationMs: number;
  billboard: boolean;
  allowHover: boolean;
  showNeighborOnHover: boolean;
  showHighlightColor: boolean;
};
export type PointLayerVisualChannelConfig = LayerColorConfig &
  LayerSizeConfig &
  LayerStrokeColorConfig;
export type PointLayerConfig = Merge<
  LayerBaseConfig,
  {columns: PointLayerColumnsConfig; visConfig: PointLayerVisConfig}
> &
  PointLayerVisualChannelConfig;

export type PointLayerData = {
  position: number[];
  index: number;
  neighbors: any[];
};

export const pointPosAccessor =
  ({lat, lng, altitude}: PointLayerColumnsConfig) =>
  (dc: DataContainerInterface) =>
  (d: {index: number}) =>
    [
      dc.valueAt(d.index, lng.fieldIdx),
      dc.valueAt(d.index, lat.fieldIdx),
      altitude && altitude.fieldIdx > -1 ? dc.valueAt(d.index, altitude.fieldIdx) : 0
    ];

export const geojsonPosAccessor =
  ({geojson}: {geojson: LayerColumn}) =>
  d =>
    d[geojson.fieldIdx];

export const geoarrowPosAccessor =
  ({geoarrow}: PointLayerColumnsConfig) =>
  (dataContainer: DataContainerInterface) =>
  (d: {index: number}) => {
    const row = dataContainer.valueAt(d.index, geoarrow.fieldIdx);
    return getGeoArrowPointCoords(row);
  };

export const COLUMN_MODE_POINTS = 'points';
export const COLUMN_MODE_GEOJSON = 'geojson';
export const COLUMN_MODE_GEOARROW = 'geoarrow';

export const pointRequiredColumns: ['lat', 'lng'] = ['lat', 'lng'];
export const pointOptionalColumns: ['altitude', 'neighbors'] = ['altitude', 'neighbors'];
export const geojsonRequiredColumns: ['geojson'] = ['geojson'];
export const geoarrowRequiredColumns: ['geoarrow'] = ['geoarrow'];

const SUPPORTED_COLUMN_MODES = [
  {
    key: COLUMN_MODE_POINTS,
    label: 'Point Columns',
    requiredColumns: pointRequiredColumns,
    optionalColumns: pointOptionalColumns
  },
  {
    key: COLUMN_MODE_GEOJSON,
    label: 'GeoJSON Feature',
    requiredColumns: geojsonRequiredColumns,
    verifyField: f => !isGeoArrowPointField(f)
  },
  {
    key: COLUMN_MODE_GEOARROW,
    label: 'Geoarrow Points',
    requiredColumns: geoarrowRequiredColumns,
    verifyField: f => isGeoArrowPointField(f)
  }
];
const DEFAULT_COLUMN_MODE = COLUMN_MODE_POINTS;

const brushingExtension = new BrushingExtension();
const arrowCPUFilterExtension = new FilterArrowExtension();
const pulseRippleExtension = new PulseRippleExtension();
const eventPulseRippleExtension = new EventPulseRippleExtension();
const pointGlowExtension = new PointGlowExtension();

class PointFillOpacityExtension extends LayerExtension {
  static extensionName = 'PointFillOpacityExtension';

  getShaders() {
    return {
      // deck.gl concatenates direct extension injections as strings. Keep the
      // ordered hook in a module so it composes with Glow and Pulse/Ripple.
      modules: [
        {
          name: 'pointFillOpacity',
          inject: {
            // Discard transparent fill after stroke composition, but before picking
            // can replace its alpha. Otherwise it can still write depth at altitude.
            'fs:DECKGL_FILTER_COLOR': {order: -1, injection: 'if (color.a <= 0.0) discard;'}
          }
        }
      ]
    };
  }
}

const pointFillOpacityExtension = new PointFillOpacityExtension();

function pushPointPosition(data: any[], pos: number[], index: number, neighbors?: number[]) {
  if (pos.every(Number.isFinite)) {
    data.push({
      position: pos,
      // index is important for filter
      index,
      ...(neighbors ? {neighbors} : {})
    });
  }
}

export const pointVisConfigs: {
  radius: 'radius';
  fixedRadius: 'fixedRadius';
  opacity: 'opacity';
  outline: 'outline';
  thickness: 'thickness';
  strokeColor: 'strokeColor';
  colorRange: 'colorRange';
  strokeColorRange: 'strokeColorRange';
  radiusRange: 'radiusRange';
  filled: VisConfigBoolean;
  glowEnabled: VisConfigBoolean;
  glowExtent: VisConfigNumber;
  glowStrength: VisConfigNumber;
  pulseEnabled: VisConfigBoolean;
  pulseMode: VisConfigSelection;
  pulseSpeed: VisConfigNumber;
  pulseExpansion: VisConfigNumber;
  pulseTrigger: VisConfigSelection;
  pulseTimeField: VisConfigSelection;
  pulseDurationMs: VisConfigNumber;
  billboard: 'billboard';
  allowHover: 'allowHover';
  showNeighborOnHover: 'showNeighborOnHover';
  showHighlightColor: 'showHighlightColor';
} = {
  pulseTrigger: {
    type: 'select',
    defaultValue: 'continuous',
    options: ['continuous', 'event'],
    label: 'layerVisConfigs.point.pulseTrigger',
    property: 'pulseTrigger'
  } as VisConfigSelection,
  pulseTimeField: {
    type: 'select',
    defaultValue: '',
    options: [],
    label: 'layerVisConfigs.point.pulseTimeField',
    property: 'pulseTimeField',
    group: 'point'
  } as VisConfigSelection,
  pulseDurationMs: {
    type: 'number',
    defaultValue: 1000,
    label: 'layerVisConfigs.point.pulseDuration',
    property: 'pulseDurationMs',
    isRanged: false,
    range: [1, Number.MAX_SAFE_INTEGER],
    step: 1
  } as VisConfigNumber,
  glowEnabled: {
    type: 'boolean',
    defaultValue: false,
    label: 'layerVisConfigs.point.glow',
    property: 'glowEnabled'
  } as VisConfigBoolean,
  glowExtent: {
    type: 'number',
    defaultValue: 2,
    label: 'layerVisConfigs.point.glowExtent',
    description: 'layerVisConfigs.point.glowExtentDescription',
    property: 'glowExtent',
    isRanged: false,
    range: [1, 5],
    step: 0.1
  } as VisConfigNumber,
  glowStrength: {
    type: 'number',
    defaultValue: 0.5,
    label: 'layerVisConfigs.point.glowStrength',
    property: 'glowStrength',
    isRanged: false,
    range: [0, 1],
    step: 0.05
  } as VisConfigNumber,
  pulseEnabled: {
    type: 'boolean',
    defaultValue: false,
    label: 'layerVisConfigs.point.pulseRipple',
    property: 'pulseEnabled'
  } as VisConfigBoolean,
  pulseMode: {
    type: 'select',
    defaultValue: 'pulse',
    label: 'layerVisConfigs.point.pulseMode',
    options: ['pulse', 'ripple'],
    property: 'pulseMode'
  } as VisConfigSelection,
  pulseSpeed: {
    type: 'number',
    defaultValue: 1,
    label: 'layerVisConfigs.point.pulseSpeed',
    property: 'pulseSpeed',
    isRanged: false,
    range: [0.1, 3],
    step: 0.1
  } as VisConfigNumber,
  pulseExpansion: {
    type: 'number',
    defaultValue: 2,
    label: 'layerVisConfigs.point.pulseExpansion',
    description: 'layerVisConfigs.point.pulseExpansionDescription',
    property: 'pulseExpansion',
    isRanged: false,
    range: [1, 50],
    step: 0.01
  } as VisConfigNumber,
  radius: 'radius',
  fixedRadius: 'fixedRadius',
  opacity: 'opacity',
  outline: 'outline',
  thickness: 'thickness',
  strokeColor: 'strokeColor',
  colorRange: 'colorRange',
  strokeColorRange: 'strokeColorRange',
  radiusRange: 'radiusRange',
  filled: {
    ...LAYER_VIS_CONFIGS.filled,
    type: 'boolean',
    label: 'layer.fillColor',
    defaultValue: true,
    property: 'filled'
  },
  billboard: 'billboard',
  allowHover: 'allowHover',
  showNeighborOnHover: 'showNeighborOnHover',
  showHighlightColor: 'showHighlightColor'
};

type PointRow = {index: number};
type PointFillColor = number[] | ((row: PointRow) => number[]);
type PointFillOpacityAccessor = (row: PointRow) => number[];

function isFillOpacityRange(value: unknown): value is [number, number] {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    value.every(Number.isFinite) &&
    value[0] >= 0 &&
    value[1] <= 1 &&
    value[0] <= value[1]
  );
}

export default class PointLayer extends Layer {
  declare config: PointLayerConfig;
  declare visConfigSettings: PointLayerVisConfigSettings;
  dataToFeature: GeojsonPointDataMaps = [];

  dataContainer: DataContainerInterface | null = null;
  geoArrowVector: arrow.Vector | undefined = undefined;
  // Keep only the current hover, not a growing cache of visited points.
  private neighborHoverCache?: {
    dependencies: unknown[];
    data: ReturnType<typeof getNeighbors>;
  };
  private fillOpacityAccessors?: Partial<
    Record<
      'fill' | 'highlight',
      {
        field: Field;
        base: PointFillColor;
        domain?: [number, number];
        range0: number;
        range1: number;
        accessor: PointFillOpacityAccessor;
      }
    >
  >;
  private fillOpacityDomainCache?: {
    field: Field;
    dataContainer: DataContainerInterface;
    dataRevision: number;
    filteredIndex: number[];
    domain: [number, number];
  };
  private pulseTimeCache?: {
    dataContainer: DataContainerInterface;
    dataRevision: number;
    field: Field;
    origin: number;
    domain: [number, number] | null;
    getPulseStartTime: (row: {index: number}) => number[];
  };

  /*
   * CPU filtering an arrow table by values and assembling a partial copy of the raw table is expensive
   * so we will use filteredIndex to create an attribute e.g. filteredIndex [0|1] for GPU filtering
   * in deck.gl layer, see: FilterArrowExtension in @kepler.gl/deckgl-layers.
   * Note that this approach can create visible lags in case of a lot of discarted geometry.
   */
  filteredIndex: Uint8ClampedArray | null = null;
  filteredIndexTrigger: number[] = [];

  constructor(props) {
    super(props);

    this.registerVisConfig(pointVisConfigs);
    this.getPositionAccessor = (dataContainer: DataContainerInterface) => {
      switch (this.config.columnMode) {
        case COLUMN_MODE_GEOARROW:
          return geoarrowPosAccessor(this.config.columns)(dataContainer);
        case COLUMN_MODE_GEOJSON:
          return geojsonPosAccessor(this.config.columns);
        default:
          // COLUMN_MODE_POINTS
          return pointPosAccessor(this.config.columns)(dataContainer);
      }
    };
  }

  get animatableProps(): readonly LayerAnimatableProp[] {
    const props: LayerAnimatableProp[] = [
      ...super.animatableProps,
      {name: 'filled', label: 'Fill', type: 'toggle'},
      {name: 'color', label: 'Fill color', type: 'color'},
      {name: 'strokeColor', label: 'Stroke color', type: 'color'},
      {
        name: 'radius',
        label: 'Radius',
        range: this.visConfigSettings.radius.range,
        step: this.visConfigSettings.radius.step
      },
      {
        name: 'thickness',
        label: 'Stroke width',
        range: this.visConfigSettings.thickness.range,
        step: this.visConfigSettings.thickness.step
      },
      {
        name: 'glowExtent',
        label: 'Glow extent',
        range: this.visConfigSettings.glowExtent.range,
        step: this.visConfigSettings.glowExtent.step
      },
      {
        name: 'glowStrength',
        label: 'Glow strength',
        range: this.visConfigSettings.glowStrength.range,
        step: this.visConfigSettings.glowStrength.step
      },
      {
        name: 'pulseSpeed',
        label: 'Pulse speed',
        range: this.visConfigSettings.pulseSpeed.range,
        step: this.visConfigSettings.pulseSpeed.step
      },
      {
        name: 'pulseExpansion',
        label: 'Pulse expansion',
        range: this.visConfigSettings.pulseExpansion.range,
        step: this.visConfigSettings.pulseExpansion.step
      }
    ];
    return props.filter(
      prop =>
        (prop.name !== 'color' || (this.config.visConfig.filled && !this.config.colorField)) &&
        (prop.name !== 'strokeColor' ||
          (this.config.visConfig.outline && !this.config.strokeColorField)) &&
        (prop.name !== 'radius' || !this.config.sizeField) &&
        (prop.name !== 'thickness' || this.config.visConfig.outline) &&
        (!['glowExtent', 'glowStrength'].includes(prop.name) ||
          (this.config.visConfig.glowEnabled &&
            (this.config.visConfig.filled || this.config.visConfig.outline))) &&
        (prop.name !== 'pulseSpeed' ||
          (this.config.visConfig.pulseEnabled && this.config.visConfig.pulseTrigger !== 'event')) &&
        (prop.name !== 'pulseExpansion' || this.config.visConfig.pulseEnabled)
    );
  }

  copyLayerConfig(...args: Parameters<Layer['copyLayerConfig']>) {
    const [current, source, options] = args;
    const copied = super.copyLayerConfig(...args);
    // The base copier skips keys absent from default config. Keep the setting
    // opt-in so existing Point layers keep their original config shape.
    if (current === this.config.visConfig) {
      const settings = {
        fillOpacityField:
          typeof source.fillOpacityField === 'string' && source.fillOpacityField
            ? source.fillOpacityField
            : undefined,
        fillOpacityScale: ['linear', 'identity'].includes(source.fillOpacityScale)
          ? source.fillOpacityScale
          : undefined,
        fillOpacityRange: isFillOpacityRange(source.fillOpacityRange)
          ? [...source.fillOpacityRange]
          : undefined
      };
      for (const [key, value] of Object.entries(settings)) {
        if (options?.notToCopy?.includes(key)) continue;
        if (value === undefined) delete copied[key];
        else copied[key] = value;
      }
    }
    return copied;
  }

  validateVisConfig(dataset: KeplerTable, visConfig: PointLayerVisConfig): PointLayerVisConfig {
    const {
      fillOpacityField,
      fillOpacityScale: _scale,
      fillOpacityRange: _range,
      ...rest
    } = visConfig;
    return dataset.fields.some(
      field =>
        field.name === fillOpacityField &&
        (field.type === ALL_FIELD_TYPES.integer || field.type === ALL_FIELD_TYPES.real)
    )
      ? visConfig
      : rest;
  }

  get type(): 'point' {
    return 'point';
  }

  get isAggregated(): false {
    return false;
  }

  get layerIcon() {
    return PointLayerIcon;
  }

  get optionalColumns() {
    return pointOptionalColumns;
  }

  get columnPairs() {
    return this.defaultPointColumnPairs;
  }

  get supportedColumnModes() {
    return SUPPORTED_COLUMN_MODES;
  }

  get noneLayerDataAffectingProps() {
    return [
      ...super.noneLayerDataAffectingProps,
      'radius',
      'glowEnabled',
      'glowExtent',
      'glowStrength',
      'pulseMode',
      'pulseSpeed',
      'pulseExpansion'
    ];
  }

  get visualChannels() {
    return {
      color: {
        ...super.visualChannels.color,
        accessor: 'getFillColor',
        condition: config => config.visConfig.filled,
        defaultValue: config => config.color
      },
      strokeColor: {
        property: 'strokeColor',
        key: 'strokeColor',
        field: 'strokeColorField',
        scale: 'strokeColorScale',
        domain: 'strokeColorDomain',
        range: 'strokeColorRange',
        channelScaleType: CHANNEL_SCALES.color,
        accessor: 'getLineColor',
        condition: config => config.visConfig.outline,
        defaultValue: config => config.visConfig.strokeColor || config.color
      },
      size: {
        ...super.visualChannels.size,
        property: 'radius',
        range: 'radiusRange',
        fixed: 'fixedRadius',
        channelScaleType: 'radius',
        accessor: 'getRadius',
        defaultValue: 1
      }
    };
  }

  setInitialLayerConfig(dataset: KeplerTable) {
    applyDefaultColorField(this, dataset);
    return this;
  }

  static findDefaultLayerProps(dataset: KeplerTable) {
    const {fieldPairs = [], type, label, fields} = dataset;

    const props: FindDefaultLayerProps[] = [];

    if (type === DatasetType.VECTOR_TILE) {
      return {props};
    }

    // Make layer for each pair
    fieldPairs.forEach(pair => {
      const latField = pair.pair.lat;

      const prop: {
        label: string;
        color?: RGBColor;
        isVisible?: boolean;
        columns?: PointLayerColumnsConfig;
        sizeField?: PointLayerConfig['sizeField'];
      } = {
        ...(pair.pair.radius ? {sizeField: fields[pair.pair.radius.fieldIdx]} : {}),
        label:
          // Skip the generic 'point' fallback from findPointFieldPairs and use the dataset label instead
          pair.defaultName && pair.defaultName !== 'point'
            ? pair.defaultName
            : (typeof label === 'string' && label.replace(/\.[^/.]+$/, '')) || 'Point'
      };

      // default layer color for begintrip and dropoff point
      if (latField.value in DEFAULT_LAYER_COLOR) {
        prop.color = hexToRgb(DEFAULT_LAYER_COLOR[latField.value]);
      }

      // set the first layer to be visible
      if (props.length === 0) {
        prop.isVisible = true;
      }
      // @ts-expect-error logically separate geojson column type?
      prop.columns = assignPointPairToLayerColumn(pair, true);

      props.push(prop);
    });

    const altProps = getGeoArrowPointLayerProps(dataset);

    return {props, altProps};
  }

  getDefaultLayerConfig(
    props: LayerBaseConfigPartial & Partial<Pick<PointLayerConfig, 'sizeField'>>
  ) {
    const defaultLayerConfig = super.getDefaultLayerConfig(props ?? {});
    return {
      ...defaultLayerConfig,

      columnMode: props?.columnMode ?? DEFAULT_COLUMN_MODE,
      sizeField: props?.sizeField ?? defaultLayerConfig.sizeField,

      // add stroke color visual channel
      strokeColorField: null,
      strokeColorDomain: [0, 1],
      strokeColorScale: 'quantile',
      colorUI: {
        ...defaultLayerConfig.colorUI,
        strokeColorRange: DEFAULT_COLOR_UI
      }
    };
  }

  calculateDataAttribute({filteredIndex, dataContainer}: KeplerTable, getPosition) {
    const {columnMode} = this.config;

    // 1) COLUMN_MODE_GEOARROW - when we have a geoarrow point column
    // 2) COLUMN_MODE_POINTS + ArrowDataContainer > create geoarrow point column on the fly
    if (
      dataContainer instanceof ArrowDataContainer &&
      (columnMode === COLUMN_MODE_GEOARROW || columnMode === COLUMN_MODE_POINTS)
    ) {
      this.filteredIndex = getFilteredIndex(
        dataContainer.numRows(),
        filteredIndex,
        this.filteredIndex
      );
      this.filteredIndexTrigger = filteredIndex;

      if (this.config.columnMode === COLUMN_MODE_GEOARROW) {
        this.geoArrowVector = dataContainer.getColumn(this.config.columns.geoarrow.fieldIdx);
      } else {
        // generate a column compatible with geoarrow point
        this.geoArrowVector = createGeoArrowPointVector(dataContainer, getPosition);
      }

      return dataContainer.getTable();
    }

    // we don't need these in non-Arrow modes atm.
    this.geoArrowVector = undefined;
    this.filteredIndex = null;

    const data: PointLayerData[] = [];

    for (let i = 0; i < filteredIndex.length; i++) {
      const index = filteredIndex[i];
      let neighbors;

      if (this.config.columnMode === COLUMN_MODE_POINTS) {
        if (this.config.columns.neighbors?.value) {
          const {fieldIdx} = this.config.columns.neighbors;
          neighbors = Array.isArray(dataContainer.valueAt(index, fieldIdx))
            ? dataContainer.valueAt(index, fieldIdx)
            : [];
        }
        const pos = getPosition({index});

        // if doesn't have point lat or lng, do not add the point
        // deck.gl can't handle position = null
        pushPointPosition(data, pos, index, neighbors);
      } else {
        // COLUMN_MODE_GEOJSON mode - point from geojson coordinates
        const coordinates = this.dataToFeature[index];
        // if multi points
        if (coordinates && Array.isArray(coordinates[0])) {
          coordinates.forEach(coord => {
            pushPointPosition(data, coord, index);
          });
        } else if (coordinates && Number.isFinite(coordinates[0])) {
          pushPointPosition(data, coordinates as number[], index);
        }
      }
    }

    return data;
  }

  formatLayerData(datasets, oldLayerData) {
    if (this.config.dataId === null) {
      return {};
    }
    const {textLabel} = this.config;
    const {gpuFilter, dataContainer, fields, dataRevision} = datasets[this.config.dataId];
    const {data, triggerChanged} = this.updateData(datasets, oldLayerData);
    const pulseData = this.updateEventAnimation(datasets[this.config.dataId]);
    const getPosition = d => d.position;

    // get all distinct characters in the text labels
    const textLabels = formatTextLabelData({
      textLabel,
      triggerChanged,
      oldLayerData,
      data,
      dataContainer,
      filteredIndex: this.filteredIndex
    });

    const textLabelAngles = textLabel.some(label => label.field && label.angleField)
      ? textLabel.map(label => {
          if (!label.field || !label.angleField) return null;
          const fieldIdx = fields.findIndex(
            field =>
              field.name === label.angleField &&
              (field.type === ALL_FIELD_TYPES.integer || field.type === ALL_FIELD_TYPES.real)
          );
          if (fieldIdx < 0) return null;

          return {
            getAngle: ({index}: {index: number}) => {
              const value = dataContainer.valueAt(index, fieldIdx);
              const degrees = typeof value === 'bigint' ? Number(value % BigInt(360)) : value;
              return Number.isFinite(degrees) ? degrees % 360 : 0;
            },
            trigger: {field: label.angleField, fieldIdx, dataContainer, dataRevision}
          };
        })
      : null;

    const accessors = this.getAttributeAccessors({dataContainer});
    const fillOpacityFieldName = this.config.visConfig.fillOpacityField;
    const fillOpacityField = fillOpacityFieldName
      ? fields.find(
          field =>
            field.name === fillOpacityFieldName &&
            (field.type === ALL_FIELD_TYPES.integer || field.type === ALL_FIELD_TYPES.real)
        )
      : undefined;
    const fillOpacityDomain =
      fillOpacityField && this.config.visConfig.fillOpacityScale === 'linear'
        ? this.getFillOpacityDomain(datasets[this.config.dataId], fillOpacityField)
        : undefined;
    if (!fillOpacityDomain) this.fillOpacityDomainCache = undefined;

    const isFilteredAccessor = (data: {index: number}) => {
      return this.filteredIndex ? this.filteredIndex[data.index] : 1;
    };

    return {
      data,
      getPosition,
      getFilterValue: gpuFilter.filterValueAccessor(dataContainer)(),
      getFiltered: isFilteredAccessor,
      textLabels,
      ...(textLabelAngles ? {textLabelAngles} : {}),
      ...pulseData,
      ...(fillOpacityField ? {fillOpacityField} : {}),
      ...(fillOpacityDomain ? {fillOpacityDomain} : {}),
      ...accessors
    };
  }
  /* eslint-enable complexity */

  getEventPulseCurrentTime(filters: Filter[] = []): number | null {
    return getLayerDataTime(this.config.dataId, this.config.visConfig.pulseTimeField, filters);
  }

  updateEventAnimation(dataset: KeplerTable) {
    // Event effects follow a user-created filter, never register a layer timeline.
    this.config.animation = {enabled: false};
    const {pulseEnabled, pulseTrigger, pulseTimeField, pulseDurationMs} = this.config.visConfig;
    const field = dataset.fields.find(f => f.name === pulseTimeField && f.type === 'timestamp');
    if (
      !pulseEnabled ||
      pulseTrigger !== 'event' ||
      !field ||
      !Number.isFinite(pulseDurationMs) ||
      pulseDurationMs <= 0
    ) {
      this.pulseTimeCache = undefined;
      return {};
    }
    const {dataContainer, dataRevision} = dataset;
    let cache = this.pulseTimeCache;
    if (
      !cache ||
      cache.dataContainer !== dataContainer ||
      cache.dataRevision !== dataRevision ||
      cache.field !== field
    ) {
      let min = Infinity;
      let max = -Infinity;
      const times = dataContainer.mapIndex(({index}) => {
        const value = field.valueAccessor({index});
        if (!Number.isFinite(value)) return null;
        min = Math.min(min, value);
        max = Math.max(max, value);
        return value as number;
      });
      const origin = Number.isFinite(min) ? min : 0;
      const encoded = times.map(time => encodePulseTime(time === null ? null : time - origin));
      cache = this.pulseTimeCache = {
        dataContainer,
        dataRevision,
        field,
        origin,
        domain: Number.isFinite(min) ? [min, max] : null,
        getPulseStartTime: ({index}) => encoded[index] || [0, 0, 0]
      };
    }
    const end = cache.domain ? cache.domain[1] + pulseDurationMs : NaN;
    return {
      getPulseStartTime: cache.getPulseStartTime,
      pulseTimeOrigin: cache.origin,
      pulseTimeDomain: cache.domain && Number.isFinite(end) ? [cache.domain[0], end] : null
    };
  }

  updateLayerMeta(dataset: KeplerTable) {
    const {dataContainer} = dataset;
    this.dataContainer = dataContainer;

    if (this.config.columnMode === COLUMN_MODE_GEOJSON) {
      const getFeature = this.getPositionAccessor();
      this.dataToFeature = getGeojsonPointDataMaps(dataContainer, getFeature);
      const positions = this.dataToFeature.flatMap<number[]>(coordinates =>
        !coordinates
          ? []
          : Array.isArray(coordinates[0])
          ? (coordinates as number[][])
          : [coordinates as number[]]
      );
      const bounds = this.getPointsBounds(createDataContainer(positions), ({index}, container) =>
        container.rowAsArray(index)
      );
      this.updateMeta({bounds});
    } else if (this.config.columnMode === COLUMN_MODE_GEOARROW) {
      const boundsFromMetadata = getBoundsFromArrowMetadata(
        this.config.columns.geoarrow,
        dataContainer as ArrowDataContainer
      );
      if (boundsFromMetadata) {
        this.updateMeta({bounds: boundsFromMetadata});
      } else {
        const getPosition = this.getPositionAccessor(dataContainer);
        const bounds = this.getPointsBounds(dataContainer, getPosition);
        this.updateMeta({bounds});
      }
    } else {
      const getPosition = this.getPositionAccessor(dataContainer);
      const bounds = this.getPointsBounds(dataContainer, getPosition);
      this.updateMeta({bounds});
    }
  }

  private getFillOpacityDomain(dataset: KeplerTable, field: Field): [number, number] {
    const {dataContainer, dataRevision, filteredIndexForDomain} = dataset;
    const cached = this.fillOpacityDomainCache;
    if (
      cached?.field === field &&
      cached.dataContainer === dataContainer &&
      cached.dataRevision === dataRevision &&
      cached.filteredIndex === filteredIndexForDomain
    ) {
      return cached.domain;
    }
    // Follow the same domain-filtering policy as Color by. Invalid values do not
    // contribute bounds, and changing the output range does not rescan the data.
    const domain = dataset.getColumnLayerDomain(
      {
        ...field,
        valueAccessor: row => {
          const value = field.valueAccessor(row);
          const number = typeof value === 'bigint' ? Number(value) : value;
          return typeof number === 'number' && Number.isFinite(number) ? number : undefined;
        }
      },
      'linear'
    ) as [number, number];
    this.fillOpacityDomainCache = {
      field,
      dataContainer,
      dataRevision,
      filteredIndex: filteredIndexForDomain,
      domain
    };
    return domain;
  }

  // Reuse the accessor while field, scale and base color are unchanged. Animated base
  // colors get a new accessor so previously rendered frames keep their own color.
  private getFillOpacityAccessor(
    key: 'fill' | 'highlight',
    field: Field,
    base: PointFillColor,
    domain?: [number, number]
  ): PointFillOpacityAccessor {
    const cache = this.fillOpacityAccessors ?? (this.fillOpacityAccessors = {});
    const previous = cache[key];
    const range = this.config.visConfig.fillOpacityRange;
    const [range0, range1] = isFillOpacityRange(range) ? range : [0, 1];
    if (
      previous &&
      previous.field === field &&
      previous.base === base &&
      previous.domain === domain &&
      previous.range0 === range0 &&
      previous.range1 === range1
    ) {
      return previous.accessor;
    }
    const scale = domain ? scaleLinear().domain(domain).range([range0, range1]).clamp(true) : null;
    const accessor = (row: PointRow) => {
      const color = typeof base === 'function' ? base(row) : base;
      const value = field.valueAccessor(row);
      const number = typeof value === 'bigint' ? Number(value) : value;
      if (typeof number !== 'number' || !Number.isFinite(number)) return color;
      const opacity = scale ? scale(number) : Math.min(1, Math.max(number, 0));
      if (opacity >= 1) return color;
      return [color[0], color[1], color[2], Math.round((color[3] ?? 255) * opacity)];
    };
    cache[key] = {field, base, domain, range0, range1, accessor};
    return accessor;
  }

  // eslint-disable-next-line complexity
  renderLayer(opts) {
    opts = this.getAgeStyledLayerProps(opts);
    const {data, gpuFilter, objectHovered, mapState, interactionConfig, dataset, filters} = opts;

    // if no field size is defined we need to pass fixed radius = false
    const fixedRadius = this.config.visConfig.fixedRadius && Boolean(this.config.sizeField);
    const radiusScale = this.getRadiusScaleByZoom(mapState, fixedRadius);
    const {pulseEnabled, pulseMode, pulseSpeed, pulseExpansion, pulseTrigger, pulseDurationMs} =
      this.config.visConfig;
    const continuous = pulseEnabled && pulseTrigger !== 'event';
    const pulseProps = {pulseEnabled: continuous, pulseMode, pulseSpeed, pulseExpansion};
    const eventDomain = data.pulseTimeDomain;
    const pulseCurrentTime =
      pulseEnabled && pulseTrigger === 'event' ? this.getEventPulseCurrentTime(filters) : null;
    const eventColorAccessor = this.config.visConfig.filled ? 'getFillColor' : 'getLineColor';
    const showEventOverlay =
      (this.config.visConfig.filled || this.config.visConfig.outline) &&
      pulseEnabled &&
      pulseTrigger === 'event' &&
      eventDomain &&
      isPulseTimeActive(pulseCurrentTime, eventDomain[0], eventDomain[1] - eventDomain[0]);

    const layerProps = {
      stroked: this.config.visConfig.outline,
      filled: this.config.visConfig.filled,
      lineWidthScale: this.config.visConfig.thickness,
      billboard: this.config.visConfig.billboard,
      radiusScale,
      ...(this.config.visConfig.fixedRadius ? {} : {radiusMaxPixels: 500})
    };

    const visualChannelUpdateTriggers = this.getVisualChannelUpdateTriggers(opts);
    const opacityField: Field | undefined = layerProps.filled ? data.fillOpacityField : undefined;
    const getFillColor = opacityField
      ? this.getFillOpacityAccessor(
          'fill',
          opacityField,
          data.getFillColor ?? this.config.color,
          data.fillOpacityDomain
        )
      : data.getFillColor;
    if (opacityField) {
      visualChannelUpdateTriggers.getFillColor = {
        ...visualChannelUpdateTriggers.getFillColor,
        opacityField,
        opacityDomain: data.fillOpacityDomain,
        opacityRange: this.config.visConfig.fillOpacityRange,
        opacityDataRevision: dataset?.dataRevision
      };
    } else {
      this.fillOpacityAccessors = undefined;
    }
    const updateTriggers = {
      getPosition: this.config.columns,
      getFilterValue: gpuFilter.filterValueUpdateTriggers,
      getFiltered: this.filteredIndexTrigger,
      ...visualChannelUpdateTriggers
    };

    const useArrowLayer = Boolean(this.geoArrowVector);

    const defaultLayerProps = this.getDefaultDeckLayerProps(opts);
    const brushingProps = this.getBrushingExtensionProps(interactionConfig);
    const getPixelOffset = getTextOffsetByRadius(
      radiusScale,
      data.getRadius,
      mapState,
      layerProps.radiusMaxPixels
    );
    const extensions = [
      ...defaultLayerProps.extensions,
      brushingExtension,
      ...(useArrowLayer ? [arrowCPUFilterExtension] : [])
    ];
    // Keep the mask off text glyphs and their collision pass.
    const pointExtensions = opacityField ? [...extensions, pointFillOpacityExtension] : extensions;

    const sharedProps = {
      getFilterValue: data.getFilterValue,
      extensions,
      filterRange: defaultLayerProps.filterRange,
      visible: defaultLayerProps.visible,
      ...brushingProps
    };
    const hoveredObject = this.hasHoveredObject(objectHovered);
    const {showNeighborOnHover, allowHover} = this.config.visConfig;
    let hoverData: ReturnType<typeof getNeighbors>;
    if (allowHover && showNeighborOnHover && hoveredObject && defaultLayerProps.visible) {
      // Arrow picking synthesizes a new object on each render. Compare its row and
      // coordinates instead of that object's identity. Positions are geographic;
      // pan/zoom only changes projection and radiusScale, not neighbor geometry.
      // Filters preserve neighbor membership; styling uses updateTriggers below.
      const dependencies = [
        dataset.dataContainer,
        dataset.dataRevision,
        this.config.columns,
        this.config.columnMode,
        hoveredObject.index,
        ...(hoveredObject.position || [])
      ];
      if (
        !this.neighborHoverCache ||
        dependencies.length !== this.neighborHoverCache.dependencies.length ||
        dependencies.some((value, index) => value !== this.neighborHoverCache?.dependencies[index])
      ) {
        this.neighborHoverCache = {
          dependencies,
          data: [
            ...getNeighbors(
              this.config.columns.neighbors,
              dataset.dataContainer,
              hoveredObject.index,
              this.getPositionAccessor(dataset.dataContainer)
            ),
            hoveredObject
          ]
        };
      }
      hoverData = this.neighborHoverCache.data;
    } else {
      // Split maps share this layer. A hidden pane must not evict the visible
      // pane's cache; source/config changes are checked when it renders again.
      if (!allowHover || !showNeighborOnHover || !hoveredObject || !this.config.isVisible) {
        this.neighborHoverCache = undefined;
      }
      hoverData = hoveredObject ? [hoveredObject] : [];
    }

    let ScatterplotLayerClass: typeof ScatterplotLayer | typeof GeoArrowScatterplotLayer =
      ScatterplotLayer;
    let deckLayerData = data.data;
    let getPosition = data.getPosition;
    if (useArrowLayer) {
      ScatterplotLayerClass = GeoArrowScatterplotLayer;
      deckLayerData = dataset.dataContainer.getTable();
      getPosition = this.geoArrowVector;
    }

    const {glowEnabled, glowExtent, glowStrength} = this.config.visConfig;
    const withGlow = (point: ScatterplotLayer<any, any> | GeoArrowScatterplotLayer<any>) => {
      if (!glowEnabled || (!point.props.filled && !point.props.stroked)) {
        return [point];
      }
      const colorAccessor = point.props.filled ? 'getFillColor' : 'getLineColor';
      return [
        point.clone({
          id: `${point.id}-glow`,
          pickable: false,
          // Only the core reports counts; removed halos must not leave stale count entries.
          onFilteredItemsChange: null,
          filled: true,
          getFillColor: point.props[colorAccessor],
          getLineColor: point.props[colorAccessor],
          updateTriggers: {
            ...point.props.updateTriggers,
            getFillColor: point.props.updateTriggers?.[colorAccessor],
            getLineColor: point.props.updateTriggers?.[colorAccessor]
          },
          // A transparent halo must not occlude other points at altitude.
          parameters: {...point.props.parameters, depthWriteEnabled: false},
          // Glow stays static even when the ordinary point pulses or ripples.
          extensions: [
            ...point.props.extensions.filter(extension => extension !== pulseRippleExtension),
            pointGlowExtension
          ],
          glowExtent,
          glowStrength
        }),
        point
      ];
    };

    return [
      ...withGlow(
        // @ts-expect-error
        new ScatterplotLayerClass({
          ...defaultLayerProps,
          ...brushingProps,
          ...layerProps,
          ...data,
          data: deckLayerData,
          getPosition,
          ...(opacityField ? {getFillColor} : {}),
          parameters: {
            // circles will be flat on the map when the altitude column is not used
            depthTest: (this.config.columns.altitude?.fieldIdx as number) > -1,
            ...(mapState?.layerParameters ?? {})
          },
          lineWidthUnits: 'pixels',
          updateTriggers,
          ...pulseProps,
          extensions: [...pointExtensions, ...(continuous ? [pulseRippleExtension] : [])],
          opacity: hoveredObject && showNeighborOnHover ? 0.2 : this.config.visConfig.opacity,
          pickable: allowHover,
          autoHighlight: false
        })
      ),
      ...(showEventOverlay
        ? [
            // @ts-expect-error Scatterplot and GeoArrow have different data signatures.
            new ScatterplotLayerClass({
              ...defaultLayerProps,
              ...brushingProps,
              ...layerProps,
              ...data,
              id: `${this.id}-event-pulse`,
              data: deckLayerData,
              getPosition,
              // Only the ordinary point reports counts and owns picking and text labels.
              onFilteredItemsChange: null,
              getFillColor:
                eventColorAccessor === 'getFillColor' ? getFillColor : data.getLineColor,
              pickable: false,
              autoHighlight: false,
              filled: true,
              stroked: false,
              pulseMode,
              pulseExpansion,
              pulseDurationMs,
              pulseCurrentTime:
                pulseCurrentTime !== null ? pulseCurrentTime - data.pulseTimeOrigin : null,
              extensions: [...pointExtensions, eventPulseRippleExtension],
              updateTriggers: {
                ...updateTriggers,
                getFillColor: updateTriggers[eventColorAccessor],
                getPulseStartTime: data.getPulseStartTime
              },
              parameters: {
                depthTest: (this.config.columns.altitude?.fieldIdx as number) > -1,
                ...(mapState?.layerParameters ?? {})
              }
            })
          ]
        : []),
      // hover layer
      ...(hoveredObject
        ? withGlow(
            new ScatterplotLayer({
              ...this.getDefaultHoverLayerProps(),
              ...layerProps,
              ...pulseProps,
              ...(continuous || opacityField
                ? {
                    extensions: [
                      ...(opacityField ? [pointFillOpacityExtension] : []),
                      ...(continuous ? [pulseRippleExtension] : [])
                    ]
                  }
                : {}),
              visible: defaultLayerProps.visible,
              data: hoverData,
              getLineColor: this.config.visConfig.showHighlightColor
                ? opts.ageStyleHighlightColor ?? this.config.highlightColor
                : data.getLineColor,
              getFillColor: this.config.visConfig.showHighlightColor
                ? opacityField
                  ? this.getFillOpacityAccessor(
                      'highlight',
                      opacityField,
                      opts.ageStyleHighlightColor ?? this.config.highlightColor,
                      data.fillOpacityDomain
                    )
                  : opts.ageStyleHighlightColor ?? this.config.highlightColor
                : getFillColor,
              getRadius: data.getRadius,
              getPosition: data.getPosition,
              updateTriggers: {
                getFillColor: this.config.visConfig.showHighlightColor
                  ? {
                      ...visualChannelUpdateTriggers.getFillColor,
                      highlight: this.config.highlightColor
                    }
                  : {...visualChannelUpdateTriggers.getFillColor, accessor: getFillColor},
                getLineColor: this.config.visConfig.showHighlightColor
                  ? {
                      ...visualChannelUpdateTriggers.getLineColor,
                      highlight: this.config.highlightColor
                    }
                  : {...visualChannelUpdateTriggers.getLineColor, accessor: data.getLineColor},
                getRadius: {...visualChannelUpdateTriggers.getRadius, accessor: data.getRadius}
              }
            })
          )
        : []),
      // text label layer
      ...this.renderTextLabelLayer(
        {
          getPosition,
          sharedProps,
          getPixelOffset,
          updateTriggers,
          getFiltered: data.getFiltered
        },
        this.geoArrowVector
          ? {
              ...opts,
              data: {...opts.data, getPosition}
            }
          : opts
      )
    ];
  }

  hasHoveredObject(objectInfo: {index: number}) {
    if (
      this.geoArrowVector &&
      isLayerHoveredFromArrow(objectInfo, this.id) &&
      objectInfo.index >= 0 &&
      this.dataContainer
    ) {
      if (this.config.columnMode === COLUMN_MODE_GEOJSON) {
        const coordinates = this.dataToFeature[objectInfo.index];
        if (!coordinates) return null;
        const position = Array.isArray(coordinates[0])
          ? (coordinates as number[][])[0]
          : coordinates;
        return {index: objectInfo.index, position};
      }
      return {
        index: objectInfo.index,
        position: this.getPositionAccessor(this.dataContainer)(objectInfo)
      };
    }

    return super.hasHoveredObject(objectInfo);
  }

  getHoverData(
    object: {index: number} | arrow.StructRow | undefined,
    dataContainer: DataContainerInterface,
    fields: Field[],
    animationConfig: AnimationConfig,
    hoverInfo: {index: number}
  ) {
    // for arrow format, `object` is the Arrow row object Proxy,
    // and index is passed in `hoverInfo`.
    const index = this.geoArrowVector ? hoverInfo?.index : (object as {index: number}).index;
    if (index >= 0) {
      return dataContainer.row(index);
    }
    return null;
  }
}
