// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ChartConfig, LayerChartConfig} from '@kepler.gl/types';

import {ChartType} from './constants';

export type {
  ChartAggregation,
  ChartAxisField,
  ChartAxis,
  ChartCrossFilter,
  BaseChartConfig,
  DatasetChartConfig,
  LayerChartConfig,
  ChartConfig
} from '@kepler.gl/types';

export type ChartableDataset = {
  id: string;
  label?: string;
  color?: [number, number, number];
  allIndexes: number[];
  filteredIndex: number[];
  fields: Array<{name: string; displayName?: string; type: string; fieldIdx?: number}>;
  getValue: (fieldName: string, rowIdx: number) => any;
};

export type ChartBin = {
  key: string;
  value: number;
  count: number;
  color: string;
  /**
   * Value to apply when cross-filtering from this bin. For numeric/time bins this
   * is a `[min, max]` range; for categories it is `[key]`; for booleans `[true]`/`[false]`.
   */
  filterValue?: Array<string | number | boolean>;
  series?: ChartBin[];
};

export type ChartSeriesPoint = {
  x: string | number;
  y: number;
};

export type HeatmapCell = {
  x: string;
  y: string;
  value: number;
  /** Numeric/time `[min, max]`, categorical `[key]`, or boolean `[true]`/`[false]` for the X bin. */
  filterValueX?: Array<string | number | boolean>;
  /** Numeric/time `[min, max]`, categorical `[key]`, or boolean `[true]`/`[false]` for the Y bin. */
  filterValueY?: Array<string | number | boolean>;
};

export type PivotTableResult = {
  rowKeys: string[];
  columnKeys: string[];
  values: Record<string, Record<string, number>>;
};

export function isLayerChartConfig(chart: ChartConfig): chart is LayerChartConfig {
  return chart.type === ChartType.layerChart;
}
