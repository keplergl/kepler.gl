import React from 'react';
import * as VisStateActions from '../actions/vis-state-actions';
import * as UIStateActions from '../actions/ui-state-actions';
import * as MapStyleActions from '../actions/map-style-actions';

export type ModalContainerProps = {
  rootNode: object;
  containerW: number;
  containerH: number;
  mapboxApiAccessToken: string;
  mapboxApiUrl?: string;
  mapState: object;
  mapStyle: object;
  uiState: object;
  visState: object;
  visStateActions: typeof VisStateActions;
  uiStateActions: typeof UIStateActions;
  mapStyleActions: typeof MapStyleActions;
  onSaveToStorage: () => void,
  cloudProviders: object[]
};

export default function ModalContainerFactory(): React.Component<ModelContainerProps>;
