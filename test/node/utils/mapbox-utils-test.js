// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import {isStyleUsingMapboxTiles} from '@kepler.gl/utils';

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
