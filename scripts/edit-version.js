// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import fs from 'fs';
import {resolve, join} from 'path';
import {logSuccess, logProgress, logStep} from './log';

const KeplerPackage = require('../package');
const exampleDir = resolve('./examples');
// edit package.json in examples

function readWritePackage(file, version) {
  fs.readFile(file, (err, data) => {
    if (err) throw err;
    const PackageContent = JSON.parse(data);
    PackageContent.dependencies['kepler.gl'] = `^${version}`;
    const out = JSON.stringify(PackageContent, null, 2);

    fs.writeFile(file, out, error => {
      if (error) throw error;
      logStep(`   ## Edit ${file} success.`);
    });
  });
}

function editExamplePackageJson(version) {
  logProgress(
    '\n============= Start Editing examples package.json =================\n'
  );

  fs.readdir(exampleDir, (err, items) => {
    if (err) throw err;

    for (let i = 0; i < items.length; i++) {
      // for each example folder
      const packageJsonPath = join(exampleDir, items[i], 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        readWritePackage(packageJsonPath, version);
      }
    }
  });
}

function editUMDPackage(version) {
  logProgress(
    '\n============= Start Editing umd package version =================\n'
  );
  const htmlFile = join(exampleDir, 'umd-client', 'index.html');
  fs.readFile(htmlFile, 'utf8', (err, html) => {
    if (err) throw err;

    const out = html.replace(
      /kepler\.gl@\d+.\d+.\d+\/umd/,
      `kepler.gl@${version}/umd`
    );
    fs.writeFile(htmlFile, out, error => {
      if (error) throw error;
      logStep(`   ## Edit ${htmlFile} success.`);
    });
  });
}

(function main() {
  const KeplerGlVersion = KeplerPackage.version;

  editExamplePackageJson(KeplerGlVersion);
  editUMDPackage(KeplerGlVersion);

  logSuccess(
    `\n================= Edit example kepler.gl version to ${KeplerGlVersion} Success! =================\n`
  );
})();
