// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import * as arrow from 'apache-arrow';
import {parseInBatches} from '@loaders.gl/core';
import {JSONLoader, _JSONPath} from '@loaders.gl/json';
import {CSVLoader} from '@loaders.gl/csv';
import {GeoArrowLoader} from '@loaders.gl/arrow';
import {ParquetWasmLoader} from '@loaders.gl/parquet';
import {Loader} from '@loaders.gl/loader-utils';
import {generateHashId, isPlainObject, generateHashIdFromString} from '@kepler.gl/utils';
import {DATASET_FORMATS} from '@kepler.gl/constants';
import {LoadedMap, ProcessorResult} from '@kepler.gl/types';
import {Feature, AddDataToMapPayload} from '@kepler.gl/types';
import {FeatureCollection} from '@turf/helpers';

import {
  processArrowBatches,
  processGeojson,
  processKeplerglJSON,
  processRowObject
} from './data-processor';

import {FileCacheItem, ValidKeplerGlMap} from './types';

const BATCH_TYPE = {
  METADATA: 'metadata',
  PARTIAL_RESULT: 'partial-result',
  FINAL_RESULT: 'final-result'
};

const CSV_LOADER_OPTIONS = {
  shape: 'object-row-table',
  dynamicTyping: false // not working for now
};

const ARROW_LOADER_OPTIONS = {
  shape: 'arrow-table',
  batchDebounceMs: 10 // time to delay between batches, for incremental loading
};

const PARQUET_LOADER_OPTIONS = {
  shape: 'arrow-table'
};

const JSON_LOADER_OPTIONS = {
  shape: 'object-row-table',
  // instruct loaders.gl on what json paths to stream
  jsonpaths: [
    '$', // JSON Row array
    '$.features', // GeoJSON
    '$.datasets' // KeplerGL JSON
  ]
};

export type ProcessFileDataContent = {
  data: unknown;
  fileName: string;
  length?: number;
  progress?: {rowCount?: number; rowCountInBatch?: number; percent?: number};
  /**  metadata e.g. for arrow data, metadata could be the schema.fields */
  metadata?: Map<string, string>;
};

/**
 * check if table is an ArrowTable object
 * @param table - object to check
 * @returns {boolean} - true if table is an ArrowTable object type guarded
 */
export function isArrowTable(table: any): table is arrow.Table {
  return Boolean(table instanceof arrow.Table);
}

/**
 * check if data is an ArrowData object, which is an array of RecordBatch
 * @param data - object to check
 * @returns {boolean} - true if data is an ArrowData object type guarded
 */
export function isArrowData(data: any): boolean {
  return Array.isArray(data) && Boolean(data.length && data[0].data && data[0].schema);
}

export function isGeoJson(json: unknown): json is Feature | FeatureCollection {
  // json can be feature collection
  // or single feature
  return isPlainObject(json) && (isFeature(json) || isFeatureCollection(json));
}

export function isFeature(json: unknown): json is Feature {
  return isPlainObject(json) && json.type === 'Feature' && Boolean(json.geometry);
}

export function isFeatureCollection(json: unknown): json is FeatureCollection {
  return isPlainObject(json) && json.type === 'FeatureCollection' && Boolean(json.features);
}

export function isRowObject(json: any): boolean {
  return Array.isArray(json) && isPlainObject(json[0]);
}

export function isKeplerGlMap(json: unknown): json is ValidKeplerGlMap {
  return Boolean(
    isPlainObject(json) &&
      json.datasets &&
      json.config &&
      json.info &&
      isPlainObject(json.info) &&
      json.info.app === 'kepler.gl'
  );
}

export async function* makeProgressIterator(
  asyncIterator: AsyncIterable<any>,
  info: {size: number}
): AsyncGenerator {
  let rowCount = 0;

  for await (const batch of asyncIterator) {
    // the length could be stored in `batch.length` for arrow batch
    const rowCountInBatch = (batch.data && (batch.data.length || batch.length)) || 0;
    rowCount += rowCountInBatch;
    const percent = Number.isFinite(batch.bytesUsed) ? batch.bytesUsed / info.size : null;

    // Update progress object
    const progress = {
      rowCount,
      rowCountInBatch,
      ...(Number.isFinite(percent) ? {percent} : {})
    };

    yield {...batch, progress};
  }
}

// eslint-disable-next-line complexity
export async function* readBatch(
  asyncIterator: AsyncIterable<any>,
  fileName: string
): AsyncGenerator {
  let result = null;
  const batches = <any>[];
  for await (const batch of asyncIterator) {
    // Last batch will have this special type and will provide all the root
    // properties of the parsed document.
    // Only json parse will have `FINAL_RESULT`
    if (batch.batchType === BATCH_TYPE.FINAL_RESULT) {
      if (batch.container) {
        result = {...batch.container};
      }
      // Set the streamed data correctly is Batch json path is set
      // and the path streamed is not the top level object (jsonpath = '$')
      if (batch.jsonpath && batch.jsonpath.length > 1) {
        const streamingPath = new _JSONPath(batch.jsonpath);
        streamingPath.setFieldAtPath(result, batches);
      } else if (batch.jsonpath && batch.jsonpath.length === 1) {
        // The streamed object is a ROW JSON-batch (jsonpath = '$')
        // row objects
        result = batches;
      }
    } else {
      const batchData = isArrowTable(batch.data) ? batch.data.batches : batch.data;
      for (let i = 0; i < batchData?.length; i++) {
        batches.push(batchData[i]);
      }
    }

    yield {
      ...batch,
      ...(batch.schema ? {headers: Object.keys(batch.schema)} : {}),
      fileName,
      // if dataset is CSV, data is set to the raw batches
      data: result ? result : batches
    };
  }
}

export async function readFileInBatches({
  file,
  loaders = [],
  loadOptions = {}
}: {
  file: File;
  fileCache: FileCacheItem[];
  loaders: Loader[];
  loadOptions: any;
}): Promise<AsyncGenerator> {
  loaders = [JSONLoader, CSVLoader, GeoArrowLoader, ParquetWasmLoader, ...loaders];
  loadOptions = {
    csv: CSV_LOADER_OPTIONS,
    arrow: ARROW_LOADER_OPTIONS,
    json: JSON_LOADER_OPTIONS,
    parquet: PARQUET_LOADER_OPTIONS,
    metadata: true,
    ...loadOptions
  };

  const batchIterator = await parseInBatches(file, loaders, loadOptions);
  const progressIterator = makeProgressIterator(batchIterator, {size: file.size});

  return readBatch(progressIterator, file.name);
}

export function processFileData({
  content,
  fileCache
}: {
  content: ProcessFileDataContent;
  fileCache: FileCacheItem[];
}): Promise<FileCacheItem[]> {
  return new Promise((resolve, reject) => {
    const {fileName, data} = content;
    let format: string | undefined;
    let processor: ((data: any) => ProcessorResult | LoadedMap | null) | undefined;

    // generate unique id with length of 4 using fileName string
    const id = generateHashIdFromString(fileName);

    if (isArrowData(data)) {
      format = DATASET_FORMATS.arrow;
      processor = processArrowBatches;
    } else if (isKeplerGlMap(data)) {
      format = DATASET_FORMATS.keplergl;
      processor = processKeplerglJSON;
    } else if (isRowObject(data)) {
      format = DATASET_FORMATS.row;
      processor = processRowObject;
    } else if (isGeoJson(data)) {
      format = DATASET_FORMATS.geojson;
      processor = processGeojson;
    }

    if (format && processor) {
      const result = processor(data);

      resolve([
        ...fileCache,
        {
          data: result,
          info: {
            id,
            label: content.fileName,
            format
          }
        }
      ]);
    }

    reject('Unknown File Format');
  });
}

export function filesToDataPayload(fileCache: FileCacheItem[]): AddDataToMapPayload[] {
  // seperate out files which could be a single datasets. or a keplergl map json
  const collection = fileCache.reduce<{
    datasets: FileCacheItem[];
    keplerMaps: AddDataToMapPayload[];
  }>(
    (accu, file) => {
      const {data, info} = file;
      if (info?.format === DATASET_FORMATS.keplergl) {
        // if file contains a single kepler map dataset & config
        accu.keplerMaps.push({
          ...data,
          options: {
            centerMap: !(data.config && data.config.mapState)
          }
        });
      } else if (DATASET_FORMATS[info?.format]) {
        // if file contains only data
        const newDataset = {
          data,
          info: {
            id: info?.id || generateHashId(4),
            ...(info || {})
          }
        };
        accu.datasets.push(newDataset);
      }
      return accu;
    },
    {datasets: [], keplerMaps: []}
  );

  // add kepler map first with config
  // add datasets later in one add data call
  return collection.keplerMaps.concat({datasets: collection.datasets});
}
