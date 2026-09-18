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
