// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {
  Filter,
  MultiSelectFilter,
  RangeFilter,
  SelectFilter,
  TimeRangeFilter,
  Timeline
} from '@kepler.gl/types';
import {Layer} from '@kepler.gl/layers';
import {
  ActionHandler,
  setFilterAnimationTime,
  setFilterAnimationWindow,
  setFilterPlot,
  toggleFilterAnimation,
  updateFilterAnimationSpeed
} from '@kepler.gl/actions';
import {Datasets} from '@kepler.gl/table';

export type PolygonFilterProps = {
  filter: Filter;
  layers: ReadonlyArray<Layer>;
  setLayers: (ids: ReadonlyArray<string>) => void;
};

export type TopSectionWrapperProps = {
  hoverColor?: string;
};

export type RangeFilterProps = {
  filter: RangeFilter;
  setFilter: (v: number[]) => void;
  setFilterPlot?: ActionHandler<typeof setFilterPlot>;
};

export type TimeRangeFilterProps = {
  idx: number;
  filter: TimeRangeFilter;
  isAnimatable: boolean;
  hideTimeTitle: boolean;
  setFilter: (v: number[]) => void;
  setFilterPlot: ActionHandler<typeof setFilterPlot>;
  toggleAnimation: () => void;
  timeline: Timeline;
  datasets: Datasets;
};

export type SingleSelectFilterProps = {
  filter: SelectFilter;
  setFilter: (v: string | number | boolean | object | null) => void;
};

export type MultiSelectFilterProps = {
  filter: MultiSelectFilter;
  setFilter: (
    v: ReadonlyArray<string | number | boolean | object> | string | number | boolean | object | null
  ) => void;
};

export type TimeWidgetTopProps = {
  filter: Filter;
  readOnly: boolean;
  datasets: Datasets;
  setFilterPlot: (newProp, valueIndex?: number) => void;
  index: number;
  onClose: () => void;
  onToggleMinify: () => void;
  isMinified: boolean;
};

export type TimeWidgetProps = {
  datasets: Datasets;
  filter: TimeRangeFilter;
  index: number;
  readOnly: boolean;
  showTimeDisplay: boolean;
  isAnimatable: boolean;
  resetAnimation: () => void;
  onClose: () => void;
  setFilterAnimationTime: ActionHandler<typeof setFilterAnimationTime>;
  updateAnimationSpeed: ActionHandler<typeof updateFilterAnimationSpeed>;
  toggleAnimation: ActionHandler<typeof toggleFilterAnimation>;
  setFilterPlot: ActionHandler<typeof setFilterPlot>;
  setFilterAnimationWindow: ActionHandler<typeof setFilterAnimationWindow>;
  timeline: Timeline;
};
