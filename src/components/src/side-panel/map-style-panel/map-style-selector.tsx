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

import React, {ComponentType} from 'react';
import styled from 'styled-components';
import classnames from 'classnames';

import {FormattedMessage} from '@kepler.gl/localization';
import {MapStyle} from '@kepler.gl/reducers';
import {NO_BASEMAP_ICON} from '@kepler.gl/constants';
import {MapStyles} from '@kepler.gl/types';

import {ArrowDown} from '../../common/icons';
import PanelHeaderActionFactory from '../panel-header-action';
import {
  PanelHeaderContent,
  PanelHeaderTitle,
  PanelLabel,
  StyledPanelHeader,
  StyledPanelHeaderProps
} from '../../common/styled-components';
import {BaseProps} from '../../common/icons';
import {PanelHeaderActionIcon} from '../panel-header-action';

type StyledMapDropdownProps = StyledPanelHeaderProps & {hasCallout: boolean};

const StyledMapDropdown = styled(StyledPanelHeader)<StyledMapDropdownProps>`
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

  &.selected {
    outline: 1px solid #caf2f4;
  }

  /* show callout dot if props.hasCallout and theme provides calloutDot base styles */
  :after {
    ${({theme}) => theme.calloutDot}
    background-color: #00ACF5;
    top: 12px;
    left: 15px;
    display: ${({theme, hasCallout}) => (theme.calloutDot && hasCallout ? 'block' : 'none')};
  }

  .custom-style-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;

export type MapStyleSelectorProps = {
  mapStyle: MapStyle;
  onChange: (payload: string) => void;
  toggleActive: () => void;
  isSelecting: boolean;
  customMapStylesActions?: Record<
    string,
    {
      id: string;
      IconComponent: PanelHeaderActionIcon;
      tooltip: string;
      onClick: () => void;
    }[]
  >;
  actionIcons?: Record<string, ComponentType<Partial<BaseProps>>>;
};

MapStyleSelectorFactory.deps = [PanelHeaderActionFactory];

function MapStyleSelectorFactory(PanelHeaderAction: ReturnType<typeof PanelHeaderActionFactory>) {
  const defaultActionIcons = {
    arrowDown: ArrowDown
  };

  const MapStyleSelector = ({
    mapStyle,
    onChange,
    toggleActive,
    isSelecting,
    customMapStylesActions,
    actionIcons = defaultActionIcons
  }: MapStyleSelectorProps) => {
    const {mapStyles, styleType}: {mapStyles: MapStyles; styleType: string} = mapStyle;

    return (
      <div>
        <PanelLabel>
          <FormattedMessage id={'mapManager.mapStyle'} />
        </PanelLabel>

        {Object.values(mapStyles).map(
          ({id, custom, icon = NO_BASEMAP_ICON, label = 'Untitled'}) => (
            <StyledMapDropdown
              className={classnames('map-dropdown-option', {
                collapsed: !isSelecting && id !== styleType,
                selected: isSelecting && id === styleType
              })}
              key={id}
              onClick={isSelecting ? () => onChange(id) : toggleActive}
              hasCallout={Boolean(custom)}
            >
              <PanelHeaderContent className="map-title-block">
                <img className="map-preview" src={icon} />
                <PanelHeaderTitle className="map-preview-name">{label}</PanelHeaderTitle>
              </PanelHeaderContent>
              {!isSelecting ? (
                <PanelHeaderAction
                  className="map-dropdown-option__enable-config"
                  id="map-enable-config"
                  IconComponent={actionIcons.arrowDown}
                  tooltip={'tooltip.selectBaseMapStyle'}
                  onClick={toggleActive}
                />
              ) : null}
              {isSelecting && custom ? (
                <div className="custom-style-actions">
                  {(customMapStylesActions?.[id] || []).map(action => (
                    <PanelHeaderAction
                      key={action.id}
                      className="map-dropdown-option__enable-config"
                      id={action.id}
                      IconComponent={action.IconComponent}
                      tooltip={action.tooltip}
                      onClick={e => {
                        e.stopPropagation();
                        action.onClick();
                      }}
                    />
                  ))}
                </div>
              ) : null}
            </StyledMapDropdown>
          )
        )}
      </div>
    );
  };

  return MapStyleSelector;
}

export default MapStyleSelectorFactory;
