// SPDX-License-Identifier: MIT
// Copyright SQLRooms Contributors and contributors to the kepler.gl project

import React from 'react';
import {FC, useMemo, useRef, useEffect, useState} from 'react';

import {
  MapContainerFactory,
  BottomWidgetFactory,
  GeocoderPanelFactory,
  mapFieldsSelector,
  bottomWidgetSelector,
  geoCoderPanelSelector,
  modalContainerSelector,
  MapViewStateContextProvider,
  RootContext,
  ModalContainerFactory
} from '@kepler.gl/components';
import {useDimensions, getAnimatableVisibleLayers} from '@kepler.gl/utils';
import styled, {useTheme} from 'styled-components';

import {getKeplerFactory} from './KeplerInjector';
import {KeplerProvider} from './KeplerProvider';
import {useKeplerStateActions} from '../hooks/useKeplerStateActions';
import {useStoreWithKepler} from '../KeplerSlice';
import {SplitMapIndexContext} from './SplitMapIndexContext';

const MapContainer = getKeplerFactory(MapContainerFactory);
const BottomWidget = getKeplerFactory(BottomWidgetFactory);
const GeoCoderPanel = getKeplerFactory(GeocoderPanelFactory);
const ModalContainer = getKeplerFactory(ModalContainerFactory);

const DEFAULT_DIMENSIONS = {
  width: 0,
  height: 0
};
const KEPLER_PROPS = {
  mapboxApiUrl: 'https://api.mapbox.com',
  appName: 'kepler.gl',
  sidePanelWidth: 0
};
// overide kepler default style
const CustomWidgetcontainer = styled.div`
  .bottom-widget--inner {
    margin-top: 0;
  }

  .map-popover {
    z-index: 50;
  }

  /* Remove top margin from Trip layer timeline */
  .kepler-gl .bottom-widget--container .animation-control-container,
  .bottom-widget--container .animation-control-container {
    margin-top: 0 !important;
  }
`;

const SplitMapsContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
`;

type KeplerGLProps = Parameters<typeof geoCoderPanelSelector>[0];

const KeplerGl: FC<{
  mapId: string;
}> = ({mapId}) => {
  const bottomWidgetRef = useRef(null);
  const [containerRef, size] = useDimensions<HTMLDivElement>();
  const [containerNode, setContainerNode] = useState<HTMLElement | null>(null);
  const theme = useTheme();
  const basicKeplerProps = useStoreWithKepler(state => state.kepler.basicKeplerProps);
  const modalPortalTarget = useStoreWithKepler(state => state.kepler.modalPortalTarget);

  const {keplerActions, keplerState} = useKeplerStateActions({mapId});
  const interactionConfig = keplerState?.visState?.interactionConfig;

  // Capture container DOM node outside of render for portal use
  useEffect(() => {
    setContainerNode(containerRef.current);
  }, [containerRef]);

  // Update export image settings when size changes
  useEffect(() => {
    if (size?.width && size?.height) {
      keplerActions.uiStateActions.setExportImageSetting({
        mapW: size.width,
        mapH: size.height
      });
    }
  }, [size?.width, size?.height, keplerActions.uiStateActions]);

  const mergedKeplerProps = useMemo(() => {
    return {
      ...KEPLER_PROPS,
      ...keplerState,
      ...keplerActions,
      id: mapId
    } as KeplerGLProps;
  }, [keplerState, keplerActions, mapId]);
  const geoCoderPanelFields = keplerState?.visState
    ? geoCoderPanelSelector(
        mergedKeplerProps,
        // dont need height
        size || DEFAULT_DIMENSIONS
      )
    : null;

  const splitMaps = keplerState?.visState?.splitMaps;
  const isSplit = splitMaps && splitMaps.length > 1;

  const mapFields = useMemo(
    () => (keplerState?.visState ? mapFieldsSelector(mergedKeplerProps) : null),
    [keplerState, mergedKeplerProps]
  );
  const mapFieldsSplit = useMemo(
    () =>
      isSplit && keplerState?.visState
        ? splitMaps.map((_, index) => mapFieldsSelector(mergedKeplerProps, index))
        : null,
    [keplerState, mergedKeplerProps, isSplit, splitMaps]
  );

  // Check if there are filters or animatable layers (e.g., Trip layers)
  const hasFilters = Boolean(keplerState?.visState.filters?.length);
  const hasAnimatableLayers = useMemo(() => {
    const layers = keplerState?.visState?.layers || [];
    return getAnimatableVisibleLayers(layers).length > 0;
  }, [keplerState?.visState?.layers]);

  const bottomWidgetFields = useMemo(() => {
    if (!hasFilters && !hasAnimatableLayers) return null;
    const fields = bottomWidgetSelector(mergedKeplerProps, theme);
    // The legend is rendered as a draggable, portaled overlay so the
    // BottomWidget should not shrink to reserve space for it.  Mask
    // mapLegend.active so the upstream spaceForLegendWidth stays 0.
    return {
      ...fields,
      uiState: {
        ...fields.uiState,
        mapControls: {
          ...fields.uiState.mapControls,
          mapLegend: {
            ...fields.uiState.mapControls?.mapLegend,
            show: fields.uiState.mapControls?.mapLegend?.show ?? false,
            active: false
          }
        }
      }
    };
  }, [hasFilters, hasAnimatableLayers, mergedKeplerProps, theme]);

  const modalPortalNode = useMemo(() => {
    if (modalPortalTarget === 'body') {
      return typeof document !== 'undefined' ? document.body : null;
    }
    return containerNode;
  }, [modalPortalTarget, containerNode]);

  const modalContainerFields = keplerState?.visState
    ? modalContainerSelector(mergedKeplerProps, modalPortalNode)
    : null;

  const mapboxApiAccessToken =
    mapFields?.mapStyle?.mapboxApiAccessToken || basicKeplerProps?.mapboxApiAccessToken;
  return (
    <RootContext.Provider value={containerRef}>
      <CustomWidgetcontainer
        ref={containerRef}
        className="kepler-gl relative flex h-full w-full flex-col justify-between"
      >
        {isSplit && mapFieldsSplit ? (
          <SplitMapsContainer>
            <MapViewStateContextProvider
              mapState={
                (mapFieldsSplit[0]?.mapState ?? mapFields?.mapState) as NonNullable<
                  typeof mapFields
                >['mapState']
              }
            >
              {mapFieldsSplit.map((fields, index) => (
                <SplitMapIndexContext.Provider key={index} value={index}>
                  <MapContainer
                    index={index}
                    primary={index === 1}
                    containerId={index}
                    {...fields}
                    mapboxApiAccessToken={mapboxApiAccessToken || ''}
                  />
                </SplitMapIndexContext.Provider>
              ))}
            </MapViewStateContextProvider>
          </SplitMapsContainer>
        ) : mapFields?.mapState ? (
          <MapViewStateContextProvider mapState={mapFields.mapState}>
            <MapContainer
              primary={true}
              containerId={0}
              key={0}
              index={0}
              {...mapFields}
              mapboxApiAccessToken={mapboxApiAccessToken || ''}
            />
          </MapViewStateContextProvider>
        ) : null}
        {geoCoderPanelFields && interactionConfig?.geocoder?.enabled ? (
          <GeoCoderPanel
            {...geoCoderPanelFields}
            index={0}
            unsyncedViewports={false}
            mapboxApiAccessToken={mapboxApiAccessToken || ''}
          />
        ) : null}
        {size && bottomWidgetFields ? (
          <BottomWidget
            rootRef={bottomWidgetRef}
            {...bottomWidgetFields}
            theme={theme}
            containerW={size?.width}
          />
        ) : null}
        {size && size.width && size.height && modalContainerFields ? (
          <ModalContainer
            {...modalContainerFields}
            containerW={size?.width}
            containerH={size?.height}
          />
        ) : null}
      </CustomWidgetcontainer>
    </RootContext.Provider>
  );
};

export const KeplerMapContainer: FC<{
  mapId: string;
}> = ({mapId}) => {
  return (
    <KeplerProvider mapId={mapId}>
      <KeplerGl mapId={mapId} />
    </KeplerProvider>
  );
};
