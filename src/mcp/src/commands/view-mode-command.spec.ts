import {getViewModeCommand} from './view-mode-command';
import {ActionTypes} from '@kepler.gl/actions';

/** Mock context: the command only dispatches setMapViewMode. */
function makeCtx() {
  const dispatched: any[] = [];
  const ctx = {
    getVisState: () => ({datasets: {}, layers: [], filters: []}),
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

describe('map.set-view-mode', () => {
  it('switches to the 3D globe', async () => {
    const {ctx, getDispatched} = makeCtx();
    const cmd = getViewModeCommand(ctx as any);
    const result = (await cmd.execute({} as any, {mode: 'globe'})) as CommandResult;

    expect(result.success).toBe(true);
    const actions = getDispatched().filter((a: any) => a.type === ActionTypes.SET_MAP_VIEW_MODE);
    expect(actions).toHaveLength(1);
    expect(actions[0].payload.mapViewMode).toBe('MODE_GLOBE');
    expect(result.data?.details).toMatch(/3D globe/);
  });

  it('switches back to the flat 2D map', async () => {
    const {ctx, getDispatched} = makeCtx();
    const cmd = getViewModeCommand(ctx as any);
    const result = (await cmd.execute({} as any, {mode: '2d'})) as CommandResult;

    expect(result.success).toBe(true);
    expect(getDispatched()[0].payload.mapViewMode).toBe('MODE_2D');
  });

  it('accepts the enum value as well as the short name', async () => {
    const {ctx, getDispatched} = makeCtx();
    const cmd = getViewModeCommand(ctx as any);
    const result = (await cmd.execute({} as any, {mode: 'MODE_3D'})) as CommandResult;

    expect(result.success).toBe(true);
    expect(getDispatched()[0].payload.mapViewMode).toBe('MODE_3D');
  });

  it('rejects an unknown mode without dispatching', async () => {
    const {ctx, getDispatched} = makeCtx();
    const cmd = getViewModeCommand(ctx as any);
    const result = (await cmd.execute({} as any, {mode: 'space'})) as CommandResult;

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/Invalid view mode/);
    expect(getDispatched()).toEqual([]);
  });
});
