// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ChartConfig, LayerChartConfig} from '@kepler.gl/types';
import {GroupByOp, JoinOp, SpatialGeoSource} from '@kepler.gl/table';

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

function followNameList(
  names: string[] | undefined,
  renames: Record<string, string>,
  alive: Set<string>
): string[] | undefined {
  if (!names) {
    return names;
  }
  return names.flatMap(name => {
    const next = followFieldName(name, renames, alive);
    return next ? [next] : [];
  });
}

function followAggregations<T extends string>(
  aggregations: Record<string, T> | undefined,
  renames: Record<string, string>,
  alive: Set<string>,
  oldNames: Set<string>
): Record<string, T> {
  const next: Record<string, T> = {};
  Object.entries(aggregations || {}).forEach(([key, value]) => {
    if (!oldNames.has(key) && !renames[key]) {
      next[key] = value as T;
      return;
    }
    const name = renames[key] ?? key;
    if (alive.has(name)) {
      next[name] = value as T;
    }
  });
  return next;
}

function followGeo(
  geo: SpatialGeoSource | null | undefined,
  renames: Record<string, string>,
  alive: Set<string>
): SpatialGeoSource | null | undefined {
  if (!geo) {
    return geo;
  }
  if (geo.kind === 'latlng') {
    const latField = followFieldName(geo.latField, renames, alive);
    const lngField = followFieldName(geo.lngField, renames, alive);
    if (!latField || !lngField) {
      return null;
    }
    return latField === geo.latField && lngField === geo.lngField
      ? geo
      : {...geo, latField, lngField};
  }
  const fieldName = followFieldName(geo.fieldName, renames, alive);
  if (!fieldName) {
    return null;
  }
  return fieldName === geo.fieldName ? geo : {...geo, fieldName};
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

export function remapGroupBysForDataset(
  groupBys: GroupByOp[] | undefined,
  dataId: string,
  renames: Record<string, string>,
  alive: Set<string>,
  oldNames: Set<string>
): GroupByOp[] {
  return (groupBys || []).map(op => {
    if (op.dataId !== dataId) {
      return op;
    }
    return {
      ...op,
      fieldName: followFieldName(op.fieldName, renames, alive),
      aggregations: followAggregations(op.aggregations, renames, alive, oldNames)
    };
  });
}

export function remapJoinsForDataset(
  joins: JoinOp[] | undefined,
  dataId: string,
  renames: Record<string, string>,
  alive: Set<string>,
  oldNames: Set<string>
): JoinOp[] {
  return (joins || []).map(op => {
    let next = op;
    if (op.leftDataId === dataId) {
      next = {
        ...next,
        leftField: followFieldName(op.leftField, renames, alive),
        leftColumns: followNameList(op.leftColumns, renames, alive),
        leftGeo: followGeo(op.leftGeo, renames, alive)
      };
    }
    if (op.rightDataId === dataId) {
      next = {
        ...next,
        rightField: followFieldName(op.rightField, renames, alive),
        rightColumns: followNameList(op.rightColumns, renames, alive),
        rightGeo: followGeo(op.rightGeo, renames, alive),
        aggregations: followAggregations(op.aggregations, renames, alive, oldNames)
      };
    }
    return next;
  });
}
