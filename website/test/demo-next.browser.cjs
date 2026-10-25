// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// Run after `cd website && yarn build`, from the repository root:
// node --test website/test/demo-next.browser.cjs
// Requires Chromium and network access to public sample data and DuckDB assets.
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const puppeteer = require('puppeteer');

const dist = path.resolve(__dirname, '../dist');
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.ttf': 'font/ttf',
  '.png': 'image/png'
};

// Serve the publish directory using the committed SPA rewrites. Existing
// assets take precedence, matching Netlify's non-forced rewrite behavior.
function createServer() {
  const rules = fs
    .readFileSync(path.join(dist, '_redirects'), 'utf8')
    .trim()
    .split('\n')
    .map(line => line.trim().split(/\s+/));
  return http.createServer((req, res) => {
    const {pathname} = new URL(req.url, 'http://localhost');
    let file = path.join(dist, pathname);
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
      file = path.join(file, 'index.html');
    }
    if (!fs.existsSync(file)) {
      const rule = rules.find(([from]) =>
        from.endsWith('*') ? pathname.startsWith(from.slice(0, -1)) : pathname === from
      );
      if (!rule) {
        res.writeHead(404).end();
        return;
      }
      file = path.join(dist, rule[1] === '/' ? 'index.html' : rule[1]);
    }
    res.setHeader('Content-Type', mimeTypes[path.extname(file)] || 'application/octet-stream');
    fs.createReadStream(file).pipe(res);
  });
}

test(
  'the published demos retain separate entry points, assets, routes and assistant state',
  {
    timeout: 120000
  },
  async () => {
    const server = createServer();
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    let browser;
    try {
      browser = await puppeteer.launch({headless: true, args: ['--no-sandbox']});
      const page = await browser.newPage();
      const origin = `http://127.0.0.1:${server.address().port}`;
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));

      // Seed the original demo's key without executing either app. A deployment
      // of the experimental app must not migrate or overwrite the original state.
      await page.goto(`${origin}/favicon.png`);
      const originalState = JSON.stringify({state: {}, version: 0});
      await page.evaluate(value => {
        localStorage.setItem('kepler-ai-assistant-state', value);
      }, originalState);

      for (const route of ['/demo-next', '/demo-next/']) {
        await page.goto(`${origin}${route}`, {waitUntil: 'domcontentloaded'});
        await page.waitForSelector('.demo-map-action', {visible: true});
        assert.equal(await page.title(), 'kepler.gl SQLRooms demo');
        const assets = await page.$$eval('script[src], link[rel="stylesheet"]', elements =>
          elements
            .map(element => element.src || element.href)
            .filter(url => url.startsWith(location.origin))
        );
        assert.ok(assets.length >= 3);
        assert.ok(assets.every(url => url.startsWith(`${origin}/demo-next/`)));
        for (const url of assets) {
          const response = await fetch(url);
          assert.equal(response.status, 200);
          assert.match(response.headers.get('content-type'), /javascript|css/);
          await response.arrayBuffer();
        }
      }

      // Selecting a sample exercises generated navigation, then reloading checks
      // a nested URL against the publish directory's SPA fallback.
      await page.goto(`${origin}/demo-next?sql=SELECT%201`, {waitUntil: 'domcontentloaded'});
      await page.waitForSelector('[aria-label="Run query"]', {visible: true});
      await page
        .locator('button')
        .filter(button => button.textContent === 'Add Data')
        .click();
      await page.waitForSelector('.demo-map-action', {visible: true});
      await page.click('.demo-map-action');
      await page.waitForSelector('#earthquakes .sample-map__image', {visible: true});
      await page.click('#earthquakes .sample-map__image');
      await page.waitForFunction(() => location.pathname === '/demo-next/earthquakes');
      assert.equal(new URL(page.url()).searchParams.get('sql'), 'SELECT 1');
      await page.reload({waitUntil: 'domcontentloaded'});
      await page.waitForFunction(() => document.body.innerText.includes('California Earthquakes'));
      await page.waitForSelector('[aria-label="Run query"]', {visible: true});
      const storage = await page.evaluate(() => ({
        original: localStorage.getItem('kepler-ai-assistant-state'),
        next: localStorage.getItem('kepler-sqlrooms-ai-assistant-state')
      }));
      assert.equal(storage.original, originalState);
      assert.ok(storage.next);

      for (const route of ['/demo', '/']) {
        await page.goto(`${origin}${route}`, {waitUntil: 'domcontentloaded'});
        await page.waitForFunction(() => document.getElementById('root')?.textContent.length > 0);
        assert.equal(await page.title(), 'kepler.gl');
        assert.ok(
          await page.evaluate(() =>
            performance
              .getEntriesByType('resource')
              .some(entry => entry.name === `${location.origin}/bundle.js`)
          )
        );
      }
      assert.deepEqual(errors, []);
    } finally {
      await browser?.close();
      server.closeAllConnections();
      await new Promise(resolve => server.close(resolve));
    }
  }
);
