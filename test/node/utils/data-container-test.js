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

function orderedNumericTable() {
  const cols = [
    arrow.vectorFromArray([37, null, 38], new arrow.Float64()),
    arrow.vectorFromArray([-122, -123, -124], new arrow.Float32()),
    arrow.vectorFromArray([1000, null, 2000], new arrow.Int32())
  ];
  const fields = cols.map(
    (col, i) =>
      new arrow.Field(['lat', 'lng', '2020'][i], col.type, true, new Map([['source', String(i)]]))
  );
  const schema = new arrow.Schema(fields, new Map([['source', 'ordered']]));
  const batch = new arrow.RecordBatch(
    schema,
    arrow.makeData({type: new arrow.Struct(fields), length: 3, children: cols.map(c => c.data[0])})
  );
  return new arrow.Table(schema, [batch]);
}

test('ArrowDataContainer -> numeric headers preserve vector order through updates and IPC', t => {
  const source = orderedNumericTable();
  const cols = source.schema.fields.map((_, i) => source.getChildAt(i));
  const dc = new ArrowDataContainer({cols, fields: source.schema.fields});
  const rows = [
    [37, -122, 1000],
    [null, -123, null],
    [38, -124, 2000]
  ];
  t.deepEqual(dc.flattenData(), rows, 'numeric names do not reorder values');
  dc.update([
    cols[0].slice(0, 1).concat(cols[0].slice(1)),
    cols[1],
    cols[2].slice(0, 2).concat(cols[2].slice(2))
  ]);
  t.equal(dc.numChunks(), 3, 'staggered chunks remain aligned');
  t.deepEqual(dc.flattenData(), rows);
  t.deepEqual(
    dc.getTable().schema.fields.map(f => f.name),
    ['lat', 'lng', '2020']
  );
  cols.forEach((col, i) => {
    t.equal(dc.getColumn(i).type.toString(), col.type.toString(), 'physical types stay aligned');
    dc.getColumn(i).data.forEach(chunk => {
      t.equal(chunk.values.buffer, col.data[0].values.buffer, 'values are shared');
      t.equal(chunk.nullBitmap.buffer, col.data[0].nullBitmap.buffer, 'validity is shared');
    });
  });
  const restored = arrow.tableFromIPC(arrow.tableToIPC(dc.getTable()));
  t.equal(restored.getChild('lat').get(0), 37);
  t.equal(restored.getChild('2020').get(0), 1000);
  dc.update(cols.map(col => col.slice(0, 0)));
  t.equal(dc.numRows(), 0);
  t.equal(dc.numColumns(), 3);
  t.deepEqual(
    dc.getTable().schema.fields.map(f => f.name),
    ['lat', 'lng', '2020']
  );
  t.equal(dc.getColumn(2).type.toString(), 'Int32', 'empty columns keep their types');
  t.end();
});

test('compactArrowTable -> numeric headers keep values aligned with the schema', t => {
  const source = orderedNumericTable();
  const compacted = compactArrowTable(source.concat(source), 1);
  t.equal(compacted.batches.length, 1);
  t.deepEqual(
    compacted.schema.fields.map(f => f.name),
    ['lat', 'lng', '2020']
  );
  source.schema.fields.forEach((field, i) => {
    t.deepEqual(Array.from(compacted.getChildAt(i)), [
      ...source.getChildAt(i),
      ...source.getChildAt(i)
    ]);
    t.equal(compacted.getChildAt(i).type.toString(), field.type.toString());
    t.deepEqual(compacted.schema.fields[i].metadata, field.metadata);
  });
  t.deepEqual(compacted.schema.metadata, source.schema.metadata);
  t.equal(arrow.tableFromIPC(arrow.tableToIPC(compacted)).getChild('2020').get(0), 1000);
  t.equal(source.getChild('lat').get(0), 37, 'source values remain untouched');
  t.end();
});

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

test('RowDataContainer.append and remove', t => {
  const dc = createDataContainer([
    [10, 20],
    [30, 40],
    [50, 60]
  ]);

  t.equal(
    dc.append([
      [70, 80],
      [90, 100]
    ]),
    true,
    'should append matching rows'
  );
  t.equal(dc.numRows(), 5, 'should grow without replacing existing rows');
  t.equal(dc.valueAt(0, 0), 10, 'should keep the original first row');
  t.equal(dc.valueAt(4, 1), 100, 'should read the last appended row');
  t.deepEqual(dc.getPlainIndex(), [0, 1, 2, 3, 4], 'should expose contiguous indexes');

  t.equal(dc.append([[1]]), false, 'should reject a wrong column count');
  t.equal(dc.append([]), false, 'should reject an empty batch');
  t.equal(dc.append(null), false, 'should reject a missing batch');
  t.equal(dc.numRows(), 5, 'should leave rows unchanged after a rejected append');

  t.equal(dc.replace(0, [11, 22]), true, 'should overwrite a row in place');
  t.deepEqual(dc.rowAsArray(0), [11, 22], 'should read the replaced row');
  t.equal(dc.replace(99, [1, 2]), false, 'should reject a replace with an out-of-range index');
  t.equal(dc.replace(0, [1]), false, 'should reject a replace with the wrong column count');
  t.deepEqual(
    dc.rowAsArray(0),
    [11, 22],
    'should leave the row unchanged after a rejected replace'
  );

  t.equal(dc.remove([1, 1, 3]), true, 'should drop unique valid indexes in one rebuild');
  t.deepEqual(
    dc.flattenData(),
    [
      [11, 22],
      [50, 60],
      [90, 100]
    ],
    'should keep the remaining rows in order'
  );
  t.deepEqual(dc.getPlainIndex(), [0, 1, 2], 'should rebuild indexes after remove');

  t.equal(dc.remove([99]), false, 'should reject an out-of-range index');
  t.equal(dc.remove([-1]), false, 'should reject a negative index');
  t.equal(dc.numRows(), 3, 'should leave rows unchanged after a rejected remove');

  dc.update([[1, 2]]);
  t.equal(dc.numRows(), 1, 'update should still replace after append/remove');
  t.equal(dc.valueAt(0, 0), 1, 'update should write the new snapshot');

  const empty = createDataContainer([]);
  t.equal(
    empty.append([[3, 4]]),
    true,
    'should set column count from the first row on an empty table'
  );
  t.equal(empty.numRows(), 1, 'empty table should accept the first append');
  t.equal(empty.numColumns(), 2, 'empty table should take width from the first row');
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

test('ArrowDataContainer -> worker GeoArrow cache follows progressive chunks', t => {
  const batchA = arrow.tableFromJSON([{value: 1}]);
  const batchB = arrow.tableFromJSON([{value: 2}]);
  const featureTypes = {point: true, line: false, polygon: false};
  const cachedA = {
    binaryGeometries: ['a'],
    bounds: [0, 0, 0, 0],
    featureTypes,
    meanCenters: [[0, 0]]
  };
  const cachedB = {
    binaryGeometries: ['b'],
    bounds: [1, 1, 1, 1],
    featureTypes,
    meanCenters: [[1, 1]]
  };
  const dc = new ArrowDataContainer({
    cols: [batchA.getChildAt(0)],
    fields: [{name: 'value', fieldIdx: 0}],
    arrowTable: batchA,
    geoArrowBinaryData: {0: {0: cachedA}}
  });

  const combined = batchA.concat(batchB);
  dc.update(combined, {geoArrowBinaryData: {0: {1: cachedB}}});

  t.equal(dc.getGeoArrowBinaryData(0, 0), cachedA, 'should retain the first parsed chunk');
  t.equal(dc.getGeoArrowBinaryData(0, 1), cachedB, 'should append the new parsed chunk');
  t.deepEqual(
    dc.getGeoArrowBinaryData(0).binaryGeometries,
    ['a', 'b'],
    'should expose all cached chunks in record-batch order'
  );

  const compacted = compactArrowTable(combined, 1);
  const compactedCache = {...cachedA, binaryGeometries: ['all'], meanCenters: [[0.5, 0.5]]};
  dc.update(compacted, {geoArrowBinaryData: {0: {0: compactedCache}}});
  t.equal(
    dc.getGeoArrowBinaryData(0, 0),
    compactedCache,
    'compaction should replace cache entries because chunk indexes reset'
  );
  t.equal(dc.getGeoArrowBinaryData(0, 1), undefined, 'stale progressive chunks should be removed');

  const largeMeanCenters = Array.from({length: 150000}, (_, index) => [index, index]);
  const largeCache = {...compactedCache, meanCenters: largeMeanCenters};
  dc.update(compacted, {geoArrowBinaryData: {0: {0: largeCache}}});
  let combinedCache;
  t.doesNotThrow(() => {
    combinedCache = dc.getGeoArrowBinaryData(0);
  }, 'large compacted centroid caches should not overflow the call stack');
  t.equal(
    combinedCache.meanCenters.length,
    largeMeanCenters.length,
    'large compacted centroid caches should keep every center'
  );

  t.equal(dc.remove([0]), true, 'should remove a row from the cached table');
  t.equal(dc.valueAt(0, 0), 2, 'should retain only the second row');
  t.equal(dc.getGeoArrowBinaryData(0), undefined, 'row deletion should discard cached geometry');

  dc.update(batchA, {geoArrowBinaryData: {0: {0: cachedA}}});
  t.equal(dc.remove([0]), true, 'should remove the final cached row');
  t.equal(dc.numRows(), 0, 'should leave an empty table');
  t.equal(dc.getGeoArrowBinaryData(0), undefined, 'empty tables must not retain cached geometry');

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

function arrowContainerFromTable(table) {
  const cols = Array.from({length: table.numCols}, (_, i) => table.getChildAt(i)).filter(Boolean);
  return new ArrowDataContainer({
    cols,
    fields: table.schema.fields.map((field, fieldIdx) => ({
      name: field.name,
      fieldIdx
    })),
    arrowTable: table
  });
}

test('ArrowDataContainer.append replace and remove', t => {
  const dc = arrowContainerFromTable(
    arrow.tableFromJSON([
      {id: 'a', lat: 1},
      {id: 'b', lat: 2}
    ])
  );

  t.equal(
    dc.append([
      ['c', 3],
      ['d', 4]
    ]),
    true,
    'should append matching primitive/dictionary rows'
  );
  t.equal(dc.numRows(), 4, 'should grow without replacing existing rows');
  t.equal(dc.valueAt(0, 0), 'a', 'should keep the original first id');
  t.equal(dc.valueAt(3, 1), 4, 'should read the last appended lat');
  t.equal(dc.numChunks(), 1, 'append should compact concat batches');

  t.equal(dc.append([[1]]), false, 'should reject a wrong column count');
  t.equal(dc.append([]), false, 'should reject an empty batch');
  t.equal(dc.append(null), false, 'should reject a missing batch');
  t.equal(dc.numRows(), 4, 'should leave rows unchanged after a rejected append');

  t.equal(dc.replace(1, ['B', 22]), true, 'should overwrite a row by concat');
  t.equal(dc.valueAt(1, 0), 'B', 'should read the replaced id');
  t.equal(dc.valueAt(1, 1), 22, 'should read the replaced lat');
  t.equal(dc.replace(99, ['z', 1]), false, 'should reject a replace with an out-of-range index');
  t.equal(dc.replace(0, ['z']), false, 'should reject a replace with the wrong column count');
  t.equal(dc.valueAt(0, 0), 'a', 'should leave the row unchanged after a rejected replace');

  t.equal(dc.remove([1, 1, 3]), true, 'should drop unique valid indexes in one rebuild');
  t.equal(dc.numRows(), 2, 'should keep the remaining rows');
  t.equal(dc.valueAt(0, 0), 'a', 'should keep the former row 0');
  t.equal(dc.valueAt(1, 0), 'c', 'should keep the former row 2');
  t.deepEqual(dc.getPlainIndex(), [0, 1], 'should rebuild indexes after remove');

  t.equal(dc.remove([99]), false, 'should reject an out-of-range index');
  t.equal(dc.remove([-1]), false, 'should reject a negative index');
  t.equal(dc.numRows(), 2, 'should leave rows unchanged after a rejected remove');

  t.equal(dc.remove([0, 1]), true, 'should allow removing every remaining row');
  t.equal(dc.numRows(), 0, 'should keep an empty table with the original schema');
  t.equal(
    dc.append([['e', 5]]),
    true,
    'empty table should accept an append that matches the schema'
  );
  t.equal(dc.numRows(), 1, 'empty table should grow from the append');
  t.equal(dc.valueAt(0, 0), 'e', 'appended id should survive an empty-table concat');

  t.end();
});

test('ArrowDataContainer row edits preserve column positions and schema', t => {
  for (const names of [
    ['2', '1'],
    ['x', 'x', 'x_1'],
    ['__proto__', 'value']
  ]) {
    const original = names.map((_, i) => i + 1);
    const added = original.map(value => value * 10);
    const replaced = original.map(value => value * 100);
    const columns = original.map((value, i) =>
      arrow.vectorFromArray([value], i % 2 ? new arrow.Float64() : new arrow.Int32())
    );
    const fields = names.map(
      (name, i) => new arrow.Field(name, columns[i].type, true, new Map([['index', String(i)]]))
    );
    const schema = new arrow.Schema(fields, new Map([['source', 'row-edit']]));
    const batch = new arrow.RecordBatch(
      schema,
      arrow.makeData({
        type: new arrow.Struct(fields),
        length: 1,
        children: columns.map(column => column.data[0])
      })
    );
    fields.forEach((field, i) => {
      batch.schema.fields[i] = field;
    });
    const dc = arrowContainerFromTable(new arrow.Table(schema, [batch]));

    t.ok(dc.append([added]), `append accepts ${names.join(', ')}`);
    t.deepEqual(dc.flattenData(), [original, added], 'append keeps column values aligned');
    t.ok(dc.replace(0, replaced), 'replace succeeds');
    t.deepEqual(dc.flattenData(), [replaced, added], 'replace keeps every column');
    t.ok(dc.remove([0]), 'remove succeeds');
    t.deepEqual(dc.flattenData(), [added], 'remove keeps the remaining values');
    t.deepEqual(dc.getTable().schema, schema, 'names, types and metadata survive row edits');
  }
  t.end();
});

test('ArrowDataContainer.append rejects nested and geoarrow columns', t => {
  const originalWarn = console.warn;
  console.warn = () => {};

  try {
    const listTable = new arrow.Table({
      vals: arrow.vectorFromArray([
        [1, 2],
        [3, 4]
      ])
    });
    const listDc = arrowContainerFromTable(listTable);
    t.equal(listDc.append([[[5, 6]]]), false, 'should reject a List column');
    t.equal(listDc.numRows(), 2, 'rejected append must not mutate a List table');
    t.equal(listDc.remove([0]), true, 'remove should still concat slices of nested columns');
    t.equal(listDc.numRows(), 1, 'should drop the nested row by slice');

    const geoMeta = new Map();
    geoMeta.set(GEOARROW_METADATA_KEY, GEOARROW_EXTENSIONS.WKB);
    const wkbTable = tableFromColumnValues(
      'geometry',
      new arrow.Binary(),
      [new Uint8Array([1, 2, 3])],
      geoMeta
    );
    const geoDc = arrowContainerFromTable(wkbTable);
    t.equal(geoDc.append([[new Uint8Array([4, 5, 6])]]), false, 'should reject a geoarrow column');
    t.equal(geoDc.numRows(), 1, 'rejected append must not mutate a geoarrow table');
  } finally {
    console.warn = originalWarn;
  }
  t.end();
});

test('Arrow row edits preserve retained raw timestamps through compaction', t => {
  for (const [type, values] of [
    [
      new arrow.TimestampMicrosecond('UTC'),
      [9007199254740993n, 9007199254740995n, 9007199254740997n]
    ],
    [
      new arrow.TimestampNanosecond('UTC'),
      [1700000000000000123n, 1700000000000000456n, 1700000000000000789n]
    ]
  ]) {
    const timestamp = arrow.makeVector({
      type,
      data: new BigInt64Array([0n, ...values]),
      nullBitmap: new Uint8Array([0b1011]),
      nullCount: 1
    });
    const source = new arrow.Table({
      id: arrow.vectorFromArray(['skip', 'a', 'b', 'c'], new arrow.Utf8()),
      time: timestamp
    }).slice(1);
    const expected = [values[0], null, values[2]];
    const raw = table => {
      const column = table.getChildAt(1);
      const storage = column.toArray();
      return Array.from({length: column.length}, (_, i) => (column.isValid(i) ? storage[i] : null));
    };
    for (const [name, mutate, retained] of [
      ['append', dc => dc.append([['d', 0]]), [...expected, 0n]],
      ['delete middle', dc => dc.remove([1]), [values[0], values[2]]]
    ]) {
      const dc = arrowContainerFromTable(source);
      t.ok(mutate(dc), `${type} ${name} succeeds`);
      t.deepEqual(raw(dc.getTable()), retained, `${type} ${name} retains exact raw values`);
      t.deepEqual(
        raw(arrow.tableFromIPC(arrow.tableToIPC(dc.getTable()))),
        retained,
        'IPC retains raw storage'
      );
      t.deepEqual(raw(source), expected, 'original snapshot is unchanged');
      t.equal(dc.numChunks(), 1, 'row edits respect the compaction limit');
    }
  }
  t.end();
});

test('Arrow row edits preserve shared dictionary serialization', t => {
  const column = arrow.vectorFromArray(
    ['a', null, 'b'],
    new arrow.Dictionary(new arrow.Utf8(), new arrow.Int8(), 17)
  );
  const fields = ['left', '2020'].map(
    name => new arrow.Field(name, column.type, true, new Map([['source', name]]))
  );
  const schema = new arrow.Schema(fields, new Map([['source', 'shared-dictionary']]));
  const source = new arrow.Table(schema, {0: column, 1: column});
  const dc = arrowContainerFromTable(source);
  t.ok(dc.append([['c', 'd']]), 'append succeeds with separate incoming dictionary values');
  t.deepEqual(
    dc.flattenData(),
    [
      ['a', 'a'],
      [null, null],
      ['b', 'b'],
      ['c', 'd']
    ],
    'values stay aligned'
  );
  const assertIPC = expected => {
    let restored;
    t.doesNotThrow(() => {
      restored = arrow.tableFromIPC(arrow.tableToIPC(dc.getTable()));
    }, 'edited table is serializable');
    if (restored) {
      t.deepEqual(
        restored.schema.fields.map((_, i) => Array.from(restored.getChildAt(i))),
        expected,
        'IPC preserves every dictionary value'
      );
    }
    t.equal(
      dc.getTable().schema.metadata.get('source'),
      'shared-dictionary',
      'table metadata survives'
    );
    t.deepEqual(
      dc.getTable().schema.fields.map(field => field.metadata.get('source')),
      ['left', '2020'],
      'field metadata survives'
    );
  };
  assertIPC([
    ['a', null, 'b', 'c'],
    ['a', null, 'b', 'd']
  ]);
  t.ok(dc.remove([0, 1, 2]), 'deletion succeeds');
  assertIPC([['c'], ['d']]);
  t.ok(dc.remove([0]), 'delete all succeeds');
  t.ok(dc.append([['e', 'f']]), 'refill succeeds');
  assertIPC([['e'], ['f']]);
  t.deepEqual(Array.from(source.getChildAt(0)), ['a', null, 'b'], 'source values stay untouched');
  t.doesNotThrow(() => arrow.tableToIPC(source), 'source remains serializable');
  t.end();
});

test('Arrow row edits reject dictionary index overflow atomically', t => {
  for (const [Index, capacity] of [
    [arrow.Int8, 128],
    [arrow.Uint8, 256]
  ]) {
    const type = new arrow.Dictionary(new arrow.Utf8(), new Index());
    for (const empty of [false, true]) {
      const column = arrow.vectorFromArray(empty ? [] : ['original'], type);
      const source = new arrow.Table({value: column});
      const dc = arrowContainerFromTable(source);
      const snapshot = dc.getTable();
      const rows = Array.from({length: capacity + 1}, (_, i) => [`value-${i}`]);
      t.notOk(dc.append(rows), 'oversized incoming dictionary is rejected before indexes wrap');
      t.equal(dc.getTable(), snapshot, 'rejection retains the snapshot');
      t.deepEqual(dc.flattenData(), empty ? [] : [['original']], 'rejection changes no values');
    }
    const initial = Array.from({length: capacity}, (_, i) => `value-${i}`);
    const dc = arrowContainerFromTable(
      new arrow.Table({value: arrow.vectorFromArray(initial, type)})
    );
    const snapshot = dc.getTable();
    t.notOk(dc.append([['overflow']]), 'combined dictionary overflow is rejected');
    t.equal(dc.getTable(), snapshot, 'combined overflow is atomic');
  }
  t.end();
});

test('Arrow deletion preserves nested timestamp storage without decoding it', t => {
  const values = [1700000000000000123n, 1700000000000000456n, 1700000000000000789n];
  const time = arrow.makeVector({
    type: new arrow.TimestampNanosecond(),
    data: new BigInt64Array(values)
  });
  const type = new arrow.Struct([new arrow.Field('time', time.type, true)]);
  const nested = arrow.makeVector(arrow.makeData({type, length: 3, children: time.data}));
  const source = new arrow.Table({nested});
  const dc = arrowContainerFromTable(source);
  t.ok(dc.remove([1]), 'nested deletion succeeds');
  const raw = table =>
    Array.from(new arrow.Vector(table.getChildAt(0).data.map(data => data.children[0])).toArray());
  t.deepEqual(raw(dc.getTable()), [values[0], values[2]], 'nested raw values are exact');
  t.deepEqual(
    raw(arrow.tableFromIPC(arrow.tableToIPC(dc.getTable()))),
    [values[0], values[2]],
    'nested IPC is exact'
  );
  t.deepEqual(raw(source), values, 'original nested buffers are unchanged');
  t.end();
});

test('Arrow shared timestamp dictionaries preserve raw values and IPC after edits', t => {
  const type = new arrow.Dictionary(new arrow.TimestampNanosecond('UTC'), new arrow.Int8(), 17);
  const timestamp = arrow.makeVector({
    type: type.dictionary,
    data: new BigInt64Array([1700000000000000123n, 1700000000000000456n])
  });
  const data = arrow.makeData({type, data: new Int8Array([0, 1]), dictionary: timestamp});
  const column = arrow.makeVector(data);
  const source = new arrow.Table(
    new arrow.Schema(['left', 'right'].map(name => new arrow.Field(name, type, true))),
    {0: column, 1: column}
  );
  const dc = arrowContainerFromTable(source);
  t.ok(dc.append([[0, 1000]]), 'shared timestamp append succeeds');
  const ipc = arrow.tableFromIPC(arrow.tableToIPC(dc.getTable()));
  for (let i = 0; i < 2; i++) {
    const col = ipc.getChildAt(i);
    const raw = col.data.flatMap(chunk =>
      Array.from(
        chunk.values.slice(0, chunk.length),
        index => chunk.dictionary.data[0].values[index]
      )
    );
    t.deepEqual(
      raw,
      [1700000000000000123n, 1700000000000000456n, i ? 1000000000n : 0n],
      'shared dictionary keeps exact raw timestamp entries'
    );
  }
  t.equal(
    dc.getColumn(0).data[0].dictionary,
    dc.getColumn(1).data[0].dictionary,
    'output columns share the same dictionary'
  );
  t.doesNotThrow(() => arrow.tableToIPC(source), 'source dictionary stays serializable');
  t.end();
});

test('Arrow shared dictionaries retain differing physical index widths', t => {
  const dictionary = arrow.vectorFromArray(['a', 'b'], new arrow.Utf8());
  const columns = [new arrow.Int8(), new arrow.Int16()].map(indices =>
    arrow.makeVector({
      type: new arrow.Dictionary(dictionary.type, indices, 17),
      data: new indices.ArrayType([0, 1]),
      dictionary
    })
  );
  const source = new arrow.Table({narrow: columns[0], wide: columns[1]});
  const dc = arrowContainerFromTable(source);
  t.ok(dc.append([['c', 'd']]), 'mixed-width append succeeds');
  t.ok(dc.remove([0]), 'mixed-width deletion succeeds');
  const ipc = arrow.tableFromIPC(arrow.tableToIPC(dc.getTable()));
  t.deepEqual(Array.from(ipc.getChildAt(0)), ['b', 'c'], 'narrow values survive IPC');
  t.deepEqual(Array.from(ipc.getChildAt(1)), ['b', 'd'], 'wide values survive IPC');
  t.deepEqual(
    ipc.schema.fields.map(field => field.type.indices.bitWidth),
    [8, 16],
    'physical index widths are preserved'
  );
  t.equal(
    dc.getColumn(0).data[0].dictionary,
    dc.getColumn(1).data[0].dictionary,
    'both columns retain one shared dictionary'
  );
  t.deepEqual(Array.from(source.getChildAt(0)), ['a', 'b'], 'source stays unchanged');
  t.end();
});

test('Arrow deletion retains timestamp storage inside nested dictionaries', t => {
  const time = new arrow.TimestampNanosecond('UTC');
  const type = new arrow.List(new arrow.Field('item', time));
  const values = [1234567890123456789n, 1234567890123456791n];
  const dictionary = arrow.makeVector({
    type,
    valueOffsets: new Int32Array([0, 1, 2]),
    child: arrow.makeData({type: time, data: new BigInt64Array(values)})
  });
  const column = arrow.makeVector({
    type: new arrow.Dictionary(type, new arrow.Int8(), 17),
    data: new Int8Array([0, 1, 0, 1]),
    dictionary
  });
  const source = new arrow.Table({nested: column});
  const dc = arrowContainerFromTable(source);
  t.ok(dc.remove([1]), 'nested dictionary deletion succeeds');
  const ipc = arrow.tableFromIPC(arrow.tableToIPC(dc.getTable()));
  t.deepEqual(
    Array.from(ipc.getChildAt(0), value => value.toArray()[0]),
    [values[0], values[0], values[1]],
    'nested dictionary IPC keeps exact timestamp values'
  );
  t.deepEqual(
    Array.from(source.getChildAt(0), value => value.toArray()[0]),
    [values[0], values[1], values[0], values[1]],
    'source nested dictionary is unchanged'
  );
  t.end();
});
