// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import {
  getZoomOpacityAnnotationTargetId,
  visStateReducer as reducer,
  INITIAL_VIS_STATE
} from '@kepler.gl/reducers';
import {VisStateActions} from '@kepler.gl/actions';
import {AnnotationKind} from '@kepler.gl/constants';

const initialState = {...INITIAL_VIS_STATE};

test('#visStateReducer -> annotation opacity tracks normalize, clone, survive kind changes and clear', t => {
  const first = {
    id: 'first',
    startTimeMs: 1000,
    endTimeMs: 3000,
    startValue: 0,
    endValue: 1,
    easing: 'linear'
  };
  const last = {
    id: 'last',
    startTimeMs: 5000,
    endTimeMs: 7000,
    startValue: 1,
    endValue: 0,
    easing: 'easeInOut'
  };
  const opacityTransitions = [last, first];
  let state = reducer(
    initialState,
    VisStateActions.addAnnotation({
      id: 'animated',
      propertyTransitions: {opacity: opacityTransitions}
    })
  );
  t.deepEqual(
    state.annotations[0].propertyTransitions?.opacity,
    [first, last],
    'adding normalizes multiple transitions'
  );
  t.notEqual(
    state.annotations[0].propertyTransitions?.opacity,
    opacityTransitions,
    'adding clones the array'
  );
  t.notEqual(state.annotations[0].propertyTransitions?.opacity[0], first, 'adding clones entries');
  t.equal(opacityTransitions[0].id, 'last', 'adding preserves input order');
  state = reducer(state, VisStateActions.updateAnnotation('animated', {label: 'Animated label'}));
  t.deepEqual(
    state.annotations[0].propertyTransitions?.opacity,
    [first, last],
    'unrelated updates preserve timing'
  );
  for (const kind of [
    AnnotationKind.TEXT,
    AnnotationKind.ARROW,
    AnnotationKind.CIRCLE,
    AnnotationKind.RULER,
    AnnotationKind.POINT
  ]) {
    state = reducer(state, VisStateActions.updateAnnotation('animated', {kind}));
    t.deepEqual(
      state.annotations[0].propertyTransitions?.opacity,
      [first, last],
      `${kind} retains animation`
    );
  }
  state = reducer(state, VisStateActions.duplicateAnnotation('animated'));
  t.deepEqual(
    state.annotations[0].propertyTransitions?.opacity,
    state.annotations[1].propertyTransitions?.opacity,
    'duplicate retains track values'
  );
  t.notEqual(
    state.annotations[0].propertyTransitions?.opacity,
    state.annotations[1].propertyTransitions?.opacity,
    'duplicate owns its track'
  );
  t.notEqual(
    state.annotations[0].propertyTransitions?.opacity[0],
    state.annotations[1].propertyTransitions?.opacity[0],
    'duplicate owns its entries'
  );
  const update = [{...first, endValue: 0.4}];
  state = reducer(
    state,
    VisStateActions.updateAnnotation('animated', {propertyTransitions: {opacity: update}})
  );
  const target = state.annotations.find(item => item.id === 'animated');
  t.deepEqual(target.propertyTransitions?.opacity, update, 'updates the selected annotation track');
  t.notEqual(target.propertyTransitions?.opacity[0], update[0], 'updating clones entries');
  t.equal(
    state.annotations[0].propertyTransitions?.opacity[0].endValue,
    1,
    'updating one annotation preserves the duplicate'
  );
  state = reducer(
    state,
    VisStateActions.updateAnnotation('animated', {propertyTransitions: {opacity: []}})
  );
  t.deepEqual(
    state.annotations.find(item => item.id === 'animated').propertyTransitions?.opacity,
    [],
    'explicit empty clears animation'
  );
  state = reducer(
    state,
    VisStateActions.updateAnnotation('animated', {propertyTransitions: undefined})
  );
  t.notOk(
    'propertyTransitions' in state.annotations.find(item => item.id === 'animated'),
    'undefined removes optional metadata'
  );
  t.end();
});

test('#visStateReducer -> invalid annotation opacity tracks never enter runtime state', t => {
  const transition = {
    id: 'first',
    startTimeMs: 1000,
    endTimeMs: 3000,
    startValue: 0,
    endValue: 1,
    easing: 'linear'
  };
  for (const invalid of [
    null,
    [{...transition, endValue: 2}],
    [transition, {...transition, id: 'overlap', startTimeMs: 2000}]
  ]) {
    const added = reducer(
      initialState,
      VisStateActions.addAnnotation({id: 'invalid', propertyTransitions: {opacity: invalid}})
    );
    t.notOk('propertyTransitions' in added.annotations[0], 'adding drops invalid timing');
    const valid = reducer(
      initialState,
      VisStateActions.addAnnotation({id: 'valid', propertyTransitions: {opacity: [transition]}})
    );
    const updated = reducer(
      valid,
      VisStateActions.updateAnnotation('valid', {propertyTransitions: {opacity: invalid}})
    );
    t.notOk('propertyTransitions' in updated.annotations[0], 'updating drops invalid timing');
    t.deepEqual(
      valid.annotations[0].propertyTransitions?.opacity,
      [transition],
      'updating preserves previous state'
    );
  }
  const legacy = reducer(initialState, VisStateActions.addAnnotation({id: 'legacy'}));
  t.notOk(
    'propertyTransitions' in legacy.annotations[0],
    'new static annotations omit animation metadata'
  );
  t.end();
});

test('#visStateReducer -> ADD_ANNOTATION', t => {
  const state = reducer(
    initialState,
    VisStateActions.addAnnotation({
      anchorPoint: [10, 20]
    })
  );

  t.equal(state.annotations.length, 1, 'should add one annotation');
  t.deepEqual(state.annotations[0].anchorPoint, [10, 20], 'should set anchorPoint');
  t.equal(state.annotations[0].kind, AnnotationKind.POINT, 'should default to POINT kind');
  t.equal(state.annotations[0].isVisible, true, 'should be visible by default');
  t.equal(state.annotations[0].label, 'New Annotation', 'should have default label');
  t.equal(state.annotations[0].textSide, 'right', 'should default text to the right');
  t.equal(state.annotations[0].textVerticalPosition, 'above', 'should default text above');
  t.equal(state.selectedAnnotationId, state.annotations[0].id, 'should select new annotation');
  t.equal(state.isEditingAnnotationText, true, 'should start editing text');

  t.end();
});

test('#visStateReducer -> ADD_ANNOTATION with custom config', t => {
  const state = reducer(
    initialState,
    VisStateActions.addAnnotation({
      anchorPoint: [5, 15],
      kind: AnnotationKind.CIRCLE,
      label: 'My Circle',
      lineColor: '#FF0000',
      lineWidth: 4
    })
  );

  t.equal(state.annotations.length, 1, 'should add one annotation');
  t.equal(state.annotations[0].kind, AnnotationKind.CIRCLE, 'should use provided kind');
  t.equal(state.annotations[0].label, 'My Circle', 'should use provided label');
  t.equal(state.annotations[0].lineColor, '#FF0000', 'should use provided lineColor');
  t.equal(state.annotations[0].lineWidth, 4, 'should use provided lineWidth');
  t.ok(state.annotations[0].radiusInMeters, 'CIRCLE should have radiusInMeters');

  t.end();
});

test('#visStateReducer -> ADD_ANNOTATION with TEXT kind', t => {
  const state = reducer(
    initialState,
    VisStateActions.addAnnotation({
      anchorPoint: [0, 0],
      kind: AnnotationKind.TEXT
    })
  );

  t.equal(state.annotations[0].kind, AnnotationKind.TEXT, 'should create TEXT annotation');
  t.notOk('armLength' in state.annotations[0], 'TEXT should not have armLength');
  t.notOk('angle' in state.annotations[0], 'TEXT should not have angle');
  t.notOk(state.annotations[0].textSide, 'TEXT should not stamp a default textSide');
  t.notOk(
    state.annotations[0].textVerticalPosition,
    'TEXT should not stamp a default textVerticalPosition'
  );

  t.end();
});

test('#visStateReducer -> ADD_ANNOTATION with ARROW kind', t => {
  const state = reducer(
    initialState,
    VisStateActions.addAnnotation({
      anchorPoint: [0, 0],
      kind: AnnotationKind.ARROW
    })
  );

  t.equal(state.annotations[0].kind, AnnotationKind.ARROW, 'should create ARROW annotation');
  t.ok('armLength' in state.annotations[0], 'ARROW should have armLength');
  t.ok('angle' in state.annotations[0], 'ARROW should have angle');

  t.end();
});

test('#visStateReducer -> ADD_ANNOTATION with RULER kind', t => {
  const state = reducer(
    initialState,
    VisStateActions.addAnnotation({
      id: 'ruler-1',
      anchorPoint: [0, 0, 25],
      kind: AnnotationKind.RULER
    })
  );

  const ruler = state.annotations[0];
  t.equal(ruler.kind, AnnotationKind.RULER, 'should create a RULER annotation');
  t.equal(ruler.endPoint.length, 3, 'default end should keep the start altitude');
  t.equal(ruler.endPoint[2], 25, 'default endpoints should begin at the same altitude');
  t.equal(ruler.showCustomText, true, 'custom text should be enabled by default');
  t.equal(ruler.showDistance, true, 'distance should be enabled by default');
  t.notOk('armLength' in ruler, 'RULER should not use leader-arm geometry');

  t.end();
});

test('#visStateReducer -> multiple RULER annotations update independently', t => {
  let state = reducer(
    initialState,
    VisStateActions.addAnnotation({
      id: 'ruler-1',
      kind: AnnotationKind.RULER,
      anchorPoint: [0, 0],
      endPoint: [1, 0]
    })
  );
  state = reducer(
    state,
    VisStateActions.addAnnotation({
      id: 'ruler-2',
      kind: AnnotationKind.RULER,
      anchorPoint: [10, 10],
      endPoint: [11, 10]
    })
  );
  state = reducer(
    state,
    VisStateActions.updateAnnotation('ruler-1', {
      endPoint: [2, 0],
      showCustomText: false,
      showDistance: false
    })
  );

  const first = state.annotations.find(annotation => annotation.id === 'ruler-1');
  const second = state.annotations.find(annotation => annotation.id === 'ruler-2');
  t.deepEqual(first.endPoint, [2, 0], 'target ruler endpoint should update');
  t.equal(first.showCustomText, false, 'target custom text can be disabled');
  t.equal(first.showDistance, false, 'target distance can be disabled simultaneously');
  t.deepEqual(second.endPoint, [11, 10], 'other ruler endpoint should remain unchanged');
  t.equal(second.showCustomText, true, 'other ruler text setting should remain unchanged');
  t.equal(second.showDistance, true, 'other ruler distance setting should remain unchanged');

  t.end();
});

test('#visStateReducer -> ADD_ANNOTATION derives placement from angle', t => {
  const state = reducer(
    initialState,
    VisStateActions.addAnnotation({
      anchorPoint: [0, 0],
      kind: AnnotationKind.POINT,
      angle: 135
    })
  );

  t.equal(state.annotations[0].angle, 135, 'should keep provided angle');
  t.equal(state.annotations[0].textSide, 'left', 'should derive left from angle 135');
  t.equal(state.annotations[0].textVerticalPosition, 'below', 'should derive below from angle 135');

  t.end();
});

test('#visStateReducer -> REMOVE_ANNOTATION', t => {
  let state = reducer(initialState, VisStateActions.addAnnotation({anchorPoint: [0, 0]}));
  const id = state.annotations[0].id;
  state = {
    ...state,
    interactionConfig: {
      ...state.interactionConfig,
      zoomOpacity: {
        ...state.interactionConfig.zoomOpacity,
        enabled: true,
        config: {
          controllers: [
            {
              id: 'controller-1',
              layerIds: [getZoomOpacityAnnotationTargetId(id)],
              stops: {appear: 1, full: 3, fade: 8, gone: 12}
            }
          ]
        }
      }
    }
  };

  state = reducer(state, VisStateActions.removeAnnotation(id));

  t.equal(state.annotations.length, 0, 'should remove annotation');
  t.equal(state.selectedAnnotationId, null, 'should deselect removed annotation');
  t.deepEqual(
    state.interactionConfig.zoomOpacity.config.controllers[0].layerIds,
    [],
    'should remove the annotation from fade-on-zoom controllers'
  );

  t.end();
});

test('#visStateReducer -> REMOVE_ANNOTATION preserves selection of other', t => {
  let state = reducer(initialState, VisStateActions.addAnnotation({anchorPoint: [0, 0]}));
  state = reducer(state, VisStateActions.addAnnotation({anchorPoint: [1, 1]}));

  const firstId = state.annotations[1].id;
  const secondId = state.annotations[0].id;

  // select the second annotation
  state = reducer(state, VisStateActions.setSelectedAnnotation(secondId, false));

  // remove the first
  state = reducer(state, VisStateActions.removeAnnotation(firstId));

  t.equal(state.annotations.length, 1, 'should have one annotation left');
  t.equal(state.selectedAnnotationId, secondId, 'should preserve selection of other annotation');

  t.end();
});

test('#visStateReducer -> UPDATE_ANNOTATION', t => {
  let state = reducer(initialState, VisStateActions.addAnnotation({anchorPoint: [0, 0]}));
  const id = state.annotations[0].id;

  state = reducer(
    state,
    VisStateActions.updateAnnotation(id, {
      label: 'Updated Label',
      lineColor: '#00FF00'
    })
  );

  t.equal(state.annotations[0].label, 'Updated Label', 'should update label');
  t.equal(state.annotations[0].lineColor, '#00FF00', 'should update lineColor');
  t.equal(state.annotations[0].id, id, 'should preserve id');

  t.end();
});

test('#visStateReducer -> UPDATE_ANNOTATION with kind change', t => {
  let state = reducer(
    initialState,
    VisStateActions.addAnnotation({
      anchorPoint: [0, 0],
      kind: AnnotationKind.POINT
    })
  );
  const id = state.annotations[0].id;

  state = reducer(state, VisStateActions.updateAnnotation(id, {kind: AnnotationKind.CIRCLE}));

  t.equal(state.annotations[0].kind, AnnotationKind.CIRCLE, 'should change kind');
  t.ok('radiusInMeters' in state.annotations[0], 'should add CIRCLE-specific properties');

  t.end();
});

test('#visStateReducer -> UPDATE_ANNOTATION text placement snaps arm angle', t => {
  let state = reducer(
    initialState,
    VisStateActions.addAnnotation({
      anchorPoint: [0, 0],
      kind: AnnotationKind.POINT
    })
  );
  const id = state.annotations[0].id;

  state = reducer(
    state,
    VisStateActions.updateAnnotation(id, {
      textSide: 'left',
      textVerticalPosition: 'below',
      angle: 135
    })
  );

  t.equal(state.annotations[0].textSide, 'left', 'should set text side');
  t.equal(state.annotations[0].textVerticalPosition, 'below', 'should set vertical position');
  t.equal(state.annotations[0].angle, 135, 'should snap arm toward bottom-left');

  t.end();
});

test('#visStateReducer -> kind changes preserve rich text, including conversions to rulers', t => {
  const editorState = {
    root: {
      children: [
        {
          children: [{type: 'text', version: 1, text: 'Formatted label', format: 1}],
          type: 'paragraph',
          version: 1,
          direction: null,
          format: '',
          indent: 0
        }
      ],
      type: 'root',
      version: 1,
      direction: null,
      format: '',
      indent: 0
    }
  };
  let state = reducer(
    initialState,
    VisStateActions.addAnnotation({id: 'formatted', label: 'Formatted label'})
  );
  state = reducer(state, VisStateActions.updateAnnotation('formatted', {editorState}));

  for (const kind of [
    AnnotationKind.RULER,
    AnnotationKind.POINT,
    AnnotationKind.ARROW,
    AnnotationKind.CIRCLE,
    AnnotationKind.TEXT
  ]) {
    state = reducer(state, VisStateActions.updateAnnotation('formatted', {kind}));
    t.deepEqual(
      state.annotations[0].editorState,
      editorState,
      `${kind} keeps rich-text formatting`
    );
    t.equal(state.annotations[0].label, 'Formatted label', `${kind} keeps the plain text label`);
  }

  t.end();
});

test('#visStateReducer -> UPDATE_ANNOTATION with invalid id', t => {
  let state = reducer(initialState, VisStateActions.addAnnotation({anchorPoint: [0, 0]}));

  const prevState = state;
  state = reducer(state, VisStateActions.updateAnnotation('nonexistent', {label: 'x'}));

  t.equal(state, prevState, 'should return same state for invalid id');

  t.end();
});

test('#visStateReducer -> DUPLICATE_ANNOTATION', t => {
  let state = reducer(
    initialState,
    VisStateActions.addAnnotation({
      anchorPoint: [10, 20],
      kind: AnnotationKind.ARROW
    })
  );
  const originalId = state.annotations[0].id;

  state = reducer(state, VisStateActions.duplicateAnnotation(originalId));

  t.equal(state.annotations.length, 2, 'should have two annotations');
  t.notEqual(state.annotations[0].id, originalId, 'duplicate should have new id');
  t.ok(
    state.annotations[0].label.startsWith('Copy of'),
    'duplicate label should start with "Copy of"'
  );
  t.deepEqual(state.annotations[0].anchorPoint, [10, 20], 'duplicate should copy anchorPoint');
  t.equal(state.annotations[0].kind, AnnotationKind.ARROW, 'duplicate should copy kind');
  t.equal(state.selectedAnnotationId, state.annotations[0].id, 'should select the duplicate');
  t.equal(state.isEditingAnnotationText, false, 'should not edit text on duplicate');

  t.end();
});

test('#visStateReducer -> DUPLICATE_ANNOTATION with invalid id', t => {
  let state = reducer(initialState, VisStateActions.addAnnotation({anchorPoint: [0, 0]}));
  const prevState = state;

  state = reducer(state, VisStateActions.duplicateAnnotation('nonexistent'));

  t.equal(state, prevState, 'should return same state for invalid id');

  t.end();
});

test('#visStateReducer -> SET_SELECTED_ANNOTATION', t => {
  let state = reducer(initialState, VisStateActions.addAnnotation({anchorPoint: [0, 0]}));
  const id = state.annotations[0].id;

  // Deselect
  state = reducer(state, VisStateActions.setSelectedAnnotation(null, false));
  t.equal(state.selectedAnnotationId, null, 'should deselect');
  t.equal(state.isEditingAnnotationText, false, 'should stop editing');

  // Select with editing
  state = reducer(state, VisStateActions.setSelectedAnnotation(id, true));
  t.equal(state.selectedAnnotationId, id, 'should select annotation');
  t.equal(state.isEditingAnnotationText, true, 'should start editing text');

  // Same state no change
  const prevState = state;
  state = reducer(state, VisStateActions.setSelectedAnnotation(id, true));
  t.equal(state, prevState, 'should return same state if already in same selection state');

  t.end();
});

test('#visStateReducer -> captions persist through edits and duplication, and clear when made geographic', t => {
  const viewport = {anchor: 'top-left', margin: [24, 24]};
  const readout = {type: 'time', format: 'YYYY-MM-DD', position: 'first'};
  let state = reducer(
    initialState,
    VisStateActions.addAnnotation({
      id: 'caption',
      kind: AnnotationKind.TEXT,
      label: 'Date',
      viewport,
      readout
    })
  );
  t.deepEqual(state.annotations[0].viewport, viewport, 'adds placement');
  t.deepEqual(state.annotations[0].readout, readout, 'adds readout');
  t.notEqual(state.annotations[0].viewport.margin, viewport.margin, 'owns margin array');
  state = reducer(state, VisStateActions.updateAnnotation('caption', {label: 'Current date'}));
  t.deepEqual(state.annotations[0].viewport, viewport, 'ordinary edits retain placement');
  state = reducer(state, VisStateActions.duplicateAnnotation('caption'));
  t.deepEqual(state.annotations[0].readout, readout, 'duplicates readout');
  t.notEqual(
    state.annotations[0].viewport,
    state.annotations[1].viewport,
    'duplicate owns placement'
  );
  state = reducer(state, VisStateActions.updateAnnotation('caption', {readout: undefined}));
  t.notOk(state.annotations[1].readout, 'can return to static content');
  t.deepEqual(state.annotations[1].viewport, viewport, 'static caption remains anchored');
  state = reducer(state, VisStateActions.updateAnnotation('caption', {viewport: undefined}));
  t.notOk(state.annotations[1].viewport, 'can return to geographic text');
  state = reducer(state, VisStateActions.updateAnnotation('caption', {viewport, readout}));
  state = reducer(state, VisStateActions.updateAnnotation('caption', {kind: AnnotationKind.POINT}));
  t.notOk(state.annotations[1].viewport, 'kind change clears viewport placement');
  t.notOk(state.annotations[1].readout, 'kind change clears readout');
  state = reducer(state, VisStateActions.updateAnnotation('caption', {kind: AnnotationKind.TEXT}));
  t.notOk(state.annotations[1].viewport, 'switching back starts with geographic text');
  t.end();
});

test('#visStateReducer -> malformed caption fields never enter runtime state', t => {
  const validViewport = {anchor: 'top', margin: [24, 24]};
  for (const viewport of [
    {anchor: 'unknown', margin: [1, 1]},
    {anchor: 'top', margin: [-1, 1]},
    {anchor: 'top', margin: [NaN, 1]}
  ]) {
    let state = reducer(
      initialState,
      VisStateActions.addAnnotation({
        id: 'caption',
        kind: AnnotationKind.TEXT,
        viewport,
        readout: {type: 'time'}
      })
    );
    t.notOk(state.annotations[0].viewport, 'adding drops malformed placement');
    t.notOk(state.annotations[0].readout, 'adding drops readout without placement');
    state = reducer(
      state,
      VisStateActions.updateAnnotation('caption', {
        viewport: validViewport,
        readout: {type: 'count', dataId: ''}
      })
    );
    t.deepEqual(
      state.annotations[0].viewport,
      validViewport,
      'valid placement survives malformed readout'
    );
    t.notOk(state.annotations[0].readout, 'updating drops malformed readout');
  }
  t.end();
});
