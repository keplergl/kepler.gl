// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ChartConfig, LayerChartConfig} from '@kepler.gl/types';
import {ALL_FIELD_TYPES} from '@kepler.gl/constants';

type NamedAxis = {
  field?: {name: string; type?: string} | null;
  title?: string | null;
  aggregation?: string | null;
  interval?: string | null;
};

const BIN_AGGREGATIONS = new Set(['uniqueBin', 'numericBin', 'timeBin']);
const TIME_FIELD_TYPES = new Set<string>([ALL_FIELD_TYPES.timestamp, ALL_FIELD_TYPES.date]);

function binAggregationForType(type: string): string {
  if (TIME_FIELD_TYPES.has(type)) {
    return 'timeBin';
  }
  return type === ALL_FIELD_TYPES.real ? 'numericBin' : 'uniqueBin';
}

function followFieldName(
  name: string | null | undefined,
  renames: Record<string, string>,
  alive: ReadonlyMap<string, {type: string}>
): string | null {
  if (!name) {
    return null;
  }
  const next = renames[name] ?? name;
  return alive.has(next) ? next : null;
}

function followAxis<T extends NamedAxis>(
  axis: T | undefined,
  renames: Record<string, string>,
  alive: ReadonlyMap<string, {type: string}>
): T | undefined {
  if (!axis?.field?.name) {
    return axis;
  }
  const name = followFieldName(axis.field.name, renames, alive);
  if (!name) {
    return {...axis, field: null, title: null};
  }
  const field = alive.get(name);
  const typeChanged = field?.type !== axis.field.type;
  if (name === axis.field.name && !typeChanged) {
    return axis;
  }
  const aggregation =
    typeChanged && axis.aggregation && BIN_AGGREGATIONS.has(axis.aggregation)
      ? binAggregationForType(field?.type || '')
      : axis.aggregation;
  const clearInterval = typeChanged && aggregation !== 'timeBin' && axis.interval !== undefined;
  return {
    ...axis,
    field: {...axis.field, name, type: field?.type},
    title: axis.title === axis.field.name ? name : axis.title,
    aggregation,
    ...(clearInterval ? {interval: undefined} : {})
  };
}

function isLayerChart(chart: ChartConfig): chart is LayerChartConfig {
  return chart.type === 'layerChart';
}

export function remapChartsForDataset(
  charts: ChartConfig[] | undefined,
  dataId: string,
  renames: Record<string, string>,
  alive: ReadonlyMap<string, {type: string}>
): ChartConfig[] {
  return (charts || []).map(chart => {
    if (chart.dataId !== dataId) {
      return chart;
    }
    const source = chart as ChartConfig & {
      xAxis?: NamedAxis;
      yAxis?: NamedAxis;
      axis?: NamedAxis;
      groupBy?: NamedAxis;
      value?: NamedAxis;
    };
    const next: ChartConfig = {
      ...chart,
      xAxis: followAxis(source.xAxis, renames, alive),
      yAxis: followAxis(source.yAxis, renames, alive),
      axis: followAxis(source.axis, renames, alive),
      groupBy: followAxis(source.groupBy, renames, alive),
      value: followAxis(source.value, renames, alive)
    } as ChartConfig;

    if (chart.crossFilter?.fieldNames) {
      const fieldNames: Record<string, string> = {};
      Object.entries(chart.crossFilter.fieldNames).forEach(([key, value]) => {
        const name = followFieldName(value, renames, alive);
        if (name) {
          fieldNames[key] = name;
        }
      });
      next.crossFilter = {...chart.crossFilter, fieldNames};
    }

    if (isLayerChart(chart) && chart.chartDisplay?.idField) {
      next.chartDisplay = {
        ...chart.chartDisplay,
        idField: followFieldName(chart.chartDisplay.idField, renames, alive)
      };
    }
    return next;
  });
}
