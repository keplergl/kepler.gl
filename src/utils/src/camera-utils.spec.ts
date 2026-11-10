// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {getCameraSnapshot, normalizeCameraBookmarks} from './camera-utils';
import {normalizeCameraTour, getCameraTourDuration, evaluateCameraTour} from './camera-tour';
import {CameraTour} from '@kepler.gl/types';

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

describe('camera tour evaluation', () => {
  const destination = {longitude: -179, latitude: 50, zoom: 8, bearing: 10, pitch: 15};
  const tour: CameraTour = {
    stops: [
      {id: 'a', name: 'A', camera, holdDurationMs: 1000, travelDurationMs: 2000},
      {id: 'b', name: 'B', camera: destination, holdDurationMs: 500, travelDurationMs: 9000}
    ]
  };

  test('holds, travels, clamps and includes only the final hold in total duration', () => {
    expect(getCameraTourDuration(tour)).toBe(3500);
    for (const time of [-Infinity, -1, NaN, 0, 999, 1000]) {
      expect(evaluateCameraTour(tour, time)).toEqual(camera);
    }
    expect(evaluateCameraTour(tour, 2000)).toEqual({
      longitude: 180,
      latitude: 45,
      zoom: 6,
      bearing: 360,
      pitch: 30
    });
    for (const time of [3000, 3499, 3500, Infinity]) {
      expect(evaluateCameraTour(tour, time)).toEqual(destination);
    }
    expect(evaluateCameraTour(tour, 1500)?.zoom).toBeCloseTo(4.625);
  });

  test('arbitrary timestamps give identical results regardless of evaluation order', () => {
    const before = JSON.stringify(tour);
    const expected = evaluateCameraTour(tour, 1234.5);
    evaluateCameraTour(tour, 3400);
    evaluateCameraTour(tour, 10);
    expect(evaluateCameraTour(tour, 1234.5)).toEqual(expected);
    expect(JSON.stringify(tour)).toBe(before);
    const result = evaluateCameraTour(tour, 0)!;
    result.zoom = 99;
    expect(tour.stops[0].camera.zoom).toBe(4);
  });

  test('takes the short rotation in either direction, including noncanonical angles', () => {
    const reverse = {
      stops: [
        {...tour.stops[0], camera: destination},
        {...tour.stops[1], camera}
      ]
    };
    expect(evaluateCameraTour(reverse, 2000)).toMatchObject({longitude: -180, bearing: 0});
    const wrapped = {
      stops: [
        {...tour.stops[0], camera: {...camera, bearing: -370}},
        {...tour.stops[1], camera: {...destination, bearing: 370}}
      ]
    };
    expect(evaluateCameraTour(wrapped, 2000)?.bearing).toBe(-360);
  });

  test('zero travel cuts at the end of the hold; zero-length tours resolve to the final stop', () => {
    const cut = {stops: [{...tour.stops[0], travelDurationMs: 0}, tour.stops[1]]};
    expect(evaluateCameraTour(cut, 999)).toEqual(camera);
    expect(evaluateCameraTour(cut, 1000)).toEqual(destination);
    const instant = {
      stops: tour.stops.map(stop => ({...stop, holdDurationMs: 0, travelDurationMs: 0}))
    };
    expect(getCameraTourDuration(instant)).toBe(0);
    expect(evaluateCameraTour(instant, 0)).toEqual(destination);
    expect(evaluateCameraTour({stops: [tour.stops[0]]}, 999999)).toEqual(camera);
  });

  test('rejects invalid durations and cameras, duplicate IDs and unsafe total durations', () => {
    for (const value of [undefined, null, {}, {stops: []}])
      expect(normalizeCameraTour(value)).toBeNull();
    for (const duration of [-1, NaN, Infinity, '10', Number.MAX_VALUE]) {
      expect(
        normalizeCameraTour({stops: [{...tour.stops[0], holdDurationMs: duration}]})
      ).toBeNull();
      expect(
        normalizeCameraTour({stops: [{...tour.stops[0], travelDurationMs: duration}]})
      ).toBeNull();
    }
    expect(
      normalizeCameraTour({
        stops: [null, {...tour.stops[0], camera: {}}, ...tour.stops, tour.stops[0]]
      })
    ).toEqual(tour);
    expect(
      normalizeCameraTour({
        stops: tour.stops.map(stop => ({...stop, holdDurationMs: Number.MAX_SAFE_INTEGER}))
      })
    ).toBeNull();
    expect(getCameraTourDuration(null)).toBe(0);
    expect(evaluateCameraTour({stops: []}, 100)).toBeNull();
  });
});
