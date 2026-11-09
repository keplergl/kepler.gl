// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {
  visStateReducer,
  mapStateReducer,
  uiStateReducer,
  INITIAL_VIS_STATE,
  INITIAL_MAP_STATE,
  INITIAL_UI_STATE
} from '@kepler.gl/reducers';
import {getCameraBookmarksCommand, getCameraTourCommand} from './camera-commands';
import type {KeplerContext, RoomCommand, RoomCommandResult} from './types';

const camera = {longitude: -122, latitude: 37, zoom: 10, bearing: 0, pitch: 30};
const stop = {id: 'a', name: 'A', camera, holdDurationMs: 100, travelDurationMs: 1000};

function makeContext(mapOverrides = {}) {
  let visState = INITIAL_VIS_STATE;
  let mapState = {...INITIAL_MAP_STATE, ...camera, ...mapOverrides};
  let uiState = INITIAL_UI_STATE;
  const dispatch = jest.fn(action => {
    visState = visStateReducer(visState, action);
    mapState = mapStateReducer(mapState, action);
    uiState = uiStateReducer(uiState, action);
  });
  const ctx = {
    getVisState: () => visState,
    getMapState: () => mapState,
    dispatch
  } as unknown as KeplerContext;
  return {ctx, dispatch, getUiState: () => uiState};
}
async function execute(command: RoomCommand, input: unknown) {
  return (await command.execute({} as any, input)) as RoomCommandResult<any>;
}

describe('camera commands', () => {
  it('captures the camera, updates a bookmark in place, lists and removes without losing other bookmarks', async () => {
    const {ctx, getUiState} = makeContext();
    const command = getCameraBookmarksCommand(ctx);
    expect(
      (await execute(command, {action: 'save', id: 'a', name: 'A', showControl: true})).success
    ).toBe(true);
    expect(ctx.getVisState().cameraBookmarks).toEqual([{id: 'a', name: 'A', camera}]);
    expect(getUiState().mapControls.cameraBookmarks?.show).toBe(true);
    await execute(command, {action: 'save', id: 'b', name: 'B', camera});
    await execute(command, {
      action: 'save',
      id: 'a',
      name: 'Updated',
      camera: {...camera, zoom: 8}
    });
    expect((await execute(command, {action: 'list'})).data.bookmarks.map(b => b.name)).toEqual([
      'Updated',
      'B'
    ]);
    await execute(command, {action: 'remove', id: 'a'});
    expect(ctx.getVisState().cameraBookmarks).toEqual([{id: 'b', name: 'B', camera}]);
  });

  it('navigates to a saved snapshot', async () => {
    const {ctx} = makeContext();
    const command = getCameraBookmarksCommand(ctx);
    const target = {...camera, longitude: 15, latitude: 50, zoom: 7};
    await execute(command, {action: 'save', id: 'b', name: 'B', camera: target});
    expect((await execute(command, {action: 'go-to', id: 'b'})).success).toBe(true);
    expect(ctx.getMapState?.()).toMatchObject(target);
  });

  it.each([{isSplit: true}, {globe: {enabled: true}}])(
    'rejects unsupported navigation modes: %j',
    async mode => {
      const {ctx, dispatch} = makeContext(mode);
      const command = getCameraBookmarksCommand(ctx);
      await execute(command, {action: 'save', id: 'b', name: 'B', camera});
      dispatch.mockClear();
      expect((await execute(command, {action: 'go-to', id: 'b'})).success).toBe(false);
      expect(dispatch).not.toHaveBeenCalled();
    }
  );

  it.each([
    {action: 'save', id: 'a', name: 'A', camera: {...camera, latitude: 100}},
    {action: 'save', id: 'a', name: 'A', camera: {...camera, zoom: NaN}},
    {action: 'go-to', id: 'missing'},
    {action: 'remove', id: 'missing'},
    {action: 'save', name: 'Missing id'},
    {action: 'save', id: 'a'},
    {}
  ])('rejects invalid bookmark input without mutation: %j', async input => {
    const {ctx, dispatch} = makeContext();
    expect((await execute(getCameraBookmarksCommand(ctx), input)).success).toBe(false);
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('supports explicit snapshots on older hosts and explains when current-camera access is missing', async () => {
    const {ctx, dispatch} = makeContext();
    delete ctx.getMapState;
    const command = getCameraBookmarksCommand(ctx);
    expect((await execute(command, {action: 'save', id: 'a', name: 'A'})).success).toBe(false);
    expect(dispatch).not.toHaveBeenCalled();
    expect((await execute(command, {action: 'save', id: 'a', name: 'A', camera})).success).toBe(
      true
    );
  });

  it('stores a tour, seeks interpolated locations, clamps at its end and clears it', async () => {
    const {ctx} = makeContext();
    const command = getCameraTourCommand(ctx);
    const end = {...camera, longitude: -120};
    const result = await execute(command, {
      action: 'set',
      stops: [stop, {...stop, id: 'b', camera: end}]
    });
    expect(result.success).toBe(true);
    expect(result.data.durationMs).toBe(1200);
    expect((await execute(command, {action: 'seek', elapsedMs: 600})).success).toBe(true);
    expect(ctx.getMapState?.()?.longitude).toBe(-121);
    await execute(command, {action: 'seek', elapsedMs: 2000});
    expect(ctx.getMapState?.()).toMatchObject(end);
    expect((await execute(command, {action: 'get'})).data.tour.stops).toHaveLength(2);
    await execute(command, {action: 'set', stops: []});
    expect(ctx.getVisState().cameraTour).toBeNull();
  });

  it.each([
    {action: 'set', stops: [stop, stop]},
    {action: 'set', stops: [{...stop, holdDurationMs: -1}]},
    {
      action: 'set',
      stops: [
        {...stop, holdDurationMs: Number.MAX_SAFE_INTEGER},
        {...stop, id: 'b'}
      ]
    },
    {action: 'seek', elapsedMs: 0},
    {action: 'set'},
    {action: 'seek'},
    {}
  ])('rejects invalid or missing tours without mutation: %j', async input => {
    const {ctx, dispatch} = makeContext();
    expect((await execute(getCameraTourCommand(ctx), input)).success).toBe(false);
    expect(dispatch).not.toHaveBeenCalled();
  });
});
