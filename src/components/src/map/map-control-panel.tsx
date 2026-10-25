// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {createContext, useCallback, useContext} from 'react';
import type {useDraggable} from '@dnd-kit/core';
import styled from 'styled-components';
import {FormattedMessage} from '@kepler.gl/localization';
import {CenterFlexbox, IconRoundSmall} from '../common/styled-components';
import {Close, Pin} from '../common/icons';
import Switch from '../common/switch';
import {MapState} from '@kepler.gl/types';
import {ActionHandler, toggleSplitMapViewport} from '@kepler.gl/actions';
import {MapSplitMode} from '@kepler.gl/constants';
import classNames from 'classnames';

// Internal wiring for floating panels; ordinary and exported headers stay static.
export const MapControlPanelDragContext = createContext<
  | (Pick<ReturnType<typeof useDraggable>, 'attributes' | 'listeners' | 'setActivatorNodeRef'> & {
      label: string;
    })
  | null
>(null);

const StyledMapControlPanel = styled.div`
  background-color: ${props => props.theme.mapPanelBackgroundColor};
  box-sizing: border-box;
  flex-grow: 1;
  width: ${props => props.theme.mapControl.width}px;
  z-index: 1;
  p {
    margin-bottom: 0;
  }
`;

type StyledMapControlPanelContentProps = {
  isExport?: boolean;
};

const StyledMapControlPanelContent = styled.div.attrs({
  className: 'map-control__panel-content'
})<StyledMapControlPanelContentProps>`
  ${props => props.theme.sidePanelScrollBar};
  box-sizing: border-box;
  max-height: 500px;
  min-height: 100px;
  width: 100%;
  overflow-x: hidden;
  overflow-y: ${props => (props.isExport ? 'hidden' : 'auto')};
`;

type MapControlPanelHeaderProps = {
  children?: React.ReactNode[];
};

const StyledMapControlPanelHeader = styled.div.attrs({
  className: 'map-control__panel-header'
})<MapControlPanelHeaderProps>`
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
  align-items: center;

  button:not(.map-control__panel-drag-title) {
    width: 18px;
    height: 18px;
  }
`;

const StyledDragTitle = styled.button.attrs({className: 'map-control__panel-drag-title'})`
  flex: 1;
  min-width: 0;
  height: 32px;
  margin: -6px 0 -6px -12px;
  padding: 6px 12px;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: move;
  touch-action: none;
  user-select: none;
  outline: none;
  &:focus-visible {
    outline: 2px solid ${props => props.theme.activeColor};
    outline-offset: -2px;
  }
`;

const StyledMapControlPanelHeaderSplitViewportsTools = styled(StyledMapControlPanelHeader).attrs({
  className: 'map-control__panel-split-viewport-tools'
})`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: self-start;
  height: unset;
`;

const StyledSBCenterFlexbox = styled(CenterFlexbox)`
  width: 100%;
  justify-content: space-between;
  flex-direction: row;
`;

interface StyledDisableableTextProps {
  disabled?: boolean;
}

const StyledDisableableText = styled.span<StyledDisableableTextProps>`
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  pointer-events: ${props => (props.disabled ? 'none' : 'all')};
`;

const StyledDisableableSwitch = styled(Switch)`
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  pointer-events: ${props => (props.disabled ? 'none' : 'all')};
`;

const StyledIcon = styled(IconRoundSmall)`
  color: ${props => props.theme.activeColor};
  background-color: transparent;

  &:hover {
    cursor: pointer;
    background-color: transparent;
    color: ${props => props.theme.floatingBtnActColor};
  }
`;

export type MapControlPanelProps = {
  header?: string;
  scale?: number;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onPinClick?: React.MouseEventHandler<HTMLDivElement>;
  pinnable?: boolean;
  disableClose?: boolean;
  isExport?: boolean;
  logoComponent?: Element;
  mapState?: MapState;
  onToggleSplitMapViewport?: ActionHandler<typeof toggleSplitMapViewport>;
  isViewportUnsyncAllowed?: boolean;
  children?: React.ReactNode;
  className?: string;
};

function MapControlPanelFactory() {
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
      logoComponent,
      mapState,
      onToggleSplitMapViewport,
      isViewportUnsyncAllowed,
      className = 'map-control-panel'
    }) => {
      const drag = useContext(MapControlPanelDragContext);
      const {isViewportSynced, isZoomLocked} = mapState || {};
      const onUnlockViewportChange = useCallback(() => {
        onToggleSplitMapViewport?.({isViewportSynced: !isViewportSynced});
      }, [isViewportSynced, onToggleSplitMapViewport]);

      const onSyncZoomChange = useCallback(() => {
        onToggleSplitMapViewport?.({isZoomLocked: !isZoomLocked});
      }, [isZoomLocked, onToggleSplitMapViewport]);

      return (
        <StyledMapControlPanel
          style={{
            transform: `scale(${scale})`,
            marginBottom: '8px !important'
          }}
          className={classNames('map-control-panel', className)}
        >
          {mapState?.isSplit &&
          isViewportUnsyncAllowed &&
          mapState?.mapSplitMode !== MapSplitMode.SWIPE_COMPARE ? (
            <StyledMapControlPanelHeaderSplitViewportsTools>
              <StyledSBCenterFlexbox style={{paddingBottom: '6px'}}>
                <FormattedMessage id="Unlock Viewport" />
                <StyledDisableableSwitch
                  checked={!mapState?.isViewportSynced}
                  id="unlock-viewport-toggle"
                  onChange={onUnlockViewportChange}
                />
              </StyledSBCenterFlexbox>
              <StyledSBCenterFlexbox>
                <StyledDisableableText disabled={mapState?.isViewportSynced}>
                  <FormattedMessage id="Sync Zoom" />
                </StyledDisableableText>
                <StyledDisableableSwitch
                  checked={mapState?.isZoomLocked}
                  id="sync-zoom-toggle"
                  onChange={onSyncZoomChange}
                  disabled={mapState?.isViewportSynced}
                />
              </StyledSBCenterFlexbox>
            </StyledMapControlPanelHeaderSplitViewportsTools>
          ) : null}

          <StyledMapControlPanelHeader>
            {
              (isExport && logoComponent ? (
                logoComponent
              ) : header && drag && !isExport ? (
                <StyledDragTitle
                  type="button"
                  ref={drag.setActivatorNodeRef}
                  {...drag.attributes}
                  {...drag.listeners}
                  aria-label={`Move ${drag.label}`}
                >
                  <FormattedMessage id={header} />
                </StyledDragTitle>
              ) : header ? (
                <span style={{verticalAlign: 'middle'}}>
                  <FormattedMessage id={header} />
                </span>
              ) : null) as React.ReactNode
            }
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
          <StyledMapControlPanelContent isExport={isExport}>
            {children}
          </StyledMapControlPanelContent>
        </StyledMapControlPanel>
      );
    }
  );

  MapControlPanel.displayName = 'MapControlPanel';

  return MapControlPanel;
}

export default MapControlPanelFactory;
