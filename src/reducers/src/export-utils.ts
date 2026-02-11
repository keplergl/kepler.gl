// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Blob} from 'global/window';
import {csvFormatRows} from 'd3-dsv';

import {EXPORT_DATA_TYPE} from '@kepler.gl/constants';
import {Field} from '@kepler.gl/types';
import KeplerTable, {Datasets} from '@kepler.gl/table';

import {
  createIndexedDataContainer,
  DataContainerInterface,
  parseFieldValue,
  downloadFile
} from '@kepler.gl/utils';
import {getApplicationConfig} from '@kepler.gl/utils';

interface StateType {
  visState: {datasets: Datasets};
  appName?: string;
}

export function exportData(state: StateType, options) {
  const {visState, appName} = state;
  const {datasets} = visState;
  const {selectedDataset, dataType, filtered} = options;
  // get the selected data
  const prefix = appName ? appName : getApplicationConfig().defaultDataName;
  const selectedDatasets = datasets[selectedDataset]
    ? [datasets[selectedDataset]]
    : Object.values(datasets);
  if (!selectedDatasets.length) {
    // error: selected dataset not found.
    return;
  }

  // When exporting a single dataset, use its label as the filename directly.
  // When exporting multiple datasets, prepend the app name to disambiguate.
  const usePrefix = selectedDatasets.length > 1;

  selectedDatasets.forEach(selectedData => {
    const {dataContainer, fields, label, filteredIdxCPU = []} = selectedData as KeplerTable;
    const toExport = filtered
      ? createIndexedDataContainer(dataContainer, filteredIdxCPU)
      : dataContainer;

    // start to export data according to selected data type
    switch (dataType) {
      case EXPORT_DATA_TYPE.CSV: {
        const csv = formatCsv(toExport, fields);
        const fileName = usePrefix ? `${prefix}_${label}.csv` : `${label}.csv`;
        const fileBlob = new Blob([csv], {type: 'text/csv'});
        downloadFile(fileBlob, fileName);
        break;
      }
      // TODO: support more file types.
      default:
        break;
    }
  });
}

/**
 * On export data to csv
 * @param dataContainer
 * @param fields `dataset.fields`
 * @returns csv string
 */
export function formatCsv(data: DataContainerInterface, fields: Field[]): string {
  const columns = fields.map(f => f.displayName || f.name);
  const formattedData = [columns];

  // parse geojson object as string
  for (const row of data.rows(true)) {
    formattedData.push(row.map((d, i) => parseFieldValue(d, fields[i].type, fields[i])));
  }

  return csvFormatRows(formattedData);
}

const exporters = {
  exportData
};

export default exporters;
