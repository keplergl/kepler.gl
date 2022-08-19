// Copyright (c) 2022 Uber Technologies, Inc.
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

import React, {useMemo} from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import {Minus} from 'components/common/icons';
import {DEFAULT_TIME_FORMAT} from '@kepler.gl/constants';
import {CenterFlexbox} from 'components/common/styled-components';
import {datetimeFormatter} from '@kepler.gl/layers';

const StyledTimeDisplayWrapper = styled.div.attrs({
  className: 'floating-time-display'
})`
  bottom: ${props => `calc(100% + ${props.theme.bottomPanelGap}px)`};
  display: flex;
  position: absolute;
  width: 100%;
  margin-left: -${props => props.theme.bottomInnerPdSide}px;
  justify-content: center;
  pointer-events: none; /* prevent padding from blocking input */
  & > * {
    /* all children should allow input */
    pointer-events: all;
  }
`;

const StyledTimeDisplay = styled.div.attrs(props => ({
  className: classnames('floating-time-display__inner', props.className)
}))`
  background-color: ${props => props.theme.panelBackground};
  border-radius: ${props => props.theme.timeDisplayBorderRadius}px;
  color: ${props => props.theme.titleTextColor};
  display: flex;
  height: ${props => props.theme.timeDisplayHeight}px;
  justify-content: center;
  min-width: ${props => props.theme.timeDisplayMinWidth}px;
  opacity: ${props => props.theme.timeDisplayOpacity};
  padding: ${props => props.theme.timeDisplayPadding};
`;

const StyledTimeDisplayGroups = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
`;

const StyledTimeDisplayRows = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const StyledTimeDisplayTop = styled.div.attrs({
  className: 'animation-control__time-display__top'
})`
  color: ${props => props.theme.textColor};
  display: flex;
  font-size: 12px;
  font-weight: 500;
  justify-content: center;
`;

const StyledTimeDisplayBottom = styled.div.attrs({
  className: 'animation-control__time-display__bottom'
})`
  color: ${props => props.theme.titleTextColor};
  display: flex;
  font-size: 14px;
  font-weight: 500;
  justify-content: center;
`;

const StyledTimeValueGroup = styled.div.attrs({
  className: 'animation-control__time-value-group'
})`
  display: flex;
  flex-direction: column;
`;

const StyledHorizontalBar = styled.div.attrs({
  className: 'animation-control__horizontal-bar'
})`
  margin: 0 12px;
`;

const TimeDivider = () => (
  <StyledHorizontalBar>
    <Minus height="12px" />
  </StyledHorizontalBar>
);

interface TimeDisplayRowProps {
  timeValues?: string[];
}

const TimeDisplayRow = ({timeValues = []}: TimeDisplayRowProps) => (
  <CenterFlexbox>
    <div className="time-value">{timeValues[0]}</div>
    {timeValues[1] ? <TimeDivider /> : null}
    {timeValues[1] ? <div className="time-value">{timeValues[1]}</div> : null}
  </CenterFlexbox>
);

interface FloatingTimeDisplayProps {
  currentTime: number | number[];
  defaultTimeFormat?: string | null;
  timeFormat?: string | null;
  timezone?: string | null;
}

export default function FloatingTimeDisplayFactory() {
  const FloatingTimeDisplay = ({
    currentTime,
    defaultTimeFormat,
    timeFormat,
    timezone
  }: FloatingTimeDisplayProps) => {
    const {displayDate, displayTime} = useMemo(() => {
      const groupTime = Array.isArray(currentTime) ? currentTime : [currentTime];
      const hasUserFormat = typeof timeFormat === 'string';
      const currentFormat = (hasUserFormat ? timeFormat : defaultTimeFormat) || DEFAULT_TIME_FORMAT;
      const dateFunc = datetimeFormatter(timezone);

      if (hasUserFormat) {
        // dont split time if user defined it
        return {
          displayDate: groupTime.map(dateFunc(currentFormat)),
          displayTime: []
        };
      }
      return groupTime.reduce<{displayDate: string[]; displayTime: string[]}>(
        (accu, curr) => {
          const [dateFormat, datetimeFormat] = currentFormat.split(' ');
          const dateString = dateFunc(dateFormat)(curr);
          const timeString = datetimeFormat ? dateFunc(datetimeFormat)(curr) : null;

          if (!accu.displayDate.includes(dateString)) {
            accu.displayDate.push(dateString);
          }
          if (timeString) {
            accu.displayTime.push(timeString);
          }

          return accu;
        },
        {displayDate: [], displayTime: []}
      );
    }, [currentTime, timeFormat, defaultTimeFormat, timezone]);

    const twoGroups = displayDate.length === 2 && displayTime.length === 2;
    const bottomRow = displayTime.length ? displayTime : displayDate.length ? displayDate : null;
    const topRow = displayDate.length && displayTime.length ? displayDate : null;

    return (
      <StyledTimeDisplayWrapper>
        <StyledTimeDisplay className="animation-control__time-display">
          {twoGroups ? (
            <StyledTimeDisplayGroups>
              <StyledTimeValueGroup>
                {/* Time Start */}
                <StyledTimeDisplayTop>{displayDate[0]}</StyledTimeDisplayTop>
                <StyledTimeDisplayBottom>{displayTime[0]}</StyledTimeDisplayBottom>
              </StyledTimeValueGroup>
              <TimeDivider />
              <StyledTimeValueGroup>
                {/* Time End */}
                <StyledTimeDisplayTop>{displayDate[1]}</StyledTimeDisplayTop>
                <StyledTimeDisplayBottom>{displayTime[1]}</StyledTimeDisplayBottom>
              </StyledTimeValueGroup>
            </StyledTimeDisplayGroups>
          ) : (
            <StyledTimeDisplayRows>
              {topRow ? (
                <StyledTimeDisplayTop>
                  <TimeDisplayRow timeValues={topRow} />
                </StyledTimeDisplayTop>
              ) : null}
              {bottomRow ? (
                <StyledTimeDisplayBottom>
                  <TimeDisplayRow timeValues={bottomRow} />
                </StyledTimeDisplayBottom>
              ) : null}
            </StyledTimeDisplayRows>
          )}
        </StyledTimeDisplay>
      </StyledTimeDisplayWrapper>
    );
  };

  return FloatingTimeDisplay;
}
