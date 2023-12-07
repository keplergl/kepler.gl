// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import {mergeLayerGroupVisibility} from '@kepler.gl/utils';

test('mapbox.gl Style Editor -> mergeLayerGroupVisibility', t => {
  const defaultLG = {
    label: true,
    road: true,
    border: false,
    building: true,
    water: true,
    land: true
  };

  const currentLG = {
    label: false,
    road: false,
    border: true
  };

  const expected = {
    label: false,
    road: false,
    border: true,
    building: true,
    water: true,
    land: true
  };

  t.deepEqual(
    mergeLayerGroupVisibility(defaultLG, currentLG),
    expected,
    'Should override default layer group visibility'
  );

  t.end();
});
