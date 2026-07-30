// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import distance from '@turf/distance';
import {range} from 'd3-array';
import React, {FC, useCallback, useContext, useState} from 'react';
import styled from 'styled-components';
import {WebMercatorViewport} from 'viewport-mercator-project';

import {MapViewStateContext, MapViewStateContextType} from '../map-view-state-context';
import {getViewportFromMapState, getApplicationConfig} from '@kepler.gl/utils';
import {MapState} from '@kepler.gl/types';

export type MapScaleProps = {
  mapState: MapState;
  mapIndex?: number;
};

type Unit = {
  label: string;
  meters: number;
};

const DISPLAY_UNITS: Record<'km' | 'miles', Unit[]> = {
  km: [
    {label: 'm', meters: 1},
    {label: 'km', meters: 1000}
  ],
  miles: [
    {label: 'ft', meters: 0.3048},
    {label: 'mi', meters: 1609.34}
  ]
};

// Pre-generated list of "round" numbers: 1, 2, 5, 10, 20, 50, 100, ...
const NICE_VALUES = range(15).flatMap(p => [1, 2, 5].map(n => n * Math.pow(10, p)));

function findLast<T>(array: T[], predicate: (item: T) => boolean): T | undefined {
  for (let i = array.length - 1; i >= 0; i--) {
    if (predicate(array[i])) {
      return array[i];
    }
  }
  return undefined;
}

const DISTANCE_PREFERENCE_KEY = 'keplergl_distancePreference';

function getStoredDistancePreference(): 'km' | 'miles' {
  try {
    const stored = window.localStorage.getItem(DISTANCE_PREFERENCE_KEY);
    if (stored === 'km' || stored === 'miles') return stored;
  } catch {
    // localStorage unavailable (e.g. SSR)
  }
  return 'km';
}

function setStoredDistancePreference(value: 'km' | 'miles'): void {
  try {
    window.localStorage.setItem(DISTANCE_PREFERENCE_KEY, value);
  } catch {
    // localStorage unavailable
  }
}

const StyledMapScale = styled.div`
  display: flex;
  flex-direction: row;
  cursor: pointer;
  padding: 0 1px 2px 1px;
  border-radius: 3px;
  border: 1px solid ${props => props.theme.borderColor};
  background-color: ${props => props.theme.sidePanelBg}cc;
  user-select: none;
  svg {
    text {
      fill: ${props => props.theme.textColorHl};
      font-size: 10px;
    }
    path {
      stroke: ${props => props.theme.textColorHl};
    }
  }
`;

interface ScaleProps {
  metersPerPixel: number;
  maxWidth?: number;
  height?: number;
  displayUnits?: 'km' | 'miles';
}

const Scale: FC<ScaleProps> = ({
  metersPerPixel,
  maxWidth = 150,
  height: h = 15,
  displayUnits = 'km'
}) => {
  const maxMetersContainer = maxWidth * metersPerPixel;
  const unit = findLast(
    DISPLAY_UNITS[displayUnits],
    u => u.meters * NICE_VALUES[0] <= maxMetersContainer
  );
  if (!unit) return null;

  const niceValue = findLast(NICE_VALUES, v => v * unit.meters <= maxMetersContainer);
  if (!niceValue) return null;

  const niceValuePixels = (niceValue * unit.meters) / metersPerPixel;
  const x1 = Math.round((maxWidth - niceValuePixels) / 2);
  const x2 = maxWidth - x1;
  const w = x2 - x1 + 1;
  const dx = (maxWidth - w) / 2;

  return (
    <svg width={w} height={h}>
      <g>
        <text textAnchor="middle" x={w / 2} y={h - 3}>
          {niceValue} {unit.label}
        </text>
        <path
          d={`M ${-dx + x1 + 0.5} ${h / 2}
              L ${-dx + x1 + 0.5} ${h}
              L ${-dx + x2 - 0.5} ${h}
              L ${-dx + x2 - 0.5} ${h / 2}`}
          fill="none"
        />
      </g>
    </svg>
  );
};

// Reference ruler width in pixels used to sample real-world distance
const RULER_SIZE = 100;

MapScaleFactory.deps = [];

export default function MapScaleFactory() {
  const MapScale: FC<MapScaleProps> = ({mapState, mapIndex = 0}) => {
    const {getInternalViewState} = useContext<MapViewStateContextType>(MapViewStateContext);
    const viewState = getInternalViewState(mapIndex);

    const [displayUnits, setDisplayUnits] = useState<'km' | 'miles'>(
      getStoredDistancePreference
    );

    const handleClick = useCallback(() => {
      setDisplayUnits(prev => {
        const next = prev === 'km' ? 'miles' : 'km';
        setStoredDistancePreference(next);
        return next;
      });
    }, []);

    if (!getApplicationConfig().enableMapScale) return null;

    const mergedState = {...mapState, ...viewState};
    const viewport = getViewportFromMapState(mergedState as MapState) as WebMercatorViewport;

    const cx = (mapState.width || 0) / 2;
    const cy = (mapState.height || 0) / 2;
    const p1 = viewport.unproject([cx - RULER_SIZE / 2, cy]);
    const p2 = viewport.unproject([cx + RULER_SIZE / 2, cy]);

    // unproject can return null in some edge cases (e.g. during globe projection)
    if (!p1 || !p2) return null;

    const metersPerPixel = distance(p1 as [number, number], p2 as [number, number], {units: 'meters'}) / RULER_SIZE;

    if (!isFinite(metersPerPixel) || metersPerPixel <= 0) return null;

    return (
      <StyledMapScale className="map-scale" onClick={handleClick}>
        <Scale metersPerPixel={metersPerPixel} displayUnits={displayUnits} />
      </StyledMapScale>
    );
  };

  MapScale.displayName = 'MapScale';
  return React.memo(MapScale);
}
