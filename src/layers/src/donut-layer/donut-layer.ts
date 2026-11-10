// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ScatterplotLayer, TextLayer} from '@deck.gl/layers';
import {DataFilterExtensionProps} from '@deck.gl/extensions';
import {createSelector} from 'reselect';
import {LAYER_VIS_CONFIGS, MAX_GPU_FILTERS} from '@kepler.gl/constants';
import {Datasets, GpuFilter, KeplerTable} from '@kepler.gl/table';
import {DataContainerInterface} from '@kepler.gl/utils';
import {Field} from '@kepler.gl/types';
import Layer from '../base-layer';
import {getFilterDataFunc} from '../aggregation-layer';
import {assignPointPairToLayerColumn} from '../layer-utils';
import DonutExtension, {DonutExtensionProps} from './donut-extension';
import DonutLayerIcon from './donut-layer-icon';
import {aggregateDonutPoints, DonutPoint, prepareDonutAggregation} from './donut-aggregation';
import {getDonutBoundaries, getDonutCategories, getDonutComposition} from './donut-utils';

type DonutLayerData = {
  data: DonutPoint[];
  getFilterValue?: (point: {index: number}) => (number | number[])[];
};
const donutExtension = new DonutExtension();
const unfilteredValues = Array(MAX_GPU_FILTERS).fill(0);
const getUnfilteredValue = () => unfilteredValues;
const totalFormatter = new Intl.NumberFormat('en', {notation: 'compact', maximumFractionDigits: 1});

export default class DonutLayer extends Layer {
  private aggregationSource = createSelector(
    [
      (data: DonutLayerData, _gpuFilter: GpuFilter) => data.data,
      (data: DonutLayerData) => data.getFilterValue,
      (_data: DonutLayerData, gpuFilter: GpuFilter) => gpuFilter.filterRange,
      (_data: DonutLayerData, gpuFilter: GpuFilter) => gpuFilter.filterValueUpdateTriggers
    ],
    (points, getFilterValue, filterRange, triggers) => {
      const hasFilter = Object.values(triggers).some(trigger => trigger !== null);
      return prepareDonutAggregation(
        hasFilter && getFilterValue
          ? points.filter(
              getFilterDataFunc(filterRange, point => getFilterValue(point as DonutPoint))
            )
          : points
      );
    }
  );

  private aggregate = createSelector(
    [
      (source: ReturnType<typeof prepareDonutAggregation>) => source,
      (_source, zoom: number) => Math.round(zoom),
      (_source, _zoom, size: number) => size
    ],
    aggregateDonutPoints
  );

  private renderablePoints = createSelector([(points: DonutPoint[]) => points], points =>
    points.filter(point => point.total !== 0)
  );

  constructor(props) {
    super(props);
    this.registerVisConfig({
      opacity: 'opacity',
      radius: {
        ...LAYER_VIS_CONFIGS.radius,
        defaultValue: 25,
        range: [4, 80],
        allowCustomValue: false
      },
      composition: {type: 'object', defaultValue: {categories: []}, property: 'composition'},
      clusterRadius: {
        ...LAYER_VIS_CONFIGS.clusterRadius,
        defaultValue: 90,
        allowCustomValue: false
      },
      showTotal: {
        type: 'boolean',
        defaultValue: false,
        property: 'showTotal',
        label: 'layerVisConfigs.donut.showTotal'
      }
    });
  }

  get type() {
    return 'donut';
  }
  get name() {
    return 'Donut';
  }
  get layerIcon() {
    return DonutLayerIcon;
  }
  get visualChannels() {
    return {};
  }
  get supportedColumnModes() {
    return [{key: 'points', label: 'Point Columns', requiredColumns: ['lat', 'lng']}];
  }
  get columnPairs() {
    return this.defaultPointColumnPairs;
  }

  static findDefaultLayerProps(dataset: KeplerTable) {
    return {
      props: [],
      altProps: (dataset.fieldPairs || []).map(pair => ({
        label: 'Donut',
        columns: assignPointPairToLayerColumn(pair, false),
        columnMode: 'points'
      }))
    };
  }

  getCategories() {
    return getDonutCategories(this.config.visConfig.composition);
  }

  getPositionAccessor(dataContainer?: DataContainerInterface) {
    if (!dataContainer || !this.hasAllColumns()) return () => [NaN, NaN];
    const {lng, lat} = this.config.columns;
    return ({index}: {index: number}) =>
      [lng, lat].map(({fieldIdx}) => {
        const value = dataContainer.valueAt(index, fieldIdx);
        return typeof value === 'bigint' ? Number(value) : value;
      });
  }

  getCompositionAccessor(dataContainer: DataContainerInterface, fields: Field[]) {
    const indices = this.getCategories().map(category =>
      fields.findIndex(
        field => field.name === category.field && ['integer', 'real'].includes(field.type)
      )
    );
    const missingField = indices.some(fieldIdx => fieldIdx < 0);
    return (index: number) => {
      const parsed = getDonutComposition(
        indices.map(fieldIdx => (fieldIdx < 0 ? undefined : dataContainer.valueAt(index, fieldIdx)))
      );
      const ignoredValueCount = parsed.values.filter(value => value === null).length;
      // Invalid cells are marked null by the parser. Normalize them to zero once,
      // so individual donuts, aggregated sums and hover agree.
      const composition = {
        ...(ignoredValueCount ? getDonutComposition(parsed.values) : parsed),
        ...(ignoredValueCount ? {ignoredValueCount} : {})
      };
      // Missing cells are zero, but a missing/non-numeric selected column is a
      // configuration error and must not silently become a zero-valued category.
      if (missingField) {
        composition.values = composition.values.map((value, i) => (indices[i] < 0 ? null : value));
        composition.status = 'missing';
        composition.total = null;
        composition.shares.fill(0);
      }
      return composition;
    };
  }

  getDataUpdateTriggers(dataset: KeplerTable) {
    const triggers = super.getDataUpdateTriggers(dataset);
    for (const key of ['getData', 'getMeta']) {
      triggers[key] = {
        ...triggers[key],
        composition: this.config.visConfig.composition,
        fields: dataset.fields
      };
    }
    return triggers;
  }

  updateLayerMeta(dataset: KeplerTable, getPosition) {
    let bounds: [number, number, number, number] | null = null;
    for (let index = 0; index < dataset.dataContainer.numRows(); index++) {
      const position = getPosition({index});
      if (this.isValidPosition(position)) {
        const [lng, lat] = position;
        bounds = bounds
          ? [
              Math.min(bounds[0], lng),
              Math.min(bounds[1], lat),
              Math.max(bounds[2], lng),
              Math.max(bounds[3], lat)
            ]
          : [lng, lat, lng, lat];
      }
    }
    this.updateMeta({bounds});
  }

  private isValidPosition(position: number[]) {
    return (
      position.every(Number.isFinite) && Math.abs(position[0]) <= 180 && Math.abs(position[1]) <= 90
    );
  }

  calculateDataAttribute(
    {filteredIndex, dataContainer, fields}: KeplerTable,
    getPosition
  ): DonutPoint[] {
    const getComposition = this.getCompositionAccessor(dataContainer, fields);
    const points: DonutPoint[] = [];
    for (const index of filteredIndex) {
      const position = getPosition({index});
      if (!this.isValidPosition(position)) continue;
      const composition = getComposition(index);
      points.push({index, position, ...composition, boundaries: getDonutBoundaries(composition)});
    }
    return points;
  }

  formatLayerData(datasets: Datasets, oldLayerData?: DonutLayerData): DonutLayerData {
    const dataset = this.config.dataId ? datasets[this.config.dataId] : undefined;
    if (!dataset || !this.hasAllColumns() || this.getCategories().length === 0) {
      // Clear triggers as well, so restoring a removed field/dataset rebuilds the points.
      this._oldDataUpdateTriggers = {};
      this.updateMeta({bounds: null});
      return {data: []};
    }
    const {data} = this.updateData(datasets, oldLayerData);
    return {
      data: data || [],
      getFilterValue: dataset.gpuFilter.filterValueAccessor(dataset.dataContainer)()
    };
  }

  getHoverData(
    object: DonutPoint | undefined,
    dataContainer: DataContainerInterface,
    fields: Field[] = []
  ) {
    if (!object) return null;
    return {
      donut: {
        ...(object.pointCount === undefined
          ? this.getCompositionAccessor(dataContainer, fields)(object.index)
          : object),
        categories: this.getCategories()
      }
    };
  }

  renderLayer(opts) {
    const {data, gpuFilter, mapState} = opts;
    const props = this.getDefaultDeckLayerProps(opts);
    const categories = this.getCategories();
    const {radius, showTotal} = this.config.visConfig;
    const requestedSize = this.config.visConfig.clusterRadius;
    const groupingSize = Number.isFinite(requestedSize) && requestedSize > 0 ? requestedSize : 90;
    const points = this.aggregate(
      this.aggregationSource(data, gpuFilter),
      mapState.zoom - (mapState.zoomOffset || 0),
      groupingSize
    );
    const shared = {
      ...props,
      // Keep zero-valued members in aggregation, but omit zero-total glyphs,
      // labels and picking targets from the rendered data.
      data: this.renderablePoints(points),
      // Members are filtered on the CPU. Keep the GPU attributes valid across
      // layer updates without interpreting group indices as source-row indices.
      filterEnabled: false,
      onFilteredItemsChange: undefined,
      getPosition: (point: DonutPoint) => point.position,
      filterRange: props.filterRange as [number, number][] | undefined,
      getFilterValue: getUnfilteredValue,
      updateTriggers: {getFilterValue: null}
    };
    const rings = new ScatterplotLayer<
      DonutPoint,
      DataFilterExtensionProps<DonutPoint> & DonutExtensionProps
    >({
      ...shared,
      extensions: [...shared.extensions, donutExtension],
      radiusUnits: 'pixels',
      billboard: true,
      stroked: false,
      filled: true,
      getRadius: () => radius,
      getFillColor: [255, 255, 255],
      // A translucent white highlight brightens each segment without replacing its color.
      autoHighlight: true,
      highlightColor: [255, 255, 255, 48],
      donutColors: categories.map(category => category.color),
      getDonutStart: point => point.boundaries.slice(0, 3),
      getDonutEnd: point => point.boundaries.slice(3, 6),
      updateTriggers: {
        ...shared.updateTriggers,
        getRadius: [radius]
      }
    });
    const labels = showTotal
      ? [
          new TextLayer<DonutPoint, DataFilterExtensionProps<DonutPoint>>({
            ...shared,
            id: `${this.id}-totals`,
            pickable: false,
            billboard: true,
            getText: point =>
              radius < 12 ? '' : point.total === null ? '?' : totalFormatter.format(point.total),
            getSize: 11,
            getColor: [255, 255, 255],
            getTextAnchor: 'middle',
            getAlignmentBaseline: 'center',
            updateTriggers: {
              ...shared.updateTriggers,
              getText: [radius]
            }
          })
        ]
      : [];
    return [rings, ...labels];
  }
}
