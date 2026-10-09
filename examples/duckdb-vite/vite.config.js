// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import wasm from 'vite-plugin-wasm';
import {resolve, dirname} from 'path';
import {fileURLToPath} from 'url';
import {readdirSync} from 'fs';
var _dirname = dirname(fileURLToPath(import.meta.url));
var SRC_DIR = resolve(_dirname, '../../src');
var useLocalKepler = process.env.USE_LOCAL_KEPLER === 'true';
// @turf/rewind ESM entry only has `export default rewind` (no named export), but
// @deck.gl-community/editable-layers uses `import { rewind } from '@turf/rewind'`.
// This plugin intercepts the import and injects a shim that re-exports the default
// as a named export. Remove once @turf/rewind ships a named export.
var turfRewindPlugin = {
  name: 'turf-rewind-interop',
  resolveId: function (id) {
    if (id === '@turf/rewind') return '\0turf-rewind-shim';
  },
  load: function (id) {
    if (id !== '\0turf-rewind-shim') return;
    var esmEntry = resolve(_dirname, 'node_modules/@turf/rewind/main.es.js');
    return 'import rewindFn from '.concat(
      JSON.stringify(esmEntry),
      ';\nexport const rewind = rewindFn;\nexport default rewindFn;\n'
    );
  }
};
var keplerPackages = [
  '@kepler.gl/actions',
  '@kepler.gl/cloud-providers',
  '@kepler.gl/common-utils',
  '@kepler.gl/components',
  '@kepler.gl/constants',
  '@kepler.gl/deckgl-arrow-layers',
  '@kepler.gl/deckgl-layers',
  '@kepler.gl/duckdb',
  '@kepler.gl/effects',
  '@kepler.gl/charts',
  '@kepler.gl/layers',
  '@kepler.gl/localization',
  '@kepler.gl/processors',
  '@kepler.gl/reducers',
  '@kepler.gl/schemas',
  '@kepler.gl/styles',
  '@kepler.gl/table',
  '@kepler.gl/tasks',
  '@kepler.gl/tasks-core',
  '@kepler.gl/utils'
];
var nodePolyfillDeps = ['buffer', 'base64-js', 'ieee754'];
var loadersCjsDeps = [
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
function localKeplerAliases() {
  if (!useLocalKepler) return {};
  var aliases = {};
  for (var _i = 0, _a = readdirSync(SRC_DIR); _i < _a.length; _i++) {
    var dir = _a[_i];
    aliases['@kepler.gl/'.concat(dir)] = resolve(SRC_DIR, dir, 'src');
  }
  // Subpath used by the DuckDB SQL panel in demo-app; keep ready for local work.
  aliases['@kepler.gl/duckdb/components'] = resolve(SRC_DIR, 'duckdb/src/components');
  aliases['@kepler.gl/duckdb/table'] = resolve(SRC_DIR, 'duckdb/src/table');
  return aliases;
}
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [turfRewindPlugin, wasm(), react()],
  server: {
    port: 8082,
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
    alias: localKeplerAliases(),
    dedupe: __spreadArray(
      [
        'styled-components',
        'react',
        'react-dom',
        'apache-arrow',
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
        'thrift'
      ],
      nodePolyfillDeps,
      true
    )
  },
  optimizeDeps: {
    exclude: ['parquet-wasm', '@loaders.gl/parquet'],
    // When aliasing to monorepo sources, do not prebundle those packages.
    include: useLocalKepler
      ? __spreadArray(__spreadArray(['apache-arrow'], loadersCjsDeps, true), nodePolyfillDeps, true)
      : __spreadArray(
          __spreadArray(
            __spreadArray(__spreadArray([], keplerPackages, true), ['apache-arrow'], false),
            loadersCjsDeps,
            true
          ),
          nodePolyfillDeps,
          true
        ),
    esbuildOptions: {
      target: 'es2020'
    }
  }
});
