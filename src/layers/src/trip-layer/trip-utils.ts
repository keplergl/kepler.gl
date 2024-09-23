// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Analyzer, DATA_TYPES} from 'type-analyzer';
import {ascending} from 'd3-array';

import {Field, LayerColumns} from '@kepler.gl/types';

import {parseGeoJsonRawFeature, getGeojsonFeatureTypes} from '../geojson-layer/geojson-utils';
import {
  DataContainerInterface,
  getSampleContainerData,
  notNullorUndefined,
  timeToUnixMilli
} from '@kepler.gl/utils';
import {Feature} from '@turf/helpers';
import {GeoJsonProperties, Geometry} from 'geojson';

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
 * Check whether geojson linestring's 4th coordinate is 1) not timestamp 2) unix time stamp 3) real date time
 * @param timestamps array to be tested if its elements are timestamp
 * @returns the type of timestamp: unix/datetime/invalid(not timestamp)
 */
export function containValidTime(timestamps: string[]): Field | null {
  const formattedTimeStamps = timestamps.map(ts => ({ts}));
  const ignoredDataTypes = Object.keys(DATA_TYPES).filter(
    type => ![DATA_TYPES.TIME, DATA_TYPES.DATETIME].includes(type)
  );

  // ignore all types but TIME to improve performance
  const analyzedType = Analyzer.computeColMeta(formattedTimeStamps, [], {ignoredDataTypes})[0];

  if (!analyzedType || analyzedType.category !== 'TIME') {
    return null;
  }
  return analyzedType;
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

type GeoJsonFeature = any;
type CoordsType = number[] & {
  datumIndex: number;
  datum: number[];
};

export function groupColumnsAsGeoJson(
  dataContainer: DataContainerInterface,
  columns: LayerColumns
): GeoJsonFeature[] {
  const groupedById: {[key: string]: CoordsType[]} = {};
  for (let index = 0; index < dataContainer.numRows(); index++) {
    // Note: this can cause row materialization in case of non-row based containers
    const datum = dataContainer.rowAsArray(index) as number[];
    const id = datum[columns.id.fieldIdx];
    const lat = datum[columns.lat.fieldIdx];
    const lon = datum[columns.lng.fieldIdx];
    const altitude = columns.altitude ? datum[columns.altitude.fieldIdx] : 0;
    const time = datum[columns.timestamp.fieldIdx];
    // @ts-expect-error
    const coords: CoordsType = [lon, lat, altitude, time];
    // Adding references to the original data to the coordinates array
    coords.datumIndex = index;
    coords.datum = datum;
    if (!groupedById[id]) groupedById[id] = [];
    if (Number.isFinite(lon) && Number.isFinite(lat) && time) {
      groupedById[id].push(coords);
    }
  }
  const result = Object.entries(groupedById).map(([id, items]: [string, CoordsType[]], index) => ({
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates:
        // Sort by time
        items.sort((a, b) => ascending(a[3], b[3]))
    },
    properties: {
      index,
      // values are used for valueAccessor in TripLayer.formatLayerData()
      // Note: this can cause row materialization in case of non-row based containers
      values: items.map(item => dataContainer.rowAsArray(item.datumIndex))
    }
  }));
  return result;
}
