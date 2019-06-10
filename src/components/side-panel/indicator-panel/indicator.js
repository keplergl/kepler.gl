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
import {Tooltip} from 'components/common/styled-components';
import { RangeFilter } from '../../filters';

const Score = styled.div`
  font-family: ff-clan-web-pro, 'Helvetica Neue', Helvetica, sans-serif;
  margin-right:10px;
  /*margin: auto;*/
  /*background-color: #1a1a1a;*/
  font-size: 1.3em;
  /*width: 60px;
  height: 100px;
  /*line-height: 60px;*/
  flex:20%;
  text-align:center;
  background-color:#23282E;
  padding:5px;
`;

const Label = styled.div`
  font-family: ff-clan-web-pro, 'Helvetica Neue', Helvetica, sans-serif;
  font-size: 1.3em;
  margin: 0 10px 0 10px;
  flex:80%;
  padding:5px;
`;

const Style = styled.button`
  font-family: ff-clan-web-pro, 'Helvetica Neue', Helvetica, sans-serif;
  color: #ffffff;
  border-width: 0;
  cursor: pointer;
  outline: 0;
  // align-content: center;
  // justify-content: center;
  display: flex;
  flex-direction:row;
  text-align: left;
  margin: 10px;
  //min-width: 85px;
  width:95%;
  font-size: 0.8em;
  background-color: #29323c;
  padding: 10px 5px;
  //border-radius: 10%;
  //box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  :hover {
    // color: #000000;
    background-color: #3a4b5e;
  }
`;

const StyleMessage = styled.span`
  width: 100px;
  height: auto;
  display: inline-block;
`;
const StyledIndicator=styled.div`
  .selected {
    background-color: #476587;
    color: #ffffff;
  }
`;
function IndicatorFactory() {
  const Indicator = ({id, label, description, score, selected, onConfigChange, filter, setFilter}) => (
    <StyledIndicator>
      <Style
        onClick={() => onConfigChange(id)}
        data-tip
        data-for={`${label}_indicator`}
        className={selected ? "selected" : ""}
      >
        <Label>{label}</Label>
        <Score>{score}%</Score>
      </Style>
      {description ? (
        <Tooltip id={`${label}_indicator`} place="right" effect="solid">
          <StyleMessage>{description}</StyleMessage>
        </Tooltip>
      ) : null}
      {selected?<RangeFilter
                filter={filter}
                setFilter={setFilter}
                />:null}
    </StyledIndicator>
  );

  return Indicator;
}

export default IndicatorFactory;