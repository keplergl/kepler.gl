import {getAddColumnCommand} from './add-column-command';
import {tableFromArrays} from 'apache-arrow';

// Mock the actions module so the test never touches real kepler state — the
// command's runtime guards + DuckDB query construction + updateDataset payload
// are what we're asserting. (processors is NOT mocked: buildAddColumnPayload
// uses the real arrowSchemaToFields to derive the new column's field.)
jest.mock('@kepler.gl/actions', () => ({
  updateDataset: jest.fn((id: string, data: any) => ({type: 'UPDATE_DATASET', id, data}))
}));

/**
 * Mock KeplerContext. The command resolves the dataset from visState.datasets,
 * loads it into DuckDB via loadTableIntoDuckDB (returning a connector whose
 * query result feeds buildAddColumnPayload), and dispatches updateDataset.
 */
function makeCtx() {
  const dispatched: any[] = [];
  const db = {
    query: jest.fn().mockResolvedValue(tableFromArrays({c: [100, 200]}))
  };
  const dataset = {
    id: 'd1',
    label: 'My Dataset',
    length: 2,
    fields: [
      {name: 'a', type: 'integer'},
      {name: 'b', type: 'integer'}
    ],
    getValue: (name: string, i: number) => (name === 'a' ? [10, 20][i] : [30, 40][i])
  };
  const visState = {datasets: {d1: dataset}, layers: []};
  const ctx = {
    getVisState: () => visState,
    loadTableIntoDuckDB: jest.fn().mockResolvedValue(db),
    dispatch: (action: any) => {
      dispatched.push(action);
    },
    getValuesFromDataset: () => [],
    getMapBoundary: () => null,
    getMapboxToken: () => undefined,
    getDatasetContext: () => ''
  };
  return {ctx, db, getDispatched: () => dispatched};
}

type CommandResult = {success: boolean; error?: string; data?: Record<string, unknown>};

describe('map.add-column', () => {
  it('rejects when neither copyFromColumn nor expression is provided', async () => {
    const {ctx, db} = makeCtx();
    const cmd = getAddColumnCommand(ctx as any);
    const result = (await cmd.execute({} as any, {
      datasetName: 'My Dataset',
      newColumnName: 'c'
    })) as CommandResult;

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/exactly one/);
    expect(db.query).not.toHaveBeenCalled();
  });

  it('rejects when both copyFromColumn and expression are provided', async () => {
    const {ctx, db} = makeCtx();
    const cmd = getAddColumnCommand(ctx as any);
    const result = (await cmd.execute({} as any, {
      datasetName: 'My Dataset',
      newColumnName: 'c',
      copyFromColumn: 'a',
      expression: 'a + 1'
    })) as CommandResult;

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/exactly one/);
    expect(db.query).not.toHaveBeenCalled();
  });

  it('rejects an empty expression (bridge path skips zod)', async () => {
    const {ctx, db} = makeCtx();
    const cmd = getAddColumnCommand(ctx as any);
    const result = (await cmd.execute({} as any, {
      datasetName: 'My Dataset',
      newColumnName: 'c',
      expression: ''
    })) as CommandResult;

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/expression must be a non-empty string/);
    expect(db.query).not.toHaveBeenCalled();
  });

  it('rejects an empty copyFromColumn (bridge path skips zod)', async () => {
    const {ctx, db} = makeCtx();
    const cmd = getAddColumnCommand(ctx as any);
    const result = (await cmd.execute({} as any, {
      datasetName: 'My Dataset',
      newColumnName: 'c',
      copyFromColumn: ''
    })) as CommandResult;

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/copyFromColumn must be a non-empty string/);
    expect(db.query).not.toHaveBeenCalled();
  });

  it('escapes double quotes in identifiers when building the SQL', async () => {
    const {ctx, db} = makeCtx();
    const cmd = getAddColumnCommand(ctx as any);
    const result = (await cmd.execute({} as any, {
      datasetName: 'My Dataset',
      newColumnName: 'we"ird',
      copyFromColumn: 'a'
    })) as CommandResult;

    expect(result.success).toBe(true);
    const sql = db.query.mock.calls[0][0];
    // the embedded quote is doubled so it can't break out of the identifier
    expect(sql).toContain('"a" AS "we""ird"');
  });

  it('builds the expression path with the raw expression and escaped new column name', async () => {
    const {ctx, db} = makeCtx();
    const cmd = getAddColumnCommand(ctx as any);
    const result = (await cmd.execute({} as any, {
      datasetName: 'My Dataset',
      newColumnName: 'c',
      expression: '(a - AVG(a) OVER()) / STDDEV(a) OVER()'
    })) as CommandResult;

    expect(result.success).toBe(true);
    const sql = db.query.mock.calls[0][0];
    // the expression is wrapped in parens and the new column name is escaped
    expect(sql).toContain('((a - AVG(a) OVER()) / STDDEV(a) OVER()) AS "c"');
  });

  it('rejects a copyFromColumn that does not exist in the dataset', async () => {
    const {ctx, db} = makeCtx();
    const cmd = getAddColumnCommand(ctx as any);
    const result = (await cmd.execute({} as any, {
      datasetName: 'My Dataset',
      newColumnName: 'c',
      copyFromColumn: 'nope'
    })) as CommandResult;

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/does not exist/);
    expect(db.query).not.toHaveBeenCalled();
  });

  it('rejects a newColumnName that already exists', async () => {
    const {ctx, db} = makeCtx();
    const cmd = getAddColumnCommand(ctx as any);
    const result = (await cmd.execute({} as any, {
      datasetName: 'My Dataset',
      newColumnName: 'a',
      copyFromColumn: 'b'
    })) as CommandResult;

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/already exists/);
    expect(db.query).not.toHaveBeenCalled();
  });

  it('errors on a row-count mismatch between the computed column and the dataset', async () => {
    const {ctx, db} = makeCtx();
    // the expression returns only 1 row for a 2-row dataset
    db.query.mockResolvedValue(tableFromArrays({c: [100]}));
    const cmd = getAddColumnCommand(ctx as any);
    const result = (await cmd.execute({} as any, {
      datasetName: 'My Dataset',
      newColumnName: 'c',
      copyFromColumn: 'a'
    })) as CommandResult;

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/produced 1 rows/);
  });

  it('dispatches updateDataset with the original columns plus the appended one', async () => {
    const {ctx, getDispatched} = makeCtx();
    const cmd = getAddColumnCommand(ctx as any);
    const result = (await cmd.execute({} as any, {
      datasetName: 'My Dataset',
      newColumnName: 'c',
      copyFromColumn: 'a'
    })) as CommandResult;

    expect(result.success).toBe(true);
    const action = getDispatched().find((a: any) => a.type === 'UPDATE_DATASET');
    expect(action).toBeTruthy();
    expect(action.id).toBe('d1');
    // rows: original a, b + appended c
    expect(action.data.rows).toEqual([
      [10, 30, 100],
      [20, 40, 200]
    ]);
    expect(action.data.fields.map((f: any) => f.name)).toEqual(['a', 'b', 'c']);
  });
});
