// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import Long from 'long';
import {S2} from 's2-geometry';

const MAXIMUM_TOKEN_LENGTH = 16;

/**
 * Retrieve S2 geometry center
 * @param s2Token string | number
 * @return {[number, number] | null}
 */
export function getS2Center(s2Token): [number, number] | null {
  const cleaned = maybeStripQuotes(s2Token.toString());
  const paddedToken = cleaned.padEnd(MAXIMUM_TOKEN_LENGTH, '0');
  try {
    const s2Id = Long.fromString(paddedToken, MAXIMUM_TOKEN_LENGTH);
    const {lat, lng} = S2.idToLatLng(s2Id.toString());
    return [lng, lat];
  } catch (e) {
    return null;
  }
}

const re = /^[0-9a-z]+$/;

export function maybeStripQuotes(token: string): string {
  if (token.length >= 2) {
    const first = token[0];
    const last = token[token.length - 1];
    if ((first === "'" && last === "'") || (first === '"' && last === '"')) {
      return token.slice(1, -1);
    }
  }
  return token;
}

// S2 tokens must be at least 2 hex chars to encode face + level marker
export function validS2Token(token) {
  if (typeof token !== 'string') return false;
  const cleaned = maybeStripQuotes(token);
  return cleaned.length >= 2 && re.test(cleaned);
}
