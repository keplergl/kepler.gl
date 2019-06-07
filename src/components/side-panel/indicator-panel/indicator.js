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

const Score = styled.div`
  /*margin: auto;*/
  /*background-color: #1a1a1a;*/
  font-size: 1.7em;
  border-radius: 100%;
  /*width: 60px;
height: 60px;*/
  /*line-height: 60px;*/
`;
const StyledScore = styled.div`
  display:table-cell;
  width: 25%;
  font-style: bold;
`;
const Label = styled.div``;
const StyledCheckboxContainer = styled.div`
  display:table-cell;
  width: 10%;
  .selected {
    background-color: #ffffff;
  }
`;
const StyledCheckbox = styled.div`
  height: 80%;
  width: 80%;
  border: 1px solid #ffffff;
`;
const StyledLabel = styled.div`
display:table-cell;
  width: 65%;
`;

const StyledIndicator = styled.button`
  color: #ffffff;
  border-width: 0;
  cursor: pointer;
  outline: 0;
  // align-content: center;
  // justify-content: center;
  display: block;
  text-align: left;
  // margin: 2px;
  width: 100%;
  font-size: 1.2em;
  background-color: #29323c;
  padding: 10px 5px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  :hover {
    // color: #000000;
    // background-color: #ffffff;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.3), 0 6px 20px 0 rgba(0, 0, 0, 0.3);
  }
`;

const StyledIndicatorContent = styled.div`
  height: 100%;
  width: 100%;
  display: table;
`;

const StyleMessage = styled.span`
  width: 100px;
  height: auto;
  display: inline-block;
`;
const StyledIndicatorContainer=styled.div`
  padding: 5px 0px;
  // .selected {
  //   background-color: #000000;
  //   color: #ffffff;
  // }
`;
function IndicatorFactory() {
  const Indicator = ({id, label, description, score, selected, onConfigChange}) => (
    <StyledIndicatorContainer>
      <StyledIndicator
        onClick={() => onConfigChange(id)}
        data-tip
        data-for={`${label}_indicator`}
        className={selected ? "selected" : ""}
      >
        <StyledIndicatorContent>
        <StyledCheckboxContainer>
          <StyledCheckbox className={selected ? "selected" : ""}></StyledCheckbox>
        </StyledCheckboxContainer>
        <StyledLabel>{label}</StyledLabel>
        <StyledScore>{score}%</StyledScore>
        {/* <Score>{score}%</Score>
        <Label>{label}</Label> */}
        </StyledIndicatorContent>
      </StyledIndicator>
      {description ? (
        <Tooltip id={`${label}_indicator`} place="right" effect="solid">
          <StyleMessage>{description}</StyleMessage>
        </Tooltip>
      ) : null}
    </StyledIndicatorContainer>
  );

  return Indicator;
}

export default IndicatorFactory;
