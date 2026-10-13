// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ChartConfig, LayerChartConfig} from '@kepler.gl/types';

type NamedAxis = {
  field?: {name: string; type?: string} | null;
  title?: string | null;
};

function followFieldName(
  name: string | null | undefined,
  renames: Record<string, string>,
  alive: Set<string>
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
  alive: Set<string>
): T | undefined {
  if (!axis?.field?.name) {
    return axis;
  }
  const name = followFieldName(axis.field.name, renames, alive);
  if (!name) {
    return {...axis, field: null, title: null};
  }
  if (name === axis.field.name) {
    return axis;
  }
  return {
    ...axis,
    field: {...axis.field, name},
    title: axis.title === axis.field.name ? name : axis.title
  };
}

function isLayerChart(chart: ChartConfig): chart is LayerChartConfig {
  return chart.type === 'layerChart';
}

export function remapChartsForDataset(
  charts: ChartConfig[] | undefined,
  dataId: string,
  renames: Record<string, string>,
  alive: Set<string>
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
