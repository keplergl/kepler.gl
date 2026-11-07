// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import fs from 'fs';
import os from 'os';
import path from 'path';
import {spawnSync} from 'child_process';
import test from 'tape';

const ROOT = path.resolve(__dirname, '../..');
const INPUTS = {
  actions: [
    'action-types',
    'actions',
    'action-wrapper',
    'vis-state-actions',
    'ui-state-actions',
    'map-state-actions',
    'map-style-actions',
    'identity-actions'
  ],
  reducers: [
    'root',
    'core',
    'combined-updaters',
    'vis-state-updaters',
    'map-state-updaters',
    'map-style-updaters',
    'ui-state-updaters'
  ],
  processors: ['data-processor'],
  'cloud-providers': ['provider']
};

test('documentation generator reads TypeScript workspaces and preserves API pages and links', t => {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'kepler-documentation-'));
  const output = path.join(cwd, 'docs/api-reference');
  const write = (file, source) => fs.writeFileSync(path.join(cwd, 'src', file), source);
  const read = file => fs.readFileSync(path.join(output, file), 'utf8');

  try {
    // Mirror the repository workspace layout, including TypeScript-only syntax.
    Object.entries(INPUTS).forEach(([folder, names]) => {
      fs.mkdirSync(path.join(cwd, 'src', folder, 'src'), {recursive: true});
      names.forEach(name => {
        const symbol = `fixture_${folder}_${name}`.replace(/-/g, '_');
        write(
          `${folder}/src/${name}.ts`,
          `/**
 * Convert a sample value.
 * @param {number} value Input value.
 * @returns {number} Converted value.
 * @public
 * @example
 * ${symbol}(2);
 */
export const ${symbol} = (value: number): number => value;
`
        );
      });
    });
    write(
      'actions/src/action-types.ts',
      `/**
 * Action types.
 * @public
 */
export const ActionTypes = {FIXTURE: 'FIXTURE', COMBINED: 'COMBINED'};
`
    );
    write(
      'actions/src/actions.ts',
      `/**
 * Update fixture state.
 * @public
 */
export function fixtureAction(value: number) {
  const payload = value;
  return {payload, type: ActionTypes.FIXTURE};
}
/**
 * Update combined fixture state.
 * @public
 */
export function combinedFixtureAction() {
  return {type: ActionTypes.COMBINED};
}
/** @public */
export function notAnAction(): void {}
`
    );
    write(
      'reducers/src/vis-state-updaters.ts',
      `import {type FixtureState} from './fixture-state';
/**
 * Update fixture state.
 * @param {Object} state Current state.
 * @returns {Object} Updated state.
 * @public
 */
export function fixtureUpdater(state: FixtureState): FixtureState { return state; }
`
    );
    write(
      'reducers/src/combined-updaters.ts',
      `/**
 * Update combined fixture state.
 * @public
 */
export function combinedFixtureUpdater(state: object): object { return state; }
`
    );
    write(
      'reducers/src/composers.ts',
      `export const actionHandler = {
      [ActionTypes.COMBINED]: combinedUpdaters.combinedFixtureUpdater
    };`
    );
    write(
      'reducers/src/vis-state.ts',
      `export const actionHandler = {
      [ActionTypes.FIXTURE]: visStateUpdaters.fixtureUpdater,
      [ActionTypes.UNMAPPED]: visStateUpdaters.fixtureUpdater
    };`
    );
    // Tests, declarations, and build artifacts must never be parsed as source.
    write('reducers/src/ignored.spec.ts', 'invalid test fixture');
    write('reducers/src/ignored.d.ts', 'invalid declaration fixture');
    fs.mkdirSync(path.join(cwd, 'src/reducers/dist'));
    write('reducers/dist/ignored.js', 'invalid build artifact');
    const result = runGenerator(cwd);
    t.equal(result.status, 0, result.stderr || 'generator exits successfully');
    t.notOk(
      /\[Error\]|Error:/.test(result.stdout + result.stderr),
      'no swallowed generator errors'
    );
    [
      'actions/actions.md',
      'reducers/reducers.md',
      'reducers/combine.md',
      'reducers/vis-state.md',
      'reducers/map-state.md',
      'reducers/map-style.md',
      'reducers/ui-state.md',
      'processors/processors.md',
      'cloud-providers/cloud-provider.md'
    ].forEach(file => t.ok(fs.existsSync(path.join(output, file)), `generates ${file}`));
    const actions = read('actions/actions.md');
    t.ok(actions.includes('ActionTypes.FIXTURE'), 'preserves action type references');
    t.ok(
      actions.includes('../reducers/vis-state.md#fixtureupdater'),
      'preserves action-to-updater links'
    );
    t.ok(
      read('reducers/vis-state.md').includes('../actions/actions.md#fixtureaction'),
      'preserves updater-to-action links'
    );
    t.ok(
      actions.includes('../reducers/combine.md#combinedfixtureupdater'),
      'links combined handlers to their configured output page'
    );
    t.ok(
      read('reducers/combine.md').includes('../actions/actions.md#combinedfixtureaction'),
      'preserves combined updater-to-action links'
    );
    t.ok(
      read('processors/processors.md').includes('fixture_processors_data_processor(2);'),
      'preserves processor examples'
    );
    t.ok(
      read('cloud-providers/cloud-provider.md').includes('fixture_cloud_providers_provider(2);'),
      'preserves cloud provider examples'
    );
    write('processors/src/data-processor.ts', 'export const broken: = ;');
    const invalid = runGenerator(cwd);
    t.notEqual(invalid.status, 0, 'parser errors fail the command');
    t.notOk(
      invalid.stdout.includes('Documentation Success'),
      'parser failure is not reported as success'
    );
    fs.unlinkSync(path.join(cwd, 'src/processors/src/data-processor.ts'));
    const missing = runGenerator(cwd);
    t.notEqual(missing.status, 0, 'missing inputs fail the command');
    t.ok(missing.stdout.includes("doesn't exist!"), 'reports the missing input');
  } finally {
    fs.rmSync(cwd, {recursive: true, force: true});
  }
  t.end();
});

function runGenerator(cwd) {
  return spawnSync(
    process.execPath,
    ['-r', path.join(ROOT, 'babel-register.js'), path.join(ROOT, 'scripts/documentation.js')],
    {
      cwd,
      encoding: 'utf8',
      env: {...process.env, NODE_ENV: 'development', BABEL_DISABLE_CACHE: '1'},
      timeout: 30000
    }
  );
}

test('documentation generator regenerates all API pages from the actual checkout', t => {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'kepler-documentation-checkout-'));
  try {
    fs.symlinkSync(path.join(ROOT, 'src'), path.join(cwd, 'src'), 'dir');
    const result = runGenerator(cwd);
    t.equal(
      result.status,
      0,
      result.status === 0 ? 'generator exits successfully' : result.stderr || result.stdout
    );
    const output = path.join(cwd, 'docs/api-reference');
    const pages = {};
    Object.keys(INPUTS).forEach(folder => {
      const directory = path.join(output, folder);
      if (fs.existsSync(directory)) {
        fs.readdirSync(directory).forEach(file => {
          pages[`${folder}/${file}`] = fs.readFileSync(path.join(directory, file), 'utf8');
        });
      }
    });
    t.equal(Object.keys(pages).length, 9, 'regenerates all nine existing page paths');
    const actions = pages['actions/actions.md'] || '';
    t.ok(actions.includes('## ActionTypes'), 'includes current action types');
    t.ok(
      actions.includes('../reducers/vis-state.md#addfilterupdater'),
      'links a current action to its updater'
    );
    t.ok(
      (pages['reducers/vis-state.md'] || '').includes('../actions/actions.md#addfilter'),
      'links the updater back to the action'
    );
    t.ok(
      actions.includes('../reducers/combine.md#adddatatomapupdater'),
      'links addDataToMap to its combined updater'
    );
    t.ok(
      (pages['reducers/combine.md'] || '').includes('../actions/actions.md#adddatatomap'),
      'links the combined updater back to addDataToMap'
    );
    t.ok(
      (pages['processors/processors.md'] || '').includes(
        "import {processCsvData} from '@kepler.gl/processors'"
      ),
      'keeps source examples'
    );
    const brokenLinks = [];
    Object.entries(pages).forEach(([page, content]) => {
      for (const match of content.matchAll(/\]: \.\.\/(actions|reducers)\/([^#\s]+)#([^\s]+)/g)) {
        const [, folder, file, anchor] = match;
        const target = pages[`${folder}/${file}`];
        const headings = target?.match(/^#+ .+$/gm) || [];
        if (!headings.some(heading => heading.replace(/^#+ /, '').toLowerCase() === anchor)) {
          brokenLinks.push(`${page}: ${folder}/${file}#${anchor}`);
        }
      }
    });
    t.deepEqual(brokenLinks, [], 'generated action/updater links point to generated headings');
  } finally {
    fs.rmSync(cwd, {recursive: true, force: true});
  }
  t.end();
});
