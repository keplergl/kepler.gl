// Copyright (c) 2020 Uber Technologies, Inc.
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

import styled from 'styled-components';

const Toolbar = styled.div`
  display: flex;
  flex-direction: row;
  background-color: ${props => props.theme.dropdownListBgd};
  box-shadow: ${props => props.theme.dropdownListShadow};
  font-size: 11px;
  padding: 16px 0;
  transition: ${props => props.theme.transitionSlow};
  margin-top: ${props => (props.show ? '6px' : '20px')};
  opacity: ${props => (props.show ? 1 : 0)};
  transform: translateX(calc(-50% + 20px));
  pointer-events: ${props => (props.show ? 'all' : 'none')};
  z-index: 1000;

  .panel-header-dropdown__inner {
    box-shadow: none;
    background-color: transparent;
    display: flex;
  }

  .toolbar-item {
    align-items: center;
    border-right: 1px solid ${props => props.theme.panelHeaderIcon};
    padding: 0 22px;
    display: flex;
    flex-direction: column;

    .toolbar-item__title {
      white-space: nowrap;
      margin-top: 4px;
    }

    :hover {
      cursor: pointer;
      color: ${props => props.theme.textColorHl};
    }

    &:last-child {
      border-right: 0;
    }
  }
`;

Toolbar.displayName = 'Toolbar';

export default Toolbar;
