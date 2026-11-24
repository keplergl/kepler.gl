// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {FILTER_TYPES} from '@kepler.gl/constants';
import type {Filter, RGBColor, TimeRangeFilter} from '@kepler.gl/types';

export type LayerAgeStyle = {
  timeField: string;
  stops: {ageMs: number; opacity?: number; color?: RGBColor}[];
};

/** Saved maps can bypass MCP validation. Ignore incomplete or invalid styles. */
export function isLayerAgeStyle(input: unknown): input is LayerAgeStyle {
  const value = input as Partial<LayerAgeStyle> | null;
  return Boolean(
    value &&
      typeof value.timeField === 'string' &&
      value.timeField.trim() &&
      Array.isArray(value.stops) &&
      value.stops.length &&
      value.stops.every(
        (stop, index, stops) =>
          stop &&
          Number.isFinite(stop.ageMs) &&
          (index === 0 ? stop.ageMs === 0 : stop.ageMs > stops[index - 1].ageMs) &&
          (stop.opacity !== undefined || stop.color !== undefined) &&
          (stop.opacity === undefined ||
            (Number.isFinite(stop.opacity) && stop.opacity >= 0 && stop.opacity <= 1)) &&
          (stop.color === undefined ||
            (Array.isArray(stop.color) &&
              stop.color.length === 3 &&
              stop.color.every(
                channel => Number.isInteger(channel) && channel >= 0 && channel <= 255
              )))
      )
  );
}

export type ColorAccessor = number[] | ((row: any) => number[]);

/** Pure data-time calculation, shared by live rendering and native export.
 * Each stop owns [ageMs, nextAgeMs); its omitted channels keep the base style.
 * No wall clock or accumulated playback state is involved, so seeking is exact.
 */
export function ageStyleColorAccessor(
  base: ColorAccessor,
  style: LayerAgeStyle,
  getTimestamp: (row: any) => unknown,
  currentTime: number,
  highlight = false
): (row: any) => number[] {
  return row => {
    const color = typeof base === 'function' ? base(row) : base;
    const timestamp = getTimestamp(row);
    if (!Number.isFinite(timestamp) || (timestamp as number) > currentTime) {
      return [color[0], color[1], color[2], 0];
    }
    const age = currentTime - (timestamp as number);
    // Binary search avoids scanning every stop for each feature on every frame.
    let low = 0;
    let high = style.stops.length;
    while (low + 1 < high) {
      const mid = Math.floor((low + high) / 2);
      if (style.stops[mid].ageMs <= age) low = mid;
      else high = mid;
    }
    const stop = style.stops[low];
    const rgb = !highlight && stop.color ? stop.color : color;
    return [rgb[0], rgb[1], rgb[2], (color[3] ?? 255) * (stop.opacity ?? 1)];
  };
}

export const AGE_STYLE_LAYER_TYPES = [
  'point',
  'arc',
  'line',
  'icon',
  'hexagonId',
  's2',
  'a5',
  'geohash',
  'geojson'
];

export function getLayerDataTime(
  dataId: string | null,
  timeField: string,
  filters: Filter[] = []
): number | null {
  if (!dataId || !timeField) return null;
  const filter = filters.find((candidate): candidate is TimeRangeFilter => {
    const index = candidate.dataId.indexOf(dataId);
    return (
      candidate.type === FILTER_TYPES.timeRange &&
      candidate.enabled !== false &&
      index >= 0 &&
      candidate.name[index] === timeField
    );
  });
  const value = filter?.value;
  return Array.isArray(value) &&
    value.length === 2 &&
    value.every(Number.isFinite) &&
    value[1] >= value[0]
    ? value[1]
    : null;
}

/** One frame and a fixed set of channels: paused renders keep accessor identities,
 * without retaining a history of playheads, datasets or authored configurations. */
export class AgeStyleAccessorCache {
  private dependencies: unknown[] = [];
  private channels = new Map<string, {base: ColorAccessor; accessor: (row: any) => number[]}>();

  update(dependencies: unknown[]) {
    if (
      dependencies.length !== this.dependencies.length ||
      dependencies.some((value, index) => value !== this.dependencies[index])
    ) {
      this.dependencies = dependencies;
      this.channels.clear();
    }
  }

  get(
    key: string,
    base: ColorAccessor,
    style: LayerAgeStyle,
    getTimestamp: (row: any) => unknown,
    time: number,
    highlight = false
  ): (row: any) => number[] {
    const previous = this.channels.get(key);
    if (previous?.base === base) return previous.accessor;
    const accessor = ageStyleColorAccessor(base, style, getTimestamp, time, highlight);
    this.channels.set(key, {base, accessor});
    return accessor;
  }
}
