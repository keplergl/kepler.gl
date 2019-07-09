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
import styled from 'styled-components';
import classnames from 'classnames';
import Switch from 'components/common/switch';
import {VertThreeDots} from 'components/common/icons';

export const StyledLayerConfigGroupLabel = styled.div`
  border-left: 2px solid ${props => props.theme.labelColor};
  color: ${props => props.theme.textColor};
  font-size: 12px;
  font-weight: 500;
  line-height: 12px;
  margin-left: -12px;
  padding-left: 10px;
  text-transform: capitalize;
  letter-spacing: 0.2px;
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
`

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
      color:  ${props => props.theme.textColorHl};
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

export default class LayerConfigGroup extends Component {

  static defaultProps = {
    collapsible: false,
    expanded: false,
    onChange: () => {}
  };

  state = {
    collapsed: true
  };

  componentDidMount() {
    this._setCollapseState(this.props.expanded);
  }

  componentWillReceiveProps(nextProps) {
    this._setCollapseState(nextProps.expanded);
  }

  _setCollapseState(expanded) {
    // if props,expanded, and state collapsed, set collapsed to be false
    if (expanded && this.state.collapsed) {
      this.setState({collapsed: false});
    }
  }

  render() {
    const {
      label,
      children,
      property,
      layer,
      onChange,
      collapsible
    } = this.props;

    const {collapsed} = this.state;

    return (
      <StyledLayerConfigGroup className={classnames('layer-config-group', {collapsed})}>
        <StyledConfigGroupHeader className="layer-config-group__header"
          onClick={() => this.setState({collapsed: !this.state.collapsed})}
        >
          <StyledLayerConfigGroupLabel className="layer-config-group__label">
            {label}
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
            {collapsible ? <VertThreeDots height="18px"/> : null}
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

