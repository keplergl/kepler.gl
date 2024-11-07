// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Feature, Position, BBox} from 'geojson';
import normalize from '@mapbox/geojson-normalize';
import bbox from '@turf/bbox';
import {ascending} from 'd3-array';
import center from '@turf/center';
import {AllGeoJSON} from '@turf/helpers';
import {parseSync} from '@loaders.gl/core';
import {WKBLoader, WKTLoader} from '@loaders.gl/wkt';
import {binaryToGeometry} from '@loaders.gl/gis';
import {BinaryFeatureCollection} from '@loaders.gl/schema';
import {DataContainerInterface, getSampleData} from '@kepler.gl/utils';
import {ALL_FIELD_TYPES} from '@kepler.gl/constants';
import {LayerColumns} from '@kepler.gl/types';
import {KeplerTable} from '@kepler.gl/table';

import {GeojsonLayerMetaProps, assignPointPairToLayerColumn} from '../layer-utils';
import {LayerBaseConfig} from '../base-layer';

export type GetFeature = (d: any) => Feature;
export type GeojsonDataMaps = (Feature | BinaryFeatureCollection | null)[];
export type GeojsonPointDataMaps = (number[] | number[][] | null)[];

export const COLUMN_MODE_GEOJSON = 'geojson';

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

// @ts-expect-error return type of getGeojsonFeatureTypes ?
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

export function getGeojsonLayerMeta({
  dataContainer,
  getFeature,
  config
}: {
  dataContainer: DataContainerInterface;
  getFeature: GetFeature;
  config: LayerBaseConfig;
}): GeojsonLayerMetaProps {
  const dataToFeature =
    config.columnMode === COLUMN_MODE_GEOJSON
      ? getGeojsonDataMaps(dataContainer, getFeature)
      : // COLUMN_MODE_TABLE
        groupColumnsAsGeoJson(dataContainer, config.columns, 'sortBy');

  // get bounds from features
  const bounds = getGeojsonBounds(dataToFeature);
  // if any of the feature has properties.radius set to be true
  const fixedRadius = Boolean(
    dataToFeature.find(d => d && 'properties' in d && d.properties?.radius)
  );

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
 */
export function getGeojsonDataMaps(
  dataContainer: DataContainerInterface,
  getFeature: GetFeature
): GeojsonDataMaps {
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
 * Parse raw data to GeoJson point feature coordinates
 */
export function getGeojsonPointDataMaps(
  dataContainer: DataContainerInterface,
  getFeature: GetFeature
): GeojsonPointDataMaps {
  const acceptableTypes = ['Point', 'MultiPoint', 'GeometryCollection'];

  const dataToFeature: GeojsonPointDataMaps = [];

  for (let index = 0; index < dataContainer.numRows(); index++) {
    const feature = parseGeoJsonRawFeature(getFeature(dataContainer.rowAsArray(index)));

    if (feature && feature.geometry && acceptableTypes.includes(feature.geometry.type)) {
      dataToFeature[index] =
        feature.geometry.type === 'Point' || feature.geometry.type === 'MultiPoint'
          ? feature.geometry.coordinates
          : // @ts-expect-error Property 'geometries' does not exist on type 'LineString'
            (feature.geometry.geometries || []).reduce((accu, f) => {
              if (f.type === 'Point') {
                accu.push(f.coordinates);
              } else if (f.type === 'MultiPoint') {
                accu.push(...f.coordinates);
              }

              return accu;
            }, []);
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
function parseGeometryFromString(geoString: string): Feature | null {
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

/**
 * Get geojson bounds
 */
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

type CoordsType = [number, number, number, number | null] & {
  datumIndex: number;
  datum: number[];
};

export function groupColumnsAsGeoJson(
  dataContainer: DataContainerInterface,
  columns: LayerColumns,
  sortByColumn = 'timestamp'
): Feature[] {
  const groupedById: {[key: string]: CoordsType[]} = {};
  const sortByFieldIdx = columns[sortByColumn].fieldIdx;
  const sortByRequired = !columns[sortByColumn].optional;
  for (let index = 0; index < dataContainer.numRows(); index++) {
    // note: can materialize the row
    const datum = dataContainer.rowAsArray(index);
    const id = datum[columns.id.fieldIdx];
    const lat = datum[columns.lat.fieldIdx];
    const lon = datum[columns.lng.fieldIdx];
    const altitude = columns.altitude ? datum[columns.altitude.fieldIdx] : 0;
    const sortBy = sortByFieldIdx > -1 ? datum[sortByFieldIdx] : null;
    // @ts-expect-error
    const coords: CoordsType = [lon, lat, altitude, sortBy];
    // Adding references to the original data to the coordinates array
    coords.datumIndex = index;
    coords.datum = datum;
    if (!groupedById[id]) groupedById[id] = [];

    if (
      Number.isFinite(lon) &&
      Number.isFinite(lat) &&
      (!sortByRequired || (sortByRequired && sortBy))
    ) {
      // only push points if lat,lng,and sortby exist
      groupedById[id].push(coords);
    }
  }

  const result: Feature[] = Object.entries(groupedById).map(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ([_, items]: [string, CoordsType[]], index) => ({
      type: 'Feature' as const,
      geometry: {
        type: 'LineString' as const,
        // Sort by columns if has sortByField
        // TODO: items are expected in Position[] format?
        coordinates: (sortByFieldIdx > -1
          ? items.sort((a, b) => ascending(a[3] as any, b[3] as any))
          : items) as Position[]
      },
      properties: {
        index,
        // values are used for valueAccessor in TripLayer.formatLayerData()
        // Note: this can cause row materialization in case of non-row based containers
        values: items.map(item => dataContainer.rowAsArray(item.datumIndex))
      }
    })
  );
  return result;
}

/**
 * Find id / ts / lat / lng columns from a table and assign it to layer columns
 */
export function detectTableColumns(
  dataset: KeplerTable,
  layerColumns: LayerColumns,
  sortBy = 'timestamp'
) {
  const {fields, fieldPairs} = dataset;
  if (!fieldPairs.length || !fields.length) {
    return null;
  }
  // find sort by field
  const sortByFieldIdx = fields.findIndex(f => f.type === ALL_FIELD_TYPES.timestamp);
  // find id column
  const idFieldIdx = fields.findIndex(f => f.name?.toLowerCase().match(/^(id|uuid)$/g));

  if (sortByFieldIdx > -1 && idFieldIdx > -1) {
    const pointColumns = assignPointPairToLayerColumn(fieldPairs[0], true);
    return {
      columns: {
        ...Object.keys(layerColumns).reduce(
          (accu, col) => ({
            ...accu,
            [col]: pointColumns[col] ?? layerColumns[col]
          }),
          {}
        ),
        geojson: {
          value: null,
          fieldIdx: -1
          // optional: true
        },
        id: {
          value: fields[idFieldIdx].name,
          fieldIdx: idFieldIdx
          // optional: false
        },
        [sortBy]: {
          value: fields[sortByFieldIdx].name,
          fieldIdx: sortByFieldIdx
          // optional: false
        }
      },
      label: fieldPairs[0].defaultName
    };
  }

  return null;
}

export function applyFiltersToTableColumns(
  dataset: KeplerTable,
  dataToFeature: GeojsonDataMaps
): GeojsonDataMaps {
  const {dataContainer, filteredIndex} = dataset;
  if (filteredIndex.length === dataContainer.numRows()) {
    // Only apply the filtering when something is to be filtered out
    return dataToFeature;
  }

  const filteredIndexSet = new Set(filteredIndex);
  const filteredFeatures: GeojsonDataMaps = [];
  for (const feature of dataToFeature) {
    // @ts-expect-error geometry.coordinates not available for GeometryCollection
    const filteredCoords = feature.geometry.coordinates.filter(c =>
      filteredIndexSet.has(c.datumIndex)
    );
    if (filteredCoords.length > 0 && feature) {
      filteredFeatures.push({
        ...feature,
        geometry: {
          // @ts-expect-error BinaryFeatureCollection
          ...feature.geometry,
          coordinates: filteredCoords
        },
        properties: {
          // @ts-expect-error BinaryFeatureCollection
          ...feature.properties,
          // @ts-expect-error BinaryFeatureCollection
          values: feature.geometry.coordinates.map(c => dataContainer.rowAsArray(c.datumIndex))
        }
      });
    }
  }
  return filteredFeatures;
}
