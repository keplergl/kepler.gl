// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// Run explicitly: node --test examples/demo-app-sqlrooms/test/duckdb.browser.cjs
// Uses Chromium and the versioned DuckDB CDN assets (network access required).
const {test} = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const http = require('node:http');
const {build} = require('esbuild');
const puppeteer = require('puppeteer');

const root = path.resolve(__dirname, '../../..');
const demo = path.resolve(__dirname, '..');

test(
  'one DuckDB serves map, SQL, and assistant; snapshots and cancellation work',
  {timeout: 120000},
  async () => {
    const alias = {};
    for (const pkg of [
      'actions',
      'components',
      'common-utils',
      'constants',
      'duckdb',
      'layers',
      'processors',
      'reducers',
      'schemas',
      'styles',
      'table',
      'utils',
      'tasks',
      'tasks-core',
      'effects',
      'localization',
      'deckgl-layers',
      'deckgl-arrow-layers'
    ]) {
      alias[`@kepler.gl/${pkg}`] = path.join(root, 'src', pkg, 'src');
    }
    for (const pkg of [
      '@sqlrooms/duckdb',
      '@sqlrooms/duckdb-core',
      '@sqlrooms/room-store',
      '@sqlrooms/ui',
      '@duckdb/duckdb-wasm',
      'apache-arrow',
      'react',
      'react-dom'
    ]) {
      alias[pkg] = path.join(demo, 'node_modules', pkg);
    }
    const bundle = await build({
      entryPoints: [path.join(__dirname, 'duckdb-browser-entry.ts')],
      bundle: true,
      platform: 'browser',
      format: 'iife',
      globalName: 'duckdbTest',
      write: false,
      alias,
      loader: {'.js': 'jsx', '.css': 'empty'},
      define: {'process.env.NODE_ENV': '"production"'}
    });
    const server = http.createServer((req, res) => {
      res.setHeader('Content-Type', req.url === '/test.js' ? 'text/javascript' : 'text/html');
      res.end(
        req.url === '/test.js' ? bundle.outputFiles[0].text : '<script src="/test.js"></script>'
      );
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    let browser;
    try {
      browser = await puppeteer.launch({headless: true, args: ['--no-sandbox']});
      const page = await browser.newPage();
      await page.evaluateOnNewDocument(() => {
        window.workerSources = [];
        const blobSources = new Map();
        const createObjectURL = URL.createObjectURL.bind(URL);
        URL.createObjectURL = blob => {
          const url = createObjectURL(blob);
          if (blob instanceof Blob) blobSources.set(url, blob.text());
          return url;
        };
        const NativeWorker = window.Worker;
        window.Worker = class extends NativeWorker {
          constructor(...args) {
            super(...args);
            window.workerSources.push(blobSources.get(String(args[0])) ?? String(args[0]));
          }
        };
      });
      const pageErrors = [];
      page.on('pageerror', error => pageErrors.push(error.message));
      await page.goto(`http://127.0.0.1:${server.address().port}`);
      const result = await page.evaluate(() => duckdbTest.run());
      assert.deepEqual(pageErrors, [], 'Assistant rendering produced browser errors');
      const workers = await page.evaluate(() => Promise.all(window.workerSources));
      // Count database workers, excluding unrelated library workers.
      assert.equal(workers.filter(source => /duckdb.*worker/.test(source)).length, 1);
      await page.reload();
      await page.evaluate(() => duckdbTest.verifyRestoredAssistant());
      assert.deepEqual(pageErrors, [], 'Reload produced browser errors');
      console.log(result);
    } finally {
      await browser?.close();
      await new Promise(resolve => server.close(resolve));
    }
  }
);
