// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {ComponentType, useCallback} from 'react';

import {MapControls} from '@kepler.gl/types';
import {getApplicationConfig} from '@kepler.gl/utils';

import {LineChart} from '../../common/icons';
import {MapControlButton} from '../../common/styled-components';
import MapControlTooltipFactory from '../map-control-tooltip';

interface ChartControlIcons {
  chartIcon: ComponentType<any>;
}

export type ChartControlProps = {
  mapControls: MapControls;
  onToggleMapControl: (control: string) => void;
  actionIcons?: ChartControlIcons;
};

ChartControlFactory.deps = [MapControlTooltipFactory];

export default function ChartControlFactory(
  MapControlTooltip: ReturnType<typeof MapControlTooltipFactory>
): React.FC<ChartControlProps> {
  const defaultActionIcons = {
    chartIcon: LineChart
  };

  const ChartControl = ({
    mapControls,
    onToggleMapControl,
    actionIcons = defaultActionIcons
  }: ChartControlProps) => {
    const onClick = useCallback(
      event => {
        event.preventDefault();
        onToggleMapControl('chart');
      },
      [onToggleMapControl]
    );

    if (!getApplicationConfig().enableChartsPanel) {
      return null;
    }

    const showControl = mapControls?.chart?.show;
    if (!showControl) {
      return null;
    }

    const active = mapControls?.chart?.active;
    return (
      <MapControlTooltip
        id="show-chart-panel"
        message={active ? 'tooltip.hideChartPanel' : 'tooltip.showChartPanel'}
      >
        <MapControlButton
          className="map-control-button toggle-chart-panel"
          onClick={onClick}
          active={active}
        >
          <actionIcons.chartIcon height="22px" />
        </MapControlButton>
      </MapControlTooltip>
    );
  };

  ChartControl.displayName = 'ChartControl';
  return React.memo(ChartControl);
}
