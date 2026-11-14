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
    actionIcons = defaultActionIcons,
    chartsEnabled
  }: ChartControlProps & {chartsEnabled: boolean}) => {
    const onClick = useCallback(
      event => {
        event.preventDefault();
        onToggleMapControl('chart');
      },
      [onToggleMapControl]
    );

    if (!chartsEnabled) {
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
  const MemoizedChartControl = React.memo(ChartControl);
  // MapControl forwards camera/layer props to all actions. Keep those outside
  // this button's memo boundary without restricting injected action components.
  return function ChartControlWrapper({mapControls, onToggleMapControl, actionIcons}) {
    return (
      <MemoizedChartControl
        chartsEnabled={Boolean(getApplicationConfig().enableChartsPanel)}
        mapControls={mapControls}
        onToggleMapControl={onToggleMapControl}
        actionIcons={actionIcons}
      />
    );
  };
}
