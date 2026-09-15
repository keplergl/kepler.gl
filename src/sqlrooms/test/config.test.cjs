// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

const assert = require('node:assert/strict');
const {test} = require('node:test');
const {execFileSync} = require('node:child_process');
const {KeplerSliceConfig, migrateKeplerTabsToArtifacts} = require('@kepler.gl/sqlrooms/config');

test('config entry loads without the map or room runtime in CommonJS and ESM', () => {
  execFileSync(
    process.execPath,
    [
      '-e',
      `
    const assert = require('node:assert/strict');
    const config = require('@kepler.gl/sqlrooms/config');
    assert.deepEqual(config.KeplerSliceConfig.parse({}), {maps: []});
    assert(!Object.keys(require.cache).some(file =>
      /node_modules[\\\\/](react|react-dom|@sqlrooms)[\\\\/]/.test(file)));
  `
    ],
    {cwd: __dirname}
  );
  execFileSync(
    process.execPath,
    [
      '--input-type=module',
      '-e',
      `
    import assert from 'node:assert/strict';
    import {KeplerSliceConfig} from '@kepler.gl/sqlrooms/config';
    assert.deepEqual(KeplerSliceConfig.parse({}), {maps: []});
  `
    ],
    {cwd: __dirname}
  );
});

test('saved map payload and dataset identity survive configuration round trips', () => {
  const config = {
    maps: [
      {
        id: 'map-1',
        name: 'Places',
        config: {
          version: 'v1',
          config: {
            visState: {layers: [{id: 'points', config: {dataId: 'attached.main.places'}}]},
            mapState: {latitude: 47, longitude: 8, zoom: 5},
            mapStyle: {styleType: 'positron'},
            uiState: {readOnly: false}
          }
        }
      }
    ]
  };
  assert.deepEqual(KeplerSliceConfig.parse(JSON.parse(JSON.stringify(config))), config);
  assert.equal(KeplerSliceConfig.safeParse({maps: [{id: 1}]}).success, false);
});

test('legacy tab migration retains maps and hides closed tabs', () => {
  const maps = [
    {id: 'a', name: 'First'},
    {id: 'b', name: 'Second'}
  ];
  const migrated = migrateKeplerTabsToArtifacts({
    maps,
    currentMapId: 'a',
    openTabs: ['a', 'missing']
  });
  assert.deepEqual(migrated.keplerConfig, {maps});
  assert.equal(migrated.artifactsConfig.currentArtifactId, 'a');
  assert.deepEqual(migrated.artifactsConfig.artifactOrder, ['a', 'b']);
  assert.deepEqual(migrated.hiddenArtifactIds, ['b']);
  assert.equal(migrated.artifactsConfig.artifactsById.b.title, 'Second');
});

test('legacy migration handles empty projects and stale selection', () => {
  assert.equal(
    migrateKeplerTabsToArtifacts({maps: []}).artifactsConfig.currentArtifactId,
    undefined
  );
  const migrated = migrateKeplerTabsToArtifacts(
    {
      maps: [
        {id: 'a', name: 'First'},
        {id: 'b', name: 'Second'}
      ],
      currentMapId: 'missing',
      openTabs: ['b']
    },
    {artifactType: 'custom-map'}
  );
  assert.equal(migrated.artifactsConfig.currentArtifactId, 'b');
  assert.equal(migrated.artifactsConfig.artifactsById.a.type, 'custom-map');
});
