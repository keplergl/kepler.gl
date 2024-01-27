// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {preciseRound} from '@kepler.gl/utils';
import {CursorClick} from '../common/icons';
import {StyledLayerName} from './layer-hover-info';

// 6th decimal is worth up to 0.11 m
// https://gis.stackexchange.com/questions/8650/measuring-accuracy-of-latitude-and-longitude
const DECIMAL = 6;
const DECIMAL_Z = 1;

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
            <td className="row__value">{preciseRound(coordinate[1], DECIMAL)},</td>
            <td className="row__value">{preciseRound(coordinate[0], DECIMAL)},</td>
            <td className="row__value">{preciseRound(zoom, DECIMAL_Z)}z</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  return CoordinateInfo;
};

export default CoordinateInfoFactory;
