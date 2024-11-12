// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/* eslint-disable complexity */
import {FormattedMessage} from '@kepler.gl/localization';
import React, {Component, Fragment} from 'react';
import styled from 'styled-components';

import ItemSelector from '../../common/item-selector/item-selector';
import {Input, PanelLabel, SidePanelSection} from '../../common/styled-components';

import SourceDataSelectorFactory from '../common/source-data-selector';
import AggrScaleSelectorFactory from './aggr-scale-selector';
import ChannelByValueSelectorFactory from './channel-by-value-selector';
import HowToButton from './how-to-button';
import {
  ArcLayerColorSelectorFactory,
  LayerColorRangeSelectorFactory,
  LayerColorSelectorFactory
} from './layer-color-selector';
import LayerColumnModeConfigFactory from './layer-column-mode-config';
import LayerConfigGroupFactory, {ConfigGroupCollapsibleContent} from './layer-config-group';
import LayerErrorMessage from './layer-error-message';
import LayerTypeSelectorFactory from './layer-type-selector';
import TextLabelPanelFactory from './text-label-panel';
import VisConfigSliderFactory from './vis-config-slider';
import VisConfigSwitchFactory from './vis-config-switch';

import {capitalizeFirstLetter} from '@kepler.gl/utils';

import {AGGREGATION_TYPE_OPTIONS, LAYER_TYPES} from '@kepler.gl/constants';
import {AggregationLayer, Layer, LayerBaseConfig, VisualChannel} from '@kepler.gl/layers';

import {ActionHandler, toggleModal} from '@kepler.gl/actions';
import {Datasets} from '@kepler.gl/table';
import {ColorUI, LayerVisConfig, NestedPartial} from '@kepler.gl/types';

type LayerConfiguratorProps = {
  layer: Layer;
  datasets: Datasets;
  layerTypeOptions: {
    id: string;
    label: string;
    icon: React.ElementType;
    requireData: boolean;
  }[];
  openModal: ActionHandler<typeof toggleModal>;
  updateLayerConfig: (newConfig: Partial<LayerBaseConfig>) => void;
  updateLayerType: (newType: string) => void;
  updateLayerVisConfig: (newVisConfig: Partial<LayerVisConfig>) => void;
  updateLayerVisualChannelConfig: (
    newConfig: Partial<LayerBaseConfig>,
    channel: string,
    newVisConfig?: Partial<LayerVisConfig>
  ) => void;
  updateLayerColorUI: (prop: string, newConfig: NestedPartial<ColorUI>) => void;
  updateLayerTextLabel: (idx: number | 'all', prop: string, value: any) => void;
  disableTypeSelect?: boolean;
};

type AggregationSelectorProps = {
  channel: VisualChannel;
  layer: AggregationLayer;
  onChange: (
    val: Record<
      string,
      string | number | boolean | object | readonly (string | number | boolean | object)[] | null
    >,
    key: string
  ) => void;
};

const StyledLayerConfigurator = styled.div.attrs({
  className: 'layer-panel__config'
})`
  position: relative;
  margin-top: ${props => props.theme.layerConfiguratorMargin};
  padding: ${props => props.theme.layerConfiguratorPadding};
  border-left: ${props => props.theme.layerConfiguratorBorder} dashed
    ${props => props.theme.layerConfiguratorBorderColor};
`;

const StyledLayerVisualConfigurator = styled.div.attrs({
  className: 'layer-panel__config__visualC-config'
})`
  margin-top: 12px;
`;

export const getLayerFields = (datasets: Datasets, layer: Layer) =>
  layer.config?.dataId && datasets[layer.config.dataId] ? datasets[layer.config.dataId].fields : [];

/** Return any to be able to customize the Dataset entity */
export const getLayerDataset = (datasets: Datasets, layer: Layer): any =>
  layer.config?.dataId && datasets[layer.config.dataId] ? datasets[layer.config.dataId] : null;

export const getLayerConfiguratorProps = (props: LayerConfiguratorProps) => ({
  layer: props.layer,
  fields: getLayerFields(props.datasets, props.layer),
  onChange: props.updateLayerConfig,
  setColorUI: props.updateLayerColorUI
});

export const getVisConfiguratorProps = (props: LayerConfiguratorProps) => ({
  layer: props.layer,
  fields: getLayerFields(props.datasets, props.layer),
  onChange: props.updateLayerVisConfig,
  setColorUI: props.updateLayerColorUI
});

export const getLayerChannelConfigProps = (props: LayerConfiguratorProps) => ({
  layer: props.layer,
  fields: getLayerFields(props.datasets, props.layer),
  onChange: props.updateLayerVisualChannelConfig,
  setColorUI: props.updateLayerColorUI
});

LayerConfiguratorFactory.deps = [
  SourceDataSelectorFactory,
  VisConfigSliderFactory,
  TextLabelPanelFactory,
  LayerConfigGroupFactory,
  ChannelByValueSelectorFactory,
  LayerColumnModeConfigFactory,
  LayerTypeSelectorFactory,
  VisConfigSwitchFactory,
  LayerColorSelectorFactory,
  LayerColorRangeSelectorFactory,
  ArcLayerColorSelectorFactory,
  AggrScaleSelectorFactory
];

export default function LayerConfiguratorFactory(
  SourceDataSelector: ReturnType<typeof SourceDataSelectorFactory>,
  VisConfigSlider: ReturnType<typeof VisConfigSliderFactory>,
  TextLabelPanel: ReturnType<typeof TextLabelPanelFactory>,
  LayerConfigGroup: ReturnType<typeof LayerConfigGroupFactory>,
  ChannelByValueSelector: ReturnType<typeof ChannelByValueSelectorFactory>,
  LayerColumnModeConfig: ReturnType<typeof LayerColumnModeConfigFactory>,
  LayerTypeSelector: ReturnType<typeof LayerTypeSelectorFactory>,
  VisConfigSwitch: ReturnType<typeof VisConfigSwitchFactory>,
  LayerColorSelector: ReturnType<typeof LayerColorSelectorFactory>,
  LayerColorRangeSelector: ReturnType<typeof LayerColorRangeSelectorFactory>,
  ArcLayerColorSelector: ReturnType<typeof ArcLayerColorSelectorFactory>,
  AggrScaleSelector: ReturnType<typeof AggrScaleSelectorFactory>
): React.ComponentType<LayerConfiguratorProps> {
  class LayerConfigurator extends Component<LayerConfiguratorProps> {
    _renderPointLayerConfig(props) {
      return this._renderScatterplotLayerConfig(props);
    }

    _renderIconLayerConfig(props) {
      return this._renderScatterplotLayerConfig(props);
    }

    _renderScatterplotLayerConfig({
      layer,
      visConfiguratorProps,
      layerChannelConfigProps,
      layerConfiguratorProps
    }) {
      return (
        <StyledLayerVisualConfigurator>
          {/* Fill Color */}
          <LayerConfigGroup
            {...(layer.visConfigSettings.filled || {label: 'layer.color'})}
            {...visConfiguratorProps}
            collapsible
          >
            <ChannelByValueSelector
              channel={layer.visualChannels.color}
              {...layerChannelConfigProps}
            />
            {layer.config.colorField ? (
              <LayerColorRangeSelector {...visConfiguratorProps} />
            ) : (
              <LayerColorSelector {...layerConfiguratorProps} />
            )}

            <ConfigGroupCollapsibleContent>
              <VisConfigSlider {...layer.visConfigSettings.opacity} {...visConfiguratorProps} />
            </ConfigGroupCollapsibleContent>
          </LayerConfigGroup>

          {/* outline color */}
          {layer.type === LAYER_TYPES.point ? (
            <LayerConfigGroup
              {...layer.visConfigSettings.outline}
              {...visConfiguratorProps}
              collapsible
            >
              <ChannelByValueSelector
                channel={layer.visualChannels.strokeColor}
                {...layerChannelConfigProps}
              />
              {layer.config.strokeColorField ? (
                <LayerColorRangeSelector {...visConfiguratorProps} property="strokeColorRange" />
              ) : (
                <LayerColorSelector
                  {...visConfiguratorProps}
                  selectedColor={layer.config.visConfig.strokeColor}
                  property="strokeColor"
                />
              )}
              <ConfigGroupCollapsibleContent>
                <VisConfigSlider
                  {...layer.visConfigSettings.thickness}
                  {...visConfiguratorProps}
                  disabled={!layer.config.visConfig.outline}
                />
              </ConfigGroupCollapsibleContent>
            </LayerConfigGroup>
          ) : null}

          {/* Radius */}
          <LayerConfigGroup label={'layer.radius'} collapsible>
            {!layer.config.sizeField ? (
              <VisConfigSlider
                {...layer.visConfigSettings.radius}
                {...visConfiguratorProps}
                label={false}
                disabled={Boolean(layer.config.sizeField)}
              />
            ) : (
              <VisConfigSlider
                {...layer.visConfigSettings.radiusRange}
                {...visConfiguratorProps}
                label={false}
                disabled={!layer.config.sizeField || layer.config.visConfig.fixedRadius}
              />
            )}
            <ConfigGroupCollapsibleContent>
              <ChannelByValueSelector
                channel={layer.visualChannels.size}
                {...layerChannelConfigProps}
              />
              {layer.config.sizeField ? (
                <VisConfigSwitch
                  {...layer.visConfigSettings.fixedRadius}
                  {...visConfiguratorProps}
                />
              ) : null}
              <VisConfigSwitch {...layer.visConfigSettings.billboard} {...visConfiguratorProps} />
            </ConfigGroupCollapsibleContent>
          </LayerConfigGroup>

          {/* text label */}
          <TextLabelPanel
            id={layer.id}
            fields={visConfiguratorProps.fields}
            updateLayerTextLabel={this.props.updateLayerTextLabel}
            textLabel={layer.config.textLabel}
          />

          {/* Interaction */}
          <LayerConfigGroup label={'layer.interaction'} collapsible>
            <VisConfigSwitch {...layer.visConfigSettings.allowHover} {...visConfiguratorProps} />
            <ConfigGroupCollapsibleContent>
              <VisConfigSwitch
                {...layer.visConfigSettings.showNeighborOnHover}
                {...visConfiguratorProps}
              />
              <VisConfigSwitch
                {...layer.visConfigSettings.showHighlightColor}
                {...visConfiguratorProps}
              />
            </ConfigGroupCollapsibleContent>
          </LayerConfigGroup>
        </StyledLayerVisualConfigurator>
      );
    }

    _renderClusterLayerConfig({
      layer,
      visConfiguratorProps,
      layerConfiguratorProps,
      layerChannelConfigProps
    }) {
      return (
        <StyledLayerVisualConfigurator>
          {/* Color */}
          <LayerConfigGroup label={'layer.color'} collapsible>
            <LayerColorRangeSelector {...visConfiguratorProps} />
            <ChannelByValueSelector
              channel={layer.visualChannels.color}
              {...layerChannelConfigProps}
            />
            <ConfigGroupCollapsibleContent>
              <AggrScaleSelector {...layerConfiguratorProps} channel={layer.visualChannels.color} />
              {layer.visConfigSettings.colorAggregation.condition(layer.config) ? (
                <AggregationTypeSelector
                  {...layer.visConfigSettings.colorAggregation}
                  {...layerChannelConfigProps}
                  channel={layer.visualChannels.color}
                />
              ) : null}
              <VisConfigSlider {...layer.visConfigSettings.opacity} {...visConfiguratorProps} />
            </ConfigGroupCollapsibleContent>
          </LayerConfigGroup>

          {/* Cluster Radius */}
          <LayerConfigGroup label={'layer.radius'} collapsible>
            <VisConfigSlider {...layer.visConfigSettings.clusterRadius} {...visConfiguratorProps} />
            <ConfigGroupCollapsibleContent>
              <VisConfigSlider {...layer.visConfigSettings.radiusRange} {...visConfiguratorProps} />
            </ConfigGroupCollapsibleContent>
          </LayerConfigGroup>
        </StyledLayerVisualConfigurator>
      );
    }

    _renderHeatmapLayerConfig({layer, visConfiguratorProps, layerChannelConfigProps}) {
      return (
        <StyledLayerVisualConfigurator>
          {/* Color */}
          <LayerConfigGroup label={'layer.color'} collapsible>
            <LayerColorRangeSelector {...visConfiguratorProps} />
            <ConfigGroupCollapsibleContent>
              <VisConfigSlider {...layer.visConfigSettings.opacity} {...visConfiguratorProps} />
            </ConfigGroupCollapsibleContent>
          </LayerConfigGroup>
          {/* Radius */}
          <LayerConfigGroup label={'layer.radius'}>
            <VisConfigSlider
              {...layer.visConfigSettings.radius}
              {...visConfiguratorProps}
              label={false}
            />
          </LayerConfigGroup>
          {/* Weight */}
          <LayerConfigGroup label={'layer.weight'}>
            <ChannelByValueSelector
              channel={layer.visualChannels.weight}
              {...layerChannelConfigProps}
            />
          </LayerConfigGroup>
        </StyledLayerVisualConfigurator>
      );
    }

    _renderGridLayerConfig(props) {
      return this._renderAggregationLayerConfig(props);
    }

    _renderHexagonLayerConfig(props) {
      return this._renderAggregationLayerConfig(props);
    }

    _renderAggregationLayerConfig({
      layer,
      visConfiguratorProps,
      layerConfiguratorProps,
      layerChannelConfigProps
    }) {
      const {config} = layer;
      const {
        visConfig: {enable3d}
      } = config;
      const elevationByDescription = 'layer.elevationByDescription';
      const colorByDescription = 'layer.colorByDescription';

      return (
        <StyledLayerVisualConfigurator>
          {/* Color */}
          <LayerConfigGroup label={'layer.color'} collapsible>
            <ChannelByValueSelector
              channel={layer.visualChannels.color}
              {...layerChannelConfigProps}
            />

            <LayerColorRangeSelector {...visConfiguratorProps} />

            <ConfigGroupCollapsibleContent>
              <AggrScaleSelector {...layerConfiguratorProps} channel={layer.visualChannels.color} />

              {layer.visConfigSettings.colorAggregation.condition(layer.config) ? (
                <AggregationTypeSelector
                  {...layer.visConfigSettings.colorAggregation}
                  {...layerChannelConfigProps}
                  description={colorByDescription}
                  channel={layer.visualChannels.color}
                />
              ) : null}
              {layer.visConfigSettings.percentile &&
              layer.visConfigSettings.percentile.condition(layer.config) ? (
                <VisConfigSlider
                  {...layer.visConfigSettings.percentile}
                  {...visConfiguratorProps}
                />
              ) : null}
              <VisConfigSlider {...layer.visConfigSettings.opacity} {...visConfiguratorProps} />
            </ConfigGroupCollapsibleContent>
          </LayerConfigGroup>

          {/* Cell size */}
          <LayerConfigGroup label={'layer.radius'} collapsible>
            <VisConfigSlider {...layer.visConfigSettings.worldUnitSize} {...visConfiguratorProps} />
            <ConfigGroupCollapsibleContent>
              <VisConfigSlider {...layer.visConfigSettings.coverage} {...visConfiguratorProps} />
            </ConfigGroupCollapsibleContent>
          </LayerConfigGroup>

          {/* Elevation */}
          {layer.visConfigSettings.enable3d ? (
            <LayerConfigGroup
              {...layer.visConfigSettings.enable3d}
              {...visConfiguratorProps}
              collapsible
            >
              <VisConfigSlider
                {...layer.visConfigSettings.elevationScale}
                {...visConfiguratorProps}
                label="layerVisConfigs.heightMultiplier"
              />
              <ConfigGroupCollapsibleContent>
                <ChannelByValueSelector
                  {...layerChannelConfigProps}
                  channel={layer.visualChannels.size}
                  description={elevationByDescription}
                  disabled={!enable3d}
                />
                <AggrScaleSelector
                  {...layerConfiguratorProps}
                  channel={layer.visualChannels.size}
                />
                <VisConfigSlider
                  {...layer.visConfigSettings.sizeRange}
                  {...visConfiguratorProps}
                  label="layerVisConfigs.heightRange"
                />
                <VisConfigSwitch
                  {...layer.visConfigSettings.enableElevationZoomFactor}
                  {...visConfiguratorProps}
                  label="layerVisConfigs.enableHeightZoomFactor"
                />
                {layer.visConfigSettings.sizeAggregation.condition(layer.config) ? (
                  <AggregationTypeSelector
                    {...layer.visConfigSettings.sizeAggregation}
                    {...layerChannelConfigProps}
                    channel={layer.visualChannels.size}
                  />
                ) : null}
                {layer.visConfigSettings.elevationPercentile.condition(layer.config) ? (
                  <VisConfigSlider
                    {...layer.visConfigSettings.elevationPercentile}
                    {...visConfiguratorProps}
                  />
                ) : null}
              </ConfigGroupCollapsibleContent>
            </LayerConfigGroup>
          ) : null}
        </StyledLayerVisualConfigurator>
      );
    }

    // TODO: Shan move these into layer class
    _renderHexagonIdLayerConfig({
      layer,
      visConfiguratorProps,
      layerConfiguratorProps,
      layerChannelConfigProps
    }) {
      return (
        <StyledLayerVisualConfigurator>
          {/* Fill */}
          <LayerConfigGroup
            {...layer.visConfigSettings.filled}
            {...visConfiguratorProps}
            label={'layer.fillColor'}
            collapsible
          >
            <ChannelByValueSelector
              channel={layer.visualChannels.color}
              {...layerChannelConfigProps}
            />
            {layer.config.colorField ? (
              <LayerColorRangeSelector {...visConfiguratorProps} />
            ) : (
              <LayerColorSelector {...layerConfiguratorProps} />
            )}
            <ConfigGroupCollapsibleContent>
              <VisConfigSlider
                {...layer.visConfigSettings.opacity}
                {...visConfiguratorProps}
                disabled={!layer.config.visConfig.filled}
              />
            </ConfigGroupCollapsibleContent>
          </LayerConfigGroup>

          {/* Outline */}
          <LayerConfigGroup
            {...layer.visConfigSettings.outline}
            {...visConfiguratorProps}
            collapsible
          >
            <ChannelByValueSelector
              channel={layer.visualChannels.strokeColor}
              {...layerChannelConfigProps}
            />
            {layer.config.strokeColorField ? (
              <LayerColorRangeSelector {...visConfiguratorProps} property="strokeColorRange" />
            ) : (
              <LayerColorSelector
                {...visConfiguratorProps}
                selectedColor={layer.config.visConfig.strokeColor}
                property="strokeColor"
              />
            )}
            <ConfigGroupCollapsibleContent>
              <VisConfigSlider
                {...layer.visConfigSettings.strokeOpacity}
                {...visConfiguratorProps}
                disabled={!layer.config.visConfig.outline}
              />
              <VisConfigSlider
                {...layer.visConfigSettings.thickness}
                {...visConfiguratorProps}
                disabled={!layer.config.visConfig.outline}
              />
            </ConfigGroupCollapsibleContent>
          </LayerConfigGroup>

          {/* Coverage */}
          <LayerConfigGroup label={'layer.coverage'} collapsible>
            {!layer.config.coverageField ? (
              <VisConfigSlider
                {...layer.visConfigSettings.coverage}
                {...visConfiguratorProps}
                label={false}
              />
            ) : (
              <VisConfigSlider
                {...layer.visConfigSettings.coverageRange}
                {...visConfiguratorProps}
                label={false}
              />
            )}
            <ConfigGroupCollapsibleContent>
              <ChannelByValueSelector
                channel={layer.visualChannels.coverage}
                {...layerChannelConfigProps}
              />
            </ConfigGroupCollapsibleContent>
          </LayerConfigGroup>

          {/* height */}
          <LayerConfigGroup
            {...layer.visConfigSettings.enable3d}
            {...visConfiguratorProps}
            collapsible
          >
            <ChannelByValueSelector
              channel={layer.visualChannels.size}
              {...layerChannelConfigProps}
            />
            <ConfigGroupCollapsibleContent>
              <VisConfigSlider
                {...layer.visConfigSettings.elevationScale}
                {...visConfiguratorProps}
              />
              <VisConfigSlider
                {...layer.visConfigSettings.sizeRange}
                {...visConfiguratorProps}
                label="layerVisConfigs.heightRange"
              />
              <VisConfigSwitch
                {...layer.visConfigSettings.enableElevationZoomFactor}
                {...visConfiguratorProps}
              />
            </ConfigGroupCollapsibleContent>
          </LayerConfigGroup>

          {/* text label */}
          <TextLabelPanel
            id={layer.id}
            fields={visConfiguratorProps.fields}
            updateLayerTextLabel={this.props.updateLayerTextLabel}
            textLabel={layer.config.textLabel}
          />
        </StyledLayerVisualConfigurator>
      );
    }

    _renderArcLayerConfig(args) {
      return this._renderLineLayerConfig(args);
    }

    _renderLineLayerConfig({
      layer,
      visConfiguratorProps,
      layerConfiguratorProps,
      layerChannelConfigProps
    }) {
      return (
        <StyledLayerVisualConfigurator>
          {/* Color */}
          <LayerConfigGroup label={'layer.color'} collapsible>
            <ChannelByValueSelector
              channel={layer.visualChannels.sourceColor}
              {...layerChannelConfigProps}
            />
            {layer.config.colorField ? (
              <LayerColorRangeSelector {...visConfiguratorProps} />
            ) : (
              <ArcLayerColorSelector
                layer={layer}
                setColorUI={layerConfiguratorProps.setColorUI}
                onChangeConfig={layerConfiguratorProps.onChange}
                onChangeVisConfig={visConfiguratorProps.onChange}
              />
            )}
            <ConfigGroupCollapsibleContent>
              <VisConfigSlider {...layer.visConfigSettings.opacity} {...visConfiguratorProps} />
            </ConfigGroupCollapsibleContent>
          </LayerConfigGroup>

          {/* thickness */}
          <LayerConfigGroup label={'layer.stroke'} collapsible>
            {layer.config.sizeField ? (
              <VisConfigSlider
                {...layer.visConfigSettings.sizeRange}
                {...visConfiguratorProps}
                disabled={!layer.config.sizeField}
                label={false}
              />
            ) : (
              <VisConfigSlider
                {...layer.visConfigSettings.thickness}
                {...visConfiguratorProps}
                label={false}
              />
            )}
            <ConfigGroupCollapsibleContent>
              <ChannelByValueSelector
                channel={layer.visualChannels.size}
                {...layerChannelConfigProps}
              />
            </ConfigGroupCollapsibleContent>
          </LayerConfigGroup>

          {/* elevation scale */}
          {layer.visConfigSettings.elevationScale ? (
            <LayerConfigGroup label="layerVisConfigs.elevationScale" collapsible>
              <VisConfigSlider
                {...layer.visConfigSettings.elevationScale}
                {...visConfiguratorProps}
              />
            </LayerConfigGroup>
          ) : null}
        </StyledLayerVisualConfigurator>
      );
    }

    _renderTripLayerConfig({
      layer,
      visConfiguratorProps,
      layerConfiguratorProps,
      layerChannelConfigProps
    }) {
      const {
        meta: {featureTypes = {}}
      } = layer;

      return (
        <StyledLayerVisualConfigurator>
          {/* Color */}
          <LayerConfigGroup label={'layer.color'} collapsible>
            <ChannelByValueSelector
              channel={layer.visualChannels.color}
              {...layerChannelConfigProps}
            />
            {layer.config.colorField ? (
              <LayerColorRangeSelector {...visConfiguratorProps} />
            ) : (
              <LayerColorSelector {...layerConfiguratorProps} />
            )}
            <ConfigGroupCollapsibleContent>
              <VisConfigSlider {...layer.visConfigSettings.opacity} {...visConfiguratorProps} />
            </ConfigGroupCollapsibleContent>
          </LayerConfigGroup>

          {/* Stroke Width */}
          <LayerConfigGroup {...visConfiguratorProps} label="layer.strokeWidth" collapsible>
            {layer.config.sizeField ? (
              <VisConfigSlider
                {...layer.visConfigSettings.sizeRange}
                {...visConfiguratorProps}
                label={false}
              />
            ) : (
              <VisConfigSlider
                {...layer.visConfigSettings.thickness}
                {...visConfiguratorProps}
                label={false}
              />
            )}

            <ConfigGroupCollapsibleContent>
              <VisConfigSwitch {...layer.visConfigSettings.billboard} {...visConfiguratorProps} />
              <ChannelByValueSelector
                channel={layer.visualChannels.size}
                {...layerChannelConfigProps}
              />
            </ConfigGroupCollapsibleContent>
          </LayerConfigGroup>

          {/* Trail Length*/}
          <LayerConfigGroup
            {...visConfiguratorProps}
            {...(featureTypes.polygon ? layer.visConfigSettings.stroked : {})}
            label="layer.trailLength"
            description="layer.trailLengthDescription"
            collapsible
          >
            <VisConfigSlider
              {...layer.visConfigSettings.trailLength}
              {...visConfiguratorProps}
              label={false}
            />
            <ConfigGroupCollapsibleContent>
              <VisConfigSwitch {...layer.visConfigSettings.fadeTrail} {...visConfiguratorProps} />
            </ConfigGroupCollapsibleContent>
          </LayerConfigGroup>
        </StyledLayerVisualConfigurator>
      );
    }

    _renderGeojsonLayerConfig({
      layer,
      visConfiguratorProps,
      layerConfiguratorProps,
      layerChannelConfigProps
    }) {
      const {
        meta: {featureTypes = {}},
        config: {visConfig}
      } = layer;

      return (
        <StyledLayerVisualConfigurator>
          {/* Fill Color */}
          {featureTypes.polygon || featureTypes.point ? (
            <LayerConfigGroup
              {...layer.visConfigSettings.filled}
              {...visConfiguratorProps}
              label="layer.fillColor"
              collapsible
            >
              <ChannelByValueSelector
                channel={layer.visualChannels.color}
                {...layerChannelConfigProps}
              />
              {layer.config.colorField ? (
                <LayerColorRangeSelector {...visConfiguratorProps} />
              ) : (
                <LayerColorSelector {...layerConfiguratorProps} />
              )}
              <ConfigGroupCollapsibleContent>
                <VisConfigSlider {...layer.visConfigSettings.opacity} {...visConfiguratorProps} />
              </ConfigGroupCollapsibleContent>
            </LayerConfigGroup>
          ) : null}

          {/* stroke color */}
          <LayerConfigGroup
            {...layer.visConfigSettings.stroked}
            {...visConfiguratorProps}
            label="layer.strokeColor"
            collapsible
          >
            <ChannelByValueSelector
              channel={layer.visualChannels.strokeColor}
              {...layerChannelConfigProps}
            />
            {layer.config.strokeColorField ? (
              <LayerColorRangeSelector {...visConfiguratorProps} property="strokeColorRange" />
            ) : (
              <LayerColorSelector
                {...visConfiguratorProps}
                selectedColor={layer.config.visConfig.strokeColor}
                property="strokeColor"
              />
            )}
            <ConfigGroupCollapsibleContent>
              <VisConfigSlider
                {...layer.visConfigSettings.strokeOpacity}
                {...visConfiguratorProps}
              />
            </ConfigGroupCollapsibleContent>
          </LayerConfigGroup>

          {/* Stroke Width */}
          <LayerConfigGroup
            {...visConfiguratorProps}
            {...(featureTypes.polygon ? layer.visConfigSettings.stroked : {})}
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
                {...layer.visConfigSettings.thickness}
                {...visConfiguratorProps}
                label={false}
              />
            )}
            <ConfigGroupCollapsibleContent>
              <ChannelByValueSelector
                channel={layer.visualChannels.size}
                {...layerChannelConfigProps}
              />
            </ConfigGroupCollapsibleContent>
          </LayerConfigGroup>

          {/* Elevation */}
          {featureTypes.polygon ? (
            <LayerConfigGroup
              {...visConfiguratorProps}
              {...layer.visConfigSettings.enable3d}
              disabled={!visConfig.filled}
              collapsible
            >
              <VisConfigSlider
                {...layer.visConfigSettings.elevationScale}
                {...visConfiguratorProps}
                label={false}
              />
              <ConfigGroupCollapsibleContent>
                <ChannelByValueSelector
                  channel={layer.visualChannels.height}
                  {...layerChannelConfigProps}
                />
                <VisConfigSwitch
                  {...layer.visConfigSettings.fixedHeight}
                  {...visConfiguratorProps}
                />
                <VisConfigSwitch {...visConfiguratorProps} {...layer.visConfigSettings.wireframe} />
              </ConfigGroupCollapsibleContent>
            </LayerConfigGroup>
          ) : null}

          {/* Radius */}
          {featureTypes.point ? (
            <LayerConfigGroup label={'layer.radius'} collapsible>
              {!layer.config.radiusField ? (
                <VisConfigSlider
                  {...layer.visConfigSettings.radius}
                  {...visConfiguratorProps}
                  label={false}
                  disabled={Boolean(layer.config.radiusField)}
                />
              ) : (
                <VisConfigSlider
                  {...layer.visConfigSettings.radiusRange}
                  {...visConfiguratorProps}
                  label={false}
                  disabled={!layer.config.radiusField}
                />
              )}
              <ConfigGroupCollapsibleContent>
                <ChannelByValueSelector
                  channel={layer.visualChannels.radius}
                  {...layerChannelConfigProps}
                />
              </ConfigGroupCollapsibleContent>
            </LayerConfigGroup>
          ) : null}
        </StyledLayerVisualConfigurator>
      );
    }

    _render3DLayerConfig({layer, visConfiguratorProps}) {
      return (
        <Fragment>
          <LayerConfigGroup label={'layer.3DModel'} collapsible>
            <Input
              type="file"
              accept=".glb,.gltf"
              onChange={e => {
                if (e.target.files && e.target.files[0]) {
                  const url = URL.createObjectURL(e.target.files[0]);
                  visConfiguratorProps.onChange({scenegraph: url});
                }
              }}
            />
          </LayerConfigGroup>
          <LayerConfigGroup label={'layer.3DModelOptions'} collapsible>
            <VisConfigSlider
              {...layer.visConfigSettings.sizeScale}
              {...visConfiguratorProps}
              disabled={false}
            />
            <VisConfigSlider
              {...layer.visConfigSettings.angleX}
              {...visConfiguratorProps}
              disabled={false}
            />
            <VisConfigSlider
              {...layer.visConfigSettings.angleY}
              {...visConfiguratorProps}
              disabled={false}
            />
            <VisConfigSlider
              {...layer.visConfigSettings.angleZ}
              {...visConfiguratorProps}
              disabled={false}
            />
          </LayerConfigGroup>
        </Fragment>
      );
    }

    _renderS2LayerConfig({
      layer,
      visConfiguratorProps,
      layerConfiguratorProps,
      layerChannelConfigProps
    }) {
      const {
        config: {visConfig}
      } = layer;

      return (
        <StyledLayerVisualConfigurator>
          {/* Color */}
          <LayerConfigGroup
            {...layer.visConfigSettings.filled}
            {...visConfiguratorProps}
            label="layer.fillColor"
            collapsible
          >
            <ChannelByValueSelector
              channel={layer.visualChannels.color}
              {...layerChannelConfigProps}
            />
            {layer.config.colorField ? (
              <LayerColorRangeSelector {...visConfiguratorProps} />
            ) : (
              <LayerColorSelector {...layerConfiguratorProps} />
            )}
            <ConfigGroupCollapsibleContent>
              <VisConfigSlider {...layer.visConfigSettings.opacity} {...visConfiguratorProps} />
            </ConfigGroupCollapsibleContent>
          </LayerConfigGroup>

          {/* Stroke */}
          <LayerConfigGroup
            {...layer.visConfigSettings.stroked}
            {...visConfiguratorProps}
            label="layer.strokeColor"
            collapsible
          >
            {layer.config.strokeColorField ? (
              <LayerColorRangeSelector {...visConfiguratorProps} property="strokeColorRange" />
            ) : (
              <LayerColorSelector
                {...visConfiguratorProps}
                selectedColor={layer.config.visConfig.strokeColor}
                property="strokeColor"
              />
            )}
            <ChannelByValueSelector
              channel={layer.visualChannels.strokeColor}
              {...layerChannelConfigProps}
            />
          </LayerConfigGroup>

          {/* Stroke Width */}
          <LayerConfigGroup {...visConfiguratorProps} label="layer.strokeWidth" collapsible>
            {layer.config.sizeField ? (
              <VisConfigSlider
                {...layer.visConfigSettings.sizeRange}
                {...visConfiguratorProps}
                label={false}
              />
            ) : (
              <VisConfigSlider
                {...layer.visConfigSettings.thickness}
                {...visConfiguratorProps}
                label={false}
              />
            )}
            <ConfigGroupCollapsibleContent>
              <ChannelByValueSelector
                channel={layer.visualChannels.size}
                {...layerChannelConfigProps}
              />
            </ConfigGroupCollapsibleContent>
          </LayerConfigGroup>

          {/* Elevation */}
          <LayerConfigGroup
            {...visConfiguratorProps}
            {...layer.visConfigSettings.enable3d}
            disabled={!visConfig.filled}
            collapsible
          >
            <ChannelByValueSelector
              channel={layer.visualChannels.height}
              {...layerChannelConfigProps}
            />
            <VisConfigSlider
              {...layer.visConfigSettings.elevationScale}
              {...visConfiguratorProps}
              label="layerVisConfigs.elevationScale"
            />
            <ConfigGroupCollapsibleContent>
              <VisConfigSlider
                {...layer.visConfigSettings.heightRange}
                {...visConfiguratorProps}
                label="layerVisConfigs.heightRange"
              />
              <VisConfigSwitch
                {...layer.visConfigSettings.enableElevationZoomFactor}
                {...visConfiguratorProps}
              />
              <VisConfigSwitch {...visConfiguratorProps} {...layer.visConfigSettings.wireframe} />
            </ConfigGroupCollapsibleContent>
          </LayerConfigGroup>
        </StyledLayerVisualConfigurator>
      );
    }

    handleSelectColumnMode = (key: string) => {
      const {updateLayerConfig} = this.props;
      updateLayerConfig({columnMode: key});
    };

    render() {
      const {
        layer,
        datasets,
        openModal,
        updateLayerConfig,
        layerTypeOptions,
        updateLayerType,
        disableTypeSelect = false
      } = this.props;
      const {fields = [], fieldPairs = undefined} = layer.config.dataId
        ? datasets[layer.config.dataId]
        : {};
      const {config} = layer;

      const visConfiguratorProps = getVisConfiguratorProps(this.props);
      const layerConfiguratorProps = getLayerConfiguratorProps(this.props);
      const layerChannelConfigProps = getLayerChannelConfigProps(this.props);
      const dataset = getLayerDataset(datasets, layer);
      const renderTemplate = layer.type && `_render${capitalizeFirstLetter(layer.type)}LayerConfig`;

      return (
        <StyledLayerConfigurator>
          {layer.layerInfoModal && !layer.supportedColumnModes ? (
            // @ts-expect-error wrong handler type?
            <HowToButton onClick={() => openModal(layer.layerInfoModal)} />
          ) : null}
          <LayerConfigGroup label={'layer.basic'} collapsible expanded={!layer.hasAllColumns()}>
            <LayerTypeSelector
              selected={layer.type}
              disabled={disableTypeSelect}
              options={layerTypeOptions}
              // @ts-ignore
              onSelect={updateLayerType}
            />
            <ConfigGroupCollapsibleContent>
              <SourceDataSelector
                datasets={datasets}
                id={layer.id}
                dataId={config.dataId}
                // @ts-ignore
                onSelect={(value: string) => updateLayerConfig({dataId: value})}
              />
              <LayerColumnModeConfig
                layer={layer}
                supportedColumnModes={layer.supportedColumnModes}
                id={layer.id}
                layerConfig={layer.config}
                // @ts-expect-error wrong handler type?
                openModal={openModal}
                updateLayerConfig={updateLayerConfig}
                updateLayerType={updateLayerType}
                fields={fields}
                fieldPairs={fieldPairs}
              />
            </ConfigGroupCollapsibleContent>
            {layer.errorMessage ? <LayerErrorMessage errorMessage={layer.errorMessage} /> : null}
          </LayerConfigGroup>
          {renderTemplate &&
            this[renderTemplate] &&
            this[renderTemplate]({
              layer,
              dataset,
              visConfiguratorProps,
              layerChannelConfigProps,
              layerConfiguratorProps
            })}
        </StyledLayerConfigurator>
      );
    }
  }

  return LayerConfigurator;
}

export const AggregationTypeSelector = ({channel, layer, onChange}: AggregationSelectorProps) => {
  const {field, aggregation, key} = channel;
  const selectedField = layer.config[field];
  const {visConfig} = layer.config;

  // aggregation should only be selectable when field is selected
  const layerAggregationTypes = layer.getAggregationOptions(key);

  const aggregationOptions = AGGREGATION_TYPE_OPTIONS.filter(({id}) =>
    layerAggregationTypes.includes(id)
  );

  const selectedAggregation = aggregation
    ? aggregationOptions.find(({id}) => id === visConfig[aggregation])
    : [];

  return (
    <SidePanelSection>
      <PanelLabel>
        <FormattedMessage
          id={'layer.aggregateBy'}
          values={{
            field: selectedField.displayName
          }}
        />
      </PanelLabel>
      <ItemSelector
        selectedItems={selectedAggregation}
        options={aggregationOptions}
        displayOption="label"
        getOptionValue="id"
        multiSelect={false}
        searchable={false}
        onChange={value =>
          onChange(
            {
              visConfig: {
                ...layer.config.visConfig,
                [aggregation as string]: value
              }
            },
            channel.key
          )
        }
      />
    </SidePanelSection>
  );
};
/* eslint-enable max-params */
