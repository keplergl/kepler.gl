import {RGBColor, RGBAColor} from '../reducers/types';
import {Dataset, Field, Datasets} from '../reducers/vis-state-updaters';
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
  hasAllColumns(): boolean;
  updateLayerConfig(p: Partial<LayerConfig>): Layer;
  updateLayerVisualChannel(dataset: Dataset, channel: string): Layer;
  shouldCalculateLayerData(props: string[]): boolean;
  formatLayerData(datasets: Datasets, oldLayerData?: any);
  updateLayerColorUI(prop: string, newConfig: Partial<ColorUI>): Layer;
}

export const LayerClasses: {
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
