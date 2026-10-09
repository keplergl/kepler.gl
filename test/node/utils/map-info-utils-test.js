// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import {isValidMapInfo, optionalMapInfo} from '@kepler.gl/utils';

test('mapInfoUtils -> isValidMapInfo', t => {
  t.equal(
    isValidMapInfo({title: '', description: ''}),
    true,
    'Should validate map info with no name or description'
  );
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
      description: 'a'.repeat(1024),
      title: 'this is a map'
    }),
    true,
    'Should validate a description at the 1024 character limit'
  );
  t.equal(
    isValidMapInfo({
      description: 'a'.repeat(1025),
      title: 'this is a map'
    }),
    false,
    'Should validate map with a really long description'
  );
  t.end();
});

test('mapInfoUtils -> optionalMapInfo', t => {
  t.equal(optionalMapInfo(undefined), undefined, 'missing info stays unset');
  t.equal(optionalMapInfo({title: '', description: '   '}), undefined, 'blank text stays unset');
  t.deepEqual(optionalMapInfo({title: 'Harbor'}), {title: 'Harbor'}, 'keeps a name');
  t.deepEqual(
    optionalMapInfo({title: 'Harbor', description: 'Ferry routes'}),
    {title: 'Harbor', description: 'Ferry routes'},
    'keeps a name and description'
  );
  t.end();
});
