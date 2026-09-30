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
/** Discrete color steps for heatmap cell fills. */
export const HEATMAP_COLOR_STEPS = 20;
/** Third sequential palette in KEPLER_COLOR_PALETTES (Uber Viz Sequential, Global Warming, Sunrise, …). */
export const DEFAULT_HEATMAP_COLOR_PALETTE = 'Sunrise';

/** Control points from the Sunrise sequential palette (dark → light). */
const HEATMAP_RGB_STOPS: Array<[number, number, number]> = [
  [53, 92, 125], // #355C7D
  [192, 108, 132], // #C06C84
  [248, 177, 149] // #F8B195
];

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function sampleHeatmapRgb(t: number): [number, number, number] {
  const clamped = Math.min(1, Math.max(0, t));
  const scaled = clamped * (HEATMAP_RGB_STOPS.length - 1);
  const i = Math.min(HEATMAP_RGB_STOPS.length - 2, Math.floor(scaled));
  const local = scaled - i;
  const a = HEATMAP_RGB_STOPS[i];
  const b = HEATMAP_RGB_STOPS[i + 1];
  return [
    Math.round(lerp(a[0], b[0], local)),
    Math.round(lerp(a[1], b[1], local)),
    Math.round(lerp(a[2], b[2], local))
  ];
}

function rgbToHex(rgb: [number, number, number]): string {
  return `#${rgb.map(c => c.toString(16).padStart(2, '0')).join('')}`;
}

/** Sunrise sequential palette sampled to HEATMAP_COLOR_STEPS. */
export const HEATMAP_COLORS: string[] = Array.from({length: HEATMAP_COLOR_STEPS}, (_, i) =>
  rgbToHex(sampleHeatmapRgb(i / Math.max(1, HEATMAP_COLOR_STEPS - 1)))
);
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

/** Default sequential palette for heatmap charts (Sunrise, 20 steps). */
export function getDefaultHeatmapColorRange(): {
  name: string;
  type: string;
  category: string;
  colors: string[];
} {
  return {
    name: DEFAULT_HEATMAP_COLOR_PALETTE,
    type: 'sequential',
    category: 'Uber',
    colors: HEATMAP_COLORS.slice(0, HEATMAP_COLOR_STEPS)
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
