// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {execFileSync} from 'child_process';
import path from 'path';

// Use plain Node: Jest's ESM aliases and Babel register hide export-map failures.
test('CommonJS packages load and read Zarr with unpatched ESM dependencies', () => {
  expect(
    execFileSync(process.execPath, [path.join(__dirname, 'fixtures/zarr-package-consumer.cjs')], {
      env: {...process.env, NODE_ENV: 'production', BABEL_ENV: 'production', NODE_OPTIONS: ''},
      timeout: 90000,
      encoding: 'utf8',
      stdio: 'pipe'
    })
  ).toContain('CommonJS Zarr consumer passed');
}, 100000);
