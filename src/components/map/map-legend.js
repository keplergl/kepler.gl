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
import {rgb} from 'd3-color';
import ColorLegend from 'components/common/color-legend';
import {DIMENSIONS} from 'constants/default-settings';
import {capitalizeFirstLetter} from 'utils/utils';

const StyledMapControlLegend = styled.div`
  padding: 10px ${props => props.theme.mapControl.padding}px;
  font-size: 11px;
  border-bottom-color: ${props => props.theme.panelBorderColor};
  border-bottom-style: solid;
  border-bottom-width: ${props => (props.last ? 0 : '1px')};

  .legend--layer_name {
    font-size: 12px;
    color: ${props => props.theme.textColorHl};
    font-weight: 500;
  }
  .legend--layer_type {
    color: ${props => props.theme.subtextColor};
    font-weight: 500;
    font-size: 11px;
  }

  .legend--layer_by {
    color: ${props => props.theme.subtextColor};
  }

  .legend--layer_color_field {
    color: ${props => props.theme.textColor};
    font-weight: 500;
  }

  .legend--layer_color-legend {
    margin-top: 6px;
  }
`;

const VisualChannelMetric = ({name}) => (
  <div>
    <span className="legend--layer_by">by </span>
    <span className="legend--layer_color_field">{name}</span>
  </div>
);

const LayerSize = ({label, name}) => (
  <div className="legend--layer_size-schema">
    <p>
      <span className="legend--layer_by">{label}</span>
    </p>
    <VisualChannelMetric name={name} />
  </div>
);

const propTypes = {
  layers: PropTypes.array
};

const MapLegend = ({layers}) => (
  <div>
    {layers.map((layer, index) => {
      const enableColorBy = layer.config.colorField
        ? layer.config.colorField.name
        : layer.visualChannels.color.defaultMeasure;

      if (!layer.isValidToSave()) {
        return null;
      }

      return (
        <StyledMapControlLegend
          className="legend--layer"
          last={index === layers.length - 1}
          key={index}
        >
          <div className="legend--layer_name">{layer.config.label}</div>
          <div className="legend--layer_type">{`${capitalizeFirstLetter(
            layer.name
          )} color`}</div>
          <div className="legend--layer_color-schema">
            <div>
              {enableColorBy ? (
                <VisualChannelMetric name={enableColorBy} />
              ) : null}
              <div className="legend--layer_color-legend">
                <ColorLegend
                  scaleType={
                    enableColorBy ? layer.config.colorScale : 'ordinal'
                  }
                  displayLabel={enableColorBy}
                  domain={enableColorBy ? layer.config.colorDomain : ['']}
                  fieldType={
                    enableColorBy
                      ? (layer.config.colorField &&
                          layer.config.colorField.type) ||
                        'real'
                      : null
                  }
                  range={
                    enableColorBy
                      ? layer.config.visConfig.colorRange.colors
                      : [rgb(...layer.config.color).toString()]
                  }
                  width={
                    DIMENSIONS.mapControlWidth -
                    2 * DIMENSIONS.mapControl.padding
                  }
                />
              </div>
            </div>
          </div>
          {Object.keys(layer.visualChannels)
            .filter(k => k !== 'color')
            .map(key => {
              const matchCondition =
                !layer.visualChannels[key].condition ||
                layer.visualChannels[key].condition(layer.config);
              const enabled =
                layer.config[layer.visualChannels[key].field] ||
                layer.visualChannels[key].defaultMeasure;
              if (matchCondition && enabled) {
                return (
                  <LayerSize
                    key={key}
                    label={
                      layer.visConfigSettings[layer.visualChannels[key].range]
                        .label
                    }
                    name={
                      layer.config[layer.visualChannels[key].field]
                        ? layer.config[layer.visualChannels[key].field].name
                        : layer.visualChannels[key].defaultMeasure
                    }
                  />
                );
              }
              return null;
            })}
        </StyledMapControlLegend>
      );
    })}
  </div>
);

MapLegend.propTypes = propTypes;

export default MapLegend;
