// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {EXPORT_DATA_TYPE} from '@kepler.gl/constants';
import {encodeDatasetExport} from '@kepler.gl/processors';
import {createDataContainer, downloadFile, getApplicationConfig} from '@kepler.gl/utils';
import {exportData} from './export-utils';

jest.mock('@kepler.gl/processors', () => ({
  ...jest.requireActual('@kepler.gl/processors'),
  encodeDatasetExport: jest.fn()
}));
jest.mock('@kepler.gl/utils', () => ({
  ...jest.requireActual('@kepler.gl/utils'),
  downloadFile: jest.fn()
}));

const encode = encodeDatasetExport as jest.Mock;
const download = downloadFile as jest.Mock;
function dataset(label: string) {
  return {
    label,
    fields: [
      {name: 'name', displayName: 'City', type: 'string'},
      {name: 'secret', type: 'integer'}
    ],
    dataContainer: createDataContainer([
      ['Paris', 1],
      ['London', 2]
    ]),
    filteredIdxCPU: [1],
    hiddenColumns: ['secret'],
    fieldPairs: []
  };
}
function state(
  datasets: Record<string, ReturnType<typeof dataset>> = {
    a: dataset('Cities'),
    b: dataset('Towns')
  },
  appName?: string
) {
  return {visState: {datasets}, appName} as unknown as Parameters<typeof exportData>[0];
}
function read(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsText(blob);
  });
}
beforeEach(() => {
  jest.clearAllMocks();
  encode
    .mockReset()
    .mockResolvedValue({data: 'encoded', mimeType: 'application/json', extension: 'geojson'});
});

describe('dataset downloads', () => {
  test('selected CSV exports only visible columns and all rows with configured name', async () => {
    await exportData(state(undefined, 'MyMap'), {
      selectedDataset: 'a',
      dataType: EXPORT_DATA_TYPE.CSV
    });
    expect(download).toHaveBeenCalledTimes(1);
    const [blob, filename] = download.mock.calls[0];
    expect(filename).toBe('MyMap_Cities.csv');
    expect(blob.type).toBe('text/csv');
    expect(await read(blob)).toBe('City\nParis\nLondon');
    expect(encode).not.toHaveBeenCalled();
  });

  test('filtered CSV respects row indices and uses the default application name', async () => {
    await exportData(state(), {
      selectedDataset: 'a',
      dataType: EXPORT_DATA_TYPE.CSV,
      filtered: true
    });
    expect(download.mock.calls[0][1]).toBe(`${getApplicationConfig().defaultDataName}_Cities.csv`);
    expect(await read(download.mock.calls[0][0])).toBe('City\nLondon');
  });

  test('encoded downloads pass export metadata and filtered rows, using encoder MIME and extension', async () => {
    const datasets = {a: dataset('Cities'), b: dataset('Towns')};
    await exportData(state(datasets), {selectedDataset: 'a', dataType: 'geojson', filtered: true});
    const options = encode.mock.calls[0][0];
    expect(options).toMatchObject({
      fields: datasets.a.fields,
      hiddenColumns: ['secret'],
      fieldPairs: [],
      dataType: 'geojson',
      layerName: 'Cities'
    });
    expect(options.data.numRows()).toBe(1);
    expect(options.data.valueAt(0, 0)).toBe('London');
    expect(download.mock.calls[0][0].type).toBe('application/json');
    expect(download.mock.calls[0][1]).toMatch(/_Cities\.geojson$/);
    expect(await read(download.mock.calls[0][0])).toBe('encoded');
  });

  test('an unknown selection exports all datasets without copying unfiltered containers', async () => {
    const datasets = {a: dataset('Cities'), b: dataset('Towns')};
    await exportData(state(datasets), {selectedDataset: 'missing', dataType: 'geojson'});
    expect(encode.mock.calls.map(([options]) => options.data)).toEqual([
      datasets.a.dataContainer,
      datasets.b.dataContainer
    ]);
    expect(download).toHaveBeenCalledTimes(2);
  });

  test('finishes remaining datasets after encoder failures and rejects the first error', async () => {
    const first = new Error('first');
    encode.mockRejectedValueOnce(first).mockRejectedValueOnce(new Error('second'));
    const datasets = {a: dataset('A'), b: dataset('B'), c: dataset('C')};
    await expect(exportData(state(datasets), {dataType: 'geojson'})).rejects.toBe(first);
    expect(encode).toHaveBeenCalledTimes(3);
    expect(download).toHaveBeenCalledTimes(1);
    expect(download.mock.calls[0][1]).toMatch(/_C\.geojson$/);
  });

  test('continues after a failed CSV download', async () => {
    const error = new Error('download failed');
    download.mockImplementationOnce(() => {
      throw error;
    });
    await expect(exportData(state(), {dataType: EXPORT_DATA_TYPE.CSV})).rejects.toBe(error);
    expect(download).toHaveBeenCalledTimes(2);
  });

  test('empty dataset state does not encode or download', async () => {
    await exportData(state({}), {
      dataType: 'geojson'
    });
    expect(encode).not.toHaveBeenCalled();
    expect(download).not.toHaveBeenCalled();
  });
});
