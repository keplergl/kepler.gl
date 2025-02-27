// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import * as arrow from 'apache-arrow';
import {Feature, BBox} from 'geojson';
import {getGeoMetadata} from '@loaders.gl/gis';

import {GEOARROW_EXTENSIONS, GEOARROW_METADATA_KEY} from '@kepler.gl/constants';
import {KeplerTable} from '@kepler.gl/table';
import {
  Field,
  ProtoDatasetField,
  FieldPair,
  SupportedColumnMode,
  LayerColumn,
  LayerColumns,
  RGBColor
} from '@kepler.gl/types';
import {DataContainerInterface, ArrowDataContainer} from '@kepler.gl/utils';
import {
  getBinaryGeometriesFromArrow,
  parseGeometryFromArrow,
  BinaryGeometriesFromArrowOptions,
  updateBoundsFromGeoArrowSamples
} from '@loaders.gl/arrow';

import {WKBLoader} from '@loaders.gl/wkt';
import {geojsonToBinary} from '@loaders.gl/gis';
import {
  BinaryFeatureCollection,
  Geometry,
  BinaryPointFeature,
  BinaryLineFeature,
  BinaryPolygonFeature
} from '@loaders.gl/schema';

import {DeckGlGeoTypes, GeojsonDataMaps} from './geojson-layer/geojson-utils';

export type FindDefaultLayerProps = {
  label: string;
  color?: RGBColor;
  isVisible?: boolean;
  columns?: Record<string, LayerColumn>;
};

export type FindDefaultLayerPropsReturnValue = {
  /** Layer props to create layers by default when a dataset is added */
  props: FindDefaultLayerProps[];
  /** layer props of possible alternative layer configurations, not created by default */
  altProps?: FindDefaultLayerProps[];
  /** Already found layer configurations */
  foundLayers?: (FindDefaultLayerProps & {type: string})[];
};

export function assignPointPairToLayerColumn(
  pair: FieldPair,
  hasAlt: boolean
): Record<string, LayerColumn> {
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

/**
 * Converts a geoarrow.wkb vector into an array of BinaryFeatureCollections.
 * @param geoColumn A vector column with geoarrow.wkb extension.
 * @param options Options for geometry transformation.
 * @returns
 */
function getBinaryGeometriesFromWKBArrow(
  geoColumn: arrow.Vector,
  options: {chunkIndex?: number; chunkOffset?: number}
): GeojsonLayerMetaProps {
  const dataToFeature: BinaryFeatureCollection[] = [];
  const featureTypes: GeojsonLayerMetaProps['featureTypes'] = {
    point: false,
    line: false,
    polygon: false
  };

  const chunks =
    options?.chunkIndex !== undefined && options?.chunkIndex >= 0
      ? [geoColumn.data[options?.chunkIndex]]
      : geoColumn.data;
  const globalFeatureIdOffset = options?.chunkOffset || 0;
  let featureIndex = globalFeatureIdOffset;
  let bounds: [number, number, number, number] = [Infinity, Infinity, -Infinity, -Infinity];

  chunks.forEach(chunk => {
    const geojsonFeatures: Feature[] = [];
    for (let i = 0; i < chunk.length; ++i) {
      // ignore features without any geometry
      if (chunk.valueOffsets[i + 1] - chunk.valueOffsets[i] > 0) {
        const valuesSlice = chunk.values.slice(chunk.valueOffsets[i], chunk.valueOffsets[i + 1]);

        const geometry = WKBLoader?.parseSync?.(valuesSlice.buffer, {
          wkb: {shape: 'geojson-geometry'}
        }) as Geometry;
        const feature: Feature = {
          type: 'Feature',
          geometry,
          properties: {index: featureIndex}
        };
        geojsonFeatures.push(feature);

        const {type} = geometry;
        featureTypes.polygon = type === 'Polygon' || type === 'MultiPolygon';
        featureTypes.point = type === 'Point' || type === 'MultiPoint';
        featureTypes.line = type === 'LineString' || type === 'MultiLineString';
      }

      featureIndex++;
    }

    const geojsonToBinaryOptions = {
      triangulate: true,
      fixRingWinding: true
    };
    const binaryFeatures = geojsonToBinary(geojsonFeatures, geojsonToBinaryOptions);

    // Need to update globalFeatureIds, to take into account previous batches,
    // as geojsonToBinary doesn't have such option.
    const featureTypesArr = ['points', 'lines', 'polygons'];
    featureTypesArr.forEach(prop => {
      const features = binaryFeatures[prop] as
        | BinaryPointFeature
        | BinaryLineFeature
        | BinaryPolygonFeature;
      if (features) {
        bounds = updateBoundsFromGeoArrowSamples(
          features.positions.value as Float64Array,
          features.positions.size,
          bounds
        );

        const {globalFeatureIds, numericProps} = features;
        const {index} = numericProps;
        const len = globalFeatureIds.value.length;
        for (let i = 0; i < len; ++i) {
          globalFeatureIds.value[i] = index.value[i];
        }
      }
    });

    dataToFeature.push(binaryFeatures);
  });

  return {
    dataToFeature: dataToFeature,
    featureTypes: featureTypes,
    bounds,
    fixedRadius: false
  };
}

export function getGeojsonLayerMetaFromArrow({
  geoColumn,
  geoField,
  chunkIndex
}: {
  dataContainer: DataContainerInterface;
  geoColumn: arrow.Vector;
  geoField: ProtoDatasetField;
  chunkIndex?: number;
}): GeojsonLayerMetaProps {
  const encoding = geoField?.metadata?.get(GEOARROW_METADATA_KEY);
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

  // getBinaryGeometriesFromArrow doesn't support geoarrow.wkb
  if (encoding === GEOARROW_EXTENSIONS.WKB) {
    return getBinaryGeometriesFromWKBArrow(geoColumn, options);
  }

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
    const encoding = field?.metadata?.get(GEOARROW_METADATA_KEY);

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
      field.metadata?.get(GEOARROW_METADATA_KEY) === GEOARROW_EXTENSIONS.POINT
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
  dataContainer: ArrowDataContainer,
  getPosition: ({index}: {index: number}) => number[]
): arrow.Vector {
  // TODO update/resize existing vector?
  // TODO find an easier way to create point geo columns
  // in a correct arrow format, as this approach seems too excessive for just a simple interleaved buffer.

  const numElements = dataContainer.numRows();
  const table = dataContainer.getTable();

  const numCoords = numElements > 0 ? getPosition({index: 0}).length : 2;
  const precision = 2;

  const metadata = new Map();
  metadata.set(GEOARROW_METADATA_KEY, GEOARROW_EXTENSIONS.POINT);

  const childField = new arrow.Field('xyz', new arrow.Float(precision), false, metadata);
  const fixedSizeList = new arrow.FixedSizeList(numCoords, childField);
  const floatBuilder = new arrow.FloatBuilder({type: new arrow.Float(precision)});
  const fixedSizeListBuilder = new arrow.FixedSizeListBuilder({type: fixedSizeList});
  fixedSizeListBuilder.addChild(floatBuilder);

  const assembledBatches: arrow.Data[] = [];
  const indexData = {index: 0};
  for (let batchIndex = 0; batchIndex < table.batches.length; ++batchIndex) {
    const numRowsInBatch = table.batches[batchIndex].numRows;

    for (let i = 0; i < numRowsInBatch; ++i) {
      const pos = getPosition(indexData);
      fixedSizeListBuilder.append(pos);

      ++indexData.index;
    }
    assembledBatches.push(fixedSizeListBuilder.flush());
  }

  return arrow.makeVector(assembledBatches);
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
  const filteredIndex =
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
  getPosition: ({index}: {index: number}) => number[]
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

/**
 * Finds and returns the first satisfied column mode based on the provided columns and fields.
 * @param supportedColumnModes - An array of supported column modes to check.
 * @param columns - The available columns.
 * @param fields - Optional table fields to be used for extra verification.
 * @returns The first column mode that satisfies the required conditions, or undefined if none match.
 */
export function getSatisfiedColumnMode(
  columnModes: SupportedColumnMode[] | null,
  columns: LayerColumns | undefined,
  fields?: KeplerTable['fields']
): SupportedColumnMode | undefined {
  return columnModes?.find(mode => {
    return mode.requiredColumns?.every(requriedCol => {
      const column = columns?.[requriedCol];
      if (column?.value) {
        if (mode.verifyField && fields?.[column.fieldIdx]) {
          const field = fields[column.fieldIdx];
          return mode.verifyField(field);
        }
        return true;
      }
      return false;
    });
  });
}

/**
 * Returns true if the field is of geoarrow point format.
 * @param field A field.
 * @returns Returns true if the field is of geoarrow point format.
 */
export function isGeoArrowPointField(field: Field) {
  return (
    field.type === 'geoarrow' &&
    field.metadata?.get(GEOARROW_METADATA_KEY) === GEOARROW_EXTENSIONS.POINT
  );
}

/**
 * Create default geoarrow column props based on the dataset.
 * @param dataset A dataset to create layer props from.
 * @returns  geoarrow column props.
 */
export function getGeoArrowPointLayerProps(dataset: KeplerTable) {
  const {label} = dataset;
  const altProps: FindDefaultLayerProps[] = [];
  dataset.fields.forEach(field => {
    if (isGeoArrowPointField(field)) {
      altProps.push({
        label: (typeof label === 'string' && label.replace(/\.[^/.]+$/, '')) || field.name,
        columns: {geoarrow: {value: field.name, fieldIdx: field.fieldIdx}}
      });
    }
  });
  return altProps;
}
