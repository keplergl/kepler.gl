// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import {
  getZoomOpacityAnnotationTargetId,
  mergeAnnotations,
  INITIAL_VIS_STATE,
  replaceDatasetDepsInState
} from '@kepler.gl/reducers';
import {DEFAULT_ANNOTATION_ELEVATION} from '@kepler.gl/utils';
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

test('#mergeAnnotations -> imports normalized opacity tracks without sharing or inventing metadata', t => {
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
  const source = makeAnnotation({id: 'animated', propertyTransitions: {opacity: [last, first]}});
  const result = mergeAnnotations(makeState(), [
    source,
    makeAnnotation({id: 'cleared', propertyTransitions: {opacity: []}}),
    makeAnnotation({id: 'legacy'}),
    makeAnnotation({id: 'invalid', propertyTransitions: {opacity: [{...first, endValue: 2}]}}),
    makeAnnotation({
      id: 'overlap',
      propertyTransitions: {opacity: [first, {...last, startTimeMs: 2000}]}
    })
  ]);
  t.deepEqual(
    result.annotations[0].propertyTransitions?.opacity,
    [first, last],
    'imports a sorted track'
  );
  t.notEqual(
    result.annotations[0].propertyTransitions?.opacity,
    source.propertyTransitions?.opacity,
    'import owns its array'
  );
  t.notEqual(
    result.annotations[0].propertyTransitions?.opacity[0],
    first,
    'import owns its entries'
  );
  t.equal(source.propertyTransitions?.opacity[0].id, 'last', 'import does not reorder source');
  t.deepEqual(
    result.annotations[1].propertyTransitions?.opacity,
    [],
    'imports explicit empty tracks'
  );
  for (const annotation of result.annotations.slice(2)) {
    t.notOk(
      'propertyTransitions' in annotation,
      `${annotation.id} has no invalid or invented animation`
    );
  }
  t.end();
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
    makeAnnotation({id: 'ruler', kind: AnnotationKind.RULER, endPoint: [1, 1]}),
    makeAnnotation({id: 'invalid', kind: 'HEXAGON'})
  ];

  const result = mergeAnnotations(state, annotations);

  t.equal(result.annotations.length, 5, 'should accept 5 valid kinds');
  const ids = result.annotations.map(a => a.id);
  t.ok(ids.includes('text'), 'TEXT is valid');
  t.ok(ids.includes('point'), 'POINT is valid');
  t.ok(ids.includes('arrow'), 'ARROW is valid');
  t.ok(ids.includes('circle'), 'CIRCLE is valid');
  t.ok(ids.includes('ruler'), 'RULER is valid');
  t.notOk(ids.includes('invalid'), 'HEXAGON is invalid');

  t.end();
});

test('#mergeAnnotations -> should validate RULER endPoint', t => {
  const state = makeState();
  const annotations = [
    makeAnnotation({id: 'valid-ruler', kind: AnnotationKind.RULER, endPoint: [1, 2, 3]}),
    makeAnnotation({id: 'missing-end', kind: AnnotationKind.RULER}),
    makeAnnotation({id: 'bad-end', kind: AnnotationKind.RULER, endPoint: [1, Number.NaN]})
  ];

  const result = mergeAnnotations(state, annotations);

  t.equal(result.annotations.length, 1, 'only ruler with a finite 2D/3D endpoint should merge');
  t.equal(result.annotations[0].id, 'valid-ruler', 'valid ruler should be preserved');
  t.deepEqual(result.annotations[0].endPoint, [1, 2, 3], '3D endpoint should be preserved');
  t.equal(result.annotations[0].showCustomText, true, 'missing custom text flag should default on');
  t.equal(result.annotations[0].showDistance, true, 'missing distance flag should default on');

  t.end();
});

test('#mergeAnnotations -> should not stamp default text placement on legacy annotations', t => {
  const state = makeState();
  const annotations = [
    makeAnnotation({id: 'legacy', angle: 180, textSide: undefined, textVerticalPosition: undefined})
  ];
  // omit the new fields the way saved maps without them look
  delete annotations[0].textSide;
  delete annotations[0].textVerticalPosition;

  const result = mergeAnnotations(state, annotations);

  t.equal(result.annotations.length, 1, 'should merge the legacy annotation');
  t.notOk(result.annotations[0].textSide, 'should not default textSide');
  t.notOk(result.annotations[0].textVerticalPosition, 'should not default textVerticalPosition');
  t.equal(result.annotations[0].angle, 180, 'should keep saved angle');

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

test('#mergeAnnotations -> should accept 3D anchorPoint', t => {
  const state = makeState();
  const annotations = [
    makeAnnotation({id: 'xyz', anchorPoint: [-122.4, 37.8, 45]}),
    makeAnnotation({id: 'too-long', anchorPoint: [1, 2, 3, 4]}),
    makeAnnotation({id: 'nan-z', anchorPoint: [1, 2, Number.NaN]})
  ];

  const result = mergeAnnotations(state, annotations);

  t.equal(result.annotations.length, 1, 'should only accept [lng, lat] or [lng, lat, alt]');
  t.equal(result.annotations[0].id, 'xyz', 'should keep the 3D annotation');
  t.deepEqual(result.annotations[0].anchorPoint, [-122.4, 37.8, 45], 'should keep altitude');

  t.end();
});

test('#mergeAnnotations -> imports viewport captions and rejects malformed placement/content', t => {
  const viewport = {anchor: 'bottom-right', margin: [24, 32]};
  const readout = {type: 'count', dataId: 'observations'};
  const caption = {id: 'caption', kind: AnnotationKind.TEXT, viewport, readout, label: 'Count'};
  const result = mergeAnnotations(makeState(), [
    caption,
    {...caption, id: 'bad-anchor', viewport: {...viewport, anchor: 'center'}},
    {...caption, id: 'negative-margin', viewport: {...viewport, margin: [-1, 4]}},
    {...caption, id: 'nonfinite-margin', viewport: {...viewport, margin: [Infinity, 4]}},
    {...caption, id: 'missing-margin', viewport: {anchor: 'top'}},
    {...caption, id: 'bad-readout', readout: {type: 'count'}},
    {...caption, id: 'geographic-readout', viewport: undefined, anchorPoint: [40, 0]},
    {...caption, id: 'point-caption', kind: AnnotationKind.POINT, anchorPoint: [0, 0]}
  ]);
  t.equal(result.annotations.length, 2, 'both valid placements are imported');
  t.deepEqual(result.annotations[1].readout, readout, 'geographic text also restores its readout');
  t.deepEqual(result.annotations[1].anchorPoint, [40, 0], 'preserves geographic location');
  t.deepEqual(result.annotations[0].viewport, viewport, 'placement is preserved');
  t.deepEqual(result.annotations[0].readout, readout, 'count source is preserved');
  t.deepEqual(result.annotations[0].anchorPoint, [0, 0], 'caption needs no geographic coordinates');
  t.notEqual(result.annotations[0].viewport, viewport, 'placement belongs to imported state');
  t.notEqual(result.annotations[0].viewport.margin, viewport.margin, 'margins are cloned');
  t.notEqual(result.annotations[0].readout, readout, 'readout belongs to imported state');
  t.end();
});

test('#mergeAnnotations -> count captions follow dataset replacements', t => {
  const caption = makeAnnotation({
    id: 'count',
    kind: AnnotationKind.TEXT,
    viewport: {anchor: 'top-left', margin: [24, 24]},
    readout: {type: 'count', dataId: 'original'}
  });
  const staticCaption = {...caption, id: 'static', readout: undefined, isVisible: false};
  const otherCaption = {...caption, id: 'other', readout: {type: 'count', dataId: 'other-data'}};
  const state = {
    ...makeState([caption, staticCaption, otherCaption]),
    selectedAnnotationId: caption.id,
    interactionConfig: {
      ...INITIAL_VIS_STATE.interactionConfig,
      zoomOpacity: {
        ...INITIAL_VIS_STATE.interactionConfig.zoomOpacity,
        enabled: true,
        config: {
          controllers: [
            {
              id: 'controller',
              layerIds: [caption, staticCaption].map(a => getZoomOpacityAnnotationTargetId(a.id)),
              stops: {appear: 1, full: 3, fade: 8, gone: 12}
            }
          ]
        }
      }
    }
  };
  const sourceAnnotations = JSON.parse(JSON.stringify(state.annotations));
  const parked = replaceDatasetDepsInState(state, {dataId: 'original', dataIdToUse: 'replacement'});
  t.deepEqual(
    parked.annotations.map(a => a.id),
    ['static', 'other'],
    'only the dependent caption is parked'
  );
  t.deepEqual(
    parked.annotationsToBeMerged[0].readout,
    {type: 'count', dataId: 'replacement'},
    'rewrites nested count source'
  );
  const merged = mergeAnnotations(parked, parked.annotationsToBeMerged);
  t.deepEqual(
    merged.annotations.map(a => a.id),
    ['count', 'static', 'other'],
    'overlapping captions keep their stacking order'
  );
  t.deepEqual(
    merged.annotations.find(a => a.id === 'count').readout,
    {type: 'count', dataId: 'replacement'},
    'restored caption follows replacement dataset'
  );
  t.deepEqual(
    merged.annotations.find(a => a.id === 'count').viewport,
    caption.viewport,
    'keeps saved viewport placement'
  );
  t.deepEqual(caption.readout, {type: 'count', dataId: 'original'}, 'does not mutate prior state');
  t.deepEqual(
    JSON.parse(JSON.stringify(state.annotations)),
    sourceAnnotations,
    'does not mutate the source annotation array or its entries'
  );
  t.equal(merged.annotations[1], staticCaption, 'retains the surviving hidden caption');
  t.equal(
    merged.selectedAnnotationId,
    caption.id,
    'selection still references the restored caption'
  );
  t.equal(
    merged.interactionConfig.zoomOpacity,
    state.interactionConfig.zoomOpacity,
    'preserves visibility controller references for restored and surviving captions'
  );
  t.deepEqual(
    merged.annotations.find(a => a.id === 'other').readout,
    otherCaption.readout,
    'unrelated count source is preserved'
  );
  t.end();
});

test('#mergeAnnotations -> interleaved dataset replacements preserve caption order', t => {
  const caption = makeAnnotation({
    kind: AnnotationKind.TEXT,
    viewport: {anchor: 'top-left', margin: [24, 24]}
  });
  const state = makeState([
    {...caption, id: 'first', readout: {type: 'count', dataId: 'first-data'}},
    {...caption, id: 'second', readout: {type: 'count', dataId: 'second-data'}},
    {...caption, id: 'static'},
    {...caption, id: 'last', readout: {type: 'count', dataId: 'first-data'}},
    {...caption, id: 'other', readout: {type: 'count', dataId: 'other-data'}}
  ]);
  const sourceAnnotations = JSON.parse(JSON.stringify(state.annotations));
  const firstParked = replaceDatasetDepsInState(state, {
    dataId: 'first-data',
    dataIdToUse: 'first-replacement'
  });
  const bothParked = replaceDatasetDepsInState(firstParked, {
    dataId: 'second-data',
    dataIdToUse: 'second-replacement'
  });
  const secondRestored = mergeAnnotations(
    bothParked,
    bothParked.annotationsToBeMerged.filter(a => a.id === 'second')
  );
  t.deepEqual(
    secondRestored.annotations.map(a => a.id),
    ['second', 'static', 'other'],
    'restores in front when its preceding caption is still parked'
  );
  const merged = mergeAnnotations(
    secondRestored,
    bothParked.annotationsToBeMerged.filter(a => a.id !== 'second')
  );
  t.deepEqual(
    merged.annotations.map(a => a.id),
    ['first', 'second', 'static', 'last', 'other'],
    'restores the original order when datasets finish in reverse order'
  );
  t.deepEqual(
    merged.annotations.map(a => a.readout?.dataId),
    ['first-replacement', 'second-replacement', undefined, 'first-replacement', 'other-data'],
    'all restored captions follow their replacement datasets'
  );
  t.deepEqual(
    state.annotations,
    sourceAnnotations,
    'keeps the source array and its entries intact'
  );
  const imported = mergeAnnotations(merged, [{...caption, id: 'new'}]);
  t.deepEqual(
    imported.annotations.map(a => a.id),
    ['first', 'second', 'static', 'last', 'other', 'new'],
    'new captions still append after a replacement has preserved the order'
  );
  t.end();
});

test('#mergeAnnotations -> normalizes ruler presentation without changing legacy annotations', t => {
  const source = makeAnnotation({
    kind: AnnotationKind.RULER,
    endPoint: [1, 0],
    rulerStyle: {unit: 'm', precision: 0, offset: 24},
    labelBackground: {color: '#112233', opacity: 0.5, padding: 6}
  });
  const result = mergeAnnotations(makeState(), [
    source,
    makeAnnotation({id: 'legacy', kind: AnnotationKind.RULER, endPoint: [1, 0]}),
    makeAnnotation({
      id: 'invalid',
      kind: AnnotationKind.RULER,
      endPoint: [1, 0],
      rulerStyle: {precision: 100, offset: -1},
      labelBackground: {color: '#112233', opacity: 2, padding: 6}
    }),
    makeAnnotation({id: 'point', rulerStyle: source.rulerStyle})
  ]).annotations;
  t.equal(result[0].rulerStyle.unit, 'm', 'explicit units survive import');
  t.equal(result[0].rulerStyle.precision, 0, 'zero decimal places survive import');
  t.notEqual(result[0].rulerStyle, source.rulerStyle, 'import does not share mutable settings');
  t.notEqual(
    result[0].labelBackground,
    source.labelBackground,
    'import clones background settings'
  );
  t.notOk('rulerStyle' in result[1], 'legacy rulers have no new settings');
  t.equal(result[2].rulerStyle.precision, 1, 'invalid precision uses a safe default');
  t.equal(result[2].rulerStyle.offset, 0, 'invalid offset uses a safe default');
  t.notOk(result[2].labelBackground, 'invalid background is discarded');
  t.notOk(result[3].rulerStyle, 'ruler style is ignored for other annotation kinds');
  t.end();
});

test('#mergeAnnotations -> elevation values remain captured and malformed settings do not remove the point', t => {
  const elevation = {
    ...DEFAULT_ANNOTATION_ELEVATION,
    value: 7448.36,
    datum: 'MSL',
    field: {dataId: 'missing-dataset', name: 'altitude'}
  };
  const result = mergeAnnotations(makeState(), [
    makeAnnotation({id: 'captured', elevation}),
    makeAnnotation({id: 'invalid', elevation: {...elevation, value: NaN}}),
    makeAnnotation({id: 'legacy'}),
    makeAnnotation({id: 'text', kind: AnnotationKind.TEXT, elevation})
  ]).annotations;
  t.equal(result.length, 4, 'all annotations survive import');
  t.deepEqual(
    result[0].elevation,
    elevation,
    'a captured value does not require its dataset to remain loaded'
  );
  t.notEqual(result[0].elevation.field, elevation.field, 'source metadata is copied');
  t.notOk(result[1].elevation, 'invalid settings are discarded without inventing a zero');
  t.notOk(result[2].elevation, 'legacy settings stay omitted');
  t.notOk(result[3].elevation, 'only point annotations have elevation');
  t.end();
});

test('#mergeAnnotations -> source fields follow dataset replacements without refreshing captured elevations', t => {
  const elevation = {
    ...DEFAULT_ANNOTATION_ELEVATION,
    value: 7448.36,
    field: {dataId: 'original', name: 'altitude'}
  };
  const point = makeAnnotation({elevation, readout: {type: 'count', dataId: 'other'}});
  const state = makeState([point, makeAnnotation({id: 'static'})]);
  const parked = replaceDatasetDepsInState(state, {dataId: 'original', dataIdToUse: 'replacement'});
  const merged = mergeAnnotations(parked, parked.annotationsToBeMerged);
  t.deepEqual(
    merged.annotations.map(a => a.id),
    ['ann-1', 'static'],
    'preserves annotation ordering'
  );
  t.deepEqual(
    merged.annotations[0].elevation,
    {...elevation, field: {...elevation.field, dataId: 'replacement'}},
    'rewrites only source provenance'
  );
  t.deepEqual(
    merged.annotations[0].readout,
    point.readout,
    'unrelated count readout remains intact'
  );
  t.equal(point.elevation.field.dataId, 'original', 'original provenance is immutable');
  t.end();
});

test('#mergeAnnotations -> replaces both dependencies of parked elevations in either order', t => {
  for (const dataIds of [
    ['counts', 'elevations'],
    ['elevations', 'counts']
  ]) {
    const elevation = {
      ...DEFAULT_ANNOTATION_ELEVATION,
      value: 7448.36,
      field: {dataId: 'elevations', name: 'altitude'}
    };
    const readout = {type: 'count', dataId: 'counts'};
    const state = makeState([
      makeAnnotation({id: 'count', readout}),
      makeAnnotation({id: 'both', readout, elevation}),
      makeAnnotation({id: 'static'}),
      makeAnnotation({id: 'elevation', elevation}),
      makeAnnotation({id: 'other', readout: {type: 'count', dataId: 'other-data'}})
    ]);
    const source = JSON.parse(JSON.stringify(state.annotations));
    const firstParked = replaceDatasetDepsInState(state, {
      dataId: dataIds[0],
      dataIdToUse: `${dataIds[0]}-replacement`
    });
    const firstSnapshot = JSON.parse(JSON.stringify(firstParked.annotationsToBeMerged));
    const parked = replaceDatasetDepsInState(firstParked, {
      dataId: dataIds[1],
      dataIdToUse: `${dataIds[1]}-replacement`
    });
    const merged = mergeAnnotations(parked, [...parked.annotationsToBeMerged].reverse());
    t.deepEqual(
      merged.annotations.map(a => a.id),
      source.map(a => a.id),
      'restores original order'
    );
    const point = merged.annotations.find(a => a.id === 'both');
    t.deepEqual(point.readout, {...readout, dataId: 'counts-replacement'}, 'rewrites count source');
    t.deepEqual(
      point.elevation,
      {
        ...elevation,
        field: {...elevation.field, dataId: 'elevations-replacement'}
      },
      'rewrites elevation source without changing the captured measurement'
    );
    t.equal(merged.annotations[4], state.annotations[4], 'keeps unrelated annotations intact');
    t.deepEqual(state.annotations, source, 'does not mutate active annotations');
    t.deepEqual(
      firstParked.annotationsToBeMerged,
      firstSnapshot,
      'does not mutate parked annotations'
    );
  }
  t.end();
});

test('#mergeAnnotations -> preserves valid scales and discards malformed or unsupported settings', t => {
  const verticalScale = {
    min: -1,
    max: 1,
    tickSpacing: 1,
    unit: 'km',
    precision: 2,
    displayMin: 0,
    displayMax: 6000
  };
  const result = mergeAnnotations(makeState(), [
    makeAnnotation({id: 'scale', verticalScale}),
    makeAnnotation({id: 'invalid', verticalScale: {...verticalScale, tickSpacing: 0}}),
    makeAnnotation({id: 'legacy'}),
    makeAnnotation({id: 'text', kind: AnnotationKind.TEXT, verticalScale})
  ]).annotations;
  t.equal(result.length, 4, 'all annotations survive');
  t.deepEqual(
    result[0].verticalScale,
    verticalScale,
    'preserves the signed range and drawing bounds'
  );
  t.notEqual(result[0].verticalScale, verticalScale, 'owns copied settings');
  t.notOk(result[1].verticalScale, 'invalid scale cannot allocate ticks');
  t.notOk(result[2].verticalScale, 'legacy settings stay omitted');
  t.notOk(result[3].verticalScale, 'non-point scales are discarded');
  t.end();
});
