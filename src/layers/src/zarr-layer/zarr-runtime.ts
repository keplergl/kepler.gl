// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

export type ZarrRuntime = {
  DeckZarrLayer: typeof import('@developmentseed/deck.gl-zarr')['ZarrLayer'];
  get: typeof import('zarrita')['get'];
};

let runtimePromise: Promise<ZarrRuntime> | undefined;

export function loadZarrRuntime(): Promise<ZarrRuntime> {
  return (runtimePromise ??= Promise.all([
    import('@developmentseed/deck.gl-zarr'),
    import('zarrita')
  ])
    .then(([{ZarrLayer: DeckZarrLayer}, {get}]) => ({DeckZarrLayer, get}))
    .catch(error => {
      runtimePromise = undefined;
      throw error;
    }));
}
