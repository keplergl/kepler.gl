// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components';

import {VectorTileLayer} from '@kepler.gl/layers';
import {KeplerTable as KeplerDataset} from '@kepler.gl/table';

import SourceDataSelectorFactory from '../common/source-data-selector';
import ChannelByValueSelectorFactory from './channel-by-value-selector';
import LayerConfigGroupFactory, {ConfigGroupCollapsibleContent} from './layer-config-group';
import {LayerColorRangeSelectorFactory, LayerColorSelectorFactory} from './layer-color-selector';
import VisConfigByZoomInput from './radius-by-zoom-input';
import VisConfigSliderFactory from './vis-config-slider';
import VisConfigSwitchFactory from './vis-config-switch';

const StyledLayerConfigurator = styled.div`
  margin-top: 12px;
`;

type GetProps<T extends (...args: any[]) => React.FC<any>> = Parameters<ReturnType<T>>[0];

type Props = {
  layer: VectorTileLayer;
  dataset?: KeplerDataset;
  visConfiguratorProps: any;
  layerChannelConfigProps: GetProps<typeof ChannelByValueSelectorFactory>;
  layerConfiguratorProps: any;
};

VectorTileLayerConfiguratorFactory.deps = [
  ChannelByValueSelectorFactory,
  LayerColorRangeSelectorFactory,
  LayerColorSelectorFactory,
  LayerConfigGroupFactory,
  VisConfigSliderFactory,
  VisConfigSwitchFactory,
  SourceDataSelectorFactory
];

function VectorTileLayerConfiguratorFactory(
  ChannelByValueSelector: ReturnType<typeof ChannelByValueSelectorFactory>,
  LayerColorRangeSelector: ReturnType<typeof LayerColorRangeSelectorFactory>,
  LayerColorSelector: ReturnType<typeof LayerColorSelectorFactory>,
  LayerConfigGroup: ReturnType<typeof LayerConfigGroupFactory>,
  VisConfigSlider: ReturnType<typeof VisConfigSliderFactory>,
  VisConfigSwitch: ReturnType<typeof VisConfigSwitchFactory>
): React.FC<Props> {
  const VectorTileLayerConfigurator = ({
    layer,
    visConfiguratorProps,
    layerChannelConfigProps,
    layerConfiguratorProps
  }: Props) => {
    return (
      <StyledLayerConfigurator>
        {/* Fill Color */}
        <LayerConfigGroup {...visConfiguratorProps} label="layer.fillColor">
          {layerChannelConfigProps.fields ? (
            <ChannelByValueSelector
              {...layerChannelConfigProps}
              channel={layer.visualChannels.color}
            />
          ) : null}
          {layer.config.colorField ? (
            <>
              <VisConfigSwitch
                {...visConfiguratorProps}
                {...layer.visConfigSettings.dynamicColor}
              />
              <LayerColorRangeSelector
                {...visConfiguratorProps}
                channel={layer.visualChannels.color}
              />
            </>
          ) : (
            <LayerColorSelector {...layerConfiguratorProps} />
          )}
          <VisConfigSlider {...layer.visConfigSettings.opacity} {...visConfiguratorProps} />
        </LayerConfigGroup>

        {/* Stroke color */}
        <LayerConfigGroup
          {...layer.visConfigSettings.stroked}
          {...visConfiguratorProps}
          label="layer.strokeColor"
          collapsible
        >
          <ChannelByValueSelector
            {...layerChannelConfigProps}
            channel={layer.visualChannels.strokeColor}
          />
          {layer.config.strokeColorField ? (
            <LayerColorRangeSelector
              {...visConfiguratorProps}
              property="strokeColorRange"
              channel={layer.visualChannels.strokeColor}
            />
          ) : (
            <LayerColorSelector
              {...visConfiguratorProps}
              selectedColor={layer.config.visConfig.strokeColor}
              property="strokeColor"
            />
          )}
          <ConfigGroupCollapsibleContent>
            <VisConfigSlider {...layer.visConfigSettings.strokeOpacity} {...visConfiguratorProps} />
          </ConfigGroupCollapsibleContent>
        </LayerConfigGroup>

        {/* Stroke Width */}
        <LayerConfigGroup
          {...visConfiguratorProps}
          {...layer.visConfigSettings.stroked}
          label="layer.strokeWidth"
          collapsible
        >
          {layer.config.sizeField ? (
            <VisConfigSlider
              {...layer.visConfigSettings.sizeRange}
              {...visConfiguratorProps}
              label={false}
            />
          ) : (
            <VisConfigSlider
              {...layer.visConfigSettings.strokeWidth}
              {...visConfiguratorProps}
              label={false}
            />
          )}
          <ConfigGroupCollapsibleContent>
            <ChannelByValueSelector
              {...layerChannelConfigProps}
              channel={layer.visualChannels.size}
            />
          </ConfigGroupCollapsibleContent>
        </LayerConfigGroup>

        {/* Elevation */}
        <LayerConfigGroup
          {...visConfiguratorProps}
          {...layer.visConfigSettings.enable3d}
          collapsible
        >
          <VisConfigSlider
            {...layer.visConfigSettings.elevationScale}
            {...visConfiguratorProps}
            label={false}
          />
          {layerChannelConfigProps.fields ? (
            <ChannelByValueSelector
              {...layerChannelConfigProps}
              channel={layer.visualChannels.height}
            />
          ) : null}
        </LayerConfigGroup>

        {/* Radius */}
        <LayerConfigGroup
          {...visConfiguratorProps}
          label={'layer.radius'}
          description="Point radius in pixels or meters"
          collapsible
        >
          {layer.config.visConfig.radiusByZoom?.enabled && visConfiguratorProps.onChange ? (
            <VisConfigByZoomInput
              config={layer.config.visConfig.radiusByZoom}
              onChange={visConfiguratorProps.onChange}
              label="Radius"
              property="radiusByZoom"
              unit="px"
            />
          ) : (
            <VisConfigSlider
              {...layer.visConfigSettings.radius}
              {...visConfiguratorProps}
              label={false}
            />
          )}

          <ConfigGroupCollapsibleContent>
            {layerChannelConfigProps.fields ? (
              <ChannelByValueSelector
                {...layerChannelConfigProps}
                channel={layer.visualChannels.radius}
              />
            ) : null}
            <VisConfigSwitch {...layer.visConfigSettings.radiusUnits} {...visConfiguratorProps} />
          </ConfigGroupCollapsibleContent>
        </LayerConfigGroup>
      </StyledLayerConfigurator>
    );
  };

  const ConnectedVectorTileLayerConfigurator = connect(state => state)(VectorTileLayerConfigurator);
  return ConnectedVectorTileLayerConfigurator;
}

export default VectorTileLayerConfiguratorFactory;
