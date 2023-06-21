import {ComponentType} from 'react';
import {MapStyle} from '@kepler.gl/reducers';
import {Layer, LayerClassesType} from '@kepler.gl/layers';
import {Filter, InteractionConfig, UiState} from '@kepler.gl/types';

import {
  MapStyleActions,
  VisStateActions,
  MapStateActions,
  UIStateActions
} from '@kepler.gl/actions';
import {Datasets} from '@kepler.gl/table';

export type SidePanelItem = {
  id: string;
  label: string;
  iconComponent: ComponentType<any>;
  component: ComponentType<any>;
};

export type SidePanelProps = {
  appName: string;
  appWebsite: string;
  filters: Filter[];
  interactionConfig: InteractionConfig;
  layerBlending: string;
  overlayBlending?: string;
  layers: Layer[];
  layerClasses: LayerClassesType;
  layerOrder: string[];
  mapStyle: MapStyle;
  mapInfo: {title?: string; description?: string};
  width: number;
  datasets: Datasets;
  uiStateActions: typeof UIStateActions;
  visStateActions: typeof VisStateActions;
  mapStateActions: typeof MapStateActions;
  mapStyleActions: typeof MapStyleActions;
  uiState: UiState;
  availableProviders: {[k: string]: {hasShare?: boolean; hasStorage?: boolean}};
  mapSaved?: string | null;
  panels?: SidePanelItem[];
  onSaveMap?: () => void;
  version: string;
};

export type DatasetAttribution = {
  title: string;
  url: string;
};
