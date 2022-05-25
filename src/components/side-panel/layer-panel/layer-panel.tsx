// Copyright (c) 2022 Uber Technologies, Inc.
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

import React, {Component, MouseEventHandler, TouchEventHandler} from 'react';
import styled from 'styled-components';

import LayerConfiguratorFactory from './layer-configurator';
import LayerPanelHeaderFactory from './layer-panel-header';
import {Datasets, NestedPartial} from 'reducers';
import {Layer, LayerBaseConfig, LayerVisConfig} from 'layers';
import {toggleModal} from 'actions/ui-state-actions';
import * as VisStateActions from 'actions/vis-state-actions';
import {ColorUI} from 'layers/layer-factory';
import {ActionHandler} from 'actions';

type LayerPanelProps = {
  className?: string;
  style?: string;
  onMouseDown?: MouseEventHandler;
  onTouchStart?: TouchEventHandler;
  layer: Layer;
  datasets: Datasets;
  idx: number;
  layerTypeOptions?: {
    id: string;
    label: string;
    icon: any; //
    requireData: any; //
  }[];
  isDraggable?: boolean;
  openModal: ActionHandler<typeof toggleModal>;
  layerColorUIChange: ActionHandler<typeof VisStateActions.layerColorUIChange>;
  layerConfigChange: ActionHandler<typeof VisStateActions.layerConfigChange>;
  layerVisualChannelConfigChange: ActionHandler<
    typeof VisStateActions.layerVisualChannelConfigChange
  >;
  layerTypeChange: ActionHandler<typeof VisStateActions.layerTypeChange>;
  layerVisConfigChange: ActionHandler<typeof VisStateActions.layerVisConfigChange>;
  layerTextLabelChange: ActionHandler<typeof VisStateActions.layerTextLabelChange>;
  removeLayer: ActionHandler<typeof VisStateActions.removeLayer>;
  duplicateLayer: ActionHandler<typeof VisStateActions.duplicateLayer>;
};

const PanelWrapper = styled.div`
  font-size: 12px;
  border-radius: 1px;
  margin-bottom: 8px;
  z-index: 1000;

  &.dragging {
    cursor: move;
  }
`;

LayerPanelFactory.deps = [LayerConfiguratorFactory, LayerPanelHeaderFactory];

function LayerPanelFactory(
  LayerConfigurator: ReturnType<typeof LayerConfiguratorFactory>,
  LayerPanelHeader: ReturnType<typeof LayerPanelHeaderFactory>
): React.ComponentType<LayerPanelProps> {
  class LayerPanel extends Component<LayerPanelProps> {
    updateLayerConfig = (newProp: Partial<LayerBaseConfig>) => {
      this.props.layerConfigChange(this.props.layer, newProp);
    };

    updateLayerType = (newType: string) => {
      this.props.layerTypeChange(this.props.layer, newType);
    };

    updateLayerVisConfig = (newVisConfig: Partial<LayerVisConfig>) => {
      this.props.layerVisConfigChange(this.props.layer, newVisConfig);
    };

    updateLayerColorUI = (...args: [string, NestedPartial<ColorUI>]) => {
      this.props.layerColorUIChange(this.props.layer, ...args);
    };

    updateLayerTextLabel = (...args: [number | 'all', string, any]) => {
      this.props.layerTextLabelChange(this.props.layer, ...args);
    };

    updateLayerVisualChannelConfig = (newConfig: Partial<LayerBaseConfig>, channel: string) => {
      this.props.layerVisualChannelConfigChange(this.props.layer, newConfig, channel);
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
      const {
        layer: {
          config: {isConfigActive}
        }
      } = this.props;
      this.updateLayerConfig({isConfigActive: !isConfigActive});
    };

    _removeLayer = e => {
      e.stopPropagation();
      this.props.removeLayer(this.props.idx);
    };

    _duplicateLayer = e => {
      e.stopPropagation();
      this.props.duplicateLayer(this.props.idx);
    };

    render() {
      const {layer, datasets, isDraggable, layerTypeOptions} = this.props;
      const {config} = layer;
      const {isConfigActive} = config;

      return (
        <PanelWrapper
          active={isConfigActive}
          className={`layer-panel ${this.props.className}`}
          style={this.props.style}
          onMouseDown={this.props.onMouseDown}
          onTouchStart={this.props.onTouchStart}
        >
          <LayerPanelHeader
            isConfigActive={isConfigActive}
            layerId={layer.id}
            isVisible={config.isVisible}
            label={config.label}
            labelRCGColorValues={config.dataId ? datasets[config.dataId].color : null}
            layerType={layer.type}
            onToggleEnableConfig={this._toggleEnableConfig}
            onToggleVisibility={this._toggleVisibility}
            onUpdateLayerLabel={this._updateLayerLabel}
            onRemoveLayer={this._removeLayer}
            onDuplicateLayer={this._duplicateLayer}
            isDragNDropEnabled={isDraggable}
          />
          {isConfigActive && (
            <LayerConfigurator
              layer={layer}
              datasets={datasets}
              layerTypeOptions={layerTypeOptions}
              openModal={this.props.openModal}
              updateLayerColorUI={this.updateLayerColorUI}
              updateLayerConfig={this.updateLayerConfig}
              updateLayerVisualChannelConfig={this.updateLayerVisualChannelConfig}
              updateLayerType={this.updateLayerType}
              updateLayerTextLabel={this.updateLayerTextLabel}
              updateLayerVisConfig={this.updateLayerVisConfig}
            />
          )}
        </PanelWrapper>
      );
    }
  }

  return LayerPanel;
}

export default LayerPanelFactory;
