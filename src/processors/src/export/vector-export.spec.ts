// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {convertWKBToGeometry} from '@loaders.gl/gis';
import {convertArrowToSchema} from '@loaders.gl/schema-utils';
import {ALL_FIELD_TYPES, EXPORT_DATA_TYPE} from '@kepler.gl/constants';
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

  test.each([
    {
      dimension: '2D',
      altitudes: [null, ''],
      expectedZ: 0,
      expectedCoordinates: [
        [-122.4, 37.8],
        [-122.41, 37.81]
      ]
    },
    {
      dimension: '3D',
      altitudes: [12, 24],
      expectedZ: 1,
      expectedCoordinates: [
        [-122.4, 37.8, 12],
        [-122.41, 37.81, 24]
      ]
    },
    {
      dimension: 'mixed 2D and 3D',
      altitudes: [12, null],
      expectedZ: 2,
      expectedCoordinates: [
        [-122.4, 37.8, 12],
        [-122.41, 37.81]
      ]
    }
  ])(
    'writes $dimension GeoPackage points with matching Z metadata',
    async ({altitudes, expectedZ, expectedCoordinates}) => {
      const altitudeFields = [
        ...fields,
        {name: 'altitude', type: ALL_FIELD_TYPES.real}
      ] as Field[];
      const altitudeFieldPairs = [
        {
          defaultName: 'point',
          pair: {
            lat: {fieldIdx: 2, value: 'lat'},
            lng: {fieldIdx: 3, value: 'lng'},
            altitude: {fieldIdx: 4, value: 'altitude'}
          },
          suffix: ['lat', 'lng', 'altitude']
        }
      ];
      const altitudeRows = rows.map((row, index) => [...row, altitudes[index]]);
      const geopackage = await encodeDatasetExport({
        data: createDataContainer(altitudeRows),
        fields: altitudeFields,
        fieldPairs: altitudeFieldPairs,
        dataType: EXPORT_DATA_TYPE.GEOPACKAGE,
        layerName: 'places'
      });
      const SQL = await loadSqlJs();
      const db = new SQL.Database(new Uint8Array(geopackage.data as Uint8Array));
      try {
        const z = db.exec('SELECT z FROM gpkg_geometry_columns')[0].values[0][0];
        const coordinates = db.exec('SELECT geom FROM places ORDER BY fid')[0].values.map(row => {
          const blob = row[0] as Uint8Array;
          const geometry = convertWKBToGeometry(blob.slice(8).buffer);
          return geometry.type === 'Point' ? geometry.coordinates : null;
        });
        expect({z, coordinates}).toEqual({z: expectedZ, coordinates: expectedCoordinates});
      } finally {
        db.close();
      }
    }
  );

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

  test('writes typed integer fields without reclassifying integer-valued real fields', async () => {
    const typedFields = [
      {name: 'count', type: ALL_FIELD_TYPES.integer},
      {name: 'measurement', type: ALL_FIELD_TYPES.real},
      {name: 'unsafe_count', type: ALL_FIELD_TYPES.integer},
      {name: 'out_of_range_count', type: ALL_FIELD_TYPES.integer},
      {name: 'lat', type: ALL_FIELD_TYPES.real},
      {name: 'lng', type: ALL_FIELD_TYPES.real}
    ] as Field[];
    const typedRows = [
      [1, 1, Number.MAX_SAFE_INTEGER + 1, 9223372036854775808n, 37.8, -122.4],
      [null, 2, null, null, 37.81, -122.41],
      [2147483648, 3, null, null, 37.82, -122.42],
      [Number.MAX_SAFE_INTEGER, 4, null, null, 37.83, -122.43]
    ];
    const geoparquet = await encodeDatasetExport({
      data: createDataContainer(typedRows),
      fields: typedFields,
      fieldPairs: [
        {
          defaultName: 'point',
          pair: {
            lat: {fieldIdx: 4, value: 'lat'},
            lng: {fieldIdx: 5, value: 'lng'}
          },
          suffix: ['lat', 'lng']
        }
      ],
      dataType: EXPORT_DATA_TYPE.GEOPARQUET,
      layerName: 'typed-numbers'
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

    const count = arrowTable.getChild('count');
    expect(String(count?.type)).toBe('Int64');
    expect(Array.from({length: count?.length ?? 0}, (_, index) => count?.get(index))).toEqual([
      1n,
      null,
      2147483648n,
      BigInt(Number.MAX_SAFE_INTEGER)
    ]);
    expect(String(arrowTable.getChild('measurement')?.type)).toBe('Float64');
    expect(String(arrowTable.getChild('unsafe_count')?.type)).toBe('Float64');
    expect(String(arrowTable.getChild('out_of_range_count')?.type)).toBe('Utf8');
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
