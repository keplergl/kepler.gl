// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import KeplerHeatmapLayer from './deck-heatmap-layer';
import {CHANNEL_SCALES, ALL_FIELD_TYPES, GEOJSON_FIELDS} from '@kepler.gl/constants';
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
import {DATA_TYPES} from 'type-analyzer';
import booleanWithin from '@turf/boolean-within';
import {point as turfPoint} from '@turf/helpers';
import {Feature, Polygon} from 'geojson';

import {getGeoArrowPointLayerProps, FindDefaultLayerPropsReturnValue} from '../layer-utils';
import {getFilterDataFunc} from '../aggregation-layer';
import {parseGeoJsonRawFeature} from '../geojson-layer/geojson-utils';

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

  // COLUMN_MODE_GEOJSON
  geojson: LayerColumn;
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

export const geojsonAccessor =
  ({geojson}: HeatmapLayerColumnsConfig) =>
  (dc: DataContainerInterface) =>
  (d: {index: number}) =>
    dc.valueAt(d.index, geojson.fieldIdx);

/**
 * Compute the centroid [lng, lat] of a GeoJSON geometry.
 * For Point returns the coordinate directly; for complex geometries
 * averages all vertex positions into a single representative point.
 */
function getCentroidFromGeometry(geometry: any): number[] | null {
  if (!geometry) return null;
  const positions = getAllPositions(geometry);
  if (positions.length === 0) return null;
  if (positions.length === 1) return positions[0];

  let sumLng = 0;
  let sumLat = 0;
  let count = 0;
  for (const pos of positions) {
    if (Number.isFinite(pos[0]) && Number.isFinite(pos[1])) {
      sumLng += pos[0];
      sumLat += pos[1];
      count++;
    }
  }
  return count > 0 ? [sumLng / count, sumLat / count] : null;
}

/**
 * Extract all vertex [lng, lat] coordinates from a GeoJSON geometry.
 * Used internally for bounds computation and centroid calculation.
 */
function getAllPositions(geometry: any): number[][] {
  if (!geometry) return [];
  switch (geometry.type) {
    case 'Point':
      return [geometry.coordinates];
    case 'MultiPoint':
    case 'LineString':
      return geometry.coordinates;
    case 'MultiLineString':
    case 'Polygon':
      return geometry.coordinates.flat();
    case 'MultiPolygon':
      return geometry.coordinates.flat(2);
    case 'GeometryCollection':
      return (geometry.geometries || []).flatMap(getAllPositions);
    default:
      return [];
  }
}

export const pointColResolver = (
  {lat, lng, geoarrow, geojson}: HeatmapLayerColumnsConfig,
  columnMode
) => {
  if (columnMode === COLUMN_MODE_POINTS) {
    return `${lat.fieldIdx}-${lng.fieldIdx}`;
  }
  if (columnMode === COLUMN_MODE_GEOJSON) {
    return `geojson-${geojson.fieldIdx}`;
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
export const geojsonRequiredColumns = ['geojson'];

export const COLUMN_MODE_POINTS = 'points';
export const COLUMN_MODE_GEOARROW = 'geoarrow';
export const COLUMN_MODE_GEOJSON = 'geojson';

const SUPPORTED_ANALYZER_TYPES = {
  [DATA_TYPES.GEOMETRY]: true,
  [DATA_TYPES.GEOMETRY_FROM_STRING]: true,
  [DATA_TYPES.PAIR_GEOMETRY_FROM_STRING]: true
};

const SUPPORTED_COLUMN_MODES = [
  {
    key: COLUMN_MODE_POINTS,
    label: 'Points',
    requiredColumns: pointRequiredColumns
  },
  {
    key: COLUMN_MODE_GEOJSON,
    label: 'GeoJSON',
    requiredColumns: geojsonRequiredColumns
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

  dataToFeature: any[] = [];
  centroids: Array<number[] | null> = [];
  private _geojsonFieldIdx = -1;
  private _geojsonBounds: [number, number, number, number] | null = null;

  constructor(props) {
    super(props);
    this.registerVisConfig(heatmapVisConfigs);

    this.getPositionAccessor = (dataContainer: DataContainerInterface) => {
      switch (this.config.columnMode) {
        case COLUMN_MODE_GEOARROW:
          return geoarrowPosAccessor(this.config.columns)(dataContainer);
        case COLUMN_MODE_GEOJSON:
          return geojsonAccessor(this.config.columns)(dataContainer);
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
    return [
      ...super.noneLayerDataAffectingProps,
      'colorRange',
      'radius',
      'intensity',
      'threshold',
      'aggregation'
    ];
  }

  hasAllColumns() {
    const {columns, columnMode} = this.config;
    if (columnMode === COLUMN_MODE_GEOARROW) {
      return this.hasColumnValue(columns.geoarrow);
    }
    if (columnMode === COLUMN_MODE_GEOJSON) {
      return this.hasColumnValue(columns.geojson);
    }
    return super.hasAllColumns();
  }

  static findDefaultLayerProps(dataset: KeplerTable): FindDefaultLayerPropsReturnValue {
    const altProps = getGeoArrowPointLayerProps(dataset);

    const geojsonColumns = dataset.fields
      .filter(
        f =>
          (f.type === 'geojson' || f.type === 'geoarrow') &&
          f.analyzerType &&
          SUPPORTED_ANALYZER_TYPES[f.analyzerType]
      )
      .map(f => f.name);

    const defaultColumns = {
      geojson: [...(GEOJSON_FIELDS.geojson || []), ...geojsonColumns]
    };
    const foundColumns = this.findDefaultColumnField(defaultColumns, dataset.fields);

    if (foundColumns?.length) {
      const {label} = dataset;
      altProps.push(
        ...foundColumns.map(columns => ({
          label: (typeof label === 'string' && label.replace(/\.[^/.]+$/, '')) || 'heatmap',
          columns,
          columnMode: COLUMN_MODE_GEOJSON
        }))
      );
    }

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

  isInPolygon(data: DataContainerInterface, index: number, polygon: Feature<Polygon>): boolean {
    if (this.centroids.length === 0 || !this.centroids[index]) {
      return false;
    }
    const point = this.centroids[index];
    if (!point) return false;
    const isRectangleSearchBox = polygon.properties?.shape === 'Rectangle';
    if (isRectangleSearchBox && polygon.properties?.bbox) {
      const [minX, minY, maxX, maxY] = polygon.properties.bbox;
      return point[0] >= minX && point[0] <= maxX && point[1] >= minY && point[1] <= maxY;
    }
    return booleanWithin(turfPoint(point), polygon);
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

  getDataUpdateTriggers(dataset: KeplerTable): any {
    const triggers = super.getDataUpdateTriggers(dataset);
    const {columnMode} = this.config;
    return {
      ...triggers,
      getData: {...triggers.getData, columnMode},
      getMeta: {...triggers.getMeta, columnMode}
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

    if (this.config.columnMode === COLUMN_MODE_GEOJSON) {
      const getFeature = this.getPositionAccessor(dataContainer);
      this._buildGeojsonDataToFeature(dataContainer, getFeature);
      this.updateMeta({bounds: this._geojsonBounds});
    } else {
      this.dataToFeature = [];
      this.centroids = [];
      const getPosition = this.getPositionAccessor(dataContainer);
      const bounds = this.getPointsBounds(dataContainer, getPosition);
      this.updateMeta({bounds});
    }
  }

  /**
   * Parse raw GeoJSON values into Feature objects and store them.
   * Re-parses when the data container size changes (new data load or column switch).
   */
  private _buildGeojsonDataToFeature(dataContainer: DataContainerInterface, getFeature: any) {
    const fieldIdx = this.config.columns.geojson.fieldIdx;
    if (
      this.dataToFeature.length === dataContainer.numRows() &&
      this._geojsonFieldIdx === fieldIdx
    ) {
      return;
    }
    this._geojsonFieldIdx = fieldIdx;
    this.dataToFeature = [];
    this.centroids = [];

    let minLng = Infinity;
    let maxLng = -Infinity;
    let minLat = Infinity;
    let maxLat = -Infinity;
    let hasValid = false;

    for (let i = 0; i < dataContainer.numRows(); i++) {
      const rawFeature = getFeature({index: i});
      const feature = parseGeoJsonRawFeature(rawFeature);
      this.dataToFeature[i] = feature;
      this.centroids[i] = feature?.geometry ? getCentroidFromGeometry(feature.geometry) : null;

      if (feature?.geometry) {
        const positions = getAllPositions(feature.geometry);
        for (const pos of positions) {
          const lng = pos[0];
          const lat = pos[1];
          if (Number.isFinite(lng) && Number.isFinite(lat)) {
            hasValid = true;
            if (lng < minLng) minLng = lng;
            if (lng > maxLng) maxLng = lng;
            if (lat < minLat) minLat = lat;
            if (lat > maxLat) maxLat = lat;
          }
        }
      }
    }

    this._geojsonBounds = hasValid ? [minLng, minLat, maxLng, maxLat] : null;
  }

  calculateDataAttribute({filteredIndex}: KeplerTable, getPosition) {
    if (this.config.columnMode === COLUMN_MODE_GEOJSON) {
      return this._calculateGeojsonDataAttribute(filteredIndex);
    }

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

  /**
   * For GeoJSON mode, compute the centroid of each feature's geometry
   * and emit a single heatmap data entry per feature.
   */
  private _calculateGeojsonDataAttribute(filteredIndex: number[]) {
    const data: {index: number; position: number[]}[] = [];

    for (let i = 0; i < filteredIndex.length; i++) {
      const index = filteredIndex[i];
      const feature = this.dataToFeature[index];
      if (!feature?.geometry) continue;

      const centroid = getCentroidFromGeometry(feature.geometry);
      if (centroid) {
        data.push({index, position: centroid});
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

    const oldData = oldLayerData as any;
    const baseOldLayerData = oldData?._unfiltered
      ? {...oldData, data: oldData._unfiltered}
      : oldLayerData;

    const {data = []} = this.updateData(datasets, baseOldLayerData);

    const isGeojsonMode = this.config.columnMode === COLUMN_MODE_GEOJSON;

    const getPosition = isGeojsonMode
      ? (d: {position: number[]}) => d.position
      : this.getPositionAccessor(dataContainer);

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

    // HeatmapLayer doesn't work with GlobeView
    if (mapState.globe?.enabled) {
      return [];
    }

    const {_unfiltered, ...deckData} = data;

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
      getPosition: {columns: this.config.columns, columnMode: this.config.columnMode},
      getWeight: {
        weightField: this.config.weightField
      }
    };

    return [
      new KeplerHeatmapLayer({
        ...defaultLayerProps,
        ...deckData,
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
