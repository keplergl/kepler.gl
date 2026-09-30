// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useMemo} from 'react';
import styled from 'styled-components';

import {
  ChartConfig,
  ChartRenderer,
  computeLayerChart,
  getHoverRowIndexes,
  isLayerChartConfig,
  toChartableDataset
} from '@kepler.gl/charts';
import {LayerHoverProp} from '@kepler.gl/reducers';
import {Datasets} from '@kepler.gl/table';
import {getApplicationConfig} from '@kepler.gl/utils';

const HoverChartWrap = styled.div`
  min-width: 180px;
  max-width: 260px;
  margin-top: 8px;
`;

const HoverTitle = styled.div`
  font-size: 11px;
  color: ${props => props.theme.subtextColor};
  margin-bottom: 4px;
`;

export type LayerChartHoverProps = {
  charts?: ChartConfig[];
  datasets?: Datasets;
  layerHoverProp: LayerHoverProp | null;
};

export default function LayerChartHover({
  charts,
  datasets,
  layerHoverProp
}: LayerChartHoverProps): React.ReactElement | null {
  const hoverCharts = useMemo(() => {
    if (!getApplicationConfig().enableChartsPanel || !layerHoverProp?.layer || !charts?.length) {
      return [];
    }
    return charts.filter(
      chart => isLayerChartConfig(chart) && chart.layerId === layerHoverProp.layer.id
    );
  }, [charts, layerHoverProp]);

  if (!hoverCharts.length || !datasets || !layerHoverProp) {
    return null;
  }

  const dataId = layerHoverProp.layer.config.dataId;
  const dataset = dataId ? toChartableDataset(datasets[dataId]) : null;
  if (!dataset) {
    return null;
  }
  const hoverRowIndex = (layerHoverProp.data as {_rowIndex?: number} | null)?._rowIndex;

  return (
    <>
      {hoverCharts.map(chart => {
        if (!isLayerChartConfig(chart)) {
          return null;
        }
        const indexes = getHoverRowIndexes(dataset, chart, hoverRowIndex);
        const view = computeLayerChart(chart, dataset, indexes);
        return (
          <HoverChartWrap key={chart.id} className="map-popover__layer-chart">
            <HoverTitle>{chart.title}</HoverTitle>
            <ChartRenderer data={view} />
          </HoverChartWrap>
        );
      })}
    </>
  );
}
