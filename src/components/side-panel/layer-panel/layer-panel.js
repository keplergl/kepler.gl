import React, {Component} from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {sortable} from 'react-anything-sortable';

import LayerConfigurator from './layer-configurator';
import LayerPanelHeader from './layer-panel-header';
import {DIMENSIONS} from 'constants/default-settings';

const propTypes = {
  layer: PropTypes.object.isRequired,
  datasets: PropTypes.object.isRequired,
  idx: PropTypes.number.isRequired,
  layerConfigChange: PropTypes.func.isRequired,
  layerTypeChange: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  removeLayer: PropTypes.func.isRequired,
  onCloseConfig: PropTypes.func,

  layerVisConfigChange: PropTypes.func,
  layerVisualChannelConfigChange: PropTypes.func
};

const PanelWrapper = styled.div`
  font-size: 12px;
  border-radius: 1px;
  margin-bottom: 8px;
`;

@sortable
export default class LayerPanel extends Component {
  updateLayerConfig = newProp => {
    this.props.layerConfigChange(this.props.layer, newProp);
  };

  updateLayerType = newType => {
    this.props.layerTypeChange(this.props.layer, newType);
  };

  updateLayerVisConfig = newVisConfig => {
    this.props.layerVisConfigChange(this.props.layer, newVisConfig);
  };

  updateLayerVisualChannelConfig = (newConfig, channel, scaleKey) => {
    this.props.layerVisualChannelConfigChange(
      this.props.layer,
      newConfig,
      channel,
      scaleKey
    );
  };

  _updateLayerLabel = ({target: {value}}) => {
    this.updateLayerConfig({label: value});
  };

  _toggleVisibility = e => {
    e.stopPropagation();
    const isVisible = !this.props.layer.config.isVisible;
    this.updateLayerConfig({isVisible});
  };

  _toggleEnableConfig = e => {
    e.stopPropagation();
    const {layer: {config: {isConfigActive}}} = this.props;
    this.updateLayerConfig({isConfigActive: !isConfigActive});
  };

  _removeLayer = e => {
    e.stopPropagation();
    this.props.removeLayer(this.props.idx);
  };
  render() {
    const {layer, idx, datasets} = this.props;
    const {config} = layer;
    const {isConfigActive} = config;

    return (
      <PanelWrapper
        active={isConfigActive}
        className="layer-panel"
        style={this.props.style}
        onMouseDown={this.props.onMouseDown}
        onTouchStart={this.props.onTouchStart}
      >
        <LayerPanelHeader
          isConfigActive={isConfigActive}
          id={layer.id}
          idx={idx}
          isVisible={config.isVisible}
          label={config.label}
          labelRCGColorValues={datasets[config.dataId].color}
          layerType={layer.type}
          onToggleEnableConfig={this._toggleEnableConfig}
          onToggleVisibility={this._toggleVisibility}
          onUpdateLayerLabel={this._updateLayerLabel}
          onRemoveLayer={this._removeLayer}
        />
        {isConfigActive && (
          <LayerConfigurator
            layer={layer}
            datasets={datasets}
            openModal={this.props.openModal}
            updateLayerConfig={this.updateLayerConfig}
            updateLayerVisualChannelConfig={this.updateLayerVisualChannelConfig}
            updateLayerType={this.updateLayerType}
            updateLayerVisConfig={this.updateLayerVisConfig}
          />
        )}
      </PanelWrapper>
    );
  }
}

LayerPanel.propTypes = propTypes;
LayerPanel.displayName = 'LayerPanel';
