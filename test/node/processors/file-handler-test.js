// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import {
  isKeplerGlMap,
  makeProgressIterator,
  filesToDataPayload,
  processFileData,
  processArrowBatches
} from '@kepler.gl/processors';
import {getDatasetRefreshIntervalMs} from '@kepler.gl/constants';
import * as arrow from 'apache-arrow';
import {parsedFields, parsedRows} from 'test/fixtures/row-object';
import {
  savedStateV1InteractionCoordinate as keplerglMap,
  parsedFields as parsedKeplerMapFields
} from 'test/fixtures/state-saved-v1-7';

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

test('#file-handler -> filesToDataPayload', t => {
  const fileCache = [
    {
      data: {
        fields: parsedFields,
        rows: parsedRows
      },
      info: {label: 'rows-data.json', format: 'row'}
    },
    {
      data: {
        datasets: [
          {
            data: {
              fields: parsedKeplerMapFields,
              rows: keplerglMap.datasets[0].data.allData
            },
            info: {id: 'a5ybmwl2d', label: 'geojson_as_string_small.csv', color: [53, 92, 125]}
          }
        ],
        config: keplerglMap.config
      },
      info: {label: 'keplergl-map.json', format: 'keplergl'}
    }
  ];

  const result = filesToDataPayload(fileCache);

  // const expectedResults = [
  //   {
  //     datasets: [{data, info}],
  //     config: {
  //       version: 'v1',
  //       config: {}
  //     },
  //     options: {centerMap: true}
  //   },
  //   {datasets: [{data, info}]}
  // ];

  t.equal(result.length, 2, 'result shoud have 2 entries');
  t.deepEqual(
    Object.keys(result[0]),
    ['datasets', 'config', 'options'],
    'result[0] should have 3 keys'
  );
  t.equal(result[0].datasets, fileCache[1].data.datasets, 'should save keplergl map datasets');
  t.equal(result[0].config, fileCache[1].data.config, 'should save keplergl map config');
  t.deepEqual(
    result[0].options,
    {centerMap: true},
    'should save keplergl map set {centerMap: true}'
  );

  t.deepEqual(Object.keys(result[1]), ['datasets'], 'result[0] should have 1 key');
  t.deepEqual(
    result[1].datasets[0].data,
    fileCache[0].data,
    'should pass file data to datasets only'
  );
  t.deepEqual(
    Object.keys(result[1].datasets[0].info),
    ['id', 'label', 'format'],
    'result[0] datasets[0].info should have 3 key'
  );

  t.end();
});

test('#file-handler -> filesToDataPayload remote metadata', t => {
  const fileCache = [
    {
      data: {
        fields: parsedFields,
        rows: parsedRows
      },
      info: {
        id: 'remote-ds',
        label: 'quakes.csv',
        format: 'row',
        type: 'externally-hosted'
      },
      metadata: {
        source: 'https://example.com/quakes.csv',
        sourceFormat: 'csv'
      }
    }
  ];

  const result = filesToDataPayload(fileCache);
  t.equal(result.length, 1, 'result should have 1 entry');
  t.equal(result[0].datasets[0].info.type, 'externally-hosted', 'should pass type');
  t.deepEqual(
    result[0].datasets[0].metadata,
    {source: 'https://example.com/quakes.csv', sourceFormat: 'csv'},
    'should pass remote source metadata'
  );

  t.end();
});

test('#file-handler -> processFileData one-shot load does not enable polling', async t => {
  const rows = [{lat: 1, lng: 2}];
  const local = await processFileData({
    content: {fileName: 'local.csv', data: rows},
    fileCache: []
  });
  t.equal(local[0].info.type, undefined, 'local files are not marked externally-hosted');
  t.equal(local[0].metadata, undefined, 'local files get no remote refresh metadata');

  const remote = await processFileData({
    content: {
      fileName: 'remote.csv',
      data: rows,
      sourceUrl: 'https://example.com/remote.csv'
    },
    fileCache: []
  });
  t.equal(remote[0].info.type, 'externally-hosted', 'URL loads are still externally-hosted');
  t.equal(
    remote[0].metadata.refreshIntervalMs,
    undefined,
    'a one-shot URL load does not set a poll interval'
  );
  t.equal(
    getDatasetRefreshIntervalMs(remote[0].metadata),
    0,
    'polling helper treats omitted interval as off'
  );

  t.end();
});

test('#file-handler -> processFileData persists remote file format', async t => {
  const cache = await processFileData({
    content: {
      fileName: 'quakes.csv',
      data: [{lat: 1, lng: 2}],
      sourceUrl: 'https://example.com/abc123?sv=1',
      keplerFormat: 'csv'
    },
    fileCache: []
  });

  t.equal(cache[0].info.type, 'externally-hosted', 'should mark the dataset as externally-hosted');
  t.equal(cache[0].info.format, 'row', 'processor format stays row for CSV');
  t.equal(cache[0].metadata.source, 'https://example.com/abc123?sv=1');
  t.equal(
    cache[0].metadata.sourceFormat,
    'csv',
    'should persist the file format, not the processor format'
  );
  t.equal(
    typeof cache[0].metadata.lastFetchedAt,
    'number',
    'should record lastFetchedAt on remote load'
  );

  const parquetCache = await processFileData({
    content: {
      fileName: 'data.parquet',
      data: [{lat: 1, lng: 2}],
      sourceUrl: 'https://example.com/data.parquet'
    },
    fileCache: []
  });

  t.equal(
    parquetCache[0].metadata.sourceFormat,
    'parquet',
    'should infer parquet from the filename when no format was selected'
  );

  t.end();
});

test('#file-handler -> processFileData remote ids do not collide on filename', async t => {
  const rows = [{lat: 1, lng: 2}];
  const local = await processFileData({
    content: {fileName: 'quakes.csv', data: rows},
    fileCache: []
  });
  const remoteA = await processFileData({
    content: {
      fileName: 'quakes.csv',
      data: rows,
      sourceUrl: 'https://a.example.com/quakes.csv'
    },
    fileCache: []
  });
  const remoteB = await processFileData({
    content: {
      fileName: 'quakes.csv',
      data: rows,
      sourceUrl: 'https://b.example.com/quakes.csv'
    },
    fileCache: []
  });
  const remoteAAgain = await processFileData({
    content: {
      fileName: 'quakes.csv',
      data: rows,
      sourceUrl: 'https://a.example.com/quakes.csv'
    },
    fileCache: []
  });

  t.equal(local[0].info.label, 'quakes.csv', 'local label stays the filename');
  t.equal(remoteA[0].info.label, 'quakes.csv', 'remote label stays the filename');
  t.notEqual(
    local[0].info.id,
    remoteA[0].info.id,
    'local and remote files with the same name get different ids'
  );
  t.notEqual(
    remoteA[0].info.id,
    remoteB[0].info.id,
    'two remote URLs with the same filename get different ids'
  );
  t.equal(
    remoteA[0].info.id,
    remoteAAgain[0].info.id,
    'reloading the same URL keeps a stable id so progressive batches can update in place'
  );
  t.ok(!String(remoteA[0].info.id).includes('http'), 'id is a hash, not the raw URL');

  t.end();
});

test('#file-handler -> processArrowBatches skip compact for incremental loads', t => {
  const batchA = arrow.tableFromJSON([{lng: -122.4, lat: 37.8}]);
  const batchB = arrow.tableFromJSON([{lng: -122.5, lat: 37.9}]);
  const combined = batchA.concat(batchB);

  t.ok(combined.batches.length > 1, 'fixture should have multiple record batches');

  const skipped = processArrowBatches(combined.batches, {compact: false});
  t.equal(
    skipped.cols[0].data.length,
    combined.batches.length,
    'compact:false should leave record batches unchanged'
  );

  const compacted = processArrowBatches(combined.batches);
  t.equal(compacted.cols[0].data.length, 1, 'default processArrowBatches should compact');
  t.equal(compacted.cols[0].length, 2, 'compacted table should keep all rows');

  t.end();
});

test('#file-handler -> processFileData skipArrowCompact', async t => {
  const batchA = arrow.tableFromJSON([{lng: -122.4, lat: 37.8}]);
  const batchB = arrow.tableFromJSON([{lng: -122.5, lat: 37.9}]);
  const combined = batchA.concat(batchB);

  const incremental = await processFileData({
    content: {
      fileName: 'points.arrow',
      data: combined.batches,
      skipArrowCompact: true
    },
    fileCache: []
  });
  t.equal(
    incremental[0].data.cols[0].data.length,
    combined.batches.length,
    'progressive processFileData should not compact Arrow batches'
  );

  const finished = await processFileData({
    content: {
      fileName: 'points.arrow',
      data: combined.batches
    },
    fileCache: []
  });
  t.equal(
    finished[0].data.cols[0].data.length,
    1,
    'final processFileData should compact Arrow batches'
  );

  t.end();
});
