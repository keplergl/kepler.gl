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

import React from 'react';
import styled from 'styled-components';
import {
  ArrowRight
} from 'components/common/icons';
import Switch from 'components/common/switch';

const StyledItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 12px;
  line-height: 14px;
  padding: 8px;
  height: 32px;
  text-transform: capitalize;
  background-color: ${props => props.theme.dropdownListBgd};
  width: 110px;
  position: relative;
  ${props => props.color ? `border-left: 3px solid rgb(${props.color});` : ''}
  
  :hover {
    cursor: pointer;
    color: ${props => props.theme.textColorHl};
    .nested-group {
      display: block;
    }
  }
  
  .label {
    margin-left: 8px;
  }
  
  .label-icon {
    margin-left: auto;
  }
  
  .nested-group {
    width: 110px;
    display: none;
    color: ${props => props.theme.textColor};
    position: absolute;
    left: 110px;
    top: 0px;
    padding-left: 4px;
  }
`;

const renderChildren = (child, index) => React.cloneElement(child, {
  onClick: () => {
    if (React.isValidElement(child)) {
      if (child.props.onClick) {
        child.props.onClick(index);
      }
    }
  },
  className: 'action-panel-item'
});

export const ActionPanelItem = React.memo(({
  children,
  color,
  className,
  Icon,
  label,
  onClick,
  isSelection,
  style}) => (
  <StyledItem style={style} className={className} onClick={!isSelection ? onClick : null} color={color}>
    {Icon ? (
      <div className="icon">
        <Icon height="16px"/>
      </div>
      ) : null}
    {isSelection ? (
      <Switch
        checked={false}
        onChange={onClick}
        id={`switch-${label}`}
      />
    ) : null}
    <span className="label">{label}</span>
    {children && children.length ? ( <div className="label-icon">
      <ArrowRight height="16px" />
    </div>) : null}
    {children && children.length ? (
      <div className="nested-group">
        {React.Children.map(children, renderChildren)}
      </div>
    ) : null}
  </StyledItem>
));

ActionPanelItem.displayName = 'ActionPanelItem';

const StyledActionPanel = styled.div`
  display: flex;
  flex-direction: ${props => props.direction};
  box-shadow: ${props => props.theme.dropdownListShadow};
  transition: ${props => props.theme.transitionSlow};
  color: ${props => props.theme.textColor};

  .action-panel-item {
    ${props => props.direction === 'column' ?
      `border-bottom: 1px solid ${props.theme.panelHeaderIcon}`
      :
      `border-right: 1px solid ${props.theme.panelHeaderIcon}`
    }
  }
`;

// React compound element https://medium.com/@Dane_s/react-js-compound-components-a6e54b5c9992
const ActionPanel = ({children, className, direction = 'column', onClick}) => (
  <StyledActionPanel className={className} direction={direction}>
    {React.Children.map(children, renderChildren)}
  </StyledActionPanel>
);

ActionPanel.displayName = 'ActionPanel';

export default ActionPanel;
