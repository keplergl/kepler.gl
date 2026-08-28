// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import cloneDeep from 'es-toolkit/compat/cloneDeep';
import SchemaManager, {datasetSchema, VERSIONS} from '@kepler.gl/schemas';
import {DatasetType} from '@kepler.gl/constants';

// fixtures
import {
  savedStateV0,
  expectedInfo0,
  expectedFields0,
  expectedFields1,
  expectedInfo1
} from 'test/fixtures/state-saved-v0';
import {savedStateV1, v0ExpectedInfo, v0ExpectedFields} from 'test/fixtures/state-saved-v1-1';
import {stateSavedV1_2, v1expectedInfo_2, v1expectedFields_2} from 'test/fixtures/state-saved-v1-2';

/* eslint-disable max-statements */
test('#DatasetSchema -> SchemaManager.parseSavedData', t => {
  const dataSaved = cloneDeep(savedStateV0).datasets;
  const parsedValid = SchemaManager.parseSavedData(dataSaved);

  const expectedRows0 = dataSaved[0].data.allData;

  const expectedDataset0 = {
    info: expectedInfo0,
    data: {
      fields: expectedFields0,
      rows: expectedRows0
    }
  };

  const expectedRows1 = dataSaved[1].data.allData;

  const expectedDataset1 = {
    info: expectedInfo1,
    data: {
      fields: expectedFields1,
      rows: expectedRows1
    }
  };

  t.equal(parsedValid.length, 2, 'should have 2 datasets');
  t.deepEqual(parsedValid[0], expectedDataset0, 'should parse dataset correctly');
  t.deepEqual(parsedValid[0].info, expectedInfo0, 'should parse info correctly');
  t.deepEqual(parsedValid[0].data.fields, expectedFields0, 'should parse fields correctly');
  t.deepEqual(parsedValid[0].data.rows, expectedRows0, 'should parse rows correctly');

  t.deepEqual(parsedValid[1], expectedDataset1, 'should parse dataset correctly');
  t.deepEqual(parsedValid[1].info, expectedInfo1, 'should parse info correctly');
  t.deepEqual(parsedValid[1].data.fields, expectedFields1, 'should parse fields correctly');
  t.deepEqual(parsedValid[1].data.rows, expectedRows1, 'should parse rows correctly');

  t.end();
});
/* eslint-enable max-statements */

test('#DatasetSchema -> SchemaManager.parseSavedData.v1', t => {
  const dataSaved = cloneDeep(savedStateV1).datasets;
  const parsedValid = SchemaManager.parseSavedData(dataSaved);

  const expectedRows = dataSaved[0].data.allData;

  const expectedDataset = {
    info: v0ExpectedInfo,
    data: {
      fields: v0ExpectedFields,
      rows: expectedRows
    }
  };

  t.equal(parsedValid.length, 1, 'should have 1 dataset');

  t.deepEqual(parsedValid[0], expectedDataset, 'should parse dataset correctly');
  t.deepEqual(parsedValid[0].info, v0ExpectedInfo, 'should parse info correctly');
  t.deepEqual(parsedValid[0].data.fields, v0ExpectedFields, 'should parse fields correctly');
  t.deepEqual(parsedValid[0].data.rows, expectedRows, 'should parse rows correctly');

  t.end();
});

test('#DatasetSchema -> SchemaManager.parseSavedData.v1 with ts', t => {
  const dataSaved = cloneDeep(stateSavedV1_2).datasets;
  const parsedValid = SchemaManager.parseSavedData(dataSaved);

  const expectedRows = dataSaved[0].data.allData;
  const expectedDataset = {
    info: v1expectedInfo_2,
    data: {
      fields: v1expectedFields_2,
      rows: expectedRows
    }
  };

  t.equal(parsedValid.length, 1, 'should have 1 dataset');

  t.deepEqual(parsedValid[0], expectedDataset, 'should parse dataset correctly');

  t.deepEqual(parsedValid[0].info, v1expectedInfo_2, 'should parse info correctly');

  t.equal(
    parsedValid[0].data.fields.length,
    v1expectedFields_2.length,
    'should have same number of fields'
  );

  parsedValid[0].data.fields.forEach((actualField, i) => {
    t.deepEqual(
      actualField,
      v1expectedFields_2[i],
      `fields ${actualField.name} should be the same`
    );
  });

  t.deepEqual(parsedValid[0].data.rows, expectedRows, 'should parse rows correctly');

  t.end();
});

test('#DatasetSchema -> save externally-hosted dataset without inlining rows', t => {
  const dataset = {
    id: 'remote-1',
    label: 'quakes.csv',
    color: [1, 2, 3],
    type: DatasetType.EXTERNALLY_HOSTED,
    fields: [{name: 'lat', type: 'real', format: '', analyzerType: 'FLOAT'}],
    metadata: {
      source: 'https://example.com/quakes.csv',
      sourceFormat: 'csv',
      extra: 'should-not-save'
    }
  };

  const saved = datasetSchema[VERSIONS.v1].save(dataset);

  t.deepEqual(saved.allData, [], 'should not inline remote rows');
  t.equal(saved.type, DatasetType.EXTERNALLY_HOSTED, 'should persist dataset type');
  t.deepEqual(
    saved.metadata,
    {source: 'https://example.com/quakes.csv', format: 'csv'},
    'should persist source URL without extra metadata'
  );

  const loaded = SchemaManager.parseSavedData([{version: 'v1', data: saved}]);
  t.equal(loaded.length, 1, 'should parse one dataset');
  t.equal(loaded[0].info.type, DatasetType.EXTERNALLY_HOSTED, 'should restore type');
  t.equal(loaded[0].info.id, 'remote-1', 'should restore id');
  t.equal(loaded[0].metadata.source, 'https://example.com/quakes.csv', 'should restore source');
  t.equal(loaded[0].metadata.sourceFormat, 'csv', 'should map saved format to sourceFormat');
  t.equal(loaded[0].metadata.format, undefined, 'should not collide with DATASET_FORMATS');
  t.deepEqual(loaded[0].data.rows, [], 'loaded rows should stay empty until refetch');

  t.end();
});

test('#DatasetSchema -> save externally-hosted dataset refresh interval', t => {
  const dataset = {
    id: 'remote-1',
    label: 'quakes.csv',
    color: [1, 2, 3],
    type: DatasetType.EXTERNALLY_HOSTED,
    fields: [{name: 'lat', type: 'real', format: '', analyzerType: 'FLOAT'}],
    metadata: {
      source: 'https://example.com/quakes.csv',
      sourceFormat: 'csv',
      refreshIntervalMs: 60_000,
      etag: '"skip-me"',
      refreshStatus: 'loading'
    }
  };

  const saved = datasetSchema[VERSIONS.v1].save(dataset);
  t.deepEqual(
    saved.metadata,
    {source: 'https://example.com/quakes.csv', format: 'csv', refreshIntervalMs: 60_000},
    'should persist refresh interval without runtime status'
  );

  const loaded = SchemaManager.parseSavedData([{version: 'v1', data: saved}]);
  t.equal(loaded[0].metadata.refreshIntervalMs, 60_000, 'should restore refresh interval');
  t.equal(loaded[0].metadata.etag, undefined, 'should not restore etag');

  t.end();
});

test('#DatasetSchema -> save externally-hosted dataset custom refresh interval', t => {
  const dataset = {
    id: 'remote-1',
    label: 'quakes.csv',
    color: [1, 2, 3],
    type: DatasetType.EXTERNALLY_HOSTED,
    fields: [{name: 'lat', type: 'real', format: '', analyzerType: 'FLOAT'}],
    metadata: {
      source: 'https://example.com/quakes.csv',
      sourceFormat: 'csv',
      refreshIntervalMs: 45_000
    }
  };

  const saved = datasetSchema[VERSIONS.v1].save(dataset);
  t.equal(saved.metadata.refreshIntervalMs, 45_000, 'should persist a custom interval');

  const loaded = SchemaManager.parseSavedData([{version: 'v1', data: saved}]);
  t.equal(loaded[0].metadata.refreshIntervalMs, 45_000, 'should restore a custom interval');

  t.end();
});
