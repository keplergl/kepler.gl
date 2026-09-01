import {getToggleTimeFilterCommand} from './toggle-time-filter-command';
import {ActionTypes} from '@kepler.gl/actions';

/**
 * Mock KeplerContext whose dispatch records actions. The command reads
 * visState.filters and dispatches setFilterView(idx, view) — the assertions
 * only need the dispatch sequence, not a real filter reducer.
 */
function makeCtx(opts: {filters?: any[]} = {}) {
  const dispatched: any[] = [];
  const visState = {
    datasets: {},
    layers: [],
    filters: opts.filters ?? []
  };
  const ctx = {
    getVisState: () => visState,
    dispatch: (action: any) => {
      dispatched.push(action);
    },
    getValuesFromDataset: () => [],
    getMapBoundary: () => null,
    getMapboxToken: () => undefined,
    getDatasetContext: () => ''
  };
  return {ctx, getDispatched: () => dispatched};
}

type CommandResult = {success: boolean; error?: string; data?: Record<string, unknown>};

describe('map.toggle-time-filter', () => {
  it('enlarges the first time filter when filterIndex is omitted', async () => {
    const filters = [{id: 'f0', type: 'timeRange'}, {id: 'f1', type: 'timeRange'}];
    const {ctx, getDispatched} = makeCtx({filters});
    const cmd = getToggleTimeFilterCommand(ctx as any);
    const result = (await cmd.execute({} as any, {action: 'show'})) as CommandResult;

    expect(result.success).toBe(true);
    const views = getDispatched().filter((a: any) => a.type === ActionTypes.SET_FILTER_VIEW);
    expect(views).toHaveLength(1);
    expect(views[0].idx).toBe(0);
    expect(views[0].view).toBe('enlarged');
  });

  it('collapses the requested filter back to the side panel', async () => {
    const filters = [{id: 'f0', type: 'timeRange'}, {id: 'f1', type: 'timeRange'}];
    const {ctx, getDispatched} = makeCtx({filters});
    const cmd = getToggleTimeFilterCommand(ctx as any);
    const result = (await cmd.execute({} as any, {
      action: 'hide',
      filterIndex: 1
    })) as CommandResult;

    expect(result.success).toBe(true);
    const views = getDispatched().filter((a: any) => a.type === ActionTypes.SET_FILTER_VIEW);
    expect(views).toHaveLength(1);
    expect(views[0].idx).toBe(1);
    expect(views[0].view).toBe('side');
  });

  it('rejects an invalid action instead of silently hiding the controller', async () => {
    const filters = [{id: 'f0', type: 'timeRange'}];
    const {ctx, getDispatched} = makeCtx({filters});
    const cmd = getToggleTimeFilterCommand(ctx as any);
    const result = (await cmd.execute({} as any, {action: 'toggle'})) as CommandResult;

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/Invalid action/);
    // no setFilterView dispatched
    expect(
      getDispatched().filter((a: any) => a.type === ActionTypes.SET_FILTER_VIEW)
    ).toHaveLength(0);
  });

  it('fails fast when no filters exist on the map', async () => {
    const {ctx, getDispatched} = makeCtx();
    const cmd = getToggleTimeFilterCommand(ctx as any);
    const result = (await cmd.execute({} as any, {action: 'show'})) as CommandResult;

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/No filters found/);
    expect(getDispatched()).toHaveLength(0);
  });

  it('does not fall back to a non-time filter when filterIndex is omitted', async () => {
    // Filters exist but none are time filters — the auto-pick must error
    // instead of toggling the first (unrelated) filter.
    const filters = [{id: 'f0', type: 'range'}];
    const {ctx, getDispatched} = makeCtx({filters});
    const cmd = getToggleTimeFilterCommand(ctx as any);
    const result = (await cmd.execute({} as any, {action: 'show'})) as CommandResult;

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/No time filter found/);
    expect(getDispatched()).toHaveLength(0);
  });

  it('rejects an out-of-range filterIndex', async () => {
    const filters = [{id: 'f0', type: 'timeRange'}];
    const {ctx, getDispatched} = makeCtx({filters});
    const cmd = getToggleTimeFilterCommand(ctx as any);
    const result = (await cmd.execute({} as any, {
      action: 'show',
      filterIndex: 5
    })) as CommandResult;

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/out of range/);
    expect(getDispatched()).toHaveLength(0);
  });
});
