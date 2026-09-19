// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {DatasetType, LAYER_TYPES} from '@kepler.gl/constants';
import {Feature, ProtoDatasetField} from '@kepler.gl/types';

import {DataContainerInterface} from './data-container-interface';
import {
  canApplyFeatureFilter,
  generatePolygonFilter,
  getPolygonFilterFunctor,
  isInPolygon
} from './filter-utils';

const NON_EXTRACTABLE_DATASET_TYPES = new Set<string>([
  DatasetType.RASTER_TILE,
  DatasetType.WMS_TILE,
  DatasetType.TILE_3D,
  DatasetType.BITMAP
]);

const VECTOR_TILE_ID_FIELDS = [
  'ufid',
  'UFID',
  'id',
  'ID',
  'fid',
  'FID',
  'objectid',
  'OBJECTID',
  'gid',
  'GID',
  'feature_id',
  'FEATURE_ID',
  '_id'
];

export type ExtractableDataset = {
  type?: string;
  disableDataOperation?: boolean;
  fields: Array<{
    name: string;
    type: string;
    format?: string;
    analyzerType?: string;
    displayName?: string;
  }>;
  dataContainer: DataContainerInterface;
  filteredIndex?: number[];
  allIndexes?: number[];
};

export type ExtractableLayer = {
  type?: string | null;
  config: {
    dataId: string | null;
    label?: string;
    isVisible?: boolean;
    uniqueIdField?: string;
  };
  tileDataset?: {
    getTiles?: () => readonly any[];
  };
  [key: string]: any;
};

export type ExtractedTable = {
  kind: 'table';
  fields: ProtoDatasetField[];
  rows: any[][];
  rowCount: number;
};

export type ExtractedGeojson = {
  kind: 'geojson';
  features: Array<{
    type: 'Feature';
    id?: string | number;
    geometry: any;
    properties?: Record<string, any> | null;
  }>;
  rowCount: number;
};

export type ExtractResult = ExtractedTable | ExtractedGeojson;

/**
 * Tiled raster/WMS/3D sources have no copyable rows. Vector tiles are extractable
 * from the layer's loaded tile cache, not from dataset.rows.
 */
export function isExtractableDataset(dataset?: ExtractableDataset | null): boolean {
  if (!dataset || dataset.disableDataOperation) {
    return false;
  }
  if (dataset.type === DatasetType.VECTOR_TILE) {
    return false;
  }
  if (dataset.type && NON_EXTRACTABLE_DATASET_TYPES.has(dataset.type)) {
    return false;
  }
  return Boolean(dataset.dataContainer?.numRows?.());
}

export function isVectorTileExtractLayer(layer?: ExtractableLayer | null): boolean {
  return Boolean(layer && layer.type === LAYER_TYPES.vectorTile);
}

export function isExtractableLayer(
  layer: ExtractableLayer,
  datasets: Record<string, ExtractableDataset | undefined>
): boolean {
  if (isVectorTileExtractLayer(layer)) {
    return Boolean(layer.config?.dataId);
  }
  const dataId = layer.config.dataId;
  return Boolean(dataId && isExtractableDataset(datasets[dataId]));
}

function cloneFieldDescriptors(fields: ExtractableDataset['fields']): ProtoDatasetField[] {
  return fields.map(field => ({
    name: field.name,
    type: field.type,
    format: field.format,
    analyzerType: field.analyzerType,
    displayName: field.displayName
  }));
}

function getTileFeatures(tile: any): any[] {
  const content = tile?.content;
  if (!content) {
    return [];
  }
  if (content.shape === 'geojson-table') {
    return Array.isArray(content.features) ? content.features : [];
  }
  return Array.isArray(content) ? content : [];
}

function anyCoordinateInPolygon(node: any, polygon: Feature): boolean {
  if (!Array.isArray(node) || !node.length) {
    return false;
  }
  if (typeof node[0] === 'number') {
    return isInPolygon(node, polygon);
  }
  for (let i = 0; i < node.length; i++) {
    if (anyCoordinateInPolygon(node[i], polygon)) {
      return true;
    }
  }
  return false;
}

function featureIntersectsDrawnPolygon(feature: any, polygon: Feature): boolean {
  const geometry = feature?.geometry;
  if (!geometry) {
    return false;
  }
  if (geometry.type === 'GeometryCollection' && Array.isArray(geometry.geometries)) {
    return geometry.geometries.some(geom =>
      featureIntersectsDrawnPolygon({type: 'Feature', geometry: geom, properties: {}}, polygon)
    );
  }
  return anyCoordinateInPolygon(geometry.coordinates, polygon);
}

function vectorTileFeatureId(feature: any, uniqueIdField?: string): string | null {
  const properties = feature?.properties || {};
  if (uniqueIdField && properties[uniqueIdField] != null) {
    return String(properties[uniqueIdField]);
  }
  if (feature?.id != null) {
    return String(feature.id);
  }
  for (let i = 0; i < VECTOR_TILE_ID_FIELDS.length; i++) {
    const key = VECTOR_TILE_ID_FIELDS[i];
    if (properties[key] != null) {
      return `${key}:${properties[key]}`;
    }
  }
  return null;
}

function cloneGeojsonFeature(feature: any) {
  return JSON.parse(JSON.stringify(feature));
}

/**
 * Copy GeoJSON features from currently loaded vector tiles that fall inside a drawing.
 * Coverage is the current viewport/zoom tile cache, not the full tileset.
 */
export function extractVectorTileFeaturesInsideFeature({
  layer,
  feature
}: {
  layer: ExtractableLayer;
  feature: Feature | null;
}): ExtractedGeojson | null {
  if (!feature || !canApplyFeatureFilter(feature) || !isVectorTileExtractLayer(layer)) {
    return null;
  }

  const tiles = layer.tileDataset?.getTiles?.() || [];
  const uniqueIdField = layer.config?.uniqueIdField;
  const seen = new Set<string>();
  const features: ExtractedGeojson['features'] = [];

  for (let t = 0; t < tiles.length; t++) {
    const tileFeatures = getTileFeatures(tiles[t]);
    for (let i = 0; i < tileFeatures.length; i++) {
      const tileFeature = tileFeatures[i];
      if (!featureIntersectsDrawnPolygon(tileFeature, feature)) {
        continue;
      }
      const id = vectorTileFeatureId(tileFeature, uniqueIdField);
      if (id) {
        if (seen.has(id)) {
          continue;
        }
        seen.add(id);
      }
      features.push(cloneGeojsonFeature(tileFeature));
    }
  }

  return {kind: 'geojson', features, rowCount: features.length};
}

/**
 * Copy in-memory rows whose geometry falls inside a drawn polygon.
 * Existing table filters (range/select/time) are applied; the polygon clip is extra.
 * Vector tiles use currently loaded viewport tiles instead of dataset.rows.
 */
export function extractRowsInsideFeature({
  layer,
  dataset,
  feature
}: {
  layer: ExtractableLayer;
  dataset: ExtractableDataset;
  feature: Feature | null;
}): ExtractResult | null {
  if (isVectorTileExtractLayer(layer)) {
    return extractVectorTileFeaturesInsideFeature({layer, feature});
  }

  if (!feature || !canApplyFeatureFilter(feature) || !isExtractableDataset(dataset)) {
    return null;
  }

  const polygonFilter = generatePolygonFilter([layer as any], feature);
  const isInside = getPolygonFilterFunctor(layer, polygonFilter, dataset.dataContainer);
  const sourceIndexes = dataset.filteredIndex || dataset.allIndexes || [];

  const rows: any[][] = [];
  for (let i = 0; i < sourceIndexes.length; i++) {
    const index = sourceIndexes[i];
    if (!isInside({index})) {
      continue;
    }
    rows.push(dataset.dataContainer.rowAsArray(index).slice());
  }

  return {
    kind: 'table',
    fields: cloneFieldDescriptors(dataset.fields),
    rows,
    rowCount: rows.length
  };
}
