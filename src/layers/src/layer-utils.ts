// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import * as arrow from 'apache-arrow';
import {Feature, BBox} from 'geojson';
import {Field, FieldPair} from '@kepler.gl/types';
import {DataContainerInterface} from '@kepler.gl/utils';
import {
  getBinaryGeometriesFromArrow,
  parseGeometryFromArrow,
  BinaryGeometriesFromArrowOptions
} from '@loaders.gl/arrow';

import {DeckGlGeoTypes, GeojsonDataMaps} from './geojson-layer/geojson-utils';

export function assignPointPairToLayerColumn(pair: FieldPair, hasAlt: boolean) {
  const {lat, lng, alt} = pair.pair;
  if (!hasAlt) {
    return {lat, lng};
  }

  const defaultAltColumn = {value: null, fieldIdx: -1, optional: true};

  return {
    lat,
    lng,
    altitude: alt ? {...defaultAltColumn, ...alt} : defaultAltColumn
  };
}

export type GeojsonLayerMetaProps = {
  dataToFeature: GeojsonDataMaps;
  featureTypes: DeckGlGeoTypes;
  bounds: BBox | null;
  fixedRadius: boolean;
  centroids?: Array<number[] | null>;
};

export function getGeojsonLayerMetaFromArrow({
  dataContainer,
  getGeoColumn,
  getGeoField,
  chunkIndex
}: {
  dataContainer: DataContainerInterface;
  getGeoColumn: (dataContainer: DataContainerInterface) => unknown;
  getGeoField: (dataContainer: DataContainerInterface) => Field | null;
  chunkIndex?: number;
}): GeojsonLayerMetaProps {
  const geoColumn = getGeoColumn(dataContainer) as arrow.Vector;
  const arrowField = getGeoField(dataContainer);

  const encoding = arrowField?.metadata?.get('ARROW:extension:name');
  const options: BinaryGeometriesFromArrowOptions = {
    ...(chunkIndex !== undefined && chunkIndex >= 0
      ? {
          chunkIndex,
          chunkOffset: geoColumn.data[0].length * chunkIndex
        }
      : {}),
    triangulate: true,
    calculateMeanCenters: true
  };
  // create binary data from arrow data for GeoJsonLayer
  const {binaryGeometries, featureTypes, bounds, meanCenters} = getBinaryGeometriesFromArrow(
    geoColumn,
    encoding,
    options
  );

  // since there is no feature.properties.radius, we set fixedRadius to false
  const fixedRadius = false;

  return {
    dataToFeature: binaryGeometries,
    featureTypes,
    bounds,
    fixedRadius,
    centroids: meanCenters
  };
}

export function isLayerHoveredFromArrow(objectInfo, layerId: string): boolean {
  // there could be multiple deck.gl layers created from multiple chunks in arrow table
  // the objectInfo.layer id should be `${this.id}-${i}`
  if (objectInfo?.picked) {
    const deckLayerId = objectInfo?.layer?.props?.id;
    return deckLayerId.startsWith(layerId);
  }
  return false;
}

export function getHoveredObjectFromArrow(
  objectInfo,
  dataContainer,
  layerId,
  columnAccessor,
  fieldAccessor
): Feature | null {
  // hover object returns the index of the object in the data array
  // NOTE: this could be done in Deck.gl getPickingInfo(params) and binaryToGeojson()
  if (isLayerHoveredFromArrow(objectInfo, layerId) && objectInfo.index >= 0 && dataContainer) {
    const col = columnAccessor(dataContainer);
    const rawGeometry = col?.get(objectInfo.index);

    const field = fieldAccessor(dataContainer);
    const encoding = field?.metadata?.get('ARROW:extension:name');

    const hoveredFeature = parseGeometryFromArrow(rawGeometry, encoding);

    const properties = dataContainer.rowAsArray(objectInfo.index).reduce((prev, cur, i) => {
      const fieldName = dataContainer?.getField?.(i).name;
      if (fieldName !== field.name) {
        prev[fieldName] = cur;
      }
      return prev;
    }, {});

    return hoveredFeature
      ? {
          type: 'Feature',
          geometry: hoveredFeature,
          properties: {
            ...properties,
            index: objectInfo.index
          }
        }
      : null;
  }
  return null;
}
