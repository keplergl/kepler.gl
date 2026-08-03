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

// @kepler.gl/deckgl-layers@3.3.0-alpha.5 contains a Babel compilation bug in
// globe-view.js: `(super.applyConstraints as any)(props)` was compiled to a
// property-GET (_superPropGet with r=1) followed by a plain call, losing the
// `this` binding and causing `TypeError: Cannot read properties of undefined
// (reading '_constrainZoom')` when globe mode is activated.
// The correct form is a method-CALL (_superPropGet with r=2) that wraps the
// invocation in `p.apply(this, args)`.
// Fixed in source at src/deckgl-layers/src/globe/globe-view.ts; patch the
// installed compiled file here until a new release is published.
const GLOBE_VIEW_BUGGY = '_superPropGet(PatchedGlobeState, "applyConstraints", this, 1)(props)';
const GLOBE_VIEW_FIXED = '_superPropGet(PatchedGlobeState, "applyConstraints", this, 3)([props])';

// Vite plugin: applied during production Rollup build and Vite's transform step.
const globeViewPatchPlugin = {
  name: 'globe-view-patch',
  transform(code: string, id: string) {
    if (!id.includes('globe-view') || !code.includes(GLOBE_VIEW_BUGGY)) return null;
    return {code: code.replace(GLOBE_VIEW_BUGGY, GLOBE_VIEW_FIXED), map: null};
  }
};

// esbuild plugin: applied during optimizeDeps pre-bundling (dev mode).
const globeViewPatchEsbuildPlugin = {
  name: 'globe-view-patch',
  setup(build: any) {
    build.onLoad({filter: /globe-view\.js$/}, async (args: any) => {
      const {readFile} = await import('fs/promises');
      const source = await readFile(args.path, 'utf8');
      if (!source.includes(GLOBE_VIEW_BUGGY)) return null;
      return {contents: source.replace(GLOBE_VIEW_BUGGY, GLOBE_VIEW_FIXED), loader: 'js'};
    });
  }
};

// @kepler.gl/components@3.3.0-alpha.5 hardcodes `deviceProps` on the video export
// preview Deck instances without opting out of luma.gl's debug device. luma turns
// `debug` on whenever NODE_ENV !== 'production' (which Vite sets during `vite dev`)
// and then wraps every render pass in a TIME_ELAPSED_EXT timer query. WebGL2 allows
// only one such query at a time and globe export issues several passes per frame,
// so the debug context throws INVALID_OPERATION and the export modal crashes.
// These Deck instances are created inside the modal, so unlike the map's Deck they
// can't be reached through KeplerGl's `deckGlProps`.
// Fixed in source at src/components/src/modals/hubble-utils.ts; patch the installed
// compiled files here until a new release is published.
const EXPORT_PREVIEW_FILE = /(globe|swipe)-export-video-preview\.js$/;

function patchExportDeviceProps(code: string): string | null {
  const patched = code.replace(
    /deviceProps:\s*\{\s*type:\s*'webgl',/g,
    "deviceProps: {debug: false, type: 'webgl',"
  );
  return patched === code ? null : patched;
}

const exportDeviceDebugPatchPlugin = {
  name: 'export-device-debug-patch',
  transform(code: string, id: string) {
    if (!EXPORT_PREVIEW_FILE.test(id)) return null;
    const patched = patchExportDeviceProps(code);
    return patched ? {code: patched, map: null} : null;
  }
};

const exportDeviceDebugPatchEsbuildPlugin = {
  name: 'export-device-debug-patch',
  setup(build: any) {
    build.onLoad({filter: EXPORT_PREVIEW_FILE}, async (args: any) => {
      const {readFile} = await import('fs/promises');
      const source = await readFile(args.path, 'utf8');
      const patched = patchExportDeviceProps(source);
      return patched ? {contents: patched, loader: 'js'} : null;
    });
  }
};

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

// @hubble.gl/react was compiled with esbuild targeting Node, using isNodeMode=1 in
// its __toESM helper. With isNodeMode=1, __toESM ALWAYS sets .default to the entire
// require() result regardless of the module's __esModule flag:
//
//   var import_react_map_gl = __toESM(require("react-map-gl"), 1)
//   → import_react_map_gl.default = entire_exports_object   ← "got: object"
//
// This was fine when react-map-gl/7 and @deck.gl/react/8 each did
// `module.exports = TheComponent` (the require result was the component directly).
// Modern versions wrap everything: `module.exports = __toCommonJS({Map, ...})`.
//
// Vite plugins (resolveId/load) are NOT invoked for nested node_modules during
// esbuild pre-bundling. @hubble.gl/react has its own node_modules/react-map-gl@7.1.9,
// so the Vite plugin chain is bypassed for that resolution entirely.
//
// Fix: use a native esbuild plugin (optimizeDeps.esbuildOptions.plugins). These run
// inside esbuild itself and intercept every require() call, including from nested
// node_modules. The shim sets module.exports = <component> so that
// __toESM(require("pkg"), 1).default === <component>  ✓
const reactMapGlCjsPath = _require.resolve('react-map-gl/mapbox');
const deckGlReactCjsPath = _require.resolve('@deck.gl/react');

function makeHubbleInteropShim(getComponent: string, cjsPath: string): string {
  return [
    '"use strict";',
    `const _m = require(${JSON.stringify(cjsPath)});`,
    `const Comp = ${getComponent};`,
    // Copy all named exports onto Comp so useControl, DeckGL etc. remain accessible
    // as properties (for callers using import_pkg.useControl or import_pkg.DeckGL).
    'Object.assign(Comp, _m);',
    // Ensure Comp.default === Comp so _interopRequireDefault also works.
    'Comp.default = Comp;',
    // module.exports = Comp means __commonJS wrapper returns Comp directly,
    // so __toESM(require("pkg"), isNodeMode=1).default === Comp (a React forwardRef).
    'module.exports = Comp;'
  ].join('\n');
}

// This is an esbuild-level plugin, NOT a Vite plugin.
// It must be placed in optimizeDeps.esbuildOptions.plugins to run during pre-bundling.
const hubbleGlInteropEsbuildPlugin = {
  name: 'hubble-gl-cjs-interop',
  setup(build: any) {
    build.onResolve({filter: /^react-map-gl$/}, () => ({
      path: 'react-map-gl-shim',
      namespace: 'hubble-gl-interop'
    }));
    build.onResolve({filter: /^@deck\.gl\/react$/}, () => ({
      path: 'deck-gl-react-shim',
      namespace: 'hubble-gl-interop'
    }));
    build.onLoad({filter: /.*/, namespace: 'hubble-gl-interop'}, (args: any) => {
      if (args.path === 'react-map-gl-shim') {
        return {
          contents: makeHubbleInteropShim('_m.Map', reactMapGlCjsPath),
          loader: 'js',
          resolveDir: _dirname
        };
      }
      if (args.path === 'deck-gl-react-shim') {
        return {
          contents: makeHubbleInteropShim('_m.DeckGL', deckGlReactCjsPath),
          loader: 'js',
          resolveDir: _dirname
        };
      }
    });
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
  plugins: [globeViewPatchPlugin, exportDeviceDebugPatchPlugin, turfRewindPlugin, wasm(), react()],
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
      target: 'es2020',
      plugins: [
        globeViewPatchEsbuildPlugin,
        exportDeviceDebugPatchEsbuildPlugin,
        hubbleGlInteropEsbuildPlugin
      ]
    }
  }
});
