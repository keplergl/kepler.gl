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

import React, {Component} from 'react';
import styled from 'styled-components';
import {createSelector} from 'reselect';

import FieldSelector from 'components/common/field-selector';
import {SelectTextBold, IconRoundSmall, CenterFlexbox} from 'components/common/styled-components';
import TimeRangeFilter from 'components/filters/time-range-filter';
import {Close, Clock, LineChart} from 'components/common/icons';
import {TIME_ANIMATION_SPEED} from 'utils/filter-utils';
const innerPdSide = 32;

const WidgetContainer = styled.div`
  position: absolute;
  padding-top: ${props => props.theme.sidePanel.margin.top}px;
  padding-right: ${props => props.theme.sidePanel.margin.right}px;
  padding-bottom: ${props => props.theme.sidePanel.margin.bottom}px;
  padding-left: ${props => props.theme.sidePanel.margin.left}px;  
  bottom: 0;
  right: 0;
  z-index: 1;
  width: ${props => props.width}px;

  .bottom-widget--inner {
    background-color: ${props => props.theme.sidePanelBg};
    padding: 10px ${innerPdSide}px;
    position: relative;
  }
`;

const TopSectionWrapper = styled.div`
  position: absolute;
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding-right: ${innerPdSide * 2}px;
  color: ${props => props.theme.labelColor};
  
  .bottom-widget__y-axis {
    flex-grow: 1;
    margin-left: 20px;
  }
  
  .bottom-widget__field-select {
    width: 160px;
    display: inline-block;
  }
`;

/* eslint-disable no-unused-vars */
const Tabs = styled.div`
  padding-right: 76px;
`;

const Tab = styled.div`
  border-bottom: 1px solid
    ${props => (props.active ? props.theme.textColorHl : 'transparent')};
  color: ${props =>
  props.active ? props.theme.textColorHl : props.theme.labelColor};
  display: inline-block;
  font-size: 12px;
  height: 24px;
  margin-right: 4px;
  text-align: center;
  width: 24px;
  line-height: 24px;
  
  :hover {
    cursor: pointer;
  }
`;
/* eslint-enable no-unused-vars */

const StyledTitle = styled(CenterFlexbox)`
  flex-grow: 0;
  color: ${props => props.theme.textColor};

  .bottom-widget__icon {
    margin-right: 6px;
  }
`;

const AnimationSpeedToggle = ({updateAnimationSpeed, speed}) => (
  <Tabs>
    {TIME_ANIMATION_SPEED.map(({label, value}) => (
      <Tab key={value} active={value === speed}
        onClick={() => updateAnimationSpeed(value)}>{label}</Tab>
    ))}
  </Tabs>
);

export class TimeWidget extends Component {
  fieldSelector = props => props.fields;
  yAxisFieldsSelector = createSelector(this.fieldSelector, fields =>
    fields.filter(f => f.type === 'integer' || f.type === 'real')
  );

  render() {
    const {
      enlargedIdx,
      enlargeFilter,
      filter,
      isAnyFilterAnimating,
      setFilter,
      setFilterPlot,
      toggleAnimation,
      updateAnimationSpeed,
      width
    } = this.props;

    return (
      <WidgetContainer width={width}>
        <div className="bottom-widget--inner">
          <TopSectionWrapper>
            <StyledTitle className="bottom-widget__field">
              <CenterFlexbox className="bottom-widget__icon">
                <Clock height="15px"/>
              </CenterFlexbox>
              <SelectTextBold>{filter.name}</SelectTextBold>
            </StyledTitle>
            <StyledTitle className="bottom-widget__y-axis">
              <CenterFlexbox className="bottom-widget__icon">
                <LineChart height="15px"/>
              </CenterFlexbox>
              <div className="bottom-widget__field-select">
                <FieldSelector
                  fields={this.yAxisFieldsSelector(this.props)}
                  placement="top"
                  id="selected-time-widget-field"
                  value={filter.yAxis ? filter.yAxis.name : null}
                  onSelect={value => setFilterPlot(enlargedIdx, {yAxis: value})}
                  inputTheme="secondary"
                  placeholder="Select Y Axis"
                  erasable
                  showToken={false}
                />
              </div>
            </StyledTitle>
            <AnimationSpeedToggle
              updateAnimationSpeed={(speed) => updateAnimationSpeed(enlargedIdx, speed)}
              speed={filter.speed}/>
            <IconRoundSmall>
              <Close height="12px" onClick={() => enlargeFilter(enlargedIdx)} />
            </IconRoundSmall>
          </TopSectionWrapper>
          <TimeRangeFilter
            filter={filter}
            setFilter={value => setFilter(enlargedIdx, 'value', value)}
            isAnyFilterAnimating={isAnyFilterAnimating}
            updateAnimationSpeed={(speed) => updateAnimationSpeed(enlargedIdx, speed)}
            toggleAnimation={() => toggleAnimation(enlargedIdx)}
          />
        </div>
      </WidgetContainer>
    );
  }
}

const TimeWidgetFactory = () => TimeWidget;
export default TimeWidgetFactory;
