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

import React, {useCallback, useState, Component, ComponentType} from 'react';
import {useIntl} from 'react-intl';

import ActionPanel, {ActionPanelItem} from '../common/action-panel';
import styled from 'styled-components';
import onClickOutside from 'react-onclickoutside';
import classnames from 'classnames';
import {Trash, Layers, Copy, Checkmark} from '../common/icons';
import copy from 'copy-to-clipboard';
import {Layer} from '@kepler.gl/layers';
import {Filter} from '@kepler.gl/types';
import {Feature} from '@nebula.gl/edit-modes';
import {Datasets} from '@kepler.gl/table';

const LAYOVER_OFFSET = 4;

const StyledActionsLayer = styled.div`
  position: absolute;
  .layer-panel-item-disabled {
    color: ${props => props.theme.textColor};
  }
`;
const defaultActionIcons = {
  remove: Trash,
  layer: Layers,
  copy: Copy,
  copied: Checkmark
};
PureFeatureActionPanelFactory.deps = [];

export interface FeatureActionPanelProps {
  className?: string;
  datasets: Datasets;
  selectedFeature: Feature | null;
  position: {
    x: number;
    y: number;
  } | null;
  layers: Layer[];
  currentFilter?: Filter;
  onToggleLayer: (layer: Layer) => void;
  onDeleteFeature: () => void;
  onClose?: () => void;
  children?: React.ReactNode;
  actionIcons?: {
    [id: string]: React.ElementType;
  };
}

export function PureFeatureActionPanelFactory(): React.FC<FeatureActionPanelProps> {
  const FeatureActionPanel = ({
    className,
    datasets,
    selectedFeature,
    position,
    layers,
    currentFilter,
    onToggleLayer,
    onDeleteFeature,
    actionIcons = defaultActionIcons,
    children
  }: FeatureActionPanelProps) => {
    const [copied, setCopied] = useState(false);
    const {layerId = []} = currentFilter || {};
    const intl = useIntl();

    const copyGeometry = useCallback(() => {
      if (selectedFeature?.geometry) copy(JSON.stringify(selectedFeature.geometry));
      setCopied(true);
    }, [selectedFeature?.geometry]);

    if (!position) {
      return null;
    }

    return (
      <StyledActionsLayer
        className={classnames('feature-action-panel', className)}
        style={{
          top: `${position.y + LAYOVER_OFFSET}px`,
          left: `${position.x + LAYOVER_OFFSET}px`
        }}
      >
        <ActionPanel>
          <ActionPanelItem
            className="editor-layers-list"
            label={intl.formatMessage({id: 'editor.filterLayer', defaultMessage: 'Filter layers'})}
            Icon={actionIcons.layer}
          >
            {layers.length ? (
              layers.map((layer, index) => (
                <ActionPanelItem
                  key={index}
                  label={layer.config.label}
                  // @ts-ignore
                  color={datasets[layer.config.dataId].color}
                  isSelection={true}
                  isActive={layerId.includes(layer.id)}
                  onClick={() => onToggleLayer(layer)}
                  className="layer-panel-item"
                />
              ))
            ) : (
              <ActionPanelItem
                key={'no-layers'}
                label={intl.formatMessage({
                  id: 'editor.noLayersToFilter',
                  defaultMessage: 'No layers to filter'
                })}
                isSelection={false}
                isActive={false}
                className="layer-panel-item-disabled"
              />
            )}
          </ActionPanelItem>
          <ActionPanelItem
            label={intl.formatMessage({id: 'editor.copyGeometry', defaultMessage: 'Copy Geometry'})}
            className="delete-panel-item"
            Icon={copied ? actionIcons.copied : actionIcons.copy}
            onClick={copyGeometry}
          />
          {children}
          <ActionPanelItem
            label={intl.formatMessage({id: 'tooltip.delete', defaultMessage: 'Delete'})}
            className="delete-panel-item"
            Icon={actionIcons.remove}
            onClick={onDeleteFeature}
          />
        </ActionPanel>
      </StyledActionsLayer>
    );
  };

  FeatureActionPanel.displayName = 'FeatureActionPanel';
  FeatureActionPanel.defaultProps = {
    position: null,
    actionIcons: defaultActionIcons
  };

  return FeatureActionPanel;
}

FeatureActionPanelFactory.deps = PureFeatureActionPanelFactory.deps;

export default function FeatureActionPanelFactory(): ComponentType<FeatureActionPanelProps> {
  const PureFeatureActionPanel = PureFeatureActionPanelFactory();

  /**
   * FeatureActionPanel wrapped with a click-outside handler. Note that this needs to be a
   * class component, as react-onclickoutside does not handle functional components.
   */
  class ClickOutsideFeatureActionPanel extends Component<FeatureActionPanelProps> {
    handleClickOutside(e) {
      e.preventDefault();
      e.stopPropagation();
      this.props.onClose?.();
    }

    render() {
      return <PureFeatureActionPanel {...this.props} />;
    }
  }

  const clickOutsideConfig = {
    handleClickOutside: () => ClickOutsideFeatureActionPanel.prototype.handleClickOutside
  };

  return onClickOutside(ClickOutsideFeatureActionPanel, clickOutsideConfig);
}
