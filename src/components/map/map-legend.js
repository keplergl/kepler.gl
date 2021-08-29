// Copyright (c) 2021 Uber Technologies, Inc.
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
import styled from 'styled-components';
import {rgb} from 'd3-color';
import ColorLegend from 'components/common/color-legend';
import {CHANNEL_SCALES, DIMENSIONS} from 'constants/default-settings';
import {FormattedMessage} from 'localization';

export const StyledMapControlLegend = styled.div`
  padding: 10px ${props => props.theme.mapControl.padding}px 10px
    ${props => props.theme.mapControl.padding}px;
  font-size: 11px;
  border-bottom-color: ${props => props.theme.panelBorderColor};
  border-bottom-style: solid;
  border-bottom-width: ${props => (props.last ? 0 : '1px')};
  width: ${props => props.width}px;

  .legend--layer_name {
    font-size: 12px;
    padding-right: ${props => props.theme.mapControl.padding}px;
    color: ${props => props.theme.textColor};
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
    color: ${props => props.theme.textColorHl};
    font-weight: 500;
  }

  .legend--layer_color-legend {
    margin-top: 6px;
  }
`;

export const VisualChannelMetric = ({name}) => {
  return (
    <div className="legend--layer__title">
      <span className="legend--layer_color_field">
        <FormattedMessage id={name} />
      </span>
    </div>
  );
};

/** @type {typeof import('./map-legend').LayerSizeLegend} */
export const LayerSizeLegend = ({label, name}) => (
  <div className="legend--layer_size-schema">
    <p>
      <span className="legend--layer_by">
        <FormattedMessage id={label} />
      </span>
      <span className="legend--layer_by"> by </span>
    </p>
    <VisualChannelMetric name={name} />
  </div>
);

const SINGLE_COLOR_DOMAIN = [''];

/** @type {typeof import('./map-legend').SingleColorLegend} */
export const SingleColorLegend = React.memo(({width, color}) => (
  <ColorLegend
    scaleType="ordinal"
    displayLabel={false}
    domain={SINGLE_COLOR_DOMAIN}
    fieldType={null}
    range={{colors: [rgb(...color).toString()]}}
    width={width}
  />
));

SingleColorLegend.displayName = 'SingleColorLegend';

/** @type {typeof import('./map-legend').LayerColorLegend} */
export const LayerColorLegend = React.memo(({description, config, width, colorChannel}) => {
  const enableColorBy = description.measure;
  const {scale, field, domain, range, property} = colorChannel;
  const [colorScale, colorField, colorDomain] = [scale, field, domain].map(k => config[k]);
  const colorRange = config.visConfig[range];

  return (
    <div>
      <div className="legend--layer_color-schema">
        <div>
          {enableColorBy ? <VisualChannelMetric name={enableColorBy} /> : null}
          <div className="legend--layer_color-legend">
            {enableColorBy ? (
              <ColorLegend
                scaleType={colorScale}
                displayLabel
                domain={colorDomain}
                fieldType={(colorField && colorField.type) || 'real'}
                range={colorRange}
                width={width}
              />
            ) : (
              <SingleColorLegend
                color={config.visConfig[property] || config[property] || config.color}
                width={width}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

LayerColorLegend.displayName = 'LayerColorLegend';

const isColorChannel = visualChannel =>
  [CHANNEL_SCALES.color, CHANNEL_SCALES.colorAggr].includes(visualChannel.channelScaleType);

export function LayerLegendHeaderFactory() {
  /** @type {typeof import('./map-legend').LayerLegendHeader }> */
  const LayerLegendHeader = ({options, layer}) => {
    return options?.showLayerName !== false ? (
      <div className="legend--layer_name">{layer.config.label}</div>
    ) : null;
  };
  return LayerLegendHeader;
}

export function LayerLegendContentFactory() {
  /** @type {typeof import('./map-legend').LayerLegendContent }> */
  const LayerLegendContent = ({layer, containerW}) => {
    const colorChannels = Object.values(layer.visualChannels).filter(isColorChannel);
    const nonColorChannels = Object.values(layer.visualChannels).filter(vc => !isColorChannel(vc));

    return (
      <>
        {colorChannels.map(colorChannel =>
          !colorChannel.condition || colorChannel.condition(layer.config) ? (
            <LayerColorLegend
              key={colorChannel.key}
              description={layer.getVisualChannelDescription(colorChannel.key)}
              config={layer.config}
              width={containerW - 2 * DIMENSIONS.mapControl.padding}
              colorChannel={colorChannel}
            />
          ) : null
        )}
        {nonColorChannels.map(visualChannel => {
          const matchCondition = !visualChannel.condition || visualChannel.condition(layer.config);
          const enabled = layer.config[visualChannel.field] || visualChannel.defaultMeasure;

          const description = layer.getVisualChannelDescription(visualChannel.key);

          return matchCondition && enabled ? (
            <LayerSizeLegend
              key={visualChannel.key}
              label={description.label}
              name={description.measure}
            />
          ) : null;
        })}
      </>
    );
  };

  return LayerLegendContent;
}

MapLegendFactory.deps = [LayerLegendHeaderFactory, LayerLegendContentFactory];
function MapLegendFactory(LayerLegendHeader, LayerLegendContent) {
  /** @type {typeof import('./map-legend').MapLegend }> */
  const MapLegend = ({layers = [], width, options}) => (
    <div className="map-legend">
      {layers.map((layer, index) => {
        if (!layer.isValidToSave() || layer.config.hidden) {
          return null;
        }
        const containerW = width || DIMENSIONS.mapControl.width;

        return (
          <StyledMapControlLegend
            className="legend--layer"
            last={index === layers.length - 1}
            key={index}
            width={containerW}
          >
            <LayerLegendHeader options={options} layer={layer} />
            <LayerLegendContent containerW={containerW} layer={layer} />
          </StyledMapControlLegend>
        );
      })}
    </div>
  );

  MapLegend.displayName = 'MapLegend';

  return MapLegend;
}

export default MapLegendFactory;
