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

import {LAYER_VIS_CONFIGS} from 'keplergl-layers/layer-factory';

import {capitalizeFirstLetter} from 'utils/utils';

import {
  FIELD_OPTS,
  LAYER_TYPES,
  CHANNEL_SCALE_SUPPORTED_FIELDS
} from 'constants/default-settings';

const propTypes = {
  layer: PropTypes.object.isRequired,
  datasets: PropTypes.object.isRequired,
  openModal: PropTypes.func.isRequired,
  updateLayerConfig: PropTypes.func.isRequired,
  updateLayerType: PropTypes.func.isRequired,
  updateLayerVisConfig: PropTypes.func.isRequired,
  updateLayerVisualChannelConfig: PropTypes.func.isRequired
};

const StyledLayerConfigurator = styled.div.attrs({
  className: 'layer-panel__config'
})`
  margin-top: 12px;
`;

const StyledLayerVisualConfigurator = styled.div.attrs({
  className: 'layer-panel__config__visualC-config'
})`
  margin-top: 12px;
`;

export default class LayerConfigurator extends Component {
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
          <VisConfigSlider
            {...LAYER_VIS_CONFIGS.opacity}
            {...visConfiguratorProps}
          />
        </LayerConfigGroup>

        {/* Cluster Radius */}
        <LayerConfigGroup label={'radius'}>
          <VisConfigSlider
            {...LAYER_VIS_CONFIGS.clusterRadius}
            {...visConfiguratorProps}
          />
          <VisConfigSlider
            {...LAYER_VIS_CONFIGS.clusterRadiusRange}
            {...visConfiguratorProps}
          />
        </LayerConfigGroup>
        {/* Aggregation Type */}
        <LayerConfigGroup label={'aggregation'}>
          <AggregationTypeSelector
            {...LAYER_VIS_CONFIGS.aggregation}
            {...visConfiguratorProps}
            field={layer.config.colorField}
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
            {...LAYER_VIS_CONFIGS.opacity}
            {...visConfiguratorProps}
          />
        </LayerConfigGroup>
        {/* Radius */}
        <LayerConfigGroup label={'radius'}>
          <VisConfigSlider
            {...LAYER_VIS_CONFIGS.radius}
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
    const {type, config} = layer;
    const {visConfig: {enable3d}, colorField, sizeField} = config;
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
          <AggregationTypeSelector
            {...LAYER_VIS_CONFIGS.aggregation}
            {...visConfiguratorProps}
            descreiption={colorByDescription}
            field={colorField}
          />
          <VisConfigSlider
            {...LAYER_VIS_CONFIGS.percentile}
            {...visConfiguratorProps}
          />
          <VisConfigSlider
            {...LAYER_VIS_CONFIGS.opacity}
            {...visConfiguratorProps}
          />
        </LayerConfigGroup>

        {/* Cell size */}
        <LayerConfigGroup label={'radius'}>
          <VisConfigSlider
            {...LAYER_VIS_CONFIGS.worldUnitSize}
            {...visConfiguratorProps}
            label={`${
              type === LAYER_TYPES.grid ? 'Grid Size' : 'Hexagon Radius'
            } (km)`}
          />
          <VisConfigSlider
            {...LAYER_VIS_CONFIGS.coverage}
            {...visConfiguratorProps}
          />
        </LayerConfigGroup>

        {/* Elevation */}
        <LayerConfigGroup
          {...LAYER_VIS_CONFIGS.enable3d}
          {...visConfiguratorProps}
        >
          <VisConfigSlider
            {...LAYER_VIS_CONFIGS.elevationScale}
            {...visConfiguratorProps}
          />
          <ChannelByValueSelector
            {...layerChannelConfigProps}
            channel={layer.visualChannels.size}
            description={elevationByDescription}
            disabled={!enable3d}
          />
          <AggregationTypeSelector
            {...LAYER_VIS_CONFIGS.aggregation}
            {...visConfiguratorProps}
            property={'sizeAggregation'}
            field={sizeField}
          />
          <VisConfigSlider
            {...LAYER_VIS_CONFIGS.percentile}
            {...visConfiguratorProps}
            property={'elevationPercentile'}
            disabled={!enable3d || (!colorField && !sizeField)}
          />
        </LayerConfigGroup>
        <LayerConfigGroup
          {...LAYER_VIS_CONFIGS['hi-precision']}
          {...visConfiguratorProps}
        />
      </StyledLayerVisualConfigurator>
    );
  }

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
    const {meta: {featureTypes = {}}, config: {visConfig}} = layer;

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
        {featureTypes.line || (featureTypes.polygon && visConfig.stroked) ? (
          <LayerConfigGroup
            label="stroke"
            {...visConfiguratorProps}
            {...(featureTypes.polygon ? LAYER_VIS_CONFIGS.stroked : {})}
          >
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
            </div>
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
    const {layer, datasets, updateLayerConfig} = this.props;
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
            onSelect={this.props.updateLayerType}
          />
          <LayerColumnConfig
            layer={layer}
            fields={fields}
            fieldPairs={fieldPairs}
            updateLayerConfig={updateLayerConfig}
            updateLayerType={this.props.updateLayerType}
            openModal={this.props.openModal}
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

LayerConfigurator.propTypes = propTypes;

/*
 * Componentize config component into pure functional components
 */

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

export const ArcLayerColorSelector = ({layer, onChangeConfig, onChangeVisConfig}) => (
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
    scale
  } = channel;
  const supportedFieldTypes = CHANNEL_SCALE_SUPPORTED_FIELDS[channelScaleType];
  const supportedFields = fields.filter(({type}) =>
    supportedFieldTypes.includes(type)
  );
  const selectedField = layer.config[field];
  const scaleOptions =
    (selectedField && FIELD_OPTS[selectedField.type].scale[channelScaleType]) ||
    [];
  const showScale = !layer.isAggregated && scaleOptions.length > 1;
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
      range={layer.config.visConfig[range]}
      scaleOptions={scaleOptions}
      scaleType={layer.config[scale]}
      selectedField={layer.config[field]}
      showScale={showScale}
      updateField={val => onChange({[field]: val}, key)}
      updateScale={val => onChange({[scale]: val}, key)}
    />
  );
};

export const AggrColorScaleSelector = ({layer: {config}, onChange}) => (
  <DimensionScaleSelector
    label="Color Scale"
    options={
      config.colorField
        ? FIELD_OPTS[config.colorField.type].scale.colorAggr
        : FIELD_OPTS.integer.scale.colorAggr
    }
    scaleType={config.colorScale}
    onSelect={val => onChange({colorScale: val}, 'color')}
  />
);

export const AggregationTypeSelector = ({
  layer: {config: {visConfig}},
  field,
  property,
  options,
  onChange
}) => (
  <SidePanelSection>
    <PanelLabel>{`Aggregate ${field ? field.name : ''} by`}</PanelLabel>
    <ItemSelector
      disabled={!field}
      selectedItems={visConfig[property]}
      options={options}
      multiSelect={false}
      searchable={false}
      onChange={value => onChange({[property]: value})}
    />
  </SidePanelSection>
);
/* eslint-enable max-params */
