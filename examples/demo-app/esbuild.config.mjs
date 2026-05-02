// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import esbuild from 'esbuild';
import {replace} from 'esbuild-plugin-replace';
import {dotenvRun} from '@dotenv-run/esbuild';

import process from 'node:process';
import fs from 'node:fs';
import {spawn} from 'node:child_process';
import {join, resolve} from 'node:path';
import KeplerPackage from '../../package.json' assert {type: 'json'};

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

const getThirdPartyLibraryAliases = useKeplerNodeModules => {
  const nodeModulesDir = useKeplerNodeModules ? NODE_MODULES_DIR : BASE_NODE_MODULES_DIR;

  const localSources = useKeplerNodeModules
    ? {
        // Suppress useless warnings from react-date-picker's dep
        'tiny-warning': `${SRC_DIR}/utils/src/noop.ts`
      }
    : {};

  return {
    ...localSources,
    react: `${nodeModulesDir}/react`,
    'react-dom': `${nodeModulesDir}/react-dom`,
    'react-redux': `${nodeModulesDir}/react-redux/lib`,
    'styled-components': `${nodeModulesDir}/styled-components`,
    'react-intl': `${nodeModulesDir}/react-intl`,
    'react-palm': `${nodeModulesDir}/react-palm`,
    // kepler.gl and loaders.gl need to use same apache-arrow
    'apache-arrow': `${nodeModulesDir}/apache-arrow`,
    // portal-linked @sqlrooms packages bundle their own copies of zustand/react;
    // force a single instance so React contexts (e.g. RoomStateProvider) are shared.
    zustand: resolve(`${BASE_NODE_MODULES_DIR}/zustand`)
  };
};

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
  loader: {
    '.js': 'jsx',
    '.css': 'css',
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
    'process.env.NODE_ENV': NODE_ENV
  },
  plugins: [
    {
      name: 'resolve-portal-imports',
      setup(build) {
        const demoNodeModules = resolve('node_modules');
        const portalDir = resolve('node_modules/openassistant2');
        const sqlroomsDir = resolve('node_modules/@sqlrooms');

        build.onResolve({filter: /./}, async args => {
          if (
            args.resolveDir &&
            !args.path.startsWith('.') &&
            !args.path.startsWith('/') &&
            args.pluginData !== 'portal-retry' &&
            (args.resolveDir.startsWith(portalDir) ||
              args.resolveDir.includes('/github/openassistant2'))
          ) {
            const result = await build.resolve(args.path, {
              kind: args.kind,
              resolveDir: demoNodeModules,
              pluginData: 'portal-retry'
            });
            return result;
          }
        });
      }
    },
    {
      name: 'resolve-deckgl-typed',
      setup(build) {
        build.onResolve({filter: /^@deck\.gl\/.*\/typed$/}, args => {
          return build.resolve(args.path.replace(/\/typed$/, ''), {
            kind: args.kind,
            resolveDir: args.resolveDir
          });
        });
      }
    },
    {
      name: 'resolve-monaco-esm',
      setup(build) {
        build.onResolve({filter: /^monaco-editor\/esm\//}, async args => {
          if (args.path.endsWith('.js')) return undefined;
          const result = await build.resolve(args.path + '.js', {
            resolveDir: args.resolveDir,
            kind: args.kind
          });
          return result;
        });
      }
    },
    dotenvRun({
      verbose: true,
      environment: NODE_ENV,
      root: '../../.env'
    }),
    // automatically injected kepler.gl package version into the bundle
    replace({
      __PACKAGE_VERSION__: KeplerPackage.version,
      include: /constants\/src\/default-settings\.ts/
    })
  ]
};

function addAliases(externals, args) {
  const resolveAlias = getThirdPartyLibraryAliases(true);

  // Combine flags
  const useLocalDeck = args.includes('--env.deck');
  const useRepoDeck = args.includes('--env.deck_src');

  // Resolve @kepler.gl/* from workspace source so the demo app uses the
  // current repo instead of stale dist builds in node_modules.
  const keplerWorkspacePackages = {
    actions: 'actions',
    'cloud-providers': 'cloud-providers',
    'common-utils': 'common-utils',
    components: 'components',
    constants: 'constants',
    'deckgl-arrow-layers': 'deckgl-arrow-layers',
    'deckgl-layers': 'deckgl-layers',
    duckdb: 'duckdb',
    effects: 'effects',
    layers: 'layers',
    localization: 'localization',
    processors: 'processors',
    reducers: 'reducers',
    schemas: 'schemas',
    styles: 'styles',
    table: 'table',
    tasks: 'tasks',
    types: 'types',
    utils: 'utils'
  };
  Object.entries(keplerWorkspacePackages).forEach(([pkg, dir]) => {
    resolveAlias[`@kepler.gl/${pkg}`] = `${SRC_DIR}/${dir}/src`;
  });

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
    await esbuild
      .context({
        ...config,
        minify: false,
        sourcemap: true,
        // add alias to resolve libraries so there is only one copy of them
        ...(process.env.NODE_ENV === 'local'
          ? {alias: localAliases}
          : {alias: getThirdPartyLibraryAliases(false)}),
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
