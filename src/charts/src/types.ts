// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ChartType, LayerChartType, BinType, AxisType, SortType} from './constants';

export type ChartAggregation =
  | 'count'
  | 'sum'
  | 'average'
  | 'maximum'
  | 'minimum'
  | 'median'
  | 'stdev'
  | 'variance'
  | 'mode'
  | 'countUnique';

export type ChartAxisField = {
  name: string;
  type: string;
};

export type ChartAxis = {
  field: ChartAxisField | null;
  aggregation: ChartAggregation | BinType | null;
  title?: string | null;
};

export type ChartCrossFilter = {
  enabled: boolean;
  filterId: string;
  fieldNames: Record<string, string>;
  value: Record<string, string | number>;
};

export type BaseChartConfig = {
  id: string;
  title: string;
  type: ChartType;
  dataId: string | null;
  applyFilters: boolean;
  display: {
    isConfigActive?: boolean;
  };
  crossFilter?: ChartCrossFilter;
};

export type DatasetChartConfig = BaseChartConfig & {
  xAxis?: ChartAxis;
  yAxis?: ChartAxis;
  groupBy?: ChartAxis;
  value?: ChartAxis;
  axis?: ChartAxis;
  numGroups?: number;
  groupOthers?: boolean;
  chartDisplay: Record<string, any>;
};

export type LayerChartConfig = BaseChartConfig & {
  type: ChartType.layerChart;
  layerId: string;
  layerChartType: LayerChartType;
  axis?: ChartAxis;
  xAxis?: ChartAxis;
  yAxis?: ChartAxis;
  chartDisplay: {
    idField?: string | null;
    numEntries?: number;
    interval?: string;
    format?: string;
  };
};

export type ChartConfig = DatasetChartConfig | LayerChartConfig;

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
};

export type PivotTableResult = {
  rowKeys: string[];
  columnKeys: string[];
  values: Record<string, Record<string, number>>;
};

export function isLayerChartConfig(chart: ChartConfig): chart is LayerChartConfig {
  return chart.type === ChartType.layerChart;
}

export type {SortType};
export {ChartType, LayerChartType, BinType, AxisType, SortType};
