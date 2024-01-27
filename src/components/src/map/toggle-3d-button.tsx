// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {ComponentType, useCallback, useMemo} from 'react';
import classnames from 'classnames';
import {Cube3d} from '../common/icons';
import {MapControlButton} from '../common/styled-components';
import MapControlTooltipFactory from './map-control-tooltip';
import {MapControls} from '@kepler.gl/types';

Toggle3dButtonFactory.deps = [MapControlTooltipFactory];

interface Toggle3dButtonIcons {
  cube: ComponentType<any>;
}

export type Toggle3dButtonProps = {
  dragRotate: boolean;
  onTogglePerspective: () => void;
  actionIcons: Toggle3dButtonIcons;
  mapControls: MapControls;
};

function Toggle3dButtonFactory(MapControlTooltip) {
  const defaultActionIcons = {
    cube: Cube3d
  };
  /** @type {import('./toggle-3d-button').Toggle3dButtonComponent} */
  const Toggle3dButton: React.FC<Toggle3dButtonProps> = ({
    dragRotate,
    onTogglePerspective,
    actionIcons = defaultActionIcons,
    mapControls
  }) => {
    const onClick = useCallback(
      event => {
        event.preventDefault();
        onTogglePerspective();
      },
      [onTogglePerspective]
    );

    const isVisible = useMemo(() => {
      return (mapControls?.toggle3d || {}).show;
    }, [mapControls]);

    return isVisible ? (
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
    ) : null;
  };

  Toggle3dButton.displayName = 'Toggle3dButton';
  return React.memo(Toggle3dButton);
}

export default Toggle3dButtonFactory;
