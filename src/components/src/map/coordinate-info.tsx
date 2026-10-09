// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {preciseRound} from '@kepler.gl/utils';
import {CursorClick} from '../common/icons';
import {StyledLayerName} from './layer-hover-info';

// 6th decimal is worth up to 0.11 m
// https://gis.stackexchange.com/questions/8650/measuring-accuracy-of-latitude-and-longitude
export const MAP_COORDINATE_DECIMAL = 6;
const DECIMAL_Z = 1;

/**
 * Format a `[lng, lat]` pair as `"lat, lng"` at map-popover precision.
 * Returns null when either value is missing or not finite.
 */
export function formatMapCoordinate(coordinate: number[] | null | undefined): string | null {
  if (!coordinate || coordinate.length < 2) {
    return null;
  }
  const lng = Number(coordinate[0]);
  const lat = Number(coordinate[1]);
  if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
    return null;
  }
  return `${preciseRound(lat, MAP_COORDINATE_DECIMAL)}, ${preciseRound(
    lng,
    MAP_COORDINATE_DECIMAL
  )}`;
}

export interface CoordinateInfoProps {
  coordinate: number[];
  zoom: number;
}

const CoordinateInfoFactory = () => {
  const CoordinateInfo: React.FC<CoordinateInfoProps> = ({coordinate, zoom}) => (
    <div className="coordingate-hover-info">
      <StyledLayerName className="map-popover__layer-name">
        <CursorClick height="12px" />
        Coordinate
      </StyledLayerName>
      <table>
        <tbody>
          <tr className="row">
            <td className="row__value">{preciseRound(coordinate[1], MAP_COORDINATE_DECIMAL)},</td>
            <td className="row__value">{preciseRound(coordinate[0], MAP_COORDINATE_DECIMAL)},</td>
            <td className="row__value">{preciseRound(zoom, DECIMAL_Z)}z</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  return CoordinateInfo;
};

export default CoordinateInfoFactory;
