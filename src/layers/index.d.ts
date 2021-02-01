import {RGBColor, RGBAColor} from '../reducers/types';
import {Field, Datasets, KeplerTable} from '../reducers/vis-state-updaters';
import {LayerTextLabel, ColorRange, ColorUI, LayerVisConfig} from './layer-factory';

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
  updateLayerVisualChannel(dataset: KeplerTable, channel: string): Layer;
  shouldCalculateLayerData(props: string[]): boolean;
  formatLayerData(datasets: Datasets, oldLayerData?: any);
  updateLayerColorUI(prop: string, newConfig: Partial<ColorUI>): Layer;
  isValidToSave(): boolean;
  validateVisualChannel(channel: string);
  getVisualChannelDescription(key: string): {label: string, measure: string};

  static findDefaultLayerProps(dataset: KeplerTable, foundLayers?: any[]);
  // static findDefaultColumnField(defaultFields, allFields)
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

export type OVERLAY_TYPE = {[key: string]: string}
export const LAYER_ID_LENGTH: number;
