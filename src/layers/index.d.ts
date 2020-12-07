import {RGBColor, RGBAColor} from '../reducers/types';
import {Dataset, Field, Filter, Datasets} from '../reducers/vis-state-updaters';
import {LayerTextLabel, ColorRange, ColorUI} from './layer-factory';

export type LayerVisConfig = {
  opacity: number;
  colorRange: ColorRange;
};

export type LayerColumns = {
  [key: string]: {value: string | null; fieldIdx: number; optional?: boolean};
};
export type VisualChannelDomain = number[] | string[];
export type VisualChannelField = Field | null;

export type LayerConfig = {
  dataId: string | null;
  label: string;
  color: RGBColor;

  columns: LayerColumns;
  isVisible: boolean;
  isConfigActive: boolean;
  highlightColor: RGBColor | RGBAColor;
  hidden: boolean;

  colorField: VisualChannelField;
  colorDomain: VisualChannelDomain;
  colorScale: string;

  // color by size, domain is set by filters, field, scale type
  sizeDomain: VisualChannelDomain;
  sizeScale: string;
  sizeField: VisualChannelField;

  visConfig: LayerVisConfig;
  textLabel: LayerTextLabel[];

  colorUI: {
    color: ColorUI;
    colorRange: ColorUI;
  };
  animation: {
    enabled: boolean;
  };
};

export type VisualChannel = {
  property: string;
  field: string;
  scale: string;
  domain: string;
  range: string;
  key: string;
  channelScaleType: string;
  nullValue: any;
  defaultValue: any;
  accessor?: string;
  condition?: (config: any) => boolean;
  getAttributeValue?: (config: any) => (d: any) => any;
};

export class Layer {
  constructor(
    prop?: {
      id?: string;
    } & Partial<LayerConfig>
  );
  id: string;
  type: string;
  config: LayerConfig;
  visConfigSettings: any;
  visualChannels: {[key: string]: VisualChannel};
  hasAllColumns(): boolean;
  updateLayerConfig(p: Partial<LayerConfig>): Layer;
  updateLayerDomain(datasets: Datasets, fitler?: Filter): Layer;
  updateLayerVisualChannel(dataset: Dataset, channel: string): Layer;
  shouldCalculateLayerData(props: string[]): boolean;
  formatLayerData(datasets: Datasets, oldLayerData?: any);
  updateLayerColorUI(prop: string, newConfig: Partial<ColorUI>): Layer;
  validateVisualChannel(channel: string): void;
  isValidToSave(): boolean;
  isLayerHovered(objectInfo: any): boolean;
  getHoverData(object: any, allData?: Dataset['allData'], fields?: Dataset['fields']): any;
}

export type LayerClassesType = {
  point: Layer;
  arc: Layer;
  line: Layer;
  grid: Layer;
  hexagon: Layer;
  geojson: Layer;
  cluster: Layer;
  icon: Layer;
  heatmap: Layer;
  hexagonId: Layer;
  '3D': Layer;
  trip: Layer;
  s2: Layer;
};
export const LayerClasses: LayerClassesType;
export const LAYER_TYPES: {[key in keyof LayerClassesType]: string};
