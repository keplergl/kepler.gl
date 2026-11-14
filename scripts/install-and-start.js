// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

const {existsSync, writeFileSync} = require('fs');
const {execSync} = require('child_process');

const folder = process.argv[2];
const script = process.argv[3];

// Mark standalone examples as separate Yarn projects without replacing existing locks.
if (!existsSync(`${folder}/yarn.lock`)) {
  writeFileSync(`${folder}/yarn.lock`, '', {flag: 'wx'});
}

const cmd = !existsSync(`${folder}/node_modules`) ? `yarn && yarn ${script}` : `yarn ${script}`;

execSync(cmd, {
  cwd: folder,
  stdio: 'inherit'
});
