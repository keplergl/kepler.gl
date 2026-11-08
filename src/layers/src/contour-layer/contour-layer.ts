// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {GeoJsonLayer} from '@deck.gl/layers';
import {PickingInfo} from '@deck.gl/core';
import {GL} from '@luma.gl/constants';
import {Matrix4} from '@math.gl/core';
import {createSelector} from 'reselect';
import {Datasets, KeplerTable} from '@kepler.gl/table';
import {RGBColor, VisConfigNumber} from '@kepler.gl/types';
import {
  colorPaletteToColorRange,
  DEFAULT_LAYER_COLOR_PALETTE_STEPS,
  KEPLER_COLOR_PALETTES,
  LAYER_VIS_CONFIGS
} from '@kepler.gl/constants';
import {colorMaybeToRGB, DataContainerInterface} from '@kepler.gl/utils';
import Layer, {LayerBaseConfigPartial} from '../base-layer';
import {getFilterDataFunc} from '../aggregation-layer';
import {getCentroidFromGeometry, parseGeoJsonRawFeature} from '../geojson-layer/geojson-utils';
import ContourLayerIcon from './contour-layer-icon';
import {
  buildContourGrid,
  ContourFeature,
  generateContours,
  ScalarGrid,
  ScalarSample,
  smoothScalarGrid
} from './contour-utils';
import {buildContourSurface} from './contour-surface';
import ContourSurfaceLayer from './deck-contour-surface-layer';

type ContourLayerData = {data: ContourFeature[]; grid?: ScalarGrid | null};

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
  colorRange: {
    ...LAYER_VIS_CONFIGS.colorRange,
    defaultValue: colorPaletteToColorRange(KEPLER_COLOR_PALETTES[0], {
      steps: DEFAULT_LAYER_COLOR_PALETTE_STEPS,
      reversed: false
    })
  },
  colorByLevel: {
    type: 'boolean',
    property: 'colorByLevel',
    defaultValue: true,
    label: 'layerVisConfigs.contour.colorByLevel'
  },
  gridResolution: {
    ...numberConfig('gridResolution', 64, [32, 256], 16),
    description: 'layerVisConfigs.contour.gridResolutionDescription'
  },
  levels: numberConfig('levels', 7, [2, 20], 1),
  smoothing: {
    ...numberConfig('smoothing', 3, [0, 6], 0.25),
    description: 'layerVisConfigs.contour.smoothingDescription'
  },
  fillOpacity: numberConfig('fillOpacity', 0.3, [0, 1], 0.005),
  thickness: numberConfig('thickness', 1.5, [0.5, 5], 0.1),
  enable3d: {
    ...LAYER_VIS_CONFIGS.enable3d,
    label: 'layerVisConfigs.contour.enable3d',
    description: 'layerVisConfigs.contour.enable3dDescription'
  },
  elevationScale: {
    ...LAYER_VIS_CONFIGS.elevationScale,
    defaultValue: 1,
    range: [0, 10],
    step: 0.1,
    label: 'layerVisConfigs.contour.elevationScale',
    description: 'layerVisConfigs.contour.elevationScaleDescription'
  },
  filled: {...LAYER_VIS_CONFIGS.filled, defaultValue: true},
  stroked: 'stroked',
  below: {
    type: 'boolean',
    property: 'below',
    // Keep the saved setting for older maps; new contours enclose peaks.
    defaultValue: false,
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
  private getSurface = createSelector(
    (data: ContourLayerData) => data,
    data => {
      const surface = buildContourSurface(data.grid || null, data.data);
      return {...surface, depth: surface.fills.slice(0, 1)};
    }
  );

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
    return {lat: 'contour.lat', lng: 'contour.lng', value: 'contour.weight'};
  }
  get supportedColumnModes() {
    return [
      {key: 'grid', label: 'Points', requiredColumns: ['lat', 'lng'], optionalColumns: ['value']},
      {key: 'geojson', label: 'GeoJSON', requiredColumns: ['geojson'], optionalColumns: ['value']}
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
      'stroked',
      'enable3d',
      'elevationScale'
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

  formatLayerData(datasets: Datasets): ContourLayerData {
    this.errorMessage = null;
    this.updateMeta({contourLevels: [], contourDomain: null, bounds: undefined});
    const dataset = this.config.dataId ? datasets[this.config.dataId] : null;
    if (!dataset || !this.hasAllColumns()) return {data: []};
    const {dataContainer, gpuFilter, filteredIndex, filteredIndexByLayer} = dataset;
    const {value} = this.config.columns;
    const weighted = Boolean(value.value);
    const weightField = value.value ? dataset.getColumnField(value.value) : null;
    if (weighted && (!weightField || !['integer', 'real'].includes(weightField.type))) {
      throw new Error('Select a numeric contour weight column, or clear it to use point density.');
    }
    const getPosition = this.getPositionAccessor(dataContainer, dataset);
    const selected = new Set(filteredIndexByLayer?.[this.id] ?? filteredIndex);
    const activeFilter =
      gpuFilter &&
      Object.values(gpuFilter.filterValueUpdateTriggers).some(trigger => trigger !== null);
    const matches = activeFilter
      ? getFilterDataFunc(gpuFilter.filterRange, gpuFilter.filterValueAccessor(dataContainer)())
      : null;
    const samples: ScalarSample[] = [];
    for (const index of selected) {
      if (matches && !matches({index})) continue;
      const position = getPosition({index});
      if (!position) continue;
      samples.push({
        longitude: position[0],
        latitude: position[1],
        value: weightField ? weightField.valueAccessor({index}) : 1
      });
    }
    // Let calculateLayerData retain validation errors and manage invalid/recovered state.
    const grid = buildContourGrid(
      samples,
      this.config.visConfig.gridResolution,
      weighted ? 'MEAN' : 'COUNT'
    );
    if (grid) {
      let minimum = Infinity;
      let maximum = -Infinity;
      for (const value of grid.values) {
        minimum = Math.min(minimum, value);
        maximum = Math.max(maximum, value);
      }
      this.updateMeta({
        contourDomain: [minimum, maximum],
        bounds: [
          grid.longitude,
          grid.latitude,
          grid.longitude + (grid.width - 1) * grid.stepLng,
          grid.latitude + (grid.height - 1) * grid.stepLat
        ]
      });
    }
    const {smoothing, levels, below, customRange, minimum, maximum} = this.config.visConfig;
    const smoothedGrid = grid && {...grid, values: smoothScalarGrid(grid, smoothing)};
    const data = generateContours(smoothedGrid, {
      smoothing: 0,
      levels,
      below,
      domain: customRange ? [minimum, maximum] : undefined
    });
    this.updateMeta({contourLevels: data.map(feature => feature.properties)});
    return {data, grid: smoothedGrid};
  }

  getHoverData(object: ContourFeature | null) {
    if (!object) return null;
    const {threshold, below} = object.properties;
    const field = String(this.config.columns.value.value || 'Point count');
    return {
      fieldValues: [
        {
          labelMessage: this.config.columns.value.value
            ? 'columns.contour.value'
            : 'columns.contour.density',
          value: `${field} ${below ? '≤' : '≥'} ${threshold}`
        }
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
    const surface = visConfig.enable3d ? this.getSurface(data) : null;
    const elevationScale = Number.isFinite(visConfig.elevationScale)
      ? Math.max(0, visConfig.elevationScale)
      : 1;
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
      // Composite nested fills on the same surface, then draw their outlines.
      parameters: {...defaultProps.parameters, depthMask: false},
      autoHighlight: false,
      extruded: false,
      ...(surface ? {modelMatrix: new Matrix4().scale([1, 1, elevationScale])} : {})
    };
    return [
      // Resolve the visible surface before compositing the same translucent,
      // nested fills as 2D. This prevents the back of a hill showing through it.
      ...(surface && visConfig.filled && visConfig.fillOpacity > 0
        ? [
            new GeoJsonLayer<ContourFeature['properties']>({
              ...shared,
              id: `${this.id}-surface-depth`,
              data: surface.depth,
              filled: true,
              stroked: false,
              pickable: false,
              getFillColor: [0, 0, 0, 255],
              getPolygonOffset: () => [1, 1],
              parameters: {
                ...defaultProps.parameters,
                depthMask: true,
                // Per-layer WebGL masks require RGBA booleans, not a render-pass bitmask.
                [GL.COLOR_WRITEMASK]: [false, false, false, false]
              }
            })
          ]
        : []),
      ...(visConfig.filled
        ? [
            new GeoJsonLayer<ContourFeature['properties']>({
              ...shared,
              id: `${this.id}-fill`,
              data: surface ? surface.fills : data.data,
              ...(surface
                ? {
                    getPolygonOffset: () => [0, 0],
                    _subLayerProps: {'polygons-fill': {type: ContourSurfaceLayer}}
                  }
                : {}),
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
              data: surface ? surface.outlines : data.data,
              ...(surface ? {getPolygonOffset: () => [-1, -1]} : {}),
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
