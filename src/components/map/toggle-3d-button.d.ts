import React from 'react';
import {MapControls} from '../../reducers';

interface Toggle3dButtonIcons {
  cube: ComponentType<any>;
}

export type Toggle3dButtonProps = {
  dragRotate: boolean;
  onTogglePerspective: () => void;
  actionIcons: Toggle3dButtonIcons;
  mapControls: MapControls;
};

export type Toggle3dButtonComponent = React.FunctionComponent<Toggle3dButtonProps>;
export function Toggle3dButtonFactory(): Toggle3dButtonComponent;
