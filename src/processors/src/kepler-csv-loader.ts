// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import type {LoaderWithParser, StrictLoaderOptions} from '@loaders.gl/core/loader-utils';
import type {CSVLoaderOptions} from '@loaders.gl/tables/csv';

type KeplerCSVOptions = CSVLoaderOptions & StrictLoaderOptions;

const KEPLER_CSV_OPTIONS: KeplerCSVOptions = {
  csv: {
    shape: 'object-row-table',
    skipEmptyLines: 'greedy',
    dynamicTyping: false,
    delimitersToGuess: [',', '\t', ';', '|']
  }
};

type KeplerCSVLoaderType = LoaderWithParser<any, any, KeplerCSVOptions>;

type CSVParser = Awaited<ReturnType<typeof import('@loaders.gl/tables/csv').CSVLoader.preload>>;

let csvLoaderPromise: Promise<CSVParser> | null = null;

async function getCSVLoader(): Promise<CSVParser> {
  csvLoaderPromise ||= import('@loaders.gl/tables/csv').then(
    module => module.CSVLoader.preload()
  );
  return csvLoaderPromise;
}

function getOptions(options?: CSVLoaderOptions): CSVLoaderOptions {
  return {
    ...options,
    csv: {
      ...KEPLER_CSV_OPTIONS.csv,
      ...options?.csv,
      // Kepler performs its own type inference after parsing.
    dynamicTyping: false,
      delimitersToGuess: [',', '\t', ';', '|']
    }
  };
}

/**
 * CSV loader used by Kepler's asynchronous file-loading path.
 *
 * The parser implementation is dynamically imported on first use. Kepler's
 * existing row processor remains responsible for null normalization and type
 * inference, preserving the public processCsvData contract.
 */
export const KeplerCSVLoader: KeplerCSVLoaderType = {
  name: 'Kepler CSV',
  id: 'csv',
  module: 'csv',
  version: '1.0.0',
  extensions: ['csv', 'tsv', 'dsv'],
  mimeTypes: ['text/csv', 'text/tab-separated-values', 'text/dsv'],
  category: 'table',
  text: true,
  options: KEPLER_CSV_OPTIONS,

  parse: async (arrayBuffer: ArrayBuffer, options?: CSVLoaderOptions) => {
    const loader = await getCSVLoader();
    if (!loader.parse) {
      throw new Error('KeplerCSVLoader: CSV loader does not support parse');
    }
    return loader.parse(arrayBuffer, getOptions(options));
  },

  parseInBatches: (
    iterator:
      | AsyncIterable<ArrayBufferLike | ArrayBufferView>
      | Iterable<ArrayBufferLike | ArrayBufferView>,
    options?: CSVLoaderOptions
  ) => {
    const batches = (async function* () {
      const loader = await getCSVLoader();
      const output = loader.parseInBatches?.(iterator, getOptions(options));
      if (!output) {
        throw new Error('KeplerCSVLoader: CSV loader does not support parseInBatches');
      }
      yield* output;
    })();
    return batches;
  },

  parseText: async (text: string, options?: CSVLoaderOptions) => {
    const loader = await getCSVLoader();
    if (!loader.parseText) {
      throw new Error('KeplerCSVLoader: CSV loader does not support parseText');
    }
    return loader.parseText(text, getOptions(options));
  }
};
