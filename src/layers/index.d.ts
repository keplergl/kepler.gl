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
  defaultMeasure: any;
  accessor?: string;
  condition?: (config: any) => boolean;
  getAttributeValue?: (config: any) => (d: any) => any;
};

export type VisualChannelDescription = {
  label: string;
  measure: string;
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
  _oldDataUpdateTriggers: any;
  hasAllColumns(): boolean;
  updateLayerConfig(p: Partial<LayerConfig>): Layer;
  updateLayerDomain(datasets: Datasets, filter?: Filter): Layer;
  updateLayerVisualChannel(dataset: Dataset, channel: string): Layer;
  shouldCalculateLayerData(props: string[]): boolean;
  formatLayerData(datasets: Datasets, oldLayerData?: any);
  updateLayerColorUI(prop: string, newConfig: Partial<ColorUI>): Layer;
  validateVisualChannel(channel: string): void;
  isValidToSave(): boolean;
  getVisualChannelDescription(key: string): VisualChannelDescription;
  isLayerHovered(objectInfo: any): boolean;
  hasHoveredObject(objectInfo: any): any | null;
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
