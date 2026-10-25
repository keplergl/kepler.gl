// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {lazy, Suspense} from 'react';
import {injectIntl, IntlShape} from 'react-intl';
import {LayerHoverProp} from '@kepler.gl/reducers';
import LayerHoverInfoFactory from './layer-hover-info';
import CoordinateInfoFactory from './coordinate-info';
import {ChartConfig} from '@kepler.gl/types';
import {Datasets} from '@kepler.gl/table';
import {getApplicationConfig} from '@kepler.gl/utils';

const LayerChartHover = lazy(() => import('./charts/layer-chart-hover'));

MapPopoverContentFactory.deps = [LayerHoverInfoFactory, CoordinateInfoFactory];

type MapPopoverContentProps = {
  coordinate: [number, number] | boolean;
  layerHoverProp: LayerHoverProp | null;
  zoom: number;
  charts?: ChartConfig[];
  datasets?: Datasets;
};

type IntlProps = {
  intl: IntlShape;
};

function hasHoverLayerChart(
  charts: ChartConfig[] | undefined,
  layerHoverProp: LayerHoverProp | null
): boolean {
  if (!getApplicationConfig().enableChartsPanel || !layerHoverProp?.layer || !charts?.length) {
    return false;
  }
  const layerId = layerHoverProp.layer.id;
  return charts.some(chart => 'layerId' in chart && chart.layerId === layerId);
}

export default function MapPopoverContentFactory(
  LayerHoverInfo: ReturnType<typeof LayerHoverInfoFactory>,
  CoordinateInfo: ReturnType<typeof CoordinateInfoFactory>
) {
  const MapPopoverContent: React.FC<MapPopoverContentProps & IntlProps> = ({
    coordinate,
    layerHoverProp,
    zoom,
    charts,
    datasets
  }) => {
    return (
      <>
        {Array.isArray(coordinate) && <CoordinateInfo coordinate={coordinate} zoom={zoom} />}
        {layerHoverProp && <LayerHoverInfo {...layerHoverProp} />}
        {hasHoverLayerChart(charts, layerHoverProp) ? (
          <Suspense fallback={null}>
            <LayerChartHover charts={charts} datasets={datasets} layerHoverProp={layerHoverProp} />
          </Suspense>
        ) : null}
      </>
    );
  };
  return injectIntl(MapPopoverContent);
}
