// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';

import {
  testCreateCases,
  testFormatLayerDataCases,
  testRenderLayerCases
} from 'test/helpers/layer-utils';
import {KeplerGlLayers} from '@kepler.gl/layers';
import {getGpuFilterProps, KeplerTable} from '@kepler.gl/table';
import {processCsvData, processGeojson} from '@kepler.gl/processors';
import {findPointFieldPairs} from '@kepler.gl/table';

const {FlowFieldLayer} = KeplerGlLayers;

const dataId = 'flow-field-test-data';
const flowCsv = `latitude,longitude,u,v
37.0,-122.0,1.0,0.5
37.5,-122.0,1.1,0.4
38.0,-122.0,0.9,0.6
37.0,-121.5,1.2,0.3
37.5,-121.5,1.0,0.5
38.0,-121.5,0.8,0.7
37.0,-121.0,1.3,0.2
37.5,-121.0,0.95,0.55
38.0,-121.0,0.85,0.65
`;

const elevCsv = `latitude,longitude,elevation
37.0,-122.0,10
37.5,-122.0,20
38.0,-122.0,15
37.0,-121.5,25
37.5,-121.5,30
38.0,-121.5,18
37.0,-121.0,12
37.5,-121.0,22
38.0,-121.0,16
`;

const speedDirCsv = `latitude,longitude,speed,direction
37.0,-122.0,10,0
37.5,-122.0,10,90
38.0,-122.0,10,180
37.0,-121.5,10,270
37.5,-121.5,8,45
38.0,-121.5,8,135
37.0,-121.0,12,225
37.5,-121.0,12,315
38.0,-121.0,5,0
`;

const {rows, fields} = processCsvData(flowCsv);

function createDatasetFromCsv(csv, id = dataId) {
  const parsed = processCsvData(csv);
  const dataset = new KeplerTable({
    info: {id, label: id},
    color: [255, 255, 255]
  });
  dataset.importData({
    data: {fields: parsed.fields, rows: parsed.rows}
  });
  dataset.fieldPairs = findPointFieldPairs(dataset.fields);
  dataset.gpuFilter = getGpuFilterProps([], id, dataset.fields);
  return dataset;
}

function createFlowFieldDataset() {
  return createDatasetFromCsv(flowCsv, dataId);
}

test('#FlowFieldLayer -> constructor', t => {
  const TEST_CASES = [
    {
      props: {
        dataId: 'smoothie',
        isVisible: true,
        label: 'test flow field layer'
      },
      test: layer => {
        t.ok(layer.config, 'should create a layer config');
        t.equal(layer.type, 'flowField', 'should have type flowField');
        t.equal(layer.name, 'Flow Field', 'should have name Flow Field');
        t.equal(layer.config.visConfig.linesPerScreen, 7500, 'default linesPerScreen');
        t.equal(layer.config.visConfig.cycleSeconds, 20, 'default cycleSeconds');
        t.equal(layer.config.visConfig.smoothing, 4, 'default smoothing');
        t.deepEqual(layer.config.color, [255, 255, 255], 'default color white');
        t.ok(
          layer.supportedColumnModes.some(m => m.key === 'GEOJSON_UV'),
          'should support GEOJSON_UV column mode'
        );
        t.ok(
          layer.supportedColumnModes.some(m => m.key === 'GEOJSON_SPEED_DIR'),
          'should support GEOJSON_SPEED_DIR column mode'
        );
        t.ok(
          layer.supportedColumnModes.some(m => m.key === 'GEOJSON_ELEVATION'),
          'should support GEOJSON_ELEVATION column mode'
        );
      }
    }
  ];

  testCreateCases(t, FlowFieldLayer, TEST_CASES);
  t.end();
});

test('#FlowFieldLayer -> findDefaultLayerProps', t => {
  const dataset = createFlowFieldDataset();
  const {props} = FlowFieldLayer.findDefaultLayerProps(dataset);
  t.equal(props.length, 1, 'should find one default flow field layer');
  t.equal(props[0].columnMode, 'UV', 'should use UV mode');
  t.ok(props[0].columns.lat, 'should set lat');
  t.ok(props[0].columns.lng, 'should set lng');
  t.ok(props[0].columns.u, 'should set u');
  t.ok(props[0].columns.v, 'should set v');
  t.end();
});

test('#FlowFieldLayer -> formatLayerData', t => {
  const dataset = createFlowFieldDataset();
  const TEST_CASES = [
    {
      name: 'flow field uv',
      layer: {
        type: 'flowField',
        id: 'flow_field_uv',
        config: {
          dataId,
          label: 'flow field',
          columnMode: 'UV',
          columns: {
            lat: 'latitude',
            lng: 'longitude',
            u: 'u',
            v: 'v'
          },
          isVisible: true
        }
      },
      datasets: {
        [dataId]: dataset
      },
      assert: result => {
        const {layerData} = result;
        t.ok(layerData.grid, 'should build a grid');
        t.ok(layerData.data?.length >= 4, 'should keep sample points');
        t.ok(Number.isFinite(layerData.grid.maxSpeed), 'grid has maxSpeed');
        t.equal(layerData.grid.alt, null, 'should not invent a zero altitude grid');
      }
    }
  ];

  testFormatLayerDataCases(t, FlowFieldLayer, TEST_CASES);
  t.end();
});

test('#FlowFieldLayer -> findDefaultLayerProps altitude', t => {
  const dataset = createDatasetFromCsv(elevCsv, 'elev-data');
  const {props} = FlowFieldLayer.findDefaultLayerProps(dataset);
  t.equal(props.length, 1, 'should find one default flow field layer from altitude');
  t.equal(props[0].columnMode, 'ELEVATION', 'should use ELEVATION mode');
  t.ok(props[0].columns.altitude, 'should set altitude column (maps elevation field)');
  t.end();
});

test('#FlowFieldLayer -> formatLayerData from altitude', t => {
  const dataset = createDatasetFromCsv(elevCsv, dataId);
  const TEST_CASES = [
    {
      name: 'flow field altitude',
      layer: {
        type: 'flowField',
        id: 'flow_field_alt',
        config: {
          dataId,
          label: 'flow field altitude',
          columnMode: 'ELEVATION',
          columns: {
            lat: 'latitude',
            lng: 'longitude',
            altitude: 'elevation'
          },
          isVisible: true
        }
      },
      datasets: {
        [dataId]: dataset
      },
      assert: result => {
        const {layerData} = result;
        t.ok(layerData.grid, 'should build a grid from altitude');
        t.ok(layerData.grid.alt, 'grid should keep altitude for path Z');
        t.ok(Number.isFinite(layerData.grid.maxSpeed), 'grid has maxSpeed from slope');
        t.ok(layerData.grid.maxSpeed > 0, 'downhill gradient should be non-zero');
      }
    }
  ];

  testFormatLayerDataCases(t, FlowFieldLayer, TEST_CASES);
  t.end();
});

test('#FlowFieldLayer -> findDefaultLayerProps speed/direction', t => {
  const dataset = createDatasetFromCsv(speedDirCsv, 'speed-dir-data');
  const {props} = FlowFieldLayer.findDefaultLayerProps(dataset);
  t.equal(props.length, 1, 'should find one default flow field layer from speed/dir');
  t.equal(props[0].columnMode, 'SPEED_DIR', 'should use SPEED_DIR mode');
  t.ok(props[0].columns.speed, 'should set speed');
  t.ok(props[0].columns.direction, 'should set direction');
  t.end();
});

test('#FlowFieldLayer -> formatLayerData from speed/direction', t => {
  const dataset = createDatasetFromCsv(speedDirCsv, dataId);
  const TEST_CASES = [
    {
      name: 'flow field speed dir',
      layer: {
        type: 'flowField',
        id: 'flow_field_speed',
        config: {
          dataId,
          label: 'flow field speed',
          columnMode: 'SPEED_DIR',
          columns: {
            lat: 'latitude',
            lng: 'longitude',
            speed: 'speed',
            direction: 'direction'
          },
          isVisible: true
        }
      },
      datasets: {
        [dataId]: dataset
      },
      assert: result => {
        const {layerData} = result;
        t.ok(layerData.grid, 'should build a grid from speed/direction');
        t.ok(layerData.data?.length >= 4, 'should keep sample points');
        // Meteorological from-direction 0° (from N) → u=0, v=-speed
        const north = layerData.data.find(d => d.lat === 37 && d.lng === -122);
        t.ok(north, 'should include first point');
        t.ok(Math.abs(north.u) < 1e-6, 'from-north wind has ~0 eastward u');
        t.ok(north.v < 0, 'from-north wind has negative northward v');
      }
    }
  ];

  testFormatLayerDataCases(t, FlowFieldLayer, TEST_CASES);
  t.end();
});

test('#FlowFieldLayer -> renderLayer', t => {
  const dataset = createFlowFieldDataset();
  const TEST_CASES = [
    {
      name: 'flow field render uv',
      layer: {
        type: 'flowField',
        id: 'flow_field_render',
        config: {
          dataId,
          label: 'flow field',
          columnMode: 'UV',
          columns: {
            lat: 'latitude',
            lng: 'longitude',
            u: 'u',
            v: 'v'
          },
          isVisible: true,
          visConfig: {
            linesPerScreen: 200,
            smoothing: 0
          }
        }
      },
      datasets: {
        [dataId]: dataset
      },
      assert: (deckLayers, layer) => {
        t.equal(layer.type, 'flowField', 'should be flowField layer');
        t.ok(Array.isArray(deckLayers), 'should return deck layers array');
        t.ok(deckLayers.length >= 1, 'should create at least one deck.gl layer');
        t.equal(deckLayers[0].id, 'flow_field_render', 'deck layer id matches');
      }
    }
  ];

  testRenderLayerCases(t, FlowFieldLayer, TEST_CASES);
  t.end();
});

const flowGeojsonFc = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {u: 1.0, v: 0.5},
      geometry: {type: 'Point', coordinates: [-122.0, 37.0]}
    },
    {
      type: 'Feature',
      properties: {u: 1.1, v: 0.4},
      geometry: {
        type: 'LineString',
        coordinates: [
          [-122.0, 37.5],
          [-121.9, 37.6]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {u: 0.9, v: 0.6},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-122.0, 38.0],
            [-121.9, 38.0],
            [-121.9, 38.1],
            [-122.0, 38.1],
            [-122.0, 38.0]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {u: 1.2, v: 0.3},
      geometry: {type: 'Point', coordinates: [-121.5, 37.0]}
    }
  ]
};

function createFlowFieldGeojsonDataset(id = 'flow-geojson-data') {
  const parsed = processGeojson(flowGeojsonFc);
  const dataset = new KeplerTable({
    info: {id, label: id},
    color: [255, 255, 255]
  });
  dataset.importData({
    data: {fields: parsed.fields, rows: parsed.rows}
  });
  dataset.fieldPairs = findPointFieldPairs(dataset.fields);
  dataset.gpuFilter = getGpuFilterProps([], id, dataset.fields);
  return dataset;
}

test('#FlowFieldLayer -> findDefaultLayerProps geojson', t => {
  const dataset = createFlowFieldGeojsonDataset();
  const {props, altProps} = FlowFieldLayer.findDefaultLayerProps(dataset);
  t.equal(props.length, 1, 'geojson-only dataset should create a Flow Field prop');
  t.equal(altProps?.length || 0, 0, 'should not need altProps when geojson is primary');
  t.equal(props[0].columnMode, 'GEOJSON_UV', 'should use GEOJSON_UV mode');
  t.ok(props[0].columns.geojson, 'should set geojson column');
  t.ok(props[0].columns.u, 'should set u');
  t.ok(props[0].columns.v, 'should set v');
  t.end();
});

test('#FlowFieldLayer -> formatLayerData from geojson centroids', t => {
  const dataset = createFlowFieldGeojsonDataset(dataId);
  const TEST_CASES = [
    {
      name: 'flow field geojson uv',
      layer: {
        type: 'flowField',
        id: 'flow_field_geojson_uv',
        config: {
          dataId,
          label: 'flow field geojson',
          columnMode: 'GEOJSON_UV',
          columns: {
            geojson: '_geojson',
            u: 'u',
            v: 'v'
          },
          isVisible: true
        }
      },
      datasets: {
        [dataId]: dataset
      },
      assert: result => {
        const {layerData} = result;
        t.ok(layerData.grid, 'should build a grid from geojson centroids');
        t.equal(layerData.data?.length, 4, 'should keep one sample per feature');
        const point = layerData.data.find(d => d.lng === -122 && d.lat === 37);
        t.ok(point, 'Point geometry should use its coordinates as position');
        t.equal(point.u, 1.0, 'should keep u from properties');
        t.equal(point.v, 0.5, 'should keep v from properties');

        const line = layerData.data.find(
          d => Math.abs(d.lng - -121.95) < 1e-9 && Math.abs(d.lat - 37.55) < 1e-9
        );
        t.ok(line, 'LineString should use vertex-average centroid');

        // Polygon centroid averages all ring vertices including the closing duplicate
        const polyCoords = [
          [-122.0, 38.0],
          [-121.9, 38.0],
          [-121.9, 38.1],
          [-122.0, 38.1],
          [-122.0, 38.0]
        ];
        const expectedPolyLng = polyCoords.reduce((s, c) => s + c[0], 0) / polyCoords.length;
        const expectedPolyLat = polyCoords.reduce((s, c) => s + c[1], 0) / polyCoords.length;
        const poly = layerData.data.find(
          d => Math.abs(d.lng - expectedPolyLng) < 1e-9 && Math.abs(d.lat - expectedPolyLat) < 1e-9
        );
        t.ok(poly, 'Polygon should use boundary-vertex-average centroid');
      }
    }
  ];

  testFormatLayerDataCases(t, FlowFieldLayer, TEST_CASES);
  t.end();
});
