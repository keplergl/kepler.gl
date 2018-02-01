import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Switch from 'components/common/switch';
import {generateHashId} from '../../utils/utils';

const propTypes = {
  // Required
  layers: PropTypes.array.isRequired,
  onMapToggleLayer: PropTypes.func.isRequired
};

const MapLayerSelect = styled.div`
  padding: 12px;
  
  .map-layer-selector__item {
    margin: 12px 0;
  }
`;

const MapLayerSelector = ({layers, onMapToggleLayer}) => (
  <MapLayerSelect className="map-layer-selector">
    {layers.map((layer, index) => (
      <div key={layer.id} className="map-layer-selector__item">
        <Switch
          checked={layer.isVisible}
          id={`${layer.id}-toggle-${generateHashId(4)}`}
          label={layer.name}
          onChange={e => {
            e.preventDefault();
            onMapToggleLayer(layer.id);
          }}
        />
      </div>
    ))}
  </MapLayerSelect>
);

MapLayerSelector.displayName = 'LayerSelector';
MapLayerSelector.propTypes = propTypes;

export default MapLayerSelector;
