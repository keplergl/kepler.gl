// Copyright (c) 2023 Uber Technologies, Inc.
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
import {FIELD_TYPE_DISPLAY, FIELD_COLORS} from '@kepler.gl/constants';

export type FieldTokenProps = {
  type: string;
};

function FieldTokenFactory(
  fieldTypeDisplay: ReturnType<typeof getFieldTypes>,
  fieldColors: ReturnType<typeof getFieldColors>
): React.FC<FieldTokenProps> {
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
    width: ${props => props.theme.fieldTokenWidth}px;
    line-height: ${props => props.theme.fieldTokenHeight}px;
  `;

  const FieldToken = ({type}: FieldTokenProps) => (
    <FieldTag
      color={(fieldTypeDisplay[type] && fieldTypeDisplay[type].color) || fieldColors.default}
    >
      {fieldTypeDisplay[type].label}
    </FieldTag>
  );
  return FieldToken;
}

function getFieldTypes() {
  return FIELD_TYPE_DISPLAY;
}

function getFieldColors() {
  return FIELD_COLORS;
}
FieldTokenFactory.deps = [getFieldTypes, getFieldColors];
export default FieldTokenFactory;
