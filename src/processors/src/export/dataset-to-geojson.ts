// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {h3IsValid, idToPolygonGeo} from '@kepler.gl/common-utils';
import {ALL_FIELD_TYPES} from '@kepler.gl/constants';
import {parseGeometry} from '@kepler.gl/table';
import {Field, FieldPair} from '@kepler.gl/types';
import {DataContainerInterface, parseFieldValue} from '@kepler.gl/utils';
import {convertWKBToGeometry, convertWKTToGeometry} from '@loaders.gl/gis';
import type {Feature, FeatureCollection, Geometry, Position} from 'geojson';

type GeometryPlan =
  | {kind: 'geo'; fieldIndex: number}
  | {kind: 'latlng'; pair: FieldPair}
  | {kind: 'h3'; fieldIndex: number}
  | {kind: 'none'};

function geometryPlan(fields: Field[], fieldPairs: FieldPair[] = []): GeometryPlan {
  const geoIndex = fields.findIndex(
    field =>
      field.type === ALL_FIELD_TYPES.geojson ||
      field.type === ALL_FIELD_TYPES.geoarrow ||
      field.type === ALL_FIELD_TYPES.point
  );
  if (geoIndex >= 0) {
    return {kind: 'geo', fieldIndex: geoIndex};
  }
  if (fieldPairs[0]) {
    return {kind: 'latlng', pair: fieldPairs[0]};
  }
  const h3Index = fields.findIndex(field => field.type === ALL_FIELD_TYPES.h3);
  if (h3Index >= 0) {
    return {kind: 'h3', fieldIndex: h3Index};
  }
  return {kind: 'none'};
}

function geometryFromBinary(raw: ArrayBuffer | ArrayBufferView): Geometry | null {
  try {
    const bytes =
      raw instanceof ArrayBuffer
        ? raw
        : raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength);
    return convertWKBToGeometry(bytes) as Geometry;
  } catch {
    return null;
  }
}

function geometryFromRaw(raw: unknown, fieldType: string): Geometry | null {
  if (raw == null) {
    return null;
  }
  if (raw instanceof ArrayBuffer || ArrayBuffer.isView(raw)) {
    return geometryFromBinary(raw);
  }
  const parsed = parseGeometry(raw);
  if (parsed?.geometry) {
    return parsed.geometry;
  }
  if (fieldType === ALL_FIELD_TYPES.geoarrow && typeof raw === 'string') {
    const text = raw.trim();
    if (/^(POINT|LINESTRING|POLYGON|MULTI|GEOMETRYCOLLECTION)\b/i.test(text)) {
      try {
        return convertWKTToGeometry(text) as Geometry;
      } catch {
        return null;
      }
    }
  }
  return null;
}

function attributeValue(value: unknown, field: Field): string | number | boolean | null {
  if (value == null) {
    return null;
  }
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === 'boolean' || typeof value === 'string') {
    return value;
  }
  if (typeof value === 'bigint') {
    return value.toString();
  }
  const formatted = parseFieldValue(value, field.type, field);
  return formatted === '' ? null : formatted;
}

function pointGeometry(
  data: DataContainerInterface,
  rowIndex: number,
  pair: FieldPair
): Geometry | null {
  const lat = Number(data.valueAt(rowIndex, pair.pair.lat.fieldIdx));
  const lng = Number(data.valueAt(rowIndex, pair.pair.lng.fieldIdx));
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }
  const altitudeIndex = pair.pair.altitude?.fieldIdx;
  const altitude =
    altitudeIndex === undefined ? undefined : Number(data.valueAt(rowIndex, altitudeIndex));
  const coordinates: Position =
    altitude !== undefined && Number.isFinite(altitude) ? [lng, lat, altitude] : [lng, lat];
  return {type: 'Point', coordinates};
}

/**
 * Turn dataset rows into a FeatureCollection.
 * Columns listed in `hiddenColumns` are left out of feature properties.
 * A geometry column is still used to build the feature geometry.
 */
export function datasetToFeatureCollection(
  data: DataContainerInterface,
  fields: Field[],
  options: {hiddenColumns?: string[]; fieldPairs?: FieldPair[]} = {}
): FeatureCollection {
  const hidden = new Set(options.hiddenColumns ?? []);
  const plan = geometryPlan(fields, options.fieldPairs);
  const geometryFieldIndex = plan.kind === 'geo' || plan.kind === 'h3' ? plan.fieldIndex : -1;
  const features: Feature[] = [];

  for (let rowIndex = 0; rowIndex < data.numRows(); rowIndex++) {
    const properties: Record<string, string | number | boolean | null> = {};
    fields.forEach((field, fieldIndex) => {
      if (hidden.has(field.name) || fieldIndex === geometryFieldIndex) {
        return;
      }
      properties[field.name] = attributeValue(data.valueAt(rowIndex, fieldIndex), field);
    });

    let geometry: Geometry | null = null;
    if (plan.kind === 'geo') {
      geometry = geometryFromRaw(
        data.valueAt(rowIndex, plan.fieldIndex),
        fields[plan.fieldIndex].type
      );
    } else if (plan.kind === 'latlng') {
      geometry = pointGeometry(data, rowIndex, plan.pair);
    } else if (plan.kind === 'h3') {
      const index = String(data.valueAt(rowIndex, plan.fieldIndex) ?? '');
      geometry =
        (h3IsValid(index)
          ? (idToPolygonGeo({id: index}, {isClosed: true})?.geometry as Geometry | undefined)
          : null) ?? null;
    }

    features.push({type: 'Feature', geometry: geometry as Geometry, properties});
  }

  return {type: 'FeatureCollection', features};
}
