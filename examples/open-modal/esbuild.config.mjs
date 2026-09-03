// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import esbuild from 'esbuild';
import {replace} from 'esbuild-plugin-replace';
import {dotenvRun} from '@dotenv-run/esbuild';
import copyPlugin from 'esbuild-plugin-copy';

import process from 'node:process';
import {spawn} from 'node:child_process';
import {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const args = process.argv;

const port = 8080;

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
    'process.env.MapboxAccessToken': JSON.stringify(process.env.MapboxAccessToken || '')
  },
  plugins: [
    dotenvRun({
      verbose: true,
      environment: NODE_ENV,
      root: '../../.env'
    }),
    replace({
      __PACKAGE_VERSION__: '3.3.0-alpha.6',
      include: /constants\/src\/default-settings\.ts/
    }),
    copyPlugin({
      resolveFrom: 'cwd',
      assets: {
        from: ['index.html'],
        to: ['dist/index.html']
      }
    }),
    // styled-components: @hubble.gl/react nests its own copy.
    // Singleton that breaks when loaded more than once.
    {
      name: 'dedupe-singletons',
      setup(build) {
        build.onResolve(
          {filter: /^(styled-components|react$|react-dom$)/},
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
        console.info(`kepler.gl open-modal example running at ${`http://localhost:${port}`}`);
        openURL(`http://localhost:${port}`);
      })
      .catch(e => {
        console.error(e);
        process.exit(1);
      });
  }
})();
