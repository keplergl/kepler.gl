// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {FunctionComponent, ComponentType, ReactNode} from 'react';
import {Filter, PolygonFilter, TimeRangeFilter, Field} from '@kepler.gl/types';
import {Layer} from '@kepler.gl/layers';
import {Datasets} from '@kepler.gl/table';
import {setFilter, setFilterPlot, syncTimeFilterWithLayerTimeline} from '@kepler.gl/actions';

interface PanelAction {
  id: string;
  tooltip: string;
  onClick: () => void;
  iconComponent: ComponentType;
  active: boolean;
}

export interface FilterPanelProps<F = Filter> {
  idx: number;
  datasets: Datasets;
  allAvailableFields: Field[];
  filter: F;
  removeFilter: () => void;
  setFilter: (...args: Parameters<typeof setFilter>) => void;
  setFilterPlot: (...args: Parameters<typeof setFilterPlot>) => void;
  syncTimeFilterWithLayerTimeline?: (
    ...args: Parameters<typeof syncTimeFilterWithLayerTimeline>
  ) => void;
  children?: ReactNode;
}
export interface PolygonFilterPanelProps extends FilterPanelProps<PolygonFilter> {
  layers: ReadonlyArray<Layer>;
  toggleFilterFeature: () => void;
}
export interface TimeRangeFilterPanelProps extends FilterPanelProps<TimeRangeFilter> {
  layers: ReadonlyArray<Layer>;
  enlargeFilter: () => void;
  toggleAnimation: () => void;
}
export interface FilterPanelWithFieldSelectProps extends FilterPanelProps {
  panelActions?: ReadonlyArray<PanelAction>;
}

export type FilterPanelComponent<F> = FunctionComponent<FilterPanelProps<F>>;
export type PolygonFilterPanelComponent = FunctionComponent<PolygonFilterPanelProps>;
export type TimeRangeFilterPanelComponent = FunctionComponent<TimeRangeFilterPanelProps>;
export type FilterPanelWithFieldSelectComponent = FunctionComponent<
  Omit<FilterPanelWithFieldSelectProps, 'setFilterPlot'>
>;
