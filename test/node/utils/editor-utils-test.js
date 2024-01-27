// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import {EditableGeoJsonLayer} from '@nebula.gl/layers';

import {INITIAL_VIS_STATE} from '@kepler.gl/reducers';
import {VisStateActions} from '@kepler.gl/actions';
import {EDITOR_LAYER_ID, EDITOR_MODES} from '@kepler.gl/constants';
import {EditorLayerUtils, getEditorLayer} from '@kepler.gl/layers';

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

  t.end();
});
