// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {RGBColor, Merge, RequireFrom} from './types';

import {Filter, TooltipInfo, AnimationConfig, SplitMap, Feature} from './reducers';

import {LayerTextLabel} from './layers';

export type SavedFilter = {
  dataId: Filter['dataId'];
  id: Filter['id'];
  name: Filter['name'];
  type: Filter['type'];
  value: Filter['value'];
  // deprecated
  enlarged?: Filter['enlarged'];
  view?: Filter['view'];
  plotType: Filter['plotType'];
  yAxis: {
    name: string;
    type: string;
  } | null;
  speed: Filter['speed'];
  layerId: Filter['layerId'];
  syncedWithLayerTimeline: Filter['syncedWithLayerTimeline'];
  syncTimelineMode: Filter['syncTimelineMode'];
};
export type MinSavedFilter = RequireFrom<SavedFilter, 'dataId' | 'id' | 'name' | 'type' | 'value'>;
export type ParsedFilter = SavedFilter | MinSavedFilter;

export type SavedInteractionConfig = {
  tooltip: TooltipInfo['config'] & {
    enabled: boolean;
  };
  geocoder: TooltipInfo['geocoder'] & {
    enabled: boolean;
  };
  brush: TooltipInfo['brush'] & {
    enabled: boolean;
  };
  coordinate: TooltipInfo['coordinate'] & {
    enabled: boolean;
  };
};

export type SavedScale = string;
export type SavedVisualChannels = {
  [key: string]: SavedField | SavedScale;
};

export type SavedLayer = {
  id: string;
  type: string;
  config: {
    dataId: string;
    label: string;
    color: RGBColor;
    highlightColor?: RGBColor;
    columns: {
      [key: string]: string;
    };
    isVisible: boolean;
    visConfig: Record<string, any>;
    hidden: boolean;
    textLabel: Merge<LayerTextLabel, {field: {name: string; type: string} | null}>;
    columnMode: string;
  };
  visualChannels: SavedVisualChannels;
};
export type MinSavedLayerConfig = RequireFrom<SavedLayer['config'], 'dataId' | 'columns'>;
export type MinSavedLayer = {
  id: string;
  type: string;
  config: MinSavedLayerConfig;
  visualChannels?: SavedVisualChannels;
};
export type ParsedLayer = SavedLayer | MinSavedLayer;

export type ParsedEffect = {
  id: string;
  type: string;
  isEnabled: boolean;
  parameters: Record<string, number | [number, number] | {value: number}>;
};

export type SavedEffect = ParsedEffect;

export type SavedAnimationConfig = {
  currentTime: AnimationConfig['currentTime'];
  speed: AnimationConfig['speed'];
};

export type SavedEditor = {
  features: Feature[];
  visible: boolean;
};

export type SavedVisState = {
  filters: SavedFilter[];
  layers: SavedLayer[];
  effects: SavedEffect[];
  interactionConfig: SavedInteractionConfig;
  layerBlending: string;
  overlayBlending?: string;
  splitMaps: SplitMap[];
  animationConfig: SavedAnimationConfig;
  editor?: SavedEditor;
};

// Min saved config can be passed to addDataToMap
export type MinSavedVisStateV1 = {
  filters?: MinSavedFilter[];
  layers?: MinSavedLayer[];
  effects?: SavedEffect[];
  interactionConfig?: Partial<SavedInteractionConfig>;
  layerBlending?: string;
  overlayBlending?: string;
  splitMaps?: SplitMap[];
  animationConfig?: SavedAnimationConfig;
  editor?: SavedEditor;
};

export type ParsedVisState = {
  layers?: ParsedLayer[];
  effects?: ParsedEffect[];
  filters?: ParsedFilter[];
  effects?: ParsedEffect[];
  interactionConfig?: Partial<SavedInteractionConfig>;
  layerBlending?: string;
  overlayBlending?: string;
  splitMaps?: SplitMap[];
  animationConfig?: Partial<SavedAnimationConfig>;
};

export type SavedMapState = {
  bearing: number;
  dragRotate: boolean;
  latitude: number;
  longitude: number;
  pitch: number;
  zoom: number;
  isSplit: boolean;
};

export type SavedMapStateV1 = SavedMapState;
export type MinSavedMapStateV1 = Partial<SavedMapState>;
export type ParsedMapState = Partial<SavedMapState>;

export type SavedLayerGroups = {
  [key: string]: boolean;
};

export type SavedCustomMapStyle = {
  [key: string]: {
    accessToken?: string;
    custom: boolean;
    icon: string;
    id: string;
    label: string;
    url: string;
  };
};

export type SavedMapStyle = {
  styleType: string;
  topLayerGroups: SavedLayerGroups;
  visibleLayerGroups: SavedLayerGroups;
  threeDBuildingColor: RGBColor;
  mapStyles: SavedCustomMapStyle;
};

export type SavedMapStyleV1 = SavedMapStyle;
export type MinSavedMapStyleV1 = Partial<SavedMapStyleV1>;

export type ParsedMapStyle = Partial<SavedMapStyleV1>;

/** Schema for v1 saved configuration */
export type SavedConfigV1 = {
  version: 'v1';
  config: {
    visState: SavedVisState;
    mapState: SavedMapState;
    mapStyle: SavedMapStyle;
  };
};

// supported by addDataToMap
export type MinSavedConfigV1 = {
  version: 'v1';
  config: {
    visState?: MinSavedVisStateV1;
    mapState?: MinSavedMapStateV1;
    mapStyle?: MinSavedMapStyleV1;
  };
};

/** Schema for a parsed configuration ("normalized" across versions) */
export type ParsedConfig = {
  visState?: ParsedVisState;
  mapState?: ParsedMapState;
  mapStyle?: ParsedMapStyle;
};

export type SavedField = {
  name: string;
  type: string;
} | null;
export type ParsedField = {
  name: string;
  type: string;
  format: string;
  analyzerType: string;
};

export type SavedDatasetV1 = {
  version: 'v1';
  data: {
    id: string;
    label: string;
    color: RGBColor;
    allData: any[][];
    fields: SavedField[];
  };
};

export type ParsedDataset = {
  data: {
    fields: ParsedField[];
    rows: any[][];
  };
  info: {
    id?: string;
    label?: string;
    color?: RGBColor;
  };
};

export type SavedMap = {
  datasets: SavedDatasetV1[];
  config: SavedConfigV1;
  info: {
    app: string;
    created_at: string;
    title: string;
    description: string;
  };
};

export type LoadedMap = {datasets?: ParsedDataset[] | null; config?: ParsedConfig | null};
