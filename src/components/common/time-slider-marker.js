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

import React, {useRef, useEffect, useMemo} from 'react';
import PropTypes from 'prop-types';
import {scaleUtc} from 'd3-scale';
import {select} from 'd3-selection';
import {axisBottom} from 'd3-axis';
import styled from 'styled-components';

const MIN_TICK_WIDTH_LARGE = 80;
const MIN_TICK_WIDTH_SMALL = 50;
const HEIGHT = 30;

const TimeSliderContainer = styled.svg`
  pointer-events: none;
  position: absolute;
  top: 0;
  overflow: visible;

  .axis text {
    font-size: ${props => props.theme.axisFontSize};
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
    font-size: ${props => props.theme.axisFontSize};

    &.start {
      text-anchor: start;
    }

    &.end {
      text-anchor: end;
    }
  }
`;

function TimeSliderMarkerFactory() {
  function updateAxis(scale, width, xAxisRef, isEnlarged) {
    if (!scale) {
      return;
    }

    // TODO: pass in ticks if interval is defined
    const ticks = Math.floor(width / (isEnlarged ? MIN_TICK_WIDTH_LARGE : MIN_TICK_WIDTH_SMALL));

    const xAxis = axisBottom(scale)
      .ticks(ticks)
      .tickSize(0)
      .tickPadding(12);

    select(xAxisRef.current).call(xAxis);
  }

  const TimeSliderMarker = ({width, domain, isEnlarged = true, height = HEIGHT}) => {
    const xAxisRef = useRef();
    const scale = useMemo(
      () =>
        Array.isArray(domain)
          ? scaleUtc()
              .domain(domain)
              .range([0, width])
          : null,
      [domain, width]
    );

    useEffect(() => {
      updateAxis(scale, width, xAxisRef, isEnlarged);
    }, [scale, width, xAxisRef, isEnlarged]);
    return (
      <TimeSliderContainer className="time-slider-marker" width={width} height={height}>
        <g className="x axis" ref={xAxisRef} transform="translate(0, 0)" />
      </TimeSliderContainer>
    );
  };

  TimeSliderMarker.propTypes = {
    domain: PropTypes.arrayOf(PropTypes.any).isRequired,
    width: PropTypes.number.isRequired
  };

  return TimeSliderMarker;
}

export default TimeSliderMarkerFactory;
