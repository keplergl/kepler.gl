// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import cloneDeep from 'es-toolkit/compat/cloneDeep';
import SchemaManager, {datasetSchema, VERSIONS} from '@kepler.gl/schemas';
import {DatasetType, DATASET_FORMATS} from '@kepler.gl/constants';
import * as arrow from 'apache-arrow';
import {KeplerTable, joinDatasets} from '@kepler.gl/table';
import {exportToJsonString, exportMapToHTML, validateInputData} from '@kepler.gl/utils';
import {processArrowTable, processKeplerglJSON} from '@kepler.gl/processors';
import {parseGeoJsonRawFeature} from '@kepler.gl/layers';
import {formatCsv} from '@kepler.gl/reducers';
import {csvParseRows} from 'd3-dsv';

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

test('#DatasetSchema -> separated native GeoArrow points survive JSON save and reopen', t => {
  for (const withZ of [false, true]) {
    const pointType = new arrow.Struct([
      new arrow.Field('x', new arrow.Float64(), false),
      new arrow.Field('y', new arrow.Float64(), false),
      ...(withZ ? [new arrow.Field('z', new arrow.Float64(), false)] : [])
    ]);
    const table = new arrow.Table({
      geometry: arrow.vectorFromArray(
        [withZ ? {x: 10, y: 11, z: 12} : {x: 10, y: 11}, null],
        pointType
      )
    });
    table.schema.fields[0].metadata.set('ARROW:extension:name', 'geoarrow.point');
    const dataset = new KeplerTable({info: {id: 'native-point'}, color: [1, 2, 3]}).updateSchema(
      processArrowTable({shape: 'arrow-table', data: table})
    );
    const saved = datasetSchema[VERSIONS.v1].save(dataset);
    const geometry = {type: 'Point', coordinates: withZ ? [10, 11, 12] : [10, 11]};
    t.equal(saved.allData[0][0], JSON.stringify(geometry), 'saves separate coordinates as GeoJSON');
    t.equal(saved.allData[1][0], null, 'retains null point');
    t.deepEqual(
      JSON.parse(csvParseRows(formatCsv(dataset.dataContainer, dataset.fields))[1][0]),
      geometry,
      'CSV retains separate coordinates'
    );
    const reloaded = reloadDataset(saved);
    t.deepEqual(
      parseGeoJsonRawFeature(reloaded.dataContainer.valueAt(0, 0))?.geometry,
      geometry,
      'reopened native geometry remains usable'
    );
    t.equal(table.getChild('geometry').get(0).x, 10, 'source struct remains intact');
  }
  t.end();
});

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

test('#DatasetSchema -> nested Arrow Int64 values survive a complete JSON backup and reload', t => {
  const item = new arrow.Struct([
    new arrow.Field('signed', new arrow.Int64(), true),
    new arrow.Field('unsigned', new arrow.Uint64(), true)
  ]);
  const type = new arrow.Struct([
    new arrow.Field('items', new arrow.List(new arrow.Field('item', item, true)), true)
  ]);
  const values = [
    {
      items: [
        {signed: 42n, unsigned: 9007199254740991n},
        {signed: -9223372036854775808n, unsigned: 18446744073709551615n},
        {signed: null, unsigned: 0n},
        null
      ]
    },
    {items: []},
    {items: null},
    null
  ];
  const source = new arrow.Table({nested: arrow.vectorFromArray(values, type)});
  const ipc = arrow.tableFromIPC(arrow.tableToIPC(source, 'file'));
  const dataset = new KeplerTable({info: {id: 'nested'}, color: [1, 2, 3]}).updateSchema(
    processArrowTable({shape: 'arrow-table', data: ipc})
  );
  const expected = [
    [
      {
        items: [
          {signed: 42, unsigned: 9007199254740991},
          {signed: '-9223372036854775808', unsigned: '18446744073709551615'},
          {signed: null, unsigned: 0},
          null
        ]
      }
    ],
    [{items: []}],
    [{items: null}],
    [null]
  ];
  const saved = datasetSchema[VERSIONS.v1].save(dataset);
  t.doesNotThrow(() => {
    const payload = JSON.parse(
      exportToJsonString({
        datasets: [{version: 'v1', data: saved}],
        config: {version: 'v1', config: {}}
      })
    );
    t.deepEqual(payload.datasets[0].data.allData, expected, 'full backup has exact nested values');
    const reloaded = reloadDataset(payload.datasets[0].data);
    t.deepEqual(reloaded.dataContainer.flattenData(), expected, 'reload retains nesting and nulls');
    t.deepEqual(datasetSchema[VERSIONS.v1].save(reloaded).allData, expected, 'resave is stable');
    const html = exportMapToHTML(payload);
    t.deepEqual(
      JSON.parse(html.match(/const datasets = (.*);/)[1]),
      payload.datasets,
      'HTML uses the same saved values'
    );
  }, 'backup is valid JSON and reloads');
  t.equal(
    dataset.dataContainer.valueAt(0, 0).items.get(1).signed,
    -9223372036854775808n,
    'live Arrow values are not mutated'
  );
  t.equal(
    ipc.getChild('nested').get(0).items.get(1).unsigned,
    18446744073709551615n,
    'source buffers are not mutated'
  );

  const rows = [[{items: [1n, null, {value: 9007199254740993n}]}]];
  const rowTable = new KeplerTable({info: {id: 'nested-rows'}, color: [1, 2, 3]}).updateSchema({
    fields: [{name: 'nested', type: 'object'}],
    rows
  });
  t.deepEqual(
    datasetSchema[VERSIONS.v1].save(rowTable).allData,
    [[{items: [1, null, {value: '9007199254740993'}]}]],
    'row-backed nested values use the same policy'
  );
  t.equal(rows[0][0].items[2].value, 9007199254740993n, 'live row-backed objects are not mutated');
  t.end();
});

test('#DatasetSchema -> nested custom JSON serializers retain their representations', t => {
  class Identifier {
    constructor() {
      this.raw = 9007199254740993n;
    }
    toJSON() {
      return {id: this.raw.toString()};
    }
  }
  class CachedValue {
    constructor() {
      this.cache = {owner: this};
    }
    toJSON() {
      return {value: 'valid'};
    }
  }
  const custom = {
    raw: 42n,
    toJSON() {
      return {value: this.raw.toString()};
    }
  };
  custom.cache = custom;
  const identifier = new Identifier();
  const cached = new CachedValue();
  const rows = [[{identifier, cached, custom, ordinary: {value: 42n}}]];
  const dataset = new KeplerTable({info: {id: 'custom-json'}, color: [1, 2, 3]}).updateSchema({
    fields: [{name: 'nested', type: 'object'}],
    rows
  });

  const saved = datasetSchema[VERSIONS.v1].save(dataset);
  const expected = [
    [
      {
        identifier: {id: '9007199254740993'},
        cached: {value: 'valid'},
        custom: {value: '42'},
        ordinary: {value: 42}
      }
    ]
  ];
  t.deepEqual(
    JSON.parse(exportToJsonString(saved)).allData,
    expected,
    'preserves class and plain-object serializers while normalizing ordinary nested values'
  );
  t.deepEqual(reloadDataset(saved).dataContainer.flattenData(), expected, 'custom values reload');
  t.equal(saved.allData[0][0].identifier, identifier, 'retains the custom class instance');
  t.equal(saved.allData[0][0].cached, cached, 'does not traverse the cyclic internal cache');
  t.equal(identifier.raw, 9007199254740993n, 'does not change live class data');
  t.equal(rows[0][0].ordinary.value, 42n, 'does not change ordinary live nested data');
  t.end();
});

test('#DatasetSchema -> rejects ordinary circular values without a JSON serializer', t => {
  const cycle = {};
  cycle.self = cycle;
  const dataset = new KeplerTable({info: {id: 'circular'}, color: [1, 2, 3]}).updateSchema({
    fields: [{name: 'nested', type: 'object'}],
    rows: [[cycle]]
  });
  t.throws(
    () => datasetSchema[VERSIONS.v1].save(dataset),
    /Cannot export circular dataset values/,
    'still rejects an actual serialization cycle'
  );
  t.end();
});

test('#DatasetSchema -> joined Int64 rows save and reload without changing live rows', t => {
  const values = [
    0n,
    10n,
    20n,
    -9007199254740991n,
    9007199254740991n,
    -9223372036854775808n,
    9007199254740992n,
    9007199254740993n,
    null
  ];
  const source = arrowDataset({
    key: arrow.vectorFromArray(values.map((_, index) => String(index))),
    signed: arrow.vectorFromArray(values, new arrow.Int64()),
    unsigned: arrow.vectorFromArray(
      values.map(value => (value === null ? null : value < 0n ? 18446744073709551615n : value)),
      new arrow.Uint64()
    )
  });
  const proto = joinDatasets(source, source, {
    leftField: 'key',
    rightField: 'key',
    type: 'LEFT',
    rightColumns: []
  });
  const original = proto.data.rows.map(row => [...row]);
  const expected = [
    ['0', 0, 0],
    ['1', 10, 10],
    ['2', 20, 20],
    ['3', -9007199254740991, '18446744073709551615'],
    ['4', 9007199254740991, 9007199254740991],
    ['5', '-9223372036854775808', '18446744073709551615'],
    ['6', '9007199254740992', '9007199254740992'],
    ['7', '9007199254740993', '9007199254740993'],
    ['8', null, null]
  ];
  const dataset = new KeplerTable({
    info: proto.info,
    metadata: proto.metadata,
    color: [0, 0, 0]
  }).updateSchema(proto.data);
  const saved = datasetSchema[VERSIONS.v1].save(dataset);
  t.deepEqual(saved.allData, expected, 'safe numbers and exact unsafe decimal strings');
  t.equal(
    reloadDataset(saved).getValue('signed', 7),
    '9007199254740993',
    'in-memory saved schema also omits the live BigInt representation'
  );
  t.deepEqual(dataset.dataContainer.flattenData(), original, 'live rows are not mutated');
  t.deepEqual(source.dataContainer.flattenData(), original, 'source Arrow values are not mutated');
  t.doesNotThrow(() => {
    const json = exportToJsonString({
      datasets: [{version: 'v1', data: saved}],
      config: {version: 'v1', config: {}}
    });
    const parsed = processKeplerglJSON(JSON.parse(json)).datasets[0];
    const reloaded = new KeplerTable({
      info: parsed.info,
      metadata: parsed.metadata,
      color: [0, 0, 0]
    }).updateSchema(validateInputData(parsed.data));
    t.deepEqual(reloaded.dataContainer.flattenData(), expected, 'JSON reload retains exact cells');
    t.equal(
      reloaded.fields[1].valueAccessor({index: 7}),
      '9007199254740993',
      'accepted unsafe-string numeric limitation unchanged'
    );
    t.deepEqual(
      datasetSchema[VERSIONS.v1].save(reloaded).allData,
      expected,
      'resave retains exact cells'
    );
    const html = exportMapToHTML({
      datasets: [{version: 'v1', data: saved}],
      config: {version: 'v1', config: {}}
    });
    const embedded = JSON.parse(html.match(/const datasets = (.*);/)[1]);
    t.deepEqual(embedded[0].data.allData, expected, 'HTML retains the same exact cells');
    t.deepEqual(
      reloadDataset(embedded[0].data).dataContainer.flattenData(),
      expected,
      'HTML reload retains exact cells'
    );
  }, 'JSON and HTML exports are valid');
  t.end();
});

test('#DatasetSchema -> string-typed Arrow Int64 joins still export exact values', t => {
  const source = new KeplerTable({info: {id: 'string-arrow'}, color: [0, 0, 0]}).updateSchema({
    fields: [
      {name: 'key', type: 'string'},
      {name: 'value', type: 'string'}
    ],
    rows: [],
    cols: [
      arrow.vectorFromArray(['a', 'b']),
      arrow.vectorFromArray([10n, 9007199254740993n], new arrow.Int64())
    ]
  });
  const proto = joinDatasets(source, source, {
    leftField: 'key',
    rightField: 'key',
    type: 'LEFT',
    rightColumns: []
  });
  const table = new KeplerTable({info: proto.info, color: [0, 0, 0]}).updateSchema(proto.data);
  t.deepEqual(datasetSchema.v1.save(table).allData, [
    ['a', 10],
    ['b', '9007199254740993']
  ]);
  t.equal(table.getValue('value', 1), 9007199254740993n);
  t.end();
});

test('#DatasetSchema -> row numeric controls and empty rows remain unchanged', t => {
  for (const rows of [[], [[null], [null]], [[10], [20], [null]], [[10], null, [], [20]]]) {
    const dataset = new KeplerTable({
      color: [0, 0, 0]
    }).updateSchema({fields: [{name: 'value', type: 'integer', analyzerType: 'INT'}], rows});
    const saved = datasetSchema[VERSIONS.v1].save(dataset);
    t.deepEqual(JSON.parse(exportToJsonString(saved)).allData, rows, 'control saves unchanged');
    t.deepEqual(dataset.dataContainer.flattenData(), rows, 'control source unchanged');
    t.equal(saved.allData, rows, 'no row copy is needed when there are no BigInts');
  }
  t.end();
});

test('#DatasetSchema -> BigInt normalization copies only affected rows and preserves other cells', t => {
  const date = new Date('2020-01-01T00:00:00Z');
  const rows = [null, [10n, date, '9007199254740993'], [20, null, 'unchanged'], null];
  const dataset = new KeplerTable({color: [0, 0, 0]}).updateSchema({
    fields: [
      {name: 'value', type: 'integer'},
      {name: 'date', type: 'date'},
      {name: 'text', type: 'string'}
    ],
    rows
  });
  const saved = datasetSchema[VERSIONS.v1].save(dataset);
  t.notEqual(saved.allData, rows, 'the outer array is copied for a conversion');
  t.deepEqual(
    saved.allData,
    [null, [10, date, '9007199254740993'], rows[2], null],
    'only BigInt cells change'
  );
  t.notEqual(saved.allData[1], rows[1], 'the affected row is copied');
  t.equal(saved.allData[2], rows[2], 'the unchanged row is reused');
  t.equal(saved.allData[1][1], date, 'row dates are not converted by Arrow temporal handling');
  t.equal(dataset.dataContainer.valueAt(1, 0), 10n, 'live storage remains exact');
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

test('#DatasetSchema -> joined WKB geometry survives JSON save and reopen', t => {
  const wkb = Uint8Array.from([1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 36, 64, 0, 0, 0, 0, 0, 0, 38, 64]);
  const table = new arrow.Table({
    key: arrow.vectorFromArray(['a', 'b']),
    geometry: arrow.vectorFromArray([wkb, null], new arrow.Binary())
  });
  table.schema.fields[1].metadata.set('ARROW:extension:name', 'geoarrow.wkb');
  const source = new KeplerTable({info: {id: 'wkb-source'}, color: [1, 2, 3]}).updateSchema(
    processArrowTable({shape: 'arrow-table', data: table})
  );
  const proto = joinDatasets(source, source, {
    leftField: 'key',
    rightField: 'key',
    type: 'LEFT',
    rightColumns: []
  });
  const dataset = new KeplerTable({info: proto.info, color: [1, 2, 3]}).updateSchema(
    validateInputData(proto.data)
  );
  const saved = datasetSchema[VERSIONS.v1].save(dataset);
  t.equal(saved.fields[1].type, 'geojson', 'saved geometry uses the portable type');
  t.equal(saved.allData[0][1], '010100000000000000000024400000000000002640', 'saves WKB as hex');
  t.equal(saved.allData[1][1], null, 'retains missing geometry');
  t.equal(
    csvParseRows(formatCsv(dataset.dataContainer, dataset.fields))[1][1],
    saved.allData[0][1],
    'CSV uses portable WKB too'
  );
  const reloaded = reloadDataset(saved);
  t.deepEqual(
    parseGeoJsonRawFeature(reloaded.dataContainer.valueAt(0, 1))?.geometry,
    {type: 'Point', coordinates: [10, 11]},
    'reopened WKB remains a usable point'
  );
  t.ok(
    dataset.dataContainer.valueAt(0, 1) instanceof Uint8Array,
    'does not mutate live joined bytes'
  );
  t.deepEqual(table.getChild('geometry').get(0), wkb, 'does not mutate source bytes');
  t.end();
});

test('#DatasetSchema -> invalid WKB stays invalid without mutating the row', t => {
  const bytes = new Uint8Array([1, 2]);
  const dataset = new KeplerTable({info: {id: 'invalid-wkb'}, color: [1, 2, 3]}).updateSchema({
    fields: [{name: 'geometry', type: 'geoarrow', analyzerType: 'GEOMETRY'}],
    rows: [[bytes], null]
  });
  const saved = datasetSchema[VERSIONS.v1].save(dataset);
  t.equal(saved.allData[0][0], '0102', 'serializes bytes without inventing a geometry');
  t.equal(
    parseGeoJsonRawFeature(saved.allData[0][0]),
    null,
    'invalid geometry remains non-renderable'
  );
  t.equal(dataset.dataContainer.valueAt(0, 0), bytes, 'live row is unchanged');
  t.equal(saved.allData[1], null, 'retains the null row when saving GeoArrow data');
  t.equal(
    reloadDataset(saved).dataContainer.rowAsArray(1),
    null,
    'JSON reopen retains the null row'
  );
  t.equal(dataset.dataContainer.rowAsArray(1), null, 'live null row is unchanged');
  t.end();
});

test('#DatasetSchema -> Arrow time units save without BigInt conversion errors', t => {
  for (const [type, value] of [
    [new arrow.TimeSecond(), 12],
    [new arrow.TimeMillisecond(), 12000],
    [new arrow.TimeMicrosecond(), 12000000n],
    [new arrow.TimeNanosecond(), 12000000000n]
  ]) {
    const zero = typeof value === 'bigint' ? 0n : 0;
    const dataset = arrowDataset({time: arrow.vectorFromArray([null, zero, value], type)});
    const original = dataset.dataContainer.flattenData();
    const saved = datasetSchema[VERSIONS.v1].save(dataset);
    const expected = [[null], ['1970-01-01T00:00:00.000Z'], ['1970-01-01T00:00:12.000Z']];
    t.deepEqual(saved.allData, expected, `${type} converts raw units to milliseconds`);
    t.deepEqual(reloadDataset(saved).dataContainer.flattenData(), expected, `${type} reloads`);
    t.deepEqual(dataset.dataContainer.flattenData(), original, `${type} leaves source unchanged`);
  }
  for (const [type, value] of [
    [new arrow.TimeMicrosecond(), 12123456n],
    [new arrow.TimeNanosecond(), 12123456789n]
  ]) {
    const saved = datasetSchema[VERSIONS.v1].save(
      arrowDataset({time: arrow.vectorFromArray([value], type)})
    );
    t.deepEqual(
      saved.allData,
      [['1970-01-01T00:00:12.123Z']],
      `${type} uses saved timestamp millisecond precision`
    );
  }
  t.end();
});
