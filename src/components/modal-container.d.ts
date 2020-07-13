import React from 'react';

export type ModelContainerProps = {
  rootNode: object;
  containerW: number;
  containerH: number;
  mapboxApiAccessToken: string;
  mapboxApiUrl?: string;
  mapState: object;
  mapStyle: object;
  uiState: object;
  visState: object;
  visStateActions: object;
  uiStateActions: object;
  mapStyleActions: object;
  onSaveToStorage: () => void,
  cloudProviders: object[]
};

export default function ModalContainerFactory(): React.Component<ModelContainerProps>;
