// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {setSelectedAnnotation} from '@kepler.gl/actions';
import {AnnotationKind} from '@kepler.gl/constants';
import {INITIAL_VIS_STATE, visStateReducer} from '@kepler.gl/reducers';
import {getAddAnnotationCommand, getListAnnotationsCommand} from './annotations-command';
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
