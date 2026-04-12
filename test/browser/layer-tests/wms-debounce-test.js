// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * Manual Test Plan for WMS Layer Video Export Fix
 *
 * This test validates that WMS layers update correctly during video recording
 * with hubble.gl.
 */

import test from 'tape-catch';
import WMSLayer from '../../../src/deckgl-layers/src/wms/wms-layer';

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
  t.ok(exportLoadCalled, 'loadImage should be called immediately in export mode');

  t.end();
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

  t.ok(layer.isLoaded, 'Layer should be loaded initially (loadCounter = 0)');

  // Simulate image loading
  layer.state.loadCounter = 1;
  t.notOk(layer.isLoaded, 'Layer should not be loaded while loadCounter > 0');

  // Simulate load complete
  layer.state.loadCounter = 0;
  t.ok(layer.isLoaded, 'Layer should be loaded when loadCounter returns to 0');

  t.end();
});

/**
 * Manual Test Procedure for Video Export
 *
 * To manually verify the fix works end-to-end:
 *
 * 1. Set up a map with a WMS layer
 *    - Use a public WMS service (e.g., NOAA weather data)
 *    - Ensure the WMS supports multiple zoom levels
 *
 * 2. Create a camera animation that zooms in
 *    - Start at a low zoom level (e.g., zoom 3)
 *    - End at a high zoom level (e.g., zoom 10)
 *    - Duration: 5-10 seconds
 *
 * 3. Record the video using hubble.gl
 *    - Open the Export Video modal
 *    - Configure the animation
 *    - Start recording
 *
 * 4. Verify the output
 *    - Play the recorded video
 *    - Check that tiles update progressively as zoom increases
 *    - Verify no "frozen" or outdated tiles from wrong zoom levels
 *    - Tiles should match the detail level appropriate for each frame's zoom
 *
 * 5. Compare with unfixed version
 *    - Without the fix, tiles would remain at the initial zoom level
 *    - Zooming in would show pixelated/stretched tiles
 *    - After tab switching, tiles would suddenly update
 *
 * Expected Result:
 * - Smooth tile transitions throughout the video
 * - Correct tile detail at each zoom level
 * - No need to switch tabs to force updates
 */

console.log(`
========================================
WMS Layer Video Export Fix - Test Plan
========================================

Automated Tests:
- Run with: yarn test-jest --testPathPattern="wms-debounce"

Manual Verification:
1. Load a map with WMS layer
2. Record a zoom animation
3. Verify tiles update correctly in the video

For full test procedure, see comments in this file.
`);
