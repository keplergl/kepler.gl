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

import {ListVector, Float64Vector, Column as ArrowColumn} from 'apache-arrow';
import {BinaryFeatures} from '@loaders.gl/schema';

export enum GEOARROW_ENCODINGS {
  MULTI_POLYGON = 'geoarrow.multipolygon',
  POLYGON = 'geoarrow.polygon',
  MULTI_LINESTRING = 'geoarrow.multilinestring',
  LINESTRING = 'geoarrow.linestring',
  MULTI_POINT = 'geoarrow.multipoint',
  POINT = 'geoarrow.point'
}

/**
 * get geoarrow encoding from geoarrow column
 */
function getGeoArrowEncoding(column: ArrowColumn): string {
  const {metadata} = column;
  if (metadata && metadata.get('ARROW:extension:name')) {
    return metadata.get('ARROW:extension:name') || '';
  }
  return '';
}

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

const BINARY_GEOMETRY_TEMPLATE = {
  globalFeatureIds: {value: new Uint32Array(0), size: 1},
  positions: {value: new Float32Array(0), size: 2},
  properties: [],
  numericProps: {},
  featureIds: {value: new Uint32Array(0), size: 1}
};

function getBinaryPolygonsFromChunk(chunk: ListVector, geoEncoding: string) {
  const isMultiPolygon = geoEncoding === GEOARROW_ENCODINGS.MULTI_POLYGON;

  const polygonData = isMultiPolygon ? chunk.getChildAt(0) : chunk;
  const ringData = polygonData?.getChildAt(0) as ListVector;
  const pointData = ringData?.getChildAt(0);
  const coordData = pointData?.getChildAt(0) as ListVector;

  const nDim = pointData?.type.listSize || 2;
  const geomOffset = ringData?.valueOffsets;
  const flatCoordinateArray = coordData.values as Float64Array;

  return {
    flatCoordinateArray,
    nDim,
    geomOffset
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

  return {
    flatCoordinateArray,
    nDim,
    geomOffset
  };
}

function getBinaryPointsFromChunk(chunk: ListVector, geoEncoding: string) {
  const isMultiPoint = geoEncoding === GEOARROW_ENCODINGS.MULTI_POINT;

  const pointData = (isMultiPoint ? chunk.getChildAt(0) : chunk) as ListVector;
  const coordData = pointData?.getChildAt(0) as ListVector;

  const nDim = pointData?.type.listSize || 2;
  const geomOffset = pointData?.valueOffsets;
  const flatCoordinateArray = coordData.values as Float64Array;

  return {
    flatCoordinateArray,
    nDim,
    geomOffset
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
 * get binary geometries from geoarrow polygon column
 */
export function getBinaryGeometriesFromGeoArrowPolygon(
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
      geoEncoding === GEOARROW_ENCODINGS.MULTI_LINESTRING ||
      geoEncoding === GEOARROW_ENCODINGS.LINESTRING,
    line: geoEncoding === GEOARROW_ENCODINGS.MULTI_POINT || geoEncoding === GEOARROW_ENCODINGS.POINT
  };

  const bounds: [number, number, number, number] = [Infinity, Infinity, -Infinity, -Infinity];
  const chunks = geoColumn.chunks;
  let globalFeatureIdOffset = 0;
  const binaryGeometries: BinaryFeatures[] = [];

  for (let c = 0; c < chunks.length; c++) {
    const geometries = chunks[c] as ListVector;
    const {flatCoordinateArray, nDim, geomOffset} = getBinaryGeometriesFromChunk(
      geometries,
      geoEncoding
    );

    const numOfFeatures = flatCoordinateArray.length / nDim;
    const featureIds = new Uint32Array(numOfFeatures);
    for (let i = 0; i < geomOffset.length; i++) {
      for (let j = geomOffset[i]; j < geomOffset[i + 1]; j++) {
        featureIds[j] = i;
      }
    }
    const globalFeatureIds = new Uint32Array(numOfFeatures);
    for (let i = 0; i < geomOffset.length; i++) {
      for (let j = geomOffset[i]; j < geomOffset[i + 1]; j++) {
        globalFeatureIds[j] = i + globalFeatureIdOffset;
      }
    }
    globalFeatureIdOffset += geometries.length;

    const binaryContent = {
      globalFeatureIds: {value: globalFeatureIds, size: 1},
      positions: {
        value: flatCoordinateArray,
        size: nDim
      },
      featureIds: {value: featureIds, size: 1}
    };

    // TODO: deck.gl defines the BinaryFeatures structure must have points, lines, polygons even if they are empty
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
        pathIndices: {value: featureTypes.line ? geomOffset : new Uint16Array(0), size: 1},
      },
      polygons: {
        type: 'Polygon',
        ...BINARY_GEOMETRY_TEMPLATE,
        ...(featureTypes.polygon ? binaryContent : {}),
        polygonIndices: {value: featureTypes.polygon ? geomOffset: new Uint16Array(0), size: 1},
        primitivePolygonIndices: {value: featureTypes.polygon ? geomOffset: new Uint16Array(0), size: 1},
      }
    });

    updateBoundsFromGeoArrowSamples(flatCoordinateArray, nDim, bounds);
  }

  return {binaryGeometries, bounds, featureTypes};
}
