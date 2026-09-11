// SPDX-License-Identifier: MIT
// Copyright SQLRooms Contributors and contributors to the kepler.gl project

import React from 'react';
import {useMemo} from 'react';
import type {ComponentType, FC, ReactNode} from 'react';

import {PlotContainerFactory, plotContainerSelector} from '@kepler.gl/components';
import {useKeplerStateActions} from '../hooks/useKeplerStateActions';
import {getKeplerFactory} from './KeplerInjector';
import {KeplerProvider} from './KeplerProvider';

const PlotContainer = getKeplerFactory(PlotContainerFactory);
type PlotContainerProps = typeof PlotContainer extends ComponentType<infer Props> ? Props : never;
type PlotContainerLogoComponent = PlotContainerProps['logoComponent'];

const KEPLER_PROPS = {
  mapboxApiUrl: 'https://api.mapbox.com',
  appName: 'kepler.gl',
  sidePanelWidth: 0,
  mapboxApiAccessToken: ''
};

export const KeplerPlotContainer: FC<{
  mapId: string;
  logoComponent?: ReactNode;
}> = ({mapId, logoComponent}) => {
  const {keplerState, keplerActions} = useKeplerStateActions({mapId});

  const isExportingImage = keplerState?.uiState?.exportImage?.exporting;
  const mergedKeplerProps = useMemo(
    () =>
      keplerState !== undefined
        ? {
            ...KEPLER_PROPS,
            mapboxApiAccessToken:
              KEPLER_PROPS.mapboxApiAccessToken ||
              keplerState?.mapStyle?.mapboxApiAccessToken ||
              '',
            ...keplerState,
            ...keplerActions,
            id: mapId
          }
        : null,
    [keplerState, keplerActions, mapId]
  );

  const plotContainerFields = useMemo(
    () => (mergedKeplerProps ? plotContainerSelector(mergedKeplerProps) : null),
    // mergedKeplerProps already changes when filters change via keplerState
    [mergedKeplerProps]
  );
  const logo = logoComponent ?? null;
  const keplerLogoComponent = logo as unknown as PlotContainerLogoComponent;

  return isExportingImage && plotContainerFields ? (
    <KeplerProvider mapId={mapId}>
      <PlotContainer {...plotContainerFields} logoComponent={keplerLogoComponent} />
    </KeplerProvider>
  ) : null;
};
