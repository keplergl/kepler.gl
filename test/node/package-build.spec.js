/** @jest-environment node */

// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import fs from 'fs';
import os from 'os';
import path from 'path';
import {execFileSync, spawnSync} from 'child_process';
import {transformSync} from '@babel/core';
import ts from 'typescript';

import {exportMapToHTML} from '../../src/utils/src/export-map-html';
import {EXPORT_HTML_MAP_MODES} from '../../src/constants/src';

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

test('publishes MCP after its workspace dependencies', () => {
  const workspaceNames = require('../../package.json').workspaces.map(
    workspace => require(path.join(root, workspace, 'package.json')).name
  );
  const mcpIndex = workspaceNames.indexOf('@kepler.gl/mcp');
  const {dependencies} = require('../../src/mcp/package.json');
  const workspaceDependencies = Object.keys(dependencies).filter(name =>
    workspaceNames.includes(name)
  );
  expect(mcpIndex).toBeGreaterThanOrEqual(0);
  expect(workspaceNames.slice(0, mcpIndex)).toEqual(expect.arrayContaining(workspaceDependencies));
});

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

// Standalone maps access these exports through the KeplerGl UMD global. Link
// their actual bootstrap dependencies against the JS barrel: neither tsc nor
// tests that import the scoped packages detect a missing root re-export.
test('UMD entrypoint provides the exports used by standalone HTML maps', () => {
  const requiredExports = new Set();
  for (const mode of [EXPORT_HTML_MAP_MODES.READ, EXPORT_HTML_MAP_MODES.EDIT]) {
    const html = exportMapToHTML({datasets: [], config: {version: 'v1', config: {}}, mode});
    const bootstrap = html.match(/<script type="text\/kepler-bootstrap">([\s\S]*?)<\/script>/)?.[1];
    expect(bootstrap).toBeDefined();
    const source = ts.createSourceFile('bootstrap.js', bootstrap, ts.ScriptTarget.Latest, true);
    const visit = node => {
      if (
        ts.isPropertyAccessExpression(node) &&
        ts.isIdentifier(node.expression) &&
        ['KeplerGl', 'keplerGl'].includes(node.expression.text)
      ) {
        requiredExports.add(node.name.text);
      }
      ts.forEachChild(node, visit);
    };
    visit(source);
  }
  expect(requiredExports.has('keplerGlReducer')).toBe(true);
  expect(requiredExports.has('ChartManagerFactory')).toBe(true);

  // esbuild needs Node's native typed arrays, not Jest's VM-realm globals.
  execFileSync(
    process.execPath,
    [
      '-e',
      "require('esbuild').buildSync(JSON.parse(process.argv[1]));",
      JSON.stringify({
        stdin: {
          contents: `export {${[...requiredExports].sort().join(', ')}} from './src/index.js';`,
          resolveDir: root
        },
        bundle: true,
        write: false,
        platform: 'browser',
        format: 'esm',
        // Check real workspace exports without bundling unrelated third-party
        // dependencies or evaluating WebGL/DOM code in the Node test process.
        packages: 'external',
        tsconfig: path.join(root, 'tsconfig.json'),
        // Match the optional charts entrypoint used by the production UMD build.
        alias: {'@kepler.gl/components/charts': path.join(root, 'src/components/src/charts.ts')},
        logLevel: 'silent'
      })
    ],
    {cwd: root, stdio: 'pipe', timeout: 30000}
  );
});
