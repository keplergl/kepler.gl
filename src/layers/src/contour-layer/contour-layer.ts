// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {GeoJsonLayer} from '@deck.gl/layers';
import {PickingInfo} from '@deck.gl/core';
import {Datasets, KeplerTable} from '@kepler.gl/table';
import {RGBColor, VisConfigNumber} from '@kepler.gl/types';
import {LAYER_VIS_CONFIGS} from '@kepler.gl/constants';
import {colorMaybeToRGB, DataContainerInterface} from '@kepler.gl/utils';
import Layer, {LayerBaseConfigPartial} from '../base-layer';
import {getFilterDataFunc} from '../aggregation-layer';
import {getCentroidFromGeometry, parseGeoJsonRawFeature} from '../geojson-layer/geojson-utils';
import ContourLayerIcon from './contour-layer-icon';
import {buildContourGrid, ContourFeature, generateContours, ScalarSample} from './contour-utils';

const numberConfig = (
  property: string,
  defaultValue: number,
  range: [number, number],
  step: number
): VisConfigNumber => ({
  type: 'number',
  property,
  defaultValue,
  range,
  step,
  isRanged: false,
  group: 'contour',
  label: `layerVisConfigs.contour.${property}`
});

export const contourVisConfigs = {
  opacity: 'opacity',
  colorRange: 'colorRange',
  colorByLevel: {
    type: 'boolean',
    property: 'colorByLevel',
    defaultValue: false,
    label: 'layerVisConfigs.contour.colorByLevel'
  },
  inputMode: {
    type: 'select',
    property: 'inputMode',
    defaultValue: 'auto',
    label: 'layerVisConfigs.contour.inputMode',
    options: ['auto', 'grid', 'points']
  },
  interpolationResolution: {
    ...numberConfig('interpolationResolution', 192, [32, 256], 16),
    description: 'layerVisConfigs.contour.interpolationResolutionDescription'
  },
  levels: numberConfig('levels', 7, [2, 20], 1),
  smoothing: {
    ...numberConfig('smoothing', 1.5, [0, 6], 0.25),
    description: 'layerVisConfigs.contour.smoothingDescription'
  },
  fillOpacity: numberConfig('fillOpacity', 0.075, [0, 0.3], 0.005),
  thickness: numberConfig('thickness', 1.5, [0.5, 5], 0.1),
  filled: {...LAYER_VIS_CONFIGS.filled, defaultValue: true},
  stroked: 'stroked',
  below: {
    type: 'boolean',
    property: 'below',
    defaultValue: true,
    label: 'layerVisConfigs.contour.below'
  },
  customRange: {
    type: 'boolean',
    property: 'customRange',
    defaultValue: false,
    label: 'layerVisConfigs.contour.customRange'
  },
  minimum: {...numberConfig('minimum', 0, [-100, 100], 0.1), allowCustomValue: true},
  maximum: {...numberConfig('maximum', 100, [-100, 100], 0.1), allowCustomValue: true}
};

export default class ContourLayer extends Layer {
  constructor(props) {
    super(props);
    this.registerVisConfig(contourVisConfigs);
  }

  get type() {
    return 'contour';
  }
  get name() {
    return 'Contour';
  }
  get layerIcon() {
    return ContourLayerIcon;
  }
  get isAggregated() {
    return true;
  }
  get visualChannels() {
    return {};
  }
  getContourLegend(): Array<
    ContourFeature['properties'] & {color: [number, number, number, number]}
  > {
    const {filled, stroked} = this.config.visConfig;
    if (!filled && !stroked) return [];
    const levels: ContourFeature['properties'][] = this.meta.contourLevels || [];
    const colors = this.getContourColors(levels.length);
    return levels
      .map(level => ({
        ...level,
        color: this.getContourLevelColor(level.rank, colors, stroked)
      }))
      .sort((a, b) => a.threshold - b.threshold);
  }

  private getContourColors(count: number): RGBColor[] {
    const {color, visConfig} = this.config;
    const palette =
      visConfig.colorByLevel && Array.isArray(visConfig.colorRange?.colors)
        ? visConfig.colorRange.colors
            .map(colorMaybeToRGB)
            .filter((value): value is RGBColor => value !== null)
        : [];
    return Array.from({length: count}, (_, rank) => {
      if (!palette.length) return color;
      // Geometry is ordered outside-in. Keep the palette in low-to-high value order
      // regardless of the threshold direction, interpolating to the level count.
      const index = visConfig.below ? count - 1 - rank : rank;
      const position = (index / Math.max(1, count - 1)) * (palette.length - 1);
      const start = Math.floor(position);
      const fraction = position - start;
      const first = palette[start];
      const second = palette[Math.min(start + 1, palette.length - 1)];
      return first.map((value, channel) =>
        Math.round(value + (second[channel] - value) * fraction)
      ) as RGBColor;
    });
  }

  private getContourLevelColor(
    rank: number,
    colors: RGBColor[],
    outlined: boolean
  ): [number, number, number, number] {
    if (outlined) {
      const alpha = 0.3 + (0.7 * rank) / Math.max(1, colors.length - 1);
      return [...colors[rank], Math.round(255 * alpha)];
    }
    // Fill-only swatches composite every enclosing region in draw order, using
    // the renderer's byte-rounded alpha, so nested palette colors also match.
    const fillAlpha = Math.round(255 * this.config.visConfig.fillOpacity) / 255;
    const alpha = 1 - (1 - fillAlpha) ** (rank + 1);
    if (!alpha) return [...colors[rank], 0];
    const blended: RGBColor = [0, 0, 0];
    for (let index = 0; index <= rank; index++) {
      for (let channel = 0; channel < 3; channel++) {
        blended[channel] = colors[index][channel] * fillAlpha + blended[channel] * (1 - fillAlpha);
      }
    }
    return [
      ...(blended.map(value => Math.round(value / alpha)) as RGBColor),
      Math.round(255 * alpha)
    ];
  }

  updateColorRangeByColorUI(newConfig, previous, prop) {
    const previousRange = this.config.visConfig.colorRange;
    super.updateColorRangeByColorUI(newConfig, previous, prop);
    if (
      prop === 'colorRange' &&
      this.config.visConfig.colorRange !== previousRange &&
      previousRange.colorLegends
    ) {
      // Contour labels are keyed by threshold, unlike the standard color-keyed labels.
      this.updateLayerVisConfig({
        colorRange: {
          ...this.config.visConfig.colorRange,
          colorLegends: previousRange.colorLegends
        }
      });
    }
  }
  get columnPairs() {
    return this.defaultPointColumnPairs;
  }
  get columnLabels() {
    return {lat: 'contour.lat', lng: 'contour.lng', value: 'contour.value'};
  }
  get supportedColumnModes() {
    return [
      {key: 'grid', label: 'Scalar samples', requiredColumns: ['lat', 'lng', 'value']},
      {key: 'geojson', label: 'GeoJSON', requiredColumns: ['geojson', 'value']}
    ];
  }
  get noneLayerDataAffectingProps() {
    return [
      ...super.noneLayerDataAffectingProps,
      'color',
      'colorRange',
      'colorByLevel',
      'fillOpacity',
      'filled',
      'stroked'
    ];
  }
  getDefaultLayerConfig(props: LayerBaseConfigPartial) {
    return {...super.getDefaultLayerConfig(props), color: props.color ?? [36, 218, 211]};
  }

  getPositionAccessor(dataContainer?: DataContainerInterface, dataset?: KeplerTable) {
    if (!dataContainer || !this.hasAllColumns()) return () => null;
    const {lat, lng, geojson} = this.config.columns;
    if (this.config.columnMode === 'geojson') {
      const geoArrowEncoding = (
        dataset?.fields[geojson.fieldIdx] ?? dataContainer.getField?.(geojson.fieldIdx)
      )?.metadata?.get('ARROW:extension:name');
      return ({index}: {index: number}) => {
        try {
          const feature = parseGeoJsonRawFeature(
            dataContainer.valueAt(index, geojson.fieldIdx),
            geoArrowEncoding
          );
          // Use the same representative point for polygon filtering and contour generation.
          return getCentroidFromGeometry(feature?.geometry);
        } catch {
          return null;
        }
      };
    }
    return (data: {index: number}) =>
      [lng, lat].map(({fieldIdx}) => {
        const value = dataset
          ? dataset.fields[fieldIdx].valueAccessor(data)
          : dataContainer.valueAt(data.index, fieldIdx);
        // Polygon filtering receives only the container, whose Arrow coordinates may be BigInt.
        return typeof value === 'bigint' ? Number(value) : value;
      });
  }

  formatLayerData(datasets: Datasets): {data: ContourFeature[]} {
    this.errorMessage = null;
    this.updateMeta({contourLevels: []});
    const dataset = this.config.dataId ? datasets[this.config.dataId] : null;
    if (!dataset || !this.hasAllColumns()) return {data: []};
    const {dataContainer, gpuFilter, filteredIndex, filteredIndexByLayer} = dataset;
    const {value} = this.config.columns;
    const getPosition = this.getPositionAccessor(dataContainer, dataset);
    const selected = new Set(filteredIndexByLayer?.[this.id] ?? filteredIndex);
    const activeFilter =
      gpuFilter &&
      Object.values(gpuFilter.filterValueUpdateTriggers).some(trigger => trigger !== null);
    const matches = activeFilter
      ? getFilterDataFunc(gpuFilter.filterRange, gpuFilter.filterValueAccessor(dataContainer)())
      : null;
    const samples: ScalarSample[] = [];
    for (let index = 0; index < dataContainer.numRows(); index++) {
      const position = getPosition({index});
      if (!position) continue;
      // Keep the source lattice even when filters remove an entire row/column.
      samples.push({
        longitude: position[0],
        latitude: position[1],
        value:
          selected.has(index) && (!matches || matches({index}))
            ? dataset.fields[value.fieldIdx].valueAccessor({index})
            : null
      });
    }
    // Let calculateLayerData retain validation errors and manage invalid/recovered state.
    const grid = buildContourGrid(
      samples,
      this.config.visConfig.inputMode,
      this.config.visConfig.interpolationResolution
    );
    if (grid)
      this.updateMeta({
        bounds: [
          grid.longitude,
          grid.latitude,
          grid.longitude + (grid.width - 1) * grid.stepLng,
          grid.latitude + (grid.height - 1) * grid.stepLat
        ]
      });
    const {smoothing, levels, below, customRange, minimum, maximum} = this.config.visConfig;
    const data = generateContours(grid, {
      smoothing,
      levels,
      below,
      domain: customRange ? [minimum, maximum] : undefined
    });
    this.updateMeta({contourLevels: data.map(feature => feature.properties)});
    return {data};
  }

  getHoverData(object: ContourFeature | null) {
    if (!object) return null;
    const {threshold, below} = object.properties;
    const field = String(this.config.columns.value.value || 'value');
    return {
      fieldValues: [
        {labelMessage: 'columns.contour.value', value: `${field} ${below ? '≤' : '≥'} ${threshold}`}
      ]
    };
  }

  isLayerHovered(objectInfo: PickingInfo): boolean {
    const id = objectInfo?.layer?.props?.id;
    return Boolean(
      objectInfo?.picked &&
        (id === this.id || id === `${this.id}-fill` || id === `${this.id}-outline`)
    );
  }

  renderLayer(opts) {
    const {data} = opts;
    if (!data?.data?.length || !this.config.isVisible || opts.visible === false) return [];
    const {color, visConfig} = this.config;
    const colors = this.getContourColors(data.data.length);
    const colorTriggers = [
      color,
      visConfig.colorByLevel,
      visConfig.colorRange,
      visConfig.below,
      data.data.length
    ];
    const defaultProps = this.getDefaultDeckLayerProps(opts);
    const shared = {
      ...defaultProps,
      data: data.data,
      extensions: [],
      // Both passes are coplanar; render fills first and outlines above all fills.
      parameters: {...defaultProps.parameters, depthMask: false},
      autoHighlight: false,
      extruded: false
    };
    return [
      ...(visConfig.filled
        ? [
            new GeoJsonLayer<ContourFeature['properties']>({
              ...shared,
              id: `${this.id}-fill`,
              filled: true,
              stroked: false,
              getFillColor: visConfig.colorByLevel
                ? feature => [
                    ...colors[feature.properties.rank],
                    Math.round(255 * visConfig.fillOpacity)
                  ]
                : [...color, Math.round(255 * visConfig.fillOpacity)],
              updateTriggers: {getFillColor: [...colorTriggers, visConfig.fillOpacity]}
            })
          ]
        : []),
      ...(visConfig.stroked
        ? [
            new GeoJsonLayer<ContourFeature['properties']>({
              ...shared,
              id: `${this.id}-outline`,
              filled: false,
              stroked: true,
              getLineColor: feature =>
                this.getContourLevelColor(feature.properties.rank, colors, true),
              getLineWidth: visConfig.thickness,
              lineWidthUnits: 'pixels',
              lineJointRounded: true,
              lineCapRounded: true,
              updateTriggers: {getLineColor: colorTriggers}
            })
          ]
        : [])
    ];
  }
}
