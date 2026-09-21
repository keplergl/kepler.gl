// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import {crc32} from 'zlib';
import {
  getFilesToParse,
  getDroppedFileExtension,
  isShapefileSidecarFileName,
  processFileData,
  readFileInBatches,
  unzipShapefileArchive
} from '@kepler.gl/processors';

function createPointShapefileBuffers({x = -122.4, y = 37.8, name = 'alpha'} = {}) {
  const shp = new ArrayBuffer(128);
  const shpView = new DataView(shp);
  shpView.setInt32(0, 9994, false);
  shpView.setInt32(24, 64, false);
  shpView.setInt32(28, 1000, true);
  shpView.setInt32(32, 1, true);
  shpView.setFloat64(36, x, true);
  shpView.setFloat64(44, y, true);
  shpView.setFloat64(52, x, true);
  shpView.setFloat64(60, y, true);
  shpView.setInt32(100, 1, false);
  shpView.setInt32(104, 10, false);
  shpView.setInt32(108, 1, true);
  shpView.setFloat64(112, x, true);
  shpView.setFloat64(120, y, true);

  const shx = new ArrayBuffer(108);
  const shxView = new DataView(shx);
  shxView.setInt32(0, 9994, false);
  shxView.setInt32(24, 54, false);
  shxView.setInt32(28, 1000, true);
  shxView.setInt32(32, 1, true);
  shxView.setFloat64(36, x, true);
  shxView.setFloat64(44, y, true);
  shxView.setFloat64(52, x, true);
  shxView.setFloat64(60, y, true);
  shxView.setInt32(100, 50, false);
  shxView.setInt32(104, 10, false);

  const fieldLen = 10;
  const headerLen = 65;
  const recordLen = 1 + fieldLen;
  const dbf = new ArrayBuffer(headerLen + recordLen);
  const dbfBytes = new Uint8Array(dbf);
  const dbfView = new DataView(dbf);
  dbfBytes[0] = 0x03;
  dbfBytes[1] = 124;
  dbfBytes[2] = 1;
  dbfBytes[3] = 1;
  dbfView.setUint32(4, 1, true);
  dbfView.setUint16(8, headerLen, true);
  dbfView.setUint16(10, recordLen, true);
  const fieldName = 'NAME';
  for (let i = 0; i < fieldName.length; i++) {
    dbfBytes[32 + i] = fieldName.charCodeAt(i);
  }
  dbfBytes[32 + 11] = 0x43;
  dbfBytes[32 + 16] = fieldLen;
  dbfBytes[64] = 0x0d;
  dbfBytes[65] = 0x20;
  const nameBytes = new TextEncoder().encode(name);
  for (let i = 0; i < fieldLen; i++) {
    dbfBytes[66 + i] = i < nameBytes.length ? nameBytes[i] : 0x20;
  }

  return {shp, shx, dbf};
}

function createStoredZip(files) {
  const locals = [];
  const centrals = [];
  let offset = 0;

  for (const file of files) {
    const nameBuf = Buffer.from(file.name);
    const data = Buffer.from(file.data);
    const crc = crc32(data);
    const local = Buffer.alloc(30 + nameBuf.length);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt32LE(crc >>> 0, 14);
    local.writeUInt32LE(data.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(nameBuf.length, 26);
    nameBuf.copy(local, 30);
    locals.push(local, data);

    const central = Buffer.alloc(46 + nameBuf.length);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt32LE(crc >>> 0, 16);
    central.writeUInt32LE(data.length, 20);
    central.writeUInt32LE(data.length, 24);
    central.writeUInt16LE(nameBuf.length, 28);
    central.writeUInt32LE(offset, 42);
    nameBuf.copy(central, 46);
    centrals.push(central);
    offset += local.length + data.length;
  }

  const centralBuf = Buffer.concat(centrals);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(files.length, 8);
  end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(centralBuf.length, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...locals, centralBuf, end]);
}

async function readLastBatch(file, companionFiles) {
  const generator = await readFileInBatches({
    file,
    fileCache: [],
    loaders: [],
    loadOptions: {},
    companionFiles
  });
  let last;
  for await (const batch of generator) {
    last = batch;
  }
  return last;
}

test('#shapefile-files -> sidecar helpers', t => {
  t.equal(getDroppedFileExtension('places.SHP'), 'shp');
  t.ok(isShapefileSidecarFileName('places.dbf'));
  t.ok(isShapefileSidecarFileName('places.prj'));
  t.notOk(isShapefileSidecarFileName('places.shp'));
  t.notOk(isShapefileSidecarFileName('places.csv'));
  t.end();
});

test('#shapefile-files -> getFilesToParse skips sidecars when a shapefile is present', t => {
  const files = [
    {name: 'places.shp'},
    {name: 'places.dbf'},
    {name: 'places.shx'},
    {name: 'extra.csv'}
  ];
  t.deepEqual(
    getFilesToParse(files).map(file => file.name),
    ['places.shp', 'extra.csv'],
    'should parse the shapefile and other datasets, not sidecars'
  );
  t.deepEqual(
    getFilesToParse([{name: 'places.dbf'}, {name: 'places.csv'}]).map(file => file.name),
    ['places.dbf', 'places.csv'],
    'sidecars stay in the queue when no shapefile source is present'
  );
  t.deepEqual(
    getFilesToParse([{name: 'places.zip'}, {name: 'places.prj'}]).map(file => file.name),
    ['places.zip'],
    'a shapefile zip is a source file and its sidecars are skipped'
  );
  t.end();
});

test('#shapefile-files -> unzipShapefileArchive reads top-level shapefile files', async t => {
  const {shp, shx, dbf} = createPointShapefileBuffers();
  const zip = createStoredZip([
    {name: 'places.shp', data: Buffer.from(shp)},
    {name: 'places.shx', data: Buffer.from(shx)},
    {name: 'places.dbf', data: Buffer.from(dbf)},
    {name: 'nested/ignore.shp', data: Buffer.from(shp)}
  ]);
  const files = await unzipShapefileArchive(new File([zip], 'places.zip'));
  t.deepEqual(
    files.map(file => file.name).sort(),
    ['places.dbf', 'places.shp', 'places.shx'],
    'should keep top-level shapefile members and ignore nested folders'
  );
  t.end();
});

test('#shapefile-files -> shapefile with sidecars becomes a GeoJSON dataset', async t => {
  const {shp, shx, dbf} = createPointShapefileBuffers();
  const shapefile = new File([shp], 'places.shp');
  const companions = [shapefile, new File([shx], 'places.shx'), new File([dbf], 'places.dbf')];
  const batch = await readLastBatch(shapefile, companions);
  const processed = await processFileData({content: batch, fileCache: []});

  t.equal(processed[0].info.format, 'geojson', 'shapefile should process as geojson');
  t.equal(processed[0].data.rows.length, 1, 'should keep the shapefile feature');
  const nameField = processed[0].data.fields.findIndex(field => field.name === 'NAME');
  t.ok(nameField >= 0, 'should include the DBF NAME field');
  t.equal(
    String(processed[0].data.rows[0][nameField]).trim(),
    'alpha',
    'should read DBF attributes'
  );
  t.end();
});

test('#shapefile-files -> shapefile zip unpacks before parse', async t => {
  const {shp, shx, dbf} = createPointShapefileBuffers();
  const zip = createStoredZip([
    {name: 'places.shp', data: Buffer.from(shp)},
    {name: 'places.shx', data: Buffer.from(shx)},
    {name: 'places.dbf', data: Buffer.from(dbf)}
  ]);
  const batch = await readLastBatch(new File([zip], 'places.zip'));
  const processed = await processFileData({content: batch, fileCache: []});

  t.equal(batch.fileName, 'places.zip', 'batches should keep the original zip name for progress');
  t.equal(processed[0].info.format, 'geojson', 'shapefile zip should process as geojson');
  t.equal(processed[0].info.label, 'places.zip', 'the dataset label should stay the zip name');
  t.equal(processed[0].data.rows.length, 1, 'should keep the unzipped shapefile feature');
  t.end();
});
