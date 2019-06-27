// Copyright (c) 2019 Uber Technologies, Inc.
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
import {DIMENSIONS, CHANNEL_SCALES} from 'constants/default-settings';
import {camelToTitle} from 'utils/utils';

export const StyledMapControlLegend = styled.div`
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

export const VisualChannelMetric = ({name}) => (
  <div className="legend--layer__title">
    <span className="legend--layer_by">by </span>
    <span className="legend--layer_color_field">{name}</span>
  </div>
);

export const LayerSizeLegend = ({label, name}) => (
  <div className="legend--layer_size-schema">
    <p>
      <span className="legend--layer_by">{label}</span>
    </p>
    <VisualChannelMetric name={name} />
  </div>
);

const propTypes = {
  layers: PropTypes.arrayOf(PropTypes.object)
};

const SingleColorDomain = [''];
export const SingleColorLegend = React.memo(({width, color}) => (
  <ColorLegend
    scaleType="ordinal"
    displayLabel={false}
    domain={SingleColorDomain}
    fieldType={null}
    range={[rgb(...color).toString()]}
    width={width}
  />
));

export const MultiColorLegend = React.memo(({colorRange, colorScale, colorDomain, colorField, width}) => (
  <ColorLegend
    scaleType={colorScale}
    displayLabel
    domain={colorDomain}
    fieldType={(colorField && colorField.type) || 'real'}
    range={colorRange.colors}
    width={width}
  />
));

export const LayerColorLegend = React.memo(({description, config, width, colorChannel}) => {
  const enableColorBy = description.measure;
  const {scale, field, domain, range, property, key} = colorChannel;
  const [colorScale, colorField, colorDomain] = [scale, field, domain].map(k => config[k]);
  const colorRange = config.visConfig[range];

  return (
    <div>
      <div className="legend--layer_type">{camelToTitle(key)}</div>
      <div className="legend--layer_color-schema">
        <div>
          {enableColorBy ? (
            <VisualChannelMetric name={enableColorBy} />
          ) : null}
          <div className="legend--layer_color-legend">
            {enableColorBy ?
              <MultiColorLegend
                colorScale={colorScale}
                colorField={colorField}
                colorDomain={colorDomain}
                colorRange={colorRange}
                width={width} /> :
              <SingleColorLegend
                color={config.visConfig[property] || config[property] || config.color}
                width={width}
              />
            }
          </div>
        </div>
      </div>
    </div>
  )
});

const isColorChannel = (visualChannel) =>
  [CHANNEL_SCALES.color, CHANNEL_SCALES.colorAggr].includes(visualChannel.channelScaleType);

const MAP_LEGEND_WIDTH = DIMENSIONS.mapControl.width - 2 * DIMENSIONS.mapControl.padding;

const MapLegend = ({layers = []}) => (
  <div>
    {layers.map((layer, index) => {
      if (!layer.isValidToSave()) {
        return null;
      }

      const colorChannels = Object.values(layer.visualChannels)
        .filter(isColorChannel);
      const nonColorChannels = Object.values(layer.visualChannels)
      .filter(vc => !isColorChannel(vc));

      return (
        <StyledMapControlLegend
          className="legend--layer"
          last={index === layers.length - 1}
          key={index}
        >
          <div className="legend--layer_name">{layer.config.label}</div>
          {colorChannels.map(colorChannel =>
              !colorChannel.condition || colorChannel.condition(layer.config) ?
                (
                  <LayerColorLegend
                    key={colorChannel.key}
                    description={layer.getVisualChannelDescription(colorChannel.key)}
                    config={layer.config}
                    width={MAP_LEGEND_WIDTH}
                    colorChannel={colorChannel}
                  />
                ) : null
            )}
          {nonColorChannels
            .map(visualChannel => {
              const matchCondition =
                !visualChannel.condition ||
                visualChannel.condition(layer.config);
              const enabled =
                layer.config[visualChannel.field] ||
                visualChannel.defaultMeasure;

              const description = layer.getVisualChannelDescription(visualChannel.key);

              return matchCondition && enabled ?
                (
                  <LayerSizeLegend
                    key={visualChannel.key}
                    label={description.label}
                    name={description.measure}
                  />
                ) : null;
            })}
        </StyledMapControlLegend>
      );
    })}
  </div>
);

MapLegend.propTypes = propTypes;

export default MapLegend;
