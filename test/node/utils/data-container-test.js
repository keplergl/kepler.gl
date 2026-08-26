// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';

import {
  createDataContainer,
  createIndexedDataContainer,
  compactArrowTable,
  ArrowDataContainer
} from '@kepler.gl/utils';
import {GEOARROW_EXTENSIONS, GEOARROW_METADATA_KEY} from '@kepler.gl/constants';
import * as arrow from 'apache-arrow';

const data = [
  [10, 20], // 0
  [30, 40], // 1
  [50, 60], // 2
  [80, 90], // 3
  [100, 110], // 4
  [120, 130] // 5
];

const indices = [1, 3, 5];

test('RowDataContainer', t => {
  const dc = createDataContainer(data);

  t.deepEqual(dc.numRows(), 6, `RowDataContainer should have expected number of rows`);
  t.deepEqual(dc.numColumns(), 2, `RowDataContainer should have expected number of columns`);
  t.deepEqual(dc.valueAt(2, 1), 60, `RowDataContainer.valueAt should return expected value`);
  t.deepEqual(dc.row(2).valueAt(1), 60, `RowDataContainer.row should return expected value`);
  t.deepEqual(
    dc.rowAsArray(2),
    [50, 60],
    `RowDataContainer.rowAsArray should return expected value`
  );
  t.deepEqual(dc.flattenData(), data, `RowDataContainer.flattenData should return expected data`);
  t.deepEqual(
    dc.getPlainIndex(),
    [0, 1, 2, 3, 4, 5],
    `RowDataContainer.getPlainIndex should return expected indices`
  );

  t.deepEqual(
    dc.map(row => row.valueAt(1)),
    [20, 40, 60, 90, 110, 130],
    `RowDataContainer.map should return expected array`
  );

  t.deepEqual(
    dc.mapIndex(d => d),
    [{index: 0}, {index: 1}, {index: 2}, {index: 3}, {index: 4}, {index: 5}],
    `RowDataContainer.mapIndex should return expected array`
  );

  t.deepEqual(
    dc.find(row => {
      return row.valueAt(1) === 60;
    }),
    dc.row(2),
    `RowDataContainer.find should return expected row`
  );

  t.deepEqual(
    dc.reduce((acc, row) => {
      return acc + row.valueAt(1);
    }, 10),
    460,
    `RowDataContainer.reduce should return expected value`
  );

  t.end();
});

test('RowDataContainer.update replaces rows', t => {
  const dc = createDataContainer(data);
  dc.update([
    [1, 2],
    [3, 4]
  ]);
  t.equal(dc.numRows(), 2, 'should replace with the new row count');
  t.equal(dc.numColumns(), 2, 'should keep column count');
  t.equal(dc.valueAt(0, 0), 1, 'should read values from the new rows');
  t.deepEqual(dc.getPlainIndex(), [0, 1], 'should rebuild the index');
  t.end();
});

test('IndexedDataContainer', t => {
  const dc = createIndexedDataContainer(createDataContainer(data), indices);

  t.deepEqual(dc.numRows(), 3, `IndexedDataContainer should have expected number of rows`);
  t.deepEqual(dc.numColumns(), 2, `IndexedDataContainer should have expected number of columns`);
  t.deepEqual(dc.valueAt(2, 1), 130, `IndexedDataContainer.valueAt should return expected value`);
  t.deepEqual(dc.row(2).valueAt(1), 130, `IndexedDataContainer.row should return expected value`);
  t.deepEqual(
    dc.rowAsArray(2),
    [120, 130],
    `IndexedDataContainer.rowAsArray should return expected value`
  );

  t.deepEqual(
    dc.flattenData(),
    [data[indices[0]], data[indices[1]], data[indices[2]]],
    `IndexedDataContainer.flattenData should return expected data`
  );
  t.deepEqual(
    dc.getPlainIndex(),
    [0, 1, 2],
    `IndexedDataContainer.getPlainIndex should return expected indices`
  );

  t.deepEqual(
    dc.map(row => row.valueAt(1)),
    [40, 90, 130],
    `IndexedDataContainer.map should return expected array`
  );

  t.deepEqual(
    dc.mapIndex(d => d),
    [{index: 1}, {index: 3}, {index: 5}],
    `IndexedDataContainer.mapIndex should return expected array`
  );

  t.deepEqual(
    dc.find(row => {
      return row.valueAt(1) === 90;
    }),
    dc.row(1),
    `IndexedDataContainer.find should return expected row`
  );

  t.deepEqual(
    dc.reduce((acc, row) => {
      return acc + row.valueAt(1);
    }, 10),
    270,
    `RowDataContainer.reduce should return expected value`
  );

  t.end();
});

test('ArrowDataContainer -> compactArrowTable collapses record batches over the limit', t => {
  const batchA = arrow.tableFromJSON([{lng: -122.4, lat: 37.8}]);
  const batchB = arrow.tableFromJSON([{lng: -122.5, lat: 37.9}]);
  const combined = batchA.concat(batchB);

  t.ok(combined.batches.length > 1, 'fixture should have multiple record batches');

  const belowLimit = compactArrowTable(combined, 255);
  t.equal(
    belowLimit.batches.length,
    combined.batches.length,
    'compactArrowTable should leave tables at or under maxArrowBatches unchanged'
  );

  combined.schema.metadata.set('geo', JSON.stringify({columns: {lng: {encoding: 'WKB'}}}));
  combined.schema.fields[0].metadata.set('ARROW:extension:name', 'geoarrow.wkb');

  const compacted = compactArrowTable(combined, 1);
  t.equal(compacted.numRows, 2, 'compactArrowTable should keep all rows');
  t.equal(compacted.batches.length, 1, 'compactArrowTable should collapse into one batch');
  t.ok(
    compacted.schema.metadata.get('geo'),
    'compactArrowTable should keep GeoParquet schema metadata used to create layers'
  );
  t.equal(
    compacted.schema.fields[0].metadata.get('ARROW:extension:name'),
    'geoarrow.wkb',
    'compactArrowTable should keep geoarrow field metadata'
  );

  const cols = Array.from({length: combined.numCols}, (_, i) => combined.getChildAt(i)).filter(
    Boolean
  );
  const arrowDc = new ArrowDataContainer({
    cols,
    fields: combined.schema.fields.map((field, fieldIdx) => ({
      name: field.name,
      fieldIdx
    })),
    arrowTable: compactArrowTable(combined, 1)
  });

  t.equal(arrowDc.numRows(), 2, 'ArrowDataContainer should keep all rows');
  t.equal(arrowDc.numChunks(), 1, 'ArrowDataContainer should store a compacted table');
  t.deepEqual(arrowDc.valueAt(0, 0), -122.4, 'compacted container should preserve values');

  t.end();
});

test('ArrowDataContainer -> update does not collapse record batches', t => {
  const batchA = arrow.tableFromJSON([{lng: -122.4, lat: 37.8}]);
  const colsA = Array.from({length: batchA.numCols}, (_, i) => batchA.getChildAt(i)).filter(
    Boolean
  );
  const dc = new ArrowDataContainer({
    cols: colsA,
    fields: batchA.schema.fields.map((field, fieldIdx) => ({
      name: field.name,
      fieldIdx
    })),
    arrowTable: batchA
  });

  const batchB = arrow.tableFromJSON([{lng: -122.5, lat: 37.9}]);
  const combined = batchA.concat(batchB);
  dc.update(combined);

  t.equal(dc.numRows(), 2, 'update should keep all rows');
  t.equal(
    dc.numChunks(),
    combined.batches.length,
    'update should not compact batches during incremental loading'
  );
  t.deepEqual(dc.valueAt(1, 0), -122.5, 'update should preserve newly appended values');

  t.end();
});

function finishArrowVector(builder) {
  const finished = builder.finish();
  if (finished instanceof arrow.Vector) {
    return finished;
  }
  return finished.toVector();
}

function tableFromColumnValues(name, type, values, metadata) {
  const builder = arrow.makeBuilder({type, nullValues: [null]});
  values.forEach(value => builder.append(value));
  const vector = finishArrowVector(builder);
  const field = new arrow.Field(name, type, true, metadata);
  return new arrow.Table(new arrow.Schema([field]), {[name]: vector});
}

function concatColumnTables(name, type, leftValues, rightValues, metadata) {
  return tableFromColumnValues(name, type, leftValues, metadata).concat(
    tableFromColumnValues(name, type, rightValues, metadata)
  );
}

function jsArrowCell(value) {
  if (value == null) {
    return null;
  }
  if (ArrayBuffer.isView(value)) {
    return Array.from(value);
  }
  if (typeof value.toArray === 'function' && value.numChildren === 0) {
    return Array.from(value.toArray());
  }
  if (typeof value.get === 'function' && typeof value.length === 'number') {
    const out = [];
    for (let i = 0; i < value.length; i++) {
      const valid = typeof value.isValid === 'function' ? value.isValid(i) : true;
      out.push(valid ? jsArrowCell(value.get(i)) : null);
    }
    return out;
  }
  return value;
}

function columnCells(table) {
  const column = table.getChildAt(0);
  return Array.from({length: column.length}, (_, i) => {
    if (typeof column.isValid === 'function' && !column.isValid(i)) {
      return null;
    }
    return jsArrowCell(column.get(i));
  });
}

test('compactArrowTable -> concat does not merge chunks; Vector has no combineChunks', t => {
  const batchA = arrow.tableFromJSON([{lng: -122.4}]);
  const batchB = arrow.tableFromJSON([{lng: -122.5}]);
  const combined = batchA.concat(batchB);
  const column = combined.getChildAt(0);

  t.equal(
    typeof column.combineChunks,
    'undefined',
    'apache-arrow JS Vector has concat, not combineChunks'
  );
  t.ok(column.data.length > 1, 'Table.concat keeps one chunk per record batch');
  t.equal(typeof column.concat, 'function', 'Vector.concat exists but does not collapse chunks');

  t.end();
});

test('compactArrowTable -> dictionary, WKB, and nested GeoArrow keep values', t => {
  const geoMeta = metadata => {
    const map = new Map();
    map.set(GEOARROW_METADATA_KEY, metadata);
    return map;
  };

  const dictType = new arrow.Dictionary(new arrow.Utf8(), new arrow.Int8());
  const dictTable = concatColumnTables('city', dictType, ['sf', null], ['nyc']);
  const dictCompacted = compactArrowTable(dictTable, 1);
  t.equal(dictCompacted.batches.length, 1, 'dictionary column should collapse to one batch');
  t.deepEqual(
    columnCells(dictCompacted),
    ['sf', null, 'nyc'],
    'dictionary values and nulls should survive the Builder rebuild'
  );

  const wkbPoint = (lng, lat) => {
    const bytes = new Uint8Array(21);
    const view = new DataView(bytes.buffer);
    view.setUint8(0, 1);
    view.setUint32(1, 1, true);
    view.setFloat64(5, lng, true);
    view.setFloat64(13, lat, true);
    return bytes;
  };
  const wkbTable = concatColumnTables(
    'geometry',
    new arrow.Binary(),
    [wkbPoint(-122.4, 37.8), null],
    [wkbPoint(-122.5, 37.9)],
    geoMeta(GEOARROW_EXTENSIONS.WKB)
  );
  wkbTable.schema.metadata.set('geo', JSON.stringify({columns: {geometry: {encoding: 'WKB'}}}));
  const wkbCompacted = compactArrowTable(wkbTable, 1);
  t.equal(wkbCompacted.batches.length, 1, 'WKB binary column should collapse to one batch');
  t.deepEqual(
    columnCells(wkbCompacted),
    columnCells(wkbTable),
    'WKB bytes and nulls should survive the Builder rebuild'
  );
  t.equal(
    wkbCompacted.schema.fields[0].metadata.get(GEOARROW_METADATA_KEY),
    GEOARROW_EXTENSIONS.WKB,
    'geoarrow.wkb field metadata should be copied'
  );
  t.ok(wkbCompacted.schema.metadata.get('geo'), 'GeoParquet schema metadata should be copied');

  const pointType = new arrow.FixedSizeList(2, new arrow.Field('xy', new arrow.Float64(), false));
  const pointTable = concatColumnTables(
    'geom',
    pointType,
    [[-122.4, 37.8], null],
    [[-122.5, 37.9]],
    geoMeta(GEOARROW_EXTENSIONS.POINT)
  );
  const pointCompacted = compactArrowTable(pointTable, 1);
  t.equal(pointCompacted.batches.length, 1, 'geoarrow.point should collapse to one batch');
  t.deepEqual(
    columnCells(pointCompacted),
    [[-122.4, 37.8], null, [-122.5, 37.9]],
    'geoarrow.point coordinates must not become NaN after Builder rebuild'
  );

  const lineType = new arrow.List(new arrow.Field('vertices', pointType, false));
  const lineTable = concatColumnTables(
    'geom',
    lineType,
    [
      [
        [-122.4, 37.8],
        [-122.5, 37.9]
      ]
    ],
    [
      [
        [0, 0],
        [1, 1]
      ]
    ],
    geoMeta(GEOARROW_EXTENSIONS.LINESTRING)
  );
  const lineCompacted = compactArrowTable(lineTable, 1);
  t.equal(lineCompacted.batches.length, 1, 'geoarrow.linestring should collapse to one batch');
  t.deepEqual(
    columnCells(lineCompacted),
    columnCells(lineTable),
    'nested geoarrow.linestring coordinates should survive the Builder rebuild'
  );

  const polygonType = new arrow.List(new arrow.Field('rings', lineType, false));
  const ring = [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 0]
  ];
  const polygonTable = concatColumnTables(
    'geom',
    polygonType,
    [[ring]],
    [[ring]],
    geoMeta(GEOARROW_EXTENSIONS.POLYGON)
  );
  const polygonCompacted = compactArrowTable(polygonTable, 1);
  t.equal(polygonCompacted.batches.length, 1, 'geoarrow.polygon should collapse to one batch');
  t.deepEqual(
    columnCells(polygonCompacted),
    columnCells(polygonTable),
    'nested geoarrow.polygon coordinates should survive the Builder rebuild'
  );

  t.end();
});

test('compactArrowTable -> duplicate field names keep both columns', t => {
  const duplicateNameTable = (floatValues, intValues) => {
    const schema = new arrow.Schema([
      new arrow.Field('x', new arrow.Float64()),
      new arrow.Field('x', new arrow.Int32())
    ]);
    const floats = arrow.vectorFromArray(floatValues, new arrow.Float64());
    const ints = arrow.vectorFromArray(intValues, new arrow.Int32());
    const data = arrow.makeData({
      type: new arrow.Struct(schema.fields),
      children: [floats.data[0], ints.data[0]],
      length: floatValues.length
    });
    return new arrow.Table(new arrow.RecordBatch(schema, data));
  };

  const combined = duplicateNameTable([1.5], [1]).concat(duplicateNameTable([2.5], [2]));
  t.equal(combined.numCols, 2, 'fixture should expose both duplicate-named columns');
  t.ok(combined.batches.length > 1, 'fixture should have multiple record batches');

  const compacted = compactArrowTable(combined, 1);
  t.equal(compacted.numCols, 2, 'compaction should not drop a duplicate-named column');
  t.equal(compacted.numRows, 2, 'compaction should keep all rows');
  t.equal(
    compacted.batches.length,
    1,
    'duplicate-named columns should still collapse to one batch'
  );
  t.deepEqual(
    [compacted.getChildAt(0).get(0), compacted.getChildAt(0).get(1)],
    [1.5, 2.5],
    'first duplicate-named column should keep its float values'
  );
  t.deepEqual(
    [compacted.getChildAt(1).get(0), compacted.getChildAt(1).get(1)],
    [1, 2],
    'second duplicate-named column should keep its int values'
  );

  t.end();
});

test('compactArrowTable -> Builder failure keeps the original table', t => {
  const batchA = arrow.tableFromJSON([{lng: -122.4}]);
  const batchB = arrow.tableFromJSON([{lng: -122.5}]);
  const combined = batchA.concat(batchB);
  const exploding = {
    batches: combined.batches,
    numCols: combined.numCols,
    schema: combined.schema,
    getChildAt() {
      throw new Error('cannot compact');
    }
  };

  const result = compactArrowTable(exploding, 1);
  t.equal(
    result,
    exploding,
    'compactArrowTable should return the original table when the Builder path throws'
  );

  t.end();
});
