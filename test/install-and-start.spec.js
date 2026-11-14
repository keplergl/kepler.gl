// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

const {readFileSync} = require('fs');
const {join} = require('path');
const {runInNewContext} = require('vm');

const source = readFileSync(join(__dirname, '../scripts/install-and-start.js'), 'utf8');

function run({hasLock = false, hasModules = false} = {}) {
  const writeFileSync = jest.fn();
  const execSync = jest.fn();
  runInNewContext(source, {
    process: {argv: ['node', 'install-and-start.js', 'examples/template', 'start-local']},
    require: name =>
      name === 'fs'
        ? {
            existsSync: path => (path.endsWith('/yarn.lock') ? hasLock : hasModules),
            writeFileSync
          }
        : {execSync}
  });
  return {writeFileSync, execSync};
}

test('creates a standalone project boundary before installing a fresh template', () => {
  const {writeFileSync, execSync} = run();
  expect(writeFileSync).toHaveBeenCalledWith('examples/template/yarn.lock', '', {flag: 'wx'});
  expect(execSync).toHaveBeenCalledWith('yarn && yarn start-local', {
    cwd: 'examples/template',
    stdio: 'inherit'
  });
  expect(writeFileSync.mock.invocationCallOrder[0]).toBeLessThan(
    execSync.mock.invocationCallOrder[0]
  );
});

test('preserves an existing lockfile when installing dependencies', () => {
  const {writeFileSync, execSync} = run({hasLock: true});
  expect(writeFileSync).not.toHaveBeenCalled();
  expect(execSync.mock.calls[0][0]).toBe('yarn && yarn start-local');
});

test('keeps the existing installed-example shortcut and still establishes the boundary', () => {
  const {writeFileSync, execSync} = run({hasModules: true});
  expect(writeFileSync).toHaveBeenCalledTimes(1);
  expect(execSync.mock.calls[0][0]).toBe('yarn start-local');
});
