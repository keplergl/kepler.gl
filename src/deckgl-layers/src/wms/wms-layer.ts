// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// @ts-expect-error
import {_WMSLayer as DeckWMSLayer} from '@deck.gl/geo-layers';
import {LayerProps as DeckLayerProps} from '@deck.gl/core/typed';

export interface ExtendedWMSLayerProps extends DeckLayerProps {
  /** Base URL to the WMS service or URL template */
  data: string;

  /** Type of service - 'wms', 'template', or 'auto' */
  serviceType?: 'wms' | 'template' | 'auto';

  /** Array of layer names to visualize from the WMS service */
  layers?: string[];
}

// TODO

export default class ExtendedWMSLayer extends DeckWMSLayer<ExtendedWMSLayerProps> {
  static defaultProps = {
    ...DeckWMSLayer.defaultProps,
    serviceType: 'auto' as const,
    layers: [],
    srs: 'auto' as const,
    format: 'png' as const
  };

  constructor(props: ExtendedWMSLayerProps) {
    super(props);
  }
}
