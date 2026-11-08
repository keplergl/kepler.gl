// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import fs from 'fs';
import {resolve, join} from 'path';
import {logSuccess, logProgress, logStep} from './log';

const KeplerPackage = require('../package');
const exampleDir = resolve('./examples');
const dependencyFields = [
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'optionalDependencies'
];
const versionRange = /^([~^]?)\d+\.\d+\.\d+(?:-[\da-zA-Z.-]+)?(?:\+[\da-zA-Z.-]+)?$/;

function readWritePackage(file, version) {
  const packageContent = JSON.parse(fs.readFileSync(file, 'utf8'));
  let changed = false;

  for (const field of dependencyFields) {
    for (const [name, range] of Object.entries(packageContent[field] || {})) {
      if (name !== 'kepler.gl' && !name.startsWith('@kepler.gl/')) continue;
      // Keep local workspace/file references and other non-version specifiers intact.
      const match = range.match(versionRange);
      if (!match) continue;
      const nextRange = `${match[1]}${version}`;
      if (range !== nextRange) {
        packageContent[field][name] = nextRange;
        changed = true;
      }
    }
  }

  if (changed) {
    fs.writeFileSync(file, `${JSON.stringify(packageContent, null, 2)}\n`);
    logStep(`   ## Edit ${file} success.`);
  }
}

function editExamplePackageJson(version) {
  logProgress('\n============= Start Editing examples package.json =================\n');

  for (const item of fs.readdirSync(exampleDir)) {
    const packageJsonPath = join(exampleDir, item, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      readWritePackage(packageJsonPath, version);
    }
  }
}

function editUMDPackage(version) {
  logProgress('\n============= Start Editing umd package version =================\n');
  const htmlFile = join(exampleDir, 'umd-client', 'index.html');
  const html = fs.readFileSync(htmlFile, 'utf8');
  const out = html.replace(
    /kepler\.gl@\d+\.\d+\.\d+(?:-[\da-zA-Z.-]+)?(?:\+[\da-zA-Z.-]+)?\/umd\//g,
    `kepler.gl@${version}/umd/`
  );
  if (out !== html) {
    fs.writeFileSync(htmlFile, out);
    logStep(`   ## Edit ${htmlFile} success.`);
  }
}

(function main() {
  const KeplerGlVersion = KeplerPackage.version;

  editExamplePackageJson(KeplerGlVersion);
  editUMDPackage(KeplerGlVersion);

  logSuccess(
    `\n================= Edit example kepler.gl version to ${KeplerGlVersion} Success! =================\n`
  );
  logStep(
    'Refresh and review each changed example lockfile after the target packages are published.'
  );
})();
