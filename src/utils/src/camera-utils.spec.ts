// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {getCameraSnapshot, normalizeCameraBookmarks} from './camera-utils';

const camera = {longitude: 179, latitude: 40, zoom: 4, bearing: 350, pitch: 45};

describe('camera bookmarks', () => {
  test('copies the five camera fields without retaining viewport or transition state', () => {
    const snapshot = getCameraSnapshot({...camera, width: 800, transitionDuration: 1000});
    expect(snapshot).toEqual(camera);
    expect(snapshot).not.toBe(camera);
  });

  test.each([
    null,
    {},
    {...camera, zoom: NaN},
    {...camera, longitude: Infinity},
    {...camera, latitude: 91},
    {...camera, pitch: -1},
    {...camera, pitch: 91}
  ])('rejects invalid cameras: %p', value => expect(getCameraSnapshot(value)).toBeNull());

  test('normalizes missing input, invalid entries and duplicate IDs without changing order', () => {
    expect(normalizeCameraBookmarks(undefined)).toEqual([]);
    expect(normalizeCameraBookmarks({})).toEqual([]);
    const first = {id: 'one', name: 'First', camera};
    expect(
      normalizeCameraBookmarks([
        null,
        {id: 'invalid', name: 'Bad', camera: {}},
        first,
        {...first, name: 'Duplicate'},
        {id: 'two', name: 'Second', camera},
        {...first, id: ''},
        {...first, name: 42}
      ])
    ).toEqual([first, {id: 'two', name: 'Second', camera}]);
  });
});
