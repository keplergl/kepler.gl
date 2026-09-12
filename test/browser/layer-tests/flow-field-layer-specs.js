// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';

import {testCreateCases, testFormatLayerDataCases} from 'test/helpers/layer-utils';
import {KeplerGlLayers} from '@kepler.gl/layers';
import {getGpuFilterProps, KeplerTable} from '@kepler.gl/table';
import {processCsvData} from '@kepler.gl/processors';
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

const {rows, fields} = processCsvData(flowCsv);

function createFlowFieldDataset() {
  const dataset = new KeplerTable({
    info: {id: dataId, label: 'flow-field-data'},
    color: [255, 255, 255]
  });
  dataset.importData({
    data: {fields, rows}
  });
  dataset.fieldPairs = findPointFieldPairs(dataset.fields);
  dataset.gpuFilter = getGpuFilterProps([], dataId, dataset.fields);
  return dataset;
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
  const {props} = FlowFieldLayer.findDefaultLayerProps(dataset);
  const TEST_CASES = [
    {
      props: {
        ...props[0],
        dataId,
        label: 'flow field'
      },
      data: [dataset],
      assert: result => {
        const {layerData} = result;
        t.ok(layerData.grid, 'should build a grid');
        t.ok(layerData.data?.length >= 4, 'should keep sample points');
        t.ok(Number.isFinite(layerData.grid.maxSpeed), 'grid has maxSpeed');
      }
    }
  ];

  testFormatLayerDataCases(t, FlowFieldLayer, TEST_CASES);
  t.end();
});

test('#FlowFieldLayer -> findDefaultLayerProps altitude', t => {
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
  const elevParsed = processCsvData(elevCsv);
  const dataset = new KeplerTable({
    info: {id: 'elev-data', label: 'elev-data'},
    color: [255, 255, 255]
  });
  dataset.importData({data: {fields: elevParsed.fields, rows: elevParsed.rows}});
  dataset.fieldPairs = findPointFieldPairs(dataset.fields);
  dataset.gpuFilter = getGpuFilterProps([], 'elev-data', dataset.fields);

  const {props} = FlowFieldLayer.findDefaultLayerProps(dataset);
  t.equal(props.length, 1, 'should find one default flow field layer from altitude');
  t.equal(props[0].columnMode, 'ELEVATION', 'should use ELEVATION mode');
  t.ok(props[0].columns.altitude, 'should set altitude column (maps elevation field)');
  t.end();
});

test('#FlowFieldLayer -> formatLayerData from altitude', t => {
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
  const elevParsed = processCsvData(elevCsv);
  const dataset = new KeplerTable({
    info: {id: dataId, label: 'elev-data'},
    color: [255, 255, 255]
  });
  dataset.importData({data: {fields: elevParsed.fields, rows: elevParsed.rows}});
  dataset.fieldPairs = findPointFieldPairs(dataset.fields);
  dataset.gpuFilter = getGpuFilterProps([], dataId, dataset.fields);

  const {props} = FlowFieldLayer.findDefaultLayerProps(dataset);
  const TEST_CASES = [
    {
      props: {
        ...props[0],
        dataId,
        label: 'flow field altitude'
      },
      data: [dataset],
      assert: result => {
        const {layerData} = result;
        t.ok(layerData.grid, 'should build a grid from altitude');
        t.ok(Number.isFinite(layerData.grid.maxSpeed), 'grid has maxSpeed from slope');
        t.ok(layerData.grid.maxSpeed > 0, 'downhill gradient should be non-zero');
      }
    }
  ];

  testFormatLayerDataCases(t, FlowFieldLayer, TEST_CASES);
  t.end();
});
