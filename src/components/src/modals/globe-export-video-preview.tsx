// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component, RefObject} from 'react';
import DeckGL from '@deck.gl/react';
import type {Deck, DeckProps, MapViewState} from '@deck.gl/core';
import styled from 'styled-components';

import {DeckAdapter} from '@hubble.gl/core';

const PreviewContainer = styled.div<{$width: number; $height: number; $background: string}>`
  width: ${props => props.$width}px;
  height: ${props => props.$height}px;
  position: relative;
  background: ${props => props.$background};
`;

export type GlobeExportVideoPreviewProps = {
  mapData: any;
  resolution: [number, number];
  exportVideoWidth: number;
  deckProps?: DeckProps;
  viewState: MapViewState;
  adapter: DeckAdapter;
  rendering: boolean;
  saving: boolean;
  setViewState: (viewState: MapViewState) => void;
  durationMs: number;
  /** CSS color string for the area the globe does not cover. */
  backgroundColor: string;
};

/**
 * Single-canvas video export preview for globe mode.
 *
 * hubble's built-in preview cannot be used for globe mode: in its
 * `disableBaseMap` branch it renders a bare <DeckGL> without a viewState and
 * never wires up the frame-capture loop (that loop is driven by the mapbox
 * 'render' event, which does not exist without a base map). This component
 * renders the globe deck directly with a valid, controlled viewState so the
 * GlobeView controller initializes correctly (no MapState/GlobeState assert),
 * stays interactive, and exposes the deck canvas so the parent container can
 * drive its own capture loop (mirrors the swipe export approach).
 */
export class GlobeExportVideoPreview extends Component<GlobeExportVideoPreviewProps> {
  deckRef: RefObject<Deck | null> = React.createRef<Deck | null>();

  _getContainer() {
    const {exportVideoWidth, resolution} = this.props;
    const aspectRatio = resolution[0] / resolution[1];
    return {height: exportVideoWidth / aspectRatio, width: exportVideoWidth};
  }

  /** Expose the deck canvas so the parent container can capture frames. */
  getCanvas(): HTMLCanvasElement | null {
    const deck = this.deckRef.current as any;
    return (deck && deck.getCanvas?.()) || null;
  }

  /** All layers loaded — used to gate the first capture frame. */
  areLayersLoaded(): boolean {
    const deck = this.deckRef.current;
    if (!deck) return false;
    const layers = deck.props.layers || [];
    return layers.length > 0 && layers.every((layer: any) => layer.isLoaded);
  }

  render() {
    const {adapter, deckProps, viewState, setViewState, resolution, exportVideoWidth, backgroundColor} =
      this.props;
    const {width, height} = this._getContainer();
    const deck = this.deckRef.current;

    // adapter.getProps injects `_animate` (and toggles `controller` off while
    // recording) so hubble's KeplerAnimation can drive the camera. Layers,
    // views, controller bounds and initialViewState come from `deckProps`
    // (see getHubbleDeckGlProps). A controlled `viewState` keeps the preview in
    // sync with the animated camera and prevents the GlobeState assert.
    const adapterProps = adapter.getProps({
      deck: deck as any,
      extraProps: deckProps as any
    }) as any;

    // Render the drawing buffer at the true export resolution regardless of the
    // small CSS preview size. deck.gl's MSAA (antialias defaults to true when
    // deck owns the canvas) only smooths edges at the drawing-buffer resolution,
    // so if the buffer were the small preview size the globe silhouette would
    // look pixelated once the captured frame is scaled up to the output size.
    // Passing an explicit numeric `useDevicePixels` sizes the buffer to
    // width * ratio === exportVideoWidth * (resolution / exportVideoWidth) ===
    // resolution, and is far more reliable than mutating window.devicePixelRatio.
    const pixelRatio = Math.max(1, resolution[0] / exportVideoWidth);

    return (
      <PreviewContainer $width={width} $height={height} $background={backgroundColor}>
        <DeckGL
          ref={ref => {
            this.deckRef.current = (ref?.deck as any) || null;
          }}
          deviceProps={{type: 'webgl', webgl: {preserveDrawingBuffer: true}}}
          {...adapterProps}
          viewState={viewState}
          onViewStateChange={({viewState: vs}: any) => setViewState(vs)}
          useDevicePixels={pixelRatio}
          width={width}
          height={height}
        />
      </PreviewContainer>
    );
  }
}
