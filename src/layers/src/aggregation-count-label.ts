// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {DEFAULT_TEXT_LABEL} from '@kepler.gl/constants';
import {Field, LayerTextLabel} from '@kepler.gl/types';

/** Synthetic text-label field. Not a dataset column: it reads the bin point count. */
export const POINT_COUNT_FIELD_NAME = 'pointCount';

export const AGGREGATION_COUNT_LAYER_TYPES = new Set(['cluster', 'hexagon', 'grid']);

export const POINT_COUNT_CHARACTER_SET = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '.',
  'k',
  'm'
];

export type AggregationCountLabel = {
  position: [number, number];
  count: number;
};

export function createPointCountLabelField(): Field {
  return {
    name: POINT_COUNT_FIELD_NAME,
    displayName: 'Point Count',
    type: 'integer',
    fieldIdx: -1,
    format: '',
    analyzerType: 'INT',
    // Bin counts are read from aggregated cells, not from a dataset row.
    valueAccessor: () => null
  };
}

export function isPointCountLabel(
  textLabel: {field?: {name?: string; fieldIdx?: number} | null} | null | undefined
): boolean {
  const field = textLabel?.field;
  return Boolean(field && field.name === POINT_COUNT_FIELD_NAME && field.fieldIdx === -1);
}

/**
 * New cluster, hexbin, and grid layers label each shape with its point count.
 * Collision is on so a dense grid hides overlapping numbers. Anchor and
 * alignment center the number on the shape.
 */
export function defaultAggregationCountLabel(): LayerTextLabel {
  return {
    ...DEFAULT_TEXT_LABEL,
    field: createPointCountLabelField(),
    anchor: 'middle',
    alignment: 'center',
    collisionEnabled: true,
    // White glyphs need a halo to stay readable on both light and dark cells.
    outlineWidth: 1,
    outlineColor: [0, 0, 0, 255]
  };
}

/** Abbreviate like a cluster bubble: 999, 1.2k, 15k, 1.2m. */
export function formatPointCount(count: number): string {
  if (!Number.isFinite(count)) {
    return '';
  }
  const n = Math.round(count);
  const abs = Math.abs(n);
  if (abs < 1000) {
    return String(n);
  }
  if (abs < 10000) {
    return `${trimTrailingZero(Math.round(n / 100) / 10)}k`;
  }
  if (abs < 1000000) {
    return `${Math.round(n / 1000)}k`;
  }
  if (abs < 10000000) {
    return `${trimTrailingZero(Math.round(n / 100000) / 10)}m`;
  }
  return `${Math.round(n / 1000000)}m`;
}

function trimTrailingZero(value: number): string {
  const text = String(value);
  return text.endsWith('.0') ? text.slice(0, -2) : text;
}
