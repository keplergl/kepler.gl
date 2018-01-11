import React, {Component} from 'react';
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
    stroke: ${props => props.theme.panelBorderColor};
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

const propTypes = {
  domain: React.PropTypes.array.isRequired,
  width: React.PropTypes.number.isRequired
};

const height = 30;

export default class TimeSliderMarker extends Component {
  componentDidMount() {
    this._updateAxis(this.scaleSelector(this.props));
  }

  componentWillReceiveProps(nextProps) {
    if (this.scaleSelector(this.props) !== this.scaleSelector(nextProps)) {
      this._updateAxis(this.scaleSelector(nextProps));
    }
  }

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
      .ticks(6)
      .tickSize(10)
      .tickPadding(6);

    const svg = select(this.svgContainer);

    svg
      .select('.x.axis')
      .call(xAxis)
      .selectAll('text');
  }

  render() {
    return (
      <TimeSliderContainer
        className="time-slider-marker"
        width={this.props.width}
        height={height}
        innerRef={comp => {
          this.svgContainer = comp;
        }}
      >
        <g className="x axis" transform="translate(0, 0)"/>
      </TimeSliderContainer>
    );
  }
}

TimeSliderMarker.propTypes = propTypes;
