// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component, RefObject, forwardRef, ForwardedRef} from 'react';
import DeckGL from '@deck.gl/react';
import ReactMapGL, {type MapRef, useControl} from 'react-map-gl/maplibre';
// @ts-ignore module resolution mismatch with moduleResolution:"node"
import {MapboxOverlay} from '@deck.gl/mapbox';
import type {Deck, DeckProps, MapViewState} from '@deck.gl/core';
import isEqual from 'lodash.isequal';
import styled from 'styled-components';

import {DeckAdapter} from '@hubble.gl/core';
import {createKeplerLayers} from '@hubble.gl/react';
import {compositeSwipeFrame, getSwipePercentageAtTime, SwipeEasing} from './swipe-composite-utils';

function setRef<T>(ref: React.Ref<T> | React.MutableRefObject<T>, value: T) {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref) {
    (ref as React.MutableRefObject<T>).current = value;
  }
}

const DeckGLOverlay = forwardRef<Deck, any>(
  (props: any, ref: ForwardedRef<Deck>) => {
    const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay({...props, interleaved: true}));
    overlay.setProps(props);
    setRef(ref, (overlay as any)._deck);
    return null;
  }
);
DeckGLOverlay.displayName = 'DeckGLOverlay';

const PreviewContainer = styled.div<{$width: number; $height: number}>`
  width: ${props => props.$width}px;
  height: ${props => props.$height}px;
  position: relative;
`;

const VisibleCanvas = styled.canvas<{$width: number; $height: number}>`
  width: ${props => props.$width}px;
  height: ${props => props.$height}px;
  display: block;
  position: relative;
  z-index: 1;
`;

const MapLayer = styled.div<{$width: number; $height: number}>`
  width: ${props => props.$width}px;
  height: ${props => props.$height}px;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  pointer-events: none;
  z-index: 0;
`;

export type SwipeExportVideoPreviewProps = {
  mapData: any;
  resolution: [number, number];
  exportVideoWidth: number;
  disableBaseMap: boolean;
  deckProps?: DeckProps;
  viewState: MapViewState;
  adapter: DeckAdapter;
  mapboxLayerBeforeId?: string;
  rendering: boolean;
  saving: boolean;
  setViewState: (viewState: MapViewState) => void;
  durationMs: number;
  mapProps?: Record<string, any>;
  swipeStartPct: number;
  swipeEndPct: number;
  swipeEasing: SwipeEasing;
  currentTimeMs: number;
};

type SwipeExportVideoPreviewState = {
  leftReady: boolean;
  rightReady: boolean;
};

/**
 * A dual-canvas video export preview that renders left/right split map layers
 * and composites them with an animated swipe divider.
 */
export class SwipeExportVideoPreview extends Component<
  SwipeExportVideoPreviewProps,
  SwipeExportVideoPreviewState
> {
  leftMapRef: RefObject<MapRef> = React.createRef<MapRef>();
  rightMapRef: RefObject<MapRef> = React.createRef<MapRef>();
  leftDeckRef: RefObject<Deck> = React.createRef<Deck>();
  rightDeckRef: RefObject<Deck> = React.createRef<Deck>();
  compositeCanvasRef: RefObject<HTMLCanvasElement> = React.createRef<HTMLCanvasElement>();

  constructor(props: SwipeExportVideoPreviewProps) {
    super(props);

    this.state = {
      leftReady: false,
      rightReady: false
    };

    this._resizeVideo();
  }

  componentDidUpdate(prevProps: SwipeExportVideoPreviewProps) {
    if (!isEqual(prevProps.resolution, this.props.resolution)) {
      this._resizeVideo();
    }

    if (
      prevProps.currentTimeMs !== this.props.currentTimeMs ||
      prevProps.swipeStartPct !== this.props.swipeStartPct ||
      prevProps.swipeEndPct !== this.props.swipeEndPct ||
      prevProps.swipeEasing !== this.props.swipeEasing
    ) {
      this._compositeFrame();
    }
  }

  _resizeVideo() {
    const {exportVideoWidth, resolution} = this.props;
    this._setDevicePixelRatio(resolution[0] / exportVideoWidth);
  }

  _setDevicePixelRatio(devicePixelRatio: number) {
    // @ts-ignore
    window.devicePixelRatio = devicePixelRatio;
  }

  _getContainer() {
    const {exportVideoWidth, resolution} = this.props;
    const aspectRatio = resolution[0] / resolution[1];
    return {height: exportVideoWidth / aspectRatio, width: exportVideoWidth};
  }

  _getCurrentSwipePercentage(): number {
    const {currentTimeMs, durationMs, swipeStartPct, swipeEndPct, swipeEasing} = this.props;
    return getSwipePercentageAtTime(currentTimeMs, durationMs, swipeStartPct, swipeEndPct, swipeEasing);
  }

  _getLeftCanvas(): HTMLCanvasElement | null {
    if (this.leftMapRef.current) {
      return this.leftMapRef.current.getMap().getCanvas();
    }
    // Fallback: DeckGL canvas (no basemap mode)
    if (this.leftDeckRef.current) {
      return (this.leftDeckRef.current as any).getCanvas?.() || null;
    }
    return null;
  }

  _getRightCanvas(): HTMLCanvasElement | null {
    if (this.rightMapRef.current) {
      return this.rightMapRef.current.getMap().getCanvas();
    }
    if (this.rightDeckRef.current) {
      return (this.rightDeckRef.current as any).getCanvas?.() || null;
    }
    return null;
  }

  _compositeFrame() {
    const leftCanvas = this._getLeftCanvas();
    const rightCanvas = this._getRightCanvas();
    const outputCanvas = this.compositeCanvasRef.current;

    if (!leftCanvas || !rightCanvas || !outputCanvas) return;

    const percentage = this._getCurrentSwipePercentage();
    compositeSwipeFrame(leftCanvas, rightCanvas, outputCanvas, percentage, true);
  }

  /**
   * Called by the parent container's adapter after each render.
   * We need both maps to be loaded before compositing and capturing.
   */
  onAfterRender = (proceedToNextFrame: () => void) => {
    const leftLoaded = this._areLayersLoaded('left');
    const rightLoaded = this._areLayersLoaded('right');
    const leftTilesReady =
      this.props.disableBaseMap || !this.leftMapRef.current || this.leftMapRef.current.getMap().areTilesLoaded();
    const rightTilesReady =
      this.props.disableBaseMap || !this.rightMapRef.current || this.rightMapRef.current.getMap().areTilesLoaded();

    if (leftLoaded && rightLoaded && leftTilesReady && rightTilesReady) {
      this._compositeFrame();
      proceedToNextFrame();
    }
  };

  _areLayersLoaded(side: 'left' | 'right'): boolean {
    const deckRef = side === 'left' ? this.leftDeckRef : this.rightDeckRef;
    if (!deckRef.current) return false;
    const layers = deckRef.current.props.layers || [];
    return layers.every((layer: any) => layer.isLoaded);
  }

  /**
   * Get the composited canvas element for video capture.
   */
  getCompositeCanvas(): HTMLCanvasElement | null {
    return this.compositeCanvasRef.current;
  }

  _createLayers(mapIndex: number, beforeId?: string) {
    const {deckProps, mapData, viewState} = this.props;
    if (deckProps && deckProps.layers) {
      return deckProps.layers;
    }
    return createKeplerLayers(mapData, viewState, mapIndex, beforeId);
  }

  _onLeftMapLoad = () => {
    const map = this.leftMapRef.current?.getMap();
    if (map) {
      map.on('render', () => {
        if (!this.state.leftReady) {
          this.setState({leftReady: true});
        }
        this._tryComposite();
      });
    }
  };

  _onRightMapLoad = () => {
    const map = this.rightMapRef.current?.getMap();
    if (map) {
      map.on('render', () => {
        if (!this.state.rightReady) {
          this.setState({rightReady: true});
        }
        this._tryComposite();
      });
    }
  };

  _tryComposite() {
    if (this.state.leftReady && this.state.rightReady) {
      this._compositeFrame();
    }
  }

  _renderMapCanvas(
    side: 'left' | 'right',
    mapIndex: number
  ) {
    const {viewState, adapter, deckProps, mapProps, disableBaseMap, mapboxLayerBeforeId} = this.props;
    const {width, height} = this._getContainer();
    const keplerLayers = this._createLayers(mapIndex, mapboxLayerBeforeId);
    const mapRef = side === 'left' ? this.leftMapRef : this.rightMapRef;
    const deckRef = side === 'left' ? this.leftDeckRef : this.rightDeckRef;
    const onMapLoad = side === 'left' ? this._onLeftMapLoad : this._onRightMapLoad;
    const deck = deckRef.current;

    if (disableBaseMap) {
      return (
        <MapLayer $width={width} $height={height}>
          <DeckGL
            ref={ref => setRef(deckRef, ref?.deck as any)}
            {...(adapter.getProps({deck: deck as any, extraProps: {...deckProps, layers: keplerLayers}}) as any)}
            {...this._getContainer()}
          />
        </MapLayer>
      );
    }

    const {
      mapStyle: mapStyleFromProps,
      mapLib,
      transformRequest
    } = (mapProps || {}) as any;

    return (
      <MapLayer $width={width} $height={height}>
        <ReactMapGL
          ref={mapRef}
          style={{width, height}}
          antialias
          mapLib={mapLib}
          transformRequest={transformRequest}
          preserveDrawingBuffer
          {...viewState}
          mapStyle={mapStyleFromProps}
          onLoad={onMapLoad}
        >
          <DeckGLOverlay
            ref={deckRef}
            deviceProps={{type: 'webgl', webgl: {stencil: true}}}
            {...adapter.getProps({deck: deck as any, extraProps: {...deckProps, layers: keplerLayers}})}
          />
        </ReactMapGL>
      </MapLayer>
    );
  }

  render() {
    const {resolution} = this.props;
    const {width, height} = this._getContainer();

    return (
      <PreviewContainer $width={width} $height={height}>
        {/* Hidden map canvases for left (mapIndex=0) and right (mapIndex=1) */}
        {this._renderMapCanvas('left', 0)}
        {this._renderMapCanvas('right', 1)}

        {/* Visible composited output */}
        <VisibleCanvas
          ref={this.compositeCanvasRef}
          width={resolution[0]}
          height={resolution[1]}
          $width={width}
          $height={height}
        />
      </PreviewContainer>
    );
  }
}
