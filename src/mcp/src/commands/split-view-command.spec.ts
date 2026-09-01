import {getSplitViewCommand} from './split-view-command';
import {ActionTypes} from '@kepler.gl/actions';

/**
 * Mock KeplerContext whose dispatch simulates the split-map reducer: toggling
 * index 0 adds the right panel, toggling index 1 removes it. Layer visibility
 * toggles are recorded but not applied (the command re-reads splitMaps between
 * the two panels, so the assertions only need the dispatch sequence).
 */
function makeCtx(opts: {split?: boolean; layers?: any[]} = {}) {
  const dispatched: any[] = [];
  const visState = {
    datasets: {},
    layers: opts.layers ?? [],
    splitMaps: opts.split ? [{layers: {}}, {layers: {}}] : [{layers: {}}]
  };
  const ctx = {
    getVisState: () => visState,
    dispatch: (action: any) => {
      dispatched.push(action);
      if (action.type === ActionTypes.TOGGLE_SPLIT_MAP) {
        if (action.payload === 0) {
          visState.splitMaps = [{layers: {}}, {layers: {}}];
        } else if (action.payload === 1) {
          visState.splitMaps = [{layers: {}}];
        }
      }
    },
    getValuesFromDataset: () => [],
    getMapBoundary: () => null,
    getMapboxToken: () => undefined,
    getDatasetContext: () => ''
  };
  return {ctx, getDispatched: () => dispatched};
}

type CommandResult = {success: boolean; error?: string; data?: Record<string, unknown>};

describe('map.split-view', () => {
  it('enables split view by toggling the right panel on', async () => {
    const {ctx, getDispatched} = makeCtx();
    const cmd = getSplitViewCommand(ctx as any);
    const result = (await cmd.execute({} as any, {action: 'enable'})) as CommandResult;

    expect(result.success).toBe(true);
    const splitToggles = getDispatched().filter(
      (a: any) => a.type === ActionTypes.TOGGLE_SPLIT_MAP
    );
    expect(splitToggles).toHaveLength(1);
    expect(splitToggles[0].payload).toBe(0);
  });

  it('disables split view by closing the right panel (keeps map0)', async () => {
    const {ctx, getDispatched} = makeCtx({split: true});
    const cmd = getSplitViewCommand(ctx as any);
    const result = (await cmd.execute({} as any, {action: 'disable'})) as CommandResult;

    expect(result.success).toBe(true);
    const splitToggles = getDispatched().filter(
      (a: any) => a.type === ActionTypes.TOGGLE_SPLIT_MAP
    );
    expect(splitToggles).toHaveLength(1);
    expect(splitToggles[0].payload).toBe(1);
  });

  it('assigns layers to each panel and toggles visibility to match', async () => {
    const layers = [{id: 'layer_a'}, {id: 'layer_b'}, {id: 'layer_c'}];
    const {ctx, getDispatched} = makeCtx({layers});
    const cmd = getSplitViewCommand(ctx as any);
    const result = (await cmd.execute({} as any, {
      action: 'enable',
      layerIdsForMap0: ['layer_a'],
      layerIdsForMap1: ['layer_b', 'layer_c']
    })) as CommandResult;

    expect(result.success).toBe(true);
    const toggles = getDispatched().filter(
      (a: any) => a.type === ActionTypes.TOGGLE_LAYER_FOR_MAP
    );
    // layer_a shown only on map0; layer_b + layer_c shown only on map1
    expect(toggles).toHaveLength(3);
  });

  it('rejects unknown layer ids instead of silently hiding real layers', async () => {
    const layers = [{id: 'layer_a'}];
    const {ctx} = makeCtx({layers});
    const cmd = getSplitViewCommand(ctx as any);
    const result = (await cmd.execute({} as any, {
      action: 'enable',
      layerIdsForMap0: ['layer_a'],
      layerIdsForMap1: ['ghost']
    })) as CommandResult;

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/Unknown layer id/);
  });
});
