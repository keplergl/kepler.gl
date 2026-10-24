// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import cloneDeep from 'es-toolkit/compat/cloneDeep';
import SchemaManager, {datasetSchema, VERSIONS} from '@kepler.gl/schemas';
import {DatasetType, DATASET_FORMATS, FILTER_TYPES} from '@kepler.gl/constants';
import * as arrow from 'apache-arrow';
import {KeplerTable} from '@kepler.gl/table';
import {
  exportToJsonString,
  exportMapToHTML,
  getFilterFunction,
  validateInputData
} from '@kepler.gl/utils';
import {processArrowTable, processKeplerglJSON} from '@kepler.gl/processors';

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

test('#DatasetSchema -> Zarr saves its source without embedding metadata or coordinate rows', t => {
  const values = Array.from({length: 20_000}, (_, index) => index);
  const dimension = {name: 'time', size: values.length, values};
  const source = {
    url: 'https://example.com/forecast.zarr',
    variable: 'temperature',
    label: 'Forecast',
    attribution: 'Weather provider'
  };
  const metadata = {
    ...source,
    variables: [{path: 'temperature', nonSpatialDims: [dimension]}],
    nonSpatialDims: [dimension],
    timeDimension: dimension,
    levels: [{path: '.', shape: [2048, 2048], chunks: [128, 128]}]
  };
  const dataset = {
    id: 'forecast',
    label: 'My forecast',
    type: DatasetType.ZARR,
    color: [1, 2, 3],
    disableDataOperation: true,
    metadata,
    fields: [{name: 'time', type: 'timestamp'}],
    dataContainer: {
      flattenData() {
        t.fail('must not materialize coordinate rows during export');
        return values.map(value => [value]);
      }
    }
  };

  const saved = datasetSchema[VERSIONS.v1].save(dataset);
  t.deepEqual(saved.metadata, source, 'saves only the source, default variable and attribution');
  t.deepEqual(saved.allData, [], 'does not save coordinate rows');
  t.deepEqual(saved.fields, [], 'does not save synthetic coordinate fields');
  t.equal(saved.disableDataOperation, true, 'preserves dataset behavior');
  t.ok(JSON.stringify(saved).length < 1000, 'export size is independent of large coordinate lists');
  t.equal(dataset.metadata, metadata, 'does not replace live metadata');
  t.equal(dataset.metadata.timeDimension.values, values, 'keeps live coordinates available');

  const [loaded] = SchemaManager.parseSavedData([{version: 'v1', data: saved}]);
  t.deepEqual(loaded.metadata, source, 'retains what the metadata refresh needs');
  t.equal(loaded.info.id, dataset.id, 'preserves dataset identity');
  t.equal(loaded.info.label, dataset.label, 'preserves the user label');
  t.equal(loaded.info.type, DatasetType.ZARR, 'restores the remote dataset type');

  const root = datasetSchema[VERSIONS.v1].save({...dataset, metadata: {...metadata, variable: ''}});
  t.equal(root.metadata.variable, '', 'retains a root-array variable path');
  const automatic = datasetSchema[VERSIONS.v1].save({...dataset, metadata: {url: source.url}});
  t.deepEqual(automatic.metadata, {url: source.url}, 'allows restoring the default variable');

  const legacy = SchemaManager.parseSavedData([
    {
      version: 'v1',
      data: {...saved, metadata}
    }
  ])[0];
  t.deepEqual(legacy.metadata, metadata, 'older maps with embedded metadata still load');
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

function arrowDataset(columns) {
  const table = new arrow.Table(columns);
  const data = processArrowTable({shape: 'arrow-table', data: table});
  return new KeplerTable({
    color: [1, 2, 3],
    metadata: {format: DATASET_FORMATS.arrow}
  }).updateSchema(data);
}

function reloadDataset(saved) {
  const map = {datasets: [{version: 'v1', data: saved}], config: {version: 'v1', config: {}}};
  const parsed = processKeplerglJSON(JSON.parse(exportToJsonString(map)));
  return new KeplerTable({color: [1, 2, 3]}).updateSchema(
    validateInputData(parsed.datasets[0].data)
  );
}

test('#DatasetSchema -> Int64 values survive JSON, HTML and reload without precision loss', t => {
  const dataset = arrowDataset({
    signed: arrow.vectorFromArray(
      [42n, 0n, 9007199254740991n, -9223372036854775808n, null],
      new arrow.Int64()
    ),
    unsigned: arrow.vectorFromArray(
      [42n, 0n, 9007199254740992n, 18446744073709551615n, null],
      new arrow.Uint64()
    )
  });
  const originalRows = dataset.dataContainer.flattenData();
  const saved = datasetSchema[VERSIONS.v1].save(dataset);
  const expected = [
    [42, 42],
    [0, 0],
    [9007199254740991, '9007199254740992'],
    ['-9223372036854775808', '18446744073709551615'],
    [null, null]
  ];
  t.deepEqual(
    saved.allData,
    expected,
    'uses numbers in the safe range and exact decimal strings outside it'
  );
  t.doesNotThrow(() => {
    const reloaded = reloadDataset(saved);
    t.deepEqual(reloaded.dataContainer.flattenData(), expected, 'JSON reload retains exact values');
    t.deepEqual(
      datasetSchema[VERSIONS.v1].save(reloaded).allData,
      expected,
      'resaving retains exact values'
    );
  }, 'JSON export is valid and reloads');
  t.doesNotThrow(() => {
    const html = exportMapToHTML({
      datasets: [{version: 'v1', data: saved}],
      config: {version: 'v1', config: {}}
    });
    const embedded = JSON.parse(html.match(/const datasets = (.*);/)[1]);
    t.deepEqual(
      reloadDataset(embedded[0].data).dataContainer.flattenData(),
      expected,
      'HTML embedded data reloads exactly'
    );
  }, 'HTML export succeeds');
  t.deepEqual(
    dataset.dataContainer.flattenData(),
    originalRows,
    'saving does not mutate Arrow values'
  );
  t.end();
});

test('#DatasetSchema -> null Arrow timestamps remain null through save and reload', t => {
  const dataset = arrowDataset({
    time: arrow.vectorFromArray([null, 0, 1700000000123], new arrow.TimestampMillisecond())
  });
  const saved = datasetSchema[VERSIONS.v1].save(dataset);
  const expected = [[null], ['1970-01-01T00:00:00.000Z'], ['2023-11-14T22:13:20.123Z']];
  t.deepEqual(saved.allData, expected, 'distinguishes missing timestamps from valid epoch zero');
  const reloaded = reloadDataset(saved);
  t.deepEqual(
    reloaded.dataContainer.flattenData(),
    expected,
    'JSON reload preserves missing and nonmissing values'
  );
  t.deepEqual(
    datasetSchema[VERSIONS.v1].save(reloaded).allData,
    expected,
    'resaving preserves nulls'
  );
  t.deepEqual(
    dataset.dataContainer.flattenData(),
    [[null], [0], [1700000000123]],
    'saving leaves source values unchanged'
  );
  t.end();
});

[
  {
    name: 'large integers in reverse lexical order',
    values: [10000000000000000n, 9007199254740992n],
    sorted: [9007199254740992, 10000000000000000]
  },
  {
    name: 'large integers alongside Arrow timestamps',
    values: [10000000000000000n, 9007199254740992n, null],
    times: [1700000000000, 1700000001000, null],
    sorted: [9007199254740992, 10000000000000000]
  },
  {
    name: 'large integers alongside entirely missing timestamps',
    values: [10000000000000000n, 9007199254740992n, null],
    times: [null, null, null],
    sorted: [9007199254740992, 10000000000000000]
  },
  {
    name: 'integer field with a geometry inference name hint',
    columnName: '_geojson',
    values: [10000000000000000n, 9007199254740992n, null],
    times: [1700000000000, 1700000001000, null],
    sorted: [9007199254740992, 10000000000000000]
  },
  {
    name: 'mixed safe and large integers with null',
    values: [10000000000000000n, 42n, 9007199254740992n, null],
    sorted: [42, 9007199254740992, 10000000000000000]
  },
  {
    name: 'negative extremes and zero',
    values: [-9223372036854775808n, -9007199254740993n, 0n, 42n, null],
    // Calculations use Number precision; stored values must remain exact.
    sorted: [Number(-9223372036854775808n), -9007199254740992, 0, 42]
  },
  {
    name: 'unsigned extremes',
    values: [18446744073709551615n, 10000000000000000n, 42n, null],
    type: new arrow.Uint64(),
    sorted: [42, 10000000000000000, Number(18446744073709551615n)]
  }
].forEach(({name, values, times, columnName = 'count', type = new arrow.Int64(), sorted}) => {
  test(`#DatasetSchema -> reloaded Int64 numeric domains: ${name}`, t => {
    const dataset = arrowDataset({
      [columnName]: arrow.vectorFromArray(values, type),
      ...(times ? {time: arrow.vectorFromArray(times, new arrow.TimestampMillisecond())} : {})
    });
    const saved = datasetSchema[VERSIONS.v1].save(dataset);
    const reloaded = reloadDataset(saved);
    const domain = [sorted[0], sorted[sorted.length - 1]];
    const range = {colors: sorted.map(() => '#000000')};

    [dataset, reloaded].forEach((table, index) => {
      const stage = index ? 'reloaded' : 'original Arrow';
      const field = table.fields[0];
      t.deepEqual(table.getColumnFilterDomain(field).domain, domain, `${stage}: filter bounds`);
      t.deepEqual(table.getColumnLayerDomain(field, 'linear'), domain, `${stage}: linear domain`);
      t.deepEqual(table.getColumnLayerDomain(field, 'quantile'), sorted, `${stage}: quantiles`);
      t.deepEqual(
        table.getColumnLayerDomain(field, 'jenks', range),
        sorted.slice(1),
        `${stage}: Jenks includes large integers and excludes nulls`
      );
      const filter = getFilterFunction(
        field,
        table.id,
        {
          type: FILTER_TYPES.range,
          dataId: [table.id],
          fieldIdx: [0],
          value: [domain[1], domain[1]]
        },
        [],
        table.dataContainer
      );
      t.deepEqual(
        table.allIndexes.filter(i => filter({index: i})),
        values.flatMap((value, i) => (value !== null && Number(value) === domain[1] ? [i] : [])),
        `${stage}: range filtering selects the numeric maximum`
      );
    });

    t.deepEqual(
      datasetSchema[VERSIONS.v1].save(reloaded).allData,
      saved.allData,
      'numeric calculations leave exact stored values unchanged on resave'
    );
    t.deepEqual(
      dataset.dataContainer.flattenData(),
      values.map((value, i) => (times ? [value, times[i]] : [value])),
      'numeric calculations leave source BigInts and nulls unchanged'
    );
    t.end();
  });
});
