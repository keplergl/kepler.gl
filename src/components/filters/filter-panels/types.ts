import {FunctionComponent, ComponentType} from 'react';
import {Datasets, Filter, PolygonFilter, TimeRangeFilter} from 'reducers';
import {Layer} from 'layers';
import {Field} from 'utils/table-utils/kepler-table';

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
  setFilter: (idx: number, field: string, value: any) => void;
}
export interface PolygonFilterPanelProps extends FilterPanelProps<PolygonFilter> {
  layers: ReadonlyArray<Layer>;
  toggleFilterFeature: () => void;
}
export interface TimeRangeFilterPanelProps extends FilterPanelProps<TimeRangeFilter> {
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
  FilterPanelWithFieldSelectProps
>;
