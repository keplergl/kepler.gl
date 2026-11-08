// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/** @jest-environment node */

import fs from 'fs';
import os from 'os';
import path from 'path';
import {spawnSync} from 'child_process';
import {transformSync} from '@babel/core';
import ts from 'typescript';

const root = path.resolve(__dirname, '../..');
const packages = ['.', ...require('../../package.json').workspaces].filter(workspace =>
  require(path.join(root, workspace, 'package.json')).scripts?.build?.includes('babel ')
);
const testFiles = ['spec', 'test'].flatMap(kind =>
  ['ts', 'tsx', 'js', 'jsx'].flatMap(extension => [
    `example.${kind}.${extension}`,
    `nested/example.${kind}.${extension}`
  ])
);

// Use Babel's actual ignore matching, including every CJS/ESM command, rather
// than asserting one particular glob spelling in package.json.
test.each(packages)('%s excludes tests from Babel output', workspace => {
  const {build} = require(path.join(root, workspace, 'package.json')).scripts;
  const commands = build.split(' && ').filter(command => /\bbabel src/.test(command));
  expect(commands.length).toBeGreaterThan(0);
  for (const command of commands) {
    const ignore = command.match(/--ignore '([^']+)'/)?.[1].split(',') || [];
    const transform = filename =>
      transformSync('export const value = 1;', {
        cwd: path.join(root, workspace),
        filename: path.join(root, workspace, 'src', filename),
        configFile: false,
        babelrc: false,
        ignore
      });
    for (const filename of [...testFiles, 'types.d.ts']) {
      expect({filename, result: transform(filename)}).toEqual({filename, result: null});
    }
    for (const filename of ['index.ts', 'nested/component.tsx', 'test-utils.ts']) {
      expect(transform(filename)?.code).toContain('value');
    }
  }
});

test.each(packages)('%s excludes tests from declaration inputs', workspace => {
  const configPath = path.join(root, workspace, 'tsconfig.production.json');
  const {config, error} = ts.readConfigFile(configPath, ts.sys.readFile);
  expect(error).toBeUndefined();
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'kepler-build-inputs-'));
  try {
    for (const filename of [...testFiles, 'index.ts', 'nested/component.tsx']) {
      const target = path.join(directory, 'src', filename);
      fs.mkdirSync(path.dirname(target), {recursive: true});
      fs.writeFileSync(target, 'export const value = 1;');
    }
    const parsed = ts.parseJsonConfigFileContent(config, ts.sys, directory);
    expect(parsed.errors).toEqual([]);
    expect(parsed.fileNames.map(filename => path.relative(directory, filename)).sort()).toEqual([
      'src/index.ts',
      'src/nested/component.tsx'
    ]);
  } finally {
    fs.rmSync(directory, {recursive: true, force: true});
  }
});

// Run the actual root command and install-and-start helper, replacing only the
// package manager/build tools so this checks environment inheritance offline.
describe('root scripts preserve caller Node options', () => {
  const scripts = require('../../package.json').scripts;
  const commands = [
    'install:example',
    'start',
    'start:sqlrooms',
    'start:deck',
    'start:deck-src',
    'start:loaders-src',
    'build'
  ];

  test.each(commands)('%s leaves unset and existing NODE_OPTIONS unchanged', name => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'kepler-script-env-'));
    const bin = path.join(directory, 'bin');
    fs.mkdirSync(bin);
    const probe = `#!${process.execPath}
const {spawnSync} = require('child_process');
if (process.argv[2] === 'install-and-start') {
  const result = spawnSync(process.execPath, [
    ${JSON.stringify(path.join(root, 'scripts/install-and-start.js'))},
    ...process.argv.slice(3)
  ], {stdio: 'inherit'});
  process.exit(result.status ?? 1);
}
console.log(JSON.stringify({nodeOptions: process.env.NODE_OPTIONS ?? null}));
`;
    for (const tool of ['yarn', 'rm', 'babel']) {
      fs.writeFileSync(path.join(bin, tool), probe, {mode: 0o755});
    }
    for (const example of ['demo-app', 'demo-app-sqlrooms']) {
      fs.mkdirSync(path.join(directory, 'examples', example), {recursive: true});
    }
    try {
      for (const installed of [false, true]) {
        if (installed) {
          for (const example of ['demo-app', 'demo-app-sqlrooms']) {
            fs.mkdirSync(path.join(directory, 'examples', example, 'node_modules'));
          }
        }
        for (const nodeOptions of [undefined, '--preserve-symlinks --trace-warnings']) {
          const env = {...process.env, PATH: `${bin}${path.delimiter}${process.env.PATH}`};
          delete env.NODE_OPTIONS;
          if (nodeOptions !== undefined) env.NODE_OPTIONS = nodeOptions;
          const result = spawnSync(scripts[name], {
            cwd: directory,
            shell: true,
            env,
            encoding: 'utf8',
            timeout: 10000
          });
          expect({status: result.status, stderr: result.stderr}).toEqual({status: 0, stderr: ''});
          const output = result.stdout
            .trim()
            .split('\n')
            .map(line => JSON.parse(line));
          expect(output.length).toBeGreaterThan(0);
          for (const received of output) {
            expect(received).toEqual({nodeOptions: nodeOptions ?? null});
          }
        }
      }
    } finally {
      fs.rmSync(directory, {recursive: true, force: true});
    }
  });
});
