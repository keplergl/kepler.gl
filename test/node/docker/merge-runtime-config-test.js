// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import fs from 'fs';
import os from 'os';
import path from 'path';
import {spawnSync} from 'child_process';
import test from 'tape';

const MERGE_SCRIPT = path.resolve(__dirname, '../../../docker/merge-runtime-config.js');
const EXAMPLE_CONFIG = path.resolve(__dirname, '../../../docker/config.example.json');
const FULL_EXAMPLE_CONFIG = path.resolve(__dirname, '../../../docker/config.full-example.json');
const SAMPLE_GALLERY_EXAMPLE = path.resolve(__dirname, '../../../docker/samples.example.json');

function runMerge(env, configPath) {
  return spawnSync(process.execPath, [MERGE_SCRIPT], {
    encoding: 'utf8',
    env: {
      ...process.env,
      ...env,
      KEPLER_CONFIG_PATH: configPath
    }
  });
}

function readConfig(configPath) {
  return JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

test('docker/config.example.json is a valid minimal starter', t => {
  const example = JSON.parse(fs.readFileSync(EXAMPLE_CONFIG, 'utf8'));
  t.ok(example.credentials && typeof example.credentials === 'object', 'has credentials');
  t.notOk(example.mapUrl, 'minimal starter does not boot a map');
  t.end();
});

test('docker/config.full-example.json lists supported keys', t => {
  const example = JSON.parse(fs.readFileSync(FULL_EXAMPLE_CONFIG, 'utf8'));
  t.ok(example.credentials && typeof example.credentials === 'object', 'has credentials');
  t.ok('mapUrl' in example, 'has mapUrl');
  t.ok(
    example.applicationConfig && typeof example.applicationConfig === 'object',
    'has applicationConfig'
  );
  t.end();
});

test('docker/samples.example.json uses absolute catalogue URLs', t => {
  const samples = JSON.parse(fs.readFileSync(SAMPLE_GALLERY_EXAMPLE, 'utf8'));
  t.ok(Array.isArray(samples) && samples.length > 0, 'is a catalogue array');
  const row = samples[0];
  ['imageUrl', 'dataUrl', 'configUrl'].forEach(key => {
    t.ok(/^https?:\/\//.test(row[key]), `${key} is absolute`);
  });
  t.end();
});

test('merge-runtime-config writes env-only config when no file exists', t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'kepler-runtime-config-'));
  const configPath = path.join(dir, 'config.json');

  const result = runMerge(
    {
      KEPLER_MAPBOX_ACCESS_TOKEN: 'pk.ci-test',
      KEPLER_PAGE_TITLE: 'ci-title',
      KEPLER_MAP_URL: 'https://example.com/map.json'
    },
    configPath
  );

  t.equal(result.status, 0, result.stderr || 'exit 0');
  t.ok(fs.existsSync(configPath), 'wrote config.json');

  const config = readConfig(configPath);
  t.equal(config.credentials.MapboxAccessToken, 'pk.ci-test');
  t.equal(config.pageTitle, 'ci-title');
  t.equal(config.mapUrl, 'https://example.com/map.json');
  t.notOk(config.credentials.DropboxClientId, 'empty env does not set other credentials');

  fs.rmSync(dir, {recursive: true, force: true});
  t.end();
});

test('merge-runtime-config overlays KEPLER_* onto an existing config file', t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'kepler-runtime-config-'));
  const configPath = path.join(dir, 'config.json');
  fs.writeFileSync(
    configPath,
    `${JSON.stringify(
      {
        credentials: {MapboxAccessToken: 'pk.from-file', DropboxClientId: 'dropbox-from-file'},
        pageTitle: 'from-file'
      },
      null,
      2
    )}\n`
  );

  const result = runMerge(
    {
      KEPLER_MAPBOX_ACCESS_TOKEN: 'pk.from-env',
      KEPLER_MAPBOX_EXPORT_TOKEN: ''
    },
    configPath
  );

  t.equal(result.status, 0, result.stderr || 'exit 0');
  const config = readConfig(configPath);
  t.equal(config.credentials.MapboxAccessToken, 'pk.from-env', 'env overrides matching keys');
  t.equal(config.credentials.DropboxClientId, 'dropbox-from-file', 'file wins for unset env');
  t.equal(config.pageTitle, 'from-file', 'unset top-level env leaves file value');

  fs.rmSync(dir, {recursive: true, force: true});
  t.end();
});

test('merge-runtime-config writes empty credentials when nothing is set', t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'kepler-runtime-config-'));
  const configPath = path.join(dir, 'config.json');

  const result = runMerge({}, configPath);
  t.equal(result.status, 0, result.stderr || 'exit 0');
  t.deepEqual(readConfig(configPath), {credentials: {}});

  fs.rmSync(dir, {recursive: true, force: true});
  t.end();
});

test('merge-runtime-config injects KEPLER_CONFIG_HREF into index.html', t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'kepler-runtime-config-'));
  const configPath = path.join(dir, 'config.json');
  const indexPath = path.join(dir, 'index.html');
  fs.writeFileSync(
    indexPath,
    `<!doctype html>
<html>
  <head>
    <title>kepler.gl demo</title>
  </head>
  <body></body>
</html>
`
  );

  const result = runMerge(
    {
      KEPLER_INDEX_PATH: indexPath,
      KEPLER_CONFIG_HREF: '/kepler/config.json'
    },
    configPath
  );

  t.equal(result.status, 0, result.stderr || 'exit 0');
  const html = fs.readFileSync(indexPath, 'utf8');
  t.ok(
    html.includes('window.__KEPLER_CONFIG_HREF__="/kepler/config.json"'),
    'injects the config href script'
  );

  const again = runMerge(
    {
      KEPLER_INDEX_PATH: indexPath,
      KEPLER_CONFIG_HREF: '/other/config.json'
    },
    configPath
  );
  t.equal(again.status, 0, again.stderr || 're-inject exit 0');
  const updated = fs.readFileSync(indexPath, 'utf8');
  t.ok(
    updated.includes('window.__KEPLER_CONFIG_HREF__="/other/config.json"'),
    'replaces prior href'
  );
  t.equal(
    (updated.match(/window\.__KEPLER_CONFIG_HREF__/g) || []).length,
    1,
    'does not stack snippets'
  );

  fs.rmSync(dir, {recursive: true, force: true});
  t.end();
});

test('merge-runtime-config skips index.html when KEPLER_CONFIG_HREF is unset', t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'kepler-runtime-config-'));
  const configPath = path.join(dir, 'config.json');

  const result = runMerge({}, configPath);
  t.equal(result.status, 0, result.stderr || 'exit 0 without index.html');

  fs.rmSync(dir, {recursive: true, force: true});
  t.end();
});

test('merge-runtime-config exits when KEPLER_CONFIG_HREF cannot be injected', t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'kepler-runtime-config-'));
  const configPath = path.join(dir, 'config.json');
  const indexPath = path.join(dir, 'missing-index.html');

  const result = runMerge(
    {
      KEPLER_INDEX_PATH: indexPath,
      KEPLER_CONFIG_HREF: '/kepler/config.json'
    },
    configPath
  );
  t.notEqual(result.status, 0, 'non-zero exit when index.html cannot be read');
  t.ok(
    /KEPLER_CONFIG_HREF is set but could not read/.test(`${result.stderr}\n${result.stdout}`),
    'error explains the failed inject'
  );

  fs.rmSync(dir, {recursive: true, force: true});
  t.end();
});

test('merge-runtime-config exits when KEPLER_* cannot be written', t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'kepler-runtime-config-'));
  const notDir = path.join(dir, 'not-a-dir');
  fs.writeFileSync(notDir, 'x');
  const configPath = path.join(notDir, 'config.json');

  const result = runMerge({KEPLER_MAPBOX_ACCESS_TOKEN: 'pk.ci-test'}, configPath);
  t.notEqual(result.status, 0, 'non-zero exit when env merge cannot be persisted');
  t.ok(
    /Could not write/.test(`${result.stderr}\n${result.stdout}`),
    'error explains the failed write'
  );

  fs.rmSync(dir, {recursive: true, force: true});
  t.end();
});
