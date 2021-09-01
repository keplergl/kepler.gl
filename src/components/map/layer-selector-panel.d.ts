import React from 'react';
import {Layer} from 'layers';
import {MapControls} from 'reducers/ui-state-updaters';

export type LayerSelectorPanelProps = {
  onMapToggleLayer: (layerId: string) => void;
  onToggleMapControl: (control: string) => void;
  layers: ReadonlyArray<Layer>;
  layersToRender: {[key: string]: boolean};
  isSplit: boolean;
  mapControls: MapControls;
  readOnly: boolean;
};

export type LayerSelectorPanelComponent = React.FunctionComponent<LayerSelectorPanelProps>;
