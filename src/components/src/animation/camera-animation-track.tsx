// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import type {CameraTour, CameraTourStop} from '@kepler.gl/types';
import {Button} from '../common/styled-components';
import AnimationBlock from './animation-block';

export type CameraSegment = {
  stop: CameraTourStop;
  field: 'holdDurationMs' | 'travelDurationMs';
  index: number;
  label: string;
  startTimeMs: number;
  endTimeMs: number;
};

/** Holds and outgoing moves share boundaries; the last stop has only a hold. */
export function getCameraSegments(tour: CameraTour): CameraSegment[] {
  let time = 0;
  return tour.stops.flatMap((stop, index) => {
    const hold: CameraSegment = {
      stop,
      index,
      field: 'holdDurationMs',
      label: `Hold at ${stop.name}`,
      startTimeMs: time,
      endTimeMs: time + stop.holdDurationMs
    };
    time = hold.endTimeMs;
    const next = tour.stops[index + 1];
    if (!next) return [hold];
    const move: CameraSegment = {
      stop,
      index,
      field: 'travelDurationMs',
      label: `Move ${stop.name} → ${next.name}`,
      startTimeMs: time,
      endTimeMs: time + stop.travelDurationMs
    };
    time = move.endTimeMs;
    return [hold, move];
  });
}

const Route = styled.div<{$muted: boolean}>`
  position: relative;
  min-height: 50px;
  opacity: ${props => (props.$muted ? 0.45 : 1)};
`;
const Intervals = styled.div`
  position: absolute;
  top: 16px;
  left: 0;
  right: 0;
  height: 32px;
`;
const Markers = styled.div<{$position: number}>`
  position: absolute;
  left: ${props => props.$position}%;
  transform: translateX(-${props => props.$position}%);
  top: 1px;
  display: flex;
  z-index: 5;
`;
const Marker = styled(Button).attrs({link: true})<{$selected: boolean}>`
  min-width: 16px;
  height: 16px;
  padding: 0 3px;
  margin: 0;
  font-size: 10px;
  line-height: 14px;
  border: 1px solid
    ${props => (props.$selected ? props.theme.activeColor : props.theme.panelBorderColor)};
  border-radius: 8px;
  color: ${props => props.theme.textColor};
  background: ${props =>
    props.$selected ? props.theme.panelContentBackground : props.theme.panelBackground};
  &:focus-visible {
    outline: 2px solid ${props => props.theme.activeColor};
  }
`;

export default function CameraAnimationTrack({
  tour,
  durationMs,
  enabled,
  selected,
  onSelect,
  onSeek,
  onOpen,
  onChange,
  onDragStart
}: {
  tour: CameraTour;
  durationMs: number;
  enabled: boolean;
  selected?: {stopId: string; field: CameraSegment['field']};
  onSelect: (segment: CameraSegment) => void;
  onSeek: (segment: CameraSegment) => void;
  onOpen: (segment: CameraSegment, anchor: HTMLElement) => void;
  onChange?: (segment: CameraSegment, duration: number) => void;
  onDragStart: () => void;
}) {
  const [draft, setDraft] = useState<{
    stopId: string;
    field: CameraSegment['field'];
    duration: number;
  } | null>(null);
  useEffect(() => setDraft(null), [tour]);
  const source = getCameraSegments(tour);
  const total = source.at(-1)?.endTimeMs ?? 0;
  const displayed = draft
    ? getCameraSegments({
        stops: tour.stops.map(stop =>
          stop.id === draft.stopId ? {...stop, [draft.field]: draft.duration} : stop
        )
      })
    : source;
  const arrivals = new Map<number, CameraSegment[]>();
  for (const segment of displayed) {
    if (segment.field !== 'holdDurationMs') continue;
    const group = arrivals.get(segment.startTimeMs) ?? [];
    group.push(segment);
    arrivals.set(segment.startTimeMs, group);
  }
  return (
    <Route $muted={!enabled}>
      <Intervals>
        {displayed.map((segment, index) => (
          <AnimationBlock
            key={`${segment.stop.id}-${segment.field}`}
            label={segment.field === 'holdDurationMs' ? 'Hold' : `Move → ${segment.index + 2}`}
            ariaLabel={segment.label}
            kind={segment.field === 'holdDurationMs' ? 'camera-hold' : 'camera'}
            editMode="duration"
            startTimeMs={segment.startTimeMs}
            endTimeMs={segment.endTimeMs}
            durationMs={durationMs}
            maxTimeMs={durationMs - (total - source[index].endTimeMs)}
            selected={selected?.stopId === segment.stop.id && selected.field === segment.field}
            disabled={!onChange}
            onSelect={() => onSelect(segment)}
            onOpen={anchor => onOpen(segment, anchor)}
            onDragStart={onDragStart}
            onPreview={range =>
              setDraft(
                range
                  ? {stopId: segment.stop.id, field: segment.field, duration: range[1] - range[0]}
                  : null
              )
            }
            onChange={(start, end) => onChange?.(segment, end - start)}
          />
        ))}
      </Intervals>
      {[...arrivals].map(([time, segments]) => (
        <Markers key={time} $position={Math.min(100, (time / durationMs) * 100)}>
          {segments.map(segment => (
            <Marker
              key={segment.stop.id}
              type="button"
              aria-label={`Camera stop ${segment.index + 1}: ${segment.stop.name}`}
              aria-pressed={selected?.stopId === segment.stop.id}
              $selected={selected?.stopId === segment.stop.id}
              title={`${segment.stop.name} · Arrival ${
                Math.round(time / 10) / 100
              } s · Double-click for hold settings`}
              onClick={() => {
                onSelect(segment);
                onSeek(segment);
              }}
              onDoubleClick={event => onOpen(segment, event.currentTarget)}
            >
              {segment.index + 1}
            </Marker>
          ))}
        </Markers>
      ))}
    </Route>
  );
}
