// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import {EditableGeoJsonLayer} from '@deck.gl-community/editable-layers';

import {INITIAL_VIS_STATE} from '@kepler.gl/reducers';
import {VisStateActions} from '@kepler.gl/actions';
import {EDITOR_LAYER_ID, EDITOR_MODES} from '@kepler.gl/constants';
import {EditorLayerUtils, getEditorLayer, formatCircleRadiusLabel, formatLineLengthLabel} from '@kepler.gl/layers';

test('editorLayerUtils -> formatCircleRadiusLabel', t => {
  t.equal(formatCircleRadiusLabel(0), '', 'Should hide invalid radii');
  t.equal(formatCircleRadiusLabel(0.25), 'Radius: 0.25 km', 'Should show radius in kilometers');
  t.equal(formatCircleRadiusLabel(1.5), 'Radius: 1.50 km', 'Should keep two decimal places');
  t.equal(formatCircleRadiusLabel(12.345), 'Radius: 12.35 km', 'Should round to two decimal places');
  t.end();
});

test('editorLayerUtils -> formatLineLengthLabel', t => {
  t.equal(formatLineLengthLabel(0), '', 'Should hide invalid lengths');
  t.equal(formatLineLengthLabel(0.25), 'Length: 0.25 km', 'Should show length in kilometers');
  t.equal(formatLineLengthLabel(1.5), 'Length: 1.50 km', 'Should keep two decimal places');
  t.equal(formatLineLengthLabel(12.345), 'Length: 12.35 km', 'Should round to two decimal places');
  t.end();
});

test('editorLayerUtils -> isDrawingActive', t => {
  t.equal(
    EditorLayerUtils.isDrawingActive(true, EDITOR_MODES.EDIT),
    false,
    'Should return false for non-drawing mode'
  );
  t.equal(
    EditorLayerUtils.isDrawingActive(false, EDITOR_MODES.DRAW_POLYGON),
    false,
    'Should return false as editor UI is disactivated'
  );
  t.equal(
    EditorLayerUtils.isDrawingActive(true, EDITOR_MODES.DRAW_POLYGON),
    true,
    'Should return true for activated editor UI and draw mode'
  );
  t.equal(
    EditorLayerUtils.isDrawingActive(true, EDITOR_MODES.DRAW_LINESTRING),
    true,
    'Should return true for line drawing mode'
  );
  t.equal(
    EditorLayerUtils.isDrawingActive(true, EDITOR_MODES.DRAW_POINT),
    true,
    'Should return true for point drawing mode'
  );
  t.equal(
    EditorLayerUtils.isDrawingActive(true, EDITOR_MODES.DRAW_CIRCLE),
    true,
    'Should return true for circle drawing mode'
  );
  t.end();
});

test('editorLayerUtils -> getCursor', t => {
  const {editor} = INITIAL_VIS_STATE;
  const mockSettings = {
    editorMenuActive: true,
    editor
  };
  t.equal(
    EditorLayerUtils.getCursor(mockSettings),
    'crosshair',
    'Should return crosshair for active drawing mode'
  );

  mockSettings.editorMenuActive = false;
  t.equal(
    EditorLayerUtils.getCursor(mockSettings),
    null,
    'Should return null as editor has no suggestions about cursor'
  );

  mockSettings.hoverInfo = {
    layer: {
      id: EDITOR_LAYER_ID
    }
  };
  mockSettings.editor = {...mockSettings.editor, selectedFeature: {}};
  t.equal(EditorLayerUtils.getCursor(mockSettings), 'move', 'Should return move cursor');

  t.end();
});

test('editorLayerUtils -> getTooltip', t => {
  const {editor} = INITIAL_VIS_STATE;
  const info = {
    layer: {state: {mode: {_clickSequence: null}}},
    object: {}
  };

  t.equal(
    EditorLayerUtils.getTooltip(info, {
      editor: {...editor, selectionContext: {rightClick: true}},
      theme: {},
      editorMenuActive: true
    }),
    null,
    'Should return null when the feature menu is visible'
  );

  info.layer.state.mode._clickSequence = [1];
  t.equal(
    EditorLayerUtils.getTooltip(info, {editor, theme: {}, editorMenuActive: true}),
    null,
    'Should return null as drawing is active and started'
  );

  info.layer.state.mode._clickSequence = [];
  t.equal(
    EditorLayerUtils.getTooltip(info, {editor, theme: {}, editorMenuActive: true})?.text,
    'Click to start new feature',
    'Should return a tooltip as drawing is active and started'
  );

  t.equal(
    EditorLayerUtils.getTooltip(info, {
      editor: {...editor, mode: EDITOR_MODES.DRAW_POINT},
      theme: {},
      editorMenuActive: true
    })?.text,
    'Click to add a point',
    'Should return a tooltip for point drawing'
  );

  t.equal(
    EditorLayerUtils.getTooltip(info, {
      editor: {...editor, mode: EDITOR_MODES.DRAW_LINESTRING},
      theme: {},
      editorMenuActive: true
    })?.text,
    'Click to start a line. Double-click to finish',
    'Should return a tooltip for line drawing'
  );

  t.equal(
    EditorLayerUtils.getTooltip(info, {
      editor: {...editor, mode: EDITOR_MODES.DRAW_CIRCLE},
      theme: {},
      editorMenuActive: true
    })?.text,
    'Click or drag to draw circle',
    'Should return a tooltip for circle drawing'
  );

  info.layer.id = EDITOR_LAYER_ID;

  t.deepEqual(
    EditorLayerUtils.getTooltip(
      {...info, object: {id: 1}},
      {editor: {...editor, selectedFeature: {id: 1}}, theme: {}, editorMenuActive: false}
    )?.text,
    'Right click to view options\nDrag to move the feature',
    'Should return a tooltip for selected feature'
  );

  t.equal(
    EditorLayerUtils.getTooltip(
      {...info, object: {id: 1, properties: {filterId: 'filter-1'}}},
      {
        editor: {...editor, selectedFeature: {id: 1, properties: {filterId: 'filter-1'}}},
        theme: {},
        editorMenuActive: false
      }
    )?.text,
    'Filter region\nRight click to view options\nDrag to move the feature',
    'Should return a tooltip for selected filter'
  );

  t.equal(
    EditorLayerUtils.getTooltip(
      {...info, object: {geometry: {type: 'Point'}}},
      {editor, theme: {}, editorMenuActive: false}
    )?.text,
    'Drag to move the point',
    'Should return a tooltip for hovered point'
  );

  t.equal(
    EditorLayerUtils.getTooltip(
      {...info, object: {properties: {guideType: 'tentative'}}},
      {editor, theme: {}, editorMenuActive: false}
    )?.text,
    'Drag to move the point',
    'Should return a tooltip for hovered tentative point'
  );

  t.equal(
    EditorLayerUtils.getTooltip(
      {...info, object: {properties: {editHandleType: 'intermediate'}}},
      {editor, theme: {}, editorMenuActive: false}
    )?.text,
    'Click to insert a point',
    'Should return a tooltip for hovered lines'
  );

  t.equal(
    EditorLayerUtils.getTooltip(
      {...info, object: {properties: {editHandleType: 'intermediate'}}},
      {
        editor: {
          ...editor,
          selectedFeature: {id: 'line-1', geometry: {type: 'LineString'}}
        },
        theme: {},
        editorMenuActive: false
      }
    )?.text,
    'Drag to move the line\nClick to insert a point',
    'Should return a tooltip for hovered line sketches'
  );

  t.equal(
    EditorLayerUtils.getTooltip(info, {editor, theme: {}, editorMenuActive: false})?.text,
    'Click to select the feature\nRight click to view options',
    'Should return a tooltip for not selected feature'
  );

  info.layer.id = 'any';

  t.equal(
    EditorLayerUtils.getTooltip(info, {
      editor,
      theme: {},
      editorMenuActive: false
    }),
    null,
    'Shouldnt return tooltip'
  );

  t.end();
});

test('editorLayerUtils -> onHover', t => {
  const {editor} = INITIAL_VIS_STATE;
  const info = {
    layer: {},
    object: {}
  };
  const hoverInfo = {
    layer: {}
  };

  t.equal(
    EditorLayerUtils.onHover(info, {editor, editorMenuActive: true, hoverInfo}),
    true,
    'Should return true as drawing is active'
  );

  t.equal(
    EditorLayerUtils.onHover(info, {editor, editorMenuActive: false, hoverInfo}),
    false,
    "Should return false as drawing isn't active"
  );

  info.layer.id = EDITOR_LAYER_ID;
  t.equal(
    EditorLayerUtils.onHover(info, {editor, editorMenuActive: false, hoverInfo}),
    false,
    "Should return false as info and hoverInfo aren't yet synced"
  );

  hoverInfo.layer.id = EDITOR_LAYER_ID;
  t.equal(
    EditorLayerUtils.onHover(info, {editor, editorMenuActive: false, hoverInfo}),
    true,
    'Should return true for editor layer'
  );

  t.end();
});

test('editorLayerUtils -> onClick', t => {
  const {editor} = INITIAL_VIS_STATE;
  const info = {
    layer: {},
    object: {}
  };
  const event = {};

  const {onLayerClick, setSelectedFeature} = VisStateActions;

  t.equal(
    EditorLayerUtils.onClick(info, event, {
      editor,
      editorMenuActive: true,
      onLayerClick,
      setSelectedFeature
    }),
    true,
    'Should return true - onClick is handled as drawing is active'
  );

  t.equal(
    EditorLayerUtils.onClick(info, event, {
      editor,
      editorMenuActive: false,
      onLayerClick,
      setSelectedFeature
    }),
    false,
    "Should return false - onClick isn't handled"
  );

  info.layer.id = EDITOR_LAYER_ID;
  t.equal(
    EditorLayerUtils.onClick(info, event, {
      editor,
      editorMenuActive: false,
      onLayerClick,
      setSelectedFeature
    }),
    true,
    'Should return true - onClick is handled'
  );

  t.end();
});

test('editorLayerUtils -> onClick selects LineString', t => {
  const {editor} = INITIAL_VIS_STATE;
  const calls = [];
  const setSelectedFeature = (feature, context) => {
    calls.push({feature, context});
  };
  const lineFeature = {
    id: 'line-1',
    geometry: {
      type: 'LineString',
      coordinates: [
        [0, 0],
        [1, 1]
      ]
    },
    properties: {}
  };

  t.equal(
    EditorLayerUtils.onClick(
      {layer: {id: EDITOR_LAYER_ID}, object: lineFeature},
      {rightButton: true, srcEvent: {point: [10, 20]}},
      {editor, editorMenuActive: false, onLayerClick: () => {}, setSelectedFeature}
    ),
    true,
    'Should handle click on a line feature'
  );
  t.equal(calls[0].feature, lineFeature, 'Should select the line feature');
  t.equal(calls[0].context.rightClick, true, 'Should include right-click context');
  t.end();
});

test('editorLayerUtils -> onClick does not select edit handles', t => {
  const selectedFeature = {id: 'poly-1'};
  const editor = {...INITIAL_VIS_STATE.editor, selectedFeature};
  const calls = [];
  const setSelectedFeature = feature => {
    calls.push(feature);
  };

  EditorLayerUtils.onClick(
    {
      layer: {id: EDITOR_LAYER_ID},
      object: {
        geometry: {type: 'Point', coordinates: [0, 0]},
        properties: {editHandleType: 'existing'}
      }
    },
    {},
    {editor, editorMenuActive: false, onLayerClick: () => {}, setSelectedFeature}
  );

  t.equal(calls[0], selectedFeature, 'Should keep the currently selected feature');
  t.end();
});

test('editorLayerUtils -> getEditorLayer', t => {
  const {editor} = INITIAL_VIS_STATE;

  const editorLayer = getEditorLayer({
    editorMenuActive: false,
    editor,
    onSetFeatures: VisStateActions.setFeatures,
    setSelectedFeature: VisStateActions.setSelectedFeature,
    featureCollection: {
      features: [],
      type: 'FeatureCollection'
    },
    selectedFeatureIndexes: [],
    viewport: null
  });
  t.ok(editorLayer instanceof EditableGeoJsonLayer, 'Should return an editable layer');

  const circleLayer = getEditorLayer({
    editorMenuActive: true,
    editor: {...editor, mode: EDITOR_MODES.DRAW_CIRCLE},
    onSetFeatures: VisStateActions.setFeatures,
    setSelectedFeature: VisStateActions.setSelectedFeature,
    featureCollection: {
      features: [],
      type: 'FeatureCollection'
    },
    selectedFeatureIndexes: [],
    viewport: null
  });
  t.equal(
    circleLayer.props.mode.name,
    'DrawCircleModeExtended',
    'Should use the circle draw mode when DRAW_CIRCLE is active'
  );
  t.equal(circleLayer.props.modeConfig.steps, 64, 'Should tessellate circles with 64 vertices');
  t.equal(circleLayer.props._subLayerProps.tooltips.background, true, 'Radius label should use a background');

  const CircleMode = circleLayer.props.mode;
  const circleMode = new CircleMode();
  t.deepEqual(circleMode.getTooltips(), [], 'Should hide the radius label before the circle has a radius');

  circleMode.radius = 0.25;
  circleMode.position = [10, 20];
  t.deepEqual(
    circleMode.getTooltips(),
    [{position: [10, 20], text: 'Radius: 0.25 km'}],
    'Should show a radius label at the circle rim while drawing'
  );

  const lineLayer = getEditorLayer({
    editorMenuActive: true,
    editor: {...editor, mode: EDITOR_MODES.DRAW_LINESTRING},
    onSetFeatures: VisStateActions.setFeatures,
    setSelectedFeature: VisStateActions.setSelectedFeature,
    featureCollection: {
      features: [],
      type: 'FeatureCollection'
    },
    selectedFeatureIndexes: [],
    viewport: null
  });
  t.equal(
    lineLayer.props.mode.name,
    'DrawLineStringModeExtended',
    'Should use the line draw mode when DRAW_LINESTRING is active'
  );

  const LineMode = lineLayer.props.mode;
  const lineMode = new LineMode();
  t.deepEqual(lineMode.getTooltips({}), [], 'Should hide the length label before the line has a vertex');

  lineMode.addClickSequence({mapCoords: [0, 0]});
  t.deepEqual(
    lineMode.getTooltips({lastPointerMoveEvent: {mapCoords: [0, 0]}}),
    [],
    'Should hide the length label when the tentative segment has no length'
  );

  const lengthTooltips = lineMode.getTooltips({lastPointerMoveEvent: {mapCoords: [1, 0]}});
  t.equal(lengthTooltips.length, 1, 'Should show a length label while drawing a line');
  t.deepEqual(lengthTooltips[0].position, [1, 0], 'Should place the length label at the cursor');
  t.ok(
    /^Length: \d+\.\d{2} km$/.test(lengthTooltips[0].text),
    'Should format the length as Length: xx km'
  );

  t.end();
});

test('editorLayerUtils -> filter polygons are styled differently from sketches', t => {
  const sketch = {
    id: 'sketch-1',
    properties: {},
    geometry: {type: 'Polygon', coordinates: []}
  };
  const filterFeature = {
    id: 'filter-1',
    properties: {filterId: 'poly-filter'},
    geometry: {type: 'Polygon', coordinates: []}
  };
  const editorLayer = getEditorLayer({
    editorMenuActive: false,
    editor: INITIAL_VIS_STATE.editor,
    onSetFeatures: VisStateActions.setFeatures,
    setSelectedFeature: VisStateActions.setSelectedFeature,
    featureCollection: {
      features: [sketch, filterFeature],
      type: 'FeatureCollection'
    },
    selectedFeatureIndexes: [],
    viewport: null
  });

  t.deepEqual(
    editorLayer.props.getDashArray(sketch),
    [0, 0],
    'Sketch polygons should use a solid outline'
  );
  t.deepEqual(
    editorLayer.props.getDashArray(filterFeature),
    [4, 3],
    'Filter polygons should use a dashed outline'
  );
  t.notOk(
    editorLayer.props.filled,
    'Filter polygons should stay outline-only when nothing is selected'
  );
  t.equal(
    editorLayer.props.getFillColor(filterFeature, false)[3],
    editorLayer.props.getFillColor(sketch, false)[3],
    'Filter and sketch fills should match when unselected'
  );
  t.equal(
    editorLayer.props.highlightColor({object: filterFeature})[3],
    0x66,
    'Unselected polygon hover should use a semi-transparent yellow fill'
  );

  const layerWithPoint = getEditorLayer({
    editorMenuActive: false,
    editor: INITIAL_VIS_STATE.editor,
    onSetFeatures: VisStateActions.setFeatures,
    setSelectedFeature: VisStateActions.setSelectedFeature,
    featureCollection: {
      features: [
        filterFeature,
        {id: 'point-1', properties: {}, geometry: {type: 'Point', coordinates: [0, 0]}}
      ],
      type: 'FeatureCollection'
    },
    selectedFeatureIndexes: [],
    viewport: null
  });
  t.ok(layerWithPoint.props.filled, 'Point sketches should enable fill so points are visible');
  t.equal(
    layerWithPoint.props.highlightColor({object: filterFeature})[3],
    0x66,
    'Polygon hover should stay semi-transparent even when point sketches enable fill'
  );

  const lineFeature = {
    id: 'line-1',
    properties: {},
    geometry: {type: 'LineString', coordinates: [[0, 0], [1, 1]]}
  };
  t.equal(
    editorLayer.props.getLineWidth(sketch, false),
    2,
    'Polygon sketches should keep the existing outline width'
  );
  t.equal(
    editorLayer.props.getLineWidth(lineFeature, false),
    2,
    'Unselected line sketches should match the default stroke width'
  );
  t.equal(
    editorLayer.props.getLineWidth(lineFeature, true),
    3,
    'Selected line sketches should use a thicker stroke so they stay visible'
  );

  t.end();
});
