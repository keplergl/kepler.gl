// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {ComponentType, useCallback, useMemo, useState, useRef} from 'react';
import classnames from 'classnames';
import styled from 'styled-components';
import {Cube3d, Globe} from '../common/icons';
import {MapControlButton} from '../common/styled-components';
import MapControlTooltipFactory from './map-control-tooltip';
import {MapControls, MapState} from '@kepler.gl/types';
import {MapViewMode} from '@kepler.gl/constants';
import {FormattedMessage} from '@kepler.gl/localization';

Toggle3dButtonFactory.deps = [MapControlTooltipFactory];

interface Toggle3dButtonIcons {
  cube: ComponentType<any>;
  globe: ComponentType<any>;
}

export type Toggle3dButtonProps = {
  dragRotate: boolean;
  onTogglePerspective: () => void;
  onSetMapViewMode?: (payload: {mapViewMode: string}) => void;
  actionIcons: Toggle3dButtonIcons;
  mapControls: MapControls;
  mapState?: MapState;
};

const StyledViewModeMenu = styled.div`
  position: absolute;
  right: 100%;
  top: 0;
  margin-right: 4px;
  display: flex;
  flex-direction: row;
  gap: 2px;
  background: ${props => props.theme.mapControlMapStylesBackgroundColor || props.theme.sidePanelBg};
  border-radius: 4px;
  padding: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
`;

const StyledMenuButton = styled.div<{$active?: boolean}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 4px;
  cursor: pointer;
  background: ${props => (props.$active ? props.theme.activeColor : 'transparent')};
  color: ${props => (props.$active ? props.theme.activeColorLT || '#fff' : props.theme.textColor)};
  &:hover {
    background: ${props =>
      props.$active ? props.theme.activeColor : props.theme.panelBackgroundHover};
  }
`;

const StyledLabel = styled.span`
  font-size: 10px;
  margin-top: 2px;
  color: ${props => props.theme.textColor};
`;

const StyledMenuItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

type ViewModeItem = {
  id: string;
  label: string;
  icon: ComponentType<any>;
};

function Toggle3dButtonFactory(MapControlTooltip) {
  const defaultActionIcons: Toggle3dButtonIcons = {
    cube: props => <Cube3d {...props} height="18px" />,
    globe: props => <Globe {...props} height="18px" />
  };

  const Toggle3dButton: React.FC<Toggle3dButtonProps> = ({
    dragRotate,
    onTogglePerspective,
    onSetMapViewMode,
    actionIcons = defaultActionIcons,
    mapControls,
    mapState
  }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const currentMode = mapState?.mapViewMode || MapViewMode.MODE_2D;

    const TOOLBAR_ITEMS: ViewModeItem[] = useMemo(
      () => [
        {id: MapViewMode.MODE_2D, label: 'tooltip.mapViewMode2D', icon: () => <span>2D</span>},
        {id: MapViewMode.MODE_3D, label: 'tooltip.mapViewMode3D', icon: actionIcons.cube},
        {id: MapViewMode.MODE_GLOBE, label: 'tooltip.mapViewModeGlobe', icon: actionIcons.globe}
      ],
      [actionIcons]
    );

    const onClick = useCallback(
      event => {
        event.preventDefault();
        if (onSetMapViewMode) {
          setMenuOpen(!menuOpen);
        } else {
          onTogglePerspective();
        }
      },
      [onSetMapViewMode, onTogglePerspective, menuOpen]
    );

    const onSelectMode = useCallback(
      (modeId: string) => {
        if (onSetMapViewMode) {
          onSetMapViewMode({mapViewMode: modeId});
        }
        setMenuOpen(false);
      },
      [onSetMapViewMode]
    );

    const isVisible = useMemo(() => {
      return (mapControls?.toggle3d || {}).show;
    }, [mapControls]);

    if (!isVisible) return null;

    if (!onSetMapViewMode) {
      return (
        <MapControlTooltip
          id="action-3d"
          message={dragRotate ? 'tooltip.disable3DMap' : 'tooltip.3DMap'}
        >
          <MapControlButton
            onClick={onClick}
            active={dragRotate}
            className={classnames('map-control-button', 'toggle-3d', {map3d: dragRotate})}
          >
            <actionIcons.cube height="22px" />
          </MapControlButton>
        </MapControlTooltip>
      );
    }

    const isGlobe = currentMode === MapViewMode.MODE_GLOBE;

    return (
      <div style={{position: 'relative'}} ref={menuRef}>
        {menuOpen && (
          <StyledViewModeMenu>
            {TOOLBAR_ITEMS.map(item => (
              <StyledMenuItem key={item.id}>
                <StyledMenuButton
                  $active={currentMode === item.id}
                  onClick={() => onSelectMode(item.id)}
                >
                  <item.icon height="16px" />
                </StyledMenuButton>
                <StyledLabel><FormattedMessage id={item.label} /></StyledLabel>
              </StyledMenuItem>
            ))}
          </StyledViewModeMenu>
        )}
        <MapControlTooltip id="action-3d" message="tooltip.mapViewMode">
          <MapControlButton
            onClick={onClick}
            active={dragRotate || isGlobe}
            className={classnames('map-control-button', 'toggle-3d', {
              map3d: dragRotate,
              globe: isGlobe
            })}
          >
            {isGlobe ? <actionIcons.globe height="22px" /> : <actionIcons.cube height="22px" />}
          </MapControlButton>
        </MapControlTooltip>
      </div>
    );
  };

  Toggle3dButton.displayName = 'Toggle3dButton';
  return React.memo(Toggle3dButton);
}

export default Toggle3dButtonFactory;
