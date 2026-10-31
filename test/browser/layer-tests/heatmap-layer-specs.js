// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import {
  testCreateCases,
  testFormatLayerDataCases,
  testRenderDeckLayer,
  preparedDataset,
  prepareGeojsonDataset,
  dataId,
  pointLayerMeta
} from 'test/helpers/layer-utils';
import {StateWFiles, testCsvDataId} from 'test/helpers/mock-state';
import {gpsPointBounds} from 'test/fixtures/test-csv-data';

import {KeplerGlLayers, LayerClasses} from '@kepler.gl/layers';
import {copyTableAndUpdate, KeplerTable} from '@kepler.gl/table';
import {VisStateActions} from '@kepler.gl/actions';
import {
  INITIAL_VIS_STATE,
  INITIAL_MAP_STATE,
  visStateReducer,
  validateLayerWithData
} from '@kepler.gl/reducers';
import {LayerManager, MapView, WebMercatorViewport, _GlobeView} from '@deck.gl/core';
import {visStateSchemaV1} from '@kepler.gl/schemas';
import KeplerHeatmapLayer from '../../../src/layers/src/heatmap-layer/deck-heatmap-layer';
import {createHeatmapSurfaceMesh} from '../../../src/layers/src/heatmap-layer/density-surface-mesh';
import {device} from '@deck.gl/test-utils';
import {convertGeometryToWKB} from '@loaders.gl/gis';

const {HeatmapLayer, PointLayer} = KeplerGlLayers;

const columns = {
  lat: 'lat',
  lng: 'lng'
};

test('#HeatmapLayer -> contructor', t => {
  const TEST_CASES = {
    CREATE: [
      {
        props: {
          dataId: 'taro',
          isVisible: true,
          label: 'test heatmap layer'
        },
        test: layer => {
          t.equal(layer.config.visConfig.radius, 20, 'Heatmap default radius should be 20');
          t.equal(layer.config.visConfig.heatmapMode, 'flat', 'existing maps default to Flat');
          t.equal(
            layer.config.visConfig.surfaceContourStep,
            0.1,
            'default contour spacing is preserved'
          );
          t.ok(
            layer.visConfigSettings.radius.range[0] > 0,
            'heatmap radius should have a positive minimum'
          );
          t.ok(layer.config.dataId === 'taro', 'heatmaplayer dataId should be correct');
          t.ok(layer.type === 'heatmap', 'type should be heatmap');
          t.ok(layer.isAggregated === true, 'heatmaplayer is aggregated');
          t.ok(layer.config.label === 'test heatmap layer', 'label should be correct');
          t.ok(Object.keys(layer.columnPairs).length, 'should have columnPairs');
          t.equal(layer.config.colorScale, 'quantize', 'heatmap legend should use quantize scale');
          t.deepEqual(layer.config.colorDomain, [0, 1], 'heatmap legend domain should be 0-1');
          t.notOk(
            layer.visualChannels.color,
            'color is legend-only and should not be a visual channel'
          );
          t.ok(
            layer.getLegendVisualChannels().color,
            'should expose a color channel for the legend'
          );
          t.deepEqual(
            Object.keys(layer.getLegendVisualChannels()),
            ['color'],
            'legend should not show weight when no weight field is set'
          );
        }
      }
    ]
  };

  testCreateCases(t, HeatmapLayer, TEST_CASES.CREATE);
  t.end();
});

test('#HeatmapLayer -> assignConfigToLayer does not copy colorField', t => {
  const pointLayer = new PointLayer({
    dataId: 'taro',
    isVisible: true,
    label: 'points'
  });
  pointLayer.updateLayerConfig({
    colorField: {name: 'trip_distance', type: 'real'},
    colorScale: 'quantile',
    colorDomain: [0, 100]
  });

  const heatmapLayer = new HeatmapLayer({
    dataId: 'taro',
    isVisible: true,
    label: 'heatmap'
  });
  heatmapLayer.assignConfigToLayer(pointLayer.config, pointLayer.visConfigSettings);

  t.equal(
    heatmapLayer.config.colorField,
    null,
    'should not copy colorField from the previous layer type'
  );
  t.equal(
    heatmapLayer.config.colorScale,
    'quantize',
    'should keep quantize legend scale after type change'
  );
  t.deepEqual(
    heatmapLayer.config.colorDomain,
    [0, 1],
    'should keep 0-1 density domain after type change'
  );
  t.ok(
    heatmapLayer.getLegendVisualChannels().color,
    'legend should still expose the density color ramp'
  );

  t.end();
});

test('#HeatmapLayer -> getLegendVisualChannels includes weight field', t => {
  const heatmapLayer = new HeatmapLayer({
    dataId: 'taro',
    isVisible: true,
    label: 'heatmap'
  });

  t.deepEqual(
    Object.keys(heatmapLayer.getLegendVisualChannels()),
    ['color'],
    'legend should only show the color ramp by default'
  );

  heatmapLayer.updateLayerConfig({
    weightField: {name: 'trip_distance', type: 'real'}
  });

  t.deepEqual(
    Object.keys(heatmapLayer.getLegendVisualChannels()),
    ['color', 'weight'],
    'legend should include weight when a weight field is selected'
  );
  t.equal(
    heatmapLayer.getVisualChannelDescription('weight').measure,
    'trip_distance',
    'weight legend should use the selected field name'
  );

  t.end();
});

test('#Heatmaplayer -> formatLayerData -> w/ GpuFilter', t => {
  const filteredIndex = [0, 2, 4];

  const TEST_CASES = [
    {
      name: 'Heatmap gps point.1',
      layer: {
        type: 'heatmap',
        id: 'heatmap-test-1',
        config: {
          dataId,
          label: 'deck.gl heatmap',
          isVisible: true,
          columns,
          weightField: {
            type: 'integer',
            name: 'id'
          }
        }
      },
      datasets: {
        [dataId]: copyTableAndUpdate(preparedDataset, {filteredIndex})
      },
      assert: result => {
        const {layerData, layer} = result;

        t.ok(Array.isArray(layerData.data), 'layerData.data should be an array');
        t.ok(typeof layerData.getPosition === 'function', 'should have getPosition accessor');
        t.ok(typeof layerData.getWeight === 'function', 'should have getWeight accessor');

        // data items should have {index} shape for deck.gl aggregation
        t.ok(
          layerData.data.every(d => typeof d.index === 'number'),
          'data items should have numeric index'
        );

        // test layer.meta
        t.deepEqual(layer.meta, pointLayerMeta, 'should format correct heatmap layer.meta');
      }
    }
  ];

  testFormatLayerDataCases(t, HeatmapLayer, TEST_CASES);
  t.end();
});

test('#Heatmaplayer -> formatLayerData -> w/o GpuFilter', t => {
  const testData = StateWFiles.visState.datasets[testCsvDataId];
  const gpsColumns = {
    lat: 'gps_data.lat',
    lng: 'gps_data.lng'
  };

  const TEST_CASES = [
    {
      name: 'Heatmap gps point.1',
      layer: {
        type: 'heatmap',
        id: 'heatmap-test-1',
        config: {
          dataId: testCsvDataId,
          label: 'deck.gl heatmap',
          isVisible: true,
          columns: gpsColumns,
          visConfig: {
            colorRange: {
              colors: ['#010101', '#020202', '#030303']
            },
            radius: 100,
            opacity: 0.2
          }
        }
      },
      datasets: StateWFiles.visState.datasets,
      assert: result => {
        const {layerData, layer} = result;
        const expectedLayerMeta = {bounds: gpsPointBounds};

        t.ok(Array.isArray(layerData.data), 'layerData.data should be an array');
        t.equal(
          layerData.data.length,
          testData.dataContainer.numRows(),
          'should have same number of data points'
        );

        t.ok(typeof layerData.getPosition === 'function', 'should have getPosition accessor');
        t.equal(typeof layerData.getWeight, 'number', 'getWeight should be 1 when no weight field');
        t.equal(layerData.getWeight, 1, 'getWeight should default to 1');

        // data items should have {index} shape
        t.ok(
          layerData.data.every(d => typeof d.index === 'number'),
          'data items should have numeric index'
        );

        // test layer.meta
        t.deepEqual(layer.meta, expectedLayerMeta, 'should format correct heatmap layer.meta');
      }
    }
  ];

  testFormatLayerDataCases(t, HeatmapLayer, TEST_CASES);
  t.end();
});

const geojsonColumns = {
  geojson: '_geojson'
};

const geojsonFilteredIndex = prepareGeojsonDataset.filteredIndex;

test('#HeatmapLayer -> constructor with geojson column mode', t => {
  const layer = new HeatmapLayer({
    dataId: 'test',
    label: 'test heatmap geojson',
    columns: {geojson: {value: '_geojson', fieldIdx: 0}},
    columnMode: 'geojson'
  });

  t.equal(layer.config.columnMode, 'geojson', 'should have geojson columnMode');
  t.equal(layer.type, 'heatmap', 'type should be heatmap');
  t.ok(layer.isAggregated, 'should be aggregated');
  t.equal(layer.supportedColumnModes.length, 3, 'should have 3 supported column modes');
  t.ok(
    layer.supportedColumnModes.find(m => m.key === 'geojson'),
    'should support geojson column mode'
  );
  t.ok(
    layer.supportedColumnModes.find(m => m.key === 'points'),
    'should support points column mode'
  );
  t.ok(
    layer.supportedColumnModes.find(m => m.key === 'geoarrow'),
    'should support geoarrow column mode'
  );
  t.end();
});

test('#HeatmapLayer -> findDefaultLayerProps with geojson field', t => {
  const result = HeatmapLayer.findDefaultLayerProps(prepareGeojsonDataset);

  t.ok(result, 'should return result');
  t.ok(result.altProps, 'should have altProps');
  t.ok(result.altProps.length > 0, 'should have at least one alt prop');

  const geojsonAltProp = result.altProps.find(p => p.columnMode === 'geojson');
  t.ok(geojsonAltProp, 'should find a geojson alt prop');
  t.ok(geojsonAltProp.columns, 'geojson alt prop should have columns');
  t.ok(geojsonAltProp.columns.geojson, 'geojson alt prop should have geojson column');
  t.equal(
    geojsonAltProp.columns.geojson.value,
    '_geojson',
    'geojson column value should be _geojson'
  );
  t.end();
});

test('#HeatmapLayer -> formatLayerData with geojson column mode', t => {
  const TEST_CASES = [
    {
      name: 'Heatmap geojson column mode',
      layer: {
        type: 'heatmap',
        id: 'heatmap_geojson_test_1',
        config: {
          dataId,
          label: 'heatmap geojson',
          columns: geojsonColumns,
          columnMode: 'geojson',
          color: [1, 2, 3]
        }
      },
      datasets: {
        [dataId]: {
          ...prepareGeojsonDataset,
          filteredIndex: geojsonFilteredIndex
        }
      },
      assert: result => {
        const {layerData, layer} = result;

        t.ok(layerData, 'should have layer data');
        t.ok(Array.isArray(layerData.data), 'layerData.data should be an array');
        t.ok(layerData.data.length > 0, 'should have data entries');
        t.ok(typeof layerData.getPosition === 'function', 'should have getPosition accessor');

        // In geojson mode, each data point should have index and position (centroid)
        const firstPoint = layerData.data[0];
        t.ok(Number.isFinite(firstPoint.index), 'data entry should have numeric index');
        t.ok(Array.isArray(firstPoint.position), 'data entry should have position array');
        t.equal(firstPoint.position.length, 2, 'position should have 2 elements [lng, lat]');
        t.ok(Number.isFinite(firstPoint.position[0]), 'longitude should be finite');
        t.ok(Number.isFinite(firstPoint.position[1]), 'latitude should be finite');

        // getPosition should return the centroid from the data entry
        const pos = layerData.getPosition(firstPoint);
        t.deepEqual(pos, firstPoint.position, 'getPosition should return entry position');

        // layer meta should have bounds
        t.ok(layer.meta.bounds, 'layer should have bounds');
        t.equal(layer.meta.bounds.length, 4, 'bounds should have 4 elements');

        // centroids should be populated
        t.ok(layer.centroids.length > 0, 'layer should have centroids populated');

        // dataToFeature should be populated
        t.ok(layer.dataToFeature.length > 0, 'layer should have dataToFeature populated');
      }
    }
  ];

  testFormatLayerDataCases(t, HeatmapLayer, TEST_CASES);
  t.end();
});

test('#HeatmapLayer -> geojson mode handles Point, LineString, Polygon geometries', t => {
  const layer = new HeatmapLayer({
    dataId: 'test',
    label: 'test',
    columns: {geojson: {value: '_geojson', fieldIdx: 0}},
    columnMode: 'geojson'
  });

  const mockFeatures = [
    // Point - should return point directly
    {
      type: 'Feature',
      geometry: {type: 'Point', coordinates: [-122.4, 37.8]},
      properties: {}
    },
    // LineString - should return center (average of vertices)
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [-122.4, 37.8],
          [-122.5, 37.9]
        ]
      },
      properties: {}
    },
    // Polygon - should return centroid (average of boundary vertices)
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-122.4, 37.8],
            [-122.5, 37.8],
            [-122.5, 37.9],
            [-122.4, 37.9],
            [-122.4, 37.8]
          ]
        ]
      },
      properties: {}
    }
  ];

  const mockDataContainer = {
    numRows: () => mockFeatures.length,
    valueAt: (index, fieldIdx) => JSON.stringify(mockFeatures[index])
  };

  layer.config.columns = {
    lat: {value: null, fieldIdx: -1},
    lng: {value: null, fieldIdx: -1},
    geoarrow: {value: null, fieldIdx: -1},
    geojson: {value: '_geojson', fieldIdx: 0}
  };
  layer.config.columnMode = 'geojson';

  const mockDataset = {
    dataContainer: mockDataContainer,
    filteredIndex: [0, 1, 2],
    id: 'test'
  };
  layer.updateLayerMeta(mockDataset);

  // Verify centroids
  t.equal(layer.centroids.length, 3, 'should have 3 centroids');

  // Point: centroid should be the point itself
  t.deepEqual(layer.centroids[0], [-122.4, 37.8], 'Point centroid should be point coordinates');

  // LineString: centroid should be average of vertices
  const expectedLineCentroid = [(-122.4 + -122.5) / 2, (37.8 + 37.9) / 2];
  t.ok(
    Math.abs(layer.centroids[1][0] - expectedLineCentroid[0]) < 1e-10,
    'LineString centroid lng should be average of vertices'
  );
  t.ok(
    Math.abs(layer.centroids[1][1] - expectedLineCentroid[1]) < 1e-10,
    'LineString centroid lat should be average of vertices'
  );

  // Polygon: centroid should be average of all boundary vertices
  const polyCoords = [
    [-122.4, 37.8],
    [-122.5, 37.8],
    [-122.5, 37.9],
    [-122.4, 37.9],
    [-122.4, 37.8]
  ];
  const expectedPolyCentroid = [
    polyCoords.reduce((s, c) => s + c[0], 0) / polyCoords.length,
    polyCoords.reduce((s, c) => s + c[1], 0) / polyCoords.length
  ];
  t.ok(
    Math.abs(layer.centroids[2][0] - expectedPolyCentroid[0]) < 1e-10,
    'Polygon centroid lng should be average of boundary vertices'
  );
  t.ok(
    Math.abs(layer.centroids[2][1] - expectedPolyCentroid[1]) < 1e-10,
    'Polygon centroid lat should be average of boundary vertices'
  );

  // Verify bounds
  t.ok(layer.meta.bounds, 'should have computed bounds');
  const [minLng, minLat, maxLng, maxLat] = layer.meta.bounds;
  t.ok(minLng <= -122.5, 'minLng should include westernmost point');
  t.ok(maxLng >= -122.4, 'maxLng should include easternmost point');
  t.ok(minLat <= 37.8, 'minLat should include southernmost point');
  t.ok(maxLat >= 37.9, 'maxLat should include northernmost point');

  const data = layer.calculateDataAttribute(mockDataset, null);
  t.equal(data.length, 3, 'should emit a heatmap point for Point, LineString, and Polygon');
  t.deepEqual(data[0].position, [-122.4, 37.8], 'Point heatmap position should be the point');
  t.ok(Number.isFinite(data[1].position[0]), 'LineString heatmap position should be finite');
  t.ok(Number.isFinite(data[2].position[0]), 'Polygon heatmap position should be finite');

  t.end();
});

function createHeatmapGeojsonLayer(values) {
  const layer = new HeatmapLayer({
    dataId: 'test',
    label: 'test',
    columns: {geojson: {value: '_geojson', fieldIdx: 0}},
    columnMode: 'geojson'
  });
  layer.config.columns = {
    lat: {value: null, fieldIdx: -1},
    lng: {value: null, fieldIdx: -1},
    geoarrow: {value: null, fieldIdx: -1},
    geojson: {value: '_geojson', fieldIdx: 0}
  };
  layer.config.columnMode = 'geojson';

  const mockDataset = {
    dataContainer: {
      numRows: () => values.length,
      valueAt: index => values[index]
    },
    filteredIndex: values.map((_, i) => i),
    id: 'test'
  };
  layer.updateLayerMeta(mockDataset);
  return {layer, mockDataset};
}

test('#HeatmapLayer -> geojson mode parses Feature objects, WKT, and WKB', t => {
  const point = {
    type: 'Feature',
    geometry: {type: 'Point', coordinates: [-122.4, 37.8]},
    properties: {}
  };
  const line = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [
        [-122.4, 37.8],
        [-122.5, 37.9]
      ]
    },
    properties: {}
  };
  const polygon = {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-122.4, 37.8],
          [-122.5, 37.8],
          [-122.5, 37.9],
          [-122.4, 37.9],
          [-122.4, 37.8]
        ]
      ]
    },
    properties: {}
  };

  // Feature objects (how processGeojson stores rows)
  const fromObjects = createHeatmapGeojsonLayer([point, line, polygon]);
  t.equal(
    fromObjects.layer.calculateDataAttribute(fromObjects.mockDataset, null).length,
    3,
    'Feature objects should produce heatmap points for Point, LineString, and Polygon'
  );
  t.deepEqual(fromObjects.layer.centroids[0], [-122.4, 37.8], 'Point Feature centroid');

  // WKT strings (CSV / PostGIS geometry columns)
  const fromWkt = createHeatmapGeojsonLayer([
    'POINT (-122.4 37.8)',
    'LINESTRING (-122.4 37.8, -122.5 37.9)',
    'POLYGON ((-122.4 37.8, -122.5 37.8, -122.5 37.9, -122.4 37.9, -122.4 37.8))'
  ]);
  t.equal(
    fromWkt.layer.calculateDataAttribute(fromWkt.mockDataset, null).length,
    3,
    'WKT strings should produce heatmap points for POINT, LINESTRING, and POLYGON'
  );
  t.deepEqual(fromWkt.layer.centroids[0], [-122.4, 37.8], 'WKT POINT centroid');

  // WKB bytes (DuckDB / GeoParquet geometry columns)
  const fromWkb = createHeatmapGeojsonLayer([
    new Uint8Array(convertGeometryToWKB(point.geometry)),
    new Uint8Array(convertGeometryToWKB(line.geometry)),
    new Uint8Array(convertGeometryToWKB(polygon.geometry))
  ]);
  t.equal(
    fromWkb.layer.calculateDataAttribute(fromWkb.mockDataset, null).length,
    3,
    'WKB bytes should produce heatmap points for Point, LineString, and Polygon'
  );
  t.deepEqual(fromWkb.layer.centroids[0], [-122.4, 37.8], 'WKB Point centroid');

  t.end();
});

test('#HeatmapLayer -> isInPolygon with geojson mode', t => {
  const layer = new HeatmapLayer({
    dataId: 'test',
    label: 'test',
    columns: {geojson: {value: '_geojson', fieldIdx: 0}},
    columnMode: 'geojson'
  });

  // Set up centroids manually
  layer.centroids = [[-122.4, 37.8], [-122.5, 37.9], null];

  // Rectangle polygon that contains the first centroid but not the second
  const filterPolygon = {
    type: 'Feature',
    properties: {
      shape: 'Rectangle',
      bbox: [-122.45, 37.75, -122.35, 37.85]
    },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-122.45, 37.75],
          [-122.35, 37.75],
          [-122.35, 37.85],
          [-122.45, 37.85],
          [-122.45, 37.75]
        ]
      ]
    }
  };

  t.ok(layer.isInPolygon(null, 0, filterPolygon), 'first point should be inside polygon');
  t.notOk(layer.isInPolygon(null, 1, filterPolygon), 'second point should be outside polygon');
  t.notOk(layer.isInPolygon(null, 2, filterPolygon), 'null centroid should return false');
  t.notOk(layer.isInPolygon(null, 99, filterPolygon), 'out-of-bounds index should return false');

  t.end();
});

test('#Aggregation layers -> reducer filters at the domain minimum', t => {
  for (const minimum of [0, 100, -20]) {
    const datasets = {};
    for (const id of ['first', 'second']) {
      const table = new KeplerTable({info: {id}, color: [1, 2, 3]});
      table.importData({
        data: {
          fields: ['lat', 'lng', 'value', 'other'].map(name => ({name, type: 'real'})),
          rows: [0, 10, 20].map(value => [37.75, -122.4, minimum + value, value])
        }
      });
      datasets[id] = table;
    }
    const layers = ['heatmap', 'grid', 'hexagon', 'cluster'].map(type =>
      validateLayerWithData(
        datasets.first,
        {type, config: {dataId: 'first', columns, visConfig: {enable3d: true}}},
        LayerClasses
      )
    );
    let state = {
      ...INITIAL_VIS_STATE,
      datasets,
      layers,
      layerData: layers.map(layer => layer.formatLayerData(datasets))
    };
    const viewport = new MapView().makeViewport({
      width: INITIAL_MAP_STATE.width,
      height: INITIAL_MAP_STATE.height,
      viewState: INITIAL_MAP_STATE
    });
    const managers = layers.map(() => new LayerManager(device, {viewport}));
    const apply = action => {
      state = visStateReducer(state, action);
    };
    const check = (label, expected) => {
      state.layers.forEach((layer, i) => {
        const deckLayers = layer.renderLayer({
          data: state.layerData[i],
          gpuFilter: state.datasets[layer.config.dataId].gpuFilter,
          mapState: INITIAL_MAP_STATE,
          idx: i,
          visible: true,
          layerCallbacks: {onSetLayerDomain: () => {}},
          interactionConfig: INITIAL_VIS_STATE.interactionConfig
        });
        const message = `${layer.type}: ${minimum} ${label}`;
        if (layer.type === 'heatmap') {
          t.equal(deckLayers[0].props.data.length, expected, message);
        } else {
          const [rendered] = testRenderDeckLayer(t, layer.type, deckLayers, {
            layerManager: managers[i]
          });
          if (layer.type === 'cluster') {
            const bins = rendered.state.aggregatorState.layerData.data;
            t.equal(
              bins.reduce((sum, bin) => sum + bin.points.length, 0),
              expected,
              message
            );
          } else {
            const aggregator = rendered.state.aggregator;
            const counts = [0, 0];
            for (let j = 0; j < aggregator.binCount; j++) {
              aggregator.getBin(j).value.forEach((count, channel) => (counts[channel] += count));
            }
            t.deepEqual(counts, [expected, expected], message);
          }
        }
      });
    };

    state.layers
      .find(layer => layer.type === 'heatmap')
      .updateLayerVisConfig({heatmapMode: 'surface'});
    check('no filter', 3);
    apply(VisStateActions.addFilter('first'));
    apply(VisStateActions.setFilter(0, 'name', 'value'));
    apply(VisStateActions.setFilter(0, 'value', [minimum, minimum]));
    const {gpuFilter, dataContainer, filteredIndex} = state.datasets.first;
    t.deepEqual(
      gpuFilter.filterRange,
      [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0]
      ],
      'normalized ranges'
    );
    t.deepEqual(
      filteredIndex.map(index => gpuFilter.filterValueAccessor(dataContainer)()({index})[0]),
      [0, 10, 20],
      'GPU filtering retains all CPU rows and offsets values by the domain minimum'
    );
    check('minimum selection', 1);
    apply(VisStateActions.setFilter(0, 'value', [minimum + 10, minimum + 20]));
    check('ordinary range', 2);

    if (minimum === 100) {
      apply(VisStateActions.addFilter('first'));
      apply(VisStateActions.setFilter(1, 'name', 'other'));
      apply(VisStateActions.setFilter(1, 'value', [0, 0]));
      check('multiple channels intersect', 0);
      apply(VisStateActions.setFilter(0, 'value', [minimum, minimum]));
      check('multiple active zero ranges', 1);
      apply(VisStateActions.setFilter(0, ['dataId', 'name'], ['second', 'value'], 1));
      check('shared minimum filter', 1);
      state.layers.forEach(layer => layer.updateLayerConfig({dataId: 'second'}));
      state.layerData = state.layers.map(layer => layer.formatLayerData(state.datasets));
      check('shared filter on second dataset', 1);
      apply(VisStateActions.removeFilter(1));
    }
    apply(VisStateActions.removeFilter(0));
    check('cleared filters', 3);
    managers.forEach(manager => manager.finalize());
  }
  t.end();
});

test('#HeatmapLayer -> surface settings survive saving and loading', t => {
  const layer = validateLayerWithData(
    preparedDataset,
    {type: 'heatmap', config: {dataId, columns}},
    LayerClasses
  );
  const surfaceConfig = {
    heatmapMode: 'surface',
    surfaceHeight: 2500,
    surfaceLighting: false,
    surfaceContours: true,
    surfaceContourStep: 0.2
  };
  layer.updateLayerVisConfig(surfaceConfig);
  const saved = visStateSchemaV1.save({
    ...INITIAL_VIS_STATE,
    layers: [layer],
    layerOrder: [layer.id]
  }).visState;
  const loaded = visStateSchemaV1.load(JSON.parse(JSON.stringify(saved))).visState;
  const restored = validateLayerWithData(preparedDataset, loaded.layers[0], LayerClasses);
  for (const [key, value] of Object.entries(surfaceConfig)) {
    t.equal(restored.config.visConfig[key], value, `restores ${key}`);
  }
  const data = restored.formatLayerData({[dataId]: preparedDataset});
  const render = () => restored.renderLayer({data, mapState: INITIAL_MAP_STATE, visible: true})[0];
  t.ok(render().props.surface, 'selects the surface renderer');
  t.equal(render().props.surfaceHeight, 2500, 'passes the selected height scale');
  t.equal(render().props.surfaceContourStep, 0.2, 'passes the selected contour step');
  for (const step of [undefined, 0, -0.1, Number.NaN, Infinity]) {
    restored.updateLayerVisConfig({surfaceContourStep: step});
    t.equal(
      render().props.surfaceContourStep,
      0.1,
      'missing or invalid contour step has a positive fallback'
    );
  }
  restored.updateLayerVisConfig({surfaceHeight: Number.NaN});
  t.equal(render().props.surfaceHeight, 1000, 'invalid height has a finite fallback');
  restored.updateLayerVisConfig({surfaceHeight: -20});
  t.equal(render().props.surfaceHeight, 0, 'negative height cannot invert the surface');
  restored.updateLayerVisConfig({heatmapMode: 'flat'});
  t.notOk(render().props.surface, 'can return to Flat');
  t.equal(render().props.data, data.data, 'display changes reuse the filtered data');
  t.end();
});

test('#HeatmapLayer -> surface grid follows density geography and world copies', t => {
  const viewport = new WebMercatorViewport({longitude: 10, latitude: 65, zoom: 5});
  const bounds = [8, 60, 12, 70];
  const lower = viewport.projectPosition([8, 60, 0]);
  const upper = viewport.projectPosition([12, 70, 0]);
  const commonBounds = [lower[0], lower[1], upper[0], upper[1]];
  const textureSize = 512;
  const side = textureSize + 1;
  const mesh = createHeatmapSurfaceMesh(bounds, commonBounds, viewport, textureSize, 10);
  const shifted = createHeatmapSurfaceMesh(bounds, commonBounds, viewport, textureSize, 370);
  t.equal(
    mesh.positions.length,
    side * side * 3,
    'surface grid matches the density texture resolution'
  );
  t.equal(
    mesh.vertexCount,
    textureSize * textureSize * 6,
    'each density texel has two surface triangles'
  );
  for (const size of [128, 256]) {
    const resized = createHeatmapSurfaceMesh(bounds, commonBounds, viewport, size, 10);
    t.equal(resized.positions.length, (size + 1) ** 2 * 3, `matches a ${size}-pixel texture`);
    t.equal(resized.vertexCount, size * size * 6, `triangle count follows a ${size}-pixel texture`);
  }
  t.equal(mesh.vertexCount, mesh.indices.length, 'all triangles are drawn');
  t.ok(
    mesh.indices.every(i => i < mesh.positions.length / 3),
    'all indices address valid vertices'
  );
  t.deepEqual(shifted.texCoords, mesh.texCoords, 'world wrapping preserves density samples');
  for (const i of [0, textureSize, (side * side - 1) / 2, side * side - 1]) {
    const position = Array.from(mesh.positions.slice(i * 3, i * 3 + 3));
    const projected = viewport.projectPosition(position);
    t.ok(
      Math.abs(mesh.texCoords[i * 2] - (projected[0] - lower[0]) / (upper[0] - lower[0])) < 1e-6,
      'longitude matches its density sample'
    );
    t.ok(
      Math.abs(mesh.texCoords[i * 2 + 1] - (projected[1] - lower[1]) / (upper[1] - lower[1])) <
        1e-6,
      'latitude matches its density sample'
    );
    t.equal(
      shifted.positions[i * 3] - mesh.positions[i * 3],
      360,
      'renders in the nearest world copy'
    );
  }
  const wrappedBounds = [181, 60, 185, 70];
  const wrappedLower = viewport.projectPosition([181, 60, 0]);
  const wrappedUpper = viewport.projectPosition([185, 70, 0]);
  const wrapped = createHeatmapSurfaceMesh(
    wrappedBounds,
    [wrappedLower[0], wrappedLower[1], wrappedUpper[0], wrappedUpper[1]],
    viewport,
    textureSize,
    183
  );
  t.ok(wrapped, 'a density texture beyond the antimeridian still renders');
  t.ok(Math.abs(wrapped.positions[0] - 181) < 1e-6, 'keeps unwrapped texture geography');
  t.deepEqual(
    Array.from(wrapped.texCoords.slice(0, 2)),
    [0, 0],
    'samples its original density texture'
  );
  for (const invalid of [[], [0, 0, 0, 1], [0, 0, 1, 0], [0, 0, NaN, 1]]) {
    t.equal(
      createHeatmapSurfaceMesh(invalid, commonBounds, viewport, textureSize),
      null,
      'empty or invalid geography produces no surface'
    );
  }
  t.equal(
    createHeatmapSurfaceMesh(bounds, [0, 0, 0, 0], viewport, textureSize),
    null,
    'invalid density texture bounds produce no surface'
  );
  for (const size of [undefined, 0, -1, 1.5, NaN, Infinity]) {
    t.equal(
      createHeatmapSurfaceMesh(bounds, commonBounds, viewport, size),
      null,
      'missing or invalid texture size produces no surface'
    );
  }
  t.end();
});

test('#HeatmapLayer -> surface renderer switches modes on map and globe', t => {
  for (const globe of [false, true]) {
    const viewport = new (globe ? _GlobeView : MapView)().makeViewport({
      width: 800,
      height: 600,
      viewState: {longitude: -122.4, latitude: 37.75, zoom: 10, pitch: 45}
    });
    const manager = new LayerManager(device, {viewport});
    let layer = new KeplerHeatmapLayer({
      id: `heatmap-surface-${globe}`,
      data: [
        [-122.42, 37.74],
        [-122.4, 37.76]
      ],
      getPosition: d => d,
      getWeight: 1,
      weightsTextureSize: 128,
      debounceTimeout: 0,
      globeMode: globe,
      densityBounds: [-122.42, 37.74, -122.4, 37.76]
    });
    try {
      for (const aggregation of ['SUM', 'MEAN']) {
        layer = layer.clone({
          surface: true,
          surfaceHeight: 1800,
          surfaceContours: true,
          surfaceContourStep: 0.2,
          aggregation
        });
        testRenderDeckLayer(t, 'heatmap surface', [layer], {layerManager: manager});
        const surface = layer.getSubLayers()[0];
        t.ok(surface, 'creates the density surface');
        const textureSize = layer.state.textureSize;
        t.equal(
          surface.props.mesh.positions.length,
          (textureSize + 1) ** 2 * 3,
          'renderer matches the allocated density texture resolution'
        );
        t.equal(
          surface.props.mesh.vertexCount,
          textureSize * textureSize * 6,
          'renderer uses two triangles per density texel'
        );
        t.equal(surface.props.surfaceHeight, 1800, 'height is available to the GPU renderer');
        t.equal(
          surface.props.surfaceContourStep,
          0.2,
          'contour step is available to the GPU renderer'
        );
        t.equal(
          surface.props.aggregationMode,
          aggregation === 'SUM' ? 0 : 1,
          'uses the heatmap aggregation'
        );
        const mesh = surface.props.mesh;
        layer = layer.clone({surfaceHeight: 2500, surfaceContourStep: 0.05});
        testRenderDeckLayer(t, 'rescaled surface', [layer], {layerManager: manager});
        t.equal(
          layer.getSubLayers()[0].props.mesh,
          mesh,
          'height and contour edits reuse surface geometry'
        );
        t.equal(
          layer.getSubLayers()[0].props.surfaceContourStep,
          0.05,
          'contour spacing can be updated'
        );
        const weights = layer.state.weightsTexture;
        layer = layer.clone({surface: false});
        testRenderDeckLayer(t, 'flat heatmap', [layer], {layerManager: manager});
        t.equal(layer.state.weightsTexture, weights, 'Flat and Surface share density resources');
        t.notOk(layer.getSubLayers()[0].props.surfaceHeight, 'Flat does not displace density');
      }
      layer = layer.clone({surface: true, data: []});
      testRenderDeckLayer(t, 'empty heatmap surface', [layer], {layerManager: manager});
      t.equal(layer.props.data.length, 0, 'supports an empty filtered dataset');
    } finally {
      manager.finalize();
    }
  }
  t.end();
});
