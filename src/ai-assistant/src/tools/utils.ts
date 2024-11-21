import {Datasets, KeplerTable} from '@kepler.gl/table';

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
