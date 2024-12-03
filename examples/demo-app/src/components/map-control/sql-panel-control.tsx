// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, ComponentType} from 'react';

import {MapControls} from '@kepler.gl/types';

import {MapControlButton, MapControlTooltipFactory} from '@kepler.gl/components';

interface EffectControlIcons {
  effectsIcon: ComponentType<any>;
}

export type SqlPanelControlProps = {
  mapControls: MapControls;
  onToggleMapControl: (control: string) => void;
  actionIcons: EffectControlIcons;
};

SqlPanelControlFactory.deps = [MapControlTooltipFactory];

export default function SqlPanelControlFactory(
  MapControlTooltip: ReturnType<typeof MapControlTooltipFactory>
): React.FC<SqlPanelControlProps> {
  const SqlPanelControl = ({mapControls, onToggleMapControl}) => {
    const onClick = useCallback(
      event => {
        event.preventDefault();
        onToggleMapControl('sqlPanel');
      },
      [onToggleMapControl]
    );

    // ! fix here!

    const showControl = mapControls?.effect?.show;
    if (!showControl) {
      return null;
    }

    const active = mapControls?.effect?.active;
    return (
      <MapControlTooltip
        id="show-sql-panel"
        message={active ? 'tooltip.hideSQLPanel' : 'tooltip.showSQLPanel'}
      >
        <MapControlButton
          className="map-control-button toggle-sql-panel"
          onClick={onClick}
          active={active}
        >
          SQL
        </MapControlButton>
      </MapControlTooltip>
    );
  };

  return SqlPanelControl;
}
