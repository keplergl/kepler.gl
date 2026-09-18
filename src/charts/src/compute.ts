// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {
  buildBigNumber,
  buildGroupedBins,
  buildHeatmapCells,
  buildPivotTable,
  buildTimeSeries
} from './aggregation';
import {ChartType, LayerChartType, SortType} from './constants';
import {
  ChartBin,
  ChartConfig,
  ChartableDataset,
  DatasetChartConfig,
  HeatmapCell,
  LayerChartConfig,
  PivotTableResult,
  isLayerChartConfig
} from './types';

export type ChartViewData =
  | {kind: 'empty'; message?: string}
  | {kind: 'bigNumber'; value: number; caption?: string}
  | {kind: 'bars'; bins: ChartBin[]; horizontal?: boolean}
  | {kind: 'line'; bins: ChartBin[]}
  | {kind: 'heatmap'; cells: HeatmapCell[]}
  | {kind: 'pivot'; table: PivotTableResult};

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
  const key = String(id);
  return dataset.allIndexes.filter(idx => String(dataset.getValue(idField, idx)) === key);
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
        caption: chart.axis?.field?.name
          ? `${chart.axis.aggregation || 'count'} of ${chart.axis.field.name}`
          : 'Count of rows'
      };
    }
    case ChartType.barChart:
    case ChartType.horizontalBar:
      return {
        kind: 'bars',
        horizontal: chart.type === ChartType.horizontalBar,
        bins: buildGroupedBins({
          dataset,
          applyFilters: chart.applyFilters,
          binAxis: chart.type === ChartType.horizontalBar ? chart.yAxis : chart.xAxis,
          valueAxis: chart.type === ChartType.horizontalBar ? chart.xAxis : chart.yAxis,
          groupByAxis: chart.groupBy,
          numGroups: chart.numGroups,
          groupOthers: chart.groupOthers,
          sort: SortType.descending,
          color: dataset.color ? `rgb(${dataset.color.join(',')})` : undefined
        })
      };
    case ChartType.lineChart:
      return {
        kind: 'line',
        bins: buildGroupedBins({
          dataset,
          applyFilters: chart.applyFilters,
          binAxis: chart.xAxis,
          valueAxis: chart.yAxis,
          groupByAxis: chart.groupBy,
          numGroups: chart.numGroups,
          sort: SortType.alphaAsc
        })
      };
    case ChartType.heatmapChart:
      return {
        kind: 'heatmap',
        cells: buildHeatmapCells({
          dataset,
          applyFilters: chart.applyFilters,
          xAxis: chart.xAxis,
          yAxis: chart.yAxis,
          valueAxis: chart.value,
          numGroups: chart.numGroups
        })
      };
    case ChartType.pivotTable:
      return {
        kind: 'pivot',
        table: buildPivotTable({
          dataset,
          applyFilters: chart.applyFilters,
          rowField: chart.yAxis?.field?.name,
          columnField: chart.xAxis?.field?.name,
          valueAxis: chart.value,
          numGroups: chart.numGroups
        })
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
        interval: chart.chartDisplay?.interval
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
  if (isLayerChartConfig(chart)) {
    return null;
  }
  if (chart.type === ChartType.horizontalBar) {
    return chart.yAxis?.field?.name ?? null;
  }
  return chart.xAxis?.field?.name ?? null;
}
