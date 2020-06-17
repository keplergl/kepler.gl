// Copyright (c) 2020 Uber Technologies, Inc.
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

import Console from 'global/console';
import {parseInBatches} from '@loaders.gl/core';
import {JSONLoader} from '@loaders.gl/json';
import {CSVLoader} from '@loaders.gl/csv';
import {
  processCsvData,
  processGeojson,
  processKeplerglJSON,
  processRowObject
} from './data-processor';
import {isPlainObject, generateHashId} from 'utils/utils';
import {DATASET_FORMATS} from 'constants/default-settings';

const BATCH_TYPE = {
  METADATA: 'metadata',
  ROOT_OBJECT_COMPLETE: 'root-object-batch-complete'
};

const CSV_LOADER_OPTIONS = {
  batchSize: 4000, // Auto detect number of rows per batch (network batch size)
  rowFormat: 'object'
};

const JSON_LOADER_OPTIONS = {
  _rootObjectBatches: true,
  // batchSize: 4000, // Auto detect number of rows per batch (network batch size)
};

export function isGeoJson(json) {
  // json can be feature collection
  // or single feature
  return isPlainObject(json) && (isFeature(json) || isFeatureCollection(json));
}

export function isFeature(json) {
  return json.type === 'Feature' && json.geometry;
}

export function isFeatureCollection(json) {
  return json.type === 'FeatureCollection' && json.features;
}

export function isRowObject(json) {
  return Array.isArray(json) && isPlainObject(json[0]);
}

export function isCsvRows(content) {
  return Array.isArray(content) && content.length && Array.isArray(content[0]);
}

export function isKeplerGlMap(json) {
  return (
    isPlainObject(json) &&
    json.datasets &&
    json.config &&
    json.info &&
    json.info.app === 'kepler.gl'
  );
}

export async function* makeProgressIterator(asyncIterator, info) {
  let rowCount = 0;
  const startTime = Date.now();


  for await (const batch of asyncIterator) {
    // skip metadata batches
    if (batch.batchType === BATCH_TYPE.METADATA) {
      continue;
    }
    
    const rowCountInBatch = batch.data && batch.data.length || 0;
    rowCount += rowCountInBatch;
    const elapsedMs = Date.now() - startTime;
    const percent = batch.bytesUsed / info.size;

    // Update progress object
    const progress = {
      elapsedMs,
      rowCount,
      rowCountInBatch,
      percent,
    };

    // This is needed to release the thread to the UI loop and render the progress
    await new Promise(resolve => window.setTimeout(resolve, 0));
    yield {...batch, progress};
  }
}

// eslint-disable-next-line complexity
async function* readBatch(asyncIterator, fileName) {
  console.log('rb1', asyncIterator);
  let result = {};
  let batches = [];
  for await (const batch of asyncIterator) {
    console.log('batch: ', batch);
    console.log('batchType: ', batch.batchType);
    console.log('batchContainer', batch.container);
    // Last batch will have this special type and will provide all the root
    // properties of the parsed document.
    switch (batch.batchType) {
      case BATCH_TYPE.METADATA:
        Console.log('parseInBatches metadata ', batch);
        break;

      case BATCH_TYPE.ROOT_OBJECT_COMPLETE:
        // TODO: It would be nice if loaders.gl could handle this detail when
        // parsing in batches, otherwise we can't entirely delegate the
        // responsibility of parsing any format.
        if (batch.container.features) {
          result.features = batches;
        } else if (batch.container.datasets) {
          result.datasets = batches;
        } else {
          // HACK to get things moving, I couldn't find any realiable way to
          // identify a Row JSON—batch.container seems to equal batches[0] though.
          result = batches;
        }

        // We copy all properties but skip datasets or fatures becuase they are
        // empty arrays—we got its content in previous batches.
        for (const k in batch.container) {
          if (k !== 'datasets' && k !== 'features') {
            result[k] = batch.container[k];
          }
        }
        break;

      default:
        Console.log(batch)
        for (let i = 0; i < batch.data.length; i++) {
          batches.push(batch.data[i]);
        }
    }
    
    yield {
      ...batch,
      header: batch.schema ? Object.keys(batch.schema) : null,
      fileName,
      data:
        Object.keys(result).length === 0 // csv doesn't have any keys
          ? batches
          : result
    };
  }
}


export async function readFileInBatches({file, fileCache = []}) {
  const batchIterator = await parseInBatches(
    file,
    [JSONLoader, CSVLoader],
    {
      csv: CSV_LOADER_OPTIONS,
      json: JSON_LOADER_OPTIONS,
      // Somehow enabling metadata breaks the data iterator
      metadata: false,
    },
    file.name
  );
  const progressIterator = makeProgressIterator(batchIterator, {size: file.size});
  return readBatch(progressIterator, file.name);
}

export function processFileData({content, fileCache}) {
  return new Promise((resolve, reject) => {
    const {data, header} = content;

    let format;
    let processor;
    if (isCsvRows(data)) {
      format = DATASET_FORMATS.csv;
      processor = processCsvData;
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
      console.time('process file content');
      const result = processor(data, header);
      console.timeEnd('process file content');

      resolve([
        ...fileCache,
        {
          data: result,
          info: {
            label: content.fileName,
            format
          }
        }
      ]);
    }

    reject('Unknow File Format');
  });
}

export function filesToDataPayload(fileCache) {
  // seperate out files which could be a single datasets. or a keplergl map json
  const collection = fileCache.reduce(
    (accu, file) => {
      const {data, info = {}} = file;
      const {format} = info;
      if (format === DATASET_FORMATS.keplergl) {
        // if file contains a single kepler map dataset & config
        accu.keplerMaps.push({
          ...data,
          options: {
            centerMap: !(data.config && data.config.mapState)
          }
        });
      } else if (DATASET_FORMATS[format]) {
        // if file contains only data
        const newDataset = {
          data,
          info: {
            id: info.id || generateHashId(4),
            ...info
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
