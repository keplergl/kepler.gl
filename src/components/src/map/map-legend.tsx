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
import {LayerVisConfig, LayerOrder, MapState, RGBColor} from '@kepler.gl/types';
import {getDistanceScales} from 'viewport-mercator-project';
import {ArrowDown, ArrowRight, EyeSeen, EyeUnseen} from '../common/icons';
import PanelHeaderActionFactory from '../side-panel/panel-header-action';
import {getFlatLayerOrder} from '@kepler.gl/reducers';

interface StyledMapControlLegendProps {
  width?: number;
  $last?: boolean;
}

export const StyledMapControlLegend = styled.div<StyledMapControlLegendProps>`
  padding: 10px ${props => props.theme.mapControl.padding}px 10px
    ${props => props.theme.mapControl.padding}px;
  font-size: 11px;
  font-family: ${props => props.theme.fontFamily};
  border-bottom-color: ${props => props.theme.panelBorderColor};
  border-bottom-style: solid;
  border-bottom-width: ${props => (props.$last ? 0 : '1px')};
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

const StyledLegendHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledVisibilityToggle = styled.div<{$isVisible: boolean}>`
  cursor: pointer;
  color: ${props => (props.$isVisible ? props.theme.textColor : props.theme.subtextColor)};
  display: flex;
  align-items: center;
  margin-left: 8px;
  opacity: ${props => (props.$isVisible ? 1 : 0.5)};

  &:hover {
    color: ${props => props.theme.textColorHl};
    opacity: 1;
  }
`;

const StyledSplitVisibilityControls = styled.div`
  display: flex;
  align-items: center;
  margin-left: 8px;
  gap: 4px;

  ${StyledVisibilityToggle} {
    margin-left: 0;
  }
`;

const StyledSplitSeparator = styled.div<{$isVisible: boolean}>`
  width: 1px;
  height: 12px;
  background: ${props => (props.$isVisible ? props.theme.textColor : props.theme.subtextColor)};
  opacity: 0.3;
`;

const StyledExpandToggle = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-left: 6px;
  color: ${props => props.theme.textColor};
  opacity: 0.7;

  &:hover {
    opacity: 1;
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
                  disableEdit={disableEdit || Boolean(isExport)}
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
  onToggleLayerVisibility?: (layer: Layer) => void;
  isSplit?: boolean;
  splitMaps?: {layers: {[key: string]: boolean}}[];
  onMapToggleLayer?: (mapIndex: number, layerId: string) => void;
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
};

const isRadiusChannel = visualChannel =>
  [CHANNEL_SCALES.radius].includes(visualChannel.channelScaleType);

export function LayerLegendHeaderFactory() {
  const LayerLegendHeader: React.FC<LayerLegendHeaderProps> = ({
    options,
    layer,
    isExport,
    onToggleLayerVisibility,
    isSplit,
    splitMaps,
    onMapToggleLayer,
    isExpanded,
    onToggleExpanded
  }) => {
    const isVisible = layer.config.isVisible;

    const onToggle = useCallback(() => {
      if (onToggleLayerVisibility) {
        onToggleLayerVisibility(layer);
      }
    }, [layer, onToggleLayerVisibility]);

    const onToggleLeft = useCallback(() => {
      if (onMapToggleLayer) {
        onMapToggleLayer(0, layer.id);
      }
    }, [layer, onMapToggleLayer]);

    const onToggleRight = useCallback(() => {
      if (onMapToggleLayer) {
        onMapToggleLayer(1, layer.id);
      }
    }, [layer, onMapToggleLayer]);

    if (options?.showLayerName === false) {
      return null;
    }

    const isLeftVisible =
      isSplit && splitMaps && splitMaps.length > 1
        ? isVisible && Boolean(splitMaps[0]?.layers?.[layer.id])
        : isVisible;
    const isRightVisible =
      isSplit && splitMaps && splitMaps.length > 1
        ? isVisible && Boolean(splitMaps[1]?.layers?.[layer.id])
        : isVisible;
    const isAnyVisible = isLeftVisible || isRightVisible;

    return (
      <StyledLegendHeaderRow>
        <div className="legend--layer_name" style={{opacity: isAnyVisible ? 1 : 0.5, flex: 1}}>
          {layer.config.label}
        </div>
        {onToggleExpanded ? (
          <StyledExpandToggle onClick={onToggleExpanded}>
            {isExpanded ? <ArrowDown height="12px" /> : <ArrowRight height="12px" />}
          </StyledExpandToggle>
        ) : null}
        {!isExport && onMapToggleLayer && isSplit && splitMaps && splitMaps.length > 1 ? (
          <StyledSplitVisibilityControls>
            <StyledVisibilityToggle $isVisible={isLeftVisible} onClick={onToggleLeft}>
              {isLeftVisible ? <EyeSeen height="12px" /> : <EyeUnseen height="12px" />}
            </StyledVisibilityToggle>
            <StyledSplitSeparator $isVisible={isAnyVisible} />
            <StyledVisibilityToggle $isVisible={isRightVisible} onClick={onToggleRight}>
              {isRightVisible ? <EyeSeen height="12px" /> : <EyeUnseen height="12px" />}
            </StyledVisibilityToggle>
          </StyledSplitVisibilityControls>
        ) : !isExport && onToggleLayerVisibility ? (
          <StyledVisibilityToggle $isVisible={isVisible} onClick={onToggle}>
            {isVisible ? <EyeSeen height="12px" /> : <EyeUnseen height="12px" />}
          </StyledVisibilityToggle>
        ) : null}
      </StyledLegendHeaderRow>
    );
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
  layerOrder?: LayerOrder;
  width?: number;
  mapState?: MapState;
  options?: {
    showLayerName?: boolean;
  };
  disableEdit?: boolean;
  isExport?: boolean;
  onLayerVisConfigChange?: (oldLayer: Layer, newVisConfig: Partial<LayerVisConfig>) => void;
  onToggleLayerVisibility?: (layer: Layer) => void;
  onMapToggleLayer?: (mapIndex: number, layerId: string) => void;
  isSplit?: boolean;
  splitMaps?: {layers: {[key: string]: boolean}}[];
  actionIcons?: MapLegendIcons;
};

MapLegendFactory.deps = [LayerLegendHeaderFactory, LayerLegendContentFactory];

function MapLegendFactory(
  LayerLegendHeader: ReturnType<typeof LayerLegendHeaderFactory>,
  LayerLegendContent: ReturnType<typeof LayerLegendContentFactory>
) {
  const LayerLegendItem: React.FC<{
    layer: Layer;
    containerW: number;
    isLast: boolean;
    isLayerVisible: boolean;
    isExport?: boolean;
    options?: {showLayerName?: boolean};
    mapState?: MapState;
    disableEdit?: boolean;
    onLayerVisConfigChange?: (oldLayer: Layer, newVisConfig: Partial<LayerVisConfig>) => void;
    onToggleLayerVisibility?: (layer: Layer) => void;
    onMapToggleLayer?: (mapIndex: number, layerId: string) => void;
    isSplit?: boolean;
    splitMaps?: {layers: {[key: string]: boolean}}[];
    actionIcons: MapLegendIcons;
  }> = ({
    layer,
    containerW,
    isLast,
    isLayerVisible,
    isExport,
    options,
    mapState,
    disableEdit,
    onLayerVisConfigChange,
    onToggleLayerVisibility,
    onMapToggleLayer,
    isSplit,
    splitMaps,
    actionIcons
  }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const handleToggleExpanded = useCallback(() => setIsExpanded(prev => !prev), []);

    return (
      <StyledMapControlLegend className="legend--layer" $last={isLast} width={containerW}>
        <LayerLegendHeader
          isExport={isExport}
          options={options}
          layer={layer}
          onToggleLayerVisibility={onToggleLayerVisibility}
          isSplit={isSplit}
          splitMaps={splitMaps}
          onMapToggleLayer={onMapToggleLayer}
          isExpanded={isExpanded}
          onToggleExpanded={isExport ? undefined : handleToggleExpanded}
        />
        {isExpanded ? (
          <div style={{opacity: isLayerVisible ? 1 : 0.5}}>
            <LayerLegendContent
              containerW={containerW}
              layer={layer}
              mapState={mapState}
              disableEdit={disableEdit}
              isExport={isExport}
              onLayerVisConfigChange={onLayerVisConfigChange}
              actionIcons={actionIcons}
            />
          </div>
        ) : null}
      </StyledMapControlLegend>
    );
  };

  const MapLegend: React.FC<MapLegendProps> = ({
    layers = [],
    layerOrder,
    width,
    mapState,
    options,
    disableEdit,
    isExport,
    onLayerVisConfigChange,
    onToggleLayerVisibility,
    onMapToggleLayer,
    isSplit,
    splitMaps,
    actionIcons = defaultActionIcons
  }) => {
    const orderedLayers = layerOrder
      ? getFlatLayerOrder(layerOrder).reduce<Layer[]>((acc, id) => {
          const layer = layers.find(l => l.id === id);
          if (layer) acc.push(layer);
          return acc;
        }, [])
      : layers;

    return (
      <div className="map-legend">
        {orderedLayers.map((layer, index) => {
          if (!layer.isValidToSave() || layer.config.hidden) {
            return null;
          }
          const containerW = width || DIMENSIONS.mapControl.width;

          const isLayerVisible =
            isSplit && splitMaps && splitMaps.length > 1
              ? layer.config.isVisible &&
                (Boolean(splitMaps[0]?.layers?.[layer.id]) ||
                  Boolean(splitMaps[1]?.layers?.[layer.id]))
              : layer.config.isVisible;

          return (
            <LayerLegendItem
              key={layer.id}
              layer={layer}
              containerW={containerW}
              isLast={index === orderedLayers.length - 1}
              isLayerVisible={isLayerVisible}
              isExport={isExport}
              options={options}
              mapState={mapState}
              disableEdit={disableEdit}
              onLayerVisConfigChange={onLayerVisConfigChange}
              onToggleLayerVisibility={onToggleLayerVisibility}
              onMapToggleLayer={onMapToggleLayer}
              isSplit={isSplit}
              splitMaps={splitMaps}
              actionIcons={actionIcons}
            />
          );
        })}
      </div>
    );
  };

  MapLegend.displayName = 'MapLegend';

  return MapLegend;
}

export default MapLegendFactory;
