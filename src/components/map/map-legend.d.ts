import {FunctionComponent} from 'react';
import {Layer, LayerConfig, VisualChannel, VisualChannelDescription} from 'layers';

export type SingleColorLegendProps = {
  width: number,
  color: string
};

export const SingleColorLegend: FunctionComponent<SingleColorLegendProps>;

export type LayerColorLegendProps = {
  description: VisualChannelDescription,
  config: LayerConfig,
  width: number,
  colorChannel: VisualChannel
};

export const LayerColorLegend: FunctionComponent<LayerColorLegendProps>;

export type MapLegendProps = {
  layers?: ReadonlyArray<Layer>,
  width?: number,
  options?: {
    showLayerName?: boolean
  }
};

const MapLegend: FunctionComponent<MapLegendProps>;
export default MapLegend;
