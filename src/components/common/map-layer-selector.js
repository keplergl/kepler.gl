// Copyright (c) 2018 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React from 'react';
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

MapLayerSelector.propTypes = propTypes;

export default MapLayerSelector;
