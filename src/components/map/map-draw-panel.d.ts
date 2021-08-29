import React from 'react';
import {Editor, MapControls} from '../../reducers';
import {MapDrawPanelIcons} from './map-control';

export type MapDrawPanelProps = {
  editor: Editor,
  mapControls: MapControls,
  onToggleMapControl: (control: string) => void;
  onSetEditorMode: (mode: string) => void,
  onToggleEditorVisibility: () => void,
  actionIcons: MapDrawPanelIcons
};

export type MapDrawPanelComponent = React.FunctionComponent<MapDrawPanelProps>;
export function MapDrawPanelFactory(): MapDrawPanelComponent;

