/** @jest-environment node */

// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import fs from 'fs';
import os from 'os';
import path from 'path';
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

// Published packages must keep original-source debugging without embedding the
// base64 map in every JavaScript file. Babel CLI writes the returned map beside
// the output, and the existing dist allowlists include both files.
test.each(packages.filter(workspace => workspace !== '.'))(
  '%s preserves original sources in separate CJS/ESM maps',
  workspace => {
    const {build} = require(path.join(root, workspace, 'package.json')).scripts;
    const commands = build.split(' && ').filter(command => /\bbabel src/.test(command));
    const source = 'export const value: number = 1;';
    for (const command of commands) {
      const sourceMaps = command.match(/--source-maps (\w+)/)?.[1];
      const result = transformSync(source, {
        cwd: path.join(root, workspace),
        filename: path.join(root, workspace, 'src', 'example.ts'),
        envName: command.includes('BABEL_ENV=esm') ? 'esm' : 'production',
        sourceMaps: sourceMaps === 'true' ? true : sourceMaps
      });
      expect(result.code).not.toContain('sourceMappingURL=data:');
      expect(result.map?.sourcesContent).toEqual([source]);
      expect(result.map?.mappings.length).toBeGreaterThan(0);
    }
  }
);
