// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import esbuild from 'esbuild';
import {dotenvRun} from '@dotenv-run/esbuild';
import copyPlugin from 'esbuild-plugin-copy';

import process from 'node:process';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';

const args = process.argv;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const port = 8080;

const NODE_ENV = JSON.stringify(process.env.NODE_ENV || 'production');

const config = {
  platform: 'browser',
  format: 'iife',
  logLevel: 'info',
  loader: {'.js': 'jsx', '.css': 'css'},
  entryPoints: ['src/main.js'],
  outfile: 'dist/bundle.js',
  bundle: true,
  define: {
    NODE_ENV
  },
  plugins: [
    dotenvRun({
      verbose: true,
      environment: NODE_ENV,
      root: '../../.env'
    }),
    // styled-components: @hubble.gl/react nests its own copy.
    // react-palm: several @kepler.gl/* packages nest their own copy.
    // Both are singletons that break when loaded more than once.
    {
      name: 'dedupe-singletons',
      setup(build) {
        build.onResolve({filter: /^(styled-components|react-palm(\/|$)|react$|react-dom$)/}, async args => {
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
        minify: true,
        sourcemap: false,
        metafile: true,
        define: {
          ...config.define,
          'process.env.NODE_ENV': '"production"'
        }
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
        console.info(`kepler.gl custom-reducer example running at http://localhost:${port}`);
        openURL(`http://localhost:${port}`);
      })
      .catch(e => {
        console.error(e);
        process.exit(1);
      });
  }
})();
