// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {addAnnotation, layerConfigChange, updateAnnotation, updateEffect} from '@kepler.gl/actions';
import {AnnotationKind} from '@kepler.gl/constants';
import {createEffect} from '@kepler.gl/effects';
import {LayerClasses} from '@kepler.gl/layers';
import {INITIAL_VIS_STATE, visStateReducer} from '@kepler.gl/reducers';
import KeplerTable from '@kepler.gl/table';
import {getPropertyTransitionsCommand} from './property-transitions-command';
import type {KeplerContext, RoomCommandResult} from './types';

const block = {
  id: 'first',
  startTimeMs: 0,
  endTimeMs: 1000,
  startValue: 0,
  endValue: 1,
  easing: 'linear' as const
};
const targets = [
  {type: 'layer', id: 'points', property: 'opacity'},
  {type: 'annotation', id: 'label', property: 'opacity'},
  {type: 'effect', id: 'brightness', property: 'brightness'}
];

function setup() {
  const dataset = new KeplerTable({info: {id: 'data'}} as any);
  const layer = new LayerClasses.point({id: 'points', dataId: dataset.id});
  layer.config.propertyTransitions = {radius: [{...block, startValue: 2, endValue: 8}]};
  const effect = createEffect({
    id: 'brightness',
    type: 'brightnessContrast',
    parameters: {brightness: 0.3, contrast: 0.4},
    animation: {contrast: [{...block, startValue: -0.5, endValue: 0.5}]}
  });
  let state: typeof INITIAL_VIS_STATE = {
    ...INITIAL_VIS_STATE,
    datasets: {[dataset.id]: dataset},
    layers: [layer],
    effects: [effect, createEffect({id: 'dots', type: 'dotScreen'})],
    effectOrder: ['brightness', 'dots'],
    cameraTour: {
      stops: [
        {
          id: 'camera',
          name: 'Camera',
          camera: {longitude: 0, latitude: 0, zoom: 5, bearing: 0, pitch: 30},
          holdDurationMs: 500,
          travelDurationMs: 1000
        }
      ]
    }
  };
  const dispatch = jest.fn(action => {
    state = visStateReducer(state, action);
  });
  dispatch(
    addAnnotation({
      id: 'label',
      kind: AnnotationKind.TEXT,
      label: 'Lava',
      anchorPoint: [-155, 19],
      propertyTransitions: {futureProperty: [{...block, startValue: 4, endValue: 5}]}
    })
  );
  dispatch.mockClear();
  const ctx = {getVisState: () => state, dispatch} as unknown as KeplerContext;
  const command = getPropertyTransitionsCommand(ctx);
  return {
    state: () => state,
    layer,
    dispatch,
    ctx,
    run: async (input: unknown) =>
      (await command.execute({} as any, input)) as RoomCommandResult<any>
  };
}

describe('timed property transition commands', () => {
  it('discovers current native properties and inspects saved inactive tracks without writes', async () => {
    const {run, layer, dispatch} = setup();
    const all = await run({action: 'discover'});
    expect(all.success).toBe(true);
    expect(all.data.targets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          target: {type: 'layer', id: 'points'},
          properties: expect.arrayContaining([
            expect.objectContaining({name: 'opacity', range: [0, 1]}),
            expect.objectContaining({name: 'color', type: 'color'}),
            expect.objectContaining({name: 'radius'})
          ])
        }),
        expect.objectContaining({
          target: {type: 'annotation', id: 'label'},
          properties: [expect.objectContaining({name: 'opacity', range: [0, 1]})]
        }),
        expect.objectContaining({
          target: {type: 'effect', id: 'dots'},
          properties: expect.arrayContaining([
            expect.objectContaining({name: 'center', type: 'array', min: 0, max: 1})
          ])
        })
      ])
    );
    layer.config.sizeField = {name: 'value', type: 'real'} as any;
    const target = {type: 'layer', id: 'points'};
    expect((await run({action: 'get', target, property: 'toString'})).data.tracks).toEqual({
      toString: []
    });
    const discover = await run({action: 'discover', target});
    expect(discover.data.targets).toHaveLength(1);
    expect(discover.data.targets[0].properties.some(property => property.name === 'radius')).toBe(
      false
    );
    expect((await run({action: 'get', target})).data.tracks.radius).toEqual(
      layer.config.propertyTransitions!.radius
    );
    const annotation = await run({
      action: 'get',
      target: {type: 'annotation', id: 'label'},
      property: 'futureProperty'
    });
    expect(annotation.data.tracks).toEqual({
      futureProperty: [{...block, startValue: 4, endValue: 5}]
    });
    expect(
      await run({action: 'add', target, property: 'radius', block: {...block, id: 'inactive'}})
    ).toMatchObject({success: false});
    expect(dispatch).not.toHaveBeenCalled();
  });

  it.each(targets)(
    'adds, patches and removes stable blocks on $type without changing other tracks',
    async ({type, id, property}) => {
      const {run, state} = setup();
      const target = {type, id};
      const initial = state();
      const initialLayerConfig = JSON.parse(JSON.stringify(initial.layers[0].config));
      const initialAnnotation = JSON.parse(JSON.stringify(initial.annotations[0]));
      const initialEffectParameters = {...initial.effects[0].parameters};
      const contrast = initial.effects[0].animation!.contrast;
      const second = {...block, id: 'second', startTimeMs: 2000, endTimeMs: 3000};
      expect(await run({action: 'add', target, property, block: second})).toMatchObject({
        success: true
      });
      expect(await run({action: 'add', target, property, block})).toMatchObject({success: true});
      expect((await run({action: 'get', target, property})).data.tracks[property]).toEqual([
        block,
        second
      ]);
      const changes = {endTimeMs: 500, endValue: 0.7, easing: 'easeInOut'};
      const updated = await run({action: 'update', target, property, blockId: 'first', changes});
      expect(updated.success).toBe(true);
      expect(updated.data.tracks[property]).toEqual([{...block, ...changes}, second]);
      expect(await run({action: 'remove', target, property, blockId: 'first'})).toMatchObject({
        success: true
      });
      expect((await run({action: 'get', target, property})).data.tracks[property]).toEqual([
        second
      ]);
      expect(await run({action: 'remove', target, property, blockId: 'second'})).toMatchObject({
        success: true
      });
      expect((await run({action: 'get', target, property})).data.tracks[property]).toEqual([]);
      expect(state().layers[0].config).toMatchObject(initialLayerConfig);
      expect(state().annotations[0]).toMatchObject(initialAnnotation);
      expect(state().effects[0].parameters).toEqual(initialEffectParameters);
      expect(state().effects[0].animation!.contrast).toEqual(contrast);
      expect(state().effects[1]).toBe(initial.effects[1]);
      expect(state().effectOrder).toEqual(initial.effectOrder);
      expect(state().cameraTour).toEqual(initial.cameraTour);
    }
  );

  it.each(targets)(
    'addresses whitespace-bearing native block IDs verbatim on $type',
    async ({type, id, property}) => {
      const {run, dispatch, state} = setup();
      const target = {type, id};
      const plain = {...block, id: 'reveal'};
      const spaced = {...block, id: ' reveal ', startTimeMs: 2000, endTimeMs: 3000};
      const track = {[property]: [plain, spaced]};
      if (type === 'layer') {
        dispatch(layerConfigChange(state().layers[0], {propertyTransitions: track}));
      } else if (type === 'annotation') {
        dispatch(updateAnnotation(id, {propertyTransitions: track}));
      } else {
        dispatch(updateEffect(id, {animation: track}));
      }
      expect((await run({action: 'get', target, property})).data.tracks[property]).toEqual([
        plain,
        spaced
      ]);

      expect(
        await run({
          action: 'update',
          target,
          property,
          blockId: spaced.id,
          changes: {endValue: 0.4}
        })
      ).toMatchObject({success: true});
      expect((await run({action: 'get', target, property})).data.tracks[property]).toEqual([
        plain,
        {...spaced, endValue: 0.4}
      ]);
      expect(await run({action: 'remove', target, property, blockId: spaced.id})).toMatchObject({
        success: true
      });
      expect((await run({action: 'get', target, property})).data.tracks[property]).toEqual([plain]);

      expect(await run({action: 'add', target, property, block: spaced})).toMatchObject({
        success: true
      });
      expect((await run({action: 'get', target, property})).data.tracks[property]).toEqual([
        plain,
        spaced
      ]);
    }
  );

  it.each(targets)(
    'accepts adjacent blocks and zero-duration cuts on $type',
    async ({type, id, property}) => {
      const {run} = setup();
      const target = {type, id};
      const cut = {...block, id: 'cut', startTimeMs: 1000, endTimeMs: 1000};
      const next = {...block, id: 'next', startTimeMs: 1000, endTimeMs: 2000};
      for (const candidate of [next, block, cut]) {
        expect((await run({action: 'add', target, property, block: candidate})).success).toBe(true);
      }
      expect((await run({action: 'get', target, property})).data.tracks[property]).toEqual([
        block,
        cut,
        next
      ]);
    }
  );

  it.each(targets)(
    'rejects duplicate ids, overlaps and missing blocks atomically on $type',
    async ({type, id, property}) => {
      const {run, dispatch, state} = setup();
      const target = {type, id};
      await run({action: 'add', target, property, block});
      await run({
        action: 'add',
        target,
        property,
        block: {...block, id: 'second', startTimeMs: 2000, endTimeMs: 3000}
      });
      dispatch.mockClear();
      const previous = state();
      for (const input of [
        {action: 'add', block: {...block, startTimeMs: 4000, endTimeMs: 5000}},
        {action: 'add', block: {...block, id: 'overlap', startTimeMs: 500, endTimeMs: 1500}},
        {action: 'update', blockId: 'first', changes: {endTimeMs: 2500}},
        {action: 'update', blockId: 'first', changes: {}},
        {action: 'update', blockId: 'missing', changes: {endValue: 0.4}},
        {action: 'remove', blockId: 'missing'}
      ]) {
        expect(await run({target, property, ...input})).toMatchObject({success: false});
      }
      expect(dispatch).not.toHaveBeenCalled();
      expect(state()).toBe(previous);
    }
  );

  it.each([
    {},
    {action: 'get', target: undefined},
    {action: 'add'},
    {action: 'add', property: undefined, block},
    {action: 'add', block: {...block, id: ''}},
    {action: 'add', block: {...block, id: ' \t\n '}},
    {action: 'add', block: {...block, startTimeMs: -1}},
    {action: 'add', block: {...block, endTimeMs: -1}},
    {action: 'add', block: {...block, startTimeMs: 2000}},
    {action: 'add', block: {...block, endTimeMs: Infinity}},
    {action: 'add', block: {...block, startValue: NaN}},
    {action: 'add', block: {...block, endValue: 2}},
    {action: 'add', block: {...block, endValue: [0, 0, 0]}},
    {action: 'add', block: {...block, easing: 'invalid'}},
    {action: 'add', property: 'missing', block},
    {action: 'add', property: 'constructor', block},
    {action: 'add', target: {type: 'layer', id: 'missing'}, block},
    {action: 'add', target: {type: 'layer', id: ' \t\n '}, block},
    {action: 'add', property: ' \t\n ', block},
    {action: 'update', blockId: 'first', changes: {id: 'renamed'}},
    {action: 'update', blockId: ' \t\n ', changes: {endValue: 0.4}},
    {action: 'remove', blockId: ' \t\n '},
    {action: 'remove'}
  ])('rejects malformed requests without dispatch: %j', async input => {
    const {run, dispatch} = setup();
    expect(
      await run({target: {type: 'layer', id: 'points'}, property: 'opacity', ...input})
    ).toMatchObject({success: false});
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('supports RGB layers and native vector effects, including native effect range clamping', async () => {
    const {run, dispatch} = setup();
    const color = {...block, startValue: [255, 0, 0], endValue: [0, 128, 255]};
    const target = {type: 'layer', id: 'points'};
    expect(await run({action: 'add', target, property: 'color', block: color})).toMatchObject({
      success: true
    });
    expect((await run({action: 'get', target, property: 'color'})).data.tracks.color).toEqual([
      color
    ]);
    const dots = {type: 'effect', id: 'dots'};
    expect(
      await run({
        action: 'add',
        target: dots,
        property: 'center',
        block: {...block, startValue: [-1, 0.2], endValue: [0.8, 2]}
      })
    ).toMatchObject({success: true});
    expect(
      (await run({action: 'get', target: dots, property: 'center'})).data.tracks.center
    ).toEqual([{...block, startValue: [0, 0.2], endValue: [0.8, 1]}]);
    dispatch.mockClear();
    for (const changes of [{startValue: [256, 0, 0]}, {endValue: [0, 0]}, {startValue: 0}]) {
      expect(
        await run({action: 'update', target, property: 'color', blockId: 'first', changes})
      ).toMatchObject({success: false});
    }
    expect(
      await run({
        action: 'update',
        target: dots,
        property: 'center',
        blockId: 'first',
        changes: {endValue: [0, 0, 0]}
      })
    ).toMatchObject({success: false});
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('returns empty discovery on an empty map', async () => {
    const dispatch = jest.fn();
    const ctx = {getVisState: () => INITIAL_VIS_STATE, dispatch} as unknown as KeplerContext;
    expect(
      await getPropertyTransitionsCommand(ctx).execute({} as any, {action: 'discover'})
    ).toMatchObject({success: true, data: {targets: []}});
    expect(dispatch).not.toHaveBeenCalled();
  });
});

test('MCP discovers Fill cuts and rejects interpolation for a toggle', async () => {
  const {run, state, dispatch} = setup();
  const target = {type: 'layer', id: 'points'};
  const property = 'filled';
  const discovered = await run({action: 'discover', target});
  expect(discovered.data.targets[0].properties).toContainEqual({
    name: property,
    label: 'Fill',
    type: 'toggle'
  });
  const action = {action: 'add', target, property};
  expect((await run({...action, block})).success).toBe(false);
  expect(dispatch).not.toHaveBeenCalled();
  const cut = {...block, endTimeMs: block.startTimeMs};
  expect((await run({...action, block: cut})).success).toBe(true);
  expect(state().layers[0].config.propertyTransitions?.filled).toEqual([cut]);
});
