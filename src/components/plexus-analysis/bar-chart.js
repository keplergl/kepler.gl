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
import PropTypes from 'prop-types';

import {scaleLinear} from 'd3-scale';

import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  HorizontalBarSeries,
  makeWidthFlexible,
  LabelSeries,
  ChartLabel
} from 'react-vis';

import './../bottom-widget.scss';

const propTypes = {
  filters: PropTypes.arrayOf(PropTypes.object),
  datasets: PropTypes.object,
  uiState: PropTypes.object,
  visStateActions: PropTypes.object,
  uiStateActions: PropTypes.object,
  sidePanelWidth: PropTypes.number,
  containerW: PropTypes.number
};

export class BarChart extends Component {
  render() {

    const {
      data,
      title
    } = this.props;

    const dataLabels = data.map((d, idx) => ({
      x: d.x,
      y: d.y,
      label: d.x,
      xOffset: 20,
      yOffset: 7,
      style: { fill: '#6A7485' }
    })); 

    const FlexibleXYPlot = makeWidthFlexible(XYPlot);
    const width = 400;

    return (
      <XYPlot
        xDomain={[0.0, 1.0]}
        margin={{left: 100, right: 10, top: 25, bottom: 25}}
        height={160}
        width={width}
        yType="ordinal"
      >
        <XAxis
          orientation={'top'}
          tickValues={[0, 0.5, 1.0]}
          style={{
            ticks: {stroke: '#6A7485'},
            text: {fill: '#6A7485'},
            fontWeight: 100,
            marginBottom: 50,
          }}
        />
        {/* TODO: use props */}
        <YAxis
          style={{
            ticks: {stroke: '#6A7485'},
            color: '#6A7485',
            fontWeight: 100
          }}
        />
        <HorizontalBarSeries data={data} barWidth={0.5} />
        {/* TODO: fix offscreen label close to 1.0 */}
        <LabelSeries
          data={dataLabels}
          labelAnchorX="middle"
          labelAnchorY="text-after-edge"
        />
        {/* TODO: fix off-center bug */}
        {title ? (<ChartLabel text={title} xPercent={0.5} yPercent={0.32}/>) : null }
        
      </XYPlot>
    );
  }
}

const BarChartFactory = () => BarChart;
export default BarChartFactory;
