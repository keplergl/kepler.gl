// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// deck.gl-community
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

/**
 * Enum holding GeoArrow extension type names
 */
export enum EXTENSION_NAME {
  POINT = 'geoarrow.point',
  LINESTRING = 'geoarrow.linestring',
  POLYGON = 'geoarrow.polygon',
  MULTIPOINT = 'geoarrow.multipoint',
  MULTILINESTRING = 'geoarrow.multilinestring',
  MULTIPOLYGON = 'geoarrow.multipolygon',
  WKB = 'geoarrow.wkb'
}

export const DEFAULT_COLOR: [number, number, number, number] = [0, 0, 0, 255];
