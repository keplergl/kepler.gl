// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {FC} from 'react';
import styled from 'styled-components';
import {rgb} from 'd3-color';
import ColorLegend from '../common/color-legend';
import RadiusLegend from '../common/radius-legend';
import {CHANNEL_SCALES, DIMENSIONS} from '@kepler.gl/constants';
import {FormattedMessage} from '@kepler.gl/localization';
import {Layer, LayerBaseConfig, VisualChannel, VisualChannelDescription} from '@kepler.gl/layers';
import {MapState} from '@kepler.gl/types';

interface StyledMapControlLegendProps {
  width?: number;
  last?: boolean;
}
import {getDistanceScales} from 'viewport-mercator-project';

export const StyledMapControlLegend = styled.div<StyledMapControlLegendProps>`
  padding: 10px ${props => props.theme.mapControl.padding}px 10px
    ${props => props.theme.mapControl.padding}px;
  font-size: 11px;
  font-family: ${props => props.theme.fontFamily};
  border-bottom-color: ${props => props.theme.panelBorderColor};
  border-bottom-style: solid;
  border-bottom-width: ${props => (props.last ? 0 : '1px')};
  width: ${props => props.width}px;
  box-sizing: border-box;

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

export type LayerSizeLegendProps = {
  label: string;
  name: string | undefined;
};

/** @type {typeof import('./map-legend').LayerDefaultLegend} */
export const LayerDefaultLegend: React.FC<LayerSizeLegendProps> = ({label, name}) =>
  label ? (
    <div className="legend--layer_size-schema">
      <p>
        <span className="legend--layer_by">{label ? <FormattedMessage id={label} /> : null}</span>
        <span className="legend--layer_by"> by </span>
      </p>
      {name && <VisualChannelMetric name={name} />}
    </div>
  ) : null;

const SINGLE_COLOR_DOMAIN = [''];

export type SingleColorLegendProps = {
  width: number;
  color: string;
};

/** @type {typeof import('./map-legend').SingleColorLegend} */
export const SingleColorLegend: React.FC<SingleColorLegendProps> = React.memo(({width, color}) => (
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

export type LayerColorLegendProps = {
  description: VisualChannelDescription;
  config: LayerBaseConfig;
  width: number;
  colorChannel: VisualChannel;
};

/** @type {typeof import('./map-legend').LayerColorLegend} */
export const LayerColorLegend: React.FC<LayerColorLegendProps> = React.memo(
  ({description, config, width, colorChannel}) => {
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
  }
);

// eslint-disable-next-line react/display-name
LayerColorLegend.displayName = 'LayerColorLegend';

function getLayerRadiusScaleMetersToPixelsMultiplier(layer, mapState) {
  // @ts-ignore this actually exist
  const {metersPerPixel} = getDistanceScales(mapState);
  // if no field size is defined we need to pass fixed radius = false
  const fixedRadius = layer.config.visConfig.fixedRadius && Boolean(layer.config.sizeField);
  return layer.getRadiusScaleByZoom(mapState, fixedRadius) / metersPerPixel[0];
}

export type LayerRadiusLegendProps = {
  layer: Layer;
  mapState?: MapState;
  width: number;
  visualChannel: VisualChannel;
};

export const LayerRadiusLegend: FC<LayerRadiusLegendProps> = React.memo(
  ({layer, width, visualChannel, mapState}) => {
    const description = layer.getVisualChannelDescription(visualChannel.key);
    const config = layer.config;

    const enableSizeBy = description.measure;
    const {scale, field, domain, range} = visualChannel;
    const [sizeScale, sizeField, sizeDomain] = [scale, field, domain].map(k => config[k]);
    let sizeRange = config.visConfig[range];

    if (mapState) {
      const radiusMultiplier = getLayerRadiusScaleMetersToPixelsMultiplier(layer, mapState);
      sizeRange = sizeRange.map(v => v * radiusMultiplier);
    }

    return (
      <div className="legend--layer__item">
        <div className="legend--layer_size-schema">
          <div>
            {enableSizeBy ? <VisualChannelMetric name={enableSizeBy} /> : null}
            <div className="legend--layer_size-legend">
              {enableSizeBy ? (
                <RadiusLegend
                  scaleType={sizeScale}
                  domain={sizeDomain}
                  fieldType={(sizeField && sizeField.type) || 'real'}
                  range={sizeRange}
                  width={width}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
);
LayerRadiusLegend.displayName = 'LayerRadiusLegend';

const isColorChannel = visualChannel =>
  [CHANNEL_SCALES.color, CHANNEL_SCALES.colorAggr].includes(visualChannel.channelScaleType);

export type LayerLegendHeaderProps = {
  layer: Layer;
  options?: {
    showLayerName?: boolean;
  };
};

const isRadiusChannel = visualChannel =>
  [CHANNEL_SCALES.radius].includes(visualChannel.channelScaleType);

export function LayerLegendHeaderFactory() {
  /** @type {typeof import('./map-legend').LayerLegendHeader }> */
  const LayerLegendHeader: React.FC<LayerLegendHeaderProps> = ({options, layer}) => {
    return options?.showLayerName !== false ? (
      <div className="legend--layer_name">{layer.config.label}</div>
    ) : null;
  };
  return LayerLegendHeader;
}

export type LayerLegendContentProps = {
  layer: Layer;
  containerW: number;
  mapState?: MapState;
};

export function LayerLegendContentFactory() {
  /** @type {typeof import('./map-legend').LayerLegendContent }> */
  const LayerLegendContent: React.FC<LayerLegendContentProps> = ({layer, containerW, mapState}) => {
    const colorChannels = Object.values(layer.visualChannels).filter(isColorChannel);
    const nonColorChannels = Object.values(layer.visualChannels).filter(vc => !isColorChannel(vc));
    const width = containerW - 2 * DIMENSIONS.mapControl.padding;

    return (
      <>
        {colorChannels.map(colorChannel =>
          !colorChannel.condition || colorChannel.condition(layer.config) ? (
            <LayerColorLegend
              key={colorChannel.key}
              description={layer.getVisualChannelDescription(colorChannel.key)}
              config={layer.config}
              width={width}
              colorChannel={colorChannel}
            />
          ) : null
        )}
        {nonColorChannels.map(visualChannel => {
          const matchCondition = !visualChannel.condition || visualChannel.condition(layer.config);
          const enabled = layer.config[visualChannel.field] || visualChannel.defaultMeasure;

          if (matchCondition && enabled) {
            const description = layer.getVisualChannelDescription(visualChannel.key);
            if (isRadiusChannel(visualChannel)) {
              return (
                <LayerRadiusLegend
                  key={visualChannel.key}
                  layer={layer}
                  mapState={mapState}
                  width={width}
                  visualChannel={visualChannel}
                />
              );
            }
            return (
              <LayerDefaultLegend
                key={visualChannel.key}
                label={description.label}
                name={description.measure}
              />
            );
          }
          return null;
        })}
      </>
    );
  };

  return LayerLegendContent;
}

export type MapLegendProps = {
  layers?: ReadonlyArray<Layer>;
  width?: number;
  mapState?: MapState;
  options?: {
    showLayerName?: boolean;
  };
};

MapLegendFactory.deps = [LayerLegendHeaderFactory, LayerLegendContentFactory];
function MapLegendFactory(LayerLegendHeader, LayerLegendContent) {
  /** @type {typeof import('./map-legend').MapLegend }> */
  const MapLegend: React.FC<MapLegendProps> = ({layers = [], width, mapState, options}) => (
    <div
      className="map-legend"
      {...(mapState?.height && {
        style: {
          /* subtracting rough size of 4 map control buttons and padding */
          maxHeight: mapState.height - 250
        }
      })}
    >
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
            <LayerLegendContent containerW={containerW} layer={layer} mapState={mapState} />
          </StyledMapControlLegend>
        );
      })}
    </div>
  );

  MapLegend.displayName = 'MapLegend';

  return MapLegend;
}

export default MapLegendFactory;
