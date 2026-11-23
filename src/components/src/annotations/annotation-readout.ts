// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Annotation, AnimationConfig, Filter, TimeRangeFilter} from '@kepler.gl/types';
import {AnnotationKind} from '@kepler.gl/constants';
import {copyTable, Datasets, KeplerTable} from '@kepler.gl/table';
import {datetimeFormatter} from '@kepler.gl/utils';
import type {Layer} from '@kepler.gl/layers';

type ReadoutContext = {
  animationConfig?: Partial<AnimationConfig>;
  filters?: Filter[];
  datasets?: Datasets;
  layers?: Layer[];
};

const EMPTY_FILTERS: Filter[] = [];
const EMPTY_LAYERS: Layer[] = [];
const counts = new WeakMap<
  KeplerTable,
  {filters: Filter[]; layers: Layer[]; revision: number; value: string}
>();

/** Resolve against the current data frame, never the elapsed camera-tour clock. */
export function getAnnotationReadoutValues(
  annotations: Annotation[],
  {
    animationConfig,
    filters = EMPTY_FILTERS,
    datasets = {},
    layers = EMPTY_LAYERS
  }: ReadoutContext = {}
): Record<string, string> {
  const timeFilters = filters.filter(
    (filter): filter is TimeRangeFilter => filter.enabled !== false && filter.type === 'timeRange'
  );
  const timeFilter =
    timeFilters.find(filter => filter.isAnimating) ||
    timeFilters.find(filter => filter.view === 'enlarged' || filter.view === 'minified') ||
    timeFilters[0];
  const time = timeFilter
    ? timeFilter.value?.[timeFilter.syncedWithLayerTimeline ? timeFilter.syncTimelineMode ?? 1 : 1]
    : animationConfig?.currentTime;
  const values: Record<string, string> = Object.create(null);
  for (const annotation of annotations) {
    if (
      !annotation.isVisible ||
      annotation.kind !== AnnotationKind.TEXT ||
      !annotation.viewport ||
      !annotation.readout
    ) {
      continue;
    }
    const {readout} = annotation;
    if (readout.type === 'time') {
      values[annotation.id] =
        typeof time === 'number' && Number.isFinite(time) && Math.abs(time) <= 8.64e15
          ? datetimeFormatter()(readout.format || 'YYYY-MM-DD')(time)
          : '—';
    } else {
      const table = Object.prototype.hasOwnProperty.call(datasets, readout.dataId)
        ? datasets[readout.dataId]
        : undefined;
      if (!table || table.disableDataOperation) {
        values[annotation.id] = '—';
        continue;
      }
      const datasetFilters = filters.filter(filter => filter.dataId.includes(table.id));
      let cached = counts.get(table);
      if (
        !cached ||
        cached.filters.length !== datasetFilters.length ||
        datasetFilters.some((filter, index) => filter !== cached?.filters[index]) ||
        cached.layers !== layers ||
        cached.revision !== table.dataRevision
      ) {
        // CPU evaluation includes GPU time/range filters and polygon visibility.
        // Copy first: reading captions must not mutate the Redux dataset cache.
        const filtered = copyTable(table).filterTableCPU(datasetFilters, layers);
        cached = {
          filters: datasetFilters,
          layers,
          revision: table.dataRevision,
          value: String(filtered.filteredIdxCPU?.length ?? 0)
        };
        counts.set(table, cached);
      }
      values[annotation.id] = cached.value;
    }
  }
  return values;
}
