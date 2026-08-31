import {getLoadDataCommand} from './load-data-command';

// Mock the processors so the test never touches real file parsing — the
// command's fetch + batch-parse + dispatch flow is what we're asserting.
jest.mock('@kepler.gl/processors', () => ({
  readFileInBatches: jest.fn(),
  processFileData: jest.fn()
}));

import {readFileInBatches, processFileData} from '@kepler.gl/processors';

function makeCtx() {
  let dispatched: any = null;
  const ctx = {
    getVisState: () => ({datasets: {}, layers: [], loaders: [], loadOptions: {}}),
    dispatch: (action: any) => {
      dispatched = action;
    },
    getValuesFromDataset: () => [],
    getMapBoundary: () => null,
    getMapboxToken: () => undefined,
    getDatasetContext: () => ''
  };
  return {ctx, getDispatched: () => dispatched};
}

type CommandResult = {success: boolean; error?: string; data?: Record<string, unknown>};

describe('map.load-data', () => {
  beforeEach(() => {
    (readFileInBatches as jest.Mock).mockReset();
    (processFileData as jest.Mock).mockReset();
  });

  it('fetches the URL, parses it, and dispatches addDataToMap with the datasetName override', async () => {
    const {ctx, getDispatched} = makeCtx();

    // fetch resolves to a Response-like blob; readFileInBatches yields one
    // content batch then completes; processFileData returns the parsed dataset.
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      statusText: 'OK',
      blob: async () => new Blob(['a,b\n1,2'], {type: 'text/csv'})
    } as any);

    const content = {data: [{a: 1, b: 2}], fileName: 'data.csv'};
    (readFileInBatches as jest.Mock).mockResolvedValue({
      next: jest
        .fn()
        .mockResolvedValueOnce({value: content, done: false})
        .mockResolvedValueOnce({value: undefined, done: true})
    });
    (processFileData as jest.Mock).mockResolvedValue([
      {info: {label: 'data.csv'}, rows: [{a: 1, b: 2}]}
    ]);

    const cmd = getLoadDataCommand(ctx as any);
    const result = (await cmd.execute({} as any, {
      url: 'https://example.com/data.csv',
      datasetName: 'My Dataset'
    })) as CommandResult;

    expect(result.success).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith('https://example.com/data.csv', {signal: undefined});

    const action = getDispatched();
    expect(action).toBeTruthy();
    expect(action.type).toMatch(/ADD_DATA_TO_MAP/);
    // datasetName override wins over the URL filename
    expect(action.payload.datasets[0].info.label).toBe('My Dataset');
    // no auto-created layer — the assistant adds layers explicitly
    expect(action.payload.options).toEqual({autoCreateLayers: false, centerMap: true});
  });

  it('falls back to the URL filename when datasetName is omitted', async () => {
    const {ctx, getDispatched} = makeCtx();

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      statusText: 'OK',
      blob: async () => new Blob(['a,b\n1,2'], {type: 'text/csv'})
    } as any);

    const content = {data: [{a: 1, b: 2}], fileName: 'data.csv'};
    (readFileInBatches as jest.Mock).mockResolvedValue({
      next: jest
        .fn()
        .mockResolvedValueOnce({value: content, done: false})
        .mockResolvedValueOnce({value: undefined, done: true})
    });
    (processFileData as jest.Mock).mockResolvedValue([
      {info: {label: 'data.csv'}, rows: [{a: 1, b: 2}]}
    ]);

    const cmd = getLoadDataCommand(ctx as any);
    const result = (await cmd.execute({} as any, {
      url: 'https://example.com/data.csv?x=1'
    })) as CommandResult;

    expect(result.success).toBe(true);
    const action = getDispatched();
    // query strings are stripped from the derived filename
    expect(action.payload.datasets[0].info.label).toBe('data.csv');
  });

  it('returns an error for an invalid URL without dispatching', async () => {
    const {ctx, getDispatched} = makeCtx();

    const cmd = getLoadDataCommand(ctx as any);
    const result = (await cmd.execute({} as any, {
      url: 'not a url'
    })) as CommandResult;

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/Invalid URL/);
    expect(getDispatched()).toBeNull();
  });
});
