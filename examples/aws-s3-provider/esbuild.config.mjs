// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import esbuild from 'esbuild';
import copyPlugin from 'esbuild-plugin-copy';
import process from 'node:process';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';

const args = process.argv;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const port = 8080;

function loadDotEnv() {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) {
    return;
  }
  const text = fs.readFileSync(envPath, 'utf8');
  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadDotEnv();

const envKeys = [
  'MapboxAccessToken',
  'AwsRegion',
  'AwsUserPoolId',
  'AwsUserPoolClientId',
  'AwsIdentityPoolId',
  'AwsS3Bucket',
  'AwsCognitoDomain',
  'AwsAccountDisplayName'
];

const define = {
  NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'production'),
  'process.env.NODE_DEBUG': JSON.stringify(false)
};
for (const key of envKeys) {
  define[`process.env.${key}`] = JSON.stringify(process.env[key] || '');
}

const config = {
  platform: 'browser',
  format: 'iife',
  logLevel: 'info',
  logOverride: {
    'unsupported-jsx-comment': 'silent'
  },
  loader: {'.js': 'jsx', '.ts': 'ts', '.tsx': 'tsx', '.css': 'css'},
  entryPoints: ['src/app.tsx'],
  outfile: 'dist/bundle.js',
  bundle: true,
  define,
  plugins: [
    {
      name: 'dedupe-singletons',
      setup(build) {
        build.onResolve(
          {filter: /^(styled-components|react-palm(\/|$)|react$|react-dom$)/},
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
    },
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
    await esbuild.build({...config, minify: true, sourcemap: false}).catch(e => {
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
          onRequest: ({remoteAddress, method, path: reqPath, status, timeInMS}) => {
            console.info(remoteAddress, status, `"${method} ${reqPath}" [${timeInMS}ms]`);
          }
        });
        console.info(`kepler.gl AWS S3 example at http://localhost:${port}`);
        openURL(`http://localhost:${port}`);
      })
      .catch(e => {
        console.error(e);
        process.exit(1);
      });
  }
})();
