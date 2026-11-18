// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import fs from 'fs';
import os from 'os';
import path from 'path';
import crypto from 'crypto';
import assert from 'assert';
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

function withReleaseCheckFixture(callback) {
  const cwd = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'kepler-release-check-')));
  const callsPath = path.join(cwd, 'npm-calls.jsonl');
  const calls = () =>
    fs.existsSync(callsPath)
      ? fs
          .readFileSync(callsPath, 'utf8')
          .trim()
          .split('\n')
          .map(line => JSON.parse(line))
      : [];
  try {
    fs.mkdirSync(path.join(cwd, 'scripts'));
    fs.mkdirSync(path.join(cwd, 'bin'));
    fs.mkdirSync(path.join(cwd, 'nested'));
    const script = path.join(cwd, 'scripts/check-release.js');
    fs.copyFileSync(path.join(ROOT, 'scripts/check-release.js'), script);
    const npm = path.join(cwd, 'bin/npm');
    fs.writeFileSync(
      npm,
      `#!/usr/bin/env node
const fs = require('fs');
const log = process.env.RELEASE_CHECK_CALLS;
const count = fs.existsSync(log) ? fs.readFileSync(log, 'utf8').trim().split('\\n').length : 0;
fs.appendFileSync(log, JSON.stringify({args: process.argv.slice(2), cwd: process.cwd()}) + '\\n');
if (count + 1 === Number(process.env.RELEASE_CHECK_FAIL_AT)) {
  console.error('Simulated npm failure');
  process.exit(17);
}
`
    );
    fs.chmodSync(npm, 0o755);
    const run = (args = [], env = {}) =>
      spawnSync(process.execPath, [script, ...args], {
        cwd: path.join(cwd, 'nested'),
        encoding: 'utf8',
        timeout: 30000,
        env: {
          ...process.env,
          PATH: `${path.join(cwd, 'bin')}${path.delimiter}${process.env.PATH}`,
          RELEASE_CHECK_CALLS: callsPath,
          ...env
        }
      });
    callback({cwd, calls, run});
  } finally {
    fs.rmSync(cwd, {recursive: true, force: true});
  }
}

test('release:check validates every workspace before the root bundle without publishing', t => {
  withReleaseCheckFixture(({cwd, calls, run}) => {
    const result = run([], {npm_config_ignore_scripts: 'true', npm_config_dry_run: 'false'});
    t.equal(result.status, 0, result.stderr || 'both dry runs succeed');
    const invocations = calls();
    t.equal(invocations.length, 2, 'runs both checks');
    t.deepEqual(
      invocations.map(call => call.args),
      [
        [
          'publish',
          '--workspaces',
          '--include-workspace-root=false',
          '--access',
          'public',
          '--tag',
          'latest',
          '--dry-run',
          '--ignore-scripts=false'
        ],
        ['publish', '--workspaces=false', '--tag', 'latest', '--dry-run', '--ignore-scripts=false']
      ],
      'always performs dry runs with build hooks enabled and explicit workspace/root selection'
    );
    t.ok(
      invocations.every(call => call.cwd === cwd),
      'checks run from the repository root'
    );
    t.ok(
      result.stdout.includes('Both release dry runs passed'),
      'reports success after both checks'
    );
  });
  t.end();
});

test('release:check stops on failure of either dry run', t => {
  [1, 2].forEach(failingCheck => {
    withReleaseCheckFixture(({calls, run}) => {
      const result = run([], {RELEASE_CHECK_FAIL_AT: String(failingCheck)});
      t.equal(result.status, 17, `propagates failure from check ${failingCheck}`);
      t.equal(calls().length, failingCheck, 'does not start another command after failure');
      t.ok(result.stderr.includes('Simulated npm failure'), 'preserves npm error output');
      t.notOk(result.stdout.includes('Both release dry runs passed'), 'does not report success');
    });
  });
  t.end();
});

test('release:check fails if npm cannot start and rejects flags that could change publishing behavior', t => {
  withReleaseCheckFixture(({cwd, calls, run}) => {
    const missingNpm = run([], {PATH: path.join(cwd, 'nested')});
    t.notEqual(missingNpm.status, 0, 'missing npm is a failure');
    t.notOk(missingNpm.stdout.includes('Both release dry runs passed'), 'does not report success');
    ['--dry-run=false', '--ignore-scripts', '--workspace=other'].forEach(arg => {
      t.notEqual(run([arg]).status, 0, `rejects ${arg}`);
    });
    t.equal(run(['--help']).status, 0, 'help succeeds');
    t.deepEqual(calls(), [], 'invalid flags and help never invoke npm');
  });
  t.end();
});

const {prepareReleaseArtifacts, publishReleaseArtifacts} = require('../../scripts/publish-release');
const publisherVersion = '3.3.0-alpha.22';
const publisherCommit = 'a'.repeat(40);

async function withPublisherFixture(callback) {
  const temporary = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'kepler-publisher-')));
  const repoRoot = path.join(temporary, 'repo');
  const directory = path.join(temporary, 'artifacts');
  const events = [];
  const state = {commit: publisherCommit, uploadCount: 0, dryRunCount: 0};
  const registry = new Map();
  const write = (file, value) => {
    const target = path.join(repoRoot, file);
    fs.mkdirSync(path.dirname(target), {recursive: true});
    fs.writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`);
  };
  const read = file => JSON.parse(fs.readFileSync(path.join(repoRoot, file), 'utf8'));
  write('package.json', {
    name: 'kepler.gl',
    version: publisherVersion,
    private: true,
    workspaces: ['./src/first', './src/second', './src/private']
  });
  ['first', 'second', 'private'].forEach(name =>
    write(`src/${name}/package.json`, {
      name: `@kepler.gl/${name}`,
      version: publisherVersion,
      ...(name === 'private' ? {private: true} : {})
    })
  );
  ['@kepler.gl/first', '@kepler.gl/second', 'kepler.gl'].forEach(name =>
    registry.set(name, {
      name,
      versions: {'3.2.0': {version: '3.2.0'}},
      'dist-tags': {latest: '3.2.0'}
    })
  );
  const accept = artifact => {
    const metadata = registry.get(artifact.name);
    metadata.versions[artifact.version] = {
      version: artifact.version,
      dist: {integrity: artifact.integrity}
    };
    metadata['dist-tags'].latest = artifact.version;
  };
  const run = (command, args, options) => {
    if (command === 'git') return `${state.commit}\n`;
    if (command === process.execPath) {
      events.push({type: 'checks', args});
      if (state.failChecks) throw new Error('Source dry run failed');
      return '';
    }
    if (command !== 'npm') throw new Error(`Unexpected fixture command: ${command}`);
    if (args[0] === 'pack') {
      const manifest = JSON.parse(fs.readFileSync(path.join(options.cwd, 'package.json'), 'utf8'));
      events.push({type: 'pack', name: manifest.name, args, manifest});
      if (state.failPack === manifest.name) throw new Error('Packing failed');
      const filename = `${manifest.name.replace('@', '').replace('/', '-')}.tgz`;
      const bytes = Buffer.from(JSON.stringify(manifest));
      fs.writeFileSync(path.join(directory, filename), bytes);
      const artifact = {
        name: manifest.name,
        version: manifest.version,
        filename,
        integrity: `sha512-${crypto.createHash('sha512').update(bytes).digest('base64')}`
      };
      if (state.badPack) state.badPack(artifact);
      return JSON.stringify([artifact]);
    }
    if (args[0] !== 'publish') throw new Error('Unexpected npm command');
    if (args.includes('--dry-run')) {
      events.push({type: 'tarball-check', args});
      state.dryRunCount++;
      if (state.failDryRun === state.dryRunCount) throw new Error('Tarball dry run failed');
      return '';
    }
    // This fixture never executes npm: an upload only updates this in-memory registry.
    const release = JSON.parse(fs.readFileSync(path.join(directory, 'release.json'), 'utf8'));
    const artifact = release.packages.find(pkg => path.join(directory, pkg.filename) === args[1]);
    if (!artifact) throw new Error('Unknown upload artifact');
    events.push({
      type: 'upload',
      name: artifact.name,
      args,
      bytes: fs.readFileSync(args[1], 'utf8')
    });
    state.uploadCount++;
    if (state.ambiguousFailure === state.uploadCount) {
      accept(artifact);
      throw new Error('Connection lost after registry accepted upload');
    }
    if (state.failUpload === state.uploadCount) throw new Error('Upload failed');
    accept(artifact);
    return '';
  };
  const fetchRegistry = async url => {
    const name = decodeURIComponent(url.slice('https://registry.npmjs.org/'.length));
    events.push({type: 'registry', name});
    if (state.registryFailure && name === 'kepler.gl') return state.registryFailure();
    return {ok: true, status: 200, json: async () => structuredClone(registry.get(name))};
  };
  const options = {
    repoRoot,
    run,
    fetchRegistry,
    sleep: async delay => {
      events.push({type: 'wait', delay});
    }
  };
  const prepare = () => prepareReleaseArtifacts(publisherVersion, directory, options);
  const publish = () => publishReleaseArtifacts(publisherVersion, directory, options);
  try {
    await callback({
      repoRoot,
      directory,
      events,
      state,
      registry,
      write,
      read,
      options,
      prepare,
      publish,
      accept
    });
  } finally {
    fs.rmSync(temporary, {recursive: true, force: true});
  }
}

async function rejects(t, promise, expected, message) {
  await assert.rejects(promise, expected);
  t.pass(typeof expected === 'string' ? expected : message);
}

function publisherTest(name, callback) {
  test(name, async t => {
    try {
      await callback(t);
    } catch (error) {
      t.fail(error.stack);
    } finally {
      t.end();
    }
  });
}

publisherTest(
  'manual publisher prepares all checked artifacts and restores the private bundle manifest',
  async t => {
    await withPublisherFixture(({repoRoot, directory, events, prepare}) => {
      const manifest = fs.readFileSync(path.join(repoRoot, 'package.json'), 'utf8');
      const release = prepare();
      t.deepEqual(
        events.map(event => event.type),
        ['checks', 'pack', 'pack', 'pack', 'tarball-check', 'tarball-check', 'tarball-check'],
        'both source checks precede all packing, then every tarball is checked'
      );
      t.deepEqual(
        release.packages.map(pkg => pkg.name),
        ['@kepler.gl/first', '@kepler.gl/second', 'kepler.gl'],
        'includes workspaces and bundle, excluding private workspaces'
      );
      t.deepEqual(
        events[0].args,
        [path.join(repoRoot, 'scripts/check-release.js')],
        'uses the existing mandatory dual check'
      );
      t.notOk(Object.hasOwn(events[3].manifest, 'private'), 'packed bundle is publishable');
      t.equal(
        fs.readFileSync(path.join(repoRoot, 'package.json'), 'utf8'),
        manifest,
        'restores original manifest bytes'
      );
      t.equal(release.commit, publisherCommit, 'records the source commit');
      t.deepEqual(
        JSON.parse(fs.readFileSync(path.join(directory, 'release.json'), 'utf8')),
        release,
        'saves the checked release'
      );
      t.ok(
        events
          .filter(event => event.type === 'pack' || event.type === 'tarball-check')
          .every(
            event =>
              event.args.includes('--ignore-scripts') && event.args.includes('--workspaces=false')
          ),
        'packing and tarball checks do not rebuild or include other workspaces'
      );
    });
  }
);

publisherTest(
  'manual publisher fails closed on source, bundle packing, or tarball check failures',
  async t => {
    for (const failure of ['checks', 'pack', 'tarball']) {
      await withPublisherFixture(({repoRoot, directory, state, events, prepare}) => {
        const original = fs.readFileSync(path.join(repoRoot, 'package.json'), 'utf8');
        if (failure === 'checks') state.failChecks = true;
        if (failure === 'pack') state.failPack = 'kepler.gl';
        if (failure === 'tarball') state.failDryRun = 2;
        t.throws(prepare, /failed/i, `reports ${failure} failure`);
        t.notOk(
          fs.existsSync(path.join(directory, 'release.json')),
          'does not mark failed artifacts ready'
        );
        t.notOk(
          events.some(event => event.type === 'upload'),
          'does not upload'
        );
        t.equal(
          fs.readFileSync(path.join(repoRoot, 'package.json'), 'utf8'),
          original,
          'private manifest survives failure'
        );
        if (failure === 'checks')
          t.equal(events.length, 1, 'does not pack after a failed source check');
      });
    }
  }
);

publisherTest('manual publisher rejects unsafe preparation inputs before building', async t => {
  const cases = [
    [
      'invalid version',
      f => {
        f.version = '3.3.0-alpha.01';
      }
    ],
    [
      'build metadata',
      f => {
        f.version = `${publisherVersion}+test`;
      }
    ],
    [
      'wrong version',
      f => {
        f.version = '3.3.0';
      }
    ],
    [
      'workspace version mismatch',
      f =>
        f.write('src/first/package.json', {...f.read('src/first/package.json'), version: '3.2.0'})
    ],
    [
      'duplicate name',
      f =>
        f.write('src/second/package.json', {
          ...f.read('src/second/package.json'),
          name: '@kepler.gl/first'
        })
    ],
    [
      'conflicting publish configuration',
      f =>
        f.write('src/first/package.json', {
          ...f.read('src/first/package.json'),
          publishConfig: {registry: 'https://example.com'}
        })
    ],
    [
      'nested artifacts',
      f => {
        f.destination = path.join(f.repoRoot, 'artifacts');
      }
    ],
    [
      'existing artifacts',
      f => {
        fs.mkdirSync(f.directory);
        fs.writeFileSync(path.join(f.directory, 'old.tgz'), 'existing');
      }
    ]
  ];
  for (const [name, change] of cases) {
    await withPublisherFixture(f => {
      change(f);
      t.throws(
        () =>
          prepareReleaseArtifacts(
            f.version || publisherVersion,
            f.destination || f.directory,
            f.options
          ),
        name
      );
      t.deepEqual(f.events, [], `${name}: no builds or uploads`);
    });
  }
  for (const badPack of [
    artifact => {
      artifact.version = '3.2.0';
    },
    artifact => {
      artifact.integrity = 'sha512-wrong';
    }
  ]) {
    await withPublisherFixture(({state, prepare, directory}) => {
      state.badPack = badPack;
      t.throws(prepare, /packed/i, 'rejects inconsistent npm pack output');
      t.notOk(
        fs.existsSync(path.join(directory, 'release.json')),
        'does not save inconsistent artifacts'
      );
    });
  }
});

publisherTest(
  'manual publisher preflights every package and publishes only the checked tarballs',
  async t => {
    await withPublisherFixture(async ({prepare, publish, events, directory, repoRoot}) => {
      const release = prepare();
      events.length = 0;
      await publish();
      const firstUpload = events.findIndex(event => event.type === 'upload');
      t.deepEqual(
        events.slice(0, release.packages.length).map(event => event.name),
        release.packages.map(pkg => pkg.name),
        'checks all registry states before the first upload'
      );
      t.ok(firstUpload >= release.packages.length, 'no early upload');
      const uploads = events.filter(event => event.type === 'upload');
      t.deepEqual(
        uploads.map(event => event.name),
        release.packages.map(pkg => pkg.name),
        'publishes workspaces before bundle'
      );
      t.deepEqual(
        uploads.map(event => event.args[1]),
        release.packages.map(pkg => path.join(directory, pkg.filename)),
        'publishes the saved tarballs'
      );
      t.ok(
        uploads.every(event =>
          [
            '--ignore-scripts',
            '--workspaces=false',
            '--registry=https://registry.npmjs.org/',
            '--access=public',
            '--tag=latest',
            '--dry-run=false'
          ].every(flag => event.args.includes(flag))
        ),
        'uses explicit publication settings and never rebuilds'
      );
      t.notOk(
        events.some(event => ['checks', 'pack', 'tarball-check'].includes(event.type)),
        'publication does not rerun source builds or pack'
      );
      t.equal(
        JSON.parse(fs.readFileSync(path.join(repoRoot, 'package.json'), 'utf8')).private,
        true,
        'publishing leaves root private'
      );
    });
  }
);

publisherTest(
  'manual publisher skips identical versions, including a fully completed retry',
  async t => {
    await withPublisherFixture(async ({prepare, publish, events, accept}) => {
      const release = prepare();
      accept(release.packages[0]);
      events.length = 0;
      await publish();
      t.deepEqual(
        events.filter(event => event.type === 'upload').map(event => event.name),
        release.packages.slice(1).map(pkg => pkg.name),
        'uploads only missing packages'
      );
      events.length = 0;
      await publish();
      t.notOk(
        events.some(event => event.type === 'upload'),
        'completed retry performs no writes'
      );
    });
  }
);

publisherTest(
  'manual publisher refuses a late integrity conflict or tag conflict before any upload',
  async t => {
    for (const conflict of ['integrity', 'tag']) {
      await withPublisherFixture(async ({prepare, publish, registry, events, accept}) => {
        const release = prepare();
        accept(release.packages[2]);
        const metadata = registry.get('kepler.gl');
        if (conflict === 'integrity')
          metadata.versions[publisherVersion].dist.integrity = 'sha512-different';
        else metadata['dist-tags'].latest = '3.2.0';
        events.length = 0;
        await rejects(
          t,
          publish(),
          conflict === 'integrity' ? /Integrity conflict/ : /points elsewhere/,
          `rejects ${conflict} conflict`
        );
        t.notOk(
          events.some(event => event.type === 'upload'),
          'a conflict in the final package prevents every upload'
        );
      });
    }
  }
);

publisherTest(
  'manual publisher never treats registry errors or malformed responses as missing versions',
  async t => {
    const failures = [
      ...[401, 404, 429, 500].map(status => [String(status), () => ({ok: false, status})]),
      [
        'network',
        () => {
          throw new Error('Network unavailable');
        }
      ],
      [
        'invalid JSON',
        () => ({
          ok: true,
          json: async () => {
            throw new Error('Invalid JSON');
          }
        })
      ],
      ['invalid document', () => ({ok: true, json: async () => ({name: 'kepler.gl'})})],
      [
        'wrong package',
        () => ({ok: true, json: async () => ({name: 'wrong', versions: {}, 'dist-tags': {}})})
      ],
      [
        'array tags',
        () => ({
          ok: true,
          json: async () => ({
            name: 'kepler.gl',
            versions: {'3.2.0': {version: '3.2.0'}},
            'dist-tags': []
          })
        })
      ],
      [
        'empty versions',
        () => ({ok: true, json: async () => ({name: 'kepler.gl', versions: {}, 'dist-tags': {}})})
      ],
      [
        'missing latest version',
        () => ({
          ok: true,
          json: async () => ({
            name: 'kepler.gl',
            versions: {'3.2.0': {version: '3.2.0'}},
            'dist-tags': {latest: '3.2.1'}
          })
        })
      ],
      [
        'missing version string',
        () => ({
          ok: true,
          json: async () => ({
            name: 'kepler.gl',
            versions: {'3.2.0': {}},
            'dist-tags': {latest: '3.2.0'}
          })
        })
      ]
    ];
    for (const [name, failure] of failures) {
      await withPublisherFixture(async ({prepare, publish, state, events}) => {
        prepare();
        events.length = 0;
        state.registryFailure = failure;
        await rejects(t, publish(), `${name} fails closed`);
        t.notOk(
          events.some(event => event.type === 'upload'),
          `${name} prevents all uploads`
        );
      });
    }
  }
);

publisherTest(
  'manual publisher rejects corrupt or mismatched artifacts before contacting npm',
  async t => {
    const changes = [
      [
        'corrupt tarball',
        (f, release) =>
          fs.appendFileSync(path.join(f.directory, release.packages[2].filename), 'changed')
      ],
      [
        'missing tarball',
        (f, release) => fs.unlinkSync(path.join(f.directory, release.packages[2].filename))
      ],
      [
        'source commit mismatch',
        f => {
          f.state.commit = 'b'.repeat(40);
        }
      ],
      [
        'version mismatch',
        (f, release) => {
          release.version = '3.2.0';
        }
      ],
      [
        'missing package',
        (f, release) => {
          release.packages.pop();
        }
      ],
      [
        'path traversal',
        (f, release) => {
          release.packages[2].filename = '../outside.tgz';
        }
      ]
    ];
    for (const [name, change] of changes) {
      await withPublisherFixture(async f => {
        const release = f.prepare();
        change(f, release);
        fs.writeFileSync(path.join(f.directory, 'release.json'), JSON.stringify(release));
        f.events.length = 0;
        await rejects(t, f.publish(), `${name} fails`);
        t.deepEqual(f.events, [], `${name} causes no registry requests or uploads`);
      });
    }
  }
);

publisherTest(
  'manual publisher safely resumes partial and ambiguously accepted uploads',
  async t => {
    for (const failure of ['failUpload', 'ambiguousFailure']) {
      await withPublisherFixture(async ({prepare, publish, events, state, directory}) => {
        const release = prepare();
        const originals = release.packages.map(pkg =>
          fs.readFileSync(path.join(directory, pkg.filename), 'utf8')
        );
        state[failure] = 2;
        events.length = 0;
        await rejects(t, publish(), /failed|Connection lost/, 'stops on the second upload failure');
        t.deepEqual(
          events.filter(event => event.type === 'upload').map(event => event.name),
          release.packages.slice(0, 2).map(pkg => pkg.name),
          'does not attempt bundle after failure'
        );
        events.length = 0;
        await publish();
        const expected = release.packages.slice(failure === 'ambiguousFailure' ? 2 : 1);
        t.deepEqual(
          events.filter(event => event.type === 'upload').map(event => event.name),
          expected.map(pkg => pkg.name),
          'retry skips versions actually accepted by the registry'
        );
        t.deepEqual(
          release.packages.map(pkg => fs.readFileSync(path.join(directory, pkg.filename), 'utf8')),
          originals,
          'retry retains the exact original tarballs'
        );
        t.notOk(
          events.some(event => event.type === 'pack' || event.type === 'checks'),
          'retry never rebuilds'
        );
      });
    }
  }
);

publisherTest(
  'manual publisher waits for delayed registry visibility without uploading twice',
  async t => {
    await withPublisherFixture(async ({prepare, publish, options, registry, state, events}) => {
      const release = prepare();
      const first = release.packages[0];
      const stale = structuredClone(registry.get(first.name));
      const fetchRegistry = options.fetchRegistry;
      let missingReads = 0;
      options.fetchRegistry = async url => {
        const response = await fetchRegistry(url);
        if (
          url.endsWith(encodeURIComponent(first.name)) &&
          state.uploadCount === 1 &&
          missingReads++ < 2
        ) {
          return {...response, json: async () => structuredClone(stale)};
        }
        return response;
      };
      events.length = 0;
      await publish();
      t.deepEqual(
        events.filter(event => event.type === 'upload').map(event => event.name),
        release.packages.map(pkg => pkg.name),
        'publishes every package exactly once despite delayed visibility'
      );
      const waits = events.filter(event => event.type === 'wait').map(event => event.delay);
      t.equal(waits.length, 2, 'waits only for the two missing metadata responses');
      t.ok(waits[0] > 0 && waits[1] > waits[0], 'backs off between visibility checks');
      const firstUpload = events.findIndex(event => event.type === 'upload');
      const nextUpload = events.findIndex(
        event => event.type === 'upload' && event.name !== first.name
      );
      t.equal(
        events.slice(firstUpload, nextUpload).filter(event => event.type === 'wait').length,
        2,
        'finishes verifying the first upload before starting the next'
      );
    });
  }
);

publisherTest(
  'manual publisher bounds visibility polling and stops the next upload on timeout',
  async t => {
    await withPublisherFixture(async ({prepare, publish, options, registry, state, events}) => {
      const release = prepare();
      const first = release.packages[0];
      const stale = structuredClone(registry.get(first.name));
      const fetchRegistry = options.fetchRegistry;
      options.fetchRegistry = async url => {
        const response = await fetchRegistry(url);
        return state.uploadCount === 1 && url.endsWith(encodeURIComponent(first.name))
          ? {...response, json: async () => structuredClone(stale)}
          : response;
      };
      events.length = 0;
      await rejects(
        t,
        publish(),
        /Could not verify.*Retry the same artifacts/,
        'reports exhausted visibility polling'
      );
      t.deepEqual(
        events.filter(event => event.type === 'upload').map(event => event.name),
        [first.name],
        'does not repeat the successful upload or start another package'
      );
      const waits = events.filter(event => event.type === 'wait').map(event => event.delay);
      t.ok(waits.length > 0 && waits.length <= 5, 'limits the number of delayed checks');
      t.ok(
        waits.every(delay => delay > 0),
        'never spins without a delay'
      );
      t.ok(
        waits.reduce((total, delay) => total + delay, 0) <= 31000,
        'bounds the extra wait to 31 seconds per package'
      );
    });
  }
);

publisherTest(
  'manual publisher stops visibility polling immediately on conflicts or registry errors',
  async t => {
    for (const failure of ['integrity', 'registry']) {
      await withPublisherFixture(async ({prepare, publish, options, registry, state, events}) => {
        const release = prepare();
        const first = release.packages[0];
        const stale = structuredClone(registry.get(first.name));
        const fetchRegistry = options.fetchRegistry;
        let postUploadReads = 0;
        options.fetchRegistry = async url => {
          const response = await fetchRegistry(url);
          if (state.uploadCount !== 1 || !url.endsWith(encodeURIComponent(first.name)))
            return response;
          if (postUploadReads++ === 0)
            return {...response, json: async () => structuredClone(stale)};
          if (failure === 'registry') return {ok: false, status: 500};
          const conflict = await response.json();
          conflict.versions[publisherVersion].dist.integrity = 'sha512-different';
          return {...response, json: async () => conflict};
        };
        events.length = 0;
        await rejects(
          t,
          publish(),
          failure === 'integrity' ? /Integrity conflict/ : /HTTP 500/,
          `reports post-upload ${failure} failure`
        );
        t.deepEqual(
          events.filter(event => event.type === 'upload').map(event => event.name),
          [first.name],
          'does not repeat or continue uploads after a hard verification failure'
        );
        t.equal(
          events.filter(event => event.type === 'wait').length,
          1,
          'does not retry the conflict or registry error'
        );
      });
    }
  }
);

publisherTest(
  'manual publisher prevents latest rollback using numeric prerelease ordering',
  async t => {
    for (const latest of ['3.3.0-alpha.23', '3.3.0-alpha.22.1', '3.3.0-beta.1', '3.3.0', '4.0.0']) {
      await withPublisherFixture(async ({prepare, publish, registry, events}) => {
        prepare();
        registry.get('kepler.gl')['dist-tags'].latest = latest;
        registry.get('kepler.gl').versions[latest] = {version: latest};
        events.length = 0;
        await rejects(t, publish(), /newer/, `rejects newer latest ${latest}`);
        t.notOk(
          events.some(event => event.type === 'upload'),
          'does not roll back any package'
        );
      });
    }
    await withPublisherFixture(async ({prepare, publish, registry, events}) => {
      prepare();
      registry.get('kepler.gl')['dist-tags'].latest = '3.3.0-alpha.9';
      registry.get('kepler.gl').versions['3.3.0-alpha.9'] = {version: '3.3.0-alpha.9'};
      events.length = 0;
      await publish();
      t.equal(
        events.filter(event => event.type === 'upload').length,
        3,
        'alpha.22 is newer than alpha.9 numerically'
      );
    });
  }
);

const manualWorkflow = () =>
  require('js-yaml').load(
    fs.readFileSync(path.join(ROOT, '.github/workflows/npmpublish-manual.yml'), 'utf8')
  );

test('manual publisher workflow requires explicit publishing and the original checked artifact', t => {
  const workflow = manualWorkflow();
  const {prepare, publish} = workflow.jobs;
  t.deepEqual(Object.keys(workflow.on), ['workflow_dispatch'], 'no automatic publishing trigger');
  t.equal(
    workflow.on.workflow_dispatch.inputs.publish.default,
    false,
    'manual runs prepare only by default'
  );
  t.deepEqual(
    workflow.permissions,
    {contents: 'read'},
    'default permissions cannot request publishing credentials'
  );
  t.notOk(prepare.permissions?.['id-token'], 'build job cannot authenticate to npm with OIDC');
  t.equal(publish.permissions['id-token'], 'write', 'only publishing job requests OIDC');
  t.equal(publish.environment, 'npm-release', 'OIDC publishing uses the protected environment');
  t.notOk(prepare.environment, 'preparation does not require the publishing environment');
  t.ok(publish['timeout-minutes'] >= 120, 'allows bounded registry polling across all 24 packages');
  t.equal(
    publish.if,
    "inputs.publish && github.ref == 'refs/heads/master' && github.repository == 'keplergl/kepler.gl'",
    'publishing is restricted to explicit runs on canonical master'
  );
  t.equal(publish.needs, 'prepare', 'publication requires successful preparation');
  t.equal(
    workflow.concurrency['cancel-in-progress'],
    false,
    'a new run never cancels an active upload'
  );
  const upload = prepare.steps.find(step => step.uses?.startsWith('actions/upload-artifact@'));
  const download = publish.steps.find(step => step.uses?.startsWith('actions/download-artifact@'));
  t.equal(
    upload.with.name,
    'npm-release-${{ github.run_id }}',
    'rerunning all jobs cannot select a differently named rebuilt artifact'
  );
  t.equal(upload.with.overwrite, false, 'rerunning preparation cannot replace saved tarballs');
  t.equal(
    prepare.outputs['artifact-id'],
    '${{ steps.artifacts.outputs.artifact-id }}',
    'build exports its immutable artifact ID'
  );
  t.equal(
    download.with['artifact-ids'],
    '${{ needs.prepare.outputs.artifact-id }}',
    'retry downloads the original successful build artifact'
  );
  t.equal(
    download.with['merge-multiple'],
    true,
    'tarballs are downloaded directly into the expected directory'
  );
  for (const job of Object.values(workflow.jobs)) {
    for (const step of job.steps.filter(step => step.uses)) {
      t.ok(/^[^@]+@[a-f0-9]{40}$/.test(step.uses), 'actions are pinned to immutable commits');
    }
    t.notOk(job['continue-on-error'], 'job failures block publication');
    t.notOk(
      job.steps.some(step => step['continue-on-error']),
      'step failures block publication'
    );
  }
  t.end();
});

test('manual publisher workflow rejects absent or malformed original artifact IDs', t => {
  const steps = manualWorkflow().jobs.publish.steps;
  const index = steps.findIndex(step => step.name === 'Require the original artifact ID');
  const guard = steps[index];
  t.ok(
    steps[index + 1].uses.startsWith('actions/download-artifact@'),
    'validates ID before download can fall back to all artifacts'
  );
  t.equal(
    guard.env.RELEASE_ARTIFACT_ID,
    '${{ needs.prepare.outputs.artifact-id }}',
    'validates the actual saved ID'
  );
  for (const id of ['1', '12345678901234567890', '', '0', '-1', '1,2', 'abc', '1\n', ' 1', '01']) {
    const result = spawnSync('/bin/bash', ['-e', '-o', 'pipefail', '-c', guard.run], {
      encoding: 'utf8',
      env: {...process.env, RELEASE_ARTIFACT_ID: id}
    });
    t.equal(
      result.status === 0,
      ['1', '12345678901234567890'].includes(id),
      `validates ${JSON.stringify(id)}`
    );
  }
  t.end();
});

test('manual publisher workflow checks that the legacy publisher is disabled and idle', t => {
  const workflow = manualWorkflow();
  const steps = workflow.jobs.publish.steps;
  const guardIndex = steps.findIndex(
    step => step.name === 'Require the legacy publisher to be disabled and idle'
  );
  const guard = steps[guardIndex];
  t.ok(
    steps[guardIndex + 1].run.startsWith('node scripts/publish-release.js publish '),
    'checks legacy publisher immediately before upload'
  );
  t.equal(guard.env.GH_TOKEN, '${{ github.token }}', 'read API token is scoped to the guard');
  t.notOk(
    steps[guardIndex + 1].env?.GH_TOKEN,
    'publish command does not receive the GitHub API token'
  );
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'kepler-publish-guard-'));
  try {
    const gh = path.join(directory, 'gh');
    fs.writeFileSync(
      gh,
      `#!/usr/bin/env node
if (process.env.MOCK_FAIL) process.exit(17);
if (process.argv.includes('.state')) {
  console.log(process.env.MOCK_STATE);
  process.exit();
}
if (process.env.MOCK_FAIL_LIST) process.exit(17);
if (!process.argv.includes('--paginate') || !process.argv.includes('--slurp') || process.argv.some(value => value.includes('status='))) process.exit(18);
console.log(process.env.MOCK_PAGES || JSON.stringify([{workflow_runs: [{status: 'completed'}]}]));
`
    );
    fs.chmodSync(gh, 0o755);
    const run = overrides =>
      spawnSync('/bin/bash', ['-e', '-o', 'pipefail', '-c', guard.run], {
        encoding: 'utf8',
        timeout: 30000,
        env: {
          ...process.env,
          PATH: `${directory}${path.delimiter}${process.env.PATH}`,
          GITHUB_REPOSITORY: 'keplergl/kepler.gl',
          MOCK_STATE: 'disabled_manually',
          ...overrides
        }
      });
    t.equal(run({}).status, 0, 'allows disabled and idle legacy publisher');
    t.equal(
      run({MOCK_PAGES: JSON.stringify([{workflow_runs: []}])}).status,
      0,
      'allows no historical runs'
    );
    t.equal(
      run({
        MOCK_PAGES: JSON.stringify([
          {workflow_runs: [{status: 'completed'}]},
          {workflow_runs: [{status: 'completed'}]}
        ])
      }).status,
      0,
      'checks all pages without treating multiple idle pages as active'
    );
    for (const state of ['active', 'disabled_inactivity', 'null', '']) {
      t.notEqual(
        run({MOCK_STATE: state}).status,
        0,
        `rejects legacy state ${JSON.stringify(state)}`
      );
    }
    for (const status of ['queued', 'in_progress', 'waiting', 'pending', 'requested', 'unknown']) {
      t.notEqual(
        run({
          MOCK_PAGES: JSON.stringify([
            {workflow_runs: [{status: 'completed'}]},
            {workflow_runs: [{status}]}
          ])
        }).status,
        0,
        `rejects ${status} legacy runs on a later page`
      );
    }
    t.notEqual(run({MOCK_FAIL: '1'}).status, 0, 'API failure blocks publication');
    t.notEqual(
      run({MOCK_FAIL_LIST: '1'}).status,
      0,
      'pagination request failure blocks publication'
    );
    for (const pages of ['not JSON', '[]', '{}', '[{}]', '[{"workflow_runs":[{}]}]']) {
      t.notEqual(run({MOCK_PAGES: pages}).status, 0, 'malformed run metadata blocks publication');
    }
  } finally {
    fs.rmSync(directory, {recursive: true, force: true});
  }
  const selection = workflow.jobs.prepare.steps.find(
    step => step.name === 'Validate publish selection'
  );
  t.equal(
    workflow.jobs.prepare.steps[0],
    selection,
    'rejects unsafe rebuilds before any actions run'
  );
  t.equal(selection.if, 'inputs.publish', 'preparation-only runs remain retryable');
  for (const [ref, repository, attempt, success] of [
    ['refs/heads/master', 'keplergl/kepler.gl', '1', true],
    ['refs/heads/other', 'keplergl/kepler.gl', '1', false],
    ['refs/heads/master', 'other/kepler.gl', '1', false],
    ['refs/heads/master', 'keplergl/kepler.gl', '2', false],
    ['refs/heads/master', 'keplergl/kepler.gl', '3', false],
    ['refs/heads/master', 'keplergl/kepler.gl', '', false]
  ]) {
    const result = spawnSync('/bin/bash', ['-e', '-o', 'pipefail', '-c', selection.run], {
      encoding: 'utf8',
      env: {
        ...process.env,
        GITHUB_REF: ref,
        GITHUB_REPOSITORY: repository,
        GITHUB_RUN_ATTEMPT: attempt
      }
    });
    t.equal(
      result.status === 0,
      success,
      `validates publish selection ${repository}/${ref} attempt ${attempt}`
    );
  }
  t.end();
});
