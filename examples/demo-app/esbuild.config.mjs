// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import esbuild from 'esbuild';
import {replace} from 'esbuild-plugin-replace';
import {dotenvRun} from '@dotenv-run/esbuild';

import process from 'node:process';
import fs from 'node:fs';
import {execSync, spawn} from 'node:child_process';
import {join} from 'node:path';
import {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import KeplerPackage from '../../package.json' assert {type: 'json'};

const __dirname = dirname(fileURLToPath(import.meta.url));

const args = process.argv;

const BASE_NODE_MODULES_DIR = './node_modules';

const LIB_DIR = '../../';
const NODE_MODULES_DIR = join(LIB_DIR, 'node_modules');
const SRC_DIR = join(LIB_DIR, 'src');

// For debugging deck.gl, load deck.gl from external deck.gl directory
const EXTERNAL_DECK_SRC = join(LIB_DIR, 'deck.gl');

// For debugging loaders.gl, load loaders.gl from external loaders.gl directory
const EXTERNAL_LOADERS_SRC = join(LIB_DIR, 'loaders.gl');

const port = 8080;

/**
 * Run the demo against the local kepler.gl source tree instead of the published
 * `@kepler.gl/*` packages in examples/demo-app/node_modules (which shadow the
 * root workspace symlinks and would leave core changes — e.g. the
 * `UPDATE_DATASET` action/reducer — invisible to the bundle). Mirrors the
 * existing `--env.deck_src` / `--env.loaders_src` flags; applied in both the
 * `--start` and `--build` paths. `@kepler.gl/types` is types-only (imports are
 * elided by esbuild) and intentionally excluded.
 */
const KEPLER_SRC_ALIASES = Object.fromEntries(
  [
    'actions',
    'cloud-providers',
    'common-utils',
    'components',
    'constants',
    'duckdb',
    'layers',
    'localization',
    'mcp',
    'processors',
    'reducers',
    'schemas',
    'styles',
    'table',
    'utils'
  ].map(pkg => [`@kepler.gl/${pkg}`, join(SRC_DIR, pkg, 'src', 'index.ts')])
);

const getKeplerAliases = () => ({
  ...KEPLER_SRC_ALIASES,
  // duckdb ships a components subpath (SqlPanel); esbuild picks the longest
  // matching alias key, so this wins for `@kepler.gl/duckdb/components`.
  '@kepler.gl/duckdb/components': join(SRC_DIR, 'duckdb', 'src', 'components', 'index.tsx')
});

/**
 * The local kepler src is built against the workspace's deck.gl 9 / luma 9 /
 * math.gl 4 / probe.gl stack in the ROOT node_modules, but the demo-app's own
 * node_modules carries older versions (deck.gl 8 / luma.gl 8). Point every
 * scoped module of those stacks at the root `src/` so the bundled kepler src
 * sees the versions it was written against — deck/luma in particular must be a
 * single instance shared with the rest of the bundle. Mirrors the existing
 * `--env.deck` aliases but applies in every mode (kepler src is now always
 * bundled). Scopes absent from root are left to normal resolution.
 *
 * `@loaders.gl` is deliberately NOT aliased: kepler src (3.3) needs loaders 4.4
 * while the demo's own `src/actions.js` still uses 4.3-era names
 * (`ParquetWasmLoader`, `_GeoJSONLoader`) that 4.4 renamed. esbuild resolves
 * per-importing-file, so leaving the scope alone gives each tree its own copy —
 * kepler src files walk up from /kepler.gl/src to root's 4.4, demo files to the
 * demo's 4.3. The two copies are independent (no shared module state), so this
 * is safe, unlike deck/luma which must not be duplicated.
 */
const getLocalSourceStackAliases = () => {
  const aliases = {};
  ['@deck.gl', '@luma.gl', '@math.gl', '@probe.gl'].forEach(scope => {
    const scopeDir = join(NODE_MODULES_DIR, scope);
    let items;
    try {
      items = fs.readdirSync(scopeDir);
    } catch {
      return; // not installed at root — keep node resolution
    }
    items.forEach(mdl => {
      aliases[`${scope}/${mdl}`] = join(scopeDir, mdl, 'src');
    });
  });
  return aliases;
};

const getThirdPartyLibraryAliases = useKeplerNodePackage => {
  const nodeModulesDir = useKeplerNodePackage ? NODE_MODULES_DIR : BASE_NODE_MODULES_DIR;

  const localSources = useKeplerNodePackage
    ? {
        // Suppress useless warnings from react-date-picker's dep
        'tiny-warning': `${SRC_DIR}/utils/src/noop.ts`
      }
    : {};

  return {
    ...getKeplerAliases(),
    ...getLocalSourceStackAliases(),
    ...localSources,
    react: `${nodeModulesDir}/react`,
    'react-dom': `${nodeModulesDir}/react-dom`,
    'react-dom/client': `${nodeModulesDir}/react-dom/client`,
    'react-redux': `${nodeModulesDir}/react-redux`,
    'styled-components': `${nodeModulesDir}/styled-components`,
    'react-intl': `${nodeModulesDir}/react-intl`,
    'react-palm': `${nodeModulesDir}/react-palm`,
    // kepler.gl and loaders.gl need to use same apache-arrow
    'apache-arrow': `${nodeModulesDir}/apache-arrow`
  };
};

const getProductionReactAliases = nodeModulesDir => ({
  react: `${nodeModulesDir}/react/cjs/react.production.js`,
  'react/jsx-runtime': `${nodeModulesDir}/react/cjs/react-jsx-runtime.production.js`,
  'react-dom': `${nodeModulesDir}/react-dom/cjs/react-dom.production.js`,
  'react-dom/client': `${nodeModulesDir}/react-dom/cjs/react-dom-client.production.js`
});

// Env variables required for demo app
const requiredEnvVariables = [
  'MapboxAccessToken',
  'DropboxClientId',
  'MapboxExportToken',
  'CartoClientId',
  'FoursquareClientId',
  'FoursquareDomain',
  'FoursquareAPIURL',
  'FoursquareUserMapsURL'
];

/**
 * Check for all required env variables to be present
 */
const checkEnvVariables = () => {
  const missingVars = requiredEnvVariables.filter(key => !process.env[key]);

  if (missingVars.length > 0) {
    console.warn(`⚠️  Warning: Missing environment variables: ${missingVars.join(', ')}`);
  } else {
    console.log('✅ All required environment variables are set.');
  }
};

const NODE_ENV = JSON.stringify(process.env.NODE_ENV || 'production');
const config = {
  platform: 'browser',
  format: 'iife',
  logLevel: 'info',
  // Silence noisy warnings from prebuilt third-party deps (e.g. @deck.gl-community
  // editable-layers ships files with a Preact `@jsxImportSource` pragma).
  logOverride: {
    'unsupported-jsx-comment': 'silent'
  },
  inject: ['src/react19-shim.js'],
  loader: {
    '.js': 'jsx',
    '.css': 'css',
    '.md': 'text',
    '.ttf': 'file',
    '.woff': 'file',
    '.woff2': 'file'
  },
  entryPoints: ['src/main.js'],
  outfile: 'dist/bundle.js',
  bundle: true,
  define: {
    NODE_ENV,
    // Define process.env variables for browser environment
    'process.env.MapboxAccessToken': JSON.stringify(process.env.MapboxAccessToken || ''),
    'process.env.DropboxClientId': JSON.stringify(process.env.DropboxClientId || ''),
    'process.env.MapboxExportToken': JSON.stringify(process.env.MapboxExportToken || ''),
    'process.env.CartoClientId': JSON.stringify(process.env.CartoClientId || ''),
    'process.env.FoursquareClientId': JSON.stringify(process.env.FoursquareClientId || ''),
    'process.env.FoursquareDomain': JSON.stringify(process.env.FoursquareDomain || ''),
    'process.env.FoursquareAPIURL': JSON.stringify(process.env.FoursquareAPIURL || ''),
    'process.env.FoursquareUserMapsURL': JSON.stringify(process.env.FoursquareUserMapsURL || ''),
    'process.env.GoogleDriveClientId': JSON.stringify(process.env.GoogleDriveClientId || ''),
    'process.env.NODE_ENV': NODE_ENV
  },
  plugins: [
    dotenvRun({
      verbose: true,
      environment: NODE_ENV,
      root: '../../.env'
    }),
    // automatically injected kepler.gl package version into the bundle
    replace({
      __PACKAGE_VERSION__: KeplerPackage.version,
      include: /constants\/src\/default-settings\.ts/
    }),
    // Resolve monaco-editor subpath imports (missing .js extension) used by @sqlrooms packages
    {
      name: 'resolve-monaco-editor',
      setup(build) {
        build.onResolve({filter: /^monaco-editor\/esm\//}, args => {
          if (args.path.endsWith('.js') || args.path.endsWith('.css')) return null;
          const subpath = args.path + '.js';
          const resolved = join(process.cwd(), BASE_NODE_MODULES_DIR, subpath);
          return {path: resolved};
        });
      }
    },
    // Resolve @sqlrooms/ai-core internal component imports that bypass the package exports map
    {
      name: 'resolve-sqlrooms-ai-core-internals',
      setup(build) {
        build.onResolve({filter: /^@sqlrooms\/ai-core\/components\//}, args => {
          const subpath =
            args.path.replace(
              '@sqlrooms/ai-core/components/',
              '@sqlrooms/ai-core/dist/components/'
            ) + '.js';
          const resolved = join(process.cwd(), BASE_NODE_MODULES_DIR, subpath);
          return {path: resolved};
        });
      }
    },
    // styled-components: @hubble.gl/react nests its own copy.
    // react-palm: several @kepler.gl/* packages nest their own copy.
    // @sqlrooms/room-store: RoomStateProvider is a React context. Nested
    // copies each have their own context, so AI Settings throws
    // "Missing RoomStateProvider in the tree" and unmounts the app.
    // Do not blanket-match `@sqlrooms/*` — nested packages like
    // `@sqlrooms/db` are not installed at the demo-app root.
    {
      name: 'dedupe-singletons',
      setup(build) {
        build.onResolve(
          {filter: /^(styled-components|react-palm(\/|$)|react$|react-dom$|@sqlrooms\/room-store$)/},
          async args => {
            if (args.pluginData?.deduped) return;
            const result = await build.resolve(args.path, {
              resolveDir: __dirname,
              kind: args.kind,
              pluginData: {deduped: true}
            });
            return result;
          }
        );
      }
    }
  ]
};

// Force @luma.gl/* and @deck.gl/* to the root monorepo node_modules.
// The demo-app may install newer patch versions, but kepler.gl was built
// and tested against the root versions (luma.gl 9.3.2 / deck.gl 9.3.1).
// NOT added to config.plugins directly — it is injected conditionally so
// that --env.deck / --env.deck_src modes (which alias deck.gl to a local
// source tree) are not overridden.
const dedupeWebglPlugin = {
  name: 'dedupe-webgl',
  setup(build) {
    build.onResolve({filter: /^(@luma\.gl\/|@deck\.gl\/)/}, async args => {
      if (args.pluginData?.deduped) return;
      const result = await build.resolve(args.path, {
        resolveDir: NODE_MODULES_DIR,
        kind: args.kind,
        pluginData: {deduped: true}
      });
      return result;
    });
  }
};

function addAliases(externals, args) {
  const resolveAlias = getThirdPartyLibraryAliases(true);

  // Combine flags
  const useLocalDeck = args.includes('--env.deck');
  const useRepoDeck = args.includes('--env.deck_src');

  // resolve deck.gl from local dir
  if (useLocalDeck || useRepoDeck) {
    // Load deck.gl from root node_modules
    // if env.deck_src Load deck.gl from deck.gl/modules/main/src folder parallel to kepler.gl
    resolveAlias['deck.gl'] = useLocalDeck
      ? `${NODE_MODULES_DIR}/deck.gl/src`
      : `${EXTERNAL_DECK_SRC}/modules/main/src`;

    // if env.deck Load @deck.gl modules from root node_modules/@deck.gl
    // if env.deck_src Load @deck.gl modules from  deck.gl/modules folder parallel to kepler.gl
    externals['deck.gl'].forEach(mdl => {
      resolveAlias[`@deck.gl/${mdl}`] = useLocalDeck
        ? `${NODE_MODULES_DIR}/@deck.gl/${mdl}/src`
        : `${EXTERNAL_DECK_SRC}/modules/${mdl}/src`;
      // types are stored in different directory
      resolveAlias[`@deck.gl/${mdl}/typed`] = useLocalDeck
        ? `${NODE_MODULES_DIR}/@deck.gl/${mdl}/typed`
        : `${EXTERNAL_DECK_SRC}/modules/${mdl}/src/types`;
    });

    ['luma.gl', 'probe.gl', 'loaders.gl'].forEach(name => {
      // if env.deck Load ${name} from root node_modules
      // if env.deck_src Load ${name} from deck.gl/node_modules folder parallel to kepler.gl
      resolveAlias[name] = useLocalDeck
        ? `${NODE_MODULES_DIR}/${name}/src`
        : name === 'probe.gl'
        ? `${EXTERNAL_DECK_SRC}/node_modules/${name}/src`
        : `${EXTERNAL_DECK_SRC}/node_modules/@${name}/core/src`;

      // if env.deck Load @${name} modules from root node_modules/@${name}
      // if env.deck_src Load @${name} modules from deck.gl/node_modules/@${name} folder parallel to kepler.gl`
      externals[name].forEach(mdl => {
        resolveAlias[`@${name}/${mdl}`] = useLocalDeck
          ? `${NODE_MODULES_DIR}/@${name}/${mdl}/src`
          : `${EXTERNAL_DECK_SRC}/node_modules/@${name}/${mdl}/src`;
      });
    });
  }

  if (args.includes('--env.loaders_src')) {
    externals['loaders.gl'].forEach(mdl => {
      resolveAlias[`@loaders.gl/${mdl}`] = `${EXTERNAL_LOADERS_SRC}/modules/${mdl}/src`;
    });
  }

  return resolveAlias;
}

function openURL(url) {
  // Could potentially be replaced by https://www.npmjs.com/package/open, it was throwing an error when tried last
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
  // local dev

  const modules = ['@deck.gl', '@loaders.gl', '@luma.gl', '@probe.gl'];
  const loadAllDirs = modules.map(
    dir =>
      new Promise(success => {
        fs.readdir(join(NODE_MODULES_DIR, dir), (err, items) => {
          if (err) {
            const colorRed = '\x1b[31m';
            const colorReset = '\x1b[0m';
            console.log(
              `${colorRed}%s${colorReset}`,
              `Cannot find ${dir} in node_modules, make sure it is installed. ${err}`
            );

            success(null);
          }
          success(items);
        });
      })
  );

  const externals = await Promise.all(loadAllDirs).then(results => ({
    'deck.gl': results[0],
    'loaders.gl': results[1],
    'luma.gl': results[2],
    'probe.gl': results[3]
  }));

  const localAliases = addAliases(externals, args);

  if (args.includes('--build')) {
    // Generate the Tailwind stylesheet for the production build. The dev
    // (`--start`) path starts a watcher, but `--build` never ran Tailwind, so
    // dist/tailwind.css (referenced by dist/index.html) only ever existed when
    // a dev session had produced it. On a clean build (e.g. Netlify) it was
    // missing and the @sqlrooms UI — including the Radix dropdown/dialog
    // popups portaled to <body> — shipped unstyled.
    console.log('⚡ Building Tailwind CSS...');
    execSync(
      './node_modules/.bin/tailwindcss -i src/styles.css -o dist/tailwind.css --minify',
      {stdio: 'inherit'}
    );

    await esbuild
      .build({
        ...config,
        minify: true,
        sourcemap: false,
        // Add alias resolution for build
        alias: {
          ...getThirdPartyLibraryAliases(true)
        },
        // Add these production optimizations
        define: {
          ...config.define,
          'process.env.NODE_ENV': '"production"'
        },
        drop: ['console', 'debugger'],
        treeShaking: true,
        metafile: true,
        // Optionally generate a bundle analysis
        plugins: [
          ...config.plugins,
          dedupeWebglPlugin,
          {
            name: 'bundle-analyzer',
            setup(build) {
              build.onEnd(result => {
                if (result.metafile) {
                  // Write bundle analysis to disk
                  fs.writeFileSync('meta.json', JSON.stringify(result.metafile));
                }
              });
            }
          }
        ]
      })
      .catch(e => {
        console.error(e);
        process.exit(1);
      })
      .then(() => {
        checkEnvVariables();
      });
  }

  if (args.includes('--start')) {
    const isLocal = process.env.NODE_ENV === 'local';
    const baseAliases = isLocal ? localAliases : getThirdPartyLibraryAliases(false);
    const nodeModulesDir = isLocal ? NODE_MODULES_DIR : BASE_NODE_MODULES_DIR;
    // Skip dedupe-webgl when a local deck.gl source override is active so that
    // --env.deck / --env.deck_src aliases are not overridden by the plugin.
    const useDeckOverride = args.includes('--env.deck') || args.includes('--env.deck_src');

    // Start Tailwind CSS watcher for sqlrooms UI components
    spawn(
      './node_modules/.bin/tailwindcss',
      ['-i', 'src/styles.css', '-o', 'dist/tailwind.css', '--watch'],
      {
        stdio: 'inherit'
      }
    );

    await esbuild
      .context({
        ...config,
        plugins: [
          ...config.plugins,
          ...(useDeckOverride ? [] : [dedupeWebglPlugin])
        ],
        minify: false,
        sourcemap: true,
        alias: {
          ...baseAliases,
          ...(!isLocal ? getProductionReactAliases(nodeModulesDir) : {})
        },
        banner: {
          js: `new EventSource('/esbuild').addEventListener('change', () => location.reload());`
        }
      })
      .then(async ctx => {
        checkEnvVariables();

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
