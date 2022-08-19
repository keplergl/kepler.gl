import {ComponentType} from 'react';
import {MapStyle} from 'reducers';
import {Layer, LayerClassesType} from '@kepler.gl/layers';
import {Filter, InteractionConfig} from '@kepler.gl/types';
import {UiState} from 'reducers/ui-state-updaters';

import * as MapStyleActions from 'actions/map-style-actions';
import * as VisStateActions from 'actions/vis-state-actions';
import * as MapStateActions from 'actions/map-state-actions';
import * as UIStateActions from 'actions/ui-state-actions';
import {Datasets} from 'reducers/table-utils/kepler-table';

export type SidePanelItem = {
  id: string;
  label: string;
  iconComponent: ComponentType<any>;
  component?: ComponentType<any>;
};

export type SidePanelProps = {
  appName: string;
  appWebsite: string;
  filters: Filter[];
  interactionConfig: InteractionConfig;
  layerBlending: string;
  layers: Layer[];
  layerClasses: LayerClassesType;
  layerOrder: number[];
  mapStyle: MapStyle;
  onSaveMap?: () => void;
  width: number;
  mapInfo: {title: string; description: string};
  datasets: Datasets;
  uiStateActions: typeof UIStateActions;
  visStateActions: typeof VisStateActions;
  mapStateActions: typeof MapStateActions;
  mapStyleActions: typeof MapStyleActions;
  uiState: UiState;
  availableProviders: {hasShare: boolean; hasStorage: boolean};
  mapSaved?: string | null;
  panels: SidePanelItem[];
  version: string;
};
