// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {getCentroid, generateHashId, h3IsValid} from '@kepler.gl/common-utils';
import {ALL_FIELD_TYPES} from '@kepler.gl/constants';
import {Field, ProtoDataset} from '@kepler.gl/types';

import {aggregateValues, resultFieldType} from './aggregations';
import {
  getCentroidLngLat,
  getLngLat,
  h3ContainsH3,
  h3ContainsPoint,
  isPolygonFeature,
  parseGeometry,
  polygonContainsPoint
} from './geometry';
import {copyFieldAs, makeResultProtoDataset, uniqueColumnName} from './proto-dataset';
import {findFieldByName, rowCount, rowValue} from './table-helpers';
import {DatasetOpsTable, SpatialGeoSource, SpatialJoinDatasetConfig} from './types';

export type ParsedSpatialValue =
  | {kind: 'polygon'; feature: NonNullable<ReturnType<typeof parseGeometry>>}
  | {kind: 'point'; lngLat: [number, number]}
  | {kind: 'h3'; index: string}
  | null;

export function suggestSpatialGeo(fields: Field[]): SpatialGeoSource | null {
  const geojson = fields.find(field => field.type === ALL_FIELD_TYPES.geojson);
  if (geojson) {
    return {kind: 'geojson', fieldName: geojson.name};
  }
  const h3 = fields.find(field => field.type === ALL_FIELD_TYPES.h3);
  if (h3) {
    return {kind: 'h3', fieldName: h3.name};
  }
  const lat = fields.find(
    field =>
      /lat/i.test(field.name) &&
      (field.type === ALL_FIELD_TYPES.real || field.type === ALL_FIELD_TYPES.integer)
  );
  const lng = fields.find(
    field =>
      /(lng|lon|long)/i.test(field.name) &&
      (field.type === ALL_FIELD_TYPES.real || field.type === ALL_FIELD_TYPES.integer)
  );
  if (lat && lng) {
    return {kind: 'latlng', latField: lat.name, lngField: lng.name};
  }
  const point = fields.find(field => field.type === ALL_FIELD_TYPES.point);
  if (point) {
    return {kind: 'geojson', fieldName: point.name};
  }
  return null;
}

function readSpatialValue(
  dataset: DatasetOpsTable,
  rowIndex: number,
  geo: SpatialGeoSource
): ParsedSpatialValue {
  if (geo.kind === 'latlng') {
    const latField = findFieldByName(dataset.fields, geo.latField);
    const lngField = findFieldByName(dataset.fields, geo.lngField);
    if (!latField || !lngField) {
      return null;
    }
    const lat = Number(rowValue(dataset, rowIndex, latField));
    const lng = Number(rowValue(dataset, rowIndex, lngField));
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return null;
    }
    return {kind: 'point', lngLat: [lng, lat]};
  }

  const field = findFieldByName(dataset.fields, geo.fieldName);
  if (!field) {
    return null;
  }
  const raw = rowValue(dataset, rowIndex, field);
  if (geo.kind === 'h3') {
    return h3IsValid(String(raw)) ? {kind: 'h3', index: String(raw)} : null;
  }

  const feature = parseGeometry(raw);
  if (!feature) {
    return null;
  }
  if (isPolygonFeature(feature)) {
    return {kind: 'polygon', feature};
  }
  const lngLat = getLngLat(feature);
  return lngLat ? {kind: 'point', lngLat} : null;
}

export function leftContainsRight(left: ParsedSpatialValue, right: ParsedSpatialValue): boolean {
  if (!left || !right) {
    return false;
  }
  if (left.kind === 'polygon' && right.kind === 'point') {
    return polygonContainsPoint(left.feature, right.lngLat);
  }
  if (left.kind === 'polygon' && right.kind === 'polygon') {
    const centroid = getCentroidLngLat(right.feature);
    return Boolean(centroid && polygonContainsPoint(left.feature, centroid));
  }
  if (left.kind === 'polygon' && right.kind === 'h3') {
    const centroid = getCentroid({id: right.index});
    return Boolean(centroid && polygonContainsPoint(left.feature, centroid));
  }
  if (left.kind === 'h3' && right.kind === 'point') {
    return h3ContainsPoint(left.index, right.lngLat);
  }
  if (left.kind === 'h3' && right.kind === 'h3') {
    return h3ContainsH3(left.index, right.index);
  }
  if (left.kind === 'h3' && right.kind === 'polygon') {
    const centroid = getCentroidLngLat(right.feature);
    return Boolean(centroid && h3ContainsPoint(left.index, centroid));
  }
  return false;
}

export function spatialJoinDatasets(
  left: DatasetOpsTable,
  right: DatasetOpsTable,
  config: SpatialJoinDatasetConfig
): ProtoDataset {
  const nLeft = rowCount(left);
  const nRight = rowCount(right);
  const rightValues = Array.from({length: nRight}, (_, i) =>
    readSpatialValue(right, i, config.rightGeo)
  );

  const usedNames = new Set<string>();
  const leftFields = left.fields.map(field =>
    copyFieldAs(field, uniqueColumnName(field.name, usedNames))
  );
  const aggregationEntries = Object.entries(config.aggregations);
  const aggMeta = aggregationEntries.map(([fieldName, technique]) => {
    const sourceField = findFieldByName(right.fields, fieldName);
    if (!sourceField) {
      throw new Error(`Spatial join aggregation field "${fieldName}" was not found`);
    }
    const name = uniqueColumnName(`${fieldName}_${technique}`, usedNames);
    return {sourceField, technique, name};
  });

  const fields = [
    ...leftFields,
    {
      name: uniqueColumnName('count', usedNames),
      type: ALL_FIELD_TYPES.integer,
      analyzerType: ALL_FIELD_TYPES.integer
    },
    ...aggMeta.map(({name, technique, sourceField}) => ({
      name,
      type: resultFieldType(technique, sourceField.type),
      analyzerType: sourceField.analyzerType || sourceField.type
    }))
  ];

  const rows = Array.from({length: nLeft}, (_, leftIndex) => {
    const leftValue = readSpatialValue(left, leftIndex, config.leftGeo);
    const matched: number[] = [];
    for (let rightIndex = 0; rightIndex < nRight; rightIndex++) {
      if (leftContainsRight(leftValue, rightValues[rightIndex])) {
        matched.push(rightIndex);
      }
    }
    const row: unknown[] = left.fields.map(field => rowValue(left, leftIndex, field));
    row.push(matched.length);
    for (const {sourceField, technique} of aggMeta) {
      const values = matched.map(index => rowValue(right, index, sourceField));
      row.push(aggregateValues(values, technique));
    }
    return row;
  });

  return makeResultProtoDataset({
    source: left,
    extraSources: [right],
    type: 'spatialJoin',
    operationId: config.operationId || generateHashId(6),
    label: config.label || `${left.label} spatial join ${right.label}`,
    resultId: config.resultId,
    fields,
    rows
  });
}
