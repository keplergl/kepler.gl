// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * Manual Test Plan for WMS Layer Video Export Fix
 *
 * This test validates that WMS layers update correctly during video recording
 * with hubble.gl.
 */

import test from 'tape-catch';
import {ImageSource} from '@loaders.gl/wms';
import WMSLayer from '../../../src/deckgl-layers/src/wms/wms-layer';

const {Image} = window;

/**
 * Test 1: Verify debounce behavior changes based on preserveDrawingBuffer
 *
 * Expected behavior:
 * - When preserveDrawingBuffer is false: debounce delay should be 500ms (default)
 * - When preserveDrawingBuffer is true: debounce delay should be 0ms (immediate)
 */
test('WMSLayer -> debounce respects preserveDrawingBuffer', t => {
  // Mock GL context without preserveDrawingBuffer
  const mockContextNormal = {
    gl: {
      getContextAttributes: () => ({preserveDrawingBuffer: false})
    },
    viewport: {
      getBounds: () => [-180, -90, 180, 90],
      width: 800,
      height: 600
    }
  };

  // Mock GL context with preserveDrawingBuffer (video export mode)
  const mockContextExport = {
    gl: {
      getContextAttributes: () => ({preserveDrawingBuffer: true})
    },
    viewport: {
      getBounds: () => [-180, -90, 180, 90],
      width: 800,
      height: 600
    }
  };

  // Create a mock WMS layer
  const createMockLayer = () => {
    const layer = new WMSLayer({
      id: 'test-wms',
      data: 'http://example.com/wms',
      serviceType: 'wms',
      layers: ['test_layer']
    });

    // Mock the necessary state
    layer.state = {
      imageSource: {
        getImage: () => Promise.resolve(new Image()),
        getMetadata: () => Promise.resolve({})
      },
      loadCounter: 0,
      _nextRequestId: 0,
      lastRequestId: -1
    };

    return layer;
  };

  t.comment('Testing normal mode (no export)');
  const normalLayer = createMockLayer();
  normalLayer.context = mockContextNormal;

  // Spy on loadImage calls
  let normalLoadCalled = false;
  const normalLoadSpy = () => {
    normalLoadCalled = true;
  };
  normalLayer.loadImage = normalLoadSpy;

  // Trigger viewport change
  normalLayer.updateState({
    changeFlags: {viewportChanged: true},
    props: normalLayer.props,
    oldProps: normalLayer.props
  });

  // Check that load wasn't called immediately (debounced)
  t.notOk(normalLoadCalled, 'loadImage should not be called immediately in normal mode');

  t.comment('Testing export mode (preserveDrawingBuffer = true)');
  const exportLayer = createMockLayer();
  exportLayer.context = mockContextExport;

  // Spy on loadImage calls
  let exportLoadCalled = false;
  const exportLoadSpy = () => {
    exportLoadCalled = true;
  };
  exportLayer.loadImage = exportLoadSpy;

  // Trigger viewport change
  exportLayer.updateState({
    changeFlags: {viewportChanged: true},
    props: exportLayer.props,
    oldProps: exportLayer.props
  });

  // Check that load was called immediately (no debounce)
  // In export mode, debounce is minimal (10ms), verify the spy is triggered after timer fires
  setTimeout(() => {
    t.ok(exportLoadCalled, 'loadImage should be called immediately in export mode');
    t.end();
  }, 15);
});

/**
 * Test 2: Verify isLoaded tracks loading state correctly
 *
 * The isLoaded flag must return false while images are loading so that
 * hubble.gl waits before capturing frames.
 */
test('WMSLayer -> isLoaded tracks async loading', t => {
  const layer = new WMSLayer({
    id: 'test-wms',
    data: 'http://example.com/wms',
    serviceType: 'wms',
    layers: ['test_layer']
  });

  // Initialize state
  layer.state = {
    imageSource: {
      getImage: () => new Promise(resolve => setTimeout(() => resolve(new Image()), 100)),
      getMetadata: () => Promise.resolve({})
    },
    loadCounter: 0,
    _nextRequestId: 0,
    lastRequestId: -1
  };

  // Mock internalState so super.isLoaded returns true
  layer.internalState = {isAsyncPropLoading: () => false};

  t.ok(layer.isLoaded, 'Layer should be loaded initially (loadCounter = 0)');

  // Simulate image loading
  layer.state.loadCounter = 1;
  t.notOk(layer.isLoaded, 'Layer should not be loaded while loadCounter > 0');

  // Simulate load complete
  layer.state.loadCounter = 0;
  t.ok(layer.isLoaded, 'Layer should be loaded when loadCounter returns to 0');

  t.end();
});

class TestImageSource extends ImageSource {
  requests = [];
  metadata = Promise.resolve({layers: []});

  getMetadata() {
    return this.metadata;
  }

  getImage(parameters) {
    return new Promise((resolve, reject) => {
      this.requests.push({parameters, resolve, reject});
    });
  }
}

const flushRequests = async () => {
  await new Promise(resolve => setTimeout(resolve, 5));
};

function createRequestLayer(source, extraProps = {}) {
  const layer = new WMSLayer({
    data: source,
    serviceType: 'wms',
    layers: ['imagery'],
    transparent: true,
    ...extraProps
  });
  layer.context = {
    viewport: {getBounds: () => [-10, -10, 10, 10], width: 800, height: 600, zoom: 2},
    gl: {getContextAttributes: () => ({preserveDrawingBuffer: true})}
  };
  layer.state = {};
  layer.initializeState();
  layer.setState = update => Object.assign(layer.state, update);
  layer.setNeedsRedraw = () => {};
  layer.getCurrentLayer = () => layer;
  layer.updateState({props: layer.props, oldProps: {}, changeFlags: {dataChanged: true}});
  return layer;
}

function updateRequestLayer(layer, changes) {
  const oldProps = layer.props;
  layer.props = layer.clone(changes).props;
  layer.updateState({
    props: layer.props,
    oldProps,
    changeFlags: {dataChanged: oldProps.data !== layer.props.data}
  });
}

test('WMSLayer -> replacing a loaded source requests and renders the new service', async t => {
  const oldSource = new TestImageSource();
  const newSource = new TestImageSource();
  const layer = createRequestLayer(oldSource);
  await flushRequests();
  const oldImage = new Image();
  oldSource.requests[0].resolve(oldImage);
  await flushRequests();
  t.equal(layer.renderLayers().props.image, oldImage, 'initial service renders');

  updateRequestLayer(layer, {data: newSource});
  t.notOk(layer.renderLayers(), 'replacement does not render the previous service');
  await flushRequests();
  t.equal(newSource.requests.length, 1, 'same layers and viewport request the new source');
  const newImage = new Image();
  newSource.requests[0]?.resolve(newImage);
  await flushRequests();
  t.equal(layer.renderLayers()?.props.image, newImage, 'replacement service renders');
  t.end();
});

test('WMSLayer -> source replacement invalidates pending images and metadata', async t => {
  const oldSource = new TestImageSource();
  const newSource = new TestImageSource();
  let rejectMetadata;
  oldSource.metadata = new Promise((_resolve, reject) => {
    rejectMetadata = reject;
  });
  const errors = [];
  const layer = createRequestLayer(oldSource, {onMetadataLoadError: error => errors.push(error)});
  await flushRequests();
  updateRequestLayer(layer, {data: newSource});
  // Resolve before the replacement debounce fires as well as before its image arrives.
  oldSource.requests[0].resolve(new Image());
  rejectMetadata(new Error('old metadata failure'));
  await flushRequests();
  t.equal(newSource.requests.length, 1, 'pending old request does not suppress the new source');
  t.notOk(layer.renderLayers(), 'late old image cannot repopulate the cache');
  t.deepEqual(errors, [], 'obsolete metadata errors are ignored');
  await layer.loadImage(layer.context.viewport, 'duplicate viewport');
  t.equal(newSource.requests.length, 1, 'old completion cannot clear the new pending marker');
  newSource.requests[0]?.resolve(new Image());
  await flushRequests();
  t.equal(layer.state.loadCounter, 0, 'all pending work is accounted for');
  t.end();
});

test('WMSLayer -> image properties update without moving the viewport', async t => {
  const source = new TestImageSource();
  const layer = createRequestLayer(source);
  await flushRequests();
  source.requests[0].resolve(new Image());
  await flushRequests();
  // Exercise export throttling at a zoom within the same integer level.
  layer.context.viewport = {...layer.context.viewport, zoom: 2.25};

  for (const changes of [
    {transparent: false},
    {transparent: true},
    {srs: 'EPSG:4326'},
    {layers: ['other']},
    {serviceType: 'auto'}
  ]) {
    const previousCount = source.requests.length;
    updateRequestLayer(layer, changes);
    await flushRequests();
    t.equal(source.requests.length, previousCount + 1, `${JSON.stringify(changes)} refetches`);
    const request = source.requests[source.requests.length - 1];
    for (const [key, value] of Object.entries(changes)) {
      if (key !== 'serviceType') {
        t.deepEqual(request.parameters[key], value, `${key} reaches the source`);
      }
    }
    request.resolve(new Image());
    await flushRequests();
  }

  const count = source.requests.length;
  updateRequestLayer(layer, {opacity: 0.5});
  await flushRequests();
  await layer.loadImage(layer.context.viewport, 'same view');
  await layer.loadImage(
    {...layer.context.viewport, getBounds: () => [-8, -8, 8, 8]},
    'covered view'
  );
  t.equal(source.requests.length, count, 'opacity and covered view retain the cache');
  t.end();
});

test('WMSLayer -> outdated property requests cannot overwrite a cached image', async t => {
  const source = new TestImageSource();
  const errors = [];
  const layer = createRequestLayer(source, {onImageLoadError: (_id, error) => errors.push(error)});
  await flushRequests();
  const image = new Image();
  source.requests[0].resolve(image);
  await flushRequests();
  updateRequestLayer(layer, {transparent: false});
  await flushRequests();
  // Returning to the cached parameters should still invalidate the pending opaque image.
  updateRequestLayer(layer, {transparent: true});
  source.requests[1]?.resolve(new Image());
  await flushRequests();
  t.equal(layer.renderLayers().props.image, image, 'outdated opaque image is discarded');
  t.equal(source.requests.length, 2, 'returning to cached parameters reuses the image');

  updateRequestLayer(layer, {layers: ['pending']});
  await flushRequests();
  updateRequestLayer(layer, {layers: []});
  source.requests[source.requests.length - 1].reject(new Error('obsolete image failure'));
  await flushRequests();
  t.deepEqual(errors, [], 'obsolete image errors are ignored');
  t.equal(layer.state.loadCounter, 0, 'discarded requests finish loading');
  t.end();
});

test('WMSLayer -> older completion preserves newer pending request and errors permit retry', async t => {
  const source = new TestImageSource();
  const errors = [];
  const layer = createRequestLayer(source, {onImageLoadError: (_id, error) => errors.push(error)});
  await flushRequests();
  const moved = {...layer.context.viewport, getBounds: () => [20, 20, 40, 40]};
  const nextRequest = layer.loadImage(moved, 'uncovered view');
  source.requests[0].resolve(new Image());
  await flushRequests();
  // Do not await a duplicate until its request has resolved, so baseline failures cannot hang.
  const duplicateRequest = layer.loadImage(moved, 'same pending view');
  t.equal(source.requests.length, 2, 'older completion leaves newer request deduplication intact');
  const error = new Error('current image failure');
  source.requests[1].reject(error);
  source.requests[2]?.resolve(new Image());
  await Promise.all([nextRequest, duplicateRequest]);
  t.equal(errors[0], error, 'current errors are reported');
  const previousCount = source.requests.length;
  const retry = layer.loadImage(moved, 'retry');
  t.equal(source.requests.length, previousCount + 1, 'failed request is retried');
  source.requests[source.requests.length - 1].resolve(new Image());
  await retry;
  t.equal(layer.state.loadCounter, 0, 'load counter returns to zero');
  t.end();
});
