// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import cloneDeep from 'lodash.clonedeep';
import SchemaManager from '@kepler.gl/schemas';

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
