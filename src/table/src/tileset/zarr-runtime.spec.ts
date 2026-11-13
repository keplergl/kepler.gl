/**
 * SPDX-License-Identifier: MIT
 * Copyright contributors to the kepler.gl project
 * @jest-environment node
 */

const zarrModule = {__esModule: true, open: jest.fn()};
const geoZarrModule = {__esModule: true, parseGeoZarrMetadata: jest.fn()};
let loadZarr: jest.Mock;
let loadGeoZarr: jest.Mock;

function getLoader(): typeof import('./zarr-runtime')['loadZarrRuntime'] {
  return require('./zarr-runtime').loadZarrRuntime;
}

beforeEach(() => {
  jest.resetModules();
  loadZarr = jest.fn(() => zarrModule);
  loadGeoZarr = jest.fn(() => geoZarrModule);
  jest.doMock('zarrita', () => loadZarr());
  jest.doMock('@developmentseed/geozarr', () => loadGeoZarr());
});

afterEach(() => {
  jest.dontMock('zarrita');
  jest.dontMock('@developmentseed/geozarr');
  jest.resetModules();
});

describe('loadZarrRuntime', () => {
  it('does not initialize dependencies merely by importing the loader', () => {
    getLoader();

    expect(loadZarr).not.toHaveBeenCalled();
    expect(loadGeoZarr).not.toHaveBeenCalled();
  });

  it('shares an in-flight load and exposes both runtime dependencies', async () => {
    const loadRuntime = getLoader();
    const first = loadRuntime();
    const second = loadRuntime();

    // Both calls happen before the dynamic imports settle, without timers or network access.
    expect(second).toBe(first);
    const runtime = await first;
    expect(runtime.zarr.open).toBe(zarrModule.open);
    expect(runtime.parseGeoZarrMetadata).toBe(geoZarrModule.parseGeoZarrMetadata);
    expect(await second).toBe(runtime);
    expect(loadZarr).toHaveBeenCalledTimes(1);
    expect(loadGeoZarr).toHaveBeenCalledTimes(1);
  });

  it('reuses the successful runtime for subsequent requests', async () => {
    const loadRuntime = getLoader();
    const first = loadRuntime();
    const runtime = await first;

    const cached = loadRuntime();
    expect(cached).toBe(first);
    expect(await cached).toBe(runtime);
    expect(loadZarr).toHaveBeenCalledTimes(1);
    expect(loadGeoZarr).toHaveBeenCalledTimes(1);
  });

  it.each(['zarrita', 'geozarr'])('allows retry after %s fails to load', async dependency => {
    const failure = new Error(`Failed to load ${dependency}`);
    const failingLoader = dependency === 'zarrita' ? loadZarr : loadGeoZarr;
    failingLoader.mockImplementationOnce(() => {
      throw failure;
    });
    const loadRuntime = getLoader();
    const failed = loadRuntime();
    expect(loadRuntime()).toBe(failed);
    await expect(failed).rejects.toBe(failure);

    const retry = loadRuntime();
    expect(retry).not.toBe(failed);
    expect(loadRuntime()).toBe(retry);
    const runtime = await retry;
    expect(runtime.zarr.open).toBe(zarrModule.open);
    expect(runtime.parseGeoZarrMetadata).toBe(geoZarrModule.parseGeoZarrMetadata);
    expect(failingLoader).toHaveBeenCalledTimes(2);
    expect(loadRuntime()).toBe(retry);
  });
});
