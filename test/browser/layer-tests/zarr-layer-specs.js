// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape-catch';
import {
  KeplerGlLayers,
  findNearestTimeIndex,
  getZarrMaxZoom,
  getZarrSelection,
  getZarrSublayerId,
  getZarrTileByteLength
} from '@kepler.gl/layers';
import {DatasetType} from '@kepler.gl/constants';
import {createNewDataEntry, getZarrAxis, getZarrMetadata} from '@kepler.gl/table';
import SchemaManager from '@kepler.gl/schemas';
import {InitialState} from 'test/helpers/mock-state';
import {
  duplicateLayerUpdater,
  layerVisConfigChangeUpdater,
  validateLayerWithData
} from '@kepler.gl/reducers';

const {ZarrLayer} = KeplerGlLayers;

const DAY = 24 * 60 * 60 * 1000;
const T0 = Date.UTC(2020, 0, 27);

const TIME_DIMENSION = {
  name: 'time',
  size: 3,
  values: [T0, T0 + DAY, T0 + 2 * DAY]
};

const BAND_DIMENSION = {name: 'band', size: 4};

const TEMPERATURE = {
  path: 'temperature',
  name: 'temperature',
  shape: [3, 4, 256, 256],
  chunks: [1, 1, 256, 256],
  dtype: 'float32',
  nonSpatialDims: [TIME_DIMENSION, BAND_DIMENSION],
  timeDimension: TIME_DIMENSION,
  dataRange: [250, 320],
  nodataValue: -9999
};

const PRECIPITATION = {
  path: 'precipitation',
  name: 'precipitation',
  shape: [256, 256],
  chunks: [256, 256],
  dtype: 'float32',
  nonSpatialDims: []
};

const MOCK_ZARR_DATASET = {
  id: 'zarr-dataset',
  type: DatasetType.ZARR,
  label: 'Test Zarr Dataset',
  fields: [],
  metadata: {
    url: 'https://example.com/store.zarr',
    variable: 'temperature',
    crs: {code: 'EPSG:4326'},
    axes: ['time', 'band', 'y', 'x'],
    xAxisIndex: 3,
    yAxisIndex: 2,
    levels: [{path: '0', shape: [3, 4, 256, 256], chunks: [1, 1, 256, 256]}],
    variables: [TEMPERATURE, PRECIPITATION],
    nonSpatialDims: [TIME_DIMENSION, BAND_DIMENSION],
    timeDimension: TIME_DIMENSION,
    dataRange: TEMPERATURE.dataRange
  }
};

test('#ZarrLayer -> constructor and basic properties', t => {
  const layer = new ZarrLayer({dataId: 'zarr-dataset'});

  t.equal(layer.type, 'zarr', 'should be a zarr layer');
  t.equal(layer.name, 'Zarr', 'should have a display name');
  t.equal(layer.requireData, false, 'should render without rows');
  t.deepEqual(layer.requiredLayerColumns, [], 'should require no columns');
  t.deepEqual(layer.supportedDatasetTypes, [DatasetType.ZARR], 'should only accept zarr datasets');
  t.deepEqual(layer.visualChannels, {}, 'should have no visual channels');
  t.deepEqual(layer.config.visConfig.dimensionIndexes, {}, 'should start with no pinned indexes');
  t.equal(layer.config.visConfig.zarrVariable, null, 'should follow the dataset variable');

  t.end();
});

test('#ZarrLayer -> findDefaultLayerProps', t => {
  const {props} = ZarrLayer.findDefaultLayerProps(MOCK_ZARR_DATASET);

  t.equal(props.length, 1, 'should return one layer prop');
  t.equal(props[0].label, 'Test Zarr Dataset', 'should use the dataset label');
  t.equal(props[0].isVisible, true, 'should be visible by default');
  t.deepEqual(
    props[0].visConfig.rescale,
    [250, 320],
    'should seed the rescale from the advertised data range'
  );

  const nonZarr = ZarrLayer.findDefaultLayerProps({type: 'csv'});
  t.deepEqual(nonZarr.props, [], 'should return no props for a non-zarr dataset');

  t.end();
});

test('#ZarrLayer -> constructor keeps the visConfig it was built with', t => {
  const {props} = ZarrLayer.findDefaultLayerProps(MOCK_ZARR_DATASET);
  const layer = new ZarrLayer({dataId: 'zarr-dataset', ...props[0]});

  t.deepEqual(
    layer.config.visConfig.rescale,
    [250, 320],
    'should keep the advertised range instead of the 0-1 placeholder'
  );

  const restored = new ZarrLayer({
    dataId: 'zarr-dataset',
    visConfig: {zarrVariable: 'precipitation', rescale: [0, 50]}
  });
  t.equal(
    restored.config.visConfig.zarrVariable,
    'precipitation',
    'should restore a saved variable'
  );
  t.deepEqual(restored.config.visConfig.rescale, [0, 50], 'should restore a saved rescale');

  t.end();
});

test('#ZarrLayer -> updateLayerMeta points the rescale control at the variable', t => {
  const layer = new ZarrLayer({dataId: 'zarr-dataset'});
  layer.updateLayerMeta(MOCK_ZARR_DATASET);

  t.deepEqual(
    layer.config.visConfig.rescale,
    [250, 320],
    'should replace the placeholder with the variable range'
  );
  t.deepEqual(
    layer.visConfigSettings.rescale.range,
    [250, 320],
    'should let the slider reach the data'
  );

  layer.updateLayerVisConfig({rescale: [260, 300]});
  layer.updateLayerMeta(MOCK_ZARR_DATASET);
  t.deepEqual(
    layer.config.visConfig.rescale,
    [260, 300],
    'should leave a range chosen for the same variable alone'
  );

  // `precipitation` advertises no range, so the first tile has to supply one.
  layer.updateLayerVisConfig({zarrVariable: 'precipitation'});
  layer.updateLayerMeta(MOCK_ZARR_DATASET);
  t.deepEqual(
    layer.config.visConfig.rescale,
    [0, 1],
    'should not keep the previous variable range after a switch'
  );
  t.deepEqual(
    layer.visConfigSettings.rescale.range,
    [0, 1],
    'should not use the dataset default variable statistics as slider bounds'
  );

  layer.updateLayerVisConfig({rescale: [0, 50]});
  layer.updateLayerMeta(MOCK_ZARR_DATASET);
  t.deepEqual(layer.config.visConfig.rescale, [0, 50], 'keeps a custom range for the new variable');
  layer.updateLayerVisConfig({zarrVariable: 'temperature'});
  layer.updateLayerMeta(MOCK_ZARR_DATASET);
  t.deepEqual(
    layer.config.visConfig.rescale,
    [250, 320],
    'restores the selected variable statistics'
  );

  t.end();
});

test('#ZarrLayer -> updateLayerMeta populates the animation domain', t => {
  const layer = new ZarrLayer({dataId: 'zarr-dataset'});
  layer.updateLayerMeta(MOCK_ZARR_DATASET);

  const {animation} = layer.config;
  t.equal(animation.enabled, true, 'should enable animation for a time dimension');
  t.deepEqual(animation.domain, [T0, T0 + 2 * DAY], 'should span the time coordinate');
  t.deepEqual(animation.timeSteps, TIME_DIMENSION.values, 'should expose the discrete instants');
  t.equal(animation.startTime, T0, 'should start at the first instant');
  t.equal(layer.meta.crs, 'EPSG:4326', 'should record the store crs');

  t.end();
});

test('#ZarrLayer -> updateLayerMeta disables animation without a time dimension', t => {
  const layer = new ZarrLayer({dataId: 'zarr-dataset'});
  layer.updateLayerVisConfig({zarrVariable: 'precipitation'});
  layer.updateLayerMeta(MOCK_ZARR_DATASET);

  t.equal(layer.config.animation.enabled, false, 'should leave animation off');
  t.equal(layer.config.animation.domain, null, 'should clear the domain');

  t.end();
});

test('#ZarrLayer -> formatLayerData resolves the layer variable', t => {
  const datasets = {'zarr-dataset': MOCK_ZARR_DATASET};

  const layer = new ZarrLayer({dataId: 'zarr-dataset'});
  t.equal(
    layer.formatLayerData(datasets).variable.path,
    'temperature',
    'should default to the dataset variable'
  );

  const second = new ZarrLayer({dataId: 'zarr-dataset'});
  second.updateLayerVisConfig({zarrVariable: 'precipitation'});
  t.equal(
    second.formatLayerData(datasets).variable.path,
    'precipitation',
    'should honor the layer variable override'
  );

  t.deepEqual(
    new ZarrLayer({dataId: 'missing'}).formatLayerData(datasets),
    {metadata: null, variable: null},
    'should return empty data for an unknown dataset'
  );

  t.end();
});

test('#ZarrLayer -> findNearestTimeIndex', t => {
  const steps = TIME_DIMENSION.values;

  t.equal(findNearestTimeIndex(steps, T0), 0, 'should match the first instant');
  t.equal(findNearestTimeIndex(steps, T0 + 2 * DAY), 2, 'should match the last instant');
  t.equal(findNearestTimeIndex(steps, T0 + 0.4 * DAY), 0, 'should round down to the nearest');
  t.equal(findNearestTimeIndex(steps, T0 + 0.6 * DAY), 1, 'should round up to the nearest');
  t.equal(findNearestTimeIndex(steps, T0 - 10 * DAY), 0, 'should clamp below the domain');
  t.equal(findNearestTimeIndex(steps, T0 + 99 * DAY), 2, 'should clamp above the domain');
  t.equal(findNearestTimeIndex([], T0), 0, 'should fall back to index 0 without steps');

  t.end();
});

test('#ZarrLayer -> getZarrTileByteLength', t => {
  // deck caps its tile cache by reported bytes, so a fixed four bytes per pixel
  // would halve a float64 tile and quadruple an int8 one.
  t.equal(
    getZarrTileByteLength(new Float64Array(16), 4, 4),
    128,
    'should report the full size of a 64-bit tile'
  );
  t.equal(
    getZarrTileByteLength(new Int8Array(16), 4, 4),
    16,
    'should report the smaller size of an 8-bit tile'
  );
  t.equal(
    getZarrTileByteLength(new BigInt64Array(16), 4, 4),
    128,
    'should report the full size of a BigInt tile'
  );
  t.equal(
    getZarrTileByteLength([1, 2, 3, 4], 2, 2),
    16,
    'should fall back to four bytes per pixel for a plain array'
  );

  t.end();
});

test('#ZarrLayer -> getZarrSelection', t => {
  t.deepEqual(
    getZarrSelection({variable: TEMPERATURE}),
    {time: 0, band: 0},
    'should default every non-spatial dimension to index 0'
  );

  t.deepEqual(
    getZarrSelection({variable: TEMPERATURE, currentTime: T0 + 2 * DAY}),
    {time: 2, band: 0},
    'should map the animation time onto the time index'
  );

  t.deepEqual(
    getZarrSelection({variable: TEMPERATURE, dimensionIndexes: {band: 2}}),
    {time: 0, band: 2},
    'should pin non-time dimensions from the config'
  );

  t.deepEqual(
    getZarrSelection({variable: TEMPERATURE, dimensionIndexes: {band: 99}}),
    {time: 0, band: 3},
    'should clamp a pinned index to the dimension size'
  );

  t.deepEqual(
    getZarrSelection({variable: PRECIPITATION, currentTime: T0}),
    {},
    'should be empty when the variable is purely spatial'
  );

  t.deepEqual(getZarrSelection({variable: null}), {}, 'should be empty without a variable');

  t.end();
});

test('#ZarrLayer -> getZarrSublayerId', t => {
  t.equal(
    getZarrSublayerId('layer-1', {}),
    'layer-1-ZarrLayer',
    'should leave a purely spatial variable with a plain id'
  );

  t.equal(
    getZarrSublayerId('layer-1', {band: 2, time: 1}),
    getZarrSublayerId('layer-1', {time: 1, band: 2}),
    'should not depend on key order'
  );

  t.notEqual(
    getZarrSublayerId('layer-1', {time: 1, band: 2}),
    getZarrSublayerId('layer-1', {time: 1, band: 3}),
    'should change when a pinned index changes'
  );

  t.end();
});

test('#ZarrLayer -> renderLayer reloads tiles when a dimension changes', async t => {
  const layer = new ZarrLayer({dataId: 'zarr-dataset'});
  // The store opens asynchronously; stand in for an opened node so renderLayer
  // gets as far as building the deck sublayer.
  await layer._loadRuntime();
  layer._nodeKey = `${MOCK_ZARR_DATASET.metadata.url}#temperature`;
  layer._node = {shape: [3, 4, 256, 256]};

  const render = () =>
    layer.renderLayer({
      data: {metadata: MOCK_ZARR_DATASET.metadata, variable: TEMPERATURE},
      mapState: {},
      idx: 0,
      gpuFilter: null,
      layerCallbacks: {},
      visible: true
    });

  const [first] = render();
  t.deepEqual(first.props.selection, {time: 0, band: 0}, 'should select the first slice');

  layer.updateLayerVisConfig({dimensionIndexes: {band: 2}});
  const [second] = render();

  t.deepEqual(second.props.selection, {time: 0, band: 2}, 'should select the pinned slice');
  // deck.gl caches tile data per layer, so only a new id refetches the chunks.
  t.notEqual(second.id, first.id, 'should render under a new sublayer id');

  t.end();
});

test('#ZarrLayer -> renderLayer forwards default and custom map parameters to every slice', async t => {
  const layer = new ZarrLayer({dataId: 'zarr-dataset'});
  await layer._loadRuntime();
  layer._nodeKey = `${MOCK_ZARR_DATASET.metadata.url}#temperature`;
  layer._node = {shape: TEMPERATURE.shape};
  const render = mapState =>
    layer.renderLayer({
      data: {metadata: MOCK_ZARR_DATASET.metadata, variable: TEMPERATURE},
      mapState,
      idx: 0,
      gpuFilter: null,
      layerCallbacks: {},
      visible: true
    });

  const [first] = render({});
  t.deepEqual(
    first.props.parameters,
    {depthTest: true, depthMask: false},
    'uses the common 2D depth defaults'
  );
  t.deepEqual(
    render({dragRotate: true})[0].props.parameters,
    {depthTest: true, depthMask: true},
    'uses the common 3D depth defaults'
  );
  first.props.onViewportLoad();
  layer.updateLayerVisConfig({dimensionIndexes: {band: 2}});

  const parameters = {depthTest: false, depthMask: true, blend: false};
  const slices = render({layerParameters: parameters});
  t.equal(slices.length, 2, 'renders the loaded backdrop and the new slice');
  for (const slice of slices) {
    t.deepEqual(
      slice.props.parameters,
      parameters,
      'honors map depth and blending overrides on each slice'
    );
  }
  t.end();
});

test('#ZarrLayer -> explicit axes fetch source slices independently of the shared clock', async t => {
  const band = {...BAND_DIMENSION, values: ['tavg', 'prec', 'tavg', 'snow'], kind: 'category'};
  const variable = {...TEMPERATURE, nonSpatialDims: [TIME_DIMENSION, band]};
  const layer = new ZarrLayer({
    dataId: 'zarr-dataset',
    visConfig: {
      zarrAxis: {kind: 'dimension', dimension: 'band'},
      dimensionIndexes: {time: 1}
    }
  });
  await layer._loadRuntime();
  layer._nodeKey = `${MOCK_ZARR_DATASET.metadata.url}#temperature`;
  layer._node = {shape: variable.shape};
  layer.updateLayerMeta(MOCK_ZARR_DATASET);
  t.equal(
    layer.config.animation.enabled,
    false,
    'does not contribute categorical positions to the global time domain'
  );
  const render = () =>
    layer.renderLayer({
      data: {metadata: MOCK_ZARR_DATASET.metadata, variable},
      animationConfig: {currentTime: T0 + 2 * DAY},
      mapState: {},
      idx: 0,
      gpuFilter: null,
      layerCallbacks: {},
      visible: true
    })[0];
  const first = render();
  layer.updateLayerVisConfig({zarrFrame: 2});
  const next = render();
  t.deepEqual(
    next.props.selection,
    {time: 1, band: 2},
    'duplicate labels keep their distinct array indices and pinned time'
  );
  t.notEqual(next.id, first.id, 'a frame change fetches a different tile slice');
  t.equal(
    render().props.selection,
    next.props.selection,
    'unchanged frames reuse cached selection'
  );
  layer.updateLayerVisConfig({zarrFrame: 100});
  t.deepEqual(
    render().props.selection,
    {time: 1, band: 3},
    'out of range saved frames clamp safely'
  );
  layer.updateLayerVisConfig({zarrFrame: NaN});
  t.deepEqual(render().props.selection, {time: 1, band: 0}, 'invalid frames use the first slice');
  t.end();
});

test('#ZarrLayer -> a month axis retains year, day and band pins', t => {
  const variable = {
    ...TEMPERATURE,
    nonSpatialDims: [
      {name: 'year', size: 2, values: [2023, 2024]},
      {name: 'month', size: 2, values: [1, 2]},
      {name: 'day', size: 2, values: [28, 29]},
      BAND_DIMENSION
    ],
    timeDimension: undefined
  };
  const axis = getZarrAxis(variable, {kind: 'dimension', dimension: 'month'});
  t.deepEqual(
    getZarrSelection({
      variable,
      axis,
      frameIndex: 1,
      dimensionIndexes: {year: 1, day: 1, band: 3}
    }),
    {year: 1, month: 1, day: 1, band: 3},
    'only the selected month varies while the other dimensions remain pinned'
  );
  t.end();
});

test('#ZarrLayer -> save/load and duplication retain axes and pins; old maps keep automatic time', t => {
  const zarrAxis = {kind: 'dimension', dimension: 'time'};
  const layer = new ZarrLayer({
    dataId: 'zarr-dataset',
    visConfig: {
      zarrAxis,
      zarrFrame: 1,
      dimensionIndexes: {band: 2}
    }
  });
  const state = {
    ...InitialState,
    visState: {
      ...InitialState.visState,
      datasets: {'zarr-dataset': MOCK_ZARR_DATASET},
      layers: [layer],
      layerOrder: [layer.id],
      layerData: [layer.formatLayerData({'zarr-dataset': MOCK_ZARR_DATASET})]
    }
  };
  const saved = SchemaManager.getConfigToSave(state);
  const parsed = SchemaManager.parseSavedConfig(saved).visState.layers[0];
  const restored = validateLayerWithData(
    MOCK_ZARR_DATASET,
    parsed,
    InitialState.visState.layerClasses
  );
  t.deepEqual(restored.config.visConfig.zarrAxis, zarrAxis, 'saves the selected dimension axis');
  t.equal(restored.config.visConfig.zarrFrame, 1, 'restores the selected frame');
  t.deepEqual(
    restored.config.visConfig.dimensionIndexes,
    {band: 2},
    'restores other pinned dimensions'
  );
  const duplicated = duplicateLayerUpdater(state.visState, {id: layer.id});
  const copy = duplicated.layers.find(candidate => candidate.id !== layer.id);
  t.deepEqual(copy.config.visConfig.zarrAxis, zarrAxis, 'duplicates the selected axis');
  t.equal(copy.config.visConfig.zarrFrame, 1, 'duplicates the selected frame');
  t.deepEqual(copy.config.visConfig.dimensionIndexes, {band: 2}, 'duplicates pinned dimensions');
  for (const candidate of [restored, copy]) {
    const {zarrAxis: axisConfig, zarrFrame, dimensionIndexes} = candidate.config.visConfig;
    t.deepEqual(
      getZarrSelection({
        variable: TEMPERATURE,
        axis: getZarrAxis(TEMPERATURE, axisConfig, dimensionIndexes),
        frameIndex: zarrFrame,
        dimensionIndexes
      }),
      {time: 1, band: 2},
      'the restored or duplicated layer selects the original raster slice'
    );
  }
  delete parsed.config.visConfig.zarrAxis;
  delete parsed.config.visConfig.zarrFrame;
  const legacy = validateLayerWithData(
    MOCK_ZARR_DATASET,
    parsed,
    InitialState.visState.layerClasses
  );
  legacy.updateLayerMeta(MOCK_ZARR_DATASET);
  t.equal(legacy.config.animation.enabled, true, 'old configs still enable the shared timeline');
  t.deepEqual(
    legacy.config.animation.timeSteps,
    TIME_DIMENSION.values,
    'retains the existing time steps'
  );
  t.end();
});

test('#ZarrLayer -> URL-only saved maps refetch metadata and restore variable and timeline settings', async t => {
  const originalFetch = globalThis.fetch;
  const url = 'https://example.com/saved-forecast.zarr';
  const array = {
    zarr_format: 2,
    shape: [3, 4, 2, 2],
    chunks: [1, 1, 2, 2],
    dtype: '<f8',
    compressor: null,
    fill_value: null,
    order: 'C',
    filters: null
  };
  const attrs = {
    _ARRAY_DIMENSIONS: ['time', 'band', 'y', 'x'],
    'spatial:dimensions': ['y', 'x'],
    'spatial:transform': [1, 0, 0, 0, -1, 2],
    'spatial:shape': [2, 2],
    'proj:code': 'EPSG:4326',
    actual_range: [0, 100]
  };
  const consolidated = {
    zarr_consolidated_format: 1,
    metadata: {
      '.zgroup': {zarr_format: 2},
      '.zattrs': {},
      'temperature/.zarray': array,
      'temperature/.zattrs': attrs,
      'precipitation/.zarray': array,
      'precipitation/.zattrs': attrs,
      'time/.zarray': {...array, shape: [3], chunks: [3]},
      'time/.zattrs': {_ARRAY_DIMENSIONS: ['time'], units: 'days since 2020-01-27'}
    }
  };
  let metadataRequests = 0;
  globalThis.fetch = async request => {
    if (request.url === `${url}/.zmetadata`) {
      metadataRequests++;
      return new Response(JSON.stringify(consolidated));
    }
    if (request.url === `${url}/time/0`) {
      return new Response(new Float64Array([0, 1, 2]).buffer);
    }
    return new Response(null, {status: 404});
  };
  try {
    const metadata = await getZarrMetadata(url, {variable: 'temperature'});
    const dataset = {...MOCK_ZARR_DATASET, metadata};
    const layer = new ZarrLayer({
      dataId: dataset.id,
      visConfig: {
        zarrVariable: 'precipitation',
        zarrAxis: {kind: 'dimension', dimension: 'time'},
        zarrFrame: 2,
        dimensionIndexes: {band: 1},
        rescale: [10, 80]
      }
    });
    const saved = SchemaManager.save({
      ...InitialState,
      visState: {
        ...InitialState.visState,
        datasets: {[dataset.id]: dataset},
        layers: [layer],
        layerOrder: [layer.id]
      }
    });
    t.deepEqual(
      saved.datasets[0].data.metadata,
      {url, variable: 'temperature'},
      'stores the default source separately from the layer selection'
    );
    const loaded = SchemaManager.load(JSON.parse(JSON.stringify(saved)));
    const task = createNewDataEntry(loaded.datasets[0]);
    const restoredDataset = await new Promise((resolve, reject) => {
      task.run((effect, onSuccess, onError) => effect(onSuccess, onError), resolve, reject);
    });
    t.equal(
      metadataRequests,
      2,
      'reload fetches fresh metadata instead of relying on the in-memory cache'
    );
    t.equal(
      restoredDataset.metadata.variable,
      'temperature',
      'restores the dataset default variable'
    );
    t.deepEqual(
      restoredDataset.metadata.timeDimension.values,
      TIME_DIMENSION.values,
      'rebuilds decoded time coordinates'
    );
    t.equal(restoredDataset.metadata.variables.length, 2, 'rebuilds the variable picker');
    const restored = validateLayerWithData(
      restoredDataset,
      loaded.config.visState.layers[0],
      InitialState.visState.layerClasses
    );
    const data = restored.formatLayerData({[restoredDataset.id]: restoredDataset});
    t.equal(data.variable.path, 'precipitation', 'restores the layer variable override');
    t.deepEqual(restored.config.visConfig.rescale, [10, 80], 'keeps the user color range');
    t.deepEqual(
      getZarrSelection({
        variable: data.variable,
        axis: getZarrAxis(data.variable, restored.config.visConfig.zarrAxis),
        frameIndex: restored.config.visConfig.zarrFrame,
        dimensionIndexes: restored.config.visConfig.dimensionIndexes
      }),
      {time: 2, band: 1},
      'restores the axis, frame and dimension pins against refreshed metadata'
    );
  } finally {
    globalThis.fetch = originalFetch;
    t.end();
  }
});

test('#ZarrLayer -> switching axes reconciles the global animation domain', t => {
  const layer = new ZarrLayer({dataId: 'zarr-dataset'});
  const datasets = {'zarr-dataset': MOCK_ZARR_DATASET};
  const data = layer.formatLayerData(datasets);
  let state = {
    ...InitialState.visState,
    datasets,
    layers: [layer],
    layerOrder: [layer.id],
    layerData: [data],
    animationConfig: {
      ...InitialState.visState.animationConfig,
      domain: [T0, T0 + 2 * DAY],
      currentTime: T0,
      timeSteps: TIME_DIMENSION.values
    }
  };
  state = layerVisConfigChangeUpdater(state, {
    oldLayer: state.layers[0],
    newVisConfig: {
      zarrAxis: {kind: 'dimension', dimension: 'band'},
      zarrFrame: 0
    }
  });
  t.equal(
    state.animationConfig.domain,
    null,
    'removes an explicit dimension from the global clock'
  );
  state = layerVisConfigChangeUpdater(state, {
    oldLayer: state.layers[0],
    newVisConfig: {zarrAxis: {kind: 'auto'}}
  });
  t.deepEqual(
    state.animationConfig.domain,
    [T0, T0 + 2 * DAY],
    'restores automatic time when selected'
  );
  state = layerVisConfigChangeUpdater(state, {
    oldLayer: state.layers[0],
    newVisConfig: {zarrVariable: 'precipitation'}
  });
  t.equal(
    state.animationConfig.domain,
    null,
    'clears the clock when switching to a timeless variable'
  );
  t.end();
});

test('#ZarrLayer -> getZarrMaxZoom', t => {
  // A CarbonPlan pyramid: 128px for the whole world at the coarsest level,
  // doubling to 4096px. Levels are listed finest first.
  const levels = [4096, 2048, 1024, 512, 256, 128].map(size => ({shape: [size, size]}));

  t.equal(getZarrMaxZoom(levels, 0), 2, 'should match the 512px world at zoom 0');
  t.equal(getZarrMaxZoom(levels, 1), 3, 'should take one level per zoom');
  t.equal(getZarrMaxZoom(levels, 3), 5, 'should reach the finest level');
  t.equal(getZarrMaxZoom(levels, 9), 5, 'should not ask for a level the pyramid lacks');
  t.equal(getZarrMaxZoom(levels, -4), 0, 'should not ask for a level below the coarsest');

  t.equal(getZarrMaxZoom(levels, undefined), undefined, 'should defer without a map zoom');
  t.equal(
    getZarrMaxZoom([{shape: [256, 256]}], 4),
    undefined,
    'should defer when there is nothing to choose between'
  );

  t.end();
});

test('#ZarrLayer -> renderLayer caps the level only for a web mercator pyramid', async t => {
  const layer = new ZarrLayer({dataId: 'zarr-dataset'});
  await layer._loadRuntime();
  layer._nodeKey = `${MOCK_ZARR_DATASET.metadata.url}#temperature`;
  layer._node = {shape: [3, 4, 256, 256]};

  const render = metadata =>
    layer.renderLayer({
      data: {metadata, variable: TEMPERATURE},
      mapState: {zoom: 1},
      idx: 0,
      gpuFilter: null,
      layerCallbacks: {},
      visible: true
    })[0];

  const levels = [1024, 512, 256, 128].map(size => ({
    path: String(size),
    shape: [size, size],
    chunks: [128, 128]
  }));

  // deck.gl's own default, i.e. no cap.
  t.equal(
    render({...MOCK_ZARR_DATASET.metadata, levels}).props.maxZoom,
    null,
    'should leave the level to the renderer for an ordinary pyramid'
  );
  t.equal(
    render({...MOCK_ZARR_DATASET.metadata, levels, webMercatorPyramid: true}).props.maxZoom,
    3,
    'should tie the level to the map zoom for a web mercator pyramid'
  );

  t.end();
});

test('#ZarrLayer -> variable switches use the selected grid and pyramid zoom limits', async t => {
  const variable = (path, sizes, webMercatorPyramid) => ({
    ...PRECIPITATION,
    path,
    spatialMetadata: {
      crs: {code: webMercatorPyramid ? 'EPSG:3857' : 'EPSG:4326'},
      axes: webMercatorPyramid ? ['y', 'x'] : ['lat', 'lon'],
      xAxisIndex: 1,
      yAxisIndex: 0,
      levels: sizes.map(size => ({path: String(size), shape: [size, size], chunks: [128, 128]})),
      webMercatorPyramid
    }
  });
  const large = variable('large', [1024, 512, 256, 128], true);
  const small = variable('small', [512, 256], true);
  const plain = variable('plain', [256], false);
  const metadata = {
    ...MOCK_ZARR_DATASET.metadata,
    ...large.spatialMetadata,
    variable: large.path,
    variables: [large, small, plain]
  };
  const datasets = {'zarr-dataset': {...MOCK_ZARR_DATASET, metadata}};
  const layer = new ZarrLayer({dataId: 'zarr-dataset'});
  await layer._loadRuntime();
  const render = selected => {
    layer.updateLayerVisConfig({zarrVariable: selected.path});
    const data = layer.formatLayerData(datasets);
    t.equal(layer.meta.crs, selected.spatialMetadata.crs.code, 'updates the layer CRS');
    t.deepEqual(
      data.metadata.levels,
      selected.spatialMetadata.levels,
      'updates the resolution levels'
    );
    t.deepEqual(data.metadata.axes, selected.spatialMetadata.axes, 'updates the spatial axes');
    layer._nodeKey = `${metadata.url}#${selected.path}`;
    layer._node = {shape: selected.shape};
    return layer.renderLayer({data, mapState: {zoom: 1}, visible: true})[0];
  };
  t.equal(render(large).props.maxZoom, 3, 'uses the default pyramid zoom limit');
  t.equal(render(small).props.maxZoom, 1, 'uses the smaller pyramid zoom limit after switching');
  t.equal(render(plain).props.maxZoom, null, 'clears the pyramid limit for a plain grid');
  t.equal(render(large).props.maxZoom, 3, 'restores the original pyramid limit');
  t.equal(metadata.variable, large.path, 'does not change the shared dataset default');
  t.deepEqual(
    metadata.levels,
    large.spatialMetadata.levels,
    'does not change the shared dataset grid'
  );
  t.end();
});

test('#ZarrLayer -> renderLayer holds the loaded slice while the next one loads', async t => {
  const layer = new ZarrLayer({dataId: 'zarr-dataset'});
  await layer._loadRuntime();
  layer._nodeKey = `${MOCK_ZARR_DATASET.metadata.url}#temperature`;
  layer._node = {shape: [3, 4, 256, 256]};

  const render = () =>
    layer.renderLayer({
      data: {metadata: MOCK_ZARR_DATASET.metadata, variable: TEMPERATURE},
      mapState: {},
      idx: 0,
      gpuFilter: null,
      layerCallbacks: {},
      visible: true
    });

  const first = render();
  t.equal(first.length, 1, 'should render one layer before any slice has loaded');

  // deck reports every tile in the viewport is in.
  first[0].props.onViewportLoad();

  layer.updateLayerVisConfig({dimensionIndexes: {band: 2}});
  const second = render();

  t.equal(second.length, 2, 'should keep the loaded slice while the next one loads');
  t.deepEqual(
    second[0].props.selection,
    {time: 0, band: 0},
    'should draw the loaded slice underneath'
  );
  t.deepEqual(second[1].props.selection, {time: 0, band: 2}, 'should draw the new slice on top');
  t.notOk(second[0].props.onViewportLoad, 'should not let the backdrop retire itself');

  second[1].props.onViewportLoad();
  const third = render();

  t.equal(third.length, 1, 'should drop the backdrop once the new slice has loaded');
  t.deepEqual(third[0].props.selection, {time: 0, band: 2}, 'should keep the new slice');

  t.end();
});

test('#ZarrLayer -> renderLayer forwards the pyramid description to the renderer', async t => {
  // A pyramid keeps its levels under a shared parent, so a variable's identity
  // is the group plus the array name while the node opened is the group.
  const pyramid = {
    ...PRECIPITATION,
    path: 'pyramid/qtot',
    name: 'qtot',
    displayName: 'qtot',
    nodePath: 'pyramid',
    geoAttrs: {
      'spatial:dimensions': ['y', 'x'],
      'proj:code': 'EPSG:4326',
      multiscales: {
        layout: [
          {
            asset: '0/qtot',
            'spatial:transform': [1, 0, -180, 0, -1, 90],
            'spatial:shape': [180, 360]
          },
          {
            asset: '1/qtot',
            'spatial:transform': [2, 0, -180, 0, -2, 90],
            'spatial:shape': [90, 180]
          }
        ]
      }
    }
  };

  const layer = new ZarrLayer({dataId: 'zarr-dataset'});
  await layer._loadRuntime();
  layer._nodeKey = `${MOCK_ZARR_DATASET.metadata.url}#pyramid/qtot`;
  layer._node = {attrs: {}};

  const [deckLayer] = layer.renderLayer({
    data: {metadata: MOCK_ZARR_DATASET.metadata, variable: pyramid},
    mapState: {},
    idx: 0,
    gpuFilter: null,
    layerCallbacks: {},
    visible: true
  });

  t.deepEqual(
    deckLayer.props.metadata.multiscales.layout.map(level => level.asset),
    ['0/qtot', '1/qtot'],
    'should hand the renderer every level of the pyramid'
  );

  t.end();
});

test('#ZarrLayer -> renderLayer keeps its deck props stable across redraws', async t => {
  const layer = new ZarrLayer({dataId: 'zarr-dataset'});
  await layer._loadRuntime();
  layer._nodeKey = `${MOCK_ZARR_DATASET.metadata.url}#temperature`;
  layer._node = {shape: [3, 4, 256, 256]};

  const render = () =>
    layer.renderLayer({
      data: {metadata: MOCK_ZARR_DATASET.metadata, variable: TEMPERATURE},
      mapState: {},
      idx: 0,
      gpuFilter: null,
      layerCallbacks: {},
      visible: true
    })[0];

  const [first, second] = [render(), render()];

  // kepler rebuilds its deck layers on every pan frame. deck compares these
  // props by reference, and a change makes RasterTileLayer rebuild its inner
  // TileLayer, which re-runs the CPU colormap over every visible tile.
  t.equal(second.id, first.id, 'should keep the same sublayer id');
  t.equal(second.props.selection, first.props.selection, 'should reuse the selection object');
  t.equal(second.props.renderTile, first.props.renderTile, 'should reuse the renderTile callback');
  t.equal(
    second.props.getTileData,
    first.props.getTileData,
    'should reuse the getTileData callback'
  );
  t.equal(second.props.node, first.props.node, 'should reuse the opened node');

  t.end();
});

test('#ZarrLayer -> renderLayer returns nothing before the store opens', t => {
  const layer = new ZarrLayer({dataId: 'zarr-dataset'});

  t.deepEqual(
    layer.renderLayer({data: {metadata: null, variable: null}, mapState: {}}),
    [],
    'should render nothing without metadata'
  );

  t.deepEqual(
    layer.renderLayer({
      data: {metadata: MOCK_ZARR_DATASET.metadata, variable: TEMPERATURE},
      mapState: {globe: {enabled: true}}
    }),
    [],
    'should render nothing in the globe view'
  );

  t.end();
});
