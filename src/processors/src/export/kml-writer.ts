// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project
// Adapted from GeoLibre (https://github.com/opengeos/GeoLibre), MIT License.

import type {Feature, FeatureCollection, GeoJsonProperties, Geometry, Position} from 'geojson';
export class KmlCoordinateError extends Error {
  constructor(featureIndex: number, featureId?: string | number) {
    super(`Feature ${featureId ?? featureIndex} has a coordinate that KML cannot represent.`);
    this.name = 'KmlCoordinateError';
  }
}

const KML_NAMESPACE = 'http://www.opengis.net/kml/2.2';

class InvalidCoordinateError extends Error {}

function xmlSafeText(value: unknown): string {
  return stripDisallowedControls(String(value))
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** XML 1.0 disallows these controls. Tab, newline, and carriage return stay. */
function stripDisallowedControls(value: string): string {
  let result = '';
  for (const char of value) {
    const code = char.charCodeAt(0);
    const disallowed =
      code <= 0x08 || code === 0x0b || code === 0x0c || (code >= 0x0e && code <= 0x1f);
    result += disallowed ? '\uFFFD' : char;
  }
  return result;
}

function indentXml(xml: string, spaces: number): string {
  const indentation = ' '.repeat(spaces);
  return xml
    .split('\n')
    .map(line => `${indentation}${line}`)
    .join('\n');
}

function decimalText(value: number): string {
  const text = String(value);
  const match = /^(-?)(\d+)(?:\.(\d+))?e([+-]?\d+)$/i.exec(text);
  if (!match) return text;

  const [, sign, integer, fraction = '', rawExponent] = match;
  const digits = `${integer}${fraction}`;
  const decimalIndex = integer.length + Number(rawExponent);
  if (decimalIndex <= 0) {
    return `${sign}0.${'0'.repeat(-decimalIndex)}${digits}`;
  }
  if (decimalIndex >= digits.length) {
    return `${sign}${digits}${'0'.repeat(decimalIndex - digits.length)}`;
  }
  return `${sign}${digits.slice(0, decimalIndex)}.${digits.slice(decimalIndex)}`;
}

function positionText(position: Position): string {
  if (position.length < 2 || position.slice(0, 3).some(value => !Number.isFinite(value))) {
    throw new InvalidCoordinateError();
  }
  return position
    .slice(0, 3)
    .map(value => decimalText(value))
    .join(',');
}

function coordinatesText(positions: Position[]): string {
  return positions.map(positionText).join(' ');
}

function hasAltitude(position: Position): boolean {
  // KML applies altitude mode to the entire geometry. For mixed-dimensional
  // GeoJSON, preserve supplied altitudes and let KML interpret 2D vertices as
  // having its implicit zero altitude.
  return position.length >= 3;
}

function closedRing(ring: Position[]): Position[] {
  if (ring.length === 0) return ring;
  const first = ring[0];
  const last = ring[ring.length - 1];
  if (
    first.length === last.length &&
    first.every((coordinate, index) => coordinate === last[index])
  ) {
    return ring;
  }
  return [...ring, first];
}

function polygonKml(coordinates: Position[][]): string {
  const [outer, ...inner] = coordinates;
  const boundaries: string[] = [];
  if (outer) {
    boundaries.push(
      '<outerBoundaryIs>',
      '  <LinearRing>',
      `    <coordinates>${coordinatesText(closedRing(outer))}</coordinates>`,
      '  </LinearRing>',
      '</outerBoundaryIs>'
    );
  }
  for (const ring of inner) {
    boundaries.push(
      '<innerBoundaryIs>',
      '  <LinearRing>',
      `    <coordinates>${coordinatesText(closedRing(ring))}</coordinates>`,
      '  </LinearRing>',
      '</innerBoundaryIs>'
    );
  }
  if (boundaries.length === 0) return '<Polygon />';
  const contents = coordinates.some(ring => ring.some(hasAltitude))
    ? ['<altitudeMode>absolute</altitudeMode>', ...boundaries]
    : boundaries;
  return `<Polygon>\n${indentXml(contents.join('\n'), 2)}\n</Polygon>`;
}

function multiGeometryKml(geometries: Geometry[]): string {
  if (geometries.length === 0) return '<MultiGeometry />';
  return `<MultiGeometry>\n${geometries
    .map(geometry => indentXml(geometryKml(geometry), 2))
    .join('\n')}\n</MultiGeometry>`;
}

function geometryKml(geometry: Geometry): string {
  switch (geometry.type) {
    case 'Point':
      return `<Point>${
        hasAltitude(geometry.coordinates) ? '<altitudeMode>absolute</altitudeMode>' : ''
      }<coordinates>${positionText(geometry.coordinates)}</coordinates></Point>`;
    case 'MultiPoint':
      return multiGeometryKml(
        geometry.coordinates.map(coordinates => ({type: 'Point', coordinates}))
      );
    case 'LineString':
      return `<LineString>${
        geometry.coordinates.some(hasAltitude) ? '<altitudeMode>absolute</altitudeMode>' : ''
      }<coordinates>${coordinatesText(geometry.coordinates)}</coordinates></LineString>`;
    case 'MultiLineString':
      return multiGeometryKml(
        geometry.coordinates.map(coordinates => ({type: 'LineString', coordinates}))
      );
    case 'Polygon':
      return polygonKml(geometry.coordinates);
    case 'MultiPolygon':
      return multiGeometryKml(
        geometry.coordinates.map(coordinates => ({type: 'Polygon', coordinates}))
      );
    case 'GeometryCollection':
      return multiGeometryKml(geometry.geometries);
  }
}

function propertyText(value: unknown): string {
  if (value == null) return '';
  if (typeof value !== 'object') return String(value);
  return JSON.stringify(value);
}

function propertyElement(properties: GeoJsonProperties, key: string): string | null {
  const value = properties?.[key];
  return value == null || typeof value === 'object'
    ? null
    : `<${key}>${xmlSafeText(value)}</${key}>`;
}

function extendedDataKml(feature: Feature): string | null {
  const properties = feature.properties ?? {};
  const entries = Object.entries(properties).filter(
    ([key, value]) =>
      !((key === 'name' || key === 'description') && value != null && typeof value !== 'object')
  );
  if (feature.id != null) {
    let idKey = 'feature_id';
    if (Object.prototype.hasOwnProperty.call(properties, idKey)) {
      idKey = 'geojson_feature_id';
      let suffix = 2;
      while (Object.prototype.hasOwnProperty.call(properties, idKey)) {
        idKey = `geojson_feature_id_${suffix}`;
        suffix += 1;
      }
    }
    entries.unshift([idKey, feature.id]);
  }
  if (entries.length === 0) return null;
  const data = entries.map(
    ([key, value]) =>
      `<Data name="${xmlSafeText(key)}"><value>${xmlSafeText(propertyText(value))}</value></Data>`
  );
  return `<ExtendedData>\n${data.map(entry => indentXml(entry, 2)).join('\n')}\n</ExtendedData>`;
}

function opacityByte(value: unknown, defaultOpacity = 1): string {
  const opacity = typeof value === 'number' ? value : Number(value ?? defaultOpacity);
  const normalized = Number.isFinite(opacity) ? Math.min(1, Math.max(0, opacity)) : defaultOpacity;
  return Math.round(normalized * 255)
    .toString(16)
    .padStart(2, '0');
}

function kmlColor(color: unknown, opacity: unknown, defaultOpacity = 1): string | null {
  if (typeof color !== 'string') return null;
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(color.trim());
  if (!match) return null;
  const hex =
    match[1].length === 3
      ? match[1]
          .split('')
          .map(digit => `${digit}${digit}`)
          .join('')
      : match[1];
  const red = hex.slice(0, 2);
  const green = hex.slice(2, 4);
  const blue = hex.slice(4, 6);
  return `${opacityByte(opacity, defaultOpacity)}${blue}${green}${red}`.toLowerCase();
}

function styleKml(properties: GeoJsonProperties): string | null {
  if (!properties) return null;
  const sections: string[] = [];

  const markerColor = kmlColor(properties['marker-color'], properties['marker-opacity']);
  if (markerColor) {
    sections.push(`<IconStyle><color>${markerColor}</color></IconStyle>`);
  }

  const strokeColor = kmlColor(properties.stroke, properties['stroke-opacity']);
  const strokeWidth = Number(properties['stroke-width']);
  if (strokeColor || Number.isFinite(strokeWidth)) {
    const values = [
      strokeColor ? `<color>${strokeColor}</color>` : null,
      Number.isFinite(strokeWidth) ? `<width>${strokeWidth}</width>` : null
    ].filter((value): value is string => value !== null);
    sections.push(`<LineStyle>${values.join('')}</LineStyle>`);
  }

  const fillColor = kmlColor(properties.fill, properties['fill-opacity'], 0.6);
  if (fillColor) {
    sections.push(`<PolyStyle><color>${fillColor}</color></PolyStyle>`);
  }

  if (sections.length === 0) return null;
  return `<Style>${sections.join('')}</Style>`;
}

function featureKml(feature: Feature, style: string | null): string {
  const properties = feature.properties ?? {};
  const contents = [
    propertyElement(properties, 'name'),
    propertyElement(properties, 'description'),
    style,
    extendedDataKml(feature),
    feature.geometry ? geometryKml(feature.geometry) : null
  ].filter((value): value is string => value !== null);

  if (contents.length === 0) return '<Placemark />';
  return `<Placemark>\n${contents.map(value => indentXml(value, 2)).join('\n')}\n</Placemark>`;
}

/**
 * Convert a GeoJSON FeatureCollection to a KML 2.2 document.
 *
 * Feature properties are retained in ExtendedData, except primitive `name` and
 * `description` values that are represented by their native KML elements.
 * Simplestyle properties are also promoted to native KML styles for display in
 * Google Earth and other KML clients.
 */
export function writeKml(geojson: FeatureCollection, documentName: string): string {
  const featureStyles = geojson.features.map(feature => styleKml(feature.properties));
  const styleCounts = new Map<string, number>();
  for (const style of featureStyles) {
    if (style) styleCounts.set(style, (styleCounts.get(style) ?? 0) + 1);
  }

  const sharedStyles = new Map<string, string>();
  for (const [style, count] of styleCounts) {
    if (count > 1) sharedStyles.set(style, `style-${sharedStyles.size + 1}`);
  }
  const styleDefinitions = Array.from(sharedStyles, ([style, id]) =>
    indentXml(style.replace('<Style>', `<Style id="${id}">`), 4)
  );

  const placemarks = geojson.features.map((feature, index) => {
    try {
      const style = featureStyles[index];
      const sharedStyleId = style ? sharedStyles.get(style) : undefined;
      return indentXml(
        featureKml(feature, sharedStyleId ? `<styleUrl>#${sharedStyleId}</styleUrl>` : style),
        4
      );
    } catch (error) {
      if (error instanceof InvalidCoordinateError) {
        throw new KmlCoordinateError(index, feature.id);
      }
      throw error;
    }
  });
  const documentContents = [
    `    <name>${xmlSafeText(documentName)}</name>`,
    ...styleDefinitions,
    ...placemarks
  ].join('\n');
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<kml xmlns="${KML_NAMESPACE}">`,
    '  <Document>',
    documentContents,
    '  </Document>',
    '</kml>'
  ].join('\n');
}
