// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {
  addAnnotation,
  receiveMapConfig,
  setSelectedAnnotation,
  updateAnnotation
} from '@kepler.gl/actions';
import {AnnotationKind} from '@kepler.gl/constants';
import {
  getLayerZoomOpacityFactor,
  getZoomOpacityAnnotationTargetId,
  INITIAL_VIS_STATE,
  visStateReducer
} from '@kepler.gl/reducers';
import {visStateSchema} from '@kepler.gl/schemas';
import {$getRoot, createEditor} from 'lexical';
import {
  getAddAnnotationCommand,
  getListAnnotationsCommand,
  getRemoveAnnotationCommand,
  getUpdateAnnotationCommand
} from './annotations-command';
import {getZoomFadeCommand} from './zoom-fade-command';
import type {KeplerContext, RoomCommand, RoomCommandResult} from './types';

const text = {
  id: 'civic-center',
  kind: 'text',
  anchorPoint: [-122.4, 37.8],
  label: 'Civic Center'
};

function setup(initialState = INITIAL_VIS_STATE) {
  let visState = initialState;
  const dispatch = jest.fn(action => {
    visState = visStateReducer(visState, action);
  });
  const context = {getVisState: () => visState, dispatch} as unknown as KeplerContext;
  return {context, dispatch};
}

async function execute(command: RoomCommand, input?: unknown) {
  return (await command.execute({} as any, input)) as RoomCommandResult<any>;
}

test('lists annotations for zoom fades and creates saved text and ruler via the reducers', async () => {
  const {context, dispatch} = setup();
  const list = getListAnnotationsCommand(context);
  const add = getAddAnnotationCommand(context);
  expect((await execute(list)).data.annotations).toEqual([]);
  expect(dispatch).not.toHaveBeenCalled();
  expect(await execute(add, text)).toMatchObject({success: true, data: {id: text.id}});
  expect(context.getVisState()).toMatchObject({
    selectedAnnotationId: null,
    isEditingAnnotationText: false
  });
  const ruler = {
    id: 'crossing',
    kind: 'ruler',
    anchorPoint: [-122, 38, 12],
    endPoint: [-123, 38, 16],
    mapIndex: 1
  };
  expect(await execute(add, ruler)).toMatchObject({success: true});
  expect(context.getVisState().annotations[0]).toMatchObject({
    ...ruler,
    kind: AnnotationKind.RULER,
    showCustomText: false,
    showDistance: true
  });
  expect((await execute(list, {})).data.annotations).toMatchObject([
    {...ruler, label: '', isVisible: true},
    {...text, isVisible: true}
  ]);
  const fade = getZoomFadeCommand(context);
  expect(
    await execute(fade, {
      enabled: true,
      controllers: [
        {id: 'detail', annotationIds: [text.id], stops: {appear: 2, full: 4, fade: 8, gone: 10}}
      ]
    })
  ).toMatchObject({success: true});
});

test.each([
  {...text, anchorPoint: [37, 122]},
  {...text, anchorPoint: [0, 0, Infinity]},
  {...text, label: ' '},
  {...text, endPoint: [0, 0]},
  {...text, kind: 'ruler'},
  {...text, mapIndex: 2},
  {...text, editorState: {}}
])('rejects invalid inputs without mutating the map: %j', async input => {
  const {context, dispatch} = setup();
  expect((await execute(getAddAnnotationCommand(context), input)).success).toBe(false);
  expect(dispatch).not.toHaveBeenCalled();
});

test('rejects ids with a colon before dispatching', async () => {
  const {context, dispatch} = setup();
  expect(await execute(getAddAnnotationCommand(context), {...text, id: 'poi:city'})).toMatchObject({
    success: false,
    error: expect.stringContaining('Annotation id must not contain a colon')
  });
  expect(dispatch).not.toHaveBeenCalled();
});

test('rejects duplicate ids and leaves an already-selected editor intact', async () => {
  const {context, dispatch} = setup();
  const add = getAddAnnotationCommand(context);
  await execute(add, text);
  dispatch(setSelectedAnnotation(text.id, true));
  expect(context.getVisState()).toMatchObject({
    selectedAnnotationId: text.id,
    isEditingAnnotationText: true
  });
  const callCount = dispatch.mock.calls.length;
  expect((await execute(add, {...text, label: 'Unwanted overwrite'})).error).toMatch(
    /already exists/
  );
  expect(dispatch).toHaveBeenCalledTimes(callCount);
  expect((await execute(add, {...text, id: 'next'})).success).toBe(true);
  expect(context.getVisState()).toMatchObject({
    selectedAnnotationId: text.id,
    isEditingAnnotationText: true
  });
});

function readRenderedText(editorState) {
  const editor = createEditor({
    onError: error => {
      throw error;
    }
  });
  editor.setEditorState(editor.parseEditorState(editorState));
  return editor.getEditorState().read(() => $getRoot().getTextContent());
}

function roundTrip(context: KeplerContext) {
  const saved = JSON.parse(JSON.stringify(visStateSchema.v1.save(context.getVisState() as any)));
  const loaded = visStateSchema.v1.load(saved.visState);
  const restored = setup();
  restored.dispatch(receiveMapConfig(loaded, {}));
  return restored;
}

test('round-trips a styled geographic island callout and keeps placement and fade after text and size edits', async () => {
  let {context, dispatch} = setup();
  const island = {
    id: 'hawaii',
    kind: 'point',
    anchorPoint: [-155.5, 19.6, 30],
    label: 'Hawaiʻi',
    fontSize: 32,
    textColor: '#FFEEDD',
    textAlign: 'center',
    textSide: 'left',
    textVerticalPosition: 'above',
    armLength: 80,
    lineColor: '#112233',
    lineWidth: 3,
    mapIndex: 1
  };
  expect(await execute(getAddAnnotationCommand(context), island)).toMatchObject({
    success: true,
    data: {...island, angle: -135, isVisible: true}
  });
  dispatch(
    updateAnnotation(island.id, {
      autoSize: false,
      textWidth: 300,
      textHeight: 100,
      propertyTransitions: {
        opacity: [
          {
            id: 'fade-in',
            startTimeMs: 0,
            endTimeMs: 500,
            startValue: 0,
            endValue: 1,
            easing: 'linear'
          }
        ]
      }
    })
  );
  expect(
    (
      await execute(getZoomFadeCommand(context), {
        enabled: true,
        controllers: [
          {
            id: 'islands',
            annotationIds: [island.id],
            stops: {appear: 2, full: 4, fade: 8, gone: 10}
          }
        ]
      })
    ).success
  ).toBe(true);
  ({context, dispatch} = roundTrip(context));
  const before = context.getVisState().annotations[0];
  const interactionConfig = context.getVisState().interactionConfig;
  const update = getUpdateAnnotationCommand(context);
  expect(await execute(update, {id: island.id, label: 'Island of Hawaiʻi'})).toMatchObject({
    success: true,
    data: {...island, label: 'Island of Hawaiʻi'}
  });
  expect(await execute(update, {id: island.id, fontSize: 48})).toMatchObject({
    success: true,
    data: {...island, label: 'Island of Hawaiʻi', fontSize: 48}
  });
  const edited = context.getVisState().annotations[0];
  expect(edited).toEqual({...before, label: 'Island of Hawaiʻi', editorState: edited.editorState});
  expect(readRenderedText(edited.editorState)).toBe('Island of Hawaiʻi');
  expect(context.getVisState().interactionConfig).toBe(interactionConfig);
  ({context} = roundTrip(context));
  const listed = (await execute(getListAnnotationsCommand(context))).data.annotations;
  expect(listed).toHaveLength(1);
  expect(listed[0]).toMatchObject({
    ...island,
    label: 'Island of Hawaiʻi',
    fontSize: 48,
    angle: -135
  });
  expect(context.getVisState().annotations[0]).toEqual(edited);
  const target = getZoomOpacityAnnotationTargetId(island.id);
  for (const [zoom, opacity] of [
    [1, 0],
    [3, 0.5],
    [6, 1],
    [9, 0.5],
    [11, 0]
  ]) {
    expect(getLayerZoomOpacityFactor(target, zoom, context.getVisState().interactionConfig)).toBe(
      opacity
    );
  }
});

test('updates leader placement like the panel while preserving the anchor and existing editor', async () => {
  const {context, dispatch} = setup();
  const add = getAddAnnotationCommand(context);
  const update = getUpdateAnnotationCommand(context);
  const point = {...text, kind: 'point'};
  const created = await execute(add, point);
  expect(created.data).toMatchObject({
    fontSize: 14,
    textColor: '#FFFFFF',
    textAlign: 'left',
    angle: -45
  });
  dispatch(setSelectedAnnotation(point.id, true));
  const editorState = context.getVisState().annotations[0].editorState;
  expect(
    await execute(update, {
      id: point.id,
      textSide: 'left',
      textVerticalPosition: 'below',
      armLength: 0
    })
  ).toMatchObject({
    success: true,
    data: {
      anchorPoint: point.anchorPoint,
      textSide: 'left',
      textVerticalPosition: 'below',
      angle: 135,
      armLength: 0
    }
  });
  expect(await execute(update, {id: point.id, angle: 30})).toMatchObject({
    success: true,
    data: {textSide: 'right', textVerticalPosition: 'below', angle: 30}
  });
  expect(context.getVisState().annotations[0].editorState).toBe(editorState);
  expect(context.getVisState()).toMatchObject({
    selectedAnnotationId: point.id,
    isEditingAnnotationText: true
  });
});

test.each([AnnotationKind.TEXT, AnnotationKind.ARROW, AnnotationKind.CIRCLE, AnnotationKind.RULER])(
  'updates existing native %s annotations without changing kind or other properties',
  async kind => {
    const {context, dispatch} = setup();
    dispatch(
      addAnnotation({id: 'existing:annotation', kind, label: 'Before', anchorPoint: [20, 10, 5]})
    );
    const original = context.getVisState().annotations[0];
    expect(
      await execute(getUpdateAnnotationCommand(context), {
        id: original.id,
        label: 'After',
        fontSize: 24,
        textColor: '#123456',
        textAlign: 'right'
      })
    ).toMatchObject({
      success: true,
      data: {id: original.id, kind: kind.toLowerCase(), label: 'After'}
    });
    const edited = context.getVisState().annotations[0];
    expect(edited).toEqual({...original, label: 'After', editorState: edited.editorState});
    expect(readRenderedText(edited.editorState)).toBe('After');
  }
);

test('updates ruler endpoints and caption visibility without losing the other endpoint', async () => {
  const {context} = setup();
  await execute(getAddAnnotationCommand(context), {
    ...text,
    kind: 'ruler',
    endPoint: [-123, 38, 10]
  });
  expect(
    await execute(getUpdateAnnotationCommand(context), {
      id: text.id,
      endPoint: [-124, 39, 20],
      showCustomText: false,
      showDistance: false
    })
  ).toMatchObject({
    success: true,
    data: {
      anchorPoint: text.anchorPoint,
      endPoint: [-124, 39, 20],
      showCustomText: false,
      showDistance: false
    }
  });
});

test('removes annotations with the native fade-target and selection cleanup', async () => {
  const {context, dispatch} = setup();
  const add = getAddAnnotationCommand(context);
  await execute(add, text);
  await execute(add, {...text, id: 'other'});
  await execute(getZoomFadeCommand(context), {
    enabled: true,
    controllers: [
      {
        id: 'shared',
        annotationIds: [text.id, 'other'],
        stops: {appear: 2, full: 4, fade: 8, gone: 10}
      }
    ]
  });
  dispatch(setSelectedAnnotation(text.id, true));
  const remove = getRemoveAnnotationCommand(context);
  expect(await execute(remove, {id: 'other'})).toMatchObject({success: true, data: {id: 'other'}});
  expect(context.getVisState()).toMatchObject({
    selectedAnnotationId: text.id,
    isEditingAnnotationText: true
  });
  expect(
    context.getVisState().interactionConfig.zoomOpacity.config.controllers[0].layerIds
  ).toEqual([getZoomOpacityAnnotationTargetId(text.id)]);
  expect(await execute(remove, {id: text.id})).toMatchObject({success: true, data: {id: text.id}});
  expect(context.getVisState()).toMatchObject({
    annotations: [],
    selectedAnnotationId: null,
    isEditingAnnotationText: false
  });
  expect(context.getVisState().interactionConfig.zoomOpacity.config.controllers).toEqual([
    {id: 'shared', layerIds: [], stops: {appear: 2, full: 4, fade: 8, gone: 10}}
  ]);
});

test.each([
  {kind: 'point', label: undefined},
  {kind: 'point', fontSize: 0},
  {kind: 'point', fontSize: Infinity},
  {kind: 'point', textColor: 'red'},
  {kind: 'point', textAlign: 'middle'},
  {kind: 'point', angle: 181},
  {kind: 'point', armLength: -1},
  {kind: 'point', endPoint: [0, 0]},
  {kind: 'text', textSide: 'left'},
  {kind: 'text', showDistance: true}
])('rejects invalid callout settings before creation: %j', async changes => {
  const {context, dispatch} = setup();
  expect((await execute(getAddAnnotationCommand(context), {...text, ...changes})).success).toBe(
    false
  );
  expect(dispatch).not.toHaveBeenCalled();
});

test.each([
  {},
  {id: ''},
  {id: 'missing', label: 'New'},
  {id: text.id},
  {id: text.id, kind: 'point'},
  {id: text.id, label: ''},
  {id: text.id, anchorPoint: [0, 91]},
  {id: text.id, fontSize: -1},
  {id: text.id, textColor: '#nothex'},
  {id: text.id, lineWidth: -1},
  {id: text.id, armLength: 10},
  {id: text.id, endPoint: [0, 0]},
  {id: text.id, editorState: {root: {}}}
])('rejects invalid or missing update targets without mutation: %j', async input => {
  const {context, dispatch} = setup();
  await execute(getAddAnnotationCommand(context), text);
  const before = context.getVisState();
  dispatch.mockClear();
  expect((await execute(getUpdateAnnotationCommand(context), input)).success).toBe(false);
  expect(dispatch).not.toHaveBeenCalled();
  expect(context.getVisState()).toBe(before);
});

test.each([{}, {id: ''}, {id: 'missing'}, {id: text.id, kind: 'text'}])(
  'rejects invalid removal without mutation: %j',
  async input => {
    const {context, dispatch} = setup();
    await execute(getAddAnnotationCommand(context), text);
    dispatch.mockClear();
    expect((await execute(getRemoveAnnotationCommand(context), input)).success).toBe(false);
    expect(dispatch).not.toHaveBeenCalled();
  }
);
