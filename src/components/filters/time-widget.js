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

import React, {Component} from 'react';
import styled from 'styled-components';
import {createSelector} from 'reselect';

import {
  SelectTextBold,
  IconRoundSmall,
  CenterFlexbox,
  BottomWidgetInner
} from 'components/common/styled-components';
import {Close, Clock, LineChart} from 'components/common/icons';
import SpeedControlFactory from 'components/common/animation-control/speed-control';
import TimeRangeFilterFactory from 'components/filters/time-range-filter';
import FloatingTimeDisplayFactory from 'components/common/animation-control/floating-time-display';
import FieldSelectorFactory from '../common/field-selector';

const TOP_SECTION_HEIGHT = '36px';

const TimeBottomWidgetInner = styled(BottomWidgetInner)`
  padding: 6px 32px 24px 32px;
`;
const TopSectionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  color: ${props => props.theme.labelColor};
  height: ${TOP_SECTION_HEIGHT};

  .bottom-widget__y-axis {
    flex-grow: 1;
    margin-left: 20px;
  }

  .bottom-widget__field-select {
    width: 160px;
    display: inline-block;

    .item-selector__dropdown {
      background: transparent;
      padding: 4px 10px 4px 4px;
      border-color: transparent;

      :active,
      :focus,
      &.focus,
      &.active {
        background: transparent;
        border-color: transparent;
      }
    }

    .item-selector__dropdown:hover {
      background: transparent;
      border-color: transparent;

      .item-selector__dropdown__value {
        color: ${props =>
          props.hoverColor ? props.theme[props.hoverColor] : props.theme.textColorHl};
      }
    }
  }

  .animation-control__speed-control {
    margin-right: -12px;

    .animation-control__speed-slider {
      right: calc(0% - 48px);
    }
  }
`;

const StyledTitle = styled(CenterFlexbox)`
  flex-grow: 0;
  color: ${props => props.theme.textColor};
  margin-right: 10px;

  .bottom-widget__icon {
    margin-right: 6px;
  }
  .bottom-widget__icon.speed {
    margin-right: 0;
  }
`;

TimeWidgetFactory.deps = [
  SpeedControlFactory,
  TimeRangeFilterFactory,
  FloatingTimeDisplayFactory,
  FieldSelectorFactory
];
function TimeWidgetFactory(SpeedControl, TimeRangeFilter, FloatingTimeDisplay, FieldSelector) {
  class TimeWidget extends Component {
    state = {
      showSpeedControl: false
    };

    fieldSelector = props => props.fields;
    yAxisFieldsSelector = createSelector(this.fieldSelector, fields =>
      fields.filter(f => f.type === 'integer' || f.type === 'real')
    );

    _updateAnimationSpeed = speed => this.props.updateAnimationSpeed(this.props.index, speed);

    _toggleSpeedControl = () => this.setState({showSpeedControl: !this.state.showSpeedControl});

    _setFilterPlotYAxis = value => this.props.setFilterPlot(this.props.index, {yAxis: value});

    _updateAnimationSpeed = speed => this.props.updateAnimationSpeed(this.props.index, speed);

    _toggleAnimation = () => this.props.toggleAnimation(this.props.index);

    _onClose = () => this.props.enlargeFilter(this.props.index);

    render() {
      const {datasets, filter, index, readOnly, setFilter, showTimeDisplay} = this.props;

      const {showSpeedControl} = this.state;
      return (
        <TimeBottomWidgetInner className="bottom-widget--inner">
          <TopSectionWrapper>
            <StyledTitle className="bottom-widget__field">
              <CenterFlexbox className="bottom-widget__icon">
                <Clock height="15px" />
              </CenterFlexbox>
              <SelectTextBold>{filter.name}</SelectTextBold>
            </StyledTitle>
            <StyledTitle className="bottom-widget__y-axis">
              <CenterFlexbox className="bottom-widget__icon">
                <LineChart height="15px" />
              </CenterFlexbox>
              <div className="bottom-widget__field-select">
                <FieldSelector
                  fields={this.yAxisFieldsSelector(datasets[filter.dataId[0]])}
                  placement="top"
                  id="selected-time-widget-field"
                  value={filter.yAxis ? filter.yAxis.name : null}
                  onSelect={this._setFilterPlotYAxis}
                  placeholder="placeholder.yAxis"
                  erasable
                  showToken={false}
                />
              </div>
            </StyledTitle>
            <StyledTitle className="bottom-widget__speed">
              <SpeedControl
                onClick={this._toggleSpeedControl}
                showSpeedControl={showSpeedControl}
                updateAnimationSpeed={this._updateAnimationSpeed}
                speed={filter.speed}
              />
            </StyledTitle>
            {!readOnly ? (
              <CenterFlexbox>
                <IconRoundSmall>
                  <Close height="12px" onClick={this._onClose} />
                </IconRoundSmall>
              </CenterFlexbox>
            ) : null}
          </TopSectionWrapper>
          <TimeRangeFilter
            filter={filter}
            setFilter={value => setFilter(index, 'value', value)}
            toggleAnimation={this._toggleAnimation}
            hideTimeTitle={showTimeDisplay}
            isAnimatable
          />
          {showTimeDisplay ? <FloatingTimeDisplay currentTime={filter.value} /> : null}
        </TimeBottomWidgetInner>
      );
    }
  }
  return TimeWidget;
}

export default TimeWidgetFactory;
