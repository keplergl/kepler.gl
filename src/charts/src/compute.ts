// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {
  buildBigNumber,
  buildGroupedBins,
  buildHeatmapCells,
  buildPivotTable,
  buildTimeSeries
} from './aggregation';
import {
  ChartType,
  LayerChartType,
  SortType,
  BinType,
  TIME_FIELD_TYPES,
  ChartColorBy,
  CHART_COLORS,
  getDefaultHeatmapColorRange
} from './constants';
import {
  ChartBin,
  ChartConfig,
  ChartableDataset,
  ChartAxis,
  DatasetChartConfig,
  HeatmapCell,
  LayerChartConfig,
  PivotTableResult,
  isLayerChartConfig
} from './types';

export type ChartViewData =
  | {kind: 'empty'; message?: string}
  | {
      kind: 'bigNumber';
      value: number;
      caption?: string;
      format?: string | null;
      formattedValue?: string;
    }
  | {kind: 'bars'; bins: ChartBin[]; horizontal?: boolean}
  | {kind: 'line'; bins: ChartBin[]; xLabel?: string; yLabel?: string}
  | {kind: 'heatmap'; cells: HeatmapCell[]; colors?: string[]; xLabel?: string; yLabel?: string}
  | {kind: 'pivot'; table: PivotTableResult; xLabel?: string; yLabel?: string};

function axisTitle(axis?: ChartAxis, fallback = ''): string {
  if (!axis) {
    return fallback;
  }
  if (axis.title) {
    return axis.title;
  }
  const fieldName = axis.field?.name;
  if (!fieldName) {
    return fallback;
  }
  const aggregation = axis.aggregation;
  if (
    !aggregation ||
    aggregation === 'uniqueBin' ||
    aggregation === 'numericBin' ||
    aggregation === 'timeBin'
  ) {
    return fieldName;
  }
  return `${aggregation} of ${fieldName}`;
}

function isOrderedBinAxis(axis?: ChartAxis): boolean {
  if (!axis?.field) {
    return false;
  }
  const fieldType = axis.field.type;
  return (
    axis.aggregation === BinType.numericBin ||
    axis.aggregation === BinType.timeBin ||
    fieldType === 'real' ||
    TIME_FIELD_TYPES.includes(fieldType || '')
  );
}

function rgbCss(rgb?: number[]): string | undefined {
  if (!rgb || rgb.length < 3) {
    return undefined;
  }
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

function barColorOptions(
  chart: DatasetChartConfig,
  dataset: ChartableDataset
): {color?: string; colors?: string[]} {
  const colorBy = chart.colorBy ?? ChartColorBy.category;
  if (colorBy === ChartColorBy.none) {
    return {
      color: rgbCss(chart.chartDisplay?.color) || rgbCss(dataset.color) || CHART_COLORS[0]
    };
  }
  const palette = chart.chartDisplay?.colorRange?.colors;
  return {
    colors: Array.isArray(palette) && palette.length ? palette : CHART_COLORS
  };
}

const hoverIdIndexCache = new WeakMap<number[], Map<string, Map<string, number[]>>>();

function getIdRowIndex(dataset: ChartableDataset, idField: string): Map<string, number[]> {
  const indexes = dataset.allIndexes;
  let byField = hoverIdIndexCache.get(indexes);
  if (!byField) {
    byField = new Map();
    hoverIdIndexCache.set(indexes, byField);
  }
  let index = byField.get(idField);
  if (!index) {
    index = new Map();
    for (let i = 0; i < indexes.length; i++) {
      const idx = indexes[i];
      const value = dataset.getValue(idField, idx);
      if (value === null || value === undefined || value === '') {
        continue;
      }
      const key = String(value);
      const rows = index.get(key);
      if (rows) {
        rows.push(idx);
      } else {
        index.set(key, [idx]);
      }
    }
    byField.set(idField, index);
  }
  return index;
}

export function getHoverRowIndexes(
  dataset: ChartableDataset,
  chart: LayerChartConfig,
  hoverRowIndex?: number | null
): number[] {
  if (hoverRowIndex === null || hoverRowIndex === undefined || hoverRowIndex < 0) {
    return [];
  }
  const idField = chart.chartDisplay?.idField;
  if (!idField) {
    return [hoverRowIndex];
  }
  const id = dataset.getValue(idField, hoverRowIndex);
  if (id === null || id === undefined || id === '') {
    return [hoverRowIndex];
  }
  return getIdRowIndex(dataset, idField).get(String(id)) || [hoverRowIndex];
}

export function computeDatasetChart(
  chart: DatasetChartConfig,
  dataset: ChartableDataset | null
): ChartViewData {
  if (!dataset) {
    return {kind: 'empty', message: 'Select a dataset to plot this chart.'};
  }
  switch (chart.type) {
    case ChartType.bigNumber: {
      const result = buildBigNumber({
        dataset,
        applyFilters: chart.applyFilters,
        axis: chart.axis
      });
      return {
        kind: 'bigNumber',
        value: result.value,
        format: chart.chartDisplay?.format ?? null,
        caption: chart.axis?.field?.name
          ? `${chart.axis.aggregation || 'count'} of ${chart.axis.field.name}`
          : 'Count of rows'
      };
    }
    case ChartType.barChart:
    case ChartType.horizontalBar: {
      const binAxis = chart.type === ChartType.horizontalBar ? chart.yAxis : chart.xAxis;
      if (!binAxis?.field?.name) {
        return {
          kind: 'bars',
          horizontal: chart.type === ChartType.horizontalBar,
          bins: []
        };
      }
      const ordered = isOrderedBinAxis(binAxis);
      const {color, colors} = barColorOptions(chart, dataset);
      return {
        kind: 'bars',
        horizontal: chart.type === ChartType.horizontalBar,
        bins: buildGroupedBins({
          dataset,
          applyFilters: chart.applyFilters,
          binAxis,
          valueAxis: chart.type === ChartType.horizontalBar ? chart.xAxis : chart.yAxis,
          groupByAxis: chart.groupBy,
          numGroups: chart.numGroups,
          groupOthers: ordered ? false : chart.groupOthers,
          // Numeric/time bins stay in domain order; categories rank by value.
          sort: ordered ? SortType.dataOrder : SortType.descending,
          // Histogram/time bins already span the domain — do not top-N truncate.
          truncate: !ordered,
          color,
          colors
        })
      };
    }
    case ChartType.lineChart: {
      const ordered = isOrderedBinAxis(chart.xAxis);
      const interval = chart.xAxis?.interval ?? chart.chartDisplay?.interval ?? null;
      const binAxis = chart.xAxis ? {...chart.xAxis, interval: interval || undefined} : chart.xAxis;
      return {
        kind: 'line',
        // Line charts plot a full series; do not apply the categorical top-N
        // truncation used by bar charts (DEFAULT_NUM_GROUPS = 10).
        // Datetime X uses period grouping (auto hour/day/week/month/year).
        bins: buildGroupedBins({
          dataset,
          applyFilters: chart.applyFilters,
          binAxis,
          valueAxis: chart.yAxis,
          groupByAxis: chart.groupBy,
          numGroups: 0,
          sort: ordered ? SortType.dataOrder : SortType.alphaAsc
        }),
        xLabel: axisTitle(chart.xAxis, 'X'),
        yLabel: axisTitle(chart.yAxis, 'Y')
      };
    }
    case ChartType.heatmapChart: {
      const palette = chart.chartDisplay?.colorRange?.colors;
      const colors =
        Array.isArray(palette) && palette.length >= 2
          ? palette
          : getDefaultHeatmapColorRange().colors;
      return {
        kind: 'heatmap',
        cells: buildHeatmapCells({
          dataset,
          applyFilters: chart.applyFilters,
          xAxis: chart.xAxis,
          yAxis: chart.yAxis,
          valueAxis: chart.value,
          numGroups: chart.numGroups
        }),
        colors,
        xLabel: axisTitle(chart.xAxis, 'X'),
        yLabel: axisTitle(chart.yAxis, 'Y')
      };
    }
    case ChartType.pivotTable:
      return {
        kind: 'pivot',
        table: buildPivotTable({
          dataset,
          applyFilters: chart.applyFilters,
          xAxis: chart.xAxis,
          yAxis: chart.yAxis,
          valueAxis: chart.value,
          numGroups: chart.numGroups
        }),
        xLabel: axisTitle(chart.xAxis, 'X'),
        yLabel: axisTitle(chart.yAxis, 'Y')
      };
    default:
      return {kind: 'empty'};
  }
}

export function computeLayerChart(
  chart: LayerChartConfig,
  dataset: ChartableDataset | null,
  hoverIndexes: number[]
): ChartViewData {
  if (!dataset) {
    return {kind: 'empty'};
  }
  if (!hoverIndexes.length) {
    return {kind: 'empty', message: 'Hover a feature to see this chart.'};
  }
  if (chart.layerChartType === LayerChartType.TIME_SERIES) {
    return {
      kind: 'line',
      bins: buildTimeSeries({
        dataset,
        indexes: hoverIndexes,
        xAxis: chart.xAxis,
        yAxis: chart.yAxis,
        interval: chart.xAxis?.interval || chart.chartDisplay?.interval
      })
    };
  }
  return {
    kind: 'bars',
    bins: buildGroupedBins({
      dataset,
      applyFilters: false,
      indexes: hoverIndexes,
      binAxis: chart.axis,
      valueAxis: chart.yAxis,
      numGroups: chart.chartDisplay?.numEntries ?? 5,
      sort: SortType.descending
    })
  };
}

export function computeChart(
  chart: ChartConfig,
  dataset: ChartableDataset | null,
  hoverIndexes?: number[]
): ChartViewData {
  if (isLayerChartConfig(chart)) {
    return computeLayerChart(chart, dataset, hoverIndexes || []);
  }
  return computeDatasetChart(chart, dataset);
}

export function getCrossFilterField(chart: ChartConfig): string | null {
  return getCrossFilterFields(chart)[0] ?? null;
}

/** Fields that a chart click should drive as map filters (heatmap uses X and Y). */
export function getCrossFilterFields(chart: ChartConfig): string[] {
  if (isLayerChartConfig(chart)) {
    return [];
  }
  if (chart.type === ChartType.horizontalBar) {
    return chart.yAxis?.field?.name ? [chart.yAxis.field.name] : [];
  }
  if (chart.type === ChartType.heatmapChart) {
    const fields: string[] = [];
    if (chart.xAxis?.field?.name) {
      fields.push(chart.xAxis.field.name);
    }
    if (chart.yAxis?.field?.name && chart.yAxis.field.name !== chart.xAxis?.field?.name) {
      fields.push(chart.yAxis.field.name);
    }
    return fields;
  }
  return chart.xAxis?.field?.name ? [chart.xAxis.field.name] : [];
}
