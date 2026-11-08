/** @jest-environment node */

// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {execFileSync} from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import {transformSync} from '@babel/core';

const root = path.resolve(__dirname, '../..');
const extensions = ['js', 'jsx', 'ts', 'tsx'];

// Exercise the real Babel configuration: Jest's own exclusions cannot prevent
// the explicit Istanbul plugin from instrumenting tests and setup files.
test.each([
  ...extensions.map(extension => [`src/utils/src/example.${extension}`, true]),
  ...extensions.flatMap(extension =>
    ['spec', 'test'].map(kind => [`src/utils/src/example.${kind}.${extension}`, false])
  ),
  ['src/utils/src/example.d.ts', false],
  ['src/utils/dist/cjs/index.js', false],
  ['src/tasks/src/index.ts', false],
  ['src/styles/src/index.ts', false],
  ['test/node/example-test.js', false],
  ['jest.setup.js', false]
])('Babel coverage eligibility for %s is %s', (filename, instrumented) => {
  const result = transformSync('export const value = 1;', {
    filename: path.join(root, filename),
    envName: 'test'
  });
  expect(result.code.includes('__coverage__')).toBe(instrumented);
});

test('Jest reports unexecuted source without counting tests or declarations', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'kepler-coverage-scope-'));
  try {
    const sourceDirectory = path.join(directory, 'src/utils/src');
    fs.mkdirSync(sourceDirectory, {recursive: true});
    for (const extension of extensions) {
      fs.writeFileSync(
        path.join(sourceDirectory, `unused.${extension}`),
        'export const value = 1;'
      );
    }
    for (const workspace of ['tasks', 'styles', 'templates']) {
      const excluded = path.join(directory, 'src', workspace, 'src');
      fs.mkdirSync(excluded, {recursive: true});
      fs.writeFileSync(path.join(excluded, 'index.js'), 'export const value = 1;');
    }
    fs.writeFileSync(
      path.join(sourceDirectory, 'types.d.ts'),
      'export declare const value: number;'
    );
    fs.writeFileSync(
      path.join(sourceDirectory, 'example.spec.js'),
      "test('fixture', () => expect(1).toBe(1));"
    );
    const config = {
      ...require('../../jest.config'),
      rootDir: directory,
      testEnvironment: 'node',
      setupFilesAfterEnv: [],
      moduleNameMapper: {},
      transform: {
        '\\.[jt]sx?$': [
          require.resolve('babel-jest'),
          {configFile: path.join(root, 'babel.config.js'), babelrc: false}
        ]
      },
      collectCoverage: true,
      coverageDirectory: path.join(directory, 'coverage'),
      coverageReporters: ['json'],
      cache: false
    };
    execFileSync(
      process.execPath,
      [require.resolve('jest/bin/jest'), '--config', JSON.stringify(config), '--runInBand'],
      {cwd: directory, stdio: 'pipe', timeout: 30000}
    );
    const coverage = JSON.parse(
      fs.readFileSync(path.join(directory, 'coverage/coverage-final.json'), 'utf8')
    );
    expect(
      Object.keys(coverage)
        .map(filename => path.basename(filename))
        .sort()
    ).toEqual(extensions.map(extension => `unused.${extension}`).sort());
    for (const entry of Object.values(coverage)) {
      expect(Object.keys(entry.s).length).toBeGreaterThan(0);
      expect(Object.values(entry.s).every(count => count === 0)).toBe(true);
    }
  } finally {
    fs.rmSync(directory, {recursive: true, force: true});
  }
});
