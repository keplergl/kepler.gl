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
  'cloud-providers': ['provider'],
  constants: ['action-types']
};

test('documentation generator preserves legacy pages, examples, and action/updater links', t => {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'kepler-documentation-'));
  const output = path.join(cwd, 'docs/api-reference');
  const write = (file, source) => fs.writeFileSync(path.join(cwd, 'src', file), source);
  const read = file => fs.readFileSync(path.join(output, file), 'utf8');

  try {
    // Supply the legacy JS layout independently of the repository's TS source layout.
    Object.entries(INPUTS).forEach(([folder, names]) => {
      fs.mkdirSync(path.join(cwd, 'src', folder), {recursive: true});
      fs.mkdirSync(path.join(output, folder), {recursive: true});
      names.forEach(name => {
        const symbol = `fixture_${folder}_${name}`.replace(/-/g, '_');
        write(
          `${folder}/${name}.js`,
          `/**
 * Convert a sample value.
 * @param {number} value Input value.
 * @returns {number} Converted value.
 * @public
 * @example
 * ${symbol}(2);
 */
export const ${symbol} = value => value;
`
        );
      });
    });
    write(
      'constants/action-types.js',
      `/**
 * Action types.
 * @public
 */
export const ActionTypes = {FIXTURE: 'FIXTURE'};
`
    );
    write(
      'actions/actions.js',
      `/**
 * Update fixture state.
 * @public
 */
export function fixtureAction() { return {type: ActionTypes.FIXTURE}; }
`
    );
    write(
      'reducers/vis-state-updaters.js',
      `/**
 * Update fixture state.
 * @param {Object} state Current state.
 * @returns {Object} Updated state.
 * @public
 */
export function fixtureUpdater(state) { return state; }
export const actionHandler = {[ActionTypes.FIXTURE]: visStateUpdaters.fixtureUpdater};
`
    );
    const result = spawnSync(
      process.execPath,
      ['-r', path.join(ROOT, 'babel-register.js'), path.join(ROOT, 'scripts/documentation.js')],
      {
        cwd,
        encoding: 'utf8',
        env: {...process.env, NODE_ENV: 'development', BABEL_DISABLE_CACHE: '1'},
        timeout: 30000
      }
    );
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
    t.ok(actions.includes('#visstateupdatersfixtureupdater'), 'preserves action-to-updater links');
    t.ok(
      read('reducers/vis-state.md').includes('../actions/actions.md#fixtureaction'),
      'preserves updater-to-action links'
    );
    t.ok(
      read('processors/processors.md').includes('fixture_processors_data_processor(2);'),
      'preserves processor examples'
    );
    t.ok(
      read('cloud-providers/cloud-provider.md').includes('fixture_cloud_providers_provider(2);'),
      'preserves cloud provider examples'
    );
  } finally {
    fs.rmSync(cwd, {recursive: true, force: true});
  }
  t.end();
});
