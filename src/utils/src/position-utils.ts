// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {h3ToGeo} from 'h3-js';

import {LayerColumn} from '@kepler.gl/types';

import {DataContainerInterface} from './data-container-interface';

export function getPositionFromHexValue(token) {
  const pos = h3ToGeo(token);

  if (Array.isArray(pos) && pos.every(Number.isFinite)) {
    return [pos[1], pos[0]];
  }
  return null;
}

export function maybeHexToGeo(
  dc: DataContainerInterface,
  d: {index: number},
  lat: LayerColumn,
  lng: LayerColumn
) {
  // lat or lng column could be hex column
  // we assume string value is hex and try to convert it to geo lat lng
  const latVal = dc.valueAt(d.index, lat.fieldIdx);
  const lngVal = dc.valueAt(d.index, lng.fieldIdx);

  return typeof latVal === 'string'
    ? getPositionFromHexValue(latVal)
    : typeof lngVal === 'string'
    ? getPositionFromHexValue(lngVal)
    : null;
}
