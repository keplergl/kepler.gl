import esbuild from 'esbuild';
import process from 'node:process';
import {spawn} from 'node:child_process';

const args = process.argv;
const NODE_MODULES_DIR = '../../node_modules';
const SRC_DIR = '../../src';

const port = 8080;

const resolveAlias = {
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
  }
};

if (args.includes('--build')) {
  esbuild
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
  esbuild
    .context({
      ...config,
      minify: false,
      sourcemap: true,
      // add alias to resolve libraries so there is only one copy of them
      alias: resolveAlias,
      banner: {
        js: `new EventSource('/esbuild').addEventListener('change', () => location.reload());`
      }
    })
    .then(async ctx => {
      await ctx.watch();
      await ctx.serve({
        servedir: 'dist',
        port,
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
