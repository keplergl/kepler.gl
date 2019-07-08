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
import {RangeFilter} from '../../filters';

const Score = styled.div`
  font-family: ff-clan-web-pro, 'Helvetica Neue', Helvetica, sans-serif;
  font-size: 1.2em;
  width: 100%;
  /*line-height: 60px;*/
  flex: 20%;
  text-align: center;
  padding: 12px;
  background-color: ${props => props.theme.panelBackground};
  color: ${props => props.theme.labelColor};
`;

const Label = styled.div`
  font-family: ff-clan-web-pro, 'Helvetica Neue', Helvetica, sans-serif;
  font-size: 1.2em;
  flex: 80%;
  padding: 12px;
  background-color: ${props => props.theme.labelColor};
  :before {
    content: ' ';
    display: inline-block;
    border-radius: 100%;
    width: 10px;
    height: 10px;
    border: 2px #767b78 solid;
    margin-right: 10px;
    background-color: white;
  }
`;

const Triangle = styled.div`
  content: ' ';
  display: inline-block;
  float: right;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 19px 0 19px 10px;
  border-color: #18273e #2c3c54 #18273e #c3c9c5;
`;

const Style = styled.button`
  font-family: ff-clan-web-pro, 'Helvetica Neue', Helvetica, sans-serif;
  color: #2c3c54;
  border-width: 0;
  cursor: pointer;
  outline: 0;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: row;
  text-align: left;
  margin: 10px 10px 1px 0px;
  width: 100%;
  font-size: 0.8em;
  font-weight: 600;
  background-color: ${props => props.theme.sidePanelBg};
  :hover {
    //color: #C3C9C5;
    //background-color: #3a4b5e;
    opacity: 0.7;
  }
`;

const StyleMessage = styled.span`
  width: 100px;
  height: auto;
  display: inline-block;
`;
const StyledIndicator = styled.div`
  .selected {
    :before {
      content: ' ';
      display: inline-block;
      border-radius: 100%;
      width: 10px;
      height: 10px;
      margin-right: 10px;
      border: 2px #767b78 solid;
      background-color: #1fbad6;
    }
  }
`;

const StyledRangeFilterContainer = styled.div`
  background-color: #395379;
  padding: 10px;
  margin: 0px 6px 0px 6px;
`;

const StyledResetButton = styled.div`
  background-color: ${props => props.theme.labelColor};
  color: ${props => props.theme.panelBackground};
  font-weight: 400;
  margin-top: 15px;
  padding: 5px;
  width: 30%;
  text-align: center;
  cursor: pointer;

  :hover {
    opacity: 0.7;
  }
`;

function IndicatorFactory() {
  console.error('INDICATOR FACTORY');
  const Indicator = ({
    id,
    label,
    description,
    score,
    selected,
    onConfigChange,
    filter,
    setFilter,
    reset
  }) => (
    <StyledIndicator>
      <Style
        onClick={() => onConfigChange(id)}
        data-tip
        data-for={`${label}_indicator`}
        // className={selected ? "selected" : ""}
      >
        <Label className={selected ? 'selected' : ''}>{label}</Label>
        <Triangle></Triangle>
        <Score>{score}%</Score>
      </Style>
      {description ? (
        <Tooltip id={`${label}_indicator`} place="right" effect="solid">
          <StyleMessage>{description}</StyleMessage>
        </Tooltip>
      ) : null}
      {selected && filter ? (
        <StyledRangeFilterContainer>
          <RangeFilter filter={filter} setFilter={setFilter} />
          <StyledResetButton onClick={reset}>Reset</StyledResetButton>
        </StyledRangeFilterContainer>
      ) : null}
    </StyledIndicator>
  );

  return Indicator;
}

export default IndicatorFactory;
