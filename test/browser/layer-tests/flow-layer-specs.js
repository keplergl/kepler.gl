// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';

import {testCreateCases, dataId, preparedDataset} from 'test/helpers/layer-utils';
import {KeplerGlLayers} from '@kepler.gl/layers';
import {copyTableAndUpdate} from '@kepler.gl/table';

const {FlowLayer} = KeplerGlLayers;

test('#FlowLayer -> constructor', t => {
  const TEST_CASES = {
    CREATE: [
      {
        props: {
          dataId: 'smoothie',
          isVisible: true,
          label: 'test flow layer'
        },
        test: layer => {
          t.ok(layer.config.dataId === 'smoothie', 'FlowLayer dataId should be correct');
          t.ok(layer.type === 'flow', 'type should be flow');
          t.ok(layer.isAggregated === true, 'FlowLayer is aggregated');
          t.ok(layer.config.label === 'test flow layer', 'label should be correct');
          t.ok(Object.keys(layer.columnPairs).length, 'should have columnPairs');
        }
      }
    ]
  };

  testCreateCases(t, FlowLayer, TEST_CASES.CREATE);
  t.end();
});

test('#FlowLayer -> constructor defaults', t => {
  const layer = new FlowLayer({dataId: 'test'});

  t.deepEqual(
    layer.supportedColumnModes.map(m => m.key),
    ['LAT_LNG', 'H3'],
    'should support LAT_LNG and H3 column modes'
  );

  t.deepEqual(
    Object.keys(layer.visConfigSettings),
    [
      'colorRange',
      'opacity',
      'flowAnimationEnabled',
      'flowAdaptiveScalesEnabled',
      'flowFadeEnabled',
      'flowFadeAmount',
      'maxTopFlowsDisplayNum',
      'flowLocationTotalsEnabled',
      'flowClusteringEnabled',
      'flowCurvedLinesEnabled',
      'darkBaseMapEnabled'
    ],
    'should provide the correct visConfigSettings properties'
  );

  const {visConfig} = layer.config;
  t.equal(visConfig.opacity, 1.0, 'default opacity should be 1.0');
  t.equal(visConfig.flowAnimationEnabled, false, 'animation should be off by default');
  t.equal(visConfig.flowAdaptiveScalesEnabled, true, 'adaptive scales should be on by default');
  t.equal(visConfig.flowFadeEnabled, true, 'fade should be on by default');
  t.equal(visConfig.flowFadeAmount, 50, 'fade amount should default to 50');
  t.equal(visConfig.maxTopFlowsDisplayNum, 5000, 'max top flows should default to 5000');
  t.equal(visConfig.flowLocationTotalsEnabled, true, 'location totals should be on by default');
  t.equal(visConfig.flowClusteringEnabled, true, 'clustering should be on by default');
  t.equal(visConfig.flowCurvedLinesEnabled, false, 'curved lines should be off by default');

  t.end();
});

test('#FlowLayer -> findDefaultLayerProps', t => {
  const result = FlowLayer.findDefaultLayerProps();
  t.deepEqual(result, {props: []}, 'should return empty props (no auto-detection)');
  t.end();
});

test('#FlowLayer -> updateLayerMeta', t => {
  const columns = {
    lat0: {value: 'lat', fieldIdx: 1},
    lng0: {value: 'lng', fieldIdx: 2},
    lat1: {value: 'lat_1', fieldIdx: 3},
    lng1: {value: 'lng_1', fieldIdx: 4}
  };

  const layer = new FlowLayer({
    dataId,
    label: 'test flow'
  });

  layer.updateLayerConfig({
    columns,
    columnMode: 'LAT_LNG'
  });

  const filteredIndex = [0, 1, 3, 4, 5, 7, 8];
  const dataset = copyTableAndUpdate(preparedDataset, {filteredIndex});

  t.doesNotThrow(() => {
    layer.updateLayerMeta(dataset);
  }, 'updateLayerMeta should not throw');

  const {meta} = layer;
  t.ok(meta.bounds, 'should have bounds');
  t.equal(meta.bounds.length, 4, 'bounds should have 4 values');
  t.ok(Array.isArray(meta.locations), 'should have locations array');
  t.ok(meta.locations.length > 0, 'should have extracted unique locations');
  t.ok(Array.isArray(meta.clusterLevels), 'should have clusterLevels array');
  t.ok(meta.clusterLevels.length > 0, 'should have at least one cluster level');

  meta.locations.forEach(loc => {
    t.ok(typeof loc.id === 'number', 'location id should be a number');
    t.ok(typeof loc.lat === 'number', 'location lat should be a number');
    t.ok(typeof loc.lon === 'number', 'location lon should be a number');
    t.ok(typeof loc.name === 'string', 'location name should be a string');
  });

  t.end();
});

test('#FlowLayer -> formatLayerData', t => {
  const columns = {
    lat0: {value: 'lat', fieldIdx: 1},
    lng0: {value: 'lng', fieldIdx: 2},
    lat1: {value: 'lat_1', fieldIdx: 3},
    lng1: {value: 'lng_1', fieldIdx: 4}
  };

  const layer = new FlowLayer({
    dataId,
    label: 'test flow format'
  });

  layer.updateLayerConfig({
    columns,
    columnMode: 'LAT_LNG'
  });

  const filteredIndex = [0, 1, 3, 4, 5, 7, 8];
  const dataset = copyTableAndUpdate(preparedDataset, {filteredIndex});

  layer.updateLayerMeta(dataset);
  layer.updateLayerDomain({[dataId]: dataset});

  let result;
  t.doesNotThrow(() => {
    result = layer.formatLayerData({[dataId]: dataset}, {});
  }, 'formatLayerData should not throw');

  t.ok(result, 'should return format result');
  t.ok(result.layerData, 'should have layerData');
  t.ok(Array.isArray(result.layerData.locations), 'layerData should have locations');
  t.ok(Array.isArray(result.layerData.flows), 'layerData should have flows');
  t.ok(Array.isArray(result.layerData.clusterLevels), 'layerData should have clusterLevels');

  t.ok(result.layerData.flows.length > 0, 'should have at least one flow');
  t.ok(result.layerData.locations.length > 0, 'should have at least one location');

  result.layerData.flows.forEach(flow => {
    t.ok(typeof flow.index === 'number', 'flow should have numeric index');
    t.ok(typeof flow.sourceId === 'number', 'flow should have numeric sourceId');
    t.ok(typeof flow.targetId === 'number', 'flow should have numeric targetId');
    t.ok(typeof flow.count === 'number', 'flow should have numeric count');
    t.equal(flow.count, 1, 'count should default to 1 when no count column');
  });

  t.end();
});

test('#FlowLayer -> getHoverData location', t => {
  const layer = new FlowLayer({
    dataId,
    label: 'test flow hover'
  });

  const locationHoverObject = {
    type: 'location',
    location: {name: 'San Francisco'},
    totals: {incomingCount: 100, outgoingCount: 200, internalCount: 10}
  };

  const result = layer.getHoverData(locationHoverObject);
  t.ok(result, 'should return hover data for location');
  t.equal(result.fieldValues.length, 4, 'should have 4 field values for location');
  t.equal(
    result.fieldValues[0].labelMessage,
    'flow.tooltip.location.name',
    'should have name label'
  );
  t.equal(result.fieldValues[0].value, 'San Francisco', 'name value should be correct');
  t.equal(
    result.fieldValues[1].labelMessage,
    'flow.tooltip.location.incomingCount',
    'should have incoming count label'
  );
  t.equal(
    result.fieldValues[2].labelMessage,
    'flow.tooltip.location.outgoingCount',
    'should have outgoing count label'
  );
  t.equal(
    result.fieldValues[3].labelMessage,
    'flow.tooltip.location.internalCount',
    'should have internal count label'
  );

  t.end();
});

test('#FlowLayer -> getHoverData flow', t => {
  const layer = new FlowLayer({
    dataId,
    label: 'test flow hover'
  });

  const flowHoverObject = {
    type: 'flow',
    origin: {name: 'San Francisco'},
    dest: {name: 'Los Angeles'},
    count: 150
  };

  const result = layer.getHoverData(flowHoverObject);
  t.ok(result, 'should return hover data for flow');
  t.equal(result.fieldValues.length, 3, 'should have 3 field values for flow');
  t.equal(
    result.fieldValues[0].labelMessage,
    'flow.tooltip.flow.sourceName',
    'should have source name label'
  );
  t.equal(result.fieldValues[0].value, 'San Francisco', 'source name value should be correct');
  t.equal(
    result.fieldValues[1].labelMessage,
    'flow.tooltip.flow.targetName',
    'should have target name label'
  );
  t.equal(result.fieldValues[1].value, 'Los Angeles', 'target name value should be correct');
  t.equal(
    result.fieldValues[2].labelMessage,
    'flow.tooltip.flow.count',
    'should have count label'
  );

  t.end();
});

test('#FlowLayer -> getHoverData unknown type', t => {
  const layer = new FlowLayer({
    dataId,
    label: 'test flow hover'
  });

  const result = layer.getHoverData({type: 'unknown'});
  t.equal(result, null, 'should return null for unknown picking type');

  const resultNull = layer.getHoverData(null);
  t.equal(resultNull, null, 'should return null for null input');

  t.end();
});

test('#FlowLayer -> renderLayer returns empty when no data', t => {
  const layer = new FlowLayer({
    dataId,
    label: 'test flow render'
  });

  const result = layer.renderLayer({
    data: {layerData: null},
    gpuFilter: {},
    objectHovered: null,
    mapState: {},
    layerCallbacks: {onLayerHover: () => {}},
    idx: 0,
    visible: true
  });

  t.ok(Array.isArray(result), 'should return an array');
  t.equal(result.length, 0, 'should return empty array when no layerData');

  t.end();
});
