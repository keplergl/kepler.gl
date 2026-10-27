import {getAddTimeFilterCommand} from './time-filter-command';
import {ActionTypes} from '@kepler.gl/actions';
import KeplerTable from '@kepler.gl/table';
import {ALL_FIELD_TYPES} from '@kepler.gl/constants';

async function makeTimestampTable() {
  const table = new KeplerTable({color: [255, 0, 0]} as any);
  await table.importData({
    data: {
      rows: [
        [37.77, -122.42, '2024-01-01T00:00:00'],
        [37.78, -122.45, '2024-01-02T00:00:00'],
        [37.74, -122.44, '2024-01-03T00:00:00']
      ],
      fields: [
        {name: 'lat', type: ALL_FIELD_TYPES.real},
        {name: 'lng', type: ALL_FIELD_TYPES.real},
        {name: 'ts', type: ALL_FIELD_TYPES.timestamp}
      ]
    } as any
  });
  return table;
}

// 2024-01-01 .. 2024-01-03 (three daily timestamps → auto-detected '1-day')
const DOMAIN = [1704067200000, 1704326400000];
const DAY = 86_400_000;

/**
 * Mock KeplerContext whose dispatch simulates just enough of the kepler filter
 * reducer for the command's poll loops to succeed: ADD_FILTER creates a filter
 * entry (with id + domain + timeBins), SET_FILTER mutates it in place.
 */
function makeCtx(table: KeplerTable, opts: {existingFilter?: boolean} = {}) {
  const filters: any[] = [];
  const dispatched: any[] = [];
  const visState = {datasets: {[table.id as string]: table}, filters};
  // kepler stores timeBins keyed by dataId, then by interval: {[dataId]: {[interval]: bins[]}}
  const timeBins = {[table.id as string]: {'1-day': [{x0: DOMAIN[0], x1: DOMAIN[0] + DAY}]}};

  if (opts.existingFilter) {
    filters.push({
      id: 'existing_filter',
      dataId: [table.id],
      name: ['ts'],
      domain: DOMAIN,
      plotType: {interval: '1-day'},
      timeBins
    });
  }

  const ctx = {
    getVisState: () => visState,
    dispatch: (action: any) => {
      dispatched.push(action);
      if (action.type === ActionTypes.ADD_FILTER) {
        filters.push({
          id: `filter_${filters.length + 1}`,
          dataId: [action.dataId],
          name: [],
          domain: DOMAIN,
          plotType: {interval: '1-day'},
          timeBins
        });
      } else if (action.type === ActionTypes.SET_FILTER) {
        const f = filters[action.idx];
        if (f) f[action.prop] = action.value;
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

describe('map.add-time-filter', () => {
  it('creates a new filter on a timestamp column and animates it', async () => {
    const table = await makeTimestampTable();
    const {ctx, getDispatched} = makeCtx(table);

    const cmd = getAddTimeFilterCommand(ctx as any);
    const result = (await cmd.execute({} as any, {
      datasetName: table.label,
      dateTimeColumn: 'ts'
    })) as CommandResult;

    expect(result.success).toBe(true);
    const types = getDispatched().map((a: any) => a.type);
    expect(types).toContain(ActionTypes.ADD_FILTER);
    expect(types).toContain(ActionTypes.SET_FILTER);
    expect(types).toContain(ActionTypes.SET_FILTER_ANIMATION_WINDOW);
    expect(types).toContain(ActionTypes.SET_FILTER_ANIMATION_TIME);
    // interval auto-detected from the 1-day gap between the three timestamps
    expect((result.data as any).interval).toBe('1-day');
  });

  it('reuses an existing filter on the same column instead of adding a new one', async () => {
    const table = await makeTimestampTable();
    const {ctx, getDispatched} = makeCtx(table, {existingFilter: true});

    const cmd = getAddTimeFilterCommand(ctx as any);
    const result = (await cmd.execute({} as any, {
      datasetName: table.label,
      dateTimeColumn: 'ts'
    })) as CommandResult;

    expect(result.success).toBe(true);
    const types = getDispatched().map((a: any) => a.type);
    expect(types).not.toContain(ActionTypes.ADD_FILTER);
    expect(types).toContain(ActionTypes.SET_FILTER_ANIMATION_WINDOW);
    expect(types).toContain(ActionTypes.SET_FILTER_ANIMATION_TIME);
  });

  it('rejects an invalid interval at runtime (bridge path skips zod)', async () => {
    const table = await makeTimestampTable();
    const {ctx} = makeCtx(table);

    const cmd = getAddTimeFilterCommand(ctx as any);
    const result = (await cmd.execute({} as any, {
      datasetName: table.label,
      dateTimeColumn: 'ts',
      interval: '2-day'
    })) as CommandResult;

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/Invalid interval/);
  });

  it('rejects an inherited-property interval like "toString" (own-property check)', async () => {
    const table = await makeTimestampTable();
    const {ctx} = makeCtx(table);

    const cmd = getAddTimeFilterCommand(ctx as any);
    // `"toString" in INTERVAL_MILLIS` is true (inherited from Object.prototype),
    // so the guard must use an own-property check to reject it.
    const result = (await cmd.execute({} as any, {
      datasetName: table.label,
      dateTimeColumn: 'ts',
      interval: 'toString'
    })) as CommandResult;

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/Invalid interval/);
  });

  it('rejects a non-timestamp column', async () => {
    const table = await makeTimestampTable();
    const {ctx} = makeCtx(table);

    const cmd = getAddTimeFilterCommand(ctx as any);
    const result = (await cmd.execute({} as any, {
      datasetName: table.label,
      dateTimeColumn: 'lat'
    })) as CommandResult;

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/not timestamp\/date/);
  });

  it('fails fast when the dataset is unknown', async () => {
    const table = await makeTimestampTable();
    const {ctx} = makeCtx(table);

    const cmd = getAddTimeFilterCommand(ctx as any);
    const result = (await cmd.execute({} as any, {
      datasetName: 'nope',
      dateTimeColumn: 'ts'
    })) as CommandResult;

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/not found/);
  });
});
