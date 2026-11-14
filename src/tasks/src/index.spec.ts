// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {LOAD_MAP_STYLE_TASK, Task} from './index';

jest.mock('@kepler.gl/processors', () => ({}));

const run = task =>
  new Promise(resolve =>
    task.run((effect, success, error) => effect(success, error), resolve, resolve)
  );

describe('basemap style task failures', () => {
  const originalFetch = global.fetch;
  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('settles a batch when a network request fails', async () => {
    const error = new Error('network offline');
    global.fetch = jest.fn().mockRejectedValue(error);
    const result = await run(
      Task.all([LOAD_MAP_STYLE_TASK({url: '/style', id: 'map'})]).bimap(
        styles => ({styles}),
        failure => ({failure})
      )
    );
    expect(result).toEqual({failure: error});
  });

  it.each(['json', 'empty', 'http', 'body'])(
    'rejects %s failure without succeeding',
    async kind => {
      const error = new Error('invalid response');
      global.fetch = jest.fn().mockResolvedValue({
        ok: kind === 'json' || kind === 'empty',
        json: () => (kind === 'json' ? Promise.reject(error) : Promise.resolve(null)),
        text: () => (kind === 'body' ? Promise.reject(error) : Promise.resolve('not found'))
      });
      const success = jest.fn(value => value);
      const failure = jest.fn(value => ({error: value}));
      await run(LOAD_MAP_STYLE_TASK({url: '/style', id: 'map'}).bimap(success, failure));
      expect(success).not.toHaveBeenCalled();
      expect(failure).toHaveBeenCalledTimes(1);
      expect(failure.mock.calls[0][0]).toEqual(
        kind === 'http'
          ? 'not found'
          : kind === 'empty'
          ? new Error('Map style response is empty')
          : error
      );
    }
  );

  it('preserves successful style identity and content', async () => {
    const style = {version: 8, sources: {}, layers: []};
    global.fetch = jest.fn().mockResolvedValue({ok: true, json: async () => style});
    expect(await run(LOAD_MAP_STYLE_TASK({url: '/style', id: 'map'}))).toEqual({id: 'map', style});
  });
});
