import {ComponentType} from 'react';
import {MapStyle} from 'reducers';
import {Layer, LayerClassesType} from '@kepler.gl/layers';
import {Filter, InteractionConfig, UiState} from '@kepler.gl/types';

import {
  MapStyleActions,
  VisStateActions,
  MapStateActions,
  UIStateActions
} from '@kepler.gl/actions';
import {Datasets} from 'table-utils';

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
