// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// node --experimental-vm-modules --test website/test/esbuild-config.test.cjs
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const manifest = require('../package.json');
const rootManifest = require('../../package.json');

const productionEnv = {
  MapboxAccessToken: 'test-mapbox',
  DropboxClientId: 'test-dropbox',
  MapboxExportToken: 'test-export',
  CartoClientId: 'test-carto',
  FoursquareClientId: 'test-foursquare',
  FoursquareDomain: 'test-domain',
  FoursquareAPIURL: 'test-api',
  FoursquareUserMapsURL: 'test-maps'
};

async function runConfig(args, env = {}) {
  const calls = {spawn: [], build: [], serve: [], watch: 0};
  const context = vm.createContext({console: {log() {}, info() {}, error() {}}});
  const dependencies = {
    esbuild: {
      default: {
        build: async config => calls.build.push(config),
        context: async config => {
          calls.build.push(config);
          return {
            watch: async () => calls.watch++,
            serve: async config => calls.serve.push(config)
          };
        }
      }
    },
    'esbuild-plugin-replace': {replace: options => ({name: 'replace', options})},
    'node:process': {
      default: {
        argv: ['node', 'esbuild.config.mjs', ...args],
        env,
        platform: 'test',
        exit: code => {
          throw new Error(`exit ${code}`);
        }
      }
    },
    'node:path': {dirname: path.dirname, join: path.join},
    'node:fs': {existsSync: () => true},
    'node:module': {createRequire: () => require},
    'node:child_process': {
      spawn: (...args) => calls.spawn.push(args),
      spawnSync: (...args) => {
        calls.spawn.push(args);
        return {status: 0};
      }
    },
    '../package.json': {default: rootManifest}
  };
  const source = fs.readFileSync(path.join(__dirname, '../esbuild.config.mjs'), 'utf8');
  // Await the CLI's async entry point so errors and all mocked build operations
  // are observed before assertions, without launching watchers or real servers.
  const module = new vm.SourceTextModule(source.replace('(async () => {', 'await (async () => {'), {
    context
  });
  await module.link(name => {
    const exports = dependencies[name];
    assert.ok(exports, `unexpected dependency: ${name}`);
    return new vm.SyntheticModule(
      Object.keys(exports),
      function () {
        for (const [key, value] of Object.entries(exports)) this.setExport(key, value);
      },
      {context}
    );
  });
  await module.evaluate();
  return calls;
}

test('website commands share the deployed esbuild pipeline and prepare static assets', () => {
  const scripts = manifest.scripts;
  assert.equal(rootManifest.scripts['start:web'], 'yarn install-and-start website start');
  assert.equal(scripts.dev, 'yarn start');
  for (const name of ['start', 'start-prod', 'esbuild']) {
    assert.match(scripts[name], /^yarn build-clean && yarn build-static && /);
  }
  assert.match(scripts.start, /node esbuild.config.mjs --start$/);
  assert.match(scripts['start-prod'], /node esbuild.config.mjs --start --production$/);
  assert.equal(scripts['build-script'], 'node esbuild.config.mjs --build');
  assert.equal(scripts.build, 'yarn esbuild && yarn build:demo-next');
  assert.match(scripts['build:demo-next'], /cp -R dist\/demo-next/);
});

test('development watches the shared bundle and Tailwind, with SPA fallback and reload', async () => {
  const calls = await runConfig(['--start']);
  const config = calls.build[0];
  assert.equal(config.define['process.env.NODE_ENV'], '"development"');
  assert.equal(config.minify, false);
  assert.equal(config.sourcemap, true);
  assert.equal(config.loader['.md'], 'text');
  assert.ok(config.alias['@kepler.gl/mcp/skill/kepler/SKILL.md']);
  assert.ok(config.plugins.some(plugin => plugin.name === 'dedupe-sqlrooms'));
  assert.match(config.banner.js, /EventSource\('\/esbuild'\)/);
  assert.equal(calls.watch, 1);
  assert.equal(calls.serve[0].port, 3003);
  assert.equal(calls.serve[0].fallback, 'dist/index.html');
  assert.equal(calls.serve[0].servedir, 'dist');
  assert.ok(calls.spawn[0][1].includes('--watch'));
});

test('production preview uses production defines and validates deployment variables', async () => {
  await assert.rejects(runConfig(['--start', '--production']), /Missing MapboxAccessToken/);
  const calls = await runConfig(['--start', '--production'], productionEnv);
  const config = calls.build[0];
  assert.equal(config.define['process.env.NODE_ENV'], '"production"');
  assert.equal(config.define['process.env.MapboxAccessToken'], '"test-mapbox"');
  assert.equal(config.minify, true);
  assert.equal(config.sourcemap, false);
  assert.equal(calls.watch, 1);
});

test('production builds retain validation, aliases, Tailwind and one-shot bundling', async () => {
  await assert.rejects(runConfig(['--build']), /Missing MapboxAccessToken/);
  const calls = await runConfig(['--build'], productionEnv);
  const config = calls.build[0];
  assert.equal(config.define['process.env.NODE_ENV'], '"production"');
  assert.equal(config.minify, true);
  assert.equal(config.sourcemap, false);
  assert.ok(config.alias['@kepler.gl/components']);
  assert.equal(calls.watch, 0);
  assert.equal(calls.serve.length, 0);
  assert.ok(calls.spawn[0][1].includes('--minify'));
});
