import {Layer} from '@kepler.gl/layers';
import {Datasets, KeplerTable} from '@kepler.gl/table';
import interpolate from 'color-interpolate';

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
    });
    // trigger a re-render using layerSetIsValid()
    if (selectLayers.length > 0) {
      layerSetIsValid(selectLayers[0], true);
    }
  }
}

export async function getDatasetContext(datasets: Datasets) {
  const context = 'Please remember the following dataset context:';
  const dataMeta = Object.values(datasets).map(dataset => ({
    datasetName: dataset.label,
    datasetId: dataset.id,
    fields: dataset.fields.map(field => ({[field.name]: field.type}))
  }));
  return `${context}\n${JSON.stringify(dataMeta)}`;
}
