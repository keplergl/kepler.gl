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

import React, {Component, createRef} from 'react';
import PropTypes from 'prop-types';
import {scaleUtc} from 'd3-scale';
import {select} from 'd3-selection';
import {axisBottom} from 'd3-axis';
import {createSelector} from 'reselect';
import styled from 'styled-components';

const TimeSliderContainer = styled.svg`
  pointer-events: none;
  position: absolute;
  top: 0;
  .axis text {
    font-size: 9px;
    fill: ${props => props.theme.textColor};
  }

  .axis line,
  .axis path {
    fill: none;
    stroke: ${props => props.theme.sliderBarBgd};
    shape-rendering: crispEdges;
    stroke-width: 2;
  }

  .axis .domain {
    display: none;
  }

  .value {
    fill: ${props => props.theme.textColor};
    font-size: 10px;

    &.start {
      text-anchor: start;
    }

    &.end {
      text-anchor: end;
    }
  }
`;

const height = 30;

export default class TimeSliderMarker extends Component {
  static propTypes = {
    domain: PropTypes.arrayOf(PropTypes.any).isRequired,
    width: PropTypes.number.isRequired
  };

  componentDidMount() {
    this._updateAxis(this.scaleSelector(this.props));
  }

  componentDidUpdate(prevProps) {
    if (this.scaleSelector(this.props) !== this.scaleSelector(prevProps)) {
      this._updateAxis(this.scaleSelector(this.props));
    }
  }

  xAxis = createRef();

  domainSelector = props => props.domain;
  widthSelector = props => props.width;
  scaleSelector = createSelector(
    this.domainSelector,
    this.widthSelector,
    (domain, width) =>
      Array.isArray(domain)
        ? scaleUtc()
            .domain(domain)
            .range([0, width])
        : null
  );

  _updateAxis(scale) {
    if (!scale) {
      return;
    }
    const xAxis = axisBottom(scale)
      .ticks(4)
      .tickSize(8)
      .tickPadding(6);

    select(this.xAxis.current)
      .call(xAxis);
  }

  render() {
    return (
      <TimeSliderContainer
        className="time-slider-marker"
        width={this.props.width}
        height={height}
      >
        <g className="x axis" ref={this.xAxis} transform="translate(0, 0)" />
      </TimeSliderContainer>
    );
  }
};
