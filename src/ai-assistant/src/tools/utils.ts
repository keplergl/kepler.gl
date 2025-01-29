// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import interpolate from 'color-interpolate';

import {Layer} from '@kepler.gl/layers';
import {Datasets, KeplerTable} from '@kepler.gl/table';
import {SpatialJoinGeometries} from '@openassistant/geoda';
import {ALL_FIELD_TYPES} from '@kepler.gl/constants';
import {AddDataToMapPayload, ProtoDataset, ProtoDatasetField} from '@kepler.gl/types';

/**
 * Check if the dataset exists
 * @param datasets The kepler.gl datasets
 * @param datasetName The name of the dataset
 * @param functionName The name of the function
 * @returns The result of the check
 */
export function checkDatasetNotExists(
  datasets: Datasets,
  datasetName: string,
  functionName: string
) {
  const datasetId = Object.keys(datasets).find(dataId => datasets[dataId].label === datasetName);
  if (!datasetId) {
    return {
      name: functionName,
      result: {
        success: false,
        details: `Dataset not found. Please specify one from the following datasets: ${Object.keys(
          datasets
        ).join(', ')}`
      }
    };
  }
  return null;
}

/**
 * Check if the field exists
 * @param dataset The kepler.gl dataset
 * @param fieldName The name of the field
 * @param functionName The name of the function
 * @returns The result of the check
 */
export function checkFieldNotExists(dataset: KeplerTable, fieldName: string, functionName: string) {
  const field = dataset.fields.find(f => f.name === fieldName);
  if (!field) {
    return {
      type: 'layer',
      name: functionName,
      result: {
        success: false,
        details: `Field not found. Please specify one from the following fields: ${dataset.fields
          .map(f => f.name)
          .join(', ')}`
      }
    };
  }
  return null;
}

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
  datasetName: string,
  variableName: string
): number[] {
  // find which dataset has the variableName
  const datasetId = Object.keys(datasets).find(dataId => datasets[dataId].label === datasetName);
  if (!datasetId) return [];
  const dataset = datasets[datasetId];
  if (dataset) {
    return Array.from({length: dataset.length}, (_, i) => dataset.getValue(variableName, i));
  }
  return [];
}

/**
 * Get the x and y values from a dataset for a scatterplot
 * @param datasets
 * @param datasetName
 * @param xVariableName
 * @param yVariableName
 * @returns {x: number[], y: number[]}
 */
export function getScatterplotValuesFromDataset(
  datasets: Datasets,
  datasetName: string,
  xVariableName: string,
  yVariableName: string
): {x: number[]; y: number[]} {
  const xValues = getValuesFromDataset(datasets, datasetName, xVariableName);
  const yValues = getValuesFromDataset(datasets, datasetName, yVariableName);
  return {x: xValues, y: yValues};
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
export function getDatasetContext(datasets: Datasets, layers: Layer[]) {
  const context = 'Please remember the following dataset context:';
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
  if (!datasetId) return [];
  const dataset = datasets[datasetId];

  // get the index of the layer
  const layerIndex = layers.findIndex(layer => layer.config.dataId === dataset.id);
  if (layerIndex === -1) return [];

  const geometries = layerData[layerIndex];

  return geometries?.data;
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
  datasetName: string,
  data: Record<string, number[]>,
  addDataToMap: (data: AddDataToMapPayload) => void
) {
  // find datasetId from datasets
  const datasetId = Object.keys(datasets).find(dataId => datasets[dataId].label === datasetName);
  if (!datasetId) return;

  const leftDataset = datasets[datasetId];
  const numRows = leftDataset.length;

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
    }))
  ];

  // Pre-calculate data values array
  const dataValues = Object.values(data);

  const rows = Array(numRows)
    .fill(null)
    .map((_, rowIdx) => [
      // New data values
      ...dataValues.map(col => col[rowIdx]),
      // Existing dataset values
      ...leftDataset.fields.map(field => leftDataset.getValue(field.name, rowIdx))
    ]);

  // create new dataset
  const newDatasetName = `${datasetName}_joined`;
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

  addDataToMap({datasets: [newDataset], options: {autoCreateLayers: true, centerMap: true}});
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
