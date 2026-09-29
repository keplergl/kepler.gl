// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';

import {registerEntry} from '@kepler.gl/actions';
import keplerGlReducer from '@kepler.gl/reducers';
import {
  getMapJSON,
  exportToJsonString,
  getScaleFromImageSize,
  isMSEdge,
  calculateExportImageSize,
  omitLayerApiKeys,
  getExportFileName,
  getExportFileNameBase
} from '@kepler.gl/utils';
import {EXPORT_IMG_RATIOS, RESOLUTIONS} from '@kepler.gl/constants';

test('exportUtils -> ExportJson', t => {
  const state = keplerGlReducer(undefined, registerEntry({id: 'test'})).test;
  const body = exportToJsonString(getMapJSON(state));
  getScaleFromImageSize;
  t.equal(typeof body, 'string', 'Should validate the type of body to be a string');

  t.doesNotThrow(() => {
    JSON.parse(body);
  }, 'Should not throw when trying to parse body');

  t.end();
});

test('exportUtils -> getScaleFromImageSize', t => {
  t.equal(
    getScaleFromImageSize(800, 600, 1400, 990),
    0.5714285714285714,
    'Should compute the right scale'
  );

  t.equal(
    getScaleFromImageSize(800, 600, 1400),
    1,
    'Should return 1 because we are not passing mapH'
  );

  t.equal(getScaleFromImageSize(800, 600, 1400, -1), 1, 'Should return 1 because mapH is negative');

  t.equal(getScaleFromImageSize(800, 600, 1400, 0), 1, 'Should return 1 because mapH is 0');

  t.end();
});

test('exportUtils -> calculateExportImageSize', t => {
  t.deepEqual(
    calculateExportImageSize({
      mapW: 1400,
      mapH: 990,
      ratio: EXPORT_IMG_RATIOS.SCREEN,
      resolution: RESOLUTIONS.ONE_X
    }),
    {zoomOffset: 0, scale: 1, imageW: 1400, imageH: 990},
    'Should calculate the correct export image size'
  );

  t.equal(
    calculateExportImageSize({
      mapW: -1,
      mapH: 990,
      ratio: EXPORT_IMG_RATIOS.SCREEN,
      resolution: RESOLUTIONS.ONE_X
    }),
    null,
    'Should return null because mapW is negative'
  );

  t.equal(
    calculateExportImageSize({
      mapW: 1440,
      mapH: -1,
      ratio: EXPORT_IMG_RATIOS.SCREEN,
      resolution: RESOLUTIONS.ONE_X
    }),
    null,
    'Should return null because mapH is negative'
  );

  t.deepEqual(
    calculateExportImageSize({
      mapW: 1440,
      mapH: 990,
      ratio: EXPORT_IMG_RATIOS.CUSTOM,
      resolution: RESOLUTIONS.ONE_X
    }),
    {zoomOffset: 0, scale: 1, imageW: 1440, imageH: 990},
    'Should return scale 1 for custom ratio (defaults to 1)'
  );

  t.deepEqual(
    calculateExportImageSize({
      mapW: 1440,
      mapH: 990,
      ratio: 'not-valid',
      resolution: RESOLUTIONS.ONE_X
    }),
    {zoomOffset: 0, scale: 1, imageW: 1440, imageH: 1080},
    'Should return a correct valid with a non valid ratio param'
  );

  t.deepEqual(
    calculateExportImageSize({
      mapW: 1440,
      mapH: 990,
      ratio: EXPORT_IMG_RATIOS.SCREEN,
      resolution: 'not-valid'
    }),
    {zoomOffset: 0, scale: 1, imageW: 1440, imageH: 990},
    'Should return a correct valid with a non valid resolution param'
  );

  // Test fixed resolution options
  t.deepEqual(
    calculateExportImageSize({
      mapW: 1440,
      mapH: 990,
      ratio: EXPORT_IMG_RATIOS.SCREEN,
      resolution: '1920x1080'
    }),
    {zoomOffset: 0, scale: 1, imageW: 1920, imageH: 1080},
    'Should return fixed resolution 1920x1080'
  );

  t.deepEqual(
    calculateExportImageSize({
      mapW: 1440,
      mapH: 990,
      ratio: EXPORT_IMG_RATIOS.SCREEN,
      resolution: '1280x720'
    }),
    {zoomOffset: 0, scale: 1, imageW: 1280, imageH: 720},
    'Should return fixed resolution 1280x720'
  );

  t.deepEqual(
    calculateExportImageSize({
      mapW: 1440,
      mapH: 990,
      ratio: EXPORT_IMG_RATIOS.SCREEN,
      resolution: '2560x1440'
    }),
    {zoomOffset: 0, scale: 1, imageW: 2560, imageH: 1440},
    'Should return fixed resolution 2560x1440'
  );

  t.end();
});

test('exportUtils -> isMSEdge', t => {
  t.equal(isMSEdge({}), false, 'Should return false because no navigator is defined');
  t.equal(
    isMSEdge({navigator: {}}),
    false,
    'Should return false because msSaveOrOpenBlob is not defined'
  );
  t.equal(
    isMSEdge({navigator: {msSaveOrOpenBlob: () => {}}}),
    true,
    'Should return true because both navigator and msSaveOrOpenBlob are defined'
  );
  t.end();
});

test('exportUtils -> exportToJsonString', t => {
  t.equal(exportToJsonString({test: 1}), '{"test":1}', 'Should convert object to string');
  t.end();
});

test('exportUtils -> omitLayerApiKeys', t => {
  const saved = {
    datasets: [
      {
        data: {
          id: 'tiles',
          metadata: {
            tile3dUrl: 'https://tile.googleapis.com/v1/3dtiles/root.json',
            tile3dAccessToken: 'secret-key',
            tile3dProvider: 'google'
          }
        }
      },
      {
        data: {
          id: 'points',
          metadata: {source: 'https://example.com/data.geojson'}
        }
      }
    ],
    config: {version: 'v1'}
  };

  const stripped = omitLayerApiKeys(saved);

  t.equal(
    stripped.datasets[0].data.metadata.tile3dAccessToken,
    undefined,
    'Should drop the tileset access token'
  );
  t.equal(
    stripped.datasets[0].data.metadata.tile3dUrl,
    saved.datasets[0].data.metadata.tile3dUrl,
    'Should keep the tileset URL'
  );
  t.equal(
    stripped.datasets[0].data.metadata.tile3dProvider,
    'google',
    'Should keep the tileset provider'
  );
  t.deepEqual(
    stripped.datasets[1].data.metadata,
    saved.datasets[1].data.metadata,
    'Should leave datasets without an API key unchanged'
  );
  t.equal(
    saved.datasets[0].data.metadata.tile3dAccessToken,
    'secret-key',
    'Should not mutate the original saved map'
  );
  t.deepEqual(
    omitLayerApiKeys({config: {}}),
    {config: {}},
    'Should return maps without datasets as-is'
  );

  t.end();
});

test('exportUtils -> getExportFileName', t => {
  t.equal(
    getExportFileName('', 'kepler.gl.json', 'json'),
    'kepler.gl.json',
    'empty name uses fallback'
  );
  t.equal(
    getExportFileName('census-2020', 'kepler.gl.json', 'json'),
    'census-2020.json',
    'appends format'
  );
  t.equal(
    getExportFileName('census-2020.json', 'kepler.gl.json', 'json'),
    'census-2020.json',
    'strips a matching extension before adding it again'
  );
  t.equal(
    getExportFileName('census-2020.html', 'kepler.gl.html', 'html'),
    'census-2020.html',
    'strips html extension typed by the user'
  );
  t.equal(
    getExportFileName('bad/name:file', 'kepler.gl.png', 'png'),
    'bad-name-file.png',
    'replaces illegal filename characters'
  );
  t.equal(getExportFileNameBase('', 'kepler.gl'), 'kepler.gl', 'base fallback is unchanged');
  t.end();
});
