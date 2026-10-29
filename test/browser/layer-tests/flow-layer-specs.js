// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';

import {testCreateCases, dataId, preparedDataset} from 'test/helpers/layer-utils';
import {KeplerGlLayers} from '@kepler.gl/layers';
import {copyTableAndUpdate} from '@kepler.gl/table';
import {VisStateActions} from '@kepler.gl/actions';
import {INITIAL_VIS_STATE, visStateReducer as reducer} from '@kepler.gl/reducers';
import {processCsvData} from '@kepler.gl/processors';
import {createNewDataEntryMock} from 'test/helpers/table-utils';

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
      'flowLinesRenderingMode',
      'flowAdaptiveScalesEnabled',
      'flowFadeEnabled',
      'flowFadeAmount',
      'maxTopFlowsDisplayNum',
      'flowLocationTotalsEnabled',
      'flowClusteringEnabled',
      'flowLineThicknessScale',
      'flowLineCurviness',
      'darkBaseMapEnabled'
    ],
    'should provide the correct visConfigSettings properties'
  );

  const {visConfig} = layer.config;
  t.equal(visConfig.opacity, 1.0, 'default opacity should be 1.0');
  t.equal(
    visConfig.flowLinesRenderingMode,
    'straight',
    'rendering mode should default to straight'
  );
  t.equal(visConfig.flowAdaptiveScalesEnabled, true, 'adaptive scales should be on by default');
  t.equal(visConfig.flowFadeEnabled, true, 'fade should be on by default');
  t.equal(visConfig.flowFadeAmount, 50, 'fade amount should default to 50');
  t.equal(visConfig.maxTopFlowsDisplayNum, 5000, 'max top flows should default to 5000');
  t.equal(visConfig.flowLocationTotalsEnabled, true, 'location totals should be on by default');
  t.equal(visConfig.flowClusteringEnabled, true, 'clustering should be on by default');
  t.equal(visConfig.flowLineThicknessScale, 1, 'line thickness scale should default to 1');
  t.equal(visConfig.flowLineCurviness, 1, 'line curviness should default to 1');

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

test('#FlowLayer -> styling preserves filters and invalidates changed data', async t => {
  const datasets = await createNewDataEntryMock({
    info: {id: dataId},
    data: processCsvData('lat,lng,lat_1,lng_1,value\n1,2,3,4,0\n2,3,4,5,10\n3,4,5,6,20')
  });
  const layer = new FlowLayer({dataId});
  layer.updateLayerConfig({
    columns: {
      lat0: {value: 'lat', fieldIdx: 0},
      lng0: {value: 'lng', fieldIdx: 1},
      lat1: {value: 'lat_1', fieldIdx: 2},
      lng1: {value: 'lng_1', fieldIdx: 3},
      count: {value: 'value', fieldIdx: 4}
    }
  });
  let state = {
    ...INITIAL_VIS_STATE,
    datasets,
    layers: [layer],
    layerData: [layer.formatLayerData(datasets, {})],
    layerOrder: [layer.id]
  };
  const setRange = value => {
    state = reducer(state, VisStateActions.setFilter(0, 'value', value));
  };
  const checkStyles = (expected, message) => {
    const previousFlows = state.layerData[0].layerData.flows;
    t.deepEqual(
      previousFlows.map(d => d.index),
      expected,
      message
    );
    [
      {flowLineThicknessScale: 2},
      {flowLinesRenderingMode: 'curved'},
      {flowLineThicknessScale: 1},
      {flowLinesRenderingMode: 'straight'}
    ].forEach(style => {
      state = reducer(state, VisStateActions.layerVisConfigChange(state.layers[0], style));
      t.equal(state.layerData[0].layerData.flows, previousFlows, 'styling retains the flow array');
      t.deepEqual(
        state.layerData[0].layerData.flows.map(d => d.index),
        expected,
        message
      );
    });
  };
  const addFilter = () => {
    state = reducer(state, VisStateActions.addFilter(dataId));
    state = reducer(state, VisStateActions.setFilter(0, 'name', 'value'));
    setRange([5, 15]);
  };
  addFilter();
  t.equal(state.filters[0].gpu, true, 'exercises GPU-configured filtering on the CPU Flow layer');
  checkStyles([1], 'range [5,15] retains only the middle flow');
  t.deepEqual(state.filters[0].value, [5, 15], 'styling keeps the active selection');

  setRange([15, 20]);
  checkStyles([2], 'a changed range selects the last flow');
  setRange([11, 15]);
  checkStyles([], 'an empty filter result stays empty');
  state = reducer(state, VisStateActions.removeFilter(0));
  checkStyles([0, 1, 2], 'removing the filter restores all flows');
  addFilter();
  checkStyles([1], 'reapplying the same filter does not reuse unfiltered flows');

  state = reducer(state, VisStateActions.setFilter(0, 'gpu', false));
  checkStyles([1], 'CPU filtering preserves the middle flow');
  setRange([15, 20]);
  checkStyles([2], 'CPU filter changes refresh flows');
  state = reducer(state, VisStateActions.setFilter(0, 'gpu', true));
  setRange([5, 15]);
  checkStyles([1], 'switching back to GPU filtering refreshes flows');

  state = reducer(
    state,
    VisStateActions.addToDataset(dataId, [
      [4, 5, 6, 7, 12],
      [5, 6, 7, 8, 30]
    ])
  );
  checkStyles([1, 3], 'data refresh includes only the matching new flow');
  const rebuilt = state.layers[0].formatLayerData(state.datasets, {});
  t.deepEqual(
    rebuilt.layerData.flows.map(d => d.index),
    [1, 3],
    'missing old data is filtered anew'
  );
  t.end();
});

test('#FlowLayer -> reducer filters at the domain minimum', async t => {
  for (const minimum of [0, 100, -20]) {
    const data = processCsvData(
      `lat,lng,lat_1,lng_1,value,other\n1,2,3,4,${minimum + 20},0\n2,3,4,5,${minimum},0\n3,4,5,6,${
        minimum + 10
      },10`
    );
    const originalRows = data.rows.map(row => row.slice());
    const datasets = await createNewDataEntryMock({info: {id: dataId}, data});
    const layer = new FlowLayer({dataId});
    layer.updateLayerConfig({
      columns: {
        lat0: {value: 'lat', fieldIdx: 0},
        lng0: {value: 'lng', fieldIdx: 1},
        lat1: {value: 'lat_1', fieldIdx: 2},
        lng1: {value: 'lng_1', fieldIdx: 3},
        count: {value: 'value', fieldIdx: 4}
      }
    });
    const initialData = layer.formatLayerData(datasets, {});
    const originalFlows = initialData.layerData.flows.map(flow => ({...flow}));
    let state = {
      ...INITIAL_VIS_STATE,
      datasets,
      layers: [layer],
      layerData: [initialData],
      layerOrder: [layer.id]
    };
    const apply = action => {
      state = reducer(state, action);
    };
    const check = (indexes, message) => {
      t.deepEqual(
        state.layerData[0].layerData.flows,
        indexes.map(index => originalFlows[index]),
        `${minimum}: ${message} preserves source indexes, locations and magnitudes`
      );
    };

    check([0, 1, 2], 'no filter');
    apply(VisStateActions.addFilter(dataId));
    apply(VisStateActions.setFilter(0, 'name', 'value'));
    apply(VisStateActions.setFilter(0, 'value', [minimum, minimum]));
    t.equal(state.filters[0].gpu, true, 'exercises a GPU-configured numeric filter');
    t.deepEqual(
      state.datasets[dataId].gpuFilter.filterRange,
      [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0]
      ],
      'the active minimum-only range normalizes to zero in every channel'
    );
    t.deepEqual(
      state.datasets[dataId].filteredIndex,
      [0, 1, 2],
      'the GPU filter leaves the CPU indexes unchanged'
    );
    check([1], 'minimum-only filter');
    const minimumFlows = state.layerData[0].layerData.flows;
    apply(VisStateActions.layerVisConfigChange(state.layers[0], {flowLineThicknessScale: 2}));
    check([1], 'styling retains the minimum-only filter');
    t.equal(state.layerData[0].layerData.flows, minimumFlows, 'styling reuses filtered flows');

    apply(VisStateActions.setFilter(0, 'value', [minimum + 10, minimum + 20]));
    check([0, 2], 'ordinary range');
    apply(VisStateActions.addFilter(dataId));
    apply(VisStateActions.setFilter(1, 'name', 'other'));
    apply(VisStateActions.setFilter(1, 'value', [0, 0]));
    check([0], 'multiple channels intersect');
    apply(VisStateActions.setFilter(0, 'value', [minimum, minimum]));
    check([1], 'multiple active zero ranges');

    apply(VisStateActions.setFilter(1, 'gpu', false));
    apply(VisStateActions.setFilter(1, 'value', [10, 10]));
    t.deepEqual(state.datasets[dataId].filteredIndex, [2], 'CPU filtering retains source indexes');
    check([], 'CPU and GPU filters can produce no flows');
    apply(VisStateActions.setFilter(0, 'value', [minimum + 10, minimum + 20]));
    check([2], 'GPU filtering respects the CPU-filtered indexes');
    apply(VisStateActions.removeFilter(1));
    check([0, 2], 'removing the CPU filter restores matching GPU rows in order');
    apply(VisStateActions.removeFilter(0));
    check([0, 1, 2], 'clearing filters restores all flows');

    const emptyDataset = copyTableAndUpdate(state.datasets[dataId], {filteredIndex: []});
    t.deepEqual(
      state.layers[0].formatLayerData({[dataId]: emptyDataset}, state.layerData[0]).layerData.flows,
      [],
      'empty CPU input yields no flows'
    );
    t.deepEqual(data.rows, originalRows, 'filtering leaves source rows unchanged');
    t.deepEqual(
      initialData.data,
      originalFlows,
      'filtering leaves the original flow data unchanged'
    );
  }
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
  t.equal(result.fieldValues[2].labelMessage, 'flow.tooltip.flow.count', 'should have count label');

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

function flowRenderOpts(layer, filteredIndex) {
  layer.updateLayerConfig({
    columns: {
      lat0: {value: 'lat', fieldIdx: 1},
      lng0: {value: 'lng', fieldIdx: 2},
      lat1: {value: 'lat_1', fieldIdx: 3},
      lng1: {value: 'lng_1', fieldIdx: 4}
    },
    columnMode: 'LAT_LNG'
  });
  const dataset = copyTableAndUpdate(preparedDataset, {filteredIndex});
  layer.updateLayerMeta(dataset);
  layer.updateLayerDomain({[dataId]: dataset});
  return {
    data: layer.formatLayerData({[dataId]: dataset}, {}),
    gpuFilter: {},
    objectHovered: null,
    mapState: {},
    layerCallbacks: {onLayerHover: () => {}},
    idx: 0,
    visible: true
  };
}

test('#FlowLayer -> renderLayer when a new layer replaces the old one', t => {
  // Replacing a dataset builds a new layer with the same id, and deck matches
  // the new FlowmapLayer to the old one by that id. FlowmapLayer takes up the
  // new data provider only when `data` changes, so the new layer must not hand
  // deck a value the old one already did, or the old flows stay on the map.
  const before = new FlowLayer({id: 'flows', dataId, label: 'before refresh'});
  const after = new FlowLayer({id: 'flows', dataId, label: 'after refresh'});

  const [oldDeckLayer] = before.renderLayer(flowRenderOpts(before, [0, 1, 3]));
  const [newDeckLayer] = after.renderLayer(flowRenderOpts(after, [0, 1, 3, 4, 5]));

  t.equal(newDeckLayer.id, oldDeckLayer.id, 'both deck layers should share the id deck matches by');
  t.notEqual(
    newDeckLayer.props.data,
    oldDeckLayer.props.data,
    'the new layer should pass a data value the old one never passed'
  );

  t.end();
});

test('#FlowLayer -> renderLayer keeps its data value while the flows are unchanged', t => {
  // Each frame of an animation renders again with the same layer data; a new
  // value every time would make FlowmapLayer rebuild its data on every frame.
  const layer = new FlowLayer({id: 'flows', dataId, label: 'stable'});
  const opts = flowRenderOpts(layer, [0, 1, 3]);

  const [first] = layer.renderLayer(opts);
  const [second] = layer.renderLayer(opts);

  t.equal(second.props.data, first.props.data, 'the data value should not move without new flows');

  t.end();
});
