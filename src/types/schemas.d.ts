import {RGBColor, Merge, RGBAColor} from './types';

import {
  Filter,
  TooltipInfo,
  InteractionConfig,
  AnimationConfig,
  SplitMap,
  Feature
} from './reducers';

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
};

export type ParsedFilter = Partial<SavedFilter>;

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
    visConfig: object;
    hidden: boolean;
    textLabel: Merge<LayerTextLabel, {field: {name: string; type: string} | null}>;
  };
  visualChannels: SavedVisualChannels;
};

export type ParsedLayer = {
  id?: string;
  type?: string;
  config?: Partial<SavedLayer['config']>;
};

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
  interactionConfig: SavedInteractionConfig;
  layerBlending: string;
  splitMaps: SplitMap[];
  animationConfig: SavedAnimationConfig;
  editor?: SavedEditor;
};

export type ParsedVisState = {
  layers?: ParsedLayer[];
  filters?: ParsedFilter[];
  interactionConfig?: Partial<SavedInteractionConfig>;
  layerBlending?: string;
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

export type SavedLayerGroups = {
  [key: string]: boolean;
};

export type SavedCustomMapStyle = {
  [key: string]: {
    accessToken: string;
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

/** Schema for v1 saved configuration */
export type SavedConfigV1 = {
  version: 'v1';
  config: {
    visState: SavedVisState;
    mapState: SavedMapState;
    mapStyle: SavedMapStyle;
  };
};

/** Schema for a parsed configuration ("normalized" across versions) */
export type ParsedConfig = {
  version: string;
  visState?: ParsedVisState;
  mapState?: Partial<SavedMapState>;
  mapStyle?: Partial<SavedMapStyle>;
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
