// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import {getKeplerLoaders, KeplerCSVLoader, readFileInBatches} from '@kepler.gl/processors';

test('#loader-registry -> resolves matching loaders lazily', async t => {
  const loaders = await getKeplerLoaders({name: 'data.csv', type: ''});

  t.equal(loaders.length, 1, 'only the matching default loader should be resolved');
  t.equal(loaders[0], KeplerCSVLoader, 'CSV should resolve to the Kepler CSV adapter');
  t.equal(typeof loaders[0].parseInBatches, 'function', 'adapter should expose parseInBatches');
  t.end();
});

test('#loader-registry -> resolves JSON loaders from MIME metadata', async t => {
  const loaders = await getKeplerLoaders({name: 'data', type: 'application/json; charset=utf-8'});

  t.equal(loaders.length, 1, 'only the matching default loader should be resolved');
  t.equal(loaders[0].id, 'json', 'JSON should be selected from the MIME type');
  t.end();
});

test('#loader-registry -> custom loaders take precedence', async t => {
  const customLoader = {...KeplerCSVLoader, name: 'Custom CSV'};
  const loaders = await getKeplerLoaders({name: 'data.csv', type: ''}, [customLoader]);

  t.equal(loaders.length, 1, 'the default loader should be deduplicated');
  t.equal(loaders[0], customLoader, 'custom loader should be first and authoritative');
  t.end();
});

test('#loader-registry -> CSV parser is async and dynamically loaded', async t => {
  const table = await KeplerCSVLoader.parseText('name,value\nalpha,1\n');

  t.equal(table.shape, 'object-row-table', 'CSV should return a loaders.gl table');
  t.deepEqual(table.data, [{name: 'alpha', value: '1'}], 'CSV values should remain strings');
  t.end();
});

test('#loader-registry -> file loading uses the async loader path', async t => {
  const file = new File(['name,value\nalpha,1\n'], 'data.csv', {type: 'text/csv'});
  const generator = await readFileInBatches({file, fileCache: [], loaders: [], loadOptions: {}});
  const batches = [];

  for await (const batch of generator) {
    batches.push(batch);
  }

  const dataBatch = batches.find(batch => batch.batchType === 'data');
  t.ok(dataBatch, 'should yield a data batch');
  t.deepEqual(dataBatch.data, [{name: 'alpha', value: '1'}], 'should preserve CSV rows');
  t.end();
});
