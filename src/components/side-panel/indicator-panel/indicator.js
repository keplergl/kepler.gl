// Copyright (c) 2019 Uber Technologies, Inc.
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

const Score = styled.div`
/*margin: auto;*/
/*background-color: #1a1a1a;*/
font-size: 1.7em;
border-radius : 100%;
/*width: 60px;
height: 60px;*/
/*line-height: 60px;*/
`;

const Style = styled.div`
  align-content: center;
  justify-content: center;
  display: block;
  text-align: center;
  margin: 2px;
  min-width: 85px;
  font-size: .8em;
  background-color: #29323C;
  padding: 10px 5px;
  border-radius: 10%;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  :hover {
    color: #000000;
    background-color: #ffffff;
  }
`;

function IndicatorFactory() {
  const Indicator = ({label, score}) => (
    <Style>
      <Score>{score}</Score>
      {label}
    </Style>
  );

  return Indicator;
}

export default IndicatorFactory;
