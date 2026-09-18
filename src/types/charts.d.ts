// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

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
  aggregation: ChartAggregation | string | null;
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
  type: string;
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
  type: 'layerChart';
  layerId: string;
  layerChartType: string;
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
