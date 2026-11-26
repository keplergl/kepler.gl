// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import type {ProcessorResult} from '@kepler.gl/types';

/** Convert loader row objects to the representation used by the tabular processors. */
export function processObjectRows(
  rawData: unknown[],
  processor: (rows: unknown[][], header: string[]) => ProcessorResult
): ProcessorResult {
  if (!Array.isArray(rawData)) return null;
  if (!rawData.length) return {fields: [], rows: []};

  const keys = Object.keys(rawData[0] as Record<string, unknown>);
  const rows = rawData.map(d => keys.map(key => (d as Record<string, unknown>)[key]));
  return processor(rows, keys);
}
