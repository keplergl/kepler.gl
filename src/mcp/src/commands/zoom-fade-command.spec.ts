// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {
  visStateReducer,
  INITIAL_VIS_STATE,
  getLayerZoomOpacityFactor,
  getZoomOpacityAnnotationTargetId
} from '@kepler.gl/reducers';
import {getZoomFadeCommand} from './zoom-fade-command';
import type {KeplerContext, RoomCommandResult} from './types';

const stops = {appear: 2, full: 4, fade: 8, gone: 10};
const controller = {id: 'detail', layerIds: ['points'], stops};
function setup() {
  let state = {...INITIAL_VIS_STATE, layers: [{id: 'points'}], annotations: [{id: 'note'}]} as any;
  const dispatch = jest.fn(action => {
    state = visStateReducer(state, action);
  });
  const ctx = {getVisState: () => state, dispatch} as unknown as KeplerContext;
  const command = getZoomFadeCommand(ctx);
  return {
    ctx,
    dispatch,
    execute: async (input: unknown) =>
      (await command.execute({} as any, input)) as RoomCommandResult
  };
}

describe('map.set-zoom-fade', () => {
  it('fades layers and annotations while preserving other interactions; disabling preserves controllers', async () => {
    const {ctx, execute} = setup();
    const tooltip = ctx.getVisState().interactionConfig.tooltip;
    expect(
      (await execute({enabled: true, controllers: [{...controller, annotationIds: ['note']}]}))
        .success
    ).toBe(true);
    let config = ctx.getVisState().interactionConfig;
    expect(config.tooltip).toBe(tooltip);
    expect(getLayerZoomOpacityFactor('points', 3, config)).toBe(0.5);
    expect(getLayerZoomOpacityFactor(getZoomOpacityAnnotationTargetId('note'), 9, config)).toBe(
      0.5
    );
    const controllers = config.zoomOpacity.config.controllers;
    await execute({enabled: false});
    config = ctx.getVisState().interactionConfig;
    expect(config.zoomOpacity.config.controllers).toBe(controllers);
    expect(getLayerZoomOpacityFactor('points', 3, config)).toBe(1);
    await execute({enabled: true, controllers: []});
    expect(ctx.getVisState().interactionConfig.zoomOpacity.config.controllers).toEqual([]);
  });

  it.each([
    [{...controller, layerIds: ['missing']}],
    [{...controller, annotationIds: ['missing']}],
    [{...controller, stops: {...stops, full: 1}}],
    [{...controller, stops: {...stops, gone: 25}}],
    [controller, {...controller, id: 'other'}],
    [controller, {...controller, layerIds: []}],
    [{...controller, layerIds: ['points', 'points']}]
  ])('rejects invalid controllers atomically: %j', async (...controllers) => {
    const {dispatch, execute} = setup();
    expect((await execute({enabled: true, controllers})).success).toBe(false);
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('requires an explicit enabled state', async () => {
    const {dispatch, execute} = setup();
    expect((await execute({})).success).toBe(false);
    expect(dispatch).not.toHaveBeenCalled();
  });
});
