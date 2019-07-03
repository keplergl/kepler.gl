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

const StyledPanelDropdown = styled.div`
  display: flex;
  flex-direction: ${props => props.direction};
  background-color: ${props => props.theme.dropdownListBgd};
  box-shadow: ${props => props.theme.dropdownListShadow};
  font-size: 11px;
  padding: ${props => props.direction === 'row' ? '16px 0;' : '0;'};
  transition: ${props => props.theme.transitionSlow};
  margin-top: ${props => props.show ? '6px' : '20px'};
  opacity: ${props => props.show ? 1 : 0};
  transform: translateX(calc(-50% + 20px));
  pointer-events:  ${props => props.show ? 'all' : 'none'};
  z-index: 1000;

  .save-export-dropdown__inner {
    box-shadow: none;
    background-color: transparent;
    display: flex;
  }

  .save-export-dropdown__item {
    align-items: center;
    border-right: 1px solid ${props => props.theme.panelHeaderIcon};
    padding: 0 22px;
    display: flex;
    flex-direction: column;


    :hover {
      cursor: pointer;
      color: ${props => props.theme.textColorHl};
    }

    &:last-child {
      border-right: 0;
    }
    
    ${props => props.direction === 'column' ? `
      border-bottom: 1px solid ${props.theme.panelHeaderIcon};
      padding: 8px 22px;
      &:last-child {
        border-bottom: 0;
      }
      ` : null
    };
  }

  .save-export-dropdown__title {
    white-space: nowrap;
    margin-top: 4px;
  }
`;

const Toolbar = React.memo(({children, className, show, direction = 'row'}) => (
  <StyledPanelDropdown className={`${className || ''} save-export-dropdown`} show={show} direction={direction}>
    {children}
  </StyledPanelDropdown>
));

export default Toolbar;
