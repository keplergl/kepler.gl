// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Feature, BBox} from 'geojson';
import normalize from '@mapbox/geojson-normalize';
import bbox from '@turf/bbox';
import center from '@turf/center';
import {AllGeoJSON} from '@turf/helpers'
import {parseSync} from '@loaders.gl/core';
import {WKBLoader, WKTLoader} from '@loaders.gl/wkt';
import {binaryToGeometry} from '@loaders.gl/gis';
import {BinaryFeatureCollection} from '@loaders.gl/schema';
import {DataContainerInterface, getSampleData} from '@kepler.gl/utils';

import {GeojsonLayerMetaProps} from '../layer-utils';

export type GetFeature = (d: any) => Feature;
export type GeojsonDataMaps = Array<Feature | BinaryFeatureCollection | null>;

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

export function getGeojsonLayerMeta({
  dataContainer,
  getFeature
}: {
  dataContainer: DataContainerInterface;
  getFeature: GetFeature;
}): GeojsonLayerMetaProps {
  const dataToFeature = getGeojsonDataMaps(dataContainer, getFeature);
  // get bounds from features
  const bounds = getGeojsonBounds(dataToFeature);
  // if any of the feature has properties.radius set to be true
  const fixedRadius = Boolean(dataToFeature.find(d => d && 'properties' in d && d.properties?.radius));

  // keep a record of what type of geometry the collection has
  const featureTypes = getGeojsonFeatureTypes(dataToFeature);

  const meanCenters: Array<number[] | null> = [];
  for (let i = 0; i < dataToFeature.length; i++) {
    const feature = dataToFeature[i];
    if (feature) {
      try {
        // TODO: use line interpolate to get center of line for LineString
        const cent = center(feature as AllGeoJSON);
        meanCenters.push(cent.geometry.coordinates);
      } catch (e) {
        meanCenters.push(null);
      }
    }
  }

  return {
    dataToFeature,
    bounds,
    fixedRadius,
    featureTypes,
    centroids: meanCenters
  };
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

  // try parse as wkt using loaders.gl WKTLoader
  if (!parsedGeo) {
    try {
      parsedGeo = parseSync(geoString, WKTLoader);
    } catch (e) {
      return null;
    }
  }

  // try parse as wkb using loaders.gl WKBLoader
  if (!parsedGeo) {
    try {
      const buffer = Buffer.from(geoString, 'hex');
      const binaryGeo = parseSync(buffer, WKBLoader);
      // @ts-expect-error
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

export type DeckGlGeoTypes = {
  point: boolean;
  line: boolean;
  polygon: boolean;
};

/**
 * Parse geojson from string
 * @param {Array<Object>} allFeatures
 * @returns {Object} mapping of feature type existence
 */
export function getGeojsonFeatureTypes(allFeatures: GeojsonDataMaps): DeckGlGeoTypes {
  // @ts-expect-error some test cases only have 1 geotype
  const featureTypes: DeckGlGeoTypes = {};
  for (let f = 0; f < allFeatures.length; f++) {
    const feature = allFeatures[f];
    if (feature && 'geometry' in feature) {
      const geoType = featureToDeckGlGeoType[feature.geometry && feature.geometry.type];
      if (geoType) {
        featureTypes[geoType] = true;
      }
    }
  }

  return featureTypes;
}
