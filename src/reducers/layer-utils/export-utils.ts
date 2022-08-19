// Copyright (c) 2022 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import {Blob} from 'global/window';
import {csvFormatRows} from 'd3-dsv';

import {
  EXPORT_DATA_TYPE
} from '@kepler.gl/constants';
import {Field} from '@kepler.gl/types';

import {createIndexedDataContainer} from 'reducers/table-utils/data-container-utils';
import {parseFieldValue} from '@kepler.gl/utils';
import {DataContainerInterface} from 'reducers/table-utils/data-container-interface';
import {Datasets} from 'reducers/table-utils/kepler-table';
import {downloadFile, DEFAULT_DATA_NAME} from '@kepler.gl/utils';

interface StateType {
  visState: {datasets: Datasets};
  appName?: string;
}

export function exportData(state: StateType, options) {
  const {visState, appName} = state;
  const {datasets} = visState;
  const {selectedDataset, dataType, filtered} = options;
  // get the selected data
  const filename = appName ? appName : DEFAULT_DATA_NAME;
  const selectedDatasets = datasets[selectedDataset]
    ? [datasets[selectedDataset]]
    : Object.values(datasets);
  if (!selectedDatasets.length) {
    // error: selected dataset not found.
    return;
  }

  selectedDatasets.forEach(selectedData => {
    const {dataContainer, fields, label, filteredIdxCPU = []} = selectedData;
    const toExport = filtered
      ? createIndexedDataContainer(dataContainer, filteredIdxCPU)
      : dataContainer;

    // start to export data according to selected data type
    switch (dataType) {
      case EXPORT_DATA_TYPE.CSV: {
        const csv = formatCsv(toExport, fields);

        const fileBlob = new Blob([csv], {type: 'text/csv'});
        downloadFile(fileBlob, `${filename}_${label}.csv`);
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
    formattedData.push(row.map((d, i) => parseFieldValue(d, fields[i].type)));
  }

  return csvFormatRows(formattedData);
}

const exporters = {
  exportData
};

export default exporters;
