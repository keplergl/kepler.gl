// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {fileURLToPath} from 'node:url';

export const assistantDuckDbPlugin = {
  name: 'assistant-shared-duckdb',
  setup(build) {
    build.onResolve({filter: /@sqlrooms\/duckdb$/}, args => {
      if (args.importer.includes('/@openassistant/kepler-assistant/')) {
        return {
          path: fileURLToPath(new URL('./src/components/assistant-duckdb.ts', import.meta.url))
        };
      }
    });
  }
};
