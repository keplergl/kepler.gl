// Copyright (c) 2018 Uber Technologies, Inc.
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

import {
  FILED_TYPE_DISPLAY,
  FIELD_COLORS
} from '../../constants/default-settings';

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

const FieldToken = ({type}) => (
  <FieldTag
    color={
      (FILED_TYPE_DISPLAY[type] && FILED_TYPE_DISPLAY[type].color) ||
      FIELD_COLORS.default
    }
  >
    {FILED_TYPE_DISPLAY[type].label}
  </FieldTag>
);

export default FieldToken;
