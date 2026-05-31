// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape-catch';
import {KeplerGlLayers} from '@kepler.gl/layers';
import {DatasetType} from '@kepler.gl/constants';
import {testCreateCases} from 'test/helpers/layer-utils';

const {BitmapOverlayLayer} = KeplerGlLayers;

const MOCK_BITMAP_DATASET = {
  type: DatasetType.BITMAP,
  metadata: {
    imageUrl: 'https://example.com/image.png',
    bounds: [-122.52, 37.7, -122.35, 37.82],
    isDataUri: false
  },
  label: 'Test Bitmap'
};

const MOCK_BITMAP_DATASET_CORNERS = {
  type: DatasetType.BITMAP,
  metadata: {
    imageUrl: 'https://example.com/image2.png',
    bounds: [
      [-122.52, 37.82],
      [-122.35, 37.82],
      [-122.35, 37.7],
      [-122.52, 37.7]
    ],
    isDataUri: false
  },
  label: 'Corner Bounds Bitmap'
};

const MOCK_DATASETS = {
  'bitmap-test-data': MOCK_BITMAP_DATASET
};

function createBitmapLayer(config = {}) {
  const layer = new BitmapOverlayLayer({
    id: 'test-bitmap-layer',
    dataId: 'bitmap-test-data',
    ...config
  });

  if (config.visConfig) {
    layer.updateLayerVisConfig(config.visConfig);
  }

  return layer;
}

test('#BitmapOverlayLayer -> constructor', t => {
  const TEST_CASES = {
    CREATE: [
      {
        props: {
          dataId: 'bitmap-test-data',
          isVisible: true,
          label: 'test bitmap layer'
        },
        test: layer => {
          t.equal(layer.config.dataId, 'bitmap-test-data', 'dataId should be correct');
          t.equal(layer.type, 'bitmap', 'type should be bitmap');
          t.equal(layer.isAggregated, false, 'BitmapLayer is not aggregated');
          t.equal(layer.config.label, 'test bitmap layer', 'label should be correct');
          t.equal(layer.config.isVisible, true, 'should be visible');
          t.ok(layer.config.visConfig, 'should have visConfig');
          t.equal(layer.config.visConfig.opacity, 1, 'should have default opacity of 1');
          t.equal(layer.config.visConfig.showBounds, true, 'should show bounds by default');
          t.equal(layer.config.visConfig.editBounds, false, 'edit bounds off by default');
          t.equal(layer.config.visConfig.boundsWest, 0, 'default boundsWest should be 0');
          t.equal(layer.config.visConfig.boundsSouth, 0, 'default boundsSouth should be 0');
          t.equal(layer.config.visConfig.boundsEast, 0, 'default boundsEast should be 0');
          t.equal(layer.config.visConfig.boundsNorth, 0, 'default boundsNorth should be 0');
          t.ok(typeof layer.layerIcon === 'function', 'should have layerIcon');
          t.deepEqual(
            layer.supportedDatasetTypes,
            [DatasetType.BITMAP],
            'should support BITMAP dataset type'
          );
          t.equal(layer.requireData, false, 'should not require data');
          t.deepEqual(layer.requiredLayerColumns, [], 'should have no required columns');
        }
      }
    ]
  };

  testCreateCases(t, BitmapOverlayLayer, TEST_CASES.CREATE);
  t.end();
});

test('#BitmapOverlayLayer -> constructor with visConfig', t => {
  const layer = new BitmapOverlayLayer({
    dataId: 'bitmap-test-data',
    visConfig: {
      boundsWest: -122.52,
      boundsSouth: 37.7,
      boundsEast: -122.35,
      boundsNorth: 37.82
    }
  });

  t.equal(layer.config.visConfig.boundsWest, -122.52, 'should apply visConfig boundsWest');
  t.equal(layer.config.visConfig.boundsSouth, 37.7, 'should apply visConfig boundsSouth');
  t.equal(layer.config.visConfig.boundsEast, -122.35, 'should apply visConfig boundsEast');
  t.equal(layer.config.visConfig.boundsNorth, 37.82, 'should apply visConfig boundsNorth');

  t.end();
});

test('#BitmapOverlayLayer -> findDefaultLayerProps with flat bounds', t => {
  const result = BitmapOverlayLayer.findDefaultLayerProps(MOCK_BITMAP_DATASET);

  t.ok(result.props, 'should return props');
  t.equal(result.props.length, 1, 'should return one layer prop');
  t.equal(result.props[0].label, 'Test Bitmap', 'should use dataset label');
  t.equal(result.props[0].isVisible, true, 'should be visible');
  t.ok(result.props[0].visConfig, 'should have visConfig');
  t.equal(result.props[0].visConfig.boundsWest, -122.52, 'should extract west bound');
  t.equal(result.props[0].visConfig.boundsSouth, 37.7, 'should extract south bound');
  t.equal(result.props[0].visConfig.boundsEast, -122.35, 'should extract east bound');
  t.equal(result.props[0].visConfig.boundsNorth, 37.82, 'should extract north bound');

  t.end();
});

test('#BitmapOverlayLayer -> findDefaultLayerProps with corner bounds', t => {
  const result = BitmapOverlayLayer.findDefaultLayerProps(MOCK_BITMAP_DATASET_CORNERS);

  t.ok(result.props, 'should return props');
  t.equal(result.props.length, 1, 'should return one layer prop');
  t.equal(result.props[0].visConfig.boundsWest, -122.52, 'should compute west from corners');
  t.equal(result.props[0].visConfig.boundsSouth, 37.7, 'should compute south from corners');
  t.equal(result.props[0].visConfig.boundsEast, -122.35, 'should compute east from corners');
  t.equal(result.props[0].visConfig.boundsNorth, 37.82, 'should compute north from corners');

  t.end();
});

test('#BitmapOverlayLayer -> findDefaultLayerProps with non-bitmap dataset', t => {
  const result = BitmapOverlayLayer.findDefaultLayerProps({type: 'csv', metadata: {}});

  t.deepEqual(result.props, [], 'should return empty props for non-bitmap dataset');

  t.end();
});

test('#BitmapOverlayLayer -> shouldRenderLayer', t => {
  const layer = createBitmapLayer();

  t.equal(layer.shouldRenderLayer(), true, 'visible layer should render');

  layer.updateLayerConfig({isVisible: false});
  t.equal(layer.shouldRenderLayer(), false, 'invisible layer should not render');

  t.end();
});

test('#BitmapOverlayLayer -> formatLayerData', t => {
  const layer = createBitmapLayer({
    visConfig: {
      boundsWest: -122.52,
      boundsSouth: 37.7,
      boundsEast: -122.35,
      boundsNorth: 37.82
    }
  });

  const result = layer.formatLayerData(MOCK_DATASETS);

  t.ok(result, 'should return layer data');
  t.equal(result.imageUrl, 'https://example.com/image.png', 'should have imageUrl');
  t.deepEqual(
    result.bounds,
    [-122.52, 37.7, -122.35, 37.82],
    'should have bounds from visConfig'
  );

  t.end();
});

test('#BitmapOverlayLayer -> formatLayerData with missing dataset', t => {
  const layer = createBitmapLayer();

  const result = layer.formatLayerData({});
  t.deepEqual(result, {}, 'should return empty object for missing dataset');

  t.end();
});

test('#BitmapOverlayLayer -> renderLayer basic', t => {
  const layer = createBitmapLayer({
    visConfig: {
      boundsWest: -122.52,
      boundsSouth: 37.7,
      boundsEast: -122.35,
      boundsNorth: 37.82,
      opacity: 0.8,
      showBounds: true,
      editBounds: false
    }
  });

  const opts = {
    data: {
      imageUrl: 'https://example.com/image.png',
      bounds: [-122.52, 37.7, -122.35, 37.82]
    },
    idx: 0,
    mapState: {dragRotate: false},
    gpuFilter: {filterRange: null, filterValueUpdateTriggers: {}},
    interactionConfig: {},
    layerCallbacks: {},
    visible: true
  };

  const deckLayers = layer.renderLayer(opts);

  t.ok(deckLayers, 'should return deck layers');
  t.equal(deckLayers.length, 2, 'should render bitmap layer + bounds path');
  t.equal(deckLayers[0].id, layer.id, 'first layer should be bitmap');
  t.equal(deckLayers[0].props.opacity, 0.8, 'should have correct opacity');
  t.deepEqual(
    deckLayers[0].props.bounds,
    [-122.52, 37.7, -122.35, 37.82],
    'should have correct bounds'
  );
  t.equal(deckLayers[1].id, `${layer.id}-bounds`, 'second layer should be bounds outline');

  t.end();
});

test('#BitmapOverlayLayer -> renderLayer without bounds outline', t => {
  const layer = createBitmapLayer({
    visConfig: {
      boundsWest: -122.52,
      boundsSouth: 37.7,
      boundsEast: -122.35,
      boundsNorth: 37.82,
      showBounds: false,
      editBounds: false
    }
  });

  const opts = {
    data: {
      imageUrl: 'https://example.com/image.png',
      bounds: [-122.52, 37.7, -122.35, 37.82]
    },
    idx: 0,
    mapState: {dragRotate: false},
    gpuFilter: {filterRange: null, filterValueUpdateTriggers: {}},
    interactionConfig: {},
    layerCallbacks: {},
    visible: true
  };

  const deckLayers = layer.renderLayer(opts);

  t.equal(deckLayers.length, 1, 'should only render bitmap layer when showBounds is false');

  t.end();
});

test('#BitmapOverlayLayer -> renderLayer with editBounds', t => {
  const layer = createBitmapLayer({
    visConfig: {
      boundsWest: -122.52,
      boundsSouth: 37.7,
      boundsEast: -122.35,
      boundsNorth: 37.82,
      showBounds: true,
      editBounds: true
    }
  });

  const opts = {
    data: {
      imageUrl: 'https://example.com/image.png',
      bounds: [-122.52, 37.7, -122.35, 37.82]
    },
    idx: 0,
    mapState: {dragRotate: false},
    gpuFilter: {filterRange: null, filterValueUpdateTriggers: {}},
    interactionConfig: {},
    layerCallbacks: {},
    visible: true
  };

  const deckLayers = layer.renderLayer(opts);

  t.equal(deckLayers.length, 2, 'should render bitmap + editable layer (no static bounds)');
  t.equal(deckLayers[0].id, layer.id, 'first should be bitmap');
  t.equal(deckLayers[1].id, `${layer.id}-edit`, 'second should be editable layer');

  t.end();
});

test('#BitmapOverlayLayer -> renderLayer with no data', t => {
  const layer = createBitmapLayer();

  const opts = {
    data: null,
    idx: 0,
    mapState: {dragRotate: false},
    gpuFilter: {filterRange: null, filterValueUpdateTriggers: {}},
    interactionConfig: {},
    layerCallbacks: {},
    visible: true
  };

  const deckLayers = layer.renderLayer(opts);
  t.deepEqual(deckLayers, [], 'should return empty array when no data');

  t.end();
});

test('#BitmapOverlayLayer -> renderLayer with missing imageUrl', t => {
  const layer = createBitmapLayer();

  const opts = {
    data: {imageUrl: null, bounds: [-122.52, 37.7, -122.35, 37.82]},
    idx: 0,
    mapState: {dragRotate: false},
    gpuFilter: {filterRange: null, filterValueUpdateTriggers: {}},
    interactionConfig: {},
    layerCallbacks: {},
    visible: true
  };

  const deckLayers = layer.renderLayer(opts);
  t.deepEqual(deckLayers, [], 'should return empty array when no imageUrl');

  t.end();
});

test('#BitmapOverlayLayer -> updateLayerVisConfig', t => {
  const layer = createBitmapLayer();

  layer.updateLayerVisConfig({
    boundsWest: -100,
    boundsSouth: 30,
    boundsEast: -80,
    boundsNorth: 40,
    opacity: 0.5
  });

  t.equal(layer.config.visConfig.boundsWest, -100, 'should update boundsWest');
  t.equal(layer.config.visConfig.boundsSouth, 30, 'should update boundsSouth');
  t.equal(layer.config.visConfig.boundsEast, -80, 'should update boundsEast');
  t.equal(layer.config.visConfig.boundsNorth, 40, 'should update boundsNorth');
  t.equal(layer.config.visConfig.opacity, 0.5, 'should update opacity');

  t.end();
});

test('#BitmapOverlayLayer -> visual channels', t => {
  const layer = createBitmapLayer();

  t.deepEqual(layer.visualChannels, {}, 'should have no visual channels');

  t.end();
});

test('#BitmapOverlayLayer -> getHoverData', t => {
  const layer = createBitmapLayer();

  t.equal(layer.getHoverData(), null, 'should return null for hover data');

  t.end();
});

test('#BitmapOverlayLayer -> layer properties', t => {
  const layer = createBitmapLayer();

  t.equal(layer.name, 'Bitmap', 'should have correct name');
  t.equal(layer.type, 'bitmap', 'should have correct type');
  t.equal(layer.requireData, false, 'should not require data');
  t.deepEqual(layer.requiredLayerColumns, [], 'should have no required columns');
  t.deepEqual(layer.supportedDatasetTypes, [DatasetType.BITMAP], 'should support bitmap type');
  t.ok(layer.layerIcon, 'should have layer icon');

  t.end();
});
