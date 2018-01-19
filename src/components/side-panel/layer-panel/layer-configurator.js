import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {rgb} from 'd3-color';
import {Switch} from '@uber/react-switch';

import RangeSlider from 'components/common/range-slider';
import {
  PanelLabel,
  SidePanelSection
} from 'components/common/styled-components';
import InfoHelper from 'components/common/info-helper';
import ItemSelector from 'components/common/item-selector/item-selector';

import VisConfigByFieldSelector from './vis-config-by-field-selector';
import LayerColumnConfig from './layer-column-config';
import ColorRangeSelector from './color-range-selector';
import DimensionScaleSelector from './dimension-scale-selector';
import ColorSingleSelector from './color-single-selector';
import SourceDataSelector from '../source-data-selector';

import {LAYER_VIS_CONFIGS} from 'keplergl-layers/layer-factory';

import {capitalizeFirstLetter} from 'utils/utils';
import {hexToRgb} from 'utils/color-utils';

import {
  FIELD_OPTS,
  LAYER_TYPES,
  CHANNEL_SCALE_SUPPORTED_FIELDS
} from 'constants/default-settings';

const propTypes = {
  layer: PropTypes.object.isRequired,
  datasets: PropTypes.object.isRequired,
  openModal: PropTypes.func.isRequired,
  panelWidth: PropTypes.number.isRequired,
  updateLayerConfig: PropTypes.func.isRequired,
  updateLayerType: PropTypes.func.isRequired,
  updateLayerVisConfig: PropTypes.func.isRequired,
  updateLayerVisualChannelConfig: PropTypes.func.isRequired
};

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
      <div className="push-small--top">
        {/* Color */}
        <LayerColorSelector {...layerConfiguratorProps} />
        <ChannelByValueSelector
          channel={layer.visualChannels.color}
          {...layerChannelConfigProps}
        />
        {layer.config.colorField ? (
          <ColorRangeConfig {...visConfiguratorProps} />
        ) : null}
        <VisConfigSlider
          {...LAYER_VIS_CONFIGS.opacity}
          {...visConfiguratorProps}
        />
        {/* Radius */}
        <VisConfigSlider
          {...LAYER_VIS_CONFIGS.radius}
          {...visConfiguratorProps}
          disabled={Boolean(layer.config.sizeField)}
        />
        <ChannelByValueSelector
          channel={layer.visualChannels.size}
          {...layerChannelConfigProps}
        />
        <VisConfigSwitch
          {...LAYER_VIS_CONFIGS.fixedRadius}
          {...visConfiguratorProps}
          disabled={!layer.config.sizeField}
        />
        <VisConfigSlider
          {...LAYER_VIS_CONFIGS.radiusRange}
          {...visConfiguratorProps}
          disabled={
            !layer.config.sizeField || layer.config.visConfig.fixedRadius
          }
        />
        {/* outline */}
        {layer.type === LAYER_TYPES.point ? (
          <VisConfigSwitch
            {...LAYER_VIS_CONFIGS.outline}
            {...visConfiguratorProps}
          />
        ) : null}
        {layer.type === LAYER_TYPES.point ? (
          <VisConfigSlider
            {...LAYER_VIS_CONFIGS.thickness}
            {...visConfiguratorProps}
            label={''}
            disabled={!layer.config.visConfig.outline}
          />
        ) : null}
        {/* high precision */}
        <HighPrecisionSwitch {...visConfiguratorProps} />
      </div>
    );
  }

  _renderClusterLayerConfig({
    layer,
    visConfiguratorProps,
    layerConfiguratorProps,
    layerChannelConfigProps
  }) {
    return (
      <div className="push-small--top">
        {/* Cluster Radius */}
        <VisConfigSlider
          {...LAYER_VIS_CONFIGS.clusterRadius}
          {...visConfiguratorProps}
        />
        <VisConfigSlider
          {...LAYER_VIS_CONFIGS.clusterRadiusRange}
          {...visConfiguratorProps}
        />
        {/* Opacity */}
        <VisConfigSlider
          {...LAYER_VIS_CONFIGS.opacity}
          {...visConfiguratorProps}
        />
        {/* Color */}
        <ColorRangeConfig {...visConfiguratorProps} />
        <AggrColorScaleSelector {...layerConfiguratorProps} />
        <ChannelByValueSelector
          channel={layer.visualChannels.color}
          {...layerChannelConfigProps}
        />
        <AggregationTypeSelector
          {...LAYER_VIS_CONFIGS.aggregation}
          {...visConfiguratorProps}
          field={layer.config.colorField}
        />
      </div>
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
      <div className="push-small--top">
        <VisConfigSlider
          {...LAYER_VIS_CONFIGS.opacity}
          {...visConfiguratorProps}
        />
        {/* Cell size */}
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
        {/* Color */}
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
        {/* Elevation */}
        <VisConfigSwitch
          {...LAYER_VIS_CONFIGS.enable3d}
          {...visConfiguratorProps}
        />
        {enable3d ? (
          <ChannelByValueSelector
            {...layerChannelConfigProps}
            channel={layer.visualChannels.size}
            description={elevationByDescription}
          />
        ) : null}
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
        <VisConfigSlider
          {...LAYER_VIS_CONFIGS.elevationScale}
          {...visConfiguratorProps}
        />
        <HighPrecisionSwitch {...visConfiguratorProps} />
      </div>
    );
  }

  _renderHexagonIdLayerConfig({
    layer,
    visConfiguratorProps,
    layerConfiguratorProps,
    layerChannelConfigProps
  }) {
    return (
      <div className="push-small--top">
        {/* Color */}
        <LayerColorSelector {...layerConfiguratorProps} />
        <ChannelByValueSelector
          channel={layer.visualChannels.color}
          {...layerChannelConfigProps}
        />
        {layer.config.colorField ? (
          <ColorRangeConfig {...visConfiguratorProps} />
        ) : null}
        <VisConfigSlider
          {...LAYER_VIS_CONFIGS.opacity}
          {...visConfiguratorProps}
        />
        {/* height */}
        <ChannelByValueSelector
          channel={layer.visualChannels.size}
          {...layerChannelConfigProps}
        />
        <VisConfigSlider
          {...LAYER_VIS_CONFIGS.elevationScale}
          {...visConfiguratorProps}
        />
        <VisConfigSlider
          {...LAYER_VIS_CONFIGS.elevationRange}
          {...visConfiguratorProps}
          label={'Height Range'}
          disabled={!layer.config.sizeField}
        />
        <HighPrecisionSwitch {...visConfiguratorProps} />
      </div>
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
      <div className="push-small--top">
        {/* Color */}
        <LayerColorSelector {...layerConfiguratorProps} label="Source Color" />
        <VisColorSelector
          {...visConfiguratorProps}
          {...LAYER_VIS_CONFIGS.targetColor}
        />
        <ChannelByValueSelector
          channel={layer.visualChannels.color}
          {...layerChannelConfigProps}
        />
        {layer.config.colorField ? (
          <ColorRangeConfig {...visConfiguratorProps} />
        ) : null}
        <VisConfigSlider
          {...LAYER_VIS_CONFIGS.opacity}
          {...visConfiguratorProps}
        />

        {/* thickness */}
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
        {/* high precision */}
        <HighPrecisionSwitch {...visConfiguratorProps} />
      </div>
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
      <div className="push-small--top">
        <LayerColorSelector {...layerConfiguratorProps} />
        <VisConfigSlider
          {...LAYER_VIS_CONFIGS.opacity}
          {...visConfiguratorProps}
        />

        {/* Color By */}

        {featureTypes.polygon ? (
          <VisConfigSwitch
            {...visConfiguratorProps}
            {...LAYER_VIS_CONFIGS.filled}
          />
        ) : null}
        <ChannelByValueSelector
          channel={layer.visualChannels.color}
          {...layerChannelConfigProps}
        />
        {layer.config.colorField ? (
          <ColorRangeConfig {...visConfiguratorProps} />
        ) : null}

        {/* Stroke Width */}
        {featureTypes.polygon ? (
          <VisConfigSwitch
            {...visConfiguratorProps}
            {...LAYER_VIS_CONFIGS.stroked}
          />
        ) : null}

        {featureTypes.line || (featureTypes.polygon && visConfig.stroked) ? (
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
        ) : null}

        {/* Elevation */}
        {featureTypes.polygon && visConfig.filled ? (
          <div>
            <VisConfigSwitch
              {...visConfiguratorProps}
              {...LAYER_VIS_CONFIGS.enable3d}
            />
            <VisConfigSwitch
              {...visConfiguratorProps}
              {...LAYER_VIS_CONFIGS.wireframe}
              disabled={!visConfig.enable3d}
            />
            {visConfig.enable3d ? (
              <ChannelByValueSelector
                channel={layer.visualChannels.height}
                {...layerChannelConfigProps}
              />
            ) : null}
            <VisConfigSlider
              {...LAYER_VIS_CONFIGS.elevationScale}
              {...visConfiguratorProps}
              disabled={!visConfig.enable3d}
            />
          </div>
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

        {/* vis Switches */}
        <HighPrecisionSwitch {...visConfiguratorProps} />
      </div>
    );
  }

  render() {
    const {
      layer,
      datasets,
      panelWidth,
      isAdding,
      updateLayerConfig
    } = this.props;
    const {fields = [], fieldPairs} = layer.config.dataId
      ? datasets[layer.config.dataId]
      : {};
    const {config} = layer;

    const commonConfigProp = {
      layer,
      panelWidth,
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
      <div className="soft-tiny layer-panel__config">
        {Object.keys(datasets).length > 1 && (
          <SourceDataSelector
            datasets={datasets}
            id={layer.id}
            disabled={layer.tyep && config.columns}
            dataId={config.dataId}
            onSelect={value => updateLayerConfig({dataId: value})}
          />
        )}
        <LayerColumnConfig
          layer={layer}
          fields={fields}
          fieldPairs={fieldPairs}
          updateLayerConfig={updateLayerConfig}
          updateLayerType={this.props.updateLayerType}
          openModal={this.props.openModal}
        />
        {!isAdding &&
          this[renderTemplate] &&
          this[renderTemplate]({
            layer,
            visConfiguratorProps,
            layerChannelConfigProps,
            layerConfiguratorProps
          })}
      </div>
    );
  }
}

LayerConfigurator.propTypes = propTypes;

/*
 * Componentize config component into pure functional components
 */
const VisConfigSwitch = ({
  layer: {id, config},
  property,
  onChange,
  label,
  description,
  disabled
}) => (
  <SidePanelSection disabled={Boolean(disabled)}>
    <PanelLabel>{label || capitalizeFirstLetter(property)}</PanelLabel>
    {description ? (
      <div className="display--inline-block">
        <InfoHelper description={description} id={`${id}-${property}`} />
      </div>
    ) : null}
    <div className="display--inline-block float--right">
      <Switch
        className="micro text-uber-black-40"
        style={{marginBottom: 0, marginRight: '-10px'}}
        checked={config.visConfig[property]}
        id={`${id}-${property}`}
        label={' '}
        onChange={() => onChange({[property]: !config.visConfig[property]})}
        size="small"
      />
    </div>
  </SidePanelSection>
);

/* eslint-disable max-params */
export const VisConfigSlider = ({
  layer: {config},
  property,
  label,
  range,
  step,
  isRanged,
  disabled,
  onChange
}) => (
  <SidePanelSection disabled={Boolean(disabled)}>
    <PanelLabel>
      {typeof label === 'string'
        ? label
        : typeof label === 'function'
          ? label(config)
          : capitalizeFirstLetter(property)}
    </PanelLabel>
    <RangeSlider
      minValue={range[0]}
      maxValue={range[1]}
      value0={isRanged ? config.visConfig[property][0] : range[0]}
      value1={
        isRanged ? config.visConfig[property][1] : config.visConfig[property]
      }
      step={step}
      isRanged={Boolean(isRanged)}
      showInput={true}
      onChange={value => onChange({[property]: isRanged ? value : value[1]})}
    />
  </SidePanelSection>
);
/* eslint-enable max-params */

const HighPrecisionSwitch = ({layer, onChange}) => (
  <VisConfigSwitch
    {...LAYER_VIS_CONFIGS['hi-precision']}
    layer={layer}
    onChange={onChange}
  />
);

const LayerColorSelector = ({layer, panelWidth, onChange, label}) => (
  <SidePanelSection disabled={layer.config.colorField}>
    <PanelLabel>{label || 'Layer Color'}</PanelLabel>
    <ColorSingleSelector
      width={panelWidth}
      setColor={hex => onChange({color: hexToRgb(hex)})}
      selectedColor={rgb(...layer.config.color)
        .toString()
        .toUpperCase()}
    />
  </SidePanelSection>
);

const VisColorSelector = ({layer, panelWidth, onChange, label, property}) => (
  <SidePanelSection disabled={layer.config.colorField}>
    <PanelLabel>{label || 'Target Color'}</PanelLabel>
    <ColorSingleSelector
      width={panelWidth}
      setColor={hex => onChange({[property]: hexToRgb(hex)})}
      selectedColor={rgb(
        ...(layer.config.visConfig[property] || layer.config.color)
      )
        .toString()
        .toUpperCase()}
    />
  </SidePanelSection>
);

const ColorRangeConfig = ({layer, panelWidth, onChange}) => (
  <SidePanelSection>
    <PanelLabel>Color Palette</PanelLabel>
    <ColorRangeSelector
      width={panelWidth}
      selectedColorRange={layer.config.visConfig.colorRange}
      onSelectColorRange={onChange}
    />
  </SidePanelSection>
);

const ChannelByValueSelector = ({
  layer,
  channel,
  panelWidth,
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
      innerPanelWidth={panelWidth}
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

const AggrColorScaleSelector = ({layer: {config}, onChange}) => (
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

const AggregationTypeSelector = ({
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
