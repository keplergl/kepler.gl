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

import React, {useCallback, useState} from 'react';
import {useIntl} from 'react-intl';

import ActionPanel, {ActionPanelItem} from 'components/common/action-panel';
import styled from 'styled-components';
import onClickOutside from 'react-onclickoutside';
import classnames from 'classnames';
import {Trash, Layers, Copy, Checkmark} from 'components/common/icons';
import copy from 'copy-to-clipboard';
import {Layer} from '@kepler.gl/layers';
import {Filter} from '@kepler.gl/types';
import {Feature} from '@nebula.gl/edit-modes';
import {Datasets} from 'reducers/table-utils/kepler-table';

const LAYOVER_OFFSET = 4;

const StyledActionsLayer = styled.div`
  position: absolute;
`;

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
  onToggleLayer: (l: Layer) => void;
  onDeleteFeature: () => void;
  onClose: () => void;
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
    onDeleteFeature
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
            Icon={Layers}
          >
            {layers.map((layer, index) => (
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
            ))}
          </ActionPanelItem>
          <ActionPanelItem
            label={intl.formatMessage({id: 'editor.copyGeometry', defaultMessage: 'Copy Geometry'})}
            className="delete-panel-item"
            Icon={copied ? Checkmark : Copy}
            onClick={copyGeometry}
          />

          <ActionPanelItem
            label={intl.formatMessage({id: 'tooltip.delete', defaultMessage: 'Delete'})}
            className="delete-panel-item"
            Icon={Trash}
            onClick={onDeleteFeature}
          />
        </ActionPanel>
      </StyledActionsLayer>
    );
  };

  FeatureActionPanel.displayName = 'FeatureActionPanel';
  FeatureActionPanel.defaultProps = {
    position: null
  };

  return FeatureActionPanel;
}

FeatureActionPanelFactory.deps = PureFeatureActionPanelFactory.deps;

export default function FeatureActionPanelFactory() {
  const PureFeatureActionPanel = PureFeatureActionPanelFactory();

  const ClickOutsideFeatureActionPanel: React.FC<FeatureActionPanelProps> = props => {
    // @ts-ignore
    ClickOutsideFeatureActionPanel.handleClickOutside = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      props.onClose?.();
    };
    return <PureFeatureActionPanel {...props} />;
  };

  const clickOutsideConfig = {
    // @ts-ignore
    handleClickOutside: () => ClickOutsideFeatureActionPanel.handleClickOutside
  };

  return onClickOutside(ClickOutsideFeatureActionPanel, clickOutsideConfig);
}
