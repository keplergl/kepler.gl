// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import esbuild from 'esbuild';
import {replace} from 'esbuild-plugin-replace';
import {dotenvRun} from '@dotenv-run/esbuild';
import copyPlugin from 'esbuild-plugin-copy';

import process from 'node:process';
import fs from 'node:fs';
import {spawn} from 'node:child_process';
import {join} from 'node:path';

const args = process.argv;

const port = 8080;

const NODE_ENV = JSON.stringify(process.env.NODE_ENV || 'production');

// Ensure a single instance of React and friends to avoid invalid hook calls
const ROOT_NODE_MODULES = join('..', '..', 'node_modules');
const thirdPartyAliases = {
  react: join(ROOT_NODE_MODULES, 'react'),
  'react-dom': join(ROOT_NODE_MODULES, 'react-dom'),
  'react-redux': join(ROOT_NODE_MODULES, 'react-redux', 'lib'),
  'styled-components': join(ROOT_NODE_MODULES, 'styled-components'),
  'apache-arrow': join(ROOT_NODE_MODULES, 'apache-arrow')
};

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
    'process.env.MapboxAccessToken': JSON.stringify(process.env.MapboxAccessToken || '')
  },
  plugins: [
    dotenvRun({
      verbose: true,
      environment: NODE_ENV,
      root: '../../.env'
    }),
    replace({
      __PACKAGE_VERSION__: '3.1.10',
      include: /constants\/src\/default-settings\.ts/
    }),
    copyPlugin({
      resolveFrom: 'cwd',
      assets: {
        from: ['index.html'],
        to: ['dist/index.html']
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
        alias: thirdPartyAliases,
        minify: true,
        sourcemap: false,
        metafile: true,
        define: {
          ...config.define,
          'process.env.NODE_ENV': '"production"'
        },
        drop: ['console', 'debugger'],
        treeShaking: true
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
        alias: thirdPartyAliases,
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
        console.info(`kepler.gl custom-reducer example running at ${`http://localhost:${port}`}`);
        openURL(`http://localhost:${port}`);
      })
      .catch(e => {
        console.error(e);
        process.exit(1);
      });
  }
})();
