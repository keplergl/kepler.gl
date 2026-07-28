// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

const {execSync} = require('child_process');
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const newVersion = process.argv[2];

if (!newVersion) {
  console.error('Usage: node scripts/bump-version.js <new-version>');
  console.error('Example: node scripts/bump-version.js 3.3.0-alpha.4');
  process.exit(1);
}

// Run lerna to bump all src/* workspace packages
console.log(`\nBumping workspace packages to ${newVersion}...`);
execSync(
  `yarn lerna version ${newVersion} --no-git-tag-version --no-push --exact --yes --sync-dist-version --allow-branch '**'`,
  {stdio: 'inherit', cwd: repoRoot}
);

// Update root package.json: version + any @kepler.gl/* dependency references
const rootPkgPath = path.resolve(__dirname, '../package.json');
const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8'));
const oldVersion = rootPkg.version;

rootPkg.version = newVersion;

const depFields = ['dependencies', 'devDependencies', 'peerDependencies', 'resolutions'];
for (const field of depFields) {
  if (!rootPkg[field]) continue;
  for (const name of Object.keys(rootPkg[field])) {
    if (name.startsWith('@kepler.gl/') && rootPkg[field][name] === oldVersion) {
      rootPkg[field][name] = newVersion;
    }
  }
}

fs.writeFileSync(rootPkgPath, JSON.stringify(rootPkg, null, 2) + '\n');
console.log(`Updated root package.json: ${oldVersion} => ${newVersion}`);

// Re-run yarn install so the lockfile is properly resolved (Lerna's internal
// lockfile sync creates imperfect entries for workspace packages; this cleans them up)
console.log('\nRunning yarn install to clean up yarn.lock...');
execSync('yarn install', {stdio: 'inherit', cwd: repoRoot});
console.log('\nDone. Review the changes, then commit and push.');
