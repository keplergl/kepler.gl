import React from 'react';
import {Editor, MapControls} from 'reducers';
import {Datasets} from 'reducers/vis-state-updaters';
import {FeatureFlags} from '../context';
import {Layer} from 'layers';

export type MapControlComponentProps = Partial<MapControlProps>;

export type MapControlProps = {
  availableLocales: ReadonlyArray<string>;
  datasets: Datasets;
  dragRotate: boolean;
  isSplit: boolean;
  primary: boolean;
  layers: Layer[];
  layersToRender: {[key: string]: boolean};
  mapIndex: number;
  mapControls: MapControls;
  onTogglePerspective: () => void;
  onToggleSplitMap: () => void;
  onToggleMapControl: (control: string) => void;
  onSetEditorMode: (mode: string) => void;
  onToggleEditorVisibility: () => void;
  top: number;
  onSetLocale: () => void;
  locale: string;
  logoComponent: React.FC | React.ReactNode;

  // optional
  readOnly?: boolean;
  scale?: number;
  mapLayers?: {[key: string]: boolean};
  editor: Editor;
  actionComponents: React.FC[] | React.Component[];
  mapHeight?: number;
};

export type MapControl = React.FC<MapControlProps>;
export function MapControlFactory(): MapControl;
