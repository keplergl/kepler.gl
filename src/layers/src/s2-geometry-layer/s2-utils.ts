// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import Long from 'long';
import {S2} from 's2-geometry';

const MAXIMUM_TOKEN_LENGTH = 16;

/**
 * Retrieve S2 geometry center
 * @param s2Token string | number
 * @return {*[]}
 */
export function getS2Center(s2Token) {
  const paddedToken = s2Token.toString().padEnd(MAXIMUM_TOKEN_LENGTH, '0');
  const s2Id = Long.fromString(paddedToken, MAXIMUM_TOKEN_LENGTH);
  const {lat, lng} = S2.idToLatLng(s2Id.toString());
  return [lng, lat];
}

const re = new RegExp('^[0-9a-z]*$', 'g');
// simple test to see if token only contains numbers and letters
export function validS2Token(token) {
  return typeof token === 'string' && Boolean(token.match(re));
}
