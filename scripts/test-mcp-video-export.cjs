// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// Opt-in real-browser acceptance check:
// node -r ./babel-register.js scripts/test-mcp-video-export.cjs
const assert = require('node:assert/strict');
const {createServer} = require('node:http');
const {mkdtemp, readFile, rm} = require('node:fs/promises');
const {tmpdir} = require('node:os');
const {join, resolve} = require('node:path');
const esbuild = require('esbuild');
const puppeteer = require('puppeteer');
const {KeplerMcpBridge} = require('../src/mcp/src/server/bridge-server');
const {RESOLVE_ALIASES} = require('../webpack/shared-webpack-configuration');

async function main() {
  const directory = await mkdtemp(join(tmpdir(), 'kepler-video-acceptance-'));
  const errors = [];
  let browser;
  let server;
  let bridge;
  try {
    await esbuild.build({
      entryPoints: ['test/browser-headless/mcp-video-fixture.tsx'],
      outfile: join(directory, 'bundle.js'),
      bundle: true,
      format: 'iife',
      platform: 'browser',
      alias: {
        ...RESOLVE_ALIASES,
        '@kepler.gl/mcp/skill/kepler/SKILL.md': resolve('src/mcp/skill/kepler/SKILL.md'),
        '@kepler.gl/components/charts': resolve('src/components/src/charts.ts')
      },
      tsconfigRaw: {compilerOptions: {useDefineForClassFields: false, esModuleInterop: true}},
      loader: {
        '.js': 'jsx',
        '.md': 'text',
        '.woff': 'dataurl',
        '.woff2': 'dataurl',
        '.ttf': 'dataurl'
      },
      define: {
        'process.env.NODE_ENV': '"production"',
        'process.env.MapboxAccessToken': '""',
        __PACKAGE_VERSION__: '"test"'
      },
      logLevel: 'warning'
    });
    const bundle = await readFile(join(directory, 'bundle.js'));
    server = createServer((request, response) => {
      if (request.url === '/bundle.js') {
        response.setHeader('Content-Type', 'application/javascript');
        response.end(bundle);
      } else {
        response.setHeader('Content-Type', 'text/html');
        response.end('<!doctype html><div id="root"></div><script src="/bundle.js"></script>');
      }
    });
    await new Promise(resolveListen => server.listen(0, '127.0.0.1', resolveListen));
    bridge = new KeplerMcpBridge({port: 0, mapUrl: `http://127.0.0.1:${server.address().port}`});
    const started = await bridge.start();
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--enable-webgl', '--enable-unsafe-swiftshader']
    });
    const page = await browser.newPage();
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => {
      if (message.type() === 'error') errors.push(message.text());
    });
    await page.goto(`${started.pageUrl}&mcpPort=${started.port}`, {waitUntil: 'networkidle0'});
    await page.waitForFunction(
      () => !window.fixtureError && typeof window.fixtureUnchanged === 'function',
      {timeout: 30000}
    );
    for (let i = 0; i < 100 && !bridge.connected; i++)
      await new Promise(resolveDelay => setTimeout(resolveDelay, 100));
    assert(bridge.connected, 'fixture connects to the MCP bridge');
    const call = async input => {
      const result = await bridge.callTool('map_export-video', input);
      assert(result.success, result.error);
      return result.data;
    };
    const capabilities = await call({action: 'capabilities', width: 1920, height: 1080});
    assert(capabilities.available, capabilities.reason);
    const format = capabilities.formats.includes('webm-native') ? 'webm-native' : 'webm';
    let job = await call({
      action: 'start',
      settings: {width: 1920, height: 1080, durationMs: 2000, frameRate: 30, format}
    });
    const deadline = Date.now() + 180000;
    while (!['succeeded', 'failed', 'cancelled'].includes(job.status) && Date.now() < deadline) {
      await new Promise(resolveDelay => setTimeout(resolveDelay, 500));
      job = await call({action: 'status', jobId: job.jobId});
    }
    assert.equal(job.status, 'succeeded', JSON.stringify(job));
    const bytes = await readFile(job.artifact.filePath);
    const decoded = await page.evaluate(async base64 => {
      const video = document.createElement('video');
      video.src = `data:video/webm;base64,${base64}`;
      await new Promise((resolveLoad, reject) => {
        video.onloadeddata = resolveLoad;
        video.onerror = reject;
      });
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      const centroids = [];
      for (const time of [0.25, 1.75]) {
        video.currentTime = time;
        await new Promise(resolveSeek => {
          video.onseeked = resolveSeek;
        });
        context.drawImage(video, 0, 0);
        const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
        let x = 0;
        let count = 0;
        for (let i = 0; i < pixels.length; i += 4) {
          if (
            pixels[i] > 120 &&
            pixels[i] > pixels[i + 1] * 1.5 &&
            pixels[i] > pixels[i + 2] * 1.5
          ) {
            x += (i / 4) % canvas.width;
            count++;
          }
        }
        centroids.push({x: x / count, count});
      }
      return {
        width: video.videoWidth,
        height: video.videoHeight,
        duration: video.duration,
        centroids,
        unchanged: window.fixtureUnchanged(),
        dialogs: document.querySelectorAll('[role="dialog"]').length
      };
    }, bytes.toString('base64'));
    assert.equal(decoded.width, 1920);
    assert.equal(decoded.height, 1080);
    assert(Math.abs(decoded.duration - 2) < 1 / 30, JSON.stringify(decoded));
    assert(
      decoded.centroids.every(value => value.count > 50),
      JSON.stringify(decoded)
    );
    assert(
      decoded.centroids[0].x < 1920 * 0.45 && decoded.centroids[1].x > 1920 * 0.55,
      JSON.stringify(decoded)
    );
    assert(decoded.unchanged, 'the visible project timeline and layer settings remain unchanged');
    assert.equal(decoded.dialogs, 0);
    assert.deepEqual(errors, [], 'browser errors');
    console.log(
      'PASS MCP video acceptance',
      JSON.stringify({format, bytes: bytes.length, ...decoded})
    );
  } finally {
    await browser?.close();
    await bridge?.close();
    if (server) await new Promise(resolveClose => server.close(resolveClose));
    await rm(directory, {recursive: true, force: true});
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
