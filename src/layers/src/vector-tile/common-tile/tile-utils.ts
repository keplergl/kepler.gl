// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {DomainStops, Field as KeplerField} from '@kepler.gl/types';
import {DomainQuantiles} from '@kepler.gl/utils';

// helper functions
export function isDomainStops(domain: unknown): domain is DomainStops {
  return (
    typeof domain === 'object' &&
    domain !== null &&
    Array.isArray((domain as any).stops) &&
    Array.isArray((domain as any).z)
  );
}

export function isDomainQuantiles(domain: unknown): domain is DomainQuantiles {
  return (
    typeof domain === 'object' &&
    domain !== null &&
    Array.isArray((domain as any).quantiles) &&
    Array.isArray((domain as any).z)
  );
}

export function isIndexedField(field?: KeplerField | null): boolean {
  return Boolean(field && field.indexBy);
}

/**
 * Remove null/0 values from the bottom of the quantiles. If the column has many nulls
 * or 0s at the bottom of the quantiles, it will wash out color scales and produce
 * meaningless "no value" legend entries. We want to keep the first 0 and no others.
 * Operates in place.
 */
export function pruneQuantiles(quantiles: number[]): void {
  const firstNonZeroIdx = quantiles.findIndex(d => d !== null && d !== 0);
  if (firstNonZeroIdx > 0) {
    quantiles.splice(0, firstNonZeroIdx - 1);
  }
}
