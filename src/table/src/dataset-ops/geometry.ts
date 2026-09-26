// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {cellToParent, h3GetResolution, h3IsValid, latLngToCell} from '@kepler.gl/common-utils';
import {isInPolygon} from '@kepler.gl/utils';
import type {Feature, Geometry, Position} from 'geojson';

function isLngLat(pos: unknown): pos is Position {
  return (
    Array.isArray(pos) &&
    pos.length >= 2 &&
    Number.isFinite(Number(pos[0])) &&
    Number.isFinite(Number(pos[1]))
  );
}

function collectPositions(node: unknown, out: number[][]): void {
  if (isLngLat(node)) {
    out.push([Number(node[0]), Number(node[1])]);
    return;
  }
  if (Array.isArray(node)) {
    for (const child of node) {
      collectPositions(child, out);
    }
  }
}

export function parseGeometry(raw: unknown): Feature | null {
  if (raw == null) {
    return null;
  }
  if (typeof raw === 'string') {
    try {
      return parseGeometry(JSON.parse(raw));
    } catch {
      return null;
    }
  }
  if (isLngLat(raw)) {
    return {
      type: 'Feature',
      geometry: {type: 'Point', coordinates: [Number(raw[0]), Number(raw[1])]},
      properties: {}
    };
  }
  if (typeof raw !== 'object') {
    return null;
  }
  const value = raw as {type?: string; geometry?: Geometry; coordinates?: unknown};
  if (value.type === 'Feature' && value.geometry) {
    return raw as Feature;
  }
  if (value.type && value.coordinates) {
    return {type: 'Feature', geometry: raw as Geometry, properties: {}};
  }
  return null;
}

export function getLngLat(feature: Feature | null): [number, number] | null {
  if (!feature?.geometry) {
    return null;
  }
  if (feature.geometry.type === 'Point' && isLngLat(feature.geometry.coordinates)) {
    return [Number(feature.geometry.coordinates[0]), Number(feature.geometry.coordinates[1])];
  }
  return getCentroidLngLat(feature);
}

function asFeature(geometry: Geometry): Feature {
  return {type: 'Feature', geometry, properties: {}};
}

function flattenGeometry(geometry: Geometry): Geometry[] {
  if (geometry.type === 'GeometryCollection') {
    return geometry.geometries.flatMap(flattenGeometry);
  }
  return [geometry];
}

/**
 * Combine geometries in a group into one GeoJSON Feature so the result stays mappable.
 * Same-type inputs become Multi* geometries; mixed types become a GeometryCollection.
 */
export function mergeGeometries(values: unknown[]): Feature | null {
  const geometries = values
    .map(value => parseGeometry(value)?.geometry)
    .filter((geometry): geometry is Geometry => Boolean(geometry))
    .flatMap(flattenGeometry);
  if (!geometries.length) {
    return null;
  }
  if (geometries.length === 1) {
    return asFeature(geometries[0]);
  }

  const type = geometries[0].type;
  const sameType = geometries.every(geometry => geometry.type === type);
  if (sameType && type === 'Polygon') {
    return asFeature({
      type: 'MultiPolygon',
      coordinates: geometries.map(
        geometry => (geometry as Geometry & {type: 'Polygon'}).coordinates
      )
    });
  }
  if (sameType && type === 'MultiPolygon') {
    return asFeature({
      type: 'MultiPolygon',
      coordinates: geometries.flatMap(
        geometry => (geometry as Geometry & {type: 'MultiPolygon'}).coordinates
      )
    });
  }
  if (sameType && type === 'Point') {
    return asFeature({
      type: 'MultiPoint',
      coordinates: geometries.map(geometry => (geometry as Geometry & {type: 'Point'}).coordinates)
    });
  }
  if (sameType && type === 'MultiPoint') {
    return asFeature({
      type: 'MultiPoint',
      coordinates: geometries.flatMap(
        geometry => (geometry as Geometry & {type: 'MultiPoint'}).coordinates
      )
    });
  }
  if (sameType && type === 'LineString') {
    return asFeature({
      type: 'MultiLineString',
      coordinates: geometries.map(
        geometry => (geometry as Geometry & {type: 'LineString'}).coordinates
      )
    });
  }
  if (sameType && type === 'MultiLineString') {
    return asFeature({
      type: 'MultiLineString',
      coordinates: geometries.flatMap(
        geometry => (geometry as Geometry & {type: 'MultiLineString'}).coordinates
      )
    });
  }
  return asFeature({type: 'GeometryCollection', geometries});
}

export function getCentroidLngLat(feature: Feature | null): [number, number] | null {
  const geometry = feature?.geometry;
  if (!geometry || geometry.type === 'GeometryCollection') {
    return null;
  }
  const positions: number[][] = [];
  collectPositions((geometry as {coordinates: unknown}).coordinates, positions);
  if (!positions.length) {
    return null;
  }
  let sumLng = 0;
  let sumLat = 0;
  for (const pos of positions) {
    sumLng += pos[0];
    sumLat += pos[1];
  }
  return [sumLng / positions.length, sumLat / positions.length];
}

export function isPolygonFeature(feature: Feature | null): boolean {
  const type = feature?.geometry?.type;
  return type === 'Polygon' || type === 'MultiPolygon';
}

export function polygonContainsPoint(polygon: Feature, lngLat: [number, number]): boolean {
  return isInPolygon(lngLat, polygon);
}

export function h3ContainsPoint(h3Index: unknown, lngLat: [number, number]): boolean {
  if (!h3IsValid(String(h3Index))) {
    return false;
  }
  const cell = String(h3Index);
  const resolution = h3GetResolution(cell);
  return latLngToCell(lngLat[1], lngLat[0], resolution) === cell;
}

export function h3ContainsH3(leftIndex: unknown, rightIndex: unknown): boolean {
  const left = String(leftIndex);
  const right = String(rightIndex);
  if (!h3IsValid(left) || !h3IsValid(right)) {
    return false;
  }
  if (left === right) {
    return true;
  }
  const leftRes = h3GetResolution(left);
  const rightRes = h3GetResolution(right);
  if (rightRes <= leftRes) {
    return false;
  }
  return cellToParent(right, leftRes) === left;
}
