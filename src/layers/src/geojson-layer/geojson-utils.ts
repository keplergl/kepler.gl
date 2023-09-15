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

import wktParser from 'wellknown';
import normalize from '@mapbox/geojson-normalize';
import bbox from '@turf/bbox';
import {parseSync} from '@loaders.gl/core';
import {WKBLoader} from '@loaders.gl/wkt';
import {binaryToGeometry} from '@loaders.gl/gis';

import {Feature, BBox} from 'geojson';
import {getSampleData} from '@kepler.gl/utils';

export type GetFeature = (d: any) => Feature;
export type GeojsonDataMaps = Array<Feature | null>;

/* eslint-disable */
// TODO: Re-enable eslint when we upgrade to handle enums and type maps
export enum FeatureTypes {
  Point = 'Point',
  MultiPoint = 'MultiPoint',
  LineString = 'LineString',
  MultiLineString = 'MultiLineString',
  Polygon = 'Polygon',
  MultiPolygon = 'MultiPolygon'
}

type FeatureTypeMap = {
  [key in FeatureTypes]: boolean;
};
/* eslint-enable */

export function parseGeoJsonRawFeature(rawFeature: unknown): Feature | null {
  if (typeof rawFeature === 'object') {
    // Support GeoJson feature as object
    // probably need to normalize it as well
    const normalized = normalize(rawFeature);
    if (!normalized || !Array.isArray(normalized.features)) {
      // fail to normalize GeoJson
      return null;
    }

    return normalized.features[0];
  } else if (typeof rawFeature === 'string') {
    return parseGeometryFromString(rawFeature);
  } else if (Array.isArray(rawFeature)) {
    // Support GeoJson  LineString as an array of points
    return {
      type: 'Feature',
      geometry: {
        // why do we need to flip it...
        coordinates: rawFeature.map(pts => [pts[1], pts[0]]),
        type: 'LineString'
      },
      properties: {}
    };
  }

  return null;
}
/**
 * Parse raw data to GeoJson feature
 * @param dataContainer
 * @param getFeature
 * @returns {{}}
 */
export function getGeojsonDataMaps(dataContainer: any, getFeature: GetFeature): GeojsonDataMaps {
  const acceptableTypes = [
    'Point',
    'MultiPoint',
    'LineString',
    'MultiLineString',
    'Polygon',
    'MultiPolygon',
    'GeometryCollection'
  ];

  const dataToFeature: GeojsonDataMaps = [];

  for (let index = 0; index < dataContainer.numRows(); index++) {
    const feature = parseGeoJsonRawFeature(getFeature({index}));

    if (feature && feature.geometry && acceptableTypes.includes(feature.geometry.type)) {
      const cleaned = {
        ...feature,
        // store index of the data in feature properties
        properties: {
          ...feature.properties,
          index
        }
      };

      dataToFeature[index] = cleaned;
    } else {
      dataToFeature[index] = null;
    }
  }

  return dataToFeature;
}

/**
 * Parse geojson from string
 * @param {String} geoString
 * @returns {null | Object} geojson object or null if failed
 */
export function parseGeometryFromString(geoString: string): Feature | null {
  let parsedGeo;

  // try parse as geojson string
  // {"type":"Polygon","coordinates":[[[-74.158491,40.83594]]]}
  try {
    parsedGeo = JSON.parse(geoString);
  } catch (e) {
    // keep trying to parse
  }

  // try parse as wkt
  if (!parsedGeo) {
    try {
      parsedGeo = wktParser(geoString);
    } catch (e) {
      return null;
    }
  }

  // try parse as wkb using loaders.gl WKBLoader
  if (!parsedGeo) {
    try {
      const buffer = Buffer.from(geoString, 'hex');
      const binaryGeo = parseSync(buffer, WKBLoader);
      parsedGeo = binaryToGeometry(binaryGeo);
    } catch (e) {
      return null;
    }
  }

  if (!parsedGeo) {
    return null;
  }

  const normalized = normalize(parsedGeo);

  if (!normalized || !Array.isArray(normalized.features)) {
    // fail to normalize geojson
    return null;
  }

  return normalized.features[0];
}

export function getGeojsonBounds(features: GeojsonDataMaps = []): BBox | null {
  // 70 ms for 10,000 polygons
  // here we only pick couple
  const maxCount = 10000;
  const samples = features.length > maxCount ? getSampleData(features, maxCount) : features;

  const nonEmpty = samples.filter(
    d => d && d.geometry && d.geometry.coordinates && d.geometry.coordinates.length
  );

  try {
    return bbox({
      type: 'FeatureCollection',
      features: nonEmpty
    });
  } catch (e) {
    return null;
  }
}

export const featureToDeckGlGeoType = {
  Point: 'point',
  MultiPoint: 'point',
  LineString: 'line',
  MultiLineString: 'line',
  Polygon: 'polygon',
  MultiPolygon: 'polygon'
};

/**
 * Parse geojson from string
 * @param {Array<Object>} allFeatures
 * @returns {Object} mapping of feature type existence
 */
export function getGeojsonFeatureTypes(allFeatures: GeojsonDataMaps): FeatureTypeMap {
  // @ts-expect-error
  const featureTypes: FeatureTypeMap = {};
  for (let f = 0; f < allFeatures.length; f++) {
    const feature = allFeatures[f];
    if (feature) {
      const geoType = featureToDeckGlGeoType[feature.geometry && feature.geometry.type];
      if (geoType) {
        featureTypes[geoType] = true;
      }
    }
  }

  return featureTypes;
}
