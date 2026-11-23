// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {z} from 'zod';
import {EFFECT_DESCRIPTIONS} from '@kepler.gl/constants';
import {createEffect} from '@kepler.gl/effects';
import {INITIAL_MAP_STATE, INITIAL_VIS_STATE, visStateReducer} from '@kepler.gl/reducers';
import type {Effect} from '@kepler.gl/types';
import {computeDeckEffects} from '@kepler.gl/utils';
import {MAP_TOOL_IDS} from '../types';
import {getKeplerCommands} from './index';
import {getEffectsCommand, getSetEffectCommand} from './effects-command';
import type {KeplerContext, RoomCommandResult} from './types';

function setup(effects: Effect[] = []) {
  let state = {...INITIAL_VIS_STATE, effects, effectOrder: effects.map(effect => effect.id)};
  const dispatch = jest.fn(action => {
    state = visStateReducer(state, action);
  });
  const ctx = {getVisState: () => state, dispatch} as unknown as KeplerContext;
  const get = getEffectsCommand(ctx);
  const set = getSetEffectCommand(ctx);
  return {
    ctx,
    state: () => state,
    dispatch,
    get: async () => (await get.execute({} as any, {})) as RoomCommandResult<any>,
    set: async (input: unknown) => (await set.execute({} as any, input)) as RoomCommandResult<any>,
    rendered: () => computeDeckEffects({visState: state, mapState: INITIAL_MAP_STATE})
  };
}

describe('map effects commands', () => {
  it('registers discoverable schemas and lists the native catalog on an empty map without writes', async () => {
    const {ctx, get, dispatch} = setup();
    const commands = getKeplerCommands(ctx);
    for (const id of ['map.get-effects', 'map.set-effect'] as const) {
      expect(MAP_TOOL_IDS).toContain(id);
      expect(z.toJSONSchema(commands[id].inputSchema!)).toMatchObject({type: 'object'});
    }
    expect(commands['map.get-effects'].metadata?.readOnly).toBe(true);
    const result = await get();
    expect(result.success).toBe(true);
    expect(result.data.effects).toEqual([]);
    expect(result.data.effectOrder).toEqual([]);
    expect(result.data.supported.map(effect => effect.type)).toEqual(
      EFFECT_DESCRIPTIONS.map(effect => effect.type)
    );
    expect(result.data.supported.find(effect => effect.type === 'surfaceFog').parameters).toEqual(
      expect.arrayContaining([
        expect.objectContaining({name: 'height', type: 'number', min: -200, max: 6000}),
        expect.objectContaining({name: 'fogColor', type: 'color', defaultValue: [230, 235, 242]}),
        expect.objectContaining({name: 'pattern', type: 'checkbox', defaultValue: false})
      ])
    );
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('creates reflective water, patches its elevation, and toggles the native render effect without losing settings', async () => {
    const other = createEffect({id: 'contrast', type: 'brightnessContrast'});
    const {get, set, state, rendered} = setup([other]);
    const parameters = {height: 120, fogColor: [40, 120, 190], pattern: true};
    const result = await set({id: 'water', type: 'surfaceFog', parameters});
    expect(result).toMatchObject({
      success: true,
      data: {id: 'water', type: 'surfaceFog', isEnabled: true, parameters}
    });
    const water = state().effects.find(effect => effect.id === 'water')!;
    expect(rendered()).toContain(water.deckEffect);
    expect(water.deckEffect.props).toMatchObject(parameters);
    const original = {...water.parameters};
    const order = [...state().effectOrder];

    expect((await set({id: 'water', parameters: {height: 180}})).success).toBe(true);
    expect(water.parameters).toEqual({...original, height: 180});
    expect(water.deckEffect.props).toMatchObject({...parameters, height: 180});
    expect(state().effects[0]).toBe(other);
    expect(state().effectOrder).toEqual(order);
    expect((await get()).data.effects).toContainEqual({
      id: 'water',
      type: 'surfaceFog',
      isEnabled: true,
      parameters: {...original, height: 180}
    });

    expect((await set({id: 'water', isEnabled: false})).data.isEnabled).toBe(false);
    expect(rendered()).not.toContain(water.deckEffect);
    expect((await get()).data.effects.find(effect => effect.id === 'water').isEnabled).toBe(false);
    await set({id: 'water', parameters: {height: 0}});
    expect(water.isEnabled).toBe(false);
    await set({id: 'water', isEnabled: true});
    expect(water.parameters).toEqual({...original, height: 0});
    expect(rendered()).toContain(water.deckEffect);
    expect(state().effects).toHaveLength(2);
    expect(JSON.parse(JSON.stringify((await get()).data.effects))).toEqual([
      {id: other.id, type: other.type, isEnabled: true, parameters: other.parameters},
      {id: water.id, type: water.type, isEnabled: true, parameters: water.parameters}
    ]);
  });

  it('patches a UI-created effect while preserving animation and native numeric/vector validation', async () => {
    const animation = {
      height: [
        {
          id: 'rise',
          startValue: 0,
          endValue: 500,
          startTimeMs: 0,
          endTimeMs: 1000,
          easing: 'linear' as const
        }
      ]
    };
    const water = createEffect({id: 'ui-water', type: 'surfaceFog', animation});
    const {set, state} = setup([water]);
    expect(
      await set({
        id: water.id,
        parameters: {height: 9000, fogColor: [-10, 120, 500], density: -1, pattern: false}
      })
    ).toMatchObject({
      success: true,
      data: {parameters: {height: 6000, fogColor: [0, 120, 255], density: 0, pattern: false}}
    });
    expect(water.animation).toEqual(animation);
    expect(
      (await set({id: water.id, parameters: {fogColor: []}})).data.parameters.fogColor
    ).toEqual([230, 235, 242]);
    expect(state().effects).toHaveLength(1);
  });

  it.each(EFFECT_DESCRIPTIONS)('creates $type with native defaults', async ({type}) => {
    const {set, state} = setup();
    const result = await set({id: 'effect', type});
    expect(result.success).toBe(true);
    expect(result.data.parameters).toEqual(createEffect({type}).parameters);
    expect(state().effects[0].deckEffect).toBeTruthy();
    await set({id: 'effect', type});
    expect(state().effects).toHaveLength(1);
  });

  it.each([
    ['surfaceFog', 'surfaceFog'],
    ['surfaceFog', 'distanceFog'],
    ['distanceFog', 'surfaceFog'],
    ['distanceFog', 'distanceFog'],
    ['lightAndShadow', 'lightAndShadow']
  ])('preserves native exclusivity for %s and %s, even when disabled', async (first, second) => {
    const {set, dispatch, state} = setup([
      createEffect({id: 'existing', type: first, isEnabled: false})
    ]);
    const before = state();
    expect((await set({id: 'new', type: second})).success).toBe(false);
    expect(state()).toBe(before);
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('allows repeated post-processing types and native vector updates by distinct IDs', async () => {
    const {set, state} = setup();
    await set({id: 'first', type: 'dotScreen'});
    expect(
      await set({id: 'second', type: 'dotScreen', parameters: {center: [-1, 2]}})
    ).toMatchObject({
      success: true,
      data: {parameters: {center: [0, 1]}}
    });
    expect(state().effects).toHaveLength(2);
    expect(state().effects[0].parameters.center).toEqual([0.5, 0.5]);
  });

  it.each<unknown>([
    {},
    null,
    {id: ' '},
    {id: 'missing'},
    {id: 'new', type: 'unknown'},
    {id: 'water', type: 'distanceFog'},
    {id: 'water', isEnabled: 'false'},
    {id: 'water', parameters: {height: 12, reflection: true}},
    {id: 'water', parameters: {constructor: 1}},
    {id: 'water', parameters: {height: null}},
    {id: 'water', parameters: {height: '120'}},
    {id: 'water', parameters: {height: true}},
    {id: 'water', parameters: {height: NaN}},
    {id: 'water', parameters: {height: Infinity}},
    {id: 'water', parameters: {fogColor: 1}},
    {id: 'water', parameters: {fogColor: [1, 2, NaN]}},
    {id: 'water', parameters: {pattern: 1}},
    {id: 'water', animation: {}}
  ])('rejects invalid input atomically: %j', async input => {
    const {set, dispatch, state} = setup([createEffect({id: 'water', type: 'surfaceFog'})]);
    const before = JSON.stringify(state().effects.map(effect => effect.getDefaultProps(effect)));
    expect((await set(input)).success).toBe(false);
    expect(dispatch).not.toHaveBeenCalled();
    expect(JSON.stringify(state().effects.map(effect => effect.getDefaultProps(effect)))).toBe(
      before
    );
  });
});
