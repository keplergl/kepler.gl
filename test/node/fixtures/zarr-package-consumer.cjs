// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {createRequire} = require('node:module');
const {transformFileSync} = require('@babel/core');

const root = path.resolve(__dirname, '../../..');
const consumer = fs.mkdtempSync(path.join(os.tmpdir(), 'kepler-zarr-consumer-'));
const modules = path.join(consumer, 'node_modules');
const readJson = filename => JSON.parse(fs.readFileSync(filename, 'utf8'));

// Isolate the Zarr dependency graph so the repository's fix-dependencies script
// cannot make require('zarrita') work in this consumer. Other dependencies are
// reused offline; no Babel register, Jest aliases or source stubs are involved.
function installDependencies(source, target) {
  fs.mkdirSync(target, {recursive: true});
  for (const entry of fs.readdirSync(source, {withFileTypes: true})) {
    if (entry.name.startsWith('.') || entry.name === '@kepler.gl') continue;
    const from = path.join(source, entry.name);
    const to = path.join(target, entry.name);
    if (
      entry.name === 'zarrita' ||
      entry.name === '@zarrita' ||
      entry.name === '@developmentseed'
    ) {
      fs.cpSync(from, to, {recursive: true});
    } else {
      fs.symlinkSync(from, to);
    }
  }
  for (const name of ['zarrita', '@zarrita/storage']) {
    const filename = path.join(target, name, 'package.json');
    const pkg = readJson(filename);
    for (const entry of Object.values(pkg.exports)) {
      delete entry.default;
      delete entry.require;
    }
    fs.writeFileSync(filename, JSON.stringify(pkg));
  }
}

// Build the public packages and their workspace dependencies with the same
// package-local Babel configs used for publication. Keep generated files in
// this disposable consumer, never in the checkout's dist directories.
const built = new Set();
function buildPackage(name) {
  if (built.has(name)) return;
  built.add(name);
  const source = path.join(root, 'src', name.replace('@kepler.gl/', ''));
  const pkg = readJson(path.join(source, 'package.json'));
  if (!pkg.main) return; // @kepler.gl/types publishes declarations only.
  const target = path.join(modules, name);
  fs.mkdirSync(target, {recursive: true});
  fs.writeFileSync(path.join(target, 'package.json'), JSON.stringify(pkg));
  function buildDirectory(from, to) {
    fs.mkdirSync(to, {recursive: true});
    for (const entry of fs.readdirSync(from, {withFileTypes: true})) {
      const input = path.join(from, entry.name);
      if (entry.isDirectory()) {
        buildDirectory(input, path.join(to, entry.name));
      } else if (!/\.(d\.ts|spec\.[jt]sx?)$/.test(entry.name)) {
        if (/\.[jt]sx?$/.test(entry.name)) {
          const {code} = transformFileSync(input, {
            configFile: path.join(source, 'babel.config.js'),
            babelrc: false,
            envName: 'production'
          });
          fs.writeFileSync(path.join(to, entry.name.replace(/\.[jt]sx?$/, '.js')), code);
        } else {
          fs.copyFileSync(input, path.join(to, entry.name));
        }
      }
    }
  }
  buildDirectory(path.join(source, 'src'), path.join(target, 'dist/cjs'));
  for (const dependency of Object.keys({...pkg.dependencies, ...pkg.peerDependencies})) {
    if (dependency.startsWith('@kepler.gl/')) buildPackage(dependency);
  }
}

async function run() {
  installDependencies(path.join(root, 'node_modules'), modules);
  buildPackage('@kepler.gl/table');
  buildPackage('@kepler.gl/layers');
  const requireConsumer = createRequire(path.join(consumer, 'index.cjs'));
  assert.throws(() => requireConsumer('zarrita'), {code: 'ERR_PACKAGE_PATH_NOT_EXPORTED'});
  assert.throws(() => requireConsumer('@zarrita/storage'), {code: 'ERR_PACKAGE_PATH_NOT_EXPORTED'});

  const {getZarrMetadata} = requireConsumer('@kepler.gl/table');
  const {KeplerGlLayers} = requireConsumer('@kepler.gl/layers');
  const layer = new KeplerGlLayers.ZarrLayer({dataId: 'climate'});
  assert.deepEqual(layer.renderLayer({data: null}), []);

  const array = {
    zarr_format: 2,
    shape: [2, 2, 2],
    chunks: [1, 2, 2],
    dtype: '<f8',
    compressor: null,
    fill_value: null,
    order: 'C',
    filters: null
  };
  const consolidated = {
    zarr_consolidated_format: 1,
    metadata: {
      '.zgroup': {zarr_format: 2},
      '.zattrs': {},
      'climate/.zarray': array,
      'climate/.zattrs': {
        _ARRAY_DIMENSIONS: ['month', 'lat', 'lon'],
        'spatial:dimensions': ['lat', 'lon'],
        'spatial:transform': [1, 0, 0, 0, -1, 2],
        'spatial:shape': [2, 2],
        'proj:code': 'EPSG:4326'
      },
      'month/.zarray': {...array, shape: [2], chunks: [2]},
      'month/.zattrs': {_ARRAY_DIMENSIONS: ['month']}
    }
  };
  let requests = 0;
  globalThis.fetch = async request => {
    requests++;
    if (request.url.endsWith('/.zmetadata')) return Response.json(consolidated);
    if (request.url.endsWith('/month/0')) return new Response(new Float64Array([1, 2]).buffer);
    if (request.url.endsWith('/climate/0.0.0'))
      return new Response(new Float64Array([5, 6, 7, 8]).buffer);
    return new Response(null, {status: 404});
  };

  // Cancellation while the initial import is pending must not start a fetch.
  const controller = new AbortController();
  const cancelled = getZarrMetadata('https://example.com/cancelled.zarr', {
    signal: controller.signal
  });
  controller.abort();
  await assert.rejects(cancelled, {name: 'AbortError'});
  assert.equal(requests, 0);

  const metadata = await getZarrMetadata('https://example.com/climate.zarr');
  assert.equal(metadata.variable, 'climate');
  assert.deepEqual(metadata.nonSpatialDims[0].values, [1, 2]);
  let redraw;
  const ready = new Promise(resolve => {
    redraw = resolve;
  });
  const options = {
    data: {metadata, variable: metadata.variables[0]},
    mapState: {},
    idx: 0,
    gpuFilter: null,
    visible: true,
    layerCallbacks: {onRedrawNeeded: redraw}
  };
  assert.deepEqual(layer.renderLayer(options), []);
  await ready;
  const [rendered] = layer.renderLayer(options);
  assert.ok(rendered, 'lazy renderer must be ready when it asks for a redraw');
  assert.deepEqual(rendered.props.selection, {month: 0});
  const tile = await rendered.props.getTileData(rendered.props.node, {
    sliceSpec: [0, null, null],
    width: 2,
    height: 2
  });
  assert.deepEqual(Array.from(tile.values), [5, 6, 7, 8]);
}

run().then(
  () => {
    fs.rmSync(consumer, {recursive: true, force: true});
    console.log('CommonJS Zarr consumer passed');
  },
  error => {
    fs.rmSync(consumer, {recursive: true, force: true});
    console.error(error);
    process.exitCode = 1;
  }
);
