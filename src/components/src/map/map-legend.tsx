// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {FC, useCallback, useState, ComponentType} from 'react';
import styled from 'styled-components';
import {rgb} from 'd3-color';
import {format as d3Format} from 'd3-format';
import {useIntl} from 'react-intl';
import ColorLegendFactory, {LegendRowFactory} from '../common/color-legend';
import RadiusLegend from '../common/radius-legend';
import {CHANNEL_SCALES, DIMENSIONS} from '@kepler.gl/constants';
import {FormattedMessage} from '@kepler.gl/localization';
import {Layer, LayerBaseConfig, VisualChannel, VisualChannelDescription} from '@kepler.gl/layers';
import {LayerVisConfig, MapState, RGBColor} from '@kepler.gl/types';
import {getDistanceScales} from 'viewport-mercator-project';
import {ArrowDown, ArrowRight} from '../common/icons';
import PanelHeaderActionFactory from '../side-panel/panel-header-action';

interface StyledMapControlLegendProps {
  width?: number;
  last?: boolean;
}

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

  .legend--layer_size-title-row {
    display: flex;
    margin-top: 4px;
    padding-right: ${props => props.theme.mapControl.padding}px;
    align-items: center;
  }

  .legend--layer__title {
  }

  .legend--layer__item {
    padding-bottom: 4px;
  }
  .legend--layer_by {
    color: ${props => props.theme.subtextColor};
    margin-top: 4px;
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

export type SingleColorLegendProps = {
  color: RGBColor;
  label?: string;
};

SingleColorLegendFactory.deps = [LegendRowFactory];

export function SingleColorLegendFactory(LegendRow: ReturnType<typeof LegendRowFactory>) {
  const SingleColorLegend: React.FC<SingleColorLegendProps> = ({color, label}) => (
    <LegendRow
      label={label ?? ''}
      displayLabel={Boolean(label)}
      color={Array.isArray(color) ? rgb(...color).toString() : color}
    />
  );

  SingleColorLegend.displayName = 'SingleColorLegend';

  return React.memo(SingleColorLegend);
}

export type LayerColorLegendProps = {
  description: VisualChannelDescription;
  config: LayerBaseConfig;
  colorChannel: VisualChannel;
  onLayerVisConfigChange?: (oldLayer: Layer, newVisConfig: Partial<LayerVisConfig>) => void;
  layer: Layer;
  disableEdit?: boolean;
  isExport?: boolean;
  mapState?: MapState;
  actionIcons: MapLegendIcons;
};

LayerColorLegendFactory.deps = [
  ColorLegendFactory,
  SingleColorLegendFactory,
  PanelHeaderActionFactory
];
export function LayerColorLegendFactory(
  ColorLegend: ReturnType<typeof ColorLegendFactory>,
  SingleColorLegend: ReturnType<typeof SingleColorLegendFactory>,
  PanelHeaderAction: ReturnType<typeof PanelHeaderActionFactory>
) {
  const LayerColorLegend: React.FC<LayerColorLegendProps> = ({
    description,
    config,
    layer,
    colorChannel,
    disableEdit,
    onLayerVisConfigChange,
    isExport,
    mapState,
    actionIcons
  }) => {
    const intl = useIntl();
    const enableColorBy = description.measure;
    const {scale, field, domain, range, property, fixed} = colorChannel;
    const [colorScale, colorField, colorDomain] = [scale, field, domain].map(k => config[k]);
    const isFixed = fixed && config.visConfig[fixed];

    const colorRange = config.visConfig[range];
    const onUpdateColorLegend = useCallback(
      colorLegends => {
        if (onLayerVisConfigChange) {
          onLayerVisConfigChange(layer, {
            [range]: {
              ...colorRange,
              colorLegends
            }
          });
        }
      },
      [layer, onLayerVisConfigChange, colorRange, range]
    );
    const [isExpanded, setIsExpanded] = useState(isExport);
    const handleToggleExpanded = () => setIsExpanded(!isExpanded);
    return (
      <div className="legend--layer__item">
        <div className="legend--layer_color-schema">
          <div>
            {enableColorBy ? (
              <div className="legend--layer_size-title-row">
                <VisualChannelMetric name={enableColorBy} />
                {!isExport ? (
                  <PanelHeaderAction
                    id="legend-collapse-button"
                    onClick={handleToggleExpanded}
                    IconComponent={isExpanded ? actionIcons.expanded : actionIcons.collapsed}
                  />
                ) : null}
              </div>
            ) : null}
            <div className="legend--layer_color-legend">
              {enableColorBy ? (
                <ColorLegend
                  layer={layer}
                  isExpanded={isExpanded}
                  scaleType={colorScale}
                  displayLabel
                  domain={colorDomain}
                  fieldType={(colorField && colorField.type) || 'real'}
                  range={colorRange}
                  onUpdateColorLegend={onUpdateColorLegend}
                  disableEdit={disableEdit}
                  isFixed={isFixed}
                  mapState={mapState}
                  labelFormat={
                    colorField?.displayFormat ? d3Format(colorField?.displayFormat) : null
                  }
                />
              ) : (
                <SingleColorLegend
                  color={config.visConfig[property] || config[property] || config.color}
                  label={intl.formatMessage({
                    id: `mapLegend.layers.${layer.type}.singleColor.${colorChannel.key}`,
                    defaultMessage: intl.formatMessage({
                      id: `mapLegend.layers.default.singleColor.${colorChannel.key}`,
                      defaultMessage: ' ' // mustn't be empty string or id will be used
                    })
                  })}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  LayerColorLegend.displayName = 'LayerColorLegend';
  return React.memo(LayerColorLegend);
}

function getLayerRadiusScaleMetersToPixelsMultiplier(layer, mapState) {
  // @ts-ignore this actually exist
  const {metersPerPixel} = getDistanceScales(mapState);
  // if no field size is defined we need to pass fixed radius = false
  const fixedRadius = layer.config.visConfig.fixedRadius && Boolean(layer.config.sizeField);
  return layer.getRadiusScaleByZoom(mapState, fixedRadius) / metersPerPixel[0];
}

export type MapLegendIcons = {
  expanded: ComponentType<any>;
  collapsed: ComponentType<any>;
};

export type LayerRadiusLegendProps = {
  layer: Layer;
  mapState?: MapState;
  width: number;
  isExport?: boolean;
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
      <div>
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

const isColorChannel = visualChannel =>
  [CHANNEL_SCALES.color, CHANNEL_SCALES.colorAggr].includes(visualChannel.channelScaleType);

export type LayerLegendHeaderProps = {
  layer: Layer;
  options?: {
    showLayerName?: boolean;
  };
  isExport?: boolean;
};

const isRadiusChannel = visualChannel =>
  [CHANNEL_SCALES.radius].includes(visualChannel.channelScaleType);

export function LayerLegendHeaderFactory() {
  const LayerLegendHeader: React.FC<LayerLegendHeaderProps> = ({options, layer}) => {
    return options?.showLayerName !== false ? (
      <div className="legend--layer_name">{layer.config.label}</div>
    ) : null;
  };
  return LayerLegendHeader;
}

const defaultActionIcons = {
  expanded: ArrowDown,
  collapsed: ArrowRight
};

export type LayerLegendContentProps = {
  layer: Layer;
  containerW: number;
  mapState?: MapState;
  disableEdit?: boolean;
  isExport?: boolean;
  onLayerVisConfigChange?: (oldLayer: Layer, newVisConfig: Partial<LayerVisConfig>) => void;
  actionIcons: MapLegendIcons;
};

LayerLegendContentFactory.deps = [LayerColorLegendFactory];

export function LayerLegendContentFactory(
  LayerColorLegend: ReturnType<typeof LayerColorLegendFactory>
) {
  const LayerLegendContent: React.FC<LayerLegendContentProps> = ({
    layer,
    containerW,
    mapState,
    disableEdit,
    isExport,
    onLayerVisConfigChange,
    actionIcons
  }) => {
    const visualChannels = layer.getLegendVisualChannels();
    const channelKeys = Object.values(visualChannels);
    const colorChannels = channelKeys.filter(isColorChannel) as VisualChannel[];
    const nonColorChannels = channelKeys.filter(vc => !isColorChannel(vc));
    const width = containerW - 2 * DIMENSIONS.mapControl.padding;

    // render color by chanel only
    let colorChannelToRender = colorChannels.filter(
      cc =>
        (!cc.condition || cc.condition(layer.config)) &&
        layer.getVisualChannelDescription(cc.key)?.measure
    );
    // if no color by chanel, render rest
    if (!colorChannelToRender.length) {
      colorChannelToRender = colorChannels.filter(
        cc => !cc.condition || cc.condition(layer.config)
      );
    }
    return (
      <>
        {colorChannelToRender.map(colorChannel => (
          <LayerColorLegend
            key={colorChannel.key}
            colorChannel={colorChannel}
            config={layer.config}
            description={layer.getVisualChannelDescription(colorChannel.key)}
            layer={layer}
            isExport={isExport}
            disableEdit={disableEdit}
            mapState={mapState}
            onLayerVisConfigChange={onLayerVisConfigChange}
            actionIcons={actionIcons}
          />
        ))}
        {nonColorChannels.map((visualChannel: VisualChannel) => {
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
  disableEdit?: boolean;
  isExport?: boolean;
  onLayerVisConfigChange?: (oldLayer: Layer, newVisConfig: Partial<LayerVisConfig>) => void;
  actionIcons?: MapLegendIcons;
};

MapLegendFactory.deps = [LayerLegendHeaderFactory, LayerLegendContentFactory];

function MapLegendFactory(
  LayerLegendHeader: ReturnType<typeof LayerLegendHeaderFactory>,
  LayerLegendContent: ReturnType<typeof LayerLegendContentFactory>
) {
  const MapLegend: React.FC<MapLegendProps> = ({
    layers = [],
    width,
    mapState,
    options,
    disableEdit,
    isExport,
    onLayerVisConfigChange,
    actionIcons = defaultActionIcons
  }) => (
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
            <LayerLegendHeader isExport={isExport} options={options} layer={layer} />
            <LayerLegendContent
              containerW={containerW}
              layer={layer}
              mapState={mapState}
              disableEdit={disableEdit}
              isExport={isExport}
              onLayerVisConfigChange={onLayerVisConfigChange}
              actionIcons={actionIcons}
            />
          </StyledMapControlLegend>
        );
      })}
    </div>
  );

  MapLegend.displayName = 'MapLegend';

  return MapLegend;
}

export default MapLegendFactory;
