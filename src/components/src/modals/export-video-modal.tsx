// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import styled, {ThemeProvider, useTheme} from 'styled-components';

import {DEFAULT_MAPBOX_API_URL, NO_MAP_ID, EMPTY_MAPBOX_STYLE} from '@kepler.gl/constants';
import {FormattedMessage} from '@kepler.gl/localization';
import {Viewport, ExportVideo, Effect} from '@kepler.gl/types';
import {
  onViewPortChange,
  computeDeckEffects,
  patchDeckRendererForPostProcessing
} from '@kepler.gl/utils';
import {DeckShadowCompositingEffect} from '@kepler.gl/effects';
import {MapStyle} from '@kepler.gl/reducers';
import {UIStateActions, VisStateActions} from '@kepler.gl/actions';

import {StyledModalContent, InputLight} from '../common/styled-components';
import {Button, Icons} from '../common';
import ItemSelector from '../common/item-selector/item-selector';
import Slider from '../common/slider/slider';
import LoadingSpinner from '../common/loading-spinner';

import {
  getStaticMapProps,
  getBeforeLayerId,
  getHubbleDeckGlProps,
  getTimeRangeFilterKeyframes,
  getAnimatableFilters
} from './hubble-utils';

type HubbleModule = {
  ExportVideoPanelContainer: React.ComponentType<any>;
  KeplerUIContext: React.Context<any>;
};

let _hubbleModule: HubbleModule | null = null;
let _hubblePromise: Promise<HubbleModule> | null = null;

function loadHubble(): Promise<HubbleModule> {
  if (_hubbleModule) return Promise.resolve(_hubbleModule);
  if (!_hubblePromise) {
    _hubblePromise = import('@hubble.gl/react').then(mod => {
      _hubbleModule = mod as unknown as HubbleModule;
      return _hubbleModule;
    });
  }
  return _hubblePromise;
}

const DEFAULT_FILENAME = 'kepler.gl';

function ExportVideoModalTabsFactory() {
  const ModalTabs: React.FC<{
    currentMethod: string;
    toggleMethod: (method: {id: string; label: string}) => void;
    loadingMethods: Array<{id: string; label: string}>;
  }> = ({currentMethod, toggleMethod, loadingMethods}) => (
    <StyledModalTab>
      {loadingMethods.map(method => (
        <StyledTabItem
          key={method.id}
          className={currentMethod === method.id ? 'active' : ''}
          onClick={() => toggleMethod(method)}
        >
          <FormattedMessage id={method.label} />
        </StyledTabItem>
      ))}
    </StyledModalTab>
  );

  return ModalTabs;
}

const StyledModalTab = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.borderColorLT};
  margin-bottom: 24px;
`;

const StyledTabItem = styled.div`
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  color: ${props => props.theme.subtextColorLT};
  border-bottom: 2px solid transparent;

  &.active {
    color: ${props => props.theme.textColorLT};
    border-bottom: 2px solid ${props => props.theme.textColorLT};
    font-weight: 500;
  }

  &:hover {
    color: ${props => props.theme.textColorLT};
  }
`;

const LightItemSelector: React.FC<any> = props => <ItemSelector {...props} inputTheme="light" />;

const SLIDER_LIGHT_OVERRIDES = {
  sliderBarColor: '#A0A7B4',
  sliderBarBgd: '#D3D8E0',
  sliderBarHoverColor: '#939BA8',
  sliderHandleColor: '#F7F7F7',
  sliderHandleHoverColor: '#F7F7F7',
  sliderInactiveBorderColor: '#F7F7F7',
  sliderHandleTextColor: '#F7F7F7',
  sliderHandleShadow: '0 2px 4px 0 rgba(0,0,0,0.20)'
};

const LightSlider: React.FC<any> = props => {
  const theme = useTheme();
  const lightTheme = useMemo(() => ({...theme, ...SLIDER_LIGHT_OVERRIDES}), [theme]);
  return (
    <ThemeProvider theme={lightTheme}>
      <Slider {...props} />
    </ThemeProvider>
  );
};

const KEPLER_UI: {[key: string]: any} = {
  Button,
  Icons,
  Input: InputLight,
  ItemSelector: LightItemSelector,
  Slider: LightSlider,
  LoadingSpinner,
  ModalTabsFactory: ExportVideoModalTabsFactory
};

const StyledExportVideoModalContent = styled(StyledModalContent)`
  display: flex;
  flex-direction: column;
  grid-row-gap: 32px;
  overflow-x: hidden;
  overflow-y: auto;
  .export-video-panel {
    max-width: 100%;
    box-sizing: border-box;
  }
  .export-video-panel__body {
    grid-column-gap: 24px;
  }
  .data-ex-icons-play > path:last-child,
  .data-ex-icons-stop > path:last-child {
    fill: rgba(255, 255, 255, 0) !important;
    stroke: ${props => props.theme.primaryBtnActBgd};
    stroke-width: 3px;
  }
  .data-ex-icons-play > path:last-child:hover,
  .data-ex-icons-stop > path:last-child:hover {
    fill: ${props => props.theme.primaryBtnActBgd} !important;
  }
  #deck-canvas::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 1;
    background: linear-gradient(to right, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8))
        no-repeat center / 1px 100%,
      linear-gradient(to bottom, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)) no-repeat
        center / 100% 1px;
    filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.6));
  }
`;

export type VideoConfiguration = {
  mediaType?: string;
  cameraPreset?: string;
  fileName?: string;
  resolution?: string;
  durationMs?: number;
};

export interface ExportVideoModalProps {
  mapboxApiAccessToken: string;
  mapboxApiUrl?: string;
  mapState: any;
  mapStyle: MapStyle;
  visState: any;
  exportVideo: ExportVideo;
  containerW: number;
  visStateActions: typeof VisStateActions;
  uiStateActions: typeof UIStateActions;
  onClose: () => void;
}

const HUBBLE_PANEL_OVERHEAD = 2 * 32 + 24 + 280;
const EXPORT_VIDEO_MODAL_MAX_WIDTH = 1080;
const MODAL_HORIZONTAL_PADDING = 144;

let _shadowCompositingEffect: InstanceType<typeof DeckShadowCompositingEffect> | null = null;

const ExportVideoModalFactory = () => {
  const ExportVideoModal: React.FC<ExportVideoModalProps> = ({
    mapboxApiAccessToken,
    mapboxApiUrl = DEFAULT_MAPBOX_API_URL,
    mapState,
    mapStyle,
    visState,
    exportVideo,
    containerW,
    visStateActions,
    uiStateActions,
    onClose
  }) => {
    const [hubble, setHubble] = useState<HubbleModule | null>(_hubbleModule);

    useEffect(() => {
      patchDeckRendererForPostProcessing();
    }, []);

    useEffect(() => {
      if (!hubble) {
        loadHubble().then(setHubble);
      }
    }, [hubble]);

    useEffect(() => {
      return () => {
        if (_shadowCompositingEffect) {
          _shadowCompositingEffect.cleanup();
          _shadowCompositingEffect = null;
        }
      };
    }, []);

    const exportVideoWidth = useMemo(() => {
      const modalInnerW =
        Math.min(EXPORT_VIDEO_MODAL_MAX_WIDTH, containerW * 0.7, containerW) -
        MODAL_HORIZONTAL_PADDING;
      return Math.max(320, Math.min(540, modalInnerW - HUBBLE_PANEL_OVERHEAD));
    }, [containerW]);

    const keplerState = useMemo(() => {
      if (mapStyle?.styleType === NO_MAP_ID) {
        const noMapEntry = mapStyle.mapStyles?.[NO_MAP_ID];
        if (noMapEntry && !noMapEntry.url) {
          const emptyStyleUrl = `data:application/json,${encodeURIComponent(
            JSON.stringify(EMPTY_MAPBOX_STYLE)
          )}`;
          return {
            visState,
            mapState,
            mapStyle: {
              ...mapStyle,
              mapStyles: {
                ...mapStyle.mapStyles,
                [NO_MAP_ID]: {...noMapEntry, url: emptyStyleUrl}
              }
            }
          };
        }
      }
      return {visState, mapState, mapStyle};
    }, [visState, mapState, mapStyle]);

    const onUpdateMap = useCallback(
      (viewPort: Viewport) => {
        uiStateActions.setExportVideoSetting(viewPort as any);
      },
      [uiStateActions]
    );

    const hubbleDeckGlProps = useMemo(
      () => getHubbleDeckGlProps(keplerState, mapboxApiAccessToken, mapboxApiUrl),
      [keplerState, mapboxApiAccessToken, mapboxApiUrl]
    );

    const [videoEffects] = useState<Effect[]>(() =>
      (visState.effects || []).map((effect: Effect) => effect.clone())
    );

    const deckEffects = useMemo(() => {
      if (videoEffects.length === 0) return [];
      const effectOrder = visState.effectOrder || videoEffects.map((e: Effect) => e.id);
      const effects = computeDeckEffects({
        visState: {...visState, effects: videoEffects, effectOrder},
        mapState,
        isExport: true
      });

      const hasShadow = effects.some((e: any) => e.shadow === true);
      const hasPostProcess = effects.some((e: any) => typeof e.postRender === 'function');
      if (hasShadow && !hasPostProcess) {
        if (!_shadowCompositingEffect) {
          _shadowCompositingEffect = new DeckShadowCompositingEffect();
        }
        effects.push(_shadowCompositingEffect as any);
      }

      return effects;
    }, [visState, videoEffects, mapState]);

    const deckPropsWithEffects = useMemo(
      () => ({
        ...hubbleDeckGlProps,
        effects: deckEffects
      }),
      [hubbleDeckGlProps, deckEffects]
    );

    const onViewChange = useCallback(
      (viewState: Record<string, any>) =>
        onViewPortChange(viewState as Viewport, onUpdateMap as any),
      [onUpdateMap]
    );

    const staticMapProps = useMemo(
      () => getStaticMapProps(keplerState, onViewChange, mapboxApiAccessToken, mapboxApiUrl),
      [keplerState, onViewChange, mapboxApiAccessToken, mapboxApiUrl]
    );

    const [videoConfiguration, setVideoConfiguration] = useState<VideoConfiguration>({
      ...exportVideo
    });
    const onUpdateVideoConfiguration = useCallback(
      (values: VideoConfiguration) => setVideoConfiguration(prev => ({...prev, ...values})),
      []
    );

    const trueDevicePixelRatio = useRef(
      typeof window !== 'undefined' ? window.devicePixelRatio : 1
    );

    useEffect(() => {
      const trueDpr = trueDevicePixelRatio.current;
      const descriptor = Object.getOwnPropertyDescriptor(window, 'devicePixelRatio');

      Object.defineProperty(window, 'devicePixelRatio', {
        get: () => trueDpr,
        set: () => {
          // no-op: prevent hubble.gl from changing DPR
        },
        configurable: true
      });

      return () => {
        if (descriptor) {
          Object.defineProperty(window, 'devicePixelRatio', descriptor);
        } else {
          delete (window as any).devicePixelRatio;
        }
      };
    }, []);

    const onFilterFrameUpdate = useCallback(
      (filterIdx: number, name: string, value: any) =>
        visStateActions.setFilterAnimationTime(filterIdx, name, value),
      [visStateActions]
    );

    const onTripFrameUpdate = useCallback(
      (value: any) => visStateActions.setLayerAnimationTime(value),
      [visStateActions]
    );

    const topLayer = useMemo(
      () => getBeforeLayerId(mapStyle?.topMapStyle, mapStyle?.bottomMapStyle),
      [mapStyle?.topMapStyle, mapStyle?.bottomMapStyle]
    );

    const animatableFilters = useMemo(() => getAnimatableFilters(keplerState), [keplerState]);

    if (!hubble) {
      return (
        <StyledExportVideoModalContent className="export-video-modal">
          <LoadingSpinner />
        </StyledExportVideoModalContent>
      );
    }

    const {ExportVideoPanelContainer, KeplerUIContext} = hubble;

    return (
      <KeplerUIContext.Provider value={KEPLER_UI}>
        <StyledExportVideoModalContent className="export-video-modal">
          <ExportVideoPanelContainer
            initialState={videoConfiguration}
            mapData={keplerState}
            onSettingsChange={onUpdateVideoConfiguration}
            header={false}
            handleClose={onClose}
            exportVideoWidth={exportVideoWidth}
            onFilterFrameUpdate={onFilterFrameUpdate}
            onTripFrameUpdate={onTripFrameUpdate}
            deckProps={deckPropsWithEffects}
            mapProps={staticMapProps}
            disableBaseMap={false}
            mapboxLayerBeforeId={topLayer?.id}
            defaultFileName={DEFAULT_FILENAME}
            animatableFilters={animatableFilters}
            getTimeRangeFilterKeyframes={getTimeRangeFilterKeyframes}
          />
        </StyledExportVideoModalContent>
      </KeplerUIContext.Provider>
    );
  };

  return ExportVideoModal;
};

export default ExportVideoModalFactory;
