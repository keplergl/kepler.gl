// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import type {LoaderContext, LoaderWithParser} from '@loaders.gl/loader-utils';
import type {CSVLoaderOptions} from '@loaders.gl/csv';

const KEPLER_CSV_OPTIONS: CSVLoaderOptions = {
  csv: {
    dynamicTyping: false,
    delimitersToGuess: [',', '\t', ';', '|']
  }
};

type KeplerCSVLoaderType = LoaderWithParser<any, any, CSVLoaderOptions>;

let csvLoaderPromise: Promise<KeplerCSVLoaderType> | null = null;

async function getCSVLoader(): Promise<KeplerCSVLoaderType> {
  csvLoaderPromise ||= import('@loaders.gl/csv').then(
    module => module.CSVLoader as KeplerCSVLoaderType
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

  parse: async (arrayBuffer: ArrayBuffer, options?: CSVLoaderOptions, context?: LoaderContext) => {
    const loader = await getCSVLoader();
    if (!loader.parse) {
      throw new Error('KeplerCSVLoader: CSV loader does not support parse');
    }
    return loader.parse(arrayBuffer, getOptions(options), context);
  },

  parseInBatches: (
    iterator:
      | AsyncIterable<ArrayBufferLike | ArrayBufferView>
      | Iterable<ArrayBufferLike | ArrayBufferView>,
    options?: CSVLoaderOptions,
    context?: LoaderContext
  ) => {
    const batches = (async function* () {
      const loader = await getCSVLoader();
      const output = loader.parseInBatches?.(iterator, getOptions(options), context);
      if (!output) {
        throw new Error('KeplerCSVLoader: CSV loader does not support parseInBatches');
      }
      yield* output;
    })();
    return batches;
  },

  parseText: async (text: string, options?: CSVLoaderOptions, context?: LoaderContext) => {
    const loader = await getCSVLoader();
    if (!loader.parseText) {
      throw new Error('KeplerCSVLoader: CSV loader does not support parseText');
    }
    return loader.parseText(text, getOptions(options), context);
  }
};
