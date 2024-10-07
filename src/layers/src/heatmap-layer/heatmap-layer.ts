// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {createSelector} from 'reselect';
import memoize from 'lodash.memoize';
import {CHANNEL_SCALES, SCALE_FUNC, ALL_FIELD_TYPES, ColorRange} from '@kepler.gl/constants';
import MapboxGLLayer, {MapboxLayerGLConfig} from '../mapboxgl-layer';
import HeatmapLayerIcon from './heatmap-layer-icon';
import {LayerBaseConfigPartial, LayerWeightConfig, VisualChannels} from '../base-layer';
import {getGeoPointFields} from '../layer-utils';
import {
  VisConfigColorRange,
  VisConfigNumber,
  HexColor,
  Merge,
  LayerColumn,
  RGBColor
} from '@kepler.gl/types';
import {hexToRgb, DataContainerInterface} from '@kepler.gl/utils';
import {KeplerTable} from '@kepler.gl/table';

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
  ({lat, lng, geoarrow}: HeatmapLayerColumnsConfig, columnMode) =>
  (dc: DataContainerInterface) =>
  d => {
    if (columnMode === COLUMN_MODE_POINTS) {
      return [dc.valueAt(d.index, lng.fieldIdx), dc.valueAt(d.index, lat.fieldIdx)];
    }

    // COLUMN_MODE_GEOARROW
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
    key: COLUMN_MODE_GEOARROW,
    label: 'Geoarrow',
    requiredColumns: geoarrowRequiredColumns
  },
  {
    key: COLUMN_MODE_POINTS,
    label: 'Points',
    requiredColumns: pointRequiredColumns
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

  getPosition: (config: HeatmapLayerColumnsConfig, columnMode?: string) => any;

  dataContainer: DataContainerInterface | null = null;
  filteredIndex: Uint8ClampedArray | null = null;
  filteredIndexTrigger: number[] = [];

  constructor(props) {
    super(props);
    this.registerVisConfig(heatmapVisConfigs);
    this.getPosition = memoize(pointPosAccessor, pointColResolver);
  }

  get type(): 'heatmap' {
    return 'heatmap';
  }

  get supportedColumnModes() {
    return SUPPORTED_COLUMN_MODES;
  }

  hasAllColumns() {
    const {columns} = this.config;
    if (this.config.columnMode === COLUMN_MODE_GEOARROW) {
      return this.hasColumnValue(columns.geoarrow);
    }
    return super.hasAllColumns();
  }

  static findDefaultLayerProps(
    dataset: KeplerTable,
    foundLayers?: any[]
  ): {
    props: {color?: RGBColor; columns: HeatmapLayerColumnsConfig; label: string}[];
  } {
    const {fields} = dataset;

    // TODO move this to field pairs logic, to create a field pair from a single column
    const geoArrowLineFields = getGeoPointFields(fields);

    if (geoArrowLineFields.length > 0) {
      const props: {columns: HeatmapLayerColumnsConfig; label: string; isVisible: boolean} = {
        // @ts-expect-error fill not required columns with default columns
        columns: {
          geoarrow: {
            fieldIdx: geoArrowLineFields[0].fieldIdx,
            value: geoArrowLineFields[0].displayName
          }
        },
        label: `${geoArrowLineFields[0].displayName} heatmap`,
        isVisible: true
      };

      return {props: [props]};
    }

    return super.findDefaultLayerProps(dataset, foundLayers);
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
    const defaultLayerConfig = super.getDefaultLayerConfig(props ?? {});

    let defaultColumnMode = DEFAULT_COLUMN_MODE;
    if (props.columns?.geoarrow) {
      defaultColumnMode = COLUMN_MODE_GEOARROW;
    }

    // mapbox heatmap layer color is always based on density
    // no need to set colorField, colorDomain and colorScale

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {colorField, colorDomain, colorScale, ...layerConfig} = {
      ...defaultLayerConfig,
      columnMode: props?.columnMode ?? defaultColumnMode,

      weightField: null,
      weightDomain: [0, 1],
      weightScale: 'linear'
    };

    // @ts-expect-error
    return layerConfig;
  }

  getPositionAccessor(dataContainer) {
    return this.getPosition(this.config.columns, this.config.columnMode)(dataContainer);
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
