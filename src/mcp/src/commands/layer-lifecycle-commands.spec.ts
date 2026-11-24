// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {LayerClasses} from '@kepler.gl/layers';
import KeplerTable from '@kepler.gl/table';
import {getFlatLayerOrder, INITIAL_VIS_STATE, visStateReducer} from '@kepler.gl/reducers';
import type {LayerOrder} from '@kepler.gl/types';
import {MAP_TOOL_IDS} from '../types';
import {getKeplerCommands} from './index';
import type {KeplerContext, RoomCommandResult} from './types';

function setup(layerOrder: LayerOrder = ['labels', 'markers', 'ripples']) {
  const shared = new KeplerTable({info: {id: 'shared'}} as any);
  const other = new KeplerTable({info: {id: 'other'}} as any);
  const layers = [
    new LayerClasses.point({id: 'markers', dataId: shared.id}),
    new LayerClasses.point({id: 'ripples', dataId: shared.id}),
    new LayerClasses.point({id: 'labels', dataId: other.id})
  ];
  let state = {
    ...INITIAL_VIS_STATE,
    layers,
    layerData: [{data: []}, {data: []}, {data: []}],
    layerOrder,
    datasets: {shared, other},
    filters: [
      {id: 'shared-filter', dataId: ['shared']},
      {id: 'other-filter', dataId: ['other']}
    ],
    interactionConfig: {
      ...INITIAL_VIS_STATE.interactionConfig,
      tooltip: {
        ...INITIAL_VIS_STATE.interactionConfig.tooltip,
        config: {fieldsToShow: {shared: [], other: []}}
      }
    }
  } as any;
  const dispatch = jest.fn(action => {
    state = visStateReducer(state, action);
  });
  const ctx = {getVisState: () => state, dispatch} as unknown as KeplerContext;
  const commands = getKeplerCommands(ctx);
  return {
    state: () => state,
    dispatch,
    execute: async (id: string, input?: unknown) =>
      (await commands[id].execute({} as any, input)) as RoomCommandResult<any>
  };
}

it('exposes native stacking order instead of layer insertion order and reorders by ID', async () => {
  const {state, dispatch, execute} = setup();
  const originalLayers = state().layers;
  const originalData = state().layerData;
  const datasets = state().datasets;
  expect(await execute('map.get-layer-order')).toMatchObject({
    success: true,
    data: {order: 'top-to-bottom', layerIds: ['labels', 'markers', 'ripples']}
  });
  expect(dispatch).not.toHaveBeenCalled();
  const layerIds = ['ripples', 'labels', 'markers'];
  expect(await execute('map.reorder-layers', {layerIds})).toMatchObject({
    success: true,
    data: {order: 'top-to-bottom', layerIds}
  });
  expect(state().layerOrder).toEqual(layerIds);
  expect(state().layers).toBe(originalLayers);
  expect(state().layerData).toBe(originalData);
  expect(state().datasets).toBe(datasets);
  expect((await execute('map.get-layer-order')).data.layerIds).toEqual(layerIds);
});

it('removes only the selected layer, retaining the shared dataset and the remaining order', async () => {
  const {state, execute} = setup();
  const datasets = state().datasets;
  const originalLayers = state().layers;
  const originalData = state().layerData;
  expect(await execute('map.remove-layer', {layerId: 'markers'})).toMatchObject({
    success: true,
    data: {layerId: 'markers', dataId: 'shared'}
  });
  expect(state().layers).toEqual(originalLayers.slice(1));
  expect(state().layerData).toEqual(originalData.slice(1));
  expect(state().layerOrder).toEqual(['labels', 'ripples']);
  expect(state().datasets).toBe(datasets);
  expect(state().filters).toHaveLength(2);
});

it('previews affected layers, then removes a dataset using native dependent-state cleanup', async () => {
  const {state, dispatch, execute} = setup();
  const before = state();
  const expected = {dataId: 'shared', affectedLayerIds: ['markers', 'ripples']};
  expect(await execute('map.remove-dataset', {dataId: 'shared', dryRun: true})).toMatchObject({
    success: true,
    data: {...expected, dryRun: true}
  });
  expect(dispatch).not.toHaveBeenCalled();
  expect(state()).toBe(before);
  expect(await execute('map.remove-dataset', {dataId: 'shared'})).toMatchObject({
    success: true,
    data: {...expected, dryRun: false}
  });
  expect(state().layers).toEqual([before.layers[2]]);
  expect(state().layerOrder).toEqual(['labels']);
  expect(state().datasets).toEqual({other: before.datasets.other});
  expect(state().filters).toEqual([before.filters[1]]);
  expect(state().interactionConfig.tooltip.config.fieldsToShow).toEqual({other: []});
});

it.each([
  ['map.reorder-layers', {layerIds: ['missing', 'markers', 'ripples']}],
  ['map.reorder-layers', {layerIds: ['labels', 'markers', 'markers']}],
  ['map.reorder-layers', {layerIds: ['markers', 'ripples']}],
  ['map.reorder-layers', {layerIds: []}],
  ['map.reorder-layers', {}],
  ['map.remove-layer', {layerId: 'missing'}],
  ['map.remove-layer', {layerId: 0}],
  ['map.remove-layer', {layerId: ''}],
  ['map.remove-layer', {}],
  ['map.remove-dataset', {dataId: 'missing'}],
  ['map.remove-dataset', {dataId: 'constructor'}],
  ['map.remove-dataset', {dataId: ''}],
  ['map.remove-dataset', {}]
])('rejects invalid %s input without changing any state: %j', async (id, input) => {
  const {state, dispatch, execute} = setup();
  const before = state();
  expect(await execute(id as string, input)).toMatchObject({success: false});
  expect(dispatch).not.toHaveBeenCalled();
  expect(state()).toBe(before);
});

it('rejects stale IDs and a stale full order after removal without changing unrelated layers', async () => {
  const {state, dispatch, execute} = setup();
  await execute('map.remove-dataset', {dataId: 'shared'});
  const before = state();
  dispatch.mockClear();
  for (const [id, input] of [
    ['map.remove-layer', {layerId: 'markers'}],
    ['map.remove-dataset', {dataId: 'shared'}],
    ['map.reorder-layers', {layerIds: ['labels', 'markers', 'ripples']}]
  ] as const) {
    expect(await execute(id, input)).toMatchObject({success: false});
  }
  expect(dispatch).not.toHaveBeenCalled();
  expect(state()).toBe(before);
});

it('preserves group settings and membership, rejecting interleaved groups atomically', async () => {
  const group = {
    id: 'ducks',
    label: 'Ducks',
    isVisible: false,
    isIncludedInLegend: true,
    layerOrder: ['markers', 'ripples']
  };
  const {state, dispatch, execute} = setup(['labels', group]);
  expect((await execute('map.get-layer-order')).data).toMatchObject({
    layerIds: ['labels', 'markers', 'ripples'],
    layerOrder: ['labels', group]
  });
  expect(
    await execute('map.reorder-layers', {layerIds: ['ripples', 'markers', 'labels']})
  ).toMatchObject({success: true});
  expect(state().layerOrder).toEqual([{...group, layerOrder: ['ripples', 'markers']}, 'labels']);
  const before = state();
  dispatch.mockClear();
  expect(
    await execute('map.reorder-layers', {layerIds: ['ripples', 'labels', 'markers']})
  ).toMatchObject({success: false});
  expect(dispatch).not.toHaveBeenCalled();
  expect(state()).toBe(before);
  await execute('map.remove-layer', {layerId: 'markers'});
  expect(getFlatLayerOrder(state().layerOrder)).toEqual(['ripples', 'labels']);
});

it('handles an empty map and a dataset with no remaining layers', async () => {
  const {state, execute} = setup();
  await execute('map.remove-layer', {layerId: 'labels'});
  expect(await execute('map.remove-dataset', {dataId: 'other'})).toMatchObject({
    success: true,
    data: {affectedLayerIds: []}
  });
  await execute('map.remove-dataset', {dataId: 'shared'});
  expect((await execute('map.get-layer-order')).data.layerIds).toEqual([]);
  expect(await execute('map.reorder-layers', {layerIds: []})).toMatchObject({success: true});
  expect(state().layerOrder).toEqual([]);
});

it('creates a group, moves layers without duplicates, and dissolves it without deleting layers', async () => {
  const {state, dispatch, execute} = setup();
  const {layers, layerData, datasets} = state();
  const created = await execute('map.create-layer-group', {
    label: ' Versions ',
    layerIds: ['ripples', 'markers']
  });
  expect(created).toMatchObject({success: true, data: {layerIds: ['markers', 'ripples']}});
  const {groupId} = created.data;
  expect((await execute('map.get-layer-order')).data.layerOrder).toEqual([
    {
      id: groupId,
      label: 'Versions',
      isVisible: true,
      isIncludedInLegend: true,
      layerOrder: ['markers', 'ripples']
    },
    'labels'
  ]);
  await execute('map.move-layer-to-group', {layerId: 'labels', groupId});
  expect(getFlatLayerOrder(state().layerOrder)).toEqual(['labels', 'markers', 'ripples']);
  dispatch.mockClear();
  expect(await execute('map.move-layer-to-group', {layerId: 'markers', groupId})).toMatchObject({
    success: true
  });
  expect(dispatch).not.toHaveBeenCalled();
  await execute('map.move-layer-to-group', {layerId: 'ripples', groupId: null});
  expect(state().layerOrder[0]).toBe('ripples');
  expect(await execute('map.ungroup-layers', {groupId})).toMatchObject({
    success: true,
    data: {layerIds: ['labels', 'markers']}
  });
  expect(state().layerOrder).toEqual(['ripples', 'labels', 'markers']);
  expect(state().layers).toBe(layers);
  expect(state().layerData).toBe(layerData);
  expect(state().datasets).toBe(datasets);
});

it('moves across nested groups and preserves unrelated group settings and stack positions', async () => {
  const inner = {
    id: 'inner',
    label: 'Inner',
    isVisible: false,
    isIncludedInLegend: false,
    layerOrder: ['markers']
  };
  const outer = {
    id: 'outer',
    label: 'Outer',
    isVisible: true,
    isIncludedInLegend: true,
    layerOrder: [inner, 'ripples']
  };
  const {state, execute} = setup(['labels', outer]);
  expect(
    await execute('map.move-layer-to-group', {layerId: 'ripples', groupId: 'inner'})
  ).toMatchObject({success: true});
  expect(state().layerOrder).toEqual([
    'labels',
    {
      ...outer,
      layerOrder: [{...inner, layerOrder: ['ripples', 'markers']}]
    }
  ]);
  expect(await execute('map.ungroup-layers', {groupId: 'inner'})).toMatchObject({success: true});
  expect(state().layerOrder).toEqual(['labels', {...outer, layerOrder: ['ripples', 'markers']}]);
});

it.each([
  ['map.create-layer-group', {label: 'Versions', layerIds: ['missing']}],
  ['map.create-layer-group', {label: 'Versions', layerIds: ['markers', 'markers']}],
  ['map.create-layer-group', {label: 'Versions', layerIds: []}],
  ['map.create-layer-group', {label: ' ', layerIds: ['markers']}],
  ['map.move-layer-to-group', {layerId: 'markers', groupId: 'missing'}],
  ['map.move-layer-to-group', {layerId: 'missing', groupId: null}],
  ['map.ungroup-layers', {groupId: 'labels'}]
])('rejects invalid group operation %s without dispatch: %j', async (id, input) => {
  const {state, dispatch, execute} = setup();
  const before = state();
  expect(await execute(id as string, input)).toMatchObject({success: false});
  expect(dispatch).not.toHaveBeenCalled();
  expect(state()).toBe(before);
});

it('includes the lifecycle commands in the public map tool catalog', () => {
  expect(MAP_TOOL_IDS).toEqual(
    expect.arrayContaining([
      'map.get-layer-order',
      'map.create-layer-group',
      'map.move-layer-to-group',
      'map.ungroup-layers',
      'map.reorder-layers',
      'map.remove-layer',
      'map.remove-dataset'
    ])
  );
});
