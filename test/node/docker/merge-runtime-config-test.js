// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import fs from 'fs';
import os from 'os';
import path from 'path';
import {spawnSync} from 'child_process';
import test from 'tape';

const MERGE_SCRIPT = path.resolve(__dirname, '../../../docker/merge-runtime-config.js');
const EXAMPLE_CONFIG = path.resolve(__dirname, '../../../docker/config.example.json');

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

test('docker/config.example.json is valid JSON', t => {
  const example = JSON.parse(fs.readFileSync(EXAMPLE_CONFIG, 'utf8'));
  t.ok(example.credentials && typeof example.credentials === 'object', 'has credentials');
  t.ok('mapUrl' in example, 'has mapUrl');
  t.ok('applicationConfig' in example, 'has applicationConfig');
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
