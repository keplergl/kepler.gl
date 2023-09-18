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

import {Table as ArrowTable, Field as ArrowField, ListVector, FloatVector} from 'apache-arrow';
import {DATA_TYPES as AnalyzerDATA_TYPES} from 'type-analyzer';
import Console from 'global/console';
import normalize from '@mapbox/geojson-normalize';
import {parseSync} from '@loaders.gl/core';
import {WKBLoader, WKTLoader} from '@loaders.gl/wkt';
import {binaryToGeometry} from '@loaders.gl/gis';
import {
  ALL_FIELD_TYPES,
  ARROW_GEO_METADATA_KEY,
  ARROW_GEO_METADATA_VERSION
} from '@kepler.gl/constants';
import {ProcessorResult, Field} from '@kepler.gl/types';
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

import {analyzerTypeToFieldType, arrowDataTypeToAnalyzerDataType} from './dataset-utils';

export type RawArrowFeature = {
  encoding?: string;
  data: any;
};

// eslint-disable-next-line no-shadow
export enum GeoArrowEncodings {
  MULTI_POLYGON = 'geoarrow.multipolygon',
  POLYGON = 'geoarrow.polygon',
  MULTI_LINESTRING = 'geoarrow.multilinestring',
  LINESTRING = 'geoarrow.linestring',
  MULTI_POINT = 'geoarrow.multipoint',
  POINT = 'geoarrow.point',
  WKB = 'wkb',
  WKT = 'wkt'
}

/**
 * Parse a arrow table with geometry columns and return a dataset
 *
 * @param arrowTable the arrow table to parse
 * @returns dataset containing `fields` and `rows` or null
 */
export function processArrowTable(arrowTable: ArrowTable): ProcessorResult | null {
  if (!arrowTable) {
    return null;
  }
  const metadata = arrowTable.schema.metadata;
  // get geometry columns if metadata has key 'geo'
  let geometryColumns = [];
  if (metadata.get(ARROW_GEO_METADATA_KEY) !== undefined) {
    // load geo metadata
    // parse metadata string to JSON object
    const geoMeta = JSON.parse(metadata.get(ARROW_GEO_METADATA_KEY) || '');
    // check if schema_version in geoMeta equals to '0.1.0'
    if (geoMeta.schema_version !== ARROW_GEO_METADATA_VERSION) {
      Console.error('Apache Arrow schema version not supported');
      return null;
    }
    // get all geometry columns
    geometryColumns = geoMeta.columns;
  }

  const fields: Field[] = [];

  // parse fields and convert columnar to row format table
  const rowFormatTable: any[][] = [];
  const columnarTable: {[name: string]: ListVector[]} = {};
  arrowTable.schema.fields.forEach((field: ArrowField, index: number) => {
    const arrowColumn = arrowTable.getColumn(field.name);
    const values = arrowColumn.toArray();
    columnarTable[field.name] = values;
    const analyzerType = arrowDataTypeToAnalyzerDataType(field.type);
    fields.push({
      name: field.name,
      id: field.name,
      displayName: field.name,
      format: '',
      fieldIdx: index,
      type: geometryColumns[field.name]
        ? ALL_FIELD_TYPES.geojson
        : analyzerTypeToFieldType(analyzerType),
      analyzerType: geometryColumns[field.name] ? AnalyzerDATA_TYPES.GEOMETRY : analyzerType,
      valueAccessor: (dc: any) => d => {
        return dc.valueAt(d.index, index);
      }
    });
  });

  const tableRowsCount = arrowTable.length;
  const tableKeys = Object.keys(columnarTable);
  for (let index = 0; index < tableRowsCount; index++) {
    const tableItem: unknown[] = [];
    for (let keyIndex = 0; keyIndex < tableKeys.length; keyIndex++) {
      const fieldName = tableKeys[keyIndex];
      const cellValue = columnarTable[fieldName][index];
      tableItem.push(
        geometryColumns[fieldName]
          ? {
              encoding: geometryColumns[fieldName].encoding,
              data: cellValue
            }
          : cellValue
      );
    }
    rowFormatTable.push(tableItem);
  }

  return {fields, rows: rowFormatTable};
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

/**
 * parse geometry from arrow data that is returned from processArrowData()
 *
 * @param rawData the raw geometry data returned from processArrowData, which is an object with two properties: encoding and data
 * @see processArrowData
 * @returns
 */
export function parseGeometryFromArrow(rawData: RawArrowFeature): Feature | null {
  const encoding = rawData.encoding?.toLowerCase();
  const data = rawData.data;
  if (!encoding || !data) return null;

  let geometry;

  switch (encoding) {
    case GeoArrowEncodings.MULTI_POLYGON:
      geometry = arrowMultiPolygonToFeature(data);
      break;
    case GeoArrowEncodings.POLYGON:
      geometry = arrowPolygonToFeature(data);
      break;
    case GeoArrowEncodings.MULTI_POINT:
      geometry = arrowMultiPointToFeature(data);
      break;
    case GeoArrowEncodings.POINT:
      geometry = arrowPointToFeature(data);
      break;
    case GeoArrowEncodings.MULTI_LINESTRING:
      geometry = arrowMultiLineStringToFeature(data);
      break;
    case GeoArrowEncodings.LINESTRING:
      geometry = arrowLineStringToFeature(data);
      break;
    case GeoArrowEncodings.WKB: {
      return arrowWkbToFeature(data);
    }
    case GeoArrowEncodings.WKT: {
      return arrowWktToFeature(data);
    }
    default: {
      Console.error('GeoArrow encoding not supported');
      return null;
    }
  }
  return {
    type: 'Feature',
    geometry,
    properties: {}
  };
}
