// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

const {execFileSync} = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const REGISTRY = 'https://registry.npmjs.org/';
const TAG = 'latest';
const usage =
  'Usage: node scripts/publish-release.js <prepare|publish> <version> <artifact-directory>';
const npmOptions = ['--workspaces=false', '--ignore-scripts', `--registry=${REGISTRY}`];

function parseVersion(value) {
  const match =
    typeof value === 'string' &&
    value.match(
      /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([\da-zA-Z-]+(?:\.[\da-zA-Z-]+)*))?(?:\+[\da-zA-Z-]+(?:\.[\da-zA-Z-]+)*)?$/
    );
  if (
    !match ||
    match[0] !== value ||
    (match[4] && match[4].split('.').some(id => /^0\d+$/.test(id)))
  ) {
    throw new Error(`Invalid release version: ${value}`);
  }
  return {numbers: match.slice(1, 4).map(BigInt), prerelease: match[4]?.split('.')};
}

function compareVersions(left, right) {
  const a = parseVersion(left);
  const b = parseVersion(right);
  for (let i = 0; i < 3; i++) {
    if (a.numbers[i] !== b.numbers[i]) return a.numbers[i] > b.numbers[i] ? 1 : -1;
  }
  if (!a.prerelease || !b.prerelease) return Number(!a.prerelease) - Number(!b.prerelease);
  for (let i = 0; i < Math.max(a.prerelease.length, b.prerelease.length); i++) {
    const x = a.prerelease[i];
    const y = b.prerelease[i];
    if (x === y) continue;
    if (x === undefined || y === undefined) return x === undefined ? -1 : 1;
    const numericX = /^\d+$/.test(x);
    const numericY = /^\d+$/.test(y);
    if (numericX !== numericY) return numericX ? -1 : 1;
    return (numericX ? BigInt(x) > BigInt(y) : x > y) ? 1 : -1;
  }
  return 0;
}

function readPackages(repoRoot, version) {
  parseVersion(version);
  if (version.includes('+')) throw new Error('Release versions must not contain build metadata.');
  const root = JSON.parse(fs.readFileSync(path.join(repoRoot, 'package.json'), 'utf8'));
  if (root.name !== 'kepler.gl' || !Array.isArray(root.workspaces) || !root.workspaces.length) {
    throw new Error('Expected the kepler.gl workspace root.');
  }
  const packages = root.workspaces
    .map(directory => {
      const cwd = fs.realpathSync(path.resolve(repoRoot, directory));
      const relative = path.relative(fs.realpathSync(repoRoot), cwd);
      if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) {
        throw new Error(`Workspace is outside the repository: ${directory}`);
      }
      return {cwd, manifest: JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8'))};
    })
    .filter(pkg => !pkg.manifest.private);
  packages.push({cwd: repoRoot, manifest: root});
  const names = new Set();
  for (const {manifest} of packages) {
    if (manifest.version !== version)
      throw new Error(`Version mismatch for ${manifest.name}: expected ${version}.`);
    if (typeof manifest.name !== 'string' || names.has(manifest.name))
      throw new Error('Missing or duplicate package name.');
    names.add(manifest.name);
    const allowedConfig = {registry: REGISTRY, tag: TAG, access: 'public'};
    for (const [key, value] of Object.entries(manifest.publishConfig || {})) {
      if (allowedConfig[key] !== value)
        throw new Error(`Unsupported publishConfig.${key} for ${manifest.name}.`);
    }
  }
  return packages;
}

function sourceCommit(repoRoot, run) {
  const commit = run('git', ['rev-parse', 'HEAD'], {cwd: repoRoot, encoding: 'utf8'}).trim();
  if (!/^[a-f0-9]{40}$/.test(commit)) throw new Error('Expected a full Git commit SHA.');
  return commit;
}

function integrity(file) {
  if (!fs.lstatSync(file).isFile()) throw new Error(`Expected a regular tarball: ${file}`);
  return `sha512-${crypto.createHash('sha512').update(fs.readFileSync(file)).digest('base64')}`;
}

function tarballPath(directory, filename) {
  if (typeof filename !== 'string' || !/^[a-zA-Z0-9][a-zA-Z0-9._-]*\.tgz$/.test(filename)) {
    throw new Error('Invalid artifact filename.');
  }
  return path.join(directory, filename);
}

function publishArgs(file, dryRun, name) {
  return [
    'publish',
    file,
    ...npmOptions,
    ...(name.startsWith('@') ? [`--${name.split('/')[0]}:registry=${REGISTRY}`] : []),
    '--access=public',
    `--tag=${TAG}`,
    dryRun ? '--dry-run' : '--dry-run=false'
  ];
}

function prepareReleaseArtifacts(version, directory, {repoRoot = ROOT, run = execFileSync} = {}) {
  repoRoot = fs.realpathSync(repoRoot);
  const packages = readPackages(repoRoot, version);
  const commit = sourceCommit(repoRoot, run);
  fs.mkdirSync(directory, {recursive: true});
  directory = fs.realpathSync(directory);
  const relative = path.relative(repoRoot, directory);
  if (!relative || (!relative.startsWith('..') && !path.isAbsolute(relative))) {
    throw new Error('Artifacts must be outside the repository so the bundle cannot include them.');
  }
  if (fs.readdirSync(directory).length)
    throw new Error('Artifact directory must be empty; do not overwrite a previous release.');

  // The bundle check rebuilds workspaces too: pack only after BOTH checks pass.
  run(process.execPath, [path.join(repoRoot, 'scripts/check-release.js')], {
    cwd: repoRoot,
    stdio: 'inherit'
  });
  readPackages(repoRoot, version);
  const artifacts = [];
  for (const {cwd, manifest} of packages) {
    const manifestPath = path.join(cwd, 'package.json');
    const original = fs.readFileSync(manifestPath, 'utf8');
    let packed;
    try {
      if (cwd === repoRoot) {
        const bundle = JSON.parse(original);
        delete bundle.private;
        fs.writeFileSync(manifestPath, `${JSON.stringify(bundle, null, 2)}\n`);
      }
      packed = JSON.parse(
        run('npm', ['pack', '--json', ...npmOptions, '--pack-destination', directory], {
          cwd,
          encoding: 'utf8',
          maxBuffer: 64 * 1024 * 1024
        })
      );
    } finally {
      if (cwd === repoRoot) fs.writeFileSync(manifestPath, original);
    }
    if (
      !Array.isArray(packed) ||
      packed.length !== 1 ||
      packed[0].name !== manifest.name ||
      packed[0].version !== version
    ) {
      throw new Error(`Unexpected packed package for ${manifest.name}.`);
    }
    const {filename} = packed[0];
    const digest = integrity(tarballPath(directory, filename));
    if (digest !== packed[0].integrity || artifacts.some(item => item.filename === filename)) {
      throw new Error(`Invalid packed artifact for ${manifest.name}.`);
    }
    artifacts.push({name: manifest.name, version, filename, integrity: digest});
  }
  // Validate the actual tarballs without running build hooks again.
  for (const artifact of artifacts) {
    run('npm', publishArgs(tarballPath(directory, artifact.filename), true, artifact.name), {
      cwd: directory,
      stdio: 'inherit'
    });
  }
  const release = {schema: 1, version, commit, registry: REGISTRY, tag: TAG, packages: artifacts};
  fs.writeFileSync(path.join(directory, 'release.json'), `${JSON.stringify(release, null, 2)}\n`);
  console.log(`Prepared ${artifacts.length} packages at ${commit}. Nothing was published.`);
  return release;
}

async function registryState(artifact, fetchRegistry) {
  // Read the existing public package, not a version URL: a 404 must never be
  // mistaken for permission to publish. Only a missing key in a valid package
  // document means this version has not been published yet.
  const response = await fetchRegistry(REGISTRY + encodeURIComponent(artifact.name), {
    headers: {accept: 'application/vnd.npm.install-v1+json'},
    cache: 'no-store',
    signal: AbortSignal.timeout(30000),
    redirect: 'error'
  });
  if (!response.ok)
    throw new Error(`Cannot inspect ${artifact.name}: registry HTTP ${response.status}.`);
  const metadata = await response.json();
  if (
    !metadata ||
    metadata.name !== artifact.name ||
    !metadata.versions ||
    Array.isArray(metadata.versions) ||
    typeof metadata.versions !== 'object' ||
    !Object.keys(metadata.versions).length ||
    !metadata['dist-tags'] ||
    Array.isArray(metadata['dist-tags']) ||
    typeof metadata['dist-tags'] !== 'object'
  ) {
    throw new Error(`Invalid registry metadata for ${artifact.name}.`);
  }
  const latest = metadata['dist-tags'][TAG];
  if (
    latest !== undefined &&
    (!Object.hasOwn(metadata.versions, latest) || metadata.versions[latest]?.version !== latest)
  ) {
    throw new Error(`Inconsistent registry tags for ${artifact.name}.`);
  }
  if (latest !== undefined && compareVersions(latest, artifact.version) > 0) {
    throw new Error(
      `${artifact.name}: ${TAG} is already newer (${latest}); refusing an outdated release.`
    );
  }
  if (!Object.hasOwn(metadata.versions, artifact.version)) return false;
  const published = metadata.versions[artifact.version];
  if (
    !published ||
    published.version !== artifact.version ||
    published.dist?.integrity !== artifact.integrity
  ) {
    throw new Error(
      `Integrity conflict for ${artifact.name}@${artifact.version}; nothing will be overwritten.`
    );
  }
  if (latest !== artifact.version) {
    throw new Error(
      `${artifact.name}@${artifact.version} exists but ${TAG} points elsewhere; review tags manually.`
    );
  }
  return true;
}

async function publishReleaseArtifacts(
  version,
  directory,
  {repoRoot = ROOT, run = execFileSync, fetchRegistry = global.fetch} = {}
) {
  directory = fs.realpathSync(directory);
  const packages = readPackages(repoRoot, version);
  const release = JSON.parse(fs.readFileSync(path.join(directory, 'release.json'), 'utf8'));
  if (
    release.schema !== 1 ||
    release.version !== version ||
    release.commit !== sourceCommit(repoRoot, run) ||
    release.registry !== REGISTRY ||
    release.tag !== TAG ||
    !Array.isArray(release.packages) ||
    release.packages.length !== packages.length
  ) {
    throw new Error('Release artifact does not match the version, source commit, or package set.');
  }
  const filenames = new Set();
  // Validate ALL files before any registry requests or uploads.
  for (let i = 0; i < packages.length; i++) {
    const artifact = release.packages[i];
    if (
      !artifact ||
      artifact.name !== packages[i].manifest.name ||
      artifact.version !== version ||
      filenames.has(artifact.filename) ||
      integrity(tarballPath(directory, artifact.filename)) !== artifact.integrity
    ) {
      throw new Error(`Invalid or modified artifact for ${packages[i].manifest.name}.`);
    }
    filenames.add(artifact.filename);
  }
  // A conflict or unavailable registry for even the last package blocks ALL uploads.
  for (const artifact of release.packages) await registryState(artifact, fetchRegistry);
  for (const artifact of release.packages) {
    // Recheck just before each upload, including on retries after an ambiguous failure.
    if (await registryState(artifact, fetchRegistry)) {
      console.log(`Skipping identical published package ${artifact.name}@${version}.`);
      continue;
    }
    const file = tarballPath(directory, artifact.filename);
    if (integrity(file) !== artifact.integrity)
      throw new Error(`Artifact changed before publishing ${artifact.name}.`);
    run('npm', publishArgs(file, false, artifact.name), {cwd: directory, stdio: 'inherit'});
  }
  console.log(
    `npm accepted all ${release.packages.length} packages at ${version} on ${TAG}. New uploads may still be processing.`
  );
}

if (require.main === module) {
  const [mode, version, directory, ...extra] = process.argv.slice(2);
  Promise.resolve()
    .then(() => {
      if (mode === '--help' && version === undefined) {
        console.log(usage);
        return;
      }
      if (!version || !directory || extra.length || !['prepare', 'publish'].includes(mode))
        throw new Error(usage);
      return mode === 'prepare'
        ? prepareReleaseArtifacts(version, directory)
        : publishReleaseArtifacts(version, directory);
    })
    .catch(error => {
      console.error(error.message);
      process.exitCode = 1;
    });
}

module.exports = {prepareReleaseArtifacts, publishReleaseArtifacts};
