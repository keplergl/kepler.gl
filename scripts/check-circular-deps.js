#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * Fails on circular imports that span more than one workspace package.
 * Intra-package cycles are reported but do not fail (there are many today).
 */
const fs = require('fs');
const path = require('path');
const madge = require('madge');

const root = path.join(__dirname, '..');
const srcDir = path.join(root, 'src');

const entries = fs
  .readdirSync(srcDir, {withFileTypes: true})
  .filter(dirent => dirent.isDirectory())
  .map(dirent => path.join(srcDir, dirent.name, 'src', 'index.ts'))
  .filter(file => fs.existsSync(file));

function packageName(file) {
  // madge paths are relative to src/, e.g. "components/src/kepler-gl.tsx"
  return file.replace(/\\/g, '/').split('/')[0];
}

madge(entries, {
  fileExtensions: ['ts', 'tsx'],
  excludeRegExp: [/[\\/]dist[\\/]/, /\.d\.ts$/],
  tsConfig: path.join(root, 'tsconfig.json')
})
  .then(res => {
    const circular = res.circular();
    const crossPackage = circular.filter(cycle => {
      const packages = new Set(cycle.map(packageName));
      return packages.size > 1;
    });

    if (circular.length) {
      const message = `${circular.length} intra-package circular dependenc${
        circular.length === 1 ? 'y' : 'ies'
      } (not failing CI)`;
      if (process.env.GITHUB_ACTIONS) {
        console.log(`::warning::${message}`);
      } else {
        console.warn(message);
      }
    }

    if (crossPackage.length) {
      console.error(
        `\nFound ${crossPackage.length} cross-package circular dependenc${
          crossPackage.length === 1 ? 'y' : 'ies'
        }:\n`
      );
      crossPackage.forEach((cycle, index) => {
        console.error(`${index + 1}) ${cycle.join(' > ')}`);
      });
      process.exit(1);
    }

    console.log('No cross-package circular dependencies.');
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
