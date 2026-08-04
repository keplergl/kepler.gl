// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import wasm from 'vite-plugin-wasm';
import {resolve, dirname} from 'path';
import {fileURLToPath} from 'url';

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

// @hubble.gl/react now ships proper ESM (no longer compiled with isNodeMode=1).
// The old CJS shim for react-map-gl and @deck.gl/react is no longer needed and
// was causing a double-init of luma.gl: the shim used require() which pulled in
// the CJS chain (@deck.gl/core -> @luma.gl/* CJS) while kepler.gl ESM pulled in
// the ESM luma.gl, resulting in two separate Luma class instances in the bundle.

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
    // Dedupe forces every import of these packages — no matter how deeply
    // nested or which ancestor directory a require() starts from — to resolve
    // to the single copy installed in examples/get-started-vite/node_modules/.
    //
    // Without this, packages that rely on peer-dep resolution (e.g.
    // @deck.gl-community/editable-layers) can walk up past the example dir
    // into the monorepo root node_modules, loading @deck.gl/core@9.3.1 there
    // instead of the example's @deck.gl/core@9.3.7, triggering the
    // "multiple versions detected" error and the luma.gl double-init warning.
    dedupe: [
      'styled-components',
      'react',
      'react-dom',
      '@luma.gl/constants',
      '@luma.gl/core',
      '@luma.gl/effects',
      '@luma.gl/engine',
      '@luma.gl/gltf',
      '@luma.gl/shadertools',
      '@luma.gl/webgl',
      '@deck.gl/aggregation-layers',
      '@deck.gl/core',
      '@deck.gl/extensions',
      '@deck.gl/geo-layers',
      '@deck.gl/layers',
      '@deck.gl/mapbox',
      '@deck.gl/mesh-layers',
      '@deck.gl/react',
      '@deck.gl/widgets',
      '@math.gl/core',
      '@math.gl/culling',
      '@math.gl/geospatial',
      '@math.gl/polygon',
      '@math.gl/sun',
      '@math.gl/types',
      '@math.gl/web-mercator',
      '@hubble.gl/core',
      '@hubble.gl/react',
      'thrift',
      ...nodePolyfillDeps
    ]
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
