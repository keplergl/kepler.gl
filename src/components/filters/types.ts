import {
  Datasets,
  Filter,
  MultiSelectFilter,
  RangeFilter,
  SelectFilter,
  TimeRangeFilter
} from 'reducers';
import {Layer} from 'layers';
import {
  enlargeFilter,
  setFilterAnimationTime,
  setFilterAnimationWindow,
  setFilterPlot,
  toggleFilterAnimation,
  updateFilterAnimationSpeed
} from 'actions';

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
};

export type TimeRangeFilterProps = {
  filter: TimeRangeFilter;
  isAnimatable: boolean;
  hideTimeTitle: boolean;
  setFilter: (v: number[]) => void;
  toggleAnimation: () => void;
};

export type SingleSelectFilterProps = {
  filter: SelectFilter;
  setFilter: (v: string | number | boolean | object | null) => void;
};

export type MultiSelectFilterProps = {
  filter: MultiSelectFilter;
  setFilter: (v: ReadonlyArray<string | number | boolean | object> | null) => void;
};

export type TimeWidgetTopProps = {
  filter: Filter;
  readOnly: boolean;
  datasets: Datasets;
  setFilterPlot: typeof setFilterPlot;
  index: number;
  onClose: () => void;
};

export type TimeWidgetProps = {
  datasets: Datasets;
  filter: TimeRangeFilter;
  index: number;
  readOnly: boolean;
  showTimeDisplay: boolean;
  isAnimatable: boolean;
  resetAnimation: () => void;
  setFilterAnimationTime: typeof setFilterAnimationTime;
  updateAnimationSpeed: typeof updateFilterAnimationSpeed;
  toggleAnimation: typeof toggleFilterAnimation;
  enlargeFilter: typeof enlargeFilter;
  setFilterPlot: typeof setFilterPlot;
  setFilterAnimationWindow: typeof setFilterAnimationWindow;
};
