// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import type {TimeRangeFilter} from '@kepler.gl/types';
import {mergeFilterWithTimeline} from '@kepler.gl/utils';
import type {KeplerContext} from './types';

/** Include GPU filters, using the same CPU evaluation used for data export. */
export function getVisibleCounts(ctx: KeplerContext, datasetIds: string[]) {
  const state = ctx.getVisState();
  return Object.fromEntries(
    datasetIds.map(dataId => {
      const dataset = state.datasets[dataId];
      if (!dataset || dataset.disableDataOperation) return [dataId, null];
      dataset.filterTableCPU(state.filters ?? [], state.layers);
      return [dataId, dataset.filteredIdxCPU?.length ?? 0];
    })
  );
}

export function getTimeFilterState(ctx: KeplerContext, filter: TimeRangeFilter) {
  const state = ctx.getVisState();
  return {
    filterId: filter.id,
    filterIndex: state.filters.indexOf(filter),
    bindings: filter.dataId.map((datasetId, index) => ({
      datasetId,
      startField: filter.name[index],
      endField: filter.endName?.[index] ?? null
    })),
    domain: mergeFilterWithTimeline(filter, state.animationConfig).filter.domain,
    value: filter.value,
    selectedTime:
      filter.value?.[filter.syncedWithLayerTimeline && filter.syncTimelineMode === 0 ? 0 : 1],
    animationWindow: filter.animationWindow,
    interval: filter.plotType?.interval,
    speed: filter.speed,
    isAnimating: Boolean(filter.isAnimating),
    animationLoop: filter.animationLoop !== false,
    enabled: filter.enabled,
    syncedWithLayerTimeline: Boolean(filter.syncedWithLayerTimeline),
    syncTimelineMode: filter.syncTimelineMode,
    visibleCounts: getVisibleCounts(ctx, filter.dataId)
  };
}
