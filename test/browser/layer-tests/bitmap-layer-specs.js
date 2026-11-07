// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape-catch';
import {KeplerGlLayers} from '@kepler.gl/layers';
import {DatasetType} from '@kepler.gl/constants';
import {visStateSchema, CURRENT_VERSION} from '@kepler.gl/schemas';
import {LayerManager, WebMercatorViewport, _GlobeViewport as GlobeViewport} from '@deck.gl/core';
import {device} from '@deck.gl/test-utils';
import {lngLatToWorld, worldToLngLat} from '@math.gl/web-mercator';
import {testCreateCases} from 'test/helpers/layer-utils';
import {
  BitmapBoundsEditMode,
  BITMAP_MOVE_HANDLE_TYPE
} from '../../../src/layers/src/bitmap-layer/bitmap-bounds-edit-mode';

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
  t.deepEqual(result.bounds, [-122.52, 37.7, -122.35, 37.82], 'should have bounds from visConfig');

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

  t.ok(deckLayers.length >= 2, 'should render bitmap + editable layer (no static bounds)');
  t.equal(deckLayers[0].id, layer.id, 'first should be bitmap');
  t.equal(deckLayers[1].id, `${layer.id}-edit`, 'second should be editable layer');
  const moveHandleLayer = deckLayers.find(l => l.id === `${layer.id}-move-handle`);
  t.ok(moveHandleLayer, 'should render a center move-handle icon');

  t.end();
});

test('#BitmapOverlayLayer -> edit handles follow the surface in pitched and globe views', t => {
  for (const globe of [false, true]) {
    const layer = createBitmapLayer({
      visConfig: {
        boundsWest: -122.52,
        boundsSouth: 37.7,
        boundsEast: -122.35,
        boundsNorth: 37.82,
        editBounds: true
      }
    });
    const viewport = new (globe ? GlobeViewport : WebMercatorViewport)({
      width: 800,
      height: 600,
      longitude: -122.435,
      latitude: 37.76,
      zoom: 10,
      pitch: 60
    });
    const manager = new LayerManager(device, {
      viewport,
      deck: {eventManager: {on: () => {}, off: () => {}}}
    });
    manager.setProps({onError: error => t.error(error, 'edit handles initialize')});
    const layers = layer.renderLayer({
      data: layer.formatLayerData(MOCK_DATASETS),
      mapState: {pitch: 60, globe: {enabled: globe}},
      layerCallbacks: {},
      visible: true
    });
    const editable = layers.find(l => l.id === `${layer.id}-edit`);
    const icon = layers.find(l => l.id === `${layer.id}-move-handle`);
    try {
      manager.setLayers([editable, icon]);
      const circles = manager.getLayers().find(l => l.id.endsWith('-guides-points-circle'));
      t.ok(circles, 'renders the interactive handle circles');
      t.equal(circles.props.data.length, 5, 'renders four corners and the center handle');
      t.equal(circles.props.billboard, false, 'handle circles align with the bitmap surface');
      t.equal(circles.props.pickable, true, 'surface-aligned handles remain draggable');
      t.equal(icon.props.billboard, false, 'center icon follows the same surface as its circle');
      t.notEqual(circles.props.parameters.depthCompare, 'always', 'handles retain depth testing');
      t.notEqual(icon.props.parameters.depthCompare, 'always', 'center icon retains depth testing');
    } finally {
      manager.finalize();
    }
  }
  t.end();
});

test('#BitmapOverlayLayer -> edit mode includes center move handle', t => {
  const mode = new BitmapBoundsEditMode();
  const bounds = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-122.52, 37.82],
              [-122.35, 37.82],
              [-122.35, 37.7],
              [-122.52, 37.7],
              [-122.52, 37.82]
            ]
          ]
        },
        properties: {shape: 'Rectangle'}
      }
    ]
  };

  const guides = mode.getGuides({
    data: bounds,
    selectedIndexes: [0],
    modeConfig: {lockRectangles: true},
    lastPointerMoveEvent: null,
    onEdit: () => {},
    onUpdateCursor: () => {}
  });

  const moveHandle = guides.features.find(
    feature => feature.properties?.editHandleType === BITMAP_MOVE_HANDLE_TYPE
  );
  t.ok(moveHandle, 'should add a center move handle');
  t.equal(moveHandle.geometry.coordinates[0], -122.435, 'move handle lng should be the centroid');
  t.ok(
    Math.abs(moveHandle.geometry.coordinates[1] - 37.76) < 1e-10,
    'move handle lat should be the centroid'
  );

  t.end();
});

test('#BitmapOverlayLayer -> dragging the center handle translates the rectangle', t => {
  const mode = new BitmapBoundsEditMode();
  const data = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-122.52, 37.82],
              [-122.35, 37.82],
              [-122.35, 37.7],
              [-122.52, 37.7],
              [-122.52, 37.82]
            ]
          ]
        },
        properties: {shape: 'Rectangle'}
      }
    ]
  };

  let lastEdit = null;
  const props = {
    data,
    selectedIndexes: [0],
    modeConfig: {lockRectangles: true},
    lastPointerMoveEvent: null,
    onEdit: action => {
      lastEdit = action;
    },
    onUpdateCursor: () => {}
  };

  const movePick = {
    isGuide: true,
    index: 0,
    object: {
      type: 'Feature',
      properties: {
        guideType: 'editHandle',
        editHandleType: BITMAP_MOVE_HANDLE_TYPE,
        featureIndex: 0
      },
      geometry: {type: 'Point', coordinates: [-122.435, 37.76]}
    }
  };

  const start = [-122.435, 37.76];
  const end = [-122.335, 37.86];
  const cancelPan = () => {};

  mode.handlePointerMove({picks: [movePick], mapCoords: start}, props);
  mode.handleStartDragging(
    {
      picks: [movePick],
      pointerDownPicks: [movePick],
      mapCoords: start,
      pointerDownMapCoords: start,
      cancelPan
    },
    props
  );
  mode.handleDragging(
    {
      picks: [movePick],
      pointerDownPicks: [movePick],
      mapCoords: end,
      pointerDownMapCoords: start,
      cancelPan
    },
    props
  );

  t.ok(lastEdit, 'should emit an edit action');
  t.equal(lastEdit.editType, 'translating', 'should translate rather than resize');
  const coords = lastEdit.updatedData.features[0].geometry.coordinates[0];
  const lngs = coords.slice(0, -1).map(c => c[0]);
  const lats = coords.slice(0, -1).map(c => c[1]);
  const width = Math.max(...lngs) - Math.min(...lngs);
  const height = Math.max(...lats) - Math.min(...lats);
  t.ok(Math.abs(width - 0.17) < 0.02, 'translated rectangle should keep its width');
  t.ok(Math.abs(height - 0.12) < 0.02, 'translated rectangle should keep its height');
  t.ok(Math.min(...lngs) > -122.52, 'rectangle should move east');
  t.ok(Math.min(...lats) > 37.7, 'rectangle should move north');

  t.end();
});

test('#BitmapOverlayLayer -> resizing across the dateline keeps the corner in the same world', t => {
  const cases = [
    {west: -190, east: -179.5, corner: 1, target: 179.5, expected: [-190, -180.5]},
    {west: 179.5, east: 190, corner: 0, target: -179.5, expected: [180.5, 190]},
    {west: 170, east: 190, corner: 2, target: -169.5, expected: [170, 190.5]},
    {west: -170, east: 170, corner: 3, target: -171, expected: [-171, 170]}
  ];

  for (const {west, east, corner, target, expected} of cases) {
    const layer = createBitmapLayer({
      visConfig: {
        boundsWest: west,
        boundsEast: east,
        boundsSouth: -10,
        boundsNorth: 10,
        editBounds: true
      }
    });
    const opts = {
      data: layer.formatLayerData(MOCK_DATASETS),
      mapState: {globe: {enabled: true}},
      visible: true,
      layerCallbacks: {}
    };
    const editable = layer.renderLayer(opts).find(l => l.id === `${layer.id}-edit`);
    const mode = new BitmapBoundsEditMode();
    const start = editable.props.data.features[0].geometry.coordinates[0][corner];
    const cornerPick = {
      isGuide: true,
      object: {
        type: 'Feature',
        properties: {
          guideType: 'editHandle',
          editHandleType: 'existing',
          featureIndex: 0,
          positionIndexes: [0, corner]
        },
        geometry: {type: 'Point', coordinates: start}
      }
    };
    const props = {
      data: editable.props.data,
      selectedIndexes: [0],
      modeConfig: {lockRectangles: true},
      lastPointerMoveEvent: null,
      onEdit: action => {
        editable.props.onEdit(action);
        props.data = action.updatedData;
      },
      onUpdateCursor: () => {}
    };
    const event = {
      picks: [cornerPick],
      pointerDownPicks: [cornerPick],
      mapCoords: start,
      pointerDownMapCoords: start,
      cancelPan: () => {}
    };
    mode.handleStartDragging(event, props);
    for (const handler of ['handleDragging', 'handleStopDragging']) {
      mode[handler]({...event, mapCoords: [target, start[1]]}, props);
      for (const globe of [false, true]) {
        const [bitmap] = layer.renderLayer({...opts, mapState: {globe: {enabled: globe}}});
        t.deepEqual(
          bitmap.props.bounds,
          [expected[0], -10, expected[1], 10],
          `${handler}: ${west}/${east} resizes continuously in ${globe ? 'globe' : 'flat'} view`
        );
      }
    }
    t.deepEqual(
      [layer.config.visConfig.boundsWest, layer.config.visConfig.boundsEast],
      expected,
      'released corner persists the same longitude interval'
    );
  }
  t.end();
});

test('#BitmapOverlayLayer -> dragging the bitmap body does not translate', t => {
  const mode = new BitmapBoundsEditMode();
  const data = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-122.52, 37.82],
              [-122.35, 37.82],
              [-122.35, 37.7],
              [-122.52, 37.7],
              [-122.52, 37.82]
            ]
          ]
        },
        properties: {shape: 'Rectangle'}
      }
    ]
  };

  let lastEdit = null;
  let cancelPanCalled = false;
  const props = {
    data,
    selectedIndexes: [0],
    modeConfig: {lockRectangles: true},
    lastPointerMoveEvent: null,
    onEdit: action => {
      lastEdit = action;
    },
    onUpdateCursor: () => {}
  };

  const bodyPick = {
    isGuide: false,
    index: 0,
    object: data.features[0]
  };

  const start = [-122.435, 37.76];
  const end = [-122.335, 37.86];
  const cancelPan = () => {
    cancelPanCalled = true;
  };

  mode.handlePointerMove({picks: [bodyPick], mapCoords: start}, props);
  mode.handleStartDragging(
    {
      picks: [bodyPick],
      pointerDownPicks: [bodyPick],
      mapCoords: start,
      pointerDownMapCoords: start,
      cancelPan
    },
    props
  );
  mode.handleDragging(
    {
      picks: [bodyPick],
      pointerDownPicks: [bodyPick],
      mapCoords: end,
      pointerDownMapCoords: start,
      cancelPan
    },
    props
  );

  t.equal(lastEdit, null, 'should not translate when dragging the image body');
  t.equal(cancelPanCalled, false, 'should not block map pan');

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

test('#BitmapOverlayLayer -> aligns control points in the rendered Mercator plane', t => {
  const cases = [
    [
      {uv: [0.25, 0.25], geo: [10, 60]},
      {uv: [0.75, 0.75], geo: [20, 30]}
    ],
    [
      {uv: [0, 0], geo: [0, 0]},
      {uv: [1, 1], geo: [20, -70]}
    ],
    [
      {uv: [0, 0], geo: [-30, 80]},
      {uv: [1, 1], geo: [30, 40]},
      {
        uv: [0.5, 0.5],
        geo: worldToLngLat([
          lngLatToWorld([0, 0])[0],
          (lngLatToWorld([0, 80])[1] + lngLatToWorld([0, 40])[1]) / 2
        ])
      }
    ]
  ];
  for (const points of cases) {
    const layer = createBitmapLayer();
    for (const point of points) {
      layer.onAlignImageClick(point.uv);
      layer.onAlignMapClick(point.geo);
    }
    const {boundsWest, boundsEast, boundsNorth, boundsSouth} = layer.config.visConfig;
    t.ok(
      [boundsWest, boundsEast, boundsNorth, boundsSouth].every(Number.isFinite),
      'finite bounds'
    );
    t.ok(boundsWest < boundsEast && boundsSouth < boundsNorth, 'ordered bounds');
    t.ok(boundsSouth > -90 && boundsNorth < 90, 'latitude bounds stay valid');
    const nw = lngLatToWorld([boundsWest, boundsNorth]);
    const se = lngLatToWorld([boundsEast, boundsSouth]);
    for (const {uv, geo} of points) {
      // deck's bitmap interpolates texture coordinates across projected corners.
      const rendered = worldToLngLat([
        nw[0] + uv[0] * (se[0] - nw[0]),
        nw[1] + uv[1] * (se[1] - nw[1])
      ]);
      t.ok(Math.abs(rendered[0] - geo[0]) < 1e-8, 'control point longitude matches');
      t.ok(Math.abs(rendered[1] - geo[1]) < 1e-8, 'control point latitude matches');
    }
  }
  t.end();
});

test('#BitmapOverlayLayer -> ignores degenerate or nonprojectable alignment', t => {
  for (const points of [
    [
      {uv: [0, 0], geo: [10, 60]},
      {uv: [1, 1], geo: [10, 30]}
    ],
    [
      {uv: [0.5, 0.2], geo: [10, 60]},
      {uv: [0.5, 0.8], geo: [20, 30]}
    ],
    [
      {uv: [0.2, 0.5], geo: [10, 60]},
      {uv: [0.8, 0.5], geo: [20, 30]}
    ],
    [
      {uv: [0, 0], geo: [10, 89.95]},
      {uv: [1, 1], geo: [20, 30]}
    ],
    [
      {uv: [0, 0], geo: [NaN, 60]},
      {uv: [1, 1], geo: [20, 30]}
    ],
    [
      {uv: [Infinity, 0], geo: [10, 60]},
      {uv: [1, 1], geo: [20, 30]}
    ],
    [
      {uv: [0, 0.499], geo: [10, 80]},
      {uv: [1, 0.501], geo: [20, 79]}
    ]
  ]) {
    const layer = createBitmapLayer();
    const before = {...layer.config.visConfig};
    for (const {uv, geo} of points) {
      layer.onAlignImageClick(uv);
      layer.onAlignMapClick(geo);
    }
    t.deepEqual(layer.config.visConfig, before, 'preserves bounds when no valid fit exists');
  }
  t.end();
});

// Evaluate deck's chosen texture-coordinate conversion at a geographic point.
// The default mesh is latitude-linear on GlobeViewport and Mercator-linear on WebMercatorViewport.
function bitmapUVAtLocation(bitmap, viewport, geo) {
  bitmap.context = {viewport};
  const {coordinateConversion, bounds} = bitmap._getCoordinateUniforms();
  let position;
  let textureBounds;
  if (coordinateConversion === 1) {
    position = lngLatToWorld(geo);
    textureBounds = bounds;
  } else if (coordinateConversion === -1 || viewport.resolution) {
    position = geo;
    textureBounds = coordinateConversion === -1 ? bounds : bitmap.props.bounds;
  } else {
    position = lngLatToWorld(geo);
    textureBounds = [
      ...lngLatToWorld(bitmap.props.bounds.slice(0, 2)),
      ...lngLatToWorld(bitmap.props.bounds.slice(2, 4))
    ];
  }
  return [
    (position[0] - textureBounds[0]) / (textureBounds[2] - textureBounds[0]),
    (position[1] - textureBounds[3]) / (textureBounds[1] - textureBounds[3])
  ];
}

test('#BitmapOverlayLayer -> aligns eastward across the dateline without shortening wide images', t => {
  const cases = [
    {longitudes: [170, -170], expected: [170, 190]},
    {longitudes: [170, 190], expected: [170, 190]},
    {longitudes: [-170, 170], expected: [-170, 170]},
    {longitudes: [-180, 180], expected: [-180, 180]},
    {longitudes: [180, -180], expected: [180, 540]},
    {longitudes: [170, -170], u: [0.25, 0.75], expected: [160, 200]}
  ];
  for (const {longitudes, u = [0, 1], expected} of cases) {
    for (const reverse of [false, true]) {
      const layer = createBitmapLayer();
      // Rendering must use the fitted bounds even if formatted data is cached.
      const data = layer.formatLayerData(MOCK_DATASETS);
      const points = [
        {uv: [u[0], 0], geo: [longitudes[0], 10]},
        {uv: [u[1], 1], geo: [longitudes[1], -10]}
      ];
      for (const {uv, geo} of reverse ? [...points].reverse() : points) {
        layer.onAlignImageClick(uv);
        layer.onAlignMapClick(geo);
      }
      const {boundsWest, boundsEast} = layer.config.visConfig;
      t.ok(
        Math.abs(boundsWest - expected[0]) < 1e-8 && Math.abs(boundsEast - expected[1]) < 1e-8,
        `${longitudes} fits the eastward interval regardless of click order`
      );
      const saved = visStateSchema[CURRENT_VERSION].save({
        layers: [layer],
        layerOrder: [layer.id]
      });
      const loaded = visStateSchema[CURRENT_VERSION].load(
        JSON.parse(JSON.stringify(saved.visState))
      );
      const restored = createBitmapLayer();
      restored.config = restored.copyLayerConfig(restored.config, loaded.visState.layers[0].config);
      t.deepEqual(
        restored.config.visConfig,
        layer.config.visConfig,
        'save/load retains fitted bounds'
      );

      layer.updateLayerVisConfig({alignMode: true});
      layer.onAlignImageClick([0.5, 0.5]);
      for (const globe of [false, true]) {
        const viewport = new (globe ? GlobeViewport : WebMercatorViewport)({
          width: 800,
          height: 600,
          latitude: 0,
          longitude: 180,
          zoom: 2,
          resolution: 5
        });
        for (const candidate of [layer, restored]) {
          const deckLayers = candidate.renderLayer({
            data,
            mapState: {globe: {enabled: globe}},
            visible: true,
            layerCallbacks: {}
          });
          const bitmap = deckLayers[0];
          t.ok(
            Math.abs(
              bitmap.props.bounds[2] - bitmap.props.bounds[0] - (expected[1] - expected[0])
            ) < 1e-8,
            'live and restored renderers preserve the fitted span'
          );
          for (const {uv, geo} of points) {
            const longitude = expected[0] + uv[0] * (expected[1] - expected[0]);
            const actual = bitmapUVAtLocation(bitmap, viewport, [longitude, geo[1]]);
            t.ok(
              Math.abs(actual[0] - uv[0]) < 1e-8 && Math.abs(actual[1] - uv[1]) < 1e-8,
              'control points map to the same texture coordinates in flat and globe'
            );
          }
          const mesh = bitmap._createMesh();
          const meshLongitudes = Array.from(mesh.positions).filter((_, i) => i % 3 === 0);
          t.ok(
            Math.abs(Math.min(...meshLongitudes) - expected[0]) < 1e-8 &&
              Math.abs(Math.max(...meshLongitudes) - expected[1]) < 1e-8,
            'deck mesh uses unwrapped corners'
          );
          const pending = deckLayers.find(l => l.id === `${candidate.id}-align-pending`);
          if (candidate === layer) {
            const markers = deckLayers.find(l => l.id === `${candidate.id}-align-pts`);
            for (const point of markers.props.data) {
              const position = markers.props.getPosition(point);
              t.ok(
                Math.abs(position[0] - (expected[0] + point.uv[0] * (expected[1] - expected[0]))) <
                  1e-8,
                'map-click markers use the same world copy as the image'
              );
            }
            const position = pending.props.getPosition(pending.props.data[0]);
            t.ok(
              Math.abs(position[0] - (expected[0] + expected[1]) / 2) < 1e-8,
              'pending marker follows the same longitude interval'
            );
          }
        }
      }
    }
  }
  t.end();
});

test('#BitmapOverlayLayer -> unwraps intermediate alignment points without accumulating worlds', t => {
  for (const reverse of [false, true]) {
    const layer = createBitmapLayer();
    const points = [
      {uv: [0, 0], geo: [170, 10]},
      {uv: [1, 1], geo: [-170, -10]},
      {uv: [0.5, 0.5], geo: [-179.9, 0]},
      {uv: [0.5, 0.5], geo: [180, 0]},
      {uv: [0.5001, 0.5], geo: [179.99, 0]}
    ];
    const ordered = reverse ? [...points].reverse() : points;
    for (const {uv, geo} of ordered) {
      layer.onAlignImageClick(uv);
      layer.onAlignMapClick(geo);
    }
    t.deepEqual(layer.alignControlPoints, ordered, 'does not mutate clicked coordinates or order');
    t.ok(
      Math.abs(layer.config.visConfig.boundsWest - 170) < 0.1,
      'west stays near the intended fit'
    );
    t.ok(
      Math.abs(layer.config.visConfig.boundsEast - 190) < 0.1,
      'east stays near the intended fit'
    );
  }
  t.end();
});

test('#BitmapOverlayLayer -> leaves legacy saved longitude bounds unchanged', t => {
  for (const [west, east] of [
    [-170, 170],
    [170, -170]
  ]) {
    const layer = createBitmapLayer({
      visConfig: {boundsWest: west, boundsSouth: -10, boundsEast: east, boundsNorth: 10}
    });
    const saved = visStateSchema[CURRENT_VERSION].save({layers: [layer], layerOrder: [layer.id]});
    const loaded = visStateSchema[CURRENT_VERSION].load(JSON.parse(JSON.stringify(saved.visState)));
    const restored = createBitmapLayer();
    restored.config = restored.copyLayerConfig(restored.config, loaded.visState.layers[0].config);
    const before = {...restored.config.visConfig};
    const [bitmap] = restored.renderLayer({
      data: restored.formatLayerData(MOCK_DATASETS),
      mapState: {},
      visible: true,
      layerCallbacks: {}
    });
    t.equal(restored.config.visConfig.boundsWest, west, 'saved west is not migrated');
    t.equal(restored.config.visConfig.boundsEast, east, 'saved east is not migrated');
    t.deepEqual(bitmap.props.bounds, [-170, -10, 170, 10], 'legacy rendering stays unchanged');
    t.deepEqual(restored.config.visConfig, before, 'rendering does not rewrite the config');
  }
  t.end();
});

test('#BitmapOverlayLayer -> aligned texture points stay fixed when switching flat and globe', t => {
  const points = [
    {uv: [0, 0], geo: [10, 60]},
    {uv: [1, 0.5], geo: [20, 40]}
  ];
  const layer = createBitmapLayer();
  for (const {uv, geo} of points) {
    layer.onAlignImageClick(uv);
    layer.onAlignMapClick(geo);
  }
  layer.updateLayerVisConfig({alignMode: true});
  layer.onAlignImageClick([1, 0.5]);
  const originalBounds = {...layer.config.visConfig};
  let previousBitmap;
  for (const globe of [false, true, false]) {
    const viewport = new (globe ? GlobeViewport : WebMercatorViewport)({
      width: 800,
      height: 600,
      latitude: 40,
      longitude: 15,
      zoom: 3,
      resolution: 5
    });
    const renderedLayers = layer.renderLayer({
      data: layer.formatLayerData(MOCK_DATASETS),
      mapState: {globe: {enabled: globe}},
      visible: true,
      layerCallbacks: {}
    });
    const bitmap = renderedLayers[0];
    if (previousBitmap) {
      // deck transfers state by id; viewport changes alone do not update BitmapLayer.
      bitmap.internalState = {
        changeFlags: {
          dataChanged: false,
          propsChanged: false,
          updateTriggersChanged: false,
          viewportChanged: true,
          stateChanged: false,
          extensionsChanged: false
        }
      };
      bitmap._diffProps(bitmap.props, previousBitmap.props);
      t.ok(
        bitmap.id !== previousBitmap.id ||
          bitmap.shouldUpdateState({changeFlags: bitmap.internalState.changeFlags}),
        'projection switch creates a new bitmap or invalidates its cached mesh and uniforms'
      );
    }
    previousBitmap = bitmap;
    const pending = renderedLayers.find(l => l.id === `${layer.id}-align-pending`);
    const position = pending.props.getPosition(pending.props.data[0]);
    t.ok(
      Math.abs(position[0] - 20) < 1e-8 && Math.abs(position[1] - 40) < 1e-8,
      'pending marker matches the selected image point'
    );
    for (const {uv, geo} of points) {
      const actual = bitmapUVAtLocation(bitmap, viewport, geo);
      t.ok(
        Math.abs(actual[0] - uv[0]) < 1e-8,
        `longitude maps to image U in ${globe ? 'globe' : 'flat'}`
      );
      t.ok(
        Math.abs(actual[1] - uv[1]) < 1e-8,
        `latitude maps to image V in ${globe ? 'globe' : 'flat'}`
      );
    }
    t.deepEqual(layer.config.visConfig, originalBounds, 'projection changes preserve saved bounds');
  }
  t.end();
});

test('#BitmapOverlayLayer -> accepts finite fits beyond the square Mercator tile boundary', t => {
  for (const points of [
    [
      {uv: [0.25, 0.25], geo: [10, 84]},
      {uv: [0.75, 0.75], geo: [20, 80]}
    ],
    [
      {uv: [0, 0], geo: [10, 88]},
      {uv: [1, 1], geo: [20, 86]}
    ]
  ]) {
    const layer = createBitmapLayer();
    for (const {uv, geo} of points) {
      layer.onAlignImageClick(uv);
      layer.onAlignMapClick(geo);
    }
    const [bitmap] = layer.renderLayer({
      data: layer.formatLayerData(MOCK_DATASETS),
      mapState: {},
      visible: true,
      layerCallbacks: {}
    });
    const viewport = new WebMercatorViewport({
      width: 800,
      height: 600,
      latitude: 80,
      longitude: 15,
      zoom: 3
    });
    t.ok(
      bitmap.props.bounds[3] > 85.051129,
      'retains renderable northern bounds beyond 85 degrees'
    );
    for (const {uv, geo} of points) {
      const actual = bitmapUVAtLocation(bitmap, viewport, geo);
      t.ok(
        Math.abs(actual[0] - uv[0]) < 1e-8 && Math.abs(actual[1] - uv[1]) < 1e-8,
        'high-latitude control points map to their image location'
      );
    }
    if (points[0].geo[1] === 84)
      t.ok(
        Math.abs(bitmap.props.bounds[3] - 85.354501) < 1e-6,
        'keeps the fitted 85.354501 degree bound'
      );
  }
  t.end();
});

test('#BitmapOverlayLayer -> renders saved polar bounds with finite Mercator texture coordinates', t => {
  const layer = createBitmapLayer({
    visConfig: {boundsWest: -180, boundsSouth: -90, boundsEast: 180, boundsNorth: 90}
  });
  const savedBounds = {...layer.config.visConfig};
  for (const globe of [false, true]) {
    const viewport = new (globe ? GlobeViewport : WebMercatorViewport)({
      width: 800,
      height: 600,
      latitude: 0,
      longitude: 0,
      zoom: 1,
      resolution: 5
    });
    const [bitmap] = layer.renderLayer({
      data: layer.formatLayerData(MOCK_DATASETS),
      mapState: {globe: {enabled: globe}},
      visible: true,
      layerCallbacks: {}
    });
    bitmap.context = {viewport};
    t.ok(
      bitmap._getCoordinateUniforms().bounds.every(Number.isFinite),
      'texture bounds are finite at the poles'
    );
    for (const latitude of [-89.9, 0, 89.9]) {
      const uv = bitmapUVAtLocation(bitmap, viewport, [0, latitude]);
      t.ok(
        uv.every(value => Number.isFinite(value) && value >= 0 && value <= 1),
        'polar and equatorial texture coordinates stay within the image'
      );
      const expectedV = latitude === 0 ? 0.5 : latitude < 0 ? 1 : 0;
      t.ok(
        Math.abs(uv[1] - expectedV) < 1e-8,
        'the poles map to opposite image edges and the equator to its center'
      );
    }
    t.deepEqual(layer.config.visConfig, savedBounds, 'rendering preserves saved polar bounds');
  }
  t.end();
});
