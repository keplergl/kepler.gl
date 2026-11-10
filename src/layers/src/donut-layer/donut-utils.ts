// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {RGBColor} from '@kepler.gl/types';

export type DonutCategory = {field: string; label: string; color: RGBColor};
export type DonutComposition = {
  values: (number | null)[];
  shares: number[];
  total: number | null;
  status: 'valid' | 'empty' | 'missing' | 'invalid';
};

export const DONUT_COLORS: RGBColor[] = [
  [47, 107, 209],
  [246, 201, 62],
  [229, 113, 175],
  [46, 160, 137],
  [142, 108, 191],
  [230, 126, 64]
];
export const DONUT_NEUTRAL_COLOR: RGBColor = [150, 156, 166];

/** Keep saved field identity and order independent of data, filtering, and field indices. */
export function getDonutCategories(composition: unknown): DonutCategory[] {
  const categories = (composition as {categories?: unknown})?.categories;
  if (!Array.isArray(categories)) return [];
  const seen = new Set<string>();
  return categories
    .filter(category => {
      if (
        !category ||
        typeof category.field !== 'string' ||
        !category.field ||
        seen.has(category.field)
      ) {
        return false;
      }
      seen.add(category.field);
      return true;
    })
    .slice(0, DONUT_COLORS.length)
    .map((category, index) => ({
      field: category.field,
      label:
        typeof category.label === 'string' && category.label.trim()
          ? category.label
          : category.field,
      color:
        Array.isArray(category.color) &&
        category.color.length === 3 &&
        category.color.every(value => Number.isFinite(value) && value >= 0 && value <= 255)
          ? category.color
          : DONUT_COLORS[index]
    }));
}

/** Missing cells contribute zero; invalid values still prevent a meaningful denominator. */
export function getDonutComposition(raw: unknown[]): DonutComposition {
  let invalid = false;
  const values = raw.map(value => {
    if (value === null || value === undefined) {
      return 0;
    }
    const number = typeof value === 'bigint' ? Number(value) : value;
    if (typeof number !== 'number' || !Number.isFinite(number) || number < 0) {
      invalid = true;
      return null;
    }
    return number;
  });
  const sum = values.reduce<number>((total, value) => total + (value ?? 0), 0);
  invalid ||= !Number.isFinite(sum);
  const status = invalid ? 'invalid' : !raw.length ? 'missing' : sum === 0 ? 'empty' : 'valid';
  const total = status === 'missing' || status === 'invalid' ? null : sum;
  return {
    values,
    total,
    status,
    shares: values.map(value => (status === 'valid' ? (value ?? 0) / sum : 0))
  };
}

export function getDonutBoundaries(composition: DonutComposition): number[] {
  let sum = 0;
  return Array.from({length: 6}, (_, index) => {
    sum += composition.shares[index] ?? 0;
    return composition.status === 'valid' && index >= composition.shares.length - 1 ? 1 : sum;
  });
}
