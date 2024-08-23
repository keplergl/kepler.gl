// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

const {existsSync} = require('fs');
const {execSync} = require('child_process');

const folder = process.argv[2];
const script = process.argv[3];

const cmd = !existsSync(`${folder}/node_modules`) ? `yarn && yarn ${script}` : `yarn ${script}`;

execSync(cmd, {
  cwd: folder,
  stdio: 'inherit'
});
