// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import {
  getNewLayerGroup,
  addLayerOrGroupToLayerOrder,
  removeElementFromLayerOrder,
  getLayerGroupFromLayerOrder,
  findParentGroupForLayer,
  getIndexFromLayerEntryId,
  isLayerPresentInLayerOrder,
  replaceLayerEntryInLayerOrder,
  updateLayerGroupInLayerOrder,
  getFlatLayerOrder,
  buildLayerOrderHierarchy,
  removeGhostLayerFromLayerOrder,
  reorderLayerOrder,
  insertLayerAtRightOrder,
  mergeLayerOrder
} from '@kepler.gl/reducers';

// ============================================================================
// Test Fixtures
// ============================================================================

const GROUP_1 = {
  id: 'group_1',
  label: 'Group 1',
  isVisible: true,
  isIncludedInLegend: true,
  layerOrder: ['layer_a', 'layer_b']
};

const GROUP_2 = {
  id: 'group_2',
  label: 'Group 2',
  isVisible: true,
  isIncludedInLegend: true,
  layerOrder: ['layer_c']
};

const NESTED_GROUP = {
  id: 'nested_group',
  label: 'Nested Group',
  isVisible: true,
  isIncludedInLegend: true,
  layerOrder: ['layer_d']
};

const GROUP_WITH_NESTED = {
  id: 'group_nested',
  label: 'Group With Nested',
  isVisible: true,
  isIncludedInLegend: true,
  layerOrder: [NESTED_GROUP, 'layer_e']
};

const MOCK_LAYER_ORDER = ['layer_0', GROUP_1, GROUP_2, 'layer_f'];

const COMPLEX_LAYER_ORDER = ['layer_0', GROUP_WITH_NESTED, GROUP_2, 'layer_f'];

// ============================================================================
// getNewLayerGroup
// ============================================================================

test('layerGroupUtils -> getNewLayerGroup -> default values', t => {
  const group = getNewLayerGroup({});
  t.ok(group.id, 'should generate an id');
  t.equal(group.label, 'New group', 'should have default label');
  t.equal(group.isVisible, true, 'should be visible by default');
  t.equal(group.isIncludedInLegend, true, 'should be in legend by default');
  t.deepEqual(group.layerOrder, [], 'should have empty layerOrder');
  t.end();
});

test('layerGroupUtils -> getNewLayerGroup -> custom values', t => {
  const group = getNewLayerGroup({
    id: 'custom_id',
    label: 'My Group',
    isVisible: false,
    layerOrder: ['layer_1'],
    isIncludedInLegend: false
  });
  t.equal(group.id, 'custom_id', 'should use provided id');
  t.equal(group.label, 'My Group', 'should use provided label');
  t.equal(group.isVisible, false, 'should use provided visibility');
  t.deepEqual(group.layerOrder, ['layer_1'], 'should use provided layerOrder');
  t.equal(group.isIncludedInLegend, false, 'should use provided legend setting');
  t.end();
});

// ============================================================================
// addLayerOrGroupToLayerOrder
// ============================================================================

test('layerGroupUtils -> addLayerOrGroupToLayerOrder -> add layer id', t => {
  const result = addLayerOrGroupToLayerOrder(['layer_1', 'layer_2'], 'layer_3');
  t.deepEqual(result, ['layer_3', 'layer_1', 'layer_2'], 'should prepend layer id');
  t.end();
});

test('layerGroupUtils -> addLayerOrGroupToLayerOrder -> add group', t => {
  const newGroup = {id: 'g1', label: 'G1', isVisible: true, isIncludedInLegend: true, layerOrder: []};
  const result = addLayerOrGroupToLayerOrder(['layer_1'], newGroup);
  t.equal(result.length, 2, 'should add group');
  t.deepEqual(result[0], newGroup, 'should prepend group');
  t.equal(result[1], 'layer_1', 'should keep existing entry');
  t.end();
});

// ============================================================================
// removeElementFromLayerOrder
// ============================================================================

test('layerGroupUtils -> removeElementFromLayerOrder -> remove top-level layer', t => {
  const result = removeElementFromLayerOrder(MOCK_LAYER_ORDER, 'layer_0');
  t.equal(result.length, 3, 'should remove one entry');
  t.deepEqual(result[0], GROUP_1, 'should keep group_1');
  t.end();
});

test('layerGroupUtils -> removeElementFromLayerOrder -> remove layer inside group', t => {
  const result = removeElementFromLayerOrder(MOCK_LAYER_ORDER, 'layer_a');
  const group1 = result.find(e => typeof e !== 'string' && e.id === 'group_1');
  t.ok(group1, 'group_1 should still exist');
  t.deepEqual(group1.layerOrder, ['layer_b'], 'should remove layer_a from group');
  t.end();
});

test('layerGroupUtils -> removeElementFromLayerOrder -> remove group by object', t => {
  const result = removeElementFromLayerOrder(MOCK_LAYER_ORDER, GROUP_1);
  t.equal(result.length, 3, 'should remove the group');
  t.equal(result[0], 'layer_0', 'first entry should be layer_0');
  t.end();
});

test('layerGroupUtils -> removeElementFromLayerOrder -> remove nested layer', t => {
  const result = removeElementFromLayerOrder(COMPLEX_LAYER_ORDER, 'layer_d');
  const parentGroup = result.find(e => typeof e !== 'string' && e.id === 'group_nested');
  const nestedGroup = parentGroup.layerOrder.find(e => typeof e !== 'string' && e.id === 'nested_group');
  t.deepEqual(nestedGroup.layerOrder, [], 'should remove layer_d from nested group');
  t.end();
});

// ============================================================================
// getLayerGroupFromLayerOrder
// ============================================================================

test('layerGroupUtils -> getLayerGroupFromLayerOrder -> find top-level group', t => {
  const group = getLayerGroupFromLayerOrder(MOCK_LAYER_ORDER, 'group_1');
  t.deepEqual(group, GROUP_1, 'should find group_1');
  t.end();
});

test('layerGroupUtils -> getLayerGroupFromLayerOrder -> find nested group', t => {
  const group = getLayerGroupFromLayerOrder(COMPLEX_LAYER_ORDER, 'nested_group');
  t.deepEqual(group, NESTED_GROUP, 'should find nested_group');
  t.end();
});

test('layerGroupUtils -> getLayerGroupFromLayerOrder -> not found', t => {
  const group = getLayerGroupFromLayerOrder(MOCK_LAYER_ORDER, 'nonexistent');
  t.equal(group, undefined, 'should return undefined for missing group');
  t.end();
});

// ============================================================================
// findParentGroupForLayer
// ============================================================================

test('layerGroupUtils -> findParentGroupForLayer -> layer in top-level group', t => {
  const parent = findParentGroupForLayer(MOCK_LAYER_ORDER, 'layer_a');
  t.equal(parent.id, 'group_1', 'should find group_1 as parent');
  t.end();
});

test('layerGroupUtils -> findParentGroupForLayer -> layer at root', t => {
  const parent = findParentGroupForLayer(MOCK_LAYER_ORDER, 'layer_0');
  t.equal(parent, undefined, 'should return undefined for root-level layer');
  t.end();
});

test('layerGroupUtils -> findParentGroupForLayer -> layer in nested group', t => {
  const parent = findParentGroupForLayer(COMPLEX_LAYER_ORDER, 'layer_d');
  t.equal(parent.id, 'nested_group', 'should find nested_group as parent');
  t.end();
});

// ============================================================================
// getIndexFromLayerEntryId
// ============================================================================

test('layerGroupUtils -> getIndexFromLayerEntryId -> find string entry', t => {
  const idx = getIndexFromLayerEntryId(MOCK_LAYER_ORDER, 'layer_0');
  t.equal(idx, 0, 'should find layer_0 at index 0');
  t.end();
});

test('layerGroupUtils -> getIndexFromLayerEntryId -> find group entry', t => {
  const idx = getIndexFromLayerEntryId(MOCK_LAYER_ORDER, 'group_1');
  t.equal(idx, 1, 'should find group_1 at index 1');
  t.end();
});

test('layerGroupUtils -> getIndexFromLayerEntryId -> not found', t => {
  const idx = getIndexFromLayerEntryId(MOCK_LAYER_ORDER, 'nonexistent');
  t.equal(idx, -1, 'should return -1 for missing entry');
  t.end();
});

// ============================================================================
// isLayerPresentInLayerOrder
// ============================================================================

test('layerGroupUtils -> isLayerPresentInLayerOrder -> root layer', t => {
  t.ok(isLayerPresentInLayerOrder(MOCK_LAYER_ORDER, 'layer_0'), 'should find root layer');
  t.end();
});

test('layerGroupUtils -> isLayerPresentInLayerOrder -> layer in group', t => {
  t.ok(isLayerPresentInLayerOrder(MOCK_LAYER_ORDER, 'layer_a'), 'should find layer inside group');
  t.end();
});

test('layerGroupUtils -> isLayerPresentInLayerOrder -> layer in nested group', t => {
  t.ok(isLayerPresentInLayerOrder(COMPLEX_LAYER_ORDER, 'layer_d'), 'should find layer in nested group');
  t.end();
});

test('layerGroupUtils -> isLayerPresentInLayerOrder -> missing layer', t => {
  t.notOk(isLayerPresentInLayerOrder(MOCK_LAYER_ORDER, 'nonexistent'), 'should not find missing layer');
  t.end();
});

// ============================================================================
// replaceLayerEntryInLayerOrder
// ============================================================================

test('layerGroupUtils -> replaceLayerEntryInLayerOrder -> replace string entry', t => {
  const result = replaceLayerEntryInLayerOrder(MOCK_LAYER_ORDER, 'layer_0', 'layer_new');
  t.equal(result[0], 'layer_new', 'should replace layer_0 with layer_new');
  t.equal(result.length, MOCK_LAYER_ORDER.length, 'should keep same length');
  t.end();
});

test('layerGroupUtils -> replaceLayerEntryInLayerOrder -> replace layer inside group', t => {
  const result = replaceLayerEntryInLayerOrder(MOCK_LAYER_ORDER, 'layer_a', 'layer_replaced');
  const group1 = result.find(e => typeof e !== 'string' && e.id === 'group_1');
  t.deepEqual(group1.layerOrder, ['layer_replaced', 'layer_b'], 'should replace layer inside group');
  t.end();
});

// ============================================================================
// updateLayerGroupInLayerOrder
// ============================================================================

test('layerGroupUtils -> updateLayerGroupInLayerOrder -> update top-level group', t => {
  const updatedGroup = {...GROUP_1, label: 'Updated Label'};
  const result = updateLayerGroupInLayerOrder(MOCK_LAYER_ORDER, updatedGroup);
  const found = result.find(e => typeof e !== 'string' && e.id === 'group_1');
  t.equal(found.label, 'Updated Label', 'should update group label');
  t.end();
});

test('layerGroupUtils -> updateLayerGroupInLayerOrder -> update nested group', t => {
  const updatedNested = {...NESTED_GROUP, label: 'Updated Nested'};
  const result = updateLayerGroupInLayerOrder(COMPLEX_LAYER_ORDER, updatedNested);
  const parentGroup = result.find(e => typeof e !== 'string' && e.id === 'group_nested');
  const nested = parentGroup.layerOrder.find(e => typeof e !== 'string' && e.id === 'nested_group');
  t.equal(nested.label, 'Updated Nested', 'should update nested group label');
  t.end();
});

// ============================================================================
// getFlatLayerOrder
// ============================================================================

test('layerGroupUtils -> getFlatLayerOrder -> flat order', t => {
  const result = getFlatLayerOrder(['layer_1', 'layer_2', 'layer_3']);
  t.deepEqual(result, ['layer_1', 'layer_2', 'layer_3'], 'should return same array for flat order');
  t.end();
});

test('layerGroupUtils -> getFlatLayerOrder -> with groups', t => {
  const result = getFlatLayerOrder(MOCK_LAYER_ORDER);
  t.deepEqual(
    result,
    ['layer_0', 'layer_a', 'layer_b', 'layer_c', 'layer_f'],
    'should flatten groups into layer ids'
  );
  t.end();
});

test('layerGroupUtils -> getFlatLayerOrder -> nested groups', t => {
  const result = getFlatLayerOrder(COMPLEX_LAYER_ORDER);
  t.deepEqual(
    result,
    ['layer_0', 'layer_d', 'layer_e', 'layer_c', 'layer_f'],
    'should flatten nested groups'
  );
  t.end();
});

// ============================================================================
// buildLayerOrderHierarchy
// ============================================================================

test('layerGroupUtils -> buildLayerOrderHierarchy -> builds correct structure', t => {
  const mockLayers = [
    {id: 'layer_0', config: {hidden: false}},
    {id: 'layer_a', config: {hidden: false}},
    {id: 'layer_b', config: {hidden: false}},
    {id: 'layer_c', config: {hidden: false}},
    {id: 'layer_f', config: {hidden: false}}
  ];
  const result = buildLayerOrderHierarchy(MOCK_LAYER_ORDER, mockLayers);

  t.equal(result.length, 4, 'should have 4 top-level entries');
  t.deepEqual(result[0], ['layer', mockLayers[0]], 'first entry should be layer_0');
  t.equal(result[1][0], 'layerGroup', 'second entry should be a layerGroup');
  t.equal(result[1][1].id, 'group_1', 'second entry should be group_1');
  t.equal(result[2][0], 'layerGroup', 'third entry should be a layerGroup');
  t.equal(result[2][1].id, 'group_2', 'third entry should be group_2');
  t.deepEqual(result[3], ['layer', mockLayers[4]], 'fourth entry should be layer_f');
  t.end();
});

// ============================================================================
// removeGhostLayerFromLayerOrder
// ============================================================================

test('layerGroupUtils -> removeGhostLayerFromLayerOrder -> removes missing layers', t => {
  const validLayers = [{id: 'layer_0'}, {id: 'layer_a'}, {id: 'layer_f'}];
  const result = removeGhostLayerFromLayerOrder(MOCK_LAYER_ORDER, validLayers);
  const flatResult = getFlatLayerOrder(result);
  const validIds = validLayers.map(l => l.id);
  t.ok(flatResult.every(id => validIds.includes(id)), 'should only contain valid layer ids');
  t.notOk(flatResult.includes('layer_b'), 'should not contain layer_b');
  t.notOk(flatResult.includes('layer_c'), 'should not contain layer_c');
  t.end();
});

test('layerGroupUtils -> removeGhostLayerFromLayerOrder -> preserves groups', t => {
  const validLayers = [{id: 'layer_0'}, {id: 'layer_a'}, {id: 'layer_b'}, {id: 'layer_c'}, {id: 'layer_f'}];
  const result = removeGhostLayerFromLayerOrder(MOCK_LAYER_ORDER, validLayers);
  t.equal(result.length, MOCK_LAYER_ORDER.length, 'should keep all entries when all layers valid');
  t.end();
});

// ============================================================================
// reorderLayerOrder
// ============================================================================

test('layerGroupUtils -> reorderLayerOrder -> simple flat reorder', t => {
  const order = ['a', 'b', 'c'];
  const result = reorderLayerOrder(order, 'a', 'c');
  t.deepEqual(result, ['b', 'c', 'a'], 'should move a to position of c');
  t.end();
});

test('layerGroupUtils -> reorderLayerOrder -> reorder groups', t => {
  const group = {
    id: 'g1', label: 'G', isVisible: true, isIncludedInLegend: true,
    layerOrder: ['x', 'y', 'z']
  };
  const order = ['a', group, 'b'];
  const result = reorderLayerOrder(order, 'g1', 'b');
  t.equal(result[0], 'a', 'a should stay at index 0');
  t.equal(result[1], 'b', 'b should move to index 1');
  t.deepEqual(result[2], group, 'group should move to index 2');
  t.end();
});

test('layerGroupUtils -> reorderLayerOrder -> no-op for missing entry', t => {
  const order = ['a', 'b', 'c'];
  const result = reorderLayerOrder(order, 'nonexistent', 'a');
  t.deepEqual(result, order, 'should return same order for missing entry');
  t.end();
});

// ============================================================================
// insertLayerAtRightOrder (with groups)
// ============================================================================

test('layerGroupUtils -> insertLayerAtRightOrder -> preserves groups', t => {
  const currentLayers = [{id: 'layer_1'}, {id: 'layer_2'}];
  const group = {
    id: 'g1', label: 'G', isVisible: true, isIncludedInLegend: true,
    layerOrder: ['layer_1']
  };
  const currentOrder = [group, 'layer_2'];

  const {newLayerOrder, newLayers} = insertLayerAtRightOrder(
    currentLayers,
    [{id: 'layer_3'}],
    currentOrder,
    ['layer_3', 'layer_2']
  );

  t.equal(newLayers.length, 3, 'should have 3 layers total');
  const hasGroup = newLayerOrder.some(e => typeof e !== 'string' && e.id === 'g1');
  t.ok(hasGroup, 'should preserve the group in layerOrder');
  t.end();
});

test('layerGroupUtils -> insertLayerAtRightOrder -> no groups flat behavior', t => {
  const currentLayers = [{id: 'a'}];
  const currentOrder = ['a'];

  const {newLayerOrder, newLayers} = insertLayerAtRightOrder(
    currentLayers,
    [{id: 'b'}],
    currentOrder,
    ['b', 'a']
  );

  t.equal(newLayers.length, 2, 'should have 2 layers');
  t.deepEqual(newLayerOrder, ['b', 'a'], 'should insert b before a per preservedOrder');
  t.end();
});

// ============================================================================
// mergeLayerOrder (restore groups from saved config)
// ============================================================================

test('layerGroupUtils -> mergeLayerOrder -> no saved layerOrder', t => {
  const state = {layers: [{id: 'a'}, {id: 'b'}], layerOrder: ['a', 'b']};
  const result = mergeLayerOrder(state, undefined);
  t.equal(result, state, 'should return state unchanged');
  t.end();
});

test('layerGroupUtils -> mergeLayerOrder -> flat saved layerOrder (no groups)', t => {
  const state = {layers: [{id: 'a'}, {id: 'b'}], layerOrder: ['a', 'b']};
  const result = mergeLayerOrder(state, ['b', 'a']);
  t.equal(result, state, 'should return state unchanged when no groups in saved order');
  t.end();
});

test('layerGroupUtils -> mergeLayerOrder -> restores groups from saved config', t => {
  const savedLayerOrder = [
    {
      id: 'g1', label: 'My Group', isVisible: true, isIncludedInLegend: true,
      layerOrder: ['a', 'b']
    },
    'c'
  ];
  const state = {layers: [{id: 'a'}, {id: 'b'}, {id: 'c'}], layerOrder: ['a', 'b', 'c']};
  const result = mergeLayerOrder(state, savedLayerOrder);

  t.equal(result.layerOrder.length, 2, 'should have 2 top-level entries (group + layer)');
  const group = result.layerOrder.find(e => typeof e !== 'string' && e.id === 'g1');
  t.ok(group, 'should restore the group');
  t.deepEqual(group.layerOrder, ['a', 'b'], 'should restore layer membership');
  t.equal(result.layerOrder[1], 'c', 'should keep ungrouped layer');
  t.end();
});

test('layerGroupUtils -> mergeLayerOrder -> filters out deleted layers', t => {
  const savedLayerOrder = [
    {
      id: 'g1', label: 'Group', isVisible: true, isIncludedInLegend: true,
      layerOrder: ['a', 'deleted_layer']
    },
    'b'
  ];
  const state = {layers: [{id: 'a'}, {id: 'b'}], layerOrder: ['a', 'b']};
  const result = mergeLayerOrder(state, savedLayerOrder);

  const group = result.layerOrder.find(e => typeof e !== 'string' && e.id === 'g1');
  t.deepEqual(group.layerOrder, ['a'], 'should filter out deleted_layer from group');
  t.end();
});

test('layerGroupUtils -> mergeLayerOrder -> adds missing layers at top', t => {
  const savedLayerOrder = [
    {
      id: 'g1', label: 'Group', isVisible: true, isIncludedInLegend: true,
      layerOrder: ['a']
    }
  ];
  const state = {layers: [{id: 'a'}, {id: 'new_layer'}], layerOrder: ['a', 'new_layer']};
  const result = mergeLayerOrder(state, savedLayerOrder);

  t.ok(
    result.layerOrder.includes('new_layer'),
    'should include new_layer that was not in saved config'
  );
  t.end();
});
