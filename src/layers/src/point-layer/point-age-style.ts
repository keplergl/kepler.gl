// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import type {Field, RGBColor} from '@kepler.gl/types';

export type PointAgeStyle = {
  timeField: string;
  stops: {ageMs: number; opacity?: number; color?: RGBColor}[];
};

/** Saved maps can bypass MCP validation. Ignore incomplete or invalid styles. */
export function isPointAgeStyle(value: Partial<PointAgeStyle> | null): value is PointAgeStyle {
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

type ColorAccessor = number[] | ((row: {index: number}) => number[]);

/** Pure data-time calculation, shared by live rendering and native export.
 * Each stop owns [ageMs, nextAgeMs); its omitted channels keep the base style.
 * No wall clock or accumulated playback state is involved, so seeking is exact.
 */
export function ageStyleColorAccessor(
  base: ColorAccessor,
  style: PointAgeStyle,
  field: Field,
  currentTime: number,
  highlight = false
): (row: {index: number}) => number[] {
  return row => {
    const color = typeof base === 'function' ? base(row) : base;
    const timestamp = field.valueAccessor(row);
    if (!Number.isFinite(timestamp) || (timestamp as number) > currentTime) {
      return [color[0], color[1], color[2], 0];
    }
    const age = currentTime - (timestamp as number);
    // Binary search avoids scanning every stop for each point on every frame.
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
