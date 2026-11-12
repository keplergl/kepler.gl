// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useRef} from 'react';
import styled from 'styled-components';
import type {Viewport} from '@deck.gl/core';
import type {CameraTourStop} from '@kepler.gl/types';
import {cameraForMap} from '@kepler.gl/utils';

const WIDTH = 32;
const HEIGHT = 96;
const CENTER = WIDTH / 2;
const TOP = 12;
const BOTTOM = HEIGHT - 12;
const TRACK_HEIGHT = BOTTOM - TOP;
const MIN_HALF_WIDTH = 2;
const MAX_HALF_WIDTH = 8;
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const barShape = (top: number, halfWidth: number) =>
  `${CENTER - halfWidth},${top} ${CENTER + halfWidth},${top} ` +
  `${CENTER + MIN_HALF_WIDTH},${BOTTOM} ${CENTER - MIN_HALF_WIDTH},${BOTTOM}`;

const Control = styled.div`
  position: absolute;
  z-index: 2;
  width: ${WIDTH}px;
  height: ${HEIGHT}px;
  color: ${props => props.theme.textColor || '#fff'};
  pointer-events: none;
  font-size: 12px;

  svg {
    display: block;
    overflow: visible;
    touch-action: none;
    outline: none;
  }
  .zoom-bar-hit-area {
    pointer-events: all;
    cursor: grab;
  }
  .zoom-bar-track {
    fill: ${props => props.theme.panelBackground || '#18202a'};
    stroke: ${props => props.theme.panelBackground || '#18202a'};
  }
  .zoom-bar-value {
    fill: ${props => props.theme.activeColor || '#1fbad6'};
  }
  .zoom-bar-handle {
    pointer-events: all;
    cursor: grab;
    fill: ${props => props.theme.activeColor || '#1fbad6'};
    stroke: ${props => props.theme.panelBackground || '#18202a'};
  }
  svg:active .zoom-bar-handle,
  svg:active .zoom-bar-hit-area {
    cursor: grabbing;
  }
  svg:focus-visible .zoom-bar-handle {
    stroke: ${props => props.theme.textColor || '#fff'};
    stroke-width: 3px;
  }
  .zoom-bar-label {
    position: absolute;
    transform: translateX(-50%);
    padding: 3px 6px;
    border-radius: 4px;
    background: ${props => props.theme.panelBackground || '#18202a'};
    box-shadow: 0 1px 4px #0006;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }
  button {
    position: absolute;
    top: -24px;
    left: 4px;
    width: 24px;
    height: 24px;
    padding: 0;
    color: inherit;
    background: ${props => props.theme.panelBackground || '#18202a'};
    border: 0;
    border-radius: 50%;
    cursor: pointer;
    pointer-events: auto;
  }
`;

const stopEvent = (event: React.SyntheticEvent) => event.stopPropagation();

export default function CameraTourZoomControl({
  stop,
  viewport,
  globe,
  minZoom = 0,
  maxZoom = 24,
  onChange,
  onClose
}: {
  stop: CameraTourStop;
  viewport: Viewport;
  globe: boolean;
  minZoom?: number;
  maxZoom?: number;
  onChange: (zoom: number) => void;
  onClose: () => void;
}) {
  const drag = useRef<number | null>(null);
  const {camera} = stop;
  const longitude = globe
    ? camera.longitude
    : camera.longitude +
      360 *
        Math.round(
          (viewport.unproject([viewport.width / 2, viewport.height / 2])[0] - camera.longitude) /
            360
        );
  const position = [longitude, camera.latitude];
  const [x, y] = viewport.project(position);
  if (
    !Number.isFinite(x) ||
    !Number.isFinite(y) ||
    x < 0 ||
    x > viewport.width ||
    y < 0 ||
    y > viewport.height
  ) {
    drag.current = null;
    return null;
  }
  if (globe) {
    // DOM overlays are not depth-tested. Hide controls on the far side of Earth.
    const world = viewport.projectPosition(position);
    if (
      world.reduce((dot, value, i) => dot + value * (viewport.cameraPosition[i] - value), 0) <= 0
    ) {
      drag.current = null;
      return null;
    }
    minZoom = cameraForMap({...camera, zoom: -Infinity}, true).zoom;
    maxZoom = cameraForMap({...camera, zoom: Infinity}, true).zoom;
  }
  const zoom = clamp(camera.zoom, minZoom, maxZoom);
  const progress = maxZoom > minZoom ? (zoom - minZoom) / (maxZoom - minZoom) : 0;
  const handleY = BOTTOM - progress * TRACK_HEIGHT;
  const halfWidth = MIN_HALF_WIDTH + progress * (MAX_HALF_WIDTH - MIN_HALF_WIDTH);
  const left = clamp(x - WIDTH - 12, 4, viewport.width - WIDTH - 4);
  const top = clamp(y - HEIGHT / 2, 28, viewport.height - HEIGHT - 24);
  const change = (value: number) => {
    if (Number.isFinite(value)) onChange(clamp(Math.round(value * 10) / 10, minZoom, maxZoom));
  };
  const changeFromPointer = (event: React.PointerEvent<SVGSVGElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    if (bounds.height <= 0) return;
    const pointerY = ((event.clientY - bounds.top) / bounds.height) * HEIGHT;
    const value = clamp((BOTTOM - pointerY) / TRACK_HEIGHT, 0, 1);
    change(minZoom + value * (maxZoom - minZoom));
  };
  const endDrag = (event: React.PointerEvent<SVGSVGElement>) => {
    if (drag.current !== event.pointerId) return;
    drag.current = null;
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };
  return (
    <Control
      role="group"
      aria-label={`Zoom for ${stop.name}`}
      style={{left, top}}
      onPointerDown={stopEvent}
      onPointerMove={stopEvent}
      onPointerUp={stopEvent}
      onMouseDown={stopEvent}
      onTouchStart={stopEvent}
      onClick={stopEvent}
      onDoubleClick={stopEvent}
      onWheel={stopEvent}
      onKeyDown={event => {
        event.stopPropagation();
        if (event.key === 'Escape') onClose();
      }}
    >
      <svg
        width={WIDTH}
        height={HEIGHT}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="slider"
        aria-orientation="vertical"
        tabIndex={0}
        aria-label={`Zoom for ${stop.name}`}
        aria-valuemin={minZoom}
        aria-valuemax={maxZoom}
        aria-valuenow={zoom}
        aria-valuetext={`Zoom ${zoom.toFixed(1)}`}
        onKeyDown={event => {
          const nextZoom = {
            ArrowUp: zoom + 0.1,
            ArrowRight: zoom + 0.1,
            ArrowDown: zoom - 0.1,
            ArrowLeft: zoom - 0.1,
            PageUp: zoom + 1,
            PageDown: zoom - 1,
            Home: minZoom,
            End: maxZoom
          }[event.key];
          if (nextZoom !== undefined) {
            event.preventDefault();
            change(nextZoom);
          }
        }}
        onPointerDown={event => {
          if (event.button !== 0 || event.isPrimary === false || drag.current !== null) return;
          event.preventDefault();
          event.currentTarget.focus();
          event.currentTarget.setPointerCapture(event.pointerId);
          drag.current = event.pointerId;
          changeFromPointer(event);
        }}
        onPointerMove={event => {
          if (drag.current === event.pointerId) changeFromPointer(event);
        }}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onLostPointerCapture={() => {
          drag.current = null;
        }}
      >
        <title>Drag up to zoom in or down to zoom out, or use the arrow keys</title>
        <polygon
          className="zoom-bar-track"
          points={barShape(TOP, MAX_HALF_WIDTH)}
          strokeWidth={4}
          strokeLinejoin="round"
        />
        <polygon className="zoom-bar-value" points={barShape(handleY, halfWidth)} />
        <rect className="zoom-bar-hit-area" width={WIDTH} height={HEIGHT} fill="transparent" />
        <circle className="zoom-bar-handle" cx={CENTER} cy={handleY} r={6} strokeWidth={2} />
      </svg>
      <span
        className="zoom-bar-label"
        style={{
          left: clamp(left + CENTER, 40, viewport.width - 40) - left,
          top: HEIGHT
        }}
      >
        Zoom {zoom.toFixed(1)}
      </span>
      <button type="button" aria-label="Close zoom control" onClick={onClose}>
        ×
      </button>
    </Control>
  );
}
