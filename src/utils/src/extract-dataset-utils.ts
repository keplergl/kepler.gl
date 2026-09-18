// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {DatasetType} from '@kepler.gl/constants';
import {Feature, ProtoDatasetField} from '@kepler.gl/types';

import {DataContainerInterface} from './data-container-interface';
import {
  canApplyFeatureFilter,
  generatePolygonFilter,
  getPolygonFilterFunctor
} from './filter-utils';

const NON_EXTRACTABLE_DATASET_TYPES = new Set<string>([
  DatasetType.VECTOR_TILE,
  DatasetType.RASTER_TILE,
  DatasetType.WMS_TILE,
  DatasetType.TILE_3D,
  DatasetType.BITMAP
]);

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

/**
 * Tiled / remote datasets have no in-memory rows to copy.
 */
export function isExtractableDataset(dataset?: ExtractableDataset | null): boolean {
  if (!dataset || dataset.disableDataOperation) {
    return false;
  }
  if (dataset.type && NON_EXTRACTABLE_DATASET_TYPES.has(dataset.type)) {
    return false;
  }
  return Boolean(dataset.dataContainer?.numRows?.());
}

export function isExtractableLayer(
  layer: {config: {dataId: string | null}},
  datasets: Record<string, ExtractableDataset | undefined>
): boolean {
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

/**
 * Copy in-memory rows whose geometry falls inside a drawn polygon.
 * Existing table filters (range/select/time) are applied; the polygon clip is extra.
 */
export function extractRowsInsideFeature({
  layer,
  dataset,
  feature
}: {
  layer: {id: string; config: {dataId: string | null; label: string}; [key: string]: any};
  dataset: ExtractableDataset;
  feature: Feature | null;
}): {fields: ProtoDatasetField[]; rows: any[][]; rowCount: number} | null {
  if (!feature || !canApplyFeatureFilter(feature) || !isExtractableDataset(dataset)) {
    return null;
  }

  const polygonFilter = generatePolygonFilter([layer], feature);
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
    fields: cloneFieldDescriptors(dataset.fields),
    rows,
    rowCount: rows.length
  };
}
