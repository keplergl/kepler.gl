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

import styled from "styled-components";import React from 'react';
import classnames from 'classnames';
import {ArrowDown} from 'components/common/icons';
import PanelHeaderAction from 'components/side-panel/panel-header-action';

import {
  PanelLabel,
  PanelHeaderTitle,
  PanelHeaderContent,
  StyledPanelHeader
} from 'components/common/styled-components';

const StyledMapDropdown = styled(StyledPanelHeader)`
  height: 48px;
  margin-bottom: 5px;
  opacity: 1;
  position: relative;
  transition: opacity 0.05s ease-in, height 0.25s ease-out;

  &.collapsed {
    height: 0;
    margin-bottom: 0;
    opacity: 0;
  }

  :hover {
    cursor: pointer;
    background-color: ${props => props.theme.panelBackgroundHover};
  }

  .map-title-block img {
    margin-right: 12px;
  }

  .map-preview {
    border-radius: 3px;
    height: 30px;
    width: 40px;
  }
`;

function MapStyleSelectorFactory() {
  const MapStyleSelector = ({mapStyle, onChange, toggleActive, isSelecting}) => (
    <div>
      <PanelLabel>Map style</PanelLabel>
      {Object.keys(mapStyle.mapStyles).map(op => (
        <StyledMapDropdown
          className={classnames('map-dropdown-option', {
            collapsed: !isSelecting && mapStyle.styleType !== op
          })}
          key={op}
          onClick={isSelecting ? () => onChange(op) : toggleActive}
        >
          <PanelHeaderContent className="map-title-block">
            <img className="map-preview" src={mapStyle.mapStyles[op].icon} />
            <PanelHeaderTitle className="map-preview-name">
              {mapStyle.mapStyles[op].label}
            </PanelHeaderTitle>
          </PanelHeaderContent>
          {!isSelecting ? (
            <PanelHeaderAction
              className="map-dropdown-option__enable-config"
              id="map-enable-config"
              IconComponent={ArrowDown}
              tooltip={'Select Base Map Style'}
              onClick={toggleActive}
            />
          ) : null}
        </StyledMapDropdown>
      ))}
    </div>
  );

  return MapStyleSelector;
}

export default MapStyleSelectorFactory;
