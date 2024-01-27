// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import {isValidMapInfo} from '@kepler.gl/utils';

test('mapInfoUtils -> isValidMapInfo', t => {
  t.equal(
    isValidMapInfo({title: 'example', description: ''}),
    true,
    'Should validate map info with no description'
  );
  t.equal(
    isValidMapInfo({title: 'example', description: 'this is a map'}),
    true,
    'Should validate map info with description'
  );
  t.equal(
    isValidMapInfo({
      title:
        'this is a really long title for a map that is not going to work because i really do not like this kind of long title',
      description: 'this is a map'
    }),
    false,
    'Should validate map with a really long title'
  );
  t.equal(
    isValidMapInfo({
      description:
        'this is a really long description for a map that is not going to work because i really do not like this kind of long title',
      title: 'this is a map'
    }),
    false,
    'Should validate map with a really long description'
  );
  t.end();
});
