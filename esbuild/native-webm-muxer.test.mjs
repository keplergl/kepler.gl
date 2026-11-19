// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import assert from 'node:assert/strict';
import {mkdtemp, mkdir, writeFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {test} from 'node:test';
import {runInNewContext} from 'node:vm';
import {build} from 'esbuild';
import {nativeWebMMuxerPlugin} from './native-webm-muxer.mjs';

test('UMD keeps the deferred WebM adapter in one file and prunes unused exports', async () => {
  const root = await mkdtemp(join(tmpdir(), 'kepler-muxer-'));
  try {
    const dir = join(root, 'components/dist/cjs/modals');
    await mkdir(dir, {recursive: true});
    const adapter = join(dir, 'native-webm-muxer.js');
    const library = join(root, 'mediabunny.js');
    const names = [
      'BufferTarget',
      'Output',
      'WebMOutputFormat',
      'EncodedVideoPacketSource',
      'EncodedPacket'
    ];
    // A namespace require models the opaque, Babel-compiled package boundary.
    await writeFile(adapter, `module.exports = require('mediabunny');`);
    await writeFile(
      library,
      `globalThis.muxerLoaded = true;
       ${names.map(name => `export class ${name} {}`).join('\n')}
       export const unused = 'unused-reader-code-marker';`
    );
    const options = {
      stdin: {
        contents: `globalThis.loadMuxer = () => Promise.resolve().then(() => require(${JSON.stringify(
          adapter
        )}));`,
        resolveDir: root
      },
      alias: {mediabunny: library},
      bundle: true,
      minify: true,
      platform: 'browser',
      format: 'iife',
      write: false
    };
    const baseline = await build(options);
    assert.match(baseline.outputFiles[0].text, /unused-reader-code-marker/);
    const result = await build({...options, plugins: [nativeWebMMuxerPlugin]});
    assert.equal(result.outputFiles.length, 1);
    assert.doesNotMatch(result.outputFiles[0].text, /unused-reader-code-marker/);
    const context = {};
    runInNewContext(result.outputFiles[0].text, context);
    assert.equal(context.muxerLoaded, undefined);
    const muxer = await context.loadMuxer();
    assert.equal(context.muxerLoaded, true);
    assert.deepEqual(Object.keys(muxer).sort(), names.sort());
    for (const name of names) assert.equal(typeof muxer[name], 'function');
  } finally {
    await rm(root, {recursive: true, force: true});
  }
});
