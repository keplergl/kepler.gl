// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {
  CHART_ID_LENGTH,
  ChartType,
  LayerChartType,
  BinType,
  ChartColorBy,
  DEFAULT_NUM_GROUPS,
  CATEGORICAL_FIELD_TYPES,
  NUMERIC_FIELD_TYPES,
  TIME_FIELD_TYPES,
  getDefaultChartColorRange,
  getDefaultHeatmapColorRange
} from './constants';
import {
  ChartConfig,
  ChartAxis,
  DatasetChartConfig,
  LayerChartConfig,
  ChartableDataset,
  isLayerChartConfig
} from './types';

function generateHashId(len: number): string {
  return Math.random()
    .toString(36)
    .slice(2, 2 + len);
}

function makeAxis(
  field: {name: string; type: string} | null = null,
  aggregation: ChartAxis['aggregation'] = 'count'
): ChartAxis {
  return {
    field,
    aggregation,
    title: field?.name ?? null
  };
}

function baseChart(
  props: Partial<ChartConfig> = {}
): Pick<
  DatasetChartConfig,
  'id' | 'title' | 'dataId' | 'applyFilters' | 'pinned' | 'display' | 'chartDisplay' | 'crossFilter'
> {
  return {
    id: props.id || generateHashId(CHART_ID_LENGTH),
    title: props.title || 'New Chart',
    dataId: props.dataId ?? null,
    applyFilters: props.applyFilters ?? true,
    // New charts start unpinned; user can pin to keep them visible when the panel is off.
    pinned: props.pinned ?? false,
    display: {
      isConfigActive: props.display?.isConfigActive ?? false
    },
    chartDisplay: props.chartDisplay || {},
    ...(props.crossFilter ? {crossFilter: props.crossFilter} : {})
  };
}

export function createBigNumberChart(props: Partial<DatasetChartConfig> = {}): DatasetChartConfig {
  return {
    ...baseChart({
      ...props,
      chartDisplay: {
        format: 'DECIMAL_SHORT_COMMA',
        showCaption: true,
        ...props.chartDisplay
      }
    }),
    type: ChartType.bigNumber,
    axis: props.axis || makeAxis(null, 'count'),
    title: props.title || 'Count of rows'
  };
}

export function createBarChart(props: Partial<DatasetChartConfig> = {}): DatasetChartConfig {
  const numGroups = props.numGroups ?? DEFAULT_NUM_GROUPS;
  return {
    ...baseChart({
      ...props,
      chartDisplay: {
        colorRange: getDefaultChartColorRange(numGroups),
        ...props.chartDisplay
      }
    }),
    type: ChartType.barChart,
    xAxis: props.xAxis || makeAxis(null, BinType.uniqueBin),
    yAxis: props.yAxis || makeAxis(null, 'count'),
    groupBy: props.groupBy || makeAxis(null, BinType.uniqueBin),
    numGroups,
    groupOthers: props.groupOthers ?? false,
    colorBy: props.colorBy ?? ChartColorBy.category,
    title: props.title || 'Bar chart'
  };
}

export function createHorizontalBarChart(
  props: Partial<DatasetChartConfig> = {}
): DatasetChartConfig {
  return {
    ...createBarChart(props),
    type: ChartType.horizontalBar,
    title: props.title || 'Horizontal bar'
  };
}

export function createLineChart(props: Partial<DatasetChartConfig> = {}): DatasetChartConfig {
  return {
    ...baseChart(props),
    type: ChartType.lineChart,
    xAxis: props.xAxis || makeAxis(null, BinType.uniqueBin),
    yAxis: props.yAxis || makeAxis(null, 'count'),
    groupBy: props.groupBy || makeAxis(null, BinType.uniqueBin),
    // 0 = no top-N truncation (line charts show the full series)
    numGroups: props.numGroups ?? 0,
    title: props.title || 'Line chart'
  };
}

export function createHeatmapChart(props: Partial<DatasetChartConfig> = {}): DatasetChartConfig {
  return {
    ...baseChart(props),
    type: ChartType.heatmapChart,
    xAxis: props.xAxis || makeAxis(null, BinType.uniqueBin),
    yAxis: props.yAxis || makeAxis(null, BinType.uniqueBin),
    value: props.value || makeAxis(null, 'count'),
    numGroups: props.numGroups ?? DEFAULT_NUM_GROUPS,
    title: props.title || 'Heatmap',
    chartDisplay: {
      colorRange: getDefaultHeatmapColorRange(),
      ...props.chartDisplay
    }
  };
}

export function createPivotTableChart(props: Partial<DatasetChartConfig> = {}): DatasetChartConfig {
  return {
    ...baseChart(props),
    type: ChartType.pivotTable,
    xAxis: props.xAxis || makeAxis(null, BinType.uniqueBin),
    yAxis: props.yAxis || makeAxis(null, BinType.uniqueBin),
    value: props.value || makeAxis(null, 'count'),
    numGroups: props.numGroups ?? DEFAULT_NUM_GROUPS,
    title: props.title || 'Pivot table'
  };
}

export function createLayerChart(
  layerId: string,
  layerChartType: LayerChartType,
  props: Partial<LayerChartConfig> = {}
): LayerChartConfig {
  return {
    ...baseChart(props),
    type: ChartType.layerChart,
    layerId,
    layerChartType,
    dataId: props.dataId ?? null,
    axis: props.axis || makeAxis(null, BinType.uniqueBin),
    xAxis: props.xAxis || makeAxis(null, BinType.timeBin),
    yAxis: props.yAxis || makeAxis(null, 'count'),
    title:
      props.title ||
      (layerChartType === LayerChartType.TIME_SERIES ? 'Time series' : 'Category breakdown'),
    chartDisplay: {
      idField: props.chartDisplay?.idField ?? null,
      numEntries: props.chartDisplay?.numEntries ?? 5,
      // Leave unset so aggregation auto-picks hour/day/week/month/year from the span.
      interval: props.chartDisplay?.interval,
      ...props.chartDisplay
    }
  };
}

function firstField(
  dataset: ChartableDataset | undefined,
  types: string[],
  skipName?: string | null
): {name: string; type: string} | null {
  const field = dataset?.fields.find(
    f => types.includes(f.type) && (!skipName || f.name !== skipName)
  );
  return field ? {name: field.name, type: field.type} : null;
}

export function createChart(args: {
  type: ChartType | LayerChartType;
  dataId?: string | null;
  dataset?: ChartableDataset;
  layerId?: string;
  options?: {activateConfig?: boolean};
}): ChartConfig | null {
  const {type, dataId, dataset, layerId, options} = args;
  const categorical = firstField(dataset, CATEGORICAL_FIELD_TYPES);
  const numeric = firstField(dataset, NUMERIC_FIELD_TYPES);
  const temporal = firstField(dataset, TIME_FIELD_TYPES);
  const categoricalY =
    firstField(dataset, CATEGORICAL_FIELD_TYPES, categorical?.name) || categorical;
  const display = {isConfigActive: options?.activateConfig ?? false};

  switch (type) {
    case ChartType.bigNumber:
      return createBigNumberChart({
        dataId: dataId ?? dataset?.id ?? null,
        title: dataset ? `Count of rows in ${dataset.label || dataset.id}` : 'Count of rows',
        axis: makeAxis(null, 'count'),
        display
      });
    case ChartType.barChart:
      return createBarChart({
        dataId: dataId ?? dataset?.id ?? null,
        xAxis: makeAxis(categorical, BinType.uniqueBin),
        yAxis: makeAxis(null, 'count'),
        title: categorical ? `Count by ${categorical.name}` : 'Bar chart',
        display
      });
    case ChartType.horizontalBar:
      return createHorizontalBarChart({
        dataId: dataId ?? dataset?.id ?? null,
        xAxis: makeAxis(null, 'count'),
        yAxis: makeAxis(categorical, BinType.uniqueBin),
        title: categorical ? `Count by ${categorical.name}` : 'Horizontal bar',
        display
      });
    case ChartType.lineChart:
      return createLineChart({
        dataId: dataId ?? dataset?.id ?? null,
        xAxis: makeAxis(temporal || categorical, temporal ? BinType.timeBin : BinType.uniqueBin),
        yAxis: makeAxis(numeric, numeric ? 'sum' : 'count'),
        title: 'Line chart',
        display
      });
    case ChartType.heatmapChart:
      return createHeatmapChart({
        dataId: dataId ?? dataset?.id ?? null,
        xAxis: makeAxis(categorical, BinType.uniqueBin),
        yAxis: makeAxis(categoricalY, BinType.uniqueBin),
        value: makeAxis(numeric, numeric ? 'sum' : 'count'),
        title: 'Heatmap',
        display
      });
    case ChartType.pivotTable:
      return createPivotTableChart({
        dataId: dataId ?? dataset?.id ?? null,
        xAxis: makeAxis(categorical, BinType.uniqueBin),
        yAxis: makeAxis(categoricalY, BinType.uniqueBin),
        value: makeAxis(numeric, numeric ? 'sum' : 'count'),
        title: 'Pivot table',
        display
      });
    case LayerChartType.BREAKDOWN_BY_CATEGORY:
    case LayerChartType.TIME_SERIES:
      if (!layerId) {
        return null;
      }
      return createLayerChart(layerId, type, {
        dataId: dataId ?? dataset?.id ?? null,
        axis: makeAxis(categorical, BinType.uniqueBin),
        xAxis: makeAxis(temporal, BinType.timeBin),
        yAxis: makeAxis(numeric, numeric ? 'sum' : 'count'),
        display
      });
    default:
      return null;
  }
}

export function serializeCharts(charts: ChartConfig[]): ChartConfig[] {
  return charts.map(chart => ({
    ...chart,
    display: {
      ...chart.display,
      isConfigActive: false
    }
  }));
}

/**
 * Rebuild field-bearing axes for a new dataset (or layer) so stale names like
 * `Join_Count` are not looked up row-by-row on a table that does not have them.
 */
export function propsForChartDatasetChange(
  chart: ChartConfig,
  dataset: ChartableDataset | null | undefined,
  next: {dataId?: string | null; layerId?: string}
): Partial<ChartConfig> {
  const dataId = next.dataId ?? chart.dataId ?? null;
  const layerId = next.layerId ?? (isLayerChartConfig(chart) ? chart.layerId : undefined);
  const type = isLayerChartConfig(chart) ? chart.layerChartType : chart.type;
  const rebuilt = createChart({
    type,
    dataId,
    dataset: dataset || undefined,
    layerId,
    options: {activateConfig: chart.display?.isConfigActive}
  });
  const crossFilter = chart.crossFilter
    ? {...chart.crossFilter, enabled: false, value: {}, fieldNames: {}}
    : undefined;
  if (!rebuilt) {
    return {
      dataId,
      ...(layerId ? {layerId} : {}),
      xAxis: makeAxis(null),
      yAxis: makeAxis(null),
      axis: makeAxis(null),
      groupBy: makeAxis(null),
      value: makeAxis(null),
      crossFilter
    };
  }
  return {
    ...rebuilt,
    id: chart.id,
    pinned: chart.pinned,
    applyFilters: chart.applyFilters,
    display: chart.display,
    title: chart.title,
    dataId,
    ...(layerId ? {layerId} : {}),
    chartDisplay: {
      ...rebuilt.chartDisplay,
      format: chart.chartDisplay?.format,
      color: chart.chartDisplay?.color,
      colorRange: chart.chartDisplay?.colorRange,
      showCaption: chart.chartDisplay?.showCaption
    },
    crossFilter
  };
}
