// Copyright (c) 2021 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React from 'react';
import {preciseRound} from 'utils/data-utils';
import {CursorClick} from 'components/common/icons';
import {StyledLayerName} from './layer-hover-info';

// 6th decimal is worth up to 0.11 m
// https://gis.stackexchange.com/questions/8650/measuring-accuracy-of-latitude-and-longitude
const DECIMAL = 6;
const DECIMAL_Z = 1;

const CoordinateInfoFactory = () => {
  const CoordinateInfo = ({coordinate, zoom}) => (
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
