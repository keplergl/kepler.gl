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
import styled from 'styled-components';
import {Minus} from 'components/common/icons';
import {datetimeFormatter} from 'utils/data-utils';

const TimeValueWrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: ${props => props.theme.timeTitleFontSize};
  justify-content: ${props => (props.isEnlarged ? 'center' : 'space-between')};

  .horizontal-bar {
    padding: 0 12px;
    color: ${props => props.theme.textColor};
  }

  .time-value {
    display: flex;
    flex-direction: ${props => (props.isEnlarged ? 'row' : 'column')};
    align-items: flex-start;
    max-width: ${props => (!props.isEnlarged ? '40%' : 'auto')};
    span {
      color: ${props => props.theme.textColor};
    }
  }

  .time-value:last-child {
    align-items: flex-end;
    text-align: right;
  }
`;

const TimeValue = ({value}) => (
  // render two lines if not enlarged
  <div className="time-value">
    <span>{value}</span>
  </div>
);

function TimeRangeSliderTimeTitleFactory() {
  const TimeTitle = ({value, isEnlarged, timezone, timeFormat}) => (
    <TimeValueWrapper isEnlarged={isEnlarged} className="time-range-slider__time-title">
      <TimeValue key={0} value={datetimeFormatter(timezone)(timeFormat)(value[0])} />
      {isEnlarged ? (
        <div className="horizontal-bar">
          <Minus height="12px" />
        </div>
      ) : null}
      <TimeValue key={1} value={datetimeFormatter(timezone)(timeFormat)(value[1])} />
    </TimeValueWrapper>
  );

  return TimeTitle;
}

export default TimeRangeSliderTimeTitleFactory;
