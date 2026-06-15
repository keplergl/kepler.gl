// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {ComponentType, useCallback, useMemo} from 'react';
import classnames from 'classnames';
import {Cube3d, Globe} from '../common/icons';
import {MapControlButton} from '../common/styled-components';
import MapControlTooltipFactory from './map-control-tooltip';
import MapControlToolbarFactory from './map-control-toolbar';
import ToolbarItem from '../common/toolbar-item';
import {MapControls} from '@kepler.gl/types';
import {MapViewMode} from '@kepler.gl/constants';

Toggle3dButtonFactory.deps = [MapControlTooltipFactory, MapControlToolbarFactory];

interface Toggle3dButtonIcons {
  cube: ComponentType<any>;
  globe: ComponentType<any>;
}

export type Toggle3dButtonProps = {
  dragRotate: boolean;
  mapViewMode?: string;
  onTogglePerspective: () => void;
  onSetMapViewMode?: (mode: string) => void;
  onToggleMapControl: (control: string) => void;
  actionIcons: Toggle3dButtonIcons;
  mapControls: MapControls;
};

const VIEW_MODE_ITEMS = [
  {
    id: MapViewMode.MODE_2D,
    label: 'tooltip.top'
  },
  {
    id: MapViewMode.MODE_3D,
    label: 'tooltip.3DMap'
  },
  {
    id: MapViewMode.MODE_GLOBE,
    label: 'tooltip.globeMap'
  }
];

function Toggle3dButtonFactory(
  MapControlTooltip: ReturnType<typeof MapControlTooltipFactory>,
  MapControlToolbar: ReturnType<typeof MapControlToolbarFactory>
) {
  const defaultActionIcons = {
    cube: props => <Cube3d {...props} height="18px" />,
    globe: props => <Globe {...props} height="18px" />
  };

  const Toggle3dButton: React.FC<Toggle3dButtonProps> = ({
    dragRotate,
    mapViewMode,
    onTogglePerspective,
    onSetMapViewMode,
    onToggleMapControl,
    actionIcons = defaultActionIcons,
    mapControls
  }) => {
    const currentMode = mapViewMode || (dragRotate ? MapViewMode.MODE_3D : MapViewMode.MODE_2D);

    const onClickButton = useCallback(
      e => {
        e.preventDefault();
        onToggleMapControl('toggle3d');
      },
      [onToggleMapControl]
    );

    const onSelectMode = useCallback(
      (mode: string) => {
        if (onSetMapViewMode) {
          onSetMapViewMode(mode);
        } else if (mode === MapViewMode.MODE_3D) {
          if (!dragRotate) onTogglePerspective();
        } else if (mode === MapViewMode.MODE_2D) {
          if (dragRotate) onTogglePerspective();
        }
        onToggleMapControl('toggle3d');
      },
      [onSetMapViewMode, onTogglePerspective, dragRotate, onToggleMapControl]
    );

    const isVisible = useMemo(() => {
      return (mapControls?.toggle3d || {}).show;
    }, [mapControls]);

    if (!isVisible) return null;

    const isActive = mapControls?.toggle3d?.active;
    const isGlobe = currentMode === MapViewMode.MODE_GLOBE;
    const is3d = currentMode === MapViewMode.MODE_3D;

    const ActiveIcon = isGlobe ? actionIcons.globe : actionIcons.cube;

    return (
      <div className="view-mode-controls" style={{position: 'relative'}}>
        {isActive ? (
          <MapControlToolbar $show={isActive}>
            {VIEW_MODE_ITEMS.map(item => (
              <ToolbarItem
                key={item.id}
                onClick={() => onSelectMode(item.id)}
                label={item.label}
                icon={item.id === MapViewMode.MODE_GLOBE ? actionIcons.globe : actionIcons.cube}
                active={currentMode === item.id}
              />
            ))}
          </MapControlToolbar>
        ) : null}
        <MapControlTooltip
          id="action-3d"
          message="tooltip.viewMode"
        >
          <MapControlButton
            onClick={onClickButton}
            active={is3d || isGlobe}
            className={classnames('map-control-button', 'toggle-3d', {map3d: is3d, mapGlobe: isGlobe})}
          >
            <ActiveIcon height="22px" />
          </MapControlButton>
        </MapControlTooltip>
      </div>
    );
  };

  Toggle3dButton.displayName = 'Toggle3dButton';
  return React.memo(Toggle3dButton);
}

export default Toggle3dButtonFactory;
