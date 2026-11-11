// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';
import type {Viewport} from '@deck.gl/core';
import type {CameraTourStop} from '@kepler.gl/types';
import {cameraForMap} from '@kepler.gl/utils';

const Control = styled.div`
  position: absolute;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  border-radius: 6px;
  background: ${props => props.theme.panelBackground || '#18202a'};
  color: ${props => props.theme.textColor || '#fff'};
  box-shadow: 0 2px 8px #0006;
  pointer-events: auto;
  font-size: 12px;
  box-sizing: border-box;
  width: 260px;
  max-width: calc(100% - 8px);
  span {
    white-space: nowrap;
  }
  button {
    color: inherit;
    background: transparent;
    border: 0;
    cursor: pointer;
    padding: 4px;
    min-width: 24px;
  }
  button:disabled {
    opacity: 0.4;
    cursor: default;
  }
  input {
    width: 80px;
    min-width: 0;
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
  )
    return null;
  if (globe) {
    // DOM overlays are not depth-tested. Hide controls on the far side of Earth.
    const world = viewport.projectPosition(position);
    if (world.reduce((dot, value, i) => dot + value * (viewport.cameraPosition[i] - value), 0) <= 0)
      return null;
    minZoom = cameraForMap({...camera, zoom: -Infinity}, true).zoom;
    maxZoom = cameraForMap({...camera, zoom: Infinity}, true).zoom;
  }
  const change = (zoom: number) => {
    if (Number.isFinite(zoom)) onChange(Math.max(minZoom, Math.min(maxZoom, zoom)));
  };
  return (
    <Control
      role="group"
      aria-label={`Zoom for ${stop.name}`}
      style={{left: Math.max(4, Math.min(viewport.width - 264, x + 12)), top: Math.max(4, y - 54)}}
      onPointerDown={stopEvent}
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
      <span>Zoom {camera.zoom.toFixed(1)}</span>
      <button
        type="button"
        aria-label="Decrease stop zoom"
        disabled={camera.zoom <= minZoom}
        onClick={() => change(camera.zoom - 0.5)}
      >
        −
      </button>
      <input
        type="range"
        aria-label={`Zoom for ${stop.name}`}
        min={minZoom}
        max={maxZoom}
        step={0.1}
        value={camera.zoom}
        onChange={event => change(Number(event.target.value))}
      />
      <button
        type="button"
        aria-label="Increase stop zoom"
        disabled={camera.zoom >= maxZoom}
        onClick={() => change(camera.zoom + 0.5)}
      >
        +
      </button>
      <button type="button" aria-label="Close zoom control" onClick={onClose}>
        ×
      </button>
    </Control>
  );
}
