import {ComponentType} from 'react';
import {Datasets, Filter} from 'reducers';
import {Layer} from 'layers';
import KeplerTable from 'utils/table-utils/kepler-table';

export type FilterPanelHeaderProps = {
  datasets: KeplerTable[];
  filter: Filter;
  removeFilter: () => void;
  actionIcons?: Record<string, ComponentType>;
};

export type FilterPanelProps = {
  idx: number;
  filters: Filter[];
  filter: Filter;
  datasets: Datasets;
  layers: ReadonlyArray<Layer>;
  removeFilter: () => void;
  enlargeFilter: () => void;
  toggleAnimation: () => void;
  toggleFilterFeature: () => void;
  setFilter: (idx: number, field: string, value: any, valueIndex?: number) => void;
};
