// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import type {ZarrDatasetMetadata, ZarrVariableInfo} from '@kepler.gl/constants';

import {parseGeoZarrMetadata} from '@developmentseed/geozarr';

import {
  affineFromCellCenters,
  assignVariableDisplayNames,
  buildMultiscaleAttrs,
  childPrefix,
  decodeCfTime,
  isWebMercatorPyramid,
  multiscaleVariableNames,
  orderLevelsFinestFirst,
  parseOmeMultiscaleLevels,
  getZarrDimensionNames,
  getZarrTimeDomain,
  getZarrVariable,
  parseCfTimeUnits,
  parseGdalGeoTransform,
  resolveCoordinatePath,
  selectZarrVariable
} from './zarr-utils';

const HOUR = 3_600_000;
const DAY = 86_400_000;

describe('parseCfTimeUnits', () => {
  it('parses the fixed-length units', () => {
    expect(parseCfTimeUnits('seconds since 1970-01-01')).toEqual({stepMs: 1000, originMs: 0});
    expect(parseCfTimeUnits('hours since 1970-01-01')).toEqual({stepMs: HOUR, originMs: 0});
    expect(parseCfTimeUnits('days since 1970-01-01')).toEqual({stepMs: DAY, originMs: 0});
    expect(parseCfTimeUnits('milliseconds since 1970-01-01')).toEqual({stepMs: 1, originMs: 0});
  });

  it('parses non-epoch origins, with and without a time of day', () => {
    expect(parseCfTimeUnits('days since 2020-01-01')).toEqual({
      stepMs: DAY,
      originMs: Date.UTC(2020, 0, 1)
    });
    expect(parseCfTimeUnits('hours since 2020-03-05 06:30:00')).toEqual({
      stepMs: HOUR,
      originMs: Date.UTC(2020, 2, 5, 6, 30, 0)
    });
    expect(parseCfTimeUnits('hours since 2020-03-05T06:30:00Z')).toEqual({
      stepMs: HOUR,
      originMs: Date.UTC(2020, 2, 5, 6, 30, 0)
    });
    // Single-digit month/day, as written by several CF producers.
    expect(parseCfTimeUnits('days since 2020-1-1 0:0:0')).toEqual({
      stepMs: DAY,
      originMs: Date.UTC(2020, 0, 1)
    });
  });

  it('applies the UTC offset of the origin', () => {
    expect(parseCfTimeUnits('hours since 2020-01-01T00:00:00+02:00')).toEqual({
      stepMs: HOUR,
      originMs: Date.UTC(2020, 0, 1) - 2 * HOUR
    });
  });

  it('keeps years below 100 instead of mapping them into the 1900s', () => {
    const parsed = parseCfTimeUnits('days since 0001-01-01');
    expect(parsed).not.toBeNull();
    expect(new Date(parsed!.originMs).getUTCFullYear()).toBe(1);
  });

  it('returns null for units that are not fixed length or not parseable', () => {
    expect(parseCfTimeUnits('months since 1970-01-01')).toBeNull();
    expect(parseCfTimeUnits('years since 1970-01-01')).toBeNull();
    expect(parseCfTimeUnits('meters')).toBeNull();
    expect(parseCfTimeUnits('seconds since not-a-date')).toBeNull();
    expect(parseCfTimeUnits(undefined)).toBeNull();
    expect(parseCfTimeUnits('')).toBeNull();
  });
});

describe('decodeCfTime', () => {
  it('decodes numeric offsets to epoch milliseconds', () => {
    expect(decodeCfTime([0, 3600, 7200], 'seconds since 1970-01-01')).toEqual([0, HOUR, 2 * HOUR]);
  });

  it('decodes a typed array of bigints', () => {
    expect(decodeCfTime(new BigInt64Array([0n, 1n, 2n]), 'days since 2020-01-01')).toEqual([
      Date.UTC(2020, 0, 1),
      Date.UTC(2020, 0, 2),
      Date.UTC(2020, 0, 3)
    ]);
  });

  it('returns null for calendars that have no real-world timeline', () => {
    expect(decodeCfTime([0, 1], 'days since 2020-01-01', '360_day')).toBeNull();
    expect(decodeCfTime([0, 1], 'days since 2020-01-01', 'noleap')).toBeNull();
    expect(decodeCfTime([0, 1], 'days since 2020-01-01', 'proleptic_gregorian')).not.toBeNull();
  });

  it('returns null for missing units, empty input, or non-finite values', () => {
    expect(decodeCfTime([0, 1], undefined)).toBeNull();
    expect(decodeCfTime([], 'seconds since 1970-01-01')).toBeNull();
    expect(decodeCfTime(null, 'seconds since 1970-01-01')).toBeNull();
    expect(decodeCfTime([0, Number.NaN], 'seconds since 1970-01-01')).toBeNull();
  });
});

describe('getZarrTimeDomain', () => {
  it('derives a sorted, de-duplicated domain and step list', () => {
    expect(getZarrTimeDomain({name: 'time', size: 4, values: [30, 10, 20, 10]})).toEqual({
      domain: [10, 30],
      timeSteps: [10, 20, 30]
    });
  });

  it('returns null when there is nothing to animate', () => {
    expect(getZarrTimeDomain(undefined)).toBeNull();
    expect(getZarrTimeDomain({name: 'time', size: 1})).toBeNull();
    expect(getZarrTimeDomain({name: 'time', size: 1, values: [5]})).toBeNull();
    expect(getZarrTimeDomain({name: 'time', size: 2, values: [5, 5]})).toBeNull();
  });
});

describe('getZarrDimensionNames', () => {
  it('reads zarr v3 dimension_names', () => {
    expect(getZarrDimensionNames({dimensionNames: ['time', 'y', 'x'], shape: [3, 4, 5]})).toEqual([
      'time',
      'y',
      'x'
    ]);
  });

  it('falls back to the xarray _ARRAY_DIMENSIONS attribute', () => {
    expect(getZarrDimensionNames({attrs: {_ARRAY_DIMENSIONS: ['y', 'x']}, shape: [4, 5]})).toEqual([
      'y',
      'x'
    ]);
  });

  it('returns null when a dimension is unnamed or the rank does not match', () => {
    expect(getZarrDimensionNames({dimensionNames: [null, 'y', 'x'], shape: [3, 4, 5]})).toBeNull();
    expect(getZarrDimensionNames({dimensionNames: ['y', 'x'], shape: [3, 4, 5]})).toBeNull();
    expect(getZarrDimensionNames({shape: [4, 5]})).toBeNull();
  });
});

describe('resolveCoordinatePath', () => {
  // Zarr over HTTP has no directory listing, so a guess at a path that is not
  // in the store costs a 404 round trip. The listing has to be consulted first.
  const index = new Map<string, 'array' | 'group'>([
    ['', 'group'],
    ['FUTUR', 'group'],
    ['FUTUR/qtot', 'array'],
    ['FUTUR/lat', 'array'],
    ['time', 'array']
  ]);

  it('prefers a coordinate stored beside the variable', () => {
    expect(resolveCoordinatePath(index, 'FUTUR/qtot', 'lat')).toBe('/FUTUR/lat');
  });

  it('falls back to a coordinate hoisted to the store root', () => {
    expect(resolveCoordinatePath(index, 'FUTUR/qtot', 'time')).toBe('/time');
  });

  it('returns null when the listing has no such coordinate', () => {
    expect(resolveCoordinatePath(index, 'FUTUR/qtot', 'lead_time')).toBeNull();
  });

  it('does not mistake a group for a coordinate array', () => {
    expect(resolveCoordinatePath(index, 'FUTUR/qtot', 'FUTUR')).toBeNull();
  });

  it('returns null without a listing so the caller probes instead', () => {
    expect(resolveCoordinatePath(null, 'FUTUR/qtot', 'lat')).toBeNull();
  });
});

describe('parseGdalGeoTransform', () => {
  // GDAL writes [c, a, b, f, d, e]; the affine convention is [a, b, c, d, e, f].
  it('reorders a GDAL GeoTransform string into affine order', () => {
    expect(parseGdalGeoTransform('-180 0.5 0 90 0 -0.5')).toEqual([0.5, 0, -180, 0, -0.5, 90]);
  });

  it('accepts an array as well as a string', () => {
    expect(parseGdalGeoTransform([-180, 0.5, 0, 90, 0, -0.5])).toEqual([0.5, 0, -180, 0, -0.5, 90]);
  });

  it('tolerates irregular whitespace', () => {
    expect(parseGdalGeoTransform('  -180   0.5 0\n90 0 -0.5 ')).toEqual([
      0.5, 0, -180, 0, -0.5, 90
    ]);
  });

  it('rejects anything that is not six finite numbers', () => {
    expect(parseGdalGeoTransform('-180 0.5 0 90 0')).toBeNull();
    expect(parseGdalGeoTransform('-180 0.5 0 90 0 -0.5 1')).toBeNull();
    expect(parseGdalGeoTransform('-180 nope 0 90 0 -0.5')).toBeNull();
    expect(parseGdalGeoTransform(undefined)).toBeNull();
    expect(parseGdalGeoTransform({})).toBeNull();
  });
});

describe('affineFromCellCenters', () => {
  it('steps the origin back by half a cell', () => {
    // Global 0.5 degree grid, north-up: centers start at -179.75 / 89.75.
    expect(affineFromCellCenters({first: -179.75, step: 0.5}, {first: 89.75, step: -0.5})).toEqual([
      0.5, 0, -180, 0, -0.5, 90
    ]);
  });

  it('handles a south-up grid', () => {
    expect(affineFromCellCenters({first: 0.5, step: 1}, {first: 0.5, step: 1})).toEqual([
      1, 0, 0, 0, 1, 0
    ]);
  });
});

describe('parseOmeMultiscaleLevels', () => {
  it('reads the level paths ndpyramid writes', () => {
    expect(
      parseOmeMultiscaleLevels({
        multiscales: [{datasets: [{path: '0'}, {path: '1'}, {path: '2'}], type: 'reduce'}]
      })
    ).toEqual(['0', '1', '2']);
  });

  it('accepts a bare descriptor as well as a list', () => {
    expect(parseOmeMultiscaleLevels({multiscales: {datasets: [{path: '0'}]}})).toEqual(['0']);
  });

  it('ignores the zarr-conventions layout form', () => {
    expect(
      parseOmeMultiscaleLevels({multiscales: {layout: [{asset: '0'}, {asset: '1'}]}})
    ).toBeNull();
  });

  it('rejects a descriptor without usable paths', () => {
    expect(parseOmeMultiscaleLevels({})).toBeNull();
    expect(parseOmeMultiscaleLevels({multiscales: [{datasets: []}]})).toBeNull();
    expect(parseOmeMultiscaleLevels({multiscales: [{datasets: [{path: 2}]}]})).toBeNull();
    expect(parseOmeMultiscaleLevels({multiscales: [{datasets: [{path: '/'}]}]})).toBeNull();
  });
});

describe('childPrefix', () => {
  it('matches only the children of a matched node', () => {
    expect('FUTUR/qtot'.startsWith(childPrefix('FUTUR'))).toBe(true);
    expect('FUTURE/qtot'.startsWith(childPrefix('FUTUR'))).toBe(false);
  });

  it('matches everything when the root itself matched', () => {
    // A pyramid at the root owns every remaining path, so its levels must not
    // be offered as variables of their own.
    expect('0/temperature'.startsWith(childPrefix(''))).toBe(true);
    expect('lat'.startsWith(childPrefix('/'))).toBe(true);
  });
});

describe('isWebMercatorPyramid', () => {
  it('recognises a pyramid reprojected to web mercator', () => {
    // What CarbonPlan publishes, from `ndpyramid`'s `pyramid_reproject`.
    const attrs = {
      multiscales: [
        {
          datasets: [
            {path: '0', crs: 'EPSG:3857', pixels_per_tile: 128},
            {path: '1', crs: 'EPSG:3857', pixels_per_tile: 128}
          ],
          type: 'reduce'
        }
      ]
    };

    expect(isWebMercatorPyramid(attrs)).toBe(true);
  });

  it('rejects a pyramid that only coarsens the source grid', () => {
    const attrs = {
      multiscales: [{datasets: [{path: '0'}, {path: '1'}], type: 'reduce'}]
    };

    expect(isWebMercatorPyramid(attrs)).toBe(false);
  });

  it('rejects a single level and the zarr-conventions layout form', () => {
    expect(
      isWebMercatorPyramid({
        multiscales: [{datasets: [{path: '0', crs: 'EPSG:3857', pixels_per_tile: 128}]}]
      })
    ).toBe(false);
    expect(isWebMercatorPyramid({multiscales: {layout: [{asset: '0'}]}})).toBe(false);
    expect(isWebMercatorPyramid({})).toBe(false);
  });
});

describe('orderLevelsFinestFirst', () => {
  const assets = (levels: {asset: string}[]) => levels.map(level => level.asset);

  it('reverses a web-mercator pyramid, which numbers its levels by zoom', () => {
    // What CarbonPlan publishes: `0` is one 128px tile for the whole world.
    const declared = [
      {asset: '0/climate', shape: [128, 128]},
      {asset: '1/climate', shape: [256, 256]},
      {asset: '2/climate', shape: [512, 512]}
    ];

    expect(assets(orderLevelsFinestFirst(declared))).toEqual([
      '2/climate',
      '1/climate',
      '0/climate'
    ]);
  });

  it('leaves a pyramid that already declares the finest level first', () => {
    const declared = [
      {asset: '0', shape: [512, 1024]},
      {asset: '1', shape: [256, 512]},
      {asset: '2', shape: [128, 256]}
    ];

    expect(assets(orderLevelsFinestFirst(declared))).toEqual(['0', '1', '2']);
  });

  it('does not mutate the levels it was given', () => {
    const declared = [
      {asset: 'a', shape: [1, 1]},
      {asset: 'b', shape: [4, 4]}
    ];
    orderLevelsFinestFirst(declared);

    expect(assets(declared)).toEqual(['a', 'b']);
  });
});

describe('multiscaleVariableNames', () => {
  it('returns one unnamed variable when the level is the array', () => {
    const index = new Map<string, 'array' | 'group'>([['pyramid/0', 'array']]);
    expect(multiscaleVariableNames(index, 'pyramid/0')).toEqual(['']);
  });

  it('lists the arrays an ndpyramid level group holds', () => {
    const index = new Map<string, 'array' | 'group'>([
      ['pyramid/0', 'group'],
      ['pyramid/0/qtot', 'array'],
      ['pyramid/0/evap_total', 'array'],
      ['pyramid/0/x', 'array'],
      ['pyramid/0/nested', 'group'],
      ['pyramid/0/nested/deep', 'array'],
      ['pyramid/1/qtot', 'array']
    ]);
    expect(multiscaleVariableNames(index, 'pyramid/0').sort()).toEqual(['evap_total', 'qtot', 'x']);
  });

  it('returns nothing without a listing', () => {
    expect(multiscaleVariableNames(null, 'pyramid/0')).toEqual([]);
  });
});

describe('buildMultiscaleAttrs', () => {
  const base = {
    'spatial:dimensions': ['y', 'x'],
    'spatial:transform': [1, 0, -180, 0, -1, 90],
    'spatial:shape': [180, 360],
    'proj:code': 'EPSG:4326'
  };

  it('produces a layout the GeoZarr parser reads back, finest first', () => {
    const attrs = buildMultiscaleAttrs(base, [
      {asset: '0/qtot', transform: [1, 0, -180, 0, -1, 90], shape: [180, 360]},
      {asset: '1/qtot', transform: [2, 0, -180, 0, -2, 90], shape: [90, 180]}
    ]);

    const {levels, crs, axes} = parseGeoZarrMetadata(attrs);
    expect(levels.map(level => level.path)).toEqual(['0/qtot', '1/qtot']);
    expect([levels[0].arrayHeight, levels[0].arrayWidth]).toEqual([180, 360]);
    expect([levels[1].arrayHeight, levels[1].arrayWidth]).toEqual([90, 180]);
    expect(crs.code).toBe('EPSG:4326');
    expect(axes).toEqual(['y', 'x']);
  });

  it('keeps the finest grid at the top level as a fallback', () => {
    const attrs = buildMultiscaleAttrs(base, [
      {asset: '0', transform: [1, 0, -180, 0, -1, 90], shape: [180, 360]}
    ]);
    expect(attrs['spatial:transform']).toEqual(base['spatial:transform']);
    expect(attrs['spatial:shape']).toEqual(base['spatial:shape']);
  });
});

describe('assignVariableDisplayNames', () => {
  const variable = (path: string) => ({
    path,
    name: path.split('/').filter(Boolean).pop() as string,
    displayName: path.split('/').filter(Boolean).pop() as string
  });

  it('leaves unique names untouched', () => {
    const result = assignVariableDisplayNames([
      variable('FUTUR/qtot'),
      variable('HISTO/evap_total')
    ]);
    expect(result.map(v => v.displayName)).toEqual(['qtot', 'evap_total']);
  });

  it('qualifies names repeated across sibling groups', () => {
    const result = assignVariableDisplayNames([
      variable('FUTUR/evap_total'),
      variable('HISTO/evap_total'),
      variable('RCP/evap_total')
    ]);
    expect(result.map(v => v.displayName)).toEqual([
      'FUTUR/evap_total',
      'HISTO/evap_total',
      'RCP/evap_total'
    ]);
  });

  it('adds only as many path segments as it takes to disambiguate', () => {
    const result = assignVariableDisplayNames([
      variable('cciwr/FUTUR/data/evap_total'),
      variable('cciwr/HISTO/data/evap_total')
    ]);
    expect(result.map(v => v.displayName)).toEqual([
      'FUTUR/data/evap_total',
      'HISTO/data/evap_total'
    ]);
  });

  it('keeps the array name when the path has nothing left to add', () => {
    const result = assignVariableDisplayNames([
      variable('evap_total'),
      {...variable('evap_total')}
    ]);
    expect(result.map(v => v.displayName)).toEqual(['evap_total', 'evap_total']);
  });
});

describe('variable selection', () => {
  const temperature: ZarrVariableInfo = {
    path: 'temperature',
    name: 'temperature',
    displayName: 'temperature',
    shape: [12, 180, 360],
    chunks: [1, 90, 90],
    dtype: 'float32',
    nonSpatialDims: [{name: 'time', size: 12, values: [0, DAY]}],
    timeDimension: {name: 'time', size: 12, values: [0, DAY]},
    dataRange: [-40, 40]
  };
  const elevation: ZarrVariableInfo = {
    path: 'elevation',
    name: 'elevation',
    displayName: 'elevation',
    shape: [180, 360],
    chunks: [90, 90],
    dtype: 'int16',
    nonSpatialDims: [],
    dataRange: [0, 8000]
  };
  const metadata: ZarrDatasetMetadata = {
    url: 'https://example.com/store.zarr',
    variable: 'temperature',
    axes: ['time', 'y', 'x'],
    xAxisIndex: 2,
    yAxisIndex: 1,
    levels: [{path: '0', shape: [180, 360], chunks: [90, 90]}],
    variables: [temperature, elevation],
    nonSpatialDims: temperature.nonSpatialDims,
    timeDimension: temperature.timeDimension,
    dataRange: temperature.dataRange
  };

  it('resolves a variable by path and falls back to the first one', () => {
    expect(getZarrVariable(metadata, 'elevation')).toBe(elevation);
    expect(getZarrVariable(metadata)).toBe(temperature);
    expect(getZarrVariable(metadata, 'missing')).toBe(temperature);
    expect(getZarrVariable({variables: []})).toBeUndefined();
    expect(getZarrVariable(undefined)).toBeUndefined();
  });

  it('switches the active variable without refetching', () => {
    const next = selectZarrVariable(metadata, 'elevation');
    expect(next.variable).toBe('elevation');
    expect(next.nonSpatialDims).toEqual([]);
    expect(next.timeDimension).toBeUndefined();
    expect(next.dataRange).toEqual([0, 8000]);
    // The source metadata is untouched.
    expect(metadata.variable).toBe('temperature');
  });

  it('is a no-op for an unknown variable path', () => {
    expect(selectZarrVariable({...metadata, variables: []}, 'elevation').variable).toBe(
      'temperature'
    );
  });
});
