// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {
  visStateReducer,
  INITIAL_VIS_STATE,
  getLayerZoomOpacityFactor,
  getZoomOpacityAnnotationTargetId
} from '@kepler.gl/reducers';
import {getZoomFadeCommand} from './zoom-fade-command';
import {getTooltipFieldsCommand, getSetTooltipFieldsCommand} from './tooltip-fields-command';
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

describe('tooltip fields', () => {
  function tooltipContext() {
    const {ctx, dispatch} = setup();
    const state = ctx.getVisState();
    state.datasets = {
      data: {
        fields: [
          {name: 'province', type: 'string'},
          {name: 'count', type: 'integer'}
        ]
      }
    } as any;
    state.interactionConfig = {
      ...state.interactionConfig,
      brush: {...state.interactionConfig.brush, enabled: true},
      tooltip: {
        ...state.interactionConfig.tooltip,
        enabled: false,
        config: {
          ...state.interactionConfig.tooltip.config,
          compareMode: true,
          compareType: 'relative',
          fieldsToShow: {
            data: [{name: 'count', format: '.2f'}],
            other: [{name: 'untouched', format: null}]
          }
        }
      }
    };
    return {
      ctx,
      dispatch,
      read: async (input: unknown = {dataId: 'data'}) =>
        (await getTooltipFieldsCommand(ctx).execute({} as any, input)) as RoomCommandResult<any>,
      write: async (input: unknown) =>
        (await getSetTooltipFieldsCommand(ctx).execute({} as any, input)) as RoomCommandResult<any>
    };
  }

  it('selects, orders and clears fields while preserving formats and all other interactions', async () => {
    const {ctx, dispatch, read, write} = tooltipContext();
    const previous = ctx.getVisState().interactionConfig;
    expect(await read()).toMatchObject({
      success: true,
      data: {enabled: false, fields: [{name: 'count', format: '.2f'}]}
    });
    expect(dispatch).not.toHaveBeenCalled();
    expect(await write({dataId: 'data', fields: ['province', 'count']})).toMatchObject({
      success: true,
      data: {
        enabled: false,
        fields: [
          {name: 'province', format: null},
          {name: 'count', format: '.2f'}
        ]
      }
    });
    expect(ctx.getVisState().interactionConfig).toEqual({
      ...previous,
      tooltip: {
        ...previous.tooltip,
        config: {
          ...previous.tooltip.config,
          fieldsToShow: {
            ...previous.tooltip.config.fieldsToShow,
            data: [
              {name: 'province', format: null},
              {name: 'count', format: '.2f'}
            ]
          }
        }
      }
    });
    expect(await write({dataId: 'data', fields: ['count', 'province']})).toMatchObject({
      success: true,
      data: {
        fields: [
          {name: 'count', format: '.2f'},
          {name: 'province', format: null}
        ]
      }
    });
    expect(await write({dataId: 'data', fields: []})).toMatchObject({
      success: true,
      data: {fields: []}
    });
    expect(await read()).toMatchObject({success: true, data: {fields: []}});
    expect(ctx.getVisState().interactionConfig.tooltip.config.fieldsToShow.other).toBe(
      previous.tooltip.config.fieldsToShow.other
    );
  });

  it.each([
    {fields: ['province', 'missing']},
    {fields: ['Province']},
    {fields: ['count', 'count']},
    {dataId: 'missing', fields: []},
    {fields: ['']},
    {fields: [null]},
    {},
    {fields: [], enabled: true}
  ])('rejects invalid selections atomically: %j', async input => {
    const {write, dispatch} = tooltipContext();
    expect(await write({dataId: 'data', ...input})).toMatchObject({success: false});
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('reads an empty selection and rejects an unknown dataset', async () => {
    const {ctx, read, write, dispatch} = tooltipContext();
    delete ctx.getVisState().interactionConfig.tooltip.config.fieldsToShow.data;
    expect(await read()).toMatchObject({success: true, data: {fields: []}});
    expect(await read({dataId: 'missing'})).toMatchObject({success: false});
    expect(dispatch).not.toHaveBeenCalled();
    expect(await write({dataId: 'data', fields: ['province']})).toMatchObject({success: true});
  });
});
