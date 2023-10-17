// Copyright (c) 2023 Uber Technologies, Inc.
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

/* eslint-disable complexity */
import React, {Component, Fragment} from 'react';
import styled from 'styled-components';
import {FormattedMessage} from '@kepler.gl/localization';

import {Input, PanelLabel, SidePanelSection} from '../../common/styled-components';
import ItemSelector from '../../common/item-selector/item-selector';

import VisConfigByFieldSelectorFactory from './vis-config-by-field-selector';
import LayerColumnConfigFactory from './layer-column-config';
import LayerTypeSelectorFactory from './layer-type-selector';
import DimensionScaleSelector from './dimension-scale-selector';
import SourceDataSelectorFactory from '../common/source-data-selector';
import VisConfigSwitchFactory from './vis-config-switch';
import VisConfigSliderFactory from './vis-config-slider';
import LayerConfigGroupFactory, {ConfigGroupCollapsibleContent} from './layer-config-group';
import TextLabelPanelFactory from './text-label-panel';
import {
  LayerColorSelectorFactory,
  LayerColorRangeSelectorFactory,
  ArcLayerColorSelectorFactory
} from './layer-color-selector';
import HowToButton from './how-to-button';
import LayerErrorMessage from './layer-error-message';

import {capitalizeFirstLetter} from '@kepler.gl/utils';

import {
  CHANNEL_SCALE_SUPPORTED_FIELDS,
  LAYER_TYPES,
  AGGREGATION_TYPE_OPTIONS
} from '@kepler.gl/constants';
import {Layer, LayerBaseConfig, VisualChannel, AggregationLayer} from '@kepler.gl/layers';

import {NestedPartial, LayerVisConfig, ColorUI, Field} from '@kepler.gl/types';
import {toggleModal, ActionHandler} from '@kepler.gl/actions';
import {Datasets} from '@kepler.gl/table';

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

type ChannelByValueSelectorProps = {
  layer: Layer;
  channel: VisualChannel;
  onChange: (
    val: Record<
      string,
      string | number | boolean | object | readonly (string | number | boolean | object)[] | null
    >,
    key: string
  ) => void;
  fields: Field[];
  description: string;
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
  onChange: props.updateLayerVisualChannelConfig
});

LayerConfiguratorFactory.deps = [
  SourceDataSelectorFactory,
  VisConfigSliderFactory,
  TextLabelPanelFactory,
  LayerConfigGroupFactory,
  ChannelByValueSelectorFactory,
  LayerColumnConfigFactory,
  LayerTypeSelectorFactory,
  VisConfigSwitchFactory,
  LayerColorSelectorFactory,
  LayerColorRangeSelectorFactory,
  ArcLayerColorSelectorFactory
];

export default function LayerConfiguratorFactory(
  SourceDataSelector: ReturnType<typeof SourceDataSelectorFactory>,
  VisConfigSlider: ReturnType<typeof VisConfigSliderFactory>,
  TextLabelPanel: ReturnType<typeof TextLabelPanelFactory>,
  LayerConfigGroup: ReturnType<typeof LayerConfigGroupFactory>,
  ChannelByValueSelector: ReturnType<typeof ChannelByValueSelectorFactory>,
  LayerColumnConfig: ReturnType<typeof LayerColumnConfigFactory>,
  LayerTypeSelector: ReturnType<typeof LayerTypeSelectorFactory>,
  VisConfigSwitch: ReturnType<typeof VisConfigSwitchFactory>,
  LayerColorSelector: ReturnType<typeof LayerColorSelectorFactory>,
  LayerColorRangeSelector: ReturnType<typeof LayerColorRangeSelectorFactory>,
  ArcLayerColorSelector: ReturnType<typeof ArcLayerColorSelectorFactory>
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
            {layer.config.colorField ? (
              <LayerColorRangeSelector {...visConfiguratorProps} />
            ) : (
              <LayerColorSelector {...layerConfiguratorProps} />
            )}
            <ConfigGroupCollapsibleContent>
              <ChannelByValueSelector
                channel={layer.visualChannels.color}
                {...layerChannelConfigProps}
              />
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
                <ChannelByValueSelector
                  channel={layer.visualChannels.strokeColor}
                  {...layerChannelConfigProps}
                />
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
            <ConfigGroupCollapsibleContent>
              <AggregationScaleSelector
                {...layerConfiguratorProps}
                channel={layer.visualChannels.color}
              />
              <ChannelByValueSelector
                channel={layer.visualChannels.color}
                {...layerChannelConfigProps}
              />
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

    _renderHeatmapLayerConfig({
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
            <LayerColorRangeSelector {...visConfiguratorProps} />
            <ConfigGroupCollapsibleContent>
              <AggregationScaleSelector
                {...layerConfiguratorProps}
                channel={layer.visualChannels.color}
              />
              <ChannelByValueSelector
                channel={layer.visualChannels.color}
                {...layerChannelConfigProps}
              />
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
                <AggregationScaleSelector
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
            {layer.config.colorField ? (
              <LayerColorRangeSelector {...visConfiguratorProps} />
            ) : (
              <LayerColorSelector {...layerConfiguratorProps} />
            )}
            <ConfigGroupCollapsibleContent>
              <ChannelByValueSelector
                channel={layer.visualChannels.color}
                {...layerChannelConfigProps}
              />
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
              <ChannelByValueSelector
                channel={layer.visualChannels.sourceColor}
                {...layerChannelConfigProps}
              />
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
            {layer.config.colorField ? (
              <LayerColorRangeSelector {...visConfiguratorProps} />
            ) : (
              <LayerColorSelector {...layerConfiguratorProps} />
            )}
            <ConfigGroupCollapsibleContent>
              <ChannelByValueSelector
                channel={layer.visualChannels.color}
                {...layerChannelConfigProps}
              />
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
          >
            <VisConfigSlider
              {...layer.visConfigSettings.trailLength}
              {...visConfiguratorProps}
              label={false}
            />
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
              {layer.config.colorField ? (
                <LayerColorRangeSelector {...visConfiguratorProps} />
              ) : (
                <LayerColorSelector {...layerConfiguratorProps} />
              )}
              <ConfigGroupCollapsibleContent>
                <ChannelByValueSelector
                  channel={layer.visualChannels.color}
                  {...layerChannelConfigProps}
                />
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
              <ChannelByValueSelector
                channel={layer.visualChannels.strokeColor}
                {...layerChannelConfigProps}
              />
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
                  {...layer.visConfigSettings.enableElevationZoomFactor}
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

    _renderGeoarrowLayerConfig(props) {
      return this._renderGeojsonLayerConfig(props);
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
            {layer.config.colorField ? (
              <LayerColorRangeSelector {...visConfiguratorProps} />
            ) : (
              <LayerColorSelector {...layerConfiguratorProps} />
            )}
            <ConfigGroupCollapsibleContent>
              <ChannelByValueSelector
                channel={layer.visualChannels.color}
                {...layerChannelConfigProps}
              />
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
            <ConfigGroupCollapsibleContent>
              <ChannelByValueSelector
                channel={layer.visualChannels.strokeColor}
                {...layerChannelConfigProps}
              />
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

    render() {
      const {
        layer,
        datasets,
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
          {layer.layerInfoModal ? (
            <HowToButton onClick={() => this.props.openModal(layer.layerInfoModal)} />
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
              <LayerColumnConfig
                columnPairs={layer.columnPairs}
                columns={layer.config.columns}
                assignColumnPairs={layer.assignColumnPairs.bind(layer)}
                assignColumn={layer.assignColumn.bind(layer)}
                // @ts-ignore
                columnLabels={layer.columnLabels}
                fields={fields}
                fieldPairs={fieldPairs}
                updateLayerConfig={updateLayerConfig}
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

ChannelByValueSelectorFactory.deps = [VisConfigByFieldSelectorFactory];

export function ChannelByValueSelectorFactory(
  VisConfigByFieldSelector: ReturnType<typeof VisConfigByFieldSelectorFactory>
) {
  const ChannelByValueSelector = ({
    layer,
    channel,
    onChange,
    fields,
    description
  }: ChannelByValueSelectorProps) => {
    const {
      channelScaleType,
      field,
      key,
      property,
      scale,
      defaultMeasure,
      supportedFieldTypes
    } = channel;
    const channelSupportedFieldTypes =
      supportedFieldTypes || CHANNEL_SCALE_SUPPORTED_FIELDS[channelScaleType];
    const supportedFields = fields.filter(({type}) => channelSupportedFieldTypes.includes(type));
    const scaleOptions = layer.getScaleOptions(channel.key);
    const showScale = !layer.isAggregated && layer.config[scale] && scaleOptions.length > 1;
    const defaultDescription = 'layerConfiguration.defaultDescription';

    return (
      <VisConfigByFieldSelector
        channel={channel.key}
        description={description || defaultDescription}
        fields={supportedFields}
        id={layer.id}
        key={`${key}-channel-selector`}
        property={property}
        placeholder={defaultMeasure || 'placeholder.selectField'}
        scaleOptions={scaleOptions}
        scaleType={scale ? layer.config[scale] : null}
        selectedField={layer.config[field]}
        showScale={showScale}
        updateField={val => onChange({[field]: val}, key)}
        updateScale={val => onChange({[scale]: val}, key)}
      />
    );
  };

  return ChannelByValueSelector;
}

export const AggregationScaleSelector = ({channel, layer, onChange}: AggregationSelectorProps) => {
  const {scale, key} = channel;
  const scaleOptions = layer.getScaleOptions(key);

  return Array.isArray(scaleOptions) && scaleOptions.length > 1 ? (
    <DimensionScaleSelector
      label={`${key} Scale`}
      options={scaleOptions}
      scaleType={layer.config[scale]}
      onSelect={val => onChange({[scale]: val}, key)}
    />
  ) : null;
};

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
