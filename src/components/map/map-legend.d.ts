import {FunctionComponent} from 'react';
import {Layer, LayerConfig, VisualChannel, VisualChannelDescription} from 'layers';
import {MapLegendPanelComponent} from './map-legend-panel';

export type LayerSizeLegendProps = {
  label: string,
  name: string
};

export const LayerSizeLegend: FunctionComponent<LayerSizeLegendProps>;

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

export type LayerLegendHeaderProps = {
  layer: Layer,
  options?: {
    showLayerName?: boolean
  }
};

export const LayerLegendHeader: FunctionComponent<LayerLegendHeaderProps>;

export function LayerLegendHeaderFactory(): LayerLegendHeader;

export type LayerLegendContentProps = {
  layer: Layer,
  containerW: number,
};

export const LayerLegendContent: FunctionComponent<LayerLegendContentProps>;

export function LayerLegendContentFactory(): LayerLegendContent;

export type MapLegendProps = {
  layers?: ReadonlyArray<Layer>,
  width?: number,
  options?: {
    showLayerName?: boolean
  }
};

export const MapLegend: FunctionComponent<MapLegendProps>;

export function MapLegendFactory(): MapLegend;
