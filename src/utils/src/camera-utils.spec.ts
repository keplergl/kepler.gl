// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {getCameraSnapshot, normalizeCameraBookmarks, cameraForMap} from './camera-utils';
import {normalizeCameraTour, getCameraTourDuration, evaluateCameraTour} from './camera-tour';
import {GLOBE_MAX_LATITUDE, GLOBE_MIN_ZOOM, GLOBE_MAX_ZOOM} from '@kepler.gl/constants';
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

  const throughTour: CameraTour = {
    stops: [
      {
        id: 'a',
        name: 'A',
        holdDurationMs: 0,
        travelDurationMs: 1000,
        camera: {longitude: 0, latitude: 0, zoom: 2, bearing: 350, pitch: 20}
      },
      {
        id: 'b',
        name: 'B',
        holdDurationMs: 0,
        travelDurationMs: 3000,
        camera: {longitude: 2, latitude: 0, zoom: 4, bearing: 10, pitch: 40}
      },
      {
        id: 'c',
        name: 'C',
        holdDurationMs: 0,
        travelDurationMs: 0,
        camera: {longitude: 2, latitude: 2, zoom: 10, bearing: 40, pitch: 60}
      }
    ]
  };
  const angleDifference = (from: number, to: number) => ((to - from + 540) % 360) - 180;

  test('passes through a zero-hold corner with continuous velocity despite unequal travel times', () => {
    const epsilon = 0.01;
    const before = evaluateCameraTour(throughTour, 1000 - epsilon)!;
    const at = evaluateCameraTour(throughTour, 1000)!;
    const after = evaluateCameraTour(throughTour, 1000 + epsilon)!;
    expect(at).toEqual(throughTour.stops[1].camera);
    expect(getCameraTourDuration(throughTour)).toBe(4000);
    for (const key of ['longitude', 'latitude', 'zoom', 'bearing', 'pitch'] as const) {
      const incoming =
        (key === 'bearing' ? angleDifference(before[key], at[key]) : at[key] - before[key]) /
        epsilon;
      const outgoing =
        (key === 'bearing' ? angleDifference(at[key], after[key]) : after[key] - at[key]) / epsilon;
      expect(incoming).toBeGreaterThan(0.0001);
      expect(outgoing).toBeCloseTo(incoming, 6);
    }
    // A rounded corner leaves the straight connecting lines on either side.
    expect(before.latitude).toBeLessThan(0);
    expect(after.longitude).toBeGreaterThan(2);
    expect(evaluateCameraTour(throughTour, 0)).toEqual(throughTour.stops[0].camera);
    expect(evaluateCameraTour(throughTour, 4000)).toEqual(throughTour.stops[2].camera);
    expect(evaluateCameraTour(throughTour, 0.01)?.longitude).toBeCloseTo(0, 7);
    expect(evaluateCameraTour(throughTour, 3999.99)?.latitude).toBeCloseTo(2, 7);
  });

  test('eases to rest at explicit holds and on either side of a cut', () => {
    const held: CameraTour = {
      stops: throughTour.stops.map((stop, index) => ({
        ...stop,
        holdDurationMs: index === 1 ? 500 : 0
      }))
    };
    for (const time of [1000, 1250, 1500]) {
      expect(evaluateCameraTour(held, time)).toEqual(held.stops[1].camera);
    }
    expect(evaluateCameraTour(held, 999.99)?.longitude).toBeCloseTo(2, 7);
    expect(evaluateCameraTour(held, 1500.01)?.latitude).toBeCloseTo(0, 7);

    const cut: CameraTour = {
      stops: [
        throughTour.stops[0],
        {...throughTour.stops[1], travelDurationMs: 0},
        {...throughTour.stops[2], travelDurationMs: 1000},
        {...throughTour.stops[2], id: 'd', camera: {...throughTour.stops[2].camera, longitude: 4}}
      ]
    };
    expect(evaluateCameraTour(cut, 999.99)?.longitude).toBeCloseTo(2, 7);
    expect(evaluateCameraTour(cut, 1000)).toEqual(cut.stops[2].camera);
    expect(evaluateCameraTour(cut, 1000.01)?.longitude).toBeCloseTo(2, 7);
  });

  test('keeps a continuous short path through the antimeridian', () => {
    const wrapped = {
      stops: throughTour.stops.map((stop, index) => ({
        ...stop,
        camera: {...stop.camera, longitude: [179, -179, -177][index]}
      }))
    };
    const before = evaluateCameraTour(wrapped, 999.99)!;
    const at = evaluateCameraTour(wrapped, 1000)!;
    const after = evaluateCameraTour(wrapped, 1000.01)!;
    const incoming = angleDifference(before.longitude, at.longitude) / 0.01;
    const outgoing = angleDifference(at.longitude, after.longitude) / 0.01;
    expect(before.longitude).toBeGreaterThan(180);
    expect(incoming).toBeGreaterThan(0.0001);
    expect(outgoing).toBeCloseTo(incoming, 6);
  });

  test('limits zoom, pitch and bearing without overshoot on uneven legs and reversals', () => {
    const bounded = {
      stops: throughTour.stops.map((stop, index) => ({
        ...stop,
        travelDurationMs: [1, 10000, 0][index],
        camera: {...stop.camera, pitch: [0, 90, 0][index], bearing: [350, 10, 0][index]}
      }))
    };
    for (const [start, duration, index] of [
      [0, 1, 0],
      [1, 10000, 1]
    ]) {
      const from = bounded.stops[index].camera;
      const to = bounded.stops[index + 1].camera;
      for (let step = 0; step <= 20; step++) {
        const frame = evaluateCameraTour(bounded, start + (duration * step) / 20)!;
        for (const key of ['zoom', 'pitch'] as const) {
          expect(frame[key]).toBeGreaterThanOrEqual(Math.min(from[key], to[key]));
          expect(frame[key]).toBeLessThanOrEqual(Math.max(from[key], to[key]));
        }
        expect(Math.abs(angleDifference(from.bearing, frame.bearing))).toBeLessThanOrEqual(
          Math.abs(angleDifference(from.bearing, to.bearing))
        );
      }
    }
  });

  test.each([-1, 1])('keeps curves within valid latitudes near the pole (%s)', direction => {
    const polar = {
      stops: throughTour.stops.map((stop, index) => ({
        ...stop,
        camera: {...stop.camera, latitude: direction * [80, 89.99, 89.99][index]}
      }))
    };
    for (let time = 0; time <= 4000; time += 50) {
      expect(getCameraSnapshot(evaluateCameraTour(polar, time))).not.toBeNull();
    }
  });

  test('coincident positions and a complete reversal do not introduce loops', () => {
    for (const longitudes of [
      [0, 2, 0],
      [0, 0, 2]
    ]) {
      const repeated = {
        stops: throughTour.stops.map((stop, index) => ({
          ...stop,
          camera: {...stop.camera, longitude: longitudes[index], latitude: 0}
        }))
      };
      for (let time = 0; time <= 4000; time += 50) {
        const frame = evaluateCameraTour(repeated, time)!;
        expect(frame.latitude).toBe(0);
        expect(frame.longitude).toBeGreaterThanOrEqual(0);
        expect(frame.longitude).toBeLessThanOrEqual(2);
        if (longitudes[0] === longitudes[1] && time <= 1000) expect(frame.longitude).toBe(0);
      }
    }
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

describe('camera projection adaptation', () => {
  test('preserves flat camera values and leaves the saved snapshot untouched on globe', () => {
    expect(cameraForMap(camera)).toBe(camera);
    expect(cameraForMap(camera, true)).toEqual({...camera, pitch: 0, bearing: 0});
    expect(camera.pitch).toBe(45);
    expect(camera.bearing).toBe(350);
  });
  test.each([-90, 90])('constrains polar views and latitude-adjusted zoom at %s', latitude => {
    const limit = Math.sign(latitude) * GLOBE_MAX_LATITUDE;
    const adjustment = Math.log2(Math.cos((limit * Math.PI) / 180));
    expect(cameraForMap({...camera, latitude, zoom: -100}, true)).toMatchObject({
      latitude: limit,
      zoom: GLOBE_MIN_ZOOM + adjustment
    });
    expect(cameraForMap({...camera, latitude, zoom: 100}, true).zoom).toBe(
      GLOBE_MAX_ZOOM + adjustment
    );
  });
});
