// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import wasm from 'vite-plugin-wasm';
import {resolve, dirname} from 'path';
import {fileURLToPath} from 'url';
import {readdirSync} from 'fs';

const _dirname = dirname(fileURLToPath(import.meta.url));
const SRC_DIR = resolve(_dirname, '../../src');
const useLocalKepler = process.env.USE_LOCAL_KEPLER === 'true';

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

const keplerPackages = [
  '@kepler.gl/actions',
  '@kepler.gl/cloud-providers',
  '@kepler.gl/common-utils',
  '@kepler.gl/components',
  '@kepler.gl/constants',
  '@kepler.gl/deckgl-arrow-layers',
  '@kepler.gl/deckgl-layers',
  '@kepler.gl/duckdb',
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

const nodePolyfillDeps = ['buffer', 'base64-js', 'ieee754'];

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

function localKeplerAliases(): Record<string, string> {
  if (!useLocalKepler) return {};

  const aliases: Record<string, string> = {};
  for (const dir of readdirSync(SRC_DIR)) {
    aliases[`@kepler.gl/${dir}`] = resolve(SRC_DIR, dir, 'src');
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
    dedupe: [
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
      'thrift',
      ...nodePolyfillDeps
    ]
  },
  optimizeDeps: {
    exclude: ['parquet-wasm', '@loaders.gl/parquet'],
    // When aliasing to monorepo sources, do not prebundle those packages.
    include: useLocalKepler
      ? ['apache-arrow', ...loadersCjsDeps, ...nodePolyfillDeps]
      : [...keplerPackages, 'apache-arrow', ...loadersCjsDeps, ...nodePolyfillDeps],
    esbuildOptions: {
      target: 'es2020'
    }
  }
});
