// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import fs from 'fs';
import os from 'os';
import path from 'path';
import {spawnSync} from 'child_process';
import test from 'tape';

const ROOT = path.resolve(__dirname, '../..');
const {version} = require('../../package.json');

function runUpdater(cwd) {
  return spawnSync(
    process.execPath,
    ['-r', path.join(ROOT, 'babel-register.js'), path.join(ROOT, 'scripts/edit-version.js')],
    {
      cwd,
      encoding: 'utf8',
      env: {...process.env, NODE_ENV: 'development', BABEL_DISABLE_CACHE: '1'},
      timeout: 30000
    }
  );
}

test('example-version updates declared packages and prerelease UMD URLs without adding dependencies', t => {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'kepler-example-version-'));
  const write = (file, text) => {
    const target = path.join(cwd, 'examples', file);
    fs.mkdirSync(path.dirname(target), {recursive: true});
    fs.writeFileSync(target, text);
  };
  const read = file => fs.readFileSync(path.join(cwd, 'examples', file), 'utf8');
  const manifest = {
    dependencies: {
      '@kepler.gl/components': '^3.3.0-alpha.6',
      '@kepler.gl/reducers': '3.3.0-alpha.6',
      '@openassistant/kepler-assistant': '0.0.18',
      react: '^19.0.0'
    },
    devDependencies: {'@kepler.gl/types': '~3.3.0-alpha.6'},
    peerDependencies: {'@kepler.gl/actions': '^3.2.0'},
    optionalDependencies: {'@kepler.gl/duckdb': '^3.3.0-alpha.6'}
  };
  const unchanged = {
    'empty/package.json': '{"dependencies":{}}\n',
    'local/package.json': JSON.stringify({
      dependencies: {
        '@kepler.gl/components': 'file:../../src/components',
        '@kepler.gl/actions': 'workspace:*',
        '@kepler.gl/reducers': 'link:../../src/reducers'
      }
    }),
    'scoped/yarn.lock': '# Standalone lockfiles must be regenerated with Yarn.\n'
  };
  try {
    write('scoped/package.json', JSON.stringify(manifest));
    write('legacy/package.json', JSON.stringify({dependencies: {'kepler.gl': '^3.2.0'}}));
    Object.entries(unchanged).forEach(([file, text]) => write(file, text));
    const urls = [
      'https://unpkg.com/kepler.gl@3.2.0/umd/keplergl.min.js',
      'https://unpkg.com/kepler.gl@3.3.0-alpha.6/umd/keplergl.min.js',
      'https://unpkg.com/kepler.gl@3.3.0-rc.1+build.2/umd/keplergl.min.js'
    ];
    const unrelated = 'https://unpkg.com/other@3.3.0-alpha.6/umd/other.js';
    const invalid = 'https://unpkg.com/kepler.gl@3x3x0/umd/keplergl.min.js';
    write('umd-client/index.html', [...urls, unrelated, invalid].join('\n'));

    const result = runUpdater(cwd);
    t.equal(result.status, 0, result.stderr || 'updater exits successfully');
    const updated = JSON.parse(read('scoped/package.json'));
    t.deepEqual(
      updated,
      {
        ...manifest,
        dependencies: {
          ...manifest.dependencies,
          '@kepler.gl/components': `^${version}`,
          '@kepler.gl/reducers': version
        },
        devDependencies: {'@kepler.gl/types': `~${version}`},
        peerDependencies: {'@kepler.gl/actions': `^${version}`},
        optionalDependencies: {'@kepler.gl/duckdb': `^${version}`}
      },
      'updates scoped references while preserving range style and unrelated packages'
    );
    t.notOk(updated.dependencies['kepler.gl'], 'does not add the legacy unscoped package');
    t.equal(
      JSON.parse(read('legacy/package.json')).dependencies['kepler.gl'],
      `^${version}`,
      'still updates an explicitly declared legacy dependency'
    );
    Object.entries(unchanged).forEach(([file, text]) => {
      t.equal(read(file), text, `leaves ${file} unchanged`);
    });
    t.equal(
      read('umd-client/index.html'),
      [
        ...urls.map(() => `https://unpkg.com/kepler.gl@${version}/umd/keplergl.min.js`),
        unrelated,
        invalid
      ].join('\n'),
      'updates stable, prerelease and build-metadata URLs only'
    );
    t.ok(read('scoped/package.json').endsWith('\n'), 'writes a trailing newline');
    t.ok(
      result.stdout.indexOf('Success!') > result.stdout.indexOf('index.html success.'),
      'reports success only after all writes complete'
    );

    const first = read('scoped/package.json');
    const second = runUpdater(cwd);
    t.equal(second.status, 0, second.stderr || 'a repeated run succeeds');
    t.equal(read('scoped/package.json'), first, 'a repeated run is idempotent');
    t.notOk(second.stdout.includes('## Edit '), 'does not rewrite unchanged files');

    write('scoped/package.json', '{invalid json');
    const failed = runUpdater(cwd);
    t.notEqual(failed.status, 0, 'invalid input fails the command');
    t.notOk(failed.stdout.includes('Success!'), 'does not report success on failure');
  } finally {
    fs.rmSync(cwd, {recursive: true, force: true});
  }
  t.end();
});

test('example-version leaves a source-only example without dependencies untouched', t => {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'kepler-source-example-version-'));
  const sourceOnly = '{"name":"live-data","scripts":{"start":"node server.mjs"}}\n';
  try {
    fs.mkdirSync(path.join(cwd, 'examples/live-data'), {recursive: true});
    fs.mkdirSync(path.join(cwd, 'examples/umd-client'), {recursive: true});
    const manifestPath = path.join(cwd, 'examples/live-data/package.json');
    fs.writeFileSync(manifestPath, sourceOnly);
    fs.writeFileSync(path.join(cwd, 'examples/umd-client/index.html'), '<html></html>');
    const result = runUpdater(cwd);
    t.equal(result.status, 0, result.stderr || 'missing dependencies do not throw');
    t.equal(fs.readFileSync(manifestPath, 'utf8'), sourceOnly, 'does not add dependency fields');
  } finally {
    fs.rmSync(cwd, {recursive: true, force: true});
  }
  t.end();
});
