// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useRef} from 'react';
import styled from 'styled-components';
import type {Viewport} from '@deck.gl/core';
import type {CameraTourStop} from '@kepler.gl/types';
import {cameraForMap} from '@kepler.gl/utils';

const SIZE = 96;
const CENTER = SIZE / 2;
const RADIUS = 36;
const START_ANGLE = 135;
const SWEEP = 270;
const ARC_LENGTH = (SWEEP / 180) * Math.PI * RADIUS;
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const pointOnArc = (angle: number) => [
  CENTER + RADIUS * Math.cos((angle * Math.PI) / 180),
  CENTER + RADIUS * Math.sin((angle * Math.PI) / 180)
];
const start = pointOnArc(START_ANGLE);
const end = pointOnArc(START_ANGLE + SWEEP);
const ARC_PATH = `M ${start[0]} ${start[1]} A ${RADIUS} ${RADIUS} 0 1 1 ${end[0]} ${end[1]}`;

const Control = styled.div`
  position: absolute;
  z-index: 2;
  width: ${SIZE}px;
  height: ${SIZE}px;
  color: ${props => props.theme.textColor || '#fff'};
  pointer-events: none;
  font-size: 12px;

  svg {
    display: block;
    overflow: visible;
    touch-action: none;
    outline: none;
  }
  .zoom-arc-hit-area {
    pointer-events: stroke;
    cursor: grab;
  }
  .zoom-arc-track {
    stroke: ${props => props.theme.panelBackground || '#18202a'};
  }
  .zoom-arc-value {
    stroke: ${props => props.theme.activeColor || '#1fbad6'};
  }
  .zoom-arc-handle {
    pointer-events: all;
    cursor: grab;
    fill: ${props => props.theme.activeColor || '#1fbad6'};
    stroke: ${props => props.theme.panelBackground || '#18202a'};
  }
  svg:active .zoom-arc-handle,
  svg:active .zoom-arc-hit-area {
    cursor: grabbing;
  }
  svg:focus-visible .zoom-arc-handle {
    stroke: ${props => props.theme.textColor || '#fff'};
    stroke-width: 3px;
  }
  .zoom-arc-label {
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
  const drag = useRef<{pointerId: number; angle: number; previousAngle: number} | null>(null);
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
  const [handleX, handleY] = pointOnArc(START_ANGLE + progress * SWEEP);
  const change = (value: number) => {
    if (Number.isFinite(value)) onChange(clamp(Math.round(value * 10) / 10, minZoom, maxZoom));
  };
  const pointerAngle = (event: React.PointerEvent<SVGSVGElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    return (
      (Math.atan2(
        event.clientY - bounds.top - bounds.height / 2,
        event.clientX - bounds.left - bounds.width / 2
      ) *
        180) /
      Math.PI
    );
  };
  const changeAngle = (angle: number) => change(minZoom + (angle / SWEEP) * (maxZoom - minZoom));
  const endDrag = (event: React.PointerEvent<SVGSVGElement>) => {
    if (drag.current?.pointerId !== event.pointerId) return;
    drag.current = null;
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };
  return (
    <Control
      role="group"
      aria-label={`Zoom for ${stop.name}`}
      style={{left: x - CENTER, top: y - CENTER}}
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
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        role="slider"
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
          if (event.button !== 0 || event.isPrimary === false || drag.current) return;
          event.preventDefault();
          event.currentTarget.focus();
          event.currentTarget.setPointerCapture(event.pointerId);
          const previousAngle = pointerAngle(event);
          const offset = (previousAngle - START_ANGLE + 360) % 360;
          const angle = offset > SWEEP ? (offset > (SWEEP + 360) / 2 ? 0 : SWEEP) : offset;
          drag.current = {pointerId: event.pointerId, previousAngle, angle};
          changeAngle(angle);
        }}
        onPointerMove={event => {
          const active = drag.current;
          if (!active || active.pointerId !== event.pointerId) return;
          const angle = pointerAngle(event);
          // Unwrap the angle so dragging through the gap clamps instead of jumping to the other end.
          const delta = ((angle - active.previousAngle + 540) % 360) - 180;
          active.angle = clamp(active.angle + delta, 0, SWEEP);
          active.previousAngle = angle;
          changeAngle(active.angle);
        }}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onLostPointerCapture={() => {
          drag.current = null;
        }}
      >
        <title>Drag the arc to adjust zoom, or use the arrow keys</title>
        <path
          className="zoom-arc-track"
          d={ARC_PATH}
          fill="none"
          strokeWidth={8}
          strokeLinecap="round"
        />
        <path
          className="zoom-arc-value"
          d={ARC_PATH}
          fill="none"
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={`${progress * ARC_LENGTH} ${ARC_LENGTH}`}
        />
        <path
          className="zoom-arc-hit-area"
          d={ARC_PATH}
          fill="none"
          stroke="transparent"
          strokeWidth={20}
        />
        <circle className="zoom-arc-handle" cx={handleX} cy={handleY} r={6} strokeWidth={2} />
      </svg>
      <span
        className="zoom-arc-label"
        style={{
          left: clamp(x, 40, viewport.width - 40) - x + CENTER,
          top: clamp(y + 30, 4, viewport.height - 24) - y + CENTER
        }}
      >
        Zoom {zoom.toFixed(1)}
      </span>
      <button
        type="button"
        aria-label="Close zoom control"
        style={{
          left: clamp(x + 26, 4, viewport.width - 28) - x + CENTER,
          top: clamp(y - 50, 4, viewport.height - 28) - y + CENTER
        }}
        onClick={onClose}
      >
        ×
      </button>
    </Control>
  );
}
