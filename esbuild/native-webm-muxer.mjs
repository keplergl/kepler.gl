// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {readFile} from 'node:fs/promises';

// UMD consumes the CommonJS packages. Restore ESM only for this tiny adapter so
// its named exports can prune Mediabunny without changing package resolution for
// any other module or adding a chunk to standalone exported HTML maps.
export const nativeWebMMuxerPlugin = {
  name: 'native-webm-muxer',
  setup(build) {
    build.onLoad(
      {filter: /[/\\]components[/\\]dist[/\\]cjs[/\\]modals[/\\]native-webm-muxer\.js$/},
      async () => ({
        contents: await readFile(
          new URL('../src/components/src/modals/native-webm-muxer.ts', import.meta.url),
          'utf8'
        ),
        loader: 'ts'
      })
    );
  }
};
