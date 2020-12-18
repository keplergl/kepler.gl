import {FunctionComponent, ComponentType} from 'react';
import {Filter, Dataset, Field} from 'reducers';
import {Layer} from 'layers';

interface PanelAction {
  id: string,
  tooltip: string,
  onClick: () => void,
  iconComponent: ComponentType<any>,
  active: boolean
}

export type FilterPanelProps = {
  idx: number,
  layers: ReadonlyArray<Layer>,
  datasets: ReadonlyArray<Dataset>,
  allAvailableFields: ReadonlyArray<Field>,
  filter: Filter,
  panelActions: ReadonlyArray<PanelAction>,
  isAnyFilterAnimating: boolean,
  enlargeFilter: () => void,
  setFilter: (idx: number, field: string, value: any) => void,
  removeFilter: () => void,
  toggleAnimation: () => void,
  toggleFilterFeature: () => void
};

export type FilterPanelComponent = FunctionComponent<FilterPanelProps>;
