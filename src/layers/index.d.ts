import Layer from './base-layer';
export {LAYER_VIS_CONFIGS, LayerVisConfig} from './layer-factory';

export {default as Layer, OVERLAY_TYPE, LAYER_ID_LENGTH, colorMaker} from './base-layer';
export type {LayerConfig, LayerColumns, LayerColumn} from './base-layer';
export type {LayerVisConfig} from './layer-factory';

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

export type OVERLAY_TYPE = {[key: string]: string};
export const LAYER_ID_LENGTH: number;
