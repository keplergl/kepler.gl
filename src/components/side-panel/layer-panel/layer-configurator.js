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

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  Button,
  PanelLabel,
  SidePanelSection
} from 'components/common/styled-components';
import ItemSelector from 'components/common/item-selector/item-selector';

import VisConfigByFieldSelector from './vis-config-by-field-selector';
import LayerColumnConfig from './layer-column-config';
import LayerTypeSelector from './layer-type-selector';
import DimensionScaleSelector from './dimension-scale-selector';
import ColorSelector from './color-selector';
import SourceDataSelector from '../source-data-selector';
import VisConfigSwitch from './vis-config-switch';
import VisConfigSlider from './vis-config-slider';
import LayerConfigGroup from './layer-config-group';
import TextLabelPanel from './text-label-panel';

import {LAYER_VIS_CONFIGS} from 'layers/layer-factory';

import {capitalizeFirstLetter} from 'utils/utils';

import {
  LAYER_TYPES,
  CHANNEL_SCALE_SUPPORTED_FIELDS
} from 'constants/default-settings';

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

export default class LayerConfigurator extends Component {
  static propTypes = {
    layer: PropTypes.object.isRequired,
    datasets: PropTypes.object.isRequired,
    layerTypeOptions: PropTypes.arrayOf(PropTypes.any).isRequired,
    openModal: PropTypes.func.isRequired,
    updateLayerConfig: PropTypes.func.isRequired,
    updateLayerType: PropTypes.func.isRequired,
    updateLayerVisConfig: PropTypes.func.isRequired,
    updateLayerVisualChannelConfig: PropTypes.func.isRequired
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
        {/* Color */}
        <LayerConfigGroup label={'color'}>
          {layer.config.colorField ? (
            <ColorRangeConfig {...visConfiguratorProps} />
          ) : (
            <LayerColorSelector {...layerConfiguratorProps} />
          )}
          <ChannelByValueSelector
            channel={layer.visualChannels.color}
            {...layerChannelConfigProps}
          />
          <VisConfigSlider
            {...LAYER_VIS_CONFIGS.opacity}
            {...visConfiguratorProps}
          />
        </LayerConfigGroup>

        {/* Radius */}
        <LayerConfigGroup label={'radius'}>
          {!layer.config.sizeField ? (
            <VisConfigSlider
              {...LAYER_VIS_CONFIGS.radius}
              {...visConfiguratorProps}
              label={false}
              disabled={Boolean(layer.config.sizeField)}
            />
          ) : (
            <VisConfigSlider
              {...LAYER_VIS_CONFIGS.radiusRange}
              {...visConfiguratorProps}
              disabled={
                !layer.config.sizeField || layer.config.visConfig.fixedRadius
              }
            />
          )}
          <ChannelByValueSelector
            channel={layer.visualChannels.size}
            {...layerChannelConfigProps}
          />
          {layer.config.sizeField ? (
            <VisConfigSwitch
              {...LAYER_VIS_CONFIGS.fixedRadius}
              {...visConfiguratorProps}
              disabled={!layer.config.sizeField}
            />
          ) : null}
        </LayerConfigGroup>

        {/* outline */}
        {layer.type === LAYER_TYPES.point ? (
          <LayerConfigGroup
            {...LAYER_VIS_CONFIGS.outline}
            {...visConfiguratorProps}
          >
            <VisConfigSlider
              {...LAYER_VIS_CONFIGS.thickness}
              {...visConfiguratorProps}
              label={false}
              disabled={!layer.config.visConfig.outline}
            />
          </LayerConfigGroup>
        ) : null}

        {/* text label */}
        <TextLabelPanel
          visConfiguratorProps={visConfiguratorProps}
          layerConfiguratorProps={layerConfiguratorProps}
          textLabel={layer.config.textLabel}
        />
        {/* high precision */}
        <LayerConfigGroup
          {...LAYER_VIS_CONFIGS['hi-precision']}
          {...visConfiguratorProps}
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
        <LayerConfigGroup label={'color'}>
          <ColorRangeConfig {...visConfiguratorProps} />
          <AggrColorScaleSelector {...layerConfiguratorProps} />
          <ChannelByValueSelector
            channel={layer.visualChannels.color}
            {...layerChannelConfigProps}
          />
          {layer.visConfigSettings.colorAggregation.condition(layer.config) ?
            <AggregationTypeSelector
              {...layer.visConfigSettings.colorAggregation}
              {...layerChannelConfigProps}
              channel={layer.visualChannels.color}
            />
            : null}
          <VisConfigSlider
            {...layer.visConfigSettings.opacity}
            {...visConfiguratorProps}
          />
        </LayerConfigGroup>

        {/* Cluster Radius */}
        <LayerConfigGroup label={'radius'}>
          <VisConfigSlider
            {...layer.visConfigSettings.clusterRadius}
            {...visConfiguratorProps}
          />
          <VisConfigSlider
            {...layer.visConfigSettings.radiusRange}
            {...visConfiguratorProps}
          />
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
        <LayerConfigGroup label={'color'}>
          <ColorRangeConfig {...visConfiguratorProps} />
          <VisConfigSlider
            {...layer.visConfigSettings.opacity}
            {...visConfiguratorProps}
          />
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
    const elevationByDescription =
      'When off, height is based on count of points';
    const colorByDescription = 'When off, color is based on count of points';

    return (
      <StyledLayerVisualConfigurator>
        {/* Color */}
        <LayerConfigGroup label={'color'}>
          <ColorRangeConfig {...visConfiguratorProps} />
          <AggrColorScaleSelector {...layerConfiguratorProps} />
          <ChannelByValueSelector
            channel={layer.visualChannels.color}
            {...layerChannelConfigProps}
          />
          {layer.visConfigSettings.colorAggregation.condition(layer.config) ? (
            <AggregationTypeSelector
              {...layer.visConfigSettings.colorAggregation}
              {...layerChannelConfigProps}
              descreiption={colorByDescription}
              channel={layer.visualChannels.color}
            />
          ) : null}
          {layer.visConfigSettings.percentile && layer.visConfigSettings.percentile.condition(layer.config) ? (
            <VisConfigSlider
              {...layer.visConfigSettings.percentile}
              {...visConfiguratorProps}
            />
          ) : null}
          <VisConfigSlider
            {...layer.visConfigSettings.opacity}
            {...visConfiguratorProps}
          />
        </LayerConfigGroup>

        {/* Cell size */}
        <LayerConfigGroup label={'radius'}>
          <VisConfigSlider
            {...layer.visConfigSettings.worldUnitSize}
            {...visConfiguratorProps}
          />
          <VisConfigSlider
            {...layer.visConfigSettings.coverage}
            {...visConfiguratorProps}
          />
        </LayerConfigGroup>

        {/* Elevation */}
        {layer.visConfigSettings.enable3d ?
          <LayerConfigGroup
            {...layer.visConfigSettings.enable3d}
            {...visConfiguratorProps}
          >
            <VisConfigSlider
              {...layer.visConfigSettings.elevationScale}
              {...visConfiguratorProps}
            />
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
            {layer.visConfigSettings.elevationPercentile.condition(
              layer.config
            ) ? (
              <VisConfigSlider
                {...layer.visConfigSettings.elevationPercentile}
                {...visConfiguratorProps}
              />
            ) : null}
          </LayerConfigGroup> : null}

        {/* High Precision */}
        <LayerConfigGroup
          {...layer.visConfigSettings['hi-precision']}
          {...visConfiguratorProps}
        />
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
        <LayerConfigGroup label={'color'}>
          {layer.config.colorField ? (
            <ColorRangeConfig {...visConfiguratorProps} />
          ) : (
            <LayerColorSelector {...layerConfiguratorProps} />
          )}
          <ChannelByValueSelector
            channel={layer.visualChannels.color}
            {...layerChannelConfigProps}
          />
          <VisConfigSlider
            {...LAYER_VIS_CONFIGS.opacity}
            {...visConfiguratorProps}
          />
        </LayerConfigGroup>

        {/* Coverage */}
        <LayerConfigGroup label={'coverage'}>
          {!layer.config.coverageField ? (
            <VisConfigSlider
              {...layer.visConfigSettings.coverage}
              {...visConfiguratorProps}
            />
          ) : (
            <VisConfigSlider
              {...layer.visConfigSettings.coverageRange}
              {...visConfiguratorProps}
            />
          )}
          <ChannelByValueSelector
            channel={layer.visualChannels.coverage}
            {...layerChannelConfigProps}
          />
        </LayerConfigGroup>

        {/* height */}
        <LayerConfigGroup
          {...LAYER_VIS_CONFIGS.enable3d}
          {...visConfiguratorProps}
        >
          <ChannelByValueSelector
            channel={layer.visualChannels.size}
            {...layerChannelConfigProps}
          />
          <VisConfigSlider
            {...LAYER_VIS_CONFIGS.elevationRange}
            {...visConfiguratorProps}
          />
        </LayerConfigGroup>
        {/* high precision */}
        <LayerConfigGroup
          {...LAYER_VIS_CONFIGS['hi-precision']}
          {...visConfiguratorProps}
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
        <LayerConfigGroup label={'color'}>
          {layer.config.colorField ? (
            <ColorRangeConfig {...visConfiguratorProps} />
          ) : (
            <ArcLayerColorSelector
              layer={layer}
              onChangeConfig={layerConfiguratorProps.onChange}
              onChangeVisConfig={visConfiguratorProps.onChange}
            />
          )}
          <ChannelByValueSelector
            channel={layer.visualChannels.color}
            {...layerChannelConfigProps}
          />
          <VisConfigSlider
            {...LAYER_VIS_CONFIGS.opacity}
            {...visConfiguratorProps}
          />
        </LayerConfigGroup>

        {/* thickness */}
        <LayerConfigGroup label={'stroke'}>
          {layer.config.sizeField ? (
            <VisConfigSlider
              {...LAYER_VIS_CONFIGS.strokeWidthRange}
              {...visConfiguratorProps}
              disabled={!layer.config.sizeField}
            />
          ) : (
            <VisConfigSlider
              {...LAYER_VIS_CONFIGS.thickness}
              {...visConfiguratorProps}
            />
          )}
          <ChannelByValueSelector
            channel={layer.visualChannels.size}
            {...layerChannelConfigProps}
          />
        </LayerConfigGroup>

        {/* high precision */}
        <LayerConfigGroup
          {...LAYER_VIS_CONFIGS['hi-precision']}
          {...visConfiguratorProps}
        />
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
        {/* Color By */}
        <LayerConfigGroup label={'color'}>
          {featureTypes.polygon ? (
            <VisConfigSwitch
              {...visConfiguratorProps}
              {...LAYER_VIS_CONFIGS.filled}
            />
          ) : null}

          {layer.config.colorField ? (
            <ColorRangeConfig {...visConfiguratorProps} />
          ) : (
            <LayerColorSelector {...layerConfiguratorProps} />
          )}

          <ChannelByValueSelector
            channel={layer.visualChannels.color}
            {...layerChannelConfigProps}
          />

          <VisConfigSlider
            {...LAYER_VIS_CONFIGS.opacity}
            {...visConfiguratorProps}
          />
        </LayerConfigGroup>

        {/* Stroke Width */}
        {featureTypes.line || featureTypes.polygon ? (
          <LayerConfigGroup
            label="stroke"
            {...visConfiguratorProps}
            {...(featureTypes.polygon ? LAYER_VIS_CONFIGS.stroked : {})}
          >
            {visConfig.stroked ?
              <div>
                <VisConfigSlider
                  {...LAYER_VIS_CONFIGS.thickness}
                  {...visConfiguratorProps}
                />
                <ChannelByValueSelector
                  channel={layer.visualChannels.size}
                  {...layerChannelConfigProps}
                />
                <VisConfigSlider
                  {...LAYER_VIS_CONFIGS.strokeWidthRange}
                  {...visConfiguratorProps}
                  disabled={!layer.config.sizeField}
                />
              </div> : null}
          </LayerConfigGroup>
        ) : null}

        {/* Elevation */}
        {featureTypes.polygon && visConfig.filled ? (
          <LayerConfigGroup
            {...visConfiguratorProps}
            {...LAYER_VIS_CONFIGS.enable3d}
          >
            <VisConfigSlider
              {...LAYER_VIS_CONFIGS.elevationScale}
              {...visConfiguratorProps}
            />
            <ChannelByValueSelector
              channel={layer.visualChannels.height}
              {...layerChannelConfigProps}
            />
            <VisConfigSwitch
              {...visConfiguratorProps}
              {...LAYER_VIS_CONFIGS.wireframe}
            />
          </LayerConfigGroup>
        ) : null}

        {/* Radius */}
        {featureTypes.point ? (
          <div>
            <VisConfigSlider
              {...LAYER_VIS_CONFIGS.radius}
              {...visConfiguratorProps}
              label="Point Radius"
              disabled={Boolean(layer.config.radiusField)}
            />
            <ChannelByValueSelector
              channel={layer.visualChannels.radius}
              {...layerChannelConfigProps}
            />
            <VisConfigSlider
              {...LAYER_VIS_CONFIGS.radiusRange}
              {...visConfiguratorProps}
              disabled={!layer.config.radiusField}
            />
          </div>
        ) : null}

        {/* high precision */}
        <LayerConfigGroup
          {...LAYER_VIS_CONFIGS['hi-precision']}
          {...visConfiguratorProps}
        />
      </StyledLayerVisualConfigurator>
    );
  }

  render() {
    const {
      layer,
      datasets,
      updateLayerConfig,
      layerTypeOptions,
      updateLayerType
    } = this.props;
    const {fields = [], fieldPairs} = layer.config.dataId
      ? datasets[layer.config.dataId]
      : {};
    const {config} = layer;

    const commonConfigProp = {
      layer,
      fields
    };

    const visConfiguratorProps = {
      ...commonConfigProp,
      onChange: this.props.updateLayerVisConfig
    };

    const layerConfiguratorProps = {
      ...commonConfigProp,
      onChange: updateLayerConfig
    };

    const layerChannelConfigProps = {
      ...commonConfigProp,
      onChange: this.props.updateLayerVisualChannelConfig
    };

    const renderTemplate =
      layer.type && `_render${capitalizeFirstLetter(layer.type)}LayerConfig`;

    return (
      <StyledLayerConfigurator>
        {layer.layerInfoModal ? <HowToButton onClick={() => this.props.openModal(layer.layerInfoModal)}/> : null}
        <LayerConfigGroup label={'basic'}>
          {Object.keys(datasets).length > 1 && (
            <SourceDataSelector
              datasets={datasets}
              id={layer.id}
              disabled={layer.tyep && config.columns}
              dataId={config.dataId}
              onSelect={value => updateLayerConfig({dataId: value})}
            />
          )}
          <LayerTypeSelector
            layer={layer}
            layerTypeOptions={layerTypeOptions}
            onSelect={updateLayerType}
          />
          <LayerColumnConfig
            layer={layer}
            fields={fields}
            fieldPairs={fieldPairs}
            updateLayerConfig={updateLayerConfig}
            updateLayerType={this.props.updateLayerType}
          />
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

/*
 * Componentize config component into pure functional components
 */

const StyledHowToButton = styled.div`
  position: absolute;
  right: 0;
  top: 0;
`;

export const HowToButton = ({onClick}) => (
  <StyledHowToButton>
    <Button secondary small onClick={onClick}>How to</Button>
  </StyledHowToButton>
);

export const LayerColorSelector = ({layer, onChange, label}) => (
  <SidePanelSection disabled={layer.config.colorField}>
    <ColorSelector
      colorSets={[
        {
          selectedColor: layer.config.color,
          setColor: rgbValue => onChange({color: rgbValue})
        }
      ]}
    />
  </SidePanelSection>
);

export const ArcLayerColorSelector = ({
  layer,
  onChangeConfig,
  onChangeVisConfig
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
          selectedColor:
            layer.config.visConfig.targetColor || layer.config.color,
          setColor: rgbValue => onChangeVisConfig({targetColor: rgbValue}),
          label: 'Target'
        }
      ]}
    />
  </SidePanelSection>
);

export const ColorRangeConfig = ({layer, onChange}) => (
  <SidePanelSection>
    <ColorSelector
      colorSets={[
        {
          selectedColor: layer.config.visConfig.colorRange,
          isRange: true,
          setColor: colorRange => onChange({colorRange})
        }
      ]}
    />
  </SidePanelSection>
);

export const ChannelByValueSelector = ({
  layer,
  channel,
  onChange,
  fields,
  description
}) => {
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
  const channelSupportedFieldTypes = supportedFieldTypes || CHANNEL_SCALE_SUPPORTED_FIELDS[channelScaleType];
  const supportedFields = fields.filter(({type}) =>
    channelSupportedFieldTypes.includes(type)
  );
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

export const AggrColorScaleSelector = ({layer, onChange}) => {
  const scaleOptions = layer.getScaleOptions('color');
  return (
    Array.isArray(scaleOptions) && scaleOptions.length > 1 ?
      <DimensionScaleSelector
        label="Color Scale"
        options={scaleOptions}
        scaleType={layer.config.colorScale}
        onSelect={val => onChange({colorScale: val}, 'color')}
      /> : null
  );
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
