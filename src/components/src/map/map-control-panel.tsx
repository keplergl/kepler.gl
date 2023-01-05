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

import React from 'react';
import styled from 'styled-components';
import {FormattedMessage} from '@kepler.gl/localization';
import {IconRoundSmall} from '../common/styled-components';
import {Close, Pin} from '../common/icons';

const StyledMapControlPanel = styled.div`
  background-color: ${props => props.theme.mapPanelBackgroundColor};
  flex-grow: 1;
  z-index: 1;
  p {
    margin-bottom: 0;
  }
`;

const StyledMapControlPanelContent = styled.div.attrs({
  className: 'map-control__panel-content'
})`
  ${props => props.theme.dropdownScrollBar};
  max-height: 500px;
  min-height: 100px;
  min-width: ${props => props.theme.mapControl.width}px;
  overflow: auto;
`;

const StyledMapControlPanelHeader = styled.div.attrs({
  className: 'map-control__panel-header'
})`
  display: flex;
  justify-content: space-between;
  background-color: ${props => props.theme.mapPanelHeaderBackgroundColor};
  height: 32px;
  padding: 6px 12px;
  font-family: ${props => props.theme.fontFamily};
  font-size: 11px;
  color: ${props => props.theme.titleTextColor};
  position: relative;
  box-sizing: border-box;

  button {
    width: 18px;
    height: 18px;
  }
`;

const StyledIcon = styled(IconRoundSmall)`
  color: ${props => props.theme.activeColor};
  background-color: transparent;

  :hover {
    cursor: pointer;
    background-color: transparent;
    color: ${props => props.theme.linkBtnColor};
  }
`;

export type MapControlPanelProps = {
  header?: string;
  scale?: number;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  onPinClick?: React.MouseEventHandler<HTMLDivElement>;
  pinnable?: boolean;
  disableClose?: boolean;
  isExport?: boolean;
  logoComponent?: Element;
};

function MapControlPanelFactory() {
  /** @type {import('./map-control-panel').MapControlPanelComponent} */
  const MapControlPanel: React.FC<MapControlPanelProps> = React.memo(
    ({
      children,
      header,
      pinnable,
      disableClose,
      onPinClick,
      onClick,
      scale = 1,
      isExport,
      logoComponent
    }) => (
      <StyledMapControlPanel
        className="map-control-panel"
        style={{
          transform: `scale(${scale})`,
          marginBottom: '8px !important'
        }}
      >
        <StyledMapControlPanelHeader>
          {isExport && logoComponent ? (
            logoComponent
          ) : header ? (
            <span style={{verticalAlign: 'middle'}}>
              <FormattedMessage id={header} />
            </span>
          ) : null}
          {isExport ? null : (
            <>
              {pinnable && (
                <StyledIcon className="pin-map-control-item" onClick={onPinClick}>
                  <Pin height="16px" />
                </StyledIcon>
              )}
              {disableClose ? null : (
                <StyledIcon className="close-map-control-item" onClick={onClick}>
                  <Close height="16px" />
                </StyledIcon>
              )}
            </>
          )}
        </StyledMapControlPanelHeader>
        <StyledMapControlPanelContent>{children}</StyledMapControlPanelContent>
      </StyledMapControlPanel>
    )
  );

  MapControlPanel.displayName = 'MapControlPanel';

  return MapControlPanel;
}

export default MapControlPanelFactory;
