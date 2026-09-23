// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

export const CHART_ID_LENGTH = 6;

export const CHART_AGGREGATIONS = [
  'count',
  'sum',
  'average',
  'maximum',
  'minimum',
  'median',
  'stdev',
  'variance',
  'p05',
  'p25',
  'p50',
  'p75',
  'p95',
  'mode',
  'countUnique'
] as const;

export const CHART_AGGREGATION_OPTIONS: {id: (typeof CHART_AGGREGATIONS)[number]; label: string}[] =
  [
    {id: 'count', label: 'Count'},
    {id: 'sum', label: 'Sum'},
    {id: 'average', label: 'Average'},
    {id: 'maximum', label: 'Maximum'},
    {id: 'minimum', label: 'Minimum'},
    {id: 'median', label: 'Median'},
    {id: 'stdev', label: 'Std Deviation'},
    {id: 'variance', label: 'Variance'},
    {id: 'p05', label: 'P05'},
    {id: 'p25', label: 'P25'},
    {id: 'p50', label: 'P50'},
    {id: 'p75', label: 'P75'},
    {id: 'p95', label: 'P95'},
    {id: 'mode', label: 'Mode'},
    {id: 'countUnique', label: 'Count Unique'}
  ];

/** Time-series period options. `auto` lets aggregation pick from the data span. */
export const TIME_INTERVALS = ['auto', 'hour', 'day', 'week', 'month', 'year'] as const;
export type TimeInterval = (typeof TIME_INTERVALS)[number];

export const TIME_INTERVAL_OPTIONS: {id: TimeInterval; label: string}[] = [
  {id: 'auto', label: 'Auto'},
  {id: 'hour', label: 'Hour'},
  {id: 'day', label: 'Day'},
  {id: 'week', label: 'Week'},
  {id: 'month', label: 'Month'},
  {id: 'year', label: 'Year'}
];

export enum ChartType {
  bigNumber = 'bigNumber',
  barChart = 'barChart',
  horizontalBar = 'horizontalBar',
  lineChart = 'lineChart',
  heatmapChart = 'heatmapChart',
  pivotTable = 'pivotTable',
  layerChart = 'layerChart'
}

export enum LayerChartType {
  TIME_SERIES = 'TIME_SERIES',
  BREAKDOWN_BY_CATEGORY = 'BREAKDOWN_BY_CATEGORY'
}

export enum BinType {
  uniqueBin = 'uniqueBin',
  numericBin = 'numericBin',
  timeBin = 'timeBin'
}

export enum AxisType {
  bin = 'bin',
  aggregation = 'aggregation'
}

export enum SortType {
  dataOrder = 'dataOrder',
  ascending = 'ascending',
  descending = 'descending',
  alphaAsc = 'alphaAsc',
  alphaDesc = 'alphaDesc'
}

export enum ChartColorBy {
  none = 'none',
  category = 'category'
}

export const DEFAULT_NUM_GROUPS = 10;
/** Hard cap on line / time-series points after grouping. */
export const MAX_CHART_POINTS = 1000;
export const OTHERS_KEY = 'Other';

export const CHART_COLORS = [
  '#12939A',
  '#DDB27C',
  '#88572C',
  '#FF991F',
  '#F15C17',
  '#223F9A',
  '#DA70BF',
  '#125C77',
  '#4DC19C',
  '#776E57',
  '#17B8BE',
  '#F6D18A',
  '#B7885E',
  '#FFCB99',
  '#F89570'
];

export const CHART_COLOR_BY_OPTIONS: {id: ChartColorBy; label: string}[] = [
  {id: ChartColorBy.none, label: 'Single color'},
  {id: ChartColorBy.category, label: 'Category'}
];

export function getDefaultChartColorRange(steps = DEFAULT_NUM_GROUPS): {
  name: string;
  type: string;
  category: string;
  colors: string[];
} {
  const colors = Array.from(
    {length: Math.max(2, steps)},
    (_, i) => CHART_COLORS[i % CHART_COLORS.length]
  );
  return {
    name: 'Chart Colors',
    type: 'ordinal',
    category: 'Uber',
    colors
  };
}

export const NUMERIC_FIELD_TYPES = ['integer', 'real'];
export const CATEGORICAL_FIELD_TYPES = ['string', 'boolean', 'integer'];
export const TIME_FIELD_TYPES = ['timestamp', 'date'];

export const DEFAULT_CHART_TYPE_OPTIONS: {id: ChartType | LayerChartType; label: string}[] = [
  {id: ChartType.bigNumber, label: 'Big Number'},
  {id: ChartType.barChart, label: 'Bar'},
  {id: ChartType.horizontalBar, label: 'Horizontal Bar'},
  {id: ChartType.lineChart, label: 'Line'},
  {id: ChartType.heatmapChart, label: 'Heatmap'},
  {id: ChartType.pivotTable, label: 'Pivot Table'},
  {id: LayerChartType.BREAKDOWN_BY_CATEGORY, label: 'Tooltip: Category'},
  {id: LayerChartType.TIME_SERIES, label: 'Tooltip: Time Series'}
];
