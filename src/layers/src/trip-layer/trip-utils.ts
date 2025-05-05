// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {parseGeoJsonRawFeature, getGeojsonFeatureTypes} from '../geojson-layer/geojson-utils';
import {DataContainerInterface, getSampleContainerData, timeToUnixMilli} from '@kepler.gl/utils';
import {containValidTime, notNullorUndefined} from '@kepler.gl/common-utils';
import {BinaryFeatureCollection} from '@loaders.gl/schema';
import {Feature} from '@turf/helpers';
import {GeoJsonProperties, Geometry} from 'geojson';

// TODO: We should check for 4 !
const NUM_DIMENSIONS_FOR_TRIPS = 3;

/**
 * Parse geojson from string
 * @param {array} samples feature object values
 * @returns whether the geometry coordinates has length of 4
 */
export function coordHasLength4(samples): boolean {
  let hasLength4 = true;
  for (let i = 0; i < samples.length; i += 1) {
    hasLength4 =
      Array.isArray(samples[i]?.geometry?.coordinates) &&
      !samples[i].geometry.coordinates.find(c => c.length < 4);

    if (!hasLength4) {
      break;
    }
  }
  return hasLength4;
}

/**
 * Check if geojson features are trip layer animatable by meeting 3 conditions
 * @param dataContainer geojson feature objects container
 * @param {object} field array of geojson feature objects
 * @returns whether it is trip layer animatable
 */
export function isTripGeoJsonField(dataContainer: DataContainerInterface, field): boolean {
  if (dataContainer.numRows() < 1) {
    return false;
  }

  const maxCount = 10000;
  const sampleRawFeatures =
    dataContainer.numRows() > maxCount
      ? getSampleContainerData(dataContainer, maxCount)
      : dataContainer;

  const features: Feature<Geometry, GeoJsonProperties>[] = sampleRawFeatures
    .mapIndex(field.valueAccessor)
    .map(parseGeoJsonRawFeature)
    .filter(notNullorUndefined);
  const featureTypes = getGeojsonFeatureTypes(features);

  // condition 1: contain line string
  if (!featureTypes.line) {
    return false;
  }

  // condition 2:sample line strings contain 4 coordinates
  if (!coordHasLength4(features)) {
    return false;
  }

  // condition 3:the 4th coordinate of the first feature line strings is valid time
  // @ts-expect-error
  const tsHolder = features[0].geometry.coordinates.map(coord => coord[3]);

  return Boolean(containValidTime(tsHolder));
}

/**
 * Get unix timestamp from animatable geojson for deck.gl trip layer
 * @param dataToFeature array of geojson feature objects, can be null
 * @returns
 */
export function parseTripGeoJsonTimestamp(dataToFeature: any[]) {
  // Analyze type based on coordinates of the 1st lineString
  // select a sample trip to analyze time format
  const empty = {dataToTimeStamp: [], animationDomain: null};
  const sampleTrip = dataToFeature.find(f => f?.geometry?.coordinates?.[0]?.length > 3);

  // if no valid geometry
  if (!sampleTrip) {
    return empty;
  }

  const analyzedType = containValidTime(sampleTrip.geometry.coordinates.map(coord => coord[3]));

  if (!analyzedType) {
    return empty;
  }

  const {format} = analyzedType;
  const getTimeValue = coord =>
    coord && notNullorUndefined(coord[3]) ? timeToUnixMilli(coord[3], format) : null;

  const dataToTimeStamp: number[][] = dataToFeature.map(f =>
    f && f.geometry && Array.isArray(f.geometry.coordinates)
      ? f.geometry.coordinates.map(getTimeValue)
      : null
  );

  const animationDomain = getAnimationDomainFromTimestamps(dataToTimeStamp);

  return {dataToTimeStamp, animationDomain};
}

/**
 * Converts Deck.gl's BinaryFeatureCollection into regular json features supported by TripLayer.
 * TODO: investigate whether BinaryFeatureCollection can be easily passed to Trips Layer as attributes.
 * Info for (sublayer) Deck.gl's PathsLayer: https://deck.gl/docs/api-reference/layers/path-layer#use-binary-attributes
 * @param dataToFeature An array of binary feature collections. Only lines are checked.
 * @returns TripLayer-compatible features and timestamps.
 */
export function parseTripGeoJsonFromGeoArrow(dataToFeature: BinaryFeatureCollection[]): {
  dataToTimeStamp: number[][];
  dataToFeatureOut: Feature[];
  animationDomain: [number, number] | null;
} {
  // Analyze type based on coordinates of the 1st lineString
  // select a sample trip to analyze time format
  const empty = {dataToTimeStamp: [], dataToFeatureOut: [], animationDomain: null};

  // We need 4 dimensions
  const lines = dataToFeature[0].lines;
  if (!lines || lines.positions?.size !== NUM_DIMENSIONS_FOR_TRIPS) {
    return empty;
  }

  const positions = lines.positions.value;
  const pathIndices = lines.pathIndices.value;

  // Check for proper type fo the time values
  const timestampsSample: number[] = [];
  for (let i = NUM_DIMENSIONS_FOR_TRIPS - 1; i < positions.length; i += NUM_DIMENSIONS_FOR_TRIPS) {
    timestampsSample.push(positions[i]);
  }
  const analyzedType = containValidTime(
    timestampsSample as any[] /* why only strings are expected? */
  );
  if (!analyzedType) {
    return empty;
  }
  const {format} = analyzedType;
  const getTimeValue = value => {
    return value && notNullorUndefined(value) ? timeToUnixMilli(value, format) : null;
  };

  // Transform binary buffers to standard Features and separate timestamp data.
  const dataToFeatureOut: Feature[] = [];
  const dataToTimeStamp: number[][] = [];
  lines.properties.forEach((f, featureIndex) => {
    // get number of coordinates in current path
    const prevIndex = pathIndices[featureIndex];
    const numCoordinates = pathIndices[featureIndex + 1] - prevIndex;
    const baseShift = prevIndex * NUM_DIMENSIONS_FOR_TRIPS;

    const coordinates: number[][] = [];
    const timeValues: number[] = [];
    for (let coordIndex = 0; coordIndex < numCoordinates; ++coordIndex) {
      const baseIndex = baseShift + coordIndex * NUM_DIMENSIONS_FOR_TRIPS;

      // TODO add elevation, this was used for testing with DuckDB
      const coordinate = [positions[baseIndex], positions[baseIndex + 1], 0];

      const timeValue = positions[baseIndex + NUM_DIMENSIONS_FOR_TRIPS - 1];
      const parsedTimeValue = getTimeValue(timeValue);

      if (parsedTimeValue) {
        coordinates.push(coordinate);
        timeValues.push(parsedTimeValue);
      }
    }

    dataToFeatureOut.push({
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates
      },
      properties: {
        index: featureIndex
      }
    });

    dataToTimeStamp.push(timeValues);
  });

  const animationDomain = getAnimationDomainFromTimestamps(dataToTimeStamp);

  return {dataToTimeStamp, dataToFeatureOut, animationDomain};
}

function findMinFromSorted(list: number[]) {
  // check if list is null since the default value [] will only be applied when the param is undefined
  return list?.find(d => notNullorUndefined(d) && Number.isFinite(d)) || null;
}

function findMaxFromSorted(list: number[] = []) {
  let i = list.length - 1;
  while (i > 0) {
    if (notNullorUndefined(list[i]) && Number.isFinite(list[i])) {
      return list[i];
    }
    i--;
  }
  return null;
}

export function getAnimationDomainFromTimestamps(dataToTimeStamp: number[][] = []) {
  return dataToTimeStamp.reduce(
    (accu: [number, number], tss) => {
      const tsMin = findMinFromSorted(tss);
      const tsMax = findMaxFromSorted(tss);
      if (
        notNullorUndefined(tsMin) &&
        notNullorUndefined(tsMax) &&
        Number.isFinite(tsMin) &&
        Number.isFinite(tsMax)
      ) {
        accu[0] = Math.min(accu[0], tsMin);
        accu[1] = Math.max(accu[1], tsMax);
      }
      return accu;
    },
    [Infinity, -Infinity]
  );
}
