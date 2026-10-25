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

/** Validate only an otherwise empty snapshot; nonempty CSV keeps the parser's permissiveness. */
function csvHeaderValidator() {
  const decoder = new TextDecoder();
  const candidates = [',', '\t', ';', '|'].map(delimiter => ({
    delimiter,
    state: 'start',
    hasValue: false,
    done: false,
    invalid: false,
    field: '',
    fields: [] as string[],
    header: undefined as string[] | undefined
  }));
  const finishRecord = (candidate: (typeof candidates)[number]) => {
    if (candidate.hasValue) {
      if (candidate.header) candidate.done = true;
      else candidate.header = [...candidate.fields, candidate.field];
    }
    candidate.field = '';
    candidate.fields = [];
    candidate.hasValue = false;
    candidate.state = 'start';
  };
  return {
    read(bytes: ArrayBufferLike | ArrayBufferView) {
      if (candidates.every(candidate => candidate.done)) return;
      const text = decoder.decode(bytes as AllowSharedBufferSource, {stream: true});
      for (const candidate of candidates) {
        if (candidate.done) continue;
        for (const char of text) {
          const {state} = candidate;
          if (state === 'quoted') {
            if (char === '"') candidate.state = 'closed';
            else {
              if (char.trim()) candidate.hasValue = true;
              if (!candidate.header) candidate.field += char;
            }
          } else if (state === 'closed' && char === '"') {
            candidate.state = 'quoted';
            candidate.hasValue = true;
            if (!candidate.header) candidate.field += char;
          } else if (char === '\n' || char === '\r') {
            finishRecord(candidate);
            if (candidate.done) break;
          } else if (char === candidate.delimiter) {
            if (!candidate.header) candidate.fields.push(candidate.field);
            candidate.field = '';
            candidate.state = 'start';
          } else if (state === 'start' && char === '"') {
            candidate.state = 'quoted';
          } else {
            if ((state === 'closed' && char.trim()) || char === '"') candidate.invalid = true;
            if (char.trim()) candidate.hasValue = true;
            if (state !== 'closed') {
              candidate.state = 'text';
              if (!candidate.header) candidate.field += char;
            }
          }
        }
      }
    },
    // Compare actual values, not only width: another delimiter can otherwise
    // mistake a skipped blank row for the malformed header that followed it.
    valid: (header: string[]) =>
      candidates.some(candidate => {
        if (candidate.invalid || candidate.state === 'quoted' || candidate.done) return false;
        finishRecord(candidate);
        return (
          !candidate.done &&
          candidate.header?.length === header.length &&
          candidate.header.every((name, i) => name === header[i])
        );
      })
  };
}

async function* parseCsvBatches(
  loader: KeplerCSVLoaderType,
  iterator:
    | AsyncIterable<ArrayBufferLike | ArrayBufferView>
    | Iterable<ArrayBufferLike | ArrayBufferView>,
  options: CSVLoaderOptions,
  context?: LoaderContext
) {
  const parseInBatches = loader.parseInBatches;
  if (!parseInBatches)
    throw new Error('KeplerCSVLoader: CSV loader does not support parseInBatches');
  const csv = options.csv;
  const coreShape = (options.core as {shape?: string} | undefined)?.shape;
  const shape = coreShape || (options as any).shape || csv?.shape || 'object-row-table';
  // These modes have their own header/row-limit semantics. Keep their existing parser path.
  if (
    shape !== 'object-row-table' ||
    coreShape !== undefined ||
    (csv?.header !== undefined && csv.header !== 'auto') ||
    csv?.comments ||
    csv?.skipEmptyLines === false ||
    (csv?.quoteChar !== undefined && csv.quoteChar !== '"') ||
    (csv?.escapeChar !== undefined && csv.escapeChar !== '"') ||
    (csv as any)?.delimiter ||
    options.core?.limit ||
    options.core?._limitMB ||
    (options as any).limit ||
    (options as any)._limitMB
  ) {
    yield* parseInBatches(iterator, options, context);
    return;
  }

  const validator = csvHeaderValidator();
  async function* input() {
    for await (const bytes of iterator) {
      validator.read(bytes);
      yield bytes;
    }
  }
  // Expose the parsed header as a row: loaders.gl otherwise emits no schema at
  // all for header-only input. This still parses the input once, in batches.
  const rowOptions = {
    ...options,
    shape: 'array-row-table',
    csv: {...csv, shape: 'array-row-table', header: false}
  } as unknown as CSVLoaderOptions;
  let header: string[] | undefined;
  let parsedHeader: string[] | undefined;
  let columns: string[] | undefined;
  let lastBatch: any;
  const schema = (names: string[], empty = false) => ({
    fields: names.map(name => ({name, type: 'utf8', nullable: true})),
    metadata: {
      ...lastBatch?.schema?.metadata,
      'loaders.gl#format': 'csv',
      ...(empty ? {'kepler.gl#csv-header-only': true} : {})
    }
  });
  for await (const batch of parseInBatches(input(), rowOptions, context)) {
    lastBatch = batch;
    const rows: unknown[][] = batch.data;
    let start = 0;
    if (!header && rows.length) {
      const seen = new Set<string>();
      parsedHeader = rows[0].map(String);
      header = parsedHeader.map(value => {
        const base = String(value);
        let name = base;
        let suffix = 1;
        while (seen.has(name)) name = `${base}.${suffix++}`;
        seen.add(name);
        return name;
      });
      start = 1;
    }
    if (start === rows.length) continue;
    // Match loaders.gl's existing first-data-row width, including ragged CSV.
    columns ||= rows[start].map((_, i) => header?.[i] || String(i));
    const data: Record<string, unknown>[] = [];
    for (let rowIndex = start; rowIndex < rows.length; rowIndex++) {
      const row = rows[rowIndex];
      const object: Record<string, unknown> = {};
      for (let i = 0; i < columns.length; i++) {
        const name = columns[i];
        if (name === '__proto__') {
          Object.defineProperty(object, name, {
            value: row[i],
            enumerable: true,
            configurable: true,
            writable: true
          });
        } else {
          object[name] = row[i];
        }
      }
      data.push(object);
    }
    yield {...batch, shape: 'object-row-table', schema: schema(columns), data, length: data.length};
  }
  if (!columns) {
    // Never throw from input(): the upstream streamer does not close its output
    // queue on every iterator error. Validate after it has finished instead.
    if (!header?.length || !parsedHeader || !validator.valid(parsedHeader)) {
      throw new Error('CSV snapshot is blank or has a malformed header');
    }
    yield {
      ...lastBatch,
      batchType: 'data',
      shape: 'object-row-table',
      schema: schema(
        header.map((name, i) => name || String(i)),
        true
      ),
      data: [],
      length: 0
    };
  }
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
      yield* parseCsvBatches(loader, iterator, getOptions(options), context);
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
