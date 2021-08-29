import React from 'react';
import {MapControls} from '../../reducers';

interface SplitMapButtonIcons {
  delete: ComponentType<any>;
  split: ComponentType<any>;
}

export type SplitMapButtonProps = {
  isSplit: boolean;
  mapIndex: number;
  onToggleSplitMap: (index?: number) => void;
  actionIcons: SplitMapButtonIcons;
  readOnly: boolean;
  mapControls: MapControls;
};

export type SplitMapButtonComponent = React.FunctionComponent<SplitMapButtonProps>;
export function SplitMapButtonFactory(): SplitMapButtonComponent;
