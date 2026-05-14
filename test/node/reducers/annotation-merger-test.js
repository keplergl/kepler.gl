// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import {mergeAnnotations, INITIAL_VIS_STATE} from '@kepler.gl/reducers';
import {AnnotationKind} from '@kepler.gl/constants';

const makeState = (annotations = []) => ({
  ...INITIAL_VIS_STATE,
  annotations
});

const makeAnnotation = (overrides = {}) => ({
  id: 'ann-1',
  kind: AnnotationKind.POINT,
  isVisible: true,
  autoSize: true,
  autoSizeY: true,
  anchorPoint: [10, 20],
  label: 'Test',
  lineColor: '#FFFFFF',
  lineWidth: 2,
  textWidth: 0,
  textHeight: 0,
  armLength: 50,
  angle: -45,
  ...overrides
});

test('#mergeAnnotations -> should merge valid annotations', t => {
  const state = makeState();
  const annotations = [makeAnnotation({id: 'a1'}), makeAnnotation({id: 'a2', label: 'Second'})];

  const result = mergeAnnotations(state, annotations);

  t.equal(result.annotations.length, 2, 'should merge 2 annotations');
  t.equal(result.annotations[0].id, 'a1', 'first annotation id should match');
  t.equal(result.annotations[1].id, 'a2', 'second annotation id should match');

  t.end();
});

test('#mergeAnnotations -> should return same state for empty input', t => {
  const state = makeState();

  t.equal(mergeAnnotations(state, []), state, 'should return same state for empty array');
  t.equal(mergeAnnotations(state, null), state, 'should return same state for null');
  t.equal(mergeAnnotations(state, undefined), state, 'should return same state for undefined');

  t.end();
});

test('#mergeAnnotations -> should filter out invalid annotations', t => {
  const state = makeState();
  const annotations = [
    makeAnnotation({id: 'valid'}),
    {id: null, kind: AnnotationKind.POINT, anchorPoint: [0, 0]},
    {id: 'no-kind', kind: null, anchorPoint: [0, 0]},
    {id: 'no-anchor', kind: AnnotationKind.POINT, anchorPoint: 'invalid'},
    {id: 'bad-kind', kind: 'INVALID_KIND', anchorPoint: [0, 0]},
    null,
    undefined
  ];

  const result = mergeAnnotations(state, annotations);

  t.equal(result.annotations.length, 1, 'should only include valid annotation');
  t.equal(result.annotations[0].id, 'valid', 'should keep the valid one');

  t.end();
});

test('#mergeAnnotations -> should reject duplicate IDs', t => {
  const existing = makeAnnotation({id: 'existing-1'});
  const state = makeState([existing]);

  const annotations = [
    makeAnnotation({id: 'existing-1', label: 'Duplicate'}),
    makeAnnotation({id: 'new-1', label: 'New'})
  ];

  const result = mergeAnnotations(state, annotations);

  t.equal(result.annotations.length, 2, 'should have 2 annotations (1 existing + 1 new)');
  t.equal(result.annotations[0].id, 'existing-1', 'existing should remain');
  t.equal(result.annotations[0].label, 'Test', 'existing should not be overwritten');
  t.equal(result.annotations[1].id, 'new-1', 'new annotation should be appended');

  t.end();
});

test('#mergeAnnotations -> should validate annotation kind', t => {
  const state = makeState();
  const annotations = [
    makeAnnotation({id: 'text', kind: AnnotationKind.TEXT}),
    makeAnnotation({id: 'point', kind: AnnotationKind.POINT}),
    makeAnnotation({id: 'arrow', kind: AnnotationKind.ARROW}),
    makeAnnotation({id: 'circle', kind: AnnotationKind.CIRCLE}),
    makeAnnotation({id: 'invalid', kind: 'HEXAGON'})
  ];

  const result = mergeAnnotations(state, annotations);

  t.equal(result.annotations.length, 4, 'should accept 4 valid kinds');
  const ids = result.annotations.map(a => a.id);
  t.ok(ids.includes('text'), 'TEXT is valid');
  t.ok(ids.includes('point'), 'POINT is valid');
  t.ok(ids.includes('arrow'), 'ARROW is valid');
  t.ok(ids.includes('circle'), 'CIRCLE is valid');
  t.notOk(ids.includes('invalid'), 'HEXAGON is invalid');

  t.end();
});

test('#mergeAnnotations -> should return same state when all annotations are invalid', t => {
  const state = makeState();
  const annotations = [
    {id: 'bad1', kind: 'INVALID', anchorPoint: [0, 0]},
    {id: null, kind: AnnotationKind.POINT, anchorPoint: [0, 0]}
  ];

  const result = mergeAnnotations(state, annotations);

  t.equal(result, state, 'should return same state reference when no valid annotations');

  t.end();
});
