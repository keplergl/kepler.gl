// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {createSelector} from 'reselect';
import {CHANNEL_SCALES, SCALE_FUNC, ALL_FIELD_TYPES, ColorRange} from '@kepler.gl/constants';
import MapboxGLLayer, {MapboxLayerGLConfig} from '../mapboxgl-layer';
import HeatmapLayerIcon from './heatmap-layer-icon';
import {LayerBaseConfigPartial, LayerWeightConfig, VisualChannels} from '../base-layer';
import {VisConfigColorRange, VisConfigNumber, HexColor, Merge, LayerColumn} from '@kepler.gl/types';
import {hexToRgb, DataContainerInterface} from '@kepler.gl/utils';

export type HeatmapLayerVisConfigSettings = {
  opacity: VisConfigNumber;
  colorRange: VisConfigColorRange;
  radius: VisConfigNumber;
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
};

export type HeatmapLayerVisualChannelConfig = LayerWeightConfig;
export type HeatmapLayerConfig = Merge<
  MapboxLayerGLConfig,
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

export const heatmapVisConfigs: {
  opacity: 'opacity';
  colorRange: 'colorRange';
  radius: 'heatmapRadius';
} = {
  opacity: 'opacity',
  colorRange: 'colorRange',
  radius: 'heatmapRadius'
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

/**
 *
 * @param colorRange
 * @return [
 *  0, "rgba(33,102,172,0)",
 *  0.2, "rgb(103,169,207)",
 *  0.4, "rgb(209,229,240)",
 *  0.6, "rgb(253,219,199)",
 *  0.8, "rgb(239,138,98)",
 *  1, "rgb(178,24,43)"
 * ]
 */
const heatmapDensity = (colorRange: ColorRange): (string | number)[] => {
  const scaleFunction = SCALE_FUNC.quantize;

  const colors: HexColor[] = ['#000000', ...colorRange.colors];

  const scale = scaleFunction<HexColor>().domain([0, 1]).range(colors);

  const colorDensity = scale.range().reduce((bands: (string | number)[], level) => {
    const invert = scale.invertExtent(level);
    return [
      ...bands,
      invert[0], // first value in the range
      `rgb(${hexToRgb(level).join(',')})` // color
    ];
  }, []);
  colorDensity[1] = 'rgba(0,0,0,0)';
  return colorDensity;
};

class HeatmapLayer extends MapboxGLLayer {
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
          // COLUMN_MODE_POINTS
          return pointPosAccessor(this.config.columns)(dataContainer);
      }
    };
  }

  get type(): 'heatmap' {
    return 'heatmap';
  }

  get supportedColumnModes() {
    return SUPPORTED_COLUMN_MODES;
  }

  hasAllColumns() {
    const {columns, columnMode} = this.config;
    if (columnMode === COLUMN_MODE_GEOARROW) {
      return this.hasColumnValue(columns.geoarrow);
    }
    return super.hasAllColumns();
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
        // supportedFieldTypes can be determined by channelScaleType
        // or specified here
        defaultMeasure: 'property.density',
        supportedFieldTypes: [ALL_FIELD_TYPES.real, ALL_FIELD_TYPES.integer],
        channelScaleType: CHANNEL_SCALES.size
      }
    };
  }

  get layerIcon() {
    return HeatmapLayerIcon;
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
    // mapbox heatmap layer color is always based on density
    // no need to set colorField, colorDomain and colorScale

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

  updateLayerMeta(dataContainer) {
    const getPosition = this.getPositionAccessor(dataContainer);
    const bounds = this.getPointsBounds(dataContainer, getPosition);
    this.updateMeta({bounds});
  }

  columnsSelector = config => pointColResolver(config.columns, config.columnMode);
  visConfigSelector = config => config.visConfig;
  weightFieldSelector = config => (config.weightField ? config.weightField.name : null);
  weightDomainSelector = config => config.weightDomain;

  paintSelector = createSelector(
    this.visConfigSelector,
    this.weightFieldSelector,
    this.weightDomainSelector,
    (visConfig, weightField, weightDomain) => ({
      'heatmap-weight': weightField
        ? ['interpolate', ['linear'], ['get', weightField], weightDomain[0], 0, weightDomain[1], 1]
        : 1,
      'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, MAX_ZOOM_LEVEL, 3],
      'heatmap-color': [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        ...heatmapDensity(visConfig.colorRange)
      ],
      'heatmap-radius': [
        'interpolate',
        ['linear'],
        ['zoom'],
        0,
        2,
        MAX_ZOOM_LEVEL,
        visConfig.radius // radius
      ],
      'heatmap-opacity': visConfig.opacity
    })
  );

  computeHeatmapConfiguration = createSelector(
    this.sourceSelector,
    this.filterSelector,
    this.paintSelector,
    (source, filter, paint) => {
      return {
        type: 'heatmap',
        id: this.id,
        source,
        layout: {
          visibility: 'visible'
        },
        paint,
        ...(this.isValidFilter(filter) ? {filter} : {})
      };
    }
  );

  formatLayerData(datasets, oldLayerData) {
    if (this.config.dataId === null) {
      return {};
    }
    const {weightField} = this.config;
    const {dataContainer} = datasets[this.config.dataId];
    const getPosition = this.getPositionAccessor(dataContainer);
    const {data} = this.updateData(datasets, oldLayerData);

    // @ts-ignore
    const newConfig = this.computeHeatmapConfiguration(this.config, datasets);
    newConfig.id = this.id;

    return {
      columns: this.config.columns,
      config: newConfig,
      data,
      weightField,
      getPosition
    };
  }
}

export default HeatmapLayer;
