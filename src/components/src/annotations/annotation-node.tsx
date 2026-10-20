// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {FC} from 'react';
import {useDraggable} from '@dnd-kit/core';
import {Annotation, AnnotationWithArm, RulerAnnotation} from '@kepler.gl/types';
import {AnnotationKind} from '@kepler.gl/constants';
import {
  makeMarker,
  MapViewport,
  CircleAnnotationMarker,
  RulerAnnotationMarker
} from './annotation-utils';

const HANDLE_RADIUS = 6;

const MoveHandle: FC<{id: string; x: number; y: number}> = ({id, x, y}) => {
  const {attributes, listeners, setNodeRef} = useDraggable({id});
  return (
    <circle
      ref={setNodeRef as any}
      {...listeners}
      {...attributes}
      cx={x}
      cy={y}
      r={HANDLE_RADIUS}
      fill="transparent"
      stroke="rgba(255,255,255,0.6)"
      strokeWidth={1}
      cursor="move"
      style={{pointerEvents: 'all'}}
    />
  );
};

const ResizeHandle: FC<{id: string; x: number; y: number}> = ({id, x, y}) => {
  const {attributes, listeners, setNodeRef} = useDraggable({id});
  return (
    <circle
      ref={setNodeRef as any}
      {...listeners}
      {...attributes}
      cx={x}
      cy={y}
      r={HANDLE_RADIUS}
      fill="transparent"
      stroke="rgba(255,255,255,0.6)"
      strokeWidth={1}
      cursor="ew-resize"
      style={{pointerEvents: 'all'}}
    />
  );
};

export type AnnotationNodeProps = {
  annotation: Annotation;
  opacity?: number;
  viewport: MapViewport;
  isEditing: boolean;
  isSelected: boolean;
};

export type RulerEndpointHandlesProps = {
  annotation: RulerAnnotation;
  opacity?: number;
  viewport: MapViewport;
  isEditing: boolean;
  isSelected: boolean;
};

/**
 * Ruler handles render in a dedicated SVG above midpoint text so even a short
 * ruler remains draggable when its label overlaps an endpoint.
 */
export const RulerEndpointHandles: FC<RulerEndpointHandlesProps> = ({
  annotation,
  opacity = 1,
  viewport,
  isEditing,
  isSelected
}) => {
  if (!isEditing) return null;
  const marker = makeMarker(annotation, viewport) as RulerAnnotationMarker;
  // Keep both hit targets reachable, including when the endpoints coincide.
  // Dragging still applies its delta to the geographic endpoint, not this offset.
  const length = Math.hypot(marker.ex, marker.ey);
  const offset = Math.max(0, (HANDLE_RADIUS * 2 + 2 - length) / 2);
  const dx = length > 0 ? marker.ex / length : 1;
  const dy = length > 0 ? marker.ey / length : 0;
  const startX = -dx * offset;
  const startY = -dy * offset;
  const endX = marker.ex + dx * offset;
  const endY = marker.ey + dy * offset;
  return (
    <g
      data-annotation-id={annotation.id}
      data-annotation-part="handles"
      transform={`translate(${marker.x},${marker.y})`}
      style={{
        opacity,
        display: opacity === 0 ? 'none' : undefined,
        visibility: opacity === 0 ? 'hidden' : undefined,
        pointerEvents: opacity === 0 ? 'none' : undefined
      }}
    >
      {offset > 0 ? (
        <path
          d={`M${startX},${startY} L0,0 M${marker.ex},${marker.ey} L${endX},${endY}`}
          fill="none"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth={1}
          style={{pointerEvents: 'none'}}
        />
      ) : null}
      <MoveHandle id={`${annotation.id}:MOVE_RULER_START`} x={startX} y={startY} />
      <MoveHandle id={`${annotation.id}:MOVE_RULER_END`} x={endX} y={endY} />
      {isSelected ? (
        <>
          <circle
            cx={startX}
            cy={startY}
            r={HANDLE_RADIUS + 2}
            fill="none"
            stroke="rgba(64,169,255,0.6)"
            strokeWidth={2}
          />
          <circle
            cx={endX}
            cy={endY}
            r={HANDLE_RADIUS + 2}
            fill="none"
            stroke="rgba(64,169,255,0.6)"
            strokeWidth={2}
          />
        </>
      ) : null}
    </g>
  );
};

const AnnotationNode: FC<AnnotationNodeProps> = ({
  annotation,
  opacity = 1,
  viewport,
  isEditing,
  isSelected
}) => {
  const {lineColor, lineWidth} = annotation;
  const marker = makeMarker(annotation, viewport);
  const {kind, x, y, tx, ty} = marker;
  const arrW = 3 + lineWidth * 2;
  const isArm = 'armLength' in annotation;

  const moveHandle = isEditing ? (
    <MoveHandle id={`${annotation.id}:MOVE_POINT`} x={0} y={0} />
  ) : null;

  const selectionHighlight =
    isEditing && isSelected ? (
      <circle r={HANDLE_RADIUS + 2} fill="none" stroke="rgba(64,169,255,0.6)" strokeWidth={2} />
    ) : null;

  let body: React.ReactNode = null;

  switch (kind) {
    case AnnotationKind.CIRCLE: {
      const circleMarker = marker as CircleAnnotationMarker;
      body = (
        <>
          <circle
            r={circleMarker.r}
            fill="none"
            stroke={lineColor}
            strokeWidth={lineWidth}
            {...(isSelected && isEditing ? {strokeDasharray: '6 3'} : {})}
          />
          <path
            d={`M${circleMarker.ax},${circleMarker.ay} L${tx},${ty}`}
            stroke={lineColor}
            strokeWidth={lineWidth}
            fill="none"
            strokeLinecap="round"
          />
          {isEditing ? (
            <>
              {moveHandle}
              {selectionHighlight}
              <ResizeHandle id={`${annotation.id}:RESIZE`} x={circleMarker.r} y={0} />
            </>
          ) : null}
        </>
      );
      break;
    }
    case AnnotationKind.POINT:
    case AnnotationKind.ARROW:
      body = (
        <>
          <path
            d={`M0,0 L${tx},${ty}`}
            stroke={lineColor}
            fill="none"
            strokeWidth={lineWidth}
            strokeLinecap="round"
          />
          {kind === AnnotationKind.ARROW ? (
            <path
              transform={
                isArm ? `rotate(${90 + (annotation as AnnotationWithArm).angle})` : undefined
              }
              d={`M0,${lineWidth} L${-arrW},${-arrW} L${arrW},${-arrW} Z`}
              stroke="none"
              fill={lineColor}
            />
          ) : null}
          {kind === AnnotationKind.POINT ? (
            <circle r={lineWidth * 1.5} fill={lineColor} stroke="none" />
          ) : null}
          {moveHandle}
          {selectionHighlight}
        </>
      );
      break;
    case AnnotationKind.RULER: {
      const rulerMarker = marker as RulerAnnotationMarker;
      body = (
        <path
          d={`M0,0 L${rulerMarker.ex},${rulerMarker.ey}`}
          stroke={lineColor}
          fill="none"
          strokeWidth={lineWidth}
          strokeLinecap="round"
        />
      );
      break;
    }
    default:
      body = (
        <>
          {moveHandle}
          {selectionHighlight}
        </>
      );
  }

  return (
    <g
      data-annotation-id={annotation.id}
      data-annotation-part="shape"
      transform={`translate(${x},${y})`}
      style={{
        opacity,
        display: opacity === 0 ? 'none' : undefined,
        visibility: opacity === 0 ? 'hidden' : undefined,
        pointerEvents: opacity === 0 ? 'none' : undefined
      }}
    >
      {body}
    </g>
  );
};

export default AnnotationNode;
