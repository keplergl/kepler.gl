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

// Normalize the ESM/CJS interop for every `@turf/*` module.
//
// @deck.gl-community/editable-layers@9.3.8 mixes default and named imports of
// turf v7 modules (e.g. `import { rewind } from '@turf/rewind'` and
// `import bboxPolygon from '@turf/bbox-polygon'`). The turf v7 CJS builds ship
// as bare `module.exports = fn` (no named properties), so esbuild's ESM<->CJS
// interop leaves named imports like `import_rewind.rewind` undefined. Callers
// then get `(0, import_rewind.rewind)(...)` → TypeError: ... is not a function.
//
// This plugin intercepts every `@turf/*` specifier, requires turf's real CJS
// build, and re-exports it so that:
//   - Single-function modules: `module.exports = fn`, `fn.default = fn`, and
//     `fn[moduleName] = fn` so both default and named imports resolve to fn.
//   - Multi-export utilities (e.g. @turf/helpers): all named exports preserved
//     and `.default` set to the module object.
const require = createRequire(import.meta.url);
const turfInteropNamespace = 'turf-interop-shim';
const turfInteropPlugin = {
  name: 'turf-interop',
  setup(build) {
    build.onResolve({filter: /^@turf\//}, resolveArgs => {
      // Don't re-process the require inside our own generated shim.
      if (resolveArgs.namespace === turfInteropNamespace) return undefined;
      return {path: resolveArgs.path, namespace: turfInteropNamespace};
    });

    build.onLoad({filter: /.*/, namespace: turfInteropNamespace}, loadArgs => {
      // Resolve the package's real entry from the project (bypasses our resolver).
      const realEntry = require.resolve(loadArgs.path).replace(/\\/g, '/');
      // Derive the function name from the package path: '@turf/rewind' → 'rewind'
      const moduleName = loadArgs.path.split('/').pop();
      return {
        contents: `
          const mod = require(${JSON.stringify(realEntry)});
          const def = typeof mod.default !== 'undefined'
            ? mod.default
            : (typeof mod === 'function' ? mod : undefined);

          if (typeof def === 'function') {
            // Single-function turf module. Make module.exports the function
            // itself so a consumer's default import resolves to it directly
            // (avoids esbuild's ESM/CJS double-wrapping). Attach named exports
            // as properties so \`import {x}\`/\`.x\` access still works.
            const fn = def;
            for (const key of Object.keys(mod)) {
              if (key !== 'default') fn[key] = mod[key];
            }
            fn.default = fn;
            // Also expose the function under the module's own name so that
            // named imports like \`import { rewind } from '@turf/rewind'\` work
            // even when the CJS build only does \`module.exports = fn\` without
            // attaching a same-named property.
            const funcName = ${JSON.stringify(moduleName)};
            if (funcName && typeof fn[funcName] !== 'function') {
              fn[funcName] = fn;
            }
            module.exports = fn;
          } else {
            // Multi-export util module (e.g. @turf/helpers): keep every named
            // export and provide the object itself as the default.
            for (const key of Object.keys(mod)) {
              if (key !== 'default') module.exports[key] = mod[key];
            }
            module.exports.default = mod.default !== undefined ? mod.default : module.exports;
          }
        `,
        loader: 'js',
        resolveDir: __dirname
      };
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
  plugins: [
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
