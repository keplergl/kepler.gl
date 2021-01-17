// Copyright (c) 2021 Uber Technologies, Inc.
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
import {FormattedMessage} from 'localization';

const StyledDiv = styled.div.attrs({
  className: 'toolbar-item'
})`
  color: ${props =>
    props.active ? props.theme.toolbarItemIconHover : props.theme.panelHeaderIcon};
  padding: 12px 20px;
  align-items: center;
  display: flex;
  flex-direction: column;
  width: 110px;
  justify-content: space-between;
  border: 1px solid ${props => (props.active ? props.theme.toolbarItemBorderHover : 'transparent')};
  border-radius: ${props => props.theme.toolbarItemBorderRaddius};
  background-color: ${props =>
    props.active ? props.theme.toolbarItemBgdHover : props.theme.dropdownListBgd};

  svg {
    margin-bottom: 4px;
  }
  .toolbar-item__title {
    white-space: nowrap;
    color: ${props => props.theme.textColorHl};
  }

  :hover {
    background-color: ${props => props.theme.toolbarItemBgdHover};
    border-color: ${props => props.theme.toolbarItemBorderHover};
    svg {
      color: ${props => props.theme.toolbarItemIconHover};
    }
    cursor: pointer;
  }
`;

/** @type {typeof import('./toolbar-item').ToolbarItem} */
const ToolbarItem = React.memo(props => (
  <StyledDiv
    id={props.id}
    className={props.className}
    active={props.active}
    onClick={e => {
      e.stopPropagation();
      e.preventDefault();
      if (typeof props.onClose === 'function') {
        props.onClose();
      }
      props.onClick(e);
    }}
  >
    {props.icon && <props.icon />}
    <div className="toolbar-item__title">
      <FormattedMessage id={props.label} />
    </div>
  </StyledDiv>
));

ToolbarItem.displayName = 'ToolbarItem';

export default ToolbarItem;
