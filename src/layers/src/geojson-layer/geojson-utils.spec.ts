// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Feature, Geometry} from 'geojson';
import {convertGeometryToWKB} from '@loaders.gl/gis';
import {GeoJsonLayer as DeckGLGeoJsonLayer} from '@deck.gl/layers';
import {GEOARROW_EXTENSIONS} from '@kepler.gl/constants';
import {GEOARROW_METADATA_KEY} from '@kepler.gl/constants';
import {KeplerTable, copyTableAndUpdate} from '@kepler.gl/table';
import {ArrowDataContainer, createDataContainer} from '@kepler.gl/utils';
import {processFileData} from '@kepler.gl/processors';
import * as arrow from 'apache-arrow';
import GeoJsonLayer from './geojson-layer';
import GridLayer from '../grid-layer/grid-layer';
import HexagonLayer from '../hexagon-layer/hexagon-layer';
import ClusterLayer from '../cluster-layer/cluster-layer';
import HeatmapLayer from '../heatmap-layer/heatmap-layer';
import ScenegraphLayer from '../scenegraph-layer/scenegraph-layer';
import {
  featureToHoverOutline,
  getAllPositions,
  getCentroidFromGeometry,
  parseGeoJsonRawFeature,
  getGeojsonFeatureTypes,
  getGeojsonBounds,
  groupColumnsAsGeoJson
} from './geojson-utils';

describe('GeoJSON coordinates', () => {
  test.each([
    {coordinates: [null, null]},
    {coordinates: [null, 20]},
    {coordinates: [10, null]},
    {coordinates: [undefined, 20]},
    {coordinates: [10]},
    {coordinates: []},
    {coordinates: null},
    {coordinates: [NaN, 20]},
    {coordinates: [10, Infinity]}
  ])('excludes missing or nonfinite coordinates: $coordinates', ({coordinates}) => {
    const geometry = {type: 'Point', coordinates};
    expect(getAllPositions(geometry)).toEqual([]);
    expect(getCentroidFromGeometry(geometry)).toBeNull();
  });

  test('keeps zero, numeric strings and typed coordinates when collecting nested positions', () => {
    const geometry = {
      type: 'GeometryCollection',
      geometries: [
        {type: 'Point', coordinates: [0, 0]},
        {type: 'Point', coordinates: ['0', '20']},
        {type: 'Point', coordinates: new Float64Array([10, 0])},
        {
          type: 'LineString',
          coordinates: [
            [null, null],
            [10, null],
            [null, 20],
            [10, 20]
          ]
        }
      ]
    };
    expect(getAllPositions(geometry)).toEqual([
      [0, 0],
      [0, 20],
      [10, 0],
      [10, 20]
    ]);
    expect(getCentroidFromGeometry(geometry)).toEqual([5, 10]);
  });

  describe.each([
    {name: 'Grid', LayerClass: GridLayer},
    {name: 'Hexbin', LayerClass: HexagonLayer},
    {name: 'Cluster', LayerClass: ClusterLayer},
    {name: 'Heatmap', LayerClass: HeatmapLayer},
    {name: '3D', LayerClass: ScenegraphLayer}
  ])('$name rendering', ({LayerClass}) => {
    test.each(['rows', 'multi-batch Arrow'])(
      'excludes missing coordinates and keeps zero coordinates from %s in 2D and globe',
      async storage => {
        const coordinates = [
          [null, null],
          [null, 20],
          [10, null],
          null,
          [],
          [10],
          [0, 0],
          [0, 20],
          [10, 0],
          [10, 20]
        ];
        const values = coordinates.map(value =>
          JSON.stringify({type: 'Point', coordinates: value})
        );
        const dataset = new KeplerTable({info: {id: 'coordinates'}, color: [0, 0, 0]}).updateSchema(
          {
            fields: [{name: 'geometry', type: 'geojson', analyzerType: 'GEOMETRY'}],
            rows: storage === 'rows' ? values.map(value => [value]) : [],
            ...(storage === 'rows'
              ? {}
              : {
                  cols: [arrow.vectorFromArray(values.slice(0, 5), new arrow.Utf8())]
                })
          }
        );
        if (storage !== 'rows') {
          const table = new arrow.Table({
            geometry: arrow.vectorFromArray(values.slice(0, 5), new arrow.Utf8())
          }).concat(
            new arrow.Table({
              geometry: arrow.vectorFromArray(values.slice(5), new arrow.Utf8())
            })
          );
          // Progressive updates retain batches, while completed imports compact them.
          await dataset.update({
            fields: dataset.fields,
            rows: [],
            cols: [table.getChildAt(0)],
            arrowTable: table
          });
          expect((dataset.dataContainer as ArrowDataContainer).getTable().batches).toHaveLength(2);
        }
        const layer: any = new LayerClass({
          dataId: dataset.id,
          columnMode: 'geojson',
          columns: {geojson: {value: 'geometry', fieldIdx: 0}}
        });
        const data = layer.formatLayerData({[dataset.id]: dataset}, {});
        for (const globe of [false, true]) {
          const [rendered] = layer.renderLayer({
            data,
            gpuFilter: dataset.gpuFilter,
            idx: 0,
            visible: true,
            layerCallbacks: {},
            mapState: {zoom: 4, width: 800, height: 600, globe: {enabled: globe}}
          });
          expect(rendered.props.data.map(row => row.index)).toEqual([6, 7, 8, 9]);
          expect(
            rendered.props.data.map(row => rendered.props.getPosition(row).slice(0, 2))
          ).toEqual([
            [0, 0],
            [0, 20],
            [10, 0],
            [10, 20]
          ]);
        }
        expect(layer.centroids.slice(0, 6)).toEqual([null, null, null, null, null, null]);
        expect(layer.meta.bounds).toEqual([0, 0, 10, 20]);
      }
    );
  });
});

// Exercise deck.gl's real data conversion without creating a WebGL context.
function renderGeojsonFeatures(data: Feature[]) {
  const layer = new DeckGLGeoJsonLayer({data});
  layer.initializeState();
  jest.spyOn(layer, 'setState').mockImplementation(update => {
    Object.assign(layer.state, update);
  });
  layer.updateState({
    props: layer.props,
    oldProps: layer.props,
    context: layer.context,
    changeFlags: {
      dataChanged: 'initial data',
      propsChanged: false,
      updateTriggersChanged: false,
      extensionsChanged: false,
      viewportChanged: false,
      stateChanged: false,
      propsOrDataChanged: true,
      somethingChanged: true
    }
  });
  return layer.state.features;
}

describe('WKB GeometryCollection', () => {
  test.each([null, {}, 'invalid'])(
    'ignores malformed collection members in geometry-type metadata (%j)',
    geometries => {
      expect(
        getGeojsonFeatureTypes([
          {
            type: 'Feature',
            properties: {},
            geometry: {type: 'GeometryCollection', geometries}
          } as any
        ])
      ).toEqual({});
    }
  );
  const geometry: Geometry = {
    type: 'GeometryCollection',
    geometries: [
      {type: 'Point', coordinates: [1, 2]},
      {
        type: 'GeometryCollection',
        geometries: [
          {
            type: 'LineString',
            coordinates: [
              [3, 4],
              [5, 6]
            ]
          },
          {type: 'GeometryCollection', geometries: []}
        ]
      }
    ]
  };
  const bytes = () => new Uint8Array(convertGeometryToWKB(geometry));

  test.each(['bytes', 'buffer', 'hex', 'offset view', 'GeoArrow'])(
    'preserves nested and empty collections from %s',
    format => {
      const wkb = bytes();
      const padded = new Uint8Array(wkb.length + 8);
      padded.set(wkb, 4);
      const value =
        format === 'hex'
          ? Buffer.from(wkb).toString('hex')
          : format === 'buffer'
          ? wkb.buffer
          : format === 'offset view'
          ? padded.subarray(4, -4)
          : wkb;
      expect(
        parseGeoJsonRawFeature(value, format === 'GeoArrow' ? GEOARROW_EXTENSIONS.WKB : undefined)
          ?.geometry
      ).toEqual(geometry);
    }
  );

  test('accepts a big-endian collection header and SRID metadata', () => {
    const littleEndian = bytes();
    const bigEndian = littleEndian.slice();
    const view = new DataView(bigEndian.buffer);
    view.setUint8(0, 0);
    view.setUint32(1, 7, false);
    view.setUint32(5, 2, false);
    expect(parseGeoJsonRawFeature(bigEndian)?.geometry).toEqual(geometry);

    const ewkb = new Uint8Array(littleEndian.length + 4);
    ewkb.set(littleEndian.subarray(0, 5));
    ewkb.set(littleEndian.subarray(5), 9);
    const ewkbView = new DataView(ewkb.buffer);
    ewkbView.setUint32(1, 0x20000007, true);
    ewkbView.setUint32(5, 4326, true);
    expect(parseGeoJsonRawFeature(ewkb)?.geometry).toEqual(geometry);
  });

  test('rejects malformed or excessively nested collections without throwing', () => {
    const wkb = bytes();
    const badOrder = wkb.slice();
    badOrder[0] = 2;
    const badCount = wkb.slice();
    new DataView(badCount.buffer).setUint32(5, 0xffffffff, true);
    const extra = new Uint8Array(wkb.length + 1);
    extra.set(wkb);
    let deep: Geometry = {type: 'Point', coordinates: [1, 2]};
    for (let i = 0; i < 40; i++) deep = {type: 'GeometryCollection', geometries: [deep]};
    for (const value of [
      new Uint8Array(),
      wkb.subarray(0, 8),
      wkb.subarray(0, -1),
      badOrder,
      badCount,
      extra,
      new Uint8Array(convertGeometryToWKB(deep))
    ]) {
      expect(() => parseGeoJsonRawFeature(value)).not.toThrow();
      expect(parseGeoJsonRawFeature(value)).toBeNull();
    }
  });

  test.each(['Arrow hex', 'Arrow WKB', 'GeoParquet'])(
    'imports collections through %s with row IDs, hover, filters and cache reuse',
    async format => {
      const point: Geometry = {type: 'Point', coordinates: [50, 60]};
      const values = [geometry, point].map(value => new Uint8Array(convertGeometryToWKB(value)));
      let table = new arrow.Table({
        _geojson:
          format === 'Arrow hex'
            ? arrow.vectorFromArray(
                values.map(value => Buffer.from(value).toString('hex')),
                new arrow.Utf8()
              )
            : arrow.vectorFromArray(values, new arrow.Binary()),
        label: arrow.vectorFromArray(['collection', 'point'], new arrow.Utf8())
      });
      if (format === 'Arrow WKB')
        table.schema.fields[0].metadata.set(GEOARROW_METADATA_KEY, GEOARROW_EXTENSIONS.WKB);
      if (format === 'GeoParquet') {
        table.schema.metadata.set(
          'geo',
          JSON.stringify({
            version: '1.1.0',
            primary_column: '_geojson',
            columns: {_geojson: {encoding: 'WKB'}}
          })
        );
        const specifier = 'parquet-wasm/node';
        const imported = await import(specifier);
        const wasm = imported.readParquet ? imported : imported.default;
        const properties = new wasm.WriterPropertiesBuilder()
          .setKeyValueMetadata(table.schema.metadata)
          .build();
        const parquet = wasm.writeParquet(
          wasm.Table.fromIPCStream(arrow.tableToIPC(table, 'stream')),
          properties
        );
        table = arrow.tableFromIPC(wasm.readParquet(parquet).intoIPCStream());
      } else table = arrow.tableFromIPC(arrow.tableToIPC(table, 'stream'));
      const [file] = await processFileData({
        content: {
          fileName: format === 'GeoParquet' ? 'collections.parquet' : 'collections.arrow',
          data: table.batches
        },
        fileCache: []
      } as any);
      const dataset = new KeplerTable({info: file.info, color: [0, 0, 0]});
      await dataset.importData({data: file.data as any});
      const {props} = GeoJsonLayer.findDefaultLayerProps(dataset);
      expect(props).toHaveLength(1);
      const layer = new GeoJsonLayer({...props[0], id: 'wkb-collection', dataId: dataset.id});
      layer.setInitialLayerConfig(dataset);
      const data = layer.formatLayerData({[dataset.id]: dataset}, {}) as any;
      expect(layer.centroids).toHaveLength(2);
      expect(layer.meta).toMatchObject({bounds: [1, 2, 50, 60]});
      expect(layer.meta.featureTypes).toMatchObject({point: true, line: true});
      if (layer.geoArrowMode) {
        expect(
          [
            ...new Set(
              data.data.flatMap(batch =>
                ['points', 'lines', 'polygons'].flatMap(type =>
                  Array.from(batch[type]?.globalFeatureIds?.value || [])
                )
              )
            )
          ].sort()
        ).toEqual([0, 1]);
      } else {
        expect(data.data.map(feature => feature.properties.index)).toEqual([0, 1]);
        const rendered = renderGeojsonFeatures(data.data);
        expect(rendered.pointFeatures?.map(feature => feature.geometry.coordinates)).toEqual([
          [1, 2],
          [50, 60]
        ]);
        expect(rendered.lineFeatures?.map(feature => feature.geometry.coordinates)).toEqual([
          [
            [3, 4],
            [5, 6]
          ]
        ]);
      }
      const hover = {
        picked: true,
        index: 0,
        object: layer.geoArrowMode ? undefined : data.data[0],
        layer: {props: {id: layer.id}}
      };
      const overlay = layer._getHoverOverlayData(hover);
      expect(overlay?.[0]).toMatchObject({
        properties: {index: 0},
        geometry: {
          type: 'GeometryCollection',
          geometries: [
            {type: 'Point', coordinates: [1, 2]},
            {
              type: 'LineString',
              coordinates: [
                [3, 4],
                [5, 6]
              ]
            }
          ]
        }
      });
      const renderedOverlay = renderGeojsonFeatures(overlay!);
      expect(renderedOverlay.pointFeatures).toHaveLength(1);
      expect(renderedOverlay.lineFeatures).toHaveLength(1);
      if (layer.geoArrowMode)
        expect(layer.hasHoveredObject(hover)?.properties).toMatchObject({
          label: 'collection',
          index: 0
        });
      const parsed = layer.dataToFeature;
      layer.updateLayerVisConfig({opacity: 0.37});
      const updated = layer.formatLayerData(
        {[dataset.id]: copyTableAndUpdate(dataset, {filteredIndex: [1]})},
        data
      ) as any;
      expect(layer.dataToFeature).toBe(parsed);
      expect(layer.config.visConfig.opacity).toBe(0.37);
      if (layer.geoArrowMode) {
        expect(updated.getFiltered({properties: {index: 0}})).toBe(0);
        expect(updated.getFiltered({properties: {index: 1}})).toBe(1);
      } else expect(updated.data.map(feature => feature.properties.index)).toEqual([1]);
    }
  );

  test('skips invalid and empty WKB rows while preserving later Arrow row IDs', () => {
    const point: Geometry = {type: 'Point', coordinates: [50, 60]};
    const values = [
      bytes(),
      bytes().subarray(0, 8),
      new Uint8Array(),
      new Uint8Array(convertGeometryToWKB({type: 'GeometryCollection', geometries: []})),
      new Uint8Array(convertGeometryToWKB(point))
    ];
    const dataset = new KeplerTable({
      info: {id: 'invalid-collections'},
      color: [0, 0, 0]
    }).updateSchema({
      fields: [
        {
          name: 'geometry',
          type: 'geoarrow',
          analyzerType: 'GEOMETRY',
          metadata: new Map([[GEOARROW_METADATA_KEY, GEOARROW_EXTENSIONS.WKB]])
        }
      ],
      cols: [arrow.vectorFromArray(values, new arrow.Binary())],
      rows: []
    });
    const layer = new GeoJsonLayer({
      id: 'invalid-wkb',
      dataId: dataset.id,
      columns: {geojson: {value: 'geometry', fieldIdx: 0}}
    });
    expect(() => layer.setInitialLayerConfig(dataset)).not.toThrow();
    expect(layer.centroids).toEqual([[3, 4], null, null, null, [50, 60]]);
    const data = layer.formatLayerData({[dataset.id]: dataset}, {}) as any;
    expect(
      [
        ...new Set(
          data.data.flatMap(batch =>
            ['points', 'lines'].flatMap(type => Array.from(batch[type].globalFeatureIds.value))
          )
        )
      ].sort()
    ).toEqual([0, 4]);
    expect(
      layer._getHoverOverlayData({picked: true, index: 1, layer: {props: {id: layer.id}}})
    ).toBeNull();
  });
});

describe('getGeojsonBounds', () => {
  test.each([
    {type: 'Polygon'},
    {type: 'GeometryCollection', geometries: null},
    {type: 'GeometryCollection', geometries: [{type: 'Polygon'}]}
  ])('preserves valid rows when a collection contains %j', malformed => {
    const valid: Feature = {
      type: 'Feature',
      properties: {},
      geometry: {type: 'Point', coordinates: [1, 2]}
    };
    const invalid = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'GeometryCollection',
        geometries: [{type: 'Point', coordinates: [50, 60]}, malformed]
      }
    } as Feature;
    expect(getGeojsonBounds([valid, invalid])).toEqual([1, 2, 1, 2]);
  });

  test('includes valid nested collections alongside empty collections', () => {
    expect(
      getGeojsonBounds([
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'GeometryCollection',
            geometries: [
              {type: 'GeometryCollection', geometries: []},
              {
                type: 'GeometryCollection',
                geometries: [{type: 'Point', coordinates: [50, 60]}]
              }
            ]
          }
        }
      ])
    ).toEqual([50, 60, 50, 60]);
  });
});

describe('featureToHoverOutline', () => {
  test('converts Polygon rings to MultiLineString so hover overlay skips fill tessellation', () => {
    const coordinates = [
      [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 0]
      ]
    ];
    const feature: Feature = {
      type: 'Feature',
      properties: {index: 0},
      geometry: {
        type: 'Polygon',
        coordinates
      }
    };

    expect(featureToHoverOutline(feature)).toEqual({
      ...feature,
      geometry: {
        type: 'MultiLineString',
        coordinates
      }
    });
  });

  test('flattens MultiPolygon rings into a MultiLineString', () => {
    const rings = [
      [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 0]
      ],
      [
        [2, 2],
        [3, 2],
        [3, 3],
        [2, 2]
      ]
    ];
    const feature: Feature = {
      type: 'Feature',
      properties: {index: 1},
      geometry: {
        type: 'MultiPolygon',
        coordinates: [[rings[0]], [rings[1]]]
      }
    };

    expect(featureToHoverOutline(feature).geometry).toEqual({
      type: 'MultiLineString',
      coordinates: rings
    });
  });

  test('leaves point and line features unchanged', () => {
    const point: Feature = {
      type: 'Feature',
      properties: {},
      geometry: {type: 'Point', coordinates: [1, 2]}
    };
    const line: Feature = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: [
          [0, 0],
          [1, 1]
        ]
      }
    };

    expect(featureToHoverOutline(point)).toBe(point);
    expect(featureToHoverOutline(line)).toBe(line);
  });
});

describe('table-column GeoJSON grouping', () => {
  const columns = {
    id: {value: 'id', fieldIdx: 0},
    lat: {value: 'lat', fieldIdx: 1},
    lng: {value: 'lng', fieldIdx: 2},
    sortBy: {value: 'sequence', fieldIdx: 3, optional: true}
  };

  test.each([
    {values: ['12/31/2023', '01/01/2024'], expectedOrder: [1, 0]},
    {values: [2, 10], expectedOrder: [0, 1]},
    {values: [0, null], expectedOrder: [0, 1]}
  ])('retains generic sort semantics for $values', ({values, expectedOrder}) => {
    const rows = values.map((value, index) => ['id', index, index, value]);
    const features = groupColumnsAsGeoJson(createDataContainer(rows), columns, 'sortBy');
    expect(features[0].properties?.values).toEqual(expectedOrder.map(index => rows[index]));
  });

  test('keeps input order without a sort column and handles empty data', () => {
    const rows = [
      ['id', 2, 2],
      ['id', 1, 1]
    ];
    const unsortedColumns = {...columns, sortBy: {value: null, fieldIdx: -1, optional: true}};
    const features = groupColumnsAsGeoJson(createDataContainer(rows), unsortedColumns, 'sortBy');
    expect(features[0].properties?.values).toEqual(rows);
    expect(groupColumnsAsGeoJson(createDataContainer([]), unsortedColumns, 'sortBy')).toEqual([]);
  });
});
