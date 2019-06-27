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

import {getSampleData} from 'utils/data-utils';

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
    'DrawPolygon',
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
  // {"type":"DrawPolygon","coordinates":[[[-74.158491,40.83594]]]}
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
  const samples =
    features.length > 500 ? getSampleData(features, 500) : features;

  const nonEmpty = samples.filter(
    d =>
      d && d.geometry && d.geometry.coordinates && d.geometry.coordinates.length
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

    case 'DrawPolygon':
    case 'MultiPolygon':
      return 'polygon';

    default:
      return null;
  }
}
