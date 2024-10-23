// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import * as arrow from 'apache-arrow';
import {Feature, BBox} from 'geojson';
import {getGeoMetadata} from '@loaders.gl/gis';

import {Field, FieldPair, SupportedColumnMode, LayerColumn} from '@kepler.gl/types';
import {DataContainerInterface, ArrowDataContainer} from '@kepler.gl/utils';
import {
  getBinaryGeometriesFromArrow,
  parseGeometryFromArrow,
  BinaryGeometriesFromArrowOptions
} from '@loaders.gl/arrow';
import {EXTENSION_NAME} from '@kepler.gl/deckgl-arrow-layers';

import {DeckGlGeoTypes, GeojsonDataMaps} from './geojson-layer/geojson-utils';

export function assignPointPairToLayerColumn(pair: FieldPair, hasAlt: boolean) {
  const {lat, lng, altitude} = pair.pair;
  if (!hasAlt) {
    return {lat, lng};
  }

  const defaultAltColumn = {value: null, fieldIdx: -1, optional: true};

  return {
    lat,
    lng,
    altitude: altitude ? {...defaultAltColumn, ...altitude} : defaultAltColumn
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
  geoColumn,
  geoField,
  chunkIndex
}: {
  dataContainer: DataContainerInterface;
  geoColumn: arrow.Vector;
  geoField: Field;
  chunkIndex?: number;
}): GeojsonLayerMetaProps {
  const encoding = geoField?.metadata?.get('ARROW:extension:name');
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
    // @ts-ignore
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

/**
 * find requiredColumns of supported column mode based on column mode
 */
export function getColumnModeRequiredColumns(
  supportedColumnModes: SupportedColumnMode[] | null,
  columnMode?: string
): string[] | undefined {
  return supportedColumnModes?.find(({key}) => key === columnMode)?.requiredColumns;
}

/**
 * Returns geoarrow fields with ARROW:extension:name POINT metadata
 * @param fields Any fields
 * @returns geoarrow fields with ARROW:extension:name POINT metadata
 */
export function getGeoArrowPointFields(fields: Field[]): Field[] {
  return fields.filter(field => {
    return (
      field.type === 'geoarrow' &&
      field.metadata.get('ARROW:extension:name') === EXTENSION_NAME.POINT
    );
  });
}

/**
 * Builds an arrow vector compatible with ARROW:extension:name geoarrow.point.
 * @param getPosition Position accessor.
 * @param numElements Number of elements in the vector.
 * @returns An arrow vector compatible with ARROW:extension:name geoarrow.point.
 */
export function createGeoArrowPointVector(
  getPosition: ({index: number}) => number[],
  numElements: number
): arrow.Vector {
  // TODO update/resize existing vector
  // TODO find an easier way to create point geo column
  // TODO support batches?

  const numCoords = numElements > 0 ? getPosition({index: 0}).length : 2;
  const precision = 2;

  const metadata = new Map();
  metadata.set('ARROW:extension:name', EXTENSION_NAME.POINT);

  const childField = new arrow.Field('xyz', new arrow.Float(precision), false, metadata);
  const fixedSizeList = new arrow.FixedSizeList(numCoords, childField);
  const floatBuilder = new arrow.FloatBuilder({type: new arrow.Float(precision)});
  const fixedSizeListBuilder = new arrow.FixedSizeListBuilder({type: fixedSizeList});
  fixedSizeListBuilder.addChild(floatBuilder);

  for (let i = 0; i < numElements; ++i) {
    const pos = getPosition({index: i});
    fixedSizeListBuilder.append(pos);
  }
  fixedSizeListBuilder.finish();
  return fixedSizeListBuilder.toVector();
}

/**
 * Builds a filtered index suitable for FilterArrowExtension.
 * @param numElements Size for filtered index array.
 * @param visibleIndices An array with indices of elements that aren't filtered out.
 * @returns filteredIndex [0|1] array for GPU filtering
 */
export function getFilteredIndex(
  numElements: number,
  visibleIndices: number[],
  existingFilteredIndex: Uint8ClampedArray | null
) {
  // contents are initialized with zeros by default, meaning not visible
  let filteredIndex =
    existingFilteredIndex && existingFilteredIndex.length === numElements
      ? existingFilteredIndex
      : new Uint8ClampedArray(numElements);
  filteredIndex.fill(0);

  if (visibleIndices) {
    for (let i = 0; i < visibleIndices.length; ++i) {
      filteredIndex[visibleIndices[i]] = 1;
    }
  }
  return filteredIndex;
}

/**
 * Returns an array of neighbors to the specified index.
 * @param neighborsField LayerColumn field with information about neighbors.
 * @param dataContainer Data container.
 * @param index Index of interest.
 * @param getPosition Position accessor.
 * @returns An array with information about neighbors.
 */
export function getNeighbors(
  neighborsField: LayerColumn | undefined,
  dataContainer: DataContainerInterface,
  index: number,
  getPosition: ({index: number}) => number[]
): {index: number; position: number[]}[] {
  if (!neighborsField || neighborsField.fieldIdx < 0) return [];

  let neighborIndices = dataContainer.valueAt(index, neighborsField.fieldIdx);
  // In case of arrow column with an array of indices.
  if (neighborIndices.toArray) {
    neighborIndices = Array.from(neighborIndices.toArray());
  }
  if (!Array.isArray(neighborIndices)) return [];

  // find neighbor
  const neighborsData = neighborIndices.map(idx => ({
    index: idx,
    position: getPosition({index: idx})
  }));

  return neighborsData;
}

/**
 * Returns bounds from a geoarrow field.
 * TODO: refactor once metadata extraction from parquet to arrow vectors is in place.
 * @param layerColumn Layer columns for which to check for a bounding box.
 * @param dataContainer Data container with geoarrow metadata.
 * @returns Returns bounding box if exists.
 */
export function getBoundsFromArrowMetadata(
  layerColumn: LayerColumn,
  dataContainer: ArrowDataContainer
): [number, number, number, number] | false {
  try {
    const field = dataContainer.getField(layerColumn.fieldIdx);
    const table = dataContainer.getTable();

    const geoMetadata = getGeoMetadata({
      metadata: {
        // @ts-expect-error
        geo: table.schema.metadata.get('geo')
      }
    });

    if (geoMetadata) {
      const fieldMetadata = geoMetadata.columns[field.name];
      if (fieldMetadata) {
        const boundsFromMetadata = fieldMetadata['bbox'];
        if (Array.isArray(boundsFromMetadata) && boundsFromMetadata.length === 4) {
          return boundsFromMetadata;
        }
      }
    }
  } catch (error) {
    // ignore for now
  }

  return false;
}
