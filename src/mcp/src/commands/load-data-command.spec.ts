import {getLoadDataCommand} from './load-data-command';

// Mock the processors so the test never touches real file parsing — the
// command's fetch + batch-parse + dispatch flow is what we're asserting.
jest.mock('@kepler.gl/processors', () => ({
  readFileInBatches: jest.fn(),
  processFileData: jest.fn()
}));

import {readFileInBatches, processFileData} from '@kepler.gl/processors';

// The tests stub global.fetch; capture the original so it can be restored in
// afterEach — otherwise the mock leaks into other suites in the same run and
// causes order-dependent failures.
const originalFetch = global.fetch;

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

  afterEach(() => {
    global.fetch = originalFetch;
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
    // `http://` has a scheme but no host — unparseable even with a base, so it
    // stays a genuine "Invalid URL" (a scheme-less string like `not a url` is a
    // valid relative reference in jsdom and resolves against the page origin).
    const result = (await cmd.execute({} as any, {
      url: 'http://'
    })) as CommandResult;

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/Invalid URL/);
    expect(getDispatched()).toBeNull();
  });

  it('returns an error for an empty url without dispatching', async () => {
    const {ctx, getDispatched} = makeCtx();

    const cmd = getLoadDataCommand(ctx as any);
    const result = (await cmd.execute({} as any, {
      url: '   '
    })) as CommandResult;

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/Invalid URL/);
    expect(getDispatched()).toBeNull();
  });

  it('resolves a relative URL against the page origin (local-file support)', async () => {
    const {ctx, getDispatched} = makeCtx();

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      statusText: 'OK',
      blob: async () => new Blob(['a,b\n1,2'], {type: 'text/csv'})
    } as any);

    const content = {data: [{a: 1, b: 2}], fileName: 'data.csv'};
    let capturedFile: any;
    (readFileInBatches as jest.Mock).mockImplementation(async ({file}: any) => {
      capturedFile = file;
      return {
        next: jest
          .fn()
          .mockResolvedValueOnce({value: content, done: false})
          .mockResolvedValueOnce({value: undefined, done: true})
      };
    });
    (processFileData as jest.Mock).mockResolvedValue([
      {info: {label: 'data.csv'}, rows: [{a: 1, b: 2}]}
    ]);

    const cmd = getLoadDataCommand(ctx as any);
    const result = (await cmd.execute({} as any, {
      url: '/data.csv'
    })) as CommandResult;

    expect(result.success).toBe(true);
    // jsdom's default origin is http://localhost — the relative path resolves
    // against it, so the fetch targets the demo app's own server (same-origin).
    expect(global.fetch).toHaveBeenCalledWith('http://localhost/data.csv', {signal: undefined});
    // the resolved href (not the bare relative path) is preserved for hashing
    expect(capturedFile.keplerSourceUrl).toBe('http://localhost/data.csv');
    const action = getDispatched();
    expect(action).toBeTruthy();
    expect(action.payload.datasets[0].info.label).toBe('data.csv');
  });

  it('includes the numeric status code in a non-ok fetch error', async () => {
    const {ctx, getDispatched} = makeCtx();

    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found'
    } as any);

    const cmd = getLoadDataCommand(ctx as any);
    const result = (await cmd.execute({} as any, {
      url: 'https://example.com/missing.csv'
    })) as CommandResult;

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/HTTP 404 Not Found/);
    expect(getDispatched()).toBeNull();
  });

  it('falls back to the bare status code when statusText is empty', async () => {
    const {ctx, getDispatched} = makeCtx();

    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: ''
    } as any);

    const cmd = getLoadDataCommand(ctx as any);
    const result = (await cmd.execute({} as any, {
      url: 'https://example.com/broken.csv'
    })) as CommandResult;

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/HTTP 500/);
    expect(getDispatched()).toBeNull();
  });

  it('loads a small file embedded as a data URL (remote-context local file)', async () => {
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
      url: 'data:text/csv;base64,YSxiCjEsMg=='
    })) as CommandResult;

    expect(result.success).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith('data:text/csv;base64,YSxiCjEsMg==', {
      signal: undefined
    });
    const action = getDispatched();
    expect(action).toBeTruthy();
    // the default dataset name is derived from the data URL's MIME type
    expect(action.payload.datasets[0].info.label).toBe('data.csv');
  });

  it('hashes a data URL down for the dataset source (no huge metadata)', async () => {
    const {ctx} = makeCtx();

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      statusText: 'OK',
      blob: async () => new Blob(['a,b\n1,2'], {type: 'text/csv'})
    } as any);

    const content = {data: [{a: 1, b: 2}], fileName: 'data.csv'};
    let capturedFile: any;
    (readFileInBatches as jest.Mock).mockImplementation(async ({file}: any) => {
      capturedFile = file;
      return {
        next: jest
          .fn()
          .mockResolvedValueOnce({value: content, done: false})
          .mockResolvedValueOnce({value: undefined, done: true})
      };
    });
    (processFileData as jest.Mock).mockResolvedValue([
      {info: {label: 'data.csv'}, rows: [{a: 1, b: 2}]}
    ]);

    const cmd = getLoadDataCommand(ctx as any);
    const result = (await cmd.execute({} as any, {
      url: 'data:text/csv;base64,YSxiCjEsMg=='
    })) as CommandResult;

    expect(result.success).toBe(true);
    // the source is a short content hash, not the full (potentially large) data URL
    expect(capturedFile.keplerSourceUrl).toMatch(/^data:[a-z0-9]+$/);
    expect(capturedFile.keplerSourceUrl).not.toContain('base64');
  });

  it('rejects an oversized data URL', async () => {
    const {ctx, getDispatched} = makeCtx();

    const cmd = getLoadDataCommand(ctx as any);
    const bigDataUrl = `data:text/csv;base64,${'A'.repeat(2 * 1024 * 1024 + 1)}`;
    const result = (await cmd.execute({} as any, {
      url: bigDataUrl
    })) as CommandResult;

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/Data URL is too large/);
    expect(getDispatched()).toBeNull();
  });
});
