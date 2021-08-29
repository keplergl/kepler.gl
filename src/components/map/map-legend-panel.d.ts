import React, {Element} from 'react';
import {Layer} from 'layers';
import {MapControls} from '../../reducers';

interface MapLegendPanelIcons {
  legend: ComponentType<any>
}

export type MapLegendPanelProps = {
  layers: ReadonlyArray<Layer>;
  scale: number;
  onToggleMapControl: (control: string) => void;
  isExport: boolean;
  logoComponent: Element;
  actionIcons: MapLegendPanelIcons;
  mapControls: MapControls;
};

export type MapLegendPanelComponent = React.FunctionComponent<MapLegendPanelProps>;
export function MapLegendPanelFactory(): MapLegendPanelComponent;
