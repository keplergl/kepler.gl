// Copyright (c) 2019 Uber Technologies, Inc.
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

import geojsonExtent from '@mapbox/geojson-extent';
import wktParser from 'wellknown';
import normalize from '@mapbox/geojson-normalize';
import {Analyzer} from 'type-analyzer';
import {getSampleData} from 'utils/data-utils';
import moment from 'moment';
import {notNullorUndefined} from 'utils/data-utils';

/**
 * Parse raw data to geojson feature
 * @param allData
 * @param getFeature
 * @returns {{}}
 */
export function getGeojsonDataMaps(allData, getFeature) {
  const acceptableTypes = [
    'Point',
    'MultiPoint',
    'LineString',
    'MultiLineString',
    'Polygon',
    'MultiPolygon',
    'GeometryCollection'
  ];

  const dataToFeature = {};

  allData.forEach((d, index) => {
    dataToFeature[index] = null;
    const rawFeature = getFeature(d);

    let feature = null;

    // parse feature from field
    if (Array.isArray(rawFeature)) {
      // Support geojson as an array of points
      feature = {
        type: 'Feature',
        geometry: {
          // why do we need to flip it...
          coordinates: rawFeature.map(pts => [pts[1], pts[0]]),
          type: 'LineString'
        }
      };
    } else if (typeof rawFeature === 'string') {
      feature = parseGeometryFromString(rawFeature);
    } else if (typeof rawFeature === 'object') {
      // Support geojson feature as object
      // probably need to normalize it as well
      const normalized = normalize(rawFeature);
      if (!normalized || !Array.isArray(normalized.features)) {
        // fail to normalize geojson
        return null;
      }

      feature = normalized.features[0];
    }

    if (
      feature &&
      feature.geometry &&
      acceptableTypes.includes(feature.geometry.type)
    ) {
      // store index of the data in feature properties
      feature.properties = {
        ...(feature.properties || {}),
        index
      };

      dataToFeature[index] = feature;
    }
  });

  return dataToFeature;
}

/**
 * Parse geojson from string
 * @param {String} geoString
 * @returns {null | Object} geojson object or null if failed
 */
export function parseGeometryFromString(geoString) {
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

export function getGeojsonBounds(features = []) {
  // calculate feature bounds is computation heavy
  // here we only pick couple
  const samples = features.length > 500 ? getSampleData(features, 500) : features;

  const nonEmpty = samples.filter(
    d => d && d.geometry && d.geometry.coordinates && d.geometry.coordinates.length
  );

  try {
    return geojsonExtent({
      type: 'FeatureCollection',
      features: nonEmpty
    });
  } catch (e) {
    return null;
  }
}

export function featureToDeckGlGeoType(type) {
  switch (type) {
    case 'Point':
    case 'MultiPoint':
      return 'point';

    case 'LineString':
    case 'MultiLineString':
      return 'line';

    case 'Polygon':
    case 'MultiPolygon':
      return 'polygon';

    default:
      return null;
  }
}

/**
 * Parse geojson from string
 * @param {array} geoJson object values
 * @returns {Object} mapping of feature type existence
 */
export function getGeojsonFeatureTypes(allFeatures) {
  const featureTypes = allFeatures.reduce((accu, f) => {
    const geoType = featureToDeckGlGeoType(f && f.geometry && f.geometry.type);

    if (geoType) {
      accu[geoType] = true;
    }
    return accu;
  }, {});
  return featureTypes;
}

/**
 * Parse geojson from string
 * @param {array} geojson feature object values
 * @returns {boolean} whether the geometry coordinates has length of 4
 */
export function coordHasLength4(samples) {
  let hasLength4 = true;
  for (let i = 0; i < samples.length; i += 1) {
    hasLength4 = !samples[i].geometry.coordinates.find(c => c.length < 4);
    if (!hasLength4) {
      break;
    }
  }
  return hasLength4;
}

/**
 * Check whether geojson linestring's 4th coordinate is 1) not timestamp 2) unix time stamp 3) real date time
 * @param {array} data array to be tested if its elements are timestamp
 * @returns {string} the type of timestamp: unix/datetime/invalid(not timestamp)
 */

export function containValidTime(timestamps) {
  const formattedTimeStamps = timestamps.map(ts => ({ts}));
  const analyzedType = Analyzer.computeColMeta(formattedTimeStamps);
  if (analyzedType.find(d => d.category !== 'TIME')) {
    return false;
  }
  return analyzedType;
}

/**
 * Check if geojson features are trip layer animatable by meeting 3 conditions
 * @param {array} features array of geojson feature objects
 * @returns {boolean} whether it is trip layer animatable
 */
export function isTripAnimatable(features) {
  let isAnimatable = false;
  const featureTypes = getGeojsonFeatureTypes(features);
  // condition 1: contain line string
  const hasLineString = Boolean(featureTypes.line);
  if (!hasLineString) {
    return isAnimatable;
  }
  // condition 2:sample line strings contain 4 coordinates
  const sampleFeatures =
    features.length > 500 ? getSampleData(features, 500) : features;
  const HasLength4 = coordHasLength4(sampleFeatures);
  if (!HasLength4) {
    return isAnimatable;
  }
  // condition 3:the 4 coordinate of the first feature line strings is valid time
  const tsHolder = sampleFeatures[0].geometry.coordinates.map(coord => coord[3]);
  const hasValidTime = containValidTime(tsHolder);
  if (hasValidTime) {
    isAnimatable = true;
  }
  return isAnimatable;
}

/**
 * Get unix timestamp from animatable geojson for deck.gl trip layer
 * @param {array} features array of geojson feature objects
 * @returns {} unix timestamp
 */
export function dataToTimeStamp(features) {
  // Analyze type based on coordinates of the 1st linestring
  const analyzedType = containValidTime(
    features[0].geometry.coordinates.map(coord => coord[3])
  );
  const {format} = analyzedType[0];
  const getTimeValue = coord => {
    if (coord.length === 4 && notNullorUndefined(coord[3])) {
      return typeof coord[3] === 'string'
        ? moment.utc(coord[3], format).valueOf()
        : format === 'x'
        ? coord[3]
        : Math.floor(coord[3] / 1000);
    }
  };

  return features.map(f => f.geometry.coordinates.map(getTimeValue));
}
