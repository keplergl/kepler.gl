// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/* eslint-disable guard-for-in */
import {console as Console} from 'global/window';

import {aggregate} from '@kepler.gl/utils';
import {AGGREGATION_TYPES, SCALE_FUNC} from '@kepler.gl/constants';
import {RGBAColor} from '@kepler.gl/types';
import type ClusterBuilder from './cluster-utils';

const AGGREGATION_OPERATION = {
  SUM: 'SUM' as const,
  MEAN: 'MEAN' as const,
  MIN: 'MIN' as const,
  MAX: 'MAX' as const,
  COUNT: 'COUNT' as const
};

const MAX_32_BIT_FLOAT = 3.402823466e38;

interface Bin {
  points: Record<string, unknown>[];
  filteredPoints?: Record<string, unknown>[] | null;
  index?: number;
}

interface AggregatedBin {
  i: number;
  value: number;
  counts: number;
}

const defaultGetValue = (points: Record<string, unknown>[]) => points.length;
const defaultGetPoints = (bin: Bin) => bin.points;
const defaultGetIndex = (bin: Bin) => bin.index;
const ascending = (a: number, b: number) => (a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN);

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function getQuantileDomain(data: AggregatedBin[], valueAccessor: (d: AggregatedBin) => number) {
  return data.map(valueAccessor).sort(ascending);
}

function getOrdinalDomain(data: AggregatedBin[], valueAccessor: (d: AggregatedBin) => number) {
  return [...new Set(data.map(valueAccessor))];
}

class BinSorter {
  maxCount!: number;
  maxValue!: number;
  minValue!: number;
  totalCount!: number;
  aggregatedBins: AggregatedBin[];
  sortedBins!: AggregatedBin[];
  binMap: Record<number, AggregatedBin>;

  constructor(bins: Bin[] = [], props: Record<string, any> = {}) {
    this.aggregatedBins = this._getAggregatedBins(bins, props);
    this._updateMinMaxValues();
    this.binMap = this._getBinMap();
  }

  _getAggregatedBins(bins: Bin[], props: Record<string, any>): AggregatedBin[] {
    const {
      getValue = defaultGetValue,
      getPoints = defaultGetPoints,
      getIndex = defaultGetIndex,
      filterData
    } = props;
    const hasFilter = typeof filterData === 'function';
    const aggregatedBins: AggregatedBin[] = [];
    let index = 0;
    for (let binIndex = 0; binIndex < bins.length; binIndex++) {
      const bin = bins[binIndex];
      const points = getPoints(bin);
      const i = getIndex(bin);
      const filteredPoints = hasFilter ? points.filter(filterData) : points;
      bin.filteredPoints = hasFilter ? filteredPoints : null;
      const value = filteredPoints.length ? getValue(filteredPoints) : null;
      if (value !== null && value !== undefined) {
        aggregatedBins[index] = {
          i: Number.isFinite(i) ? i : binIndex,
          value,
          counts: filteredPoints.length
        };
        index++;
      }
    }
    return aggregatedBins;
  }

  _updateMinMaxValues() {
    let maxCount = 0;
    let maxValue = -MAX_32_BIT_FLOAT;
    let minValue = MAX_32_BIT_FLOAT;
    let totalCount = 0;
    for (const x of this.aggregatedBins) {
      maxCount = maxCount > x.counts ? maxCount : x.counts;
      maxValue = maxValue > x.value ? maxValue : x.value;
      minValue = minValue < x.value ? minValue : x.value;
      totalCount += x.counts;
    }
    if (this.aggregatedBins.length === 0) {
      maxValue = 0;
      minValue = 0;
    }
    this.maxCount = maxCount;
    this.maxValue = maxValue;
    this.minValue = minValue;
    this.totalCount = totalCount;
  }

  _getBinMap() {
    const binMap = {};
    for (const bin of this.aggregatedBins) {
      binMap[bin.i] = bin;
    }
    return binMap;
  }

  _percentileToIndex(percentileRange: number[]) {
    const len = this.sortedBins.length;
    if (len < 2) return [0, 0];
    const [lower, upper] = percentileRange.map(n => clamp(n, 0, 100));
    return [Math.ceil((lower / 100) * (len - 1)), Math.floor((upper / 100) * (len - 1))];
  }

  getValueDomainByScale(scale: string, [lower = 0, upper = 100]: number[] = []) {
    if (!this.sortedBins) {
      this.sortedBins = this.aggregatedBins.sort((a, b) => ascending(a.value, b.value));
    }
    if (!this.sortedBins.length) return [];
    const indexEdge = this._percentileToIndex([lower, upper]);
    return this._getScaleDomain(scale, indexEdge);
  }

  _getScaleDomain(scaleType: string, [lowerIdx, upperIdx]: number[]) {
    const bins = this.sortedBins;
    switch (scaleType) {
      case 'quantize':
      case 'linear':
        return [bins[lowerIdx].value, bins[upperIdx].value];
      case 'quantile':
        return getQuantileDomain(bins.slice(lowerIdx, upperIdx + 1), d => d.value);
      case 'ordinal':
        return getOrdinalDomain(bins, d => d.value);
      default:
        return [bins[lowerIdx].value, bins[upperIdx].value];
    }
  }

  getValueRange(percentileRange?: number[]) {
    if (!this.sortedBins) {
      this.sortedBins = this.aggregatedBins.sort((a, b) => ascending(a.value, b.value));
    }
    if (!this.sortedBins.length) return [];
    let lowerIdx = 0;
    let upperIdx = this.sortedBins.length - 1;
    if (Array.isArray(percentileRange)) {
      const idxRange = this._percentileToIndex(percentileRange);
      lowerIdx = idxRange[0];
      upperIdx = idxRange[1];
    }
    return [this.sortedBins[lowerIdx].value, this.sortedBins[upperIdx].value];
  }
}

export type UpdaterType = (this: CPUAggregator, step, props, dimensionUpdater) => void;
export type BindedUpdaterType = () => void;
export type AggregatedUpdaterType = (
  this: CPUAggregator,
  step,
  props,
  aggregation,
  aggregationParams
) => void;
export type BindedAggregatedUpdaterType = (aggregationParams) => void;

export type UpdateStepsType = {
  key: string;
  triggers: {
    [key: string]: {
      prop: string;
      updateTrigger?: string;
    };
  };
  onSet?: {
    props: string;
  };
  updater: UpdaterType;
};

export type DimensionType<ValueType = any> = {
  key: string;
  accessor: string;
  getPickingInfo: (dimensionState, cell, layerProps?) => any;
  nullValue: ValueType;
  updateSteps: UpdateStepsType[];
  getSubLayerAccessor;
};

export type AggregationUpdateStepsType = {
  key: string;
  triggers: {
    [key: string]: {
      prop: string;
      updateTrigger?: string;
    };
  };
  updater: AggregatedUpdaterType;
};

export type AggregationType = {
  key: string;
  updateSteps: AggregationUpdateStepsType[];
};

export const DECK_AGGREGATION_MAP = {
  [AGGREGATION_OPERATION.SUM]: AGGREGATION_TYPES.sum,
  [AGGREGATION_OPERATION.MEAN]: AGGREGATION_TYPES.average,
  [AGGREGATION_OPERATION.MIN]: AGGREGATION_TYPES.minimum,
  [AGGREGATION_OPERATION.MAX]: AGGREGATION_TYPES.maximum
};

export function getValueFunc(
  aggregation: string,
  accessor: (d: Record<string, unknown>) => number
) {
  if (!aggregation || !AGGREGATION_OPERATION[aggregation.toUpperCase()]) {
    Console.warn(`Aggregation ${aggregation} is not supported`);
  }

  const op = AGGREGATION_OPERATION[aggregation.toUpperCase()] || AGGREGATION_OPERATION.SUM;
  const keplerOp = DECK_AGGREGATION_MAP[op];

  return pts => aggregate(pts.map(accessor), keplerOp);
}

export function getScaleFunctor(scaleType: string) {
  if (!scaleType || !SCALE_FUNC[scaleType]) {
    Console.warn(`Scale ${scaleType} is not supported`);
  }
  return SCALE_FUNC[scaleType] || SCALE_FUNC.quantize;
}

function nop() {
  return;
}

export function getGetValue(this: CPUAggregator, step, props, dimensionUpdater) {
  const {key} = dimensionUpdater;
  const {value, weight, aggregation} = step.triggers;

  let getValue = props[value.prop];

  if (getValue === null) {
    // If `getValue` is not provided from props, build it with aggregation and weight.
    getValue = getValueFunc(props[aggregation.prop], props[weight.prop]);
  }

  if (getValue) {
    this._setDimensionState(key, {getValue});
  }
}

export function getDimensionSortedBins(this: CPUAggregator, step, props, dimensionUpdater) {
  const {key} = dimensionUpdater;
  const {getValue} = this.state.dimensions[key];
  const sortedBins = new BinSorter((this.state.layerData.data || []) as unknown as Bin[], {
    getValue,
    filterData: props._filterData
  });
  this._setDimensionState(key, {sortedBins});
}

export function getDimensionValueDomain(this: CPUAggregator, step, props, dimensionUpdater) {
  const {key} = dimensionUpdater;
  const {
    triggers: {lowerPercentile, upperPercentile, scaleType}
  } = step;

  if (!this.state.dimensions[key].sortedBins) {
    // the previous step should set sortedBins, if not, something went wrong
    return;
  }

  let valueDomain =
    // for log and sqrt scale, returns linear domain by default
    // TODO: support other scale function domain in bin sorter
    this.state.dimensions[key].sortedBins.getValueDomainByScale(props[scaleType.prop], [
      props[lowerPercentile.prop],
      props[upperPercentile.prop]
    ]);

  if (props.colorScaleType === 'custom' && props.colorMap) {
    // for custom scale, return custom breaks as value domain directly
    valueDomain = props.colorMap.reduce(
      (prev, cur) => (Number.isFinite(cur[0]) ? prev.concat(cur[0]) : prev),
      []
    );
  }

  this._setDimensionState(key, {valueDomain});
}

export function getDimensionScale(this: CPUAggregator, step, props, dimensionUpdater) {
  const {key} = dimensionUpdater;
  const {domain, range, scaleType, fixed} = step.triggers;
  const {onSet} = step;
  if (!this.state.dimensions[key].valueDomain) {
    // the previous step should set valueDomain, if not, something went wrong
    return;
  }

  const dimensionRange = props[range.prop];
  const dimensionDomain = props[domain.prop] || this.state.dimensions[key].valueDomain;
  const dimensionFixed = Boolean(fixed && props[fixed.prop]);

  const scaleFunctor = getScaleFunctor(scaleType && props[scaleType.prop])();

  const scaleFunc = scaleFunctor
    .domain(dimensionDomain)
    .range(dimensionFixed ? dimensionDomain : dimensionRange);
  scaleFunc.scaleType = props.colorScaleType;

  if (typeof onSet === 'object' && typeof props[onSet.props] === 'function') {
    const sortedBins = this.state.dimensions[key].sortedBins;
    if (sortedBins) {
      props[onSet.props]({domain: scaleFunc.domain(), aggregatedBins: sortedBins.binMap});
    }
  }
  this._setDimensionState(key, {scaleFunc});
}

function normalizeResult(
  result: {
    hexagons?: Record<string, unknown>[];
    layerData?: Record<string, unknown>[];
    data?: Record<string, unknown>[];
  } = {}
) {
  // support previous hexagonAggregator API
  if (result.hexagons) {
    return Object.assign({data: result.hexagons}, result);
  } else if (result.layerData) {
    return Object.assign({data: result.layerData}, result);
  }

  return result;
}

export function getAggregatedData(
  this: CPUAggregator,
  step,
  props,
  aggregation,
  aggregationParams
) {
  const {
    triggers: {aggregator: aggr}
  } = step;
  const aggregator = props[aggr.prop];

  // result should contain a data array and other props
  // result = {data: [], ...other props}
  const result = aggregator(props, aggregationParams);
  this.setState({
    layerData: normalizeResult(result)
  });
}

export const defaultAggregation: AggregationType = {
  key: 'position',
  updateSteps: [
    {
      key: 'aggregate',
      triggers: {
        cellSize: {
          prop: 'cellSize'
        },
        position: {
          prop: 'getPosition',
          updateTrigger: 'getPosition'
        },
        aggregator: {
          prop: 'gridAggregator'
        }
      },
      updater: getAggregatedData
    }
  ]
};

function getSubLayerAccessor(
  dimensionState: {sortedBins: BinSorter; scaleFunc: ReturnType<typeof getScaleFunctor>},
  dimension: DimensionType
) {
  return (cell: {index: number}) => {
    const {sortedBins, scaleFunc} = dimensionState;
    const bin = sortedBins.binMap[cell.index];

    if (bin && bin.counts === 0) {
      // no points left in bin after filtering
      return dimension.nullValue;
    }

    const cv = bin && bin.value;
    const domain = scaleFunc.domain();

    const isValueInDomain =
      scaleFunc.scaleType === 'custom'
        ? cv >= sortedBins.minValue && cv <= sortedBins.maxValue
        : cv >= domain[0] && cv <= domain[domain.length - 1];

    // if cell value is outside domain, set alpha to 0
    return isValueInDomain ? scaleFunc(cv) : dimension.nullValue;
  };
}

export const defaultColorDimension: DimensionType<RGBAColor> = {
  key: 'fillColor',
  accessor: 'getFillColor',
  getPickingInfo: (dimensionState, cell) => {
    if (!cell) {
      return {};
    }
    const {sortedBins} = dimensionState;
    const colorValue = sortedBins.binMap[cell.index] && sortedBins.binMap[cell.index].value;
    return {colorValue};
  },
  nullValue: [0, 0, 0, 0],
  updateSteps: [
    {
      key: 'getValue',
      triggers: {
        value: {
          prop: 'getColorValue',
          updateTrigger: 'getColorValue'
        },
        weight: {
          prop: 'getColorWeight',
          updateTrigger: 'getColorWeight'
        },
        aggregation: {
          prop: 'colorAggregation'
        }
      },
      updater: getGetValue
    },
    {
      key: 'getBins',
      triggers: {
        _filterData: {
          prop: '_filterData',
          updateTrigger: '_filterData'
        }
      },
      updater: getDimensionSortedBins
    },
    {
      key: 'getDomain',
      triggers: {
        lowerPercentile: {
          prop: 'lowerPercentile'
        },
        upperPercentile: {
          prop: 'upperPercentile'
        },
        scaleType: {prop: 'colorScaleType'}
      },
      updater: getDimensionValueDomain
    },
    {
      key: 'getScaleFunc',
      triggers: {
        domain: {prop: 'colorDomain'},
        range: {prop: 'colorRange'},
        scaleType: {prop: 'colorScaleType'}
      },
      onSet: {
        props: 'onSetColorDomain'
      },
      updater: getDimensionScale
    }
  ],
  getSubLayerAccessor
};

export const defaultElevationDimension: DimensionType<number> = {
  key: 'elevation',
  accessor: 'getElevation',
  getPickingInfo: (dimensionState, cell) => {
    if (!cell) {
      return {};
    }
    const {sortedBins} = dimensionState;
    const elevationValue = sortedBins.binMap[cell.index] && sortedBins.binMap[cell.index].value;
    return {elevationValue};
  },
  nullValue: -1,
  updateSteps: [
    {
      key: 'getValue',
      triggers: {
        value: {
          prop: 'getElevationValue',
          updateTrigger: 'getElevationValue'
        },
        weight: {
          prop: 'getElevationWeight',
          updateTrigger: 'getElevationWeight'
        },
        aggregation: {
          prop: 'elevationAggregation'
        }
      },
      updater: getGetValue
    },
    {
      key: 'getBins',
      triggers: {
        _filterData: {
          prop: '_filterData',
          updateTrigger: '_filterData'
        }
      },
      updater: getDimensionSortedBins
    },
    {
      key: 'getDomain',
      triggers: {
        lowerPercentile: {
          prop: 'elevationLowerPercentile'
        },
        upperPercentile: {
          prop: 'elevationUpperPercentile'
        },
        scaleType: {prop: 'elevationScaleType'}
      },
      updater: getDimensionValueDomain
    },
    {
      key: 'getScaleFunc',
      triggers: {
        fixed: {prop: 'elevationFixed'},
        domain: {prop: 'elevationDomain'},
        range: {prop: 'elevationRange'},
        scaleType: {prop: 'elevationScaleType'}
      },
      onSet: {
        props: 'onSetElevationDomain'
      },
      updater: getDimensionScale
    }
  ],
  getSubLayerAccessor
};

export const defaultDimensions = [defaultColorDimension, defaultElevationDimension];

export type CPUAggregatorState = {
  layerData: {data?: Record<string, unknown>[]};
  dimensions: Record<
    string,
    {
      getValue?: (...args: unknown[]) => number;
      sortedBins?: BinSorter;
      valueDomain?: number[];
      scaleFunc?: ((...args: unknown[]) => unknown) & {domain: () => number[]; scaleType?: string};
    }
  >;
  geoJSON?: GeoJSON.FeatureCollection;
  clusterBuilder?: ClusterBuilder;
};

export default class CPUAggregator {
  static getDimensionScale: any;
  state: CPUAggregatorState;
  dimensionUpdaters: {[key: string]: DimensionType};
  aggregationUpdater: AggregationType;

  constructor(
    opts: {
      initialState?: CPUAggregatorState;
      dimensions?: DimensionType[];
      aggregation?: AggregationType;
    } = {}
  ) {
    this.state = {
      layerData: {},
      dimensions: {
        // color: {
        //   getValue: null,
        //   domain: null,
        //   sortedBins: null,
        //   scaleFunc: nop
        // },
        // elevation: {
        //   getValue: null,
        //   domain: null,
        //   sortedBins: null,
        //   scaleFunc: nop
        // }
      },
      ...opts.initialState
    };

    this.dimensionUpdaters = {};
    this.aggregationUpdater = opts.aggregation || defaultAggregation;

    this._addDimension(opts.dimensions || defaultDimensions);
  }

  static defaultDimensions() {
    return defaultDimensions;
  }

  updateAllDimensions(props: Record<string, any>) {
    let dimensionChanges: BindedUpdaterType[] = [];
    // update all dimensions
    for (const dim in this.dimensionUpdaters) {
      const updaters = this._accumulateUpdaters(0, props, this.dimensionUpdaters[dim]);
      dimensionChanges = dimensionChanges.concat(updaters);
    }

    dimensionChanges.forEach(f => typeof f === 'function' && f());
  }

  updateAggregation(props: Record<string, any>, aggregationParams: Record<string, any>) {
    const updaters = this._accumulateUpdaters(0, props, this.aggregationUpdater);
    updaters.forEach(f => typeof f === 'function' && f(aggregationParams));
  }

  updateState(
    opts: {
      oldProps: Record<string, any>;
      props: Record<string, any>;
      changeFlags: Record<string, any>;
    },
    aggregationParams: Record<string, any>
  ) {
    const {oldProps, props, changeFlags} = opts;
    let dimensionChanges: BindedUpdaterType[] = [];

    if (changeFlags.dataChanged) {
      // if data changed update everything
      this.updateAggregation(props, aggregationParams);
      this.updateAllDimensions(props);

      return this.state;
    }

    const aggregationChanges = this._getAggregationChanges(oldProps, props, changeFlags);

    if (aggregationChanges && aggregationChanges.length) {
      // get aggregatedData
      aggregationChanges.forEach(f => typeof f === 'function' && f(aggregationParams));
      this.updateAllDimensions(props);
    } else {
      // only update dimensions
      dimensionChanges = this._getDimensionChanges(oldProps, props, changeFlags) || [];
      dimensionChanges.forEach(f => typeof f === 'function' && f());
    }

    return this.state;
  }

  // Update private state
  setState(updateObject: Partial<CPUAggregatorState>) {
    this.state = Object.assign({}, this.state, updateObject);
  }

  // Update private state.dimensions
  _setDimensionState(key: string, updateObject: Record<string, any>) {
    this.setState({
      dimensions: Object.assign({}, this.state.dimensions, {
        [key]: Object.assign({}, this.state.dimensions[key], updateObject)
      })
    });
  }

  _addAggregation(aggregation: AggregationType) {
    this.aggregationUpdater = aggregation;
  }

  _addDimension(dimensions: DimensionType[] = []) {
    dimensions.forEach(dimension => {
      const {key} = dimension;
      this.dimensionUpdaters[key] = dimension;
    });
  }

  _needUpdateStep(
    dimensionStep: UpdateStepsType | AggregationUpdateStepsType,
    oldProps,
    props,
    changeFlags
  ) {
    // whether need to update current dimension step
    // dimension step is the value, domain, scaleFunction of each dimension
    // each step is an object with properties links to layer prop and whether the prop is
    // controlled by updateTriggers
    return Object.values(dimensionStep.triggers).some(item => {
      if (item.updateTrigger) {
        // check based on updateTriggers change first
        return (
          changeFlags.updateTriggersChanged &&
          (changeFlags.updateTriggersChanged.all ||
            changeFlags.updateTriggersChanged[item.updateTrigger])
        );
      }
      // fallback to direct comparison
      return oldProps[item.prop] !== props[item.prop];
    });
  }

  _accumulateUpdaters<UpdaterObjectType extends DimensionType | AggregationType>(
    step,
    props,
    dimension: UpdaterObjectType
  ) {
    type LocalUpdaterType = UpdaterObjectType extends DimensionType
      ? BindedUpdaterType
      : BindedAggregatedUpdaterType;
    const updaters: LocalUpdaterType[] = [];
    for (let i = step; i < dimension.updateSteps.length; i++) {
      const updater = dimension.updateSteps[i].updater;
      if (typeof updater === 'function') {
        updaters.push(
          (updater as UpdaterType).bind(
            this,
            dimension.updateSteps[i],
            props,
            dimension
          ) as LocalUpdaterType
        );
      }
    }

    return updaters;
  }

  _getAllUpdaters<UpdaterObjectType extends DimensionType | AggregationType>(
    dimension: UpdaterObjectType,
    oldProps,
    props,
    changeFlags
  ) {
    type LocalUpdaterType = UpdaterObjectType extends DimensionType
      ? BindedUpdaterType
      : BindedAggregatedUpdaterType;
    let updaters: LocalUpdaterType[] = [];
    const needUpdateStep = dimension.updateSteps.findIndex(step =>
      this._needUpdateStep(step, oldProps, props, changeFlags)
    );

    if (needUpdateStep > -1) {
      updaters = updaters.concat(this._accumulateUpdaters(needUpdateStep, props, dimension));
    }

    return updaters;
  }

  _getAggregationChanges(
    oldProps: Record<string, any>,
    props: Record<string, any>,
    changeFlags: Record<string, any>
  ) {
    const updaters = this._getAllUpdaters(this.aggregationUpdater, oldProps, props, changeFlags);
    return updaters.length ? updaters : null;
  }

  _getDimensionChanges(
    oldProps: Record<string, any>,
    props: Record<string, any>,
    changeFlags: Record<string, any>
  ) {
    let updaters: BindedUpdaterType[] = [];

    // get dimension to be updated
    for (const key in this.dimensionUpdaters) {
      // return the first triggered updater for each dimension
      const dimension = this.dimensionUpdaters[key];
      const dimensionUpdaters = this._getAllUpdaters(dimension, oldProps, props, changeFlags);
      updaters = updaters.concat(dimensionUpdaters);
    }

    return updaters.length ? updaters : null;
  }

  getUpdateTriggers(props: Record<string, any>) {
    const _updateTriggers = props.updateTriggers || {};
    const updateTriggers = {};

    for (const key in this.dimensionUpdaters) {
      const {accessor, updateSteps}: {accessor: string; updateSteps: UpdateStepsType[]} =
        this.dimensionUpdaters[key];
      // fold dimension triggers into each accessor
      updateTriggers[accessor] = {};

      updateSteps.forEach(step => {
        Object.values(step.triggers || []).forEach(({prop, updateTrigger}) => {
          if (updateTrigger) {
            // if prop is based on updateTrigger e.g. getColorValue, getColorWeight
            // and updateTriggers is passed in from layer prop
            // fold the updateTriggers into accessor
            const fromProp = _updateTriggers[updateTrigger];
            if (typeof fromProp === 'object' && !Array.isArray(fromProp)) {
              // if updateTrigger is an object spread it
              Object.assign(updateTriggers[accessor], fromProp);
            } else if (fromProp !== undefined) {
              updateTriggers[accessor][prop] = fromProp;
            }
          } else {
            // if prop is not based on updateTrigger
            updateTriggers[accessor][prop] = props[prop];
          }
        });
      });
    }

    return updateTriggers;
  }

  getPickingInfo({info}: {info: Record<string, any>}, layerProps: Record<string, any>) {
    const isPicked = info.picked && info.index > -1;
    let object: Record<string, any> | null = null;
    const cell = isPicked ? this.state.layerData.data?.[info.index] : null;
    if (cell) {
      let binInfo = {};
      for (const key in this.dimensionUpdaters) {
        const {getPickingInfo} = this.dimensionUpdaters[key];
        if (typeof getPickingInfo === 'function') {
          binInfo = Object.assign(
            {},
            binInfo,
            getPickingInfo(this.state.dimensions[key], cell, layerProps)
          );
        }
      }

      object = Object.assign(binInfo, cell, {
        points: cell.filteredPoints || cell.points
      });
    }

    // add bin  and  to info
    return Object.assign(info, {
      picked: Boolean(object),
      // override object with picked cell
      object
    });
  }

  getAccessor(dimensionKey: string, layerProps: Record<string, any>) {
    if (!Object.prototype.hasOwnProperty.call(this.dimensionUpdaters, dimensionKey)) {
      return nop;
    }
    return this.dimensionUpdaters[dimensionKey].getSubLayerAccessor(
      this.state.dimensions[dimensionKey],
      this.dimensionUpdaters[dimensionKey],
      layerProps
    );
  }
}

CPUAggregator.getDimensionScale = getDimensionScale;
