// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import {AnnotationsSchema} from '@kepler.gl/schemas';
import {AnnotationKind} from '@kepler.gl/constants';
import {VERSIONS} from '@kepler.gl/schemas';

const annotationPropsV1 = {
  id: null,
  kind: null,
  isVisible: null,
  autoSize: null,
  autoSizeY: null,
  anchorPoint: null,
  label: null,
  editorState: null,
  mapIndex: null,
  lineColor: null,
  lineWidth: null,
  textWidth: null,
  textHeight: null,
  textVerticalAlign: null,
  armLength: null,
  angle: null,
  radiusInMeters: null
};

const schema = new AnnotationsSchema({
  version: VERSIONS.v1,
  properties: annotationPropsV1
});

const makePointAnnotation = (overrides = {}) => ({
  id: 'ann-point-1',
  kind: AnnotationKind.POINT,
  isVisible: true,
  autoSize: true,
  autoSizeY: true,
  anchorPoint: [10, 20],
  label: 'Point annotation',
  editorState: {root: {children: [], direction: null, format: '', indent: 0, type: 'root', version: 1}},
  mapIndex: 0,
  lineColor: '#FF0000',
  lineWidth: 3,
  textWidth: 120,
  textHeight: 40,
  textVerticalAlign: 'bottom',
  armLength: 60,
  angle: -30,
  radiusInMeters: null,
  ...overrides
});

const makeCircleAnnotation = (overrides = {}) => ({
  id: 'ann-circle-1',
  kind: AnnotationKind.CIRCLE,
  isVisible: true,
  autoSize: true,
  autoSizeY: true,
  anchorPoint: [-122.4, 37.8],
  label: 'Circle annotation',
  editorState: null,
  mapIndex: null,
  lineColor: '#00FF00',
  lineWidth: 2,
  textWidth: 0,
  textHeight: 0,
  textVerticalAlign: 'bottom',
  armLength: 50,
  angle: -45,
  radiusInMeters: 5000,
  ...overrides
});

const makeTextAnnotation = (overrides = {}) => ({
  id: 'ann-text-1',
  kind: AnnotationKind.TEXT,
  isVisible: true,
  autoSize: true,
  autoSizeY: true,
  anchorPoint: [0, 0],
  label: 'Text only',
  editorState: null,
  mapIndex: null,
  lineColor: '#FFFFFF',
  lineWidth: 2,
  textWidth: 100,
  textHeight: 30,
  textVerticalAlign: 'middle',
  armLength: null,
  angle: null,
  radiusInMeters: null,
  ...overrides
});

test('#AnnotationsSchema -> save', t => {
  const annotations = [makePointAnnotation(), makeCircleAnnotation()];

  const saved = schema.save(annotations);

  t.ok(saved.annotations, 'should have annotations key');
  t.equal(saved.annotations.length, 2, 'should save 2 annotations');

  const savedPoint = saved.annotations[0];
  t.equal(savedPoint.id, 'ann-point-1', 'should save id');
  t.equal(savedPoint.kind, AnnotationKind.POINT, 'should save kind');
  t.deepEqual(savedPoint.anchorPoint, [10, 20], 'should save anchorPoint');
  t.equal(savedPoint.label, 'Point annotation', 'should save label');
  t.equal(savedPoint.lineColor, '#FF0000', 'should save lineColor');
  t.equal(savedPoint.armLength, 60, 'should save armLength');
  t.equal(savedPoint.angle, -30, 'should save angle');

  const savedCircle = saved.annotations[1];
  t.equal(savedCircle.kind, AnnotationKind.CIRCLE, 'should save circle kind');
  t.equal(savedCircle.radiusInMeters, 5000, 'should save radiusInMeters');

  t.end();
});

test('#AnnotationsSchema -> load', t => {
  const savedAnnotations = [
    {
      id: 'loaded-1',
      kind: AnnotationKind.ARROW,
      isVisible: true,
      autoSize: true,
      autoSizeY: true,
      anchorPoint: [5, 10],
      label: 'Loaded arrow',
      mapIndex: null,
      lineColor: '#0000FF',
      lineWidth: 4,
      textWidth: 80,
      textHeight: 20,
      textVerticalAlign: 'bottom',
      armLength: 70,
      angle: 45,
      radiusInMeters: null
    }
  ];

  const loaded = schema.load(savedAnnotations);

  t.ok(loaded.annotations, 'should have annotations key');
  t.equal(loaded.annotations.length, 1, 'should load 1 annotation');

  const ann = loaded.annotations[0];
  t.equal(ann.id, 'loaded-1', 'should load id');
  t.equal(ann.kind, AnnotationKind.ARROW, 'should load kind');
  t.deepEqual(ann.anchorPoint, [5, 10], 'should load anchorPoint');
  t.equal(ann.label, 'Loaded arrow', 'should load label');
  t.equal(ann.armLength, 70, 'should load armLength');

  t.end();
});

test('#AnnotationsSchema -> save/load round-trip', t => {
  const original = [makePointAnnotation(), makeCircleAnnotation(), makeTextAnnotation()];

  const saved = schema.save(original);
  const loaded = schema.load(saved.annotations);

  t.equal(loaded.annotations.length, 3, 'should round-trip 3 annotations');

  // Check point
  t.equal(loaded.annotations[0].id, 'ann-point-1', 'point id round-trips');
  t.equal(loaded.annotations[0].kind, AnnotationKind.POINT, 'point kind round-trips');
  t.deepEqual(loaded.annotations[0].anchorPoint, [10, 20], 'point anchorPoint round-trips');
  t.equal(loaded.annotations[0].armLength, 60, 'point armLength round-trips');
  t.equal(loaded.annotations[0].textVerticalAlign, 'bottom', 'point textVerticalAlign round-trips');
  t.deepEqual(
    loaded.annotations[0].editorState,
    {root: {children: [], direction: null, format: '', indent: 0, type: 'root', version: 1}},
    'point editorState round-trips'
  );

  // Check circle
  t.equal(loaded.annotations[1].id, 'ann-circle-1', 'circle id round-trips');
  t.equal(loaded.annotations[1].radiusInMeters, 5000, 'circle radiusInMeters round-trips');

  // Check text
  t.equal(loaded.annotations[2].id, 'ann-text-1', 'text id round-trips');
  t.equal(loaded.annotations[2].kind, AnnotationKind.TEXT, 'text kind round-trips');
  t.equal(loaded.annotations[2].textVerticalAlign, 'middle', 'text textVerticalAlign round-trips');

  t.end();
});

test('#AnnotationsSchema -> save empty annotations', t => {
  const saved = schema.save([]);

  t.ok(saved.annotations, 'should have annotations key');
  t.equal(saved.annotations.length, 0, 'should save empty array');

  t.end();
});

test('#AnnotationsSchema -> saves only known properties', t => {
  const annotation = {
    ...makePointAnnotation(),
    unknownProp: 'should be stripped',
    anotherExtra: 123
  };

  const saved = schema.save([annotation]);
  const savedAnn = saved.annotations[0];

  t.notOk('unknownProp' in savedAnn, 'should not save unknown properties');
  t.notOk('anotherExtra' in savedAnn, 'should not save extra properties');
  t.ok('id' in savedAnn, 'should save known property: id');
  t.ok('kind' in savedAnn, 'should save known property: kind');

  t.end();
});
