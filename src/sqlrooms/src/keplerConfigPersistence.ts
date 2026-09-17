// SPDX-License-Identifier: MIT
// Copyright SQLRooms Contributors and contributors to the kepler.gl project

import type {KeplerGlState} from '@kepler.gl/reducers';

type VisState = KeplerGlState['visState'];

/**
 * Collect dataset ids from live and pending layers/filters and pending tooltips.
 * Custom dataset-sync implementations can use this before a map is mounted.
 * Returns a new set, including references to datasets that are already loaded.
 */
export function getReferencedKeplerDatasetIds(visState: VisState): Set<string> {
  const dataIds = new Set<string>();
  for (const layer of [...visState.layers, ...visState.layerToBeMerged]) {
    if (layer.config.dataId) dataIds.add(layer.config.dataId);
  }
  for (const filter of [...visState.filters, ...visState.filterToBeMerged]) {
    for (const dataId of filter.dataId ?? []) dataIds.add(dataId);
  }
  // A saved tooltip can reference data even when the map has no layers/filters.
  for (const dataId of Object.keys(visState.interactionToBeMerged.tooltip?.fieldsToShow ?? {})) {
    dataIds.add(dataId);
  }
  return dataIds;
}

/**
 * Whether a map has config or dataset merges pending that prevent safe autosave.
 * Kepler's serializer omits pending config; saving it would discard those values.
 * This does not report the slice's persistence pause or outstanding async work.
 */
export function hasPendingKeplerConfig(visState: VisState): boolean {
  return (
    visState.layerToBeMerged.length > 0 ||
    visState.filterToBeMerged.length > 0 ||
    visState.splitMapsToBeMerged.length > 0 ||
    Object.keys(visState.interactionToBeMerged).length > 0 ||
    Object.values(visState.isMergingDatasets).some(Boolean)
  );
}
