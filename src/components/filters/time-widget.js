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
import {
  Button,
  SelectTextBold,
  IconRoundSmall,
  CenterFlexbox
} from 'components/common/styled-components';
import TimeRangeFilter from 'components/filters/time-range-filter';
import {Close, Clock, LineChart, Rocket} from 'components/common/icons';
import AnimationSpeedToggle from './animation-speed-toggle';

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
    padding: 6px ${innerPdSide}px 10px ${innerPdSide}px;
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
          props.hoverColor
            ? props.theme[props.hoverColor]
            : props.theme.textColorHl};
      }
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

export class TimeWidget extends Component {
  state = {
    showSpeedControl: false
  };

  _toggleSpeedControl = () => {
    this.setState({showSpeedControl: !this.state.showSpeedControl});
  };

  fieldSelector = props => props.fields;
  yAxisFieldsSelector = createSelector(
    this.fieldSelector,
    fields => fields.filter(f => f.type === 'integer' || f.type === 'real')
  );

  render() {
    const {
      enlargeFilter,
      filters,
      setFilter,
      setFilterPlot,
      toggleAnimation,
      updateAnimationSpeed,
      width,
      datasets
    } = this.props;

    const enlargedIdx = filters.findIndex(f => f.enlarged);
    const isAnyFilterAnimating = filters.some(f => f.isAnimating);
    const filter = filters[enlargedIdx];

    if (enlargedIdx < 0) {
      return null;
    }

    const {showSpeedControl} = this.state;
    return (
      <WidgetContainer width={width}>
        <div className="bottom-widget--inner">
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
                  fields={this.yAxisFieldsSelector(datasets[filter.dataId])}
                  placement="top"
                  id="selected-time-widget-field"
                  value={filter.yAxis ? filter.yAxis.name : null}
                  onSelect={value => setFilterPlot(enlargedIdx, {yAxis: value})}
                  inputTheme="secondary"
                  placeholder="Y Axis"
                  erasable
                  showToken={false}
                />
              </div>
            </StyledTitle>
            <StyledTitle className="bottom-widget__speed">
              <Button link width="80px" onClick={this._toggleSpeedControl}>
                <CenterFlexbox className="bottom-widget__icon speed">
                  <Rocket height="15px" />
                </CenterFlexbox>
                <div
                  style={{
                    visibility: !showSpeedControl ? 'visible' : 'hidden',
                    display: 'inline-block',
                    width: '27px'
                  }}
                >
                  {filter.speed}x
                </div>
              </Button>
              {showSpeedControl ? (
                <AnimationSpeedToggle
                  onHide={this._toggleSpeedControl}
                  updateAnimationSpeed={speed =>
                    updateAnimationSpeed(enlargedIdx, speed)
                  }
                  speed={filter.speed}
                />
              ) : null}
            </StyledTitle>
            <CenterFlexbox>
              <IconRoundSmall>
                <Close
                  height="12px"
                  onClick={() => enlargeFilter(enlargedIdx)}
                />
              </IconRoundSmall>
            </CenterFlexbox>
          </TopSectionWrapper>

          <TimeRangeFilter
            filter={filter}
            setFilter={value => setFilter(enlargedIdx, 'value', value)}
            isAnyFilterAnimating={isAnyFilterAnimating}
            updateAnimationSpeed={speed =>
              updateAnimationSpeed(enlargedIdx, speed)
            }
            toggleAnimation={() => toggleAnimation(enlargedIdx)}
          />
        </div>
      </WidgetContainer>
    );
  }
}

const TimeWidgetFactory = () => TimeWidget;
export default TimeWidgetFactory;
