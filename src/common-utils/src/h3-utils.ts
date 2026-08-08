// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {getResolution, isValidCell, cellToLatLng, cellToBoundary} from 'h3-js';
import type {H3Index} from 'h3-js';
import {ALL_FIELD_TYPES} from '@kepler.gl/constants';

export {getResolution, isValidCell};
export {getResolution as h3GetResolution, isValidCell as h3IsValid};

export type Centroid = [number, number];

// get vertices in [lon, lat] order via GeoJSON formatting
export function getVertices({id}: {id: H3Index}) {
  return cellToBoundary(id, true);
}

// get centroid should return [lon, lat]
export function getCentroid({id}: {id: H3Index}): Centroid {
  // always reverse it to [lng, lat]
  return cellToLatLng(id).reverse() as Centroid;
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

export const isHexField = (field, _fieldIdx, _dataContainer) => {
  return field.type === ALL_FIELD_TYPES.h3;
};

export const getHexFields = (fields, dataContainer) =>
  fields.filter((f, i) => isHexField(f, i, dataContainer));
