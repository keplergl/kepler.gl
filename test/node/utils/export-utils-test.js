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
  calculateExportImageSize
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
    {scale: 1, imageW: 1400, imageH: 990},
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
    {scale: undefined, imageW: 1440, imageH: 990},
    'Should return scale null because of custom ratio'
  );

  t.deepEqual(
    calculateExportImageSize({
      mapW: 1440,
      mapH: 990,
      ratio: 'not-valid',
      resolution: RESOLUTIONS.ONE_X
    }),
    {scale: 1, imageW: 1440, imageH: 1080},
    'Should return a correct valid with a non valid ratio param'
  );

  t.deepEqual(
    calculateExportImageSize({
      mapW: 1440,
      mapH: 990,
      ratio: EXPORT_IMG_RATIOS.SCREEN,
      resolution: 'not-valid'
    }),
    {scale: 1, imageW: 1440, imageH: 990},
    'Should return a correct valid with a non valid resolution param'
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
