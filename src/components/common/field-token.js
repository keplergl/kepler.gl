// Copyright (c) 2020 Uber Technologies, Inc.
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
import styled from 'styled-components';
import {ALL_FIELD_TYPES} from 'constants/default-settings';

const FieldTokenFactory = () => {
  const FieldTag = styled.div`
    background-color: rgba(${props => props.color}, 0.2);
    border-radius: 2px;
    border: 1px solid rgb(${props => props.color});
    color: rgb(${props => props.color});
    display: inline-block;
    font-size: 10px;
    font-weight: 400;
    padding: 0 5px;
    text-align: center;
    width: 40px;
  `;

  const ORANGE = '248, 194, 28';
  const PINK = '231, 189, 194';
  const PURPLE = '160, 106, 206';
  const BLUE = '140, 210, 205';
  const BLUE2 = '106, 160, 206';
  const BLUE3 = '0, 172, 237';
  const GREEN = '106, 160, 56';
  const RED = '237, 88, 106';

  const fieldTypeDisplay = {
    [ALL_FIELD_TYPES.boolean]: {
      label: 'bool',
      color: PINK
    },
    [ALL_FIELD_TYPES.date]: {
      label: 'date',
      color: PURPLE
    },
    [ALL_FIELD_TYPES.geojson]: {
      label: 'geo',
      color: BLUE2
    },
    [ALL_FIELD_TYPES.integer]: {
      label: 'int',
      color: ORANGE
    },
    [ALL_FIELD_TYPES.real]: {
      label: 'float',
      color: ORANGE
    },
    [ALL_FIELD_TYPES.string]: {
      label: 'string',
      color: BLUE
    },
    [ALL_FIELD_TYPES.timestamp]: {
      label: 'time',
      color: GREEN
    },
    // field pairs
    [ALL_FIELD_TYPES.point]: {
      label: 'point',
      color: BLUE3
    }
  };

  const fieldColors = {
    default: RED
  };
  const FieldToken = ({type}) => (
    <FieldTag
      color={(fieldTypeDisplay[type] && fieldTypeDisplay[type].color) || fieldColors.default}
    >
      {fieldTypeDisplay[type].label}
    </FieldTag>
  );
  return FieldToken;
};

export default FieldTokenFactory;
