// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import esbuild from 'esbuild';
import copyPlugin from 'esbuild-plugin-copy';
import process from 'node:process';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {spawn} from 'node:child_process';

const args = process.argv;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const port = 8080;

// @turf/rewind ships as `module.exports = fn` (no named export), but
// @deck.gl-community/editable-layers uses `import { rewind } from '@turf/rewind'`.
// This shim patches the single missing property so the named import resolves.
// Remove once @turf/rewind adds a proper `exports` field.
const require = createRequire(import.meta.url);
const turfRewindPath = require.resolve('@turf/rewind').replace(/\\/g, '/');
const turfInteropPlugin = {
  name: 'turf-rewind-interop',
  setup(build) {
    build.onResolve({filter: /^@turf\/rewind$/}, () => ({path: turfRewindPath, namespace: 'turf-rewind'}));
    build.onLoad({filter: /.*/, namespace: 'turf-rewind'}, () => ({
      contents: `const fn = require(${JSON.stringify(turfRewindPath)}); fn.rewind = fn; module.exports = fn;`,
      loader: 'js',
      resolveDir: __dirname
    }));
  }
};

// @hubble.gl/react was compiled with esbuild targeting Node, using isNodeMode=1 in
// its __toESM helper. With isNodeMode=1, __toESM ALWAYS sets .default to the entire
// require() result regardless of the module's __esModule flag:
//
//   var import_react_map_gl = __toESM(require("react-map-gl"), 1)
//   → import_react_map_gl.default = entire_exports_object   ← "got: object"
//
// This was fine when react-map-gl/7 and @deck.gl/react shipped
// `module.exports = TheComponent` directly; modern versions wrap everything:
// `module.exports = __toCommonJS({Map, ...})`.
//
// @hubble.gl/react also has its own nested node_modules/react-map-gl@7.1.9 which
// esbuild would find first. Intercepting both bare specifiers at the esbuild level
// and injecting a CJS shim ensures __toESM(require("pkg"), 1).default === Comp ✓
const reactMapGlCjsPath = require.resolve('react-map-gl/mapbox');
const deckGlReactCjsPath = require.resolve('@deck.gl/react');

function makeHubbleInteropShim(getComponent, cjsPath) {
  return [
    '"use strict";',
    `const _m = require(${JSON.stringify(cjsPath)});`,
    `const Comp = ${getComponent};`,
    // Copy all named exports onto Comp so useControl, DeckGL etc. remain accessible.
    'Object.assign(Comp, _m);',
    // Ensure Comp.default === Comp so _interopRequireDefault also works.
    'Comp.default = Comp;',
    // module.exports = Comp → __commonJS wrapper returns Comp directly,
    // so __toESM(require("pkg"), isNodeMode=1).default === Comp (a React forwardRef).
    'module.exports = Comp;'
  ].join('\n');
}

const hubbleGlInteropPlugin = {
  name: 'hubble-gl-cjs-interop',
  setup(build) {
    build.onResolve({filter: /^react-map-gl$/}, () => ({
      path: 'react-map-gl-shim',
      namespace: 'hubble-gl-interop'
    }));
    // Also intercept @deck.gl/react before the dedupe-deck-luma plugin sees it;
    // the shim already points to the locally-installed 9.3.7 copy.
    build.onResolve({filter: /^@deck\.gl\/react$/}, () => ({
      path: 'deck-gl-react-shim',
      namespace: 'hubble-gl-interop'
    }));
    build.onLoad({filter: /.*/, namespace: 'hubble-gl-interop'}, args => {
      if (args.path === 'react-map-gl-shim') {
        return {
          contents: makeHubbleInteropShim('_m.Map', reactMapGlCjsPath),
          loader: 'js',
          resolveDir: __dirname
        };
      }
      if (args.path === 'deck-gl-react-shim') {
        return {
          contents: makeHubbleInteropShim('_m.DeckGL', deckGlReactCjsPath),
          loader: 'js',
          resolveDir: __dirname
        };
      }
    });
  }
};

const config = {
  platform: 'browser',
  format: 'iife',
  logLevel: 'info',
  loader: {'.js': 'jsx', '.css': 'css'},
  entryPoints: ['src/app.tsx'],
  outfile: 'dist/bundle.js',
  bundle: true,
  define: {
    NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'production'),
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
  // Force every @deck.gl/*, @luma.gl/* and @math.gl/* import — regardless of which
  // node_modules directory it is resolved from — to use the single copy installed in
  // this example's own node_modules. Without this, packages resolved from the monorepo
  // root (e.g. @deck.gl/mapbox) pull in the older root-level @deck.gl/core@9.3.1,
  // triggering the "multiple versions detected" warning and the luma.gl double-init
  // WebGL-debug-mode penalty.
  //
  // Note: esbuild's `alias` option does raw string substitution and does NOT consult
  // the target package's `exports` field for subpath resolution, so it cannot be used
  // here (e.g. `@luma.gl/webgl/constants` → `<dir>/constants` fails). Instead we use
  // an esbuild resolver plugin that re-resolves the specifier from __dirname so that
  // Node resolution always picks up the local node_modules copy.
  plugins: [
    hubbleGlInteropPlugin,
    {
      name: 'dedupe-deck-luma',
      setup(build) {
        // Re-resolve any @deck.gl/*, @luma.gl/*, @math.gl/*, styled-components,
        // react, and react-dom import from the example root so that Node's resolution
        // always lands in this example's own node_modules (single instance per package).
        // esbuild automatically skips the current plugin for the nested resolve()
        // call, preventing infinite recursion.
        build.onResolve({filter: /^(@(deck|luma|math)\.gl\/|styled-components$|react$|react-dom$)/}, async args => {
          // Explicit recursion guard: esbuild is supposed to skip the current plugin
          // for nested build.resolve() calls, but this ensures it even if it doesn't.
          if (args.pluginData?.deduped) return;
          const result = await build.resolve(args.path, {
            resolveDir: __dirname,
            kind: args.kind,
            pluginData: {deduped: true}
          });
          return result;
        });
      }
    },
    turfInteropPlugin,
    copyPlugin({
      resolveFrom: 'cwd',
      assets: {
        from: ['src/index.html'],
        to: ['dist']
      }
    })
  ]
};

function openURL(url) {
  const cmd = {
    darwin: ['open'],
    linux: ['xdg-open'],
    win32: ['cmd', '/c', 'start']
  };
  const command = cmd[process.platform];
  if (command) {
    spawn(command[0], [...command.slice(1), url]);
  }
}

(async () => {
  if (args.includes('--build')) {
    const result = await esbuild
      .build({
        ...config,

        minify: true,
        sourcemap: false,
        metafile: true
      })
      .catch(e => {
        console.error(e);
        process.exit(1);
      });
    fs.writeFileSync('dist/esbuild-metadata.json', JSON.stringify(result.metafile));
  }

  if (args.includes('--start')) {
    await esbuild
      .context({
        ...config,
        minify: false,
        sourcemap: true,
        banner: {
          js: `new EventSource('/esbuild').addEventListener('change', () => location.reload());`
        }
      })
      .then(async ctx => {
        await ctx.watch();
        await ctx.serve({
          servedir: 'dist',
          port,
          fallback: 'dist/index.html',
          onRequest: ({remoteAddress, method, path, status, timeInMS}) => {
            console.info(remoteAddress, status, `"${method} ${path}" [${timeInMS}ms]`);
          }
        });
        console.info(
          `kepler.gl demo app running at ${`http://localhost:${port}`}, press Ctrl+C to stop`
        );
        openURL(`http://localhost:${port}`);
      })
      .catch(e => {
        console.error(e);
        process.exit(1);
      });
  }
})();
