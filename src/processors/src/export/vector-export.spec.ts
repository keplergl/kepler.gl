// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {convertArrowToSchema} from '@loaders.gl/schema-utils';
import {DBFLoader} from '@loaders.gl/shapefile';
import {ALL_FIELD_TYPES, EXPORT_DATA_TYPE} from '@kepler.gl/constants';
import {Field} from '@kepler.gl/types';
import {createDataContainer} from '@kepler.gl/utils';
import {tableFromIPC} from 'apache-arrow';
import type {FeatureCollection} from 'geojson';

import {datasetToFeatureCollection, encodeDatasetExport} from './vector-export';
import {writeShapefile} from './shapefile-writer';
import {loadSqlJs} from './sql-js';

const fields = [
  {name: 'name', type: ALL_FIELD_TYPES.string},
  {name: 'secret', type: ALL_FIELD_TYPES.string},
  {name: 'lat', type: ALL_FIELD_TYPES.real},
  {name: 'lng', type: ALL_FIELD_TYPES.real}
] as Field[];

const rows = [
  ['Harbor', 'hidden-value', 37.8, -122.4],
  ['Pier', 'also-hidden', 37.81, -122.41]
];

const fieldPairs = [
  {
    defaultName: 'point',
    pair: {
      lat: {fieldIdx: 2, value: 'lat'},
      lng: {fieldIdx: 3, value: 'lng'}
    },
    suffix: ['lat', 'lng']
  }
];

function container() {
  return createDataContainer(rows);
}

describe('dataset export', () => {
  test('omits columns hidden in the attribute table', () => {
    const collection = datasetToFeatureCollection(container(), fields, {
      hiddenColumns: ['secret'],
      fieldPairs
    });

    expect(collection.features).toHaveLength(2);
    expect(collection.features[0].geometry).toEqual({
      type: 'Point',
      coordinates: [-122.4, 37.8]
    });
    expect(collection.features[0].properties).toEqual({
      name: 'Harbor',
      lat: 37.8,
      lng: -122.4
    });
    expect(collection.features[0].properties).not.toHaveProperty('secret');
  });

  test('writes geojson, kml, kmz, shapefile, geopackage, and geoparquet', async () => {
    const shared = {
      data: container(),
      fields,
      fieldPairs,
      hiddenColumns: ['secret'],
      layerName: 'places'
    };

    const geojson = await encodeDatasetExport({...shared, dataType: EXPORT_DATA_TYPE.GEOJSON});
    const parsed = JSON.parse(String(geojson.data));
    expect(parsed.features[1].properties.name).toBe('Pier');
    expect(parsed.features[1].properties.secret).toBeUndefined();
    expect(geojson.extension).toBe('geojson');

    const kml = await encodeDatasetExport({...shared, dataType: EXPORT_DATA_TYPE.KML});
    expect(String(kml.data)).toContain('<coordinates>-122.4,37.8</coordinates>');
    expect(String(kml.data)).not.toContain('hidden-value');

    const kmz = await encodeDatasetExport({...shared, dataType: EXPORT_DATA_TYPE.KMZ});
    expect(Buffer.from(kmz.data as Uint8Array).includes(Buffer.from('doc.kml'))).toBe(true);

    const shapefile = await encodeDatasetExport({
      ...shared,
      dataType: EXPORT_DATA_TYPE.SHAPEFILE
    });
    const shapefileBytes = Buffer.from(shapefile.data as Uint8Array);
    expect(shapefile.extension).toBe('zip');
    expect(shapefileBytes.includes(Buffer.from('places.shp'))).toBe(true);
    expect(shapefileBytes.includes(Buffer.from('places.dbf'))).toBe(true);
    expect(shapefileBytes.includes(Buffer.from('hidden-value'))).toBe(false);

    const geopackage = await encodeDatasetExport({
      ...shared,
      dataType: EXPORT_DATA_TYPE.GEOPACKAGE
    });
    const SQL = await loadSqlJs();
    const db = new SQL.Database(new Uint8Array(geopackage.data as Uint8Array));
    const exported = db.exec('SELECT name FROM places');
    expect(exported[0].values.map(row => row[0])).toEqual(['Harbor', 'Pier']);
    const columns = db.exec('PRAGMA table_info(places)');
    const columnNames = columns[0].values.map(row => row[1]);
    expect(columnNames).not.toContain('secret');
    db.close();

    const geoparquet = await encodeDatasetExport({
      ...shared,
      dataType: EXPORT_DATA_TYPE.GEOPARQUET
    });
    const parquetBytes = Buffer.from(geoparquet.data as Uint8Array);
    expect(parquetBytes.subarray(0, 4).toString()).toBe('PAR1');
    expect(parquetBytes.includes(Buffer.from('"encoding":"WKB"'))).toBe(true);
    expect(parquetBytes.includes(Buffer.from('hidden-value'))).toBe(false);
  });

  test('rejects mixed geometry families when exporting a shapefile', async () => {
    const geometryFields = [
      {name: '_geojson', type: ALL_FIELD_TYPES.geojson},
      {name: 'label', type: ALL_FIELD_TYPES.string}
    ] as Field[];
    const geometryRows = [
      [{type: 'Point', coordinates: [0, 0]}, 'point'],
      [
        {
          type: 'LineString',
          coordinates: [
            [0, 0],
            [1, 1]
          ]
        },
        'line'
      ]
    ];

    await expect(
      encodeDatasetExport({
        data: createDataContainer(geometryRows),
        fields: geometryFields,
        dataType: EXPORT_DATA_TYPE.SHAPEFILE,
        layerName: 'mixed'
      })
    ).rejects.toThrow('Shapefile export requires all geometries to have the same shape family.');
  });

  test('rounds noisy and tiny DBF numbers at the maximum supported precision', () => {
    const values = [0.1 + 0.2, 1e-7, -1e-7, 1e-16, -1e-16, null];
    const collection: FeatureCollection = {
      type: 'FeatureCollection',
      features: values.map((value, index) => ({
        type: 'Feature',
        geometry: {type: 'Point', coordinates: [index, index]},
        properties: {value}
      }))
    };

    const {dbf} = writeShapefile(collection);
    const view = new DataView(dbf.buffer, dbf.byteOffset, dbf.byteLength);
    const headerLength = view.getUint16(8, true);
    const recordLength = view.getUint16(10, true);
    const fieldLength = dbf[32 + 16];
    const decimalCount = dbf[32 + 17];
    const decoder = new TextDecoder();
    const cells = values.map((_, index) => {
      const start = headerLength + index * recordLength + 1;
      return decoder.decode(dbf.subarray(start, start + fieldLength)).trim();
    });

    expect({fieldLength, decimalCount}).toEqual({fieldLength: 18, decimalCount: 15});
    expect(cells).toEqual([
      '0.300000000000000',
      '0.000000100000000',
      '-0.000000100000000',
      '0.000000000000000',
      '0.000000000000000',
      ''
    ]);
    expect(cells.filter(Boolean).every(cell => /^-?\d+(?:\.\d+)?$/.test(cell))).toBe(true);

    const parsed = DBFLoader.parseSync?.(dbf.buffer as ArrayBuffer, {
      dbf: {shape: 'rows'}
    }) as Array<{value: number | null}>;
    expect(parsed.map(row => row.value)).toEqual([0.3, 1e-7, -1e-7, 0, 0, null]);
  });

  test('uses the highest common precision that fits mixed magnitudes after rounding', () => {
    const values = [-1234567890123456, 999.9999, -12.3456, null];
    const collection: FeatureCollection = {
      type: 'FeatureCollection',
      features: values.map((value, index) => ({
        type: 'Feature',
        geometry: {type: 'Point', coordinates: [index, index]},
        properties: {value}
      }))
    };

    const {dbf} = writeShapefile(collection);
    const view = new DataView(dbf.buffer, dbf.byteOffset, dbf.byteLength);
    const headerLength = view.getUint16(8, true);
    const recordLength = view.getUint16(10, true);
    const fieldLength = dbf[32 + 16];
    const decimalCount = dbf[32 + 17];
    const decoder = new TextDecoder();
    const cells = values.map((_, index) => {
      const start = headerLength + index * recordLength + 1;
      return decoder.decode(dbf.subarray(start, start + fieldLength)).trim();
    });

    expect({fieldLength, decimalCount}).toEqual({fieldLength: 19, decimalCount: 1});
    expect(cells).toEqual(['-1234567890123456.0', '1000.0', '-12.3', '']);

    const parsed = DBFLoader.parseSync?.(dbf.buffer as ArrayBuffer, {
      dbf: {shape: 'rows'}
    }) as Array<{value: number | null}>;
    expect(parsed.map(row => row.value)).toEqual([-1234567890123456, 1000, -12.3, null]);
  });

  test('keeps large positive and negative integers in numeric fields', () => {
    const values = [1e18, -1e17, null];
    const collection: FeatureCollection = {
      type: 'FeatureCollection',
      features: values.map((value, index) => ({
        type: 'Feature',
        geometry: {type: 'Point', coordinates: [index, index]},
        properties: {value}
      }))
    };

    const {dbf} = writeShapefile(collection);
    const view = new DataView(dbf.buffer, dbf.byteOffset, dbf.byteLength);
    const headerLength = view.getUint16(8, true);
    const recordLength = view.getUint16(10, true);
    const fieldLength = dbf[32 + 16];
    const decimalCount = dbf[32 + 17];
    const decoder = new TextDecoder();
    const cells = values.map((_, index) => {
      const start = headerLength + index * recordLength + 1;
      return decoder.decode(dbf.subarray(start, start + fieldLength)).trim();
    });

    expect({fieldLength, decimalCount}).toEqual({fieldLength: 19, decimalCount: 0});
    expect(cells).toEqual(['1000000000000000000', '-100000000000000000', '']);
  });

  test.each([
    [1e19, 20],
    [-1e18, 20],
    [1e21, 22]
  ])('rejects the DBF number %s when its rounded integer needs %i bytes', (value, width) => {
    const collection: FeatureCollection = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {type: 'Point', coordinates: [0, 0]},
          properties: {value}
        }
      ]
    };

    expect(() => writeShapefile(collection)).toThrow(
      `DBF numeric field "value" requires ${width} bytes at zero decimal places; ` +
        'dBASE III numeric fields support at most 19.'
    );
  });

  test('keeps mixed finite and non-finite values in a DBF text field', () => {
    const values = [1, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, null];
    const collection: FeatureCollection = {
      type: 'FeatureCollection',
      features: values.map((value, index) => ({
        type: 'Feature',
        geometry: {type: 'Point', coordinates: [index, index]},
        properties: {value}
      }))
    };

    const {dbf} = writeShapefile(collection);
    const view = new DataView(dbf.buffer, dbf.byteOffset, dbf.byteLength);
    const headerLength = view.getUint16(8, true);
    const recordLength = view.getUint16(10, true);
    const fieldLength = dbf[32 + 16];
    const decoder = new TextDecoder();
    const cells = values.map((_, index) => {
      const start = headerLength + index * recordLength + 1;
      return decoder.decode(dbf.subarray(start, start + fieldLength)).trim();
    });

    expect(String.fromCharCode(dbf[32 + 11])).toBe('C');
    expect(cells).toEqual(['1', 'NaN', 'Infinity', '-Infinity', '']);
  });

  test('writes geoparquet string columns the importer can read', async () => {
    const geoparquet = await encodeDatasetExport({
      data: container(),
      fields,
      fieldPairs,
      dataType: EXPORT_DATA_TYPE.GEOPARQUET,
      layerName: 'places'
    });
    const specifier = 'parquet-wasm/node';
    const imported = (await import(specifier)) as {
      readParquet?: (bytes: Uint8Array) => {intoIPCStream(): Uint8Array};
      default?: {readParquet: (bytes: Uint8Array) => {intoIPCStream(): Uint8Array}};
    };
    const api = imported.readParquet ? imported : imported.default;
    if (!api?.readParquet) {
      throw new Error('parquet-wasm failed to load');
    }
    const wasmTable = api.readParquet(new Uint8Array(geoparquet.data as Uint8Array));
    const arrowTable = tableFromIPC(wasmTable.intoIPCStream());

    expect(arrowTable.getChild('name')?.toArray()).toEqual(['Harbor', 'Pier']);
    expect(arrowTable.getChild('geometry')?.get(0)).toBeInstanceOf(Uint8Array);
    const schema = convertArrowToSchema(arrowTable.schema);
    expect(schema.fields.find(field => field.name === 'geometry')?.type).toBe('binary');
    expect(schema.fields.find(field => field.name === 'name')?.type).toBe('utf8');
  });

  test.each(['gpkg_contents', 'gpkg_geometry_columns', 'sqlite_sequence'])(
    'sanitizes the reserved GeoPackage layer name %s',
    async layerName => {
      const geopackage = await encodeDatasetExport({
        data: container(),
        fields,
        fieldPairs,
        dataType: EXPORT_DATA_TYPE.GEOPACKAGE,
        layerName
      });
      const SQL = await loadSqlJs();
      const db = new SQL.Database(new Uint8Array(geopackage.data as Uint8Array));
      try {
        const contents = db.exec('SELECT table_name FROM gpkg_contents');
        const exportedTable = String(contents[0].values[0][0]);
        expect(exportedTable).not.toBe(layerName);
        expect(exportedTable).not.toMatch(/^sqlite_/i);
        expect(db.exec(`SELECT COUNT(*) FROM "${exportedTable}"`)[0].values[0][0]).toBe(2);
      } finally {
        db.close();
      }
    }
  );

  test('uses a geojson column as feature geometry and drops it from properties', async () => {
    const polygon = {
      type: 'Polygon',
      coordinates: [
        [
          [0, 0],
          [1, 0],
          [1, 1],
          [0, 1],
          [0, 0]
        ]
      ]
    };
    const geoFields = [
      {name: '_geojson', type: ALL_FIELD_TYPES.geojson},
      {name: 'label', type: ALL_FIELD_TYPES.string}
    ] as Field[];
    const geoRows = [[polygon, 'block']];
    const collection = datasetToFeatureCollection(createDataContainer(geoRows), geoFields);

    expect(collection.features[0].geometry).toEqual(polygon);
    expect(collection.features[0].properties).toEqual({label: 'block'});
  });
});
