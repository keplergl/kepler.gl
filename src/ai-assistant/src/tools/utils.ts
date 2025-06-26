// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import interpolate from 'color-interpolate';
import {Feature} from 'geojson';
import {Layer, VectorTileLayer} from '@kepler.gl/layers';
import {Datasets, KeplerTable} from '@kepler.gl/table';
import {SpatialJoinGeometries} from '@openassistant/geoda';
import {ALL_FIELD_TYPES, LAYER_TYPES} from '@kepler.gl/constants';
import {Field, ProtoDataset, ProtoDatasetField} from '@kepler.gl/types';
import {processFileData} from '@kepler.gl/processors';

/**
 * Interpolate the colors from the original colors with the given number of colors
 * @param originalColors The original colors
 * @param numberOfColors The number of colors
 * @returns The interpolated colors
 */
export function interpolateColor(originalColors: string[], numberOfColors: number) {
  if (originalColors.length === numberOfColors) {
    return originalColors;
  }
  const interp = interpolate(originalColors);
  const colors = Array.from({length: numberOfColors}, (_, j) => interp(j / (numberOfColors - 1)));
  // convert colors from 'rgb(255, 255, 255)' to '#ffffff'
  const hexColors = colors.map(color => {
    const rgb = color.match(/\d+/g);
    return `#${rgb?.map(c => parseInt(c).toString(16).padStart(2, '0')).join('')}`;
  });
  return hexColors;
}

/**
 * Get the values from a dataset for a variable
 * @param datasets
 * @param datasetName
 * @param variableName
 * @returns {number[]}
 */
export function getValuesFromDataset(
  datasets: Datasets,
  layers: Layer[],
  datasetName: string,
  variableName: string
): unknown[] {
  // find which dataset has the variableName
  const datasetId = Object.keys(datasets).find(dataId => datasets[dataId].label === datasetName);
  if (!datasetId) {
    throw new Error(`Dataset ${datasetName} not found`);
  }
  const dataset = datasets[datasetId];
  if (dataset) {
    // check if field exists
    const field = dataset.fields.find(field => field.name === variableName);
    if (!field) {
      throw new Error(`Field ${variableName} not found in dataset ${datasetName}`);
    }
    // for vector-tile, getting values from layerData
    if (dataset.type === 'vector-tile') {
      // get field from dataset
      const field = dataset.fields.find(field => field.name === variableName);
      if (field) {
        return getValuesFromVectorTileLayer(datasetId, layers, field);
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
  // get the index of the layer
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

/**
 * Highlight the rows in a dataset
 * @param datasets The kepler.gl datasets
 * @param layers The kepler.gl layers
 * @param datasetName The name of the dataset
 * @param selectedRowIndices The indices of the rows to highlight
 * @param layerSetIsValid The function to set the layer validity
 */
export function highlightRows(
  datasets: Datasets,
  layers: Layer[],
  datasetName: string,
  selectedRowIndices: number[],
  layerSetIsValid: (layer: Layer, isValid: boolean) => void
) {
  // update the filteredIndex in the dataset
  const datasetId = Object.keys(datasets).find(dataId => datasets[dataId].label === datasetName);
  if (!datasetId) return;
  const dataset = datasets[datasetId];
  if (dataset) {
    dataset.filteredIndex =
      selectedRowIndices.length === 0 ? dataset.allIndexes : selectedRowIndices;
    // get all layers that use this dataset
    const selectLayers = layers.filter(layer => layer.config.dataId === dataset.id);
    selectLayers.forEach(layer => {
      layer.formatLayerData(datasets);
      // trigger a re-render using layerSetIsValid() to update the top layer
      layerSetIsValid(layer, true);
    });
  }
}

/**
 * Get the dataset context, which is used to provide the dataset information to the AI assistant
 * @param datasets The kepler.gl datasets
 * @param layers The kepler.gl layers
 * @returns The dataset context
 */
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
        // get the valid geometry columns as string
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

/**
 * Get the geometries from a dataset
 * @param datasets The kepler.gl datasets
 * @param layers The kepler.gl layers
 * @param layerData The layer data
 * @param datasetName The name of the dataset
 * @returns The geometries
 */
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

  // if layer is vector-tile, get the geometries from the layer
  if (dataset.type === 'vector-tile') {
    // find the vector-tile layer
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

  // for non-vector-tile dataset, get the geometries from the possible layer
  const selectedLayers = layers.filter(layer => layer.config.dataId === dataset.id);
  if (selectedLayers.length === 0) return [];

  // find geojson layer, then point layer, then other layers
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

/**
 * Save the data as a new dataset by joining it with the left dataset
 * @param datasets The kepler.gl datasets
 * @param datasetName The name of the left dataset
 * @param data The data to save
 * @param addDataToMap The function to add the data to the map
 */
export function saveAsDataset(
  datasets: Datasets,
  layers: Layer[],
  datasetName: string,
  newDatasetName: string,
  data: Record<string, unknown[]>
) {
  // find datasetId from datasets
  const datasetId = Object.keys(datasets).find(dataId => datasets[dataId].label === datasetName);
  if (!datasetId) return;

  // check if newDatasetName already exists
  if (Object.keys(datasets).includes(newDatasetName)) return;

  // Save the data as a new dataset by joining it with the left dataset
  const leftDataset = datasets[datasetId];
  let numRows = leftDataset.length;
  let geometries: Feature[];

  if (leftDataset.type === 'vector-tile') {
    // we need to get geometries from the vector-tile layer
    geometries = getFeaturesFromVectorTile(leftDataset, layers) || [];
    numRows = geometries.length;
  }

  const fields: ProtoDatasetField[] = [
    // New fields from data
    ...Object.keys(data).map((fieldName, index) => ({
      name: fieldName,
      id: `${fieldName}_${index}`,
      displayName: fieldName,
      type: determineFieldType(data[fieldName][0])
    })),
    // Existing fields from leftDataset
    ...leftDataset.fields.map((field, index) => ({
      name: field.name,
      id: field.id || `${field.name}_${index}`,
      displayName: field.displayName,
      type: field.type
    })),
    // add geometry column for vector-tile
    ...(leftDataset.type === 'vector-tile'
      ? [
          {
            name: '_geojson',
            id: '_geojson',
            displayName: '_geojson',
            type: 'geojson'
          }
        ]
      : [])
  ];

  // Pre-calculate data values array
  const dataValues = Object.values(data);

  const rows = Array(numRows)
    .fill(null)
    .map((_, rowIdx) => [
      // New data values
      ...dataValues.map(col => col[rowIdx]),
      // Existing dataset values
      ...leftDataset.fields.map(field =>
        leftDataset.type === 'vector-tile'
          ? geometries[rowIdx].properties?.[field.name]
          : leftDataset.getValue(field.name, rowIdx)
      ),
      // geometry column for vector-tile
      ...(leftDataset.type === 'vector-tile' ? [geometries[rowIdx]] : [])
    ]);

  // create new dataset
  const newDataset: ProtoDataset = {
    info: {
      id: newDatasetName,
      label: newDatasetName
    },
    data: {
      fields,
      rows
    }
  };

  return newDataset;
}

/**
 * Helper function to determine field type
 * @param value The value to determine the field type
 * @returns The field type
 */
function determineFieldType(value: unknown): keyof typeof ALL_FIELD_TYPES {
  return typeof value === 'number'
    ? Number.isInteger(value)
      ? ALL_FIELD_TYPES.integer
      : ALL_FIELD_TYPES.real
    : ALL_FIELD_TYPES.string;
}

export function highlightRowsByColumnValues(
  datasets: Datasets,
  layers: Layer[],
  datasetName: string,
  columnName: string,
  selectedValues: unknown[],
  layerSetIsValid: (layer: Layer, isValid: boolean) => void
) {
  const datasetId = Object.keys(datasets).find(dataId => datasets[dataId].label === datasetName);
  if (!datasetId) return;
  const dataset = datasets[datasetId];
  if (dataset) {
    // get the values of the column
    const values = Array.from({length: dataset.length}, (_, i) => dataset.getValue(columnName, i));
    // create a dict using the values
    const valueDict = values.reduce((acc, value, index) => {
      acc[value] = index;
      return acc;
    }, {});
    // need to fix the type error of value here
    const selectedIndices = selectedValues.map(value => valueDict[value as any]);
    // highlight the rows
    highlightRows(datasets, layers, datasetName, selectedIndices, layerSetIsValid);
  }
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
  // find datasetId from datasets
  const datasetId = Object.keys(datasets).find(dataId => datasets[dataId].label === datasetName);
  if (!datasetId) {
    throw new Error(`Dataset ${datasetName} not found`);
  }

  const originalDataset = datasets[datasetId];

  const fields = originalDataset.fields;

  const numRows = originalDataset.length || result.length;

  // create a rowObjects array to store the original dataset values + query result values
  const rowObjects: Record<string, unknown>[] = [];

  if (originalDataset.type === 'vector-tile') {
    const columnData = {};
    for (const field of fields) {
      // get the values from the vector tile layer
      columnData[field.name] = getValuesFromVectorTileLayer(datasetId, layers, field);
    }
    // convert columnData to rowObjects
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

  // add the query result to the original dataset or update the field values from query result
  for (let i = 0; i < numRows; i++) {
    const queryRow = result[i];
    const rowObject = rowObjects[i];
    // iterate over the keys of queryRow
    Object.keys(queryRow).forEach(key => {
      const value = queryRow[key];
      rowObject[key] = value;
    });
  }

  // use processFileData to process the rowObject
  const processedData = await processFileData({
    content: {fileName: newDatasetName, data: rowObjects},
    fileCache: []
  });

  return processedData;
}
