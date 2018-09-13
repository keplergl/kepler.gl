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
  padding: 10px 0 10px ${props => props.theme.mapControl.padding}px;
  font-size: 11px;
  border-bottom-color: ${props => props.theme.panelBorderColor};
  border-bottom-style: solid;
  border-bottom-width: ${props => (props.last ? 0 : '1px')};

  .legend--layer_name {
    font-size: 12px;
    padding-right: ${props => props.theme.mapControl.padding}px;
    color: ${props => props.theme.textColorHl};
    font-weight: 500;
  }
  .legend--layer_type {
    color: ${props => props.theme.subtextColor};
    font-weight: 500;
    font-size: 11px;
    padding-right: ${props => props.theme.mapControl.padding}px;
  }

  .legend--layer__title {
    padding-right: ${props => props.theme.mapControl.padding}px;
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
  <div className="legend--layer__title">
    <span className="legend--layer_by">by </span>
    <span className="legend--layer_color_field">{name}</span>
  </div>
);

const LayerSizeLegend = ({label, name}) => (
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

const SingleColorLegend = ({layer, width}) => (
  <ColorLegend
    scaleType="ordinal"
    displayLabel={false}
    domain={['']}
    fieldType={null}
    range={[rgb(...layer.config.color).toString()]}
    width={width}
  />
);

const MultiColorLegend = ({layer, width}) => {
  const {visConfig, colorField, colorScale, colorDomain} = layer.config;

  return (
    <ColorLegend
      scaleType={colorScale}
      displayLabel
      domain={colorDomain}
      fieldType={(colorField && colorField.type) || 'real'}
      range={visConfig.colorRange.colors}
      width={width}
    />
  );
};

const MapLegend = ({layers}) => (
  <div>
    {layers.map((layer, index) => {
      if (!layer.isValidToSave()) {
        return null;
      }

      const colorChannelConfig = layer.getVisualChannelDescription('color');
      const enableColorBy = colorChannelConfig.measure;
      const width = DIMENSIONS.mapControl.width - 2 * DIMENSIONS.mapControl.padding;

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
                {enableColorBy ?
                  <MultiColorLegend layer={layer} width={width}/> :
                  <SingleColorLegend layer={layer} width={width}/>
                }
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

              const visualChannelDescription = layer.getVisualChannelDescription(key);
              if (matchCondition && enabled) {
                return (
                  <LayerSizeLegend
                    key={key}
                    label={visualChannelDescription.label}
                    name={visualChannelDescription.measure}
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
