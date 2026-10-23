// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// Keep ESM-only dependencies out of the package's synchronous CommonJS entry.
let runtimePromise:
  | Promise<{
      zarr: typeof import('zarrita');
      parseGeoZarrMetadata: typeof import('@developmentseed/geozarr')['parseGeoZarrMetadata'];
    }>
  | undefined;

export function loadZarrRuntime() {
  return (runtimePromise ??= Promise.all([import('zarrita'), import('@developmentseed/geozarr')])
    .then(([zarr, {parseGeoZarrMetadata}]) => ({zarr, parseGeoZarrMetadata}))
    .catch(error => {
      runtimePromise = undefined;
      throw error;
    }));
}
