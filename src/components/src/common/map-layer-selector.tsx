// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';
import Checkbox from './checkbox';
import {generateHashId} from '@kepler.gl/utils';

const MapLayerSelect = styled.div`
  padding: 12px;

  .map-layer-selector__item {
    margin: 12px 0;
  }
`;
interface Layer {
  id: string;
  name: string;
  isVisible: boolean;
}

interface MapLayerSelectorProps {
  layers: Layer[];
  onMapToggleLayer: (layerId: string) => void;
}

/** @type {typeof import('./map-layer-selector').default} */
const MapLayerSelector = ({layers, onMapToggleLayer}: MapLayerSelectorProps) => (
  <MapLayerSelect className="map-layer-selector">
    {layers.map(layer => (
      <div key={layer.id} className="map-layer-selector__item">
        <Checkbox
          type="radio"
          checked={layer.isVisible}
          id={`${layer.id}-toggle-${generateHashId(4)}`}
          label={layer.name}
          onChange={() => {
            onMapToggleLayer(layer.id);
          }}
        />
      </div>
    ))}
  </MapLayerSelect>
);

export default MapLayerSelector;
