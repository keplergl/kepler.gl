// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback} from 'react';

import {MapControlButton, MapControlTooltipFactory} from '@kepler.gl/components';
import {MapControls} from '@kepler.gl/types';

export type SqlPanelControlProps = {
  mapControls: MapControls;
  onToggleMapControl: (control: string) => void;
};

SqlPanelControlFactory.deps = [MapControlTooltipFactory];

export default function SqlPanelControlFactory(
  MapControlTooltip: ReturnType<typeof MapControlTooltipFactory>
): React.FC<SqlPanelControlProps> {
  const SqlPanelControl = ({mapControls, onToggleMapControl}: SqlPanelControlProps) => {
    const onClick = useCallback(
      (event: React.MouseEvent) => {
        event.preventDefault();
        onToggleMapControl('sqlPanel');
      },
      [onToggleMapControl]
    );

    if (!mapControls?.sqlPanel?.show) {
      return null;
    }

    const active = Boolean(mapControls.sqlPanel.active);
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
