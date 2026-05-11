// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import {visStateReducer as reducer, INITIAL_VIS_STATE} from '@kepler.gl/reducers';
import {VisStateActions} from '@kepler.gl/actions';
import {AnnotationKind} from '@kepler.gl/constants';

const initialState = {...INITIAL_VIS_STATE};

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

test('#visStateReducer -> REMOVE_ANNOTATION', t => {
  let state = reducer(initialState, VisStateActions.addAnnotation({anchorPoint: [0, 0]}));
  const id = state.annotations[0].id;

  state = reducer(state, VisStateActions.removeAnnotation(id));

  t.equal(state.annotations.length, 0, 'should remove annotation');
  t.equal(state.selectedAnnotationId, null, 'should deselect removed annotation');

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
