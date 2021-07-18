import {
  InteractionConfig,
  Filter,
  TooltipInfo,
  SplitMap,
  AnimationConfig,
  VisState,
  RGBColor,
  Merge,
  RGBAColor
} from 'reducers';
import {Schema} from './schema';

import {LayerTextLabel} from 'layers/layer-factory';
import {datasetSchema, visStateSchema, mapStyleSchema, mapStateSchema} from 'schemas';

export type SavedFilter = {
  dataId: Filter['dataId'];
  id: Filter['id'];
  name: Filter['name'];
  type: Filter['type'];
  value: Filter['value'];
  enlarged: Filter['enlarged'];
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

export type SavedField = {
  name: string;
  type: string;
} | null;
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
    highlightColor: RGBAColor;
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

export type SavedVisState = {
  filters: SavedFilter[];
  layers: SavedLayer[];
  interactionConfig: SavedInteractionConfig;
  layerBlending: string;
  splitMaps: SplitMap[];
  animationConfig: SavedAnimationConfig;
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
  visState?: {
    layers?: ParsedLayer[];
    filters?: ParsedFilter[];
    interactionConfig?: Partial<SavedInteractionConfig>;
    layerBlending?: string;
    splitMaps?: SplitMap[];
    animationConfig?: Partial<SavedAnimationConfig>;
  };
  mapState?: Partial<SavedMapState>;
  mapStyle?: Partial<SavedMapStyle>;
};

export type SavedField = {
  name: string;
  type: string;
  format?: string;
  analyzerType?: string;
};

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
    rows: anu[][];
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
export const reducerSchema: {
  [key: string]: typeof mapStateSchema | typeof visStateSchema | typeof mapStyleSchema;
};

export class KeplerGLSchema {
  constructor(prop: {
    reducers?: typeof reducerSchema;
    datasets?: typeof datasetSchema;
    validVersions?: string[];
    version?: string;
  });
  save(state: any): SavedMap;
  load(arg1: SavedMap | SavedMap['datasets'] | any, arg1?: SavedMap['cnofig'] | any): LoadedMap;
  getMapInfo(state: any): VisState['mapInfo'];
  getDatasetToSave(state: any): SavedDatasetV1[];
  getConfigToSave(state: any): SavedConfigV1;
  parseSavedConfig(config: any): ParsedConfig | null;
  parseSavedData(datasets: any): ParsedDataset[] | null;
  validateVersion(version: any): string | null;
  hasDataChanged(state: any): boolean;
}
const KeplerGLSchemaManager: KeplerGLSchema;

export default KeplerGLSchemaManager;
