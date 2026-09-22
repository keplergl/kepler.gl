// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ChartableDataset} from './types';

/**
 * Adapt a KeplerTable-like dataset to the chart aggregation interface.
 * Pass `filteredIndex` to override the table's CPU-only filteredIndex (e.g. with
 * GPU range/time filters applied the same way map layers do).
 */
export function toChartableDataset(
  dataset: any,
  options?: {filteredIndex?: number[]}
): ChartableDataset | null {
  if (!dataset?.id || typeof dataset.getValue !== 'function') {
    return null;
  }
  return {
    id: dataset.id,
    label: dataset.label,
    color: dataset.color,
    allIndexes: dataset.allIndexes || [],
    filteredIndex: options?.filteredIndex ?? dataset.filteredIndex ?? dataset.allIndexes ?? [],
    fields: dataset.fields || [],
    getValue: (fieldName, rowIdx) => dataset.getValue(fieldName, rowIdx)
  };
}
