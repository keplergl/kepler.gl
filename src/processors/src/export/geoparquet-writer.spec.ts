// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {initApplicationConfig} from '@kepler.gl/utils';

import {writeGeoParquet} from './geoparquet-writer';

const mockInitParquetWasm = jest.fn(async (_url: string) => {
  throw new Error('stop after init');
});

jest.mock('parquet-wasm', () => ({
  __esModule: true,
  default: (url: string) => mockInitParquetWasm(url)
}));

describe('writeGeoParquet in a browser', () => {
  let previousNodeEnv: string | undefined;

  beforeEach(() => {
    previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    mockInitParquetWasm.mockClear();
  });

  afterEach(() => {
    process.env.NODE_ENV = previousNodeEnv;
    initApplicationConfig({parquetWasmUrl: ''});
  });

  test.each([
    ['', 'https://unpkg.com/parquet-wasm@0.6.1/esm/parquet_wasm_bg.wasm'],
    ['/static/parquet_wasm_bg.wasm', '/static/parquet_wasm_bg.wasm']
  ])('starts parquet-wasm from parquetWasmUrl "%s"', async (parquetWasmUrl, wasmUrl) => {
    initApplicationConfig({parquetWasmUrl});

    await expect(writeGeoParquet({type: 'FeatureCollection', features: []})).rejects.toThrow(
      'stop after init'
    );

    expect(mockInitParquetWasm).toHaveBeenCalledWith(wasmUrl);
  });
});
