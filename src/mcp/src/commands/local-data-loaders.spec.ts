/** @jest-environment node */

// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {getKeplerLoaders} from '@kepler.gl/processors';
import {getLocalDataLoaders} from './local-data-loaders';

async function parseChunks(
  chunks: AsyncIterable<ArrayBufferView> | Iterable<ArrayBufferView>,
  signal?: AbortSignal,
  customLoaders: Awaited<ReturnType<typeof getKeplerLoaders>> = []
) {
  const loaders = await getLocalDataLoaders(new File([], 'data.json'), customLoaders, signal);
  const loader = loaders.find(candidate => candidate.id === 'json') as any;
  const rows: any[] = [];
  for await (const batch of loader.parseInBatches(chunks, {
    json: {jsonpaths: ['$'], shape: 'object-row-table'}
  })) {
    rows.push(...batch.data);
  }
  return rows;
}

describe('local MCP document JSON loader', () => {
  it('validates the built-in JSON parser when explicitly supplied by the host', async () => {
    const loaders = await getKeplerLoaders({name: 'data.json'});
    const jsonLoader = loaders.find(loader => loader.id === 'json')!;
    for (const loader of [jsonLoader, {...jsonLoader, options: {...jsonLoader.options}}]) {
      await expect(
        parseChunks([new TextEncoder().encode('[{"value":1},')], undefined, [loader])
      ).rejects.toThrow(/Unexpected end of JSON document/);
      expect(
        await parseChunks([new TextEncoder().encode('[{"value":1}]')], undefined, [loader])
      ).toEqual([{value: 1}]);
    }
  });

  it('preserves a host replacement batch parser with custom document semantics', async () => {
    const loaders = await getKeplerLoaders({name: 'data.json'});
    const jsonLoader = loaders.find(loader => loader.id === 'json')!;
    const customLoader = {
      ...jsonLoader,
      async *parseInBatches(input: AsyncIterable<ArrayBufferView>) {
        for await (const chunk of input) {
          yield {data: [{value: new TextDecoder().decode(chunk)}]};
        }
      }
    };

    expect(
      await parseChunks([new TextEncoder().encode('custom non-JSON')], undefined, [customLoader])
    ).toEqual([{value: 'custom non-JSON'}]);
  });

  it('preserves UTF-8 characters and typed-array offsets across input boundaries', async () => {
    const expected = [{name: 'Київ 😀', escaped: '\\"', number: -1.2e-3}];
    const bytes = new TextEncoder().encode(JSON.stringify(expected));
    const padded = new Uint8Array(bytes.length + 6).fill(0xff);
    padded.set(bytes, 3);
    for (let boundary = 0; boundary <= bytes.length; boundary++) {
      const chunks = [padded.subarray(3, 3 + boundary), padded.subarray(3 + boundary, -3)];
      expect(await parseChunks(chunks)).toEqual(expected);
    }
  });

  it('parses a large input chunk with bounded text decoding', async () => {
    const value = 'x'.repeat(2 * 1024 * 1024);
    const input = new TextEncoder().encode(JSON.stringify([{value}]));
    const decode = TextDecoder.prototype.decode;
    const boundedDecode = jest
      .spyOn(TextDecoder.prototype, 'decode')
      .mockImplementation(function (this: TextDecoder, bytes, options) {
        if (bytes && bytes.byteLength > 1024 * 1024) {
          throw new Error('Attempted to decode a full large document at once');
        }
        return decode.call(this, bytes, options);
      });
    try {
      expect(await parseChunks([input])).toEqual([{value}]);
    } finally {
      boundedDecode.mockRestore();
    }
  });

  it('stops consuming chunks when the MCP import is cancelled', async () => {
    const controller = new AbortController();
    let completed = false;
    async function* input() {
      yield new TextEncoder().encode('[{"value":');
      controller.abort();
      yield new TextEncoder().encode('1}]');
      completed = true;
    }

    await expect(parseChunks(input(), controller.signal)).rejects.toMatchObject({
      name: 'AbortError'
    });
    expect(completed).toBe(false);
  });
});
