import {Element} from 'react';
import {Layer} from 'layers';
import {Editor} from 'reducers/vis-state-updaters';

export type LocalePanelProps = {
  availableLocales: ReadonlyArray<string>,
  onSetLocale: (locale: string) => void,
  activeLocale: string, 
  isActive: boolean,
  onToggleMenuPanel: () => void,
  disableClose?: boolean
};

export type LocalePanelComponent = React.FunctionComponent<LocalePanelProps>;

export type LayerSelectorPanelProps = {
  items: ReadonlyArray<Layer>,
  onMapToggleLayer: (layerId: string) => void,
  isActive: boolean,
  toggleMenuPanel: () => void,
  disableClose?: boolean
};

export type LayerSelectorPanelComponent = React.FunctionComponent<LayerSelectorPanelProps>;

export type MapControlTooltipProps = {
  id: string,
  message: string
};

export type MapControlTooltipComponent = React.FunctionComponent<MapControlTooltipProps>;

interface MapDrawPanelIcons {
  visible: ComponentType<any>,
  hidden: ComponentType<any>,
  polygon: ComponentType<any>,
  cursor: ComponentType<any>,
  innerPolygon: ComponentType<any>,
  rectangle: ComponentType<any>
}

export type MapDrawPanelProps = {
  editor: Editor,
  isActive: boolean,
  onToggleMenuPanel: () => void,
  onSetEditorMode: (mode: string) => void,
  onToggleEditorVisibility: () => void,
  actionIcons: MapDrawPanelIcons
};

export type MapDrawPanelComponent = React.FunctionComponent<MapDrawPanelProps>;
export function MapDrawPanelFactory(): MapDrawPanelComponent;

export type MapControlPanelProps = {
  children: Element,
  header?: string,
  scale?: number,
  onClick: () => void,
  isExport?: boolean,
  disableClose?: boolean,
  logoComponent?: Element
};

export type MapControlPanelComponent = React.FunctionComponent<MapControlPanelProps>;

interface MapLegendPanelIcons {
  legend: ComponentType<any>
}

export type MapLegendPanelProps = {
  layers: ReadonlyArray<Layer>,
  isActive: boolean,
  scale: number,
  onToggleMenuPanel: () => void,
  isExport: boolean,
  disableClose?: boolean,
  logoComponent: Element,
  actionIcons: MapLegendPanelIcons
};

export type MapLegendPanelComponent = React.FunctionComponent<MapLegendPanelProps>;
export function MapLegendPanelFactory(): MapLegendPanelComponent;

interface Toggle3dButtonIcons {
  cube: ComponentType<any>
}

export type Toggle3dButtonProps = {
  dragRotate: boolean,
  onTogglePerspective: () => void,
  actionIcons: Toggle3dButtonIcons
};

export type Toggle3dButtonComponent = React.FunctionComponent<Toggle3dButtonProps>;
export function Toggle3dButtonFactory(): Toggle3dButtonComponent;

interface SplitMapButtonIcons {
  delete: ComponentType<any>,
  split: ComponentType<any>
}

export type SplitMapButtonProps = {
  isSplit: boolean,
  mapIndex: number,
  onToggleSplitMap: (index?: number) => void,
  actionIcons: SplitMapButtonIcons
};

export type SplitMapButtonComponent = React.FunctionComponent<SplitMapButtonProps>;
export function SplitMapButtonFactory(): SplitMapButtonComponent;
