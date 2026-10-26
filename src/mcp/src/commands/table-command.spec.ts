import {getTableCommand} from './table-command';
import {tableFromArrays} from 'apache-arrow';

// Mock the actions/processors so the test never touches real kepler state —
// the command's DuckDB round-trip + dispatch flow is what we're asserting.
jest.mock('@kepler.gl/actions', () => ({
  addDataToMap: jest.fn((payload: any) => ({type: 'ADD_DATA_TO_MAP', payload}))
}));
jest.mock('@kepler.gl/processors', () => ({
  processFileData: jest.fn()
}));

import {processFileData} from '@kepler.gl/processors';

/**
 * Mock KeplerContext. The command reads visState.datasets, pulls column values
 * via getValuesFromDataset, and runs the SQL through a DuckDB connector
 * (getConnector) whose query result is what arrowTableToObjects consumes.
 */
function makeCtx(opts: {datasets?: any; values?: Record<string, unknown[]>} = {}) {
  const dispatched: any[] = [];
  const db = {
    execute: jest.fn().mockResolvedValue(undefined),
    loadArrow: jest.fn().mockResolvedValue(undefined),
    query: jest.fn()
  };
  const ctx = {
    getVisState: () => ({datasets: opts.datasets ?? {}, layers: []}),
    getValuesFromDataset: (_dsName: string, varName: string) =>
      (opts.values ?? {})[varName] ?? [],
    getConnector: () => db,
    dispatch: (action: any) => {
      dispatched.push(action);
    },
    getMapBoundary: () => null,
    getMapboxToken: () => undefined,
    getDatasetContext: () => ''
  };
  return {ctx, db, getDispatched: () => dispatched};
}

type CommandResult = {success: boolean; error?: string; data?: Record<string, unknown>};

const dataset = {
  id: 'd1',
  label: 'My Dataset',
  length: 2,
  fields: [{name: 'a', type: 'integer'}, {name: 'b', type: 'integer'}]
};

describe('map.create-table', () => {
  beforeEach(() => {
    (processFileData as jest.Mock).mockReset();
    // Default: pass the query result through as the parsed dataset so the
    // dispatch payload mirrors what the command computed.
    (processFileData as jest.Mock).mockImplementation(async ({content}: any) => [
      {info: {label: content.fileName}, rows: content.data}
    ]);
  });

  it('requires the __TABLE__ placeholder in the SQL', async () => {
    const {ctx, db} = makeCtx({datasets: {d1: dataset}});
    const cmd = getTableCommand(ctx as any);
    const result = (await cmd.execute({} as any, {
      datasetName: 'My Dataset',
      variableNames: ['a'],
      sql: 'SELECT a FROM my_table',
      resultDatasetName: 'New Dataset'
    })) as CommandResult;

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/__TABLE__/);
    // fail fast — no DuckDB round-trip happens
    expect(db.query).not.toHaveBeenCalled();
    expect(db.loadArrow).not.toHaveBeenCalled();
  });

  it('dedupes variableNames before building the Arrow table', async () => {
    const {ctx, db} = makeCtx({
      datasets: {d1: dataset},
      values: {a: [1, 2], b: [3, 4]}
    });
    db.query.mockResolvedValue(tableFromArrays({a: [1, 2], b: [3, 4]}));

    const cmd = getTableCommand(ctx as any);
    const result = (await cmd.execute({} as any, {
      datasetName: 'My Dataset',
      variableNames: ['a', 'a', 'b'],
      sql: 'SELECT * FROM __TABLE__',
      resultDatasetName: 'New Dataset'
    })) as CommandResult;

    expect(result.success).toBe(true);
    // the loaded Arrow table has the deduped column set (a, b) — not 3 columns
    const loaded = db.loadArrow.mock.calls[0][0];
    expect(loaded.schema.fields.map((f: any) => f.name)).toEqual(['a', 'b']);
  });

  it('errors when the dataset does not exist', async () => {
    const {ctx, db} = makeCtx({datasets: {}});
    const cmd = getTableCommand(ctx as any);
    const result = (await cmd.execute({} as any, {
      datasetName: 'Nope',
      variableNames: ['a'],
      sql: 'SELECT * FROM __TABLE__',
      resultDatasetName: 'New Dataset'
    })) as CommandResult;

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/not found/);
    expect(db.query).not.toHaveBeenCalled();
  });

  it('preserves object-valued columns through the stringify/restore round-trip', async () => {
    const geojson = {type: 'Feature', properties: {name: 'x'}};
    const {ctx, db, getDispatched} = makeCtx({
      datasets: {
        d1: {
          ...dataset,
          fields: [{name: 'a', type: 'integer'}, {name: '_geojson', type: 'object'}]
        }
      },
      values: {a: [1, 2], _geojson: [geojson, geojson]}
    });
    // DuckDB returns the object column as a JSON string (VARCHAR)
    db.query.mockResolvedValue(
      tableFromArrays({
        a: [1, 2],
        _geojson: [JSON.stringify(geojson), JSON.stringify(geojson)]
      })
    );

    const cmd = getTableCommand(ctx as any);
    const result = (await cmd.execute({} as any, {
      datasetName: 'My Dataset',
      variableNames: ['a', '_geojson'],
      sql: 'SELECT * FROM __TABLE__',
      resultDatasetName: 'New Dataset'
    })) as CommandResult;

    expect(result.success).toBe(true);
    // the object is restored, not left as a JSON string
    const first = (result.data as any).firstFiveRows[0];
    expect(first._geojson).toEqual(geojson);

    // dispatched with the new dataset, no auto-created layers
    const action = getDispatched().find((a: any) => a.type === 'ADD_DATA_TO_MAP');
    expect(action).toBeTruthy();
    expect(action.payload.options).toEqual({autoCreateLayers: false, centerMap: true});
  });
});
