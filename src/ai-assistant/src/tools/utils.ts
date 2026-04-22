// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import interpolate from 'color-interpolate';
import {Feature} from 'geojson';
import {Layer, VectorTileLayer} from '@kepler.gl/layers';
import {Datasets, KeplerTable} from '@kepler.gl/table';
import {ALL_FIELD_TYPES, LAYER_TYPES} from '@kepler.gl/constants';
import {Field, ProtoDataset, ProtoDatasetField} from '@kepler.gl/types';
import {processFileData} from '@kepler.gl/processors';

export function interpolateColor(originalColors: string[], numberOfColors: number) {
  if (originalColors.length === numberOfColors) {
    return originalColors;
  }
  const interp = interpolate(originalColors);
  const colors = Array.from({length: numberOfColors}, (_, j) => interp(j / (numberOfColors - 1)));
  const hexColors = colors.map(color => {
    const rgb = color.match(/\d+/g);
    return `#${rgb?.map(c => parseInt(c).toString(16).padStart(2, '0')).join('')}`;
  });
  return hexColors;
}

export function getValuesFromDataset(
  datasets: Datasets,
  layers: Layer[],
  datasetName: string,
  variableName: string
): unknown[] {
  const datasetId = Object.keys(datasets).find(dataId => datasets[dataId].label === datasetName);
  if (!datasetId) {
    throw new Error(`Dataset ${datasetName} not found`);
  }
  const dataset = datasets[datasetId];
  if (dataset) {
    const field = dataset.fields.find(f => f.name === variableName);
    if (!field) {
      throw new Error(`Field ${variableName} not found in dataset ${datasetName}`);
    }
    if (dataset.type === 'vector-tile') {
      const vtField = dataset.fields.find(f => f.name === variableName);
      if (vtField) {
        return getValuesFromVectorTileLayer(datasetId, layers, vtField);
      }
    }
    return Array.from({length: dataset.length}, (_, i) => dataset.getValue(variableName, i));
  }
  return [];
}

function isVectorTileLayer(layer: Layer): layer is VectorTileLayer {
  return layer.type === LAYER_TYPES.vectorTile;
}

export function getValuesFromVectorTileLayer(datasetId: string, layers: Layer[], field: Field) {
  const layerIndex = layers.findIndex(layer => layer.config.dataId === datasetId);
  if (layerIndex === -1) return [];
  const layer = layers[layerIndex];
  if (!isVectorTileLayer(layer)) return [];
  const accessor = layer.accessRowValue(field);
  const values: unknown[] = [];
  // @ts-expect-error TODO fix this later in the vector-tile layer
  for (const row of layer.tileDataset.tileSet) {
    const value = accessor(field, row);
    if (value === null) break;
    values.push(value);
  }
  return values;
}

export function highlightRows(
  datasets: Datasets,
  layers: Layer[],
  datasetName: string,
  selectedRowIndices: number[],
  layerSetIsValid: (layer: Layer, isValid: boolean) => void
) {
  const datasetId = Object.keys(datasets).find(dataId => datasets[dataId].label === datasetName);
  if (!datasetId) return;
  const dataset = datasets[datasetId];
  if (dataset) {
    dataset.filteredIndex =
      selectedRowIndices.length === 0 ? dataset.allIndexes : selectedRowIndices;
    const selectLayers = layers.filter(layer => layer.config.dataId === dataset.id);
    selectLayers.forEach(layer => {
      layer.formatLayerData(datasets);
      layerSetIsValid(layer, true);
    });
  }
}

export function getDatasetContext(datasets?: Datasets, layers?: Layer[]) {
  if (!datasets || !layers) return '';
  const context =
    'Please remember the following datasets and layers for answering the user question:';
  const dataMeta = Object.values(datasets).map((dataset: KeplerTable) => ({
    datasetName: dataset.label,
    datasetId: dataset.id,
    fields: dataset.fields.map(field => ({[field.name]: field.type})),
    layers: layers
      .filter(layer => layer.config.dataId === dataset.id)
      .map(layer => ({
        id: layer.id,
        label: layer.config.label,
        type: layer.type,
        geometryMode: layer.config.columnMode,
        geometryColumns: Object.fromEntries(
          Object.entries(layer.config.columns)
            .filter(([, value]) => value !== null)
            .map(([key, value]) => [
              key,
              typeof value === 'object' && value !== null
                ? Object.fromEntries(Object.entries(value).filter(([, v]) => v !== null))
                : value
            ])
        )
      }))
  }));
  return `${context}\n${JSON.stringify(dataMeta)}`;
}

export type SpatialJoinGeometries = Feature[] | unknown[];

export function getGeometriesFromDataset(
  datasets: Datasets,
  layers: Layer[],
  layerData: any[],
  datasetName: string
): SpatialJoinGeometries {
  const datasetId = Object.keys(datasets).find(dataId => datasets[dataId].label === datasetName);
  if (!datasetId) {
    return [];
  }
  const dataset = datasets[datasetId];

  if (dataset.type === 'vector-tile') {
    const selected = layers.filter(layer => layer.config.dataId === dataset.id);
    const layer = selected.find(layer => layer.type === LAYER_TYPES.vectorTile);
    if (!layer) return [];
    const geometries: Feature[] = [];
    // @ts-expect-error TODO fix this later in the vector-tile layer
    for (const row of layer.tileDataset.tileSet) {
      geometries.push(row);
    }
    return geometries;
  }

  const selectedLayers = layers.filter(layer => layer.config.dataId === dataset.id);
  if (selectedLayers.length === 0) return [];

  const geojsonLayer = selectedLayers.find(layer => layer.type === LAYER_TYPES.geojson);
  const pointLayer = selectedLayers.find(layer => layer.type === LAYER_TYPES.point);
  const otherLayers = selectedLayers.filter(
    layer => layer.type !== LAYER_TYPES.geojson && layer.type !== LAYER_TYPES.point
  );

  const validLayer = geojsonLayer || pointLayer || otherLayers[0];
  if (validLayer) {
    const layerIndex = layers.findIndex(layer => layer.id === validLayer.id);
    const geometries = layerData[layerIndex];
    return geometries.data;
  }

  return [];
}

export function saveAsDataset(
  datasets: Datasets,
  layers: Layer[],
  datasetName: string,
  newDatasetName: string,
  data: Record<string, unknown[]>
) {
  const datasetId = Object.keys(datasets).find(dataId => datasets[dataId].label === datasetName);
  if (!datasetId) return;
  if (Object.keys(datasets).includes(newDatasetName)) return;

  const leftDataset = datasets[datasetId];
  let numRows = leftDataset.length;
  let geometries: Feature[];

  if (leftDataset.type === 'vector-tile') {
    geometries = getFeaturesFromVectorTile(leftDataset, layers) || [];
    numRows = geometries.length;
  }

  const fields: ProtoDatasetField[] = [
    ...Object.keys(data).map((fieldName, index) => ({
      name: fieldName,
      id: `${fieldName}_${index}`,
      displayName: fieldName,
      type: determineFieldType(data[fieldName][0])
    })),
    ...leftDataset.fields.map((field, index) => ({
      name: field.name,
      id: field.id || `${field.name}_${index}`,
      displayName: field.displayName,
      type: field.type
    })),
    ...(leftDataset.type === 'vector-tile'
      ? [{name: '_geojson', id: '_geojson', displayName: '_geojson', type: 'geojson'}]
      : [])
  ];

  const dataValues = Object.values(data);

  const rows = Array(numRows)
    .fill(null)
    .map((_, rowIdx) => [
      ...dataValues.map(col => col[rowIdx]),
      ...leftDataset.fields.map(field =>
        leftDataset.type === 'vector-tile'
          ? geometries[rowIdx].properties?.[field.name]
          : leftDataset.getValue(field.name, rowIdx)
      ),
      ...(leftDataset.type === 'vector-tile' ? [geometries[rowIdx]] : [])
    ]);

  const newDataset: ProtoDataset = {
    info: {id: newDatasetName, label: newDatasetName},
    data: {fields, rows}
  };

  return newDataset;
}

function determineFieldType(value: unknown): keyof typeof ALL_FIELD_TYPES {
  return typeof value === 'number'
    ? Number.isInteger(value)
      ? ALL_FIELD_TYPES.integer
      : ALL_FIELD_TYPES.real
    : ALL_FIELD_TYPES.string;
}

function getFeaturesFromVectorTile(leftDataset: KeplerTable, layers: Layer[]) {
  const layerIndex = layers.findIndex(layer => layer.config.dataId === leftDataset.id);
  if (layerIndex === -1) return;
  const layer = layers[layerIndex];
  if (!isVectorTileLayer(layer)) return;
  const features: Feature[] = [];
  // @ts-expect-error TODO fix this later in the vector-tile layer
  for (const row of layer.tileDataset.tileSet) {
    features.push(row);
  }
  return features;
}

export async function appendColumnsToDataset(
  datasets: Datasets,
  layers: Layer[],
  datasetName: string,
  result: Record<string, number>[],
  newDatasetName: string
) {
  const datasetId = Object.keys(datasets).find(dataId => datasets[dataId].label === datasetName);
  if (!datasetId) {
    throw new Error(`Dataset ${datasetName} not found`);
  }

  const originalDataset = datasets[datasetId];
  const fields = originalDataset.fields;
  const numRows = originalDataset.length || result.length;
  const rowObjects: Record<string, unknown>[] = [];

  if (originalDataset.type === 'vector-tile') {
    const columnData: Record<string, unknown[]> = {};
    for (const field of fields) {
      columnData[field.name] = getValuesFromVectorTileLayer(datasetId, layers, field);
    }
    for (let i = 0; i < numRows; i++) {
      const rowObject: Record<string, unknown> = {};
      for (const field of fields) {
        rowObject[field.name] = columnData[field.name][i];
      }
      rowObjects.push(rowObject);
    }
  } else {
    for (let i = 0; i < numRows; i++) {
      const rowObject: Record<string, unknown> = {};
      for (const field of fields) {
        const value = originalDataset.getValue(field.name, i);
        rowObject[field.name] = value;
      }
      rowObjects.push(rowObject);
    }
  }

  for (let i = 0; i < numRows; i++) {
    const queryRow = result[i];
    const rowObject = rowObjects[i];
    Object.keys(queryRow).forEach(key => {
      const value = queryRow[key];
      rowObject[key] = value;
    });
  }

  const processedData = await processFileData({
    content: {fileName: newDatasetName, data: rowObjects},
    fileCache: []
  });

  return processedData;
}

/** Type for a Redux dispatch function, used by tools that need to dispatch kepler actions */
export type KeplerDispatch = (action: any) => void;
