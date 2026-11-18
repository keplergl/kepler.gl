// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

const {execFileSync} = require('child_process');
const fs = require('fs');
const path = require('path');

const usage = 'Usage: yarn release:prepare <version> (example: 3.3.0-alpha.23)';
// Lerna strips +build metadata, while bump-version keeps it in the root manifest.
// Reject it here so root and workspace versions cannot diverge for that input.
const versionPattern =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([\da-zA-Z-]+(?:\.[\da-zA-Z-]+)*))?$/;

function isVersion(value) {
  const match = typeof value === 'string' && value.match(versionPattern);
  return Boolean(
    match &&
      match[0] === value &&
      (!match[4] || !match[4].split('.').some(part => /^0\d+$/.test(part)))
  );
}

function prepareRelease(
  version,
  {repoRoot = path.resolve(__dirname, '..'), date = new Date()} = {}
) {
  // The existing bump script uses a shell command, so accept only exact versions.
  if (!isVersion(version)) {
    throw new Error(`Expected an exact semantic version without build metadata. ${usage}`);
  }

  const changelogPath = path.join(repoRoot, 'CHANGELOG.md');
  const changelog = fs.readFileSync(changelogPath, 'utf8');
  const sections = [...changelog.matchAll(/^## \[([^\]]+)\]/gm)];
  if (!sections.length || !isVersion(sections[0][1])) {
    throw new Error('CHANGELOG.md must start its release history with a version heading.');
  }
  if (sections.some(section => section[1] === version)) {
    throw new Error(`CHANGELOG.md already contains version ${version}.`);
  }

  const previousVersion = sections[0][1];
  const tag = `v${previousVersion}`;
  const git = args => execFileSync('git', args, {cwd: repoRoot, encoding: 'utf8', stdio: 'pipe'});
  let baseline;
  try {
    baseline = git(['rev-parse', '--verify', `refs/tags/${tag}^{commit}`]).trim();
  } catch {
    throw new Error(`Missing release tag ${tag}. Run git fetch --tags before preparing a release.`);
  }
  try {
    git(['merge-base', '--is-ancestor', baseline, 'HEAD']);
  } catch {
    throw new Error(`Release tag ${tag} is not an ancestor of HEAD. Check out the release branch.`);
  }

  const commits = git(['log', '--format=- %h %s', `${baseline}..HEAD`]).trimEnd();
  if (!commits) {
    throw new Error(`No commits since ${tag}; there is nothing to add to the changelog.`);
  }
  const month = date.toLocaleString('en-US', {month: 'short'});
  const heading = `## [${version}] - ${month} ${date.getDate()} ${date.getFullYear()}`;
  const insertion = sections[0].index;
  const updated = `${changelog.slice(0, insertion)}${heading}\n\n${commits}\n\n${changelog.slice(
    insertion
  )}`;

  console.log(`Preparing ${version} with commits since ${tag}...`);
  execFileSync('yarn', ['bump-version', version], {cwd: repoRoot, stdio: 'inherit'});
  fs.writeFileSync(changelogPath, updated);
  console.log('Running release checks...');
  try {
    execFileSync('yarn', ['release:check'], {cwd: repoRoot, stdio: 'inherit'});
  } catch {
    throw new Error(
      'Release checks failed. Prepared changes are preserved. Fix the errors, then run yarn release:check.'
    );
  }
  console.log(`Updated CHANGELOG.md for ${version}. Review the version and changelog changes.`);
}

if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length === 1 && ['--help', '-h'].includes(args[0])) {
    console.log(usage);
    console.log('Uses the first CHANGELOG.md release heading and its local v<version> Git tag.');
    console.log('Runs yarn release:check after preparing the version and changelog changes.');
  } else {
    try {
      if (args.length !== 1) throw new Error(usage);
      prepareRelease(args[0]);
    } catch (error) {
      console.error(error.message);
      process.exitCode = 1;
    }
  }
}

module.exports = {prepareRelease};
