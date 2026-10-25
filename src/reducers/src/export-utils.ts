// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Blob} from 'global/window';
import {csvFormatRows} from 'd3-dsv';

import {EXPORT_DATA_TYPE} from '@kepler.gl/constants';
import {encodeDatasetExport, sanitizeExportName} from '@kepler.gl/processors';
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

export async function exportData(state: StateType, options): Promise<void> {
  const {visState, appName} = state;
  const {datasets} = visState;
  const {selectedDataset, dataType, filtered} = options;
  // get the selected data
  const filename = appName ? appName : getApplicationConfig().defaultDataName;
  const selectedDatasets = datasets[selectedDataset]
    ? [datasets[selectedDataset]]
    : Object.values(datasets);
  if (!selectedDatasets.length) {
    // error: selected dataset not found.
    return;
  }

  const errors: unknown[] = [];
  for (const selectedData of selectedDatasets) {
    try {
      const {
        dataContainer,
        fields,
        label,
        filteredIdxCPU = [],
        hiddenColumns,
        fieldPairs
      } = selectedData as KeplerTable;
      const toExport = filtered
        ? createIndexedDataContainer(dataContainer, filteredIdxCPU)
        : dataContainer;
      const layerName = sanitizeExportName(label);

      if (dataType === EXPORT_DATA_TYPE.CSV) {
        const csv = formatCsv(toExport, fields, hiddenColumns);
        downloadFile(new Blob([csv], {type: 'text/csv'}), `${filename}_${layerName}.csv`);
        continue;
      }

      const file = await encodeDatasetExport({
        data: toExport,
        fields,
        fieldPairs,
        hiddenColumns,
        dataType,
        layerName
      });
      downloadFile(
        new Blob([file.data], {type: file.mimeType}),
        `${filename}_${layerName}.${file.extension}`
      );
    } catch (error) {
      errors.push(error);
    }
  }

  if (errors.length) {
    throw errors[0];
  }
}

/**
 * On export data to csv
 * @param dataContainer
 * @param fields `dataset.fields`
 * @returns csv string
 */
export function formatCsv(
  data: DataContainerInterface,
  fields: Field[],
  hiddenColumns: string[] = []
): string {
  const hidden = new Set(hiddenColumns);
  const included = fields
    .map((field, index) => ({field, index}))
    .filter(({field}) => !hidden.has(field.name));
  const columns = included.map(({field}) => field.displayName || field.name);
  const formattedData = [columns];

  // parse geojson object as string
  for (const row of data.rows(true)) {
    formattedData.push(
      included.map(({field, index}) =>
        parseFieldValue(
          typeof row.valueAt === 'function' ? row.valueAt(index) : row[index],
          field.type,
          field
        )
      )
    );
  }

  return csvFormatRows(formattedData);
}

const exporters = {
  exportData
};

export default exporters;
