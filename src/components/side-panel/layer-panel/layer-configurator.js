// Copyright (c) 2020 Uber Technologies, Inc.
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
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {Button, PanelLabel, SidePanelSection, Input} from 'components/common/styled-components';
import ItemSelector from 'components/common/item-selector/item-selector';

import VisConfigByFieldSelector from './vis-config-by-field-selector';
import LayerColumnConfig from './layer-column-config';
import LayerTypeSelector from './layer-type-selector';
import DimensionScaleSelector from './dimension-scale-selector';
import ColorSelector from './color-selector';
import SourceDataSelectorFactory from 'components/side-panel/common/source-data-selector';
import VisConfigSwitch from './vis-config-switch';
import VisConfigSlider from './vis-config-slider';
import LayerConfigGroup, {ConfigGroupCollapsibleContent} from './layer-config-group';
import TextLabelPanel from './text-label-panel';

import {capitalizeFirstLetter} from 'utils/utils';

import {LAYER_TYPES, CHANNEL_SCALE_SUPPORTED_FIELDS} from 'constants/default-settings';

const StyledLayerConfigurator = styled.div.attrs({
  className: 'layer-panel__config'
})`
  position: relative;
  margin-top: 12px;
`;

const StyledLayerVisualConfigurator = styled.div.attrs({
  className: 'layer-panel__config__visualC-config'
})`
  margin-top: 12px;
`;

export const getLayerFields = (datasets, layer) =>
  datasets[layer.config.dataId] ? datasets[layer.config.dataId].fields : [];

export const getLayerConfiguratorProps = props => ({
  layer: props.layer,
  fields: getLayerFields(props.datasets, props.layer),
  onChange: props.updateLayerConfig,
  setColorUI: props.updateLayerColorUI
});

export const getVisConfiguratorProps = props => ({
  layer: props.layer,
  fields: getLayerFields(props.datasets, props.layer),
  onChange: props.updateLayerVisConfig,
  setColorUI: props.updateLayerColorUI
});

export const getLayerChannelConfigProps = props => ({
  layer: props.layer,
  fields: getLayerFields(props.datasets, props.layer),
  onChange: props.updateLayerVisualChannelConfig
});

LayerConfiguratorFactory.deps = [SourceDataSelectorFactory];

export default function LayerConfiguratorFactory(SourceDataSelector) {
  class LayerConfigurator extends Component {
    static propTypes = {
      layer: PropTypes.object.isRequired,
      datasets: PropTypes.object.isRequired,
      layerTypeOptions: PropTypes.arrayOf(PropTypes.any).isRequired,
      openModal: PropTypes.func.isRequired,
      updateLayerConfig: PropTypes.func.isRequired,
      updateLayerType: PropTypes.func.isRequired,
      updateLayerVisConfig: PropTypes.func.isRequired,
      updateLayerVisualChannelConfig: PropTypes.func.isRequired,
      updateLayerColorUI: PropTypes.func.isRequired
    };

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
            {...layer.visConfigSettings.filled}
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
                  label={false}
                  disabled={!layer.config.visConfig.outline}
                />
              </ConfigGroupCollapsibleContent>
            </LayerConfigGroup>
          ) : null}

          {/* Radius */}
          <LayerConfigGroup label={'radius'} collapsible>
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
            fields={visConfiguratorProps.fields}
            updateLayerTextLabel={this.props.updateLayerTextLabel}
            textLabel={layer.config.textLabel}
            colorPalette={visConfiguratorProps.colorPalette}
            setColorPaletteUI={visConfiguratorProps.setColorPaletteUI}
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
          <LayerConfigGroup label={'color'} collapsible>
            <LayerColorRangeSelector {...visConfiguratorProps} />
            <ConfigGroupCollapsibleContent>
              <AggrScaleSelector {...layerConfiguratorProps} channel={layer.visualChannels.color} />
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
          <LayerConfigGroup label={'radius'} collapsible>
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
          <LayerConfigGroup label={'color'} collapsible>
            <LayerColorRangeSelector {...visConfiguratorProps} />
            <ConfigGroupCollapsibleContent>
              <VisConfigSlider {...layer.visConfigSettings.opacity} {...visConfiguratorProps} />
            </ConfigGroupCollapsibleContent>
          </LayerConfigGroup>
          {/* Radius */}
          <LayerConfigGroup label={'radius'}>
            <VisConfigSlider
              {...layer.visConfigSettings.radius}
              {...visConfiguratorProps}
              label={false}
            />
          </LayerConfigGroup>
          {/* Weight */}
          <LayerConfigGroup label={'weight'}>
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
      const elevationByDescription = 'When off, height is based on count of points';
      const colorByDescription = 'When off, color is based on count of points';

      return (
        <StyledLayerVisualConfigurator>
          {/* Color */}
          <LayerConfigGroup label={'color'} collapsible>
            <LayerColorRangeSelector {...visConfiguratorProps} />
            <ConfigGroupCollapsibleContent>
              <AggrScaleSelector {...layerConfiguratorProps} channel={layer.visualChannels.color} />
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
          <LayerConfigGroup label={'radius'} collapsible>
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
              />
              <ConfigGroupCollapsibleContent>
                <AggrScaleSelector
                  {...layerConfiguratorProps}
                  channel={layer.visualChannels.size}
                />
                <VisConfigSlider {...layer.visConfigSettings.sizeRange} {...visConfiguratorProps} />
                <ChannelByValueSelector
                  {...layerChannelConfigProps}
                  channel={layer.visualChannels.size}
                  description={elevationByDescription}
                  disabled={!enable3d}
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
          {/* Color */}
          <LayerConfigGroup label={'color'} collapsible>
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

          {/* Coverage */}
          <LayerConfigGroup label={'coverage'} collapsible>
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
                label="Height Range"
              />
            </ConfigGroupCollapsibleContent>
          </LayerConfigGroup>
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
          <LayerConfigGroup label={'color'} collapsible>
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
                channel={layer.visualChannels.color}
                {...layerChannelConfigProps}
              />
              <VisConfigSlider {...layer.visConfigSettings.opacity} {...visConfiguratorProps} />
            </ConfigGroupCollapsibleContent>
          </LayerConfigGroup>

          {/* thickness */}
          <LayerConfigGroup label={'stroke'} collapsible>
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
          <LayerConfigGroup label={'color'} collapsible>
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
          <LayerConfigGroup {...visConfiguratorProps} label="Stroke Width" collapsible>
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
            label="Trail Length"
            description="Number of seconds for a path to completely fade out"
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
              label="Fill Color"
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
            label="Stroke Color"
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
            label="Stroke Width"
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
                <VisConfigSwitch {...visConfiguratorProps} {...layer.visConfigSettings.wireframe} />
              </ConfigGroupCollapsibleContent>
            </LayerConfigGroup>
          ) : null}

          {/* Radius */}
          {featureTypes.point ? (
            <LayerConfigGroup label={'radius'} collapsible>
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
          <LayerConfigGroup label={'3D Model'} collapsible>
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
          <LayerConfigGroup label={'3D Model Options'} collapsible>
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
            label="Fill Color"
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
            label="Stroke Color"
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
          <LayerConfigGroup {...visConfiguratorProps} label="Stroke Width" collapsible>
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
              label="Elevation Scale"
            />
            <ConfigGroupCollapsibleContent>
              <VisConfigSlider
                {...layer.visConfigSettings.heightRange}
                {...visConfiguratorProps}
                label="Height Range"
              />
              <VisConfigSwitch {...visConfiguratorProps} {...layer.visConfigSettings.wireframe} />
            </ConfigGroupCollapsibleContent>
          </LayerConfigGroup>
        </StyledLayerVisualConfigurator>
      );
    }

    render() {
      const {layer, datasets, updateLayerConfig, layerTypeOptions, updateLayerType} = this.props;
      const {fields = [], fieldPairs} = layer.config.dataId ? datasets[layer.config.dataId] : {};
      const {config} = layer;

      const visConfiguratorProps = getVisConfiguratorProps(this.props);
      const layerConfiguratorProps = getLayerConfiguratorProps(this.props);
      const layerChannelConfigProps = getLayerChannelConfigProps(this.props);

      const renderTemplate = layer.type && `_render${capitalizeFirstLetter(layer.type)}LayerConfig`;

      return (
        <StyledLayerConfigurator>
          {layer.layerInfoModal ? (
            <HowToButton onClick={() => this.props.openModal(layer.layerInfoModal)} />
          ) : null}
          <LayerConfigGroup label={'basic'} collapsible expanded={!layer.hasAllColumns()}>
            <LayerTypeSelector
              layer={layer}
              layerTypeOptions={layerTypeOptions}
              onSelect={updateLayerType}
            />
            <ConfigGroupCollapsibleContent>
              {Object.keys(datasets).length > 1 && (
                <SourceDataSelector
                  datasets={datasets}
                  id={layer.id}
                  disabled={layer.type && config.columns}
                  dataId={config.dataId}
                  onSelect={value => updateLayerConfig({dataId: value})}
                />
              )}
              <LayerColumnConfig
                columnPairs={layer.columnPairs}
                columns={layer.config.columns}
                assignColumnPairs={layer.assignColumnPairs.bind(layer)}
                assignColumn={layer.assignColumn.bind(layer)}
                columnLabels={layer.columnLabels}
                fields={fields}
                fieldPairs={fieldPairs}
                updateLayerConfig={updateLayerConfig}
                updateLayerType={this.props.updateLayerType}
              />
            </ConfigGroupCollapsibleContent>
          </LayerConfigGroup>
          {this[renderTemplate] &&
            this[renderTemplate]({
              layer,
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
/*
 * Componentize config component into pure functional components
 */

const StyledHowToButton = styled.div`
  position: absolute;
  right: 12px;
  top: -4px;
`;

export const HowToButton = ({onClick}) => (
  <StyledHowToButton>
    <Button link small onClick={onClick}>
      How to
    </Button>
  </StyledHowToButton>
);

export const LayerColorSelector = ({
  layer,
  onChange,
  label,
  selectedColor,
  property = 'color',
  setColorUI
}) => (
  <SidePanelSection>
    <ColorSelector
      colorSets={[
        {
          selectedColor: selectedColor || layer.config.color,
          setColor: rgbValue => onChange({[property]: rgbValue})
        }
      ]}
      colorUI={layer.config.colorUI[property]}
      setColorUI={newConfig => setColorUI(property, newConfig)}
    />
  </SidePanelSection>
);

export const ArcLayerColorSelector = ({
  layer,
  onChangeConfig,
  onChangeVisConfig,
  property = 'color',
  setColorUI
}) => (
  <SidePanelSection>
    <ColorSelector
      colorSets={[
        {
          selectedColor: layer.config.color,
          setColor: rgbValue => onChangeConfig({color: rgbValue}),
          label: 'Source'
        },
        {
          selectedColor: layer.config.visConfig.targetColor || layer.config.color,
          setColor: rgbValue => onChangeVisConfig({targetColor: rgbValue}),
          label: 'Target'
        }
      ]}
      colorUI={layer.config.colorUI[property]}
      setColorUI={newConfig => setColorUI(property, newConfig)}
    />
  </SidePanelSection>
);

export const LayerColorRangeSelector = ({layer, onChange, property = 'colorRange', setColorUI}) => (
  <SidePanelSection>
    <ColorSelector
      colorSets={[
        {
          selectedColor: layer.config.visConfig[property],
          isRange: true,
          setColor: colorRange => onChange({[property]: colorRange})
        }
      ]}
      colorUI={layer.config.colorUI[property]}
      setColorUI={newConfig => setColorUI(property, newConfig)}
    />
  </SidePanelSection>
);

export const ChannelByValueSelector = ({layer, channel, onChange, fields, description}) => {
  const {
    channelScaleType,
    domain,
    field,
    key,
    property,
    range,
    scale,
    defaultMeasure,
    supportedFieldTypes
  } = channel;
  const channelSupportedFieldTypes =
    supportedFieldTypes || CHANNEL_SCALE_SUPPORTED_FIELDS[channelScaleType];
  const supportedFields = fields.filter(({type}) => channelSupportedFieldTypes.includes(type));
  const scaleOptions = layer.getScaleOptions(channel.key);
  const showScale = !layer.isAggregated && layer.config[scale] && scaleOptions.length > 1;
  const defaultDescription = `Calculate ${property} based on selected field`;

  return (
    <VisConfigByFieldSelector
      channel={channel.key}
      description={description || defaultDescription}
      domain={layer.config[domain]}
      fields={supportedFields}
      id={layer.id}
      key={`${key}-channel-selector`}
      property={property}
      placeholder={defaultMeasure || 'Select a field'}
      range={layer.config.visConfig[range]}
      scaleOptions={scaleOptions}
      scaleType={scale ? layer.config[scale] : null}
      selectedField={layer.config[field]}
      showScale={showScale}
      updateField={val => onChange({[field]: val}, key)}
      updateScale={val => onChange({[scale]: val}, key)}
    />
  );
};

export const AggrScaleSelector = ({channel, layer, onChange}) => {
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

export const AggregationTypeSelector = ({layer, channel, onChange}) => {
  const {field, aggregation, key} = channel;
  const selectedField = layer.config[field];
  const {visConfig} = layer.config;

  // aggregation should only be selectable when field is selected
  const aggregationOptions = layer.getAggregationOptions(key);

  return (
    <SidePanelSection>
      <PanelLabel>{`Aggregate ${selectedField.name} by`}</PanelLabel>
      <ItemSelector
        selectedItems={visConfig[aggregation]}
        options={aggregationOptions}
        multiSelect={false}
        searchable={false}
        onChange={value =>
          onChange(
            {
              visConfig: {
                ...layer.config.visConfig,
                [aggregation]: value
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
