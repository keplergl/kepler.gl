// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {ComponentType, useCallback} from 'react';

import {VisStateActions} from '@kepler.gl/actions';
import {ChartConfig, MapControls} from '@kepler.gl/types';
import {Layer} from '@kepler.gl/layers';
import {Datasets} from '@kepler.gl/table';
import {getApplicationConfig} from '@kepler.gl/utils';

import {LineChart} from '../../common/icons';
import {MapControlButton} from '../../common/styled-components';
import MapControlPanelFactory from '../map-control-panel';
import MapControlTooltipFactory from '../map-control-tooltip';
import ChartPanelContentFactory from './chart-panel';

interface ChartControlIcons {
  chartIcon: ComponentType<any>;
}

export type ChartControlProps = {
  mapControls: MapControls;
  onToggleMapControl: (control: string) => void;
  datasets: Datasets;
  layers: Layer[];
  charts?: ChartConfig[];
  visStateActions?: typeof VisStateActions;
  scale?: number;
  actionIcons?: ChartControlIcons;
};

ChartControlFactory.deps = [
  MapControlTooltipFactory,
  MapControlPanelFactory,
  ChartPanelContentFactory
];

export default function ChartControlFactory(
  MapControlTooltip: ReturnType<typeof MapControlTooltipFactory>,
  MapControlPanel: ReturnType<typeof MapControlPanelFactory>,
  ChartPanelContent: ReturnType<typeof ChartPanelContentFactory>
): React.FC<ChartControlProps> {
  const defaultActionIcons = {
    chartIcon: LineChart
  };

  const ChartControl = ({
    mapControls,
    onToggleMapControl,
    datasets,
    layers,
    charts,
    visStateActions,
    scale,
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
      <div className="map-chart-control">
        {active ? (
          <MapControlPanel
            scale={scale}
            header="header.charts"
            onClick={onClick}
            pinnable={false}
            disableClose={false}
          >
            <ChartPanelContent
              charts={charts}
              datasets={datasets}
              layers={layers}
              visStateActions={visStateActions}
            />
          </MapControlPanel>
        ) : null}
        <MapControlTooltip
          id="show-chart-panel"
          message={active ? 'tooltip.hideChartPanel' : 'tooltip.showChartPanel'}
        >
          <MapControlButton
            className="map-control-button toggle-chart-panel"
            onClick={onClick}
            active={active}
          >
            <actionIcons.chartIcon height="18px" />
          </MapControlButton>
        </MapControlTooltip>
      </div>
    );
  };

  ChartControl.displayName = 'ChartControl';
  return React.memo(ChartControl);
}
