// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import wasm from 'vite-plugin-wasm';
import {resolve, dirname} from 'path';
import {createRequire} from 'module';
import {fileURLToPath} from 'url';

const _require = createRequire(import.meta.url);
const _dirname = dirname(fileURLToPath(import.meta.url));

// @turf/rewind ESM entry only has `export default rewind` (no named export), but
// @deck.gl-community/editable-layers uses `import { rewind } from '@turf/rewind'`.
// This plugin intercepts the import and injects a shim that re-exports the default
// as a named export. Remove once @turf/rewind ships a named export.
const turfRewindPlugin = {
  name: 'turf-rewind-interop',
  resolveId(id: string) {
    if (id === '@turf/rewind') return '\0turf-rewind-shim';
  },
  load(id: string) {
    if (id !== '\0turf-rewind-shim') return;
    const esmEntry = resolve(_dirname, 'node_modules/@turf/rewind/main.es.js');
    return `import rewindFn from ${JSON.stringify(esmEntry)};\nexport const rewind = rewindFn;\nexport default rewindFn;\n`;
  }
};

// All @kepler.gl/* packages and their pure-CJS transitive dependencies.
// These must be pre-bundled by esbuild so Vite serves them as ESM rather than
// trying to serve the raw CJS files (which have no `export default` and break
// Vite's native-ESM dev server).
const keplerPackages = [
  '@kepler.gl/actions',
  '@kepler.gl/cloud-providers',
  '@kepler.gl/common-utils',
  '@kepler.gl/components',
  '@kepler.gl/constants',
  '@kepler.gl/deckgl-arrow-layers',
  '@kepler.gl/deckgl-layers',
  '@kepler.gl/effects',
  '@kepler.gl/layers',
  '@kepler.gl/localization',
  '@kepler.gl/processors',
  '@kepler.gl/reducers',
  '@kepler.gl/schemas',
  '@kepler.gl/styles',
  '@kepler.gl/table',
  '@kepler.gl/tasks',
  '@kepler.gl/utils'
];

// Node.js built-in polyfills required by @kepler.gl/layers (which has a nested
// copy of `buffer`). `resolve.dedupe` collapses all nested copies to the root
// version; `optimizeDeps.include` forces esbuild to pre-bundle them as ESM.
const nodePolyfillDeps = ['buffer', 'base64-js', 'ieee754'];

// Pure-CJS packages imported by @loaders.gl/* ESM files. Because those loader
// packages are native-ESM (they have a `module`/`exports` field), Vite serves
// them raw without pre-bundling. Any CJS package they import must therefore be
// pre-bundled explicitly — otherwise Vite serves the raw CJS file, which has
// no `export default` and breaks the native-ESM import.
// List discovered by scanning all @loaders.gl/*/dist/**/*.js for bare imports.
const loadersCjsDeps = [
  'brotli',
  'int53',
  'jszip',
  'long',
  'lz4js',
  'node-int64',
  'pako',
  'pbf',
  'snappyjs',
  'thrift',
  'varint',
  'zstd-codec'
];

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [turfRewindPlugin, wasm(), react()],
  server: {
    port: 8081,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: true,
    rollupOptions: {
      input: {
        main: resolve(_dirname, 'index.html')
      }
    },
    target: 'esnext',
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    'process.env.MapboxAccessToken': JSON.stringify(process.env.MapboxAccessToken || ''),
    'process.env.DropboxClientId': JSON.stringify(process.env.DropboxClientId || ''),
    'process.env.MapboxExportToken': JSON.stringify(process.env.MapboxExportToken || ''),
    'process.env.CartoClientId': JSON.stringify(process.env.CartoClientId || ''),
    'process.env.FoursquareClientId': JSON.stringify(process.env.FoursquareClientId || ''),
    'process.env.FoursquareDomain': JSON.stringify(process.env.FoursquareDomain || ''),
    'process.env.FoursquareAPIURL': JSON.stringify(process.env.FoursquareAPIURL || ''),
    'process.env.FoursquareUserMapsURL': JSON.stringify(process.env.FoursquareUserMapsURL || ''),
    'process.env.OpenAIToken': JSON.stringify(process.env.OpenAIToken || ''),
    'process.env.NODE_DEBUG': JSON.stringify(false)
  },
  resolve: {
    // Dedupe forces all nested copies of these packages (e.g. the one inside
    // @kepler.gl/layers/node_modules/) to resolve to the single root-level
    // version, which is then pre-bundled by esbuild below.
    dedupe: ['styled-components', 'react', 'react-dom', ...nodePolyfillDeps, 'thrift']
  },
  optimizeDeps: {
    // parquet-wasm contains native WASM that esbuild cannot inline;
    // @loaders.gl/parquet has a hard dependency on it so exclude both from
    // pre-bundling. apache-arrow is pure JS and is moved to `include` so
    // the @kepler.gl/* CJS packages can require() its subpaths safely.
    // The pure-CJS deps of the excluded parquet package are covered by
    // `loadersCjsDeps` above.
    exclude: ['parquet-wasm', '@loaders.gl/parquet'],
    include: [...keplerPackages, 'apache-arrow', ...loadersCjsDeps, ...nodePolyfillDeps],
    esbuildOptions: {
      target: 'es2020'
    }
  }
});
