import esbuild from 'esbuild';
import {replace} from 'esbuild-plugin-replace';

import process from 'node:process';
import fs from 'node:fs';
import {spawn} from 'node:child_process';
import {join} from 'node:path';
import KeplerPackage from '../../package.json' assert {type: 'json'};

const args = process.argv;
const LIB_DIR = '../../';
const NODE_MODULES_DIR = join(LIB_DIR, 'node_modules');
const SRC_DIR = join(LIB_DIR, 'src');

// For debugging deck.gl, load deck.gl from external deck.gl directory
const EXTERNAL_DECK_SRC = join(LIB_DIR, 'deck.gl');

// For debugging loaders.gl, load loaders.gl from external loaders.gl directory
const EXTERNAL_LOADERS_SRC = join(LIB_DIR, 'loaders.gl');

// For debugging hubble.gl, load hubble.gl from external hubble.gl directory
const EXTERNAL_HUBBLE_SRC = join(LIB_DIR, '../../hubble.gl');

const port = 8080;

// add alias to serve from kepler src, resolve libraries so there is only one copy of them
const RESOLVE_LOCAL_ALIASES = {
  react: `${NODE_MODULES_DIR}/react`,
  'react-dom': `${NODE_MODULES_DIR}/react-dom`,
  'react-redux': `${NODE_MODULES_DIR}/react-redux/lib`,
  'styled-components': `${NODE_MODULES_DIR}/styled-components`,
  'react-intl': `${NODE_MODULES_DIR}/react-intl`,
  // Suppress useless warnings from react-date-picker's dep
  'tiny-warning': `${SRC_DIR}/utils/src/noop.ts`,
  // kepler.gl and loaders.gl need to use same apache-arrow
  'apache-arrow': `${NODE_MODULES_DIR}/apache-arrow`
};

const config = {
  platform: 'browser',
  format: 'iife',
  logLevel: 'info',
  loader: {'.js': 'jsx'},
  entryPoints: ['src/main.js'],
  outfile: 'dist/bundle.js',
  bundle: true,
  define: {
    NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'production'),
    'process.env.MapboxAccessToken': JSON.stringify(process.env.MapboxAccessToken), // eslint-disable-line
    'process.env.DropboxClientId': JSON.stringify(process.env.DropboxClientId), // eslint-disable-line
    'process.env.MapboxExportToken': JSON.stringify(process.env.MapboxExportToken), // eslint-disable-line
    'process.env.CartoClientId': JSON.stringify(process.env.CartoClientId), // eslint-disable-line
    'process.env.FoursquareClientId': JSON.stringify(process.env.FoursquareClientId), // eslint-disable-line
    'process.env.FoursquareDomain': JSON.stringify(process.env.FoursquareDomain), // eslint-disable-line
    'process.env.FoursquareAPIURL': JSON.stringify(process.env.FoursquareAPIURL), // eslint-disable-line
    'process.env.FoursquareUserMapsURL': JSON.stringify(process.env.FoursquareUserMapsURL) // eslint-disable-line
  },
  plugins: [
    // automatically injected kepler.gl package version into the bundle
    replace({
      __PACKAGE_VERSION__: KeplerPackage.version,
      include: /constants\/src\/default-settings\.ts/
    })
  ]
};

function addAliases(externals, args) {
  const resolveAlias = RESOLVE_LOCAL_ALIASES;

  // Combine flags
  const useLocalDeck = args.includes('--env.deck') || args.includes('--env.hubble_src');
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

  if (args.includes('--env.hubble_src')) {
    externals['hubble.gl'].forEach(mdl => {
      resolveAlias[`@hubble.gl/${mdl}`] = `${EXTERNAL_HUBBLE_SRC}/modules/${mdl}/src`;
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

  const modules = ['@deck.gl', '@loaders.gl', '@luma.gl', '@probe.gl', '@hubble.gl'];
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
    'probe.gl': results[3],
    'hubble.gl': results[4]
  }));

  const localAliases = addAliases(externals, args);

  if (args.includes('--build')) {
    await esbuild
      .build({
        ...config,

        minify: true,
        sourcemap: false
      })
      .catch(e => {
        console.error(e);
        process.exit(1);
      });
  }

  if (args.includes('--start')) {
    await esbuild
      .context({
        ...config,
        minify: false,
        sourcemap: true,
        // add alias to resolve libraries so there is only one copy of them
        ...(process.env.NODE_ENV === 'local' ? {alias: localAliases} : {}),
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
