// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import esbuild from 'esbuild';
import { replace } from 'esbuild-plugin-replace';
import process from 'node:process';
import { dirname, join } from 'node:path';
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { spawn, spawnSync } from 'node:child_process';
import WebsitePackage from '../package.json' with {type: 'json'};

const require = createRequire(import.meta.url);

const args = process.argv;
const LIB_DIR = '../';
const NODE_MODULES_DIR = join(LIB_DIR, 'node_modules');
const WEBSITE_NODE_MODULES_DIR = './node_modules';
const SRC_DIR = join(LIB_DIR, 'src');

const port = 3003;

// The SQLRooms AI chat UI (rendered from the demo-app sources the website
// bundles) is styled entirely with Tailwind utility classes. Those classes are
// not part of esbuild's JS/CSS graph, so we compile them separately with the
// Tailwind CLI, exactly like the demo-app build does, and link the output from
// index.html. `@source` globs inside this stylesheet are resolved relative to
// the stylesheet itself, so pointing at the demo-app copy keeps them valid.
const TAILWIND_INPUT = '../examples/demo-app/src/styles.css';
const TAILWIND_OUTPUT = 'dist/tailwind.css';

// The tailwindcss CLI is a dependency of the demo-app workspace; locate its
// binary regardless of how node_modules are hoisted.
function resolveTailwindBin() {
  const candidates = [
    join(LIB_DIR, 'examples/demo-app/node_modules/.bin/tailwindcss'),
    join(LIB_DIR, 'node_modules/.bin/tailwindcss'),
    join(WEBSITE_NODE_MODULES_DIR, '.bin/tailwindcss')
  ];
  return candidates.find(p => existsSync(p)) || 'tailwindcss';
}

function buildTailwind({watch}) {
  const bin = resolveTailwindBin();
  const cliArgs = ['-i', TAILWIND_INPUT, '-o', TAILWIND_OUTPUT];
  if (watch) {
    spawn(bin, [...cliArgs, '--watch'], {stdio: 'inherit'});
    return;
  }
  // Minify for production and fail the build if Tailwind cannot compile.
  const result = spawnSync(bin, [...cliArgs, '--minify'], {stdio: 'inherit'});
  if (result.status !== 0) {
    logError('Tailwind CSS build failed');
    process.exit(1);
  }
}

const RESOLVE_LOCAL_ALIASES = {
  react: `${NODE_MODULES_DIR}/react`,
  'react-dom': `${NODE_MODULES_DIR}/react-dom`,
  'react-redux': `${NODE_MODULES_DIR}/react-redux/lib`,
  'styled-components': `${NODE_MODULES_DIR}/styled-components`,
  'react-intl': `${NODE_MODULES_DIR}/react-intl`,
  'react-palm': `${NODE_MODULES_DIR}/react-palm`,
  'react-router-dom': `${WEBSITE_NODE_MODULES_DIR}/react-router-dom`,
  'react-router': `${WEBSITE_NODE_MODULES_DIR}/react-router`,
  'tiny-warning': `${SRC_DIR}/utils/src/noop.ts`,
  'apache-arrow': `${NODE_MODULES_DIR}/apache-arrow`,
};

// Add kepler.gl submodule aliases
const workspaces = WebsitePackage.workspaces;
workspaces.forEach(workspace => {
  // workspace =  "./src/types",  "./src/constants", etc
  const moduleName = workspace.split('/').pop();
  RESOLVE_LOCAL_ALIASES[`@kepler.gl/${moduleName}`] = join(SRC_DIR, `${moduleName}/src`);
});

const config = {
  platform: 'browser',
  format: 'iife',
  logLevel: 'info',
  inject: ['../examples/demo-app/src/react19-shim.ts'],
  loader: {
    '.js': 'jsx',
    '.css': 'css',
    '.png': 'file',
    '.jpg': 'file',
    '.svg': 'file',
    '.ttf': 'file',
    '.woff': 'file',
    '.woff2': 'file'
  },
  entryPoints: [
    'src/main.tsx',
  ],
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
    'process.env.FoursquareUserMapsURL': JSON.stringify(process.env.FoursquareUserMapsURL || '')
  },
  plugins: [
    replace({
      __PACKAGE_VERSION__: WebsitePackage.version,
      include: /constants\/src\/default-settings\.ts/
    }),
    // Resolve @sqlrooms/ai-core internal component imports that bypass the
    // package `exports` map (mirrors the demo-app esbuild config). The website
    // bundles demo-app sources that deep-import these modules; esbuild honors
    // the package `exports` field strictly and would otherwise fail to resolve.
    {
      name: 'resolve-sqlrooms-ai-core-internals',
      setup(build) {
        build.onResolve({filter: /^@sqlrooms\/ai-core\/components\//}, args => {
          const subpath = args.path.replace('@sqlrooms/ai-core/', '');
          // Resolve the package's public entry (always exported) to locate its
          // install dir, then map to the internal dist file. Avoids relying on
          // `./package.json` being exported, which it is not.
          const entry = require.resolve('@sqlrooms/ai-core', {
            paths: [args.resolveDir, process.cwd()]
          });
          // entry === <pkgRoot>/dist/index.js -> dist dir is its parent
          const distDir = dirname(entry);
          return {path: `${join(distDir, subpath)}.js`};
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

function logError(msg) {
  console.log('\x1b[31m%s\x1b[0m', msg);
}

function logInstruction(msg) {
  console.log('\x1b[36m%s\x1b[0m', msg);
}

function validateEnvVariable(variable, instruction) {
  if (!process.env[variable]) {
    logError(`Error! ${variable} is not defined`);
    logInstruction(`Make sure to run "export ${variable}=<token>" before deploy the website`);
    logInstruction(instruction);
    throw new Error(`Missing ${variable}`);
  }
}

(async () => {
  if (args.includes('--build')) {
    // Validate environment variables before production build
    const ENV_VARIABLES_WITH_INSTRUCTIONS = {
      MapboxAccessToken: 'Get your Mapbox token at https://www.mapbox.com/help/how-access-tokens-work/',
      DropboxClientId: 'Get your Dropbox key at https://www.dropbox.com/developers',
      MapboxExportToken: 'Get your Mapbox token at https://www.mapbox.com/help/how-access-tokens-work/',
      CartoClientId: 'Get your CARTO client id',
      FoursquareClientId: 'Get your Foursquare client id',
      FoursquareDomain: 'Set your Foursquare domain',
      FoursquareAPIURL: 'Set your Foursquare API URL',
      FoursquareUserMapsURL: 'Set your Foursquare User Maps URL'
    };

    // Validate all environment variables
    Object.entries(ENV_VARIABLES_WITH_INSTRUCTIONS).forEach(([variable, instruction]) => {
      validateEnvVariable(variable, instruction);
    });

    // Compile the SQLRooms/Tailwind stylesheet before bundling so
    // dist/tailwind.css exists alongside the JS bundle.
    buildTailwind({watch: false});

    await esbuild
      .build({
        ...config,
        minify: true,
        sourcemap: false,
        alias: RESOLVE_LOCAL_ALIASES
      })
      .catch(e => {
        console.error(e);
        process.exit(1);
      });
  }

  if (args.includes('--start')) {
    // Watch & compile the Tailwind stylesheet during dev too.
    buildTailwind({watch: true});

    await esbuild
      .context({
        ...config,
        minify: false,
        sourcemap: true,
        alias: RESOLVE_LOCAL_ALIASES,
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
          onRequest: ({ remoteAddress, method, path, status, timeInMS }) => {
            console.info(remoteAddress, status, `"${method} ${path}" [${timeInMS}ms]`);
          }
        });
        console.info(`Website running at http://localhost:${port}, press Ctrl+C to stop`);
        openURL(`http://localhost:${port}`);
      })
      .catch(e => {
        console.error(e);
        process.exit(1);
      });
  }
})();
