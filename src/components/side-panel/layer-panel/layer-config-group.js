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

import React, {Component} from 'react';
import {polyfill} from 'react-lifecycles-compat';
import styled from 'styled-components';
import classnames from 'classnames';
import Switch from 'components/common/switch';
import InfoHelper from 'components/common/info-helper';
import {VertThreeDots} from 'components/common/icons';

export const StyledLayerConfigGroupLabel = styled.div`
  border-left: 2px solid ${props => props.theme.labelColor};
  line-height: 12px;
  margin-left: -12px;
  padding-left: 10px;
  display: flex;
  align-items: center;

  span {
    color: ${props => props.theme.textColor};
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.2px;
    text-transform: capitalize;
  }
`;

export const StyledLayerConfigGroupAction = styled.div`
  display: flex;
  align-items: center;
  color: ${props => props.theme.textColor};
`;

export const ConfigGroupCollapsibleContent = styled.div.attrs({
  className: 'layer-config-group__content__collapsible'
})`
  overflow: visible;
  transition: max-height 0.3s ease-out;
  height: max-content;
  max-height: 600px;
`;

export const ConfigGroupCollapsibleHeader = styled.div.attrs({
  className: 'layer-config-group__header__collapsible'
})`
  overflow: visible;
  overflow: hidden;
  max-height: 0;
`;

export const StyledLayerConfigGroup = styled.div`
  padding-left: 18px;
  margin-bottom: 12px;

  &.collapsed {
    .layer-config-group__header__collapsible {
      overflow: visible;
      max-height: 600px;
    }
    .layer-config-group__content {

      .layer-config-group__content__collapsible {
        overflow: hidden;
        max-height: 0;
      }
    }
  }
`;

export const StyledConfigGroupHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;

  :hover {
    cursor: pointer;
    .layer-config-group__label {
      color: ${props => props.theme.textColorHl};
      border-left: 2px solid ${props => props.theme.textColorHl};
    }

    .layer-config-group__action {
      color: ${props => props.theme.textColorHl};
    }
  }
`;

const ConfigGroupContent = styled.div`
  &.disabled {
    opacity: 0.3;
    pointer-events: none;
    * {
      pointer-events: none;
    }
  }
`;

class LayerConfigGroup extends Component {
  static defaultProps = {
    collapsible: false,
    expanded: false,
    onChange: () => {},
    description: null
  };

  static getDerivedStateFromProps(props, state) {
    //  invoked after a component is instantiated as well as before it is re-rendered
    if (props.expanded && state.collapsed) {
      return {collapsed: false};
    }

    return null;
  }

  state = {
    collapsed: true
  };

  render() {
    const {
      label,
      children,
      property,
      layer,
      onChange,
      collapsible,
      description
    } = this.props;

    const {collapsed} = this.state;

    return (
      <StyledLayerConfigGroup
        className={classnames('layer-config-group', {collapsed})}
      >
        <StyledConfigGroupHeader
          className="layer-config-group__header"
          onClick={() => this.setState({collapsed: !this.state.collapsed})}
        >
          <StyledLayerConfigGroupLabel className="layer-config-group__label">
            <span>{label}</span>
            {description && (
              <InfoHelper
                description={description}
                id={label}
              />
            )}
          </StyledLayerConfigGroupLabel>
          <StyledLayerConfigGroupAction className="layer-config-group__action">
            {property ? (
              <Switch
                checked={layer.config.visConfig[property]}
                id={`${layer.id}-${property}`}
                onChange={() =>
                  onChange({[property]: !layer.config.visConfig[property]})
                }
              />
            ) : null}
            {collapsible ? <VertThreeDots height="18px" /> : null}
          </StyledLayerConfigGroupAction>
        </StyledConfigGroupHeader>
        <ConfigGroupContent
          className={classnames('layer-config-group__content', {
            disabled: property && !layer.config.visConfig[property]
          })}
        >
          {children}
        </ConfigGroupContent>
      </StyledLayerConfigGroup>
    );
  }
}

polyfill(LayerConfigGroup);

export default LayerConfigGroup;
