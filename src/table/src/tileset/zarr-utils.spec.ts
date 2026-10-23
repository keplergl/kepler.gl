// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import type {ZarrDatasetMetadata, ZarrVariableInfo} from '@kepler.gl/constants';

import {parseGeoZarrMetadata} from '@developmentseed/geozarr';
import {BoolArray, UnicodeStringArray} from 'zarrita';
import {Headers, Request, Response} from 'node-fetch';

import {
  affineFromCellCenters,
  assignVariableDisplayNames,
  buildMultiscaleAttrs,
  childPrefix,
  clearZarrStoreCache,
  decodeCfTime,
  decodeZarrCoordinate,
  isWebMercatorPyramid,
  multiscaleVariableNames,
  orderLevelsFinestFirst,
  parseOmeMultiscaleLevels,
  getZarrDimensionNames,
  getZarrMetadata,
  openZarrStore,
  getZarrTimeDomain,
  axisSpacingFromValues,
  getZarrVariable,
  parseCfTimeUnits,
  parseGdalGeoTransform,
  resolveCoordinatePath,
  selectZarrVariable
} from './zarr-utils';
import {getZarrAxis, getZarrForecastAxes, formatZarrCoordinate} from './zarr-axis';

const HOUR = 3_600_000;
const DAY = 86_400_000;

function axisVariable(nonSpatialDims: ZarrVariableInfo['nonSpatialDims']): ZarrVariableInfo {
  return {
    path: 'climate',
    name: 'climate',
    displayName: 'climate',
    dtype: 'float32',
    shape: [...nonSpatialDims.map(d => d.size), 2, 2],
    chunks: [1, 2, 2],
    nonSpatialDims
  };
}

describe('Zarr metadata', () => {
  const url = 'https://example.com/cancellable.zarr';
  const originalGlobals = {
    fetch: globalThis.fetch,
    Request: globalThis.Request,
    Headers: globalThis.Headers
  };
  const fetchMock = jest.fn();
  const array = {
    zarr_format: 2,
    shape: [2, 2, 2],
    chunks: [1, 2, 2],
    dtype: '<f8',
    compressor: null,
    fill_value: null,
    order: 'C',
    filters: null
  };
  const consolidated = {
    zarr_consolidated_format: 1,
    metadata: {
      '.zgroup': {zarr_format: 2},
      '.zattrs': {},
      'climate/.zarray': array,
      'climate/.zattrs': {
        _ARRAY_DIMENSIONS: ['month', 'lat', 'lon'],
        'spatial:dimensions': ['lat', 'lon'],
        'spatial:transform': [1, 0, 0, 0, -1, 2],
        'spatial:shape': [2, 2],
        'proj:code': 'EPSG:4326'
      },
      'month/.zarray': {...array, shape: [2], chunks: [2]},
      'month/.zattrs': {_ARRAY_DIMENSIONS: ['month']}
    }
  };

  function serve(request: Request) {
    if (request.url.endsWith('/.zmetadata')) {
      return new Response(JSON.stringify(consolidated));
    }
    if (request.url.endsWith('/month/0')) {
      return new Response(Buffer.from(new Float64Array([1, 2]).buffer));
    }
    return new Response(null, {status: 404});
  }

  function pendingUntilAbort(signal: AbortSignal) {
    return new Promise<never>((_, reject) => {
      if (signal.aborted) {
        reject(signal.reason);
      } else {
        signal.addEventListener('abort', () => reject(signal.reason), {once: true});
      }
    });
  }

  beforeAll(() => Object.assign(globalThis, {Request, Headers, fetch: fetchMock}));
  afterAll(() => Object.assign(globalThis, originalGlobals));
  beforeEach(() => {
    clearZarrStoreCache();
    fetchMock.mockReset();
  });
  afterEach(() => clearZarrStoreCache());

  it.each([
    ['<i8', -9999, -9999],
    ['<u8', 0, 0],
    ['<u8', '18446744073709551615', Number(18446744073709551615n)],
    ['<i8', null, undefined],
    ['<f8', 'NaN', undefined]
  ])(
    'normalizes %s fill value %s for numeric tile rendering',
    async (dtype, fillValue, expected) => {
      fetchMock.mockImplementation((request: Request) =>
        Promise.resolve(
          request.url.endsWith('/.zmetadata')
            ? new Response(
                JSON.stringify({
                  ...consolidated,
                  metadata: {
                    ...consolidated.metadata,
                    'climate/.zarray': {...array, dtype, fill_value: fillValue}
                  }
                })
              )
            : serve(request)
        )
      );
      const metadata = await getZarrMetadata(url);
      expect(metadata.nodataValue).toBe(expected);
      expect(metadata.variables[0].nodataValue).toBe(expected);
      expect(() => JSON.stringify(metadata)).not.toThrow();
    }
  );

  it('keeps spatial metadata and pyramid zoom settings with each variable', async () => {
    const contents: Record<string, unknown> = {
      ...consolidated.metadata,
      'pyramid/.zgroup': {zarr_format: 2},
      'pyramid/.zattrs': {
        multiscales: [
          {
            datasets: [128, 256, 512].map((_, level) => ({
              path: String(level),
              crs: 'EPSG:3857',
              pixels_per_tile: 128
            }))
          }
        ]
      }
    };
    [128, 256, 512].forEach((size, level) => {
      contents[`pyramid/${level}/.zgroup`] = {zarr_format: 2};
      contents[`pyramid/${level}/rain/.zarray`] = {
        ...array,
        shape: [size, size],
        chunks: [128, 128]
      };
      contents[`pyramid/${level}/rain/.zattrs`] = {
        _ARRAY_DIMENSIONS: ['y', 'x'],
        grid_mapping: 'spatial_ref'
      };
      contents[`pyramid/${level}/spatial_ref/.zarray`] = {
        ...array,
        shape: [],
        chunks: []
      };
      contents[`pyramid/${level}/spatial_ref/.zattrs`] = {
        epsg_code: 3857,
        GeoTransform: [-20037508, 40075016 / size, 0, 20037508, 0, -40075016 / size].join(' ')
      };
    });
    fetchMock.mockImplementation((request: Request) =>
      Promise.resolve(
        request.url.endsWith('/.zmetadata')
          ? new Response(JSON.stringify({...consolidated, metadata: contents}))
          : serve(request)
      )
    );

    const metadata = await getZarrMetadata(url, {variable: 'climate'});
    expect(metadata.variables.map(variable => variable.path)).toEqual(['climate', 'pyramid/rain']);
    expect(metadata.webMercatorPyramid).toBe(false);
    expect(metadata.crs).toEqual({code: 'EPSG:4326'});
    expect(metadata.axes).toEqual(['lat', 'lon']);
    expect(metadata.levels).toEqual([{path: '.', shape: [2, 2], chunks: [2, 2]}]);
    const requestCount = fetchMock.mock.calls.length;

    // Switching also works after a save/load, without reopening the store.
    const selected = selectZarrVariable(JSON.parse(JSON.stringify(metadata)), 'pyramid/rain');
    expect(selected.webMercatorPyramid).toBe(true);
    expect(selected.crs).toEqual({code: 'EPSG:3857'});
    expect(selected.axes).toEqual(['y', 'x']);
    expect(selected.xAxisIndex).toBe(1);
    expect(selected.yAxisIndex).toBe(0);
    expect(selected.levels).toEqual(
      [512, 256, 128].map((size, i) => ({
        path: `${2 - i}/rain`,
        shape: [size, size],
        chunks: [128, 128]
      }))
    );
    expect(selectZarrVariable(selected, 'climate')).toEqual(metadata);
    expect(fetchMock).toHaveBeenCalledTimes(requestCount);
    expect(metadata.crs).toEqual({code: 'EPSG:4326'});
  });

  it('does not start requests for an already-aborted load', async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(getZarrMetadata(url, {signal: controller.signal})).rejects.toBe(
      controller.signal.reason
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('does not start requests when cancelled while awaiting the runtime', async () => {
    const controller = new AbortController();
    const pending = getZarrMetadata(url, {signal: controller.signal});
    controller.abort();
    await expect(pending).rejects.toBe(controller.signal.reason);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([
    ['consolidated metadata', '/.zmetadata'],
    ['coordinate chunks', '/month/0']
  ])('aborts %s requests without returning partial metadata and permits retry', async (_, path) => {
    let started: () => void;
    const requestStarted = new Promise<void>(resolve => {
      started = resolve;
    });
    const controller = new AbortController();
    fetchMock.mockImplementation((request: Request, options?: RequestInit) => {
      if (request.url.endsWith(path)) {
        expect(options?.signal).toBe(controller.signal);
        started();
        return pendingUntilAbort(controller.signal);
      }
      return Promise.resolve(serve(request));
    });
    const pending = getZarrMetadata(url, {signal: controller.signal});
    const rejected = expect(pending).rejects.toMatchObject({name: 'AbortError'});
    await requestStarted;
    const requestCount = fetchMock.mock.calls.length;
    controller.abort();
    await rejected;
    expect(fetchMock).toHaveBeenCalledTimes(requestCount);

    fetchMock.mockImplementation((request: Request) => Promise.resolve(serve(request)));
    const retry = await getZarrMetadata(url, {signal: new AbortController().signal});
    expect(retry.variable).toBe('climate');
    expect(retry.nonSpatialDims[0].values).toEqual([1, 2]);
  });

  it('does not cancel or poison the shared layer store at the same URL', async () => {
    const controller = new AbortController();
    fetchMock.mockImplementation((request: Request, options?: RequestInit) =>
      options?.signal === controller.signal
        ? pendingUntilAbort(controller.signal)
        : Promise.resolve(serve(request))
    );
    const preview = getZarrMetadata(url, {signal: controller.signal});
    const rejected = expect(preview).rejects.toMatchObject({name: 'AbortError'});
    const layerStore = await openZarrStore(url);
    controller.abort();
    await rejected;

    expect(await openZarrStore(url)).toBe(layerStore);
    const chunk = await layerStore.get('/month/0');
    expect(chunk).toEqual(new Uint8Array(new Float64Array([1, 2]).buffer));
    const metadata = await getZarrMetadata(url);
    expect(metadata.nonSpatialDims[0].values).toEqual([1, 2]);
  });
});

describe('Zarr dimension axes', () => {
  it('decodes Zarr iterable string and boolean coordinates without coercing their labels', () => {
    const strings = decodeZarrCoordinate(
      'band',
      2,
      new UnicodeStringArray(4, ['tavg', 'prec']),
      {}
    );
    expect(strings.dimension.values).toEqual(['tavg', 'prec']);
    const booleans = decodeZarrCoordinate('enabled', 2, new BoolArray([true, false]), {});
    expect(
      getZarrAxis(axisVariable([booleans.dimension]), {kind: 'dimension', dimension: 'enabled'})
        .frames
    ).toEqual([
      {value: 0, label: 'true', selection: {enabled: 0}},
      {value: 1, label: 'false', selection: {enabled: 1}}
    ]);
    expect(
      decodeZarrCoordinate('member', 2, [0, 1], {standard_name: 'realization'}).dimension.kind
    ).toBe('category');
  });

  it('decodes large CF offsets while preserving exact raw offsets for saved metadata', () => {
    const offset = 10000000000000000n;
    const {dimension} = decodeZarrCoordinate('time', 1, [offset], {
      units: 'microseconds since 1970-01-01'
    });
    expect(dimension.kind).toBe('time');
    expect(dimension.values).toEqual([10000000000000]);
    expect(dimension.rawValues).toEqual([String(offset)]);
  });
  it('preserves CarbonPlan band labels and maps months to their original slices', () => {
    const band = decodeZarrCoordinate('band', 2, ['tavg', 'prec'], {}).dimension;
    const month = decodeZarrCoordinate(
      'month',
      12,
      Array.from({length: 12}, (_, i) => i + 1),
      {}
    ).dimension;
    const variable = axisVariable([band, month]);
    expect(band.kind).toBe('category');
    expect(formatZarrCoordinate(band, 1)).toBe('prec');
    expect(getZarrAxis(variable, {kind: 'dimension', dimension: 'month'}).frames[2]).toEqual({
      value: 3,
      label: '3',
      selection: {month: 2}
    });
    expect(getZarrAxis(variable, {kind: 'dimension', dimension: 'band'}).frames).toEqual([
      {value: 0, label: 'tavg', selection: {band: 0}},
      {value: 1, label: 'prec', selection: {band: 1}}
    ]);
  });

  it('keeps CMIP6 seasons, scenarios and models categorical, and horizons numeric', () => {
    const variable = axisVariable([
      decodeZarrCoordinate('season', 5, ['yearly', 'DJF', 'MAM', 'JJA', 'SON'], {}).dimension,
      decodeZarrCoordinate('ssp', 3, ['ssp126', 'ssp370', 'ssp585'], {}).dimension,
      decodeZarrCoordinate('gcm', 2, ['gfdl-esm4', 'ipsl-cm6a-lr'], {}).dimension,
      decodeZarrCoordinate('horizon', 3, [2030n, 2055n, 2085n], {}).dimension
    ]);
    const seasons = getZarrAxis(variable, {kind: 'dimension', dimension: 'season'});
    expect(seasons.frames.map(f => f.label)).toEqual(['yearly', 'DJF', 'MAM', 'JJA', 'SON']);
    expect(seasons.frames[3].selection).toEqual({season: 3});
    expect(getZarrAxis(variable, {kind: 'dimension', dimension: 'ssp'}).frames[2].label).toBe(
      'ssp585'
    );
    expect(getZarrAxis(variable, {kind: 'dimension', dimension: 'gcm'}).frames[1].label).toBe(
      'ipsl-cm6a-lr'
    );
    expect(
      getZarrAxis(variable, {kind: 'dimension', dimension: 'horizon'}).frames.map(f => f.value)
    ).toEqual([2030, 2055, 2085]);
    expect(getZarrForecastAxes(variable)).toEqual([]);
  });

  it.each(['ECMWF IFS Ensemble', 'NOAA HRRR Forecast'])(
    '%s varies forecast lead, not every run/member',
    name => {
      const isEcmwf = name.startsWith('ECMWF');
      const initCount = isEcmwf ? 935 : 12093;
      const leads = isEcmwf
        ? [
            ...Array.from({length: 49}, (_, i) => i * 3),
            ...Array.from({length: 36}, (_, i) => 150 + i * 6)
          ]
        : Array.from({length: 49}, (_, i) => i);
      const reference = decodeZarrCoordinate(
        'init_time',
        initCount,
        Array.from({length: initCount}, (_, i) => i * 86400),
        {
          units: 'seconds since 2024-04-01',
          calendar: 'proleptic_gregorian',
          standard_name: 'forecast_reference_time'
        }
      ).dimension;
      const lead = decodeZarrCoordinate(
        'lead_time',
        leads.length,
        leads.map(h => h * 3600),
        {units: 'seconds', standard_name: 'forecast_period', dtype: 'timedelta64[us]'}
      ).dimension;
      const variable = axisVariable([
        reference,
        lead,
        ...(isEcmwf ? [{name: 'ensemble_member', size: 51}] : [])
      ]);
      const [config] = getZarrForecastAxes(variable);
      expect(config).toEqual({kind: 'forecast', referenceTime: 'init_time', leadTime: 'lead_time'});
      const axis = getZarrAxis(variable, config, {init_time: 1, ensemble_member: 7});
      expect(axis.frames).toHaveLength(isEcmwf ? 85 : 49);
      expect(axis.frames[0].label).toBe('2024-04-02T00:00:00.000Z');
      expect(axis.frames[1].value - axis.frames[0].value).toBe((isEcmwf ? 3 : 1) * HOUR);
      expect(axis.frames[1].selection).toEqual({init_time: 1, lead_time: 1});
      expect(reference.rawValues?.[1]).toBe(86400);
      expect(lead.units).toBe('seconds');
    }
  );

  it('plays year, month and day as independent numeric axes', () => {
    const variable = axisVariable([
      {name: 'year', size: 2, values: [2025, 2024]},
      {name: 'month', size: 2, values: [3, 2]},
      {name: 'day', size: 3, values: [1, 29, 30]}
    ]);
    expect(getZarrAxis(variable, {kind: 'dimension', dimension: 'year'}).frames).toEqual([
      {value: 2024, label: '2024', selection: {year: 1}},
      {value: 2025, label: '2025', selection: {year: 0}}
    ]);
    expect(getZarrAxis(variable, {kind: 'dimension', dimension: 'month'}).frames).toEqual([
      {value: 2, label: '2', selection: {month: 1}},
      {value: 3, label: '3', selection: {month: 0}}
    ]);
    expect(getZarrAxis(variable, {kind: 'dimension', dimension: 'day'}).frames).toEqual([
      {value: 1, label: '1', selection: {day: 0}},
      {value: 29, label: '29', selection: {day: 1}},
      {value: 30, label: '30', selection: {day: 2}}
    ]);
  });

  it('keeps slices distinguishable with duplicate labels and sorts numeric values safely', () => {
    const variable = axisVariable([{name: 'sample', size: 3, values: [30, 10, 20]}]);
    expect(
      getZarrAxis(variable, {kind: 'dimension', dimension: 'sample'}).frames.map(
        f => f.selection.sample
      )
    ).toEqual([1, 2, 0]);
    variable.nonSpatialDims[0].values = ['A', 'A', 'B'];
    expect(
      getZarrAxis(variable, {kind: 'dimension', dimension: 'sample'}).frames.map(f => f.value)
    ).toEqual([0, 1, 2]);
    variable.nonSpatialDims[0].values = [2, 2, 3];
    expect(
      getZarrAxis(variable, {kind: 'dimension', dimension: 'sample'}).frames.map(
        f => f.selection.sample
      )
    ).toEqual([0, 1, 2]);
  });

  it('handles missing coordinates and rejects invalid or oversized axes', () => {
    const variable = axisVariable([
      {name: 'band', size: 2},
      {name: 'empty', size: 0},
      {name: 'sample', size: 100001},
      {name: 'invalid', size: -1}
    ]);
    expect(
      getZarrAxis(variable, {kind: 'dimension', dimension: 'band'}).frames.map(f => f.label)
    ).toEqual(['0', '1']);
    expect(getZarrAxis(variable, {kind: 'dimension', dimension: 'missing'}).error).toBeTruthy();
    expect(getZarrAxis(variable, {kind: 'dimension', dimension: 'empty'}).frames).toEqual([]);
    expect(getZarrAxis(variable, {kind: 'dimension', dimension: 'sample'}).error).toMatch(
      /too many frames/i
    );
    expect(getZarrAxis(variable, {kind: 'dimension', dimension: 'invalid'}).error).toBeTruthy();
    variable.nonSpatialDims[0].values = [NaN, Infinity];
    expect(getZarrAxis(variable, {kind: 'dimension', dimension: 'band'}).frames).toEqual([]);
    expect(getZarrAxis(variable, {kind: 'off'}).frames).toEqual([]);
  });
});

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

describe('axisSpacingFromValues', () => {
  it('derives the step from an evenly spaced axis', () => {
    expect(axisSpacingFromValues([10, 20, 30, 40])).toEqual({first: 10, step: 10});
    expect(axisSpacingFromValues([50, 40, 30])).toEqual({first: 50, step: -10});
  });

  it('tolerates the drift float32 coordinates accumulate', () => {
    expect(axisSpacingFromValues([0, 1, 2.1, 2.9, 4.05])).toEqual({first: 0, step: 1});
  });

  it('rejects an axis that drifts in the middle but lands on the expected end', () => {
    // A check that only compared the last value would accept this and derive an
    // affine that places the interior cells wrong.
    expect(axisSpacingFromValues([0, 1, 3, 3])).toBeNull();
    expect(axisSpacingFromValues([0, 10, 90, 30, 40])).toBeNull();
  });

  it('rejects an axis it cannot describe with one step', () => {
    expect(axisSpacingFromValues([5])).toBeNull();
    expect(axisSpacingFromValues([5, 5, 5])).toBeNull();
    expect(axisSpacingFromValues([0, 1, NaN, 3])).toBeNull();
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

  it('does not reuse another variable grid when spatial metadata is missing', () => {
    const next = selectZarrVariable(
      {...metadata, crs: {code: 'EPSG:4326'}, webMercatorPyramid: true},
      'elevation'
    );
    expect(next.crs).toBeUndefined();
    expect(next.axes).toEqual([]);
    expect(next.levels).toEqual([]);
    expect(next.webMercatorPyramid).toBe(false);
  });
});
