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

import test from 'tape';
import {isKeplerGlMap, makeProgressIterator, readBatch} from 'processors/file-handler';
import {
  csvMetaDataBatch,
  csvDataBatch0,
  csvDataBatch1,
  csvWithNull,
  csvSchema,
  geojsonMetaBatch,
  geoJsonPartialBatch,
  geoJsonDataBatch0,
  geoJsonDataBatch1,
  geoJsonFinalBatch
} from './file-handler-fixtures';
import {geojsonData} from 'test/fixtures/geojson';

test('#file-handler -> isKeplerGlMap', t => {
  t.equal(
    isKeplerGlMap('{datasets: [], info: {app: "kepler.gl"}, config: {}}'),
    false,
    'Should return false when passing a json string'
  );

  t.equal(
    isKeplerGlMap({datasets: [], info: {app: 'kepler.gl'}, config: {}}),
    true,
    'Should return true when object is a kepler map'
  );

  t.equal(
    isKeplerGlMap({datasets: [], info: {app: 'kepler.gl'}}),
    false,
    'Should return false when object is not a kepler map'
  );

  t.end();
});

test('#file-handler -> makeProgressIterator', async t => {
  // mock AsyncIterator returned by loarder.gl patchInBatches
  // Ideally should run this in browser-headless
  async function* mock() {
    let bytesUsed = 0;
    let value = 0;
    let b = 0;
    await new Promise(resolve => setTimeout(resolve, 100));
    while (b < 2) {
      b += 1;
      bytesUsed += 10;
      value += 1;
      yield {
        data: [{value}],
        bytesUsed
      };
    }
  }
  const asyncIterator = mock();
  const info = {size: 100};

  const progress = makeProgressIterator(asyncIterator, info);

  const batch1 = await progress.next();
  const batch2 = await progress.next();
  const batch3 = await progress.next();

  const expected1 = {
    value: {
      data: [{value: 1}],
      bytesUsed: 10,
      progress: {rowCount: 1, rowCountInBatch: 1, percent: 0.1}
    },
    done: false
  };

  const expected2 = {
    value: {
      data: [{value: 2}],
      bytesUsed: 20,
      progress: {rowCount: 2, rowCountInBatch: 1, percent: 0.2}
    },
    done: false
  };
  const expected3 = {
    value: undefined,
    done: true
  };

  t.deepEqual(batch1, expected1, 'batch1 should be correct');
  t.deepEqual(batch2, expected2, 'batch2 should be correct');
  t.deepEqual(batch3, expected3, 'batch3 should be correct');

  t.end();
});

test('#file-handler -> readBatch.csv', async t => {
  // TODO: should be able to fully test loaders.gl with js-dom
  // after TextDecoder support is added
  // https://github.com/jsdom/whatwg-encoding/pull/11
  const batches = [csvMetaDataBatch, csvDataBatch0, csvDataBatch1];

  async function* mock() {
    let i = -1;
    await new Promise(resolve => setTimeout(resolve, 100));
    while (i < batches.length - 1) {
      i += 1;
      yield batches[i];
    }
  }
  const asyncIterator = mock();
  const gen = readBatch(asyncIterator, 'text-data.csv');
  await gen.next(); // meta
  await gen.next(); // value1
  const b3 = await gen.next(); // value 2
  await gen.next();
  // final betch
  const exptected = {
    bytesUsed: 3000,
    count: 1,
    // cursor: 0
    data: csvWithNull,
    length: 7,
    schema: csvSchema,
    headers: [
      'gps_data.utc_timestamp',
      'gps_data.lat',
      'gps_data.lng',
      'gps_data.types',
      'epoch',
      'has_result',
      'id',
      'time',
      'begintrip_ts_utc',
      'begintrip_ts_local',
      'date'
    ],
    fileName: 'text-data.csv'
  };

  t.deepEqual(b3.value, exptected, 'should return csv data from final batch');
  t.end();
});

test('#file-handler -> readBatch.geoJson', async t => {
  // TODO: should be able to fully test loaders.gl with js-dom
  // after TextDecoder support is added
  // https://github.com/jsdom/whatwg-encoding/pull/11
  const batches = [
    geojsonMetaBatch,
    geoJsonPartialBatch,
    geoJsonDataBatch0,
    geoJsonDataBatch1,
    geoJsonFinalBatch
  ];

  async function* mock() {
    let i = -1;
    await new Promise(resolve => setTimeout(resolve, 100));
    while (i < batches.length - 1) {
      i += 1;
      yield batches[i];
    }
  }
  const asyncIterator = mock();
  const gen = readBatch(asyncIterator, 'text-geojson.json');
  await gen.next(); // meta
  await gen.next(); // partial
  await gen.next(); // value0
  await gen.next(); // value1
  const final = await gen.next(); // final
  // final betch
  const exptected = {
    batchType: 'final-result',
    container: {type: 'FeatureCollection', features: []},
    data: geojsonData,
    jsonpath: '$.features',
    schema: null,
    fileName: 'text-geojson.json'
  };
  t.deepEqual(
    Object.keys(final.value).sort(),
    Object.keys(exptected).sort(),
    'geojson data from final batch should have same keys'
  );
  for (const key of Object.keys(final.value)) {
    t.deepEqual(final.value[key], exptected[key], `geojson final batch ${key} should be correct`);
  }
  t.end();
});

test('#file-handler -> processFileData.csv', t => {
  // const result = processFileData({content: csvWithNull, fileCache: []});
  // console.log(result);

  t.end();
});

test('#file-handler -> filesToDataPayload', t => {
  t.end();
});
