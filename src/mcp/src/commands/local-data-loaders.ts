// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {getKeplerLoaders, KEPLER_LOADER_ENTRIES} from '@kepler.gl/processors';
import {JsonDocumentValidator} from './json-document-validator';

type Loaders = Awaited<ReturnType<typeof getKeplerLoaders>>;
type BinaryChunks =
  | AsyncIterable<ArrayBufferLike | ArrayBufferView>
  | Iterable<ArrayBufferLike | ArrayBufferView>;
type BatchParser = (input: BinaryChunks, options?: any, context?: any) => AsyncIterable<any>;

/** Validate without retaining JSON values or a complete decoded document. */
async function* validateJsonChunks(input: BinaryChunks, fileName: string, signal?: AbortSignal) {
  const validator = new JsonDocumentValidator();
  const decoder = new TextDecoder();
  const validate = (text: string, done = false) => {
    try {
      validator.write(text);
      if (done) validator.finish();
    } catch (error) {
      throw new Error(
        `Invalid JSON in ${fileName}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  };

  for await (const chunk of input) {
    const bytes = ArrayBuffer.isView(chunk)
      ? new Uint8Array(chunk.buffer, chunk.byteOffset, chunk.byteLength)
      : new Uint8Array(chunk);
    // Bound the temporary decoded text even if a host supplies large chunks.
    for (let offset = 0; offset < bytes.byteLength; offset += 64 * 1024) {
      signal?.throwIfAborted();
      const part = bytes.subarray(offset, offset + 64 * 1024);
      validate(decoder.decode(part, {stream: true}));
      yield part;
    }
  }
  signal?.throwIfAborted();
  validate(decoder.decode(), true);
}

/**
 * Wrap only the built-in document JSON parser for local MCP imports. Loader
 * selection still happens in readFileInBatches, including MIME overrides and
 * content tests. NDJSON and host-provided parsers keep their own semantics.
 */
export async function getLocalDataLoaders(
  file: File,
  customLoaders: Loaders,
  signal?: AbortSignal
): Promise<Loaders> {
  const loaders = await getKeplerLoaders(file, customLoaders);
  const jsonLoader = loaders.find(loader => loader.id === 'json') as
    | (Loaders[number] & {parseInBatches?: BatchParser})
    | undefined;
  if (!jsonLoader?.parseInBatches) return loaders;

  const defaultJsonLoader = (await KEPLER_LOADER_ENTRIES.find(
    entry => entry.id === 'json'
  )?.load()) as typeof jsonLoader;
  // A host may explicitly supply the default loader or a copy with options.
  // Only a replaced parser should retain custom document semantics.
  if (jsonLoader.parseInBatches !== defaultJsonLoader?.parseInBatches) return loaders;

  return loaders.map(loader => {
    if (loader !== jsonLoader) return loader;
    const parseInBatches = jsonLoader.parseInBatches!;
    return {
      ...loader,
      parseInBatches: (input: BinaryChunks, options?: any, context?: any) =>
        parseInBatches(validateJsonChunks(input, file.name, signal), options, context)
    };
  });
}
