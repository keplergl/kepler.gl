// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {generateHashId} from '@kepler.gl/common-utils';
import {ALL_FIELD_TYPES} from '@kepler.gl/constants';
import {Field, ProtoDataset} from '@kepler.gl/types';

import {copyFieldAs, makeResultProtoDataset, uniqueColumnName} from './proto-dataset';
import {findFieldByName, rowCount, rowValue} from './table-helpers';
import {
  DataStandardization,
  DatasetOpsTable,
  DEFAULT_SUITABILITY_SCORE_FIELD,
  DEFAULT_SUITABILITY_WEIGHT,
  SuitabilityDatasetConfig,
  WeightStandardization
} from './types';

const SCORABLE_FIELD_TYPES = new Set<string>([ALL_FIELD_TYPES.integer, ALL_FIELD_TYPES.real]);

/** Only plain numeric columns can carry a suitability weight. */
export function isSuitabilityWeightField(field: {type?: string}): boolean {
  return Boolean(field.type && SCORABLE_FIELD_TYPES.has(field.type));
}

export function defaultSuitabilityWeights(fields: Field[]): Record<string, number> {
  const weights: Record<string, number> = {};
  fields.forEach(field => {
    if (isSuitabilityWeightField(field)) {
      weights[field.name] = DEFAULT_SUITABILITY_WEIGHT;
    }
  });
  return weights;
}

function toNumber(value: unknown): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === 'bigint') {
    return Number(value);
  }
  return null;
}

function rangeStandardize(values: (number | null)[]): (number | null)[] {
  let min = Infinity;
  let max = -Infinity;
  for (const value of values) {
    if (value === null) continue;
    if (value < min) min = value;
    if (value > max) max = value;
  }
  const span = max - min;
  if (!Number.isFinite(span) || span === 0) {
    return values;
  }
  return values.map(value => (value === null ? null : (value - min) / span));
}

function zStandardize(values: (number | null)[]): (number | null)[] {
  const defined = values.filter((value): value is number => value !== null);
  if (!defined.length) {
    return values;
  }
  const mean = defined.reduce((sum, value) => sum + value, 0) / defined.length;
  const variance = defined.reduce((sum, value) => sum + (value - mean) ** 2, 0) / defined.length;
  // Studio divides by the variance here, which does not produce a z-score.
  const deviation = Math.sqrt(variance);
  if (deviation === 0) {
    return values;
  }
  return values.map(value => (value === null ? null : (value - mean) / deviation));
}

export function standardizeColumn(
  values: (number | null)[],
  method: DataStandardization
): (number | null)[] {
  switch (method) {
    case 'range':
      return rangeStandardize(values);
    case 'zScore':
      return zStandardize(values);
    default:
      return values;
  }
}

export function standardizeWeights(weights: number[], method: WeightStandardization): number[] {
  if (method !== 'normalize') {
    return weights;
  }
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  return total === 0 ? weights : weights.map(weight => weight / total);
}

/**
 * Scores every row as the weighted sum of its standardized values, and returns the source
 * columns plus the score as a new dataset. A row scores null when any weighted value is
 * missing, so partial rows do not masquerade as low scores.
 */
export function suitabilityDataset(
  dataset: DatasetOpsTable,
  config: SuitabilityDatasetConfig
): ProtoDataset {
  const weightEntries = Object.entries(config.weights || {});
  if (!weightEntries.length) {
    throw new Error('Select at least one field to score');
  }

  const weightedFields = weightEntries.map(([fieldName, weight]) => {
    const field = findFieldByName(dataset.fields, fieldName);
    if (!field) {
      throw new Error(`Suitability field "${fieldName}" was not found`);
    }
    if (!isSuitabilityWeightField(field)) {
      throw new Error(`Suitability field "${fieldName}" is not numeric`);
    }
    return {field, weight};
  });

  const n = rowCount(dataset);
  const dataStandardization = config.dataStandardization || 'range';
  const standardized = weightedFields.map(({field}) =>
    standardizeColumn(
      Array.from({length: n}, (_, i) => toNumber(rowValue(dataset, i, field))),
      dataStandardization
    )
  );
  const weights = standardizeWeights(
    weightedFields.map(({weight}) => weight),
    config.weightStandardization || 'normalize'
  );

  const scores: (number | null)[] = Array.from({length: n}, (_, row) => {
    let score = 0;
    for (let col = 0; col < standardized.length; col++) {
      const value = standardized[col][row];
      if (value === null) {
        return null;
      }
      score += value * weights[col];
    }
    return score;
  });

  const includedFields =
    config.columns === undefined
      ? dataset.fields
      : dataset.fields.filter(field => config.columns?.includes(field.name));

  const usedNames = new Set<string>();
  const fields = includedFields.map(field =>
    copyFieldAs(field, uniqueColumnName(field.name, usedNames))
  );
  fields.push({
    name: uniqueColumnName(config.outputFieldName || DEFAULT_SUITABILITY_SCORE_FIELD, usedNames),
    type: ALL_FIELD_TYPES.real,
    analyzerType: ALL_FIELD_TYPES.real
  });

  const rows = Array.from({length: n}, (_, row) => [
    ...includedFields.map(field => rowValue(dataset, row, field)),
    scores[row]
  ]);

  return makeResultProtoDataset({
    source: dataset,
    type: 'suitability',
    operationId: config.operationId || generateHashId(6),
    label: config.label || `suitability-${config.resultId || generateHashId(6)}`,
    resultId: config.resultId,
    fields,
    rows
  });
}
