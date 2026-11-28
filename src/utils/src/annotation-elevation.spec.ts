// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {
  DEFAULT_ANNOTATION_ELEVATION,
  getAnnotationElevationLabels,
  getElevationReferenceStatus,
  normalizeAnnotationElevation
} from './annotation-elevation';

const lightning = {
  ...DEFAULT_ANNOTATION_ELEVATION,
  value: 7448.36,
  datum: 'MSL',
  reference: {value: 990, unit: 'm' as const, datum: 'MSL'},
  display: 'both' as const
};

test('formats the signed source altitude and difference before rounding', () => {
  expect(getAnnotationElevationLabels(lightning)).toEqual([
    '7.45 km above sea level',
    '6.46 km above reference'
  ]);
  expect(
    getAnnotationElevationLabels({
      ...lightning,
      value: -1000,
      reference: {...lightning.reference, value: 0}
    })
  ).toEqual(['-1.00 km above sea level', '-1.00 km above reference']);
  expect(
    getAnnotationElevationLabels({
      ...lightning,
      value: 0,
      reference: {...lightning.reference, value: 0}
    })
  ).toEqual(['0.00 km above sea level', '0.00 km above reference']);
});

test('converts source and reference units independently and ignores reference rendering offsets', () => {
  expect(
    getAnnotationElevationLabels({
      ...lightning,
      value: 1000,
      unit: 'ft',
      outputUnit: 'm',
      reference: {value: 0.1, unit: 'km', datum: 'MSL', displayZ: 6000}
    })
  ).toEqual(['304.80 m above sea level', '204.80 m above reference']);
});

test('missing measurements or references never become zero; mismatched datums cannot be subtracted', () => {
  expect(getAnnotationElevationLabels({...lightning, value: null})).toEqual([
    'Elevation unavailable',
    'Elevation unavailable'
  ]);
  expect(getAnnotationElevationLabels({...lightning, reference: null})).toEqual([
    '7.45 km above sea level',
    'Ground reference unavailable'
  ]);
  for (const datum of ['ellipsoid', 'EGM96']) {
    expect(getAnnotationElevationLabels({...lightning, datum})[1]).toBe(
      'Vertical references do not match'
    );
  }
});

test.each([
  ['unknown', 'unknown'],
  ['UNKNOWN', 'MSL'],
  ['MSL', 'unknown']
])('unknown datums %s/%s cannot produce a relative height or guide', (datum, referenceDatum) => {
  const elevation = {
    ...lightning,
    datum,
    reference: {...lightning.reference, datum: referenceDatum}
  };
  expect(getElevationReferenceStatus(elevation)).toBe('Vertical datum unknown');
  expect(getAnnotationElevationLabels(elevation)[1]).toBe('Vertical datum unknown');
});

test('distinguishes measurements with named and unknown vertical datums', () => {
  expect(getAnnotationElevationLabels({...lightning, datum: 'EGM96'})[0]).toBe(
    '7.45 km above EGM96'
  );
  expect(getAnnotationElevationLabels({...lightning, datum: 'unknown'})[0]).toBe(
    '7.45 km (vertical datum unknown)'
  );
});

test.each([
  {},
  [],
  null,
  {...lightning, value: NaN},
  {...lightning, value: ''},
  {...lightning, reference: undefined},
  {...lightning, reference: {...lightning.reference, displayZ: Infinity}},
  {...lightning, unit: 'bad'},
  {...lightning, precision: 7},
  {...lightning, field: {dataId: '', name: 'altitude'}}
])('rejects invalid elevation settings %j', value => {
  expect(normalizeAnnotationElevation(value)).toBeUndefined();
});

test.each([
  {dataId: 'detections', name: 'altitude'},
  {dataId: ' detections', name: ' altitude '}
])('normalization preserves exact source identifiers %j', field => {
  const value = {...lightning, field};
  const result = normalizeAnnotationElevation(value)!;
  expect(result).toEqual(value);
  expect(result.reference).not.toBe(value.reference);
  expect(result.field).not.toBe(value.field);
});
