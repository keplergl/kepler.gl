// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {FC} from 'react';
import {useDraggable} from '@dnd-kit/core';
import {Annotation, AnnotationWithArm} from '@kepler.gl/types';
import {AnnotationKind} from '@kepler.gl/constants';
import {makeMarker, MapViewport, CircleAnnotationMarker} from './annotation-utils';

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
  viewport: MapViewport;
  isEditing: boolean;
  isSelected: boolean;
};

const AnnotationNode: FC<AnnotationNodeProps> = ({annotation, viewport, isEditing}) => {
  const {lineColor, lineWidth} = annotation;
  const marker = makeMarker(annotation, viewport);
  const {kind, x, y, tx, ty} = marker;
  const arrW = 3 + lineWidth * 2;
  const isArm = 'armLength' in annotation;

  const moveHandle = isEditing ? (
    <MoveHandle id={`${annotation.id}:MOVE_POINT`} x={0} y={0} />
  ) : null;

  let body: React.ReactNode = null;

  switch (kind) {
    case AnnotationKind.CIRCLE: {
      const circleMarker = marker as CircleAnnotationMarker;
      body = (
        <>
          <circle r={circleMarker.r} fill="none" stroke={lineColor} strokeWidth={lineWidth} />
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
              transform={isArm ? `rotate(${90 + (annotation as AnnotationWithArm).angle})` : undefined}
              d={`M0,${lineWidth} L${-arrW},${-arrW} L${arrW},${-arrW} Z`}
              stroke="none"
              fill={lineColor}
            />
          ) : null}
          {kind === AnnotationKind.POINT ? (
            <circle r={lineWidth * 1.5} fill={lineColor} stroke="none" />
          ) : null}
          {moveHandle}
        </>
      );
      break;
    default:
      body = moveHandle;
  }

  return (
    <g transform={`translate(${x},${y})`}>
      {body}
    </g>
  );
};

export default AnnotationNode;
