// Copyright (c) 2019 Uber Technologies, Inc.
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

import React, {PureComponent} from 'react';
import ActionPanel, {ActionPanelItem} from 'components/common/action-panel';
import styled from 'styled-components';
import onClickOutside from 'react-onclickoutside';
import PropTypes from 'prop-types';
import {
  Trash,
  Layers
} from 'components/common/icons';

const LAYOVER_OFFSET = 4;

const StyledActionsLayer = styled.div`
  position: absolute;
  top: ${props => props.position.y + LAYOVER_OFFSET}px;
  left: ${props => props.position.x + LAYOVER_OFFSET}px;
`;

class FeatureActionPanel extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    datasets: PropTypes.object.isRequired,
    position: PropTypes.object.isRequired,
    layers: PropTypes.arrayOf(PropTypes.object).isRequired,
    onClose: PropTypes.func.isRequired,
    onDeleteFeature: PropTypes.func.isRequired,
    onToggleLayer: PropTypes.func.isRequired
  };

  handleClickOutside = e => {
    e.preventDefault();
    e.stopPropagation();
    this.props.onClose();
  };

  render() {
    const {
      className,
      datasets,
      position,
      layers,
      onToggleLayer,
      onDeleteFeature
    } = this.props;

    return (
      <StyledActionsLayer className={className} position={position}>
        <ActionPanel>
          <ActionPanelItem label="layer" Icon={Layers}>
            {layers.map((layer, index) => (
              <ActionPanelItem
                key={index}
                label={layer.config.label}
                color={datasets[layer.config.dataId].color}
                isSelection
                onClick={() => onToggleLayer(layer)}
              />
            ))}
          </ActionPanelItem>
          <ActionPanelItem
            label="delete"
            Icon={Trash}
            onClick={onDeleteFeature}
          />
        </ActionPanel>
      </StyledActionsLayer>
    )
  }
}

export default onClickOutside(FeatureActionPanel);
