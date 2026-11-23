// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {setSelectedAnnotation} from '@kepler.gl/actions';
import {AnnotationKind} from '@kepler.gl/constants';
import {INITIAL_VIS_STATE, visStateReducer} from '@kepler.gl/reducers';
import {
  getAddAnnotationCommand,
  getListAnnotationsCommand,
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

function setup() {
  let visState = INITIAL_VIS_STATE;
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
  expect((await execute(list, {})).data.annotations).toEqual([
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

const caption = {
  id: 'date',
  kind: 'text',
  label: 'Current date',
  viewport: {anchor: 'top-left', margin: [24, 24]},
  readout: {type: 'time', format: 'YYYY-MM-DD'}
};

test('creates, lists and updates viewport captions without requiring geographic coordinates', async () => {
  const {context, dispatch} = setup();
  expect(await execute(getAddAnnotationCommand(context), caption)).toMatchObject({success: true});
  expect(context.getVisState().annotations[0]).toMatchObject({
    ...caption,
    kind: AnnotationKind.TEXT,
    anchorPoint: [0, 0]
  });
  expect((await execute(getListAnnotationsCommand(context))).data.annotations).toEqual([
    {...caption, isVisible: true}
  ]);
  dispatch(setSelectedAnnotation('date', true));
  const updatedPlacement = {anchor: 'bottom-right', margin: [32, 48]};
  expect(
    await execute(getUpdateAnnotationCommand(context), {id: 'date', viewport: updatedPlacement})
  ).toMatchObject({success: true});
  expect(context.getVisState()).toMatchObject({
    selectedAnnotationId: 'date',
    isEditingAnnotationText: true
  });
  expect(context.getVisState().annotations[0].viewport).toEqual(updatedPlacement);
  expect(
    await execute(getUpdateAnnotationCommand(context), {
      id: 'date',
      readout: null,
      label: 'Credits'
    })
  ).toMatchObject({success: true});
  expect(context.getVisState().annotations[0].readout).toBeUndefined();
  expect(
    await execute(getUpdateAnnotationCommand(context), {
      id: 'date',
      viewport: null,
      anchorPoint: [12, 24]
    })
  ).toMatchObject({success: true});
  expect(context.getVisState().annotations[0].viewport).toBeUndefined();
  expect(context.getVisState().annotations[0].anchorPoint).toEqual([12, 24]);
});

test('supports static captions and count readouts from an existing dataset', async () => {
  const {context} = setup();
  expect(
    await execute(getAddAnnotationCommand(context), {
      ...caption,
      id: 'credits',
      readout: undefined,
      label: 'Data source'
    })
  ).toMatchObject({success: true});
  const original = context.getVisState;
  const datasets = {observations: {id: 'observations'}};
  context.getVisState = () => ({...original(), datasets} as any);
  expect(
    await execute(getAddAnnotationCommand(context), {
      ...caption,
      id: 'count',
      label: '',
      readout: {type: 'count', dataId: 'observations'}
    })
  ).toMatchObject({success: true});
  expect(context.getVisState().annotations[0].readout).toEqual({
    type: 'count',
    dataId: 'observations'
  });
});

test.each([
  {...caption, viewport: {anchor: 'center', margin: [24, 24]}},
  {...caption, viewport: {anchor: 'top', margin: [-1, 24]}},
  {...caption, viewport: {anchor: 'top', margin: [Infinity, 24]}},
  {...caption, viewport: undefined},
  {...caption, readout: {type: 'count', dataId: 'missing'}},
  {...caption, readout: {type: 'count', dataId: '__proto__'}},
  {...caption, readout: {type: 'count', dataId: 'constructor'}},
  {...caption, readout: {type: 'unsupported'}},
  {...caption, kind: 'ruler', endPoint: [1, 1]},
  {...caption, readout: undefined, label: ''}
])('rejects invalid caption creation without mutation: %j', async input => {
  const {context, dispatch} = setup();
  expect((await execute(getAddAnnotationCommand(context), input)).success).toBe(false);
  expect(dispatch).not.toHaveBeenCalled();
});

test('rejects invalid caption updates atomically and preserves authored content', async () => {
  const {context, dispatch} = setup();
  await execute(getAddAnnotationCommand(context), caption);
  const before = context.getVisState();
  dispatch.mockClear();
  for (const input of [
    {id: 'missing', label: 'No annotation'},
    {id: 'date'},
    {id: 'date', viewport: null},
    {id: 'date', viewport: {anchor: 'top', margin: [1]}},
    {id: 'date', readout: {type: 'count', dataId: 'missing'}},
    {id: 'date', readout: {type: 'count', dataId: '__proto__'}}
  ]) {
    expect((await execute(getUpdateAnnotationCommand(context), input)).success).toBe(false);
  }
  expect(dispatch).not.toHaveBeenCalled();
  expect(context.getVisState()).toBe(before);
});

test('updating an unlabeled ruler shows the new text and clearing it hides custom text', async () => {
  const {context} = setup();
  await execute(getAddAnnotationCommand(context), {
    id: 'ruler',
    kind: 'ruler',
    anchorPoint: [0, 0],
    endPoint: [1, 1]
  });
  expect(context.getVisState().annotations[0].showCustomText).toBe(false);
  expect(
    await execute(getUpdateAnnotationCommand(context), {
      id: 'ruler',
      label: 'Distance across the bay'
    })
  ).toMatchObject({success: true});
  expect(context.getVisState().annotations[0]).toMatchObject({
    label: 'Distance across the bay',
    showCustomText: true,
    showDistance: true
  });
  expect(
    await execute(getUpdateAnnotationCommand(context), {id: 'ruler', label: ''})
  ).toMatchObject({success: true});
  expect(context.getVisState().annotations[0]).toMatchObject({
    showCustomText: false,
    showDistance: true
  });
});

test('captions remain editable after the referenced count dataset is removed', async () => {
  const {context} = setup();
  const original = context.getVisState;
  let datasets: Record<string, unknown> = {observations: {id: 'observations'}};
  context.getVisState = () => ({...original(), datasets} as any);
  await execute(getAddAnnotationCommand(context), {
    ...caption,
    id: 'count',
    readout: {type: 'count', dataId: 'observations'}
  });
  datasets = {};
  const update = getUpdateAnnotationCommand(context);
  const viewport = {anchor: 'bottom-left', margin: [16, 32]};
  expect(
    await execute(update, {
      id: 'count',
      viewport,
      isVisible: false,
      label: 'Unavailable observations'
    })
  ).toMatchObject({success: true});
  expect(context.getVisState().annotations[0]).toMatchObject({
    viewport,
    isVisible: false,
    label: 'Unavailable observations',
    readout: {type: 'count', dataId: 'observations'}
  });
  expect(
    await execute(update, {id: 'count', readout: {type: 'count', dataId: 'missing'}})
  ).toMatchObject({success: false});
  expect(context.getVisState().annotations[0].readout).toEqual({
    type: 'count',
    dataId: 'observations'
  });
});
