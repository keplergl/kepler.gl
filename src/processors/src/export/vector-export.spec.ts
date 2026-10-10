// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {convertArrowToSchema} from '@loaders.gl/schema-utils';
import {ALL_FIELD_TYPES, EXPORT_DATA_TYPE} from '@kepler.gl/constants';
import {formatCsv} from '@kepler.gl/reducers';
import {Field} from '@kepler.gl/types';
import {createDataContainer} from '@kepler.gl/utils';
import {tableFromIPC} from 'apache-arrow';

import {datasetToFeatureCollection, encodeDatasetExport} from './vector-export';
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

    const csv = formatCsv(container(), fields, ['secret']);
    expect(csv).toContain('Harbor');
    expect(csv).not.toContain('hidden-value');
    expect(csv).not.toContain('secret');
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
