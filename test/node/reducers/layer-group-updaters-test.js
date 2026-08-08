// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape-catch';
import CloneDeep from 'lodash/cloneDeep';

import {VisStateActions} from '@kepler.gl/actions';
import {
  visStateReducer as reducer,
  INITIAL_VIS_STATE,
  getFlatLayerOrder,
  getLayerGroupFromLayerOrder,
  findParentGroupForLayer
} from '@kepler.gl/reducers';

import {StateWFilesFiltersLayerColor} from 'test/helpers/mock-state';

// ============================================================================
// Helpers
// ============================================================================

function createStateWithLayers() {
  // Use real state from mock with 3 layers
  const state = CloneDeep(StateWFilesFiltersLayerColor.visState);
  return state;
}

function createStateWithGroup() {
  const state = createStateWithLayers();
  const layer0Id = state.layers[0].id;
  const layer1Id = state.layers[1].id;
  const layer2Id = state.layers[2].id;

  // Manually set up a group structure:
  // layerOrder: [group_1(layer0, layer1), layer2]
  const group = {
    id: 'test_group_1',
    label: 'Test Group',
    isVisible: true,
    isIncludedInLegend: true,
    layerOrder: [layer0Id, layer1Id]
  };
  state.layerOrder = [group, layer2Id];
  return state;
}

// ============================================================================
// ADD_LAYER_GROUP
// ============================================================================

test('#visStateReducer -> ADD_LAYER_GROUP -> empty group', t => {
  const state = createStateWithLayers();
  const initialOrderLength = state.layerOrder.length;

  const nextState = reducer(state, VisStateActions.addLayerGroup({}));

  t.equal(
    nextState.layerOrder.length,
    initialOrderLength + 1,
    'should add one entry to layerOrder'
  );

  const addedEntry = nextState.layerOrder[0];
  t.equal(typeof addedEntry, 'object', 'first entry should be a group object');
  t.equal(addedEntry.label, 'New group', 'should have default label');
  t.equal(addedEntry.isVisible, true, 'should be visible');
  t.deepEqual(addedEntry.layerOrder, [], 'should have empty layerOrder');
  t.end();
});

test('#visStateReducer -> ADD_LAYER_GROUP -> with custom properties', t => {
  const state = createStateWithLayers();

  const nextState = reducer(
    state,
    VisStateActions.addLayerGroup({
      id: 'custom_group',
      label: 'Custom Group',
      isVisible: false
    })
  );

  const addedEntry = nextState.layerOrder[0];
  t.equal(addedEntry.id, 'custom_group', 'should use custom id');
  t.equal(addedEntry.label, 'Custom Group', 'should use custom label');
  t.equal(addedEntry.isVisible, false, 'should use custom visibility');
  t.end();
});

test('#visStateReducer -> ADD_LAYER_GROUP -> with existing layers', t => {
  const state = createStateWithLayers();
  const layer0Id = state.layers[0].id;
  const layer1Id = state.layers[1].id;

  const nextState = reducer(
    state,
    VisStateActions.addLayerGroup({
      id: 'new_group',
      layerOrder: [layer0Id, layer1Id]
    })
  );

  // The layers should be removed from root and placed inside the group
  const group = nextState.layerOrder.find(e => typeof e !== 'string' && e.id === 'new_group');
  t.ok(group, 'should have the new group');
  t.deepEqual(group.layerOrder, [layer0Id, layer1Id], 'group should contain the layers');

  // The layers should not exist at root level
  const rootStrings = nextState.layerOrder.filter(e => typeof e === 'string');
  t.notOk(rootStrings.includes(layer0Id), 'layer0 should not be at root');
  t.notOk(rootStrings.includes(layer1Id), 'layer1 should not be at root');
  t.end();
});

// ============================================================================
// REMOVE_LAYER_GROUP
// ============================================================================

test('#visStateReducer -> REMOVE_LAYER_GROUP -> removes group and its layers', t => {
  const state = createStateWithGroup();
  const initialLayerCount = state.layers.length;
  const layer0Id = state.layers[0].id;
  const layer1Id = state.layers[1].id;

  const nextState = reducer(state, VisStateActions.removeLayerGroup({id: 'test_group_1'}));

  // Group should be gone
  const group = nextState.layerOrder.find(e => typeof e !== 'string' && e.id === 'test_group_1');
  t.notOk(group, 'group should be removed');

  // Layers inside group should be removed
  t.notOk(nextState.layers.find(l => l.id === layer0Id), 'layer0 should be removed');
  t.notOk(nextState.layers.find(l => l.id === layer1Id), 'layer1 should be removed');

  // Layer count should decrease
  t.equal(nextState.layers.length, initialLayerCount - 2, 'should have 2 fewer layers');
  t.end();
});

test('#visStateReducer -> REMOVE_LAYER_GROUP -> nonexistent group returns same state', t => {
  const state = createStateWithGroup();
  const nextState = reducer(state, VisStateActions.removeLayerGroup({id: 'nonexistent'}));
  t.equal(nextState, state, 'should return same state for missing group');
  t.end();
});

// ============================================================================
// UPDATE_LAYER_GROUP
// ============================================================================

test('#visStateReducer -> UPDATE_LAYER_GROUP -> update label', t => {
  const state = createStateWithGroup();

  const nextState = reducer(
    state,
    VisStateActions.updateLayerGroup({id: 'test_group_1', options: {label: 'Renamed Group'}})
  );

  const group = getLayerGroupFromLayerOrder(nextState.layerOrder, 'test_group_1');
  t.equal(group.label, 'Renamed Group', 'should update label');
  t.end();
});

test('#visStateReducer -> UPDATE_LAYER_GROUP -> toggle visibility cascades to layers', t => {
  const state = createStateWithGroup();
  const layer0Id = state.layers[0].id;
  const layer1Id = state.layers[1].id;

  // Make sure layers start visible
  state.layers[0].config.isVisible = true;
  state.layers[1].config.isVisible = true;

  const nextState = reducer(
    state,
    VisStateActions.updateLayerGroup({id: 'test_group_1', options: {isVisible: false}})
  );

  const group = getLayerGroupFromLayerOrder(nextState.layerOrder, 'test_group_1');
  t.equal(group.isVisible, false, 'group should be hidden');

  const l0 = nextState.layers.find(l => l.id === layer0Id);
  const l1 = nextState.layers.find(l => l.id === layer1Id);
  t.equal(l0.config.isVisible, false, 'layer0 should be hidden');
  t.equal(l1.config.isVisible, false, 'layer1 should be hidden');
  t.end();
});

test('#visStateReducer -> UPDATE_LAYER_GROUP -> nonexistent group returns same state', t => {
  const state = createStateWithGroup();
  const nextState = reducer(
    state,
    VisStateActions.updateLayerGroup({id: 'nonexistent', options: {label: 'X'}})
  );
  t.equal(nextState, state, 'should return same state');
  t.end();
});

// ============================================================================
// ADD_LAYER_TO_LAYER_GROUP
// ============================================================================

test('#visStateReducer -> ADD_LAYER_TO_LAYER_GROUP -> adds layer to group', t => {
  const state = createStateWithGroup();
  const layer2Id = state.layers[2].id;

  const nextState = reducer(
    state,
    VisStateActions.addLayerToLayerGroup({layerGroupId: 'test_group_1', layerId: layer2Id})
  );

  const group = getLayerGroupFromLayerOrder(nextState.layerOrder, 'test_group_1');
  t.ok(group.layerOrder.includes(layer2Id), 'layer2 should be in the group');

  // layer2 should be removed from root
  const rootStrings = nextState.layerOrder.filter(e => typeof e === 'string');
  t.notOk(rootStrings.includes(layer2Id), 'layer2 should not be at root');
  t.end();
});

test('#visStateReducer -> ADD_LAYER_TO_LAYER_GROUP -> already in group is no-op', t => {
  const state = createStateWithGroup();
  const layer0Id = state.layers[0].id;

  const nextState = reducer(
    state,
    VisStateActions.addLayerToLayerGroup({layerGroupId: 'test_group_1', layerId: layer0Id})
  );

  // Should be unchanged since layer0 is already in the group
  t.equal(nextState, state, 'should return same state when layer already in group');
  t.end();
});

test('#visStateReducer -> ADD_LAYER_TO_LAYER_GROUP -> invalid group returns same state', t => {
  const state = createStateWithGroup();
  const layer2Id = state.layers[2].id;

  const nextState = reducer(
    state,
    VisStateActions.addLayerToLayerGroup({layerGroupId: 'nonexistent', layerId: layer2Id})
  );

  t.equal(nextState, state, 'should return same state for invalid group');
  t.end();
});

// ============================================================================
// REMOVE_LAYER_FROM_LAYER_GROUP
// ============================================================================

test('#visStateReducer -> REMOVE_LAYER_FROM_LAYER_GROUP -> removes layer from group', t => {
  const state = createStateWithGroup();
  const layer0Id = state.layers[0].id;

  const nextState = reducer(
    state,
    VisStateActions.removeLayerFromLayerGroup({layerGroupId: 'test_group_1', layerId: layer0Id})
  );

  const group = getLayerGroupFromLayerOrder(nextState.layerOrder, 'test_group_1');
  t.notOk(group.layerOrder.includes(layer0Id), 'layer0 should be removed from group');

  // Layer should still exist in state.layers (not deleted)
  t.ok(nextState.layers.find(l => l.id === layer0Id), 'layer should still exist');
  t.end();
});

// ============================================================================
// SWAP_LAYER_ORDER_ENTRIES
// ============================================================================

test('#visStateReducer -> SWAP_LAYER_ORDER_ENTRIES -> root to root', t => {
  const state = createStateWithLayers();
  const layer0Id = state.layers[0].id;
  const layer2Id = state.layers[2].id;

  // Assume layerOrder is [layer2, layer0, layer1] (default from mock)
  const firstEntry = state.layerOrder[0];
  const lastEntry = state.layerOrder[state.layerOrder.length - 1];

  const nextState = reducer(
    state,
    VisStateActions.swapLayerOrderEntries({
      originLayerId: typeof firstEntry === 'string' ? firstEntry : firstEntry.id,
      destinationLayerId: typeof lastEntry === 'string' ? lastEntry : lastEntry.id
    })
  );

  // First and last should be swapped
  t.equal(nextState.layerOrder[nextState.layerOrder.length - 1], firstEntry, 'origin moved to destination');
  t.end();
});

test('#visStateReducer -> SWAP_LAYER_ORDER_ENTRIES -> group to root', t => {
  const state = createStateWithGroup();
  const layer0Id = state.layers[0].id;
  const layer2Id = state.layers[2].id;

  // layerOrder: [group(layer0, layer1), layer2]
  const nextState = reducer(
    state,
    VisStateActions.swapLayerOrderEntries({
      originLayerId: layer0Id,
      destinationLayerId: layer2Id,
      originLayerGroupId: 'test_group_1'
    })
  );

  // layer0 should now be at root level
  const group = getLayerGroupFromLayerOrder(nextState.layerOrder, 'test_group_1');
  t.notOk(
    group.layerOrder.includes(layer0Id),
    'layer0 should be removed from group'
  );
  t.ok(
    nextState.layerOrder.some(e => e === layer0Id),
    'layer0 should be at root level'
  );
  t.end();
});

test('#visStateReducer -> SWAP_LAYER_ORDER_ENTRIES -> root to group', t => {
  const state = createStateWithGroup();
  const layer2Id = state.layers[2].id;

  // layerOrder: [group(layer0, layer1), layer2]
  const nextState = reducer(
    state,
    VisStateActions.swapLayerOrderEntries({
      originLayerId: layer2Id,
      destinationLayerGroupId: 'test_group_1'
    })
  );

  const group = getLayerGroupFromLayerOrder(nextState.layerOrder, 'test_group_1');
  t.ok(
    group.layerOrder.includes(layer2Id),
    'layer2 should be moved into the group'
  );
  t.end();
});

// ============================================================================
// DUPLICATE_LAYER (with groups)
// ============================================================================

test('#visStateReducer -> DUPLICATE_LAYER -> layer inside group', t => {
  const state = createStateWithGroup();
  const layer0Id = state.layers[0].id;

  const nextState = reducer(state, VisStateActions.duplicateLayer(0));

  // New layer should be in the same group
  const newLayer = nextState.layers[nextState.layers.length - 1];
  const group = getLayerGroupFromLayerOrder(nextState.layerOrder, 'test_group_1');

  t.ok(group, 'group should still exist');
  t.ok(
    group.layerOrder.includes(newLayer.id),
    'duplicated layer should be inside the same group'
  );
  t.end();
});

// ============================================================================
// REMOVE_LAYER (with groups)
// ============================================================================

test('#visStateReducer -> REMOVE_LAYER -> layer inside group', t => {
  const state = createStateWithGroup();
  const layer0Id = state.layers[0].id;

  const nextState = reducer(state, VisStateActions.removeLayer(layer0Id));

  // Layer should be removed from state
  t.notOk(nextState.layers.find(l => l.id === layer0Id), 'layer should be removed');

  // Layer should be removed from group
  const group = getLayerGroupFromLayerOrder(nextState.layerOrder, 'test_group_1');
  t.ok(group, 'group should still exist');
  t.notOk(group.layerOrder.includes(layer0Id), 'layer should be removed from group');
  t.end();
});
