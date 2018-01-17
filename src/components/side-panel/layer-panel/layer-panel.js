import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {sortable} from 'react-anything-sortable';

import LayerConfigurator from './layer-configurator';
import LayerPanelItem from 'components/common/layer-panel-item';
import {DIMENSIONS} from 'constants/default-settings';

const propTypes = {
  layer: PropTypes.object.isRequired,
  datasets: PropTypes.object.isRequired,
  idx: PropTypes.number.isRequired,
  panelWidth: PropTypes.number.isRequired,
  layerConfigChange: PropTypes.func.isRequired,
  layerTypeChange: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  removeLayer: PropTypes.func.isRequired,
  onCloseConfig: PropTypes.func,

  layerVisConfigChange: PropTypes.func,
  layerVisualChannelConfigChange: PropTypes.func
};

@sortable
export default class LayerPanel extends Component {

  updateLayerConfig = (newProp) => {
    this.props.layerConfigChange(this.props.layer, newProp);
  };

  updateLayerType = (newType) => {
    this.props.layerTypeChange(this.props.layer, newType);
  };

  updateLayerVisConfig = (newVisConfig) => {
    this.props.layerVisConfigChange(this.props.layer, newVisConfig);
  };

  updateLayerVisualChannelConfig = (newConfig, channel, scaleKey) => {
    this.props.layerVisualChannelConfigChange(this.props.layer, newConfig, channel, scaleKey);
  };

  _updateLayerLabel = ({target: {value}}) => {
    this.updateLayerConfig({label: value});
  };

  _toggleVisibility = (e) => {
    e.stopPropagation();
    const isVisible = !this.props.layer.config.isVisible;
    this.updateLayerConfig({isVisible});
  };

  _toggleEnableConfig = (event) => {
    event.stopPropagation();
    const {layer: {config: {isConfigActive}}} = this.props;
    this.updateLayerConfig({isConfigActive: !isConfigActive});
  };

  render() {
    const {layer, idx, removeLayer, datasets, isAdding} = this.props;
    const {config} = layer;
    const {isConfigActive} = config;

    return (
      <div ref="container"
           className={classnames(`layer-panel ${this.props.className}`, {active: isConfigActive})}
           style={this.props.style}
           onMouseDown={this.props.onMouseDown}
           onTouchStart={this.props.onTouchStart}>
        <LayerPanelItem
          isConfigActive={isConfigActive}
          id={layer.id}
          idx={idx}
          isVisible={config.isVisible}
          label={config.label}
          labelRCGColorValues={datasets[config.dataId].color}
          onToggleEnableConfig={this._toggleEnableConfig}
          onToggleVisibility={this._toggleVisibility}
          onUpdateLayerLabel={this._updateLayerLabel}
          removeLayer={removeLayer}
        />
        {isConfigActive &&
          <LayerConfigurator
            isAdding={isAdding}
            layer={layer}
            datasets={datasets}
            openModal={this.props.openModal}
            panelWidth={this.props.panelWidth - DIMENSIONS.layerPanelPadding * 2}
            updateLayerConfig={this.updateLayerConfig}
            updateLayerVisualChannelConfig={this.updateLayerVisualChannelConfig}
            updateLayerType={this.updateLayerType}
            updateLayerVisConfig={this.updateLayerVisConfig}
          />
        }
      </div>
    );
  }
}

LayerPanel.propTypes = propTypes;
LayerPanel.displayName = 'LayerPanel';
