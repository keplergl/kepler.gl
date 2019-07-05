// Copyright (c) 2019 Uber Technologies, Inc.
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

import cloneDeep from 'lodash.clonedeep';
import SchemaManager from 'schemas';

// fixtures
import {
  savedStateV0,
  expectedInfo0,
  expectedFields0,
  expectedFields1,
  expectedInfo1
} from 'test/fixtures/state-saved-v0';
import {
  savedStateV1,
  v0ExpectedInfo,
  v0ExpectedFields
} from 'test/fixtures/state-saved-v1-1';

import {
  stateSavedV1_2,
  v1expectedInfo_2,
  v1expectedFields_2
} from "test/fixtures/state-saved-v1-2";

/* eslint-disable max-statements */
it('#DatasetSchema -> SchemaManager.parseSavedData', () => {
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

  expect(parsedValid.length).toEqual(2);
  expect(parsedValid[0]).toEqual(expectedDataset0);  
  expect(parsedValid[0].info).toEqual(expectedInfo0);
  expect(parsedValid[0].data.fields).toEqual(expectedFields0);
  expect(parsedValid[0].data.rows).toEqual(expectedRows0);
  expect(parsedValid[1]).toEqual(expectedDataset1);
  expect(parsedValid[1].info).toEqual(expectedInfo1);
  expect(parsedValid[1].data.fields).toEqual(expectedFields1);
  expect(parsedValid[1].data.rows).toEqual(expectedRows1);
});
/* eslint-enable max-statements */

it('#DatasetSchema -> SchemaManager.parseSavedData.v1', () => {
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

  expect(parsedValid.length).toEqual(1);
  expect(parsedValid[0]).toEqual(expectedDataset);
  expect(parsedValid[0].info).toEqual(v0ExpectedInfo);
  expect(parsedValid[0].data.fields).toEqual(v0ExpectedFields);
  expect(parsedValid[0].data.rows).toEqual(expectedRows);
});

it('#DatasetSchema -> SchemaManager.parseSavedData.v1 with ts', () => {
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

  expect(parsedValid.length).toEqual(1);

  expect(parsedValid[0]).toEqual(expectedDataset);
    
  expect(parsedValid[0].info).toEqual(v1expectedInfo_2);
  expect(parsedValid[0].data.fields).toEqual(v1expectedFields_2);
  expect(parsedValid[0].data.rows).toEqual(expectedRows);
});
