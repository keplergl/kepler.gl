import React, {useCallback, useMemo} from 'react';
import {Cube3d} from 'components/common/icons';
import {MapControlButton} from 'components/common/styled-components';
import MapControlTooltipFactory from './map-control-tooltip';
import MapControlPanelFactory from './map-control-panel';

Toggle3dButtonFactory.deps = [MapControlTooltipFactory, MapControlPanelFactory];

function Toggle3dButtonFactory(MapControlTooltip) {
  const defaultActionIcons = {
    cube: Cube3d
  };
  /** @type {import('./toggle-3d-button').Toggle3dButtonComponent} */
  const Toggle3dButton = ({
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
      (<MapControlButton onClick={onClick} active={dragRotate} data-tip data-for="action-3d">
        <actionIcons.cube height="22px" />
        <MapControlTooltip
          id="action-3d"
          message={dragRotate ? 'tooltip.disable3DMap' : 'tooltip.3DMap'}
        />
      </MapControlButton>)
    ) : null;
  };

  Toggle3dButton.displayName = 'Toggle3dButton';
  return React.memo(Toggle3dButton);
}

export default Toggle3dButtonFactory;
