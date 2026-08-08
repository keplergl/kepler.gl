// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import {isStyleUsingMapboxTiles, getBaseMapAttributions} from '@kepler.gl/utils';

// Build a minimal mock of a resolved MapLibre/Mapbox map instance where each
// source id resolves to an object exposing an `attribution` string.
function mockMap(sources) {
  return {
    getStyle: () => ({sources}),
    getSource: id => sources[id]
  };
}

test('mapbox-utils -> isStyleUsingMapboxTiles', t => {
  t.notOk(isStyleUsingMapboxTiles({}), 'Empty style does not reference Mapbox');
  t.notOk(
    isStyleUsingMapboxTiles({stylesheet: {sources: {a: {}}}}),
    'Source does not reference Mapbox'
  );
  t.ok(
    isStyleUsingMapboxTiles({
      stylesheet: {
        sources: {
          a: {url: 'some/url'},
          b: {url: 'mapbox://mapbox-style.json'}
        }
      }
    }),
    'Source references Mapbox tiles using "url"'
  );
  t.ok(
    isStyleUsingMapboxTiles({
      stylesheet: {
        sources: {
          a: {url: 'some/url'},
          b: {tiles: ['mapbox://mapbox-style.json']}
        }
      }
    }),
    'Source references Mapbox tiles using "tiles"'
  );
  t.end();
});

test('mapbox-utils -> getBaseMapAttributions', t => {
  t.deepEqual(getBaseMapAttributions(undefined), [], 'No map returns empty list');
  t.deepEqual(getBaseMapAttributions({}), [], 'Map without getStyle returns empty list');
  t.deepEqual(getBaseMapAttributions(mockMap({})), [], 'No sources returns empty list');

  t.deepEqual(
    getBaseMapAttributions(
      mockMap({
        a: {attribution: '<a href="https://openfreemap.org">OpenFreeMap</a>'},
        b: {attribution: '<a href="https://www.openmaptiles.org/">© OpenMapTiles</a>'}
      })
    ),
    [
      '<a href="https://openfreemap.org">OpenFreeMap</a>',
      '<a href="https://www.openmaptiles.org/">© OpenMapTiles</a>'
    ],
    'Collects attribution strings from each resolved source'
  );

  t.deepEqual(
    getBaseMapAttributions(
      mockMap({
        a: {attribution: '© OpenStreetMap'},
        b: {attribution: '© OpenStreetMap'},
        c: {attribution: '  © OpenStreetMap  '}
      })
    ),
    ['© OpenStreetMap'],
    'De-duplicates and trims identical attributions'
  );

  t.deepEqual(
    getBaseMapAttributions(
      mockMap({
        a: {attribution: ''},
        b: {},
        c: {attribution: 42}
      })
    ),
    [],
    'Ignores empty, missing, and non-string attributions'
  );

  const throwingMap = {
    getStyle: () => {
      throw new Error('style not ready');
    }
  };
  t.deepEqual(getBaseMapAttributions(throwingMap), [], 'Swallows errors and returns empty list');

  t.end();
});
