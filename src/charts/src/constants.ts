// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

export const CHART_ID_LENGTH = 6;

export const CHART_AGGREGATIONS = [
  'count',
  'sum',
  'average',
  'maximum',
  'minimum',
  'median'
] as const;

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

export const DEFAULT_NUM_GROUPS = 10;
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
