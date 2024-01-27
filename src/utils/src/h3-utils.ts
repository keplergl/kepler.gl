// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {h3GetResolution, H3Index, h3IsValid, h3ToGeo, h3ToGeoBoundary} from 'h3-js';
import {ALL_FIELD_TYPES} from '@kepler.gl/constants';
import {notNullorUndefined} from './data-utils';

export {h3GetResolution, h3IsValid};

export type Centroid = [number, number];

// get vertices should return [lon, lat]
export function getVertices({id}: {id: H3Index}) {
  // always reverse it
  return h3ToGeoBoundary(id, true);
}

// get centroid should return [lon, lat]
export function getCentroid({id}: {id: H3Index}): Centroid {
  // always reverse it to [lng, lat]
  return h3ToGeo(id).reverse() as Centroid;
}

export function idToPolygonGeo(object?: {id: H3Index}, properties?: any) {
  if (!object?.id) {
    return null;
  }
  const vertices = getVertices(object);

  return {
    type: 'Feature',
    geometry: {
      coordinates: properties?.isClosed ? [vertices] : vertices,
      type: properties?.isClosed ? 'Polygon' : 'LineString'
    },
    properties
  };
}

export const isHexField = (field, fieldIdx, dataContainer) => {
  if (field.type !== ALL_FIELD_TYPES.string) {
    return false;
  }

  const firstDP = dataContainer.find(d => notNullorUndefined(d.valueAt(fieldIdx)), true);
  return firstDP && h3IsValid(firstDP.valueAt(fieldIdx));
};

export const getHexFields = (fields, dataContainer) =>
  fields.filter((f, i) => isHexField(f, i, dataContainer));
