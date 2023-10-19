// Copyright (c) 2023 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import {
  ListVector,
  FloatVector,
  Float64Vector,
  Column as ArrowColumn,
  FixedSizeListVector
} from 'apache-arrow';
import normalize from '@mapbox/geojson-normalize';
import {BinaryFeatures} from '@loaders.gl/schema';
import {parseSync} from '@loaders.gl/core';
import {WKBLoader, WKTLoader} from '@loaders.gl/wkt';
import {binaryToGeometry} from '@loaders.gl/gis';
import {
  Feature,
  MultiPolygon,
  Position,
  Polygon,
  MultiPoint,
  Point,
  MultiLineString,
  LineString
} from 'geojson';

type RawArrowFeature = {
  encoding?: string;
  data: any;
};

export enum GEOARROW_ENCODINGS {
  MULTI_POLYGON = 'geoarrow.multipolygon',
  POLYGON = 'geoarrow.polygon',
  MULTI_LINESTRING = 'geoarrow.multilinestring',
  LINESTRING = 'geoarrow.linestring',
  MULTI_POINT = 'geoarrow.multipoint',
  POINT = 'geoarrow.point',
  WKB = 'geoarrow.wkb',
  WKT = 'geoarrow.wkt'
}

export const GEOARROW_COLUMN_METADATA_KEY = 'ARROW:extension:name';

/**
 * get geoarrow encoding from geoarrow column
 */
function getGeoArrowEncoding(column: ArrowColumn): string {
  const {metadata} = column;
  if (metadata && metadata.get(GEOARROW_COLUMN_METADATA_KEY)) {
    return metadata.get(GEOARROW_COLUMN_METADATA_KEY) || '';
  }
  return '';
}

/**
 *  update bounds from geoarrow samples
 *
 * @param flatCoords the flattend coordinates array from one chunk of geoarrow column
 * @param nDim the number of dimensions of the coordinates
 * @param bounds the bounds to be updated
 * @param sampleSize how many samples to be used to update the bounds, default is 1000 per chunk
 */
function updateBoundsFromGeoArrowSamples(
  flatCoords: Float64Array,
  nDim: number,
  bounds: [number, number, number, number],
  sampleSize: number = 1000
) {
  const numberOfFeatures = flatCoords.length / nDim;
  const sampleStep = Math.max(Math.floor(numberOfFeatures / sampleSize), 1);

  for (let i = 0; i < numberOfFeatures; i += sampleStep) {
    const lng = flatCoords[i * nDim];
    const lat = flatCoords[i * nDim + 1];
    if (lng < bounds[0]) {
      bounds[0] = lng;
    }
    if (lat < bounds[1]) {
      bounds[1] = lat;
    }
    if (lng > bounds[2]) {
      bounds[2] = lng;
    }
    if (lat > bounds[3]) {
      bounds[3] = lat;
    }
  }
}

// binary geometry template, see deck.gl BinaryGeometry
const BINARY_GEOMETRY_TEMPLATE = {
  globalFeatureIds: {value: new Uint32Array(0), size: 1},
  positions: {value: new Float32Array(0), size: 2},
  properties: [],
  numericProps: {},
  featureIds: {value: new Uint32Array(0), size: 1}
};

/**
 * get binary polygons from geoarrow polygon column
 * @param chunk the data of one chunk of geoarrow polygon column
 * @param geoEncoding the geo encoding of the geoarrow polygon column
 * @returns
 */
function getBinaryPolygonsFromChunk(chunk: ListVector, geoEncoding: string) {
  const isMultiPolygon = geoEncoding === GEOARROW_ENCODINGS.MULTI_POLYGON;

  const polygonData = isMultiPolygon ? chunk.getChildAt(0) : chunk;
  const ringData = polygonData?.getChildAt(0) as ListVector;
  const pointData = ringData?.getChildAt(0);
  const coordData = pointData?.getChildAt(0) as ListVector;

  const nDim = pointData?.type.listSize || 2;
  const geomOffset = ringData?.valueOffsets;
  const flatCoordinateArray = coordData.values as Float64Array;

  const geometryIndicies = new Uint16Array(chunk.length + 1);
  for (let i = 0; i < chunk.length; i++) {
    geometryIndicies[i] = geomOffset[chunk.valueOffsets[i]];
  }
  geometryIndicies[chunk.length] = flatCoordinateArray.length / nDim;

  const numOfVertices = flatCoordinateArray.length / nDim;
  const featureIds = new Uint32Array(numOfVertices);
  for (let i = 0; i < chunk.length - 1; i++) {
    const startIdx = geomOffset[chunk.valueOffsets[i]];
    const endIdx = geomOffset[chunk.valueOffsets[i + 1]];
    for (let j = startIdx; j < endIdx; j++) {
      featureIds[j] = i;
    }
  }

  return {
    featureIds,
    flatCoordinateArray,
    nDim,
    geomOffset,
    geometryIndicies
  };
}

function getBinaryLinesFromChunk(chunk: ListVector, geoEncoding: string) {
  const isMultiLineString = geoEncoding === GEOARROW_ENCODINGS.MULTI_LINESTRING;

  const lineData = (isMultiLineString ? chunk.getChildAt(0) : chunk) as ListVector;
  const pointData = lineData?.getChildAt(0);
  const coordData = pointData?.getChildAt(0) as Float64Vector;

  const nDim = pointData?.type.listSize || 2;
  const geomOffset = lineData?.valueOffsets;
  const flatCoordinateArray = coordData.values as Float64Array;

  const geometryIndicies = new Uint16Array(0);

  const numOfVertices = flatCoordinateArray.length / nDim;
  const featureIds = new Uint32Array(numOfVertices);
  for (let i = 0; i < chunk.length; i++) {
    const startIdx = geomOffset[i];
    const endIdx = geomOffset[i + 1];
    for (let j = startIdx; j < endIdx; j++) {
      featureIds[j] = i;
    }
  }

  return {
    featureIds,
    flatCoordinateArray,
    nDim,
    geomOffset,
    geometryIndicies
  };
}

function getBinaryPointsFromChunk(chunk: ListVector, geoEncoding: string) {
  const isMultiPoint = geoEncoding === GEOARROW_ENCODINGS.MULTI_POINT;

  const pointData = (isMultiPoint ? chunk.getChildAt(0) : chunk) as FixedSizeListVector;
  const coordData = pointData?.getChildAt(0) as ListVector;

  const nDim = pointData?.type.listSize || 2;
  const flatCoordinateArray = coordData.values as Float64Array;
  const geometryIndicies = new Uint16Array(0);

  const numOfVertices = flatCoordinateArray.length / nDim;
  const featureIds = new Uint32Array(numOfVertices);
  for (let i = 0; i < chunk.length; i++) {
    featureIds[i] = i;
  }

  return {
    featureIds,
    flatCoordinateArray,
    nDim,
    geomOffset: new Uint16Array(0),
    geometryIndicies
  };
}

function getBinaryGeometriesFromChunk(chunk: ListVector, geoEncoding: string) {
  if (geoEncoding === GEOARROW_ENCODINGS.POINT || geoEncoding === GEOARROW_ENCODINGS.MULTI_POINT) {
    return getBinaryPointsFromChunk(chunk, geoEncoding);
  } else if (
    geoEncoding === GEOARROW_ENCODINGS.LINESTRING ||
    geoEncoding === GEOARROW_ENCODINGS.MULTI_LINESTRING
  ) {
    return getBinaryLinesFromChunk(chunk, geoEncoding);
  } else if (
    geoEncoding === GEOARROW_ENCODINGS.POLYGON ||
    geoEncoding === GEOARROW_ENCODINGS.MULTI_POLYGON
  ) {
    return getBinaryPolygonsFromChunk(chunk, geoEncoding);
  }
  throw Error('invalid geoarrow encoding');
}

/**
 * get binary geometries from geoarrow column
 */
export function getBinaryGeometriesFromArrow(
  geoColumn: ArrowColumn
): {
  binaryGeometries: BinaryFeatures[];
  bounds: [number, number, number, number];
  featureTypes: {polygon: boolean; point: boolean; line: boolean};
} {
  const geoEncoding = getGeoArrowEncoding(geoColumn);
  const featureTypes = {
    polygon:
      geoEncoding === GEOARROW_ENCODINGS.MULTI_POLYGON ||
      geoEncoding === GEOARROW_ENCODINGS.POLYGON,
    point:
      geoEncoding === GEOARROW_ENCODINGS.MULTI_POINT || geoEncoding === GEOARROW_ENCODINGS.POINT,
    line:
      geoEncoding === GEOARROW_ENCODINGS.MULTI_LINESTRING ||
      geoEncoding === GEOARROW_ENCODINGS.LINESTRING
  };

  const chunks = geoColumn.chunks;
  const bounds: [number, number, number, number] = [Infinity, Infinity, -Infinity, -Infinity];
  let globalFeatureIdOffset = 0;
  const binaryGeometries: BinaryFeatures[] = [];

  for (let c = 0; c < chunks.length; c++) {
    const geometries = chunks[c] as ListVector;
    const {featureIds, flatCoordinateArray, nDim, geomOffset} = getBinaryGeometriesFromChunk(
      geometries,
      geoEncoding
    );

    const numOfVertices = flatCoordinateArray.length / nDim;
    const globalFeatureIds = new Uint32Array(numOfVertices);
    for (let i = 0; i < numOfVertices; i++) {
      globalFeatureIds[i] = featureIds[i] + globalFeatureIdOffset;
    }

    const binaryContent = {
      globalFeatureIds: {value: globalFeatureIds, size: 1},
      positions: {
        value: flatCoordinateArray,
        size: nDim
      },
      featureIds: {value: featureIds, size: 1},
      properties: [...Array(geometries.length).keys()].map(i => ({
        index: i + globalFeatureIdOffset
      }))
    };

    // TODO: check if chunks are sequentially accessed
    globalFeatureIdOffset += geometries.length;

    // NOTE: deck.gl defines the BinaryFeatures structure must have points, lines, polygons even if they are empty
    binaryGeometries.push({
      points: {
        type: 'Point',
        ...BINARY_GEOMETRY_TEMPLATE,
        ...(featureTypes.point ? binaryContent : {})
      },
      lines: {
        type: 'LineString',
        ...BINARY_GEOMETRY_TEMPLATE,
        ...(featureTypes.line ? binaryContent : {}),
        pathIndices: {value: featureTypes.line ? geomOffset : new Uint16Array(0), size: 1}
      },
      polygons: {
        type: 'Polygon',
        ...BINARY_GEOMETRY_TEMPLATE,
        ...(featureTypes.polygon ? binaryContent : {}),
        polygonIndices: {
          // TODO why deck.gl's tessellatePolygon performance is not good when using geometryIndicies
          // even when there is no hole in any polygon
          value: featureTypes.polygon ? geomOffset : new Uint16Array(0),
          size: 1
        },
        primitivePolygonIndices: {
          value: featureTypes.polygon ? geomOffset : new Uint16Array(0),
          size: 1
        }
      }
    });

    updateBoundsFromGeoArrowSamples(flatCoordinateArray, nDim, bounds);
  }

  return {binaryGeometries, bounds, featureTypes};
}

/**
 * parse geometry from arrow data that is returned from processArrowData()
 * NOTE: this function could be duplicated with the binaryToFeature() in deck.gl,
 * it is currently only used for picking because currently deck.gl returns only the index of the feature
 * So the following functions could be deprecated once deck.gl returns the feature directly for binary geojson layer
 *
 * @param rawData the raw geometry data returned from processArrowData, which is an object with two properties: encoding and data
 * @see processArrowData
 * @returns Feature or null
 */
export function parseGeometryFromArrow(rawData: RawArrowFeature): Feature | null {
  const encoding = rawData.encoding?.toLowerCase();
  const data = rawData.data;
  if (!encoding || !data) return null;

  let geometry;

  switch (encoding) {
    case GEOARROW_ENCODINGS.MULTI_POLYGON:
      geometry = arrowMultiPolygonToFeature(data);
      break;
    case GEOARROW_ENCODINGS.POLYGON:
      geometry = arrowPolygonToFeature(data);
      break;
    case GEOARROW_ENCODINGS.MULTI_POINT:
      geometry = arrowMultiPointToFeature(data);
      break;
    case GEOARROW_ENCODINGS.POINT:
      geometry = arrowPointToFeature(data);
      break;
    case GEOARROW_ENCODINGS.MULTI_LINESTRING:
      geometry = arrowMultiLineStringToFeature(data);
      break;
    case GEOARROW_ENCODINGS.LINESTRING:
      geometry = arrowLineStringToFeature(data);
      break;
    case GEOARROW_ENCODINGS.WKB: {
      return arrowWkbToFeature(data);
    }
    case GEOARROW_ENCODINGS.WKT: {
      return arrowWktToFeature(data);
    }
    default: {
      throw Error('GeoArrow encoding not supported');
    }
  }
  return {
    type: 'Feature',
    geometry,
    properties: {}
  };
}

/**
 * convert Arrow MultiPolygon to geojson Feature
 */
function arrowMultiPolygonToFeature(arrowMultiPolygon: ListVector): MultiPolygon {
  const multiPolygon: Position[][][] = [];
  for (let m = 0; m < arrowMultiPolygon.length; m++) {
    const arrowPolygon = arrowMultiPolygon.get(m);
    const polygon: Position[][] = [];
    for (let i = 0; arrowPolygon && i < arrowPolygon?.length; i++) {
      const arrowRing = arrowPolygon?.get(i);
      const ring: Position[] = [];
      for (let j = 0; arrowRing && j < arrowRing.length; j++) {
        const arrowCoord = arrowRing.get(j);
        const coord: Position = Array.from(arrowCoord);
        ring.push(coord);
      }
      polygon.push(ring);
    }
    multiPolygon.push(polygon);
  }
  const geometry: MultiPolygon = {
    type: 'MultiPolygon',
    coordinates: multiPolygon
  };
  return geometry;
}

/**
 * convert Arrow Polygon to geojson Feature
 */
function arrowPolygonToFeature(arrowPolygon: ListVector): Polygon {
  const polygon: Position[][] = [];
  for (let i = 0; arrowPolygon && i < arrowPolygon.length; i++) {
    const arrowRing = arrowPolygon.get(i);
    const ring: Position[] = [];
    for (let j = 0; arrowRing && j < arrowRing.length; j++) {
      const arrowCoord = arrowRing.get(j);
      const coords: Position = Array.from(arrowCoord);
      ring.push(coords);
    }
    polygon.push(ring);
  }
  const geometry: Polygon = {
    type: 'Polygon',
    coordinates: polygon
  };
  return geometry;
}

/**
 * convert Arrow MultiPoint to geojson MultiPoint
 */
function arrowMultiPointToFeature(arrowMultiPoint: ListVector): MultiPoint {
  const multiPoint: Position[] = [];
  for (let i = 0; arrowMultiPoint && i < arrowMultiPoint.length; i++) {
    const arrowPoint = arrowMultiPoint.get(i);
    if (arrowPoint) {
      const coord: Position = Array.from(arrowPoint);
      multiPoint.push(coord);
    }
  }
  const geometry: MultiPoint = {
    type: 'MultiPoint',
    coordinates: multiPoint
  };
  return geometry;
}

/**
 * convert Arrow Point to geojson Point
 */
function arrowPointToFeature(arrowPoint: FloatVector): Point {
  const point: Position = Array.from(arrowPoint.values);
  const geometry: Point = {
    type: 'Point',
    coordinates: point
  };
  return geometry;
}

/**
 * convert Arrow MultiLineString to geojson MultiLineString
 */
function arrowMultiLineStringToFeature(arrowMultiLineString: ListVector): MultiLineString {
  const multiLineString: Position[][] = [];
  for (let i = 0; arrowMultiLineString && i < arrowMultiLineString.length; i++) {
    const arrowLineString = arrowMultiLineString.get(i);
    const lineString: Position[] = [];
    for (let j = 0; arrowLineString && j < arrowLineString.length; j++) {
      const arrowCoord = arrowLineString.get(j);
      if (arrowCoord) {
        const coords: Position = Array.from(arrowCoord);
        lineString.push(coords);
      }
    }
    multiLineString.push(lineString);
  }
  const geometry: MultiLineString = {
    type: 'MultiLineString',
    coordinates: multiLineString
  };
  return geometry;
}

/**
 * convert Arrow LineString to geojson LineString
 */
function arrowLineStringToFeature(arrowLineString: ListVector): LineString {
  const lineString: Position[] = [];
  for (let i = 0; arrowLineString && i < arrowLineString.length; i++) {
    const arrowCoord = arrowLineString.get(i);
    if (arrowCoord) {
      const coords: Position = Array.from(arrowCoord);
      lineString.push(coords);
    }
  }
  const geometry: LineString = {
    type: 'LineString',
    coordinates: lineString
  };
  return geometry;
}

/**
 * convert Arrow wkb to geojson Geometry
 */
function arrowWkbToFeature(arrowWkb: Uint8Array): Feature | null {
  const binaryGeo = parseSync(arrowWkb, WKBLoader);
  const geometry = binaryToGeometry(binaryGeo);
  const normalized = normalize(geometry);

  if (!normalized || !Array.isArray(normalized.features)) {
    // fail to normalize geojson
    return null;
  }

  return normalized.features[0];
}

/**
 * convert Arrow wkt to geojson Geometry
 */
function arrowWktToFeature(arrowWkt: string): Feature | null {
  const geometry = parseSync(arrowWkt, WKTLoader);
  const normalized = normalize(geometry);

  if (!normalized || !Array.isArray(normalized.features)) {
    // fail to normalize geojson
    return null;
  }

  return normalized.features[0];
}
