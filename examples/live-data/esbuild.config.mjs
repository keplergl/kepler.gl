// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import esbuild from 'esbuild';
import {replace} from 'esbuild-plugin-replace';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';

import KeplerPackage from '../../package.json' assert {type: 'json'};
import {startLiveDataServer} from './server.mjs';

const args = process.argv;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LIB_DIR = path.join(__dirname, '../..');
const SRC_DIR = path.join(LIB_DIR, 'src');
const NODE_MODULES_DIR = path.join(LIB_DIR, 'node_modules');
const DIST_DIR = path.join(__dirname, 'dist');
const port = Number(process.env.LIVE_DATA_APP_PORT || 8083);
const dataPort = Number(process.env.LIVE_DATA_PORT || 4010);
const liveDataUrl = process.env.LIVE_DATA_URL || `http://localhost:${dataPort}/vehicles.csv`;

function localKeplerAliases() {
  const aliases = {
    react: `${NODE_MODULES_DIR}/react`,
    'react-dom': `${NODE_MODULES_DIR}/react-dom`,
    'react-dom/client': `${NODE_MODULES_DIR}/react-dom/client`,
    'react-redux': `${NODE_MODULES_DIR}/react-redux`,
    'styled-components': `${NODE_MODULES_DIR}/styled-components`,
    'react-intl': `${NODE_MODULES_DIR}/react-intl`,
    'apache-arrow': `${NODE_MODULES_DIR}/apache-arrow`,
    'tiny-warning': path.join(SRC_DIR, 'utils/src/noop.ts')
  };
  for (const workspace of KeplerPackage.workspaces) {
    const moduleName = workspace.split('/').pop();
    const srcPath = path.join(SRC_DIR, moduleName, 'src');
    aliases[`@kepler.gl/${moduleName}`] = fs.existsSync(srcPath)
      ? srcPath
      : path.join(SRC_DIR, moduleName);
  }
  return aliases;
}

function copyIndexHtml() {
  fs.mkdirSync(DIST_DIR, {recursive: true});
  fs.copyFileSync(path.join(__dirname, 'src/index.html'), path.join(DIST_DIR, 'index.html'));
}

const config = {
  platform: 'browser',
  format: 'iife',
  logLevel: 'info',
  logOverride: {
    'unsupported-jsx-comment': 'silent'
  },
  absWorkingDir: __dirname,
  loader: {'.js': 'jsx', '.css': 'css'},
  entryPoints: [path.join(__dirname, 'src/app.tsx')],
  outfile: path.join(DIST_DIR, 'bundle.js'),
  bundle: true,
  alias: localKeplerAliases(),
  define: {
    NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
    'process.env.LIVE_DATA_URL': JSON.stringify(liveDataUrl),
    'process.env.LIVE_WS_URL': JSON.stringify(
      process.env.LIVE_WS_URL || `ws://localhost:${dataPort}/vehicles.ws`
    ),
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
    replace({
      __PACKAGE_VERSION__: KeplerPackage.version,
      include: /constants\/src\/default-settings\.ts/
    }),
    {
      name: 'dedupe-singletons',
      setup(build) {
        build.onResolve(
          {filter: /^(styled-components|react$|react-dom$)/},
          async resolveArgs => {
            if (resolveArgs.pluginData?.deduped) return;
            const result = await build.resolve(resolveArgs.path, {
              resolveDir: NODE_MODULES_DIR,
              kind: resolveArgs.kind,
              pluginData: {deduped: true}
            });
            return result;
          }
        );
      }
    },
    {
      name: 'copy-index-html',
      setup(build) {
        build.onStart(() => {
          copyIndexHtml();
        });
      }
    }
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
    fs.writeFileSync(path.join(DIST_DIR, 'esbuild-metadata.json'), JSON.stringify(result.metafile));
  }

  if (args.includes('--start')) {
    startLiveDataServer(dataPort);
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
          servedir: DIST_DIR,
          port,
          fallback: path.join(DIST_DIR, 'index.html'),
          onRequest: ({remoteAddress, method, path: reqPath, status, timeInMS}) => {
            console.info(remoteAddress, status, `"${method} ${reqPath}" [${timeInMS}ms]`);
          }
        });
        console.info(
          `kepler.gl live-data example running at http://localhost:${port}, press Ctrl+C to stop`
        );
        openURL(`http://localhost:${port}`);
      })
      .catch(e => {
        console.error(e);
        process.exit(1);
      });
  }
})();
