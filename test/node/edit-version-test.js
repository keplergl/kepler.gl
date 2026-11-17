// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import fs from 'fs';
import os from 'os';
import path from 'path';
import {execFileSync, spawnSync} from 'child_process';
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

const releaseChangelog = `# Change Log

All notable changes to kepler.gl will be documented in this file.

<!-- Preserve release instructions. -->

## [3.3.0-alpha.22] - Nov 16 2026

- Already released change

## [3.3.0-alpha.21] - Nov 13 2026

- Older change
`;

function withReleaseFixture(callback) {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'kepler-prepare-release-'));
  const write = (file, content) => fs.writeFileSync(path.join(cwd, file), content);
  const read = file => fs.readFileSync(path.join(cwd, file), 'utf8');
  const git = (...args) =>
    execFileSync(
      'git',
      [
        '-c',
        'user.name=Release Test',
        '-c',
        'user.email=release@example.test',
        '-c',
        'commit.gpgsign=false',
        '-c',
        'core.hooksPath=/dev/null',
        ...args
      ],
      {cwd, encoding: 'utf8', stdio: 'pipe'}
    ).trim();
  const commit = subject => {
    git('commit', '--allow-empty', '-m', subject);
    return git('rev-parse', '--short', 'HEAD');
  };

  try {
    fs.mkdirSync(path.join(cwd, 'scripts'));
    fs.mkdirSync(path.join(cwd, 'bin'));
    fs.copyFileSync(
      path.join(ROOT, 'scripts/prepare-release.js'),
      path.join(cwd, 'scripts/prepare-release.js')
    );
    // Stub only the existing bump command; exercise Git and changelog IO for real.
    write(
      'bin/yarn',
      `#!/usr/bin/env node
const fs = require('fs');
const args = process.argv.slice(2);
fs.writeFileSync('bump-args.json', JSON.stringify(args));
if (process.env.RELEASE_TEST_BUMP_FAIL) process.exit(1);
if (args.length !== 2 || args[0] !== 'bump-version') process.exit(2);
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.version = args[1];
fs.writeFileSync('package.json', JSON.stringify(pkg));
`
    );
    fs.chmodSync(path.join(cwd, 'bin/yarn'), 0o755);
    // The local manifest is deliberately ahead of the changelog baseline.
    write('package.json', JSON.stringify({version: '3.3.0-alpha.99'}));
    write('CHANGELOG.md', releaseChangelog);
    git('init', '--quiet');
    git('add', 'package.json', 'CHANGELOG.md');
    commit('already released');
    git('tag', 'v3.3.0-alpha.22');
    const env = {
      ...process.env,
      PATH: `${path.join(cwd, 'bin')}${path.delimiter}${process.env.PATH}`
    };
    const run = (version, extraEnv = {}) =>
      spawnSync(
        process.execPath,
        [
          '-e',
          "require('./scripts/prepare-release').prepareRelease(process.argv[1], {date: new Date(2026, 10, 16, 12)})",
          version
        ],
        {cwd, env: {...env, ...extraEnv}, encoding: 'utf8', timeout: 30000}
      );
    const cli = args =>
      spawnSync(process.execPath, ['scripts/prepare-release.js', ...args], {
        cwd,
        env,
        encoding: 'utf8',
        timeout: 30000
      });
    callback({cwd, write, read, git, commit, run, cli});
  } finally {
    fs.rmSync(cwd, {recursive: true, force: true});
  }
}

test('release:prepare bumps via the existing command and prepends commits since the changelog release', t => {
  withReleaseFixture(({read, git, commit, run}) => {
    const first = commit('fix: first change');
    // An unrelated newer tag must not change the changelog-derived baseline.
    git('tag', 'v3.3.0-alpha.100');
    const second = commit('feat: second change');
    const result = run('3.3.0-alpha.23');
    t.equal(result.status, 0, result.stderr || 'preparation succeeds');
    t.deepEqual(JSON.parse(read('bump-args.json')), ['bump-version', '3.3.0-alpha.23']);
    t.equal(JSON.parse(read('package.json')).version, '3.3.0-alpha.23', 'version is bumped');
    const insertion = releaseChangelog.indexOf('## [');
    const section = `## [3.3.0-alpha.23] - Nov 16 2026\n\n- ${second} feat: second change\n- ${first} fix: first change\n\n`;
    t.equal(
      read('CHANGELOG.md'),
      releaseChangelog.slice(0, insertion) + section + releaseChangelog.slice(insertion),
      'preserves the introduction/history and adds only unreleased commits, newest first'
    );
    const updated = read('CHANGELOG.md');
    const repeated = run('3.3.0-alpha.23');
    t.notEqual(repeated.status, 0, 'rejects duplicate preparation');
    t.ok(repeated.stderr.includes('already contains version'), 'explains the duplicate');
    t.equal(read('CHANGELOG.md'), updated, 'does not duplicate or overwrite the new section');
  });
  t.end();
});

test('release:prepare validates versions before calling the existing bump command', t => {
  withReleaseFixture(({cwd, read, cli}) => {
    const originalPackage = read('package.json');
    const cases = [
      [],
      ['patch'],
      ['v3.3.0'],
      ['3.03.0'],
      ['3.3.0-alpha.01'],
      ['3.3.0-alpha..1'],
      ['3.3.0\n'],
      ['3.3.0; touch injected'],
      ['3.3.0', 'extra']
    ];
    cases.forEach(args => {
      const result = cli(args);
      t.notEqual(result.status, 0, `rejects ${JSON.stringify(args)}`);
      t.ok(result.stderr.includes('Usage:'), 'prints usage');
    });
    t.equal(cli(['--help']).status, 0, 'help succeeds without preparing a release');
    t.notOk(fs.existsSync(path.join(cwd, 'bump-args.json')), 'never calls the bump command');
    t.equal(read('package.json'), originalPackage, 'leaves the manifest unchanged');
    t.equal(read('CHANGELOG.md'), releaseChangelog, 'leaves the changelog unchanged');
  });
  t.end();
});

test('release:prepare refuses missing or unreachable history before changing versions', t => {
  const cases = [
    {
      name: 'missing changelog version',
      setup: ({write}) => write('CHANGELOG.md', '# Change Log\n'),
      message: 'version heading'
    },
    {
      name: 'missing release tag',
      setup: ({git, commit}) => {
        git('tag', '-d', 'v3.3.0-alpha.22');
        commit('new change');
      },
      message: 'git fetch --tags'
    },
    {
      name: 'release tag outside branch history',
      setup: ({git, commit}) => {
        git('checkout', '--orphan', 'unrelated');
        commit('unrelated change');
      },
      message: 'not an ancestor'
    },
    {name: 'no new commits', setup: () => {}, message: 'No commits since'}
  ];
  cases.forEach(({name, setup, message}) => {
    withReleaseFixture(fixture => {
      setup(fixture);
      const before = fixture.read('CHANGELOG.md');
      const originalPackage = fixture.read('package.json');
      const result = fixture.run('3.3.0-alpha.23');
      t.notEqual(result.status, 0, `rejects ${name}`);
      t.ok(result.stderr.includes(message), `explains ${name}`);
      t.notOk(fs.existsSync(path.join(fixture.cwd, 'bump-args.json')), 'does not bump versions');
      t.equal(fixture.read('package.json'), originalPackage, 'preserves the manifest');
      t.equal(fixture.read('CHANGELOG.md'), before, 'preserves the changelog');
    });
  });
  t.end();
});

test('release:prepare rejects build metadata before it can create inconsistent package versions', t => {
  ['3.3.0+build.1', '3.3.0-alpha.23+build.1'].forEach(version => {
    withReleaseFixture(({cwd, read, commit, run}) => {
      commit('new change');
      const originalPackage = read('package.json');
      const result = run(version);
      t.notEqual(result.status, 0, `rejects ${version}`);
      t.ok(result.stderr.includes('without build metadata'), 'explains the unsupported input');
      t.notOk(fs.existsSync(path.join(cwd, 'bump-args.json')), 'does not call the bump command');
      t.equal(read('package.json'), originalPackage, 'leaves the manifest unchanged');
      t.equal(read('CHANGELOG.md'), releaseChangelog, 'leaves the changelog unchanged');
    });
  });
  t.end();
});

test('release:prepare leaves the changelog untouched if the existing bump command fails', t => {
  withReleaseFixture(({read, commit, run}) => {
    commit('new change');
    const result = run('3.3.0', {RELEASE_TEST_BUMP_FAIL: '1'});
    t.notEqual(result.status, 0, 'reports the failed bump');
    t.equal(read('CHANGELOG.md'), releaseChangelog, 'does not add a release section');
    t.notOk(result.stdout.includes('Updated CHANGELOG.md'), 'does not report completion');
  });
  t.end();
});
