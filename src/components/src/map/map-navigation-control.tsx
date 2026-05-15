// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useContext, useMemo} from 'react';
import styled from 'styled-components';
import {MapViewStateContext, MapViewStateContextType} from '../map-view-state-context';
import {MapState} from '@kepler.gl/types';
import {MapStateActions} from '@kepler.gl/actions';
import {getApplicationConfig} from '@kepler.gl/utils';

export type MapNavigationControlProps = {
  mapState: MapState;
  mapIndex: number;
  mapStateActions: typeof MapStateActions;
  isSplit: boolean;
};

const StyledMapNavigationControl = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
  align-items: flex-end;
  margin-top: 12px;
`;

const NavButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.16);
`;

interface NavButtonProps {
  $isFirst?: boolean;
  $isLast?: boolean;
}

const NavButton = styled.button<NavButtonProps>`
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.floatingBtnBgd};
  color: ${props => props.theme.floatingBtnColor};
  border-top: ${props => (props.$isFirst ? 'none' : `1px solid ${props.theme.panelBorderColor}`)};
  border-radius: ${props =>
    props.$isFirst ? '4px 4px 0 0' : props.$isLast ? '0 0 4px 4px' : '0'};

  &:hover {
    background-color: ${props => props.theme.floatingBtnBgdHover};
    color: ${props => props.theme.floatingBtnActColor};
  }

  &:active {
    background-color: ${props => props.theme.floatingBtnBgdHover};
  }

  svg {
    margin-right: 0;
  }
`;

const CompassButton = styled.button`
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.floatingBtnBgd};
  color: ${props => props.theme.floatingBtnColor};
  border-radius: 4px;
  box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.16);

  &:hover {
    background-color: ${props => props.theme.floatingBtnBgdHover};
    color: ${props => props.theme.floatingBtnActColor};
  }

  &:active {
    background-color: ${props => props.theme.floatingBtnBgdHover};
  }
`;

MapNavigationControlFactory.deps = [];

export default function MapNavigationControlFactory() {
  const MapNavigationControl: React.FC<MapNavigationControlProps> = ({
    mapState,
    mapIndex,
    mapStateActions,
    isSplit
  }) => {
    const {getInternalViewState} = useContext<MapViewStateContextType>(MapViewStateContext);
    const viewState = getInternalViewState(mapIndex);

    const isEnabled = getApplicationConfig().enableMapNavigationControl;

    const handleZoomIn = useCallback(() => {
      const currentZoom = viewState?.zoom ?? mapState.zoom;
      let nextZoom = currentZoom + 1;
      if (mapState.maxZoom != null) {
        nextZoom = Math.min(mapState.maxZoom, nextZoom);
      }
      mapStateActions.updateMap({zoom: nextZoom}, mapIndex);
    }, [viewState, mapState, mapStateActions, mapIndex]);

    const handleZoomOut = useCallback(() => {
      const currentZoom = viewState?.zoom ?? mapState.zoom;
      let nextZoom = currentZoom - 1;
      if (mapState.minZoom != null) {
        nextZoom = Math.max(mapState.minZoom, nextZoom);
      }
      mapStateActions.updateMap({zoom: nextZoom}, mapIndex);
    }, [viewState, mapState, mapStateActions, mapIndex]);

    const handleCompassClick = useCallback(() => {
      const currentBearing = viewState?.bearing ?? mapState.bearing;
      const currentPitch = viewState?.pitch ?? mapState.pitch;
      if (currentBearing === 0 && currentPitch === 0) {
        return;
      }
      if (currentBearing !== 0) {
        mapStateActions.updateMap({bearing: 0}, mapIndex);
      } else {
        mapStateActions.updateMap({bearing: 0, pitch: 0}, mapIndex);
      }
    }, [viewState, mapState, mapStateActions, mapIndex]);

    const rotation = useMemo(() => {
      const bearing = -(viewState?.bearing ?? mapState.bearing ?? 0);
      const pitch = viewState?.pitch ?? mapState.pitch ?? 0;
      return {bearing, pitch};
    }, [viewState, mapState]);

    if (!isEnabled) {
      return null;
    }

    return (
      <StyledMapNavigationControl className="map-navigation-control">
        <NavButtonGroup>
          <NavButton
            $isFirst
            onClick={handleZoomIn}
            title="Zoom in"
            className="map-navigation-control__zoom-in"
          >
            <svg
              fill="none"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </NavButton>
          <NavButton
            $isLast
            onClick={handleZoomOut}
            title="Zoom out"
            className="map-navigation-control__zoom-out"
          >
            <svg
              fill="none"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path d="M19.5 12h-15" />
            </svg>
          </NavButton>
        </NavButtonGroup>
        {mapState.dragRotate ? (
          <CompassButton
            onClick={handleCompassClick}
            title="Reset bearing/pitch"
            className="map-navigation-control__compass"
          >
            <div style={{transform: `rotateX(${rotation.pitch}deg)`}}>
              <svg fill="none" width="18" height="18" viewBox="0 0 16 16">
                <g transform={`rotate(${rotation.bearing},8,8)`}>
                  <path d="M5 8.00006L7.99987 0L10.9997 8.00006H5Z" fill="#F05C44" />
                  <path
                    d="M11.0002 7.99994L8.00038 16L5.00051 7.99994L11.0002 7.99994Z"
                    fill="#aaa"
                  />
                </g>
              </svg>
            </div>
          </CompassButton>
        ) : null}
      </StyledMapNavigationControl>
    );
  };

  MapNavigationControl.displayName = 'MapNavigationControl';
  return React.memo(MapNavigationControl);
}
