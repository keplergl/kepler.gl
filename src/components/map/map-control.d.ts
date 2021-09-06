import React from 'react';
import {Editor, MapControls} from '../../reducers';
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
  readOnly?: boolean;
  scale: number;
  top: number;
  editor: Editor;
  locale: string;

  onTogglePerspective: () => void;
  onToggleGlobe: () => void;
  onToggleSplitMap: () => void;
  onToggleMapControl: (control: string) => void;
  onSetEditorMode: (mode: string) => void;
  onSetLocale: () => void;
  onToggleEditorVisibility: () => void;
  logoComponent: React.FC | React.ReactNode;
  actionComponents: React.FC[] | React.Component[];
};

export type MapControl = React.FC<MapControlProps>;
export function MapControlFactory(): MapControl;
